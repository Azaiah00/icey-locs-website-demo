import Image from "next/image";
import { gallery, type GalleryItem } from "@/data/gallery";
import { workSrc } from "@/lib/images";

function Row({ items, reverse }: { items: GalleryItem[]; reverse?: boolean }) {
  return (
    <div className="ribbon-row flex w-max gap-3 sm:gap-4" style={{ animation: `ribbon ${items.length * 4}s linear infinite${reverse ? " reverse" : ""}` }}>
      {[...items, ...items].map((g, i) => (
        <div key={`${g.file}-${i}`} className="relative h-44 w-36 shrink-0 overflow-hidden rounded-img bg-slate sm:h-64 sm:w-52" aria-hidden={i >= items.length || undefined}>
          <Image src={workSrc(g)} alt={i >= items.length ? "" : g.alt} fill sizes="(min-width:640px) 208px, 144px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/** Two infinite ribbons of her real work, drifting in opposite directions (CSS only). */
export function WorkRibbon() {
  const a = gallery.filter((_, i) => i % 2 === 0);
  const b = gallery.filter((_, i) => i % 2 === 1);
  return (
    <section aria-label="Recent work from the Icey Locs chair" className="ribbon-mask relative overflow-hidden bg-midnight py-10 sm:py-14">
      <div className="space-y-3 sm:space-y-4 [&:hover_.ribbon-row]:[animation-play-state:paused]">
        <Row items={a} />
        <Row items={b} reverse />
      </div>
    </section>
  );
}
