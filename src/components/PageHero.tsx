import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { Container } from "@/components/ui";
import { breadcrumb, ld } from "@/lib/schema";

export function PageHero({
  kicker,
  title,
  sub,
  crumbs,
  children,
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night-grad pb-16 pt-14 md:pb-24 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumb(crumbs))} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/texture/frost-1280.webp')] bg-cover bg-left-bottom opacity-[0.18] mix-blend-screen" aria-hidden />
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-mist">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-snow">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <Icon name="ChevronRight" className="size-3.5" />
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-snow">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="inline-flex min-h-11 items-center hover:text-snow">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="kicker mt-10 text-ice">{kicker}</p>
        <h1 className="h-display mt-5 max-w-4xl text-balance text-[clamp(2.1rem,10.5vw,5.25rem)]">{title}</h1>
        {sub ? <p className="mt-6 max-w-2xl text-lg text-mist">{sub}</p> : null}
        {children}
        <div className="led-line led-sweep mt-10 w-40" />
      </Container>
    </section>
  );
}
