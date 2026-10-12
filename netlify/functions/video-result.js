// KARAT — suivi d'une vidéo (offre Expert), chez Google ou chez Atlas. Quand elle est prête, la fonction
// la télécharge et la range dans Netlify Blobs, dans la liste de l'abonné.
// Identifiants : « models/…/operations/… » = Google ; « atlas:… » = Atlas.
// Variables : GOOGLE_API_KEY et/ou ATLAS_API_KEY, STRIPE_SECRET_KEY (offre).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");
const { giveBack } = require("./_shared/credits");

const GOOGLE_BASE = "https://generativelanguage.googleapis.com/v1beta/";
const ATLAS_PREDICTION = "https://api.atlascloud.ai/api/v1/model/prediction/";
const ALLOWED = ["essentiel", "pro", "expert", "admin"];
const GOOGLE_OP = /^models\/[\w.-]+\/operations\/[\w.-]+$/;
const ATLAS_ID = /^atlas:[\w-]{4,120}$/;

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

// Rend le crédit (ou le quota du mois) une seule fois, quand la génération a échoué
async function refundOnce(email, id) {
  try {
    const store = blobStore("karat-videos");
    const jobKey = "job|" + encodeURIComponent(email) + "|" + id;
    const job = await store.get(jobKey, { type: "json" });
    if (!job || job.refunded) return;
    if (job.source === "credit") {
      await giveBack(email);
    } else if (job.source === "quota") {
      const qkey = "video|" + encodeURIComponent(email) + "|" + new Date(job.createdAt).toISOString().slice(0, 7);
      const q = blobStore("karat-quota");
      const n = ((await q.get(qkey, { type: "json" })) || {}).n || 0;
      await q.setJSON(qkey, { n: Math.max(0, n - 1) });
    }
    await store.setJSON(jobKey, { ...job, refunded: true });
  } catch (e) {
    console.error("KARAT video-result: remboursement", e.message);
  }
}

// Lit l'état chez le fournisseur et renvoie { state, uri?, headers?, error? }
async function checkGoogle(name, apiKey) {
  const r = await fetch(GOOGLE_BASE + name, { headers: { "x-goog-api-key": apiKey } });
  const op = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("Google " + r.status);
  if (!op.done) return { state: "processing" };
  if (op.error) return { state: "failed", error: op.error.message || "La génération a échoué" };
  const samples = (op.response && op.response.generateVideoResponse && op.response.generateVideoResponse.generatedSamples) || [];
  const uri = samples[0] && samples[0].video && samples[0].video.uri;
  if (!uri) return { state: "failed", error: "Aucune vidéo renvoyée (contenu peut-être bloqué par les règles de sécurité)." };
  return { state: "done", uri, headers: { "x-goog-api-key": apiKey } };
}

async function checkAtlas(name, apiKey) {
  const r = await fetch(ATLAS_PREDICTION + encodeURIComponent(name.slice(6)), { headers: { Authorization: "Bearer " + apiKey } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("Atlas " + r.status);
  const data = d.data || {};
  if (data.status === "failed") return { state: "failed", error: data.error || "La génération a échoué" };
  if (!(data.status === "completed" || data.status === "succeeded")) return { state: "processing" };
  const uri = Array.isArray(data.outputs) ? data.outputs[0] : null;
  if (!uri) return { state: "failed", error: "Aucune vidéo renvoyée par Atlas." };
  return { state: "done", uri, headers: {} };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const name = String(q.id || "");
  const isAtlas = ATLAS_ID.test(name);
  if (!isAtlas && !GOOGLE_OP.test(name)) return json(400, { error: "Identifiant invalide" });

  const email = cleanEmail(q.email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "La génération de vidéos est réservée à l'offre Expert." });

  const store = blobStore("karat-videos");
  const id = safeName(name);
  const listKey = "list|" + encodeURIComponent(email);

  // Vidéo déjà sauvegardée (par exemple après un rechargement de la page)
  try {
    const list = (await store.get(listKey, { type: "json" })) || [];
    if (list.some(v => v.id === id)) return json(200, { status: "completed", id });
  } catch (e) { console.error("KARAT video-result: lecture de la liste", e.message); }

  // État chez le fournisseur
  let st;
  try {
    if (isAtlas) {
      const apiKey = process.env.ATLAS_API_KEY;
      if (!apiKey) return json(500, { error: "Génération vidéo non configurée (ATLAS_API_KEY manquante)" });
      st = await checkAtlas(name, apiKey);
    } else {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) return json(500, { error: "Génération vidéo non configurée (GOOGLE_API_KEY manquante)" });
      st = await checkGoogle(name, apiKey);
    }
  } catch (e) {
    console.error("KARAT video-result: fournisseur", e.message);
    return json(502, { error: "Impossible de lire l'état de la vidéo" });
  }

  if (st.state === "processing") return json(200, { status: "processing" });
  if (st.state === "failed") { await refundOnce(email, id); return json(200, { status: "failed", error: st.error }); }

  // Téléchargement du fichier, puis sauvegarde sur le site
  let buf;
  try {
    const f = await fetch(st.uri, { headers: st.headers, redirect: "follow" });
    if (!f.ok) throw new Error("code " + f.status);
    buf = Buffer.from(await f.arrayBuffer());
  } catch (e) {
    console.error("KARAT video-result: téléchargement", e.message);
    await refundOnce(email, id);
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
    await refundOnce(email, id);
    return json(200, { status: "failed", error: "La vidéo est prête mais n'a pas pu être enregistrée." });
  }

  return json(200, { status: "completed", id });
};
