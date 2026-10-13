/* =====================================================================
   KARAT — design system
   ===================================================================== */
:root{
  --bg:#0b0b0b; --bg2:#0e0e0e; --panel:#141414; --panel2:#1a1a1a; --raised:#222222;
  --line:rgba(255,255,255,.07); --line2:rgba(255,255,255,.13);
  --text:#f2f2ef; --muted:#a3a39c; --dim:#66665f;
  --accent:#d7ff3f; --accent2:#8cf7ff; --accent-ink:#0a0a0a;
  --ok:#8fd694; --warn:#e6c07b; --danger:#e88a80;
  --r:18px; --r-sm:12px;
  --display:'Space Grotesk',system-ui,sans-serif;
  --sans:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --mono:'JetBrains Mono',ui-monospace,Menlo,monospace;
  --ease:cubic-bezier(.2,.8,.2,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.03;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer;border:0;background:none}
input,select,textarea{outline:none}
img{display:block;max-width:100%}
.hidden{display:none !important}
.mono{font-family:var(--mono)}
.muted{color:var(--muted)}
.dim{color:var(--dim)}
.small{font-size:12.5px}
.nowrap{white-space:nowrap}
.row{display:flex;align-items:center;gap:10px}
.between{display:flex;align-items:center;justify-content:space-between;gap:12px}
.wrap-x{flex-wrap:wrap}
.grow{flex:1}
.stack{display:flex;flex-direction:column;gap:14px}
.label{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.ico{width:18px;height:18px;flex:0 0 18px;display:inline-block;vertical-align:middle}
.ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}

/* ---------- Boutons ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 20px;border-radius:12px;font-weight:600;font-size:14px;white-space:nowrap;transition:background .2s,transform .15s,border-color .2s,color .2s,opacity .2s}
.btn:active{transform:scale(.98)}
.btn[disabled]{opacity:.4;pointer-events:none}
.btn-accent{background:var(--accent);color:var(--accent-ink)}
.btn-accent:hover{background:#e6ff7a}
.btn-line{border:1px solid var(--line2);color:var(--text)}
.btn-line:hover{border-color:rgba(255,255,255,.32);background:rgba(255,255,255,.03)}
.btn-ghost{color:var(--muted)}
.btn-ghost:hover{color:var(--text);background:rgba(255,255,255,.04)}
.btn-danger{background:var(--danger);color:#0a0a0a}
.btn-danger:hover{background:#ff9d97}
.btn-block{width:100%}
.btn-sm{height:34px;padding:0 13px;font-size:13px;border-radius:10px}
.btn-icon{width:36px;height:36px;padding:0;border-radius:10px}
.linkbtn{color:var(--accent);font-weight:600;font-size:13.5px}
.linkbtn:hover{text-decoration:underline}

/* ---------- Badges, avatars, tuiles ---------- */
.badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;padding:4px 9px;border-radius:7px;white-space:nowrap;background:var(--raised);color:var(--muted)}
.badge.ok{background:rgba(126,231,135,.12);color:var(--ok)}
.badge.accent{background:var(--accent);color:var(--accent-ink)}
.badge.warn{background:rgba(255,209,102,.12);color:var(--warn)}
.badge.danger{background:rgba(255,123,114,.12);color:var(--danger)}
.avatar{width:34px;height:34px;flex:0 0 34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));color:var(--accent-ink);display:grid;place-items:center;font-weight:700;font-size:13px;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.avatar.sm{width:26px;height:26px;flex-basis:26px;font-size:11px}

/* ---------- Cartes ---------- */
.card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:var(--r);padding:24px;position:relative;overflow:hidden}
.card-h{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}
.card-h h3{font-family:var(--display);font-size:17px;font-weight:600;letter-spacing:-.01em}
.card.flat{background:var(--panel)}
.card.glow::before{content:"";position:absolute;inset:-1px;border-radius:inherit;pointer-events:none;background:radial-gradient(500px circle at var(--mx,0) var(--my,0),rgba(215,255,63,.08),transparent 45%)}
.grid{display:grid;gap:14px}
.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.kpi{padding:20px 22px}
.kpi .k-l{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--dim);text-transform:uppercase}
.kpi .k-v{font-family:var(--display);font-size:30px;letter-spacing:-.03em;font-weight:700;margin-top:10px;line-height:1}
.kpi .k-s{font-size:12.5px;color:var(--muted);margin-top:8px}

