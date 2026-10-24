/**
 * Icey Locs — verified business facts.
 * Source of truth: the salon's own GlossGenius booking site (iceylocs.glossgenius.com,
 * page data pulled 2026-10-23), cross-checked against iceylocs.com, Google Business
 * Profile, Yelp and Instagram. Conflicts are listed in docs/FACTS.md and ASSETS-OWED.md.
 * Never edit a value here without the client's confirmation.
 */

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface OpeningHours {
  day: DayKey;
  open: string; // 24h "HH:MM"
  close: string; // 24h "HH:MM"
}

export interface Location {
  id: "loc-spa" | "barber-spa";
  name: string;
  shortName: string;
  streetAddress: string;
  suite: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  hours: OpeningHours[];
  /** GlossGenius location token — deep-links straight into their live booking flow. */
  glossGeniusToken: string;
  instagram?: string;
}

const DAILY_9_TO_7: OpeningHours[] = (
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as DayKey[]
).map((day) => ({ day, open: "09:00", close: "19:00" }));

export const business = {
  name: "Icey Locs",
  brandLockup: "Icey Locs — Loc Spa",
  legalNameStatus: "CONFIRM" as const, // legal entity name not published anywhere
  owner: "Icey Scurry",
  ownerInstagram: "icey.xo",
  instagram: "iceylocs",
  facebookId: "108545098431616",
  timezone: "America/Los_Angeles",
  neighborhood: "Hollywood Park",
  landmark: "Hollywood Park Shops — steps from SoFi Stadium",
  serviceArea: ["Inglewood", "Los Angeles", "Hollywood Park", "Westchester", "LAX area"],
  geo: { latitude: 33.9473745, longitude: -118.3415405 },
  /** Their live booking site — keep as the fallback/"book on GlossGenius" escape hatch. */
  glossGeniusUrl: "https://iceylocs.glossgenius.com",
  googleReviewUrl: "https://share.google/4ILDKhZlexRZqFsfs",
  currentWebsite: "https://iceylocs.com",
  payments: {
    bnpl: true,
    bnplCopy: "Buy Now, Pay Later available for $50–$4,000 bookings. Get approved before your appointment.",
  },
  ratings: {
    // Display-only social proof. NEVER emit as aggregateRating/Review JSON-LD (self-serving / third-party).
    glossGenius: { value: 5.0, count: 34, asOf: "2026-10-23" },
    google: { value: 5.0, count: 20, asOf: "2026-10-23" },
  },
} as const;

export const locations: Location[] = [
  {
    id: "loc-spa",
    name: "Icey Locs — Loc Spa",
    shortName: "Loc Spa",
    streetAddress: "1237 District Dr",
    suite: "Suite 113",
    locality: "Inglewood",
    region: "CA",
    postalCode: "90301", // GlossGenius + Yelp + MapQuest. Google profile shows 90303 — see FACTS.md
    country: "US",
    phoneDisplay: "(424) 420-8193",
    phoneE164: "+14244208193",
    email: "iceylocs1@gmail.com",
    hours: DAILY_9_TO_7,
    glossGeniusToken: "1003d-fbeb2026-913a-4254-b84a-dec43022cbd4",
    instagram: "iceylocs",
  },
  {
    id: "barber-spa",
    name: "Icey Locs Barber Spa",
    shortName: "Barber Spa",
    streetAddress: "1237 District Drive",
    suite: "Suite 112",
    locality: "Inglewood",
    region: "CA",
    postalCode: "90301",
    country: "US",
    phoneDisplay: "(424) 420-8193",
    phoneE164: "+14244208193",
    email: "iceylocs1@gmail.com",
    hours: DAILY_9_TO_7,
    glossGeniusToken: "1003d-e9d74d16-d993-4d1c-afb4-20accfec5c6b",
    instagram: "iLbarberspa",
  },
];

export const policy = {
  source: "GlossGenius cancellation policy, verbatim",
  intro:
    "At Icey Locs Suites, your appointment time is reserved exclusively for you. To maintain a smooth and professional experience for all clients, the following policy applies:",
  deposits:
    "All appointments require a non-refundable deposit to secure your booking. This deposit will be applied toward your service total.",
  cancellations: "We require at least 24 hours notice to cancel or reschedule your appointment.",
  lateCancellation: "Cancellations made less than 24 hours in advance will result in the loss of your deposit",
  cancellationWindowHours: 24,
  cancellationFeeUsd: 0,
} as const;

export const glossGeniusBookUrl = (locationId: Location["id"]) => {
  const loc = locations.find((l) => l.id === locationId)!;
  return `${business.glossGeniusUrl}/services?location_token=${loc.glossGeniusToken}`;
};
