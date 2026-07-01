// Assemble index.html from section fragments + the manifest.
// Deterministically generates annotated <figure> blocks and substitutes
// {{figure:ID}} / {{gallery-all}} tokens inside the section fragments.
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SECT = join(root, 'sections')

const SECTIONS = [
  { id: 'overview', title: 'Overview' },
  { id: 'ia', title: 'Information architecture' },
  { id: 'anatomy', title: 'Panel anatomy & layout' },
  { id: 'conversation', title: 'Conversation lifecycle' },
  { id: 'threading', title: 'Threading & background work' },
  { id: 'scoping', title: 'Scoping & context' },
  { id: 'library', title: 'Library, Save & Share' },
  { id: 'crosspage', title: 'Cross-page chrome' },
  { id: 'motion', title: 'Motion & micro-interactions' },
  { id: 'copy', title: 'Copy & lexicon' },
  { id: 'considerations', title: 'Considerations & open questions' },
  { id: 'gallery', title: 'Screenshot index' },
]

const CSS = String.raw`
:root{
  --brand:#715DAA; --brand-ink:#5C4A91; --brand-soft:#F1EDF8; --brand-soft-2:#E3DBF2;
  --ink:#1d1c24; --ink-2:#4b4960; --ink-3:#76748a; --line:#e7e5ef; --line-2:#efedf6;
  --bg:#ffffff; --bg-2:#faf9fd; --bg-3:#f4f2fa;
  --ok:#1f9d57; --warn:#c98a00; --danger:#d4453b;
  --sidebar-w:268px; --maxw:880px; --radius:14px;
  --shadow:0 1px 2px rgba(20,18,40,.05),0 8px 28px rgba(20,18,40,.07);
  --mono:'JetBrains Mono',ui-monospace,Menlo,monospace;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:'Lato',system-ui,sans-serif;color:var(--ink);background:var(--bg-2);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--brand-ink);text-decoration:none}
a:hover{text-decoration:underline}

/* sidebar */
.sidebar{position:fixed;top:0;left:0;width:var(--sidebar-w);height:100vh;background:var(--bg);border-right:1px solid var(--line);padding:26px 20px;overflow-y:auto;z-index:30}
.brand{display:flex;align-items:center;gap:10px}
.brand__mark{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,var(--brand),#9b86d6);box-shadow:0 2px 8px rgba(113,93,170,.4)}
.brand__name{font-weight:900;font-size:21px;letter-spacing:-.01em}
.brand__sub{margin:4px 0 22px 36px;font-size:11.5px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em;line-height:1.4}
.nav{display:flex;flex-direction:column;gap:1px}
.nav a{display:flex;align-items:baseline;gap:10px;padding:8px 11px;border-radius:9px;color:var(--ink-2);font-size:14px;font-weight:700;line-height:1.3}
.nav a:hover{background:var(--bg-3);text-decoration:none;color:var(--ink)}
.nav a.active{background:var(--brand-soft);color:var(--brand-ink)}
.nav__num{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--ink-3);min-width:18px}
.nav a.active .nav__num{color:var(--brand)}
.sidebar__meta{margin-top:24px;padding-top:16px;border-top:1px solid var(--line-2);font-size:11.5px;color:var(--ink-3);line-height:1.5}

/* main */
.main{margin-left:var(--sidebar-w);max-width:var(--maxw);padding:64px 56px 120px}
.doc-head h1{font-size:46px;font-weight:900;letter-spacing:-.025em;margin:0 0 12px}
.doc-head__tagline{font-size:20px;color:var(--ink);margin:0 0 14px;max-width:62ch}
.doc-head__note{font-size:14.5px;color:var(--ink-2);background:var(--bg);border:1px solid var(--line);border-left:3px solid var(--brand);border-radius:10px;padding:14px 18px;max-width:70ch}

/* sections */
.section{padding-top:64px;margin-top:24px;border-top:1px solid var(--line-2)}
.section:first-of-type{border-top:none}
.section__eyebrow{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--brand);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.section h2{font-size:30px;font-weight:900;letter-spacing:-.02em;margin:0 0 18px}
.section h3{font-size:19px;font-weight:800;margin:34px 0 10px}
.section h4{font-size:15px;font-weight:800;margin:22px 0 6px;color:var(--ink)}
.section p{font-size:15.5px;color:var(--ink-2);max-width:72ch}
.section p b,.section li b{color:var(--ink)}
.lead{font-size:17.5px!important;color:var(--ink)!important;max-width:70ch}
.section ul,.section ol{font-size:15.5px;color:var(--ink-2);max-width:72ch;padding-left:22px}
.section li{margin:5px 0}
.section li::marker{color:var(--brand)}

/* callouts */
.callout{border-radius:12px;padding:14px 18px;margin:20px 0;font-size:14.5px;border:1px solid var(--line);background:var(--bg)}
.callout--info{border-left:3px solid var(--brand);background:var(--brand-soft)}
.callout--warn{border-left:3px solid var(--warn);background:#fdf6e7}
.callout--note{border-left:3px solid var(--ink-3);background:var(--bg-3)}
.callout b{display:block;margin-bottom:3px}

/* pills / kbd / tokens */
.pill{display:inline-block;font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--brand-soft);color:var(--brand-ink);border:1px solid var(--brand-soft-2)}
.kbd{font-family:var(--mono);font-size:12.5px;background:var(--bg);border:1px solid var(--line);border-bottom-width:2px;border-radius:6px;padding:1px 6px;color:var(--ink)}
.tok{font-family:var(--mono);font-size:13px;background:var(--bg-3);border:1px solid var(--line);border-radius:5px;padding:1px 6px;color:var(--brand-ink)}

/* tables */
table{border-collapse:collapse;width:100%;margin:18px 0;font-size:14px;background:var(--bg);border:1px solid var(--line);border-radius:10px;overflow:hidden}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line-2);vertical-align:top}
th{background:var(--bg-3);font-weight:800;color:var(--ink);font-size:12.5px;text-transform:uppercase;letter-spacing:.03em}
tr:last-child td{border-bottom:none}
td b{color:var(--ink)}

/* state-list (chips of states) */
.stategrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:18px 0}
.stategrid a{display:block;padding:9px 12px;border:1px solid var(--line);border-radius:9px;background:var(--bg);font-size:13px;font-weight:700;color:var(--ink-2)}
.stategrid a:hover{border-color:var(--brand);color:var(--brand-ink);text-decoration:none}

/* figures + annotation overlay */
.shot{margin:26px 0;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.shot__media{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(220px,1fr);gap:0}
.shot__frame{position:relative;background:var(--bg-3);display:flex;align-items:flex-start;justify-content:center;padding:18px;cursor:zoom-in;border-right:1px solid var(--line-2)}
.shot__frame img{max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 18px rgba(20,18,40,.12);display:block}
.shot__marker{position:absolute;width:23px;height:23px;margin:-11px 0 0 -11px;border-radius:999px;background:var(--brand);color:#fff;font-family:var(--mono);font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px rgba(255,255,255,.92),0 2px 6px rgba(20,18,40,.35);z-index:2}
/* marker offset is set inline via left/top against the frame's image box */
.shot__legend{margin:0;padding:18px 20px;list-style:none;display:flex;flex-direction:column;gap:10px}
.shot__legend li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--ink-2);margin:0}
.shot__n{flex:0 0 auto;width:20px;height:20px;border-radius:999px;background:var(--brand-soft);color:var(--brand-ink);border:1px solid var(--brand-soft-2);font-family:var(--mono);font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;margin-top:1px}
.shot__txt b{color:var(--ink)}
figcaption{padding:11px 18px;border-top:1px solid var(--line-2);font-size:13px;color:var(--ink-3);background:var(--bg-2)}
.shot__cap-id{font-family:var(--mono);font-size:11px;color:var(--brand);background:var(--brand-soft);border-radius:5px;padding:1px 6px;margin-right:6px}
.missing{color:var(--danger);font-size:13px;font-family:var(--mono)}

/* the marker frame must be positioned relative to the IMAGE, not the padded frame */
.shot__imgwrap{position:relative;display:inline-block}

/* gallery */
.gallery{display:flex;flex-direction:column;gap:18px}
.gallery .shot{margin:0}

/* lightbox */
.lightbox{position:fixed;inset:0;background:rgba(18,16,30,.86);display:none;align-items:center;justify-content:center;z-index:100;padding:40px;cursor:zoom-out}
.lightbox.open{display:flex}
.lightbox img{max-width:94vw;max-height:92vh;border-radius:10px;box-shadow:0 20px 70px rgba(0,0,0,.5)}
.lightbox__close{position:fixed;top:22px;right:26px;width:42px;height:42px;border-radius:999px;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:18px;cursor:pointer}
.lightbox__close:hover{background:rgba(255,255,255,.26)}

/* responsive */
.nav-fab{display:none}
@media (max-width:1080px){
  .shot__media{grid-template-columns:1fr}
  .shot__frame{border-right:none;border-bottom:1px solid var(--line-2)}
}
@media (max-width:860px){
  .sidebar{transform:translateX(-100%);transition:transform .2s ease}
  #nav-toggle:checked ~ .sidebar{transform:none}
  .nav-fab{display:flex;align-items:center;justify-content:center;position:fixed;top:14px;left:14px;width:44px;height:44px;border-radius:12px;background:var(--brand);color:#fff;font-size:20px;z-index:40;box-shadow:var(--shadow);cursor:pointer}
  .main{margin-left:0;padding:72px 22px 100px}
  .doc-head h1{font-size:34px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`

