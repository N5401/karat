// KARAT — vérification du code à 6 chiffres.
// POST {email, code} -> {ok:true, account} si le code est bon.
//   Inscription en attente : le compte est créé maintenant, seulement si le code est bon.
//   Connexion : le compte existant est renvoyé, avec la date de dernière connexion mise à jour.
// Le code est supprimé dès qu'il est utilisé, expire au bout de 10 minutes et bloque après 5 essais.
// Variables Netlify : CODE_SECRET (même valeur que code-send), NETLIFY_TOKEN et SITE_ID.

const A = require("./_shared/accounts");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return A.json(405, { error: "Méthode non autorisée" });
  const d = A.parseBody(event);
  if (!d) return A.json(400, { error: "Requête invalide" });
  const email = A.cleanEmail(d.email);
  const code = String(d.code || "").replace(/\s/g, "");
  if (!A.validEmail(email)) return A.json(400, { error: "E-mail invalide" });
  if (!/^\d{6}$/.test(code)) return A.json(400, { error: "Entrez les 6 chiffres du code." });

  const codes = A.codesStore();
  const accounts = A.accountsStore();
  const ck = A.codeKey(email);
  const rec = await codes.get(ck, { type: "json" }).catch(() => null);

  if (!rec || !rec.hash || Date.now() > rec.exp) return A.json(400, { error: "Code expiré. Demandez-en un nouveau." });
  if (rec.attempts >= A.MAX_ATTEMPTS){
    await codes.delete(ck).catch(() => {});
    return A.json(429, { error: "Trop d'essais. Demandez un nouveau code." });
  }
  if (!A.codeMatches(email, code, rec)){
    rec.attempts += 1;
    await codes.setJSON(ck, rec);
    const left = A.MAX_ATTEMPTS - rec.attempts;
    return A.json(400, { error: left > 0 ? `Code incorrect. Il vous reste ${left} essai${left > 1 ? "s" : ""}.` : "Code incorrect." });
  }
  await codes.delete(ck).catch(() => {});

  const now = Date.now();
  if (rec.purpose === "signup"){
    if (!rec.pending) return A.json(400, { error: "Code expiré. Demandez-en un nouveau." });
    if (await accounts.get(A.accKey(email), { type: "json" }).catch(() => null)){
      return A.json(409, { error: "Un compte existe déjà avec cet e-mail. Connectez-vous." });
    }
    const acc = { email, ...rec.pending, provider: "password", createdAt: now, lastLogin: now };
    await accounts.setJSON(A.accKey(email), acc);
    return A.json(200, { ok: true, account: A.publicProfile(acc) });
  }

  const acc = await accounts.get(A.accKey(email), { type: "json" }).catch(() => null);
  if (!acc) return A.json(404, { error: "Compte introuvable." });
  acc.lastLogin = now;
  await accounts.setJSON(A.accKey(email), acc);
  return A.json(200, { ok: true, account: A.publicProfile(acc) });
};
