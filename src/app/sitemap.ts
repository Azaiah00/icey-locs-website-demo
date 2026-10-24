import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { SITE_URL } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/services", "/loc-repair", "/kids", "/barber-spa", "/gallery", "/team", "/reviews", "/visit", "/policies", "/book"];
  const svc = [...services.map((s) => `/services/${s.slug}`), "/services/refresh-your-crown", "/services/loc-detox"];
  return [...staticRoutes, ...svc].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/book" || p === "/services" ? 0.9 : 0.7 }));
}
