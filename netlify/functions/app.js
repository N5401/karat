/* =====================================================================
   KARAT — application
   Données : enregistrées dans ce navigateur (démo). Voir la note dans Réglages.
   ===================================================================== */
 
/* ---------- Configuration ---------- */
const CONFIG = {
  GOOGLE_CLIENT_ID: "944959967913-jtiabnp67550tks8i0pq4pe46n0pjkns.apps.googleusercontent.com",
  ADMIN_EMAILS: ["tarzanastral@gmail.com"],
  PAYMENT_LINKS: {
    essentiel: "https://buy.stripe.com/3cI9AL61a1GG8Ql7yr5c400",
    pro:       "https://buy.stripe.com/cNi28j89ifxweaF9Gz5c401",
    expert:    "https://buy.stripe.com/bJe28j0GQclk5E93ib5c402"
  },
  VERIFY_ENDPOINT: "/.netlify/functions/abo",   // serveur qui confirme l'abonnement après paiement (webhook Stripe)
  AI_ENDPOINT: "/.netlify/functions/ai"        // moteur IA réel : POST {mode, messages} -> {reply}
};
 
const PLANS = {
  essentiel: { name: "Essentiel", price: "7,99 €",  num: 7.99,  desc: "Pour découvrir KARAT au quotidien.", feats: ["Panel IA standard", "Fichiers texte et images", "Historique 30 jours", "Support e-mail"] },
  pro:       { name: "Pro",       price: "18,99 €", num: 18.99, desc: "Pour les professionnels qui travaillent chaque jour.", feats: ["Tout Essentiel", "Modules avancés", "Gros fichiers", "Historique illimité", "Support prioritaire"] },
  expert:    { name: "Expert",    price: "39,99 €", num: 39.99, desc: "Pour les équipes et l'automatisation à grande échelle.", feats: ["Tout Pro", "Workflows automatisés", "Accès API", "Priorité de traitement", "Accompagnement dédié"] }
};
 
const MODES = {
  general:   { name: "Général",   icon: "chat",  desc: "Un assistant polyvalent pour répondre, comprendre et décider.", bullets: ["Résumés et synthèses", "Explications claires", "Aide à la décision"], sub: "Module général" },
  code:      { name: "Code",      icon: "code",  desc: "Débogage, refactorisation, tests et revue de code.", bullets: ["Trouver un bug", "Optimiser une fonction", "Écrire des tests"], sub: "Module développement" },
  redaction: { name: "Rédaction", icon: "edit",  desc: "Reformulation, raccourcissement et rédaction de textes.", bullets: ["Reformuler un passage", "Adapter le ton", "Résumer un texte"], sub: "Module écriture" },
  data:      { name: "Données",   icon: "grid", desc: "Analyse de tableaux, tendances et propositions de graphiques.", bullets: ["Analyser un CSV", "Repérer les tendances", "Proposer des graphiques"], sub: "Module analyse" }
};
 
const SUGGESTIONS = {
  general:   ["Résume-moi l'essentiel d'un sujet", "Aide-moi à prendre une décision", "Explique-moi ce concept simplement"],
  code:      ["Trouve le bug dans ce code", "Optimise cette fonction", "Écris des tests unitaires"],
  redaction: ["Reformule ce paragraphe", "Raccourcis ce texte de moitié", "Rédige un e-mail professionnel"],
  data:      ["Analyse ce tableau", "Quelles tendances ressortent ?", "Propose un graphique pertinent"]
};
 
const ONBOARD_STEPS = [
  { t: "Choisis un module", d: "Général, Code, Rédaction ou Données. Le module adapte le ton et la méthode de l'IA." },
  { t: "Pose ta question", d: "Décris le contexte et le résultat attendu. Joins un fichier si besoin." },
  { t: "Vérifie la réponse", d: "L'IA peut se tromper. Relis et contrôle avant toute décision importante." },
  { t: "Copie et utilise", d: "Chaque réponse se copie en un clic. Ton historique reste disponible." }
];
const ONBOARD_RULES = [
  "J'ai lu comment fonctionne KARAT et ses modules.",
  "Je comprends que les réponses de l'IA peuvent être inexactes et que je dois les vérifier avant de les utiliser.",
  "Je ne transmets pas de données personnelles de tiers, de secrets ou de données confidentielles sans autorisation.",
  "Je comprends que mon abonnement se renouvelle chaque mois jusqu'à sa résiliation depuis mon espace.",
  "J'accepte les conditions générales d'utilisation et la politique de confidentialité."
];
 
