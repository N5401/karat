// KARAT — génération d'images via l'API OpenAI (gpt-image).
// POST {email, prompt, ref?}  ref = photo de référence optionnelle (data:image/...;base64,...)
// Quotas par jour selon l'offre (voir _shared/acces.js) : Essentiel 3, Pro 5, Expert illimité.
// Variables Netlify : OPENAI_API_KEY, STRIPE_SECRET_KEY, NETLIFY_TOKEN, SITE_ID.
// Chaque image est facturée par OpenAI : vérifiez votre solde sur platform.openai.com.

const { planFor, imageQuota, addImageUse, cleanEmail, PLAN_LABEL } = require("./_shared/acces");

// Modèle et qualité : modifiables ici ou dans les variables Netlify.
const IMAGE_MODEL = process.env.IMAGE_MODEL || "gpt-image-2.5-sunburst";
const IMAGE_QUALITY = process.env.IMAGE_QUALITY || "medium";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json(500, { error: "Clé de génération d'images non configurée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  const email = cleanEmail(data.email);
  if (!email) return json(401, { error: "Connectez-vous pour générer des images." });
  const prompt = String(data.prompt || "").trim().slice(0, 1000);
  if (!prompt) return json(400, { error: "Décrivez l'image souhaitée" });
  const ref = typeof data.ref === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data.ref) ? data.ref : null;

  // Offre et quota du jour
  let plan, quota;
  try {
    plan = await planFor(email);
    if (!plan) return json(403, { error: "Choisissez une offre pour générer des images." });
    quota = await imageQuota(email, plan);
  } catch (e) {
    console.error("KARAT image: offre/quota", e.message);
    return json(502, { error: "Vérification de l'offre impossible, réessayez." });
  }
  if (quota.used >= quota.limit){
    return json(429, {
      error: `Limite atteinte : ${quota.limit} images par jour avec l'offre ${PLAN_LABEL[plan] || plan}. Revenez demain ou passez à une offre supérieure.`,
      remaining: 0,
    });
  }

  try {
    let r;
    if (ref){
      // Création ou retouche à partir d'une photo de référence
      const form = new FormData();
      form.append("model", IMAGE_MODEL);
      form.append("prompt", prompt);
      form.append("size", "1024x1024");
      form.append("quality", IMAGE_QUALITY);
      form.append("n", "1");
      const mime = ref.slice(5, ref.indexOf(";"));
      const bytes = Buffer.from(ref.slice(ref.indexOf(",") + 1), "base64");
      form.append("image", new Blob([bytes], { type: mime }), "reference.jpg");
      r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: "Bearer " + apiKey }, body: form });
    } else {
      r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({ model: IMAGE_MODEL, prompt, size: "1024x1024", quality: IMAGE_QUALITY, n: 1 }),
      });
    }
    const result = await r.json().catch(() => ({}));
    if (!r.ok || !result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error("KARAT image: erreur API", r.status, JSON.stringify(result).slice(0, 500));
      return json(502, { error: "Le générateur d'images a renvoyé une erreur" });
    }
    await addImageUse(email, quota.used);
    const unlimited = quota.limit === Infinity;
    return json(200, {
      image: "data:image/png;base64," + result.data[0].b64_json,
      remaining: unlimited ? null : quota.limit - quota.used - 1,
      limit: unlimited ? null : quota.limit,
    });
  } catch (e) {
    console.error("KARAT image: injoignable", e.message);
    return json(502, { error: "Service d'images injoignable" });
  }
};
