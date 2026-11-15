// KARAT — enregistrement d'une vidéo prête (xAI, Atlas ou Google), en arrière-plan (Netlify « background » : jusqu'à 15 minutes).
// video-result.js la lance quand le fournisseur a fini de générer : elle télécharge le fichier, le range dans Netlify Blobs
// (« karat-videos ») et l'ajoute à la liste « Mes vidéos » de l'abonné. Elle ne fait rien si la demande n'est pas au statut « ready ».
// Variables : GOOGLE_API_KEY (seulement pour les vidéos Google).

const { cleanEmail } = require("./_shared/acces");
const { blobStore, jobKey, refundOnce } = require("./_shared/videojob");

const SID = /^[\w.-]{4,140}$/;
const SAVE_FAILED = "La vidéo est prête mais n'a pas pu être enregistrée.";

exports.handler = async (event) => {
  let data = {};
  try { data = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400 }; }
  const email = cleanEmail(data.email);
  const sid = String(data.id || "");
  if (!email || !SID.test(sid)) return { statusCode: 400 };

  const store = blobStore("karat-videos");
  const jk = jobKey(email, sid);

  // Seule une vidéo prête (statut « ready », posé par video-result.js après contrôle du fournisseur) est enregistrée
  let job = null;
  try { job = await store.get(jk, { type: "json" }); } catch (e) { console.error("KARAT video-save: lecture", e.message); }
  if (!job || job.status !== "ready" || !job.uri) return { statusCode: 202 };
  await store.setJSON(jk, { ...job, status: "saving", savingAt: Date.now() });

  try {
    const headers = job.provider === "google" ? { "x-goog-api-key": process.env.GOOGLE_API_KEY || "" } : {};
    const f = await fetch(job.uri, { headers, redirect: "follow" });
    if (!f.ok) throw new Error("téléchargement : code " + f.status);
    const buf = Buffer.from(await f.arrayBuffer());

    await store.setJSON("file|" + encodeURIComponent(email) + "|" + sid, { b64: buf.toString("base64"), mime: "video/mp4" });
    const lk = "list|" + encodeURIComponent(email);
    // Une même vidéo n'apparaît jamais deux fois dans la liste, même si l'enregistrement a été relancé
    const list = ((await store.get(lk, { type: "json" })) || []).filter(v => v.id !== sid);
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
    // L'adresse du fournisseur n'est plus utile une fois la vidéo enregistrée : on la retire
    const { uri, ...rest } = job;
    await store.setJSON(jk, { ...rest, status: "saved" });
  } catch (e) {
    console.error("KARAT video-save: enregistrement", e.message);
    await store.setJSON(jk, { ...job, status: "failed", error: SAVE_FAILED + " Détail : " + String(e.message).slice(0, 200) }).catch(() => {});
    await refundOnce(email, sid);
  }
  return { statusCode: 202 };
};
