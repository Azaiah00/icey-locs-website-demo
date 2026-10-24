"use client";

import { Icon, type IconName } from "@/components/Icon";
import { useScrollProgress } from "@/components/motion";
import { Button, Container, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/format";

const STEPS: { n: string; title: string; body: string; icon: IconName }[] = [
  { n: "01", title: "Loc Bath", body: "A luxury shampoo cleanse that lifts buildup from root to tip.", icon: "Droplets" },
  { n: "02", title: "Scalp Care", body: "Clean parts, calm scalp, healthy growth.", icon: "Sparkles" },
  { n: "03", title: "Precise Retwist", body: "Neat, polished roots by hand — or interlock and crochet when your locs need it.", icon: "Snowflake" },
  { n: "04", title: "Your Style", body: "Two-strand, barrel twist, plaits or a custom design.", icon: "Crown" },
  { n: "05", title: "The Finish", body: "Add a precision cut from our barber and leave fully fresh.", icon: "Scissors" },
];

/** The Ritual — sticky on desktop; an LED line fills between steps as you scroll (MOTION.md). */
export function Ritual() {
  const [ref, p] = useScrollProgress<HTMLDivElement>(0.75, 0.35);
  const active = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
  return (
    <section className="relative bg-midnight py-24 md:py-36" aria-labelledby="ritual-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading kicker="The Ritual" title={<span id="ritual-title">Every refresh is a ritual.</span>} sub="Refresh Your Crown is more than a retwist. It's five unhurried steps in a private suite — the reason clients say we literally iced their hair." />
            <div className="reveal mt-9" style={{ ["--d" as string]: "240ms" }}>
              <Button href="/book?service=refresh-full" icon="ArrowRight">
                Book Refresh Your Crown
              </Button>
            </div>
          </div>
          <div ref={ref} className="relative">
            <div className="absolute bottom-6 left-[27px] top-6 w-px bg-steel" aria-hidden />
            <div
              className="absolute left-[27px] top-6 w-px origin-top bg-[linear-gradient(#b9cbe5,#2a5e87)] transition-transform duration-200"
              style={{ height: "calc(100% - 48px)", transform: `scaleY(${p})` }}
              aria-hidden
            />
            <ol className="space-y-6">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={cn(
                    "relative grid grid-cols-[56px_1fr] gap-5 rounded-card p-4 transition-colors duration-500 sm:p-6",
                    i <= active ? "bg-slate/70" : "bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-14 place-items-center rounded-pill border transition-all duration-500",
                      i <= active ? "border-ice bg-midnight text-ice shadow-glow" : "border-steel bg-midnight text-mist",
                    )}
                  >
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <div className="pt-1">
                    <p className="font-display text-sm font-semibold tracking-[0.2em] text-ice">{s.n}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-mist">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
