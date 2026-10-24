import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { cn, isDemo } from "@/lib/format";

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink";
  icon?: IconName;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

/** Primary = ice-bright pill with midnight text (the one Book CTA per screen). */
export function Button({ href, children, variant = "primary", icon, className, external, ariaLabel }: BtnProps) {
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-pill px-6 py-3 font-display text-[15px] font-semibold uppercase tracking-[0.12em] transition duration-300 ease-[var(--ease-ice)]";
  const styles = {
    primary: "bg-ice-bright text-midnight shadow-glow hover:bg-snow",
    ghost: "border border-ice/30 text-snow hover:border-ice hover:bg-ice/10",
    ink: "bg-ink text-snow hover:bg-glacier-deep",
  }[variant];
  const inner = (
    <>
      {children}
      {icon ? <Icon name={icon} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" /> : null}
    </>
  );
  if (external)
    return (
      <a href={href} className={cn(base, styles, className)} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cn(base, styles, className)} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
  tone = "dark",
  align = "left",
  as: As = "h2",
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("kicker reveal", tone === "dark" ? "text-ice" : "text-glacier-deep")}>{kicker}</p>
      <As className={cn("h-section reveal mt-5 text-balance", tone === "dark" ? "text-snow" : "text-ink")} style={{ ["--d" as string]: "80ms" }}>
        {title}
      </As>
      {sub ? (
        <p className={cn("reveal mt-5 text-lg", tone === "dark" ? "text-mist" : "text-ink-soft")} style={{ ["--d" as string]: "160ms" }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/** Demo-only marker for anything the client still has to confirm. Never renders in production. */
export function NeedsConfirm({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  if (!isDemo) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-dashed px-2.5 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-[0.12em]",
        tone === "dark" ? "border-ice/40 text-ice" : "border-glacier-deep/50 text-glacier-deep",
      )}
    >
      <Icon name="Info" className="size-3.5" />
      {children}
    </span>
  );
}

/** Branded "NEEDS REAL PHOTO" slot — impossible to ship blank. */
export function PhotoSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] flex-col items-center justify-center gap-3 overflow-hidden rounded-img border border-dashed border-ice/25 bg-slate p-6 text-center",
        className,
      )}
      role="img"
      aria-label={isDemo ? label : "Photo coming soon"}
    >
      <div className="absolute inset-0 bg-[url('/images/texture/frost-1280.webp')] bg-cover bg-center opacity-25 mix-blend-screen" aria-hidden />
      <Icon name="Snowflake" className="relative size-8 text-ice" />
      {isDemo ? <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-ice">{label}</p> : null}
    </div>
  );
}

export function IcicleDivider({ className }: { className?: string }) {
  const drips = [14, 22, 10, 28, 16, 20, 12];
  return (
    <svg viewBox="0 0 140 32" className={cn("h-6 w-28 text-ice/70", className)} aria-hidden fill="none">
      <line x1="0" y1="1" x2="140" y2="1" stroke="currentColor" strokeWidth="1" />
      {drips.map((h, i) => {
        const x = 10 + i * 20;
        return <path key={i} className="drip" style={{ animationDelay: `${i * 60}ms` }} d={`M${x - 3} 1 Q${x} ${h} ${x} ${h + 2} Q${x} ${h} ${x + 3} 1`} fill="currentColor" opacity={0.85} />;
      })}
    </svg>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex text-ice", className)} aria-label="5 out of 5 stars" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </span>
  );
}

export function PriceToConfirm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  if (!isDemo) return null;
  return (
    <span className={cn("ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.14em]", tone === "dark" ? "text-mist" : "text-ink-soft")}>
      price to confirm
    </span>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}
