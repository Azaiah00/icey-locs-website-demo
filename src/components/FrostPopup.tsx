"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { activePromos, type Promo } from "@/data/promos";
import { cn } from "@/lib/format";

/**
 * "Scrape the Frost" — scratch-off capture (agency Gamified Popup Library).
 * Desktop: exit intent. Mobile: 45s on site + 60% scroll. Once per page-session (memory only).
 * Reveals the live first-time-client offer from promos.ts — never an invented discount.
 */
let shownThisSession = false;

export function FrostPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sent, setSent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const blocked = pathname.startsWith("/book") || pathname.startsWith("/studio") || pathname.startsWith("/account");

  const trigger = useCallback(() => {
    if (shownThisSession || blocked) return;
    const welcome = activePromos().find((p) => p.newClientsOnly);
    if (!welcome) return;
    shownThisSession = true;
    lastFocus.current = document.activeElement as HTMLElement;
    setPromo(welcome);
    setOpen(true);
  }, [blocked]);

  // Triggers
  useEffect(() => {
    if (blocked || shownThisSession) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      const onOut = (e: MouseEvent) => {
        if (!e.relatedTarget && e.clientY <= 4) trigger();
      };
      const arm = window.setTimeout(() => document.addEventListener("mouseout", onOut), 6000);
      return () => {
        window.clearTimeout(arm);
        document.removeEventListener("mouseout", onOut);
      };
    }
    const started = Date.now();
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (Date.now() - started > 45000 && depth > 0.6) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blocked, trigger]);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Esc + focus trap
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    node?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && node) {
        const f = Array.from(node.querySelectorAll<HTMLElement>("button, a[href], input, canvas[tabindex]")).filter((x) => !x.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Paint the frost
  useEffect(() => {
    if (!open || revealed) return;
    const c = canvasRef.current;
    if (!c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced motion skips the game
      setRevealed(true);
      return;
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = c.getBoundingClientRect();
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#dce8f6");
    g.addColorStop(0.5, "#b9cbe5");
    g.addColorStop(1, "#9aa6b8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    // frost grain
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }
    ctx.fillStyle = "#1f4b6e";
    ctx.font = "600 13px var(--font-archivo), system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRAPE THE FROST", width / 2, height / 2 + 4);

    let drawing = false;
    let moves = 0;
    const brush = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000000"; // opaque — destination-out erases by brush alpha (LESSONS.md)
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      moves++;
      if (moves % 8 === 0) check();
    };
    const check = () => {
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
      if (clear / (data.length / 64) > 0.55) setRevealed(true);
    };
    const pos = (e: PointerEvent) => {
      const b = c.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top] as const;
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      c.setPointerCapture(e.pointerId);
      brush(...pos(e));
    };
    const move = (e: PointerEvent) => drawing && brush(...pos(e));
    const up = () => (drawing = false);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, [open, revealed]);

  if (!open || !promo) return null;
  const href = `/book?${new URLSearchParams({ service: promo.cta.serviceId, ...(promo.cta.optionId ? { option: promo.cta.optionId } : {}) })}`;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-midnight/80 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="frost-title" className="frost-card relative w-full max-w-md overflow-hidden p-7 sm:p-9">
        <button type="button" onClick={close} className="absolute right-3 top-3 grid size-11 place-items-center rounded-pill text-mist hover:bg-ice/10 hover:text-snow" aria-label="Close">
          <Icon name="X" className="size-5" />
        </button>
        <p className="kicker text-ice">Before you go</p>
        <h2 id="frost-title" className="mt-3 font-display text-3xl font-bold leading-tight">
          Scrape the frost.
        </h2>
        <p className="mt-2 text-mist">Your first-visit offer is underneath.</p>

        <div className="relative mt-6 overflow-hidden rounded-card border border-ice/20 bg-night">
          <div className="p-6 text-center" aria-live="polite">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice">{promo.title}</p>
            <p className="mt-2 text-snow">{promo.body}</p>
          </div>
          {!revealed ? (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 size-full cursor-grab touch-none"
              aria-label="Frost layer — drag to scrape, or use the reveal button"
            />
          ) : null}
        </div>

        {!revealed ? (
          <button type="button" data-autofocus onClick={() => setRevealed(true)} className="mt-4 w-full text-center text-sm text-mist underline underline-offset-4 hover:text-snow">
            Reveal without scraping
          </button>
        ) : sent ? (
          <p className="mt-6 flex items-center gap-2 text-ice" role="status">
            <Icon name="Check" className="size-5" /> Sent — check your messages. (Demo)
          </p>
        ) : (
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="frost-contact" className="text-sm text-mist">
              Text or email me the offer
            </label>
            <input id="frost-contact" required data-autofocus placeholder="Phone or email" className="min-h-12 w-full rounded-input border border-ice/20 bg-midnight px-4 text-snow placeholder:text-mist/70 focus:border-ice" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="submit" className="min-h-12 flex-1 rounded-pill border border-ice/30 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow hover:bg-ice/10">
                Send it
              </button>
              <Link href={href} onClick={close} className={cn("inline-flex min-h-12 flex-1 items-center justify-center rounded-pill bg-ice-bright font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight")}>
                {promo.cta.label}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
