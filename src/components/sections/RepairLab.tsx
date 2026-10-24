import { RepairStages } from "@/components/sections/RepairStages";
import { Button, Container, NeedsConfirm } from "@/components/ui";
import { reviews, stripEmoji } from "@/data/reviews";
import { services } from "@/data/services";
import { duration, money } from "@/lib/format";

export function RepairLab() {
  const consult = services.find((s) => s.id === "repair-consult")!;
  const quote = reviews.find((r) => r.name === "Mar")!;
  return (
    <section id="repair" className="relative overflow-clip bg-night-grad py-24 md:py-36" aria-labelledby="repair-title">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/texture/frost-1280.webp')] bg-cover bg-left opacity-[0.12] mix-blend-screen" aria-hidden />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="kicker reveal text-ice">Loc Repair</p>
          <h2 id="repair-title" className="h-section reveal mt-5 text-balance">
            Broken, thinning, unraveling? We bring locs back.
          </h2>
          <p className="reveal mt-5 text-lg text-mist">
            Loc repair is what Icey is known for. Every repair is custom — matched to your loc&apos;s condition, length and what it&apos;s been through — and done with precision crochet so the fix holds.
          </p>
        </div>

        <RepairStages />

        <div className="mt-16 grid gap-8 border-t border-steel pt-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <figure>
            <blockquote className="font-display text-2xl font-semibold leading-snug sm:text-3xl">&ldquo;{stripEmoji(quote.text)}&rdquo;</blockquote>
            <figcaption className="mt-4 text-mist">— {quote.name}, client of Icey</figcaption>
          </figure>
          <div className="frost-card p-6">
            <p className="font-display text-xl font-bold">{consult.name}</p>
            <p className="mt-1 text-mist">
              {money(consult.basePrice)} · {duration(consult.durationMin)} · {money(consult.deposit ?? 0)} deposit
            </p>
            <p className="mt-1">
              <NeedsConfirm>Consult fee $20 vs $20.50</NeedsConfirm>
            </p>
            <Button href="/book?service=repair-consult" icon="ArrowRight" className="mt-5 w-full">
              Book a repair consult
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
