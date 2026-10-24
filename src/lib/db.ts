"use client";

/**
 * Demo data layer — the ONLY place the UI reads or writes booking data.
 * In-memory (module scope): a page refresh resets the demo. No localStorage by design.
 * Role scoping is enforced HERE, not just in the UI.
 * Going live = replace the bodies of these functions; the UI does not change.
 */
import { useSyncExternalStore } from "react";
import { generateAppointments, generateJourney, demoClients, type Appointment, type DemoClient, type JourneyEntry } from "@/data/mock";
import { quote, services, type PriceStatus, type StaffId } from "@/data/services";
import { reviews } from "@/data/reviews";
import type { Busy } from "@/lib/availability";

export type Role = { kind: "guest" } | { kind: "client"; clientId: string } | { kind: "stylist"; pro: StaffId } | { kind: "owner" };

interface State {
  ready: boolean;
  role: Role;
  appointments: Appointment[];
  clients: DemoClient[];
  journey: JourneyEntry[];
  priceStatus: Record<string, PriceStatus>;
  featuredReviewIds: number[];
}

let state: State = {
  ready: false,
  role: { kind: "guest" },
  appointments: [],
  clients: [],
  journey: [],
  priceStatus: {},
  featuredReviewIds: reviews.filter((r) => r.featured).map((r) => r.id),
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  emit();
};

function ensure() {
  if (state.ready || typeof window === "undefined") return;
  const appointments = generateAppointments();
  state = {
    ...state,
    ready: true,
    appointments,
    clients: demoClients,
    journey: generateJourney(appointments),
    priceStatus: Object.fromEntries(services.map((s) => [s.id, s.priceStatus])),
  };
}

const serverSnapshot = state;
export function useDb<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      ensure();
      return select(state);
    },
    () => select(serverSnapshot),
  );
}

/* ---------------- Auth (fake) ---------------- */
export const setRole = (role: Role) => set({ role });

/* ---------------- Reads (role-scoped) ---------------- */
// TODO: Supabase — replace with RLS-backed queries.
export function listAppointments(role: Role, all: Appointment[] = state.appointments): Appointment[] {
  switch (role.kind) {
    case "owner":
      return all;
    case "stylist":
      return all.filter((a) => a.pro === role.pro);
    case "client":
      return all.filter((a) => a.clientId === role.clientId);
    default:
      return [];
  }
}

export function busyBlocks(): Busy[] {
  ensure();
  return state.appointments.filter((a) => a.status === "booked" || a.status === "completed").map((a) => ({ pro: a.pro, date: a.date, start: a.start, end: a.end }));
}

export function listClients(role: Role, clients: DemoClient[] = state.clients, appointments: Appointment[] = state.appointments): DemoClient[] {
  if (role.kind === "owner") return clients;
  if (role.kind === "stylist") {
    const ids = new Set(appointments.filter((a) => a.pro === role.pro).map((a) => a.clientId));
    return clients.filter((c) => ids.has(c.id));
  }
  if (role.kind === "client") return clients.filter((c) => c.id === role.clientId);
  return [];
}

/* ---------------- Writes ---------------- */
// TODO: Supabase — insert into appointments; TODO: Stripe — PaymentIntent for the deposit.
export function createBooking(input: {
  serviceId: string;
  optionId: string | null;
  modIds: string[];
  pro: StaffId;
  date: string;
  start: number;
  client: { name: string; phone: string; email: string; firstVisit: boolean };
}): Appointment {
  ensure();
  const s = services.find((x) => x.id === input.serviceId)!;
  const q = quote(s, input.optionId, input.modIds);
  const clash = state.appointments.some((a) => a.pro === input.pro && a.date === input.date && a.status === "booked" && input.start < a.end && input.start + q.durationMin > a.start);
  if (clash) throw new Error("That time was just taken — please pick another slot.");
  let client = state.clients.find((c) => c.phone === input.client.phone || c.email.toLowerCase() === input.client.email.toLowerCase());
  if (!client) {
    client = { id: `c${state.clients.length + 1}`, name: input.client.name, phone: input.client.phone, email: input.client.email, tags: input.client.firstVisit ? ["new"] : [], firstVisit: input.date };
  }
  const appt: Appointment = {
    id: `b${Date.now()}`,
    date: input.date,
    start: input.start,
    end: input.start + q.durationMin,
    pro: input.pro,
    location: s.location,
    serviceId: s.id,
    optionId: input.optionId,
    modIds: input.modIds,
    clientId: client.id,
    price: q.price,
    deposit: q.deposit,
    tip: 0,
    status: "booked",
    source: "booked-in-demo",
  };
  set({
    appointments: [...state.appointments, appt],
    clients: state.clients.some((c) => c.id === client!.id) ? state.clients : [...state.clients, client],
  });
  return appt;
}

export function updateAppointment(role: Role, id: string, patch: Partial<Pick<Appointment, "status" | "date" | "start" | "end">>) {
  const target = state.appointments.find((a) => a.id === id);
  if (!target) return;
  const allowed = role.kind === "owner" || (role.kind === "stylist" && target.pro === role.pro) || (role.kind === "client" && target.clientId === role.clientId);
  if (!allowed) throw new Error("Not allowed");
  set({ appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
}

export function addJourneyEntry(role: Role, e: Omit<JourneyEntry, "id">) {
  if (role.kind !== "owner" && !(role.kind === "stylist" && role.pro === e.pro)) throw new Error("Not allowed");
  set({ journey: [...state.journey, { ...e, id: `j${Date.now()}` }] });
}

export function confirmPrice(role: Role, serviceId: string) {
  if (role.kind !== "owner") throw new Error("Owner only");
  set({ priceStatus: { ...state.priceStatus, [serviceId]: "confirmed" } });
}

export function toggleFeaturedReview(role: Role, id: number) {
  if (role.kind !== "owner") throw new Error("Owner only");
  const has = state.featuredReviewIds.includes(id);
  set({ featuredReviewIds: has ? state.featuredReviewIds.filter((x) => x !== id) : [...state.featuredReviewIds, id] });
}

/** Test seam. */
export const __getState = () => {
  ensure();
  return state;
};
