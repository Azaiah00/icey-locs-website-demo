# CONTENT.md — Copy deck (Icey Locs voice)

Voice: confident, calm, a little cool. Luxury without stiffness — the clients talk like "she understood
the assignment" and "in and out like a heist"; the brand talks like "maintaining your crown" and "a
modern Icey aesthetic." We sit between the two: short, polished lines with real warmth. Words we use:
**crown, iced, refresh, ritual, suite, private, precise, restore, fresh, clean.** Words we never use:
"premier," "state-of-the-art," "one-stop shop," "affordable luxury," exclamation-point stacks.
Every number below comes from `src/data/` — components read data, never this file.
`[CONFIRM]` = render the NeedsConfirm badge in demo mode.

---

## Global
- **Nav:** Services · Loc Repair · Gallery · Team · Barber Spa · Visit · [Book] (pill)
- **Announcement bar (from `activePromos()`):** "Freestyle Friday — free style with your Friday wash + retwist, through Oct 30." → Book
- **Footer:** lockup "ICEY LOCS — LOC SPA" · "Private loc & natural hair suites in Hollywood Park, Inglewood." · both suites' NAP · Hours: Every day 9 AM – 7 PM · IG @iceylocs · @iLbarberspa · Facebook · Policies · "Book on GlossGenius" fallback link · © Icey Locs.
- **Sticky mobile CTA (after hero leaves viewport):** [Book] · [Call] icons (CalendarCheck / Phone).

## Home

### 1 · Hero (dark, suite photo, frost clears off the headline)
- Kicker: — LOC SPA · HOLLYWOOD PARK —
- **H1:** LOC CARE, ICED.
- Sub: Private loc suites steps from SoFi Stadium. Retwists, loc repair, starter and instant locs, extensions and braids — with a barber spa next door.
- Primary CTA: **Book your suite** → /book
- Secondary: See the menu → /services
- Proof chip: [Star icon] 5.0 · 34 client reviews (Lucide Star, filled `ice`)
- Microline: Open every day, 9–7 · Buy Now, Pay Later available

### 2 · Proof strip (frost-bg band, 5 items, marquee on mobile)
5.0 on GlossGenius (34) · 5.0 on Google (20) · Inside Hollywood Park Shops · Open daily 9–7 · Kids welcome

### 3 · The problem (dark)
- Eyebrow: — WHY ICEY —
- **H2:** Your locs deserve more than a rushed retwist.
- Body: Loud shops, crowded chairs, roots that loosen in a week, buildup nobody washed out, thinning spots that got worse instead of better. We built Icey Locs to be the opposite: a private suite, a real loc bath, and precise hands that leave your crown cleaner and stronger than it came in.
- Three tiles (icon + line):
  - **Private suite** — Your appointment, your room. No crowd, no rush. (Lucide: DoorClosed)
  - **Loc repair specialists** — Precision crochet that restores weak, thinning and broken locs. (Lucide: Sparkles)
  - **In and out, done right** — Clients say it best: "Process wasn't as long as I thought it was and literally iced my hair." (Lucide: Clock)

### 4 · The Icey Ritual (pinned, 5 steps, ritual line draws between them)
- Eyebrow: — THE RITUAL —
- **H2:** Every refresh is a ritual.
- 01 **Loc Bath** — A luxury shampoo cleanse that lifts buildup from root to tip.
- 02 **Scalp Care** — Clean parts, calm scalp, healthy growth.
- 03 **Precise Retwist** — Neat, polished roots by hand (or interlock and crochet when your locs need it).
- 04 **Your Style** — Two-strand, barrel twist, plaits or a custom design.
- 05 **The Finish** — Add a precision cut from our barber and leave fully fresh.
- CTA under step 05: Book Refresh Your Crown → /book?service=refresh-full

