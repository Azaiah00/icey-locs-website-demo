import type { Metadata } from "next";
import { MenuService } from "@/components/MenuService";
import { PageHero } from "@/components/PageHero";
import { FinalCta, ReviewsSection, YoungCrowns } from "@/components/sections/HomeSections";
import { Container } from "@/components/ui";
import { publicReviews } from "@/data/reviews";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Kids Locs & Braids in Inglewood",
  description:
    "Mini Loc Spa for ages 5 and under, kids braids and kids cuts in a calm private suite at Hollywood Park. Gentle products, clean parts, soft hands.",
  alternates: { canonical: "/kids" },
};

export default function KidsPage() {
  const ids = ["mini-loc-spa", "braids-twist", "barber-haircut"];
  return (
    <>
      <PageHero kicker="Young crowns" title="Kids' Locs & Braids in Inglewood." sub="Gentle wash with kid-friendly products. Clean parts. Soft hands for all young crowns." crumbs={[{ name: "Kids", path: "/kids" }]} />
      <YoungCrowns />
      <section className="bg-midnight py-16 md:py-24" aria-label="Kids services">
        <Container className="space-y-6">
          {ids.map((id) => (
            <MenuService key={id} s={services.find((s) => s.id === id)!} headingLevel="h2" />
          ))}
        </Container>
      </section>
      <ReviewsSection list={publicReviews.filter((r) => r.tags?.includes("kids"))} />
      <FinalCta />
    </>
  );
}
