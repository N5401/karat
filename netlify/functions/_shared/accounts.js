// KARAT — comptes en ligne (partagé par account-signup, account-login, code-send et code-verify).
// Le mot de passe est haché sur le serveur (PBKDF2-SHA256, 210 000 tours, comme l'ancien réglage du navigateur).
// Chaque connexion et chaque inscription est confirmée par un code à 6 chiffres envoyé par e-mail.
// Variables Netlify : RESEND_API_KEY, MAIL_FROM, CODE_SECRET (facultatif), NETLIFY_TOKEN et SITE_ID (déjà utilisés).

const { getStore } = require("@netlify/blobs");
const crypto = require("crypto");

const ITER = 210000;
const CODE_TTL = 10 * 60 * 1000;          // un code expire au bout de 10 minutes
const CODE_LIFE = 24 * 60 * 60 * 1000;    // une inscription en attente peut recevoir un nouveau code pendant 24 h
const WINDOW = 15 * 60 * 1000;
const MAX_SENDS = 3;                      // codes envoyés par adresse et par tranche de 15 minutes
const MAX_ATTEMPTS = 5;                   // essais par code
const MAX_PW_FAILS = 10;                  // mots de passe faux par adresse et par tranche de 15 minutes
const PHONE_RE = /^\+?[0-9 .\-()]{8,20}$/;

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);
const codesStore = () => blobStore("karat-login-codes");
const accountsStore = () => blobStore("karat-accounts");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const parseBody = (event) => { try { return JSON.parse(event.body || "{}"); } catch { return null; } };
const cleanEmail = (v) => String(v || "").trim().toLowerCase();
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const keyOf = (email) => crypto.createHash("sha256").update(email).digest("hex");
const accKey = (email) => "acc-" + keyOf(email);
const codeKey = (email) => "code-" + keyOf(email);
const pwKey = (email) => "pw-" + keyOf(email);
const codeHash = (email, code) => crypto.createHmac("sha256", process.env.CODE_SECRET || "karat-code")
  .update(email + ":" + code).digest("hex");

/* ----- Mot de passe ----- */
const pbkdf2 = (pw, salt) => new Promise((res, rej) =>
  crypto.pbkdf2(pw, salt, ITER, 32, "sha256", (e, k) => (e ? rej(e) : res(k))));

async function hashPassword(pw, saltB64){
  const salt = saltB64 ? Buffer.from(saltB64, "base64") : crypto.randomBytes(16);
  const key = await pbkdf2(pw, salt);
  return { hash: key.toString("base64"), salt: salt.toString("base64") };
}
async function checkPassword(pw, acc){
  const { hash } = await hashPassword(pw, acc.salt);
  const a = Buffer.from(hash), b = Buffer.from(acc.hash || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ----- Limites ----- */
// Envois de code : 3 par adresse et par tranche de 15 minutes
async function takeSend(store, email){
  const k = "rl-" + keyOf(email), now = Date.now();
  const rl = (await store.get(k, { type: "json" }).catch(() => null)) || { count: 0, start: now };
  if (now - rl.start > WINDOW){ rl.count = 0; rl.start = now; }
  if (rl.count >= MAX_SENDS) return false;
  rl.count += 1;
  await store.setJSON(k, rl);
  return true;
}
// Mots de passe faux : bloqués après 10 essais dans la tranche de 15 minutes
async function pwBlocked(store, email){
  const r = await store.get(pwKey(email), { type: "json" }).catch(() => null);
  return !!r && r.n >= MAX_PW_FAILS && Date.now() - r.start <= WINDOW;
}
async function pwFailed(store, email){
  const k = pwKey(email), now = Date.now();
  let r = (await store.get(k, { type: "json" }).catch(() => null)) || { n: 0, start: now };
  if (now - r.start > WINDOW) r = { n: 0, start: now };
  r.n += 1;
  await store.setJSON(k, r);
}
async function pwClear(store, email){
  await store.delete(pwKey(email)).catch(() => {});
}

/* ----- Codes à 6 chiffres ----- */
// base = {purpose: "signup" | "login", pending?, created?} ; le code n'est jamais stocké en clair
async function sendCode(store, email, base){
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const now = Date.now();
  const rec = { ...base, created: base.created || now, hash: codeHash(email, code), exp: now + CODE_TTL, attempts: 0 };
  await store.setJSON(codeKey(email), rec);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [email],
      subject: "Votre code de connexion KARAT",
      html: `<p>Bonjour,</p>
<p>Votre code KARAT est :</p>
<p style="font-size:28px;letter-spacing:.2em;font-weight:600">${code}</p>
<p>Il expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`,
    }),
  });
  if (!r.ok){
    console.error("Envoi du code refusé par Resend", r.status, await r.text().catch(() => ""));
    return false;
  }
  return true;
}
const codeMatches = (email, code, rec) => {
  const a = Buffer.from(rec.hash || ""), b = Buffer.from(codeHash(email, code));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Ce que le navigateur a le droit de savoir du compte (jamais le mot de passe ni son empreinte)
const publicProfile = (a) => ({
  email: a.email, firstName: a.firstName, lastName: a.lastName, phone: a.phone,
  provider: "password", createdAt: a.createdAt, lastLogin: a.lastLogin,
});

module.exports = {
  ITER, CODE_LIFE, MAX_ATTEMPTS, PHONE_RE,
  json, parseBody, cleanEmail, validEmail, codeKey, accKey,
  codesStore, accountsStore,
  hashPassword, checkPassword,
  takeSend, pwBlocked, pwFailed, pwClear,
  sendCode, codeMatches, publicProfile,
};
