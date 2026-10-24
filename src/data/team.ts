/**
 * Team — names, roles and handles from GlossGenius staff data + the @iceylocs Instagram bio
 * ("Owner / Loc Repair: @icey.xo · Loctician / Braider @stylezbylele · @iLbarberspa").
 * No bios are published anywhere: every `bio` is a NEEDS CLIENT CONFIRMATION placeholder.
 * Avatars are their real GlossGenius profile photos (downloaded by scripts/fetch-assets.mjs).
 */
import type { StaffId, LocationId } from "./services";

export interface TeamMember {
  id: StaffId;
  name: string;
  role: string;
  locations: LocationId[];
  instagram?: string;
  avatar: string; // local path after fetch-assets
  avatarIsLogo?: boolean;
  bio: string | null; // null => render <NeedsConfirm label="Bio" />
  specialties: string[];
  reviewCount: number; // GlossGenius reviews attributed to this pro (2026-10-23)
}

export const team: TeamMember[] = [
  {
    id: "icey",
    name: "Icey Scurry",
    role: "Owner · Loctician · Loc Repair Specialist",
    locations: ["loc-spa"],
    instagram: "icey.xo",
    avatar: "/images/team/icey-scurry.jpg",
    bio: null,
    specialties: ["Loc repair & restoration", "Crochet maintenance", "Interlock", "Wicks", "Loc extensions", "Instant locs"],
    reviewCount: 24,
  },
  {
    id: "lele",
    name: "Lele Scurry",
    role: "Loctician · Braider",
    locations: ["loc-spa"],
    instagram: "stylezbylele",
    avatar: "/images/team/lele-scurry.jpg",
    bio: null,
    specialties: ["Retwist & styling", "Loc detox", "Men's & kids' braids", "Custom braid designs"],
    reviewCount: 9,
  },
  {
    id: "shane",
    name: "Shane Smith",
    role: "Licensed Barber · Icey Locs Barber Spa",
    locations: ["barber-spa", "loc-spa"],
    instagram: "shvnervshvdd",
    avatar: "/images/team/shane-smith-mark.jpg",
    avatarIsLogo: true, // his GlossGenius avatar is his "SS" ice monogram, not a headshot — NEEDS REAL PHOTO
    bio: null,
    specialties: ["Precision cuts", "Line ups", "Tapers", "Beard grooming"],
    reviewCount: 1,
  },
];
