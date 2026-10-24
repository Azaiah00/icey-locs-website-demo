import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FinalCta, ReviewsSection, TeamSection } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Meet Icey Scurry, owner and loc repair specialist, loctician and braider Lele Scurry, and licensed barber Shane Smith at Icey Locs in Hollywood Park, Inglewood.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero kicker="The team" title="Meet the Team." sub="Three sets of hands, one standard: clean, precise and unhurried." crumbs={[{ name: "Team", path: "/team" }]} />
      <TeamSection />
      <ReviewsSection />
      <FinalCta />
    </>
  );
}
