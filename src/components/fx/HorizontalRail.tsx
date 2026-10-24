"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Desktop (≥1024px): the section pins and its track slides horizontally as you scroll down.
 * Mobile/tablet and reduced motion: a native swipe rail with snap — no scroll hijacking.
 */
export function HorizontalRail({ header, children }: { header: ReactNode; children: ReactNode }) {
  const outer = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const [pin, setPin] = useState(false);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      const on = mq.matches;
      setPin(on);
      if (on && track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 96));
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!pin) {
      if (track.current) track.current.style.transform = "";
      return;
    }
    let raf = 0;
    let tid = 0;
    const apply = () => {
      raf = 0;
      const o = outer.current;
      const t = track.current;
      if (!o || !t) return;
      const r = o.getBoundingClientRect();
      const total = o.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      t.style.transform = `translate3d(${-p * dist}px,0,0)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        window.clearTimeout(tid);
        apply();
      });
      tid = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        apply();
      }, 100);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(tid);
    };
  }, [pin, dist]);

  return (
    <div ref={outer} style={pin ? { height: `calc(100vh + ${dist}px)` } : undefined} className="relative">
      <div className={pin ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
        {header}
        <div className={pin ? "mt-10" : "rail mt-10 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1240px)/2_+_3rem))]"}>
          <div ref={track} className={pin ? "flex gap-6 pl-[max(3rem,calc((100vw_-_1240px)/2_+_3rem))] pr-12 will-change-transform" : "flex gap-4"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
