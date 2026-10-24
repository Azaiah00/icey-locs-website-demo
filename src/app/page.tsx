import { Hero } from "@/components/sections/Hero";
import {
  BarberTeaser,
  FaqSection,
  FinalCta,
  GallerySection,
  Problem,
  ProofStrip,
  ReviewsSection,
  SignatureServices,
  TeamSection,
  Visit,
  WelcomeBand,
  YoungCrowns,
} from "@/components/sections/HomeSections";
import { RepairLab } from "@/components/sections/RepairLab";
import { DemoPortalsBand } from "@/components/sections/DemoPortalsBand";
import { Ritual } from "@/components/sections/Ritual";
import { KineticBand } from "@/components/fx/KineticBand";
import { WorkRibbon } from "@/components/fx/WorkRibbon";
import type { Metadata } from "next";
import { businessGraph, faqGraph, ld } from "@/lib/schema";
import { baseOpenGraph, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

// Home: canonical + og:url so a shared link always resolves to this exact address.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(businessGraph())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqGraph())} />
      <Hero />
      <ProofStrip />
      <WorkRibbon />
      <Problem />
      <Ritual />
      <KineticBand lines={["Get iced", "Loc repair · Retwist · Starter locs"]} />
      <SignatureServices />
      <RepairLab />
      <WelcomeBand />
      <GallerySection />
      <YoungCrowns />
      <ReviewsSection />
      <TeamSection />
      <BarberTeaser />
      <Visit />
      <FaqSection />
      <DemoPortalsBand />
      <FinalCta />
    </>
  );
}
