# DESIGN.md — Icey Locs · "Night Spa"

> Follow this file exactly. No color, font, radius, shadow or spacing value outside these tokens.
> Direction: **Icey Night Spa** — the site *is* their suite: a private, dark, blue-hour room lit by
> cool LED edge light, frosted glass, and one icy crown on the wall. Calm luxury, not nightclub.

## 1. Where every token comes from (do not "improve" these)
| Source | What we took |
|---|---|
| Their GlossGenius brand override | Primary gradient `#2A5E87 → #657F94`, secondary `#657F94` |
| Their logo (loc-crown line art) — pixel-sampled | Midnight `#0B111E`, Steel `#293344`, Frost-blue `#516681`, Ice `#A6B7CE` |
| Their suite (LED glow, mirror, cabinet) — pixel-sampled | Ice glow `#B9CBE5`, `#9AADD1` |
| iceylocs.com | Theme color `#D2E0EB`, heading font **League Spartan** |
| GlossGenius theme | Font **Archivo** (keeps the booking hand-off visually continuous) |

### Refero layout base
**Eight Sleep — "midnight observatory with single neon pulse"** (styles.refero.design/style/e4e8fe86-47ed-4ddd-a6c6-2c28eae9aabe).
Borrow its *rhythm only*: stark dark hero stage → alternating full-bleed dark bands and light editorial
sections (a "sleep-cycle cadence" — here, night → frost → night), one chromatic accent used as punctuation,
pill buttons, hairline borders, one whisper-soft shadow, flat architectural components. Its colors and fonts
are **not** used — Icey Locs' own tokens below replace them 1:1 (its "pulse blue" becomes our `ice`).

## 2. Color tokens (Tailwind v4 `@theme` in `src/app/globals.css`)
```css
@theme {
  --color-midnight: #0A0E16;     /* page background (never pure black) */
  --color-night: #111826;        /* alternate section background */
  --color-slate: #1B2433;        /* cards, panels, inputs */
  --color-steel: #293344;        /* borders, dividers, logo ink */
  --color-glacier: #2A5E87;      /* brand blue — FILLS & GLOWS ONLY on dark (2.80:1 as text) */
  --color-frost: #657F94;        /* brand secondary — large text / icons only on dark */
  --color-ice: #B9CBE5;          /* the accent: LED edge light, focus ring, eyebrow text, stars */
  --color-ice-bright: #DCE8F6;   /* primary CTA fill */
  --color-snow: #F2F6FB;         /* body text on dark */
  --color-mist: #9AA6B8;         /* secondary text on dark */
  --color-frost-bg: #E9EFF6;     /* light "frosted" sections (menu, policy, FAQ) */
  --color-ink: #0B111E;          /* text on light */
  --color-ink-soft: #4A5A6E;     /* secondary text on light */
  --color-glacier-deep: #1F4B6E; /* links / prices on light */
  --color-danger: #FF6B6B;

  --font-display: "League Spartan", system-ui, sans-serif;
  --font-body: "Archivo", system-ui, sans-serif;

  --radius-pill: 999px;
  --radius-card: 20px;
  --radius-img: 16px;
  --radius-input: 12px;

  --shadow-glow: 0 0 0 1px rgb(185 203 229 / 0.18), 0 10px 40px -10px rgb(42 94 135 / 0.55);
  --shadow-card: 0 1px 0 0 rgb(185 203 229 / 0.06) inset, 0 24px 60px -24px rgb(0 0 0 / 0.7);
  --ease-ice: cubic-bezier(0.22, 1, 0.36, 1);
}
```
Gradients (CSS custom properties, not theme colors):
```css
:root {
  --grad-brand: linear-gradient(135deg, #2A5E87 0%, #657F94 100%);       /* their own GlossGenius gradient */
  --grad-led: linear-gradient(90deg, transparent, #B9CBE5 50%, transparent); /* 1px LED edge line */
  --grad-night: radial-gradient(120% 80% at 70% 0%, #16223A 0%, #0A0E16 60%);
}
```

### Measured contrast (WCAG 2.2) — re-run `npm run audit:contrast` if any hex changes
| Pair | Ratio | Use |
|---|---|---|
| snow on midnight | 17.80 | body |
| snow on slate | 14.37 | card body |
| mist on midnight / night / slate | 7.84 / 7.21 / 6.33 | secondary text |
| ice on midnight / slate | 11.71 / 9.46 | eyebrows, prices on dark, stars |
| midnight on ice-bright (CTA) | 15.56 | primary button |
| frost on midnight | 4.61 | AA — use ≥ 18px only to stay safe |
| **glacier on midnight** | **2.80 — FAIL** | **never text on dark**; fills, glows, gradients only |
| ink on frost-bg | 16.30 | light-section body |
| glacier-deep on frost-bg | 7.92 | links, prices on light |
| ink-soft on frost-bg | 6.09 | secondary on light |
| snow on glacier | 6.35 | text on brand-blue chips |

