// KARAT — génération d'images via l'API OpenAI (gpt-image-1).
// La clé est lue dans la variable d'environnement Netlify OPENAI_API_KEY, jamais dans ce fichier.
// Chaque image est facturée par OpenAI : vérifiez votre solde sur platform.openai.com.

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
  const prompt = String(data.prompt || "").trim().slice(0, 1000);
  if (!prompt) return json(400, { error: "Décrivez l'image souhaitée" });

  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", n: 1 }),
    });
    const result = await r.json().catch(() => ({}));
    if (!r.ok || !result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error("KARAT image: erreur API", r.status, JSON.stringify(result).slice(0, 500));
      return json(502, { error: "Le générateur d'images a renvoyé une erreur" });
    }
    return json(200, { image: "data:image/png;base64," + result.data[0].b64_json });
  } catch (e) {
    console.error("KARAT image: injoignable");
    return json(502, { error: "Service d'images injoignable" });
  }
};
