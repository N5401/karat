// KARAT — outils communs aux fonctions vidéo (lancement, génération en arrière-plan, suivi).
// Une demande vidéo est enregistrée dans Netlify Blobs (« karat-videos ») avec un statut :
// queued (en attente), processing (en cours), done (prête), failed (échouée, crédit rendu).

const { getStore } = require("@netlify/blobs");
const { giveBack } = require("./credits");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

// Nom de fichier sûr pour les clés de stockage (« omni:… » devient « omni_… »)
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

const jobKey = (email, sid) => "job|" + encodeURIComponent(email) + "|" + sid;

// Semaine ISO (lundi au dimanche, UTC) : même calcul et même clé que video.js, pour rendre le bon quota
function isoWeek(d){
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((x - yearStart) / 86400000 + 1) / 7);
  return x.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
}
const quotaKey = (email, t) => "videoweek|" + encodeURIComponent(email) + "|" + isoWeek(new Date(t));
const refKey = (email, sid) => "ref|" + encodeURIComponent(email) + "|" + sid;

// Rend le crédit (ou le quota de la semaine) une seule fois, si la génération n'a pas abouti
async function refundOnce(email, sid) {
  try {
    const store = blobStore("karat-videos");
    const key = jobKey(email, sid);
    const job = await store.get(key, { type: "json" });
    if (!job || job.refunded) return;
    if (job.source === "credit") {
      await giveBack(email);
    } else if (job.source === "quota") {
      const qkey = quotaKey(email, job.createdAt);
      const q = blobStore("karat-quota");
      const n = ((await q.get(qkey, { type: "json" })) || {}).n || 0;
      await q.setJSON(qkey, { n: Math.max(0, n - 1) });
    }
    await store.setJSON(key, { ...job, refunded: true });
  } catch (e) {
    console.error("KARAT videojob: remboursement", e.message);
  }
}

module.exports = { blobStore, safeName, jobKey, refKey, refundOnce, quotaKey };