## 3. Typography
- **Display — League Spartan** 700/800 (their existing site font, kept on purpose: the rebuild should feel like *their* brand leveled up). H1 clamp(2.75rem, 7vw, 6.5rem), line-height 0.95, letter-spacing −0.02em, often UPPERCASE for the short power lines ("REFRESH YOUR CROWN").
- **Body / UI — Archivo** 400/500/600 (their GlossGenius font). 17px base mobile / 18px desktop, line-height 1.6.
- **Lockup kicker** — the logo's "— LOC SPA —": League Spartan 600, 12–13px, letter-spacing 0.32em, uppercase, color `ice`, flanked by 24px hairlines. Use as the eyebrow above every section H2.
- Both fonts self-hosted via `next/font/google` (`display: "swap"`, `subsets: ["latin"]`). No other fonts. No script font.

## 4. Layout & spacing
- 4px base grid. Section padding: `py-24 md:py-36`. Content max-width 1240px, text measure ≤ 64ch.
- Mobile-first; gutters 20px mobile / 32px tablet / 48px desktop. No horizontal scroll at 320px.
- Radii only: `rounded-pill`, `rounded-card`, `rounded-img`, `rounded-input` (Tailwind v4 theme utilities — **never** `rounded-[--radius-pill]`, it silently does nothing).
- One primary CTA per screen: **Book** (ice-bright pill, midnight text). Secondary = ghost pill with 1px `ice/30` border.

## 5. Signature surfaces
- **LED edge line** — the 1px `--grad-led` line their suite shelves glow with. Use under the nav, on the top edge of cards on hover, and as section dividers. This is the brand's "underline."
- **Frosted glass card** — `bg-slate/60 backdrop-blur-md border border-ice/10 rounded-card shadow-card`. Fallback when `backdrop-filter` unsupported: `bg-slate`.
- **Frost texture** — `/images/texture/frost.webp` at 20–35% opacity, `mix-blend-mode: screen`, only in hero lower-left and the Repair Lab. Never behind body text.
- **Icicle divider** — a short SVG row of 5–7 tapered drips (echoes the drips on their logo and Shane's mark) under H2s on dark sections. 1 per section, max.
- **Iconography** — Lucide only (stroke 1.5, `ice`): Snowflake, Droplets, Sparkles, Crown, Scissors, Waves, Clock, MapPin, CalendarCheck, Gem (their rug shows a diamond mark). **No emoji anywhere** — reviews are emoji-stripped at render.

## 6. Photo treatment
- Their portfolio is mostly shot on a **blue textured backdrop** — that is the house look. Lead every grid with blue-backdrop shots.
- Warm-background shots get the **ice duotone**: `filter: grayscale(1) contrast(1.05)` + an overlay `mix-blend-mode: color` of `#2A5E87` at 55%, revealed to full color on hover/focus (desktop) or tap (mobile). Never alter the hair itself — this is a color grade, not an edit.
- Aspect ratios: gallery 4:5, service cards 4:5, hero 16:9 desktop / 3:4 mobile (`<picture>` with `media`, so only one hero file downloads).
- `PhotoSlot` component renders a branded **NEEDS REAL PHOTO** card (frost texture + Snowflake icon + label) wherever an asset is missing — impossible to ship blank.

## 7. Custom scrollbar (required)
```css
html { scrollbar-color: #657F94 #0A0E16; scrollbar-width: thin; }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #0A0E16; }
::-webkit-scrollbar-thumb { background: linear-gradient(#B9CBE5, #2A5E87); border-radius: 999px; border: 2px solid #0A0E16; }
::-webkit-scrollbar-thumb:hover { background: #B9CBE5; }
```
Also: `::selection { background: #2A5E87; color: #F2F6FB; }`, focus ring `outline: 2px solid #B9CBE5; outline-offset: 3px`.

## 8. Motion (summary — full spec in docs/MOTION.md)
One move per section, GSAP ScrollTrigger + Lenis, `ease-ice`, 600–900ms. Signature = **the loc crown draws itself** (line-art from their logo, stroke-dashoffset on scroll) and **frost clears** (a frost mask wipes off the hero headline on load). Every effect has a `prefers-reduced-motion` static fallback. Lighthouse ≥ 95 or the effect goes.

## 9. Do / Don't
- Do: deep midnight, generous darkness, cool light, crisp white type, real hair photography as the hero of every page.
- Don't: pure black `#000`, neon cyan, glitter, snowflake clip-art confetti, default purples/blues from component libraries, playful cursor/physics effects, more than 2 animated things visible at once.
