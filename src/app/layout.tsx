import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header, MobileBar } from "@/components/Header";
import { RevealObserver } from "@/components/motion";
import { FrostPopup } from "@/components/FrostPopup";
import { DemoTour } from "@/components/DemoTour";
import { SITE_URL } from "@/lib/schema";
import "./globals.css";

// Self-hosted variable fonts (SIL OFL) — no network at build time.
const league = localFont({
  src: "./fonts/LeagueSpartan-Variable.woff2",
  weight: "100 900",
  variable: "--font-league",
  display: "swap",
});

const archivo = localFont({
  src: "./fonts/Archivo-Variable.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Icey Locs | Loc Spa & Loc Repair in Inglewood, CA",
    template: "%s | Icey Locs",
  },
  description:
    "Private loc suites at Hollywood Park, steps from SoFi Stadium. Retwists, loc repair, starter & instant locs, extensions and braids. Open daily 9–7.",
  openGraph: {
    type: "website",
    siteName: "Icey Locs — Loc Spa",
    locale: "en_US",
    images: [{ url: "/images/space/suite-wide-1280.webp", width: 1280, height: 714, alt: "The Icey Locs private loc spa suite" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0e16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${league.variable} ${archivo.variable}`}>
      <body className="min-h-dvh antialiased">
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <FrostPopup />
        <DemoTour />
        <RevealObserver />
      </body>
    </html>
  );
}