### 5 · Signature services (frost-bg, 8 cards, real photos)
Each card: photo · name · one line · "From $X · Yh" · [Book]. Lines:
- **Refresh Your Crown** — Wash, scalp care and precise retwist. Half head (undercut) or full head.
- **Loc Repair** — Restore weak, thinning, broken or damaged locs. Starts with a 20-minute consultation.
- **Starter & Instant Locs** — Clean coils, two-strand twists, or instant locs for a mature look on day one.
- **Loc Extensions** — Premium human hair for length and fullness that blends seamlessly.
- **Wicks** — Bold, structured locs installed with crochet and palm-rolling for a strong foundation.
- **Luxe Crown Detox** — A deep cleanse that leaves locs lighter and your scalp refreshed.
- **Braid Bar** — Straight-backs, designs, twists and kids' braids by Lele.
- **Mini Loc Spa** — Gentle wash, clean parts, soft hands for young crowns (5 & under).
- Link: View the full menu →

### 6 · The Repair Lab (thesis section — dark, crown line-art draws on scroll)
- Eyebrow: — LOC REPAIR —
- **H2:** Broken, thinning, unraveling? We bring locs back.
- Body: Loc repair is what Icey is known for. Every repair is custom — matched to your loc's condition, length and what it's been through — and done with precision crochet so the fix holds.
- Four stages (pinned, the crown fills one quarter per stage):
  1. **Assess** — 20-minute consultation. We check every weak point and give you a plan and a price.
  2. **Rebuild** — Precision crochet reattaches, thickens and closes up damaged sections.
  3. **Reinforce** — Interlock or crochet maintenance locks the repair in.
  4. **Maintain** — A Refresh Your Crown schedule that keeps it strong. `[CONFIRM: recommended rebook interval, e.g. every 4–6 weeks]`
- Before/After slider ×2: `PhotoSlot "NEEDS REAL PHOTO — repair before/after (client permission)"`
- Proof quote: "If you need a Loc Repair/Retwist, done in a tranquil environment with a pleasant vibe, and very reasonable prices — look no further." — Mar
- CTA: **Book a Repair Consultation** ($20 · 20 min `[CONFIRM $20 vs $20.50]`)

### 7 · Welcome offer band (ice-bright band, midnight text)
- **H2:** New here? The Welcome Ritual.
- Body: Loc Bath & Retwist + Style for first-time clients — $160. `[CONFIRM monthly offer]`
- CTA: Claim my first visit

### 8 · Gallery (dark, masonry 4:5, filter chips: All · Locs · Styles · Braids · Kids · Barber)
- Eyebrow: — FRESH OFF THE CHAIR —
- **H2:** Real crowns. Real clients.
- Footer link: More on Instagram @iceylocs →

### 9 · Young Crowns (kids — frost-bg)
- **H2:** Soft hands for young crowns.
- Body: Little ones get the same care in a calm, private suite — gentle, kid-friendly products, clean parts and patience. Parents keep telling us the same thing: they leave smiling.
- Quote: "My son had a loc retwist with wash and detox. My son hair was neat and he could not stop smiling." — Latoya
- Chips: Mini Loc Spa (5 & under) · Kids Braids (up to 7) · Kids cuts at the Barber Spa (12 & under) · Teens (13 & up)
- CTA: Book a Mini Loc Spa

### 10 · Reviews (dark; 3-up carousel desktop, swipe mobile; emoji stripped)
- **H2:** "She understood the assignment."
- Lead quotes (featured): Livv · Angela D. Sanders · Kristina · Elaw · Maro · Lisha · Kenzo
- Badge: 5.0 · 34 reviews on GlossGenius — link "Leave a Google review" (their review URL) on /reviews only.

### 11 · Meet the team (frost-bg)
- **H2:** The hands behind the ice.
- Icey Scurry — Owner · Loctician · Loc Repair Specialist — bio `[NEEDS CLIENT CONFIRMATION]`
- Lele Scurry — Loctician · Braider — bio `[NEEDS CLIENT CONFIRMATION]`
- Shane Smith — Licensed Barber · Icey Locs Barber Spa — headshot `[NEEDS REAL PHOTO]`, bio `[NEEDS CLIENT CONFIRMATION]`
- Each card: Book with {first name} → /book?pro=icey

