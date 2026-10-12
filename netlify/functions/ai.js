// KARAT — fonction serveur Netlify qui relie le site à l'API Claude.
// La clé est lue dans les variables d'environnement Netlify (ANTHROPIC_API_KEY),
// jamais dans ce fichier ni dans le site.

const MODES = {
  general: "Tu es KARAT, un assistant polyvalent. Réponds clairement et en français, avec des synthèses et une aide à la décision.",
  code: "Tu es KARAT, un assistant de développement : débogage, refactorisation, tests et revue de code. Écris un code propre, expliqué brièvement, et signale les risques.",
  redaction: "Tu es KARAT, un assistant de rédaction. Reformule et rédige dans un ton sobre et professionnel, en français.",
  data: "Tu es KARAT, un assistant d'analyse de données. Analyse avec rigueur, structure les réponses, propose des calculs vérifiables et des graphiques utiles.",
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
  if (!apiKey) return json(500, { error: "Clé API non configurée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }
  if (!Array.isArray(data.messages)) return json(400, { error: "Requête invalide" });

  // Historique nettoyé : rôles valides, premier message = utilisateur, 20 derniers échanges au plus
  let messages = data.messages
    .filter(m => m && typeof m.content === "string" && m.content.trim() !== "")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.slice(0, 160000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  messages = messages.slice(-20);
  if (!messages.length) return json(400, { error: "Aucun message" });

  // Images et PDF joints au dernier message
  const imgs = (Array.isArray(data.images) ? data.images : [])
    .filter(x => typeof x === "string" && /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(x))
    .slice(0, 12);
  const pdfs = (Array.isArray(data.pdfs) ? data.pdfs : [])
    .filter(x => typeof x === "string" && /^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(x))
    .slice(0, 10);
  const imgNames = Array.isArray(data.imageNames) ? data.imageNames.map(n => String(n).slice(0, 120)) : [];
  const pdfNames = Array.isArray(data.pdfNames) ? data.pdfNames.map(n => String(n).slice(0, 120)) : [];
  if (imgs.length || pdfs.length){
    const last = messages[messages.length - 1];
    if (last.role === "user"){
      last.content = [
        // Chaque fichier est annoncé par son nom, pour que l'IA sache lequel est lequel
        ...imgs.flatMap((d, i) => [
          { type: "text", text: `Image ${i + 1}${imgNames[i] ? " : " + imgNames[i] : ""}` },
          { type: "image", source: { type: "base64", media_type: d.slice(5, d.indexOf(";")), data: d.slice(d.indexOf(",") + 1) } },
        ]),
        ...pdfs.flatMap((d, i) => [
          { type: "text", text: `Document PDF ${i + 1}${pdfNames[i] ? " : " + pdfNames[i] : ""}` },
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: d.slice(d.indexOf(",") + 1) } },
        ]),
        { type: "text", text: last.content },
      ];
    }
  }

  const FORMAT = "\n\nMise en forme : quand plusieurs fichiers, images ou documents sont joints, identifie chacun par son nom, réponds à la demande pour chacun, et dis clairement ce que tu n'as pas pu lire. Réponds de façon complète : ne tronque pas une réponse longue, découpe-la en parties claire quand c'est utile. Quand tu donnes du code, mets-le dans un bloc entouré de trois apostrophes inversées, avec sur la première ligne le langage puis le nom exact du fichier à créer (exemple : html index.html). Un fichier par bloc. Utilise des paragraphes courts et des listes simples, sans titres inutiles.";
  const system = (MODES[data.mode] || "Tu es KARAT, un assistant IA sobre et utile. Réponds en français.") + FORMAT;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 6000, system, messages }),
    });
    const result = await r.json();
    if (!r.ok || !Array.isArray(result.content)) {
      console.error("KARAT ai: erreur API", r.status, "modele=" + model, JSON.stringify(result).slice(0, 800));
      return json(502, { error: "Le moteur IA a renvoyé une erreur" });
    }
    const reply = result.content.filter(b => b.type === "text").map(b => b.text).join("");
    return json(200, { reply });
  } catch (e) {
    console.error("KARAT ai: injoignable");
    return json(502, { error: "Service IA injoignable" });
  }
};