/* ---------- Icônes ---------- */
const ICON = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  code: '<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  paperclip: '<path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'
};
const svg = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n] || ""}</svg>`;
const ic  = n => `<span class="ico">${svg(n)}</span>`;
 
/* ---------- Stockage ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
function normSubs(s){
  const out = {};
  Object.entries(s || {}).forEach(([k, v]) => { out[k] = typeof v === "string" ? { plan: v, since: Date.now(), ack: false } : v; });
  return out;
}
let session = store.get("karat_session", null);
if (session && session.exp && Date.now() > session.exp){ session = null; store.del("karat_session"); }
let users = store.get("karat_users", {});
let subs  = normSubs(store.get("karat_subs", {}));
let chats = store.get("karat_chats", {});
let files = store.get("karat_files", {});
let logs  = store.get("karat_logs", []);
const ui  = { mode: "general", attached: [], pendingImg: [], pendingFiles: [], convId: null, typing: false, adminFilter: "all", adminQ: "", sort: { key: "createdAt", dir: -1 }, page: 1, logFilter: "all" };
const PAGE = 10;
let pendingOk = null;
 
const saveUsers = () => store.set("karat_users", users);
const saveSubs  = () => store.set("karat_subs", subs);
const saveChats = () => { if (!store.set("karat_chats", chats)) toast("Stockage du navigateur plein", true); };
const saveFiles = () => { if (!store.set("karat_files", files)) toast("Stockage plein : supprime des fichiers", true); };
const saveLogs  = () => store.set("karat_logs", logs.slice(0, 500));
function logEvent(type, email, detail = ""){
  logs.unshift({ t: Date.now(), type, email: email || "", detail });
  logs = logs.slice(0, 500);
  saveLogs();
}
 
/* ---------- Outils ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const emailOf = s => (s || "").trim().toLowerCase();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const enc = encodeURIComponent;
const fmtDate = t => t ? new Date(t).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";
const fmtDay  = t => t ? new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—";
const fmtTime = t => t ? new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
const fmtSize = n => n < 1024 ? n + " o" : n < 1048576 ? (n / 1024).toFixed(1) + " Ko" : (n / 1048576).toFixed(1) + " Mo";
const initial = s => ((s || "").trim()[0] || "?").toUpperCase();
const money = n => n.toFixed(2).replace(".", ",") + " €";
const addMonths = (t, n) => { const d = new Date(t); d.setMonth(d.getMonth() + n); return d.getTime(); };
 
function toast(msg, bad = false){
  const t = document.createElement("div");
  t.className = "toast" + (bad ? " bad" : "");
  t.setAttribute("role", "status");
  t.textContent = msg;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 2800);
}
function openModal(html){ $("#modal-root").innerHTML = `<div class="veil" data-veil>${html}</div>`; }
function closeModal(){ $("#modal-root").innerHTML = ""; }
function askConfirm(title, text, onOk, label = "Confirmer", danger = true){
  pendingOk = onOk;
  openModal(`<div class="sheet" role="dialog" aria-modal="true">
    <button class="x" data-action="close-modal" aria-label="Fermer">${svg("x")}</button>
    <h2>${esc(title)}</h2><p class="sub">${esc(text)}</p>
    <div class="modal-actions">
      <button class="btn btn-line" data-action="close-modal">Annuler</button>
      <button class="btn ${danger ? "btn-danger" : "btn-accent"}" data-action="confirm-ok">${esc(label)}</button>
    </div></div>`);
}
function download(name, content, type){
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
 
/* ---------- Comptes & droits ---------- */
const isAdmin = e => !!e && CONFIG.ADMIN_EMAILS.map(x => x.toLowerCase()).includes(emailOf(e));
const planOf  = e => (subs[emailOf(e)] || {}).plan || null;
const acked   = e => !!(subs[emailOf(e)] && subs[emailOf(e)].ack);
function currentPlan(){
  if (!session) return null;
  if (isAdmin(session.email)) return "admin";
  return planOf(session.email);
}
// Essai gratuit : 24 heures d'accès au panel, sans génération d'images (démarre à la première connexion)
const TRIAL_HOURS = 24, TRIAL_IMAGES = 0;
const paidAccess = () => { const p = currentPlan(); return p === "admin" || !!(p && PLANS[p]); };
function trialLeft(){
  if (!session) return 0;
  const u = users[emailOf(session.email)]; if (!u) return 0;
  if (!u.trialStart){ u.trialStart = Date.now(); saveUsers(); }
  return Math.max(0, u.trialStart + TRIAL_HOURS * 3600000 - Date.now());
}
const inTrial = () => !!session && !paidAccess() && trialLeft() > 0;
const hasAccess = () => paidAccess() || inTrial();
// Abonné payant (ou admin) : on masque les promos d'abonnement et les rappels de paiement
const promoHidden = () => !!session && paidAccess();
const me = () => (session && users[emailOf(session.email)]) || {};
const displayName = u => `${u.firstName || ""} ${u.lastName || ""}`.trim() || (session ? session.name : "") || "";
const planLabel = () => { const p = currentPlan(); return p === "admin" ? "Administrateur" : p ? PLANS[p].name : inTrial() ? "Essai gratuit" : "Sans offre"; };
const myChats = () => { const k = emailOf(session.email); if (!chats[k]) chats[k] = []; return chats[k]; };
const myFiles = () => { const k = emailOf(session.email); if (!files[k]) files[k] = []; return files[k]; };
const convById = id => myChats().find(c => c.id === id) || null;
const fileById = id => myFiles().find(f => f.id === id) || null;
 
/* ---------- Mot de passe : PBKDF2 (jamais stocké en clair) ---------- */
const b64   = u8 => btoa(String.fromCharCode(...u8));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function hashPw(pw, saltB64){
  if (!window.crypto || !crypto.subtle) throw new Error("NO_CRYPTO");
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key  = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256);
  return { hash: b64(new Uint8Array(bits)), salt: b64(salt) };
}
async function verifyPw(pw, u){ return (await hashPw(pw, u.salt)).hash === u.hash; }
 
/* =====================================================================
   ROUTEUR & GARDES
   ===================================================================== */
const ROUTES = [
  { re: /^\/$/,                      fn: vLanding },
  { re: /^\/tarifs$/,                fn: vPricing },
  { re: /^\/connexion$/,             fn: vAuth },
  { re: /^\/bienvenue$/,             fn: vOnboard,        onboard: true },
  { re: /^\/app\/chat$/,             fn: vChat,           app: true },
  { re: /^\/app\/chat\/([\w-]+)$/,   fn: vChat,           app: true },
  { re: /^\/app\/historique$/,       fn: vHistory,        app: true },
  { re: /^\/app\/fichiers$/,         fn: vFiles,          app: true },
  { re: /^\/app\/modules$/,          fn: vModules,        app: true },
  { re: /^\/app\/offre$/,            fn: vSubscription,   app: true },
  { re: /^\/admin$/,                 fn: vAdminOverview,  admin: true },
  { re: /^\/admin\/utilisateurs$/,   fn: vAdminUsers,     admin: true },
  { re: /^\/admin\/abonnements$/,    fn: vAdminSubs,      admin: true },
  { re: /^\/admin\/journal$/,        fn: vAdminLog,       admin: true },
  { re: /^\/app\/images$/,            fn: vImages,         app: true },
  { re: /^\/admin\/annonces$/,         fn: vAdminAnnonces,   admin: true },
  { re: /^\/app\/support$/,             fn: vSupport,        app: true },
  { re: /^\/admin\/reglages$/,       fn: vAdminSettings,  admin: true }
];
 
function currentRoute(){
  const raw = location.hash.replace(/^#/, "") || "/";
  const i = raw.indexOf("?");
  return { path: i < 0 ? raw : raw.slice(0, i), q: new URLSearchParams(i < 0 ? "" : raw.slice(i + 1)) };
}
function go(path){
  if (location.hash === "#" + path) render();
  else location.hash = path;
}
window.addEventListener("hashchange", render);
 
function render(){
  const { path, q } = currentRoute();
  if (path === "/app/compte") return go("/app/offre");
  if (path === "/app/fichiers") return go("/app/chat");
  const route = ROUTES.find(r => r.re.test(path));
  if (!route) return go("/");
  const admin = isAdmin(session?.email);
 
  if (route.admin){
    if (!session) return go("/connexion?next=" + enc(path));
    if (!admin){ toast("Accès réservé à l'administrateur", true); return go("/app/chat"); }
  }
  if (route.app || route.onboard){
    if (!session) return go("/connexion?next=" + enc(path));
    if (!hasAccess()){ toast("Choisissez une offre pour ouvrir le panel", true); return go("/tarifs"); }
  }
  if (route.onboard) return go("/app/chat");
  if (path === "/connexion" && session) return go(q.get("next") || "/app/chat");
 
  const m = path.match(route.re);
  $("#app").innerHTML = route.fn(m, q);
  afterRender(path);
}
 
function afterRender(path){
  if (path.startsWith("/app/chat")){
    const box = $("#msgs"); if (box) box.scrollTop = box.scrollHeight;
  }
  if (path === "/connexion") initGoogle();
  if (path === "/" || path === "/tarifs") initFX();
  if (path === "/admin/utilisateurs"){ const s = $("[data-change='admin-filter']"); if (s) s.value = ui.adminFilter; fillAdminUsers(); }
  if (path === "/admin/abonnements"){ fillSubs(); if (adminToken()) fillStripeSubs(); }
  if (path === "/admin/journal"){ const s = $("[data-change='log-filter']"); if (s) s.value = ui.logFilter; }
  if (path === "/admin/annonces") fillAnnonceList();
}
 
/* =====================================================================
   COQUILLES
   ===================================================================== */
function pubHeader(path){
  return `<header class="topbar"><div class="wrap">
    <a href="#/" class="logo"><i></i>KARAT</a>
    <nav class="pubnav">
      <a href="#/" class="${path === "/" ? "on" : ""}">Produit</a>
      <a href="#/tarifs" class="${path === "/tarifs" ? "on" : ""}">Tarifs</a>
    </nav>
    <div class="row">
      ${session
        ? (hasAccess()
            ? `<a class="btn btn-accent btn-sm" href="#/app/chat">Ouvrir le panel</a>
               <button class="btn btn-ghost btn-sm" data-action="logout">Se déconnecter</button>`
            : `<span class="small muted" style="margin-right:4px">${esc(session.email)}</span>
               <a class="btn btn-accent btn-sm" href="#/tarifs">Choisir une offre</a>
               <button class="btn btn-ghost btn-sm" data-action="logout">Se déconnecter</button>`)
        : `<a class="btn btn-ghost btn-sm" href="#/connexion">Se connecter</a>
           <a class="btn btn-accent btn-sm" href="#/connexion?tab=signup">Créer un compte</a>`}
    </div></div></header>`;
}
function pubFooter(){
  return `<footer style="position:relative;z-index:1;border-top:1px solid var(--line);padding:40px 0;color:var(--dim);font-size:13px">
    <div class="wrap between wrap-x">
      <span class="logo" style="font-size:14px"><i style="width:20px;height:20px;border-radius:6px;flex-basis:20px"></i>KARAT</span>
      <span class="mono">© 2026 KARAT</span>
      <span class="row"><a href="#/">Mentions légales</a><a href="#/">Confidentialité</a><a href="#/">CGV</a><a href="mailto:karatsupport@gmail.com">Contact</a></span>
    </div></footer>`;
}
function appShell(path, content){
  const adm = isAdmin(session?.email);
  const link = (href, icon, label, count) => {
    const on = path === href || (href.length > 6 && path.startsWith(href)) ? "on" : "";
    const n = count !== undefined ? `<span class="count">${count}</span>` : "";
    return `<a class="nav-item ${on}" href="#${href}" ${on ? 'aria-current="page"' : ""}>${ic(icon)} ${label}${n}</a>`;
  };
  const name = displayName(me()) || session.email;
  const p = currentPlan();
  return `<div class="shell">
    <aside class="side">
      <a href="#/app/chat" class="logo"><i></i>KARAT</a>
      <div class="group">Espace</div>
      ${link("/app/chat", "chat", "Chat IA")}
      ${link("/app/historique", "clock", "Historique", myChats().length)}
      ${link("/app/modules", "grid", "Modules")}
      ${link("/app/images", "image", "Images")}
      ${link("/app/support", "mail", "Support")}
      ${link("/app/offre", "card", "Abonnement")}
      ${adm ? `<div class="group">Administration</div>
        ${link("/admin", "shield", "Vue d'ensemble")}
        ${link("/admin/utilisateurs", "users", "Utilisateurs", Object.keys(users).length)}
        ${link("/admin/abonnements", "card", "Abonnements", allRows().filter(r => r.plan).length)}
        ${link("/admin/journal", "list", "Journal")}
        ${link("/admin/annonces", "bell", "Annonces")}
        ${link("/admin/reglages", "settings", "Réglages")}` : ""}
      <div class="foot">
        <div class="plan-block">
          <span class="label">${adm ? "Accès" : "Offre"}</span>
          <b>${esc(planLabel())}</b>
          <a href="#/${adm ? "admin" : "app/offre"}">${adm ? "Espace administrateur →" : "Gérer l'abonnement →"}</a>
        </div>
        <div class="me-card">
          <span class="avatar sm">${esc(initial(name))}</span>
          <div style="min-width:0"><b>${esc(name)}</b><span>${esc(session.email)}</span></div>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="logout" style="width:100%;margin-top:8px">${ic("logout")} Se déconnecter</button>
      </div>
    </aside>
    <main class="main">${content}</main>
  </div>`;
}
function pageHead(crumb, title, sub, actions = ""){
  return `<div class="page-head">
    <div>${crumb ? `<div class="crumb">${esc(crumb)}</div>` : ""}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>
    ${actions ? `<div class="row wrap-x">${actions}</div>` : ""}
  </div>`;
}
const kpi = (label, value, sub = "", delta = null) => `
  <div class="card kpi">
    <div class="k-l">${label}</div>
    <div class="k-v">${value}</div>
    ${sub ? `<div class="k-s">${sub}</div>` : ""}
    ${delta !== null ? `<div class="delta ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)} vs semaine précédente</div>` : ""}
  </div>`;
 
/* =====================================================================
   PAGES PUBLIQUES
   ===================================================================== */
function vLanding(){
  const words = ["Analyse multimodale", "Code", "Rédaction", "Données", "Workflows", "Temps réel", "Sécurité", "Automatisation"];
  const track = [...words, ...words].map(w => `<span>${w}</span>`).join("");
  const modes = Object.keys(MODES).map(k => `
    <article class="card mode-card">
      <div class="mi">${ic(MODES[k].icon)}</div>
      <h3>${MODES[k].name}</h3>
      <p class="d">${MODES[k].desc}</p>
      <ul class="mode-list">${MODES[k].bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    </article>`).join("");
  return `${pubHeader("/")}
  <section class="hero"><div class="wrap hero-inner">
    <span class="pill"><b>NOUVEAU</b> Panel IA multi-modules</span>
    <h1 class="h-xl">Analysez <span class="strike">moins</span>.<br/>Décidez <span class="acc">plus vite.</span></h1>
    <p class="lead">KARAT réunit l'analyse de fichiers, le code, la rédaction et les données dans un seul panel sobre et rapide.</p>
    <div class="ctas">
      ${promoHidden()
        ? `<a class="btn btn-accent" href="#/app/chat">Ouvrir le panel ${ic("arrow")}</a>`
        : `<a class="btn btn-accent" href="#/tarifs">Voir les offres ${ic("arrow")}</a>
           <a class="btn btn-line" href="#/connexion?tab=signup">Créer un compte</a>`}
    </div>
    <div class="proof">
      <div><b>4</b><span>modules métiers</span></div>
      <div><b>Google</b><span>ou e-mail</span></div>
      <div><b>Stripe</b><span>paiement sécurisé</span></div>
      <div><b>7,99 €</b><span>offre de départ</span></div>
    </div>
    <div class="console" aria-hidden="true">
      <div class="console-top"><span class="pv-dots"><i></i><i></i><i></i></span><span>karat — panel IA · module Général</span><span></span></div>
      <div class="console-body">
        <div class="pv-b me">Compare ces deux versions du module et résume les écarts.</div>
        <div class="pv-b">Analyse terminée sur 4 fichiers.<br/>• 3 améliorations de performance<br/>• 1 risque de régression signalé</div>
        <div class="pv-b me">Propose-moi un graphique pour les résultats.</div>
        <div class="pv-b">Un diagramme en barres par version est le plus lisible ici.</div>
      </div>
    </div>
  </div></section>
 
  <div class="marquee" aria-hidden="true"><div class="marquee-track">${track}</div></div>
 
  <section class="section" id="modules"><div class="wrap">
    <div class="head">
      <div><div class="label">Modules</div><h2 class="h-l" style="margin-top:14px;max-width:560px">Un module pour chaque type de travail.</h2></div>
      <p>Chaque module adapte le ton, la méthode et les suggestions à votre tâche.</p>
    </div>
    <div class="grid g4 modes">${modes}</div>
  </div></section>
 
  <section class="section" id="comment" style="padding-top:0"><div class="wrap">
    <div class="head">
      <div><div class="label">Démarrer</div><h2 class="h-l" style="margin-top:14px;max-width:560px">Trois étapes, moins de deux minutes.</h2></div>
    </div>
    <div class="steps">
      <div class="step"><span class="n">01</span><h3>Créez votre compte</h3><p>Par e-mail ou avec Google. Votre espace est privé.</p></div>
      <div class="step"><span class="n">02</span><h3>Choisissez une offre</h3><p>Essentiel, Pro ou Expert. Paiement sécurisé par Stripe, résiliable à tout moment.</p></div>
      <div class="step"><span class="n">03</span><h3>Ouvrez le panel</h3><p>Lisez le rappel des règles d'utilisation, validez-le, puis commencez.</p></div>
    </div>
  </div></section>
 
  <section class="section" id="features" style="padding-top:0"><div class="wrap">
    <div class="head">
      <div><div class="label">Fonctionnalités</div><h2 class="h-l" style="margin-top:14px;max-width:620px">Un seul endroit pour vos fichiers, vos questions et vos résultats.</h2></div>
      <p>Tout reste au même endroit, avec un historique consultable.</p>
    </div>
    <div class="bento">
      <article class="card c-a"><span class="label">01 — Fichiers</span><h3 class="t">Joignez vos documents à la conversation</h3><p class="d">Textes, code, tableaux : chargez-les dans votre bibliothèque et utilisez-les en un clic dans vos questions.</p></article>
      <article class="card c-b"><span class="label">02 — Historique</span><h3 class="t">Retrouvez chaque échange</h3><p class="d">Conversations classées par date, consultables à tout moment.</p>
        <div class="chips"><span>Aujourd'hui</span><span>Hier</span><span>7 derniers jours</span></div></article>
      <article class="card c-c"><span class="label">03 — Accès</span><h3 class="t">Compte personnel</h3><p class="d">Inscription par e-mail ou connexion Google.</p></article>
      <article class="card c-d"><span class="label">04 — Abonnement</span><h3 class="t">Gérez votre offre</h3><p class="d">Date de renouvellement et résiliation depuis votre espace.</p></article>
      <article class="card c-e"><span class="label">05 — Confidentialité</span><h3 class="t">Isolé par compte</h3><p class="d">Vos conversations ne sont visibles que de vous.</p></article>
    </div>
  </div></section>
 
  <section class="section" id="offres" style="padding-top:0;${promoHidden() ? "display:none" : ""}"><div class="wrap">
    <div class="head">
      <div><div class="label">Tarifs</div><h2 class="h-l" style="margin-top:14px;max-width:560px">Une offre pour chaque usage.</h2></div>
      <p>TTC, sans engagement. Résiliable depuis votre espace.</p>
    </div>
    <div class="plans">${["essentiel", "pro", "expert"].map(planCard).join("")}</div>
  </div></section>
 
  <section class="section" id="faq" style="padding-top:0"><div class="wrap faq-wrap">
    <div class="label">Questions fréquentes</div>
    <h2 class="h-l" style="margin-top:14px;margin-bottom:34px">Vous vous posez peut-être ces questions.</h2>
    <details class="faq"><summary>Puis-je résilier à tout moment ?</summary><p>Oui. La résiliation se fait depuis la page Abonnement, en un clic. Votre offre reste active jusqu'à la fin de la période en cours.</p></details>
    <details class="faq"><summary>Comment le paiement fonctionne-t-il ?</summary><p>Le paiement passe par Stripe, une plateforme de paiement reconnue. KARAT ne stocke pas vos coordonnées bancaires.</p></details>
    <details class="faq"><summary>Mes conversations sont-elles privées ?</summary><p>Oui, chaque conversation n'est visible que depuis votre compte. Dans cette version, vos données sont enregistrées dans le navigateur de l'appareil utilisé.</p></details>
    <details class="faq"><summary>Pourquoi dois-je valider des règles après le paiement ?</summary><p>Avant le premier accès au panel, nous vous présentons les règles d'utilisation. Vous les validez une fois pour toutes.</p></details>
  </div></section>
 
  ${promoHidden() ? "" : `<section class="section" style="padding-top:0"><div class="wrap">
    <div class="cta-band">
      <div><div class="label">Prêt ?</div><h2 class="h-l" style="margin-top:12px;font-size:36px">Commencez avec 7,99 € par mois.</h2><p class="muted" style="margin-top:10px">Sans engagement, résiliable depuis votre espace.</p></div>
      <a class="btn btn-accent" href="#/tarifs">Voir les offres ${ic("arrow")}</a>
    </div>
  </div></section>`}
  ${pubFooter()}`;
}
 
function planCard(key){
  const p = PLANS[key];
  const hot = key === "pro";
  const cur = currentPlan() === key;
  if (promoHidden() && !cur) return "";
  return `<div class="plan ${hot ? "hot" : ""}">
    ${hot ? `<span class="ribbon">POPULAIRE</span>` : ""}
    <div class="pname">${p.name}</div>
    <div class="price"><b>${p.price.replace(" €", "")}<span style="font-size:28px;letter-spacing:0"> €</span></b><span>/mois</span></div>
    <p class="desc">${p.desc}</p>
    <ul>${p.feats.map(f => `<li>${ic("check")} ${esc(f)}</li>`).join("")}</ul>
    <button class="btn ${hot ? "btn-accent" : "btn-line"}" data-action="plan" data-plan="${key}">${cur ? "Accéder au panel" : "Choisir " + p.name}</button>
    <div class="status">${cur ? "✓ Votre offre actuelle" : ""}</div>
  </div>`;
}
function vPricing(){
  return `${pubHeader("/tarifs")}
  <section class="section" style="padding-top:70px"><div class="wrap">
    <div class="head">
      <div><div class="label">Tarifs</div><h2 class="h-l" style="margin-top:14px">Trois offres. Un prix mensuel clair.</h2></div>
      <p>TTC, sans engagement. Résiliation possible à tout moment depuis votre espace.</p>
    </div>
    <div class="plans">${["essentiel", "pro", "expert"].map(planCard).join("")}</div>
  </div></section>
  <section class="section" style="padding-top:20px"><div class="wrap" style="max-width:820px">
    <div class="label">Questions fréquentes</div>
    <h2 class="h-l" style="margin:14px 0 30px;font-size:34px">Tout ce qu'il faut savoir</h2>
    <details class="faq" open><summary>Puis-je changer d'offre ?</summary><p>Oui, depuis la page Abonnement de votre espace.</p></details>
    <details class="faq"><summary>Comment résilier ?</summary><p>Depuis la page Abonnement de votre espace, en un clic. Votre accès reste actif jusqu'à la fin de la période payée.</p></details>
    <details class="faq"><summary>Mes données sont-elles protégées ?</summary><p>Les mots de passe sont chiffrés. Les paiements sont gérés par notre prestataire de paiement, Stripe.</p></details>
  </div></section>
  ${pubFooter()}`;
}
 
function vAuth(_m, q){
  const tab = q.get("tab") === "signup" ? "signup" : "login";
  const nx = enc(q.get("next") || "/app/chat");
  const gOn = googleOn();
  return `${pubHeader("/connexion")}
  <div class="auth-wrap"><div class="auth-card">
    <a class="logo" href="#/" style="margin-bottom:22px"><i></i>KARAT</a>
    <h1>${tab === "signup" ? "Créer un compte" : "Bon retour"}</h1>
    <p class="sub">${tab === "signup" ? "Quelques informations pour commencer." : "Connectez-vous à votre espace KARAT."}</p>
    <div class="seg" role="tablist">
      <a href="#/connexion?tab=login&next=${nx}" class="${tab === "login" ? "on" : ""}" role="tab">Se connecter</a>
      <a href="#/connexion?tab=signup&next=${nx}" class="${tab === "signup" ? "on" : ""}" role="tab">Créer un compte</a>
    </div>
    ${tab === "login" ? `
    <form id="loginForm">
      <div class="field"><label for="l-email">E-MAIL</label><input id="l-email" class="input" name="email" type="email" autocomplete="email" required /></div>
      <div class="field"><label for="l-pw">MOT DE PASSE</label><input id="l-pw" class="input" name="pw" type="password" autocomplete="current-password" required /></div>
      <button class="btn btn-accent btn-block" type="submit">Se connecter</button>
    </form>` : `
    <form id="signupForm">
      <div class="form-grid">
        <div class="field"><label for="s-first">PRÉNOM</label><input id="s-first" class="input" name="first" autocomplete="given-name" required /></div>
        <div class="field"><label for="s-last">NOM</label><input id="s-last" class="input" name="last" autocomplete="family-name" required /></div>
        <div class="field full"><label for="s-email">E-MAIL</label><input id="s-email" class="input" name="email" type="email" autocomplete="email" required /></div>
        <div class="field full"><label for="s-phone">TÉLÉPHONE</label><input id="s-phone" class="input" name="phone" type="tel" autocomplete="tel" placeholder="+33 6 12 34 56 78" required /></div>
        <div class="field"><label for="s-pw">MOT DE PASSE</label><input id="s-pw" class="input" name="pw" type="password" autocomplete="new-password" placeholder="8 caractères min." required /></div>
        <div class="field"><label for="s-pw2">CONFIRMATION</label><input id="s-pw2" class="input" name="pw2" type="password" autocomplete="new-password" required /></div>
      </div>
      <label class="check"><input type="checkbox" name="cgu" /> J'accepte les CGU et la politique de confidentialité.</label>
      <button class="btn btn-accent btn-block" type="submit">Créer mon compte</button>
    </form>`}
    <div class="err" id="authErr" role="alert"></div>
    <div class="or ${gOn ? "" : "hidden"}" id="orSep">ou</div>
    <div class="gslot ${gOn ? "" : "hidden"}" id="gslot"><div id="gbtnWrap"></div></div>
  </div></div>
  ${pubFooter()}`;
}
 
/* =====================================================================
   CONNEXION
   ===================================================================== */
const googleOn = () => !!CONFIG.GOOGLE_CLIENT_ID && !CONFIG.GOOGLE_CLIENT_ID.startsWith("REMPLACER");
const setErr = m => { const el = $("#authErr"); if (el) el.textContent = m || ""; };
const nextTarget = () => currentRoute().q.get("next") || "/app/chat";
 
function startSession(s, isNew){
  session = { ...s, exp: Date.now() + 7 * 24 * 3600 * 1000 };
  store.set("karat_session", session);
  logEvent(isNew ? "inscription" : "connexion", s.email, s.provider || "mot de passe");
  go(nextTarget());
  toast(`Bienvenue, ${s.name || s.email}`);
}
async function onLogin(f){
  setErr("");
  const email = emailOf(f.querySelector('[name="email"]').value);
  const pw = f.querySelector('[name="pw"]').value;
  const u = users[email];
  if (!u) return setErr("Aucun compte avec cet e-mail. Créez-le d'abord.");
  if (!u.hash) return setErr("Ce compte utilise Google. Utilisez le bouton Google.");
  try{
    if (!(await verifyPw(pw, u))) return setErr("Mot de passe incorrect.");
  }catch(e){ return setErr("Votre navigateur bloque le chiffrement. Ouvrez la page en https ou en local."); }
  u.lastLogin = Date.now(); saveUsers();
  startSession({ email, name: displayName(u) }, false);
}
async function onSignup(f){
  setErr("");
  const v = n => f.querySelector(`[name="${n}"]`).value.trim();
  const first = v("first"), last = v("last"), email = emailOf(v("email")), phone = v("phone");
  const pw = f.querySelector('[name="pw"]').value, pw2 = f.querySelector('[name="pw2"]').value;
  if (!first || !last) return setErr("Renseignez votre prénom et votre nom.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Adresse e-mail invalide.");
  if (!/^\+?[0-9 .\-()]{8,20}$/.test(phone)) return setErr("Numéro de téléphone invalide.");
  if (pw.length < 8) return setErr("Le mot de passe doit faire au moins 8 caractères.");
  if (pw !== pw2) return setErr("Les deux mots de passe ne correspondent pas.");
  if (!f.querySelector('[name="cgu"]').checked) return setErr("Acceptez les CGU pour continuer.");
  if (users[email]) return setErr("Un compte existe déjà avec cet e-mail. Connectez-vous.");
  try{
    const { hash, salt } = await hashPw(pw);
    users[email] = { email, firstName: first, lastName: last, phone, hash, salt, provider: "password", createdAt: Date.now(), lastLogin: Date.now() };
    saveUsers();
  }catch(e){ return setErr("Votre navigateur bloque le chiffrement. Ouvrez la page en https ou en local."); }
  startSession({ email, name: `${first} ${last}` }, true);
}
function parseJwt(token){
  const b = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(decodeURIComponent(atob(b).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
}
window.handleGoogleCredential = function(resp){
  try{
    const p = parseJwt(resp.credential);
    const email = emailOf(p.email);
    const isNew = !users[email];
    const old = users[email] || {};
    users[email] = {
      ...old, email,
      firstName: old.firstName || p.given_name || "",
      lastName:  old.lastName  || p.family_name || "",
      provider:  old.provider  || "google",
      createdAt: old.createdAt || Date.now(),
      lastLogin: Date.now(), picture: p.picture
    };
    saveUsers();
    startSession({ email, name: p.name, picture: p.picture, provider: "Google" }, isNew);
  }catch(e){ setErr("Connexion Google impossible, réessayez."); }
};
function initGoogle(){
  if (!googleOn()) return;
  let tries = 0;
  const tryRender = () => {
    const slot = $("#gbtnWrap");
    if (!slot) return;
    if (window.google && google.accounts && google.accounts.id){
      google.accounts.id.initialize({ client_id: CONFIG.GOOGLE_CLIENT_ID, callback: window.handleGoogleCredential, auto_select: false });
      slot.innerHTML = "";
      google.accounts.id.renderButton(slot, { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: 300 });
    } else if (tries++ < 25) setTimeout(tryRender, 300);
  };
  tryRender();
}
function doLogout(){
  try{ if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); }catch(e){}
  if (session) logEvent("déconnexion", session.email);
  session = null; store.del("karat_session");
  ui.convId = null; ui.attached = []; ui.typing = false;
  toast("Vous êtes déconnecté");
  go("/");
}
 
/* =====================================================================
   BIENVENUE (explication obligatoire après paiement)
   ===================================================================== */
function vOnboard(){
  const name = (me().firstName || "").trim();
  const plan = currentPlan();
  return `<div class="ob-wrap">
  <header class="topbar"><div class="wrap">
    <a href="#/" class="logo"><i></i>KARAT</a>
    <button class="btn btn-ghost btn-sm" data-action="logout">${ic("logout")} Se déconnecter</button>
  </div></header>
  <div class="wrap" style="max-width:960px;padding-top:56px;padding-bottom:90px">
    <div class="label">Offre ${plan ? esc(PLANS[plan].name) : ""} activée</div>
    <h1 class="h-l" style="margin-top:14px;font-size:clamp(32px,4.4vw,48px)">Bienvenue${name ? ", " + esc(name) : ""}.<br/>Avant d'accéder au panel…</h1>
    <p class="lead" style="max-width:640px">Lisez ces quelques points et validez-les. C'est une étape unique, qui garantit une utilisation sereine de KARAT.</p>
 
    <h2 class="h-section" style="margin-top:44px">Comment utiliser KARAT</h2>
    <div class="ob-grid">
      ${ONBOARD_STEPS.map((s, i) => `<div class="ob-step"><span class="n">0${i + 1}</span><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div>`).join("")}
    </div>
 
    <h2 class="h-section" style="margin-top:44px">Règles d'utilisation</h2>
    <div class="ack-list">
      ${ONBOARD_RULES.map((r, i) => `<label class="ack" data-ack-row><input type="checkbox" data-ack="${i}" /> <span>${esc(r)}</span></label>`).join("")}
    </div>
 
    <h2 class="h-section" style="margin-top:44px">Confirmation</h2>
    <div class="card" style="padding:26px">
      <p class="muted" style="font-size:14px">Cochez les cinq points ci-dessus, puis tapez <b style="color:var(--text)">OK</b> dans le champ pour confirmer.</p>
      <div class="row wrap-x" style="margin-top:18px;gap:12px">
        <input id="okField" class="input" style="max-width:260px" placeholder="Tapez OK" autocomplete="off" data-input="ok-field" aria-label="Taper OK pour confirmer" />
        <button class="btn btn-accent" id="ackBtn" data-action="ack-confirm" disabled>Accéder au panel ${ic("arrow")}</button>
      </div>
      <p class="dim small" style="margin-top:14px" id="ackHint">Les cinq points doivent être cochés et le mot OK tapé pour continuer.</p>
    </div>
  </div></div>`;
}
function updateAckState(){
  const boxes = $$("[data-ack]");
  const all = boxes.length && boxes.every(b => b.checked);
  $$("[data-ack-row]").forEach(r => r.classList.toggle("on", r.querySelector("input").checked));
  const ok = (($("#okField")?.value) || "").trim().toUpperCase() === "OK";
  const btn = $("#ackBtn");
  if (btn) btn.disabled = !(all && ok);
  const hint = $("#ackHint");
  if (hint) hint.textContent = all && ok ? "Merci. Vous pouvez accéder au panel." : "Les cinq points doivent être cochés et le mot OK tapé pour continuer.";
}
function confirmAck(){
  if (!session) return;
  const k = emailOf(session.email);
  if (!subs[k]) return;
  subs[k] = { ...subs[k], ack: true, ackAt: Date.now() };
  saveSubs();
  logEvent("validation", k, "règles acceptées");
  toast("Bienvenue sur KARAT");
  go("/app/chat");
}
 
/* =====================================================================
   TARIFS & PAIEMENT
   ===================================================================== */
function startPlan(plan){
  if (!session) return go("/connexion?next=" + enc("/tarifs"));
  if (isAdmin(session.email)){ toast("Compte administrateur : accès complet inclus"); return go("/app/chat"); }
  if (planOf(session.email) === plan) return go("/app/chat");
  const link = CONFIG.PAYMENT_LINKS[plan];
  if (link){
    const url = new URL(link);
    url.searchParams.set("prefilled_email", session.email);
    window.location.href = url.toString();
    return;
  }
  // mode test : aucun lien de paiement configuré
  subs[emailOf(session.email)] = { plan, since: Date.now(), ack: false };
  saveSubs();
  logEvent("abonnement", session.email, PLANS[plan].name + " (test)");
  toast("Offre " + PLANS[plan].name + " activée (test)");
  go("/app/chat");
}
async function syncPlan(){
  if (!session || !CONFIG.VERIFY_ENDPOINT) return false;
  try{
    const r = await fetch(CONFIG.VERIFY_ENDPOINT + "?email=" + enc(session.email), { cache: "no-store" });
    const j = await r.json();
    const k = emailOf(session.email);
    const prev = subs[k];
    if (!j.plan || !PLANS[j.plan]){
      // accès retiré côté serveur : on retire l'offre synchronisée (les offres de test restent)
      if (prev && prev.src === "server"){ delete subs[k]; saveSubs(); logEvent("accès", session.email, "retiré"); }
      return false;
    }
    if (!prev || prev.plan !== j.plan || prev.src !== "server"){
      subs[k] = { plan: j.plan, since: prev && prev.plan === j.plan ? prev.since : Date.now(), ack: prev ? !!prev.ack : false, src: "server" };
      saveSubs();
      logEvent("abonnement", session.email, PLANS[j.plan].name + (j.source === "offert" ? " (offert)" : " (Stripe)"));
    }
    return true;
  }catch(e){ return false; }
}
async function verifyPayment(plan){
  const ok = await syncPlan();
  if (ok){ toast("Offre " + PLANS[plan].name + " activée"); go("/app/chat"); }
  else toast("Paiement en cours de confirmation, réessayez dans une minute", true);
}
(function handleReturn(){
  const paid = new URLSearchParams(location.search).get("paid");
  if (!paid || !PLANS[paid]) return;
  history.replaceState(null, "", location.pathname + location.hash);
  if (session) verifyPayment(paid);
  else toast("Paiement reçu. Connectez-vous pour activer votre offre.");
})();
 
/* =====================================================================
   PANEL IA
   ===================================================================== */
/* Rendu des réponses : paragraphes, gras, code en ligne, blocs de code avec nom de fichier et bouton copier */
function mdText(s){
  return esc(s.trim()).split(/\n{2,}/).filter(Boolean).map(p => {
    const h = p
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br>");
    return `<p>${h}</p>`;
  }).join("");
}
function renderMd(text){
  const parts = String(text ?? "").split("```");
  return parts.map((part, i) => {
    if (i % 2 === 0) return mdText(part);
    const nl = part.indexOf("\n");
    const info = (nl < 0 ? part : part.slice(0, nl)).trim();
    const code = (nl < 0 ? "" : part.slice(nl + 1)).replace(/\n$/, "");
    const [lang = "", file = ""] = info.split(/\s+/);
    const label = file || lang || "code";
    return `<div class="code-block"><div class="code-h"><span>${esc(label)}</span>
      <button type="button" class="code-copy" data-action="copy-code" data-code="${esc(code)}">${ic("copy")} Copier</button></div>
      <pre><code>${esc(code)}</code></pre></div>`;
  }).join("");
}
 
