"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { activePromos, type Promo } from "@/data/promos";
import { locations } from "@/data/business";
import { cn, isDemo, telHref } from "@/lib/format";

/** Phones open the demo tour from the action bar / menu instead of a floating button (no overlap with content). */
export const openDemoTour = () => window.dispatchEvent(new Event("open-demo-tour"));

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/loc-repair", label: "Loc Repair" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Team" },
  { href: "/barber-spa", label: "Barber Spa" },
  { href: "/visit", label: "Visit" },
];

function Wordmark() {
  return (
    <span className="flex items-center gap-2 min-[380px]:gap-2.5">
      <span className="relative size-9 shrink-0 min-[380px]:size-11" aria-hidden>
        <Image unoptimized src="/images/brand/icey-crown-alpha-256.webp" alt="" fill sizes="44px" className="object-contain" priority />
      </span>
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="font-display text-[18px] font-extrabold uppercase tracking-[0.04em] text-snow min-[380px]:text-[22px]">Icey Locs</span>
        <span className="mt-1 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ice min-[380px]:tracking-[0.36em]">— Loc Spa —</span>
      </span>
    </span>
  );
}

/** Announcement bar — evaluated on the client so an expired promo never ships in static HTML. */
function PromoBar() {
  const pathname = usePathname();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const live = activePromos().filter((p) => p.status === "live");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time-dependent, must run on the client
    setPromo(live[0] ?? null);
  }, []);
  if (!promo || closed || pathname.startsWith("/studio")) return null;
  const q = new URLSearchParams({ service: promo.cta.serviceId, ...(promo.cta.modifierId ? { mods: promo.cta.modifierId } : {}) });
  return (
    <div className="relative z-50 bg-ice-bright text-midnight">
      <div className="mx-auto flex max-w-[1240px] items-center justify-center gap-3 px-12 py-2 text-center text-[13px] font-medium">
        <Icon name="Sparkles" className="hidden size-4 shrink-0 sm:block" />
        <p>
          <strong className="font-semibold">{promo.title}</strong>
          <span className="hidden md:inline"> — {promo.body}</span>{" "}
          <Link href={`/book?${q}`} className="whitespace-nowrap underline underline-offset-4 hover:no-underline">
            {promo.cta.label}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-pill hover:bg-midnight/10"
          aria-label="Dismiss announcement"
        >
          <Icon name="X" className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = locations[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the sheet on navigation
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || pathname !== "/" || open;

  return (
    <>
      <PromoBar />
      <header
        className={cn(
          "sticky top-0 z-40 transition-colors duration-500",
          solid ? "bg-midnight/85 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-pill focus:bg-ice-bright focus:px-4 focus:py-2 focus:text-midnight">
          Skip to content
        </a>
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-3 px-4 min-[380px]:px-5 sm:gap-6 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Icey Locs — Loc Spa, home" className="inline-flex min-h-11 shrink-0 items-center">
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      "relative py-2 text-[14px] font-medium tracking-wide text-mist transition-colors hover:text-snow",
                      pathname.startsWith(n.href) && "text-snow after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-[image:var(--grad-led)]",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={telHref(loc.phoneE164)} className="hidden min-h-11 items-center gap-2 px-3 text-sm text-mist hover:text-snow md:inline-flex">
              <Icon name="Phone" className="size-4" />
              {loc.phoneDisplay}
            </a>
            <Link
              href="/book"
              className="inline-flex min-h-11 items-center rounded-pill bg-ice-bright px-5 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-midnight transition hover:bg-snow"
            >
              Book
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-pill text-snow hover:bg-ice/10 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "X" : "Menu"} className="size-6" />
            </button>
          </div>
        </div>
        <div className={cn("led-line transition-opacity duration-500", solid ? "opacity-100" : "opacity-0")} />
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-midnight/97 pb-10 pt-[96px] transition-[opacity,visibility] duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="mx-auto max-w-[1240px] px-6">
          <ul className="space-y-1">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/reviews", label: "Reviews" }].map((n, i) => (
              <li key={n.href} style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }} className={cn("transition-all duration-500", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
                <Link href={n.href} tabIndex={open ? 0 : -1} className="flex min-h-12 items-center justify-between border-b border-steel py-3 font-display text-2xl font-bold uppercase tracking-tight text-snow min-[400px]:text-3xl [@media(min-height:740px)]:py-4">
                  {n.label}
                  <Icon name="ArrowRight" className="size-5 text-ice" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/book" tabIndex={open ? 0 : -1} className="inline-flex min-h-12 items-center justify-center rounded-pill bg-ice-bright font-display font-semibold uppercase tracking-[0.12em] text-midnight">
              Book your suite
            </Link>
            <a href={telHref(loc.phoneE164)} tabIndex={open ? 0 : -1} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/30 text-snow">
              <Icon name="Phone" className="size-4" /> Call {loc.phoneDisplay}
            </a>
            {isDemo ? (
              <button type="button" tabIndex={open ? 0 : -1} onClick={() => { setOpen(false); openDemoTour(); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/30 text-snow">
                <Icon name="LayoutDashboard" className="size-4 text-ice" /> Demo tour
              </button>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}

/** Sticky mobile action bar — appears once the visitor has scrolled past the first screen. */
export function MobileBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const loc = locations[0];
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (pathname.startsWith("/book") || pathname.startsWith("/studio")) return null;
  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-pill border border-ice/15 bg-night/90 p-1.5 shadow-card backdrop-blur-md transition-all duration-500 md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <Link href="/book" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-ice-bright font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-midnight">
        <Icon name="CalendarCheck" className="size-4" /> Book
      </Link>
      <a href={telHref(loc.phoneE164)} className="flex min-h-12 items-center justify-center gap-2 rounded-pill px-4 text-snow" aria-label={`Call ${loc.phoneDisplay}`}>
        <Icon name="Phone" className="size-4" /> Call
      </a>
      {isDemo ? (
        <button type="button" onClick={openDemoTour} className="flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/30 px-4 text-snow" aria-label="Open demo tour">
          <Icon name="LayoutDashboard" className="size-4 text-ice" /> Demo
        </button>
      ) : null}
    </div>
  );
}
