"use client";

import { useEffect, useRef } from "react";

/**
 * Drifting ice dust — a light canvas particle field (max 70 flakes, DPR-capped, paused off-screen
 * and when the tab is hidden). Pure decoration: aria-hidden, disabled for reduced motion.
 */
export function IceDust({ density = 60, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const count = window.innerWidth < 768 ? Math.round(density * 0.5) : density;
    const flakes = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, s: 0.08 + Math.random() * 0.25, d: Math.random() * Math.PI * 2, a: 0.25 + Math.random() * 0.55 }));
    const size = () => {
      const b = c.getBoundingClientRect();
      w = b.width;
      h = b.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    let visible = true;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.d += 0.01 * dt;
        f.y += (f.s * dt) / 100;
        f.x += (Math.sin(f.d) * 0.15 * dt) / 100;
        if (f.y > 1.02) {
          f.y = -0.02;
          f.x = Math.random();
        }
        const g = ctx.createRadialGradient(f.x * w, f.y * h, 0, f.x * w, f.y * h, f.r * 3);
        g.addColorStop(0, `rgba(220,232,246,${f.a})`);
        g.addColorStop(1, "rgba(185,203,229,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x * w, f.y * h, f.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(c);
    window.addEventListener("resize", size);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [density]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
