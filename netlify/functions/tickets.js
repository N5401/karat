// KARAT — tickets de support, stockés sur Netlify Blobs.
// GET  ?email=...  : tickets d'un utilisateur.
// GET  ?all=1      : tous les tickets (administrateur, en-tête x-admin-token).
// POST {email,name,subject,message} : crée un ticket (public, 5 tickets par heure et par email au maximum).
// POST {action:"reply"|"status"|"delete", id, reply?} : gestion par l'administrateur (x-admin-token).

const { getStore } = require("@netlify/blobs");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const store = getStore("karat-tickets");
  let list = (await store.get("liste", { type: "json" })) || [];
  const headers = event.headers || {};
  const token = headers["x-admin-token"] || headers["X-Admin-Token"] || "";
  const isAdm = !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;

  if (event.httpMethod === "GET") {
    const q = event.queryStringParameters || {};
    if (q.all) {
      if (!isAdm) return json(401, { error: "Jeton administrateur invalide" });
      return json(200, { tickets: list });
    }
    const email = String(q.email || "").trim().toLowerCase();
    if (!email) return json(400, { error: "Email requis" });
    return json(200, { tickets: list.filter(t => t.email === email) });
  }

  if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Requête invalide" }); }

  if (data.action) {
    if (!isAdm) return json(401, { error: "Jeton administrateur invalide" });
    if (data.action === "delete") {
      list = list.filter(t => t.id !== data.id);
    } else {
      const t = list.find(x => x.id === data.id);
      if (!t) return json(404, { error: "Ticket introuvable" });
      if (data.action === "reply") {
        t.reply = String(data.reply || "").trim().slice(0, 2000);
        t.status = "traité";
        t.repliedAt = Date.now();
      } else if (data.action === "status") {
        t.status = t.status === "ouvert" ? "traité" : "ouvert";
      } else {
        return json(400, { error: "Action inconnue" });
      }
    }
  } else {
    const now = Date.now();
    const email = String(data.email || "").trim().toLowerCase();
    const subject = String(data.subject || "").trim().slice(0, 120);
    const message = String(data.message || "").trim().slice(0, 2000);
    if (!email || !subject || !message) return json(400, { error: "Sujet et message requis" });
    if (list.filter(x => x.email === email && x.createdAt > now - 3600000).length >= 5) {
      return json(429, { error: "Trop de tickets envoyés : réessayez plus tard" });
    }
    list.unshift({
      id: now.toString(36) + Math.random().toString(36).slice(2, 6),
      email,
      name: String(data.name || "").trim().slice(0, 120),
      subject, message,
      status: "ouvert", reply: "", createdAt: now,
    });
  }

  list = list.slice(0, 1000);
  await store.setJSON("liste", list);
  return json(200, { ok: true });
};
