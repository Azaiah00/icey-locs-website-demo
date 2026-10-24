import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MenuService } from "@/components/MenuService";
import { PageHero } from "@/components/PageHero";
import { FaqSection, FinalCta, ReviewsSection } from "@/components/sections/HomeSections";
import { Container } from "@/components/ui";
import { publicReviews } from "@/data/reviews";
import { services } from "@/data/services";
import { serviceFromLabel } from "@/lib/format";
import { ld, serviceGraph } from "@/lib/schema";

/** SEO landing slugs that group several menu entries (docs/SEO.md). */
const GROUPS: Record<string, { title: string; h1: string; ids: string[]; desc: string; kicker: string }> = {
  "refresh-your-crown": {
    title: "Loc Retwist in Inglewood — Refresh Your Crown",
    h1: "Refresh Your Crown",
    kicker: "Retwist · Interlock · Crochet maintenance",
    ids: ["refresh-full", "refresh-half"],
    desc: "Loc retwist in Inglewood: luxury shampoo cleanse, scalp care and precise retwist, interlock or crochet maintenance. Half or full head, near SoFi Stadium.",
  },
  "loc-detox": {
    title: "Loc Detox in Los Angeles — Luxe Crown Detox",
    h1: "Luxe Crown Detox",
    kicker: "Loc Spa treatments",
    ids: ["spa-add-ons"],
    desc: "Luxe Crown Detox, deep conditioning and hot oil treatments that cleanse, hydrate and nourish your scalp and locs at Icey Locs in Inglewood near LAX.",
  },
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [...services.map((s) => ({ slug: s.slug })), ...Object.keys(GROUPS).map((slug) => ({ slug }))];
}

function resolve(slug: string) {
  const g = GROUPS[slug];
  if (g) return { group: g, list: g.ids.map((id) => services.find((s) => s.id === id)!) };
  const s = services.find((x) => x.slug === slug);
  return s ? { group: null, list: [s] } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return {};
  if (r.group) return { title: { absolute: `${r.group.title} | Icey Locs`.slice(0, 60) }, description: r.group.desc, alternates: { canonical: `/services/${slug}` } };
  const s = r.list[0];
  const where = s.location === "barber-spa" ? "Icey Locs Barber Spa" : "Icey Locs Inglewood";
  const base = (s.description ?? `${s.displayName} at ${where}, Suite 112 in Hollywood Park — ${serviceFromLabel(s)}. Clean cuts, crisp line ups and fresh tapers near SoFi Stadium.`).replace(/\s+/g, " ").trim();
  const desc = base.length > 155 ? `${base.slice(0, 152).replace(/\s\S*$/, "")}…` : base.length < 120 ? `${base} ${serviceFromLabel(s)}. Book online at Hollywood Park, steps from SoFi Stadium.`.slice(0, 158) : base;
  return { title: `${s.displayName} — ${s.location === "barber-spa" ? "Barber Spa" : "Inglewood"}`.slice(0, 48), description: desc, alternates: { canonical: `/services/${slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  const first = r.list[0];
  const tag = first.category === "repair" ? "repair" : first.category === "kids" ? "kids" : first.category === "spa" ? "detox" : first.category === "barber" || first.category === "cut" ? "barber" : null;
  const related = (tag ? publicReviews.filter((x) => x.tags?.includes(tag)) : []).concat(publicReviews.filter((x) => x.featured)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);
  const name = r.group?.h1 ?? first.displayName;
  return (
    <>
      {r.list.map((s) => (
        <script key={s.id} type="application/ld+json" dangerouslySetInnerHTML={ld(serviceGraph(s, `/services/${slug}`))} />
      ))}
      <PageHero
        kicker={r.group?.kicker ?? (first.location === "barber-spa" ? "Barber Spa" : "Loc Spa")}
        title={name}
        sub={r.group ? r.group.desc : `${serviceFromLabel(first)} — every option, add-on and deposit below.`}
        crumbs={[
          { name: "Services", path: "/services" },
          { name, path: `/services/${slug}` },
        ]}
      />
      <section className="bg-frost-bg py-16 text-ink md:py-24">
        <Container className="space-y-6">
          {r.list.map((s) => (
            <MenuService key={s.id} s={s} headingLevel="h2" />
          ))}
          <p className="pt-4 text-ink-soft">
            Looking for something else?{" "}
            <Link href="/services" className="font-medium text-glacier-deep underline underline-offset-4">
              See the full menu
            </Link>
            .
          </p>
        </Container>
      </section>
      <ReviewsSection list={related} />
      <FaqSection />
      <FinalCta />
    </>
  );
}
