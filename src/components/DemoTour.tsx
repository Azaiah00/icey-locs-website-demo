"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { DEMO_PORTALS, portalHref } from "@/lib/demoPortals";
import { cn, isDemo } from "@/lib/format";

/**
 * Floating "Demo tour" button (demo mode only) — opens a panel of big, plainly-labelled buttons
 * into each side of the booking system, so a salon owner reviewing the demo never hunts for a link.
 */
export function DemoTour() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close on navigation
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener("open-demo-tour", o);
    return () => window.removeEventListener("open-demo-tour", o);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!isDemo || pathname.startsWith("/studio")) return null;

  return (
    <div
      ref={panel}
      className={cn(
        "fixed right-3 z-40 flex flex-col items-end gap-3 md:right-6",
        // Sits above the mobile Book/Call bar; on /book the mobile price bar owns the bottom, so lift higher.
        pathname.startsWith("/book") ? "bottom-[150px] lg:bottom-6" : "bottom-[84px] md:bottom-6",
      )}
    >
      {open ? (
        <div id="demo-tour" role="dialog" aria-label="Demo tour" className="w-[min(360px,calc(100vw-24px))] rounded-card border border-ice/20 bg-night/95 p-4 shadow-card backdrop-blur-md">
          <p className="px-1 font-display text-lg font-bold">See the booking system</p>
          <p className="px-1 text-sm text-mist">Tap any view. It&apos;s all sample data — nothing is saved.</p>
          <div className="mt-3 grid gap-2">
            {DEMO_PORTALS.map((p) => (
              <Link key={p.key} href={portalHref(p.key)} className="flex min-h-14 items-center gap-3 rounded-[14px] border border-ice/15 px-3 py-2 transition hover:border-ice/50 hover:bg-ice/10">
                <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-ice/15 text-ice">
                  <Icon name={p.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-snow">{p.title}</span>
                  <span className="block truncate text-xs text-mist">{p.who}</span>
                </span>
                <Icon name="ArrowRight" className="size-4 shrink-0 text-ice" />
              </Link>
            ))}
            <Link href="/book" className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-pill bg-ice-bright font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">
              <Icon name="CalendarCheck" className="size-4" /> Try booking an appointment
            </Link>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-tour"
        aria-label={open ? "Close demo tour" : "Open demo tour"}
        className={cn("items-center justify-center gap-2 rounded-pill border border-ice/40 bg-night/90 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow shadow-card backdrop-blur-md transition hover:border-ice md:inline-flex md:min-h-12 md:px-5", open ? "inline-flex size-12 md:size-auto" : "hidden")}
      >
        <Icon name={open ? "X" : "LayoutDashboard"} className="size-5 text-ice md:size-4" />
        {/* Phones: compact round button so it never covers content; tablets and up show the label. */}
        <span aria-hidden className="hidden md:inline">{open ? "Close" : "Demo tour"}</span>
      </button>
    </div>
  );
}
