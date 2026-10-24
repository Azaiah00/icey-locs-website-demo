"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { gallery, type GalleryItem } from "@/data/gallery";
import { team } from "@/data/team";
import { cn } from "@/lib/format";
import { workSrc } from "@/lib/images";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "locs", label: "Locs" },
  { id: "style", label: "Styles" },
  { id: "braids", label: "Braids" },
  { id: "kids", label: "Kids" },
  { id: "barber", label: "Barber" },
] as const;

const byName = (id: GalleryItem["by"]) => (id ? team.find((t) => t.id === id)?.name.split(" ")[0] : null);

/** Blue-backdrop shots lead (house look); warm shots get the ice duotone. */
const ordered = [...gallery].sort((a, b) => (a.backdrop === "blue" ? 0 : 1) - (b.backdrop === "blue" ? 0 : 1));

export function Gallery({ limit, filters = true }: { limit?: number; filters?: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState<number | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const items = useMemo(() => {
    const f = filter === "all" ? ordered : ordered.filter((g) => g.tags.includes(filter as GalleryItem["tags"][number]));
    return limit ? f.slice(0, limit) : f;
  }, [filter, limit]);

  return (
    <div>
      {filters ? (
        <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="group" aria-label="Filter gallery">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "min-h-11 shrink-0 rounded-pill border px-5 text-sm font-medium transition-colors",
                filter === f.id ? "border-ice bg-ice-bright text-midnight" : "border-ice/20 text-mist hover:border-ice/50 hover:text-snow",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      ) : null}
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((g, i) => (
          <li key={g.file} className="reveal" style={{ ["--d" as string]: `${(i % 4) * 60}ms` }}>
            <button
              type="button"
              onClick={() => {
                if (g.backdrop !== "blue" && window.matchMedia("(pointer: coarse)").matches && tapped !== g.file) {
                  setTapped(g.file);
                  return;
                }
                setOpen(ordered.indexOf(g));
              }}
              className={cn("group relative block size-full overflow-hidden rounded-img bg-slate", g.backdrop !== "blue" && "duotone")}
              data-revealed={tapped === g.file}
              aria-label={`Open photo: ${g.caption || g.alt}`}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image src={workSrc(g)} alt={g.alt} fill sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              {g.caption || g.by ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent p-3 pt-10 text-left text-xs text-snow opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {g.caption || `By ${byName(g.by)}`}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} /> : null}
    </div>
  );
}

function Lightbox({ index, onClose, onIndex }: { index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const g = ordered[index];
  const ref = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);
  const prev = useCallback(() => onIndex((index - 1 + ordered.length) % ordered.length), [index, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % ordered.length), [index, onIndex]);

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      last?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab" && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>("button"));
        const first = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[70] flex flex-col bg-midnight/96 backdrop-blur"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between p-3 sm:p-5">
        <p className="text-sm text-mist">
          {index + 1} / {ordered.length}
        </p>
        <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-pill text-snow hover:bg-ice/10" aria-label="Close photo viewer">
          <Icon name="X" className="size-6" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <Image key={g.file} src={workSrc(g)} alt={g.alt} fill sizes="100vw" className="object-contain" quality={85} />
      </div>
      <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
        <button type="button" onClick={prev} className="grid size-12 place-items-center rounded-pill border border-ice/30 text-snow hover:bg-ice/10" aria-label="Previous photo">
          <Icon name="ArrowLeft" className="size-5" />
        </button>
        <p className="text-center text-sm text-snow">
          {g.caption || g.alt}
          {g.by ? <span className="block text-mist">by {byName(g.by)}</span> : null}
        </p>
        <button type="button" onClick={next} className="grid size-12 place-items-center rounded-pill border border-ice/30 text-snow hover:bg-ice/10" aria-label="Next photo">
          <Icon name="ArrowRight" className="size-5" />
        </button>
      </div>
    </div>
  );
}
