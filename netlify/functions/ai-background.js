// KARAT — génération des réponses en arrière-plan.
// Les fonctions « arrière-plan » de Netlify peuvent travailler jusqu'à 15 minutes (une fonction normale s'arrête après 10 secondes).
// Le site appelle cette fonction, qui renvoie tout de suite 202, puis écrit la réponse sur Netlify Blobs ;
// le site la récupère ensuite avec ai-result.js.
// Variables : ANTHROPIC_API_KEY, ANTHROPIC_MODEL (Essentiel et Pro, défaut claude-sonnet-5-5),
// ANTHROPIC_MODEL_EXPERT (Expert, défaut claude-opus-5-5), et NETLIFY_TOKEN + SITE_ID (stockage des réponses).

const { getStore } = require("@netlify/blobs");
const { planFor, msgQuota, addMsgUse, cleanEmail, MSG_QUOTA, ANSWER_TOKENS, TIER_LABEL } = require("./_shared/acces");

const aiStore = () => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name: "karat-ai", siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore("karat-ai");

const MODES = {
  general: "Tu es KARAT, un assistant polyvalent. Réponds clairement et en français, avec des synthèses et une aide à la décision.",
  code: "Tu es KARAT, un assistant de développement : débogage, refactorisation, tests et revue de code. Écris un code propre, expliqué brièvement, et signale les risques.",
  redaction: "Tu es KARAT, un assistant de rédaction. Reformule et rédige dans un ton sobre et professionnel, en français.",
  data: "Tu es KARAT, un assistant d'analyse de données. Analyse avec rigueur, structure les réponses, propose des calculs vérifiables et des graphiques utiles.",
};

const cleanId = v => String(v || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);

// Consigne de brièveté pour l'essai gratuit (les autres offres n'ont pas de consigne de longueur)
const TIER_NOTE = {
  gratuit: "\n\nOffre gratuite : réponds brièvement, l'essentiel en 150 mots maximum, sans détailler.",
};
// Message affiché quand la limite quotidienne de messages est atteinte
const limitMsg = (tier, limit) => {
  const next = tier === "gratuit" ? `Passez à l'offre Essentiel pour ${MSG_QUOTA.essentiel} messages par jour.`
    : tier === "essentiel" ? `Passez à l'offre Pro pour ${MSG_QUOTA.pro} messages par jour.`
    : tier === "pro" ? `Passez à l'offre Expert pour ${MSG_QUOTA.expert} messages par jour.`
    : "Revenez demain pour poursuivre la conversation.";
  return `Vous avez atteint la limite de ${limit} messages pour aujourd'hui (${TIER_LABEL[tier]}). Elle se remet à zéro chaque jour. ${next}`;
};

// Message affiché quand le moteur refuse ou ne renvoie aucun texte (sinon la bulle resterait vide)
const REFUS = "Je ne peux pas répondre à cette demande. Précisez votre besoin et je vous aide.";
// Règle de sécurité ajoutée à chaque réponse
const POLICY = "\n\nRègle : tu ne fournis pas de logiciel de triche (spoofer, cheat, contournement d'anticheat ou de bans, injection dans un jeu), de malware, ni d'aide à pirater un compte ou un système. Dans ce cas, tu le dis en une ou deux phrases, sans détailler, et tu proposes une alternative légale.";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "" }; }
  const id = cleanId(data.id);
  if (!id) return { statusCode: 400, body: "" };
  const store = aiStore();
  await store.setJSON(id, { status: "pending", at: Date.now() });

  const fail = (msg) => store.setJSON(id, { status: "error", error: msg });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  // Modèle selon l'offre : Expert = modèle le plus avancé ; Essentiel et Pro = modèle standard
  let plan = null;
  try { plan = await planFor(data.email); } catch (e) { plan = null; }
  const model = (plan === "expert" || plan === "admin")
    ? (process.env.ANTHROPIC_MODEL_EXPERT || "claude-opus-5-5")
    : (process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5");
  if (!apiKey) { await fail("Clé API non configurée"); return { statusCode: 200, body: "" }; }
  if (!Array.isArray(data.messages)) { await fail("Requête invalide"); return { statusCode: 200, body: "" }; }

  // Historique : rôles valides, premier message = utilisateur, 20 derniers échanges au plus
  let messages = data.messages
    .filter(m => m && typeof m.content === "string" && m.content.trim() !== "")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.slice(0, 160000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  messages = messages.slice(-20);
  if (!messages.length) { await fail("Aucun message"); return { statusCode: 200, body: "" }; }

  // Quota de messages du jour selon l'offre (sans offre = essai gratuit)
  const tier = plan || "gratuit";
  const email = cleanEmail(data.email);
  if (!email) { await fail("Connectez-vous pour utiliser l'IA"); return { statusCode: 200, body: "" }; }
  try {
    const q = await msgQuota(email, tier);
    if (q.used >= q.limit) {
      await store.setJSON(id, { status: "done", reply: limitMsg(tier, q.limit), stopped: false });
      return { statusCode: 200, body: "" };
    }
    await addMsgUse(email, q.used);
  } catch (e) {
    console.error("KARAT ai-bg: compteur de messages", e.message); // si le compteur est indisponible, on ne bloque pas le chat
  }

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
  const system = (MODES[data.mode] || "Tu es KARAT, un assistant IA sobre et utile. Réponds en français.") + FORMAT + POLICY + (TIER_NOTE[tier] || "");

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: ANSWER_TOKENS[tier] || 12000, system, messages }),
    });
    const result = await r.json();
    if (!r.ok || !Array.isArray(result.content)) {
      console.error("KARAT ai-bg: erreur API", r.status, "modele=" + model, JSON.stringify(result).slice(0, 800));
      await fail("Le moteur IA a renvoyé une erreur");
      return { statusCode: 200, body: "" };
    }
    let reply = result.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
    const stopped = result.stop_reason === "max_tokens";
    if (!reply || result.stop_reason === "refusal") {
      console.warn("KARAT ai-bg: réponse vide ou refusée", "stop=" + result.stop_reason, "modele=" + model);
      if (!reply) reply = REFUS;
    }
    await store.setJSON(id, { status: "done", reply, stopped });
  } catch (e) {
    console.error("KARAT ai-bg: injoignable", e.message);
    await fail("Service IA injoignable");
  }
  return { statusCode: 200, body: "" };
};
