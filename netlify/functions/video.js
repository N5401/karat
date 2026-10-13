// KARAT — lancement d'une vidéo Veo 3.1, pour les abonnés payants (crédits pour les offres sans vidéo incluse).
// Fournisseur choisi par la variable VIDEO_PROVIDER : « google » (défaut) ou « atlas ».
//   google : GOOGLE_API_KEY (clé Google AI Studio), son toujours inclus.
//   atlas  : ATLAS_API_KEY, VIDEO_MODEL (défaut google/veo3.1/text-to-video), VIDEO_AUDIO (défaut « true »).
// Règle : Essentiel inclut 1 vidéo par mois, Pro 3, Expert 6 ; au-delà, chaque vidéo coûte 1 crédit.
// Le crédit ou le quota n'est décompté qu'une fois la génération acceptée par le fournisseur.
// video-result.js suit la génération, sauvegarde la vidéo et rend le crédit si elle échoue.
// Variables communes : STRIPE_SECRET_KEY, STRIPE_CREDIT_PLINK, NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");
const { balanceOf, takeCredit } = require("./_shared/credits");

const PROVIDER = (process.env.VIDEO_PROVIDER || "google").toLowerCase() === "atlas" ? "atlas" : "google";
const GOOGLE_PREDICT = "https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning";
const ATLAS_GENERATE = "https://api.atlascloud.ai/api/v1/model/generateVideo";
// Vidéos incluses par mois selon l'offre (0 = crédits seulement ; Infinity = illimité).
// Doit rester identique à VIDEO_MONTHLY dans app.js.
const VIDEO_MONTHLY = { essentiel: 1, pro: 3, expert: 6, admin: Infinity };
const RATIOS = ["16:9", "9:16"];

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const monthKey = (email) => "video|" + encodeURIComponent(email) + "|" + new Date().toISOString().slice(0, 7);
// Nom de fichier sûr pour les clés de stockage
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  const email = cleanEmail(data.email);
  if (!email) return json(401, { error: "Connectez-vous pour générer une vidéo" });

  const prompt = String(data.prompt || "").trim().slice(0, 1000);
  if (prompt.length < 10) return json(400, { error: "Décrivez la vidéo en quelques phrases" });

  // Vidéos de 8 secondes en 720p uniquement : c'est le réglage vendu (1 crédit = 1 vidéo de 8 secondes)
  const durationSeconds = 8;
  const resolution = "720p";
  const aspectRatio = RATIOS.includes(data.aspectRatio) ? data.aspectRatio : "16:9";

  // L'offre est vérifiée sur le serveur, jamais seulement dans le navigateur
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible, réessayez" }); }
  const monthly = plan ? VIDEO_MONTHLY[plan] : undefined;
  if (monthly === undefined) return json(403, { error: "La génération de vidéos est réservée aux abonnés." });

  // Quota inclus ce mois-ci, sinon crédits
  const store = blobStore("karat-quota");
  const key = monthKey(email);
  let used = 0;
  try { used = ((await store.get(key, { type: "json" })) || {}).n || 0; }
  catch (e) { console.error("KARAT video: lecture du compteur", e.message); }

  const source = used < monthly ? "quota" : "credit";
  if (source === "credit") {
    let credits = 0;
    try { credits = await balanceOf(email); }
    catch (e) { console.error("KARAT video: lecture des crédits", e.message); return json(503, { error: "Solde de crédits indisponible, réessayez" }); }
    if (credits < 1) {
      const incl = monthly === Infinity ? "" : monthly + " vidéos incluses par mois sont utilisées. ";
      return json(402, { error: incl + "Achetez des crédits (5 € par vidéo de 8 secondes) pour continuer." });
    }
  }

  // Appel du fournisseur choisi
  let name = null, why = "";
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
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) return json(500, { error: "Génération vidéo non configurée (GOOGLE_API_KEY manquante)" });
      const r = await fetch(GOOGLE_PREDICT, {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { aspectRatio, durationSeconds, resolution },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.name) name = d.name;
      else { why = (d && d.error && d.error.message) || ""; console.error("KARAT video: Google refuse", r.status, JSON.stringify(d).slice(0, 500)); }
    }
  } catch (e) {
    console.error("KARAT video: service injoignable", PROVIDER, e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }

  if (!name) {
    return json(502, { error: "Le service vidéo a refusé la demande" + (why ? " : " + String(why).slice(0, 200) : "") });
  }

  // On garde les informations de la demande, pour les retrouver quand la vidéo est prête
  try {
    await blobStore("karat-videos").setJSON("job|" + encodeURIComponent(email) + "|" + safeName(name), {
      prompt, durationSeconds, aspectRatio, resolution, createdAt: Date.now(), source, refunded: false,
    });
  } catch (e) { console.error("KARAT video: écriture de la demande", e.message); }

  // Décompte, seulement maintenant que la génération est acceptée
  if (source === "quota") {
    try { await store.setJSON(key, { n: used + 1 }); }
    catch (e) { console.error("KARAT video: écriture du compteur", e.message); }
  } else {
    try { await takeCredit(email); }
    catch (e) { console.error("KARAT video: décompte du crédit", e.message); }
  }

  const remaining = source === "quota" && monthly !== Infinity ? monthly - used - 1 : null;
  return json(200, { id: name, remaining, source });
};
