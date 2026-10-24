"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { IceDust } from "@/components/fx/IceDust";
import { Spotlight } from "@/components/fx/Spotlight";
import { Icon } from "@/components/Icon";
import { Button, Stars } from "@/components/ui";
import { business, locations } from "@/data/business";
import { clock } from "@/lib/format";
import { heroPortrait, heroWide } from "@/lib/images";

/** Signature 1 — "Frost clears": CSS keyframes melt the frost off the headline once (MOTION.md). */
function useFrostClear() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    // Hard stop: the frost is removed after 2.2s even if the browser throttles animations.
    const stop = window.setTimeout(() => el.classList.add("done"), 2200);
    const go = () => !cancelled && el.classList.add("run");
    (document.fonts?.ready ?? Promise.resolve()).then(go, go);
    return () => {
      cancelled = true;
      window.clearTimeout(stop);
    };
  }, []);
  return ref;
}

/** Content lifts and fades as the hero scrolls away; the photo drifts slower (parallax). */
function useHeroScroll() {
  const content = useRef<HTMLDivElement | null>(null);
  const photo = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      const k = y / window.innerHeight;
      if (content.current) {
        content.current.style.transform = `translate3d(0,${-y * 0.25}px,0)`;
        content.current.style.opacity = String(1 - k * 1.1);
      }
      if (photo.current) photo.current.style.transform = `translate3d(0,${y * 0.3}px,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { content, photo };
}

export function Hero() {
  const frost = useFrostClear();
  const { content, photo } = useHeroScroll();
  const common = { alt: "The Icey Locs private suite — LED-lit shelves, shampoo chair and the icy crown sign on the slatted wall", sizes: "100vw", priority: true, quality: 75 } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: heroWide, width: 2400, height: 1340 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: heroPortrait, width: 900, height: 1200 });

  return (
    <section className="relative isolate -mt-[73px] flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 sm:items-center sm:pb-24">
      <div ref={photo} className="absolute inset-0 -z-20 will-change-transform">
        <picture className="kenburns block size-full">
          <source media="(min-width: 1024px)" srcSet={desktop} />
          <source media="(max-width: 1023px)" srcSet={mobile} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is spread from getImageProps */}
          <img {...rest} className="size-full object-cover object-[60%_35%] lg:object-center" fetchPriority="high" />
        </picture>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_14_22/0.6)_0%,rgb(10_14_22/0.55)_30%,rgb(10_14_22/0.86)_55%,rgb(10_14_22/0.97)_100%)] lg:bg-[linear-gradient(90deg,rgb(10_14_22/0.95)_0%,rgb(10_14_22/0.75)_38%,rgb(10_14_22/0.15)_70%,rgb(10_14_22/0.35)_100%)]" />

      <IceDust className="pointer-events-none absolute inset-0 -z-[5] size-full" />
      <Spotlight />
      <div className="led-glow pointer-events-none absolute inset-y-0 right-[8%] -z-[6] hidden w-[38%] lg:block" aria-hidden />

      <div ref={content} className="mx-auto w-full max-w-[1240px] px-5 will-change-transform sm:px-8 lg:px-12">
        <div className="relative max-w-[640px]">
          <p className="kicker text-ice">Loc Spa · {business.neighborhood}</p>
          <div className="relative mt-6">
            <h1 className="h-display text-[clamp(3.2rem,11vw,7rem)] text-snow">
              Loc care,
              <br />
              <span className="bg-[linear-gradient(180deg,#f2f6fb_10%,#b9cbe5_95%)] bg-clip-text text-transparent">iced.</span>
            </h1>
            <div ref={frost} className="frost-layer" aria-hidden style={{ ["--fx" as string]: "24%", ["--fy" as string]: "62%" }} />
          </div>
          <div className="led-line led-sweep mt-7 w-48" />
          <p className="mt-7 max-w-[34rem] text-lg text-snow/90 sm:text-xl">
            Private loc suites steps from SoFi Stadium. Retwists, loc repair, starter and instant locs, extensions and braids — with a barber spa next door.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/book" icon="ArrowRight">
              Book your suite
            </Button>
            <Button href="/services" variant="ghost">
              See the menu
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-mist">
            <span className="inline-flex items-center gap-2 rounded-pill border border-ice/20 bg-midnight/50 px-3 py-1.5 backdrop-blur">
              <Stars />
              <span className="text-snow">{business.ratings.glossGenius.value.toFixed(1)}</span>· {business.ratings.glossGenius.count} client reviews
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="Clock" className="size-4 text-ice" /> Open every day, {clock(locations[0].hours[0].open)}–{clock(locations[0].hours[0].close)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="CreditCard" className="size-4 text-ice" /> Buy Now, Pay Later
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