function msgHTML(m){
  const t = fmtTime(m.at);
  if (m.role === "user"){
    const att = m.files && m.files.length ? `<span class="att">${ic("paperclip")} ${m.files.map(esc).join(", ")}</span><br>` : "";
    const pics = m.thumbs && m.thumbs.length ? `<div class="msg-imgs">${m.thumbs.map(t => `<img src="${t}" alt="Image jointe">`).join("")}</div>` : "";
    return `<div class="msg me"><div class="who">${esc(initial(displayName(me()) || session.email))}</div>
      <div><div class="bubble">${pics}${att}${esc(m.text)}</div><div class="msg-meta" style="justify-content:flex-end">${t}</div></div></div>`;
  }
  return `<div class="msg ai"><div class="who">K</div>
    <div><div class="bubble">${renderMd(m.text)}</div>
    <div class="msg-meta"><span>${t}</span><button class="btn btn-ghost btn-sm copy-btn" data-action="copy" data-text="${esc(m.text)}" style="height:26px;padding:0 8px;font-size:11.5px">${ic("copy")} Copier</button></div></div></div>`;
}
function welcomeHTML(mode){
  const first = (me().firstName || "").trim();
  return `<div class="welcome">
    <div class="big"><svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true"><g stroke="#d7ff3f" stroke-width="7" stroke-linecap="round" fill="none"><line x1="20" y1="14" x2="20" y2="50"/><line x1="20" y1="32" x2="44" y2="16"/><line x1="20" y1="32" x2="48" y2="50"/></g><path d="M52 6 L54 12 L60 14 L54 16 L52 22 L50 16 L44 14 L50 12 Z" fill="#d7ff3f"/></svg></div>
    <h2>Bonjour${first ? ", " + esc(first) : ""}</h2>
    <p>${MODES[mode].desc}</p>
    <div class="sugg">${SUGGESTIONS[mode].map(t => `<button type="button" data-action="suggest" data-text="${esc(t)}">${esc(t)}</button>`).join("")}</div>
  </div>`;
}
function vChat(m){
  const id = m && m[1];
  const conv = id ? convById(id) : null;
  if (id && !conv){ toast("Conversation introuvable", true); go("/app/chat"); return ""; }
  ui.convId = conv ? conv.id : null;
  const mode = conv ? conv.mode : ui.mode;
  const typing = ui.typing ? `<div class="msg ai"><div class="who">K</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>` : "";
  const body = (conv || ui.typing) ? (conv ? conv.messages.map(msgHTML).join("") : "") + typing : welcomeHTML(mode);
  const attached = ui.attached.map(fileById).filter(Boolean);
 
  return appShell("/app/chat", `<div class="chat">
    <div class="chat-top">
      <div class="row" style="min-width:0"><span class="badge accent">${esc(MODES[mode].name)}</span><span class="title">${conv ? esc(conv.title) : "Nouvelle conversation"}</span></div>
      <div class="row wrap-x">
        <div class="seg" role="group" aria-label="Module">${Object.keys(MODES).map(k => `<button type="button" data-action="set-mode" data-mode="${k}" class="${k === mode ? "on" : ""}" aria-pressed="${k === mode}">${MODES[k].name}</button>`).join("")}</div>
        <button class="btn btn-line btn-sm" data-action="new-chat">${ic("plus")} Nouvelle</button>
      </div>
    </div>
    <div class="msgs" id="msgs" aria-live="polite">${body}</div>
    <form class="composer" id="composer">
      ${(ui.pendingFiles || []).length ? `<div class="chips-att">${ui.pendingFiles.map((f, i) => `<span class="chip">${ic("paperclip")} ${esc(f.name)}<button type="button" data-action="file-remove" data-idx="${i}" aria-label="Retirer ${esc(f.name)}">${svg("x")}</button></span>`).join("")}</div>` : ""}
      <input type="file" id="chatFile" multiple accept="image/*,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.yaml,.yml,.sql,.log,.pdf" hidden />
      <div class="inbox">
        ${(ui.pendingImg || []).length ? `<div class="img-tray">${ui.pendingImg.map((im, i) => `<div class="img-thumb"><img src="${im.thumb}" alt="${esc(im.name)}"><button type="button" data-action="img-remove" data-idx="${i}" aria-label="Retirer ${esc(im.name)}"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`).join("")}</div>` : ""}
        <button type="button" class="btn btn-ghost btn-icon" data-action="pick-file" title="Joindre un fichier" aria-label="Joindre un fichier"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
        <textarea id="input" rows="1" placeholder="Posez votre question ou décrivez votre tâche…" aria-label="Message" data-enter></textarea>
        <button class="send" id="sendBtn" type="submit" aria-label="Envoyer" ${ui.typing ? "disabled" : ""}>${ic("send")}</button>
      </div>
      <div class="hint"><span>Entrée pour envoyer · Maj + Entrée pour un saut de ligne</span><span>${esc(MODES[mode].sub)}</span></div>
    </form>
  </div>`);
}
async function askAI(conv, ctx, images, pdfs){
  const history = conv.messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
  if (ctx && history.length) history[history.length - 1].content = ctx + "\n\n" + history[history.length - 1].content;
  if (CONFIG.AI_ENDPOINT){
    const r = await fetch(CONFIG.AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: conv.mode, messages: history, images: images || [], pdfs: pdfs || [] }) });
    const d = await r.json();
    if (!r.ok || !d.reply) throw new Error(d.error || "Erreur IA");
    return d.reply;
  }
  await new Promise(r => setTimeout(r, 900 + Math.random() * 800));
  const last = conv.messages[conv.messages.length - 1].text;
  const extra = ctx ? "\n\nLes fichiers joints ont bien été lus." : "";
  return `[Démo · ${MODES[conv.mode].name}] ${MODES[conv.mode].desc}\n\nVotre message : « ${last.slice(0, 160)}${last.length > 160 ? "…" : ""} »${extra}\n\nBranchez AI_ENDPOINT dans la configuration pour activer la vraie IA.`;
}
async function sendMessage(override){
  if (ui.typing) return;
  const input = $("#input");
  const typed = (override ?? (input ? input.value : "")).trim();
  const imgs = (ui.pendingImg || []).slice();
  const docs = (ui.pendingFiles || []).slice();
  if (!typed && !imgs.length && !docs.length) return;
  if (!hasAccess()) return go("/tarifs");
  const text = typed || "Analyse ce que je t'ai joint et dis-moi l'essentiel.";
 
  let conv = ui.convId ? convById(ui.convId) : null;
  if (!conv){
    conv = { id: uid(), title: text.slice(0, 48), mode: ui.mode, createdAt: Date.now(), messages: [] };
    myChats().unshift(conv);
    ui.convId = conv.id;
  }
  const textFiles = docs.filter(f => f.content != null);
  const ctx = textFiles.map(f => `Fichier « ${f.name} » :\n${f.content.slice(0, 8000)}`).join("\n\n");
  const pdfs = docs.filter(f => f.pdf).map(f => f.pdf);
 
  conv.messages.push({ role: "user", text, files: docs.map(f => f.name), thumbs: imgs.map(i => i.thumb), at: Date.now() });
  conv.updatedAt = Date.now();
  ui.attached = [];
  ui.pendingImg = [];
  ui.pendingFiles = [];
  ui.typing = true;
  saveChats();
  go(`/app/chat/${conv.id}`);
  if (location.hash === "#/app/chat/" + conv.id) render();
 
  let reply;
  try{ reply = await askAI(conv, ctx, imgs.map(i => i.data), pdfs); }
  catch(e){ reply = "Erreur de connexion au moteur. Réessayez."; }
  conv.messages.push({ role: "ai", text: reply, at: Date.now() });
  conv.updatedAt = Date.now();
  ui.typing = false;
  saveChats();
  render();
}
 
