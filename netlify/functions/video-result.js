// KARAT — suivi d'une vidéo Veo 3.1 (offre Expert). Quand elle est prête, la fonction la télécharge
// auprès de Google (la clé reste sur le serveur) et la range dans Netlify Blobs, dans la liste de l'abonné.
// Variables : GOOGLE_API_KEY, STRIPE_SECRET_KEY (offre).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

const GOOGLE_BASE = "https://generativelanguage.googleapis.com/v1beta/";
const ALLOWED = ["expert", "admin"];
const OPERATION = /^models\/[\w.-]+\/operations\/[\w.-]+$/;

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const name = String(q.id || "");
  if (!OPERATION.test(name)) return json(400, { error: "Identifiant invalide" });

  const email = cleanEmail(q.email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "La génération de vidéos est réservée à l'offre Expert." });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return json(500, { error: "Génération vidéo non configurée" });

  const store = blobStore("karat-videos");
  const id = safeName(name);
  const listKey = "list|" + encodeURIComponent(email);

  // Vidéo déjà sauvegardée (par exemple après un rechargement de la page)
  try {
    const list = (await store.get(listKey, { type: "json" })) || [];
    if (list.some(v => v.id === id)) return json(200, { status: "completed", id });
  } catch (e) { console.error("KARAT video-result: lecture de la liste", e.message); }

  // État de l'opération chez Google
  let op;
  try {
    const r = await fetch(GOOGLE_BASE + name, { headers: { "x-goog-api-key": apiKey } });
    op = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("KARAT video-result: erreur Google", r.status, JSON.stringify(op).slice(0, 300));
      return json(502, { error: "Impossible de lire l'état de la vidéo" });
    }
  } catch (e) {
    console.error("KARAT video-result: Google injoignable", e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }

  if (!op.done) return json(200, { status: "processing" });
  if (op.error) return json(200, { status: "failed", error: op.error.message || "La génération a échoué" });

  const samples = (op.response && op.response.generateVideoResponse && op.response.generateVideoResponse.generatedSamples) || [];
  const uri = samples[0] && samples[0].video && samples[0].video.uri;
  if (!uri) return json(200, { status: "failed", error: "Aucune vidéo renvoyée (contenu peut-être bloqué par les règles de sécurité)." });

  // Téléchargement du fichier, puis sauvegarde sur le site
  let buf;
  try {
    const f = await fetch(uri, { headers: { "x-goog-api-key": apiKey }, redirect: "follow" });
    if (!f.ok) throw new Error("code " + f.status);
    buf = Buffer.from(await f.arrayBuffer());
  } catch (e) {
    console.error("KARAT video-result: téléchargement", e.message);
    return json(200, { status: "failed", error: "La vidéo est prête mais le fichier n'a pas pu être récupéré (" + e.message + ")." });
  }

  try {
    const job = (await store.get("job|" + encodeURIComponent(email) + "|" + id, { type: "json" })) || {};
    await store.setJSON("file|" + encodeURIComponent(email) + "|" + id, { b64: buf.toString("base64"), mime: "video/mp4" });
    const list = (await store.get(listKey, { type: "json" })) || [];
    list.unshift({
      id,
      prompt: job.prompt || "Vidéo",
      durationSeconds: job.durationSeconds || null,
      aspectRatio: job.aspectRatio || null,
      resolution: job.resolution || null,
      createdAt: job.createdAt || Date.now(),
      bytes: buf.length,
    });
    await store.setJSON(listKey, list.slice(0, 200));
  } catch (e) {
    console.error("KARAT video-result: sauvegarde", e.message);
    return json(200, { status: "failed", error: "La vidéo est prête mais n'a pas pu être enregistrée." });
  }

  return json(200, { status: "completed", id });
};
