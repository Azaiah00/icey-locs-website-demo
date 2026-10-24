import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { NeedsConfirm, PriceToConfirm } from "@/components/ui";
import type { Service } from "@/data/services";
import { team } from "@/data/team";
import { duration, money, priceLabel, serviceFromLabel } from "@/lib/format";
import { serviceFocus, serviceImg } from "@/lib/images";

const pros = (s: Service) => s.staff.map((id) => team.find((t) => t.id === id)!.name.split(" ")[0]).join(" or ");

/** Full, verbatim menu entry: description, every option (price · time · deposit) and add-on groups. */
export function MenuService({ s, headingLevel = "h3" }: { s: Service; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <article id={s.slug} className="reveal scroll-mt-28 overflow-hidden rounded-card border border-ink/10 bg-snow text-ink">
      <div className="grid lg:grid-cols-[280px_1fr] lg:items-start">
        {/* Square on desktop so her square portfolio photo shows whole — never a narrow strip through a face. */}
        <div className="relative aspect-[4/3] overflow-hidden bg-steel sm:aspect-[16/9] lg:m-6 lg:mr-0 lg:aspect-square lg:rounded-[18px]">
          <Image src={serviceImg(s)} alt={`${s.displayName} at Icey Locs`} fill sizes="(min-width:1024px) 280px, 100vw" className="object-cover" style={{ objectPosition: serviceFocus(s) }} />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <H className="font-display text-2xl font-bold leading-tight sm:text-3xl">{s.name}</H>
              <p className="mt-1 text-sm text-ink-soft">
                With {pros(s)} · {serviceFromLabel(s)}
                {s.newClientsOnly ? " · First-time clients only" : ""}
                <PriceToConfirm tone="light" />
              </p>
            </div>
            <Link
              href={`/book?service=${s.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-snow hover:bg-glacier-deep"
            >
              Book this <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
          {s.description ? (
            <div className="mt-4 space-y-3 text-ink-soft">
              {s.description.split(/\n+/).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          ) : (
            <p className="mt-4">
              <NeedsConfirm tone="light">Service description</NeedsConfirm>
            </p>
          )}

          {/* Phones: stacked option cards (no sideways scrolling). sm and up: the full table. */}
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10 sm:hidden" aria-label={`${s.name} options`}>
            {(s.options.length ? s.options : [{ id: "base", name: s.name, price: s.basePrice, varies: s.varies, durationMin: s.durationMin, deposit: s.deposit ?? 0 }]).map((o) => (
              <li key={o.id} className="py-3">
                <p className="font-medium text-ink">{o.name}</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px]">
                  <span className="font-semibold text-glacier-deep">{s.basePrice === 0 && s.varies ? "Priced at the chair" : priceLabel(o.price, o.varies)}</span>
                  <span className="text-ink-soft">{duration(o.durationMin)}</span>
                  <span className="text-ink-soft">{o.deposit ? `${money(o.deposit)} deposit` : "No deposit"}</span>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden sm:block">
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">{s.name} — options, prices, times and deposits</caption>
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-[0.14em] text-ink-soft">
                  <th scope="col" className="py-2 pr-4 font-semibold">Option</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Price</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Time</th>
                  <th scope="col" className="py-2 font-semibold">Deposit</th>
                </tr>
              </thead>
              <tbody>
                {(s.options.length ? s.options : [{ id: "base", name: s.name, price: s.basePrice, varies: s.varies, durationMin: s.durationMin, deposit: s.deposit ?? 0 }]).map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-0">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">{o.name}</th>
                    <td className="py-3 pr-4 font-semibold text-glacier-deep">{s.basePrice === 0 && s.varies ? "Priced at the chair" : priceLabel(o.price, o.varies)}</td>
                    <td className="py-3 pr-4 text-ink-soft">{duration(o.durationMin)}</td>
                    <td className="py-3 text-ink-soft">{o.deposit ? money(o.deposit) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {s.modifierGroups.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {s.modifierGroups.map((g) => (
                <div key={g.id} className="rounded-input bg-frost-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {g.name} · {g.rule === "required" ? "choose one" : "optional"}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {g.modifiers
                      .filter((m) => !m.expires || m.expires >= today)
                      .map((m) => (
                        <li key={m.id} className="flex justify-between gap-3">
                          <span>{m.name}</span>
                          <span className="whitespace-nowrap text-ink-soft">
                            {m.price ? `+${money(m.price)}` : "Included"}
                            {m.addMin ? ` · +${duration(m.addMin)}` : ""}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mt-5 text-xs text-ink-soft">Deposit applied to your service total. Prices marked &ldquo;From&rdquo; vary by length and condition.</p>
        </div>
      </div>
    </article>
  );
}
