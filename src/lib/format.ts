import type { Service } from "@/data/services";
import { fromPrice } from "@/data/services";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** $1,000 · $20.50 (keeps cents only when present) */
export function money(n: number): string {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  });
}

export function priceLabel(price: number, varies: boolean): string {
  return varies ? `From ${money(price)}` : money(price);
}

/** Card label: lowest bookable price, "From" when there are options or the price varies. */
export function serviceFromLabel(s: Service): string {
  if (s.basePrice === 0 && s.varies) return "Priced at the chair";
  const lowest = fromPrice(s);
  const isFrom = s.options.length > 1 || s.varies || s.options.some((o) => o.varies);
  return isFrom ? `From ${money(lowest)}` : money(lowest);
}

/** 105 -> "1h 45m", 45 -> "45m", 120 -> "2h" */
export function duration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function minDuration(s: Service): number {
  return s.options.length ? Math.min(...s.options.map((o) => o.durationMin)) : s.durationMin;
}

/** "19:00" -> "7 PM", "09:30" -> "9:30 AM" */
export function clock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

export const telHref = (e164: string) => `tel:${e164}`;

/** "2026-07-28" -> "July 2026" (date-only strings parsed as UTC to avoid TZ drift) */
export function monthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export const isDemo = process.env.NEXT_PUBLIC_DEMO !== "0";
