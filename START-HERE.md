# START HERE — Icey Locs build package (Couture House Co.)

**Client:** Icey Locs — Loc Spa · Icey Scurry (owner) · Hollywood Park Shops, 1237 District Dr Ste 113, Inglewood CA 90301 · (424) 420-8193 · @iceylocs
**Today:** GoDaddy site (iceylocs.com) + GlossGenius booking (two locations: Loc Spa + Barber Spa).
**We deliver:** a premium "Icey Night Spa" marketing site + "Icey Book" booking portal (client / stylist / owner), demo mode.

## 1. Set up the repo (2 minutes)
1. This folder already lives at **`C:\Users\azaia\Downloads\Real Advancement\Clients\Icey Locs\icey-locs-site`** (outside OneDrive, so npm and git work). Open it in Cursor and start Claude Code.
2. Paste **PROMPT 0** from `docs/BUILD-PROMPTS.md`. Wait for its report. Then PROMPT 1 … PROMPT 6, one at a time.
3. Push to GitHub, connect Netlify (Node 20; the Next.js plugin handles output), set `NEXT_PUBLIC_DEMO=1` for the demo deploy.
4. Approval previews of the two Kie stills are in `..\Approval Stills\`.

## 2. What's in here
| File | What it is |
|---|---|
| `CLAUDE.md` | Rules the coding agent must follow (facts from data only, tokens, audits, definition of done) |
| `DESIGN.md` | Full design system — tokens sampled from her logo/suite/GlossGenius, measured contrast, type, scrollbar |
| `src/data/*.ts` | **The single source of truth** — verbatim menu (14 services, every option, add-on and deposit), team, 34 real reviews, gallery (22 real photos), promos (auto-expiring), FAQ. Type-checked. |
| `scripts/fetch-assets.mjs` | Downloads all her real photos from GlossGenius + iceylocs.com |
| `public/images/space/suite-wide.webp` | Widescreen hero — her suite image extended with Kie.ai (needs your OK) |
| `public/images/texture/frost.webp` | Frost-glass texture (Kie.ai) |
| `docs/FACTS.md` | Verified facts + NAP reconciliation table + sources |
| `docs/CONTENT.md` | Full copy deck in her voice, every section of every page |
| `docs/MOTION.md` | "Frost clears" hero + "crown draws itself" Repair Lab + one move per section |
| `docs/SEO.md` | Keyword map, titles/descriptions, JSON-LD rules |
| `docs/BOOKING-PORTAL.md` | Booking feature contract (beats GlossGenius), roles, mock data spec, tests |
| `docs/BUILD-PROMPTS.md` | The 7 copy-paste prompts |
| `docs/IMAGE-PROMPTS.md` | Kie.ai prompts used + next stills/video to make |
| `ASSETS-OWED.md` | What Icey still needs to send/confirm |

## 3. The pitch in one breath
Her reviews are perfect (5.0 from 34 GlossGenius + 20 Google reviews) and her suite is beautiful, but her website is a GoDaddy page that sends people to a menu that hides the option prices behind "6 options" — and even shows misleading prices ("$45+" for a $75 adult cut, a $20.50 loc repair consult that displays as "$21"). We give her a site that *feels like walking into the suite*, sells loc repair as her signature, shows every price and deposit up front, books in five taps with a live running total, and gives her an owner portal with finances, CRM and a Crown Journey photo timeline GlossGenius doesn't have. Upsells already designed in: Crown Club memberships, gift cards, Icey Care shop waitlist, /learn SEO content, monthly promos, Scrape-the-Frost capture.
