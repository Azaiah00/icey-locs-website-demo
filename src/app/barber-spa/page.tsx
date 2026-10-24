import type { Metadata } from "next";
import Image from "next/image";
import { MenuService } from "@/components/MenuService";
import { PageHero } from "@/components/PageHero";
import { FinalCta, Visit } from "@/components/sections/HomeSections";
import { Button, Container } from "@/components/ui";
import { locations } from "@/data/business";
import { gallery } from "@/data/gallery";
import { services } from "@/data/services";
import { workSrc } from "@/lib/images";

export const metadata: Metadata = {
  title: "Barber Spa at Hollywood Park",
  description:
    "Clean cuts, crisp line ups and fresh tapers next door to the Loc Spa. Haircuts, line ups, kids cuts and the Barber Spa V.I.P near SoFi Stadium.",
  alternates: { canonical: "/barber-spa" },
};

export default function BarberSpaPage() {
  const b = locations.find((l) => l.id === "barber-spa")!;
  const shots = gallery.filter((g) => g.tags.includes("barber")).slice(0, 4);
  return (
    <>
      <PageHero kicker={`${b.suite} · Icey Locs Barber Spa`} title="The Barber Spa." sub="Clean cuts, crisp line ups, fresh tapers. It's all about the details." crumbs={[{ name: "Barber Spa", path: "/barber-spa" }]}>
        <div className="mt-8">
          <Button href="/book?location=barber-spa" icon="ArrowRight">
            Book the Barber Spa
          </Button>
        </div>
      </PageHero>
      <section className="bg-midnight py-14" aria-label="Recent cuts">
        <Container>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {shots.map((g) => (
              <li key={g.file} className="reveal relative aspect-[4/5] overflow-hidden rounded-img bg-slate">
                <Image src={workSrc(g)} alt={g.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="bg-frost-bg py-16 text-ink md:py-24" aria-label="Barber menu">
        <Container className="space-y-6">
          {services
            .filter((s) => s.location === "barber-spa")
            .map((s) => (
              <MenuService key={s.id} s={s} headingLevel="h2" />
            ))}
        </Container>
      </section>
      <Visit />
      <FinalCta />
    </>
  );
}
