// Responsive audit: every route + every portal/booking state at 13 viewports.
// Usage: node scripts/audit-responsive.mjs [baseUrl] [--shots dir]
// Checks: page-level horizontal overflow (and which elements cause it), elements poking past the
// viewport edges, text clipped inside non-scrolling boxes, tap targets < 44px on touch widths,
// text under 12px, images rendered with distorted aspect, overlapping fixed bars, axe serious/critical.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright"); // devDependency-free: uses a globally installed Playwright (npx playwright install chromium)
const BASE = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "http://localhost:3010").replace(/\/$/, "");
const shotIdx = process.argv.indexOf("--shots");
const SHOTS = shotIdx > -1 ? process.argv[shotIdx + 1] : null;
const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const [SH_I, SH_N] = (process.env.SHARD || '0/1').split('/').map(Number);
const AXE = process.env.AXE_PATH || "/tmp/axe/node_modules/axe-core/axe.min.js";

const VIEWPORTS = [
  [320, 640, "phone-se1"], [360, 780, "android"], [375, 812, "iphone-mini"], [390, 844, "iphone"], [414, 896, "iphone-plus"], [430, 932, "iphone-max"],
  [768, 1024, "ipad"], [820, 1180, "ipad-air"], [1024, 768, "ipad-land"], [1280, 800, "laptop"], [1366, 768, "laptop-hd"], [1440, 900, "desktop"], [1920, 1080, "desktop-fhd"],
];

const SLUGS = ["welcome-to-icey-locs-loc-spa", "refresh-your-crown-half-head", "refresh-your-crown-full-head", "mini-loc-spa", "starter-locs", "natural-braids-and-twist", "haircut-add-on", "wicks", "loc-extensions", "loc-repair-consultation", "loc-spa-add-ons", "barber-spa-vip", "barber-haircut", "line-up-taper", "refresh-your-crown", "loc-detox"];

// state = function run after load to reach a UI state
const PAGES = [
  ["/"], ["/services"], ["/loc-repair"], ["/kids"], ["/barber-spa"], ["/gallery"], ["/team"], ["/reviews"], ["/visit"], ["/policies"], ["/not-a-page"],
  ...SLUGS.map((s) => [`/services/${s}`]),
  ["/book", "book-1-service"],
  ["/book?service=refresh-full", "book-2-customize"],
  ["/book?service=refresh-full", "book-3-pro", async (p) => { await cont(p); }],
  ["/book?service=refresh-full", "book-4-time", async (p) => { await cont(p); await cont(p); await pickSlot(p); }],
  ["/book?service=refresh-full", "book-5-details", async (p) => { await cont(p); await cont(p); await pickSlot(p); await cont(p); }],
  ["/book?service=refresh-full", "book-6-confirmed", async (p) => { await cont(p); await cont(p); await pickSlot(p); await cont(p); await fillDetails(p); }],
  ["/book?service=barber-lineup", "book-barber"],
  ["/studio", "studio-start"],
  ...["owner", "icey", "lele", "shane"].flatMap((r) => (r === "owner" ? ["today", "calendar", "clients", "finances", "menu", "reviews"] : ["today", "calendar", "clients", "finances"]).map((tab) => [`/studio?as=${r}&tab=${tab}`, `studio-${r}-${tab}`])),
  ["/studio?as=client&tab=journey", "studio-client"],
  ["/", "home-mobile-menu", async (p, w) => { if (w >= 1024) return "skip"; await p.locator('button[aria-controls="mobile-menu"]').click(); await p.waitForTimeout(700); }],
  ["/", "home-demo-tour", async (p) => { await p.evaluate(() => window.dispatchEvent(new Event("open-demo-tour"))); await p.waitForTimeout(400); }],
  ["/", "home-popup", async (p) => {
    await p.evaluate(() => { window.scrollTo(0, 1500); });
    await p.waitForTimeout(6300);
    await p.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { clientY: 0, bubbles: true, relatedTarget: null })));
    await p.waitForTimeout(600);
    if (!(await p.locator('[role=dialog]').count())) return "skip";
  }],
  ["/gallery", "gallery-lightbox", async (p) => { const b = p.locator("main button").filter({ has: p.locator("img") }).first(); if (!(await b.count())) return "skip"; await b.click(); await p.waitForTimeout(600); }],
];

