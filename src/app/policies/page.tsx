import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button, Container } from "@/components/ui";
import { business, policy } from "@/data/business";
import { services } from "@/data/services";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Booking Policies",
  description:
    "Icey Locs booking policy: a non-refundable deposit applied to your service total secures every appointment, with 24 hours notice to cancel or reschedule.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  const deps = services.flatMap((s) => (s.options.length ? s.options.map((o) => o.deposit) : s.deposit ? [s.deposit] : []));
  return (
    <>
      <PageHero kicker="Policies" title="Booking Policies." sub={policy.intro} crumbs={[{ name: "Policies", path: "/policies" }]} />
      <section className="bg-frost-bg py-16 text-ink md:py-24">
        <Container className="grid max-w-3xl gap-10">
          <div>
            <h2 className="font-display text-3xl font-bold">Deposits</h2>
            <p className="mt-3 text-lg text-ink-soft">{policy.deposits}</p>
            <p className="mt-3 text-ink-soft">
              Deposits range from {money(Math.min(...deps))} to {money(Math.max(...deps))} depending on the service — you&apos;ll see the exact amount before you confirm.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Cancellations &amp; rescheduling</h2>
            <p className="mt-3 text-lg text-ink-soft">{policy.cancellations}</p>
            <ul className="mt-3 list-disc pl-5 text-ink-soft">
              <li>{policy.lateCancellation}</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Paying over time</h2>
            <p className="mt-3 text-lg text-ink-soft">{business.payments.bnplCopy}</p>
          </div>
          <div>
            <Button href="/book" variant="ink" icon="ArrowRight">
              Book your suite
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
