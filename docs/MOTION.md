# MOTION.md — "Frost & Crown"

Stack: GSAP 3 + ScrollTrigger + `@gsap/react` (`useGSAP`), Lenis for smooth scroll (synced to the GSAP
ticker), CSS transitions + one IntersectionObserver for simple reveals. **No framer-motion** unless a
component genuinely needs layout animation (portal drawers) — it costs ~38 KB gz for what CSS does.
Rules: one move per section · max 2 animated things in view · 60 fps · transform/opacity/clip-path only ·
every effect has a `prefers-reduced-motion: reduce` static end-state · Lighthouse ≥ 95 or it goes.

## Signature 1 — Frost clears (hero, on load)
- The H1 "LOC CARE, ICED." sits under a frost layer: an absolutely-positioned `<div>` with the frost
  texture (`/images/texture/frost-1280.webp`) masked by an SVG `feTurbulence` noise mask.
- On load (after fonts ready), animate the mask threshold 0 → 1 over 1.4s `ease-ice`, so frost melts off
  in organic patches, revealing crisp snow-white type. A faint 1px LED line (`--grad-led`) then sweeps
  left→right under the kicker (0.6s).
- Cost guard: the frost layer is `will-change: opacity` only during the animation, removed after; total
  hero JS for this ≤ 4 KB. Reduced motion: no frost layer at all.

## Signature 2 — The crown draws itself (Repair Lab + footer)
- Source: their logo's loc-crown line art (the sketched locs fanning from a headband). Vectorize the
  client's logo (ask for the original; until then trace the IG avatar) with `potrace` → simplify in SVGO
  → keep only strokes; save as `/public/brand/crown-lineart.svg` (`stroke: currentColor`, `fill: none`).
  LESSON: ship it as a cached `.svg` file loaded via `<img>` for static uses, inline only on the Repair
  Lab where it animates (one instance per page).
- Repair Lab: section pins for 4 stages (`end: "+=300%"`). The crown's strokes are grouped into four
  quarters (left locs, right locs, headband, drips). Each stage scrubs `strokeDashoffset` of one group
  from length → 0, color `frost` → `ice`. Stage text cross-fades (opacity + 12px y).
- LESSON: content inside the pinned section must NOT use the IntersectionObserver reveal class.
- Mobile (<768px): no pin; the four stages stack and each group draws when its card enters (IO), 0.9s.
- Footer: the full crown draws once (1.6s) when the footer enters, then stays.

## Section moves (one each)
| Section | Move |
|---|---|
| Nav | Transparent over hero → `midnight/80` + blur + LED bottom line after 80px scroll (CSS class toggle). |
| Proof strip | CSS marquee on mobile only (pauses on hover/focus; static on reduced motion). |
| Problem | 3 tiles rise 16px + fade, 80ms stagger (IO). |
| The Ritual | Pinned 5 steps (desktop); a vertical LED line fills between step numbers as you scroll (scaleY scrub). |
| Signature services | Cards: hover lifts 4px, top LED edge appears (CSS). No scroll animation. |
| Welcome band | Static. (Bands that sell should not move.) |
| Gallery | Duotone → full color on hover/focus (CSS filter transition 400ms). Images fade in as they load. |
| Young Crowns | Photo pair parallax ±24px (scrub) desktop only. |
| Reviews | Embla-style drag carousel with CSS scroll-snap (no library); quote text fades between slides. |
| Team | Avatar ring: 1px ice ring draws on hover (conic-gradient mask). |
| Barber Spa | Shane's SS mark watermark drifts 40px on scroll (scrub, 0.2 strength). |
| Visit | Map pin drops in with a 1-frame frost "ripple" (scale 0.9→1, opacity). |
| Final CTA | Icicle divider drips 8px (CSS keyframe, once). |

## React Bits picks (max 2 on any screen, tinted to tokens, installed as source)
- **Blur Text** — section H2s on dark sections only (not on the H1; frost handles that). Color `snow`.
- **Count Up** — "34" and "5.0" in the proof strip (once, on view).
- **Spotlight Card** — Signature service cards, spotlight color `rgb(185 203 229 / 0.12)`.
- **Stepper** — booking flow progress (restyled: ice dots, steel track).
- Avoid: Splash/Blob Cursor, Ballpit, Pixel Trail, Antigravity, Balatro, any purple default.

## Scroll + smoothness
- Lenis `{ lerp: 0.1, wheelMultiplier: 1 }`; disabled entirely when reduced motion is set and on touch
  devices (native scroll on iOS/Android). `ScrollTrigger.refresh()` after fonts + images in the pinned
  sections load.
- Custom scrollbar styles in DESIGN.md §7 apply to the page and to the booking drawer.

## Video (optional, phase 6 — stills first)
If Frederick approves the hero still, a 6s seamless loop can be made on Kie.ai from
`/images/space/suite-wide.webp` (slow push-in, LED shimmer, candle flicker; no people). Poster = the still;
`<video muted playsinline loop preload="none">`, loaded only after LCP on desktop ≥1024px, never on mobile
data-saver. Do not generate until the still is approved.
