// KARAT — suivi d'une vidéo (offre Expert), chez Google, chez Atlas ou chez xAI. Quand le fournisseur a fini,
// la vidéo est enregistrée par video-save-background.js (fonction d'arrière-plan, avec plus de temps pour télécharger),
// puis rangée dans la liste de l'abonné (Netlify Blobs). Ce fichier suit la progression et rend le crédit en cas d'échec.
// Identifiants : « models/…/operations/… » = Google Veo ; « omni:… » = Gemini Omni (suivi dans la demande) ; « atlas:… » = Atlas ; « xai:… » = xAI.
// Variables : GOOGLE_API_KEY et/ou ATLAS_API_KEY et/ou XAI_API_KEY, STRIPE_SECRET_KEY (offre).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");
const { refundOnce } = require("./_shared/videojob");

const GOOGLE_BASE = "https://generativelanguage.googleapis.com/v1beta/";
const ATLAS_PREDICTION = "https://api.atlascloud.ai/api/v1/model/prediction/";
const XAI_VIDEO = "https://api.x.ai/v1/videos/";
const ALLOWED = ["essentiel", "pro", "expert", "admin"];
const GOOGLE_OP = /^models\/[\w.-]+\/operations\/[\w.-]+$/;
const ATLAS_ID = /^atlas:[\w-]{4,120}$/;
const OMNI_ID = /^omni:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const XAI_ID = /^xai:[\w-]{4,120}$/;
const SAVE_FAILED = "La vidéo est prête mais n'a pas pu être enregistrée.";
const SAVING_MAX_MS = 10 * 60 * 1000;   // au-delà, un enregistrement bloqué est considéré comme perdu
const READY_MAX_MS = 3 * 60 * 1000;    // prête depuis plus de 3 minutes sans enregistrement : on arrête
const NOT_STARTED = "La vidéo est prête mais son enregistrement n'a pas démarré. Aucun crédit n'a été débité.";
const saveBackground = require("./video-save-background");   // secours : enregistrement sur place

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

// Lit l'état chez le fournisseur et renvoie { state, uri?, error? }
async function checkGoogle(name, apiKey) {
  const r = await fetch(GOOGLE_BASE + name, { headers: { "x-goog-api-key": apiKey } });
  const op = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("Google " + r.status);
  if (!op.done) return { state: "processing" };
  if (op.error) return { state: "failed", error: op.error.message || "La génération a échoué" };
  const samples = (op.response && op.response.generateVideoResponse && op.response.generateVideoResponse.generatedSamples) || [];
  const uri = samples[0] && samples[0].video && samples[0].video.uri;
  if (!uri) return { state: "failed", error: "Aucune vidéo renvoyée (contenu peut-être bloqué par les règles de sécurité)." };
  return { state: "done", uri };
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
  return { state: "done", uri };
}

