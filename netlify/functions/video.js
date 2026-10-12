// KARAT — lancement d'une vidéo Veo 3.1. Réservé à l'offre Expert et à l'administrateur.
// Fournisseur choisi par la variable VIDEO_PROVIDER : « google » (défaut) ou « atlas ».
//   google : GOOGLE_API_KEY (clé Google AI Studio), son toujours inclus.
//   atlas  : ATLAS_API_KEY, VIDEO_MODEL (défaut google/veo3.1/text-to-video), VIDEO_AUDIO (défaut « true »).
// Le site envoie la demande ici ; la fonction lance la génération et renvoie un identifiant de suivi.
// video-result.js suit la génération et sauvegarde la vidéo quand elle est prête.
// Variables communes : STRIPE_SECRET_KEY (offre), NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

const PROVIDER = (process.env.VIDEO_PROVIDER || "google").toLowerCase() === "atlas" ? "atlas" : "google";
const GOOGLE_PREDICT = "https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning";
const ATLAS_GENERATE = "https://api.atlascloud.ai/api/v1/model/generateVideo";
// Vidéos par mois selon l'offre (Infinity = illimité). Doit rester identique à VIDEO_MAX_MONTH dans app.js.
const VIDEO_MONTHLY = { expert: 3, admin: Infinity };
const DURATIONS = [4, 6, 8];
const RESOLUTIONS = ["720p", "1080p"];
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

  const durationSeconds = DURATIONS.includes(Number(data.durationSeconds)) ? Number(data.durationSeconds) : 8;
  const resolution = RESOLUTIONS.includes(data.resolution) ? data.resolution : "720p";
  const aspectRatio = RATIOS.includes(data.aspectRatio) ? data.aspectRatio : "16:9";
  // Règle Google et Atlas : le 1080p ne se fait qu'en 8 secondes
  if (resolution === "1080p" && durationSeconds !== 8) {
    return json(400, { error: "La résolution 1080p demande une durée de 8 secondes." });
  }

  // L'offre est vérifiée sur le serveur, jamais seulement dans le navigateur
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible, réessayez" }); }
  const limit = plan ? VIDEO_MONTHLY[plan] : undefined;
  if (limit === undefined) return json(403, { error: "La génération de vidéos est réservée à l'offre Expert." });

  const store = blobStore("karat-quota");
  const key = monthKey(email);
  let used = 0;
  try { used = ((await store.get(key, { type: "json" })) || {}).n || 0; }
  catch (e) { console.error("KARAT video: lecture du compteur", e.message); }
  if (used >= limit) {
    return json(429, { error: `Limite atteinte : ${limit} vidéos par mois pour l'offre Expert. Le compteur repart le 1er du mois.` });
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
      prompt, durationSeconds, aspectRatio, resolution, createdAt: Date.now(),
    });
  } catch (e) { console.error("KARAT video: écriture de la demande", e.message); }

  // Le compteur n'avance qu'une fois la génération acceptée
  try { await store.setJSON(key, { n: used + 1 }); }
  catch (e) { console.error("KARAT video: écriture du compteur", e.message); }

  const remaining = limit === Infinity ? null : limit - used - 1;
  return json(200, { id: name, remaining });
};
