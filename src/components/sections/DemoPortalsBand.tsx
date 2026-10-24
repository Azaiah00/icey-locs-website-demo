import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Container } from "@/components/ui";
import { DEMO_PORTALS, portalHref } from "@/lib/demoPortals";
import { isDemo } from "@/lib/format";

/** Demo mode only: the booking-system tour, as big buttons, right on the home page. */
export function DemoPortalsBand() {
  if (!isDemo) return null;
  const featured = DEMO_PORTALS.filter((p) => ["owner", "lele", "client"].includes(p.key));
  return (
    <section className="relative border-y border-ice/15 bg-night py-20 md:py-28" aria-labelledby="demo-title">
      <Container>
        <div className="max-w-2xl">
          <p className="kicker reveal text-ice">Icey Book · Demo</p>
          <h2 id="demo-title" className="h-section reveal mt-5 text-balance">
            Your booking system, from every side.
          </h2>
          <p className="reveal mt-5 text-lg text-mist">
            The site comes with its own booking portal — one for you, one for each stylist, and one for your clients. Tap a button to walk through it with sample data.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.key} href={portalHref(p.key)} className="frost-card reveal group flex flex-col gap-4 p-6 transition hover:border-ice/50 hover:bg-ice/5 sm:p-8">
              <span className="grid size-12 place-items-center rounded-pill bg-ice/15 text-ice">
                <Icon name={p.icon} className="size-6" />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">{p.title}</span>
                <span className="mt-0.5 block text-sm uppercase tracking-[0.16em] text-ice">{p.who}</span>
              </span>
              <span className="text-mist">{p.blurb}</span>
              <span className="mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-ice-bright px-4 text-center font-display text-sm font-semibold uppercase tracking-[0.12em] text-midnight">
                Open {p.title} <Icon name="ArrowRight" className="size-4 shrink-0" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/40 px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow hover:border-ice">
            <Icon name="CalendarCheck" className="size-4 text-ice" /> Try booking an appointment
          </Link>
          <Link href="/studio" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ice/40 px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow hover:border-ice">
            <Icon name="Users" className="size-4 text-ice" /> See every view
          </Link>
        </div>
      </Container>
    </section>
  );
}
