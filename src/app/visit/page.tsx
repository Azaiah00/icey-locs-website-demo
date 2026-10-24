import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FaqSection, Visit } from "@/components/sections/HomeSections";
import { businessGraph, ld } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Visit Us at Hollywood Park",
  description:
    "Icey Locs is inside Hollywood Park Shops at 1237 District Dr, Suite 113, Inglewood, CA 90301 — steps from SoFi Stadium. Open every day, 9 AM to 7 PM.",
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(businessGraph())} />
      <PageHero kicker="Visit" title="Visit Icey Locs." sub="Two private suites inside Hollywood Park Shops — the Loc Spa and the Barber Spa next door." crumbs={[{ name: "Visit", path: "/visit" }]} />
      <Visit />
      <FaqSection />
    </>
  );
}
