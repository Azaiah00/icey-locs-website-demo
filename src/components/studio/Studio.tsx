"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { gallery } from "@/data/gallery";
import type { Appointment } from "@/data/mock";
import { reviews, stripEmoji } from "@/data/reviews";
import { services, type StaffId } from "@/data/services";
import { team } from "@/data/team";
import { confirmPrice, listAppointments, listClients, setRole, toggleFeaturedReview, updateAppointment, useDb, type Role } from "@/lib/db";
import { cn, duration, money } from "@/lib/format";
import { DEMO_PORTALS, portalByKey, sameRole } from "@/lib/demoPortals";
import { workSrc } from "@/lib/images";
import { addDays, fmtDate, fmtTime, salonNow } from "@/lib/time";
import { policy } from "@/data/business";

const svcName = (id: string) => services.find((s) => s.id === id)?.name ?? id;
const proName = (id: StaffId) => team.find((t) => t.id === id)!.name.split(" ")[0];
const PRO_TINT: Record<StaffId, string> = { icey: "border-ice bg-ice/15", lele: "border-frost bg-frost/20", shane: "border-glacier bg-glacier/30" };

type Tab = "today" | "calendar" | "clients" | "finances" | "menu" | "reviews" | "journey";

function Stat({ label, value, icon, hint }: { label: string; value: string; icon: IconName; hint?: string }) {
  return (
    <div className="frost-card p-5">
      <div className="flex items-center justify-between text-mist">
        <p className="text-xs uppercase tracking-[0.16em]">{label}</p>
        <Icon name={icon} className="size-4 text-ice" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-mist">{hint}</p> : null}
    </div>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between text-sm">
            <span>{r.label}</span>
            <span className="text-mist">{money(r.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-pill bg-steel">
            <div className="h-2 rounded-pill bg-[linear-gradient(90deg,#2a5e87,#b9cbe5)]" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Studio() {
  const ready = useDb((s) => s.ready);
  const role = useDb((s) => s.role);
  const all = useDb((s) => s.appointments);
  const clientsAll = useDb((s) => s.clients);
  const journey = useDb((s) => s.journey);
  const priceStatus = useDb((s) => s.priceStatus);
  const featured = useDb((s) => s.featuredReviewIds);
  // Deep links: /studio?as=owner|icey|lele|shane|client opens that view; &day=YYYY-MM-DD and &tab=… focus it.
  const params = useSearchParams();
  const asPortal = portalByKey(params.get("as"));
  const paramDay = params.get("day");
  const paramTab = params.get("tab") as Tab | null;
  const [tabPick, setTab] = useState<Tab | null>(null);
  const tab: Tab = tabPick ?? paramTab ?? "today";
  const today = ready ? salonNow().date : "";
  const [day, setDay] = useState<string | null>(null);
  // Phones start on one chair (no sideways scrolling); wider screens show every chair. The calendar only
  // renders client-side (after demo data is ready), so reading the viewport here is hydration-safe.
  const [calPro, setCalPro] = useState<"all" | StaffId>(() => (typeof window !== "undefined" && window.innerWidth < 640 ? "icey" : "all"));
  const viewDay = day ?? (paramDay && /^\d{4}-\d{2}-\d{2}$/.test(paramDay) ? paramDay : today);

  const appts = useMemo(() => listAppointments(role, all), [role, all]);
  const clients = useMemo(() => listClients(role, clientsAll, all), [role, clientsAll, all]);
  const clientName = (id: string) => clientsAll.find((c) => c.id === id)?.name ?? "Client";

  const asKey = asPortal?.key;
  useEffect(() => {
    const p = portalByKey(asKey ?? null);
    if (p) setRole(p.role);
  }, [asKey]);
  const switchTo = (r: Role) => {
    setRole(r);
    setTab("today");
    setDay(null);
    const key = DEMO_PORTALS.find((p) => sameRole(p.role, r))?.key;
    if (key) window.history.replaceState(null, "", `/studio?as=${key}`);
  };

  const calCols: StaffId[] = role.kind === "owner" ? (calPro === "all" ? ["icey", "lele", "shane"] : [calPro]) : role.kind === "stylist" ? [role.pro] : [];

  const tabs: { id: Tab; label: string; icon: IconName }[] =
    role.kind === "owner"
      ? [
          { id: "today", label: "Today", icon: "LayoutDashboard" },
          { id: "calendar", label: "Calendar", icon: "Calendar" },
          { id: "clients", label: "Clients", icon: "Users" },
          { id: "finances", label: "Finances", icon: "Wallet" },
          { id: "menu", label: "Menu & prices", icon: "DollarSign" },
          { id: "reviews", label: "Reviews", icon: "Star" },
        ]
      : role.kind === "stylist"
        ? [
            { id: "today", label: "Today", icon: "LayoutDashboard" },
            { id: "calendar", label: "My calendar", icon: "Calendar" },
            { id: "clients", label: "My clients", icon: "Users" },
            { id: "finances", label: "My earnings", icon: "Wallet" },
          ]
        : [{ id: "journey", label: "My visits", icon: "Crown" }];

  const activeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  /* ---------- guest: tour start ---------- */
  // A deep link is about to set the role — don't flash the start screen.
  if (role.kind === "guest" && asPortal) return <div className="min-h-[70vh]" />;
  if (role.kind === "guest") {
    return (
      <div className="mx-auto max-w-[1040px] px-5 py-16 sm:px-8 md:py-24">
        <div className="text-center">
          <p className="kicker justify-center text-ice">Icey Book · Live demo</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Your booking system, from every side.</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">Tap a button to see exactly what each person sees. Everything here is sample data — click around freely, nothing is saved.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_PORTALS.map((p) => (
            <button key={p.key} type="button" onClick={() => switchTo(p.role)} className="frost-card group flex flex-col items-start gap-4 p-6 text-left transition hover:border-ice/50 hover:bg-ice/5">
              <span className="grid size-12 place-items-center rounded-pill bg-ice/15 text-ice">
                <Icon name={p.icon} className="size-6" />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">{p.title}</span>
                <span className="mt-0.5 block text-sm uppercase tracking-[0.16em] text-ice">{p.who}</span>
              </span>
              <span className="text-mist">{p.blurb}</span>
              <span className="mt-auto inline-flex min-h-11 items-center gap-2 rounded-pill bg-ice-bright px-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">
                Open <Icon name="ArrowRight" className="size-4" />
              </span>
            </button>
          ))}
          <Link href="/book" className="frost-card flex flex-col items-start gap-4 p-6 transition hover:border-ice/50 hover:bg-ice/5">
            <span className="grid size-12 place-items-center rounded-pill bg-ice/15 text-ice">
              <Icon name="CalendarCheck" className="size-6" />
            </span>
            <span>
              <span className="block font-display text-2xl font-bold">Book an Appointment</span>
              <span className="mt-0.5 block text-sm uppercase tracking-[0.16em] text-ice">The client booking flow</span>
            </span>
            <span className="text-mist">Pick a service, add-ons, stylist and time — with the price and deposit shown the whole way.</span>
            <span className="mt-auto inline-flex min-h-11 items-center gap-2 rounded-pill border border-ice/40 px-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow">
              Try it <Icon name="ArrowRight" className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- derived numbers ---------- */
  const todays = appts.filter((a) => a.date === viewDay && a.status !== "cancelled").sort((a, b) => a.start - b.start);
  const last30 = appts.filter((a) => a.status === "completed" && a.date >= addDays(today, -30) && a.date < today);
  const revenue30 = last30.reduce((s, a) => s + a.price, 0);
  const tips30 = last30.reduce((s, a) => s + a.tip, 0);
  const upcoming = appts.filter((a) => a.status === "booked" && a.date >= today);
  const depositsHeld = upcoming.reduce((s, a) => s + a.deposit, 0);
  const noShows = appts.filter((a) => a.status === "no-show" && a.date >= addDays(today, -30)).length;
  const byService = Object.entries(last30.reduce<Record<string, number>>((m, a) => ((m[svcName(a.serviceId)] = (m[svcName(a.serviceId)] ?? 0) + a.price), m), {}))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
  const byPro = (["icey", "lele", "shane"] as StaffId[]).map((p) => ({ label: proName(p), value: last30.filter((a) => a.pro === p).reduce((s, a) => s + a.price, 0) })).filter((r) => r.value > 0);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="kicker text-ice">Icey Book · Demo data</p>
          <h1 className="mt-3 font-display text-4xl font-bold">
            {role.kind === "owner" ? "Owner dashboard" : role.kind === "stylist" ? `${proName(role.pro)}'s chair` : "My Icey Locs"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/book" className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-ice-bright px-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">
            <Icon name="CalendarCheck" className="size-4" /> Try booking
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-ice/30 px-5 text-sm text-snow hover:border-ice">
            <Icon name="ArrowLeft" className="size-4" /> Back to website
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-card border border-ice/15 bg-night/60 p-3">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-mist">Switch view — see what each person sees</p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Switch demo view">
          {DEMO_PORTALS.map((p) => {
            const on = sameRole(p.role, role);
            return (
              <button key={p.key} type="button" onClick={() => switchTo(p.role)} aria-pressed={on} className={cn("inline-flex min-h-12 items-center gap-2 rounded-[14px] px-3 py-1.5 text-left text-sm leading-tight transition last:col-span-2 sm:min-h-11 sm:rounded-pill sm:px-4 sm:last:col-span-1", on ? "bg-ice-bright font-semibold text-midnight" : "border border-ice/25 text-snow hover:border-ice")}>
                <Icon name={p.icon} className="size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block sm:inline">{p.title}</span>
                  <span className={cn("block text-xs sm:inline sm:text-sm", on ? "text-midnight/70" : "text-mist")}><span className="hidden sm:inline"> · </span>{p.who}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-steel pb-3" aria-label="Portal sections">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={activeTab === t.id ? "page" : undefined} className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill px-4 text-sm transition", activeTab === t.id ? "bg-ice-bright text-midnight" : "text-mist hover:text-snow")}>
            <Icon name={t.icon} className="size-4" />
            {t.label}
          </button>
        ))}
      </nav>

      {!ready ? <p className="mt-10 text-mist">Loading demo data…</p> : null}

      {/* ---------- TODAY ---------- */}
      {ready && activeTab === "today" ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Today" value={String(appts.filter((a) => a.date === today && a.status === "booked").length)} icon="CalendarCheck" hint="appointments booked" />
            <Stat label={role.kind === "owner" ? "Revenue · 30 days" : "My services · 30 days"} value={money(revenue30)} icon="TrendingUp" hint="completed services" />
            <Stat label="Deposits held" value={money(depositsHeld)} icon="Lock" hint={`${upcoming.length} upcoming appointments`} />
            <Stat label="No-shows · 30 days" value={String(noShows)} icon="Info" hint={`deposit kept per ${policy.cancellationWindowHours}h policy`} />
          </div>
          <div className="frost-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold">{fmtDate(today, { weekday: "long", month: "long", day: "numeric" })}</h2>
              <Link href="/book" className="inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-pill border border-ice/30 px-4 text-sm text-snow hover:border-ice"><Icon name="Plus" className="size-4" /> New booking</Link>
            </div>
            <ul className="mt-4 divide-y divide-steel">
              {appts
                .filter((a) => a.date === today && a.status !== "cancelled")
                .sort((a, b) => a.start - b.start)
                .map((a) => (
                  <ApptRow key={a.id} a={a} role={role} clientName={clientName(a.clientId)} />
                ))}
              {appts.filter((a) => a.date === today).length === 0 ? <li className="py-4 text-mist">Nothing on the books today.</li> : null}
            </ul>
          </div>
        </div>
      ) : null}

      {/* ---------- CALENDAR ---------- */}
      {ready && activeTab === "calendar" ? (
        <div className="mt-8">
          <div className="rail flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 14 }, (_, i) => addDays(today, i - 3)).map((d) => (
              <button key={d} type="button" onClick={() => setDay(d)} className={cn("flex min-h-16 w-16 shrink-0 flex-col items-center justify-center rounded-card border text-sm", viewDay === d ? "border-ice bg-ice-bright text-midnight" : "border-steel")}>
                <span className="text-[11px] uppercase">{fmtDate(d, { weekday: "short" })}</span>
                <span className="font-display text-lg font-bold">{fmtDate(d, { day: "numeric" })}</span>
              </button>
            ))}
          </div>
          {role.kind === "owner" ? (
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Show chairs">
              {(["all", "icey", "lele", "shane"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setCalPro(k)} aria-pressed={calPro === k} className={cn("min-h-11 rounded-pill px-4 text-sm transition", calPro === k ? "bg-ice-bright font-semibold text-midnight" : "border border-ice/25 text-snow hover:border-ice")}>
                  {k === "all" ? "All chairs" : proName(k)}
                </button>
              ))}
            </div>
          ) : null}
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Day calendar">
            <div className={cn("grid gap-3", calCols.length > 1 && "min-w-[600px]")} style={{ gridTemplateColumns: `68px repeat(${calCols.length}, minmax(0,1fr))` }}>
              <div />
              {calCols.map((p) => (
                <p key={p} className="text-center text-sm font-semibold">{proName(p)}</p>
              ))}
              <div className="relative" style={{ height: 600 }}>
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i} className="absolute right-2 -translate-y-2 text-xs text-mist" style={{ top: (i * 60 * 600) / 600 }}>
                    {fmtTime((9 + i) * 60)}
                  </span>
                ))}
              </div>
              {calCols.map((p) => (
                <div key={p} className="relative rounded-card border border-steel bg-night" style={{ height: 600 }}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} className="absolute inset-x-0 border-t border-steel/60" style={{ top: (i + 1) * 60 }} />
                  ))}
                  {todays
                    .filter((a) => a.pro === p)
                    .map((a) => (
                      <div key={a.id} className={cn("absolute inset-x-1 overflow-hidden rounded-input border-l-2 px-2 py-1 text-xs", PRO_TINT[p], a.source === "booked-in-demo" && "ring-1 ring-ice")} style={{ top: a.start - 540, height: Math.max(22, a.end - a.start - 2) }}>
                        <p className="truncate font-semibold">{fmtTime(a.start)} · {clientName(a.clientId)}</p>
                        <p className="truncate text-mist">{svcName(a.serviceId)}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------- CLIENTS ---------- */}
      {ready && activeTab === "clients" ? (
        <div className="mt-8">
          {/* Phones/tablets: client cards. Large screens: full table. */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {clients.map((c) => {
              const mine = appts.filter((a) => a.clientId === c.id);
              const past = mine.filter((a) => a.status === "completed");
              const next = mine.filter((a) => a.status === "booked" && a.date >= today).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))[0];
              return (
                <li key={c.id} className="frost-card p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-mist">{c.phone}</p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block font-semibold">{money(past.reduce((sum, a) => sum + a.price, 0))}</span>
                      <span className="text-xs text-mist">{past.length} visit{past.length === 1 ? "" : "s"}</span>
                    </p>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="uppercase tracking-[0.14em] text-mist">Last visit</dt><dd className="mt-0.5 text-sm">{past.length ? fmtDate(past[past.length - 1].date) : "—"}</dd></div>
                    <div><dt className="uppercase tracking-[0.14em] text-mist">Next</dt><dd className="mt-0.5 text-sm">{next ? `${fmtDate(next.date)} · ${fmtTime(next.start)}` : <span className="text-ice">Rebook nudge</span>}</dd></div>
                  </dl>
                  {c.tags.length ? (
                    <p className="mt-3 flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-pill bg-steel px-2 py-0.5 text-xs">{t}</span>
                      ))}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <table className="hidden w-full text-left text-sm lg:table">
            <thead className="text-xs uppercase tracking-[0.14em] text-mist">
              <tr>
                <th className="py-2">Client (demo)</th>
                <th>Visits</th>
                <th>Lifetime</th>
                <th>Last visit</th>
                <th>Next</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel">
              {clients.map((c) => {
                const mine = appts.filter((a) => a.clientId === c.id);
                const past = mine.filter((a) => a.status === "completed");
                const next = mine.filter((a) => a.status === "booked" && a.date >= today).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))[0];
                return (
                  <tr key={c.id}>
                    <td className="py-3">
                      <span className="block font-semibold">{c.name}</span>
                      <span className="text-mist">{c.phone}</span>
                    </td>
                    <td>{past.length}</td>
                    <td>{money(past.reduce((s, a) => s + a.price, 0))}</td>
                    <td>{past.length ? fmtDate(past[past.length - 1].date) : "—"}</td>
                    <td>{next ? `${fmtDate(next.date)} · ${fmtTime(next.start)}` : <span className="text-ice">Rebook nudge</span>}</td>
                    <td>
                      <span className="flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <span key={t} className="rounded-pill bg-steel px-2 py-0.5 text-xs">{t}</span>
                        ))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* ---------- FINANCES ---------- */}
      {ready && activeTab === "finances" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <Stat label="Services · 30 days" value={money(revenue30)} icon="DollarSign" />
            <Stat label="Tips · 30 days" value={money(tips30)} icon="Heart" />
            <Stat label="Avg ticket" value={money(last30.length ? Math.round(revenue30 / last30.length) : 0)} icon="TrendingUp" />
            <Stat label="Deposits held" value={money(depositsHeld)} icon="Lock" />
          </div>
          <div className="frost-card p-6">
            <h2 className="font-display text-xl font-bold">Revenue by service · 30 days</h2>
            <div className="mt-5">
              <Bars rows={byService} />
            </div>
          </div>
          {role.kind === "owner" ? (
            <div className="frost-card p-6">
              <h2 className="font-display text-xl font-bold">Revenue by pro · 30 days</h2>
              <div className="mt-5">
                <Bars rows={byPro} />
              </div>
              <p className="mt-6 text-xs text-mist">All figures are generated demo data derived from mock appointments.</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- MENU & PRICES ---------- */}
      {ready && activeTab === "menu" && role.kind === "owner" ? (
        <div className="mt-8 space-y-3">
          <p className="text-mist">Every price was copied from GlossGenius. Confirm each one to remove the &ldquo;price to confirm&rdquo; badge on the live site.</p>
          {services.map((s) => (
            <div key={s.id} className="frost-card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-mist">
                  {s.options.length ? s.options.map((o) => `${o.name.trim()} ${money(o.price)}`).join(" · ") : money(s.basePrice)}
                </p>
                {s.confirmNotes?.length ? <p className="mt-1 text-xs text-ice">{s.confirmNotes[0]}</p> : null}
              </div>
              {priceStatus[s.id] === "confirmed" ? (
                <span className="inline-flex items-center gap-1 text-sm text-ice"><Icon name="Check" className="size-4" /> Confirmed</span>
              ) : (
                <button type="button" onClick={() => confirmPrice(role, s.id)} className="min-h-11 shrink-0 rounded-pill border border-ice/40 px-4 text-sm hover:bg-ice/10">
                  Confirm price
                </button>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* ---------- REVIEWS ---------- */}
      {ready && activeTab === "reviews" && role.kind === "owner" ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.filter((r) => r.text).map((r) => (
            <li key={r.id} className="frost-card p-5">
              <p className="text-sm">{stripEmoji(r.text)}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-mist">
                <span>{r.name} · with {proName(r.stylist)}</span>
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" className="size-4 accent-[#b9cbe5]" checked={featured.includes(r.id)} onChange={() => toggleFeaturedReview(role, r.id)} />
                  Feature
                </label>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {/* ---------- CLIENT: My visits + Crown Journey ---------- */}
      {ready && activeTab === "journey" && role.kind === "client" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="font-display text-2xl font-bold">Crown Journey</h2>
            <p className="mt-1 text-mist">Every visit, photo and note from your pro — shared with the salon.</p>
            <ol className="mt-6 space-y-5 border-l border-steel pl-6">
              {journey
                .filter((j) => j.clientId === role.clientId)
                .slice()
                .reverse()
                .map((j) => {
                  const g = gallery.find((x) => x.file === j.photo);
                  return (
                    <li key={j.id} className="relative">
                      <span className="absolute -left-[31px] top-1 size-3 rounded-pill bg-ice" />
                      <div className="frost-card flex gap-4 p-4">
                        {g ? (
                          <span className="relative size-20 shrink-0 overflow-hidden rounded-input bg-steel">
                            <Image src={workSrc(g)} alt={g.alt} fill sizes="80px" className="object-cover" />
                          </span>
                        ) : null}
                        <div>
                          <p className="text-sm text-mist">{fmtDate(j.date, { month: "long", day: "numeric", year: "numeric" })} · with {proName(j.pro)}</p>
                          <p className="font-semibold">{svcName(j.serviceId)}</p>
                          <p className="mt-1 text-sm text-mist">{j.note}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </div>
          <div className="space-y-4">
            <div className="frost-card p-5">
              <p className="kicker text-ice">Crown Club</p>
              <p className="mt-2 font-display text-2xl font-bold">Glacier member</p>
              <p className="text-sm text-mist">2 visits to Diamond · demo tier, pricing set by the salon</p>
              <div className="mt-3 h-2 rounded-pill bg-steel"><div className="h-2 w-2/3 rounded-pill bg-[linear-gradient(90deg,#2a5e87,#b9cbe5)]" /></div>
            </div>
            <div className="frost-card p-5">
              <p className="font-semibold">Upcoming</p>
              <ul className="mt-2 space-y-2 text-sm">
                {appts.filter((a) => a.status === "booked" && a.date >= today).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span>{svcName(a.serviceId)} · {fmtDate(a.date)} {fmtTime(a.start)}</span>
                    <button type="button" className="min-h-11 shrink-0 rounded-pill border border-ice/30 px-4 text-ice hover:border-ice" onClick={() => updateAppointment(role, a.id, { status: "cancelled" })}>Cancel</button>
                  </li>
                ))}
                {appts.filter((a) => a.status === "booked" && a.date >= today).length === 0 ? <li className="text-mist">Nothing booked yet.</li> : null}
              </ul>
              <p className="mt-3 text-xs text-mist">{policy.cancellations} {policy.lateCancellation}.</p>
              <Link href="/book" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-pill bg-ice-bright font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">Rebook</Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ApptRow({ a, role, clientName }: { a: Appointment; role: Role; clientName: string }) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">
          {fmtTime(a.start)} – {fmtTime(a.end)} · {clientName}
          {a.source === "booked-in-demo" ? <span className="ml-2 rounded-pill bg-ice px-2 py-0.5 text-[11px] font-semibold uppercase text-midnight">New</span> : null}
        </p>
        <p className="text-sm text-mist">
          {svcName(a.serviceId)} · {duration(a.end - a.start)} · with {proName(a.pro)} · {money(a.price)} ({money(a.deposit)} dep.)
        </p>
      </div>
      {a.status === "booked" ? (
        <div className="flex gap-2">
          <button type="button" onClick={() => updateAppointment(role, a.id, { status: "completed" })} className="min-h-11 rounded-pill border border-ice/30 px-4 text-sm hover:bg-ice/10">Check out</button>
          <button type="button" onClick={() => updateAppointment(role, a.id, { status: "no-show" })} className="min-h-11 rounded-pill px-3 text-sm text-mist hover:text-snow">No-show</button>
        </div>
      ) : (
        <span className="text-sm capitalize text-mist">{a.status.replace("-", " ")}</span>
      )}
    </li>
  );
}
