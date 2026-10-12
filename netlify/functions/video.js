// KARAT — génération de vidéos, réservée à l'offre Expert (et à l'administrateur).
// Le site envoie la demande ici ; la fonction la transmet à Atlas Cloud et renvoie un identifiant.
// Le site interroge ensuite video-result.js jusqu'à ce que la vidéo soit prête.
// Variables : ATLAS_API_KEY (clé Atlas Cloud), VIDEO_MODEL (défaut google/veo3.1/text-to-video),
// STRIPE_SECRET_KEY (offre), NETLIFY_TOKEN + SITE_ID (compteur mensuel).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

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

// Compteur par adresse et par mois : video|email|2026-10
const monthKey = (email) => "video|" + encodeURIComponent(email) + "|" + new Date().toISOString().slice(0, 7);

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

  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) return json(500, { error: "Génération vidéo non configurée" });

  let r, d;
  try {
    r = await fetch(ATLAS_GENERATE, {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      // Noms des champs selon la fiche Atlas Cloud : aspect_ratio, duration, resolution, generate_audio (sans son par défaut)
      body: JSON.stringify({
        model: process.env.VIDEO_MODEL || "google/veo3.1/text-to-video",
        prompt,
        aspect_ratio: aspectRatio,
        duration: durationSeconds,
        resolution,
        generate_audio: false,
      }),
    });
    d = await r.json().catch(() => ({}));
  } catch (e) {
    console.error("KARAT video: service injoignable", e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }

  const id = d && d.data && d.data.id;
  if (!r.ok || !id) {
    const why = (d && (d.message || d.error || (d.data && d.data.error))) || "";
    console.error("KARAT video: demande refusée", r.status, JSON.stringify(d).slice(0, 500));
    return json(502, { error: "Le service vidéo a refusé la demande" + (why ? " : " + String(why).slice(0, 200) : "") });
  }

  // Le compteur n'avance qu'une fois la génération acceptée
  try { await store.setJSON(key, { n: used + 1 }); }
  catch (e) { console.error("KARAT video: écriture du compteur", e.message); }

  const remaining = limit === Infinity ? null : limit - used - 1;
  return json(200, { id, remaining });
};
