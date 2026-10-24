"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

/**
 * Loc-crown line art inspired by the Icey Locs mark (locs fanning up and falling from a headband,
 * icicle drips below). Placeholder until the client's logo is vectorized (ASSETS-OWED.md).
 * Four stroke groups — left locs, right locs, headband, drips — so the Repair Lab can draw one
 * quarter per stage. Every path uses pathLength=1, so `draw` 0→1 maps straight to dashoffset.
 */
type Pt = [number, number];
const r = (n: number) => Math.round(n * 10) / 10;

function locPath(i: number, side: -1 | 1): string {
  const sx = 120 + side * (6 + i * 8);
  const sy = 104 - Math.abs(i - 3) * 1.5;
  const c1: Pt = [sx + side * (4 + i), 52 - i * 3];
  const c2: Pt = [sx + side * (34 + i * 7), 22 + i * 5];
  const e: Pt = [sx + side * (52 + i * 6), 64 + i * 7];
  const c3: Pt = [sx + side * (70 + i * 5), 118 + i * 4];
  const e2: Pt = [sx + side * (58 + i * 7), 176 + i * 7];
  return `M${r(sx)} ${r(sy)} C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(e[0])} ${r(e[1])} S${r(c3[0])} ${r(c3[1])} ${r(e2[0])} ${r(e2[1])}`;
}

const LEFT = Array.from({ length: 7 }, (_, i) => locPath(i, -1));
const RIGHT = Array.from({ length: 7 }, (_, i) => locPath(i, 1));
const BAND = ["M60 114 Q120 84 180 114", "M64 130 Q120 102 176 130", "M60 114 Q58 123 64 130", "M180 114 Q182 123 176 130"];
const DRIPS = [70, 86, 102, 120, 138, 154, 170].map((x, i) => {
  const y0 = 129 - Math.abs(x - 120) * 0.22 - (x === 120 ? 4 : 0);
  const len = [12, 20, 14, 26, 14, 20, 12][i];
  return `M${x - 3} ${r(y0)} Q${x} ${r(y0 + len)} ${x} ${r(y0 + len + 2)} Q${x} ${r(y0 + len)} ${x + 3} ${r(y0)}`;
});

export const CROWN_GROUPS = [LEFT, RIGHT, BAND, DRIPS] as const;

export function CrownArt({
  draw = [1, 1, 1, 1],
  className,
  title,
}: {
  draw?: [number, number, number, number] | number[];
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 240 240" className={cn("crown", className)} fill="none" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {CROWN_GROUPS.map((group, gi) => (
        <g
          key={gi}
          stroke="currentColor"
          strokeWidth={gi === 2 ? 2.2 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.35 + 0.65 * Math.min(1, (draw[gi] ?? 1) * 1.4) }}
        >
          {group.map((d, pi) => (
            <path
              key={pi}
              d={d}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - Math.min(1, Math.max(0, (draw[gi] ?? 1) * 1.15 - pi * 0.02))}
              fill={gi === 3 ? "currentColor" : "none"}
              fillOpacity={gi === 3 ? (draw[gi] ?? 1) * 0.5 : 0}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Draws once when scrolled into view — CSS transitions (no animation-frame dependence). */
export function CrownDrawOnView({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const v = on ? 1 : 0;
  return (
    <div ref={ref} className={className}>
      <CrownArt draw={[v, v, v, v]} className="crown-anim h-full w-full" />
    </div>
  );
}
