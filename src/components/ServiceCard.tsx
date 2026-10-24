import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PriceToConfirm } from "@/components/ui";
import type { Service } from "@/data/services";
import { duration, minDuration, money, serviceFromLabel } from "@/lib/format";
import { serviceFocus, serviceImg } from "@/lib/images";

export function ServiceCard({ s, line, i = 0 }: { s: Service; line: string; i?: number }) {
  const deps = s.options.length ? s.options.map((o) => o.deposit) : s.deposit ? [s.deposit] : [];
  const minDep = deps.length ? Math.min(...deps) : 0;
  const depVaries = new Set(deps).size > 1;
  return (
    <article className="led-top reveal group relative flex flex-col overflow-hidden rounded-card border border-ink/10 bg-snow text-ink shadow-[0_20px_50px_-30px_rgb(11_17_30/0.5)] transition-transform duration-500 hover:-translate-y-1" style={{ ["--d" as string]: `${(i % 4) * 70}ms` }}>
      <div className="relative aspect-[16/10] overflow-hidden bg-steel sm:aspect-[4/5]">
        <Image src={serviceImg(s)} alt={`${s.displayName} at Icey Locs`} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" style={{ objectPosition: serviceFocus(s) }} />
        <span className="absolute left-3 top-3 rounded-pill bg-midnight/80 px-3 py-1 text-xs font-medium text-snow backdrop-blur">
          {serviceFromLabel(s)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold leading-tight">{s.displayName}</h3>
        <p className="mt-2 flex-1 text-[15px] text-ink-soft">{line}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Clock" className="size-4" />
            {s.options.length > 1 ? "from " : ""}
            {duration(minDuration(s))}
          </span>
          {minDep ? <span>{depVaries ? "from " : ""}{money(minDep)} deposit</span> : null}
          <PriceToConfirm tone="light" />
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Link href={`/book?service=${s.id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill bg-ink font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-snow transition hover:bg-glacier-deep">
            Book
          </Link>
          <Link href={`/services/${s.slug}`} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-glacier-deep hover:underline" aria-label={`Details: ${s.displayName}`}>
            Details <Icon name="ChevronRight" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Dark, image-led card for the horizontal Signature rail. */
export function IceServiceCard({ s, line, n }: { s: Service; line: string; n: number }) {
  return (
    <article className="group relative flex h-[min(520px,70vh)] w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-card border border-ice/10 bg-slate shadow-card lg:w-[340px]">
      <Image src={serviceImg(s)} alt={`${s.displayName} at Icey Locs`} fill sizes="340px" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-ice)] group-hover:scale-[1.06]" style={{ objectPosition: serviceFocus(s) }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_14_22/0.05)_20%,rgb(10_14_22/0.6)_55%,rgb(10_14_22/0.96)_100%)]" />
      <div className="absolute inset-x-[12%] top-0 h-px bg-[image:var(--grad-led)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute left-5 top-5 font-display text-sm font-semibold tracking-[0.2em] text-ice">{String(n).padStart(2, "0")}</span>
      <span className="absolute right-4 top-4 rounded-pill border border-ice/25 bg-midnight/70 px-3 py-1 text-xs font-medium text-snow backdrop-blur">{serviceFromLabel(s)}</span>
      <div className="relative p-6">
        <h3 className="font-display text-2xl font-bold leading-tight text-snow">{s.displayName}</h3>
        <p className="mt-2 text-[15px] text-mist">{line}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-mist">
          <Icon name="Clock" className="size-4 text-ice" />
          {s.options.length > 1 ? "from " : ""}
          {duration(minDuration(s))}
          <PriceToConfirm />
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Link href={`/book?service=${s.id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill bg-ice-bright font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-midnight transition hover:bg-snow">
            Book
          </Link>
          <Link href={`/services/${s.slug}`} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm text-ice hover:text-snow" aria-label={`Details: ${s.displayName}`}>
            Details <Icon name="ChevronRight" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
