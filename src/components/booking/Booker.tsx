"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { NeedsConfirm } from "@/components/ui";
import { business, glossGeniusBookUrl, locations, policy } from "@/data/business";
import { quote, services, type LocationId, type Modifier, type Service, type StaffId } from "@/data/services";
import { team } from "@/data/team";
import { firstAvailable, LEAD_TIME_MIN, slotsFor } from "@/lib/availability";
import { busyBlocks, createBooking, setRole, useDb } from "@/lib/db";
import { cn, duration, isDemo, money, serviceFromLabel } from "@/lib/format";
import { serviceFocus, serviceImg } from "@/lib/images";
import { addDays, fmtDate, fmtTime, salonNow, weekdayOf } from "@/lib/time";

const STEPS = ["Service", "Customize", "Pro", "Time", "Details"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

const proName = (id: StaffId) => team.find((t) => t.id === id)!.name.split(" ")[0];

/** Promo modifiers obey expiry + weekday (salon timezone). `date` null = no date picked yet. */
function modifierAvailable(m: Modifier, date: string | null): boolean {
  const today = salonNow().date;
  if (m.expires && today > m.expires) return false;
  if (date && m.expires && date > m.expires) return false;
  if (date && m.onlyWeekday === "friday" && weekdayOf(date) !== 5) return false;
  return true;
}

function defaultMods(s: Service, date: string | null): string[] {
  return s.modifierGroups
    .filter((g) => g.rule === "required")
    .map((g) => {
      const avail = g.modifiers.filter((m) => modifierAvailable(m, date));
      return (avail.find((m) => m.price === 0 && /^no /i.test(m.name)) ?? avail.find((m) => m.price === 0) ?? avail[0]).id;
    });
}

function icsFile(s: Service, date: string, start: number, end: number, where: string) {
  const dt = (min: number) => `${date.replace(/-/g, "")}T${String(Math.floor(min / 60)).padStart(2, "0")}${String(min % 60).padStart(2, "0")}00`;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Icey Locs//Icey Book//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@iceylocs`,
    `DTSTART;TZID=America/Los_Angeles:${dt(start)}`,
    `DTEND;TZID=America/Los_Angeles:${dt(end)}`,
    `SUMMARY:${s.name} — Icey Locs`,
    `LOCATION:${where}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export function Booker() {
  const params = useSearchParams();
  const ready = useDb((s) => s.ready);
  const appointments = useDb((s) => s.appointments);

  const initService = services.find((s) => s.id === params.get("service")) ?? null;
  const [location, setLocation] = useState<LocationId>(initService?.location ?? (params.get("location") === "barber-spa" ? "barber-spa" : "loc-spa"));
  const [serviceId, setServiceId] = useState<string | null>(initService?.id ?? null);
  const service = services.find((s) => s.id === serviceId) ?? null;
  const [optionId, setOptionId] = useState<string | null>(() => {
    if (!initService) return null;
    const o = params.get("option");
    return initService.options.find((x) => x.id === o)?.id ?? initService.options[0]?.id ?? null;
  });
  const [modIds, setModIds] = useState<string[]>(() => {
    if (!initService) return [];
    const base = defaultMods(initService, null);
    const wanted = (params.get("mods") ?? "").split(",").filter(Boolean);
    for (const w of wanted) {
      const g = initService.modifierGroups.find((gr) => gr.modifiers.some((m) => m.id === w));
      const m = g?.modifiers.find((x) => x.id === w);
      if (!g || !m || !modifierAvailable(m, null)) continue;
      if (g.rule === "required") {
        const idx = base.findIndex((id) => g.modifiers.some((x) => x.id === id));
        if (idx >= 0) base[idx] = w;
      } else base.push(w);
    }
    return base;
  });
  const initPro = params.get("pro") as StaffId | null;
  const [pro, setPro] = useState<StaffId | "any">(initPro && team.some((t) => t.id === initPro) ? initPro : "any");
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<{ t: number; pro: StaffId } | null>(null);
  const [step, setStep] = useState<Step>(initService ? 1 : 0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "", firstVisit: false, policy: false, card: "4242 4242 4242 4242", exp: "12/28", cvc: "123" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<null | { id: string; date: string; start: number; end: number; pro: StaffId; clientId: string }>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // If a pro was deep-linked (e.g. Shane) and the location doesn't fit, follow the pro.
  useEffect(() => {
    if (initPro === "shane" && !initService) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time deep-link normalisation
      setLocation("barber-spa");
    }
  }, [initPro, initService]);

  // Move focus to the step heading on step change (keyboard + screen reader users).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  // Keep the URL shareable without re-rendering the route.
  useEffect(() => {
    const q = new URLSearchParams();
    q.set("location", location);
    if (serviceId) q.set("service", serviceId);
    if (optionId) q.set("option", optionId);
    if (modIds.length) q.set("mods", modIds.join(","));
    if (pro !== "any") q.set("pro", pro);
    window.history.replaceState(null, "", `/book?${q}`);
  }, [location, serviceId, optionId, modIds, pro]);

  const q = service ? quote(service, optionId, modIds) : null;
  const fridayOnly = modIds.includes("freestyle-friday");
  const eligiblePros = useMemo(() => (service ? service.staff : []), [service]);

  const days = useMemo(() => {
    const today = salonNow().date;
    return Array.from({ length: 21 }, (_, i) => addDays(today, i)).filter((d) => {
      if (!fridayOnly) return true;
      const m = service?.modifierGroups.flatMap((g) => g.modifiers).find((x) => x.id === "freestyle-friday");
      return m ? modifierAvailable(m, d) : true;
    });
  }, [fridayOnly, service]);

  const slots = useMemo(() => {
    if (!service || !q || !date || !ready) return [];
    const busy = busyBlocks();
    void appointments; // recompute when bookings change
    if (pro === "any") return firstAvailable({ location: service.location, date, durationMin: q.durationMin, pros: eligiblePros, busy });
    return slotsFor({ location: service.location, date, durationMin: q.durationMin, pro, busy }).map((t) => ({ t, pro }));
  }, [service, q, date, pro, eligiblePros, ready, appointments]);

  function chooseService(s: Service) {
    setServiceId(s.id);
    setOptionId(s.options[0]?.id ?? null);
    setModIds(defaultMods(s, date));
    if (pro !== "any" && !s.staff.includes(pro)) setPro("any");
    setSlot(null);
    setStep(1);
  }

  function toggleMod(groupId: string, id: string) {
    if (!service) return;
    const g = service.modifierGroups.find((x) => x.id === groupId)!;
    setSlot(null);
    if (g.rule === "required") {
      setModIds((cur) => [...cur.filter((x) => !g.modifiers.some((m) => m.id === x)), id]);
      if (id === "freestyle-friday" && date && weekdayOf(date) !== 5) setDate(null);
    } else {
      setModIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (service?.newClientsOnly && !form.firstVisit) e.firstVisit = "The Welcome Ritual is for first-time clients only.";
    if (!form.policy) e.policy = "Please accept the booking policy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function confirm() {
    if (!service || !slot || !date || !validate()) return;
    try {
      const a = createBooking({ serviceId: service.id, optionId, modIds, pro: slot.pro, date, start: slot.t, client: { name: form.name, phone: form.phone, email: form.email, firstVisit: form.firstVisit } });
      setDone({ id: a.id, date: a.date, start: a.start, end: a.end, pro: a.pro, clientId: a.clientId });
    } catch (err) {
      setErrors({ form: (err as Error).message });
      setSlot(null);
      setStep(3);
    }
  }

  const canNext = [!!service, !!service, true, !!slot, false][step];
  const loc = locations.find((l) => l.id === location)!;

  /* ---------------- Confirmation ---------------- */
  if (done && service && q) {
    const where = `${loc.streetAddress}, ${loc.suite}, ${loc.locality}, ${loc.region} ${loc.postalCode}`;
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-24">
        <span className="mx-auto grid size-16 place-items-center rounded-pill border border-ice/40 text-ice shadow-glow">
          <Icon name="Check" className="size-8" />
        </span>
        <h1 tabIndex={-1} className="mt-6 font-display text-4xl font-bold sm:text-5xl">You&apos;re booked.</h1>
        <p className="mt-3 text-lg text-mist">
          {service.name} with {proName(done.pro)} · {fmtDate(done.date, { weekday: "long", month: "long", day: "numeric" })} at {fmtTime(done.start)}
        </p>
        <div className="frost-card mx-auto mt-8 max-w-md p-6 text-left">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-mist">Total</dt><dd>{q.from ? "From " : ""}{money(q.price)}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Time</dt><dd>{duration(q.durationMin)}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Deposit paid (demo)</dt><dd>{money(q.deposit)}</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-mist">Where</dt><dd className="text-right">{where}</dd></div>
          </dl>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={icsFile(service, done.date, done.start, done.end, where)} download="icey-locs-appointment.ics" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-ice-bright px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">
            <Icon name="CalendarCheck" className="size-4" /> Add to calendar
          </a>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(where)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/30 px-6 text-snow">
            <Icon name="Navigation" className="size-4" /> Directions
          </a>
        </div>
        <p className="mt-8 text-sm text-mist">{policy.cancellations}</p>
        {isDemo ? (
          <div className="mt-10 rounded-card border border-ice/20 bg-night/60 p-5 text-left sm:p-6">
            <p className="font-display text-lg font-bold">Demo: see where this booking just landed</p>
            <p className="mt-1 text-sm text-mist">The appointment you just made is already in the portal. Tap to see it from each side.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Link href="/studio?tab=journey" onClick={() => setRole({ kind: "client", clientId: done.clientId })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/40 px-4 text-sm font-semibold text-snow hover:border-ice">
                <Icon name="User" className="size-4 text-ice" /> Client account
              </Link>
              <Link href={`/studio?as=${done.pro}&tab=calendar&day=${done.date}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/40 px-4 text-sm font-semibold text-snow hover:border-ice">
                <Icon name="Scissors" className="size-4 text-ice" /> {proName(done.pro)}&apos;s calendar
              </Link>
              <Link href={`/studio?as=owner&tab=calendar&day=${done.date}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-ice-bright px-4 font-display text-sm font-semibold uppercase tracking-[0.1em] text-midnight">
                <Icon name="LayoutDashboard" className="size-4" /> Owner dashboard
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1240px] gap-8 px-5 pb-40 pt-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-12 lg:pb-24">
      <div className="min-w-0">
        {/* Stepper */}
        <ol className="flex items-center gap-2" aria-label="Booking progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i as Step)}
                aria-current={i === step ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}${i < step ? " (done)" : ""}`}
                className={cn("flex min-h-11 min-w-11 items-center justify-center gap-2 text-left sm:justify-start text-xs font-semibold uppercase tracking-[0.14em] disabled:cursor-default", i === step ? "text-snow" : i < step ? "text-ice" : "text-mist/60")}
              >
                <span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-pill border text-xs", i < step ? "border-ice bg-ice text-midnight" : i === step ? "border-ice text-ice" : "border-steel")}>
                  {i < step ? <Icon name="Check" className="size-3.5" strokeWidth={2.5} /> : i + 1}
                </span>
                <span aria-hidden className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 ? <span className={cn("h-px flex-1", i < step ? "bg-ice" : "bg-steel")} /> : null}
            </li>
          ))}
        </ol>

        <h1 ref={headingRef} tabIndex={-1} className="mt-8 font-display text-3xl font-bold outline-none sm:text-4xl">
          {["Choose your service", "Make it yours", "Choose your pro", "Pick a time", "Your details"][step]}
        </h1>
        {errors.form ? (
          <p role="alert" className="mt-4 rounded-input border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-snow">
            {errors.form}
          </p>
        ) : null}

        {/* STEP 0 — Service */}
        {step === 0 ? (
          <div className="mt-6">
            <div className="inline-flex rounded-pill border border-ice/20 p-1" role="tablist" aria-label="Location">
              {locations.map((l) => (
                <button key={l.id} role="tab" aria-selected={location === l.id} type="button" onClick={() => setLocation(l.id)} className={cn("min-h-11 rounded-pill px-5 text-sm font-medium transition", location === l.id ? "bg-ice-bright text-midnight" : "text-mist hover:text-snow")}>
                  {l.shortName} <span className="hidden sm:inline">· {l.suite}</span>
                </button>
              ))}
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {services
                .filter((s) => s.location === location)
                .map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => chooseService(s)} className={cn("flex w-full items-center gap-4 rounded-card border p-3 text-left transition hover:border-ice/60", serviceId === s.id ? "border-ice bg-slate" : "border-steel bg-night")}>
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-input bg-steel">
                        <Image src={serviceImg(s)} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: serviceFocus(s) }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-snow">{s.name}</span>
                        <span className="text-sm text-mist">
                          {serviceFromLabel(s)} · {duration(s.options.length ? Math.min(...s.options.map((o) => o.durationMin)) : s.durationMin)}
                          {s.newClientsOnly ? " · First visit" : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {/* STEP 1 — Customize */}
        {step === 1 && service ? (
          <div className="mt-6 space-y-8">
            {service.description ? <p className="max-w-2xl text-mist">{service.description.split("\n")[0]}</p> : null}
            {service.options.length ? (
              <fieldset>
                <legend className="font-display text-lg font-semibold">Option</legend>
                <div className="mt-3 grid gap-2">
                  {service.options.map((o) => (
                    <label key={o.id} className={cn("flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-input border px-4 py-3 transition", optionId === o.id ? "border-ice bg-slate" : "border-steel hover:border-ice/50")}>
                      <span className="flex min-w-0 items-center gap-3">
                        <input type="radio" name="option" className="size-4 shrink-0 accent-[#b9cbe5]" checked={optionId === o.id} onChange={() => { setOptionId(o.id); setSlot(null); }} />
                        <span className="min-w-0">
                          <span className="block">{o.name}</span>
                          <span className="block text-sm text-mist">{duration(o.durationMin)} · {money(o.deposit)} deposit</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right font-semibold text-snow">{o.varies ? "From " : ""}{money(o.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            {service.modifierGroups.map((g) => (
              <fieldset key={g.id}>
                <legend className="font-display text-lg font-semibold">
                  {g.name} <span className="text-sm font-normal text-mist">· {g.rule === "required" ? "choose one" : "optional add-ons"}</span>
                </legend>
                {g.id === "haircut" ? <p className="mt-1 text-sm text-mist">Want a fresh cut to finish? Our barber can add one after your service.</p> : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {g.modifiers
                    .filter((m) => modifierAvailable(m, date))
                    .map((m) => {
                      const on = modIds.includes(m.id);
                      return (
                        <label key={m.id} className={cn("flex min-h-14 cursor-pointer items-start justify-between gap-3 rounded-input border px-4 py-3 transition", on ? "border-ice bg-slate" : "border-steel hover:border-ice/50")}>
                          <span className="flex items-start gap-3">
                            <input type={g.rule === "required" ? "radio" : "checkbox"} name={g.id} className="mt-1 size-4 accent-[#b9cbe5]" checked={on} onChange={() => toggleMod(g.id, m.id)} />
                            <span>
                              <span className="block">{m.name}</span>
                              {m.description ? <span className="block text-xs text-mist">{m.description.replace(/\s+/g, " ")}</span> : null}
                            </span>
                          </span>
                          <span className="whitespace-nowrap text-sm text-mist">{m.price ? `+${money(m.price)}` : "Included"}{m.addMin ? ` · +${duration(m.addMin)}` : ""}</span>
                        </label>
                      );
                    })}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}

        {/* STEP 2 — Pro */}
        {step === 2 && service ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(["any", ...eligiblePros] as const).map((id) => {
              const m = id === "any" ? null : team.find((t) => t.id === id)!;
              return (
                <button key={id} type="button" onClick={() => { setPro(id); setSlot(null); }} className={cn("flex min-h-20 items-center gap-4 rounded-card border p-4 text-left transition", pro === id ? "border-ice bg-slate" : "border-steel hover:border-ice/50")} aria-pressed={pro === id}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-pill border border-ice/30 text-ice">
                    <Icon name={id === "any" ? "Sparkles" : "User"} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{m ? m.name : "First available"}</span>
                    <span className="text-sm text-mist">{m ? `${m.role.split(" · ")[0]} · ${m.reviewCount} review${m.reviewCount === 1 ? "" : "s"}` : "Fastest way in — we'll match you with an open pro"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* STEP 3 — Time */}
        {step === 3 && service && q ? (
          <div className="mt-6">
            {fridayOnly ? <p className="mb-4 text-sm text-ice">Freestyle Friday is only on Fridays through Oct 30 — showing Fridays.</p> : null}
            <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="group" aria-label="Choose a date">
              {days.map((d) => (
                <button key={d} type="button" onClick={() => { setDate(d); setSlot(null); }} aria-pressed={date === d} className={cn("flex min-h-[72px] w-[68px] shrink-0 flex-col items-center justify-center rounded-card border text-sm transition", date === d ? "border-ice bg-ice-bright text-midnight" : "border-steel text-snow hover:border-ice/50")}>
                  <span className="text-[11px] uppercase tracking-[0.14em] opacity-80">{fmtDate(d, { weekday: "short" })}</span>
                  <span className="font-display text-xl font-bold">{fmtDate(d, { day: "numeric" })}</span>
                  <span className="text-[11px] opacity-80">{fmtDate(d, { month: "short" })}</span>
                </button>
              ))}
            </div>
            {!date ? (
              <p className="mt-6 text-mist">Pick a day to see open times.</p>
            ) : !ready ? (
              <p className="mt-6 text-mist">Loading availability…</p>
            ) : slots.length === 0 ? (
              <p className="mt-6 text-mist">No open times that day for a {duration(q.durationMin)} appointment — try another day{pro !== "any" ? " or First available" : ""}.</p>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="group" aria-label={`Open times on ${fmtDate(date)}`}>
                {slots.map((s) => (
                  <button key={s.t} type="button" onClick={() => setSlot(s)} aria-pressed={slot?.t === s.t} className={cn("min-h-12 rounded-pill border text-sm font-medium transition", slot?.t === s.t ? "border-ice bg-ice-bright text-midnight" : "border-steel text-snow hover:border-ice/60")}>
                    {fmtTime(s.t)}
                    {pro === "any" ? <span className="sr-only"> with {proName(s.pro)}</span> : null}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-mist">
              Online booking opens {LEAD_TIME_MIN / 60} hours ahead. <NeedsConfirm>Lead time</NeedsConfirm>
            </p>
          </div>
        ) : null}

        {/* STEP 4 — Details */}
        {step === 4 && service && q ? (
          <form
            className="mt-6 grid gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              confirm();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name", "text", "name"],
                  ["phone", "Mobile number", "tel", "tel"],
                  ["email", "Email", "email", "email"],
                ] as const
              ).map(([k, label, type, ac]) => (
                <div key={k} className={k === "email" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`f-${k}`} className="text-sm text-mist">{label}</label>
                  <input id={`f-${k}`} type={type} autoComplete={ac} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} className="mt-1 min-h-12 w-full rounded-input border border-steel bg-night px-4 text-snow focus:border-ice" />
                  {errors[k] ? <p id={`e-${k}`} className="mt-1 text-sm text-danger">{errors[k]}</p> : null}
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="f-notes" className="text-sm text-mist">Notes for your pro (loc length, last retwist, repair areas)</label>
              <textarea id="f-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-input border border-steel bg-night px-4 py-3 text-snow focus:border-ice" />
            </div>
            <label className="flex min-h-11 items-center gap-3">
              <input type="checkbox" className="size-5 accent-[#b9cbe5]" checked={form.firstVisit} onChange={(e) => setForm({ ...form, firstVisit: e.target.checked })} aria-describedby={errors.firstVisit ? "e-first" : undefined} />
              This is my first visit to Icey Locs
            </label>
            {errors.firstVisit ? <p id="e-first" className="-mt-3 text-sm text-danger">{errors.firstVisit}</p> : null}

            <fieldset className="frost-card p-5">
              <legend className="px-1 text-sm font-semibold">Card on file · deposit {money(q.deposit)} today</legend>
              <p className="text-xs text-mist">DEMO — no charge. Deposit is applied to your service total.</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,5.5rem)_minmax(0,4.5rem)]">
                <input aria-label="Card number (demo)" value={form.card} onChange={(e) => setForm({ ...form, card: e.target.value })} className="col-span-2 min-h-12 w-full min-w-0 rounded-input border border-steel bg-night px-3 text-snow sm:col-span-1" inputMode="numeric" autoComplete="cc-number" />
                <input aria-label="Expiry (demo)" value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} className="min-h-12 w-full min-w-0 rounded-input border border-steel bg-night px-3 text-snow" inputMode="numeric" autoComplete="cc-exp" />
                <input aria-label="CVC (demo)" value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value })} className="min-h-12 w-full min-w-0 rounded-input border border-steel bg-night px-3 text-snow" inputMode="numeric" autoComplete="cc-csc" />
              </div>
              {q.price >= 50 ? <p className="mt-3 flex items-center gap-2 text-xs text-ice"><Icon name="CreditCard" className="size-4" /> {business.payments.bnplCopy}</p> : null}
            </fieldset>

            <details className="rounded-input border border-steel p-4 text-sm">
              <summary className="flex min-h-11 cursor-pointer items-center font-semibold">Read the booking policy</summary>
              <div className="mt-3 space-y-2 text-mist">
                <p>{policy.intro}</p>
                <p><strong className="text-snow">Deposits.</strong> {policy.deposits}</p>
                <p><strong className="text-snow">Cancellations &amp; rescheduling.</strong> {policy.cancellations} {policy.lateCancellation}.</p>
              </div>
            </details>
            <label className="flex min-h-11 items-start gap-3">
              <input type="checkbox" className="mt-1 size-5 accent-[#b9cbe5]" checked={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.checked })} aria-describedby={errors.policy ? "e-policy" : undefined} />
              I agree to the deposit and 24-hour cancellation policy.
            </label>
            {errors.policy ? <p id="e-policy" className="-mt-3 text-sm text-danger">{errors.policy}</p> : null}
            <button type="submit" className="min-h-14 rounded-pill bg-ice-bright font-display font-semibold uppercase tracking-[0.12em] text-midnight shadow-glow transition hover:bg-snow">
              Confirm &amp; pay {money(q.deposit)} deposit
            </button>
          </form>
        ) : null}

        {/* Nav */}
        {step < 4 ? (
          <div className="mt-10 hidden items-center gap-3 lg:flex">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((step - 1) as Step)} className="min-h-12 rounded-pill border border-ice/30 px-6 text-snow hover:bg-ice/10">
                Back
              </button>
            ) : null}
            <button type="button" disabled={!canNext} onClick={() => setStep((step + 1) as Step)} className="min-h-12 rounded-pill bg-ice-bright px-8 font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight disabled:opacity-40">
              Continue
            </button>
          </div>
        ) : null}
        <p className="mt-10 text-sm text-mist">
          Prefer GlossGenius?{" "}
          <a href={glossGeniusBookUrl(service?.location ?? location)} target="_blank" rel="noopener noreferrer" className="text-ice underline underline-offset-4">
            Book there
          </a>
        </p>
      </div>

      {/* Running total — right rail on desktop, sticky bar on mobile */}
      <aside aria-label="Your booking" className="fixed inset-x-0 bottom-0 z-30 border-t border-ice/15 bg-night/95 p-4 backdrop-blur-md lg:sticky lg:top-28 lg:z-auto lg:self-start lg:rounded-card lg:border lg:p-6">
        <div className="hidden lg:block">
          <p className="kicker text-ice">Your booking</p>
          {service ? (
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-mist">Service</dt>
                <dd className="font-semibold">{service.name}</dd>
                {optionId ? <dd className="text-mist">{service.options.find((o) => o.id === optionId)?.name}</dd> : null}
              </div>
              {modIds.length ? (
                <div>
                  <dt className="text-mist">Add-ons</dt>
                  {service.modifierGroups.flatMap((g) => g.modifiers).filter((m) => modIds.includes(m.id)).map((m) => (
                    <dd key={m.id} className="flex justify-between gap-3">
                      <span>{m.name}</span>
                      <span className="text-mist">{m.price ? `+${money(m.price)}` : "—"}</span>
                    </dd>
                  ))}
                </div>
              ) : null}
              <div>
                <dt className="text-mist">With</dt>
                <dd>{slot ? proName(slot.pro) : pro === "any" ? "First available" : proName(pro)}</dd>
              </div>
              {date && slot ? (
                <div>
                  <dt className="text-mist">When</dt>
                  <dd>{fmtDate(date, { weekday: "long", month: "short", day: "numeric" })} · {fmtTime(slot.t)}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-mist">Where</dt>
                <dd>{loc.name}, {loc.suite}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-mist">Pick a service to start. Every price, add-on and deposit shows here as you go.</p>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 lg:mt-6 lg:border-t lg:border-steel lg:pt-5">
          <div aria-live="polite">
            <p className="font-display text-2xl font-bold leading-none">{q ? `${q.from ? "From " : ""}${money(q.price)}` : "—"}</p>
            <p className="mt-1 text-xs text-mist">{q ? `${duration(q.durationMin)} · ${money(q.deposit)} deposit today` : "Select a service"}</p>
          </div>
          {step < 4 ? (
            <div className="flex gap-2 lg:hidden">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((step - 1) as Step)} className="grid size-12 place-items-center rounded-pill border border-ice/30 text-snow" aria-label="Back">
                  <Icon name="ArrowLeft" className="size-5" />
                </button>
              ) : null}
              <button type="button" disabled={!canNext} onClick={() => setStep((step + 1) as Step)} className="min-h-12 rounded-pill bg-ice-bright px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight disabled:opacity-40">
                Continue
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
