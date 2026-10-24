import type { Metadata } from "next";

/**
 * Link-preview card (iMessage, WhatsApp, Instagram DMs, Facebook, Slack, X, LinkedIn).
 * 1200x630 JPG (not WebP — some messengers won't render WebP previews). Built from the client's real work.
 * Paths are made absolute with `metadataBase` (SITE_URL) in app/layout.tsx.
 */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Icey Locs — Loc Spa in Inglewood: loc care, iced. Private loc suites at Hollywood Park.",
};

export const SITE_TITLE = "Icey Locs | Loc Spa & Loc Repair in Inglewood, CA";
export const SITE_DESCRIPTION =
  "Private loc suites at Hollywood Park, steps from SoFi Stadium. Retwists, loc repair, starter & instant locs, extensions and braids. Open daily 9–7.";

export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: "Icey Locs — Loc Spa",
  locale: "en_US",
  images: [OG_IMAGE],
};

export const baseTwitter: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  images: [OG_IMAGE],
};
