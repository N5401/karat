// KARAT — partagé entre les fonctions : offre de l'utilisateur et quotas d'images par jour.
// L'offre vient de l'accès offert par l'administrateur (Netlify Blobs « karat-acces »), sinon de Stripe.
// Les compteurs sont dans Netlify Blobs « karat-quota ». Variables : STRIPE_SECRET_KEY, NETLIFY_TOKEN, SITE_ID.

const { getStore } = require("@netlify/blobs");

const ADMIN_EMAILS = ["tarzanastral@gmail.com"];          // accès illimité
// Anciens montants (799, 1899, 3999) gardés pour les abonnés existants ; nouveaux montants 999, 2999, 4999
const PRICE_TO_PLAN = { 799: "essentiel", 1899: "pro", 3999: "expert", 999: "essentiel", 2999: "pro", 4999: "expert", 9900: "essentiel", 29900: "pro", 49900: "expert" };
const PLAN_LABEL = { essentiel: "Essentiel", pro: "Pro", expert: "Expert" };
// Images par jour selon l'offre (Infinity = illimité)
const IMAGE_QUOTA = { gratuit: 1, essentiel: 3, pro: 5, expert: Infinity };
// Messages par jour selon l'offre. Sans offre = essai gratuit (« gratuit »).
const MSG_QUOTA = { gratuit: 10, essentiel: 50, pro: 120, expert: Infinity, admin: Infinity };
// Longueur maximale d'une réponse (en jetons) selon l'offre
const ANSWER_TOKENS = { gratuit: 700, essentiel: 3000, pro: 12000, expert: 12000, admin: 12000 };
const TIER_LABEL = { gratuit: "Essai gratuit", essentiel: "Essentiel", pro: "Pro", expert: "Expert", admin: "Administrateur" };

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const ACTIVE = s => s.status === "active" || s.status === "trialing";
const cleanEmail = e => String(e || "").trim().toLowerCase();

function planOfSub(s){
  for (const it of ((s.items && s.items.data) || [])){
    const p = PRICE_TO_PLAN[it.price && it.price.unit_amount];
    if (p) return p;
  }
  return null;
}

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

async function overridePlan(email){
  try {
    const acces = (await blobStore("karat-acces").get("liste", { type: "json" })) || {};
    const o = acces[email];
    if (o && PLAN_LABEL[o.plan]) return o.plan;
  } catch (e) { console.error("KARAT acces lecture:", e.message); }
  return null;
}

async function stripePlan(email){
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const subs = await fetchSubs(key);
  for (const s of subs){
    const c = s.customer && typeof s.customer === "object" ? s.customer : {};
    if (cleanEmail(c.email) === email && ACTIVE(s)){
      const p = planOfSub(s);
      if (p) return p;
    }
  }
  return null;
}

// Offre effective : "essentiel" | "pro" | "expert" | "admin" | null
async function planFor(emailRaw){
  const email = cleanEmail(emailRaw);
  if (!email) return null;
  if (ADMIN_EMAILS.includes(email)) return "admin";
  return (await overridePlan(email)) || (await stripePlan(email));
}

const todayKey = () => new Date().toISOString().slice(0, 10);
const quotaKey = (email) => encodeURIComponent(email) + "|" + todayKey();

// Limite et nombre d'images déjà faites aujourd'hui
async function imageQuota(email, plan){
  const limit = plan === "admin" ? Infinity : (IMAGE_QUOTA[plan] || 0);
  const d = await blobStore("karat-quota").get(quotaKey(email), { type: "json" });
  return { limit, used: (d && d.n) || 0 };
}

async function addImageUse(email, used){
  await blobStore("karat-quota").setJSON(quotaKey(email), { n: used + 1 });
}

// Messages déjà envoyés aujourd'hui (compteur séparé des images)
const msgKey = (email) => "msg|" + quotaKey(email);

async function msgQuota(email, tier){
  const limit = MSG_QUOTA[tier] === undefined ? 0 : MSG_QUOTA[tier];
  const d = await blobStore("karat-quota").get(msgKey(email), { type: "json" });
  return { limit, used: (d && d.n) || 0 };
}

async function addMsgUse(email, used){
  await blobStore("karat-quota").setJSON(msgKey(email), { n: used + 1 });
}

module.exports = {
  planFor, imageQuota, addImageUse, cleanEmail, PLAN_LABEL, IMAGE_QUOTA,
  MSG_QUOTA, ANSWER_TOKENS, TIER_LABEL, msgQuota, addMsgUse,
};
