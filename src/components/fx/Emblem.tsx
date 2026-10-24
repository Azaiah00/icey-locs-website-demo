import Image from "next/image";
import { cn } from "@/lib/format";

export const EMBLEM = "/images/brand/icey-crown-alpha.webp";

/**
 * The Icey Locs crown emblem (her logo, rendered in ice).
 *
 * `level` 0 → 1: 0 = frozen over (frost texture clipped to the logo's own shape), 1 = clear, bright, glowing.
 * Every change is a CSS transition, so it never depends on per-frame JS, and each change of `level`
 * fires one light sweep across the ice. All overlays are clipped to the logo with its own alpha as a mask —
 * no blend modes, no transforms on the image, so nothing can ever show as a box.
 */
export function Emblem({
  level = 1,
  className,
  priority,
  idle = true,
  label = "Icey Locs — Loc Spa crown logo",
}: {
  level?: number;
  className?: string;
  priority?: boolean;
  /** Gentle float + occasional shine while visible. */
  idle?: boolean;
  label?: string;
}) {
  const t = Math.min(1, Math.max(0, level));
  return (
    <div className={cn("emblem relative", idle && "emblem-float", className)}>
      <div
        className="absolute inset-[16%] rounded-full bg-glacier blur-[70px] transition-opacity duration-[1200ms] ease-[var(--ease-ice)]"
        style={{ opacity: 0.1 + t * 0.5 }}
        aria-hidden
      />
      <div className="relative size-full">
        <Image
          unoptimized
          src={EMBLEM}
          alt={label}
          fill
          sizes="(min-width:1024px) 420px, 80vw"
          priority={priority}
          className="object-contain transition-[filter] duration-[1200ms] ease-[var(--ease-ice)]"
          style={{ filter: `brightness(${(0.6 + t * 0.5).toFixed(3)}) saturate(${(0.5 + t * 0.5).toFixed(3)})` }}
        />
        {/* Frost: the frost texture, cut to the exact shape of the logo. Fades as the repair progresses. */}
        <div
          aria-hidden
          className="emblem-mask emblem-frost absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-ice)]"
          style={{ opacity: (1 - t) * 0.92 }}
        />
        {/* Light sweep — re-keyed on every level change so each stage gets its own glint. */}
        <div key={t} aria-hidden className={cn("emblem-mask emblem-shine absolute inset-0", idle && "emblem-shine-loop")} />
      </div>
    </div>
  );
}
