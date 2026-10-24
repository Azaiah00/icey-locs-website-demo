import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/sections/HomeSections";
import { Button, Container, Stars } from "@/components/ui";
import { business } from "@/data/business";
import { publicReviews, stripEmoji } from "@/data/reviews";
import { team } from "@/data/team";
import { monthYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "Client Reviews",
  description:
    "5.0 from 34 client reviews on GlossGenius and 5.0 on Google. Read what Icey Locs clients say about retwists, loc repair, detox, kids and cuts in Inglewood.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        kicker="Client love"
        title="Client Love."
        sub={`${business.ratings.glossGenius.value.toFixed(1)} from ${business.ratings.glossGenius.count} reviews on GlossGenius · ${business.ratings.google.value.toFixed(1)} from ${business.ratings.google.count} on Google.`}
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={business.googleReviewUrl} external variant="ghost" icon="Star">
            Leave a Google review
          </Button>
        </div>
      </PageHero>
      <section className="bg-midnight py-16 md:py-24" aria-label="All reviews">
        <Container>
          <ul className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {publicReviews.map((r) => (
              <li key={r.id} className="frost-card mb-5 break-inside-avoid p-6">
                <Icon name="Quote" className="size-6 text-ice/60" />
                <blockquote className="mt-3 text-snow">{stripEmoji(r.text)}</blockquote>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-steel pt-4 text-sm">
                  <span>
                    <span className="block font-semibold text-snow">{r.name}</span>
                    <span className="text-mist">
                      with {team.find((t) => t.id === r.stylist)!.name.split(" ")[0]} · {monthYear(r.date)}
                    </span>
                  </span>
                  <Stars />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-mist">Reviews shown as written by clients on the Icey Locs GlossGenius booking page.</p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
