/**
 * Availability engine (demo). Hours come from business.ts (daily 9:00–19:00, salon timezone).
 * 15-minute grid · the whole service (incl. add-ons) must finish by close · no overlap per pro ·
 * no past slots · lead time below (NEEDS CLIENT CONFIRMATION).
 */
import { locations } from "@/data/business";
import type { LocationId, StaffId } from "@/data/services";
import { DAY_KEYS, salonNow, toMin, weekdayOf } from "@/lib/time";

export const LEAD_TIME_MIN = 120; // CONFIRM with owner
export const GRID_MIN = 15;

export interface Busy {
  pro: StaffId;
  date: string;
  start: number;
  end: number;
}

export function hoursFor(location: LocationId, date: string): { open: number; close: number } | null {
  const loc = locations.find((l) => l.id === location)!;
  const h = loc.hours.find((x) => x.day === DAY_KEYS[weekdayOf(date)]);
  return h ? { open: toMin(h.open), close: toMin(h.close) } : null;
}

export function slotsFor(opts: {
  location: LocationId;
  date: string;
  durationMin: number;
  pro: StaffId;
  busy: Busy[];
  now?: Date;
}): number[] {
  const h = hoursFor(opts.location, opts.date);
  if (!h) return [];
  const { date: today, minutes } = salonNow(opts.now);
  if (opts.date < today) return [];
  const earliest = opts.date === today ? minutes + LEAD_TIME_MIN : h.open;
  const taken = opts.busy.filter((b) => b.pro === opts.pro && b.date === opts.date);
  const out: number[] = [];
  for (let t = h.open; t + opts.durationMin <= h.close; t += GRID_MIN) {
    if (t < earliest) continue;
    const end = t + opts.durationMin;
    if (taken.some((b) => t < b.end && end > b.start)) continue;
    out.push(t);
  }
  return out;
}

/** "First available": earliest pro per slot time. */
export function firstAvailable(opts: { location: LocationId; date: string; durationMin: number; pros: StaffId[]; busy: Busy[]; now?: Date }) {
  const map = new Map<number, StaffId>();
  for (const pro of opts.pros) {
    for (const t of slotsFor({ ...opts, pro })) if (!map.has(t)) map.set(t, pro);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([t, pro]) => ({ t, pro }));
}
