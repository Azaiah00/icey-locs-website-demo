/**
 * Icey Locs — full service menu, VERBATIM from the live GlossGenius booking data (2026-10-23).
 * Names, descriptions, prices, durations, deposits, options and add-on groups are copied exactly.
 * Every price ships with priceStatus "published-unconfirmed" until the owner signs off in the
 * owner portal (renders a small "price to confirm" badge in demo mode).
 * `varies: true` means GlossGenius shows the price with a "+" (render as "From $X").
 */

export type StaffId = "icey" | "lele" | "shane";
export type LocationId = "loc-spa" | "barber-spa";
export type PriceStatus = "published-unconfirmed" | "confirmed";

export interface ServiceOption {
  id: string;
  name: string;
  price: number; // USD
  varies: boolean;
  durationMin: number;
  deposit: number; // USD, applied to service total
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  addMin: number;
  description?: string;
  /** ISO date (inclusive, salon timezone). Promo auto-hides after this date. */
  expires?: string;
  /** Only bookable on this weekday (salon timezone). */
  onlyWeekday?: "friday";
}

export interface ModifierGroup {
  id: string;
  name: string;
  rule: "required" | "optional";
  modifiers: Modifier[];
}

export interface Service {
  id: string;
  slug: string;
  location: LocationId;
  category: "welcome" | "retwist" | "kids" | "starter" | "braids" | "wicks" | "extensions" | "repair" | "spa" | "cut" | "barber";
  name: string;
  /** Display name we use on the marketing site; booking always shows `name`. */
  displayName: string;
  description: string | null;
  basePrice: number;
  varies: boolean;
  durationMin: number;
  deposit: number | null;
  newClientsOnly?: boolean;
  options: ServiceOption[];
  modifierGroups: ModifierGroup[];
  staff: StaffId[];
  glossGeniusImage: string;
  /** Gallery photo (file number, e.g. "06") to show instead of the GlossGenius service image when that one doesn't show the hair well. */
  photo?: string;
  /** CSS object-position for crops, so the hair stays in frame. Default "50% 30%". */
  imageFocus?: string;
  priceStatus: PriceStatus;
  /** Internal notes for the owner-confirmation checklist. Never rendered publicly. */
  confirmNotes?: string[];
}

const FREESTYLE_FRIDAY: Modifier = {
  id: "freestyle-friday",
  name: "Freestyle Friday Only",
  price: 0,
  addMin: 30,
  description:
    "Every Friday through October 30th, book a Wash + Retwist & receive a FREE STYLE on us!  Style is Stylist Choice.",
  expires: "2026-10-30",
  onlyWeekday: "friday",
};

const LOC_SPA_GROUP: ModifierGroup = {
  id: "loc-spa",
  name: "Loc Spa",
  rule: "optional",
  modifiers: [
    { id: "detox", name: "Detox", price: 80, addMin: 45 },
    { id: "hot-oil", name: "Hot Oil Treatment", price: 20, addMin: 20 },
    { id: "deep-condition", name: "Deep Condition", price: 10, addMin: 10 },
  ],
};

const HAIRCUT_GROUP: ModifierGroup = {
  id: "haircut",
  name: "Haircut",
  rule: "required",
  modifiers: [
    { id: "haircut-request", name: "Haircut Request", price: 0, addMin: 0 },
    { id: "no-haircut", name: "No Haircut", price: 0, addMin: 0 },
  ],
};

const BARBER_ADDONS: ModifierGroup = {
  id: "barber-add-ons",
  name: "Barber Add Ons",
  rule: "optional",
  modifiers: [
    { id: "beard-grooming", name: "Beard Grooming", price: 10, addMin: 15 },
    { id: "wash", name: "Wash", price: 15, addMin: 10 },
  ],
};

const GG = "https://static.glossgenius.com/public/service/";

