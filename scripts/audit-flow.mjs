#!/usr/bin/env node
/**
 * audit:flow — crawls a running build and asserts rendered HTML against src/data.
 *   npm run build && npm run start   (in another terminal)
 *   npm run audit:flow               (defaults to http://localhost:3010)
 * Zero dependencies (Node 20+ fetch).
 */
const BASE = (process.argv[2] || process.env.AUDIT_URL || "http://localhost:3010").replace(/\/$/, "");

const ROUTES = [
  "/", "/services", "/loc-repair", "/kids", "/barber-spa", "/gallery", "/team", "/reviews", "/visit", "/policies", "/book", "/studio",
  "/services/welcome-to-icey-locs-loc-spa", "/services/refresh-your-crown-half-head", "/services/refresh-your-crown-full-head",
  "/services/mini-loc-spa", "/services/starter-locs", "/services/natural-braids-and-twist", "/services/haircut-add-on", "/services/wicks",
  "/services/loc-extensions", "/services/loc-repair-consultation", "/services/loc-spa-add-ons", "/services/barber-spa-vip",
  "/services/barber-haircut", "/services/line-up-taper", "/services/refresh-your-crown", "/services/loc-detox",
];

// Prices that must appear on /services (every option, from src/data/services.ts).
const MUST_ON_SERVICES = ["$160", "$120", "$140", "$250", "$180", "$200", "$350", "$100", "$125", "$220", "$300", "$450", "$800", "$80", "$150", "$750", "$550", "$1,000", "$20.50", "$35", "$40", "$75", "$55", "$45", "$65"];

const fails = [];
const warn = [];
const strip = (html) => html.replace(/<!--[\s\S]*?-->/g, "");
const text = (html) => strip(html).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/\s+/g, " ");
const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/u;

for (const r of ROUTES) {
  const res = await fetch(BASE + r);
  if (res.status !== 200) {
    fails.push(`${r}: HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();
  const t = text(html);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const isApp = r === "/book" || r === "/studio";
  if (!title) fails.push(`${r}: missing <title>`);
  else if (title.replace(/&amp;/g, "&").length > 60) fails.push(`${r}: title ${title.length} chars > 60 — "${title}"`);
  if (!desc) fails.push(`${r}: missing meta description`);
  else if (!isApp && (desc.length < 110 || desc.length > 160)) warn.push(`${r}: description ${desc.length} chars (target 120–160)`);
  if (!isApp && h1 !== 1) fails.push(`${r}: ${h1} <h1> elements (want 1)`);
  if (emoji.test(t)) fails.push(`${r}: emoji in rendered text`);
  if (/\bTODO\b/.test(t)) fails.push(`${r}: visible TODO text`);
  if (/90303/.test(t)) fails.push(`${r}: wrong ZIP 90303 rendered`);
  if (/704[) .-]*974/.test(t)) fails.push(`${r}: old 704 phone rendered`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const s = JSON.stringify(j);
      if (/aggregateRating|"@type":"Review"/.test(s)) fails.push(`${r}: JSON-LD contains review/rating markup`);
    } catch (e) {
      fails.push(`${r}: JSON-LD does not parse (${e.message})`);
    }
  }
  if (r === "/" || r === "/visit") {
    for (const must of ["1237 District Dr", "Suite 113", "90301", "(424) 420-8193"]) if (!t.includes(must)) fails.push(`${r}: missing NAP "${must}"`);
  }
  if (r === "/services") for (const p of MUST_ON_SERVICES) if (!t.includes(p)) fails.push(`/services: price ${p} not rendered`);
}

for (const f of ["/sitemap.xml", "/robots.txt"]) {
  const res = await fetch(BASE + f);
  if (res.status !== 200) fails.push(`${f}: HTTP ${res.status}`);
}

console.log(`audit:flow — ${ROUTES.length} routes on ${BASE}`);
warn.forEach((w) => console.log("  warn ", w));
fails.forEach((f) => console.log("  FAIL ", f));
console.log(fails.length ? `\n${fails.length} failure(s)` : "\nAll checks passed.");
process.exit(fails.length ? 1 : 0);