const JS = String.raw`
// scrollspy
const links=[...document.querySelectorAll('.nav a')];
const map=Object.fromEntries(links.map(a=>[a.dataset.target,a]));
const io=new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.remove('active')); map[e.target.id]?.classList.add('active'); }});
},{rootMargin:'-10% 0px -80% 0px',threshold:0});
document.querySelectorAll('section.section').forEach(s=>io.observe(s));
// close mobile nav on link click
links.forEach(a=>a.addEventListener('click',()=>{const t=document.getElementById('nav-toggle');if(t)t.checked=false;}));
// lightbox
const lb=document.getElementById('lightbox'),lbi=document.getElementById('lightbox-img');
document.querySelectorAll('.shot__frame img').forEach(img=>img.addEventListener('click',()=>{lbi.src=img.src;lb.classList.add('open');}));
lb.addEventListener('click',()=>lb.classList.remove('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open');});
`

const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))
const byId = Object.fromEntries(manifest.map((s) => [s.id, s]))
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function figureHTML(state) {
  if (!state) return '<p class="missing">[missing screenshot]</p>'
  if (state.skipped) return `<p class="missing">[state “${esc(state.id)}” not captured]</p>`
  const markers = (state.annotations || [])
    .map((a) => `<span class="shot__marker" style="left:${a.cxPct}%;top:${a.cyPct}%">${a.n}</span>`)
    .join('')
  const legend = (state.annotations || []).length
    ? `<ol class="shot__legend">${state.annotations
        .map((a) => `<li><span class="shot__n">${a.n}</span><span class="shot__txt"><b>${esc(a.label)}</b>${a.note ? ` — ${esc(a.note)}` : ''}</span></li>`)
        .join('')}</ol>`
    : '<ol class="shot__legend"><li><span class="shot__txt">See caption.</span></li></ol>'
  return `<figure class="shot" id="shot-${esc(state.id)}">
  <div class="shot__media">
    <div class="shot__frame"><span class="shot__imgwrap"><img loading="lazy" src="assets/screenshots/${esc(state.file)}" alt="${esc(state.title)}">${markers}</span></div>
    ${legend}
  </div>
  <figcaption><span class="shot__cap-id">${esc(state.id)}</span>${esc(state.title)}</figcaption>
</figure>`
}