export const services: Service[] = [
  {
    id: "welcome",
    slug: "welcome-to-icey-locs-loc-spa",
    location: "loc-spa",
    category: "welcome",
    name: "Welcome to Icey Locs - Loc Spa",
    displayName: "The Welcome Ritual",
    description:
      "New clients receive a welcome deal created to introduce you to our care, our culture, and our attention to detail.” (First Time Clients Only)",
    basePrice: 160,
    varies: false,
    durationMin: 120,
    deposit: 10,
    newClientsOnly: true,
    options: [{ id: "bath-retwist-style", name: "Loc Bath & Retwist + Style", price: 160, varies: false, durationMin: 120, deposit: 10 }],
    modifierGroups: [HAIRCUT_GROUP],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "1a122c777be0dc197a51f4508bc9a288da56e681/image/7b9ed4ad3884edb1aa7d94b1bd934f53.jpg",
    photo: "17", // her GG image is the logo; show the full-service result instead
    priceStatus: "published-unconfirmed",
    confirmNotes: [
      "Description has a stray closing quote mark after 'detail.' on GlossGenius — fix on their side or let us clean it up.",
      "Google Business post (Jun 3, 2026) advertises 'New Client Deal – $100 Wash & Retwist'. GlossGenius shows $160. Which is current?",
      "Site promo says the first-time offer changes every month — confirm this month's offer.",
    ],
  },
  {
    id: "refresh-half",
    slug: "refresh-your-crown-half-head",
    location: "loc-spa",
    category: "retwist",
    name: "Refresh Your Crown (Half Head)",
    displayName: "Refresh Your Crown — Half Head",
    description:
      "Luxury shampoo cleanse, scalp care, and precise retwist of existing half head of locs (undercut) to restore neatness, promote healthy growth, and maintain a clean, polished look. Additional adds on available.\n\nDeposit required to book. Deposit is applied to your service total.",
    basePrice: 120,
    varies: false,
    durationMin: 75,
    deposit: 10,
    options: [
      { id: "up-to-shoulder", name: "Up To Shoulder Length", price: 120, varies: false, durationMin: 75, deposit: 10 },
      { id: "past-shoulder", name: "Pass Shoulder Length", price: 140, varies: false, durationMin: 90, deposit: 10 },
      { id: "interlock", name: "Interlock", price: 160, varies: true, durationMin: 120, deposit: 10 },
      { id: "crochet-maintenance", name: "Crochet Maintenance", price: 250, varies: true, durationMin: 150, deposit: 25 },
    ],
    modifierGroups: [
      {
        id: "styles-half",
        name: "Styles (Half Head)",
        rule: "required",
        modifiers: [
          { id: "no-style", name: "No Style", price: 0, addMin: 0 },
          { id: "two-strand", name: "2 Strand", price: 30, addMin: 30 },
          { id: "barrel-twist", name: "Barrel Twist", price: 25, addMin: 30 },
          { id: "plaits", name: "Plaits", price: 30, addMin: 30 },
          { id: "custom-style", name: "Custom Style", price: 40, addMin: 30 },
          FREESTYLE_FRIDAY,
        ],
      },
      LOC_SPA_GROUP,
      HAIRCUT_GROUP,
    ],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "8247ecb711b2f14d2c50505e0521697caa58a7d9/image/d1218e86b5e521386014f5bca0acb5f5.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["Option label reads 'Pass Shoulder Length' on GlossGenius — display as 'Past Shoulder Length'? (booking keeps their label until confirmed)."],
  },
  {
    id: "refresh-full",
    slug: "refresh-your-crown-full-head",
    location: "loc-spa",
    category: "retwist",
    name: "Refresh Your Crown (Full Head)",
    displayName: "Refresh Your Crown — Full Head",
    description:
      "Luxury shampoo cleanse, scalp care, and precise retwist of existing full head of locs to restore neatness, promote healthy growth, and maintain a clean, polished look. Additional adds on available.\n\nDeposit required to book. Deposit is applied to your service total.",
    basePrice: 140,
    varies: false,
    durationMin: 90,
    deposit: 20,
    options: [
      { id: "up-to-shoulder", name: "Up To Shoulder Length", price: 140, varies: false, durationMin: 90, deposit: 20 },
      { id: "past-shoulder", name: "Pass Shoulder Length", price: 160, varies: false, durationMin: 90, deposit: 20 },
      { id: "midback", name: "Midback", price: 180, varies: false, durationMin: 105, deposit: 20 },
      { id: "waist", name: "Waist Length", price: 200, varies: false, durationMin: 120, deposit: 20 },
      { id: "interlock", name: "Interlock", price: 200, varies: true, durationMin: 150, deposit: 20 },
      { id: "crochet-maintenance", name: "Crochet Maintenance", price: 350, varies: true, durationMin: 210, deposit: 25 },
    ],
    modifierGroups: [
      {
        id: "styles",
        name: "Styles",
        rule: "required",
        modifiers: [
          { id: "no-style", name: "No Style", price: 0, addMin: 0 },
          { id: "two-strand-twist", name: "2 Strand Twist", price: 40, addMin: 30 },
          { id: "barrel-twist", name: "Barrel Twist", price: 30, addMin: 30 },
          { id: "plaits", name: "Plaits", price: 45, addMin: 30 },
          { id: "custom-style", name: "Custom Style", price: 50, addMin: 40 },
          FREESTYLE_FRIDAY,
        ],
      },
      LOC_SPA_GROUP,
      HAIRCUT_GROUP,
    ],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "42d168fa0b8f0040e120c376ed72456cd7ce023c/image/00663ff551fac35fb586d4ced40bd75f.jpg",
    photo: "06", // full-head retwist, overhead — her GG image is a face shot with the hair up
    priceStatus: "published-unconfirmed",
    confirmNotes: ["'Up To Shoulder' and 'Pass Shoulder Length' are both 90 min — intended?"],
  },
  {
    id: "mini-loc-spa",
    slug: "mini-loc-spa",
    location: "loc-spa",
    category: "kids",
    name: "Mini Loc Spa (5yrs & Under)",
    displayName: "Mini Loc Spa — 5 & Under",
    description: "Gentle wash with kid-friendly products.\nClean parts. Soft hands for all young crowns.",
    basePrice: 160,
    varies: false,
    durationMin: 120,
    deposit: 20,
    options: [
      { id: "starter-locs", name: "Starter Locs", price: 160, varies: false, durationMin: 120, deposit: 20 },
      { id: "bubble-bath-retwist", name: "Loc Bubble Bath & Retwist", price: 100, varies: false, durationMin: 90, deposit: 10 },
      { id: "bubble-bath-retwist-style", name: "Loc Bubble Bath & Retwist + Style", price: 125, varies: false, durationMin: 105, deposit: 10 },
    ],
    modifierGroups: [HAIRCUT_GROUP],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "0a413c685b461443bacf0c4a4ef0adf97772f500/image/a2951d026e85cd4e04c9bbbb4afb7b0d.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["GlossGenius description ends with a crown emoji — removed per our no-emoji rule; a Lucide Crown icon carries the same idea."],
  },
  {
    id: "starter-locs",
    slug: "starter-locs",
    location: "loc-spa",
    category: "starter",
    name: "Starter Locs",
    displayName: "Starter & Instant Locs",
    description:
      "Starter locs tailored to your journey—choose from clean coils, defined two-strand twists, or instant locs for an immediate, mature look. Each method is crafted to match your hair type, lifestyle, and desired loc aesthetic.\nDeposit required to book. Deposit is applied to your service total.",
    basePrice: 220,
    varies: true,
    durationMin: 120,
    deposit: 20,
    options: [
      { id: "starter-half", name: "Starter Locs (Half Head)", price: 220, varies: true, durationMin: 120, deposit: 20 },
      { id: "starter-full", name: "Starter Locs (Full Head)", price: 300, varies: true, durationMin: 150, deposit: 20 },
      { id: "instant-half", name: "Instant Locs (Half Head)", price: 450, varies: true, durationMin: 240, deposit: 50 },
      { id: "instant-full", name: "Instant Locs (Full Head)", price: 800, varies: true, durationMin: 360, deposit: 100 },
    ],
    modifierGroups: [
      {
        id: "starter-methods",
        name: "Starter Locs Methods",
        rule: "optional",
        modifiers: [{ id: "two-strand-starter", name: "2 Strand Starter Locs", price: 60, addMin: 30 }],
      },
      HAIRCUT_GROUP,
    ],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "aa44e6516dc9e10e0e7c6421b61fb606d474f83f/image/3e551b4fa7342def138d612b1f85e55d.jpg",
    priceStatus: "published-unconfirmed",
  },
  {
    id: "braids-twist",
    slug: "natural-braids-and-twist",
    location: "loc-spa",
    category: "braids",
    name: "Natural Braids & Twist",
    displayName: "Braid Bar — Natural Braids & Twist",
    description:
      "Revamp your style with our exclusive Mens Braids service, offering intricate and trendy braided designs tailored to enhance your individual look and make a bold fashion statement.",
    basePrice: 100,
    varies: true,
    durationMin: 120,
    deposit: 10,
    options: [
      { id: "kids-braids", name: "Kids Braids ( Up To 7yrs )", price: 100, varies: true, durationMin: 120, deposit: 10 },
      { id: "two-braids", name: "2 Braids", price: 80, varies: false, durationMin: 90, deposit: 10 },
      { id: "four-braids", name: "4 Braids", price: 100, varies: false, durationMin: 90, deposit: 10 },
      { id: "six-braids", name: "6 Braids", price: 120, varies: false, durationMin: 90, deposit: 10 },
      { id: "seven-plus", name: "7 Or More Braids", price: 150, varies: true, durationMin: 120, deposit: 10 },
      { id: "twist", name: "Twist", price: 150, varies: true, durationMin: 120, deposit: 10 },
    ],
    modifierGroups: [LOC_SPA_GROUP, HAIRCUT_GROUP],
    staff: ["lele"],
    glossGeniusImage: GG + "809cdda8eea983f363bbe7b2c40e608ee1672350/image/20034cd113f314822f4c4e2ddac5bd03.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["Description says 'Mens Braids' but the menu also lists Kids Braids and Twist — OK to broaden the copy?"],
  },
  {
    id: "haircut-addon",
    slug: "haircut-add-on",
    location: "loc-spa",
    category: "cut",
    name: "Haircut",
    displayName: "Haircut (add-on after a loc or braid service)",
    description: "Haircut add on after loc or braid service.",
    basePrice: 0,
    varies: true,
    durationMin: 45,
    deposit: null,
    options: [],
    modifierGroups: [],
    staff: ["shane"],
    glossGeniusImage: GG + "72d90edce3a2c8ad3878fb45189d604ade6353e6/image/f6b7f6e512ed3fac7982f0a3ea4a4f78.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["Listed at $0+ on GlossGenius. What should the site show — 'Priced at chair' or the Barber Spa haircut price ($75)?"],
  },
  {
    id: "wicks",
    slug: "wicks",
    location: "loc-spa",
    category: "wicks",
    name: "Wicks",
    displayName: "Wicks",
    description:
      "Wicks are a bold loc style created by combining sections of hair into thick, structured locs for a strong, statement look. This service includes a thorough cleanse, precise sectioning, and professional wick installation using crochet and palm-rolling techniques to ensure durability and a neat foundation. Ideal for clients wanting a low-maintenance yet powerful loc style.",
    basePrice: 250,
    varies: false,
    durationMin: 150,
    deposit: 50,
    options: [
      { id: "wick-maintenance", name: "Wick Maintenance", price: 250, varies: false, durationMin: 150, deposit: 50 },
      { id: "starter-wicks-half", name: "Starter Wicks (Half Head)", price: 450, varies: true, durationMin: 240, deposit: 50 },
      { id: "starter-wicks-full", name: "Starter Wicks (Full Head)", price: 750, varies: true, durationMin: 360, deposit: 100 },
    ],
    modifierGroups: [LOC_SPA_GROUP, HAIRCUT_GROUP],
    staff: ["icey"],
    glossGeniusImage: GG + "155a787fa46752faf5d05102aa094100c75f623f/image/5955ead68a6d55ff13c3e3e4ccc5339e.jpg",
    imageFocus: "50% 15%",
    priceStatus: "published-unconfirmed",
  },
  {
    id: "loc-extensions",
    slug: "loc-extensions",
    location: "loc-spa",
    category: "extensions",
    name: "Loc Extensions",
    displayName: "Loc Extensions",
    description:
      "This loc extension service is designed to enhance the length and fullness of your locs using premium human hair for a seamless, natural finish. Each extension is carefully installed to blend effortlessly with your natural hair, creating long-lasting, healthy-looking locs customized to your desired style. This deposit secures your loc extension appointment and will be applied to your total service cost.",
    basePrice: 550,
    varies: true,
    durationMin: 240,
    deposit: 50,
    options: [
      { id: "half-head", name: "Half Head", price: 550, varies: true, durationMin: 240, deposit: 50 },
      { id: "full-head", name: "Full Head", price: 1000, varies: true, durationMin: 360, deposit: 100 },
    ],
    modifierGroups: [LOC_SPA_GROUP, HAIRCUT_GROUP],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "225dad92f2d943effc48e1b7a1d3817de4d513be/image/2dcdeae306d931d6c6dd497ea20e33d5.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["Is hair included in the price? Which hair (texture/length options)?"],
  },
  {
    id: "repair-consult",
    slug: "loc-repair-consultation",
    location: "loc-spa",
    category: "repair",
    name: "Loc Repair Consultation",
    displayName: "Loc Repair Consultation",
    description:
      "Restore weak, thinning, broken, or damaged locs with customized repair techniques designed to strengthen and maintain the integrity of your crown. Price varies based on loc condition, length, and repair needed.",
    basePrice: 20.5,
    varies: false,
    durationMin: 20,
    deposit: 20,
    options: [],
    modifierGroups: [],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "6ed34c1f7f6f702dfe1380d2497d44474456f22c/image/f73576171823e1781281c98fd227641f.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: [
      "GlossGenius stores $20.50 with a $20.00 deposit (the public menu rounds it to '$21'). Should it be $20?",
      "Is the consult fee credited toward the repair service?",
    ],
  },
  {
    id: "spa-add-ons",
    slug: "loc-spa-add-ons",
    location: "loc-spa",
    category: "spa",
    name: "Loc Spa - Add ons",
    displayName: "Loc Spa Treatments",
    description:
      "Relax and elevate your loc care experience with luxury treatments designed to cleanse, hydrate, and nourish your scalp and locs. Our spa add-ons help promote healthier, softer, refreshed locs while giving you the ultimate self-care experience.",
    basePrice: 80,
    varies: false,
    durationMin: 45,
    deposit: 10,
    options: [
      { id: "luxe-crown-detox", name: "Luxe Crown Detox", price: 80, varies: false, durationMin: 45, deposit: 10 },
      { id: "deep-cond-hot-oil", name: "Deep Cond. & Hot Oil Treatment", price: 35, varies: false, durationMin: 30, deposit: 10 },
      { id: "loc-trim", name: "Loc Trim", price: 40, varies: false, durationMin: 20, deposit: 10 },
    ],
    modifierGroups: [],
    staff: ["icey", "lele"],
    glossGeniusImage: GG + "7008c8572033dfc583e8a9d690400374175cd480/image/f3605778f54cf6b0fd2449a61922b769.jpg",
    priceStatus: "published-unconfirmed",
  },
  // ---------------- Icey Locs Barber Spa (Suite 112) ----------------
  {
    id: "barber-vip",
    slug: "barber-spa-vip",
    location: "barber-spa",
    category: "barber",
    name: "Barber Spa V.i.p",
    displayName: "Barber Spa V.I.P",
    description: null,
    basePrice: 100,
    varies: false,
    durationMin: 80,
    deposit: 10,
    options: [],
    modifierGroups: [],
    staff: ["shane"],
    glossGeniusImage: GG + "58126ae5c5fe2d9246216fc93dd911afe1fcd58b/image/c6eeaa715dac20c5137f7cf87c11fff5.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: [
      "No description published. What is included in the V.I.P (hot towel? wash? beard?) — we will write it once confirmed.",
      "Barber Spa services are assigned to Shane in the demo (he is the listed barber) — confirm no other barbers take bookings.",
    ],
  },
  {
    id: "barber-haircut",
    slug: "barber-haircut",
    location: "barber-spa",
    category: "barber",
    name: "Haircut",
    displayName: "Haircut",
    description: null,
    basePrice: 75,
    varies: false,
    durationMin: 45,
    deposit: 5,
    options: [
      { id: "haircut", name: "Haircut", price: 75, varies: false, durationMin: 45, deposit: 5 },
      { id: "teen", name: "Teenagers (13 & Up)", price: 55, varies: false, durationMin: 45, deposit: 5 },
      { id: "little-kids", name: "Little Kids (12 & Under)", price: 45, varies: false, durationMin: 45, deposit: 5 },
    ],
    modifierGroups: [BARBER_ADDONS],
    staff: ["shane"],
    glossGeniusImage: GG + "dff4d9f958970327d7d718e819a5e7a53060760a/image/376ee07fe04c5cb448f3d33b83485f5e.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["Public menu shows 'From $45' (lowest option) — the adult cut is $75."],
  },
  {
    id: "barber-lineup",
    slug: "line-up-taper",
    location: "barber-spa",
    category: "barber",
    name: "Line Up / Taper",
    displayName: "Line Up / Taper",
    description: null,
    basePrice: 35,
    varies: false,
    durationMin: 30,
    deposit: 5,
    options: [
      { id: "line-up-only", name: "Line Up Only (No Shave No Taper)", price: 35, varies: false, durationMin: 30, deposit: 5 },
      { id: "front", name: "Front (Taper & Line Up)", price: 55, varies: false, durationMin: 10, deposit: 5 },
      { id: "taper", name: "Taper (Front & Back)", price: 65, varies: false, durationMin: 45, deposit: 5 },
    ],
    modifierGroups: [BARBER_ADDONS],
    staff: ["shane"],
    glossGeniusImage: GG + "641528e1480bda4ac31f2d68f56cf87c686f4165/image/a50422e1b838052d2dd1513c36782280.jpg",
    priceStatus: "published-unconfirmed",
    confirmNotes: ["'Front (Taper & Line Up)' is set to 10 min while Line Up Only is 30 min — likely a typo on GlossGenius (30 min?)."],
  },
];

/** Price + duration for a full selection — used by the booker's always-visible running total. */
export function quote(
  service: Service,
  optionId: string | null,
  modifierIds: string[],
): { price: number; from: boolean; durationMin: number; deposit: number } {
  const opt = service.options.find((o) => o.id === optionId) ?? null;
  const mods = service.modifierGroups.flatMap((g) => g.modifiers).filter((m) => modifierIds.includes(m.id));
  const base = opt ? opt.price : service.basePrice;
  const dur = opt ? opt.durationMin : service.durationMin;
  return {
    price: base + mods.reduce((s, m) => s + m.price, 0),
    from: opt ? opt.varies : service.varies,
    durationMin: dur + mods.reduce((s, m) => s + m.addMin, 0),
    deposit: opt ? opt.deposit : service.deposit ?? 0,
  };
}

/** Lowest bookable price for menu cards ("From $X"). */
export function fromPrice(service: Service): number {
  return service.options.length ? Math.min(...service.options.map((o) => o.price)) : service.basePrice;
}
