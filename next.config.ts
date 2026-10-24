import type { NextConfig } from "next";

/*
 * Icey Locs — App Router. Netlify builds with @netlify/plugin-nextjs (no publish dir).
 * Real client photos are served from their own GlossGenius + GoDaddy CDNs through the
 * Next image optimizer until `npm run assets:fetch` self-hosts them (NEXT_PUBLIC_LOCAL_IMAGES=1).
 */
const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "static.glossgenius.com", pathname: "/public/**" },
      { protocol: "https", hostname: "img1.wsimg.com", pathname: "/isteam/ip/**" },
    ],
  },
};

export default nextConfig;
