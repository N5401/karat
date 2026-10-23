// KARAT — envoi d'un code de connexion par e-mail
// POST {email} -> {ok:true} ; le code (6 chiffres) n'est jamais renvoyé au navigateur, seulement par e-mail.
// Limite : 3 codes par adresse toutes les 15 minutes. Le code expire au bout de 10 minutes.
// Variables Netlify : RESEND_API_KEY, MAIL_FROM (ex. "KARAT <no-reply@votre-domaine.fr>"),
//                     CODE_SECRET (facultatif, une longue chaîne au hasard), NETLIFY_TOKEN et SITE_ID (déjà utilisés).

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

const CODE_TTL = 10 * 60 * 1000;
const WINDOW = 15 * 60 * 1000;
const MAX_SENDS = 3;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  const email = String(data.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "E-mail invalide" });
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return json(500, { error: "Envoi des codes non configuré" });

  const store = blobStore("karat-login-codes");
  const k = keyOf(email);
  const now = Date.now();

  // Limite d'envois par adresse
  const rl = (await store.get("rl-" + k, { type: "json" }).catch(() => null)) || { count: 0, start: now };
  if (now - rl.start > WINDOW) { rl.count = 0; rl.start = now; }
  if (rl.count >= MAX_SENDS) return json(429, { error: "Trop de codes demandés. Réessayez dans quelques minutes." });
  rl.count += 1;
  await store.setJSON("rl-" + k, rl);

  // Code aléatoire à 6 chiffres, seul son empreinte est stockée
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  await store.setJSON("code-" + k, { hash: codeHash(email, code), exp: now + CODE_TTL, attempts: 0 });

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [email],
      subject: "Votre code de connexion KARAT",
      html: `<p>Bonjour,</p>
<p>Votre code de connexion KARAT est :</p>
<p style="font-size:28px;letter-spacing:.2em;font-weight:600">${code}</p>
<p>Il expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`,
    }),
  });
  if (!r.ok) return json(502, { error: "Le code n'a pas pu être envoyé. Réessayez." });
  return json(200, { ok: true });
};
