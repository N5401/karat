// KARAT — avis des utilisateurs, stockés sur Netlify Blobs (« karat-avis »).
// GET  : liste publique des avis, nombre total et moyenne sur 5 (null s'il n'y a aucun avis).
// POST : dépôt d'un avis {email, name, stars, text}. Un seul avis toutes les 6 heures par compte.
// POST {action:"delete", id} : retire un avis. Protégé par l'en-tête x-admin-token (variable ADMIN_TOKEN).
// Variables : NETLIFY_TOKEN et SITE_ID (stockage, facultatifs), ADMIN_TOKEN (modération).
// L'e-mail n'est jamais renvoyé ni stocké en clair : seul son empreinte sert à la limite de 6 heures.

const { getStore } = require("@netlify/blobs");
const crypto = require("crypto");

const COOLDOWN_MS = 6 * 3600 * 1000; // 1 avis toutes les 6 heures par compte
const MAX_AVIS = 500;                // on garde les 500 avis les plus récents
const MIN_TEXT = 10;
const MAX_TEXT = 400;

const store = () => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name: "karat-avis", siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore("karat-avis");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const cleanEmail = e => String(e || "").trim().toLowerCase();
const hashOf = e => crypto.createHash("sha256").update(cleanEmail(e)).digest("hex");

// « Léa Dupont » -> « Léa D. » : on n'affiche jamais le nom complet
function whoOf(name){
  const parts = String(name || "").replace(/[<>]/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Utilisateur";
  const first = parts[0].slice(0, 30);
  if (parts.length === 1) return first;
  return first + " " + parts[parts.length - 1].charAt(0).toUpperCase() + ".";
}

// Texte seul : sans caractères de contrôle, espaces réduits, longueur maximale
const cleanText = t => String(t || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);

function publicView(list){
  const count = list.length;
  const sum = list.reduce((s, a) => s + a.stars, 0);
  const average = count ? Math.round((sum / count) * 10) / 10 : null;
  return {
    count,
    average,
    avis: list.slice(0, 200).map(a => ({ id: a.id, stars: a.stars, text: a.text, who: a.who, at: a.at })),
  };
}

exports.handler = async (event) => {
  const st = store();
  let list = (await st.get("liste", { type: "json" })) || [];

  if (event.httpMethod === "GET") return json(200, publicView(list));
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  // Retrait d'un avis par l'administrateur
  if (data.action === "delete"){
    const token = (event.headers && (event.headers["x-admin-token"] || event.headers["X-Admin-Token"])) || "";
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return json(401, { error: "Jeton administrateur invalide" });
    }
    const id = String(data.id || "");
    const before = list.length;
    list = list.filter(a => a.id !== id);
    if (list.length === before) return json(404, { error: "Avis introuvable" });
    await st.setJSON("liste", list);
    return json(200, publicView(list));
  }

  // Dépôt d'un avis par un compte connecté
  const email = cleanEmail(data.email);
  if (!email || email.indexOf("@") < 1) return json(401, { error: "Connectez-vous pour laisser un avis." });
  const stars = Number(data.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return json(400, { error: "Choisissez entre 1 et 5 étoiles." });
  const text = cleanText(data.text);
  if (text.length < MIN_TEXT) return json(400, { error: `Votre avis doit faire au moins ${MIN_TEXT} caractères.` });

  const now = Date.now();
  const h = hashOf(email);
  const cool = (await st.get("cool", { type: "json" })) || {};
  const last = cool[h] || 0;
  if (now - last < COOLDOWN_MS){
    const left = Math.ceil((COOLDOWN_MS - (now - last)) / 60000);
    const hh = Math.floor(left / 60), mm = left % 60;
    return json(429, {
      error: `Un avis par compte toutes les 6 heures. Nouvel avis possible dans ${hh} h ${String(mm).padStart(2, "0")} min.`,
      minutesLeft: left,
    });
  }

  const avis = {
    id: now.toString(36) + Math.random().toString(36).slice(2, 7),
    stars, text, who: whoOf(data.name), at: now,
  };
  list = [avis, ...list].slice(0, MAX_AVIS);

  // On garde seulement les empreintes encore dans la fenêtre de 6 heures
  const fresh = {};
  for (const k of Object.keys(cool)) if (now - cool[k] < COOLDOWN_MS) fresh[k] = cool[k];
  fresh[h] = now;

  await st.setJSON("liste", list);
  await st.setJSON("cool", fresh);
  return json(200, publicView(list));
};
