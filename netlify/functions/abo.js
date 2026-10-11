// KARAT — abonnements vérifiés directement auprès de Stripe (aucun stockage nécessaire).
// GET ?email=...           -> {plan: "essentiel" | "pro" | "expert" | null}   (utilisateur)
// GET ?admin=1             -> {subs: [...]} tous les abonnements actifs      (administrateur, en-tête x-admin-token)
// Variables Netlify : STRIPE_SECRET_KEY (clé restreinte, lecture) et ADMIN_TOKEN.

const PRICE_TO_PLAN = { 799: "essentiel", 1899: "pro", 3999: "expert" };
const ACTIVE = s => s.status === "active" || s.status === "trialing";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

// Récupère les abonnements Stripe, page par page (100 par page, 10 pages au maximum)
async function fetchSubs(key){
  let all = [], after = null;
  for (let page = 0; page < 10; page++){
    let url = "https://api.stripe.com/v1/subscriptions?status=all&limit=100&expand[]=data.customer";
    if (after) url += "&starting_after=" + after;
    const r = await fetch(url, { headers: { Authorization: "Bearer " + key } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error("Stripe " + r.status);
    all = all.concat(d.data || []);
    if (!d.has_more || !d.data || !d.data.length) break;
    after = d.data[d.data.length - 1].id;
  }
  return all;
}

function planOf(s){
  for (const it of ((s.items && s.items.data) || [])){
    const p = PRICE_TO_PLAN[it.price && it.price.unit_amount];
    if (p) return p;
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });
  const q = event.queryStringParameters || {};
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(500, { error: "Clé Stripe non configurée" });

  // Mode administrateur : liste de tous les abonnés
  if (q.admin){
    const headers = event.headers || {};
    const token = headers["x-admin-token"] || headers["X-Admin-Token"] || "";
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN)
      return json(401, { error: "Jeton administrateur invalide" });
    try {
      const subs = (await fetchSubs(key))
        .filter(ACTIVE)
        .map(s => {
          const c = s.customer && typeof s.customer === "object" ? s.customer : {};
          return {
            email: String(c.email || "").toLowerCase(),
            name: c.name || "",
            plan: planOf(s),
            status: s.status,
            since: (s.start_date || s.created || 0) * 1000,
          };
        })
        .filter(x => x.plan);
      return json(200, { subs });
    } catch (e) {
      console.error("KARAT abo admin:", e.message);
      return json(502, { error: "Stripe injoignable" });
    }
  }

  // Mode utilisateur : son propre abonnement
  const email = String(q.email || "").trim().toLowerCase();
  if (!email) return json(400, { error: "Email requis" });
  try {
    const subs = await fetchSubs(key);
    for (const s of subs){
      const c = s.customer && typeof s.customer === "object" ? s.customer : {};
      if (String(c.email || "").toLowerCase() === email && ACTIVE(s)){
        const plan = planOf(s);
        if (plan) return json(200, { plan });
      }
    }
    return json(200, { plan: null });
  } catch (e) {
    console.error("KARAT abo:", e.message);
    return json(502, { error: "Vérification impossible" });
  }
};
