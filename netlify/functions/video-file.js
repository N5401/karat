// KARAT — renvoie une vidéo sauvegardée (lecture dans la page et téléchargement), uniquement à son abonné Expert.
// Netlify limite chaque réponse de fonction à environ 6 Mo (encodage compris) : la vidéo est donc envoyée
// par morceaux, comme le fait le lecteur vidéo du navigateur (requêtes « Range »).
// Variables : STRIPE_SECRET_KEY (offre), NETLIFY_TOKEN + SITE_ID (si besoin).

const { getStore } = require("@netlify/blobs");
const { planFor, cleanEmail } = require("./_shared/acces");

const ALLOWED = ["essentiel", "pro", "expert", "admin"];
// 3 Mo par morceau : environ 4 Mo une fois encodé en base64, bien sous la limite
const CHUNK = 3 * 1024 * 1024;

const blobStore = (name) => (process.env.NETLIFY_TOKEN && process.env.SITE_ID)
  ? getStore({ name, siteID: process.env.SITE_ID, token: process.env.NETLIFY_TOKEN })
  : getStore(name);

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

// Plage demandée (« bytes=début-fin »). Sans plage, on renvoie le premier morceau.
function pickRange(header, total) {
  let start = 0;
  let end = Math.min(CHUNK, total) - 1;
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header || "").trim());
  if (m && (m[1] !== "" || m[2] !== "")) {
    if (m[1] === "") { // forme « les N derniers octets »
      start = Math.max(0, total - Number(m[2]));
      end = total - 1;
    } else {
      start = Number(m[1]);
      end = m[2] === "" ? start + CHUNK - 1 : Number(m[2]);
    }
    if (start >= total) return null;
    end = Math.min(end, total - 1, start + CHUNK - 1);
  }
  return { start, end };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

  const q = event.queryStringParameters || {};
  const id = String(q.id || "");
  if (!/^[\w.-]{1,160}$/.test(id)) return json(400, { error: "Identifiant invalide" });

  const email = cleanEmail(q.email);
  let plan = null;
  try { plan = await planFor(email); } catch (e) { return json(503, { error: "Vérification de l'offre impossible" }); }
  if (!ALLOWED.includes(plan)) return json(403, { error: "Réservé aux abonnés payants." });

  let rec = null;
  try { rec = await blobStore("karat-videos").get("file|" + encodeURIComponent(email) + "|" + id, { type: "json" }); }
  catch (e) { console.error("KARAT video-file:", e.message); }
  if (!rec || !rec.b64) return json(404, { error: "Vidéo introuvable" });

  const buf = Buffer.from(rec.b64, "base64");
  const total = buf.length;
  const h = event.headers || {};
  const range = pickRange(h.range || h.Range, total);
  if (!range) {
    return { statusCode: 416, headers: { "Content-Range": "bytes */" + total, "Accept-Ranges": "bytes" }, body: "" };
  }

  const part = buf.subarray(range.start, range.end + 1);
  return {
    statusCode: 206,
    isBase64Encoded: true,
    headers: {
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${range.start}-${range.end}/${total}`,
      "Cache-Control": "private, max-age=3600",
    },
    body: part.toString("base64"),
  };
};