/* =====================================================================
   HISTORIQUE, FICHIERS, MODULES
   ===================================================================== */
function dayBucket(t){
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(t); d.setHours(0, 0, 0, 0);
  const diff = Math.round((now - d) / 864e5);
  if (diff <= 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff <= 7) return "Cette semaine";
  if (diff <= 30) return "Ce mois-ci";
  return "Plus ancien";
}
function vHistory(){
  const list = [...myChats()].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  const groups = {};
  list.forEach(c => { const k = dayBucket(c.updatedAt || c.createdAt); (groups[k] = groups[k] || []).push(c); });
  const body = Object.keys(groups).map(g => `
    <div class="group-h">${g}</div>
    ${groups[g].map(c => `
      <div class="conv" data-s="${esc((c.title + " " + MODES[c.mode].name).toLowerCase())}">
        <a href="#/app/chat/${c.id}" class="row grow" style="min-width:0">
          <span class="ci">${ic(MODES[c.mode].icon)}</span>
          <span class="ct"><b>${esc(c.title)}</b><span>${MODES[c.mode].name} · ${c.messages.length} message${c.messages.length > 1 ? "s" : ""} · ${fmtDate(c.updatedAt || c.createdAt)}</span></span>
        </a>
        <button class="btn btn-ghost btn-icon btn-sm" data-action="delete-chat" data-id="${c.id}" aria-label="Supprimer la conversation">${ic("trash")}</button>
      </div>`).join("")}`).join("");
  return appShell("/app/historique", pageHead("Espace", "Historique", "Vos conversations, classées par date.",
    `<div class="search">${ic("search")}<input class="input" placeholder="Rechercher une conversation…" aria-label="Rechercher" data-input="filter-list" data-target="conv" /></div>`) +
    (list.length
      ? `<div class="card flat" style="padding:0 0 8px">${body}</div>`
      : `<div class="card flat empty"><div class="ico">${svg("clock")}</div><b>Aucune conversation</b>Lancez votre première discussion depuis le chat.<div style="margin-top:20px"><a class="btn btn-accent" href="#/app/chat">Ouvrir le chat</a></div></div>`));
}
function vFiles(){
  const list = [...myFiles()].sort((a, b) => b.createdAt - a.createdAt);
  const rows = list.map(f => `
    <div class="file" data-s="${esc(f.name.toLowerCase())}">
      <span class="fi">${esc((f.name.split(".").pop() || "FILE").slice(0, 4).toUpperCase())}</span>
      <div class="fn"><b>${esc(f.name)}</b><span>${fmtSize(f.size)} · ajouté le ${fmtDate(f.createdAt)}</span></div>
      ${f.content ? `<span class="badge ok">LU PAR L'IA</span>` : `<span class="badge">NON LU</span>`}
      <button class="btn btn-line btn-sm" data-action="file-attach" data-id="${f.id}">${ic("paperclip")} Joindre au chat</button>
      <button class="btn btn-ghost btn-icon btn-sm" data-action="delete-file" data-id="${f.id}" aria-label="Supprimer le fichier">${ic("trash")}</button>
    </div>`).join("");
  return appShell("/app/fichiers", pageHead("Espace", "Fichiers", "Votre bibliothèque de documents, prête à être jointe à une conversation.",
    `<div class="search">${ic("search")}<input class="input" placeholder="Rechercher un fichier…" aria-label="Rechercher" data-input="filter-list" data-target="file" /></div>`) +
    `<div class="drop" data-drop id="drop" tabindex="0" role="button" aria-label="Ajouter des fichiers">
      <div class="ico">${svg("upload")}</div>
      <b style="font-family:var(--display);font-size:18px">Glissez vos fichiers ici</b>
      <p class="muted small" style="margin-top:6px">ou cliquez pour parcourir · texte, code, CSV, JSON, Markdown · 300 Ko max lus par l'IA · 2 Mo max</p>
      <input type="file" id="fileInput" multiple />
    </div>
    <div class="card flat" style="padding:0;margin-top:18px">
      ${rows || `<div class="empty"><div class="ico">${svg("file")}</div><b>Aucun fichier</b>Vos documents apparaîtront ici.</div>`}
    </div>`);
}
function isTextLike(file){
  return file.type.startsWith("text/") || file.type === "application/json" ||
    /\.(md|txt|csv|json|js|ts|py|html|css|xml|yaml|yml|sql|log)$/i.test(file.name);
}
const readText = file => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsText(file); });
async function importFiles(list){
  let added = 0;
  for (const file of list){
    if (file.size > 2 * 1024 * 1024){ toast(`« ${file.name} » dépasse 2 Mo`, true); continue; }
    let content = null;
    if (isTextLike(file) && file.size <= 300 * 1024){
      try{ content = await readText(file); }catch(e){}
    }
    myFiles().push({ id: uid(), name: file.name, size: file.size, type: file.type, content, createdAt: Date.now() });
    added++;
  }
  if (added){ saveFiles(); toast(`${added} fichier${added > 1 ? "s" : ""} ajouté${added > 1 ? "s" : ""}`); render(); }
}
function vModules(){
  const cards = Object.keys(MODES).map(k => `
    <div class="card mod">
      <div class="mi">${svg(MODES[k].icon)}</div>
      <h3>${MODES[k].name}</h3>
      <p>${MODES[k].desc}</p>
      <ul>${MODES[k].bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
      <button class="btn btn-accent" data-action="use-module" data-mode="${k}">Utiliser ce module ${ic("arrow")}</button>
    </div>`).join("");
  return appShell("/app/modules", pageHead("Espace", "Modules", "Chaque module adapte le ton, la méthode et les réponses à votre besoin.") +
    `<div class="grid g2">${cards}</div>`);
}
 
/* =====================================================================
   ABONNEMENT (espace utilisateur, sans modification d'identité)
   ===================================================================== */
function vSubscription(){
  const adm = isAdmin(session.email);
  const sub = subs[emailOf(session.email)];
  const p = sub && PLANS[sub.plan] ? sub.plan : null;
  const block = adm
    ? `<div class="plan-status"><div><div class="label">Accès</div><b>Administrateur</b><p class="muted small" style="margin-top:6px">Accès complet à toutes les offres, sans paiement.</p></div><a class="btn btn-line btn-sm" href="#/admin">Ouvrir l'administration</a></div>`
    : p
      ? `<div class="plan-status">
          <div><div class="label">Offre active</div><b>${PLANS[p].name} · ${PLANS[p].price} / mois</b>
            <p class="muted small" style="margin-top:6px">Active depuis le ${fmtDay(sub.since)} · prochain renouvellement le ${fmtDay(addMonths(sub.since, 1))}</p></div>
          <div class="row wrap-x">${promoHidden() ? "" : `<a class="btn btn-line btn-sm" href="#/tarifs">Changer d'offre</a>`}<button class="btn btn-ghost btn-sm" data-action="cancel-sub">Résilier</button></div>
        </div>`
      : `<div class="plan-status"><div><div class="label">Statut</div><b>Aucune offre active</b><p class="muted small" style="margin-top:6px">Choisissez une offre pour accéder au panel.</p></div><a class="btn btn-accent btn-sm" href="#/tarifs">Voir les offres</a></div>`;
  const features = p ? `<div class="card" style="margin-top:18px"><div class="card-h"><h3>Inclus dans votre offre</h3></div>
    <ul style="list-style:none;display:grid;gap:12px">${PLANS[p].feats.map(f => `<li class="row">${ic("check")} ${esc(f)}</li>`).join("")}</ul></div>` : "";
  return appShell("/app/offre", pageHead("Espace", "Abonnement", "Votre offre, son renouvellement et sa résiliation.") +
    `${block}${features}
    <p class="muted small" style="margin-top:18px">La facturation est gérée par notre prestataire de paiement. Pour vos informations personnelles, contactez l'administrateur.</p>`);
}
 
/* =====================================================================
   ADMINISTRATION
   ===================================================================== */
function allRows(){
  const emails = new Set([...Object.keys(users), ...Object.keys(subs)]);
  return [...emails].map(email => {
    const u = users[email] || {};
    const s = subs[email] || {};
    return {
      email,
      firstName: u.firstName || "",
      lastName:  u.lastName  || "",
      phone:     u.phone     || "",
      createdAt: u.createdAt || 0,
      lastLogin: u.lastLogin || 0,
      provider:  isAdmin(email) ? "admin" : (u.provider || "—"),
      plan:      s.plan || null,
      since:     s.since || null,
      ack:       !!s.ack,
      isAdmin:   isAdmin(email),
      convs:     (chats[email] || []).length,
      fileCount: (files[email] || []).length
    };
  });
}
const rowName = r => `${r.firstName} ${r.lastName}`.trim() || r.email.split("@")[0];
const providerBadge = p => p === "admin" ? `<span class="badge accent">ADMIN</span>`
  : p === "google" ? `<span class="badge">GOOGLE</span>`
  : p === "password" ? `<span class="badge ok">MOT DE PASSE</span>` : `<span class="badge">—</span>`;
function planBadge(r){
  if (r.isAdmin) return `<span class="badge accent">ILLIMITÉ</span>`;
  if (!r.plan) return `<span class="badge">AUCUNE</span>`;
  return `<span class="badge ok">${PLANS[r.plan].name.toUpperCase()}</span>`;
}
function planSelect(r){
  if (r.isAdmin) return planBadge(r);
  return `<select class="select" data-change="plan-select" data-email="${esc(r.email)}" aria-label="Offre de ${esc(rowName(r))}">
    <option value="">Aucune offre</option>
    ${Object.keys(PLANS).map(p => `<option value="${p}" ${effPlan(r.email) === p ? "selected" : ""}>${PLANS[p].name} · ${PLANS[p].price}</option>`).join("")}
  </select>`;
}
function sortBy(rows){
  const { key, dir } = ui.sort;
  const val = r => key === "name" ? rowName(r).toLowerCase() : key === "plan" ? (r.plan ? PLANS[r.plan].num : 0) : (r[key] ?? 0);
  return [...rows].sort((a, b) => { const x = val(a), y = val(b); return (x > y ? 1 : x < y ? -1 : 0) * dir; });
}
function th(label, key){
  const on = ui.sort.key === key;
  return `<th class="sort ${on ? "on" : ""}" data-action="sort" data-key="${key}" aria-sort="${on ? (ui.sort.dir > 0 ? "ascending" : "descending") : "none"}">${label}<i>${on ? (ui.sort.dir > 0 ? "↑" : "↓") : "↕"}</i></th>`;
}
function signupBars(){
  const rows = allRows().filter(r => !r.isAdmin);
  const days = [];
  for (let i = 13; i >= 0; i--){
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    const start = d.getTime(), end = start + 864e5;
    days.push({ label: d.getDate(), count: rows.filter(r => r.createdAt >= start && r.createdAt < end).length, today: i === 0 });
  }
  const max = Math.max(1, ...days.map(d => d.count));
  return `<div class="bars">${days.map(d => `<div class="b ${d.today ? "hi" : ""}" title="${d.count} inscription(s)"><i style="height:${Math.max(3, d.count / max * 100)}%"></i><span>${d.label}</span></div>`).join("")}</div>`;
}
function vAdminOverview(){
  const rows = allRows();
  const accounts = rows.filter(r => !r.isAdmin);
  const paying = rows.filter(r => r.plan && PLANS[r.plan]);
  const mrr = paying.reduce((s, r) => s + PLANS[r.plan].num, 0);
  const now = Date.now(), wk = 7 * 864e5;
  const newWeek = accounts.filter(r => r.createdAt > now - wk).length;
  const prevWeek = accounts.filter(r => r.createdAt <= now - wk && r.createdAt > now - 2 * wk).length;
  const conv = accounts.length ? Math.round(paying.length / accounts.length * 100) : 0;
  const counts = Object.keys(PLANS).map(k => ({ k, n: paying.filter(r => r.plan === k).length }));
  const recent = [...accounts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  const activity = logs.slice(0, 6);
  return appShell("/admin", pageHead("Administration", "Vue d'ensemble", "L'état de votre activité en un coup d'œil.") +
    `<div class="grid g4" style="margin-bottom:18px">
      ${kpi("Comptes", accounts.length, "", newWeek - prevWeek)}
      ${kpi("Abonnés actifs", paying.length, "avec une offre active")}
      ${kpi("Revenu mensuel", money(mrr), "estimation brute")}
      ${kpi("Conversion", conv + " %", "comptes payants")}
    </div>
    <div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start;margin-bottom:18px">
      <div class="card"><div class="card-h"><h3>Inscriptions · 14 jours</h3><span class="badge">${newWeek} cette semaine</span></div>${signupBars()}</div>
      <div class="card"><div class="card-h"><h3>Répartition des offres</h3></div>
        ${counts.map(c => `<div class="hbar"><span>${PLANS[c.k].name}</span><div class="track"><div class="fill" style="width:${paying.length ? c.n / paying.length * 100 : 0}%"></div></div><span class="v">${c.n}</span></div>`).join("")}
        <p class="muted small" style="margin-top:20px">${paying.length} abonné${paying.length > 1 ? "s" : ""} actif${paying.length > 1 ? "s" : ""}.</p>
      </div>
    </div>
    <div class="grid g2" style="align-items:start">
      <div class="card flat" style="padding:0">
        <div class="card-h" style="padding:20px 22px 0"><h3>Dernières inscriptions</h3><a class="linkbtn" href="#/admin/utilisateurs">Voir tout →</a></div>
        <div class="table-wrap" style="border:0;border-radius:0;margin-top:14px"><table class="tbl">
          <thead><tr><th>Nom</th><th>Inscrit le</th><th>Offre</th></tr></thead>
          <tbody>${recent.map(r => `<tr>
            <td><div class="who-cell"><span class="avatar sm">${esc(initial(rowName(r)))}</span><div><b>${esc(rowName(r))}</b><div class="dim small">${esc(r.email)}</div></div></div></td>
            <td>${fmtDate(r.createdAt)}</td><td>${planBadge(r)}</td></tr>`).join("") || `<tr><td colspan="3"><div class="empty" style="padding:30px"><b>Aucun compte</b>Les inscriptions apparaîtront ici.</div></td></tr>`}</tbody>
        </table></div>
      </div>
      <div class="card flat" style="padding:0">
        <div class="card-h" style="padding:20px 22px 0"><h3>Activité récente</h3><a class="linkbtn" href="#/admin/journal">Journal complet →</a></div>
        <div style="padding:14px 22px 20px;display:grid;gap:14px">
          ${activity.map(e => `<div class="row" style="align-items:flex-start"><span class="badge" style="min-width:110px;justify-content:center">${esc(e.type.toUpperCase())}</span><div style="min-width:0"><div class="small" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(e.email || "—")}</div><div class="dim small">${fmtDate(e.t)}</div></div></div>`).join("") || `<p class="muted">Aucune activité pour l'instant.</p>`}
        </div>
      </div>
    </div>`);
}
function vAdminUsers(){
  return appShell("/admin/utilisateurs", pageHead("Administration", "Utilisateurs", "Coordonnées, offre et historique de chaque compte.",
    `<div class="search">${ic("search")}<input class="input" placeholder="Nom, e-mail, téléphone…" aria-label="Rechercher un utilisateur" data-input="admin-search" /></div>
     <select class="select" data-change="admin-filter" aria-label="Filtrer par offre">
       <option value="all">Toutes les offres</option><option value="none">Sans offre</option>
       ${Object.keys(PLANS).map(p => `<option value="${p}">${PLANS[p].name}</option>`).join("")}
     </select>
     <button class="btn btn-line btn-sm" data-action="export-users">${ic("download")} Exporter CSV</button>`) +
    `<div class="table-wrap"><table class="tbl">
      <thead><tr>${th("Nom", "name")}${th("E-mail", "email")}<th>Téléphone</th>${th("Inscrit le", "createdAt")}${th("Dernière connexion", "lastLogin")}<th>Mode</th>${th("Offre", "plan")}<th><span class="sr-only"></span></th></tr></thead>
      <tbody id="admBody"></tbody>
    </table><div class="pager" id="admPager"></div></div>`);
}
function fillAdminUsers(){
  const body = $("#admBody"); if (!body) return;
  const q = ui.adminQ.toLowerCase();
  const f = ui.adminFilter;
  const all = allRows().filter(r => {
    if (q && ![r.email, r.firstName, r.lastName, r.phone].join(" ").toLowerCase().includes(q)) return false;
    if (f === "none") return !r.plan && !r.isAdmin;
    if (f !== "all") return r.plan === f;
    return true;
  });
  const sorted = sortBy(all);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE));
  ui.page = Math.min(ui.page, pages);
  const slice = sorted.slice((ui.page - 1) * PAGE, ui.page * PAGE);
 
  body.innerHTML = slice.map(r => `<tr>
    <td><div class="who-cell"><span class="avatar sm">${esc(initial(rowName(r)))}</span><b>${esc(rowName(r))}</b></div></td>
    <td>${esc(r.email)}</td>
    <td>${esc(r.phone || "—")}</td>
    <td>${fmtDate(r.createdAt)}</td>
    <td>${fmtDate(r.lastLogin)}</td>
    <td>${providerBadge(r.provider)}</td>
    <td>${planSelect(r)}</td>
    <td><div class="row" style="gap:4px;justify-content:flex-end">
      <button class="btn btn-ghost btn-icon btn-sm" data-action="edit-user" data-email="${esc(r.email)}" aria-label="Modifier">${ic("edit")}</button>
      ${r.isAdmin ? "" : `<button class="btn btn-ghost btn-icon btn-sm" data-action="delete-user" data-email="${esc(r.email)}" aria-label="Supprimer">${ic("trash")}</button>`}
    </div></td></tr>`).join("") || `<tr><td colspan="8"><div class="empty"><b>Aucun résultat</b>Modifiez la recherche ou le filtre.</div></td></tr>`;
 
  const pager = $("#admPager");
  if (pager){
    pager.innerHTML = `<span class="small muted">${sorted.length} compte${sorted.length > 1 ? "s" : ""} · page ${ui.page} / ${pages}</span>
      <div class="pages">
        <button data-action="page" data-p="${ui.page - 1}" ${ui.page <= 1 ? "disabled" : ""} aria-label="Page précédente">‹</button>
        ${Array.from({ length: pages }, (_, i) => `<button data-action="page" data-p="${i + 1}" class="${i + 1 === ui.page ? "on" : ""}">${i + 1}</button>`).join("")}
        <button data-action="page" data-p="${ui.page + 1}" ${ui.page >= pages ? "disabled" : ""} aria-label="Page suivante">›</button>
      </div>`;
  }
  const head = $("#admBody")?.closest("table")?.querySelector("thead");
  if (head) head.querySelector("tr").innerHTML = [
    th("Nom", "name"), th("E-mail", "email"), `<th>Téléphone</th>`, th("Inscrit le", "createdAt"),
    th("Dernière connexion", "lastLogin"), `<th>Mode</th>`, th("Offre", "plan"), `<th></th>`
  ].join("");
}
let stripeCache = null;
try { stripeCache = JSON.parse(sessionStorage.getItem("karat_stripe_subs") || "null"); } catch (e) { stripeCache = null; }
let accesCache = null;
try { accesCache = JSON.parse(sessionStorage.getItem("karat_acces") || "null"); } catch (e) { accesCache = null; }
const accesLoaded = () => !!(stripeCache || accesCache);
 
// Offre effective d'un compte : accès offert par l'administrateur, sinon abonnement Stripe
function effPlan(email){
  const k = emailOf(email);
  if (!accesLoaded()) return (subs[k] || {}).plan || null;
  const ov = (accesCache || {})[k];
  if (ov && PLANS[ov.plan]) return ov.plan;
  const st = (stripeCache || []).find(x => x.email === k);
  return st ? st.plan : null;
}
 
// Une ligne par compte : payant (Stripe) et/ou accès offert
function stripeRows(){
  const acc = accesCache || {};
  const byEmail = {};
  (stripeCache || []).forEach(x => { byEmail[x.email] = x; });
  return [...new Set([...Object.keys(byEmail), ...Object.keys(acc)])].map(email => {
    const st = byEmail[email] || {};
    const ov = acc[email];
    const offert = !!(ov && PLANS[ov.plan]);
    const parts = String(st.name || "").trim().split(" ");
    return {
      email,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" "),
      plan: offert ? ov.plan : (st.plan || null),
      stripePlan: st.plan || null,
      offert,
      since: st.since || (ov && ov.at) || 0,
    };
  }).filter(r => r.plan && PLANS[r.plan]);
}
const subSource = () => stripeRows();
function subKpisHTML(rows){
  const paying = rows.filter(r => r.stripePlan && PLANS[r.stripePlan]);
  const offered = rows.filter(r => r.offert);
  const mrr = paying.reduce((s, r) => s + PLANS[r.stripePlan].num, 0);
  return `${kpi("Abonnés payants", paying.length, "Stripe")}
      ${kpi("Accès offerts", offered.length, "gratuits")}
      ${kpi("Revenu mensuel", money(mrr), "MRR estimé")}
      ${kpi("Projection annuelle", money(mrr * 12), "sur la base actuelle")}`;
}
function vAdminSubs(){
  const rows = subSource();
  return appShell("/admin/abonnements", pageHead("Administration", "Abonnements", "Qui paie, qui a un accès offert, et quelle offre.",
    `<div class="search">${ic("search")}<input class="input" placeholder="Rechercher un abonné…" aria-label="Rechercher un abonné" data-input="sub-search" /></div>`) +
    `<div class="card" style="margin-bottom:18px">
      <div class="card-h"><h3>Connexion administrateur</h3></div>
      <p class="muted small" style="margin:6px 0 14px">Les abonnés payants viennent de Stripe. Les accès offerts sont enregistrés sur le serveur et valables sur tous les appareils.</p>
      <div class="row" style="gap:10px;flex-wrap:wrap"><input id="stripe-token" class="input" type="password" style="max-width:320px" value="${esc(adminToken())}" placeholder="Jeton administrateur" /><button class="btn btn-accent" data-action="stripe-load">Charger</button></div>
      <p id="stripeStatus" class="muted small" style="margin-top:12px"></p>
    </div>
    <div class="card" style="margin-bottom:18px">
      <div class="card-h"><h3>Donner ou retirer un accès</h3></div>
      <p class="muted small" style="margin:6px 0 14px">Un accès offert est gratuit : la personne n'est pas facturée. Pour arrêter un paiement Stripe, faites-le dans Stripe.</p>
      <div class="row" style="gap:10px;flex-wrap:wrap">
        <input id="acc-email" class="input" type="email" style="max-width:300px" placeholder="E-mail de la personne" aria-label="E-mail de la personne" />
        <select id="acc-plan" class="select" aria-label="Offre à donner">
          <option value="">Retirer l'accès offert</option>
          ${planOpts("")}
        </select>
        <button class="btn btn-accent" data-action="access-apply">Appliquer</button>
      </div>
    </div>
    <div class="grid g4" id="subKpis" style="margin-bottom:18px">${subKpisHTML(rows)}</div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Abonné</th><th>E-mail</th><th>Offre</th><th>Accès</th><th>Changer l'offre</th><th>Depuis</th></tr></thead>
      <tbody id="subBody"></tbody>
    </table></div>`);
}
function fillSubs(){
  const body = $("#subBody"); if (!body) return;
  const source = subSource();
  const kp = $("#subKpis"); if (kp) kp.innerHTML = subKpisHTML(source);
  const q = (($("[data-input='sub-search']") || {}).value || "").trim().toLowerCase();
  const list = source.filter(r => !q || (r.email + " " + rowName(r)).toLowerCase().includes(q));
  body.innerHTML = list.map(r => `<tr>
      <td><div class="who-cell"><span class="avatar sm">${esc(initial(rowName(r)))}</span><b>${esc(rowName(r))}</b></div></td>
      <td>${esc(r.email)}</td>
      <td>${esc(PLANS[r.plan].name)} · ${PLANS[r.plan].price}</td>
      <td>${r.offert ? '<span class="badge accent">GRATUIT</span>' : '<span class="badge ok">PAYANT</span>'}</td>
      <td><select class="select" data-change="plan-select" data-email="${esc(r.email)}" aria-label="Changer l'offre de ${esc(rowName(r))}">
        <option value="">${r.stripePlan ? "Retirer l'offre offerte" : "Retirer l'accès"}</option>
        ${planOpts(r.plan)}
      </select></td>
      <td>${r.since ? fmtDay(r.since) : "—"}</td>
    </tr>`).join("") || `<tr><td colspan="6"><div class="empty"><b>Aucun abonné</b>Saisissez le jeton administrateur puis cliquez sur Charger.</div></td></tr>`;
}
function planOpts(sel){ return Object.keys(PLANS).map(p => `<option value="${p}" ${sel === p ? "selected" : ""}>${PLANS[p].name}</option>`).join(""); }
 
// Enregistre sur le serveur un accès offert (plan) ou le retire (plan null)
async function setAccess(email, plan){
  const tok = adminToken();
  if (!tok){ toast("Saisissez le jeton administrateur dans Abonnements", true); return false; }
  try {
    const r = await fetch("/.netlify/functions/abo", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": tok },
      body: JSON.stringify({ email: emailOf(email), plan: plan || null }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Erreur");
    accesCache = d.acces || {};
    try { sessionStorage.setItem("karat_acces", JSON.stringify(accesCache)); } catch (e) {}
    toast(plan && PLANS[plan] ? "Accès offert : " + PLANS[plan].name : "Accès offert retiré");
    logEvent(plan ? "accès offert" : "accès retiré", email, plan && PLANS[plan] ? PLANS[plan].name : "");
    render();
    return true;
  } catch (e) {
    toast(e.message === "Jeton administrateur invalide" ? e.message : "Enregistrement impossible : " + e.message, true);
    return false;
  }
}
function vAdminLog(){
  const filtered = logs.filter(e => ui.logFilter === "all" || e.type === ui.logFilter);
  const types = [...new Set(logs.map(e => e.type))];
  return appShell("/admin/journal", pageHead("Administration", "Journal", "Inscriptions, connexions, abonnements et validations.",
    `<select class="select" data-change="log-filter" aria-label="Filtrer le journal">
       <option value="all">Tous les événements</option>
       ${types.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}
     </select>`) +
    `<div class="table-wrap"><table class="tbl logs">
      <thead><tr><th>Date</th><th>Événement</th><th>Compte</th><th>Détail</th></tr></thead>
      <tbody>${filtered.slice(0, 300).map(e => `<tr>
        <td>${fmtDate(e.t)}</td>
        <td><span class="badge">${esc(e.type.toUpperCase())}</span></td>
        <td>${esc(e.email || "—")}</td>
        <td class="muted">${esc(e.detail || "")}</td></tr>`).join("") || `<tr><td colspan="4"><div class="empty"><b>Aucun événement</b>Le journal se remplit au fil de l'activité.</div></td></tr>`}</tbody>
    </table></div>`);
}
function vAdminSettings(){
  const stat = (ok, label) => `<div class="between" style="padding:12px 0;border-bottom:1px solid var(--line)"><span>${label}</span>${ok ? `<span class="badge ok">CONFIGURÉ</span>` : `<span class="badge warn">À CONFIGURER</span>`}</div>`;
  const chatCount = Object.values(chats).reduce((s, a) => s + a.length, 0);
  const fileCount = Object.values(files).reduce((s, a) => s + a.length, 0);
  let bytes = 0;
  try{ Object.keys(localStorage).filter(k => k.startsWith("karat_")).forEach(k => bytes += localStorage.getItem(k).length); }catch(e){}
  return appShell("/admin/reglages", pageHead("Administration", "Réglages", "Intégrations, administrateurs et données.") +
    `<div class="grid g2" style="align-items:start">
      <div class="card">
        <div class="card-h"><h3>Administrateurs</h3></div>
        ${CONFIG.ADMIN_EMAILS.map(e => `<div class="between" style="padding:10px 0;border-bottom:1px solid var(--line)"><span class="mono small">${esc(e)}</span><span class="badge accent">ADMIN</span></div>`).join("")}
        <p class="muted small" style="margin-top:14px">Pour ajouter un administrateur, modifiez <span class="mono">ADMIN_EMAILS</span> dans la configuration.</p>
      </div>
      <div class="card">
        <div class="card-h"><h3>Intégrations</h3></div>
        ${stat(googleOn(), "Connexion Google")}
        ${stat(!!(CONFIG.PAYMENT_LINKS.essentiel && CONFIG.PAYMENT_LINKS.pro && CONFIG.PAYMENT_LINKS.expert), "Liens de paiement Stripe")}
        ${stat(!!CONFIG.VERIFY_ENDPOINT, "Serveur de vérification des abonnements")}
        ${stat(!!CONFIG.AI_ENDPOINT, "Moteur IA")}
      </div>
      <div class="card">
        <div class="card-h"><h3>Données sur cet appareil</h3></div>
        <div class="grid g2" style="gap:10px">
          ${kpi("Comptes", Object.keys(users).length)}
          ${kpi("Conversations", chatCount)}
          ${kpi("Fichiers", fileCount)}
          ${kpi("Espace utilisé", (bytes / 1024).toFixed(1) + " Ko")}
        </div>
        <div class="row" style="margin-top:16px"><button class="btn btn-line btn-sm" data-action="export-all">${ic("download")} Exporter (sans mots de passe)</button></div>
      </div>
      <div class="card danger-zone">
        <h3 style="font-family:var(--display);font-size:17px">Zone dangereuse</h3>
        <p class="muted small" style="margin:6px 0 16px">Efface tous les comptes, abonnements, conversations, fichiers et journaux de ce navigateur.</p>
        <button class="btn btn-danger btn-sm" data-action="reset-all">Tout réinitialiser</button>
      </div>
    </div>`);
}
function openEditUser(email){
  const r = allRows().find(x => x.email === email); if (!r) return;
  openModal(`<div class="sheet" role="dialog" aria-modal="true">
    <button class="x" data-action="close-modal" aria-label="Fermer">${svg("x")}</button>
    <h2>Modifier le compte</h2><p class="sub mono small">${esc(email)}</p>
    <form id="editUserForm" data-email="${esc(email)}" class="stack" style="margin-top:20px">
      <div class="form-grid">
        <div class="field"><label for="e-first">PRÉNOM</label><input id="e-first" class="input" name="first" value="${esc(r.firstName)}" /></div>
        <div class="field"><label for="e-last">NOM</label><input id="e-last" class="input" name="last" value="${esc(r.lastName)}" /></div>
        <div class="field full"><label for="e-phone">TÉLÉPHONE</label><input id="e-phone" class="input" name="phone" value="${esc(r.phone)}" /></div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-line" data-action="close-modal">Annuler</button>
        <button type="submit" class="btn btn-accent">Enregistrer</button>
      </div>
    </form></div>`);
}
function onEditUser(f){
  const email = f.dataset.email;
  const v = n => f.querySelector(`[name="${n}"]`).value.trim();
  users[email] = { ...(users[email] || { email }), firstName: v("first"), lastName: v("last"), phone: v("phone") };
  saveUsers(); closeModal(); toast("Compte mis à jour"); render();
}
 
/* =====================================================================
   EFFETS & ÉVÉNEMENTS
   ===================================================================== */
function initFX(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$(".card, .plan, .head, .console, .preview").forEach(el => { el.classList.add("reveal"); io.observe(el); });
  $$(".card, .plan").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      if (el.classList.contains("plan")){
        el.style.transform = `perspective(900px) rotateX(${(y / r.height - .5) * -6}deg) rotateY(${(x / r.width - .5) * 6}deg) translateY(-4px)`;
      }
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}
 
const ACTIONS = {
  "logout":        () => askConfirm("Se déconnecter ?", "Votre conversation en cours sera effacée de cet appareil.", doLogout, "Se déconnecter"),
  "close-modal":   () => closeModal(),
  "confirm-ok":    () => { const f = pendingOk; pendingOk = null; closeModal(); f && f(); },
  "plan":          el => startPlan(el.dataset.plan),
  "ack-confirm":   () => confirmAck(),
  "copy":          el => {
    const txt = el.dataset.text;
    const done = () => toast("Réponse copiée");
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => toast("Copie impossible", true));
    else toast("Copie non disponible sur ce navigateur", true);
  },
  "set-mode":      el => {
    ui.mode = el.dataset.mode;
    const c = ui.convId && convById(ui.convId);
    if (c){ c.mode = ui.mode; saveChats(); }
    render();
  },
  "new-chat":      () => { ui.convId = null; ui.attached = []; go("/app/chat"); },
  "suggest":       el => sendMessage(el.dataset.text),
  "pick-file":     () => { const f = $("#chatFile"); if (f) f.click(); },
  "img-remove":    el => { ui.pendingImg.splice(+el.dataset.idx, 1); rerenderKeepDraft(); },
  "file-remove":   el => { ui.pendingFiles.splice(+el.dataset.idx, 1); rerenderKeepDraft(); },
  "attach-pick":   el => { if (!ui.attached.includes(el.dataset.id)) ui.attached.push(el.dataset.id); closeModal(); render(); },
  "detach":        el => { ui.attached = ui.attached.filter(x => x !== el.dataset.id); render(); },
  "file-attach":   el => { ui.attached = [...new Set([...ui.attached, el.dataset.id])]; ui.convId = null; toast("Fichier joint"); go("/app/chat"); },
  "delete-file":   el => askConfirm("Supprimer ce fichier ?", "Il sera retiré de cet appareil.", () => {
    files[emailOf(session.email)] = myFiles().filter(f => f.id !== el.dataset.id);
    ui.attached = ui.attached.filter(x => x !== el.dataset.id);
    saveFiles(); toast("Fichier supprimé"); render();
  }),
  "delete-chat":   el => askConfirm("Supprimer cette conversation ?", "Cette action est définitive.", () => {
    chats[emailOf(session.email)] = myChats().filter(c => c.id !== el.dataset.id);
    saveChats(); toast("Conversation supprimée"); render();
  }),
  "use-module":    el => { ui.mode = el.dataset.mode; ui.convId = null; ui.attached = []; go("/app/chat"); },
  "cancel-sub":    () => askConfirm("Résilier l'abonnement ?", "Votre accès au panel sera désactivé immédiatement.", () => {
    const k = emailOf(session.email);
    logEvent("résiliation", k, "par l'utilisateur");
    delete subs[k]; saveSubs(); toast("Abonnement résilié"); go("/tarifs");
  }, "Résilier"),
  "access-apply": () => {
    const email = (($("#acc-email") || {}).value || "").trim();
    const plan = ($("#acc-plan") || {}).value || null;
    if (!email || !email.includes("@")) return toast("Saisissez un e-mail valide", true);
    setAccess(email, plan).then(ok => { if (ok) { const i = $("#acc-email"); if (i) i.value = ""; } });
  },
  "edit-user":     el => openEditUser(el.dataset.email),
  "delete-user":   el => askConfirm("Supprimer ce compte ?", "Le compte, son offre, ses conversations et ses fichiers seront effacés.", () => {
    const k = el.dataset.email;
    delete users[k]; delete subs[k]; delete chats[k]; delete files[k];
    saveUsers(); saveSubs(); saveChats(); saveFiles();
    logEvent("suppression", k, "par l'administrateur");
    if (session && emailOf(session.email) === k) doLogout();
    else { toast("Compte supprimé"); render(); }
  }),
  "sort":          el => {
    const key = el.dataset.key;
    ui.sort = ui.sort.key === key ? { key, dir: -ui.sort.dir } : { key, dir: key === "name" || key === "email" ? 1 : -1 };
    ui.page = 1; fillAdminUsers();
  },
  "page":          el => { const p = +el.dataset.p; if (p >= 1){ ui.page = p; fillAdminUsers(); } },
  "export-users":  () => {
    const head = ["Prénom","Nom","Email","Téléphone","Inscrit le","Dernière connexion","Mode","Offre","Validation"];
    const lines = [head.join(";")].concat(allRows().map(r => [
      r.firstName, r.lastName, r.email, r.phone, fmtDate(r.createdAt), fmtDate(r.lastLogin), r.provider, r.plan ? PLANS[r.plan].name : "Aucune", r.ack ? "oui" : "non"
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(";")));
    download("karat-comptes.csv", "﻿" + lines.join("\n"), "text/csv;charset=utf-8");
  },
  "export-all":    () => {
    const cleanUsers = Object.fromEntries(Object.entries(users).map(([k, u]) => { const { hash, salt, ...rest } = u; return [k, rest]; }));
    const cleanFiles = Object.fromEntries(Object.entries(files).map(([k, a]) => [k, a.map(({ content, ...f }) => f)]));
    download("karat-export.json", JSON.stringify({ users: cleanUsers, subs, chats, files: cleanFiles, logs }, null, 2), "application/json");
  },
  "reset-all":     () => askConfirm("Tout réinitialiser ?", "Tous les comptes, abonnements, conversations, fichiers et journaux de ce navigateur seront effacés.", () => {
    ["karat_users","karat_subs","karat_chats","karat_files","karat_logs","karat_session"].forEach(store.del);
    users = {}; subs = {}; chats = {}; files = {}; logs = []; session = null;
    toast("Données réinitialisées"); go("/");
  })
};
 
document.addEventListener("click", e => {
  if (e.target.matches && e.target.matches("[data-veil]")) return closeModal();
  const el = e.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.action];
  if (fn){ e.preventDefault(); fn(el); }
});
 
document.addEventListener("submit", e => {
  const f = e.target;
  const handlers = { loginForm: onLogin, signupForm: onSignup, composer: () => sendMessage(), editUserForm: onEditUser };
  if (handlers[f.id]){ e.preventDefault(); handlers[f.id](f); }
});
 
document.addEventListener("change", e => {
  const el = e.target;
  if (el.id === "fileInput"){ importFiles(el.files); el.value = ""; return; }
  if (el.dataset.ack !== undefined){ updateAckState(); return; }
  if (el.dataset.change === "plan-select"){ setAccess(el.dataset.email, el.value || null); return; }
  if (el.dataset.change === "admin-filter"){ ui.adminFilter = el.value; ui.page = 1; fillAdminUsers(); return; }
  if (el.dataset.change === "log-filter"){ ui.logFilter = el.value; render(); }
});
 
document.addEventListener("input", e => {
  const el = e.target;
  if (el.dataset.input === "admin-search"){ ui.adminQ = el.value; ui.page = 1; return fillAdminUsers(); }
  if (el.dataset.input === "sub-search") return fillSubs();
  if (el.dataset.input === "ok-field") return updateAckState();
  if (el.dataset.input === "filter-list"){
    const q = el.value.trim().toLowerCase();
    const sel = el.dataset.target === "conv" ? ".conv" : ".file";
    $$(sel).forEach(row => row.classList.toggle("hidden", !!q && !(row.dataset.s || "").includes(q)));
  }
  if (el.id === "input"){ el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 160) + "px"; }
});
 
document.addEventListener("keydown", e => {
  if (e.target.matches && e.target.matches("[data-enter]") && e.key === "Enter" && !e.shiftKey){
    e.preventDefault(); sendMessage();
  }
  if (e.key === "Escape") closeModal();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(".file[role=button], #drop")){
    e.preventDefault(); e.target.click();
  }
});
 
document.addEventListener("dragover", e => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d){ e.preventDefault(); d.classList.add("over"); } });
document.addEventListener("dragleave", e => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d) d.classList.remove("over"); });
document.addEventListener("drop", e => {
  const d = e.target.closest && e.target.closest("[data-drop]");
  if (!d) return;
  e.preventDefault(); d.classList.remove("over");
  importFiles(e.dataTransfer.files);
});
 
/* Glisser un fichier dans le chat : overlay « Ajouter », fichier joint au prochain message */
let dragDepth = 0;
const onChatRoute = () => !!session && currentRoute().path === "/app/chat";
function chatVeil(show){
  const old = $("#dropVeil");
  if (!show){ if (old) old.remove(); return; }
  if (old) return;
  const v = document.createElement("div");
  v.id = "dropVeil"; v.className = "dropveil";
  v.innerHTML = `<div class="dropveil-card"><div class="dropveil-ico">${svg("upload")}</div><b>Ajouter</b><p>Pour ajouter un fichier à la conversation, déposez-le ici</p></div>`;
  document.body.appendChild(v);
}
document.addEventListener("dragenter", e => {
  if (!onChatRoute() || !e.dataTransfer || !Array.from(e.dataTransfer.types).includes("Files")) return;
  e.preventDefault(); dragDepth++; chatVeil(true);
});
document.addEventListener("dragover", e => {
  if ($("#dropVeil") && !(e.target.closest && e.target.closest("[data-drop]"))) e.preventDefault();
});
document.addEventListener("dragleave", () => {
  if (!$("#dropVeil")) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) chatVeil(false);
});
document.addEventListener("drop", async e => {
  if (!$("#dropVeil") || (e.target.closest && e.target.closest("[data-drop]"))) return;
  e.preventDefault(); dragDepth = 0; chatVeil(false);
  await handleChatFiles(e.dataTransfer.files);
});
/* =====================================================================
   ANNONCES : affichées à l'ouverture du site, gérées par l'administrateur
   ===================================================================== */
const adminToken = () => { try { return sessionStorage.getItem("karat_admin_token") || ""; } catch (e) { return ""; } };
async function fetchAnnonces(){
  try {
    const r = await fetch("/.netlify/functions/annonces", { cache: "no-store" });
    const d = await r.json();
    return Array.isArray(d.annonces) ? d.annonces : [];
  } catch (e) { return []; }
}
async function showAnnoncesOnOpen(){
  const list = await fetchAnnonces();
  if (!list.length) return;
  let seen = "";
  try { seen = sessionStorage.getItem("karat_ann_seen") || ""; } catch (e) {}
  const seenIds = seen.split(",");
  const fresh = list.filter(a => !seenIds.includes(a.id));
  if (!fresh.length) return;
  try { sessionStorage.setItem("karat_ann_seen", list.map(a => a.id).join(",")); } catch (e) {}
  openModal(`<div class="sheet" role="dialog" aria-modal="true" aria-label="Annonces">
    <button class="x" data-action="close-modal" aria-label="Fermer">${svg("x")}</button>
    <div class="label">Annonce</div>
    ${fresh.map(a => `<h3 style="margin-top:12px">${esc(a.title)}</h3>${a.text ? `<p class="muted" style="margin-top:6px;white-space:pre-line">${esc(a.text)}</p>` : ""}`).join("")}
    <div class="row" style="margin-top:22px;justify-content:flex-end"><button class="btn btn-accent" data-action="close-modal">Compris</button></div>
  </div>`);
}
function vAdminAnnonces(){
  const opts = [[1, "1 heure"], [6, "6 heures"], [24, "24 heures"], [72, "3 jours"], [168, "7 jours"]]
    .map(([h, l]) => `<option value="${h}" ${h === 24 ? "selected" : ""}>${l}</option>`).join("");
  return appShell("/admin/annonces", pageHead("Administration", "Annonces", "Affichées à l'ouverture du site, puis retirées automatiquement à la fin de leur durée.") +
    `<div class="grid g2" style="align-items:start">
      <div class="card">
        <div class="card-h"><h3>Nouvelle annonce</h3></div>
        <div class="field" style="margin-bottom:14px"><label for="ann-title">TITRE</label><input id="ann-title" class="input" maxlength="120" placeholder="Ex : Maintenance ce soir" /></div>
        <div class="field" style="margin-bottom:14px"><label for="ann-text">MESSAGE</label><textarea id="ann-text" class="textarea" rows="4" maxlength="600" placeholder="Votre message (facultatif)"></textarea></div>
        <div class="field" style="margin-bottom:14px"><label for="ann-hours">DURÉE D'AFFICHAGE</label><select id="ann-hours" class="select" style="width:100%;height:44px">${opts}</select></div>
        <div class="field" style="margin-bottom:18px"><label for="ann-token">JETON ADMINISTRATEUR</label><input id="ann-token" class="input" type="password" value="${esc(adminToken())}" placeholder="Votre jeton" /></div>
        <button class="btn btn-accent" data-action="ann-create">Publier l'annonce</button>
      </div>
      <div class="card" id="ann-list"><div class="card-h"><h3>Annonces en cours</h3></div><p class="muted small">Chargement…</p></div>
    </div>`);
}
async function fillAnnonceList(){
  const box = $("#ann-list"); if (!box) return;
  const list = await fetchAnnonces();
  const rows = list.length ? list.map(a => {
    const left = Math.max(0, Math.round((a.until - Date.now()) / 3600e3));
    return `<div class="between" style="padding:12px 0;border-bottom:1px solid var(--line);gap:12px">
      <div style="min-width:0"><b>${esc(a.title)}</b><div class="dim small">${left} h restantes</div></div>
      <button class="btn btn-danger btn-sm" data-action="ann-del" data-id="${esc(a.id)}">Retirer</button></div>`;
  }).join("") : `<p class="muted small">Aucune annonce en cours.</p>`;
  box.innerHTML = `<div class="card-h"><h3>Annonces en cours</h3></div>${rows}`;
}
 
/* =====================================================================
   GÉNÉRATION D'IMAGES (abonnés payants)
   ===================================================================== */
const imagesUsed = () => { const u = users[emailOf(session && session.email)]; return (u && u.imagesUsed) || 0; };
function vImages(){
  return appShell("/app/images", pageHead("Espace", "Génération d'images", "Décrivez l'image souhaitée, KARAT la génère pour vous.") +
    `<div class="card" style="max-width:720px">
      ${inTrial() && TRIAL_IMAGES === 0 ? `<p class="muted small" style="margin-bottom:14px">La génération d'images n'est pas incluse dans l'essai gratuit. Choisissez une offre pour y accéder.</p>` : inTrial() ? `<p class="muted small" style="margin-bottom:14px">Essai gratuit : ${Math.max(0, TRIAL_IMAGES - imagesUsed())} image(s) restante(s) sur ${TRIAL_IMAGES}.</p>` : ""}
      <div class="field" style="margin-bottom:16px"><label for="img-prompt">DESCRIPTION</label><textarea id="img-prompt" class="textarea" rows="3" maxlength="1000" placeholder="Ex : un logo minimaliste vert citron sur fond noir"></textarea></div>
      <button class="btn btn-accent" data-action="img-generate">Générer l'image</button>
      <div id="img-out" style="margin-top:22px"></div>
    </div>`);
}
 
Object.assign(ACTIONS, {
  "ann-create": async () => {
    const title = ($("#ann-title")?.value || "").trim();
    const text = ($("#ann-text")?.value || "").trim();
    const hours = Number($("#ann-hours")?.value) || 24;
    const token = ($("#ann-token")?.value || "").trim();
    if (!title) return toast("Ajoutez un titre", true);
    if (!token) return toast("Jeton administrateur requis", true);
    try { sessionStorage.setItem("karat_admin_token", token); } catch (e) {}
    const r = await fetch("/.netlify/functions/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ title, text, hours })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return toast(d.error || "Publication impossible", true);
    toast("Annonce publiée");
    $("#ann-title").value = ""; $("#ann-text").value = "";
    fillAnnonceList();
  },
  "ann-del": async el => {
    const token = ($("#ann-token")?.value || "").trim() || adminToken();
    const r = await fetch("/.netlify/functions/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ action: "delete", id: el.dataset.id })
    });
    if (!r.ok) return toast("Retrait impossible", true);
    toast("Annonce retirée");
    fillAnnonceList();
  },
  "img-generate": async () => {
    const prompt = ($("#img-prompt")?.value || "").trim();
    const out = $("#img-out");
    if (!prompt) return toast("Décrivez l'image souhaitée", true);
    if (!paidAccess() && imagesUsed() >= TRIAL_IMAGES){
      toast("Essai terminé : choisissez une offre pour générer plus d'images", true);
      return go("/tarifs");
    }
    out.innerHTML = `<p class="muted small">Génération en cours, cela peut prendre quelques secondes…</p>`;
    try {
      const r = await fetch("/.netlify/functions/image", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.image) throw new Error(d.error || "Erreur");
      if (!paidAccess()) { const u = users[emailOf(session.email)]; if (u){ u.imagesUsed = imagesUsed() + 1; saveUsers(); } }
      out.innerHTML = `<img src="${d.image}" alt="${esc(prompt)}" style="width:100%;max-width:520px;border-radius:14px;border:1px solid var(--line)">
        <div style="margin-top:14px"><a class="btn btn-line btn-sm" href="${d.image}" download="karat-image.png">Télécharger</a></div>`;
    } catch (e) {
      out.innerHTML = `<p class="muted small">La génération a échoué. Réessayez dans un instant.</p>`;
    }
  }
});
 
Object.assign(ACTIONS, {
  "copy-code": el => {
    const txt = el.dataset.code || "";
    const ok = () => toast("Code copié");
    const ko = () => toast("Copie impossible", true);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, ko);
    else ko();
  }
});
 
document.addEventListener("click", e => {
  const d = e.target.closest && e.target.closest("#drop");
  if (d && !e.target.closest("button")) $("#fileInput")?.click();
});
 
/* =====================================================================
   SUPPORT : contact par e-mail
   ===================================================================== */
Object.assign(ICON, { mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' });
const SUPPORT_EMAIL = "karatsupport@gmail.com";
function vSupport(){
  const sujet = enc("Demande KARAT");
  const corps = enc("Bonjour,\n\nCompte KARAT : " + (session ? session.email : "") + "\n\nMon problème :\n\n");
  return appShell("/app/support", pageHead("Aide", "Support", "Une question, un problème ou une demande ? Écrivez-nous.") +
    `<div class="card" style="max-width:640px;border-color:rgba(140,247,255,.35)">
      <div class="card-h"><h3 style="color:#8cf7ff">Contacter l'équipe KARAT</h3></div>
      <p class="muted" style="margin-top:8px;line-height:1.6">Décrivez votre problème par e-mail et indiquez l'adresse de votre compte : cela nous permet de répondre plus vite.</p>
      <div class="field" style="margin-top:20px"><label for="support-mail">ADRESSE E-MAIL</label>
        <div class="row" style="gap:10px"><input id="support-mail" class="input" readonly value="${SUPPORT_EMAIL}" /><button class="btn btn-line" style="border-color:#8cf7ff;color:#8cf7ff" data-action="support-copy">Copier</button></div>
      </div>
      <a class="btn" style="margin-top:18px;background:#8cf7ff;color:#0a0a0a" href="mailto:${SUPPORT_EMAIL}?subject=${sujet}&body=${corps}">Écrire un e-mail</a>
    </div>`);
}
Object.assign(ACTIONS, {
  "support-copy": () => {
    try { navigator.clipboard.writeText(SUPPORT_EMAIL); toast("Adresse copiée"); }
    catch (e) { toast("Copie impossible : sélectionnez l'adresse", true); }
  }
});
 
/* ---------- Abonnés en direct depuis Stripe (administrateur) ---------- */
async function fillStripeSubs(){
  const st = $("#stripeStatus"); if (!st) return;
  const tok = adminToken();
  if (!tok){ st.textContent = "Saisissez le jeton administrateur puis cliquez sur Charger."; return; }
  st.textContent = "Chargement…";
  try {
    const r = await fetch("/.netlify/functions/abo?admin=1", { cache: "no-store", headers: { "x-admin-token": tok } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Erreur");
    stripeCache = d.subs || [];
    accesCache = d.acces || {};
    try {
      sessionStorage.setItem("karat_stripe_subs", JSON.stringify(stripeCache));
      sessionStorage.setItem("karat_acces", JSON.stringify(accesCache));
    } catch (e) {}
    const nb = stripeRows().length;
    st.textContent = d.stripeOk === false
      ? "Accès offerts chargés. Stripe est injoignable : les abonnés payants ne sont pas affichés."
      : `${nb} compte${nb > 1 ? "s" : ""} chargé${nb > 1 ? "s" : ""} (payants Stripe et accès offerts).`;
    fillSubs();
  } catch (e) {
    st.textContent = e.message === "Jeton administrateur invalide" ? e.message : "Chargement impossible, vérifiez la configuration Stripe.";
  }
}
Object.assign(ACTIONS, {
  "stripe-load": () => {
    const v = ($("#stripe-token") || {}).value?.trim() || "";
    try { sessionStorage.setItem("karat_admin_token", v); } catch (e) {}
    fillStripeSubs();
  }
});
 
/* ---------- Pièces jointes du chat : images (réduites) et fichiers ---------- */
function rerenderKeepDraft(){
  const draft = ($("#input") || {}).value || "";
  render();
  const ni = $("#input");
  if (ni){ ni.value = draft; ni.dispatchEvent(new Event("input", { bubbles: true })); }
}
function shrinkImage(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const draw = (maxSide, quality) => {
      const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", quality);
    };
    img.onload = () => {
      const data = draw(1280, 0.85);
      const thumb = draw(240, 0.7);
      URL.revokeObjectURL(url);
      res({ data, thumb });
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("image illisible")); };
    img.src = url;
  });
}
function readDataURL(file){
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
}
async function handleChatFiles(list){
  const draft = ($("#input") || {}).value || "";
  for (const file of Array.from(list || [])){
    if (/^image\//.test(file.type)){
      if (ui.pendingImg.length >= 4){ toast("4 images maximum par message", true); break; }
      try { const im = await shrinkImage(file); ui.pendingImg.push({ name: file.name, data: im.data, thumb: im.thumb }); }
      catch (e) { toast(`« ${file.name} » est illisible`, true); }
    } else if (/\.pdf$/i.test(file.name) || file.type === "application/pdf"){
      if (file.size > 1.5 * 1024 * 1024){ toast(`« ${file.name} » dépasse 1,5 Mo`, true); continue; }
      if (ui.pendingFiles.filter(f => f.pdf).length >= 2){ toast("2 PDF maximum par message", true); continue; }
      try { ui.pendingFiles.push({ name: file.name, content: null, pdf: await readDataURL(file) }); }
      catch (e) { toast(`« ${file.name} » est illisible`, true); }
    } else if (isTextLike(file)){
      if (file.size > 300 * 1024){ toast(`« ${file.name} » dépasse 300 Ko`, true); continue; }
      try { ui.pendingFiles.push({ name: file.name, content: await readText(file), pdf: null }); }
      catch (e) { toast(`« ${file.name} » est illisible`, true); }
    } else {
      toast(`« ${file.name} » : format non lu. Joignez du texte, un PDF ou une image.`, true);
    }
  }
  rerenderKeepDraft();
  const ni = $("#input"); if (ni && draft && !ni.value) ni.value = draft;
}
document.addEventListener("change", e => {
  if (e.target && e.target.id === "chatFile"){
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    handleChatFiles(picked);
  }
});
 
render();
showAnnoncesOnOpen();
if (session) syncPlan().then(() => render());
 
