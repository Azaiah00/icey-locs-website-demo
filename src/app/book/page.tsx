import type { Metadata } from "next";
import { Suspense } from "react";
import { Booker } from "@/components/booking/Booker";

export const metadata: Metadata = {
  title: "Book Your Suite",
  description:
    "Book Icey Locs online: pick your service, add-ons, pro and time with every price, deposit and duration shown up front. Loc Spa and Barber Spa, Inglewood.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] px-5 py-16 text-mist sm:px-8 lg:px-12">Loading booking…</div>}>
      <Booker />
    </Suspense>
  );
}
