// KARAT — génération d'images en arrière-plan (fonction « background » Netlify : jusqu'à 15 minutes).
// Le site appelle image-background, qui répond 202 tout de suite ; le résultat est écrit sur Netlify Blobs
// (clé « img_<id> » dans karat-ai), et le site le récupère avec image-result.js.
// Variables : OPENAI_API_KEY, IMAGE_MODEL, IMAGE_QUALITY, NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, imageQuota, addImageUse, cleanEmail, imageLimitText } = require("./_shared/acces");

const IMAGE_MODEL = process.env.IMAGE_MODEL || "gpt-image-2.5-sunburst";
const IMAGE_QUALITY = process.env.IMAGE_QUALITY || "medium";

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const cleanId = (v) => String(v || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);

// Une seconde tentative en cas de coupure réseau ou de réponse 429 / 5xx du générateur
async function withRetry(request){
  let r = null, err = null;
  for (let i = 0; i < 2; i++){
    try {
      r = await request();
      if (r.status !== 429 && r.status < 500) return r;
      err = null;
    } catch (e) { r = null; err = e; }
    if (i === 0) await new Promise(res => setTimeout(res, 4000));
  }
  if (r) return r;   // dernière réponse du générateur
  throw err;
}

// Points images offerts par l'administrateur (karat-bonus) : utilisés une fois le quota du jour épuisé
const bonusKey = (email) => "img|" + encodeURIComponent(email);
async function readBonus(email) {
  try {
    const b = await blobStore("karat-bonus").get(bonusKey(email), { type: "json" });
    return b && typeof b.n === "number" ? b.n : 0;
  } catch (e) {
    console.error("KARAT image: points", e.message);
    return 0;
  }
}
async function writeBonus(email, n) {
  await blobStore("karat-bonus").setJSON(bonusKey(email), { n: Math.max(0, n) });
}

// Galerie « Mes images » : chaque image est conservée sur le site, à l'adresse du compte
async function saveToGallery(email, b64, prompt) {
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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400 }; }
  const id = cleanId(data.id);
  if (!id) return { statusCode: 400 };

  const store = blobStore("karat-ai");
  const key = "img_" + id;
  await store.setJSON(key, { status: "pending", at: Date.now() });
  const fail = (msg) => store.setJSON(key, { status: "error", error: msg });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return await fail("Clé de génération d'images non configurée");

    const email = cleanEmail(data.email);
    if (!email) return await fail("Connectez-vous pour générer des images.");
    const prompt = String(data.prompt || "").trim().slice(0, 1000);
    if (!prompt) return await fail("Décrivez l'image souhaitée");
    const ref = typeof data.ref === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data.ref) ? data.ref : null;

    // Offre, quota du jour et points offerts
    let plan, quota, bonus;
    try {
      plan = (await planFor(email)) || "gratuit";
      quota = await imageQuota(email, plan);
      bonus = await readBonus(email);
    } catch (e) {
      console.error("KARAT image: offre/quota", e.message);
      return await fail("Vérification de l'offre impossible, réessayez.");
    }
    const useBonus = quota.used >= quota.limit;
    if (useBonus && bonus < 1) {
      return await fail(imageLimitText(plan, quota));
    }

    // Appel au générateur (peut durer plus d'une minute : d'où la fonction en arrière-plan)
    const request = () => {
      if (ref) {
        const form = new FormData();
        form.append("model", IMAGE_MODEL);
        form.append("prompt", prompt);
        form.append("size", "1024x1024");
        form.append("quality", IMAGE_QUALITY);
        form.append("n", "1");
        const mime = ref.slice(5, ref.indexOf(";"));
        const bytes = Buffer.from(ref.slice(ref.indexOf(",") + 1), "base64");
        form.append("image", new Blob([bytes], { type: mime }), "reference.jpg");
        return fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: "Bearer " + apiKey }, body: form });
      }
      return fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({ model: IMAGE_MODEL, prompt, size: "1024x1024", quality: IMAGE_QUALITY, n: 1 }),
      });
    };
    const r = await withRetry(request);
    const result = await r.json().catch(() => ({}));
    if (!r.ok || !result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error("KARAT image: erreur API", r.status, JSON.stringify(result).slice(0, 500));
      return await fail("Le générateur d'images a renvoyé une erreur");
    }
    const b64 = result.data[0].b64_json;

    // Une image payée n'est jamais perdue à cause d'une erreur d'écriture du compteur
    if (useBonus) await writeBonus(email, bonus - 1).catch(e => console.error("KARAT image: points", e.message));
    else await addImageUse(email, quota.used, plan).catch(e => console.error("KARAT image: compteur", e.message));
    const imageId = await saveToGallery(email, b64, prompt);
    const unlimited = quota.limit === Infinity;
    await store.setJSON(key, {
      status: "done",
      image: "data:image/png;base64," + b64,
      id: imageId,
      remaining: unlimited ? null : (useBonus ? 0 : quota.limit - quota.used - 1),
      limit: unlimited ? null : quota.limit,
      bonus: useBonus ? bonus - 1 : bonus,
    });
  } catch (e) {
    console.error("KARAT image-background: injoignable", e.message);
    await fail("Service d'images injoignable, réessayez.");
  }
  return { statusCode: 202 };
};
