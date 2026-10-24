# BOOKING-PORTAL.md — "Icey Book" (better-than-GlossGenius), demo mode

## What we are cloning and beating
GlossGenius today (iceylocs.glossgenius.com): pick location → service → option → required add-on groups
(Styles, Haircut) + optional Loc Spa → pro → time → card + deposit. Its weak spots we fix:
1. The public menu hides prices behind "N options" and shows **wrong "from" prices** (Haircut "$45+" when
   the adult cut is $75; a $20.50 consult displays as "$21"). → We show every option price up front.
2. No running total while choosing add-ons. → **Always-visible price + duration + deposit total.**
3. Required groups like "Haircut: Haircut Request / No Haircut" feel like a dead end. → Pre-select the
   free default and explain it in one line.
4. Two locations feel like two businesses. → One booker, a location switch in step 1, cross-sell a cut.
5. Nothing after the appointment. → **Crown Journey** photo timeline, rebook nudges, Crown Club.

## Client booker — 5 steps, fewest taps
URL state: `/book?location=&service=&option=&mods=&pro=&date=&time=` (read **client-side** with
`useSearchParams` inside a Suspense boundary — reading `searchParams` on the server makes the route
dynamic and breaks prefetch).
1. **Service** — location toggle (Loc Spa · Barber Spa) + category chips + service cards (from-price,
   duration, deposit). Deep links skip ahead.
2. **Customize** — option radio list (price · time · deposit per row); then each modifier group:
   `required` = radio with the $0 default pre-selected ("No Style", "No Haircut"); `optional` = checkboxes.
   Promo modifiers obey `expires` and `onlyWeekday` (Freestyle Friday only appears if the chosen date is a
   Friday ≤ 2026-10-30; if picked first, the calendar limits to Fridays).
3. **Pro** — "First available" (default) or Icey / Lele / Shane, filtered by `service.staff`. Shows each
   pro's review count from team.ts.
4. **Time** — 14-day strip + slots. Availability engine (`src/lib/availability.ts`): salon hours from
   business.ts (9:00–19:00 daily, America/Los_Angeles), 15-min grid, service duration incl. add-ons must
   end by 19:00, subtract mock appointments for that pro, no past slots, lead time 2h `[CONFIRM]`.
5. **Details & deposit** — name, mobile, email, first-visit toggle (validates `newClientsOnly`),
   notes ("loc length / last retwist / repair areas"), photo upload (optional — feeds Crown Journey),
   policy checkbox (verbatim policy text in a drawer), demo card-on-file UI (Stripe Elements look-alike,
   "DEMO — no charge" label, `// TODO: Stripe PaymentIntent for deposit`). BNPL note when total ≥ $50.
   Confirm → confirmation screen with add-to-calendar (.ics generated client-side) + "Text me directions".

**Running total bar** (sticky bottom on mobile, right rail desktop): service · option · each add-on ·
**Total $X (or "From $X")** · **Time Yh Zm** · **Deposit due today $D** · "applied to your total". Uses
`quote()` from services.ts — the same function the tests assert.

Escape hatch on every step: "Prefer GlossGenius? Book there →" (`glossGeniusBookUrl(location)`) — keeps
the live business safe while the demo is a demo.

## Roles (fake auth, memory only)
Role switcher in the demo header (and a "Sign in" sheet with Google/Apple buttons that just set the role):
`guest` · `client` (Mock client "Jordan") · `stylist` (Icey / Lele / Shane) · `owner` (Icey).

## Client account (`/account`)
- Upcoming + past appointments; reschedule (respects 24h rule — inside 24h shows the deposit-loss
  warning verbatim) and cancel.
- **Crown Journey** — photo timeline of every visit (before/after, service, pro notes, products used),
  shared with the owner CRM. Repair clients see a progress meter across the 4 Repair Lab stages.
- Rebook nudge: "Your last refresh was 5 weeks ago" `[CONFIRM interval]`.
- Crown Club tier card (Frost / Glacier / Diamond) with visits-to-next-tier.
- Saved card (demo), receipts.

## Stylist view (`/studio` as stylist)
Only *their* calendar (day/week), *their* clients, *their* earnings (service revenue + tips, mock),
client notes + Crown Journey entries they can add after a visit. Cannot see other pros or business totals.

## Owner view (`/studio` as owner = Icey)
- **Today**: timeline across both suites, deposits collected, no-show risk flags (first-visit + no card).
- **Calendar**: all pros, drag to reschedule (demo), block time.
- **Clients (CRM)**: search, tags (repair, kids, extensions, member), lifetime value, Crown Journey,
  last visit, rebook status.
- **Menu & prices**: every service/option with its `priceStatus`; "Confirm price" clears the public
  badge (memory only). This is how the owner clears our placeholders during the demo.
- **Promos**: toggle/edit promos (Welcome Ritual monthly offer, Freestyle Friday) with dates.
- **Finances**: revenue by day/week/month, by service, by pro; deposits; BNPL share; top add-ons.
- **Reviews**: the 34 real reviews, "feature on site" toggle.
- **Settings**: hours, deposit rules, cancellation window (24h), lead time.

## Data layer (single seam)
`src/lib/db.ts` exports async functions only (`listServices`, `getAvailability`, `createBooking`,
`listAppointments(role)`, `updateAppointment`, `listClients`, `addJourneyEntry`, `confirmPrice`, …).
Implementation = in-memory store seeded from `src/data/*` + `src/data/mock/*` (React context; **no
localStorage** — refresh resets the demo). Every function has `// TODO: Supabase` above it; payment calls
`// TODO: Stripe`. Swapping to a real backend changes db.ts only — no UI edits.

## Mock data spec (`src/data/mock/`)
- `clients.ts` — 24 clients (fictional first names + last initial, 310/323/424 area codes with 555
  exchange, e.g. (424) 555-01xx), tags, 1–6 past visits each, 8 with Crown Journey photos (use their real
  gallery images, captioned as demo).
- `appointments.ts` — generated for today ±21 days in America/Los_Angeles, ~70% utilization for Icey,
  ~55% Lele, ~60% Shane, realistic service mix weighted to Refresh Your Crown (45%), Mini Loc Spa (10%),
  braids (12%), repair consult (6%), extensions/instant/wicks (7%), barber (20%). Deposits per services.ts.
- `earnings.ts` — derived from appointments (never hand-typed totals) + mock tips 15–25%.
- Clearly label every mock name/number in the UI as demo data.

## Acceptance tests (Vitest)
- `quote()` totals for 6 representative selections (e.g. Full Head · Pass Shoulder · Plaits · Detox →
  $285, 165 min, $20 deposit).
- Freestyle Friday hidden on non-Fridays and after 2026-10-30 (salon timezone).
- `newClientsOnly` blocks the Welcome Ritual for returning mock clients.
- No slot ends after 19:00; no double-booking per pro.
- Stylist role cannot read another stylist's appointments.
