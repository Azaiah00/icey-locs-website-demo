/**
 * Promos — data-driven so they expire on their own (no stale "through October 30th" banners).
 * `active()` is evaluated in the salon's timezone (America/Los_Angeles).
 * Every promo must trace to a real published offer; `source` says where.
 */
export interface Promo {
  id: string;
  title: string;
  body: string;
  cta: { label: string; serviceId: string; optionId?: string; modifierId?: string };
  starts?: string; // ISO date, inclusive
  ends?: string; // ISO date, inclusive
  weekday?: "friday";
  newClientsOnly?: boolean;
  source: string;
  status: "live" | "confirm-monthly";
}

export const promos: Promo[] = [
  {
    id: "welcome-ritual",
    title: "New here? The Welcome Ritual.",
    body: "Loc Bath & Retwist + Style — $160 for first-time clients. Our welcome to the care, the culture and the details.",
    cta: { label: "Claim my first visit", serviceId: "welcome", optionId: "bath-retwist-style" },
    newClientsOnly: true,
    source: "GlossGenius service 'Welcome to Icey Locs - Loc Spa'; iceylocs.com: offer changes monthly",
    status: "confirm-monthly",
  },
  {
    id: "freestyle-friday",
    title: "Freestyle Friday",
    body: "Every Friday through October 30th, book a Wash + Retwist and receive a free style on us. Style is stylist choice.",
    cta: { label: "Book a Friday retwist", serviceId: "refresh-full", modifierId: "freestyle-friday" },
    ends: "2026-10-30",
    weekday: "friday",
    source: "GlossGenius modifier 'Freestyle Friday Only' (Refresh Your Crown, half + full head)",
    status: "live",
  },
];

/** Today's date in the salon's timezone as YYYY-MM-DD. */
export function salonToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(now);
}

export function activePromos(now: Date = new Date()): Promo[] {
  const today = salonToday(now);
  return promos.filter((p) => (!p.starts || today >= p.starts) && (!p.ends || today <= p.ends));
}
