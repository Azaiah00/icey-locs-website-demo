"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * One IntersectionObserver for every `.reveal` element (re-scans on route change).
 * Fail-safe: elements are only hidden once <html> has `reveal-ready`, and if the observer
 * never reports (stalled page, old browser) everything is revealed after 1.2s.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showAll = () => document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => el.classList.add("is-in"));
    if (reduce || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    // Anything already on screen is shown immediately — no flash of hidden content on load.
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
    });
    root.classList.add("reveal-ready");
    let reported = false;
    const io = new IntersectionObserver(
      (entries) => {
        reported = true;
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    const t = window.setTimeout(() => {
      if (!reported) showAll();
    }, 1200);
    // Belt and braces: anything the visitor has already scrolled to is shown, observer or not.
    const onScroll = () =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-in");
      });
    let st = 0;
    const throttled = () => {
      if (st) return;
      st = window.setTimeout(() => {
        st = 0;
        onScroll();
      }, 250);
    };
    window.addEventListener("scroll", throttled, { passive: true });
    return () => {
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(st);
      window.removeEventListener("scroll", throttled);
    };
  }, [pathname]);
  return null;
}

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/**
 * Scroll progress (0 → 1) of an element through the viewport — rAF-throttled, passive.
 * `start`: progress 0 when element top hits this fraction of viewport height.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.85, end = 0.15) {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * (start - end);
      const done = vh * start - r.top;
      setP(Math.min(1, Math.max(0, done / total)));
    };
    let tid = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        window.clearTimeout(tid);
        calc();
      });
      // Fallback when animation frames are throttled (background/covered windows).
      tid = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        calc();
      }, 120);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(tid);
    };
  }, [start, end]);
  return [ref, p] as const;
}
