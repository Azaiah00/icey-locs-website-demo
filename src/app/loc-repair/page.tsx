import type { Metadata } from "next";
import { MenuService } from "@/components/MenuService";
import { PageHero } from "@/components/PageHero";
import { FaqSection, FinalCta, ReviewsSection } from "@/components/sections/HomeSections";
import { RepairLab } from "@/components/sections/RepairLab";
import { Button, Container } from "@/components/ui";
import { publicReviews } from "@/data/reviews";
import { services } from "@/data/services";
import { ld, serviceGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Loc Repair in Inglewood & Los Angeles | Icey Locs" },
  description:
    "Weak, thinning or broken locs? Precision crochet loc repair by a loc repair specialist. Start with a 20-minute consultation near SoFi Stadium.",
  alternates: { canonical: "/loc-repair" },
};

export default function LocRepairPage() {
  const consult = services.find((s) => s.id === "repair-consult")!;
  const maint = services.find((s) => s.id === "refresh-full")!;
  const proof = publicReviews.filter((r) => r.tags?.includes("repair") || r.tags?.includes("long-locs") || r.featured).slice(0, 6);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(serviceGraph(consult, "/loc-repair"))} />
      <PageHero
        kicker="Loc repair specialist"
        title="Loc Repair in Inglewood & Los Angeles."
        sub="Weak, thinning, broken or damaged locs are restored with customized repair techniques — precision crochet that strengthens and maintains the integrity of your crown."
        crumbs={[{ name: "Loc Repair", path: "/loc-repair" }]}
      >
        <div className="mt-8">
          <Button href="/book?service=repair-consult" icon="ArrowRight">
            Book a repair consult
          </Button>
        </div>
      </PageHero>
      <RepairLab />
      <section className="bg-frost-bg py-16 text-ink md:py-24" aria-label="Repair services and pricing">
        <Container className="space-y-6">
          <MenuService s={consult} headingLevel="h2" />
          <MenuService s={maint} headingLevel="h2" />
        </Container>
      </section>
      <ReviewsSection list={proof} />
      <FaqSection />
      <FinalCta />
    </>
  );
}
