// KARAT — comptes des visiteurs, lisibles par l'administrateur (tous les visiteurs, pas seulement ce navigateur).
// POST {email, firstName, lastName, phone, provider, createdAt, lastLogin} -> {ok}
//        appelé à l'inscription et à chaque connexion. Une seule fiche par adresse, mise à jour à chaque fois.
// GET  (en-tête x-admin-token)  -> {total, accounts}  administrateur uniquement, comptes les plus récents en premier.
// Variables Netlify : ADMIN_TOKEN, NETLIFY_TOKEN et SITE_ID (déjà utilisés par les autres fonctions).

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

const isAdmin = (headers) => {
  const token = headers["x-admin-token"] || headers["X-Admin-Token"] || "";
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
};

const clip = (v, n) => String(v || "").trim().slice(0, n);
const stamp = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const keyOf = (email) => crypto.createHash("sha256").update(email).digest("hex");

// Lit une fiche ; une ancienne valeur qui n'est pas une fiche est traitée comme absente
async function readRecord(store, key){
  try { const r = await store.get(key, { type: "json" }); return r && typeof r === "object" ? r : null; }
  catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    let data;
    try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
    const email = String(data.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "E-mail invalide" });
    try {
      const store = blobStore("karat-inscriptions");
      const key = keyOf(email);
      const old = (await readRecord(store, key)) || {};
      const rec = {
        email,
        firstName: clip(data.firstName, 80) || old.firstName || "",
        lastName: clip(data.lastName, 80) || old.lastName || "",
        phone: clip(data.phone, 30) || old.phone || "",
        provider: clip(data.provider, 20) || old.provider || "",
        createdAt: old.createdAt || stamp(data.createdAt) || Date.now(),
        lastLogin: stamp(data.lastLogin) || Date.now(),
      };
      await store.setJSON(key, rec);
    } catch (e) {
      console.error("KARAT inscriptions: écriture", e.message);
      return json(503, { error: "Enregistrement impossible" });
    }
    return json(200, { ok: true });
  }

  if (event.httpMethod === "GET") {
    if (!isAdmin(event.headers || {})) return json(401, { error: "Jeton administrateur invalide" });
    try {
      const store = blobStore("karat-inscriptions");
      const listing = await store.list();
      const keys = (listing.blobs || []).map(b => b.key);
      const recs = [];
      for (let i = 0; i < keys.length; i += 25) {
        const part = await Promise.all(keys.slice(i, i + 25).map(k => readRecord(store, k)));
        part.forEach(r => { if (r && r.email) recs.push(r); });
      }
      recs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return json(200, { total: recs.length, accounts: recs });
    } catch (e) {
      console.error("KARAT inscriptions: lecture", e.message);
      return json(503, { error: "Lecture impossible" });
    }
  }

  return json(405, { error: "Méthode non autorisée" });
};