function expandTokens(html) {
  html = html.replace(/\{\{\s*figure:([a-z0-9-]+)\s*\}\}/gi, (_, id) => figureHTML(byId[id]))
  html = html.replace(/\{\{\s*gallery-all\s*\}\}/gi, () => `<div class="gallery">${manifest.map((s) => figureHTML(s)).join('\n')}</div>`)
  return html
}

const navLinks = SECTIONS.map((s, i) => `<a href="#${s.id}" data-target="${s.id}"><span class="nav__num">${String(i + 1).padStart(2, '0')}</span>${s.title}</a>`).join('\n')
const capturedCount = manifest.filter((s) => !s.skipped).length

const body = SECTIONS.map((s) => {
  const f = join(SECT, `${s.id}.html`)
  const inner = existsSync(f) ? expandTokens(readFileSync(f, 'utf8')) : `<h2>${esc(s.title)}</h2><p class="missing">[section “${s.id}” not authored]</p>`
  return `<section id="${s.id}" class="section">\n<div class="section__eyebrow">${esc(s.title)}</div>\n${inner}\n</section>`
}).join('\n\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scout — Developer Handoff</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<input type="checkbox" id="nav-toggle" hidden>
<label for="nav-toggle" class="nav-fab" aria-label="Toggle navigation">☰</label>
<aside class="sidebar">
  <div class="brand"><span class="brand__mark"></span><span class="brand__name">Scout</span></div>
  <div class="brand__sub">Developer handoff<br>design-intent spec</div>
  <nav class="nav">${navLinks}</nav>
  <div class="sidebar__meta">${capturedCount} annotated states · spec is implementation-agnostic by design</div>
</aside>
<main class="main">
  <header class="doc-head">
    <h1>Scout</h1>
    <p class="doc-head__tagline">An embedded AI pricing co-pilot. This is the complete behavioral specification — every surface, state, transition, and consideration needed to build it.</p>
    <p class="doc-head__note">Written as <b>design intent</b>: it describes what the product does and how it behaves, not how the prototype was coded. Numbers (timings, sizes) are intended behavior, not implementation mandates. ${capturedCount} states are captured with annotated screenshots — click any image to enlarge.</p>
  </header>
  ${body}
  <footer class="doc-foot" style="margin-top:80px;padding-top:24px;border-top:1px solid var(--line-2);color:var(--ink-3);font-size:13px">Generated for developer handoff · screenshots captured live from the running prototype.</footer>
</main>
<div class="lightbox" id="lightbox"><img id="lightbox-img" alt=""><button class="lightbox__close" aria-label="Close">✕</button></div>
<script>${JS}</script>
</body>
</html>`

writeFileSync(join(root, 'index.html'), html)
console.log(`wrote index.html (${SECTIONS.length} sections, ${capturedCount} figures available)`)