// Lit l'état d'une demande xAI : pending, done (avec video.url) ou failed
async function checkXai(name, apiKey) {
  const r = await fetch(XAI_VIDEO + encodeURIComponent(name.slice(4)), { headers: { Authorization: "Bearer " + apiKey } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("xAI " + r.status);
  if (d.status === "failed") return { state: "failed", error: (d.error && d.error.message) || "La génération a échoué" };
  if (d.status !== "done") return { state: "processing" };
  if (d.video && d.video.respect_moderation === false) return { state: "failed", error: "Vidéo refusée par les règles de sécurité." };
  const uri = d.video && d.video.url;
  if (!uri) return { state: "failed", error: "Aucune vidéo renvoyée par xAI." };
  return { state: "done", uri };
}

// Lance video-save-background.js : la réponse arrive tout de suite, l'enregistrement se poursuit sans bloquer
async function startSave(event, email, sid) {
  const base = process.env.URL || (event.headers && event.headers.host ? "https://" + event.headers.host : "");
  if (!base) return false;
  try {
    const r = await fetch(base + "/.netlify/functions/video-save-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, id: sid }),
    });
    return r.status === 202 || r.ok;
  } catch (e) {
    console.error("KARAT video-result: lancement de l'enregistrement", e.message);
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const name = String(q.id || "");
  const isAtlas = ATLAS_ID.test(name);
  const isOmni = OMNI_ID.test(name);
  const isXai = XAI_ID.test(name);
  if (!isAtlas && !isOmni && !isXai && !GOOGLE_OP.test(name)) return json(400, { error: "Identifiant invalide" });

  const email = cleanEmail(q.email);
  let plan = null;
  // Ouvert à tous : la vidéo est rattachée à l'e-mail de son compte

  const store = blobStore("karat-videos");
  const id = safeName(name);
  const listKey = "list|" + encodeURIComponent(email);
  const jk = "job|" + encodeURIComponent(email) + "|" + id;

  // Vidéo déjà sauvegardée (par exemple après un rechargement de la page)
  try {
    const list = (await store.get(listKey, { type: "json" })) || [];
    if (list.some(v => v.id === id)) return json(200, { status: "completed", id });
  } catch (e) { console.error("KARAT video-result: lecture de la liste", e.message); }

  // Gemini Omni : l'état est celui de la demande enregistrée, mise à jour par video-background.js
  if (isOmni) {
    let job = null;
    try { job = await store.get(jk, { type: "json" }); }
    catch (e) { console.error("KARAT video-result: lecture de la demande", e.message); }
    if (!job) return json(200, { status: "failed", error: "Demande de vidéo introuvable." });
    if (job.status === "failed") return json(200, { status: "failed", error: job.error || "La génération a échoué" });
    if (job.status === "done") return json(200, { status: "failed", error: "La vidéo est prête mais introuvable. Réessayez." });
    // En attente ou en cours : au-delà de 20 minutes, la génération est considérée comme perdue, et le crédit est rendu
    if (Date.now() - (job.createdAt || 0) > 20 * 60 * 1000) {
      await refundOnce(email, id);
      return json(200, { status: "failed", error: "La génération a expiré. Aucun crédit n'a été débité." });
    }
    return json(200, { status: "processing" });
  }

  // État chez le fournisseur
  let st;
  try {
    if (isXai) {
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return json(500, { error: "Génération vidéo non configurée (XAI_API_KEY manquante)" });
      st = await checkXai(name, apiKey);
    } else if (isAtlas) {
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

  if (st.state === "processing") {
    // Au-delà de 20 minutes, la génération est considérée comme perdue : le crédit est rendu
    let jb = null;
    try { jb = await store.get(jk, { type: "json" }); } catch (e) { console.error("KARAT video-result: lecture de la demande", e.message); }
    if (jb && Date.now() - (jb.createdAt || 0) > 20 * 60 * 1000) {
      await refundOnce(email, id);
      return json(200, { status: "failed", error: "La génération a expiré. Aucun crédit n'a été débité." });
    }
    return json(200, { status: "processing" });
  }
  if (st.state === "failed") { await refundOnce(email, id); return json(200, { status: "failed", error: st.error }); }

  // Vidéo prête chez le fournisseur. Son adresse est gardée côté serveur seulement ; video-save-background.js
  // télécharge puis enregistre la vidéo. Tant qu'elle n'est pas dans la liste, la réponse reste « processing ».
  let jb = {};
  try { jb = (await store.get(jk, { type: "json" })) || {}; }
  catch (e) { console.error("KARAT video-result: lecture de la demande", e.message); }

  if (jb.status === "saved") return json(200, { status: "completed", id });
  if (jb.status === "failed") {
    await refundOnce(email, id);
    return json(200, { status: "failed", error: jb.error || SAVE_FAILED });
  }
  if (jb.status === "saving") {
    // Enregistrement bloqué depuis plus de 10 minutes : le crédit est rendu
    if (Date.now() - (jb.savingAt || 0) > SAVING_MAX_MS) {
      await store.setJSON(jk, { ...jb, status: "failed", error: SAVE_FAILED }).catch(() => {});
      await refundOnce(email, id);
      return json(200, { status: "failed", error: SAVE_FAILED });
    }
    return json(200, { status: "processing" });
  }
  if (jb.status === "ready" && Date.now() - (jb.readyAt || 0) > READY_MAX_MS) {
    // Prête depuis plus de 3 minutes sans enregistrement lancé : on arrête et le crédit est rendu
    await store.setJSON(jk, { ...jb, status: "failed", error: NOT_STARTED }).catch(() => {});
    await refundOnce(email, id);
    return json(200, { status: "failed", error: NOT_STARTED });
  }
  if (jb.status !== "ready") {
    try {
      await store.setJSON(jk, {
        ...jb,
        status: "ready",
        readyAt: Date.now(),
        provider: isXai ? "xai" : (isAtlas ? "atlas" : "google"),
        uri: st.uri,
      });
    } catch (e) {
      console.error("KARAT video-result: écriture de la demande", e.message);
      return json(200, { status: "processing" });
    }
  }
  // Lancement de l'enregistrement en arrière-plan. Si cette fonction n'est pas joignable, on enregistre ici même.
  if (!(await startSave(event, email, id))) {
    try { await saveBackground.handler({ body: JSON.stringify({ email, id }) }); }
    catch (e) { console.error("KARAT video-result: enregistrement sur place", e.message); }
  }
  return json(200, { status: "processing" });
};
