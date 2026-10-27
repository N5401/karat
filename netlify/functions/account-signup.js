// KARAT — inscription en ligne : contrôle les champs, puis envoie un code à l'adresse.
// Le compte n'est créé qu'après la saisie du bon code (code-verify), donc personne ne peut s'inscrire avec l'adresse d'un autre.
// POST {email, firstName, lastName, phone, password} -> {ok:true} | {error}
// Variables Netlify : RESEND_API_KEY, MAIL_FROM, CODE_SECRET (facultatif), NETLIFY_TOKEN et SITE_ID.

const A = require("./_shared/accounts");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return A.json(405, { error: "Méthode non autorisée" });
  const d = A.parseBody(event);
  if (!d) return A.json(400, { error: "Requête invalide" });

  const email = A.cleanEmail(d.email);
  const firstName = String(d.firstName || "").trim().slice(0, 60);
  const lastName = String(d.lastName || "").trim().slice(0, 60);
  const phone = String(d.phone || "").trim();
  const password = String(d.password || "");

  if (!A.validEmail(email)) return A.json(400, { error: "Adresse e-mail invalide." });
  if (!firstName || !lastName) return A.json(400, { error: "Renseignez votre prénom et votre nom." });
  if (!A.PHONE_RE.test(phone)) return A.json(400, { error: "Numéro de téléphone invalide." });
  if (password.length < 8 || password.length > 200) return A.json(400, { error: "Le mot de passe doit faire au moins 8 caractères." });
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return A.json(500, { error: "Envoi des codes non configuré" });

  const accounts = A.accountsStore();
  if (await accounts.get(A.accKey(email), { type: "json" }).catch(() => null)){
    return A.json(409, { error: "Un compte existe déjà avec cet e-mail. Connectez-vous." });
  }
  const codes = A.codesStore();
  if (!(await A.takeSend(codes, email))) return A.json(429, { error: "Trop de codes demandés. Réessayez dans quelques minutes." });

  const { hash, salt } = await A.hashPassword(password);
  const sent = await A.sendCode(codes, email, { purpose: "signup", pending: { firstName, lastName, phone, hash, salt } });
  if (!sent) return A.json(502, { error: "Le code n'a pas pu être envoyé. Réessayez." });
  return A.json(200, { ok: true });
};
