import type { Metadata } from "next";
import { Suspense } from "react";
import { Studio } from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Icey Book Studio (Demo)",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Studio />
    </Suspense>
  );
}
