// KARAT — connexion en ligne, étape 1 : vérifie le mot de passe sur le serveur, puis envoie un code par e-mail.
// POST {email, password} -> {ok:true} (code envoyé) | {error}
//   404 {error:"no_account"} : aucun compte en ligne pour cette adresse (le navigateur peut transférer un ancien compte).
// Variables Netlify : RESEND_API_KEY, MAIL_FROM, CODE_SECRET (facultatif), NETLIFY_TOKEN et SITE_ID.

const A = require("./_shared/accounts");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return A.json(405, { error: "Méthode non autorisée" });
  const d = A.parseBody(event);
  if (!d) return A.json(400, { error: "Requête invalide" });

  const email = A.cleanEmail(d.email);
  const password = String(d.password || "");
  if (!A.validEmail(email)) return A.json(400, { error: "Adresse e-mail invalide." });
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return A.json(500, { error: "Envoi des codes non configuré" });

  const accounts = A.accountsStore();
  const codes = A.codesStore();
  const acc = await accounts.get(A.accKey(email), { type: "json" }).catch(() => null);
  if (!acc) return A.json(404, { error: "no_account" });

  if (await A.pwBlocked(codes, email)) return A.json(429, { error: "Trop de tentatives. Réessayez dans quelques minutes." });
  if (!(await A.checkPassword(password, acc))){
    await A.pwFailed(codes, email);
    return A.json(401, { error: "Mot de passe incorrect." });
  }
  await A.pwClear(codes, email);

  if (!(await A.takeSend(codes, email))) return A.json(429, { error: "Trop de codes demandés. Réessayez dans quelques minutes." });
  const sent = await A.sendCode(codes, email, { purpose: "login" });
  if (!sent) return A.json(502, { error: "Le code n'a pas pu être envoyé. Réessayez." });
  return A.json(200, { ok: true });
};
