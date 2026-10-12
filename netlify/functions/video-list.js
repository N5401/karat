// KARAT — liste des vidéos sauvegardées d'un abonné Expert (page Vidéos, « Mes vidéos »).
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

  const email = cleanEmail((event.queryStringParameters || {}).email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "La génération de vidéos est réservée à l'offre Expert." });

  try {
    const list = (await blobStore("karat-videos").get("list|" + encodeURIComponent(email), { type: "json" })) || [];
    return json(200, { videos: list });
  } catch (e) {
    console.error("KARAT video-list:", e.message);
    return json(500, { error: "Liste indisponible" });
  }
};
