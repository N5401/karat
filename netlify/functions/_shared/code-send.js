// KARAT — renvoi du code à 6 chiffres (inscription ou connexion en cours).
// POST {email} -> {ok:true} ; le code n'est jamais renvoyé au navigateur, seulement par e-mail.
// Limite : 3 codes par adresse toutes les 15 minutes. Le code expire au bout de 10 minutes.
// Variables Netlify : RESEND_API_KEY, MAIL_FROM, CODE_SECRET (facultatif), NETLIFY_TOKEN et SITE_ID.

const A = require("./_shared/accounts");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return A.json(405, { error: "Méthode non autorisée" });
  const d = A.parseBody(event);
  if (!d) return A.json(400, { error: "Requête invalide" });
  const email = A.cleanEmail(d.email);
  if (!A.validEmail(email)) return A.json(400, { error: "E-mail invalide" });
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return A.json(500, { error: "Envoi des codes non configuré" });

  const codes = A.codesStore();
  const rec = await codes.get(A.codeKey(email), { type: "json" }).catch(() => null);
  if (!rec || Date.now() - (rec.created || 0) > A.CODE_LIFE){
    return A.json(404, { error: "Recommencez la connexion pour recevoir un nouveau code." });
  }
  if (!(await A.takeSend(codes, email))) return A.json(429, { error: "Trop de codes demandés. Réessayez dans quelques minutes." });

  const sent = await A.sendCode(codes, email, { purpose: rec.purpose, pending: rec.pending, created: rec.created });
  if (!sent) return A.json(502, { error: "Le code n'a pas pu être envoyé. Réessayez." });
  return A.json(200, { ok: true });
};
