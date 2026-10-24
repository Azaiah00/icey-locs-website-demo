import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { Icon, type IconName } from "@/components/Icon";
import { IceServiceCard } from "@/components/ServiceCard";
import { HorizontalRail } from "@/components/fx/HorizontalRail";
import { Spotlight } from "@/components/fx/Spotlight";
import { Emblem } from "@/components/fx/Emblem";
import { Button, Container, IcicleDivider, NeedsConfirm, SectionHeading, Stars } from "@/components/ui";
import { business, locations } from "@/data/business";
import { faqs } from "@/data/faq";
import { promos } from "@/data/promos";
import { featuredReviews, reviews, stripEmoji, type ClientReview } from "@/data/reviews";
import { services } from "@/data/services";
import { team } from "@/data/team";
import { clock, cn, money, monthYear, telHref } from "@/lib/format";
import { asset, heroWide1280, work, workSrc } from "@/lib/images";

const svc = (id: string) => services.find((s) => s.id === id)!;
const firstName = (id: ClientReview["stylist"]) => team.find((t) => t.id === id)!.name.split(" ")[0];

/* ---------------- 2 · Proof strip ---------------- */
export function ProofStrip() {
  const items: { icon: IconName; text: string }[] = [
    { icon: "Star", text: `${business.ratings.glossGenius.value.toFixed(1)} on GlossGenius (${business.ratings.glossGenius.count})` },
    { icon: "Star", text: `${business.ratings.google.value.toFixed(1)} on Google (${business.ratings.google.count})` },
    { icon: "MapPin", text: "Inside Hollywood Park Shops" },
    { icon: "Clock", text: `Open daily ${clock(locations[0].hours[0].open)}–${clock(locations[0].hours[0].close)}` },
    { icon: "Baby", text: "Kids welcome" },
  ];
  const row = (aria: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={aria || undefined}>
      {items.map((it) => (
        <li key={it.text} className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-ink">
          <Icon name={it.icon} className="size-4 text-glacier-deep" />
          {it.text}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Why clients trust Icey Locs" className="overflow-hidden bg-frost-bg py-5">
      <div className="hidden justify-center lg:flex">{row(false)}</div>
      <div className="flex w-max marquee lg:hidden">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ---------------- 3 · Problem ---------------- */
export function Problem() {
  const rodney = reviews.find((r) => r.name === "Rodney")!;
  const tiles: { icon: IconName; title: string; body: string }[] = [
    { icon: "DoorClosed", title: "Private suite", body: "Your appointment, your room. No crowd, no rush." },
    { icon: "Sparkles", title: "Loc repair specialists", body: "Precision crochet that restores weak, thinning and broken locs." },
    { icon: "Clock", title: "In and out, done right", body: `Clients say it best: "${stripEmoji(rodney.text).split(" so I can")[0]}…"` },
  ];
  return (
    <section className="bg-midnight py-24 md:py-36" aria-labelledby="why-title">
      <Container>
        <SectionHeading
          kicker="Why Icey"
          title={<span id="why-title">Your locs deserve more than a rushed retwist.</span>}
          sub="Loud shops, crowded chairs, roots that loosen in a week, buildup nobody washed out, thinning spots that got worse instead of better. We built Icey Locs to be the opposite: a private suite, a real loc bath, and precise hands that leave your crown cleaner and stronger than it came in."
        />
        <IcicleDivider className="reveal mt-8" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <li key={t.title} className="frost-card led-top reveal p-7" style={{ ["--d" as string]: `${i * 80}ms` }}>
              <span className="grid size-12 place-items-center rounded-pill border border-ice/30 text-ice">
                <Icon name={t.icon} className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold">{t.title}</h3>
              <p className="mt-2 text-mist">{t.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- 5 · Signature services ---------------- */
const SIGNATURE: { id: string; line: string }[] = [
  { id: "refresh-full", line: "Wash, scalp care and precise retwist. Half head (undercut) or full head." },
  { id: "repair-consult", line: "Restore weak, thinning, broken or damaged locs. Starts with a 20-minute consultation." },
  { id: "starter-locs", line: "Clean coils, two-strand twists, or instant locs for a mature look on day one." },
  { id: "loc-extensions", line: "Premium human hair for length and fullness that blends seamlessly." },
  { id: "wicks", line: "Bold, structured locs installed with crochet and palm-rolling for a strong foundation." },
  { id: "spa-add-ons", line: "Luxe Crown Detox, hot oil and deep conditioning — locs lighter, scalp refreshed." },
  { id: "braids-twist", line: "Straight-backs, custom designs, twists and kids' braids by Lele." },
  { id: "mini-loc-spa", line: "Gentle wash, clean parts, soft hands for young crowns (5 & under)." },
];

export function SignatureServices() {
  return (
    <section className="relative bg-midnight pb-24 pt-24 md:pb-32 md:pt-28 lg:py-0" aria-labelledby="menu-title">
      <Spotlight />
      <HorizontalRail
        header={
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading kicker="Signature Services" title={<span id="menu-title">Every price, up front.</span>} sub="Real menu, real deposits, real times — scroll the signatures, then book in five taps." />
              <Link href="/services" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-medium text-ice hover:text-snow">
                View the full menu <Icon name="ArrowRight" className="size-4" />
              </Link>
            </div>
          </Container>
        }
      >
        {SIGNATURE.map((x, i) => (
          <IceServiceCard key={x.id} s={svc(x.id)} line={x.line} n={i + 1} />
        ))}
      </HorizontalRail>
    </section>
  );
}

/* ---------------- 7 · Welcome band ---------------- */
export function WelcomeBand() {
  const p = promos.find((x) => x.id === "welcome-ritual")!;
  const s = svc("welcome");
  return (
    <section className="bg-ice-bright py-16 text-midnight md:py-20" aria-labelledby="welcome-title">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="kicker text-glacier-deep">First visit</p>
          <h2 id="welcome-title" className="mt-3 font-display text-4xl font-bold leading-[1.02] sm:text-5xl">
            {p.title}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {s.options[0].name} for first-time clients — <strong className="text-ink">{money(s.options[0].price)}</strong>. Our welcome to the care, the culture and the details.{" "}
            <NeedsConfirm tone="light">This month&apos;s offer</NeedsConfirm>
          </p>
        </div>
        <Button href={`/book?service=welcome&option=${s.options[0].id}`} variant="ink" icon="ArrowRight" className="shrink-0">
          {p.cta.label}
        </Button>
      </Container>
    </section>
  );
}

/* ---------------- 8 · Gallery ---------------- */
export function GallerySection() {
  return (
    <section className="bg-midnight py-24 md:py-36" aria-labelledby="gallery-title">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading kicker="Fresh off the chair" title={<span id="gallery-title">Real crowns. Real clients.</span>} />
          <a href={`https://www.instagram.com/${business.instagram}/`} target="_blank" rel="noopener noreferrer" className="reveal inline-flex min-h-11 items-center gap-2 text-ice hover:text-snow">
            <Icon name="Instagram" className="size-5" /> More on @{business.instagram}
          </a>
        </div>
        <div className="mt-10">
          <Gallery limit={12} />
        </div>
        <div className="mt-10 text-center">
          <Button href="/gallery" variant="ghost" icon="ArrowRight">
            See the full gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- 9 · Young Crowns ---------------- */
export function YoungCrowns() {
  const latoya = reviews.find((r) => r.name === "Latoya")!;
  const a = work("01");
  const kidsCut = svc("barber-haircut").options.find((o) => o.id === "little-kids")!;
  return (
    <section className="bg-frost-bg py-24 text-ink md:py-36" aria-labelledby="kids-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-img">
            <Image src={workSrc(a)} alt={a.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <p className="absolute -bottom-5 left-5 rounded-pill bg-ink px-4 py-2 text-sm text-snow">{a.caption}</p>
        </div>
        <div>
          <SectionHeading tone="light" kicker="Young Crowns" title={<span id="kids-title">Soft hands for young crowns.</span>} sub="Little ones get the same care in a calm, private suite — gentle, kid-friendly products, clean parts and patience. Parents keep telling us the same thing: they leave smiling." />
          <figure className="reveal mt-8 border-l-2 border-glacier-deep pl-5">
            <blockquote className="text-lg text-ink">&ldquo;{stripEmoji(latoya.text)}&rdquo;</blockquote>
            <figcaption className="mt-2 text-sm text-ink-soft">— {latoya.name}</figcaption>
          </figure>
          <ul className="reveal mt-8 flex flex-wrap gap-2 text-sm">
            {["Mini Loc Spa (5 & under)", "Kids Braids (up to 7)", `Kids cuts from ${money(kidsCut.price)} (12 & under)`, "Teens (13 & up)"].map((c) => (
              <li key={c} className="rounded-pill border border-ink/15 bg-snow px-4 py-2">
                {c}
              </li>
            ))}
          </ul>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Button href="/book?service=mini-loc-spa" variant="ink" icon="ArrowRight">
              Book a Mini Loc Spa
            </Button>
            <Link href="/kids" className="inline-flex min-h-12 items-center px-3 font-medium text-glacier-deep hover:underline">
              Kids at Icey Locs
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- 10 · Reviews ---------------- */
export function ReviewsSection({ list = featuredReviews }: { list?: ClientReview[] }) {
  return (
    <section className="bg-night py-24 md:py-36" aria-labelledby="reviews-title">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading kicker="Client love" title={<span id="reviews-title">&ldquo;She understood the assignment.&rdquo;</span>} />
          <div className="reveal flex items-center gap-3 text-mist">
            <Stars />
            <span>
              <span className="text-snow">{business.ratings.glossGenius.value.toFixed(1)}</span> · {business.ratings.glossGenius.count} reviews on GlossGenius
            </span>
          </div>
        </div>
      </Container>
      <div className="rail mt-12 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1240px)/2_+_3rem))]" role="list" aria-label="Client reviews" tabIndex={0}>
        {list.map((r) => (
          <figure key={r.id} role="listitem" className="frost-card flex w-[86vw] max-w-[420px] shrink-0 flex-col p-7">
            <Icon name="Quote" className="size-7 text-ice/60" />
            <blockquote className={cn("mt-4 flex-1 text-snow", r.text.length > 240 ? "line-clamp-[9] text-[15px]" : "text-lg")}>{stripEmoji(r.text)}</blockquote>
            <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-steel pt-4 text-sm">
              <span>
                <span className="block font-semibold text-snow">{r.name}</span>
                <span className="text-mist">
                  with {firstName(r.stylist)} · {monthYear(r.date)}
                </span>
              </span>
              <Stars />
            </figcaption>
          </figure>
        ))}
      </div>
      <Container className="mt-8">
        <Link href="/reviews" className="inline-flex min-h-11 items-center gap-2 text-ice hover:text-snow">
          Read all {business.ratings.glossGenius.count} reviews <Icon name="ArrowRight" className="size-4" />
        </Link>
      </Container>
    </section>
  );
}

/* ---------------- 11 · Team ---------------- */
export function TeamSection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const avatar = { icey: asset("iceyAvatar"), lele: asset("leleAvatar"), shane: asset("shaneMark") } as const;
  return (
    <section className="bg-frost-bg py-24 text-ink md:py-36" aria-labelledby="team-title">
      <Container>
        <SectionHeading as={headingAs} tone="light" kicker="The team" title={<span id="team-title">The hands behind the ice.</span>} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.id} className="reveal flex flex-col rounded-card border border-ink/10 bg-snow p-6" style={{ ["--d" as string]: `${i * 80}ms` }}>
              <div className="flex items-center gap-4">
                <div className={cn("relative size-20 shrink-0 overflow-hidden rounded-pill ring-2 ring-glacier-deep/30 ring-offset-2", m.avatarIsLogo && "bg-snow")}>
                  <Image src={avatar[m.id]} alt={m.avatarIsLogo ? `${m.name}'s logo mark` : m.name} fill sizes="80px" className={m.avatarIsLogo ? "object-contain p-1" : "object-cover"} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold leading-tight">{m.name}</h3>
                  <p className="text-sm text-ink-soft">{m.role}</p>
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {m.specialties.map((sp) => (
                  <li key={sp} className="rounded-pill bg-frost-bg px-3 py-1 text-xs text-ink-soft">
                    {sp}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.bio ? <p className="text-ink-soft">{m.bio}</p> : <NeedsConfirm tone="light">Bio</NeedsConfirm>}
                {m.avatarIsLogo ? <NeedsConfirm tone="light">Real headshot</NeedsConfirm> : null}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                {m.instagram ? (
                  <a href={`https://www.instagram.com/${m.instagram}/`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-glacier-deep hover:underline">
                    <Icon name="Instagram" className="size-4" />@{m.instagram}
                  </a>
                ) : (
                  <span />
                )}
                <Link href={`/book?pro=${m.id}${m.id === "shane" ? "&location=barber-spa" : ""}`} className="inline-flex min-h-11 items-center rounded-pill bg-ink px-5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-snow hover:bg-glacier-deep">
                  Book {m.name.split(" ")[0]}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- 12 · Barber Spa teaser ---------------- */
export function BarberTeaser() {
  const cut = svc("barber-haircut");
  const lineup = svc("barber-lineup");
  const vip = svc("barber-vip");
  const chips = [
    `Haircut ${money(cut.options[0].price)}`,
    `Line Up from ${money(Math.min(...lineup.options.map((o) => o.price)))}`,
    `Barber Spa V.I.P ${money(vip.basePrice)}`,
    `Kids from ${money(Math.min(...cut.options.map((o) => o.price)))}`,
  ];
  const b = locations.find((l) => l.id === "barber-spa")!;
  return (
    <section className="relative overflow-hidden bg-midnight py-24 md:py-36" aria-labelledby="barber-title">
      <div className="pointer-events-none absolute -right-20 top-1/2 size-[520px] -translate-y-1/2 opacity-[0.07]" aria-hidden>
        <Image src={asset("shaneMark")} alt="" fill sizes="520px" className="object-contain grayscale" />
      </div>
      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading kicker={b.suite} title={<span id="barber-title">The Barber Spa, next door.</span>} sub="Clean cuts, crisp line ups, fresh tapers. It's all about the details." />
          <ul className="reveal mt-8 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c} className="rounded-pill border border-ice/20 px-4 py-2 text-sm text-snow">
                {c}
              </li>
            ))}
          </ul>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Button href="/book?location=barber-spa" icon="ArrowRight">
              Book the Barber Spa
            </Button>
            <Link href="/barber-spa" className="inline-flex min-h-12 items-center px-3 text-ice hover:text-snow">
              Barber menu
            </Link>
          </div>
        </div>
        <div className="reveal grid grid-cols-2 gap-4">
          {["18", "20"].map((n, i) => {
            const g = work(n);
            return (
              <div key={n} className={cn("relative aspect-[4/5] overflow-hidden rounded-img", i === 1 && "mt-10")}>
                <Image src={workSrc(g)} alt={g.alt} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- 13 · Visit ---------------- */
export function MapArt() {
  return (
    <svg viewBox="0 0 600 420" className="size-full" role="img" aria-label="Map: Icey Locs at Hollywood Park Shops, next to SoFi Stadium in Inglewood">
      <rect width="600" height="420" fill="#111826" />
      <g stroke="#293344" strokeWidth="1.2">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" x2="600" y1={30 + i * 34} y2={20 + i * 34 + (i % 3) * 6} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} y1="0" y2="420" x1={20 + i * 44} x2={30 + i * 44 - (i % 4) * 5} />
        ))}
      </g>
      <path d="M0 300 C150 280 260 330 600 250" stroke="#657f94" strokeWidth="5" fill="none" opacity="0.6" />
      <path d="M90 0 C120 160 80 280 130 420" stroke="#657f94" strokeWidth="5" fill="none" opacity="0.6" />
      <ellipse cx="400" cy="150" rx="92" ry="62" fill="none" stroke="#b9cbe5" strokeWidth="1.5" opacity="0.5" />
      <text x="400" y="155" textAnchor="middle" fill="#9aa6b8" fontSize="14" fontFamily="system-ui" letterSpacing="2">SOFI STADIUM</text>
      <rect x="250" y="230" width="150" height="58" rx="8" fill="#1b2433" stroke="#293344" />
      <text x="325" y="262" textAnchor="middle" fill="#9aa6b8" fontSize="11" fontFamily="system-ui" letterSpacing="1.5">HOLLYWOOD PARK SHOPS</text>
      <circle cx="300" cy="244" r="26" fill="#2a5e87" opacity="0.35" />
      <circle cx="300" cy="244" r="9" fill="#dce8f6" stroke="#0a0e16" strokeWidth="3" />
      <text x="40" y="395" fill="#9aa6b8" fontSize="12" fontFamily="system-ui" letterSpacing="1.5">TO LAX →</text>
    </svg>
  );
}

export function Visit({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const l = locations[0];
  const dest = encodeURIComponent(`${l.streetAddress} ${l.suite} ${l.locality} ${l.region} ${l.postalCode}`);
  return (
    <section className="bg-midnight py-24 md:py-36" aria-labelledby="visit-title">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading as={headingAs} kicker="Visit" title={<span id="visit-title">Find us at Hollywood Park.</span>} sub="Steps from SoFi Stadium and minutes from LAX." />
          <div className="reveal mt-10 grid gap-6 sm:grid-cols-2">
            {locations.map((loc) => (
              <address key={loc.id} className="not-italic">
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice">{loc.name}</p>
                <p className="mt-2 text-snow">
                  {loc.streetAddress}, {loc.suite}
                  <br />
                  {loc.locality}, {loc.region} {loc.postalCode}
                </p>
              </address>
            ))}
          </div>
          <dl className="reveal mt-8 grid gap-4 text-snow sm:grid-cols-2">
            <div>
              <dt className="text-sm text-mist">Hours</dt>
              <dd>
                Every day, {clock(l.hours[0].open)} – {clock(l.hours[0].close)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mist">Call</dt>
              <dd>
                <a href={telHref(l.phoneE164)} className="inline-flex min-h-11 items-center hover:text-ice">
                  {l.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-mist">Parking</dt>
              <dd>
                <NeedsConfirm>Parking details for Hollywood Park Shops</NeedsConfirm>
              </dd>
            </div>
          </dl>
          <div className="reveal mt-9 flex flex-wrap gap-3">
            <Button href={`https://www.google.com/maps/dir/?api=1&destination=${dest}`} external variant="ghost" icon="Navigation">
              Get directions
            </Button>
            <Button href="/book" icon="ArrowRight">
              Book your suite
            </Button>
          </div>
        </div>
        <div className="reveal overflow-hidden rounded-card border border-steel">
          <MapArt />
        </div>
      </Container>
    </section>
  );
}

/* ---------------- 14 · FAQ ---------------- */
export function FaqSection() {
  return (
    <section className="bg-frost-bg py-24 text-ink md:py-36" aria-labelledby="faq-title">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading tone="light" kicker="Good to know" title={<span id="faq-title">Questions, answered.</span>} />
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-2">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="Plus" className="size-5 shrink-0 text-glacier-deep transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="pb-5 text-ink-soft">{f.confirm ? <NeedsConfirm tone="light">{f.a.replace("NEEDS CLIENT CONFIRMATION — ", "")}</NeedsConfirm> : f.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- 15 · Final CTA ---------------- */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-28 text-center md:py-40" aria-labelledby="cta-title">
      <Image src={heroWide1280} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_50%,rgb(10_14_22/0.6),#0a0e16)]" />
      <Container>
        <div className="reveal mx-auto -mb-6 w-[min(340px,70vw)]">
          <Emblem level={1} className="aspect-square w-full" />
        </div>
        <p className="kicker reveal text-ice">Your suite is ready</p>
        <h2 id="cta-title" className="h-display reveal mt-6 text-[clamp(2.6rem,8vw,5.5rem)]">
          Ready to get iced?
        </h2>
        <p className="reveal mx-auto mt-5 max-w-lg text-lg text-mist">Pick your service, pick your time — every price and deposit shown before you confirm.</p>
        <div className="reveal mt-9 flex justify-center">
          <Button href="/book" icon="ArrowRight">
            Book your suite
          </Button>
        </div>
        <div className="mt-10 flex justify-center">
          <IcicleDivider />
        </div>
      </Container>
    </section>
  );
}