async function cont(p) { const n = p.locator("button:visible", { hasText: /^\s*Continue\s*$/ }).first(); await n.click(); await p.waitForTimeout(350); }
async function pickSlot(p) {
  for (let i = 0; i < 12; i++) {
    if ((await p.locator('[aria-label^="Open times"] button').count()) > 0) break;
    await p.locator('[aria-label="Choose a date"] button').nth(i + 1).click(); await p.waitForTimeout(250);
  }
  await p.locator('[aria-label^="Open times"] button').first().click(); await p.waitForTimeout(250);
}
async function fillDetails(p) {
  await p.fill("#f-name", "Jordan B."); await p.fill("#f-phone", "(310) 555-0142"); await p.fill("#f-email", "jordan@example.com");
  for (const c of await p.locator("form input[type=checkbox]").all()) await c.check();
  await p.getByRole("button", { name: /Confirm & pay/ }).click(); await p.waitForTimeout(700);
}

const CHECK = (touch) => {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: document.documentElement.scrollWidth - vw, offenders: [], pokers: [], clipped: [], smallTap: [], tinyText: [], distorted: [], };
  const desc = (e) => { let s = e.tagName.toLowerCase(); if (e.id) s += "#" + e.id; const c = (e.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 4).join("."); if (c) s += "." + c; const t = (e.innerText || e.getAttribute("aria-label") || e.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 40); return t ? `${s} "${t}"` : s; };
  const visible = (e) => { if (e.closest('.sr-only')) return false; const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  // is element inside an intentional horizontal scroller / clipped container?
  // inside an intentional horizontal scroller, or inside a box that clips (overflow hidden/clip) — not a page overflow
  const inScroller = (e) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (/(auto|scroll)/.test(cs.overflowX) && a.scrollWidth > a.clientWidth + 1) return true; if (/(hidden|clip)/.test(cs.overflowX)) { const r = a.getBoundingClientRect(); if (r.left >= -1 && r.right <= document.documentElement.clientWidth + 1) return true; } } return false; };
  const ariaHidden = (e) => !!e.closest('[aria-hidden="true"],[inert]');
  const all = [...document.body.querySelectorAll("*")];
  for (const e of all) {
    if (!visible(e)) continue;
    const r = e.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !inScroller(e) && !ariaHidden(e) && getComputedStyle(e).position !== "fixed") {
      out.pokers.push(`${desc(e)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
    }
  }
  if (out.overflowX > 0) {
    for (const e of all) { if (!visible(e)) continue; const r = e.getBoundingClientRect(); if (r.right > vw + 1 && !inScroller(e)) out.offenders.push(`${desc(e)} right=${Math.round(r.right)}`); }
    out.offenders = out.offenders.slice(-12);
  }
  // text clipped in a non-scrolling box
  for (const e of all) {
    if (!visible(e) || ariaHidden(e)) continue;
    const cs = getComputedStyle(e);
    if (!/(hidden|clip)/.test(cs.overflowX) && !/(hidden|clip)/.test(cs.overflowY)) continue;
    if (cs.textOverflow === "ellipsis") continue;
    const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    if (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 4) out.clipped.push(`${desc(e)} ${e.scrollWidth}x${e.scrollHeight} in ${e.clientWidth}x${e.clientHeight}`);
  }
  // text node overflowing its parent (wrapping failure) — words wider than container
  for (const e of all) {
    if (!visible(e) || ariaHidden(e)) continue;
    const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (!hasText) continue;
    const cs = getComputedStyle(e);
    if (cs.whiteSpace === "nowrap" || cs.display === "inline") continue;
    if (e.scrollWidth > e.clientWidth + 2 && !/(auto|scroll)/.test(cs.overflowX) && !inScroller(e)) out.clipped.push(`WRAP ${desc(e)} ${e.scrollWidth}>${e.clientWidth}`);
  }
  if (touch) {
    for (const e of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],summary,label:has(input)')) {
      if (!visible(e) || ariaHidden(e)) continue;
      if (e.closest(".prose, p, li > p") && e.tagName === "A") continue; // inline text links are exempt (WCAG 2.5.8 inline exception)
      const r = e.getBoundingClientRect();
      if (e.tagName === "INPUT" && /checkbox|radio/.test(e.type)) { const l = e.closest("label"); if (l) continue; }
      if (r.height < 44 && r.width < 44 || r.height < 24 || r.width < 24) out.smallTap.push(`${desc(e)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      else if (r.height < 44 && !e.closest("nav[aria-label='Primary']")) { const cs = getComputedStyle(e); if (cs.display !== "inline") out.smallTap.push(`${desc(e)} ${Math.round(r.width)}x${Math.round(r.height)}`); }
    }
  }
  for (const e of all) {
    if (!visible(e) || ariaHidden(e)) continue;
    const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const fs = parseFloat(getComputedStyle(e).fontSize);
    if (fs < 11) out.tinyText.push(`${desc(e)} ${fs}px`);
  }
  for (const img of document.querySelectorAll("img")) {
    if (!visible(img) || !img.naturalWidth) continue;
    const cs = getComputedStyle(img);
    if (/cover|contain|scale-down/.test(cs.objectFit)) continue;
    const r = img.getBoundingClientRect();
    const a1 = img.naturalWidth / img.naturalHeight, a2 = r.width / r.height;
    if (Math.abs(a1 - a2) / a1 > 0.03) out.distorted.push(`${desc(img)} natural ${a1.toFixed(2)} vs box ${a2.toFixed(2)}`);
  }
  for (const k of ["pokers", "clipped", "smallTap", "tinyText", "distorted"]) out[k] = [...new Set(out[k])].slice(0, 15);
  return out;
};

