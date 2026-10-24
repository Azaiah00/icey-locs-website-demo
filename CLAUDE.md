# CLAUDE.md — Icey Locs website + "Icey Book" portal

You are building for **Icey Locs — Loc Spa** (Hollywood Park, Inglewood, CA) on behalf of Couture House Co.
Read this file, `DESIGN.md`, and every file in `docs/` before writing code. They outrank your defaults.

## Non-negotiables
1. **Facts come from `src/data/` only.** Names, prices, durations, deposits, hours, addresses, reviews,
   policy — import them. Never type a price or phone number into a component. Never invent a service,
   product, award, years-in-business, or testimonial.
2. **DESIGN.md is law.** No color, font, radius, shadow or spacing outside its tokens. Tailwind v4 theme
   utilities only (`rounded-pill`, not `rounded-[--radius-pill]`). `glacier` is never text on dark.
3. **No emoji** anywhere in UI or copy (reviews are emoji-stripped via `stripEmoji`). Lucide icons only.
4. **Missing assets are visible, never silent:** `<PhotoSlot label="NEEDS REAL PHOTO — …" />` and
   `<NeedsConfirm>` badges (demo mode only, controlled by `NEXT_PUBLIC_DEMO=1`). Every price with
   `priceStatus !== "confirmed"` shows a small "price to confirm" badge in demo mode.
5. **One primary CTA per screen: Book.** Ice-bright pill, midnight text.
6. **Mobile-first**, verified at 375 / 768 / 1024 / 1440. No horizontal scroll at 320.
7. **Performance budget:** Lighthouse ≥ 95 all categories, LCP < 2.0s on 4G, CLS < 0.05, JS on `/` < 120 KB gz.
8. **Accessibility:** WCAG 2.2 AA, measured. Focus ring `ice`. Every animation has a reduced-motion end state.
9. **Demo mode:** in-memory data via `src/lib/db.ts` only. No localStorage/sessionStorage. No real payments.
   `// TODO: Supabase` / `// TODO: Stripe` comments go in **.ts logic, never inside JSX** (they render as text).
10. **Promos are time-aware on the client** (`activePromos()` in a client component) so static HTML never
    shows an expired offer.

## Stack (as built, Oct 23 2026)
Next.js 16.4 (App Router, Turbopack, `output` default — Netlify's `@netlify/plugin-nextjs` handles it) ·
TypeScript strict · Tailwind CSS v4 (`@theme` in `globals.css`) · React 19.2 · **zero extra runtime deps**:
motion is native (IntersectionObserver reveals in `components/motion.tsx`, rAF scroll progress for the
Ritual + Repair Lab crown, CSS keyframes) — measured lighter than GSAP/Lenis for these effects; icons are
exact Lucide geometry inlined in `components/Icon.tsx`; fonts are self-hosted variable woff2 via
`next/font/local` (`src/app/fonts`, SIL OFL). ESLint 9 **native flat config**. Node 20.9+.
Only add GSAP/Lenis/framer-motion if a future effect genuinely needs them (and re-measure Lighthouse).
Client photos load from their own GlossGenius/GoDaddy CDNs via `next/image` remotePatterns until
`npm run assets:fetch` self-hosts them (then set `NEXT_PUBLIC_LOCAL_IMAGES=1`).
Demo badges show unless `NEXT_PUBLIC_DEMO=0`.

## Structure
```
src/
  app/            (marketing)/, book/, account/, studio/, learn/, api/ (none in demo)
  components/     ui/ (Button, Pill, Badge, PhotoSlot, NeedsConfirm, FrostCard, LedLine, IcicleDivider)
                  sections/ (one file per home section) · booking/ · studio/
  data/           business, services, team, reviews, gallery, promos, faq, mock/*
  lib/            db.ts (data seam), availability.ts, schema.ts (JSON-LD), format.ts, motion/ (gsap setup)
public/images/    work/, team/, services/, space/, texture/, brand/
scripts/          fetch-assets.mjs, audit-contrast.mjs, audit-flow.mjs, audit-a11y.mjs
```

## Scripts (must exist and pass before any handoff)
- `assets:fetch` — download the client's real images (scripts/fetch-assets.mjs)
- `lint` (ESLint 9 flat) · `typecheck` (`tsc --noEmit`) · `test` (vitest run)
- `audit:contrast` — reads hexes from globals.css, asserts the DESIGN.md ratio table
- `audit:flow` — builds, then asserts rendered HTML against `src/data`: NAP (and that "90303" and
  "704" never appear), hours, every price on /services, titles ≤ 60, descriptions 120–160, one H1 per
  page, no emoji, no `TODO` text, JSON-LD parses and has no aggregateRating/Review. Strip `<!-- -->`
  React text-split comments before matching text.
- `audit:a11y` — Playwright + axe at 375/768/1024/1440, tap targets ≥ 44px, no overflow-x.
- `audit:responsive [url]` — every route + every booking step + every portal view at 13 viewports (320→1920):
  page overflow, elements off-screen, clipped text, tap targets < 44px, text < 11px, distorted images, axe.
  Needs Playwright: `npm i -D playwright && npx playwright install chromium` (not a default dependency). `SHARD=i/n` runs in parallel; `--shots dir` saves screenshots.

## Repo hygiene
- **Do not keep this repo inside OneDrive** (npm hangs, git lock files break). Use
  `C:\Users\azaia\Downloads\Real Advancement\Clients\Icey Locs\icey-locs-site`.
- Match existing conventions once they exist (`cn()` util, token classes, hooks). Small, typed components.
- Commit per phase with a clear message. Never commit `.env*`.

## Definition of done (every phase)
`npm run lint && npm run typecheck && npm run test && npm run build && npm run audit:flow` all green,
screenshots taken at 375 and 1440 of every changed route and actually looked at, and a short report:
passed / fixed / still needs the client's real assets.
