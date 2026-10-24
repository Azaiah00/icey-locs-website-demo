/**
 * Image source switch. By default the site renders the client's real photos straight from
 * their own GlossGenius / GoDaddy CDNs (optimized by next/image — see next.config.ts).
 * After `npm run assets:fetch`, set NEXT_PUBLIC_LOCAL_IMAGES=1 to serve the self-hosted copies.
 */
import { brandAssets, gallery, type GalleryItem } from "@/data/gallery";
import type { Service } from "@/data/services";

const LOCAL = process.env.NEXT_PUBLIC_LOCAL_IMAGES === "1";
const P = "https://static.glossgenius.com/public/portfolioimage/";

export const workSrc = (g: GalleryItem) => (LOCAL ? g.file : g.src);

export const serviceImg = (s: Service) => (s.photo ? workSrc(work(s.photo)) : LOCAL ? `/images/services/${s.id}.jpg` : s.glossGeniusImage);

/** Where to anchor a crop of the service photo — keeps the hair in frame. */
export const serviceFocus = (s: Service) => s.imageFocus ?? "50% 30%";

export const asset = (k: "suitePortrait" | "lounge" | "monogramIL" | "shaneMark" | "iceyAvatar" | "leleAvatar") =>
  LOCAL ? brandAssets[k].file : brandAssets[k].src;

/** Generated (Kie.ai) files that ship inside /public. */
export const heroWide = "/images/space/suite-wide.webp";
export const heroWide1280 = "/images/space/suite-wide-1280.webp";
export const heroPortrait = "/images/space/suite-portrait.webp";
export const frostTexture = "/images/texture/frost-1280.webp";

/** Pick a gallery photo by file number ("06") for section art direction. */
export const work = (n: string) => {
  const g = gallery.find((x) => x.file.includes(`/${n}-`));
  if (!g) throw new Error(`gallery item ${n} missing`);
  return g;
};

export const PORTFOLIO_PREFIX = P;
