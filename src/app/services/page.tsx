import type { Metadata } from "next";
import Link from "next/link";
import { MenuService } from "@/components/MenuService";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { locations } from "@/data/business";
import { services, type Service } from "@/data/services";
import { businessGraph, ld } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Loc Services & Prices",
  description:
    "Full menu with prices: Refresh Your Crown retwists, loc repair, starter and instant locs, extensions, wicks, detox and braids at Hollywood Park.",
  alternates: { canonical: "/services" },
};

const ORDER: Service["category"][] = ["welcome", "retwist", "repair", "starter", "extensions", "wicks", "spa", "braids", "kids", "cut", "barber"];
const sorted = (loc: "loc-spa" | "barber-spa") =>
  services.filter((s) => s.location === loc).sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category));

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(businessGraph())} />
      <PageHero
        kicker="The Menu"
        title="Every service, every price."
        sub="Every option, add-on and deposit — right here, before you book. Deposits are applied to your service total."
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <nav aria-label="Menu sections" className="mt-8 flex flex-wrap gap-2">
          {locations.map((l) => (
            <Link key={l.id} href={`#${l.id}`} className="inline-flex min-h-11 items-center rounded-pill border border-ice/25 px-5 text-sm text-snow hover:border-ice hover:bg-ice/10">
              {l.shortName} · {l.suite}
            </Link>
          ))}
        </nav>
      </PageHero>
      {locations.map((l, i) => (
        <section key={l.id} id={l.id} className={i === 0 ? "scroll-mt-24 bg-frost-bg py-16 text-ink md:py-24" : "scroll-mt-24 bg-midnight py-16 md:py-24"} aria-labelledby={`${l.id}-h`}>
          <Container>
            <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h2 id={`${l.id}-h`} className={i === 0 ? "h-section text-ink" : "h-section text-snow"}>
                {l.name}
              </h2>
              <p className={i === 0 ? "text-ink-soft" : "text-mist"}>
                {l.streetAddress}, {l.suite}
              </p>
            </div>
            <div className="space-y-6">
              {sorted(l.id).map((s) => (
                <MenuService key={s.id} s={s} />
              ))}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
