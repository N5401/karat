// KARAT — renvoie l'état d'une image en cours de génération (voir image-background.js).
const { getStore } = require("@netlify/blobs");

const aiStore = () => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name: "karat-ai", siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore("karat-ai");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });
  const id = String((event.queryStringParameters || {}).id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  if (!id) return json(400, { error: "Identifiant requis" });
  const store = aiStore();
  const key = "img_" + id;
  const d = await store.get(key, { type: "json" });
  if (!d) return json(200, { status: "pending" });
  if (d.status !== "pending") await store.delete(key);
  return json(200, d);
};
