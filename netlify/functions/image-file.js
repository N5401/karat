// KARAT — renvoie une image conservée dans « Mes images » (affichage et téléchargement), uniquement à son compte.
// GET ?email=…&id=… -> image/png
// Variables : NETLIFY_TOKEN + SITE_ID (si besoin).

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

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const email = cleanEmail(q.email);
  const id = String(q.id || "");
  if (!email) return json(401, { error: "Connectez-vous" });
  if (!/^[a-z0-9]{4,40}$/i.test(id)) return json(400, { error: "Identifiant invalide" });

  let rec = null;
  try {
    rec = await blobStore("karat-images").get("file|" + encodeURIComponent(email) + "|" + id, { type: "json" });
  } catch (e) {
    console.error("KARAT image-file:", e.message);
  }
  if (!rec || !rec.b64) return json(404, { error: "Image introuvable" });

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=3600" },
    body: rec.b64,
  };
};
