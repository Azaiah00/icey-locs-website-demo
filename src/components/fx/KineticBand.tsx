"use client";

import { useScrollProgress } from "@/components/motion";

/** Giant type that slides with scroll — two lines moving in opposite directions. */
export function KineticBand({ lines }: { lines: [string, string] }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>(1, 0);
  const shift = (p - 0.5) * 30; // vw, -15 … +15
  const word = (t: string) => Array.from({ length: 6 }, () => t).join("  ·  ");
  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden bg-midnight py-10 sm:py-16">
      {/* w-max: the line is as wide as its text, so nothing is clipped at the element's edge.
          Start offsets keep the left edge off-screen at every scroll position (no empty gap). */}
      <p className="kinetic-outline w-max whitespace-nowrap font-display text-[clamp(3.5rem,12vw,10rem)] font-extrabold uppercase leading-[0.9]" style={{ transform: `translate3d(${-20 - shift}vw,0,0)` }}>
        {word(lines[0])}
      </p>
      {/* The gradient repeats every 60vw along the whole line (bg-clip text only paints inside the element box). */}
      <p
        className="w-max whitespace-nowrap bg-clip-text font-display text-[clamp(3.5rem,12vw,10rem)] font-extrabold uppercase leading-[0.9] text-transparent"
        style={{
          transform: `translate3d(${-40 + shift}vw,0,0)`,
          backgroundImage: "linear-gradient(90deg,#b9cbe5,#f2f6fb 35%,#657f94 70%,#b9cbe5)",
          backgroundSize: "60vw 100%",
          backgroundRepeat: "repeat-x",
        }}
      >
        {word(lines[1])}
      </p>
    </div>
  );
}
