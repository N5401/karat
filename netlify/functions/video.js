// KARAT — lancement d'une vidéo (Gemini Omni), pour les abonnés payants (crédits pour les offres sans vidéo incluse).
// Fournisseur choisi par la variable VIDEO_PROVIDER : « google » (défaut) ou « atlas ».
//   google : GOOGLE_API_KEY (clé Google AI Studio). La génération tourne dans video-background (arrière-plan).
//   atlas  : ATLAS_API_KEY, VIDEO_MODEL (défaut google/veo3.1/text-to-video), VIDEO_AUDIO (défaut « true »).
// Règle : Essentiel inclut 2 vidéos par semaine, Pro 4, Expert 6 ; au-delà, chaque vidéo coûte 1 crédit.
// Le crédit ou le quota n'est décompté qu'une fois la génération acceptée par le fournisseur.
// video-result.js suit la génération, sauvegarde la vidéo et rend le crédit si elle échoue.
// Variables communes : STRIPE_SECRET_KEY, STRIPE_CREDIT_PLINK, NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");
const { balanceOf, takeCredit } = require("./_shared/credits");
const { jobKey, refKey, refundOnce } = require("./_shared/videojob");
const crypto = require("crypto");

const PROVIDER = (process.env.VIDEO_PROVIDER || "google").toLowerCase() === "atlas" ? "atlas" : "google";
// Gemini Omni remplace Veo 3.1 (préversions arrêtées le 22 octobre 2026) : le modèle est choisi dans video-background.js.
// Ce fichier ne lance pas la génération : il enregistre la demande puis appelle video-background.js
const ATLAS_GENERATE = "https://api.atlascloud.ai/api/v1/model/generateVideo";
// Vidéos incluses par semaine selon l'offre (0 = crédits seulement ; Infinity = illimité).
// Doit rester identique à VIDEO_WEEKLY dans app.js.
const VIDEO_WEEKLY = { essentiel: 2, pro: 4, expert: 6, admin: Infinity };
const RATIOS = ["16:9", "9:16"];

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

// Semaine ISO (lundi au dimanche, en UTC) : 2025-W03 par exemple
function isoWeek(d){
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((x - yearStart) / 86400000 + 1) / 7);
  return x.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
}
const weekKey = (email) => "videoweek|" + encodeURIComponent(email) + "|" + isoWeek(new Date());
// Nom de fichier sûr pour les clés de stockage
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

