// KARAT — partagé entre les fonctions : offre de l'utilisateur et quotas d'images par jour.
// L'offre vient de l'accès offert par l'administrateur (Netlify Blobs « karat-acces »), sinon de Stripe.
// Les compteurs sont dans Netlify Blobs « karat-quota ». Variables : STRIPE_SECRET_KEY, NETLIFY_TOKEN, SITE_ID.

const { getStore } = require("@netlify/blobs");

const ADMIN_EMAILS = ["tarzanastral@gmail.com"];          // accès illimité
// Anciens montants (799, 1899, 3999) gardés pour les abonnés existants ; nouveaux montants 999, 2999, 4999
const PRICE_TO_PLAN = { 699: "essentiel", 799: "essentiel", 1899: "pro", 3999: "expert", 999: "essentiel", 2999: "pro", 4999: "expert", 9900: "essentiel", 29900: "pro", 49900: "expert" };
const PLAN_LABEL = { essentiel: "Essentiel", pro: "Pro", expert: "Expert" };
// Images selon l'offre (Infinity = illimité). Gratuit : 3 tous les 2 jours, non cumulables ; Essentiel : 3 par jour ; Pro et Expert : illimité.
const IMAGE_QUOTA = { gratuit: 3, essentiel: 3, pro: Infinity, expert: Infinity };
// Messages par jour selon l'offre. Sans offre = version gratuite (« gratuit »).
const MSG_QUOTA = { gratuit: 30, essentiel: 80, pro: 200, expert: Infinity, admin: Infinity };
// Longueur maximale d'une réponse (en jetons) selon l'offre
const ANSWER_TOKENS = { gratuit: 700, essentiel: 3000, pro: 12000, expert: 12000, admin: 12000 };
const TIER_LABEL = { gratuit: "Version gratuite", essentiel: "Essentiel", pro: "Pro", expert: "Expert", admin: "Administrateur" };

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
// Version gratuite : 3 images tous les 2 jours (fenêtres fixes de 48 h). Les images non utilisées ne se cumulent pas :
// elles expirent à la fin de la fenêtre. Les offres payantes se renouvellent chaque jour.
const DAY_MS = 24 * 60 * 60 * 1000;
const periodKey = (tier) => tier === "gratuit" ? "2j|" + Math.floor(Date.now() / (2 * DAY_MS)) : todayKey();
const quotaKey = (email, tier) => encodeURIComponent(email) + "|" + periodKey(tier);
// Début de la fenêtre suivante (renouvellement de la version gratuite), en français, heure de Paris
function freeResetText(){
  const next = (Math.floor(Date.now() / (2 * DAY_MS)) + 1) * 2 * DAY_MS;
  return new Date(next).toLocaleString("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}
// Limite et nombre d'images déjà faites sur la période en cours
async function imageQuota(email, plan){
  const limit = plan === "admin" ? Infinity : (IMAGE_QUOTA[plan] || 0);
  const d = await blobStore("karat-quota").get(quotaKey(email, plan), { type: "json" });
  return { limit, used: (d && d.n) || 0 };
}
async function addImageUse(email, used, plan){
  await blobStore("karat-quota").setJSON(quotaKey(email, plan), { n: used + 1 });
}
// Message affiché quand la limite d'images est atteinte
function imageLimitText(plan, quota){
  if (plan === "gratuit") return `Vous avez utilisé vos ${IMAGE_QUOTA.gratuit} images de cette période. Elles se renouvellent le ${freeResetText()} ; les images non utilisées ne se cumulent pas. Pour en générer davantage dès maintenant, l'offre Essentiel (6,99 € par mois) en inclut 3 par jour.`;
  return `Limite atteinte : ${quota.limit} images par jour avec l'offre ${PLAN_LABEL[plan] || plan}. Revenez demain ou passez à une offre supérieure.`;
}

// Messages déjà envoyés sur la période en cours (compteur séparé des images)
// Messages : compteur quotidien pour toutes les offres
const msgKey = (email) => "msg|" + encodeURIComponent(email) + "|" + todayKey();

async function msgQuota(email, tier){
  const limit = MSG_QUOTA[tier] === undefined ? 0 : MSG_QUOTA[tier];
  const d = await blobStore("karat-quota").get(msgKey(email), { type: "json" });
  return { limit, used: (d && d.n) || 0 };
}

async function addMsgUse(email, used, tier){
  await blobStore("karat-quota").setJSON(msgKey(email), { n: used + 1 });
}

module.exports = {
  planFor, imageQuota, addImageUse, cleanEmail, PLAN_LABEL, IMAGE_QUOTA,
  MSG_QUOTA, ANSWER_TOKENS, TIER_LABEL, msgQuota, addMsgUse, freeResetText, imageLimitText,
};
