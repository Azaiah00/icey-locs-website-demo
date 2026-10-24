import type { IconName } from "@/components/Icon";
import type { Role } from "@/lib/db";

/** The demo "doors" into the Icey Book portal — shared by the tour launcher, the home band and the Studio. */
export interface DemoPortal {
  key: string;
  title: string;
  who: string;
  blurb: string;
  icon: IconName;
  role: Role;
}

export const DEMO_PORTALS: DemoPortal[] = [
  {
    key: "owner",
    title: "Owner Dashboard",
    who: "Icey",
    blurb: "Every chair, every booking, revenue, deposits, clients and prices — the whole business.",
    icon: "LayoutDashboard",
    role: { kind: "owner" },
  },
  {
    key: "icey",
    title: "Stylist View",
    who: "Icey's chair",
    blurb: "Just her own day: schedule, check-out, her clients and her earnings.",
    icon: "Scissors",
    role: { kind: "stylist", pro: "icey" },
  },
  {
    key: "lele",
    title: "Stylist View",
    who: "Lele's chair",
    blurb: "Lele only sees her own calendar, clients and earnings — never the rest of the shop.",
    icon: "Scissors",
    role: { kind: "stylist", pro: "lele" },
  },
  {
    key: "shane",
    title: "Barber View",
    who: "Shane · Barber Spa",
    blurb: "The Barber Spa chair — his own appointments, clients and earnings.",
    icon: "Scissors",
    role: { kind: "stylist", pro: "shane" },
  },
  {
    key: "client",
    title: "Client Account",
    who: "What your clients see",
    blurb: "Upcoming visits, cancel or rebook, and a photo timeline of their loc journey.",
    icon: "User",
    role: { kind: "client", clientId: "c1" },
  },
];

export const portalHref = (key: string) => `/studio?as=${key}`;

export function portalByKey(key: string | null): DemoPortal | undefined {
  return DEMO_PORTALS.find((p) => p.key === key);
}

export function sameRole(a: Role, b: Role): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
