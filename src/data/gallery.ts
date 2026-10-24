/**
 * Real client work — Icey Locs' own GlossGenius portfolio (18 photos) + iceylocs.com images.
 * Captions are theirs, verbatim (empty caption => we write a neutral alt only, no invented claims).
 * Files land in /public/images via `npm run assets:fetch` (scripts/fetch-assets.mjs).
 * Many of their photos are shot on the salon's signature blue backdrop — group those first;
 * the warm-background shots get the "ice duotone" treatment (DESIGN.md §Photo treatment).
 */
export interface GalleryItem {
  file: string; // /public path
  src: string; // original remote URL (for re-fetching)
  caption: string; // their caption, verbatim ("" if none)
  alt: string;
  by: "icey" | "lele" | "shane" | null;
  tags: ("locs" | "retwist" | "style" | "braids" | "kids" | "extensions" | "barber" | "repair")[];
  backdrop: "blue" | "warm" | "neutral";
}

const P = "https://static.glossgenius.com/public/portfolioimage/";

export const gallery: GalleryItem[] = [
  { file: "/images/work/01-mini-loc-spa-triangle-parts.jpg", src: P + "0fee53836ebe26373aff0cb81cccfe2f81181a53/image/fa1f5e94148f425d1826b106a0cba97c.jpeg", caption: "Mini Loc Spa - Triangle Parts by Icey", alt: "Young child with fresh retwisted locs and clean triangle parts on a blue backdrop", by: "icey", tags: ["kids", "locs", "retwist"], backdrop: "blue" },
  { file: "/images/work/02-loc-style-overhead.jpg", src: P + "917519bd60479e80013522820f8c13ca046804e3/image/d18224f0868cc14bebcdada7811a2e69.jpeg", caption: "", alt: "Overhead view of a fresh loc retwist and two-strand loc style", by: null, tags: ["locs", "style"], backdrop: "blue" },
  { file: "/images/work/03-two-strand-loc-style.jpg", src: P + "3cd0412dee782baa4e98914eb314274c4335e45a/image/d5e593d67c7fa71aa8ec38591a61a217.jpeg", caption: "", alt: "Two-strand loc style with crisp square parts", by: null, tags: ["locs", "style"], backdrop: "neutral" },
  { file: "/images/work/04-four-straight-back-braids.jpg", src: P + "b5fb410a5b0d9e9bb55f00e873affa5c571fc978/image/3f6bc040d02eba8d5898adc86ddde114.jpeg", caption: "4 straight back braids by Lele Scurry", alt: "Man with four straight-back braids", by: "lele", tags: ["braids"], backdrop: "neutral" },
  { file: "/images/work/05-flat-twist-mohawk.jpg", src: P + "8623dbd84769ab74809fe26f3810c714dd1a270c/image/36748828cf684636a66ad86a0800b7a4.jpeg", caption: "Flat Twist Mohawk", alt: "Locs styled into a flat twist mohawk", by: null, tags: ["locs", "style"], backdrop: "warm" },
  { file: "/images/work/06-retwist.jpg", src: P + "deefa62cc479f6359e576ad7ddc1e26ee0f614c7/image/c81828e8889ae0469b737978a8c031ae.jpeg", caption: "Retwist", alt: "Fresh loc retwist with clean parts, overhead view", by: null, tags: ["locs", "retwist"], backdrop: "neutral" },
  { file: "/images/work/07-zig-zag-braids.jpg", src: P + "2c8e49c18d44caa7aa0817166b002ed52218e2bd/image/92d2dfb792ad33fefa680c5f755eac41.jpeg", caption: "Zig Zag Braids by Lele Scurry", alt: "Zig-zag braid design", by: "lele", tags: ["braids"], backdrop: "warm" },
  { file: "/images/work/08-flat-twist-two-strand.jpg", src: P + "194ae759c32650e6e4c283ca82c75f9fae66a7d1/image/2df1b877853a9afb134e7a1ac7978be6.jpeg", caption: "Flat Twist 2-Strand", alt: "Locs styled in flat twist two-strand rows", by: null, tags: ["locs", "style"], backdrop: "warm" },
  { file: "/images/work/09-long-loc-retwist-back.jpg", src: P + "ee70d55d2d10cab7b0653ef9b12081e4e84c80b6/image/470c5938020b1fde66790c449cfb27b8.jpeg", caption: "", alt: "Back view of long locs after a retwist", by: null, tags: ["locs", "retwist"], backdrop: "blue" },
  { file: "/images/work/10-two-strand-twist.jpg", src: P + "77df3157965f2a7d2001d0756be5e381a8361d11/image/bfe65c67505e89126418f5b84855625a.jpeg", caption: "2 Strand Twist", alt: "Locs styled in a two-strand twist", by: null, tags: ["locs", "style"], backdrop: "blue" },
  { file: "/images/work/11-braids-designed-by-lele.jpg", src: P + "7b337280386c24624737d24e1fa79db3e4da66a9/image/3ae2f6839d26cbd24b745f6104c5c7c4.jpeg", caption: "Braids designed by Lele Scurry", alt: "Curved braid design", by: "lele", tags: ["braids"], backdrop: "warm" },
  { file: "/images/work/12-custom-braids-lele.jpg", src: P + "7365d31ae505c9341d9f24184210e630ac43759f/image/80edfcc5f0724d4f97e60bf3a96d08d8.jpeg", caption: "Custom Braids by Lele Scurry", alt: "Custom curved braids", by: "lele", tags: ["braids"], backdrop: "warm" },
  { file: "/images/work/13-loc-extensions-icey.jpg", src: P + "d51079490dceca6e4c15a5b7b0d5fb783f985899/image/ea21fe4d597a125e0040c471a4e34e1c.jpeg", caption: "Loc Extensions by Icey Scurry", alt: "Long loc extensions with blended color", by: "icey", tags: ["locs", "extensions"], backdrop: "warm" },
  { file: "/images/work/14-custom-braids-lele.jpg", src: P + "9a0fc417dc37bcbd489b9b494661df784afe389f/image/2dd998781e6924bec55f0dda413224df.jpeg", caption: "Custom Braids by LeLe", alt: "Custom feather-pattern braid design", by: "lele", tags: ["braids"], backdrop: "blue" },
  { file: "/images/work/15-loc-style-crisscross.jpg", src: P + "d317763b70d36045254008e1d4fe8d87897ce527/image/7735b53bc39fec53233131b9b0c73b46.jpeg", caption: "", alt: "Criss-cross loc style, overhead view", by: null, tags: ["locs", "style"], backdrop: "blue" },
  { file: "/images/work/16-loc-updo.jpg", src: P + "ec167387f412e3ed3fb3cdb35d1846a1fcacd23f/image/1535850a76c5d1526e7717960fede64f.jpeg", caption: "", alt: "Loc updo with styled front sections", by: null, tags: ["locs", "style"], backdrop: "blue" },
  { file: "/images/work/17-full-service.jpg", src: P + "f3e9b492867c97564dafdf44155252f8f2bc70c7/image/6ce2c4d81eb5a6efc416efd6eab7693d.jpeg", caption: "Full Service ( Loc Bath - Retwist - Style - Cut )", alt: "Full service result: loc bath, retwist, style and cut", by: null, tags: ["locs", "retwist", "style", "barber"], backdrop: "neutral" },
  { file: "/images/work/18-cut-by-shane.jpg", src: P + "ed5a8966e13e799b189272279293b23261bfaec9/image/9ab5fca8b59b316b05254edfcddd61e0.jpeg", caption: "Cut by Shane", alt: "Fresh haircut with a sharp line up", by: "shane", tags: ["barber"], backdrop: "blue" },
  // iceylocs.com gallery shots (all on the signature blue backdrop)
  { file: "/images/work/19-loc-style-blue.jpg", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/IMG_2553%203.jpg", caption: "", alt: "Loc style with clean parts on the signature blue backdrop", by: null, tags: ["locs", "style"], backdrop: "blue" },
  { file: "/images/work/20-locs-and-cut-1.jpg", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/View%20recent%20photos%203.png", caption: "", alt: "Fresh locs with a sharp taper and line up", by: null, tags: ["locs", "barber"], backdrop: "blue" },
  { file: "/images/work/21-locs-and-cut-2.jpg", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/View%20recent%20photos%204.png", caption: "", alt: "Side view of locs with a taper and line up", by: null, tags: ["locs", "barber"], backdrop: "blue" },
  { file: "/images/work/22-loc-plaits-taper.jpg", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/View%20recent%20photos%205.png", caption: "", alt: "Loc plaits with a clean taper", by: null, tags: ["locs", "style", "barber"], backdrop: "blue" },
];

/** Brand + space assets (not client work). */
export const brandAssets = {
  suitePortrait: { file: "/images/space/suite-portrait.jpg", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/6228FBE7-D812-4FF1-AB19-33240E398C3F.png", note: "Their suite image from iceylocs.com — appears to be a design render. Swap for a real suite photo when shot." },
  lounge: { file: "/images/space/lounge.jpg", src: "https://static.glossgenius.com/public/salon/4dba5e18cc7f529b7bb5d6a48a5cd358d1d285ab/website_cover_image/d174467a4dfbf39bf77bcdc35cda4733.png", note: "GlossGenius cover image (waiting lounge, navy chairs)." },
  monogramIL: { file: "/images/brand/il-monogram.png", src: "https://img1.wsimg.com/isteam/ip/76ae318b-0e20-47e9-873d-7a6068505903/9E246A90-6220-4453-A165-DC36DB3DD73B%202.PNG", note: "Icy chrome 'IL' varsity monogram (1024x1024)." },
  shaneMark: { file: "/images/team/shane-smith-mark.jpg", src: "https://static.glossgenius.com/public/user/1f37c58e62cfa4fbbbd9acfe0a012e238ab34fc3/avatar/7286bda0543b779a7e3e7da717b6a091.jpeg", note: "Shane's 'SS' ice monogram (his GlossGenius avatar)." },
  iceyAvatar: { file: "/images/team/icey-scurry.jpg", src: "https://static.glossgenius.com/public/user/f8b3c4bb8500a4dbbcf3e834d9855f53098dc942/avatar/c6c5058a4f0243319056a3ba581844ac.jpeg", note: "GlossGenius profile photo." },
  leleAvatar: { file: "/images/team/lele-scurry.jpg", src: "https://static.glossgenius.com/public/user/1f9c4851bed68ee67ce6973e1227cdb51a467faf/avatar/4a64e03946d66f4f35f9e47c67b22382.jpeg", note: "GlossGenius profile photo." },
  heroWide: { file: "/images/space/suite-wide.webp", src: "LOCAL (Kie.ai outpaint of suitePortrait, in /public already)", note: "16:9 desktop hero — AI-extended from their suite image; approval pending." },
  frost: { file: "/images/texture/frost.webp", src: "LOCAL (Kie.ai generated)", note: "Frost-glass texture for section backgrounds." },
} as const;
