// KARAT — réception des photos de référence pour la génération d'image.
// Le site envoie ici les photos (requête normale, jusqu'à 6 Mo) avant d'appeler image-background.js,
// qui est une fonction « background » : elle n'accepte que de petites requêtes (quelques centaines de Ko).
// Les photos sont rangées dans Netlify Blobs (« karat-ai », clé « refs_<id> ») puis lues par image-background.js.

const { getStore } = require("@netlify/blobs");
const { cleanEmail } = require("./_shared/acces");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const cleanId = (v) => String(v || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const DATA_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  const email = cleanEmail(data.email);
  if (!email) return json(401, { error: "Connectez-vous pour générer des images." });
  const id = cleanId(data.id);
  if (!id) return json(400, { error: "Identifiant invalide" });

  const refs = Array.isArray(data.refs) ? data.refs : [];
  if (refs.length < 1 || refs.length > 4) return json(400, { error: "Ajoutez entre 1 et 4 photos." });
  for (const r of refs) {
    if (typeof r !== "string" || r.length > 1500000 || !DATA_RE.test(r)) return json(400, { error: "Photo refusée : utilisez une image JPG, PNG ou WebP de taille raisonnable." });
  }
  if (refs.reduce((s, r) => s + r.length, 0) > 4500000) return json(400, { error: "Les photos sont trop lourdes au total. Ajoutez-en moins ou de plus petites." });

  try {
    await blobStore("karat-ai").setJSON("refs_" + id, { email, refs, at: Date.now() });
  } catch (e) {
    console.error("KARAT image-refs: écriture", e.message);
    return json(503, { error: "Photos impossibles à enregistrer, réessayez." });
  }
  return json(200, { ok: true });
};
