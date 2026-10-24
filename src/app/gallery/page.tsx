import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/sections/HomeSections";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Loc Styles Gallery — Real Clients",
  description:
    "Real retwists, loc styles, starter locs, extensions, braids and cuts from Icey Locs in Inglewood — barrel twists, plaits, two-strand and custom designs.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero kicker="Fresh off the chair" title="The Gallery." sub="Every photo is a real Icey Locs client — retwists, styles, braids, kids and cuts." crumbs={[{ name: "Gallery", path: "/gallery" }]} />
      <section className="bg-midnight pb-24 pt-4">
        <Container>
          <Gallery />
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
