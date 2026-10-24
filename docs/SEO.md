# SEO.md — Local SEO plan (Inglewood · Hollywood Park · Los Angeles)

## Keyword map (one primary intent per URL)
| URL | Primary | Secondary |
|---|---|---|
| / | loctician Inglewood CA | loc spa Los Angeles, locs near SoFi Stadium, luxury loc salon Los Angeles |
| /services | loc retwist prices Inglewood | loc retwist near LAX, wash and retwist Los Angeles |
| /loc-repair | loc repair Inglewood | loc repair Los Angeles, crochet loc repair, broken locs repair |
| /services/starter-locs | starter locs Inglewood | instant locs Los Angeles, two strand starter locs |
| /services/loc-extensions | loc extensions Los Angeles | human hair loc extensions Inglewood |
| /services/wicks | wicks locs Los Angeles | starter wicks Inglewood |
| /services/refresh-your-crown | loc retwist Inglewood | interlock locs Los Angeles, crochet loc maintenance |
| /services/loc-detox | loc detox Los Angeles | loc detox Inglewood |
| /kids | kids locs Inglewood | kids braids Inglewood, kids loc retwist Los Angeles |
| /barber-spa | barber Inglewood Hollywood Park | barber near SoFi Stadium, kids haircut Inglewood |
| /gallery | loc styles Los Angeles | barrel twist locs, loc plaits |
| /learn/* | informational long-tail | — |

## Titles & descriptions (titles ≤ 60 chars, descriptions 140–155 — audit enforces)
- `/` — **Icey Locs | Loc Spa & Loc Repair in Inglewood, CA** — "Private loc suites at Hollywood Park, steps from SoFi Stadium. Retwists, loc repair, starter & instant locs, extensions and braids. Open daily 9–7."
- `/services` — **Loc Services & Prices | Icey Locs Inglewood** — "Full menu with prices: Refresh Your Crown retwists, loc repair, starter and instant locs, extensions, wicks, detox and braids at Hollywood Park."
- `/loc-repair` — **Loc Repair in Inglewood & Los Angeles | Icey Locs** — "Weak, thinning or broken locs? Precision crochet loc repair by a loc repair specialist. Start with a 20-minute consultation near SoFi Stadium."
- `/kids` — **Kids Locs & Braids in Inglewood | Icey Locs** — "Mini Loc Spa for ages 5 and under, kids braids and kids cuts in a calm private suite at Hollywood Park. Gentle products, clean parts, soft hands."
- `/barber-spa` — **Barber Spa at Hollywood Park | Icey Locs Inglewood** — "Clean cuts, crisp line ups and fresh tapers next door to the Loc Spa. Haircuts, line ups, kids cuts and the Barber Spa V.I.P near SoFi Stadium."
(Claude Code writes the rest in the same pattern; the audit fails any title > 60 or description outside 120–160.)

## JSON-LD (in `src/lib/schema.ts`, generated from `src/data/*` — never hand-typed)
- `/` and `/visit`: **two** `HairSalon` nodes in an `@graph`:
  - `#loc-spa`: name "Icey Locs — Loc Spa", address Suite 113 / 90301, telephone +14244208193, email, geo, `openingHoursSpecification` Mo–Su 09:00–19:00, `url`, `image` (suite + 3 work photos), `priceRange: "$$"`, `sameAs` [instagram.com/iceylocs, facebook.com/108545098431616], `areaServed` [Inglewood, Los Angeles, Hollywood Park], `hasOfferCatalog` built from services.ts (Offer price = base/from price, priceCurrency USD), `paymentAccepted` incl. "Buy Now, Pay Later".
  - `#barber-spa`: `HairSalon` + `additionalType: "https://en.wikipedia.org/wiki/Barber"` (there is **no** BarberShop type), Suite 112, `parentOrganization: { "@id": "#loc-spa" }`.
- **No `aggregateRating` / `Review` markup** — reviews are business-collected (GlossGenius) or Google-owned; marking them up is self-serving and against Google's guidelines.
- `/services/*`: `Service` with `provider` → `#loc-spa`, `areaServed`, `offers`.
- `/faq` content: `FAQPage` from `faqs` where `confirm !== true`.
- `BreadcrumbList` on every inner page.

## Technical
- `app/sitemap.ts` (all routes, `lastModified` = build time) · `app/robots.ts` (disallow `/studio`, `/account`, `/book/confirm`) · canonical on every page · `metadataBase` = production domain `[CONFIRM: keep iceylocs.com]`.
- OG image per page via `opengraph-image.tsx` (midnight bg, crown line-art, page title in League Spartan).
- Images: AVIF/WebP via `next/image`, explicit sizes, `priority` only on the hero `<picture>`.
- NAP in the footer as plain text (not an image), matching `business.ts` exactly.
- Google Business Profile actions for the owner (listed in ASSETS-OWED.md): fix ZIP 90303 → 90301, add Suite 113, set website to the new domain, enable "Book" link to /book, post the Welcome Ritual, add the Barber Spa as its own listing only if it is a distinct business at Suite 112.

## Content velocity (upsell: monthly SEO retainer)
2 /learn posts per month from the outline list in CONTENT.md, each linking to one service page, plus a
monthly GBP post mirroring the active promo.