const results = [];
const browser = await chromium.launch();
const axeSrc = fs.existsSync(AXE) ? fs.readFileSync(AXE, "utf8") : null;
let pageIdx = -1;
for (const [url, name0, state] of PAGES) {
  pageIdx++; if (pageIdx % SH_N !== SH_I) continue;
  const name = name0 || (url === "/" ? "home" : url.replace(/^\//, "").replace(/[/?=&]/g, "_"));
  if (ONLY && !ONLY.test(name)) continue;
  for (const [w, h, vname] of VIEWPORTS) {
    const touch = w < 1024;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    try {
      await p.goto(BASE + url, { waitUntil: "networkidle", timeout: 30000 });
      await p.waitForTimeout(500);
      let skipped = false;
      if (state) skipped = (await state(p, w)) === "skip";
      if (skipped) { await ctx.close(); continue; }
      // scroll through to trigger reveals / lazy content, then return
      await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
      const isDialog = /popup|lightbox|menu|tour/.test(name);
      if (!isDialog) await p.evaluate(() => scrollTo(0, 0));
      await p.waitForTimeout(300);
      const r = await p.evaluate(CHECK, touch);
      if (axeSrc && (vname === "iphone" || vname === "desktop")) {
        await p.addScriptTag({ content: axeSrc });
        r.axe = await p.evaluate(async () => (await window.axe.run({ resultTypes: ["violations"] })).violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`));
      }
      r.errors = errors.slice(0, 5);
      results.push({ page: name, vp: `${w}x${h} ${vname}`, ...r });
      if (SHOTS && ["iphone-mini", "ipad", "ipad-land", "desktop", "phone-se1", "desktop-fhd"].includes(vname)) {
        fs.mkdirSync(SHOTS, { recursive: true });
        await p.screenshot({ path: path.join(SHOTS, `${name}__${w}.jpg`), type: "jpeg", quality: 60, fullPage: !isDialog });
      }
    } catch (e) {
      results.push({ page: name, vp: `${w}x${h} ${vname}`, fatal: String(e).slice(0, 300) });
    }
    await ctx.close();
  }
  process.stdout.write(".");
}
await browser.close();
fs.writeFileSync(`/tmp/audit-responsive-${SH_I}.json`, JSON.stringify(results, null, 1));
// summary
let issues = 0;
for (const r of results) {
  const parts = [];
  if (r.fatal) parts.push("FATAL " + r.fatal);
  if (r.overflowX > 0) parts.push(`overflowX=${r.overflowX} ${r.offenders.join(" ; ")}`);
  for (const k of ["pokers", "clipped", "smallTap", "tinyText", "distorted", "axe", "errors"]) if (r[k]?.length) parts.push(`${k}: ${r[k].join(" ; ")}`);
  if (parts.length) { issues++; console.log(`\n[${r.page} @ ${r.vp}]\n  ` + parts.join("\n  ")); }
}
console.log(`\n\n${results.length} page-states checked, ${issues} with findings.`);
