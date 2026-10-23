// KARAT — génération vidéo avec Gemini Omni, en arrière-plan (Netlify « background » : jusqu'à 15 minutes).
// video.js enregistre la demande (statut « queued ») puis appelle cette fonction avec l'e-mail et l'identifiant.
// Elle ne lit jamais la demande elle-même : elle prend le prompt, le format et l'image d'exemple
// dans l'enregistrement fait côté serveur. Sans demande « queued » correspondante, elle ne fait rien.
// Variables : GOOGLE_API_KEY (clé Google AI Studio avec accès à Gemini Omni), OMNI_MODEL (facultatif).

const { cleanEmail } = require("./_shared/acces");
const { blobStore, safeName, jobKey, refKey, refundOnce } = require("./_shared/videojob");

const GOOGLE = "https://generativelanguage.googleapis.com/v1beta/";
// Gemini Omni remplace Veo 3.1 (préversions arrêtées le 22 octobre 2026). Modifiable avec OMNI_MODEL.
const OMNI_MODEL = /^[\w.-]{3,80}$/.test(process.env.OMNI_MODEL || "") ? process.env.OMNI_MODEL : "gemini-omni-1.1-flash";
const OMNI_ID = /^omni:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Fichier renvoyé par adresse (au lieu de données directes) : on attend qu'il soit ACTIVE, puis on le télécharge
async function downloadFile(uri, apiKey) {
  const m = /files\/([\w-]+)/.exec(uri);
  if (!m) throw new Error("Adresse du fichier vidéo inconnue");
  const fileId = m[1];
  for (let i = 0; i < 60; i++) {
    const r = await fetch(GOOGLE + "files/" + fileId, { headers: { "x-goog-api-key": apiKey } });
    const f = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error("Fichier vidéo : code " + r.status);
    if (f.state === "ACTIVE") break;
    if (f.state === "FAILED") throw new Error("Le fichier vidéo n'a pas pu être préparé");
    if (i === 59) throw new Error("Le fichier vidéo met trop de temps à être préparé");
    await new Promise(res => setTimeout(res, 3000));
  }
  const d = await fetch(GOOGLE + "files/" + fileId + ":download?alt=media", { headers: { "x-goog-api-key": apiKey }, redirect: "follow" });
  if (!d.ok) throw new Error("Téléchargement de la vidéo : code " + d.status);
  return Buffer.from(await d.arrayBuffer());
}

// Appel unique à Gemini Omni : texte seul, ou image d'exemple suivie du texte
async function generateOmni(prompt, aspectRatio, ref, apiKey) {
  const input = ref
    ? [
        { type: "image", data: ref.slice(ref.indexOf(",") + 1), mime_type: ref.slice(5, ref.indexOf(";")) },
        { type: "text", text: prompt },
      ]
    : prompt;
  const r = await fetch(GOOGLE + "interactions", {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OMNI_MODEL,
      input,
      response_format: { type: "video", aspect_ratio: aspectRatio, resolution: "720p" },
    }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d.error && d.error.message) || ("Google " + r.status));
  if (d.status && d.status !== "completed") throw new Error("La génération s'est arrêtée (" + d.status + ")");
  const steps = Array.isArray(d.steps) ? d.steps : [];
  const parts = steps.filter(s => s.type === "model_output").flatMap(s => s.content || []);
  const video = parts.find(c => c.type === "video");
  if (!video) throw new Error("Aucune vidéo renvoyée (contenu peut-être bloqué par les règles de sécurité).");
  if (video.data) return Buffer.from(video.data, "base64");
  if (video.uri) return downloadFile(video.uri, apiKey);
  throw new Error("Vidéo illisible");
}

exports.handler = async (event) => {
  let data = {};
  try { data = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400 }; }
  const email = cleanEmail(data.email);
  const id = String(data.id || "");
  if (!email || !OMNI_ID.test(id)) return { statusCode: 400 };

  const sid = safeName(id);
  const store = blobStore("karat-videos");
  const jk = jobKey(email, sid);

  // Seule une demande enregistrée et en attente peut être lancée
  let job = null;
  try { job = await store.get(jk, { type: "json" }); } catch (e) { console.error("KARAT video-background: lecture", e.message); }
  if (!job || job.status !== "queued") return { statusCode: 202 };
  await store.setJSON(jk, { ...job, status: "processing", startedAt: Date.now() });

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY manquante");
    const ref = ((await store.get(refKey(email, sid), { type: "json" })) || {}).ref || null;
    const buf = await generateOmni(job.prompt, job.aspectRatio, ref, apiKey);

    await store.setJSON("file|" + encodeURIComponent(email) + "|" + sid, { b64: buf.toString("base64"), mime: "video/mp4" });
    const lk = "list|" + encodeURIComponent(email);
    const list = (await store.get(lk, { type: "json" })) || [];
    list.unshift({
      id: sid,
      prompt: job.prompt || "Vidéo",
      durationSeconds: job.durationSeconds || null,
      aspectRatio: job.aspectRatio || null,
      resolution: job.resolution || null,
      createdAt: job.createdAt || Date.now(),
      bytes: buf.length,
    });
    await store.setJSON(lk, list.slice(0, 200));
    await store.setJSON(jk, { ...job, status: "done" });
    await store.delete(refKey(email, sid)).catch(() => {});
  } catch (e) {
    console.error("KARAT video-background: génération", e.message);
    await store.setJSON(jk, { ...job, status: "failed", error: e.message }).catch(() => {});
    await refundOnce(email, sid);
  }
  return { statusCode: 202 };
};
