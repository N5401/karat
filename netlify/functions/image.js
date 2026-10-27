// KARAT — génération d'images via l'API OpenAI (gpt-image).
// POST {email, prompt, ref?}  ref = photo de référence optionnelle (data:image/...;base64,...)
// Quotas selon l'offre (voir _shared/acces.js) : version gratuite 3 images tous les 2 jours (non cumulables), Essentiel 3 par jour, Pro et Expert illimité.
// Variables Netlify : OPENAI_API_KEY, STRIPE_SECRET_KEY, NETLIFY_TOKEN, SITE_ID.
// Chaque image est facturée par OpenAI : vérifiez votre solde sur platform.openai.com.

const { planFor, imageQuota, addImageUse, cleanEmail, imageLimitText } = require("./_shared/acces");

// Modèle et qualité : modifiables ici ou dans les variables Netlify.
const IMAGE_MODEL = process.env.IMAGE_MODEL || "gpt-image-2.5-sunburst";
const IMAGE_QUALITY = process.env.IMAGE_QUALITY || "medium";

const { getStore } = require("@netlify/blobs");

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

// Points images offerts par l'administrateur (karat-bonus) : utilisés une fois le quota du jour épuisé
const bonusKey = (email) => "img|" + encodeURIComponent(email);
async function readBonus(email){
  try {
    const b = await blobStore("karat-bonus").get(bonusKey(email), { type: "json" });
    return b && typeof b.n === "number" ? b.n : 0;
  } catch (e) {
    console.error("KARAT image: points", e.message);
    return 0;
  }
}
async function writeBonus(email, n){
  await blobStore("karat-bonus").setJSON(bonusKey(email), { n: Math.max(0, n) });
}

// Galerie « Mes images » : chaque image est conservée sur le site, à l'adresse du compte
async function saveToGallery(email, b64, prompt){
  try {
    const q = encodeURIComponent(email);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const store = blobStore("karat-images");
    await store.setJSON("file|" + q + "|" + id, { b64, mime: "image/png" });
    const list = (await store.get("list|" + q, { type: "json" })) || [];
    list.unshift({ id, prompt: String(prompt).slice(0, 300), createdAt: Date.now() });
    await store.setJSON("list|" + q, list.slice(0, 200));
    return id;
  } catch (e) {
    console.error("KARAT image: galerie", e.message);
    return null;
  }
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const DOC_RE = /(carte|pi[eè]ce)\s+d'identit[eé]|passeport|permis\s+de\s+conduire|titre\s+de\s+s[eé]jour|carte\s+vitale|acte\s+de\s+naissance|convocation|\bfaux\s+(document|papier|billet|dipl[oô]me|passeport|permis|justificatif|cachet)|cachet\s+(officiel|de\s+la|de\s+l'|du\s+minist)|(affiche|flyer|avis|annonce|recrutement|recrute)[^.\n]{0,60}(police|gendarmerie|sheriff|bcso|pr[eé]fecture|mairie|tribunal|minist[eè]re)/i;
const DOC_MSG = "Demande refusée : KARAT ne génère pas de documents officiels (pièce d'identité, convocation, cachet ou affiche d'administration).";
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
  if (DOC_RE.test(prompt)) return json(400, { error: DOC_MSG });
  const ref = typeof data.ref === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data.ref) ? data.ref : null;

  // Offre et quota du jour
  let plan, quota, bonus = 0;
  try {
    plan = (await planFor(email)) || "gratuit";   // sans offre : version gratuite
    quota = await imageQuota(email, plan);
    bonus = await readBonus(email);
  } catch (e) {
    console.error("KARAT image: offre/quota", e.message);
    return json(502, { error: "Vérification de l'offre impossible, réessayez." });
  }
  // Quota du jour épuisé : on utilise les points offerts par l'administrateur, s'il en reste
  const useBonus = quota.used >= quota.limit;
  if (useBonus && bonus < 1){
    return json(429, {
      error: imageLimitText(plan, quota),
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
    // Une image payée n'est jamais perdue à cause d'une erreur d'écriture du compteur
    if (useBonus) await writeBonus(email, bonus - 1).catch(e => console.error("KARAT image: points", e.message));
    else await addImageUse(email, quota.used, plan).catch(e => console.error("KARAT image: compteur", e.message));
    const imageId = await saveToGallery(email, result.data[0].b64_json, prompt);
    const unlimited = quota.limit === Infinity;
    return json(200, {
      image: "data:image/png;base64," + result.data[0].b64_json,
      id: imageId,
      remaining: unlimited ? null : (useBonus ? 0 : quota.limit - quota.used - 1),
      limit: unlimited ? null : quota.limit,
      bonus: useBonus ? bonus - 1 : bonus,
    });
  } catch (e) {
    console.error("KARAT image: injoignable", e.message);
    return json(502, { error: "Service d'images injoignable" });
  }
};
