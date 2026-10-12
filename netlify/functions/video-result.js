// KARAT — suivi d'une génération vidéo (offre Expert). Renvoie l'état, et l'adresse de la vidéo une fois prête.
// Variables : ATLAS_API_KEY, STRIPE_SECRET_KEY (offre), NETLIFY_TOKEN + SITE_ID (si l'offre est accordée par l'administrateur).

const { planFor, cleanEmail } = require("./_shared/acces");

const ATLAS_PREDICTION = "https://api.atlascloud.ai/api/v1/model/prediction/";
const ALLOWED = ["expert", "admin"];

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const id = String(q.id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120);
  if (!id) return json(400, { error: "Identifiant manquant" });

  const email = cleanEmail(q.email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "La génération de vidéos est réservée à l'offre Expert." });

  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) return json(500, { error: "Génération vidéo non configurée" });

  let r, d;
  try {
    r = await fetch(ATLAS_PREDICTION + encodeURIComponent(id), {
      headers: { Authorization: "Bearer " + apiKey },
    });
    d = await r.json().catch(() => ({}));
  } catch (e) {
    console.error("KARAT video-result: service injoignable", e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }
  if (!r.ok) {
    console.error("KARAT video-result: erreur", r.status, JSON.stringify(d).slice(0, 300));
    return json(502, { error: "Impossible de lire l'état de la vidéo" });
  }

  const data = (d && d.data) || {};
  if (data.status === "completed" || data.status === "succeeded") {
    const url = Array.isArray(data.outputs) ? data.outputs[0] : null;
    return json(200, { status: "completed", url: url || null });
  }
  if (data.status === "failed") {
    return json(200, { status: "failed", error: data.error || "La génération a échoué" });
  }
  return json(200, { status: data.status || "pending" });
};
