// KARAT — abonnements et accès.
// GET  ?email=...        -> {plan, source}  (utilisateur : accès offert par l'administrateur, sinon abonnement Stripe)
// GET  ?admin=1          -> {subs, acces, stripeOk}  (administrateur, en-tête x-admin-token)
// POST {email, plan}     -> {acces}  (administrateur : offre un accès gratuit ; plan null = retire l'accès offert)
// Variables Netlify : STRIPE_SECRET_KEY (clé restreinte, lecture), ADMIN_TOKEN,
//                     NETLIFY_TOKEN et SITE_ID (stockage des accès offerts, déjà utilisés par les annonces).

const { getStore } = require("@netlify/blobs");

const PRICE_TO_PLAN = { 799: "essentiel", 1899: "pro", 3999: "expert" };
const PLAN_NAMES = ["essentiel", "pro", "expert"];
const ACTIVE = s => s.status === "active" || s.status === "trialing";

// Stockage des accès offerts : une seule liste {email: {plan, at}}
const accesStore = () => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name: "karat-acces", siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore("karat-acces");

async function readAcces(){
  try { return (await accesStore().get("liste", { type: "json" })) || {}; }
  catch (e) { console.error("KARAT acces lecture:", e.message); return null; }
}

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
  const method = event.httpMethod;
  if (method !== "GET" && method !== "POST") return json(405, { error: "Méthode non autorisée" });
  const headers = event.headers || {};
  const q = event.queryStringParameters || {};
  const key = process.env.STRIPE_SECRET_KEY;
  const isAdmin = () => {
    const token = headers["x-admin-token"] || headers["X-Admin-Token"] || "";
    return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
  };

  // Administrateur : offrir ou retirer un accès
  if (method === "POST"){
    if (!isAdmin()) return json(401, { error: "Jeton administrateur invalide" });
    let data;
    try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
    const email = String(data.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) return json(400, { error: "E-mail requis" });
    const plan = data.plan || null;
    if (plan && !PLAN_NAMES.includes(plan)) return json(400, { error: "Offre inconnue" });
    const acces = await readAcces();
    if (acces === null) return json(503, { error: "Stockage des accès indisponible" });
    if (plan) acces[email] = { plan, at: Date.now() };
    else delete acces[email];
    try {
      await accesStore().setJSON("liste", acces);
    } catch (e) {
      console.error("KARAT acces écriture:", e.message);
      return json(503, { error: "Enregistrement impossible" });
    }
    return json(200, { acces });
  }

  // Administrateur : liste des abonnés payants (Stripe) et des accès offerts
  if (q.admin){
    if (!isAdmin()) return json(401, { error: "Jeton administrateur invalide" });
    const acces = (await readAcces()) || {};
    let subs = [], stripeOk = true;
    if (key){
      try {
        subs = (await fetchSubs(key))
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
          .filter(x => x.plan && x.email);
      } catch (e) {
        console.error("KARAT abo admin:", e.message);
        stripeOk = false;
      }
    } else {
      stripeOk = false;
    }
    return json(200, { subs, acces, stripeOk });
  }

  // Utilisateur : son propre accès
  const email = String(q.email || "").trim().toLowerCase();
  if (!email) return json(400, { error: "Email requis" });
  const acces = await readAcces();
  const offert = acces && acces[email];
  if (offert && PLAN_NAMES.includes(offert.plan)) return json(200, { plan: offert.plan, source: "offert" });
  if (!key) return json(500, { error: "Clé Stripe non configurée" });
  try {
    const subs = await fetchSubs(key);
    for (const s of subs){
      const c = s.customer && typeof s.customer === "object" ? s.customer : {};
      if (String(c.email || "").toLowerCase() === email && ACTIVE(s)){
        const plan = planOf(s);
        if (plan) return json(200, { plan, source: "payant" });
      }
    }
    return json(200, { plan: null, source: null });
  } catch (e) {
    console.error("KARAT abo:", e.message);
    return json(502, { error: "Vérification impossible" });
  }
};
