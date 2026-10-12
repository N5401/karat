// KARAT — renvoie une vidéo sauvegardée (lecture dans la page et téléchargement), uniquement à son abonné Expert.
// Limite Netlify : une réponse de fonction fait au plus environ 6 Mo, donc les vidéos plus lourdes ne s'affichent pas.
// Variables : STRIPE_SECRET_KEY (offre), NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

const ALLOWED = ["expert", "admin"];

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const id = String(q.id || "");
  if (!/^[\w.-]{1,160}$/.test(id)) return json(400, { error: "Identifiant invalide" });

  const email = cleanEmail(q.email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "Réservé à l'offre Expert." });

  let rec = null;
  try { rec = await blobStore("karat-videos").get("file|" + encodeURIComponent(email) + "|" + id, { type: "json" }); }
  catch (e) { console.error("KARAT video-file:", e.message); }
  if (!rec || !rec.b64) return json(404, { error: "Vidéo introuvable" });

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "video/mp4", "Cache-Control": "private, max-age=3600" },
    body: rec.b64,
  };
};
