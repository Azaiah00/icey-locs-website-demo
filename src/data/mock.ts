/**
 * DEMO DATA — fictional clients and generated appointments so the portal feels live.
 * Every name, phone (555 exchange) and number here is fake and labelled "Demo" in the UI.
 * Service mix and staff assignments follow the real menu in services.ts.
 */
import { gallery } from "@/data/gallery";
import { quote, services, type Service, type StaffId } from "@/data/services";
import { addDays, salonNow } from "@/lib/time";

export interface DemoClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: ("repair" | "kids" | "extensions" | "member" | "barber" | "new")[];
  firstVisit: string;
}

export interface Appointment {
  id: string;
  date: string;
  start: number;
  end: number;
  pro: StaffId;
  location: Service["location"];
  serviceId: string;
  optionId: string | null;
  modIds: string[];
  clientId: string;
  price: number;
  deposit: number;
  tip: number;
  status: "booked" | "completed" | "no-show" | "cancelled";
  source: "demo" | "booked-in-demo";
}

export interface JourneyEntry {
  id: string;
  clientId: string;
  date: string;
  pro: StaffId;
  serviceId: string;
  note: string;
  photo: string | null; // gallery `file` key
}

const FIRST = ["Jordan", "Aaliyah", "Marcus", "Simone", "Darius", "Nia", "Andre", "Kayla", "Terrence", "Imani", "Jalen", "Brianna", "Malik", "Zoe", "Isaiah", "Taylor", "Devon", "Amara", "Xavier", "Jasmine", "Cam", "Naomi", "Elijah", "Raven"];
const LAST = "BWJHTMRCDLGSAPNKFVEOYQIZ";

export const demoClients: DemoClient[] = FIRST.map((n, i) => ({
  id: `c${i + 1}`,
  name: `${n} ${LAST[i]}.`,
  phone: `(424) 555-01${String(10 + i).padStart(2, "0")}`,
  email: `${n.toLowerCase()}.demo@example.com`,
  tags: [
    ...(i % 6 === 1 ? (["repair"] as const) : []),
    ...(i % 7 === 3 ? (["kids"] as const) : []),
    ...(i % 9 === 4 ? (["extensions"] as const) : []),
    ...(i % 4 === 0 ? (["member"] as const) : []),
    ...(i >= 18 ? (["barber"] as const) : []),
  ],
  firstVisit: "",
}));

/** Deterministic PRNG so the demo looks the same on every reload of the same day. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEIGHTS: Record<StaffId, [string, number][]> = {
  icey: [["refresh-full", 34], ["refresh-half", 14], ["mini-loc-spa", 8], ["repair-consult", 8], ["starter-locs", 6], ["loc-extensions", 4], ["wicks", 4], ["spa-add-ons", 6], ["welcome", 6]],
  lele: [["refresh-full", 26], ["refresh-half", 10], ["braids-twist", 22], ["mini-loc-spa", 10], ["spa-add-ons", 8], ["welcome", 6], ["repair-consult", 4]],
  shane: [["barber-haircut", 46], ["barber-lineup", 30], ["barber-vip", 16], ["haircut-addon", 4]],
};
const UTIL: Record<StaffId, number> = { icey: 0.7, lele: 0.55, shane: 0.6 };

function pick<T>(r: () => number, list: [T, number][]): T {
  const total = list.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of list) if ((x -= w) <= 0) return v;
  return list[list.length - 1][0];
}

export function generateAppointments(now: Date = new Date()): Appointment[] {
  const today = salonNow(now).date;
  const out: Appointment[] = [];
  let n = 0;
  for (let d = -21; d <= 21; d++) {
    const date = addDays(today, d);
    (["icey", "lele", "shane"] as StaffId[]).forEach((pro, pi) => {
      const r = rng(Number(date.replace(/-/g, "")) * 7 + pi * 131);
      let t = 9 * 60 + Math.floor(r() * 4) * 15;
      while (t < 18 * 60) {
        if (r() > UTIL[pro]) {
          t += 45;
          continue;
        }
        const pickedId = pick(r, WEIGHTS[pro]);
        const s = services.find((x) => x.id === pickedId)!;
        const opt = s.options.length ? s.options[Math.floor(r() * Math.min(s.options.length, 3))] : null;
        const mods = s.modifierGroups.flatMap((g) => {
          if (g.rule === "required") return [g.modifiers.find((m) => m.price === 0 && !m.expires)?.id ?? g.modifiers[0].id];
          return r() < 0.25 ? [g.modifiers[Math.floor(r() * g.modifiers.length)].id] : [];
        });
        const q = quote(s, opt?.id ?? null, mods);
        if (t + q.durationMin > 19 * 60) break;
        const clientPool = pro === "shane" ? demoClients.slice(14) : demoClients.slice(0, 20);
        const bookedToday = new Set(out.filter((x) => x.date === date).map((x) => x.clientId));
        const free = clientPool.filter((c) => !bookedToday.has(c.id));
        const pool = free.length ? free : clientPool;
        const client = pool[Math.floor(r() * pool.length)];
        const past = d < 0;
        const roll = r();
        out.push({
          id: `a${++n}`,
          date,
          start: t,
          end: t + q.durationMin,
          pro,
          location: s.location,
          serviceId: s.id,
          optionId: opt?.id ?? null,
          modIds: mods,
          clientId: client.id,
          price: q.price,
          deposit: q.deposit,
          tip: past ? Math.round(q.price * (0.15 + r() * 0.1)) : 0,
          status: past ? (roll < 0.04 ? "no-show" : "completed") : "booked",
          source: "demo",
        });
        t += q.durationMin + (r() < 0.5 ? 0 : 15);
      }
    });
  }
  return out;
}

export function generateJourney(appts: Appointment[]): JourneyEntry[] {
  const photos = gallery.filter((g) => g.tags.includes("locs"));
  const notes = [
    "Fresh retwist, roots tight. Scalp calm — keep up the hot oil at home.",
    "Repaired 6 thinning locs at the crown with crochet. Re-check in 4 weeks.",
    "Detox lifted heavy buildup. Locs noticeably lighter.",
    "Styled in two-strand. Client loved the parts — book the same next time.",
    "Interlock at the nape for a longer hold.",
  ];
  const done = appts.filter((a) => a.status === "completed" && a.location === "loc-spa");
  const entries: JourneyEntry[] = [];
  demoClients.slice(0, 8).forEach((c, i) => {
    done
      .filter((a) => a.clientId === c.id)
      .slice(-4)
      .forEach((a, k) => {
        entries.push({ id: `j${c.id}-${k}`, clientId: c.id, date: a.date, pro: a.pro, serviceId: a.serviceId, note: notes[(i + k) % notes.length], photo: photos[(i * 3 + k) % photos.length].file });
      });
  });
  return entries;
}
