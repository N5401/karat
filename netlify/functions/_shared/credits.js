// KARAT — crédits vidéo : 1 crédit = 1 vidéo de 8 secondes, 5 € le crédit.
// Solde dans Netlify Blobs « karat-credits » (clé « bal|email »).
// Les achats viennent de Stripe : le lien de paiement de crédits (paiement unique, quantité ajustable)
// est lu par son identifiant, STRIPE_CREDIT_PLINK (plink_…). Clé : STRIPE_SECRET_KEY (lecture des sessions).

const { getStore } = require("@netlify/blobs");

const PRICE_CENTS = 500;   // 5 € par crédit (1 crédit = 1 vidéo de 8 secondes)
const MAX_PAGES = 5;       // au plus 500 paiements récents analysés à chaque synchronisation
const STORE = "karat-credits";

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const balKey = (email) => "bal|" + encodeURIComponent(email);

async function readBal(email) {
  try {
    const b = await blobStore(STORE).get(balKey(email), { type: "json" });
    return b && typeof b.n === "number" ? b : { n: 0, seen: [] };
  } catch (e) {
    console.error("KARAT credits: lecture du solde", e.message);
    return { n: 0, seen: [] };
  }
}
async function writeBal(email, bal) {
  await blobStore(STORE).setJSON(balKey(email), bal);
}

// Ajoute au solde les paiements Stripe de cet e-mail qui n'ont pas encore été comptés
async function syncCredits(email) {
  const e = String(email || "").trim().toLowerCase();
  const bal = await readBal(e);
  const key = process.env.STRIPE_SECRET_KEY;
  const plink = process.env.STRIPE_CREDIT_PLINK;
  if (!key || !plink) return bal;   // non configuré : on renvoie le solde actuel

  const base = "https://api.stripe.com/v1/checkout/sessions?payment_link=" + encodeURIComponent(plink) + "&status=complete&limit=100";
  let url = base;
  let added = 0;
  for (let page = 0; page < MAX_PAGES && url; page++) {
    const r = await fetch(url, { headers: { Authorization: "Bearer " + key } });
    if (!r.ok) throw new Error("Stripe " + r.status);
    const d = await r.json();
    for (const s of d.data || []) {
      if (s.payment_status !== "paid") continue;
      const mail = String((s.customer_details && s.customer_details.email) || "").trim().toLowerCase();
      if (mail !== e) continue;
      if (bal.seen.includes(s.id)) continue;
      const credits = Math.floor((s.amount_total || 0) / PRICE_CENTS);
      bal.seen.push(s.id);
      bal.n += credits;
      added += credits;
    }
    const last = d.data && d.data[d.data.length - 1];
    url = d.has_more && last ? base + "&starting_after=" + encodeURIComponent(last.id) : null;
  }
  if (added) {
    bal.seen = bal.seen.slice(-300);
    await writeBal(e, bal);
  }
  return bal;
}

// Solde actuel, après synchronisation avec Stripe
async function balanceOf(email) {
  return (await syncCredits(email)).n;
}

// Retire un crédit (à appeler seulement quand la vidéo est acceptée)
async function takeCredit(email) {
  const e = String(email || "").trim().toLowerCase();
  const bal = await readBal(e);
  bal.n = Math.max(0, bal.n - 1);
  await writeBal(e, bal);
}

// Rend un crédit (génération échouée après acceptation)
async function giveBack(email) {
  const e = String(email || "").trim().toLowerCase();
  const bal = await readBal(e);
  bal.n += 1;
  await writeBal(e, bal);
}

module.exports = { syncCredits, balanceOf, takeCredit, giveBack, PRICE_CENTS };