/* ---------- Formulaires ---------- */
.field{display:flex;flex-direction:column;gap:7px}
.field label,.field .lab{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:.05em}
.input,.select,.textarea{width:100%;height:44px;border-radius:12px;background:var(--bg2);border:1px solid var(--line2);padding:0 14px;font-size:14px;transition:border-color .2s,box-shadow .2s}
.textarea{height:auto;min-height:44px;padding:12px 14px;resize:none}
.input:focus,.select:focus,.textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(215,255,63,.12)}
.select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239d9daa' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px;height:36px;font-size:13px;border-radius:10px;width:auto}
.check{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--muted)}
.check input{margin-top:3px;accent-color:#d7ff3f;width:15px;height:15px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form-grid .full{grid-column:1/-1}
.err{color:var(--danger);font-size:13px;min-height:18px}
.ok-msg{color:var(--ok);font-size:13px;min-height:18px}
.search{position:relative;display:flex;align-items:center}
.search .ico{position:absolute;left:12px;color:var(--dim)}
.search .input{padding-left:38px;height:40px;min-width:240px}

/* ---------- Segments & onglets ---------- */
.seg{display:inline-flex;background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:4px;gap:4px}
.seg button,.seg a{height:34px;padding:0 14px;border-radius:9px;font-size:13px;color:var(--muted);display:inline-flex;align-items:center;gap:7px;transition:background .2s,color .2s}
.seg button.on,.seg a.on{background:var(--raised);color:var(--text)}
.seg button:hover,.seg a:hover{color:var(--text)}

/* ---------- Tableaux ---------- */
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r);background:var(--panel)}
.tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.tbl th{text-align:left;font-family:var(--mono);font-size:10.5px;letter-spacing:.07em;color:var(--dim);padding:14px 16px;border-bottom:1px solid var(--line);font-weight:500;white-space:nowrap;text-transform:uppercase;background:rgba(255,255,255,.015)}
.tbl td{padding:13px 16px;border-bottom:1px solid var(--line);color:#dcdcd6;white-space:nowrap;vertical-align:middle}
.tbl tr:last-child td{border-bottom:0}
.tbl tbody tr{transition:background .15s}
.tbl tbody tr:hover td{background:rgba(255,255,255,.02)}
.tbl .who-cell{display:flex;align-items:center;gap:10px}
.tbl .who-cell b{font-weight:600;color:var(--text)}
.empty{text-align:center;padding:56px 20px;color:var(--muted)}
.empty .ico{width:40px;height:40px;margin:0 auto 14px;color:var(--dim)}
.empty .ico svg{stroke-width:1.4}
.empty b{display:block;color:var(--text);font-family:var(--display);font-size:18px;margin-bottom:6px}

/* ---------- Barres ---------- */
.bars{display:flex;align-items:flex-end;gap:6px;height:150px;padding-top:10px}
.bars .b{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:8px;height:100%}
.bars .b i{width:100%;border-radius:6px 6px 3px 3px;background:linear-gradient(180deg,var(--raised),#1d1d1d);min-height:3px;transition:height .6s var(--ease)}
.bars .b.hi i{background:linear-gradient(180deg,var(--accent),#9fcf1f)}
.bars .b span{font-family:var(--mono);font-size:10px;color:var(--dim)}
.hbar{display:grid;grid-template-columns:110px 1fr 70px;align-items:center;gap:12px;font-size:13.5px;margin-top:14px}
.hbar .track{height:8px;background:var(--raised);border-radius:99px;overflow:hidden}
.hbar .fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width .8s var(--ease)}
.hbar .v{font-family:var(--mono);font-size:12px;color:var(--muted);text-align:right}

/* ---------- Modales & toasts ---------- */
#modal-root:empty{display:none}
.veil{position:fixed;inset:0;z-index:100;background:rgba(3,3,6,.7);backdrop-filter:blur(10px);display:grid;place-items:center;padding:20px;animation:fade .2s}
@keyframes fade{from{opacity:0}}
.sheet{width:100%;max-width:460px;background:var(--panel);border:1px solid var(--line2);border-radius:22px;padding:30px;position:relative;animation:up .3s var(--ease);max-height:90vh;overflow:auto}
.sheet.wide{max-width:640px}
@keyframes up{from{transform:translateY(14px);opacity:0}}
.sheet h2{font-family:var(--display);font-size:24px;letter-spacing:-.03em;font-weight:700}
.sheet .sub{color:var(--muted);font-size:14px;margin-top:6px}
.sheet .x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:var(--muted)}
.sheet .x:hover{background:var(--raised);color:var(--text)}
.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px}
.toast-wrap{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none}
.toast{background:var(--accent);color:var(--accent-ink);padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;animation:up .3s var(--ease);box-shadow:0 20px 50px rgba(0,0,0,.5);max-width:calc(100vw - 40px)}
.toast.bad{background:var(--danger)}

/* ---------- Topbar publique ---------- */
.topbar{position:sticky;top:0;z-index:50;background:rgba(7,7,10,.78);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.topbar .wrap{display:flex;align-items:center;justify-content:space-between;height:68px;gap:20px}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:.02em}
.logo i{width:26px;height:26px;border-radius:7px;background:var(--accent);display:inline-block;position:relative;flex:0 0 26px}
.logo i::after{content:"";position:absolute;inset:7px;border-radius:2px;background:var(--accent-ink)}
.pubnav{display:flex;gap:28px;font-size:14px;color:var(--muted)}
.pubnav a:hover,.pubnav a.on{color:var(--text)}
.wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:0 24px}

/* ---------- Accueil ---------- */
.aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;filter:blur(90px)}
.aurora i{position:absolute;width:46vw;height:46vw;border-radius:50%;animation:drift 22s ease-in-out infinite alternate}
.aurora i:nth-child(1){background:rgba(215,255,63,.13);top:-12%;left:-8%}
.aurora i:nth-child(2){background:rgba(90,150,255,.12);top:35%;right:-12%;animation-delay:-7s}
.aurora i:nth-child(3){background:rgba(255,120,200,.08);bottom:-15%;left:30%;animation-delay:-13s}
@keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(9vw,7vh) scale(1.18)}}
.hero{position:relative;z-index:1;padding:88px 0 110px}
.hero .wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:9px;padding:7px 14px 7px 9px;border-radius:999px;background:var(--panel2);border:1px solid var(--line);font-size:13px;color:var(--muted)}
.pill b{background:var(--accent);color:var(--accent-ink);font-family:var(--mono);font-size:10.5px;padding:2px 7px;border-radius:999px}
h1.h-xl{font-family:var(--display);font-size:clamp(44px,6.4vw,84px);line-height:.98;letter-spacing:-.045em;font-weight:700;margin-top:26px}
h1 .acc{background:linear-gradient(90deg,#d7ff3f 0%,#8cf7ff 55%,#ffffff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
h1 .strike{color:var(--muted)}
h2.h-l{font-family:var(--display);font-size:clamp(30px,4vw,48px);letter-spacing:-.035em;line-height:1.05;font-weight:700}
.lead{margin-top:24px;color:var(--muted);font-size:17px;max-width:520px}
.ctas{display:flex;gap:12px;margin-top:36px;flex-wrap:wrap}
.proof{display:flex;gap:30px;margin-top:44px;padding-top:26px;border-top:1px solid var(--line)}
.proof b{display:block;font-family:var(--display);font-size:26px;letter-spacing:-.02em}
.proof span{font-size:12.5px;color:var(--dim)}
.console{background:var(--panel);border:1px solid var(--line2);border-radius:20px;overflow:hidden;box-shadow:0 60px 120px -40px rgba(215,255,63,.12)}
.console-top{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--dim)}
.live{display:inline-flex;align-items:center;gap:7px;color:var(--ok)}
.live::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ok);animation:blink 1.6s infinite}
@keyframes blink{50%{opacity:.25}}
.console-body{padding:22px 20px;min-height:270px;display:flex;flex-direction:column;gap:14px;font-size:14px}
.msg-in{align-self:flex-end;background:var(--text);color:var(--bg);padding:10px 14px;border-radius:14px 14px 4px 14px;max-width:85%;opacity:0;animation:rise .5s .4s forwards}
.msg-out{align-self:flex-start;background:var(--raised);padding:12px 14px;border-radius:14px 14px 14px 4px;max-width:90%;color:#d6d6dc;opacity:0;animation:rise .5s 1.4s forwards;font-family:var(--mono);font-size:12.5px;line-height:1.7}
.msg-out em{font-style:normal;color:var(--accent)}
@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.marquee{position:relative;z-index:1;overflow:hidden;border-block:1px solid var(--line);background:rgba(15,15,20,.6);padding:20px 0}
.marquee-track{display:flex;width:max-content;animation:mq 34s linear infinite;font-family:var(--display);font-size:22px;letter-spacing:-.01em;color:var(--muted);white-space:nowrap}
.marquee-track span{padding-right:56px}
.marquee-track span::after{content:"✦";margin-left:56px;color:var(--accent);font-size:14px;vertical-align:middle}
@keyframes mq{to{transform:translateX(-50%)}}
.section{position:relative;z-index:1;padding:110px 0}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;margin-bottom:52px;flex-wrap:wrap}
.head p{color:var(--muted);max-width:380px;font-size:15px}
.bento{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
.bento .card{transition:border-color .25s}
.bento .card:hover{border-color:var(--line2)}
.c-a{grid-column:span 4}.c-b{grid-column:span 2}.c-c{grid-column:span 2}.c-d{grid-column:span 4}.c-e{grid-column:span 2}
.card h3.t{font-family:var(--display);font-size:22px;letter-spacing:-.02em;margin-top:40px}
.card p.d{color:var(--muted);font-size:14.5px;margin-top:10px;max-width:440px}
.bar-demo{display:flex;gap:6px;align-items:flex-end;height:90px;margin-top:26px}
.bar-demo i{flex:1;background:var(--raised);border-radius:4px 4px 0 0}
.bar-demo i.hi{background:var(--accent)}
.big-num{font-family:var(--display);font-size:64px;letter-spacing:-.04em;font-weight:700;color:var(--accent);margin-top:34px;line-height:1}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.chips span{font-family:var(--mono);font-size:12px;padding:7px 11px;border-radius:8px;background:var(--raised);border:1px solid var(--line);color:#cfcfd6}
.cta-band{border-radius:28px;padding:56px;background:linear-gradient(135deg,rgba(215,255,63,.14),rgba(140,247,255,.06) 60%,transparent),var(--panel);border:1px solid var(--line2);display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap}

/* ---------- Tarifs ---------- */
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:stretch}
.plan{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:32px;display:flex;flex-direction:column;overflow:hidden;transition:transform .25s var(--ease),border-color .25s}
.plan:hover{border-color:var(--line2)}
.plan.hot{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.plan.hot .muted{color:rgba(10,10,10,.7)}
.plan.hot li{color:rgba(10,10,10,.8)}
.plan.hot .price span{color:rgba(10,10,10,.65)}
.plan .pname{font-family:var(--display);font-size:20px;font-weight:600}
.price{display:flex;align-items:baseline;gap:6px;margin-top:22px}
.price b{font-family:var(--display);font-size:56px;letter-spacing:-.05em;line-height:1}
.price span{color:var(--muted);font-size:14px}
.plan .desc{color:var(--muted);font-size:14px;margin-top:12px;min-height:44px}
.plan ul{list-style:none;margin:24px 0 28px;display:grid;gap:12px;font-size:14.5px;color:#d5d5dc}
.plan li{display:flex;gap:10px;align-items:center}
.plan li .ico{color:currentColor}
.plan .btn{width:100%;margin-top:auto}
.plan.hot .btn{background:var(--accent-ink);color:var(--accent)}
.plan.hot .btn:hover{background:#1c1c1c}
.plan .status{margin-top:12px;text-align:center;font-family:var(--mono);font-size:11.5px;color:var(--ok);min-height:16px}
.plan.hot .status{color:var(--accent-ink)}
.ribbon{position:absolute;top:18px;right:18px;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;padding:4px 9px;border-radius:6px;background:var(--accent-ink);color:var(--accent)}
details.faq{border-bottom:1px solid var(--line);padding:20px 0}
details.faq summary{cursor:pointer;font-family:var(--display);font-size:18px;list-style:none;display:flex;justify-content:space-between;align-items:center}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary::after{content:"+";font-size:22px;color:var(--muted)}
details.faq[open] summary::after{content:"–"}
details.faq p{color:var(--muted);margin-top:12px;max-width:720px}

/* ---------- Auth ---------- */
.auth-wrap{min-height:calc(100vh - 68px);display:grid;place-items:center;padding:60px 20px;position:relative;z-index:1}
.auth-card{width:100%;max-width:460px;background:var(--panel);border:1px solid var(--line2);border-radius:26px;padding:34px;animation:up .4s var(--ease)}
.auth-card h1{font-family:var(--display);font-size:28px;letter-spacing:-.03em;font-weight:700}
.auth-card .sub{color:var(--muted);font-size:14px;margin-top:6px}
.auth-card .seg{width:100%;margin-top:22px;display:grid;grid-template-columns:1fr 1fr}
.auth-card form{margin-top:22px;display:flex;flex-direction:column;gap:14px}
.or{display:flex;align-items:center;gap:12px;color:var(--dim);font-size:12px;margin:22px 0 4px}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--line)}
.gslot{display:flex;justify-content:center;min-height:44px}

/* ---------- Shell application & admin ---------- */
.shell{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:100vh;position:relative;z-index:1}
.side{position:sticky;top:0;height:100vh;background:rgba(11,11,11,.85);backdrop-filter:blur(14px);border-right:1px solid var(--line);padding:22px 16px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
.side .logo{padding:4px 10px 22px}
.side .group{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;padding:18px 12px 8px}
.side a.nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;font-size:14px;color:var(--muted);position:relative;transition:background .15s,color .15s}
.side a.nav-item:hover{background:rgba(255,255,255,.04);color:var(--text)}
.side a.nav-item.on{background:var(--raised);color:var(--text)}
.side a.nav-item.on::before{content:"";position:absolute;left:-16px;top:10px;bottom:10px;width:3px;border-radius:0 4px 4px 0;background:var(--accent)}
.side a.nav-item .count{margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--dim)}
.side .foot{margin-top:auto;padding-top:18px}
.side .me-card{display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;background:var(--panel2);border:1px solid var(--line)}
.side .me-card b{font-size:13.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
.side .me-card span{font-size:11.5px;color:var(--dim);font-family:var(--mono)}
.main{min-width:0;padding:34px 40px 60px}
.page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.page-head h1{font-family:var(--display);font-size:34px;letter-spacing:-.035em;font-weight:700;line-height:1.1}
.page-head p{color:var(--muted);margin-top:8px;font-size:14.5px}
.crumb{font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.topline{display:none}

/* ---------- Chat ---------- */
.chat{display:flex;flex-direction:column;height:calc(100vh - 68px - 34px - 60px);min-height:520px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.chat-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.chat-top .title{font-family:var(--display);font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}
.msgs{flex:1;overflow-y:auto;padding:26px 24px;display:flex;flex-direction:column;gap:18px}
.msg{display:flex;gap:12px;max-width:780px;animation:rise .35s var(--ease)}
.msg.me{align-self:flex-end;flex-direction:row-reverse}
.msg .who{width:30px;height:30px;flex:0 0 30px;border-radius:9px;display:grid;place-items:center;font-size:12px;font-weight:700;background:var(--accent);color:var(--accent-ink)}
.msg.me .who{background:var(--raised);color:var(--text)}
.bubble{padding:12px 16px;border-radius:16px;font-size:14.5px;line-height:1.65;white-space:pre-wrap;background:var(--raised);word-break:break-word}
.msg.me .bubble{background:var(--text);color:var(--bg);border-radius:16px 16px 4px 16px}
.msg.ai .bubble{border-radius:16px 16px 16px 4px}
.msg .meta{font-family:var(--mono);font-size:10.5px;color:var(--dim);margin-top:6px}
.msg .att{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;background:rgba(0,0,0,.12);padding:3px 8px;border-radius:6px;margin-bottom:8px}
.welcome{margin:auto;text-align:center;max-width:560px;padding:20px}
.welcome .big{width:64px;height:64px;margin:0 auto 18px;border-radius:20px;background:var(--raised);border:1px solid var(--line2);display:grid;place-items:center;color:var(--accent)}
.welcome .big .ico{width:28px;height:28px}
.welcome h2{font-family:var(--display);font-size:28px;letter-spacing:-.03em}
.welcome p{color:var(--muted);margin-top:8px}
.sugg{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:24px}
.sugg button{padding:10px 14px;border-radius:999px;border:1px solid var(--line2);background:var(--panel2);font-size:13px;color:var(--muted);transition:color .2s,border-color .2s}
.sugg button:hover{color:var(--text);border-color:var(--accent)}
.typing{display:inline-flex;gap:4px;padding:4px 0}
.typing i{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:b 1.2s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes b{0%,80%,100%{opacity:.2}40%{opacity:1}}
.composer{padding:14px 18px 14px;border-top:1px solid var(--line)}
.chips-att{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.chip{display:inline-flex;align-items:center;gap:8px;padding:6px 8px 6px 10px;border-radius:999px;background:var(--raised);border:1px solid var(--line2);font-size:12.5px;color:#d9d9e0}
.chip button{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;color:var(--muted)}
.chip button:hover{background:rgba(255,255,255,.08);color:var(--text)}
.inbox{display:flex;gap:10px;align-items:flex-end;background:var(--bg);border:1px solid var(--line2);border-radius:16px;padding:8px 8px 8px 8px;transition:border-color .2s,box-shadow .2s}
.inbox:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(215,255,63,.1)}
.inbox textarea{flex:1;resize:none;background:none;border:0;font-size:14.5px;padding:9px 8px;min-height:24px;max-height:160px;line-height:1.5}
.inbox textarea::placeholder{color:var(--dim)}
.send{width:42px;height:42px;flex:0 0 42px;border-radius:12px;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;transition:transform .15s}
.send:hover{transform:translateY(-1px)}
.send:disabled{opacity:.3;pointer-events:none}
.hint{font-family:var(--mono);font-size:10.5px;color:var(--dim);margin-top:9px;padding-left:4px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}

/* ---------- Historique / fichiers / modules ---------- */
.conv{display:flex;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid var(--line);transition:background .15s}
.conv:last-child{border-bottom:0}
.conv:hover{background:rgba(255,255,255,.02)}
.conv .ci{width:38px;height:38px;flex:0 0 38px;border-radius:11px;background:var(--raised);display:grid;place-items:center;color:var(--muted)}
.conv .ct{flex:1;min-width:0}
.conv .ct b{font-weight:600;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.conv .ct span{font-size:12.5px;color:var(--dim)}
.drop{border:1.5px dashed var(--line2);border-radius:var(--r);padding:38px 24px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;background:var(--panel)}
.drop:hover,.drop.over{border-color:var(--accent);background:rgba(215,255,63,.03)}
.drop .ico{width:40px;height:40px;margin:0 auto 12px;color:var(--accent)}
.drop input{display:none}
.file{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--line)}
.file:last-child{border-bottom:0}
.file .fi{width:40px;height:40px;flex:0 0 40px;border-radius:11px;background:var(--raised);display:grid;place-items:center;font-family:var(--mono);font-size:10px;color:var(--accent)}
.file .fn{flex:1;min-width:0}
.file .fn b{font-weight:600;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file .fn span{font-size:12px;color:var(--dim);font-family:var(--mono)}
.mod{display:flex;flex-direction:column;gap:14px;transition:transform .25s var(--ease),border-color .25s}
.mod:hover{transform:translateY(-3px);border-color:var(--line2)}
.mod .mi{width:48px;height:48px;border-radius:14px;background:var(--raised);border:1px solid var(--line2);display:grid;place-items:center;color:var(--accent)}
.mod h3{font-family:var(--display);font-size:20px;letter-spacing:-.02em}
.mod p{color:var(--muted);font-size:14px}
.mod ul{list-style:none;display:grid;gap:8px;font-size:13px;color:#cfcfd6;margin-top:4px}
.mod ul li::before{content:"→ ";color:var(--accent)}
.mod .btn{margin-top:auto}

/* ---------- Compte / admin ---------- */
.plan-status{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:20px 22px;border-radius:var(--r);background:linear-gradient(135deg,rgba(215,255,63,.1),transparent 60%),var(--panel);border:1px solid var(--line2)}
.plan-status b{font-family:var(--display);font-size:22px;letter-spacing:-.02em}
.danger-zone{border:1px solid rgba(255,123,114,.25);background:rgba(255,123,114,.03)}

/* ---------- Responsive ---------- */
@media (max-width:1080px){
  .bento{grid-template-columns:1fr 1fr}
  .c-a,.c-d{grid-column:span 2}
  .c-b,.c-c,.c-e{grid-column:span 1}
  .g4{grid-template-columns:1fr 1fr}
}
@media (max-width:900px){
  .pubnav{display:none}
  .hero .wrap{grid-template-columns:1fr;gap:48px}
  .plans,.g3{grid-template-columns:1fr;max-width:480px;margin-left:auto;margin-right:auto}
  .g2{grid-template-columns:1fr}
  .shell{grid-template-columns:1fr}
  .side{position:sticky;top:0;height:auto;flex-direction:row;align-items:center;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);padding:10px 12px;gap:6px;z-index:40}
  .side .logo{padding:0 8px 0 4px;flex:0 0 auto}
  .side .group,.side .foot,.side .count{display:none}
  .side a.nav-item{flex:0 0 auto;white-space:nowrap;padding:9px 12px}
  .side a.nav-item.on::before{display:none}
  .main{padding:24px 18px 60px}
  .page-head h1{font-size:28px}
  .chat{height:calc(100vh - 150px);min-height:460px}
  .cta-band{padding:34px 26px}
  .form-grid{grid-template-columns:1fr}
  .search .input{min-width:0;width:100%}
  .search{width:100%}
}
@media (max-width:560px){
  .wrap{padding:0 16px}
  .hero{padding:56px 0 72px}
  .proof{gap:18px}
  .proof b{font-size:21px}
  .bento{grid-template-columns:1fr}
  .c-a,.c-b,.c-c,.c-d,.c-e{grid-column:span 1}
  .g4{grid-template-columns:1fr 1fr}
  .kpi .k-v{font-size:24px}
  .section{padding:80px 0}
  .plan{padding:26px}
  .topbar .btn-sm{padding:0 11px}
  .hbar{grid-template-columns:90px 1fr 60px}
  .modal-actions{grid-template-columns:1fr}
  .msg{max-width:100%}
  .tbl th,.tbl td{padding:11px 12px}
}
/* ---------- Finitions pro ---------- */
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:8px}
.pager{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-top:1px solid var(--line);flex-wrap:wrap}
.pager .pages{display:flex;gap:6px}
.pager .pages button{min-width:34px;height:34px;border-radius:10px;font-family:var(--mono);font-size:12.5px;color:var(--muted);border:1px solid var(--line)}
.pager .pages button.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.pager .pages button:disabled{opacity:.3;pointer-events:none}
.sort{cursor:pointer;user-select:none;transition:color .15s}
.sort:hover{color:var(--text)}
.sort.on{color:var(--text)}
.sort i{font-style:normal;margin-left:6px;opacity:.7}
.group-h{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;color:var(--dim);text-transform:uppercase;padding:20px 18px 8px}
.copy-btn{opacity:.55;transition:opacity .2s}
.msg:hover .copy-btn,.copy-btn:focus-visible{opacity:1}
.msg-meta{display:flex;gap:10px;align-items:center;margin-top:6px;font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.plan-block{margin:4px 0 8px;padding:14px;border-radius:14px;background:var(--panel2);border:1px solid var(--line)}
.plan-block b{font-family:var(--display);font-size:15px;display:block;margin-top:6px}
.plan-block a{font-size:12.5px;color:var(--accent);font-weight:600;margin-top:8px;display:inline-block}
.ob-wrap{min-height:100vh;position:relative;z-index:1}
.ob-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ob-step{padding:22px;border-radius:18px;background:var(--panel);border:1px solid var(--line)}
.ob-step .n{font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:.08em}
.ob-step h4{font-family:var(--display);font-size:16px;margin:12px 0 6px;font-weight:600}
.ob-step p{font-size:13.5px;color:var(--muted)}
.ack-list{display:grid;gap:10px}
.ack{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:var(--panel);cursor:pointer;font-size:14.5px;color:#dcdce2;transition:border-color .2s,background .2s}
.ack:hover{border-color:var(--line2)}
.ack input{margin-top:2px;width:18px;height:18px;flex:0 0 18px;accent-color:#d7ff3f}
.ack.on{border-color:rgba(215,255,63,.35);background:rgba(215,255,63,.03)}
.preview{border-radius:22px;border:1px solid var(--line2);background:var(--panel);overflow:hidden;box-shadow:0 60px 120px -50px rgba(215,255,63,.15)}
.pv-top{display:flex;gap:6px;padding:12px 14px;border-bottom:1px solid var(--line)}
.pv-top i{width:10px;height:10px;border-radius:50%;background:#2a2a33}
.pv-body{display:grid;grid-template-columns:140px 1fr;min-height:320px}
.pv-side{border-right:1px solid var(--line);padding:16px 14px;display:grid;gap:9px;align-content:start}
.pv-side span{height:9px;border-radius:6px;background:var(--raised)}
.pv-side span.on{background:var(--accent)}
.pv-main{padding:20px;display:grid;gap:10px;align-content:start}
.pv-b{padding:10px 13px;border-radius:12px;background:var(--raised);font-size:12.5px;color:#cfcfd6;max-width:82%;line-height:1.5}
.pv-b.me{justify-self:end;background:var(--text);color:var(--bg)}
.kpi .delta{font-family:var(--mono);font-size:11.5px;margin-top:8px}
.delta.up{color:var(--ok)}
.delta.down{color:var(--danger)}
.h-section{font-family:var(--display);font-size:17px;font-weight:600;margin:0 0 14px}
.logs td{font-family:var(--mono);font-size:12px}
@media (max-width:900px){
  .ob-grid{grid-template-columns:1fr 1fr}
  .pv-body{grid-template-columns:1fr}
  .pv-side{display:none}
}
@media (max-width:560px){
  .ob-grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* =====================================================================
   REFONTE PRO — couche finale (remplace les rendus précédents)
   ===================================================================== */
:root{
  --bg:#06060a; --panel:#0d0d13; --panel2:#181818; --raised:#1a1a24;
  --line:rgba(255,255,255,.06); --line2:rgba(255,255,255,.11);
  --accent:#d7ff3f; --accent-ink:#0b0b0b;
  --shadow-lg:0 30px 80px -30px rgba(0,0,0,.7);
}
body{background:
  radial-gradient(1200px 600px at 85% -10%,rgba(215,255,63,.07),transparent 60%),
  radial-gradient(900px 500px at -10% 20%,rgba(140,247,255,.05),transparent 60%),
  var(--bg);
  font-feature-settings:"cv11","ss01";letter-spacing:-.005em}
h1,h2,h3,h4{font-family:var(--display);letter-spacing:-.03em}

/* Topbar publique plus nette */
.topbar{background:rgba(6,6,10,.7);backdrop-filter:blur(20px) saturate(1.4);border-bottom:1px solid var(--line)}
.topbar .wrap{height:72px}
.logo{font-size:18px;font-weight:700}
.logo i{box-shadow:0 0 0 4px rgba(215,255,63,.08),0 8px 24px -6px rgba(215,255,63,.5)}
.pubnav a{font-size:14px;font-weight:500;position:relative;padding:6px 0}
.pubnav a.on::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;border-radius:2px;background:var(--accent)}

/* Boutons */
.btn{height:46px;padding:0 22px;border-radius:14px;font-weight:600;letter-spacing:-.005em}
.btn-accent{background:linear-gradient(180deg,#e4ff6b,#cdf52e);box-shadow:0 10px 30px -10px rgba(215,255,63,.55),inset 0 1px 0 rgba(255,255,255,.4)}
.btn-accent:hover{background:linear-gradient(180deg,#eeff8a,#d7ff3f);transform:translateY(-1px);box-shadow:0 14px 34px -10px rgba(215,255,63,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.btn-line{background:rgba(255,255,255,.02);border-color:var(--line2)}
.btn-line:hover{background:rgba(255,255,255,.05)}
.btn-sm{height:36px}

/* Cartes et surfaces */
.card{background:linear-gradient(180deg,rgba(24,24,33,.75),rgba(13,13,19,.9));border:1px solid var(--line);border-radius:20px;box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 20px 40px -28px rgba(0,0,0,.8)}
.card-h h3{font-size:16px}
.kpi .k-v{font-size:32px}
.kpi .k-l{font-size:10.5px}
.badge{border:1px solid var(--line)}

/* Champs */
.input,.select,.textarea{background:rgba(6,6,10,.7);border-color:var(--line2);border-radius:13px}
.input:hover,.select:hover,.textarea:hover{border-color:rgba(255,255,255,.2)}
.field label,.field .lab{font-size:11.5px;color:#b5b5c0}

/* Tableaux */
.table-wrap{border-radius:20px;background:rgba(13,13,19,.85);box-shadow:0 20px 40px -30px rgba(0,0,0,.8)}
.tbl th{font-size:10.5px;padding:15px 18px}
.tbl td{padding:14px 18px;font-size:13.5px}

/* Accueil */
.hero{padding:104px 0 120px}
h1.h-xl{font-size:clamp(46px,6.6vw,88px);letter-spacing:-.05em;line-height:.95}
.lead{font-size:18px;color:#a7a7b3;line-height:1.6}
.pill{background:rgba(255,255,255,.03);border-color:var(--line2)}
.console{border-radius:24px;background:rgba(10,10,15,.9);box-shadow:0 80px 140px -50px rgba(215,255,63,.18),0 0 0 1px rgba(255,255,255,.05)}
.proof{gap:44px}
.proof b{font-size:30px}
.bento .card{border-radius:22px;padding:28px}
.card h3.t{font-size:22px;margin-top:40px}
.card p.d{font-size:15px;color:#a3a3af}
.section{padding:120px 0}
.head h2.h-l,h2.h-l{font-size:clamp(34px,4.4vw,56px)}
.head p{font-size:16px}
.cta-band{border-radius:30px;padding:60px}

/* Tarifs */
.plan{border-radius:26px;padding:34px;background:linear-gradient(180deg,rgba(24,24,33,.6),rgba(13,13,19,.95))}
.plan:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.18);box-shadow:0 30px 60px -30px rgba(0,0,0,.8)}
.plan.hot{background:linear-gradient(180deg,#e4ff6b,#d7ff3f);box-shadow:0 40px 80px -30px rgba(215,255,63,.45)}
.plan.hot:hover{transform:translateY(-6px)}
.plan .pname{font-size:21px;letter-spacing:-.02em}
.price b{font-size:60px}
.plan ul{font-size:14.5px}
.plan .btn{height:50px}
.ribbon{background:var(--accent-ink);color:var(--accent);border-radius:999px;padding:5px 12px}

/* Auth */
.auth-card{border-radius:28px;padding:40px;background:linear-gradient(180deg,rgba(24,24,33,.7),rgba(13,13,19,.95));box-shadow:var(--shadow-lg)}
.auth-card h1{font-size:30px}
.auth-card .seg{border-radius:14px}

/* Application */
.side{background:rgba(11,11,11,.9);backdrop-filter:blur(20px);padding:24px 18px;border-right:1px solid var(--line)}
.side .logo{padding:4px 10px 28px}
.side .group{font-size:10px;padding:22px 12px 8px}
.side a.nav-item{padding:11px 13px;border-radius:13px;font-weight:500;font-size:14px}
.side a.nav-item:hover{background:rgba(255,255,255,.035)}
.side a.nav-item.on{background:linear-gradient(90deg,rgba(215,255,63,.1),rgba(255,255,255,.03));color:var(--text);box-shadow:inset 0 0 0 1px rgba(215,255,63,.12)}
.side .me-card{border-radius:16px;background:rgba(22,22,22,.8)}
.main{padding:40px 48px 70px}
.page-head h1{font-size:36px}
.page-head p{font-size:15px}
.crumb{color:var(--accent);opacity:.85}

/* Chat */
.chat{border-radius:24px;background:rgba(13,13,19,.85);box-shadow:var(--shadow-lg)}
.chat-top{padding:16px 22px;background:rgba(255,255,255,.012)}
.msgs{padding:30px 28px}
.bubble{font-size:15px;border-radius:18px}
.msg.ai .bubble{background:rgba(26,26,36,.9);border:1px solid var(--line)}
.msg.me .bubble{background:linear-gradient(180deg,#f3f3ef,#e4e4df)}
.welcome .big{border-radius:22px;background:linear-gradient(180deg,rgba(215,255,63,.12),rgba(215,255,63,.03));border-color:rgba(215,255,63,.25)}
.sugg button{border-radius:999px;background:rgba(22,22,22,.9);padding:10px 16px}
.composer{padding:16px 20px;background:rgba(11,11,11,.6)}
.inbox{border-radius:18px;background:rgba(6,6,10,.8);padding:8px 8px 8px 14px}
.send{border-radius:14px}

/* Modules, fichiers, historique */
.mod{border-radius:22px;padding:28px}
.mod .mi{border-radius:16px;background:linear-gradient(180deg,rgba(215,255,63,.12),rgba(215,255,63,.02));border-color:rgba(215,255,63,.22)}
.conv,.file{padding:16px 22px}
.drop{border-radius:22px;background:rgba(13,13,19,.6)}
.plan-status{border-radius:22px;padding:24px 26px}
.plan-status b{font-size:24px}

/* Modales */
.veil{background:rgba(3,3,6,.75)}
.sheet{border-radius:26px;background:linear-gradient(180deg,rgba(24,24,33,.95),rgba(13,13,19,.98));box-shadow:var(--shadow-lg)}
.toast{border-radius:14px}

/* Onboarding après paiement */
.ob-step{border-radius:20px;background:linear-gradient(180deg,rgba(24,24,33,.6),rgba(13,13,19,.9));padding:24px}
.ack{border-radius:18px;padding:18px 20px}

/* Admin */
.hbar .track{height:9px}
.bars .b i{border-radius:8px 8px 4px 4px}

@media (max-width:900px){
  .main{padding:26px 18px 60px}
  .hero{padding:64px 0 80px}
  .section{padding:84px 0}
  .side{background:rgba(11,11,11,.95)}
}
@media (max-width:560px){
  .plan{padding:26px}
  .auth-card{padding:28px 22px}
  .cta-band{padding:36px 26px}
  .main{padding:20px 14px 60px}
}

/* =====================================================================
   V3 — palette sobre (indigo) et finitions plus calmes
   ===================================================================== */
:root{
  --bg:#08090c; --panel:#0e1015; --panel2:#14161c; --raised:#1b1e26;
  --line:rgba(255,255,255,.07); --line2:rgba(255,255,255,.12);
  --text:#f2f4f8; --muted:#9aa1b2; --dim:#5f6677;
  --accent:#7c8cff; --accent2:#7c8cff; --accent-ink:#ffffff;
  --ok:#5fd29a; --warn:#e8b15a; --danger:#f0736b;
  --shadow-lg:0 24px 60px -28px rgba(0,0,0,.75);
}
body{background:var(--bg)}
body::after{opacity:.02}
.aurora{display:none}
.topbar{background:rgba(8,9,12,.82)}
.logo i{background:var(--accent);box-shadow:none}
.logo i::after{background:#0b0c12}
.pubnav a.on::after{background:var(--accent)}
h1 .acc{background:none;-webkit-text-fill-color:currentColor;color:var(--text)}
h1 .acc.hl{color:var(--accent)}

/* Boutons : plats, sans lueur */
.btn-accent{background:var(--accent);color:#fff;box-shadow:none}
.btn-accent:hover{background:#8e9dff;box-shadow:none;transform:none}
.btn-line{background:transparent;border-color:var(--line2)}
.btn-line:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.22)}
.btn-ghost:hover{background:rgba(255,255,255,.04)}
.linkbtn{color:var(--accent)}
:focus-visible{outline-color:var(--accent)}

/* Surfaces */
.card{background:var(--panel);border:1px solid var(--line);box-shadow:none}
.card.glow::before{display:none}
.badge.accent{background:rgba(124,140,255,.16);color:#b9c3ff}
.badge.ok{background:rgba(95,210,154,.1)}
.input:focus,.select:focus,.textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,140,255,.16)}
.input,.select,.textarea{background:#0b0c10;border-color:var(--line2)}
.table-wrap{background:var(--panel);box-shadow:none}
.tbl tbody tr:hover td{background:rgba(255,255,255,.02)}
.hbar .fill{background:var(--accent)}
.bars .b.hi i{background:var(--accent)}
.kpi .k-v{color:var(--text)}

/* Accueil */
.hero{padding:96px 0 110px}
.hero .wrap{gap:72px}
h1.h-xl{letter-spacing:-.045em;line-height:1.02;font-weight:650}
.lead{color:var(--muted)}
.pill{background:var(--panel);border-color:var(--line)}
.pill b{background:var(--accent);color:#fff}
.proof b{font-size:28px}
.console{background:var(--panel);box-shadow:var(--shadow-lg);border-color:var(--line2)}
.msg-in{background:#e9ebf2;color:#0b0c10}
.msg-out{background:var(--raised)}
.msg-out em{color:#b9c3ff}
.marquee{background:transparent}
.marquee-track span::after{color:var(--accent)}
.bento .card:hover{border-color:var(--line2)}
.bar-demo i.hi{background:var(--accent)}
.big-num{color:var(--text)}
.chips span{background:var(--raised)}
.cta-band{background:var(--panel);border:1px solid var(--line2);box-shadow:none}

/* Tarifs */
.plan{background:var(--panel);border:1px solid var(--line);box-shadow:none}
.plan:hover{transform:none;border-color:var(--line2);box-shadow:none}
.plan.hot{background:var(--panel2);border:1px solid var(--accent);color:var(--text);box-shadow:0 0 0 4px rgba(124,140,255,.08)}
.plan.hot:hover{transform:none}
.plan.hot .muted{color:var(--muted)}
.plan.hot li{color:#d5d9e3}
.plan.hot .price span{color:var(--muted)}
.plan.hot .btn{background:var(--accent);color:#fff}
.plan.hot .btn:hover{background:#8e9dff}
.plan.hot .status{color:var(--ok)}
.ribbon{background:var(--accent);color:#fff}
.plan ul li .ico{color:var(--accent)}
.plan:not(.hot) li .ico{color:var(--ok)}

/* Auth */
.auth-card{background:var(--panel);box-shadow:var(--shadow-lg);border-color:var(--line2)}
.auth-card .seg{background:#0b0c10}
.seg button.on,.seg a.on{background:var(--raised);color:var(--text)}

/* Application */
.side{background:#0b0c10;border-right:1px solid var(--line)}
.side a.nav-item.on{background:rgba(124,140,255,.1);box-shadow:none;color:var(--text)}
.side a.nav-item.on::before{background:var(--accent)}
.side .me-card{background:var(--panel)}
.crumb{color:var(--accent)}
.chat{background:var(--panel);box-shadow:none}
.chat-top{background:transparent}
.msg.ai .bubble{background:var(--panel2);border-color:var(--line)}
.msg.me .bubble{background:var(--accent);color:#fff}
.msg.me .who{background:var(--raised);color:var(--text)}
.msg .who{background:var(--accent);color:#fff}
.welcome .big{background:rgba(124,140,255,.1);border-color:rgba(124,140,255,.25);color:#b9c3ff}
.sugg button:hover{border-color:var(--accent)}
.composer{background:transparent}
.inbox{background:#0b0c10}
.inbox:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,140,255,.12)}
.send{background:var(--accent);color:#fff}
.mod .mi{background:rgba(124,140,255,.1);border-color:rgba(124,140,255,.22);color:#b9c3ff}
.drop:hover,.drop.over{border-color:var(--accent);background:rgba(124,140,255,.04)}
.file .fi{color:#b9c3ff}
.plan-status{background:var(--panel);box-shadow:none}
.plan-status b{color:var(--text)}

/* Modales & onboarding */
.sheet{background:var(--panel);box-shadow:var(--shadow-lg)}
.toast{background:var(--text);color:#0b0c10}
.toast.bad{background:var(--danger);color:#fff}
.ob-step{background:var(--panel)}
.ob-step .n{color:#b9c3ff}
.ack.on{border-color:rgba(124,140,255,.45);background:rgba(124,140,255,.05)}
.ack input{accent-color:var(--accent)}
.check input{accent-color:var(--accent)}
.pv-side span.on{background:var(--accent)}
.preview{box-shadow:var(--shadow-lg)}
.pv-b.me{background:var(--accent);color:#fff}
.pager .pages button.on{background:var(--accent);border-color:var(--accent);color:#fff}
.delta.up{color:var(--ok)}
.live::before{background:var(--ok)}

/* =====================================================================
   V4 — retour à la signature lime (#d7ff3f), finitions modernes
   ===================================================================== */
:root{
  --accent:#d7ff3f; --accent2:#8cf7ff; --accent-ink:#0a0a0a;
  --bg:#070708; --panel:#0e0f12; --panel2:#15161a; --raised:#1c1d22;
  --line:rgba(255,255,255,.07); --line2:rgba(255,255,255,.12);
}
body{background:var(--bg)}
.logo i{background:var(--accent);box-shadow:none}
.logo i::after{background:var(--accent-ink)}
.pubnav a.on::after{background:var(--accent)}
h1 .acc{background:none;-webkit-text-fill-color:currentColor;color:var(--accent)}
h1 .acc.hl{color:var(--accent)}
h1.h-xl{font-weight:650;letter-spacing:-.045em}
.btn-accent{background:var(--accent);color:var(--accent-ink);box-shadow:none}
.btn-accent:hover{background:#e3ff6e;box-shadow:none;transform:none}
.btn-line{background:transparent}
:focus-visible{outline-color:var(--accent)}
.badge.accent{background:var(--accent);color:var(--accent-ink)}
.badge.ok{background:rgba(126,231,135,.12);color:var(--ok)}
.input:focus,.select:focus,.textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(215,255,63,.12)}
.hbar .fill,.bars .b.hi i,.bar-demo i.hi{background:var(--accent)}
.card{background:var(--panel);border-color:var(--line)}
.card.glow::before{display:none}
.pill b{background:var(--accent);color:var(--accent-ink)}
.marquee-track span::after{color:var(--accent)}
.big-num{color:var(--accent)}
.live::before{background:var(--ok)}
.console{background:var(--panel);box-shadow:0 40px 80px -40px rgba(215,255,63,.14),0 0 0 1px var(--line2)}
.msg-in{background:var(--text);color:#0a0a0a}
.msg-out em{color:var(--accent)}
.crumb{color:var(--accent);opacity:.9}
.msg.me .bubble{background:var(--text);color:#0a0a0a}
.msg.ai .bubble{background:var(--panel2);border-color:var(--line)}
.msg .who{background:var(--accent);color:var(--accent-ink)}
.msg.me .who{background:var(--raised);color:var(--text)}
.welcome .big{background:rgba(215,255,63,.08);border-color:rgba(215,255,63,.25);color:var(--accent)}
.sugg button:hover{border-color:var(--accent)}
.send{background:var(--accent);color:var(--accent-ink)}
.inbox:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(215,255,63,.1)}
.mod .mi{background:rgba(215,255,63,.08);border-color:rgba(215,255,63,.22);color:var(--accent)}
.file .fi{color:var(--accent)}
.drop:hover,.drop.over{border-color:var(--accent);background:rgba(215,255,63,.03)}
.plan.hot{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);box-shadow:none}
.plan.hot .muted,.plan.hot li,.plan.hot .price span{color:rgba(10,10,10,.72)}
.plan.hot .btn{background:var(--accent-ink);color:var(--accent)}
.plan.hot .btn:hover{background:#1c1c1c}
.plan.hot .status{color:var(--accent-ink)}
.plan:not(.hot) li .ico{color:var(--ok)}
.ribbon{background:var(--accent-ink);color:var(--accent)}
.plan ul li .ico{color:var(--accent)}
.side a.nav-item.on{background:rgba(215,255,63,.07);color:var(--text);box-shadow:inset 0 0 0 1px rgba(215,255,63,.14)}
.side a.nav-item.on::before{background:var(--accent)}
.ob-step .n{color:var(--accent)}
.ack.on{border-color:rgba(215,255,63,.4);background:rgba(215,255,63,.04)}
.ack input,.check input{accent-color:var(--accent)}
.pv-side span.on{background:var(--accent)}
.pv-b.me{background:var(--accent);color:var(--accent-ink)}
.pager .pages button.on{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.toast{background:var(--accent);color:var(--accent-ink)}
.toast.bad{background:var(--danger);color:#0a0a0a}
.plan-status{background:linear-gradient(135deg,rgba(215,255,63,.07),transparent 60%),var(--panel)}
.plan.hot li .ico{color:var(--accent-ink)}
.plan.hot .desc{color:rgba(10,10,10,.8)}

/* =====================================================================
   V5 — style sobre, chaud et très épuré (inspiration : sites d'outils de dev modernes)
   ===================================================================== */
:root{
  --bg:#14120e; --bg2:#100e0b; --panel:#1a1814; --panel2:#201d18; --raised:#27231d;
  --line:rgba(255,245,225,.08); --line2:rgba(255,245,225,.14);
  --text:#f4efe6; --muted:#a9a293; --dim:#6f6a5e;
  --accent:#d7ff3f; --accent-ink:#11110c;
  --r:14px;
}
body{background:var(--bg);color:var(--text);font-feature-settings:"ss01","cv11";letter-spacing:-.01em}
body::after{display:none}
.aurora{display:none}
h1,h2,h3,h4{letter-spacing:-.035em}

/* Nav */
.topbar{background:rgba(20,18,14,.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.topbar .wrap{height:64px}
.logo{font-size:16px;font-weight:600;letter-spacing:-.01em}
.logo i{width:22px;height:22px;flex-basis:22px;border-radius:6px}
.logo i::after{inset:6px}
.pubnav{gap:26px;font-size:13.5px;color:var(--muted)}
.pubnav a.on::after{bottom:-19px;height:1px;border-radius:0;background:var(--text)}
.topbar .btn-line{background:transparent;border-color:var(--line2);color:var(--text);height:36px;font-size:13px}
.topbar .btn-accent{height:36px;font-size:13px;padding:0 16px;border-radius:10px}

/* Boutons */
.btn{border-radius:10px;height:42px;font-size:14px;font-weight:500;padding:0 18px}
.btn-accent{background:var(--text);color:#14120e;box-shadow:none}
.btn-accent:hover{background:#ffffff;box-shadow:none;transform:none}
.btn-line{background:transparent;border:1px solid var(--line2);color:var(--text)}
.btn-line:hover{background:rgba(255,245,225,.05)}
.btn-ghost{color:var(--muted)}
.btn-ghost:hover{color:var(--text);background:rgba(255,245,225,.04)}
.btn-sm{height:34px;font-size:13px;border-radius:9px}

/* Accueil */
.hero{padding:120px 0 90px;text-align:center}
.hero .wrap{grid-template-columns:1fr;gap:0;max-width:1000px;justify-items:center}
.hero .wrap > div:first-child{display:flex;flex-direction:column;align-items:center}
.pill{background:transparent;border:1px solid var(--line2);color:var(--muted);font-size:12.5px;padding:5px 12px 5px 6px}
.pill b{background:var(--accent);color:var(--accent-ink);border-radius:6px}
h1.h-xl{font-size:clamp(44px,6vw,80px);line-height:1.02;letter-spacing:-.05em;font-weight:600;margin-top:28px;max-width:900px}
h1 .acc{color:var(--accent);-webkit-text-fill-color:currentColor;background:none}
h1 .strike{color:var(--dim)}
.lead{font-size:18px;color:var(--muted);max-width:620px;margin-top:22px;text-align:center}
.ctas{justify-content:center;margin-top:34px;gap:10px}
.proof{justify-content:center;gap:56px;border-top:0;padding-top:0;margin-top:52px}
.proof b{font-size:22px;font-weight:600}
.proof span{color:var(--dim);font-size:12.5px}
.console{margin-top:72px;width:100%;max-width:980px;border-radius:14px;background:var(--bg2);border:1px solid var(--line2);box-shadow:0 0 0 8px rgba(255,245,225,.02),0 50px 120px -40px rgba(0,0,0,.8)}
.console-top{background:var(--panel);border-bottom:1px solid var(--line);font-size:11.5px;color:var(--dim)}
.console-body{min-height:320px;padding:28px}
.msg-in{background:var(--raised);color:var(--text);border-radius:10px}
.msg-out{background:transparent;border:1px solid var(--line);border-radius:10px;font-family:var(--sans);font-size:14px;color:var(--muted)}
.msg-out em{color:var(--accent)}
.marquee{background:transparent;border-color:var(--line)}
.marquee-track{font-size:18px;color:var(--dim)}
.marquee-track span::after{color:var(--dim)}

/* Sections & cartes */
.section{padding:120px 0}
.head{margin-bottom:56px}
h2.h-l{font-size:clamp(32px,4vw,50px);font-weight:600;letter-spacing:-.04em}
.head p{color:var(--muted)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);box-shadow:none}
.bento .card{border-radius:var(--r);padding:28px}
.bento .card:hover{border-color:var(--line2)}
.card h3.t{font-size:20px;font-weight:600;margin-top:36px}
.card p.d{color:var(--muted);font-size:14.5px}
.big-num{color:var(--text);font-weight:600}
.chips span{background:transparent;border-color:var(--line2);color:var(--muted);border-radius:8px}
.cta-band{background:var(--panel);border:1px solid var(--line2);border-radius:18px;padding:52px}

/* Tarifs */
.plan{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:30px}
.plan:hover{transform:none;border-color:var(--line2)}
.plan .pname{font-size:18px;font-weight:600}
.price b{font-size:52px;font-weight:600}
.plan.hot{background:var(--panel2);border:1px solid var(--line2);color:var(--text);box-shadow:none}
.plan.hot .btn{background:var(--text);color:#14120e}
.plan.hot .btn:hover{background:#fff}
.plan.hot .muted,.plan.hot li,.plan.hot .price span{color:var(--muted)}
.plan.hot li .ico{color:var(--text)}
.plan:not(.hot) li .ico{color:var(--muted)}
.ribbon{background:transparent;color:var(--muted);border:1px solid var(--line2);border-radius:999px}
details.faq{border-bottom-color:var(--line)}

/* Auth */
.auth-card{background:var(--panel);border:1px solid var(--line2);border-radius:18px;box-shadow:none}
.auth-card h1{font-size:26px;font-weight:600}
.seg{background:var(--bg2);border-color:var(--line)}
.seg button.on,.seg a.on{background:var(--raised);color:var(--text)}
.input,.select,.textarea{background:var(--bg2);border:1px solid var(--line2);border-radius:10px;height:42px}
.input:focus,.select:focus,.textarea:focus{border-color:var(--text);box-shadow:none}
.field label,.field .lab{color:var(--muted)}

/* Application */
.shell{background:var(--bg)}
.side{background:var(--bg2);border-right:1px solid var(--line);padding:20px 14px}
.side .logo{padding:4px 10px 24px}
.side a.nav-item{border-radius:9px;font-size:13.5px;color:var(--muted);padding:9px 11px}
.side a.nav-item:hover{background:rgba(255,245,225,.04);color:var(--text)}
.side a.nav-item.on{background:rgba(255,245,225,.07);color:var(--text);box-shadow:none}
.side a.nav-item.on::before{background:var(--text);width:2px}
.side .group{color:var(--dim);font-size:10px}
.side .me-card{background:var(--panel);border-radius:12px}
.main{padding:40px 48px}
.page-head h1{font-size:30px;font-weight:600}
.crumb{color:var(--dim)}
.chat{background:var(--bg2);border:1px solid var(--line);border-radius:14px;box-shadow:none}
.chat-top{background:transparent;border-bottom:1px solid var(--line)}
.msg.ai .bubble{background:transparent;border:1px solid var(--line);color:#e7e1d5}
.msg.me .bubble{background:var(--raised);color:var(--text);border:1px solid var(--line)}
.msg .who{background:var(--raised);color:var(--text);border:1px solid var(--line)}
.msg.me .who{background:var(--text);color:#14120e}
.inbox{background:var(--panel);border-radius:12px}
.send{background:var(--text);color:#14120e;border-radius:10px}
.welcome .big{background:var(--panel);border:1px solid var(--line2);color:var(--text)}
.sugg button{background:transparent;border-radius:999px}
.table-wrap,.plan-status,.drop,.sheet,.mod,.ob-step{background:var(--panel);border-color:var(--line)}
.tbl th{background:transparent}
.tbl tbody tr:hover td{background:rgba(255,245,225,.025)}
.badge{background:var(--raised);color:var(--muted)}
.kpi .k-v{font-weight:600;letter-spacing:-.03em}
.toast{border-radius:10px;background:var(--text);color:#14120e}
.veil{background:rgba(10,9,7,.75)}

/* Responsive */
@media (max-width:900px){
  .hero{padding:80px 0 60px}
  .proof{gap:28px;flex-wrap:wrap}
  .console{margin-top:52px}
  .section{padding:84px 0}
  .main{padding:26px 18px}
}
@media (max-width:560px){
  .proof{gap:20px}
  .cta-band{padding:34px 24px}
}
.plan.hot .desc{color:var(--muted)}
.plan.hot li .ico{color:var(--text)}

/* =====================================================================
   V6 — finitions : profondeur subtile, hiérarchie et lisibilité
   ===================================================================== */
body{font-size:15px}
/* Fond à points très discret sur l'accueil et l'application */
.hero,.main{background-image:radial-gradient(rgba(255,245,225,.055) 1px,transparent 1px);background-size:22px 22px;background-position:0 0}
.hero{background-image:radial-gradient(rgba(255,245,225,.06) 1px,transparent 1px),radial-gradient(ellipse 60% 50% at 50% 0%,rgba(215,255,63,.05),transparent 70%);background-size:22px 22px,100% 100%;mask-image:linear-gradient(180deg,#000 60%,transparent)}
.main{background-image:none}

/* Cartes : bordure haute lumineuse, légère profondeur */
.card,.plan,.table-wrap,.auth-card,.sheet{box-shadow:inset 0 1px 0 rgba(255,245,225,.04),0 18px 40px -30px rgba(0,0,0,.7)}
.plan{transition:border-color .2s,transform .2s}
.plan:hover{transform:translateY(-3px);border-color:var(--line2)}
.plan.hot{box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 30px 60px -36px rgba(215,255,63,.25)}
.plan.hot:hover{transform:translateY(-3px)}

/* Titres : hiérarchie plus marquée */
.page-head h1{font-size:32px;letter-spacing:-.04em;font-weight:600}
.page-head p{font-size:14.5px}
.crumb{font-size:10.5px}
.kpi{padding:22px 24px}
.kpi .k-v{font-size:34px}
.kpi .k-l{color:var(--muted)}
.card-h h3{font-size:15px;font-weight:600}

/* Application : navigation et actifs */
.side{box-shadow:inset -1px 0 0 var(--line)}
.side a.nav-item{transition:background .15s,color .15s}
.side .me-card{box-shadow:inset 0 1px 0 rgba(255,245,225,.04)}

/* Champs et boutons : retours tactiles nets */
.btn{transition:background .15s,color .15s,border-color .15s,transform .1s}
.btn:active{transform:scale(.98)}
.input:hover,.select:hover,.textarea:hover{border-color:rgba(255,245,225,.22)}

/* Chat */
.chat{box-shadow:inset 0 1px 0 rgba(255,245,225,.04),0 30px 60px -40px rgba(0,0,0,.8)}
.inbox{box-shadow:inset 0 1px 0 rgba(255,245,225,.04)}
.inbox:focus-within{border-color:rgba(255,245,225,.3)}
.msg.ai .bubble{line-height:1.7}

/* Notifications : discrètes, en bas à droite */
.toast-wrap{left:auto;right:24px;bottom:24px;transform:none;align-items:flex-end}
.toast{font-size:13.5px;padding:11px 16px;border-radius:10px;box-shadow:0 12px 30px -10px rgba(0,0,0,.6)}

/* États vides plus lisibles */
.empty b{font-size:16px;font-weight:600}
.empty .ico{color:var(--muted)}

/* Typographie des étiquettes */
.label,.field label,.field .lab{letter-spacing:.08em}

@media (max-width:900px){
  .toast-wrap{left:16px;right:16px;align-items:stretch}
  .toast{text-align:center}
}

/* =====================================================================
   V7 — accueil complet
   ===================================================================== */
.hero-inner{display:flex;flex-direction:column;align-items:center;text-align:center}
.hero-inner .proof{width:100%;max-width:720px;justify-content:space-between;gap:24px;flex-wrap:wrap}
.hero-inner .proof > div{text-align:center}
.hero-inner .console{width:100%;max-width:980px}
.pv-dots{display:inline-flex;gap:6px}
.pv-dots i{width:10px;height:10px;border-radius:50%;background:#2a2823;display:inline-block}
.console-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px}
.console-top span:nth-child(2){justify-self:center}
.console-body{padding:26px;gap:12px}
.console-body .pv-b{max-width:70%;font-size:14px;padding:12px 15px;border-radius:12px;font-family:var(--sans)}
.console-body .pv-b.me{justify-self:end}

/* Modules */
.grid.modes{grid-template-columns:repeat(4,minmax(0,1fr))}
.mode-card{display:flex;flex-direction:column;gap:12px;padding:26px;transition:border-color .2s,transform .2s}
.mode-card:hover{border-color:var(--line2);transform:translateY(-3px)}
.mode-card .mi{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;background:rgba(215,255,63,.08);border:1px solid rgba(215,255,63,.2);color:var(--accent)}
.mode-card .mi .ico{width:19px;height:19px}
.mode-card h3{font-size:18px;font-weight:600;margin-top:10px}
.mode-card .d{color:var(--muted);font-size:14px}
.mode-list{list-style:none;display:grid;gap:8px;margin-top:auto;padding-top:14px;border-top:1px solid var(--line);font-size:13.5px;color:#d6d0c3}
.mode-list li::before{content:"→ ";color:var(--accent)}

/* Étapes */
.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.step{padding:28px;border-radius:18px;background:var(--panel);border:1px solid var(--line);position:relative}
.step .n{font-family:var(--mono);font-size:12px;color:var(--accent);letter-spacing:.08em}
.step h3{font-size:19px;font-weight:600;margin-top:22px}
.step p{color:var(--muted);font-size:14.5px;margin-top:8px}

/* Offres */
.section#offres .plans{max-width:none}

/* FAQ */
.faq-wrap{max-width:820px}
.faq-wrap details.faq{border-bottom:1px solid var(--line);padding:22px 0}
.faq-wrap details.faq summary{font-size:17px;font-weight:600;font-family:var(--display);letter-spacing:-.02em}
.faq-wrap details.faq p{font-size:15px;color:var(--muted);margin-top:12px;max-width:none}

@media (max-width:1080px){
  .grid.modes{grid-template-columns:1fr 1fr}
}
@media (max-width:900px){
  .steps{grid-template-columns:1fr}
  .hero-inner .proof{gap:20px}
  .console-body .pv-b{max-width:88%}
  .grid.modes{grid-template-columns:1fr}
}
.console-body{align-items:stretch}
.console-body .pv-b{align-self:flex-start;max-width:72%}
.console-body .pv-b.me{align-self:flex-end}
.bento .c-c,.bento .c-d,.bento .c-e{grid-column:span 2}
.bento .c-b{grid-column:span 2}
@media (max-width:1080px){.bento .c-c,.bento .c-d,.bento .c-e,.bento .c-b{grid-column:span 1}}
@media (max-width:560px){.bento .c-c,.bento .c-d,.bento .c-e,.bento .c-b{grid-column:span 1}}
.console-body .pv-b{text-align:left}

/* ---------- Logo KARAT (IA) ---------- */
.logo i{width:30px;height:30px;flex:0 0 30px;border-radius:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='512' height='512'%3E  %3Crect width='64' height='64' rx='16' fill='%23d7ff3f'/%3E  %3Cg fill='none' stroke='%230b0b0b' stroke-width='6.5' stroke-linecap='round' stroke-linejoin='round'%3E    %3Cpath d='M21 16 V48'/%3E    %3Cpath d='M43 17 L27 32 L46 47'/%3E  %3C/g%3E  %3Cpath d='M46 6.5 L47.6 11.4 L52.5 13 L47.6 14.6 L46 19.5 L44.4 14.6 L39.5 13 L44.4 11.4 Z' fill='%230b0b0b' transform='translate(5,-3)'/%3E%3C/svg%3E") center/contain no-repeat;box-shadow:none}
.logo i::after{display:none}

/* ===== Finitions interface ===== */
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
img{max-width:100%;height:auto}
.btn{transition:background .2s,color .2s,border-color .2s,transform .15s,box-shadow .2s}
.btn:active{transform:scale(.98)}
.card{transition:border-color .2s,transform .2s}
.card:hover{border-color:var(--line2)}

/* ===== Format téléphone (écrans jusqu'à 600 px) ===== */
@media (max-width:600px){
  .wrap{padding-left:16px;padding-right:16px}
  .topbar .pubnav,.topbar .row .btn-ghost{display:none}
  .hero{padding:44px 0 36px}
  .h-xl{font-size:clamp(34px,10vw,44px);line-height:1.05;letter-spacing:-.02em}
  .lead{font-size:16px;line-height:1.55}
  .ctas{flex-direction:column;align-items:stretch;gap:10px}
  .ctas .btn{width:100%;justify-content:center;min-height:52px}
  .proof{grid-template-columns:1fr 1fr;gap:14px}
  .console{display:none}
  .section{padding-top:56px;padding-bottom:56px}
  .head{flex-direction:column;align-items:flex-start;gap:12px}
  .grid.g4,.grid.g2,.plans,.steps,.bento{grid-template-columns:1fr!important}
  .plan{padding:24px}
  .cta-band{flex-direction:column;align-items:flex-start;gap:20px;padding:24px}
  .cta-band .btn{width:100%;justify-content:center}
  .shell{flex-direction:column}
  .side{width:100%;position:static;height:auto}
  .main{padding:20px 16px}
  .page-head{flex-direction:column;align-items:flex-start;gap:14px}
}

/* =====================================================================
   INTERFACE PRO (panel) : sombre, sobre, un seul accent, sans blanc
   ===================================================================== */
html,body{background:#0b0b0b}
body{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.12) transparent}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.10);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.18);background-clip:padding-box}

.shell{background:#0b0b0b}
.side{background:#0e0e0e;backdrop-filter:none;border-right:1px solid rgba(255,255,255,.06)}
.side .logo{font-family:var(--display);letter-spacing:.01em}
.side a.nav-item{color:#a3a39c;border-radius:10px;padding:9px 12px}
.side a.nav-item:hover{background:rgba(255,255,255,.03);color:#eaeaea}
.side a.nav-item.on{background:rgba(215,255,63,.07);color:#f2f2f2;box-shadow:none}
.side a.nav-item.on::before{background:var(--accent);width:2px}
.side a.nav-item .count{background:rgba(255,255,255,.05);border-radius:6px;padding:1px 6px}
.side .group{color:#4d4d59}
.side .plan-block,.side .me-card{background:#161616;border:1px solid rgba(255,255,255,.06);box-shadow:none}
.side .avatar{background:rgba(215,255,63,.12);color:var(--accent);border:1px solid rgba(215,255,63,.22);font-size:12px}

.main{background:#0b0b0b}
.card{background:#131313;border:1px solid rgba(255,255,255,.06);box-shadow:0 1px 0 rgba(255,255,255,.02) inset}
.card:hover{border-color:rgba(255,255,255,.1)}

/* Conversation */
.chat-top{background:#0e0e0e;border-bottom:1px solid rgba(255,255,255,.06)}
.chat-top .title{color:#f2f2f2}
.msg .who{background:#1a1a1a;color:var(--accent);border:1px solid rgba(215,255,63,.18);font-family:var(--mono);font-size:11px}
.msg.me .who{background:rgba(215,255,63,.10);color:var(--accent);border:1px solid rgba(215,255,63,.28)}
.msg.me .bubble{background:#17171f;color:#f0f0ee;border:1px solid rgba(255,255,255,.07)}
.msg.ai .bubble{background:#0f0f15;color:#e8e8e6;border:1px solid rgba(255,255,255,.06)}
.msg .meta{color:#4f4f5b}

.composer{background:#0e0e0e;border-top:1px solid rgba(255,255,255,.06)}
.inbox{background:#0c0c11;border:1px solid rgba(255,255,255,.09);border-radius:14px}
.inbox:focus-within{border-color:rgba(215,255,63,.5);box-shadow:0 0 0 3px rgba(215,255,63,.08)}
.send{background:var(--accent);color:#0a0a0a;box-shadow:0 6px 18px -8px rgba(215,255,63,.6)}
.send:hover{background:#e4ff6b}
.send:disabled{background:#222222;color:#4d4d59;box-shadow:none;opacity:1}

/* Boutons secondaires sobres */
.btn-line{background:#141414;border-color:rgba(255,255,255,.10);color:#e9e9e9}
.btn-line:hover{border-color:rgba(215,255,63,.4);color:#fff}
.btn-ghost:hover{background:rgba(255,255,255,.04)}

/* Sélecteur de module */
.inbox textarea,.textarea,.input,.select{background:#0c0c11;border-color:rgba(255,255,255,.09);color:#f0f0f0}
.input:focus,.select:focus,.textarea:focus{border-color:rgba(215,255,63,.5)}
.select{background-color:#0c0c11}

/* Mobile : barre latérale horizontale sobre */
@media (max-width:900px){
  .side{background:#0e0e0e}
}

/* =====================================================================
   KARAT PANEL v3 — refonte de l'interface (sombre, dense, lisible)
   ===================================================================== */
:root{
  --p-bg:#0b0b0b; --p-side:#0d0d0d; --p-card:#111111; --p-card2:#161616; --p-hover:#1d1d1d;
  --p-line:rgba(255,255,255,.06); --p-line2:rgba(255,255,255,.10);
  --p-text:#f2f2ef; --p-sub:#a3a39c; --p-mute:#6b6b64;
  --p-accent:#d7ff3f; --p-accent-soft:rgba(215,255,63,.10); --p-accent-line:rgba(215,255,63,.28);
  --p-radius:16px; --p-radius-sm:11px;
}

/* Fond de l'espace connecté : léger halo citron en haut */
.shell{background:var(--p-bg);min-height:100vh}
.main{position:relative;padding:34px 44px 56px;max-width:none}
.main::before{content:"";position:absolute;inset:0 0 auto 0;height:340px;pointer-events:none;
  background:radial-gradient(900px 260px at 20% -10%,rgba(215,255,63,.055),transparent 70%);z-index:0}
.main > *{position:relative;z-index:1}
@keyframes kIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.main > *{animation:kIn .35s var(--ease) both}

/* Barre latérale */
.side{width:264px;padding:22px 16px 18px;background:var(--p-side);border-right:1px solid var(--p-line);gap:2px}
.side .logo{padding:6px 10px 24px;font-size:17px;gap:10px}
.side .logo i{width:28px;height:28px;border-radius:9px}
.side .group{font-size:10px;padding:20px 12px 8px;color:#55555f;letter-spacing:.16em}
.side a.nav-item{padding:9px 12px;border-radius:var(--p-radius-sm);font-size:13.5px;font-weight:500;gap:11px;color:var(--p-sub)}
.side a.nav-item svg{width:17px;height:17px;opacity:.85}
.side a.nav-item:hover{background:var(--p-hover);color:var(--p-text)}
.side a.nav-item.on{background:var(--p-accent-soft);color:var(--p-text);box-shadow:inset 0 0 0 1px rgba(215,255,63,.12)}
.side a.nav-item.on svg{color:var(--p-accent);opacity:1}
.side a.nav-item.on::before{left:-16px;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0}
.side a.nav-item .count{font-size:10.5px;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.05);color:var(--p-mute)}
.side .foot{padding-top:16px;gap:10px}
.side .plan-block{padding:14px 14px 12px;border-radius:14px;background:linear-gradient(180deg,#121218,#131313);border:1px solid var(--p-line2)}
.side .plan-block .label{font-size:10px;color:var(--p-mute)}
.side .plan-block b{display:block;font-size:14px;margin:4px 0 6px;font-family:var(--display)}
.side .plan-block a{font-size:12.5px;color:var(--p-accent);font-weight:500}
.side .me-card{padding:11px;border-radius:14px;background:var(--p-card2);border:1px solid var(--p-line)}
.side .me-card b{font-size:13px}
.side .me-card span{font-size:10.5px;color:var(--p-mute)}
.side .btn-ghost{color:var(--p-sub);justify-content:flex-start;padding-left:10px}
.side .btn-ghost:hover{color:var(--p-text);background:var(--p-hover)}

/* En-têtes de page */
.page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-bottom:26px;margin-bottom:28px;border-bottom:1px solid var(--p-line)}
.page-head h1{font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.15}
.page-head p{color:var(--p-sub);font-size:14px;margin-top:8px;max-width:620px}
.crumb{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--p-mute);margin-bottom:10px}

/* Cartes */
.card{background:linear-gradient(180deg,#141414,#0f0f0f);border:1px solid var(--p-line);border-radius:var(--p-radius);padding:22px;box-shadow:0 1px 0 rgba(255,255,255,.025) inset,0 18px 40px -28px rgba(0,0,0,.8)}
.card:hover{border-color:var(--p-line2)}
.card-h{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--p-line)}
.card-h h3{font-family:var(--display);font-size:15px;font-weight:600;letter-spacing:-.01em}
.kpi{padding:20px 22px;position:relative;overflow:hidden}
.kpi::after{content:"";position:absolute;right:-30px;top:-30px;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(215,255,63,.10),transparent 70%)}
.kpi .k-v{font-size:32px}
.grid{gap:16px}

/* Boutons */
.btn{height:40px;padding:0 16px;border-radius:12px;font-size:13.5px;font-weight:600;letter-spacing:-.005em;gap:8px}
.btn-sm{height:32px;padding:0 12px;font-size:12.5px;border-radius:10px}
.btn-line{background:#141414;border:1px solid var(--p-line2);color:var(--p-text)}
.btn-line:hover{border-color:var(--p-accent-line);background:var(--p-hover)}
.btn-ghost{color:var(--p-sub)}
.btn-ghost:hover{color:var(--p-text);background:rgba(255,255,255,.04)}
.btn-danger{background:rgba(255,123,114,.08);color:#ff9d96;border:1px solid rgba(255,123,114,.25)}
.btn-danger:hover{background:rgba(255,123,114,.14)}
.btn:disabled{opacity:.4;pointer-events:none}
.btn svg{width:16px;height:16px}

/* Badges et étiquettes */
.badge{height:22px;padding:0 9px;border-radius:999px;font-size:10px;letter-spacing:.08em;font-weight:600}
.label{font-size:10.5px;letter-spacing:.14em;color:var(--p-mute)}
.muted{color:var(--p-sub)}
.dim{color:var(--p-mute)}

/* Champs */
.field label,.field .lab{font-size:10.5px;letter-spacing:.12em;color:var(--p-mute);font-weight:500}
.input,.select,.textarea{height:42px;border-radius:var(--p-radius-sm);background:#0b0b10;border:1px solid var(--p-line2);color:var(--p-text);font-size:13.5px;transition:border-color .2s,box-shadow .2s,background .2s}
.input:hover,.select:hover,.textarea:hover{border-color:rgba(255,255,255,.16)}
.input:focus,.select:focus,.textarea:focus{background:#0d0d13;border-color:var(--p-accent-line);box-shadow:0 0 0 4px rgba(215,255,63,.07)}
.textarea{padding:12px 14px;min-height:96px}

/* Segments (onglets de module) */
.seg{background:#0b0b10;border:1px solid var(--p-line);border-radius:12px;padding:3px;gap:2px}
.seg button,.seg a{height:32px;padding:0 13px;border-radius:9px;font-size:12.5px;font-weight:500}
.seg button.on,.seg a.on{background:#1a1a22;color:var(--p-text);box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 2px 8px rgba(0,0,0,.4)}

/* Tableaux */
.table-wrap{border:1px solid var(--p-line);border-radius:var(--p-radius);overflow:auto;background:#0f0f0f}
.tbl{font-size:13px}
.tbl th{background:#0f0f0f;position:sticky;top:0;padding:13px 16px;border-bottom:1px solid var(--p-line)}
.tbl td{padding:14px 16px;border-bottom:1px solid var(--p-line)}
.tbl tbody tr:hover td{background:rgba(255,255,255,.015)}
.avatar{background:var(--p-accent-soft);color:var(--p-accent);border:1px solid var(--p-accent-line);font-weight:700}

/* Chat */
.chat-top{padding:16px 24px;background:rgba(10,10,13,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--p-line);position:sticky;top:0;z-index:5}
.chat-top .title{font-size:14px;color:var(--p-text)}
.msgs{padding:28px 24px;gap:22px}
.msg{max-width:min(760px,88%);gap:12px}
.msg.me{max-width:min(640px,80%)}
.msg .who{width:32px;height:32px;flex:0 0 32px;border-radius:10px;font-size:11px;background:#1a1a1a;border:1px solid rgba(215,255,63,.18);color:var(--p-accent)}
.msg.me .who{background:var(--p-accent-soft);border-color:var(--p-accent-line);color:var(--p-accent)}
.msg .bubble{padding:13px 16px;border-radius:14px;font-size:14.5px;line-height:1.62;letter-spacing:-.003em}
.msg.ai .bubble{background:#151515;border:1px solid var(--p-line);border-top-left-radius:4px;box-shadow:0 10px 30px -22px rgba(0,0,0,.9)}
.msg.me .bubble{background:#1f1f1f;border:1px solid var(--p-line2);border-top-right-radius:4px}
.msg .meta{font-size:10px;letter-spacing:.04em;margin-top:8px;display:flex;align-items:center;gap:8px}
.msg .meta .btn-ghost{height:22px;padding:0 6px;font-size:11px}
.typing{color:var(--p-mute)}
.composer{padding:16px 24px 20px;background:linear-gradient(180deg,rgba(7,7,9,0),var(--p-bg) 40%);border-top:0}
.composer .hint,.composer > div:last-child{max-width:820px;margin-left:auto;margin-right:auto}
.inbox{max-width:820px;margin:0 auto;border-radius:18px;background:#0d0d12;border:1px solid var(--p-line2);padding:9px 9px 9px 14px;box-shadow:0 22px 50px -30px rgba(0,0,0,.9)}
.inbox textarea{font-size:14.5px;padding:10px 6px}
.send{width:40px;height:40px;flex:0 0 40px;border-radius:12px}
.sugg{border-radius:999px;border:1px solid var(--p-line2);background:#141414;font-size:12.5px;padding:7px 13px;color:var(--p-sub);transition:all .15s}
.sugg:hover{color:var(--p-text);border-color:var(--p-accent-line)}

/* Modules */
.mod{padding:24px;display:flex;flex-direction:column;gap:12px}
.mod .mi,.mode-card .mi{width:44px;height:44px;border-radius:12px;background:var(--p-accent-soft);border:1px solid var(--p-accent-line);display:grid;place-items:center;color:var(--p-accent)}
.mod h3{font-family:var(--display);font-size:17px;font-weight:600}
.mod p{color:var(--p-sub);font-size:13.5px;line-height:1.6}
.mod ul{list-style:none;display:grid;gap:7px;font-size:13px;color:var(--p-sub);margin:4px 0 6px}
.mod ul li::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--p-accent);margin-right:10px;vertical-align:middle}
.mod .btn{margin-top:auto;align-self:flex-start}

/* Abonnement */
.plan-status{background:linear-gradient(180deg,#141414,#0f0f0f);border:1px solid var(--p-line);border-radius:var(--p-radius);padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.plan-status b{font-family:var(--display);font-size:18px;letter-spacing:-.02em}

/* Listes et vides */
.empty{border:1px dashed var(--p-line2);border-radius:var(--p-radius);background:rgba(255,255,255,.012);padding:60px 24px}
.empty .ico{color:var(--p-mute)}
.pager{color:var(--p-mute);font-size:12.5px}

/* Modales */
.veil{background:rgba(3,3,6,.72);backdrop-filter:blur(14px);animation:kFade .2s ease both}
.sheet{background:#141414;border:1px solid var(--p-line2);border-radius:22px;padding:30px;box-shadow:0 40px 90px -30px rgba(0,0,0,.95);animation:kPop .28s var(--ease) both;position:relative}
.sheet h2{font-size:22px}
@keyframes kFade{from{opacity:0}to{opacity:1}}
@keyframes kPop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
.sheet .x{background:rgba(255,255,255,.04);border-radius:10px}
.sheet .x:hover{background:rgba(255,255,255,.08)}

/* Notifications */
.toast-wrap{gap:10px;bottom:24px}
.toast{background:#121218;border:1px solid var(--p-line2);border-radius:14px;padding:13px 16px;font-size:13.5px;color:var(--p-text);box-shadow:0 20px 40px -18px rgba(0,0,0,.9)}

/* Liens & séparateurs */
hr{border:0;border-top:1px solid var(--p-line)}
::selection{background:rgba(215,255,63,.25);color:#fff}

/* Téléphone (panel) */
@media (max-width:900px){
  .side{width:100%;padding:12px;background:var(--p-side)}
  .main{padding:22px 18px 40px}
  .msgs{padding:18px 14px}
  .msg{max-width:94%}
}
@media (max-width:600px){
  .page-head h1{font-size:24px}
  .page-head{padding-bottom:20px;margin-bottom:22px}
  .grid.g4,.grid.g3{grid-template-columns:1fr!important}
  .plan-status{flex-direction:column;align-items:flex-start}
  .chat-top{padding:12px 14px}
  .inbox{border-radius:16px}
  .sheet{padding:22px}
}

/* =====================================================================
   KARAT v4 — version finale : sobre, sans effets décoratifs, chat encadré
   ===================================================================== */
/* Retrait de tous les effets d'ambiance */
.aurora,body::after,body::before,.main::before,.kpi::after{display:none!important;content:none!important}
.composer{background:transparent!important;box-shadow:none!important}
.card,.sheet,.chat,.inbox,.plan-status,.side .plan-block,.side .me-card{box-shadow:none!important}
.welcome .big{background:#1a1a1a!important;border:1px solid var(--p-line2)!important;color:var(--p-text)!important;box-shadow:none!important;border-radius:16px!important}
.sugg{border:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;padding:0!important;max-width:620px;margin-left:auto;margin-right:auto}
.sugg button{background:#141414!important;border:1px solid var(--p-line2)!important;border-radius:10px!important;padding:9px 14px!important;font-size:13px!important;color:var(--p-sub)!important;box-shadow:none!important}
.sugg button:hover{color:var(--p-text)!important;border-color:rgba(255,255,255,.18)!important;background:#1a1a1a!important}

/* Chat : un vrai cadre carré dans la zone principale */
.main{padding:28px 36px 28px!important}
.main > .chat{height:calc(100vh - 56px)!important;min-height:0!important;max-height:none;display:flex;flex-direction:column;margin:0;border-radius:14px!important;border:1px solid var(--p-line2)!important;background:#0f0f0f!important;overflow:hidden}
.chat-top{flex:0 0 auto;min-height:60px;padding:0 20px!important;height:60px;background:#0f0f0f!important;border-bottom:1px solid var(--p-line)!important;position:relative!important;top:auto!important}
.chat-top .title{font-size:14px;font-weight:600}
.msgs{flex:1 1 auto;min-height:0;overflow-y:auto;padding:26px 28px!important;background:#0f0f0f}
.composer{flex:0 0 auto;padding:14px 20px 16px!important;border-top:1px solid var(--p-line)!important;background:#0f0f0f!important}
.inbox{max-width:none!important;margin:0!important;border-radius:12px!important;background:#0b0b0b!important;border:1px solid var(--p-line2)!important;padding:6px 6px 6px 10px!important}
.inbox:focus-within{border-color:var(--p-accent-line)!important}
.hint{max-width:none!important;margin:8px 4px 0!important}
.hint span{font-size:10.5px;color:var(--p-mute)}
.send{width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:10px!important;box-shadow:none!important}
.btn-icon{width:36px;height:36px;padding:0;justify-content:center}

/* Bulles : sobres, sans dégradé */
.msg .bubble{box-shadow:none!important}
.msg.ai .bubble{background:#161616!important;border:1px solid var(--p-line)!important}
.msg.me .bubble{background:#1f1f1f!important;border:1px solid var(--p-line2)!important}

/* Sidebar et pages : fond uni */
.shell,.main,.side{background:#0b0b0b!important}
.side{border-right:1px solid var(--p-line)!important}
.side a.nav-item.on{background:rgba(215,255,63,.08)!important;box-shadow:none!important}
.side .plan-block{background:#131313!important}

@media (max-width:900px){
  .main{padding:16px!important}
  .main > .chat{height:calc(100vh - 150px)!important;min-height:440px!important}
  .chat-top{height:auto;min-height:56px;padding:10px 14px!important;flex-wrap:wrap}
}


/* =====================================================================
   KARAT — palette de marque : noir du logo (#0b0b0b) + citron (#d7ff3f)
   Neutres chauds, citron réservé aux actions et à l'état actif.
   ===================================================================== */
:root{
  --bg:#0b0b0b; --bg2:#0e0e0e; --panel:#111111; --panel2:#161616; --raised:#1d1d1d;
  --line:rgba(255,255,255,.07); --line2:rgba(255,255,255,.12);
  --text:#f2f2ef; --muted:#a3a39c; --dim:#6b6b64;
  --accent:#d7ff3f; --accent-ink:#0b0b0b;
  --ok:#8fd694; --warn:#e6c07b; --danger:#e88a80;
}
body,.shell,.main,.side{background:#0b0b0b}

/* =====================================================================
   KARAT — style produit sobre (inspiration : fond noir chaud, titres
   en phrase, boutons en pilule par paires, bordures très discrètes)
   ===================================================================== */
:root{
  --bg:#0f0e0b; --panel:#15140f; --panel2:#1a1914; --raised:#23221c;
  --line:rgba(255,246,228,.07); --line2:rgba(255,246,228,.12);
  --text:#f4f1ea; --muted:#a8a396; --dim:#6e6a5e;
}
html,body,.shell,.main,.side{background:var(--bg)!important}
body{font-feature-settings:"ss01","cv11";letter-spacing:-.005em}

/* Titres : grands, serrés, en phrase */
h1,.page-head h1,.h-xl{font-family:var(--display);font-weight:600;letter-spacing:-.035em;color:var(--text)}
.page-head h1{font-size:34px;line-height:1.1}
.page-head p{font-size:15px;color:var(--muted);max-width:640px}
.crumb{font-family:var(--sans);text-transform:none;letter-spacing:0;font-size:13px;color:var(--dim)}
.label{font-family:var(--sans);text-transform:none;letter-spacing:0;font-size:12.5px;color:var(--dim);font-weight:500}

/* Barre latérale : sans bordure forte, navigation épurée */
.side{border-right:1px solid var(--line)!important;padding:20px 14px!important}
.side .group{font-family:var(--sans);text-transform:none;letter-spacing:0;font-size:12px;color:var(--dim);font-weight:500;padding:22px 12px 8px}
.side a.nav-item{border-radius:9px;color:var(--muted);font-size:13.5px;font-weight:450}
.side a.nav-item:hover{background:rgba(255,246,228,.04);color:var(--text)}
.side a.nav-item.on{background:rgba(255,246,228,.07);color:var(--text);box-shadow:none}
.side a.nav-item.on::before{display:none}
.side .logo{font-size:16px}

/* Cartes : bordure à peine visible, grands rayons, beaucoup d'air */
.card,.plan,.sheet,.table-wrap{background:var(--panel)!important;border:1px solid var(--line)!important;border-radius:16px!important}
.card:hover{border-color:var(--line2)!important}
.card-h{border-bottom:1px solid var(--line)}
.card-h h3{font-family:var(--display);font-weight:600;font-size:15px}

/* Boutons en pilule : principal (plein) + secondaire (contour), avec flèche */
.btn{border-radius:999px!important;height:40px;padding:0 18px;font-weight:550;font-size:14px}
.btn-sm{height:34px;padding:0 14px;font-size:13px}
.btn-accent{background:var(--accent)!important;color:var(--accent-ink)!important;box-shadow:none!important}
.btn-accent:hover{background:#e3ff6a!important;transform:none}
.btn-line{background:transparent!important;border:1px solid var(--line2)!important;color:var(--text)!important}
.btn-line:hover{background:rgba(255,246,228,.05)!important;border-color:rgba(255,246,228,.22)!important}
.btn-ghost{color:var(--muted)!important}
.btn-ghost:hover{color:var(--text)!important;background:rgba(255,246,228,.05)!important}
.btn-danger{border-radius:999px!important}

/* Badges et pastilles */
.badge{border-radius:999px;background:rgba(255,246,228,.06);color:var(--muted);border:1px solid var(--line);font-family:var(--sans);font-size:11.5px;letter-spacing:0;text-transform:none;font-weight:500}
.badge.accent{background:var(--accent);color:var(--accent-ink);border-color:transparent}

/* Champs */
.input,.select,.textarea{border-radius:12px!important;background:var(--panel)!important;border:1px solid var(--line2)!important;font-size:14px}
.input:focus,.select:focus,.textarea:focus{border-color:rgba(215,255,63,.5)!important;box-shadow:0 0 0 4px rgba(215,255,63,.08)!important}

/* Tableaux */
.tbl th{font-family:var(--sans);text-transform:none;letter-spacing:0;font-size:12.5px;color:var(--dim);font-weight:500;background:var(--panel)!important}
.tbl td{color:#e4e0d6}

/* Chat : cadre généreux, saisie en pilule */
.main > .chat{border-radius:18px!important;background:var(--panel)!important;border:1px solid var(--line)!important}
.chat-top{background:var(--panel)!important;border-bottom:1px solid var(--line)!important}
.chat-top .title{font-family:var(--display);font-weight:600;font-size:14.5px}
.msgs{background:var(--panel)!important}
.msg .bubble{font-size:15px;line-height:1.65}
.msg.ai .bubble{background:transparent!important;border:0!important;padding:4px 0!important;color:#ece8de}
.msg.me .bubble{background:var(--raised)!important;border:0!important;border-radius:18px 18px 4px 18px!important}
.msg .who{background:transparent!important;border:1px solid var(--line2)!important;color:var(--text)!important;font-family:var(--sans);font-size:12px}
.msg.me .who{background:var(--raised)!important;border:0!important;color:var(--text)!important}
.inbox{border-radius:999px!important;padding:6px 6px 6px 18px!important;background:var(--bg)!important;border:1px solid var(--line2)!important}
.inbox textarea{font-size:15px!important}
.inbox:focus-within{border-color:rgba(255,246,228,.22)!important;box-shadow:none!important}
.send{border-radius:999px!important;background:var(--accent)!important;color:var(--accent-ink)!important;width:38px!important;height:38px!important}
.hint span{font-family:var(--sans);font-size:11.5px;color:var(--dim)}
.sugg button{border-radius:999px!important;background:transparent!important;border:1px solid var(--line2)!important;color:var(--muted)!important;font-size:13.5px!important;padding:9px 16px!important}
.sugg button:hover{color:var(--text)!important;background:rgba(255,246,228,.04)!important}

/* Modales et notifications */
.veil{background:rgba(8,7,5,.72)!important}
.sheet{border-radius:20px!important;padding:32px!important}
.toast{border-radius:12px!important;background:var(--raised)!important;border:1px solid var(--line2)!important;font-size:14px}

/* Mobile */
@media (max-width:600px){
  .page-head h1{font-size:28px}
  .side{padding:12px!important}
}

/* Réponses de l'IA : mise en forme et blocs de code */
.msg.ai .bubble p{margin:0 0 10px}
.msg.ai .bubble p:last-child{margin-bottom:0}
.msg.ai .bubble b{color:var(--text);font-weight:600}
.msg.ai .bubble code:not(pre code){font-family:var(--mono);font-size:.88em;background:rgba(255,246,228,.07);padding:1px 6px;border-radius:6px}
.code-block{margin:12px 0;border:1px solid var(--line2);border-radius:12px;overflow:hidden;background:#0a0a0a}
.code-h{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;border-bottom:1px solid var(--line);background:#131313;font-family:var(--mono);font-size:12px;color:var(--muted)}
.code-copy{display:inline-flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--line2);color:var(--muted);border-radius:8px;padding:3px 9px;font-size:11.5px;cursor:pointer;font-family:var(--sans)}
.code-copy:hover{color:var(--text);border-color:rgba(255,246,228,.25)}
.code-copy svg{width:13px;height:13px}
.code-block pre{margin:0;padding:14px 16px;overflow-x:auto;font-family:var(--mono);font-size:13px;line-height:1.6;color:#e6e6e0;white-space:pre}


/* Overlay de dépôt de fichier dans le chat */
.dropveil{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px;pointer-events:none;animation:kFade .15s ease both}
.dropveil-card{width:min(420px,88vw);padding:36px 28px;text-align:center;border-radius:20px;background:#121210;border:1.5px dashed var(--accent);color:var(--text)}
.dropveil-ico{width:44px;height:44px;margin:0 auto 14px;color:var(--accent)}
.dropveil-ico svg{width:100%;height:100%}
.dropveil-card b{display:block;font-family:var(--display);font-size:20px;font-weight:600}
.dropveil-card p{margin:8px 0 0;color:var(--muted);font-size:14px;line-height:1.5}

/* =====================================================================
   TÉLÉPHONE : mise en page adaptée (menu en haut, tableaux défilants)
   ===================================================================== */
@media (max-width:820px){
  .shell{display:block!important;grid-template-columns:none!important}
  .side{position:sticky!important;top:0!important;z-index:40!important;height:auto!important;max-height:none!important;flex-direction:row!important;align-items:center!important;gap:6px!important;padding:10px 12px!important;overflow-x:auto!important;overflow-y:hidden!important;background:#0b0b0b!important;border-right:0!important;border-bottom:1px solid var(--line)!important;backdrop-filter:none!important;-webkit-overflow-scrolling:touch}
  .side .logo{flex:0 0 auto;margin-right:6px}
  .side .group,.side .foot,.side .plan-block,.side .me-card{display:none!important}
  .side a.nav-item{flex:0 0 auto;white-space:nowrap;padding:8px 12px!important;font-size:13px!important;border-radius:999px!important}
  .side a.nav-item .count{display:none}
  .side a.nav-item.on{background:var(--accent)!important;color:var(--accent-ink)!important}
  .side a.nav-item.on svg{stroke:var(--accent-ink)}
  .side .btn-ghost{flex:0 0 auto;padding:8px 12px!important}
  .main{padding:18px 16px 40px!important;min-width:0;max-width:100%!important;overflow-x:hidden}
  .main > .chat{height:calc(100vh - 150px)!important;min-height:420px!important}
  .page-head{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
  .page-head h1{font-size:24px!important}
  .page-head .row{width:100%!important}
  .page-head .search,.page-head .search input{width:100%!important}
  .grid{grid-template-columns:1fr!important}
  .grid.g2,.grid.g3,.grid.g4{grid-template-columns:1fr 1fr!important}
  .table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch}
  .tbl{min-width:620px}
  .card{padding:18px!important}
  .row.wrap-x{flex-wrap:wrap!important}
  .modal,.sheet{width:calc(100vw - 32px)!important;max-width:none!important}
}
@media (max-width:520px){
  .grid.g2,.grid.g3,.grid.g4{grid-template-columns:1fr!important}
  .main{padding:14px 12px 36px!important}
  .page-head h1{font-size:22px!important}
  .main > .chat{height:calc(100vh - 140px)!important;min-height:380px!important}
  .inbox{padding:8px!important}
  .hint{font-size:11px!important;flex-direction:column!important;gap:4px!important}
  .hint span:last-child{display:none}
}

/* Vignettes des images dans la zone de saisie (style ChatGPT) */
.inbox{flex-wrap:wrap}
.inbox:has(.img-tray){border-radius:22px!important}
.img-tray{flex-basis:100%;order:-1;display:flex;flex-wrap:wrap;gap:10px;padding:8px 8px 6px}
.img-thumb{position:relative;width:96px;height:96px;border-radius:16px;overflow:hidden;background:#111;border:1px solid rgba(255,255,255,.08);flex:0 0 auto}
.img-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.img-thumb button{position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.72);color:#fff;border:0;display:grid;place-items:center;cursor:pointer;padding:0}
.img-thumb button:hover{background:rgba(0,0,0,.9)}
.msg-imgs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;justify-content:flex-end}
.msg-imgs img{width:200px;max-width:70vw;border-radius:14px;display:block;border:1px solid var(--line)}

/* Zone de saisie : une seule ligne, le texte reste dans la largeur de l'écran */
.inbox:not(:has(.img-tray)){flex-wrap:nowrap!important}
.inbox textarea{min-width:0!important;flex:1 1 auto!important;width:100%}
.composer,.inbox{min-width:0;max-width:100%}
.main,.chat{max-width:100%;overflow-x:hidden}

/* Bouton jaune « joindre » (images, fichiers) et zone de saisie d'une seule ligne */
.inbox{align-items:center!important;flex-wrap:nowrap!important;width:100%;box-sizing:border-box;min-width:0}
.inbox:has(.img-tray){flex-wrap:wrap!important}
.inbox .attach-btn{width:36px!important;height:36px!important;min-width:36px!important;flex:0 0 36px!important;border-radius:50%!important;background:var(--accent)!important;color:#0b0b0b!important;border:0!important;display:grid!important;place-items:center!important;padding:0!important;box-shadow:none!important;opacity:1!important}
.inbox .attach-btn svg{stroke:#0b0b0b!important}
.inbox .attach-btn:hover{background:#e4ff6b!important}
.inbox textarea{background:transparent!important;border:0!important;box-shadow:none!important;outline:none!important;min-width:0!important;flex:1 1 0!important;width:auto!important;font-size:15px!important;line-height:1.4!important;padding:8px 6px!important}
.inbox .send{flex:0 0 36px!important}

/* Texte copiable au doigt (appui long) sur téléphone, bouton Copier toujours visible */
.bubble,.msgs,.msg .bubble *,.msg-meta,pre,pre *,code{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}
.copy-btn{opacity:1!important}

/* Téléphone : bouton « Se déconnecter » accessible depuis la barre du haut */
@media (max-width:820px){
  .side .foot{display:flex!important;flex:0 0 auto;align-items:center;margin:0 0 0 auto;padding:0;border:0}
  .side .foot .plan-block,.side .foot .me-card{display:none!important}
  .side .foot .btn{width:auto!important;margin-top:0!important;white-space:nowrap}
}

/* =====================================================================
   ACCUEIL — refonte visuelle (classes lp-, limitées à la page d'accueil)
   Les prix et leurs descriptions ne changent pas.
   ===================================================================== */
.lp{--lp-bg:#0a0a0a;--lp-panel:#0f0f0f;--lp-panel2:#141414;--lp-line:rgba(255,255,255,.08);--lp-line2:rgba(255,255,255,.14);--lp-text:#f4f4f1;--lp-muted:#a2a29b;--lp-dim:#6c6c66;--lp-accent:#d7ff3f;
  background:var(--lp-bg);color:var(--lp-text);min-height:100vh;overflow-x:clip;font-family:var(--sans);-webkit-font-smoothing:antialiased;letter-spacing:-.005em}
.lp h1,.lp h2,.lp h3,.lp p,.lp ul,.lp figure{margin:0}
.lp ul{padding:0;list-style:none}
.lp a{color:inherit;text-decoration:none}
.lp .ico{display:inline-flex;line-height:0}
.lp .ico svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.lp-wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:0 24px}

/* Boutons */
.lp .btn{height:48px;padding:0 22px;border-radius:12px;font-size:14.5px;font-weight:600;letter-spacing:-.005em;box-shadow:none;transform:none}
.lp .btn:hover{transform:none}
.lp .btn-accent{background:var(--lp-accent);color:#0a0a0a;box-shadow:none}
.lp .btn-accent:hover{background:#e4ff6b;box-shadow:none}
.lp .btn-line{background:transparent;border:1px solid var(--lp-line2);color:var(--lp-text)}
.lp .btn-line:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.3)}
.lp .btn-ghost{color:var(--lp-muted);background:transparent}
.lp .btn-ghost:hover{color:var(--lp-text);background:rgba(255,255,255,.04)}

/* En-tête */
.lp .topbar{position:sticky;top:0;z-index:50;background:rgba(10,10,10,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--lp-line)}
.lp .topbar .wrap{max-width:1200px;height:68px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.lp .topbar .logo{font-size:16px;font-weight:700;letter-spacing:-.01em;color:var(--lp-text)}
.lp .topbar .logo i{width:24px;height:24px;flex:0 0 24px;border-radius:7px;box-shadow:none;background:var(--lp-accent)}
.lp .topbar .logo i::after{background:#0a0a0a}
.lp .topbar .row{display:flex;align-items:center;gap:8px}
.lp .topbar .btn{height:38px;padding:0 16px;font-size:13.5px;border-radius:10px}
.lp .pubnav{display:flex;gap:30px;font-size:14px;font-weight:500;color:var(--lp-muted)}
.lp .pubnav a{position:relative;padding:4px 0;transition:color .2s}
.lp .pubnav a:hover,.lp .pubnav a.on{color:var(--lp-text)}
.lp .pubnav a.on::after{content:"";position:absolute;left:0;right:0;bottom:-8px;height:1px;background:var(--lp-text)}

/* Titres de section */
.lp-kicker{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lp-accent)}
.lp-h2{margin-top:16px;font-family:var(--display);font-weight:600;font-size:clamp(32px,4vw,50px);line-height:1.08;letter-spacing:-.035em;max-width:660px}
.lp-sec{position:relative;z-index:1;padding:100px 0}
.lp-sec-tight{padding-top:0}
.lp-sec-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:40px;align-items:end;margin-bottom:56px}
.lp-sec-head p{color:var(--lp-muted);font-size:16px;line-height:1.6}

/* Accueil : bloc principal */
.lp-hero{position:relative;overflow:hidden;padding:104px 0 96px}
.lp-hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:linear-gradient(#000 30%,transparent 80%);mask-image:linear-gradient(#000 30%,transparent 80%);pointer-events:none}
.lp-hero::after{content:"";position:absolute;top:-220px;left:50%;width:1000px;height:620px;margin-left:-500px;background:radial-gradient(closest-side,rgba(215,255,63,.1),transparent);pointer-events:none}
.lp-hero-grid{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,1fr);gap:64px;align-items:center}
.lp-eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:12px;letter-spacing:.04em;color:var(--lp-muted);padding:7px 13px;border:1px solid var(--lp-line2);border-radius:999px;background:rgba(255,255,255,.02)}
.lp-eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--lp-accent);box-shadow:0 0 0 4px rgba(215,255,63,.15)}
.lp-hero h1{margin-top:28px;font-family:var(--display);font-weight:600;font-size:clamp(42px,4.9vw,68px);line-height:1.02;letter-spacing:-.05em}
.lp-strike{color:var(--lp-dim);text-decoration:line-through;text-decoration-color:var(--lp-accent);text-decoration-thickness:4px}
.lp-acc{color:var(--lp-accent)}
.lp-lead{margin-top:26px;font-size:18px;line-height:1.6;color:var(--lp-muted);max-width:520px}
.lp-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:38px}
.lp-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:56px;border:1px solid var(--lp-line);border-radius:16px;background:rgba(255,255,255,.015);overflow:hidden}
.lp-stats > div{padding:18px 18px 17px;border-left:1px solid var(--lp-line)}
.lp-stats > div:first-child{border-left:0}
.lp-stats b{display:block;font-family:var(--display);font-size:20px;font-weight:600;letter-spacing:-.02em;line-height:1.2}
.lp-stats span{display:block;margin-top:4px;font-size:12.5px;color:var(--lp-dim);line-height:1.35}

/* Aperçu du panel */
.lp-visual{position:relative}
.lp-visual::before{content:"";position:absolute;inset:-12% -10% -8% 8%;background:radial-gradient(closest-side,rgba(215,255,63,.13),transparent);pointer-events:none;z-index:0}
.lp-window{position:relative;z-index:1;border:1px solid var(--lp-line2);border-radius:20px;background:#0c0c0c;overflow:hidden;box-shadow:0 60px 120px -50px rgba(0,0,0,.95),0 0 0 6px rgba(255,255,255,.012)}
.lp-win-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--lp-line);font-family:var(--mono);font-size:11.5px;color:var(--lp-dim)}
.lp-dots{display:flex;gap:6px}
.lp-dots i{width:9px;height:9px;border-radius:50%;background:#262626}
.lp-win-body{display:grid;grid-template-columns:150px minmax(0,1fr);min-height:340px}
.lp-win-side{border-right:1px solid var(--lp-line);padding:18px 12px;display:flex;flex-direction:column;gap:4px}
.lp-win-side small{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--lp-dim);padding:4px 10px 8px}
.lp-mod{font-size:13px;color:var(--lp-muted);padding:9px 10px;border-radius:9px}
.lp-mod.on{background:rgba(255,255,255,.06);color:var(--lp-text)}
.lp-mod.on::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--lp-accent);margin-right:8px;vertical-align:middle}
.lp-win-main{padding:22px 20px;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.55;min-width:0}
.lp-msg{max-width:88%;padding:11px 14px;border-radius:14px;background:#1a1a1a;color:#d6d6d0;border-bottom-left-radius:4px}
.lp-msg.me{align-self:flex-end;background:var(--lp-text);color:#0a0a0a;border-bottom-left-radius:14px;border-bottom-right-radius:4px}
.lp-win-input{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 16px 16px;padding:8px 8px 8px 16px;border:1px solid var(--lp-line2);border-radius:14px;background:#0a0a0a;font-size:13px;color:var(--lp-dim)}
.lp-send{width:32px;height:32px;border-radius:10px;background:var(--lp-accent);display:grid;place-items:center;color:#0a0a0a;flex:0 0 32px}
.lp-send .ico svg{width:16px;height:16px}

/* Bandeau de modules */
.lp-modules{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.lp-mod-card{padding:26px;border:1px solid var(--lp-line);border-radius:18px;background:var(--lp-panel);display:flex;flex-direction:column;gap:14px;transition:border-color .2s}
.lp-mod-card:hover{border-color:var(--lp-line2)}
.lp-mod-top{display:flex;justify-content:space-between;align-items:center}
.lp-ico{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(215,255,63,.08);border:1px solid rgba(215,255,63,.2);color:var(--lp-accent)}
.lp-num{font-family:var(--mono);font-size:12px;color:var(--lp-dim)}
.lp-mod-card h3{margin-top:8px;font-family:var(--display);font-size:21px;font-weight:600;letter-spacing:-.02em}
.lp-mod-card > p{font-size:14.5px;color:var(--lp-muted);line-height:1.6}
.lp-mod-card ul{margin-top:auto;padding-top:18px;border-top:1px solid var(--lp-line);display:grid;gap:10px;font-size:13.5px;color:#d0d0ca}
.lp-mod-card li{display:flex;gap:10px;align-items:center}
.lp-mod-card li::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--lp-accent);flex:0 0 5px}

/* Étapes */
.lp-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px}
.lp-step{position:relative;padding-top:34px;border-top:1px solid var(--lp-line2)}
.lp-step::before{content:"";position:absolute;left:0;top:-5px;width:9px;height:9px;border-radius:50%;background:var(--lp-accent);box-shadow:0 0 0 5px rgba(215,255,63,.12)}
.lp-step .n{font-family:var(--mono);font-size:12px;color:var(--lp-dim);letter-spacing:.08em}
.lp-step h3{margin-top:14px;font-family:var(--display);font-size:22px;font-weight:600;letter-spacing:-.02em}
.lp-step p{margin-top:10px;color:var(--lp-muted);font-size:15px;line-height:1.6;max-width:340px}

/* Fonctionnalités */
.lp-bento{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px}
.lp-feat{min-height:230px;padding:30px;border:1px solid var(--lp-line);border-radius:18px;background:var(--lp-panel);display:flex;flex-direction:column}
.lp-feat .k{font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--lp-dim)}
.lp-feat h3{margin-top:34px;font-family:var(--display);font-size:21px;font-weight:600;letter-spacing:-.02em;line-height:1.2}
.lp-feat > p{margin-top:10px;color:var(--lp-muted);font-size:14.5px;line-height:1.6;max-width:440px}
.lp-f1{grid-column:span 4}
.lp-f2,.lp-f3,.lp-f4,.lp-f5{grid-column:span 2}
.lp-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:22px}
.lp-chips span{font-family:var(--mono);font-size:12px;padding:6px 10px;border-radius:8px;border:1px solid var(--lp-line2);color:var(--lp-muted)}

/* Tarifs (prix et descriptions inchangés, seule la mise en forme change) */
.lp .plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch}
.lp .plan{position:relative;display:flex;flex-direction:column;padding:34px 30px 28px;border-radius:20px!important;border:1px solid var(--lp-line)!important;background:var(--lp-panel)!important;box-shadow:none;overflow:hidden;transition:border-color .2s}
.lp .plan:hover{border-color:var(--lp-line2);box-shadow:none}
.lp .plan .pname{font-family:var(--display);font-size:20px;font-weight:600;letter-spacing:-.02em;color:var(--lp-text)}
.lp .price{display:flex;align-items:baseline;gap:6px;margin-top:22px}
.lp .price b{font-family:var(--display);font-size:56px;font-weight:600;letter-spacing:-.05em;line-height:1;color:var(--lp-text)}
.lp .price span{font-size:14px;color:var(--lp-dim)}
.lp .plan .desc{margin-top:12px;min-height:44px;font-size:14px;line-height:1.55;color:var(--lp-muted)}
.lp .plan ul{margin:24px 0 28px;display:grid;gap:12px;font-size:14px;line-height:1.45;color:#d2d2cc}
.lp .plan li{display:flex;gap:10px;align-items:flex-start}
.lp .plan li .ico{flex:0 0 16px;margin-top:2px;color:var(--lp-accent)}
.lp .plan li .ico svg{width:16px;height:16px}
.lp .plan .btn{width:100%;margin-top:auto}
.lp .plan .status{margin-top:12px;min-height:16px;text-align:center;font-family:var(--mono);font-size:11.5px;color:var(--lp-accent)}
.lp .plan.hot{background:var(--lp-accent)!important;border-color:var(--lp-accent)!important;color:#0a0a0a}
.lp .plan.hot .pname,.lp .plan.hot .price b{color:#0a0a0a}
.lp .plan.hot .price span{color:rgba(10,10,10,.6)}
.lp .plan.hot .desc,.lp .plan.hot ul{color:rgba(10,10,10,.8)}
.lp .plan.hot li .ico{color:#0a0a0a}
.lp .plan li{color:#d2d2cc}
.lp .plan.hot li{color:rgba(10,10,10,.85)}
.lp .plan.hot .price span{color:rgba(10,10,10,.65)}
.lp .plan.hot .btn-accent{background:#0a0a0a!important;color:var(--lp-accent)!important}
.lp .plan.hot .btn-accent:hover{background:#1c1c1c!important}
.lp .plan.hot .status{color:#0a0a0a}
.lp .ribbon{top:20px;right:20px;padding:5px 10px;border-radius:999px;background:#0a0a0a;color:var(--lp-accent);font-family:var(--mono);font-size:10.5px;letter-spacing:.08em}

/* Questions fréquentes */
.lp-faq{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:72px;align-items:start}
.lp-faq-side p{margin-top:18px;color:var(--lp-muted);font-size:15.5px;line-height:1.6;max-width:360px}
.lp-faq-side a{color:var(--lp-text);border-bottom:1px solid var(--lp-line2)}
.lp-faq-list{border-top:1px solid var(--lp-line)}
.lp details.lp-q{border-bottom:1px solid var(--lp-line);padding:22px 0}
.lp details.lp-q summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:20px;font-family:var(--display);font-size:18px;font-weight:500;letter-spacing:-.01em;color:var(--lp-text)}
.lp details.lp-q summary::-webkit-details-marker{display:none}
.lp details.lp-q summary::after{content:"+";flex:0 0 auto;font-family:var(--mono);font-size:20px;color:var(--lp-dim)}
.lp details.lp-q[open] summary::after{content:"–";color:var(--lp-accent)}
.lp details.lp-q p{margin-top:14px;max-width:620px;font-size:15px;line-height:1.65;color:var(--lp-muted)}

/* Bandeau final */
.lp-cta{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap;padding:56px;border-radius:24px;border:1px solid var(--lp-line2);background:radial-gradient(ellipse 70% 120% at 100% 0%,rgba(215,255,63,.13),transparent 60%),var(--lp-panel)}
.lp-cta h2{margin-top:14px;font-family:var(--display);font-size:clamp(28px,3.4vw,40px);font-weight:600;letter-spacing:-.03em;line-height:1.1}
.lp-cta p{margin-top:12px;color:var(--lp-muted);font-size:15px}

/* Pied de page */
.lp-foot{position:relative;z-index:1;border-top:1px solid var(--lp-line);padding:44px 0 40px}
.lp-foot .lp-wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.lp-foot .logo{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:700;font-size:15px}
.lp-foot .logo i{width:20px;height:20px;flex:0 0 20px;border-radius:6px;background:var(--lp-accent);position:relative}
.lp-foot .logo i::after{content:"";position:absolute;inset:6px;border-radius:2px;background:#0a0a0a}
.lp-foot small{font-family:var(--mono);font-size:12px;color:var(--lp-dim)}
.lp-foot nav{display:flex;gap:24px;flex-wrap:wrap;font-size:13.5px;color:var(--lp-muted)}
.lp-foot nav a:hover{color:var(--lp-text)}

/* Tablette */
@media (max-width:1000px){
  .lp-hero-grid{grid-template-columns:1fr;gap:56px}
  .lp-hero{padding:72px 0 80px}
  .lp-visual{max-width:640px}
  .lp-modules{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lp-sec-head{grid-template-columns:1fr;gap:20px;margin-bottom:44px}
  .lp-bento{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lp-f1{grid-column:span 2}
  .lp-f2,.lp-f3,.lp-f4,.lp-f5{grid-column:span 1}
  .lp-faq{grid-template-columns:1fr;gap:40px}
}
/* Petit écran de bureau et tablette portrait */
@media (max-width:900px){
  .lp .plans{grid-template-columns:1fr;max-width:460px;margin:0 auto}
  .lp-steps{grid-template-columns:1fr;gap:34px}
  .lp-cta{padding:40px 32px}
  .lp-sec{padding:92px 0}
}
/* Téléphone */
@media (max-width:720px){
  .lp .pubnav{display:none}
  .lp .topbar .wrap{padding:0 16px;gap:8px}
  .lp .topbar .logo{font-size:15px}
  .lp .topbar .logo i{width:22px;height:22px;flex-basis:22px}
  .lp .topbar .row{gap:4px}
  .lp .topbar .btn{height:36px;padding:0 11px;font-size:12.5px}
  .lp .topbar .row .btn-ghost{display:inline-flex;padding:0 6px}
  .lp-wrap{padding:0 18px}
  .lp-hero{padding:48px 0 64px}
  .lp-hero h1{font-size:clamp(40px,11.5vw,52px)}
  .lp-lead{font-size:16.5px;margin-top:20px}
  .lp-ctas{margin-top:30px}
  .lp-ctas .btn{flex:1 1 100%}
  .lp-stats{grid-template-columns:1fr 1fr;margin-top:44px}
  .lp-stats > div{padding:15px 16px}
  .lp-stats > div:nth-child(odd){border-left:0}
  .lp-stats > div:nth-child(n+3){border-top:1px solid var(--lp-line)}
  .lp-win-body{grid-template-columns:1fr;min-height:0}
  .lp-win-side{display:none}
  .lp-win-main{padding:18px 16px}
  .lp-sec{padding:72px 0}
  .lp-h2{font-size:32px}
  .lp-modules{grid-template-columns:1fr}
  .lp-bento{grid-template-columns:1fr}
  .lp-f1,.lp-f2,.lp-f3,.lp-f4,.lp-f5{grid-column:span 1}
  .lp-feat{min-height:0}
  .lp-feat h3{margin-top:26px}
  .lp-cta{padding:30px 24px}
  .lp-cta .btn{width:100%}
  .lp-foot .lp-wrap{flex-direction:column;align-items:flex-start}
}

/* ===== DOCUMENTATION ET LIMITES D'USAGE ===== */
.usage-hint{color:var(--accent)}
.usage-hint:not(:empty)::after{content:" · ";color:var(--dim)}

/* Compteur de visiteurs en ligne (en-tête du site) */
.online-pill{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid var(--line2);border-radius:999px;font-size:13px;color:var(--muted);white-space:nowrap;margin-right:8px}
.online-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18);flex:none}
.online-pill b{color:var(--text);font-weight:600}
@media (max-width:640px){.online-pill{display:none}}
.kg{display:grid;grid-template-columns:230px minmax(0,1fr);gap:28px;align-items:start}
.kg-toc{position:sticky;top:24px;display:flex;flex-direction:column;gap:4px}
.kg-toc-btn{text-align:left;font-size:14px;color:var(--muted);padding:9px 12px;border-radius:12px;transition:background .15s,color .15s}
.kg-toc-btn:hover{background:rgba(255,255,255,.04);color:var(--text)}
.kg-body{display:flex;flex-direction:column;gap:18px;min-width:0}
.kg-sec{scroll-margin-top:24px;padding:28px 30px}
.kg-num{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--accent);margin-bottom:10px}
.kg-sec h2{font-family:var(--display);font-size:22px;letter-spacing:-.02em;font-weight:600;margin-bottom:12px}
.kg-sec p{color:var(--muted);font-size:15px;line-height:1.7;margin-top:12px}
.kg-sec ul{list-style:disc;margin-top:12px;padding-left:20px;color:var(--muted);font-size:15px;line-height:1.7;display:flex;flex-direction:column;gap:6px}
.kg-sec strong{color:var(--text);font-weight:600}
.kg-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}
.kg-step{border:1px solid var(--line);border-radius:var(--r-sm);padding:18px;background:var(--panel)}
.kg-step .n{font-family:var(--mono);font-size:10.5px;color:var(--accent);letter-spacing:.1em}
.kg-step h3{font-family:var(--display);font-size:16px;margin:8px 0 4px}
.kg-step p{margin-top:0;font-size:14px}
.kg-table-wrap{overflow-x:auto;margin-top:18px}
.kg-table{width:100%;border-collapse:collapse;font-size:14px;min-width:560px}
.kg-table th,.kg-table td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--line);color:var(--muted);vertical-align:top}
.kg-table th{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);font-weight:500}
.kg-table td:first-child{color:var(--text);font-weight:600}
.kg-qa{padding:14px 0;border-bottom:1px solid var(--line)}
.kg-qa:last-child{border-bottom:0;padding-bottom:0}
.kg-qa b{font-family:var(--display);font-size:16px;font-weight:600}
.kg-qa p{color:var(--muted);font-size:14.5px;line-height:1.65;margin-top:6px}
.kg-cta{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.kg-cta h2{font-family:var(--display);font-size:22px;letter-spacing:-.02em}
.kg-cta p{color:var(--muted);margin-top:6px;font-size:14.5px}
@media (max-width:900px){
  .kg{grid-template-columns:1fr}
  .kg-toc{position:static;flex-direction:row;flex-wrap:wrap}
  .kg-steps{grid-template-columns:1fr}
}

/* =====================================================================
   AVIS : défilement sur l'accueil et administration
   ===================================================================== */
.avis-sec .avis-head-r{display:flex;flex-direction:column;align-items:flex-end;gap:14px}
.avis-head-r p{font-size:16px}
.avis-note{font-family:var(--display);font-size:22px;color:var(--accent)}
.avis-rail{position:relative;overflow:hidden;padding:8px 0 12px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.avis-track{display:flex;gap:20px;width:max-content;animation:avisScroll 30s linear infinite}
.avis-rail:hover .avis-track{animation-play-state:paused}
@keyframes avisScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.avis-card{flex:0 0 340px;width:340px;min-height:210px;padding:24px;border-radius:20px;border:1px solid var(--line);background:linear-gradient(180deg,var(--panel2),var(--panel));display:flex;flex-direction:column;gap:14px}
.avis-empty{overflow:visible;-webkit-mask-image:none;mask-image:none}
.avis-empty .avis-card{width:100%;max-width:520px;flex:none;gap:10px;justify-content:center}
.avis-card-cta b{font-family:var(--display);font-size:22px;line-height:1.2}
.avis-stars-ro i{font-style:normal;color:var(--dim);font-size:18px;letter-spacing:1px}
.avis-stars-ro i.on{color:var(--accent)}
.avis-text{font-size:16px;line-height:1.55;color:var(--text)}
.avis-by{margin-top:auto;display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}
.avis-pick{display:flex;gap:6px;margin-top:6px}
.avis-pick-star{font-size:40px;line-height:1;background:none;border:0;color:var(--dim);cursor:pointer;padding:4px 2px}
.avis-pick-star.on{color:var(--accent)}
.avis-row{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--line)}
.avis-bilan{display:flex;gap:36px;flex-wrap:wrap}
.avis-bilan b{display:block;font-family:var(--display);font-size:30px;margin-top:4px}
@media (max-width:900px){.avis-sec .avis-head-r{align-items:flex-start}}
@media (prefers-reduced-motion:reduce){.avis-track{animation:none}.avis-rail{overflow-x:auto}}
