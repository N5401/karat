// KARAT — vérification du code de connexion
// POST {email, code} -> {ok:true} si le code est bon.
// Le code est supprimé dès qu'il est utilisé, expire au bout de 10 minutes et bloque après 5 essais.
// Variables Netlify : CODE_SECRET (même valeur que code-send), NETLIFY_TOKEN et SITE_ID (déjà utilisés).

const { getStore } = require("@netlify/blobs");
const crypto = require("crypto");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const keyOf = (email) => crypto.createHash("sha256").update(email).digest("hex");
const codeHash = (email, code) => crypto.createHmac("sha256", process.env.CODE_SECRET || "karat-code")
  .update(email + ":" + code).digest("hex");
const MAX_ATTEMPTS = 5;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  const email = String(data.email || "").trim().toLowerCase();
  const code = String(data.code || "").replace(/\s/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "E-mail invalide" });
  if (!/^\d{6}$/.test(code)) return json(400, { error: "Entrez les 6 chiffres du code." });

  const store = blobStore("karat-login-codes");
  const k = keyOf(email);
  const rec = await store.get("code-" + k, { type: "json" }).catch(() => null);

  if (!rec || Date.now() > rec.exp){
    await store.delete("code-" + k).catch(() => {});
    return json(400, { error: "Code expiré. Demandez-en un nouveau." });
  }
  if (rec.attempts >= MAX_ATTEMPTS){
    await store.delete("code-" + k).catch(() => {});
    return json(429, { error: "Trop d'essais. Demandez un nouveau code." });
  }

  const good = crypto.timingSafeEqual(Buffer.from(rec.hash), Buffer.from(codeHash(email, code)));
  if (!good){
    rec.attempts += 1;
    await store.setJSON("code-" + k, rec);
    const left = MAX_ATTEMPTS - rec.attempts;
    return json(400, { error: left > 0 ? `Code incorrect. Il vous reste ${left} essai${left > 1 ? "s" : ""}.` : "Code incorrect." });
  }

  await store.delete("code-" + k).catch(() => {});
  return json(200, { ok: true });
};
