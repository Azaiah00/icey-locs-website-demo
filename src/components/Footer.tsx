import Link from "next/link";
import { Icon } from "@/components/Icon";
import Image from "next/image";
import { Container } from "@/components/ui";
import { business, glossGeniusBookUrl, locations } from "@/data/business";
import { clock, telHref } from "@/lib/format";

export function Footer() {
  const h = locations[0].hours[0];
  return (
    <footer className="relative overflow-hidden border-t border-steel bg-night pb-28 pt-20 md:pb-12">
      <div className="pointer-events-none absolute -right-24 -top-16 size-[460px] opacity-[0.13] md:right-0" aria-hidden>
        <Image unoptimized src="/images/brand/icey-crown-alpha.webp" alt="" fill sizes="460px" className="object-contain" />
      </div>
      <Container className="relative">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-extrabold uppercase tracking-[0.04em]">Icey Locs</p>
            <p className="kicker mt-2 text-ice">Loc Spa</p>
            <p className="mt-5 max-w-xs text-mist">Private loc &amp; natural hair suites in {business.neighborhood}, Inglewood.</p>
            <div className="mt-6 flex gap-2">
              <a href={`https://www.instagram.com/${business.instagram}/`} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-pill border border-ice/20 text-ice hover:border-ice" aria-label="Icey Locs on Instagram">
                <Icon name="Instagram" className="size-5" />
              </a>
              <a href={`https://www.facebook.com/${business.facebookId}`} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-pill border border-ice/20 text-ice hover:border-ice" aria-label="Icey Locs on Facebook">
                <Icon name="Facebook" className="size-5" />
              </a>
            </div>
          </div>
          {locations.map((l) => (
            <address key={l.id} className="not-italic">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice">{l.shortName}</p>
              <p className="mt-3 text-snow">
                {l.streetAddress}, {l.suite}
                <br />
                {l.locality}, {l.region} {l.postalCode}
              </p>
              <a href={telHref(l.phoneE164)} className="mt-1 inline-flex min-h-11 items-center text-mist underline decoration-ice/40 underline-offset-4 hover:text-snow">
                {l.phoneDisplay}
              </a>
              {l.instagram && l.id === "barber-spa" ? (
                <a href={`https://www.instagram.com/${l.instagram}/`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center text-mist hover:text-snow">
                  @{l.instagram}
                </a>
              ) : null}
            </address>
          ))}
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice">Hours</p>
            <p className="mt-3 text-snow">Every day</p>
            <p className="text-mist">
              {clock(h.open)} – {clock(h.close)}
            </p>
            <ul className="mt-5 space-y-0.5 text-sm">
              <li><Link href="/policies" className="inline-flex min-h-11 items-center text-mist hover:text-snow">Booking policies</Link></li>
              <li><Link href="/reviews" className="inline-flex min-h-11 items-center text-mist hover:text-snow">Client reviews</Link></li>
              <li><Link href="/kids" className="inline-flex min-h-11 items-center text-mist hover:text-snow">Kids</Link></li>
              <li>
                <a href={glossGeniusBookUrl("loc-spa")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-mist hover:text-snow">
                  Book on GlossGenius
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="led-line mt-16 opacity-40" />
        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-mist sm:flex-row">
          <p>© {new Date().getFullYear()} Icey Locs. All rights reserved.</p>
          <p>{business.landmark}</p>
        </div>
      </Container>
    </footer>
  );
}
