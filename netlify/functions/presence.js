// KARAT — compteur de visiteurs « en ligne » (anonyme). POST {id} -> { online }
// Chaque navigateur envoie un battement toutes les 90 secondes avec un identifiant aléatoire (pas de compte, pas d'e-mail).
// On compte les identifiants vus pendant les 3 dernières minutes.
// Stockage : Netlify Blobs « karat-presence ». Variables : NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const MINUTE = 60 * 1000;
const WINDOW = 3; // fenêtre en minutes

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  const id = String(data.id || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  if (id.length < 8) return json(400, { error: "Identifiant invalide" });

  const now = Date.now();
  const bucket = Math.floor(now / MINUTE);
  const store = blobStore("karat-presence");

  try {
    // Une clé par navigateur et par minute : hb|<minute>|<identifiant>
    await store.setJSON(`hb|${bucket}|${id}`, { t: now });
  } catch (e) {
    console.error("KARAT presence: écriture", e.message);
    return json(200, { online: null });
  }

  // Comptage : identifiants distincts vus pendant la fenêtre
  const seen = new Set();
  try {
    for (let b = bucket - WINDOW + 1; b <= bucket; b++) {
      for await (const page of store.list({ prefix: `hb|${b}|`, paginate: true })) {
        for (const item of page.blobs) seen.add(item.key.split("|")[2]);
      }
    }
    // Nettoyage : on supprime la minute qui vient de sortir de la fenêtre
    const old = bucket - WINDOW - 1;
    for await (const page of store.list({ prefix: `hb|${old}|`, paginate: true })) {
      await Promise.all(page.blobs.map(item => store.delete(item.key)));
    }
  } catch (e) {
    console.error("KARAT presence: comptage", e.message);
  }

  return json(200, { online: seen.size });
};