### 12 · Barber Spa teaser (dark, Shane's "SS" ice mark as a watermark)
- Eyebrow: — SUITE 112 —
- **H2:** The Barber Spa, next door.
- Body: Clean cuts, crisp line ups, fresh tapers. It's all about the details. (their copy)
- Price chips: Haircut $75 · Line Up from $35 · Barber Spa V.I.P $100 · Kids from $45
- CTA: Book the Barber Spa → /book?location=barber-spa

### 13 · Visit (map + details)
- **H2:** Find us at Hollywood Park.
- Address block (both suites) · Every day 9 AM – 7 PM · Call (424) 420-8193 · Get directions (Google Maps deep link)
- Line: Steps from SoFi Stadium and minutes from LAX.
- Parking: `[NEEDS CLIENT CONFIRMATION]`
- Map: static image of the location with a frost pin (no Google Maps JS on load — click-to-load embed).

### 14 · FAQ (frost-bg accordion — from `faqs`)

### 15 · Final CTA (dark, suite photo at 20%)
- **H2:** Ready to get iced?
- Sub: Pick your service, pick your time, done in under a minute.
- [Book your suite]

---

## /services
- H1: The Menu · Sub: Every service, every price, every add-on — right here, before you book.
- Location tabs: **Loc Spa (Suite 113)** · **Barber Spa (Suite 112)**
- Category sections in this order: Welcome · Refresh Your Crown · Loc Repair · Starter & Instant Locs · Loc Extensions · Wicks · Loc Spa Treatments · Braid Bar · Mini Loc Spa · Haircut add-on — then Barber Spa: V.I.P · Haircut · Line Up / Taper.
- Each service: their full description (verbatim), option table (name · price · time · deposit), add-on groups listed under "Add to it", [Book this].
- Note under every price table: "Deposit applied to your service total. Prices marked + vary by length/condition."

## /loc-repair (SEO landing — "loc repair Inglewood / Los Angeles")
Expands section 6 + FAQ on repair + 2 repair-tagged reviews + consultation booking. H1: **Loc Repair in Inglewood & Los Angeles.**

## /kids · /barber-spa · /gallery · /team · /reviews · /visit · /policies
Each reuses the home section with fuller content; H1s: "Kids' Locs & Braids in Inglewood" · "Icey Locs Barber Spa" · "The Gallery" · "Meet the Team" · "Client Love" · "Visit Icey Locs" · "Booking Policies".

## /learn (blog hub — upsell surface; 4 starter posts, outlines only, owner reviews before publish)
1. **Retwist vs. Interlock vs. Crochet: which does your loc need?** (links to Repair Consultation)
2. **What a Loc Detox actually does (and how often to get one)** (links to Luxe Crown Detox)
3. **Starter locs or instant locs? How to choose your first method** (links to Starter Locs)
4. **Booking near SoFi: your game-day loc appointment guide** `[CONFIRM parking + event-day advice]`

## /club (membership demo — upsell)
- H1: The Icey Crown Club · "Stay fresh on a schedule."
- Tiers (names only; pricing `[CONFIRM — owner sets]`): **Frost** (a refresh every 6 weeks) · **Glacier** (every 4 weeks + one detox per quarter) · **Diamond** (every 4 weeks + monthly spa add-on + priority Fridays). Diamond borrows the gem mark from their suite rug.
- Benefits copy: priority booking, locked-in pricing, member-only Freestyle style days. All demo; "Join" opens a demo modal.

## /shop (waitlist — upsell)
- H1: Icey Care — coming soon. Body: Aftercare made for your crown. Join the list for first access. (Email field → demo toast.) **No products are invented.**

## Exit-intent / capture: "Scrape the Frost" (from the agency Gamified Popup Library — scratch-off)
- Trigger: desktop exit-intent, mobile 45s + 60% scroll, once per session (memory only).
- Card: frosted-glass panel; user scrapes the frost (canvas `destination-out`, opaque brush) to reveal **this month's first-time offer** (pulled from `promos.ts` → Welcome Ritual). Then: phone or email field → "Text me the offer" (demo toast). Copy: "Scrape the frost. Your first-visit offer is underneath." Close always visible, `Esc` closes, reduced-motion = instant reveal.
