// KARAT — galerie « Mes images » d'un compte. GET ?email=… -> { images: [{id, prompt, createdAt}] }
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

  const email = cleanEmail((event.queryStringParameters || {}).email);
  if (!email) return json(401, { error: "Connectez-vous" });

  try {
    const list = (await blobStore("karat-images").get("list|" + encodeURIComponent(email), { type: "json" })) || [];
    return json(200, { images: list });
  } catch (e) {
    console.error("KARAT image-list:", e.message);
    return json(500, { error: "Liste indisponible" });
  }
};
