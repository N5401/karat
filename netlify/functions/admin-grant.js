// KARAT — attribution manuelle, par e-mail, de crédits vidéo ou de points images (réservé à l'administrateur).
// POST {email, type: "video" | "image", amount} avec l'en-tête x-admin-token (variable ADMIN_TOKEN).
// GET ?email=… avec le même en-tête : affiche le solde vidéo et les points images du compte.
// Crédits vidéo : ajoutés au solde « karat-credits » (même format que les achats Stripe).
// Points images : ajoutés à « karat-bonus », utilisés une fois le quota quotidien épuisé.
// Chaque attribution est journalisée dans « karat-admin ».
// Variables : ADMIN_TOKEN, NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { cleanEmail } = require("./_shared/acces");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const isAuthorized = (event) => {
  const h = event.headers || {};
  const token = h["x-admin-token"] || h["X-Admin-Token"] || "";
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
};

async function balances(email){
  const q = encodeURIComponent(email);
  const credits = (await blobStore("karat-credits").get("bal|" + q, { type: "json" })) || {};
  const bonus = (await blobStore("karat-bonus").get("img|" + q, { type: "json" })) || {};
  return {
    videoCredits: typeof credits.n === "number" ? credits.n : 0,
    imageBonus: typeof bonus.n === "number" ? bonus.n : 0,
  };
}

async function logGrant(email, type, amount){
  try {
    const store = blobStore("karat-admin");
    const list = (await store.get("grants", { type: "json" })) || [];
    list.unshift({ at: Date.now(), email, type, amount });
    await store.setJSON("grants", list.slice(0, 300));
  } catch (e) {
    console.error("KARAT admin-grant: journal", e.message);
  }
}

exports.handler = async (event) => {
  if (!isAuthorized(event)) return json(401, { error: "Jeton administrateur invalide" });

  if (event.httpMethod === "GET") {
    const email = cleanEmail((event.queryStringParameters || {}).email);
    if (!email) return json(400, { error: "E-mail manquant" });
    try {
      return json(200, { email, ...(await balances(email)) });
    } catch (e) {
      console.error("KARAT admin-grant: lecture", e.message);
      return json(500, { error: "Lecture impossible" });
    }
  }

  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  const email = cleanEmail(data.email);
  const type = data.type === "image" ? "image" : data.type === "video" ? "video" : null;
  const amount = Math.floor(Number(data.amount));
  if (!email) return json(400, { error: "Adresse e-mail invalide" });
  if (!type) return json(400, { error: "Type inconnu (video ou image)" });
  if (!(amount >= 1 && amount <= 1000)) return json(400, { error: "Quantité entre 1 et 1000" });

  try {
    const q = encodeURIComponent(email);
    if (type === "video") {
      const store = blobStore("karat-credits");
      const bal = (await store.get("bal|" + q, { type: "json" })) || {};
      const seen = Array.isArray(bal.seen) ? bal.seen : [];
      const n = typeof bal.n === "number" ? bal.n : 0;
      await store.setJSON("bal|" + q, { n: n + amount, seen });
    } else {
      const store = blobStore("karat-bonus");
      const b = (await store.get("img|" + q, { type: "json" })) || {};
      const n = typeof b.n === "number" ? b.n : 0;
      await store.setJSON("img|" + q, { n: n + amount });
    }
    await logGrant(email, type, amount);
    return json(200, { ok: true, email, ...(await balances(email)) });
  } catch (e) {
    console.error("KARAT admin-grant: écriture", e.message);
    return json(500, { error: "Attribution impossible, réessayez" });
  }
};
