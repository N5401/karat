// KARAT — messages restants aujourd'hui, affichés dans le chat.
// GET ?email=…&plan=…  (plan = offre affichée : gratuit, essentiel, pro, expert ou admin)
// Sert uniquement à l'affichage : la limite réelle est appliquée par ai-background.js.

const { msgQuota, cleanEmail, MSG_QUOTA, TIER_LABEL } = require("./_shared/acces");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });
  const q = event.queryStringParameters || {};
  const email = cleanEmail(q.email);
  if (!email) return json(401, { error: "Connectez-vous." });
  const tier = Object.prototype.hasOwnProperty.call(MSG_QUOTA, q.plan) ? q.plan : "gratuit";
  try {
    const { limit, used } = await msgQuota(email, tier);
    return json(200, {
      tier,
      label: TIER_LABEL[tier],
      msgLimit: limit === Infinity ? null : limit,   // null = illimité
      msgUsed: used,
    });
  } catch (e) {
    console.error("KARAT usage:", e.message);
    return json(500, { error: "Compteur indisponible" });
  }
};
