# BUILD-PROMPTS.md — paste in order (Claude Code / Cursor agent)

Open the repo folder in Cursor, start Claude Code, and paste **one prompt per message**. Wait for the
phase's Definition-of-Done report before pasting the next. Each prompt assumes CLAUDE.md, DESIGN.md and
docs/* are in the repo (they are).

---

## PROMPT 0 — Foundation, tokens, data, assets, audits

```
Read CLAUDE.md, DESIGN.md and every file in docs/ fully before doing anything. Then build the foundation
for the Icey Locs site. Do 100% of the work, no placeholders that aren't the documented PhotoSlot /
NeedsConfirm components, and verify everything before you report.

1. Scaffold Next.js 16 (App Router, TypeScript strict, src/ dir, Tailwind CSS v4) IN PLACE in this folder,
   keeping the existing files (CLAUDE.md, DESIGN.md, docs/, src/data/*, scripts/fetch-assets.mjs,
   public/images/space/*, public/images/texture/*). Add .nvmrc (20) and netlify.toml
   ([build] command = "npm run build", [build.environment] NODE_VERSION = "20",
   [[plugins]] package = "@netlify/plugin-nextjs"; do NOT set publish).
2. Install: gsap @gsap/react lenis lucide-react clsx tailwind-merge; dev: sharp vitest @vitejs/plugin-react
   @testing-library/react jsdom playwright @axe-core/playwright prettier eslint@9 eslint-config-next
   typescript-eslint. Create eslint.config.mjs (ESLint 9 flat) that actually lints src/ — prove it by
   running it.
3. globals.css: Tailwind v4 @import + the full @theme block from DESIGN.md §2 verbatim, the :root
   gradients, the custom scrollbar + ::selection + focus ring from §7, base body styles (midnight bg, snow
   text, Archivo). Fonts via next/font/google: League Spartan (700, 800) as --font-display and Archivo
   (400, 500, 600) as --font-body, display swap.
4. Do not modify the typed data in src/data/ (business, services, team, reviews, gallery, promos, faq).
   Add src/lib/format.ts (money "$1,000" / "From $X", minutes → "1h 45m", phone links, hours "9 AM – 7 PM")
   and src/lib/db.ts as described in docs/BOOKING-PORTAL.md (in-memory, async, seeded from src/data; just
   the read functions for now).
5. Add "assets:fetch": "node scripts/fetch-assets.mjs" and run it. It downloads their real portfolio,
   team avatars, service thumbnails and space/brand images into public/images. Report the counts. If any
   URL fails, list it — do not substitute stock images.
6. Build the UI primitives in src/components/ui: Button (primary ice-bright pill / ghost), Badge, Pill,
   FrostCard, LedLine, IcicleDivider (inline SVG, 6 tapered drips), PhotoSlot (frost texture + Snowflake
   icon + label), NeedsConfirm (renders only when NEXT_PUBLIC_DEMO=1), PriceTag (reads priceStatus and
   shows the "price to confirm" badge in demo mode), SectionHeading (lockup kicker "— X —" + H2).
7. Motion infra in src/lib/motion: Lenis provider (disabled on reduced-motion and touch), GSAP +
   ScrollTrigger registration, a useReveal IntersectionObserver hook (CSS classes), and a
   usePrefersReducedMotion hook.
8. Write the three audits as npm scripts per CLAUDE.md: audit:contrast, audit:flow (stub routes list now,
   it grows each phase), audit:a11y. Add Vitest with the quote() and promo tests from
   docs/BOOKING-PORTAL.md "Acceptance tests" (the ones that only need src/data).
9. Create a /_kitchen-sink route (noindex) showing every primitive on midnight and on frost-bg so we can
   eyeball tokens.

Definition of done: lint, typecheck, test, build all pass; audit:contrast passes; screenshot
/_kitchen-sink at 375 and 1440 and confirm pill radii render round. Report passed / fixed / needs client.
```

---

## PROMPT 1 — Home page (all 15 sections)

```
Build the home page exactly per docs/CONTENT.md "Home" sections 1–15, DESIGN.md and docs/MOTION.md.
Every fact and price imported from src/data. One component per section in src/components/sections.

Specifics that matter:
- Header: transparent over the hero, becomes midnight/80 + backdrop-blur + LedLine after 80px. Mobile:
  full-screen sheet menu with large League Spartan links + Book button. Sticky mobile bottom bar
  (Book · Call) appears after the hero leaves the viewport.
- Announcement bar renders client-side from activePromos() (Freestyle Friday disappears after
  2026-10-30 in America/Los_Angeles with no rebuild).
- Hero: <picture> with /images/space/suite-wide.webp (desktop ≥1024, 16:9) and the portrait suite image
  (/images/space/suite-portrait.jpg, mobile 3:4) — only one downloads. Dark gradient overlay left→right
  so the H1 reads at 7:1+. Implement Signature 1 "Frost clears" from MOTION.md (SVG turbulence mask,
  1.4s, once, reduced-motion = no frost). Proof chip with 5.0 · 34 reviews from business.ratings.
- Ritual: pinned 5-step scrub on desktop with the vertical LED fill line; stacked with IO reveals on mobile.
- Signature services: 8 Spotlight-style cards (React Bits Spotlight Card, install as source, tint to
  rgb(185 203 229 / 0.12)) using public/images/services/<id>.jpg or a matching gallery image; show
  fromPrice() + duration + deposit; Book deep-links to /book?service=<id>.
- Repair Lab: Signature 2 "crown draws itself". For now build the SVG from the IL/crown line-art: if
  /public/brand/crown-lineart.svg does not exist yet, create a clean hand-built placeholder crown SVG
  (headband arc + 14 fanning loc strokes + 5 drips) grouped into 4 <g> quarters, and leave
  <NeedsConfirm>Replace with the vectorized client logo</NeedsConfirm>. Pin 4 stages desktop, stacked
  mobile. Before/after = two PhotoSlots.
- Gallery: first 12 items of gallery.ts, blue-backdrop items first; warm ones get the ice duotone
  (DESIGN.md §6), full color on hover/focus/tap; filter chips; lightbox (keyboard + swipe, focus-trapped).
- Reviews: featuredReviews, stripEmoji at render, CSS scroll-snap carousel, name + pro + date
  ("July 2026"). Never show review id 28.
- Team: three cards from team.ts; Shane's avatar is a logo → render it inside a ring with
  "NEEDS REAL PHOTO" in demo mode; bios null → NeedsConfirm.
- Visit: static map image (generate an on-brand SVG map tile — streets as steel hairlines, frost pin —
  NO Google Maps JS on load) + "Get directions" link to
  https://www.google.com/maps/dir/?api=1&destination=1237+District+Dr+Suite+113+Inglewood+CA+90301 .
- FAQ: accordion from faqs (confirm:true items only in demo mode).
- Footer: lockup, both suites' NAP, hours, socials, policies link, "Book on GlossGenius" fallback, crown
  draws once on enter.

Definition of done: all checks + audit:flow for "/" (NAP, hours, prices, no 90303/704, no emoji, no
TODO text). Screenshot 375/768/1024/1440, look at each, fix anything off-token. Run Lighthouse mobile on
/ and report the four scores; fix until all ≥ 95.
```

---

## PROMPT 2 — Inner pages

```
Build the inner routes per docs/CONTENT.md and docs/SEO.md, reusing the home section components:
/services (location tabs Loc Spa / Barber Spa; every service with its verbatim description, full option
table — name, price, time, deposit — and add-on groups; "Book this" deep links),
/services/[slug] (static params from services.ts; hero photo, description, options, add-ons, related
reviews by tag, FAQ subset, Service JSON-LD, breadcrumb). Map these extra slugs to SEO landing pages:
/services/refresh-your-crown (both Refresh services), /services/loc-detox (Loc Spa Treatments).
/loc-repair, /kids, /barber-spa, /gallery (all 22 items + lightbox + filters), /team, /reviews (all
publicReviews with pro filter; "Leave a Google review" → business.googleReviewUrl), /visit, /policies
(verbatim policy from business.ts), /learn (hub + 4 post pages from the CONTENT.md outlines, each marked
NeedsConfirm "owner review before publish", noindex until confirmed), /club (Crown Club demo tiers,
pricing NeedsConfirm, Join → demo modal), /shop (waitlist only — invent no products), /404 on-brand.
Every page: unique title/description per SEO.md rules, one H1, breadcrumb JSON-LD, OG image route.

Definition of done: all checks; audit:flow extended to every route (titles, descriptions, H1 count,
prices on /services match services.ts option-by-option); screenshots 375 + 1440 of every route.
```

---

## PROMPT 3 — "Icey Book" client booker

```
Build /book per docs/BOOKING-PORTAL.md "Client booker" exactly: 5 steps, URL state read client-side
(useSearchParams in a Suspense boundary), React Bits Stepper restyled to tokens, sticky running total
using quote() (total or "From", duration, deposit due today), required groups pre-selected to their $0
default, Freestyle Friday rules (Friday only, ≤ 2026-10-30, salon timezone), newClientsOnly check,
pro filter from service.staff, availability from src/lib/availability.ts (hours 9–19 daily, 15-min grid,
must finish by 19:00, mock appointments subtracted, 2h lead time flagged NeedsConfirm), details form with
real validation + accessible errors, policy drawer (verbatim), demo card UI labelled "DEMO — no charge",
BNPL note when total ≥ $50, confirmation screen with .ics download. "Prefer GlossGenius? Book there →"
on every step using glossGeniusBookUrl(). Seed src/data/mock/* per the mock data spec and implement the
db.ts write functions (createBooking etc.) in memory.

Add the remaining Vitest acceptance tests (slots never end after 19:00, no double booking, Welcome
Ritual blocked for returning clients, Freestyle Friday rules). Playwright happy path (clock mocked to
2026-10-26 09:00 America/Los_Angeles so the test never goes stale): book Full Head · Pass Shoulder Length ·
Plaits · Detox · No Haircut with Lele on the first open slot and assert $285 / 2h 45m / $20 deposit. A
second test with the clock at 2026-10-29 asserts Freestyle Friday is offered for Fri Oct 30 and gone when
the clock is 2026-10-31.

Definition of done: all checks + tests + Playwright; keyboard-only run through all 5 steps; screenshots
of each step at 375 and 1440.
```

---

## PROMPT 4 — Client account + Studio (stylist & owner)

```
Build the role-separated portals per docs/BOOKING-PORTAL.md: demo role switcher + fake "Sign in" sheet
(memory only), /account (upcoming/past, reschedule/cancel with the verbatim 24h policy warning, Crown
Journey photo timeline using real gallery images labelled demo, Repair progress across the 4 Repair Lab
stages, Crown Club tier card, rebook nudge with interval NeedsConfirm), and /studio:
- stylist role (Icey / Lele / Shane): only their calendar, clients, earnings, and add-a-journey-entry.
- owner role (Icey): Today, Calendar (all pros, both suites, drag-to-reschedule demo), Clients CRM,
  Menu & prices (confirm price → clears the public badge in this session), Promos, Finances (charts
  derived from mock appointments — never hand-typed totals; follow a clean, token-tinted chart style),
  Reviews (34 real, feature toggle), Settings.
Enforce role scoping inside db.ts (not just the UI) and add the test "stylist cannot read another
stylist's appointments". All mock people and numbers visibly labelled demo.

Definition of done: all checks + tests; screenshots of each portal screen at 375 and 1440.
```

---

## PROMPT 5 — Capture, SEO schema, OG, analytics hooks

```
1. "Scrape the Frost" exit-intent from docs/CONTENT.md: canvas scratch-off over a frosted-glass card
   revealing the active first-time promo from promos.ts; erase with globalCompositeOperation
   "destination-out" and an OPAQUE brush (reset fillStyle to an opaque color in the erase path); reveal
   completes at 55% cleared; desktop exit-intent, mobile 45s + 60% scroll; once per session in memory;
   Esc/close always available; focus-trapped dialog; reduced motion = instant reveal; then phone/email
   capture → demo toast. Lazy-load the component after first interaction.
2. src/lib/schema.ts per docs/SEO.md: @graph with #loc-spa and #barber-spa HairSalon nodes (Barber Spa uses
   additionalType, not BarberShop), OfferCatalog from services.ts, FAQPage from confirmed faqs,
   BreadcrumbList everywhere, Service on /services/[slug]. NO aggregateRating, NO Review.
3. app/sitemap.ts, app/robots.ts (disallow /studio /account /book/confirm /_kitchen-sink), canonicals,
   metadataBase from NEXT_PUBLIC_SITE_URL (default https://iceylocs.com), per-route opengraph-image.tsx.
4. Analytics seam: src/lib/track.ts with no-op functions (book_start, book_step, book_complete,
   promo_view, frost_revealed, call_click, directions_click) + // TODO: GA4/Meta Pixel in .ts only.

Definition of done: all checks; validate every JSON-LD block with a parser in audit:flow; screenshot the
popup at 375 and 1440 before and after scratching.
```

---

## PROMPT 6 — Polish, QA, mandatory audit, deploy prep

```
Run the full post-build audit and fix everything you find:
- Design: every color/radius/shadow traceable to DESIGN.md tokens (grep for hex codes outside
  globals.css and fail on any). One primary CTA per screen. No emoji. No visible TODO text.
- Responsive: 320/375/768/1024/1440 screenshots of every route — look at each. No overflow-x.
- Accessibility: audit:a11y clean (axe 0 serious/critical), keyboard-only through nav, gallery
  lightbox, booker and popup; reduced-motion pass (every animation has its static end state).
- Performance: Lighthouse mobile ≥ 95 ×4 on /, /services, /loc-repair, /book; LCP < 2s; JS budget.
  If framer-motion or any library is used in ≤ 1 file for something CSS can do, remove it.
- SEO: audit:flow green (titles, descriptions, H1s, JSON-LD parses, NAP = 90301 / (424) 420-8193 /
  Suite 113 & 112 everywhere, "90303" and "704" appear nowhere).
- Data: every price on /services and in the booker equals services.ts; promo expiry works with the clock
  mocked to 2026-10-31.
Then write ASSETS-OWED.md updates (anything still missing) and a DEPLOY.md (GitHub → Netlify, env vars:
NEXT_PUBLIC_DEMO, NEXT_PUBLIC_SITE_URL; Node 20; domain swap plan from GoDaddy builder to Netlify DNS).
Final report: passed / fixed / still needs the client's real assets.
```