// Déclenche video-background.js : la réponse 202 arrive tout de suite, la génération se poursuit sans bloquer
async function startBackground(event, email, id) {
  const base = process.env.URL || (event.headers && event.headers.host ? "https://" + event.headers.host : "");
  if (!base) return false;
  try {
    const r = await fetch(base + "/.netlify/functions/video-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, id }),
    });
    return r.status === 202 || r.ok;
  } catch (e) {
    console.error("KARAT video: lancement en arrière-plan", e.message);
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  const email = cleanEmail(data.email);
  if (!email) return json(401, { error: "Connectez-vous pour générer une vidéo" });

  const prompt = String(data.prompt || "").trim().slice(0, 4000);
  if (prompt.length < 10) return json(400, { error: "Décrivez la vidéo en quelques phrases" });

  // Vidéos de 8 secondes en 720p uniquement : c'est le réglage vendu (1 crédit = 1 vidéo de 8 secondes)
  const durationSeconds = 8;
  const resolution = "720p";
  const aspectRatio = RATIOS.includes(data.aspectRatio) ? data.aspectRatio : "16:9";

  // Image d'exemple facultative : la vidéo part de cette image (JPG, PNG ou WebP, 3 Mo au plus)
  const ref = typeof data.ref === "string" && data.ref.length <= 4000000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data.ref) ? data.ref : null;
  if (data.ref && !ref) return json(400, { error: "Image d'exemple refusée : utilisez une photo JPG, PNG ou WebP de 3 Mo au plus." });
  if (ref && PROVIDER === "atlas") return json(400, { error: "L'image d'exemple n'est pas prise en charge avec ce fournisseur vidéo." });

  // L'offre est vérifiée sur le serveur, jamais seulement dans le navigateur
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible, réessayez" }); }
  // Sans abonnement : aucune vidéo incluse, la génération se paie uniquement avec des crédits
  const weekly = plan ? VIDEO_WEEKLY[plan] : 0;

  // Quota inclus cette semaine, sinon crédits
  const store = blobStore("karat-quota");
  const key = weekKey(email);
  let used = 0;
  try { used = ((await store.get(key, { type: "json" })) || {}).n || 0; }
  catch (e) { console.error("KARAT video: lecture du compteur", e.message); }

  const source = used < weekly ? "quota" : "credit";
  if (source === "credit") {
    let credits = 0;
    try { credits = await balanceOf(email); }
    catch (e) { console.error("KARAT video: lecture des crédits", e.message); return json(503, { error: "Solde de crédits indisponible, réessayez" }); }
    if (credits < 1) {
      const incl = (weekly === Infinity || weekly === 0) ? "" : weekly + " vidéos incluses par semaine sont utilisées. ";
      return json(402, { error: incl + "Achetez des crédits (5 € par vidéo de 8 secondes) pour continuer." });
    }
  }

  // Appel du fournisseur choisi
  let name = null, why = "", busy = false;
  try {
    if (PROVIDER === "atlas") {
      const apiKey = process.env.ATLAS_API_KEY;
      if (!apiKey) return json(500, { error: "Génération vidéo non configurée (ATLAS_API_KEY manquante)" });
      const r = await fetch(ATLAS_GENERATE, {
        method: "POST",
        headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.VIDEO_MODEL || "google/veo3.1/text-to-video",
          prompt,
          aspect_ratio: aspectRatio,
          duration: durationSeconds,
          resolution,
          generate_audio: process.env.VIDEO_AUDIO !== "false",
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.data && d.data.id) name = "atlas:" + String(d.data.id);
      else { why = (d && (d.message || d.error)) || ""; console.error("KARAT video: Atlas refuse", r.status, JSON.stringify(d).slice(0, 500)); }
    } else {
      // Gemini Omni ne renvoie pas d'opération à suivre : l'identifiant est créé ici, la génération suit en arrière-plan
      if (!process.env.GOOGLE_API_KEY) return json(500, { error: "Génération vidéo non configurée (GOOGLE_API_KEY manquante)" });
      name = "omni:" + crypto.randomUUID();
    }
  } catch (e) {
    console.error("KARAT video: service injoignable", PROVIDER, e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }

  if (!name) {
    // Limite de débit atteinte chez le fournisseur : message clair, et aucun crédit n'est débité
    if (busy) return json(503, { error: "Le service vidéo est très sollicité en ce moment. Réessayez dans quelques minutes : aucun crédit n'a été débité." });
    return json(502, { error: "Le service vidéo a refusé la demande" + (why ? " : " + String(why).slice(0, 200) : "") });
  }

  const isOmni = name.startsWith("omni:");
  const sid = safeName(name);
  if (isOmni) {
    // La demande est enregistrée avant tout lancement : la fonction d'arrière-plan ne la trouvera qu'ainsi
    try {
      const vstore = blobStore("karat-videos");
      await vstore.setJSON(jobKey(email, sid), { prompt, durationSeconds, aspectRatio, resolution, createdAt: Date.now(), source, refunded: false, status: "queued" });
      if (ref) await vstore.setJSON(refKey(email, sid), { ref });
    } catch (e) {
      console.error("KARAT video: écriture de la demande", e.message);
      return json(503, { error: "Demande impossible à enregistrer, réessayez. Aucun crédit n'a été débité." });
    }
  } else {
    // On garde les informations de la demande, pour les retrouver quand la vidéo est prête
    try {
      await blobStore("karat-videos").setJSON("job|" + encodeURIComponent(email) + "|" + safeName(name), {
        prompt, durationSeconds, aspectRatio, resolution, createdAt: Date.now(), source, refunded: false,
      });
    } catch (e) { console.error("KARAT video: écriture de la demande", e.message); }
  }

  // Décompte, seulement maintenant que la génération est acceptée
  if (source === "quota") {
    try { await store.setJSON(key, { n: used + 1 }); }
    catch (e) { console.error("KARAT video: écriture du compteur", e.message); }
  } else {
    try { await takeCredit(email); }
    catch (e) { console.error("KARAT video: décompte du crédit", e.message); }
  }

  if (isOmni) {
    const started = await startBackground(event, email, name);
    if (!started) {
      // Le lancement a échoué : le quota ou le crédit est rendu tout de suite
      await refundOnce(email, sid);
      return json(503, { error: "Le service vidéo est indisponible, réessayez. Aucun crédit n'a été débité." });
    }
  }

  const remaining = source === "quota" && weekly !== Infinity ? weekly - used - 1 : null;
  return json(200, { id: name, remaining, source });
};
