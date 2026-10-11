// KARAT — annonces de l'administrateur, stockées sur Netlify Blobs.
// GET  : renvoie les annonces encore actives (public).
// POST : publie une annonce {title, text, hours} ou retire une annonce {action:"delete", id}.
//        Protégé par l'en-tête x-admin-token, qui doit correspondre à la variable ADMIN_TOKEN.

const { getStore } = require("@netlify/blobs");

// Connexion au stockage : avec NETLIFY_TOKEN (jeton personnel Netlify) si il est défini, sinon automatique
const annStore = () => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name: "karat-annonces", siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore("karat-annonces");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const store = annStore();
  const now = Date.now();
  let list = (await store.get("liste", { type: "json" })) || [];

  if (event.httpMethod === "GET") {
    list = list.filter(a => a.until > now);
    return json(200, { annonces: list });
  }

  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  const token = (event.headers && (event.headers["x-admin-token"] || event.headers["X-Admin-Token"])) || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return json(401, { error: "Jeton administrateur invalide" });
  }

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  if (data.action === "delete") {
    list = list.filter(a => a.id !== data.id);
  } else {
    const title = String(data.title || "").trim().slice(0, 120);
    const text = String(data.text || "").trim().slice(0, 600);
    const hours = Math.min(Math.max(Number(data.hours) || 24, 1), 24 * 90);
    if (!title) return json(400, { error: "Titre requis" });
    list.push({ id: now.toString(36) + Math.random().toString(36).slice(2, 6), title, text, until: now + hours * 3600000, created: now });
  }

  list = list.filter(a => a.until > now);
  await store.setJSON("liste", list);
  return json(200, { annonces: list });
};
