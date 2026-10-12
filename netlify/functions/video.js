// KARAT — lancement d'une vidéo Veo 3.1 (API Gemini de Google). Réservé à l'offre Expert et à l'administrateur.
// Le site envoie la demande ici ; la fonction lance la génération et renvoie un identifiant de suivi.
// Le site interroge ensuite video-result.js, qui sauvegarde la vidéo une fois prête.
// Variables : GOOGLE_API_KEY (clé Google AI Studio), STRIPE_SECRET_KEY (offre).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

const GOOGLE_PREDICT = "https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning";
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
// Nom de fichier sûr pour les clés de stockage (l'identifiant Google contient des « / »)
const safeName = (name) => String(name).replace(/[^\w.-]/g, "_");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  const email = cleanEmail(data.email);
  if (!email) return json(401, { error: "Connectez-vous pour générer une vidéo" });

  const prompt = String(data.prompt || "").trim().slice(0, 1000);
  if (prompt.length < 10) return json(400, { error: "Décrivez la vidéo en quelques phrases" });

  let durationSeconds = DURATIONS.includes(Number(data.durationSeconds)) ? Number(data.durationSeconds) : 8;
  const resolution = RESOLUTIONS.includes(data.resolution) ? data.resolution : "720p";
  const aspectRatio = RATIOS.includes(data.aspectRatio) ? data.aspectRatio : "16:9";
  // Règle Google : le 1080p ne se fait qu'en 8 secondes
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

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return json(500, { error: "Génération vidéo non configurée" });

  let r, d;
  try {
    r = await fetch(GOOGLE_PREDICT, {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { aspectRatio, durationSeconds: String(durationSeconds), resolution },
      }),
    });
    d = await r.json().catch(() => ({}));
  } catch (e) {
    console.error("KARAT video: Google injoignable", e.message);
    return json(502, { error: "Le service vidéo est injoignable" });
  }

  const name = d && d.name;
  if (!r.ok || !name) {
    const why = (d && d.error && d.error.message) || "";
    console.error("KARAT video: demande refusée", r.status, JSON.stringify(d).slice(0, 500));
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
