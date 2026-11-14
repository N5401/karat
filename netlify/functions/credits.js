// KARAT — solde de crédits vidéo d'un abonné. GET ?email=… -> { credits }
// Ouvert à tous, avec ou sans abonnement. Le solde est synchronisé avec les paiements Stripe au passage.
// Variables : STRIPE_SECRET_KEY, STRIPE_CREDIT_PLINK, NETLIFY_TOKEN + SITE_ID (si besoin).

const { planFor, cleanEmail } = require("./_shared/acces");
const { syncCredits } = require("./_shared/credits");
const { getStore } = require("@netlify/blobs");

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
  if (!email) return json(401, { error: "Connectez-vous" });

  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  // Administrateur : crédits illimités, pas de solde à synchroniser
  if (plan === "admin") return json(200, { credits: null, unlimited: true });
  // Vidéos illimitées accordées par l'administrateur
  try {
    const u = await blobStore("karat-videounl").get("unl|" + encodeURIComponent(email), { type: "json" });
    if (u && u.on === true) return json(200, { credits: null, unlimited: true });
  } catch (e) { console.error("KARAT credits: lecture illimité", e.message); }

  try {
    const bal = await syncCredits(email);
    return json(200, { credits: bal.n });
  } catch (e) {
    console.error("KARAT credits: synchronisation", e.message);
    return json(502, { error: "Solde indisponible, réessayez" });
  }
};
