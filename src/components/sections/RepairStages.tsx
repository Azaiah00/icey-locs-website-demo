"use client";

import { useEffect, useRef, useState } from "react";
import { Emblem } from "@/components/fx/Emblem";
import { NeedsConfirm, PhotoSlot } from "@/components/ui";
import { cn } from "@/lib/format";

const STAGES = [
  { title: "Assess", body: "A 20-minute consultation. We check every weak point and give you a plan and a price." },
  { title: "Rebuild", body: "Precision crochet reattaches, thickens and closes up damaged sections." },
  { title: "Reinforce", body: "Interlock or crochet maintenance locks the repair in." },
  { title: "Maintain", body: "A Refresh Your Crown schedule that keeps it strong." },
];

/**
 * Signature 2 — her crown starts frozen over and clears one quarter per repair stage.
 * Desktop: the crown stays pinned beside the stages; the stage crossing the middle of the screen sets the level.
 * Mobile (crown sits above the list): the crown thaws once when it scrolls into view.
 * Reduced motion: shown clear. Visual changes are CSS transitions only.
 */
export function RepairStages() {
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const crown = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(-1);
  const [wide, setWide] = useState(true);
  const [seen, setSeen] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 1024px)");
    const mqStill = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setWide(mqWide.matches);
      setStill(mqStill.matches);
    };
    sync();
    mqWide.addEventListener("change", sync);
    mqStill.addEventListener("change", sync);
    return () => {
      mqWide.removeEventListener("change", sync);
      mqStill.removeEventListener("change", sync);
    };
  }, []);

  // Which stage card has crossed the middle of the viewport, and whether the crown has been seen.
  // Plain scroll/resize listener reading rects (throttled) — works even where IntersectionObserver
  // or requestAnimationFrame are throttled (embedded previews, background tabs).
  useEffect(() => {
    let tid = 0;
    const compute = () => {
      tid = 0;
      const mid = window.innerHeight / 2;
      let s = -1;
      cards.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < mid) s = i;
      });
      setStage(s);
      const c = crown.current?.getBoundingClientRect();
      if (c && c.top < window.innerHeight * 0.75 && c.bottom > window.innerHeight * 0.2) setSeen(true);
    };
    const onScroll = () => {
      if (!tid) tid = window.setTimeout(compute, 40);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(tid);
    };
  }, []);

  const level = still ? 1 : wide ? (stage + 1) / 4 : seen ? 1 : 0;
  const active = wide ? stage : -1;

  return (
    <div className="mt-16 grid items-start gap-12 lg:grid-cols-2">
      <div className="lg:sticky lg:top-24">
        <div ref={crown}>
          <Emblem level={level} className="mx-auto aspect-square w-full max-w-[420px]" />
        </div>
        <div className="mx-auto mt-6 hidden max-w-[320px] lg:block" aria-hidden>
          <div className="flex gap-2">
            {STAGES.map((s, i) => (
              <span key={s.title} className="h-1 flex-1 overflow-hidden rounded-pill bg-steel">
                <span
                  className="block h-full origin-left bg-ice-bright transition-transform duration-700 ease-[var(--ease-ice)]"
                  style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-mist">
            {stage < 0 ? "Before repair" : stage === 3 ? "Restored" : `Stage ${stage + 1} of 4 · ${STAGES[stage].title}`}
          </p>
        </div>
      </div>
      <ol className="space-y-5">
        {STAGES.map((s, i) => (
          <li
            key={s.title}
            data-i={i}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className={cn(
              "frost-card p-6 transition-all duration-500 sm:p-8",
              active === -1 || i === active ? "opacity-100" : "opacity-55",
              i === active && "border-ice/40",
            )}
          >
            <p className="font-display text-sm font-semibold tracking-[0.2em] text-ice">0{i + 1}</p>
            <h3 className="mt-1 font-display text-3xl font-bold">{s.title}</h3>
            <p className="mt-2 text-mist">{s.body}</p>
            {i === 3 ? (
              <p className="mt-3">
                <NeedsConfirm>Recommended rebook interval</NeedsConfirm>
              </p>
            ) : null}
          </li>
        ))}
        <li className="grid grid-cols-2 gap-4">
          <PhotoSlot label="Needs real photo — repair before" className="aspect-[4/5]" />
          <PhotoSlot label="Needs real photo — repair after" className="aspect-[4/5]" />
        </li>
      </ol>
    </div>
  );
}
