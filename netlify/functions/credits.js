// KARAT — solde de crédits vidéo d'un abonné. GET ?email=… -> { credits }
// Ouvert à toutes les offres payantes. Le solde est synchronisé avec les paiements Stripe au passage.
// Variables : STRIPE_SECRET_KEY, STRIPE_CREDIT_PLINK, NETLIFY_TOKEN + SITE_ID (si besoin).

const { planFor, cleanEmail } = require("./_shared/acces");
const { syncCredits } = require("./_shared/credits");

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
  if (!plan) return json(403, { error: "Les crédits vidéo sont réservés aux abonnés." });

  try {
    const bal = await syncCredits(email);
    return json(200, { credits: bal.n });
  } catch (e) {
    console.error("KARAT credits: synchronisation", e.message);
    return json(502, { error: "Solde indisponible, réessayez" });
  }
};
