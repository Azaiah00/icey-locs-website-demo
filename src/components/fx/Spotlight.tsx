"use client";

import { useEffect, useRef } from "react";

/** Cursor-following ice spotlight for a dark section (desktop, fine pointer only). */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const b = parent.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - b.left}px`);
      el.style.setProperty("--sy", `${e.clientY - b.top}px`);
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 600ms var(--ease-ice)",
        background: "radial-gradient(520px circle at var(--sx, 50%) var(--sy, 50%), rgb(185 203 229 / 0.10), transparent 60%)",
      }}
    />
  );
}
