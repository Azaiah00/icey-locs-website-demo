/**
 * JSON-LD generated from src/data only (docs/SEO.md). No aggregateRating / Review markup —
 * reviews are business-collected (GlossGenius) or Google-owned.
 */
import { business, locations } from "@/data/business";
import { faqs } from "@/data/faq";
import { fromPrice, services, type Service } from "@/data/services";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iceylocs.com").replace(/\/$/, "");

const hours = (locId: "loc-spa" | "barber-spa") =>
  locations
    .find((l) => l.id === locId)!
    .hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day[0].toUpperCase()}${h.day.slice(1)}`,
      opens: h.open,
      closes: h.close,
    }));

const address = (locId: "loc-spa" | "barber-spa") => {
  const l = locations.find((x) => x.id === locId)!;
  return {
    "@type": "PostalAddress",
    streetAddress: `${l.streetAddress}, ${l.suite}`,
    addressLocality: l.locality,
    addressRegion: l.region,
    postalCode: l.postalCode,
    addressCountry: l.country,
  };
};

const offer = (s: Service) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name: s.name, ...(s.description ? { description: s.description.replace(/\s+/g, " ").trim() } : {}) },
  price: fromPrice(s).toFixed(2),
  priceCurrency: "USD",
});

export function businessGraph() {
  const loc = locations[0];
  const sameAs = [`https://www.instagram.com/${business.instagram}/`, `https://www.facebook.com/${business.facebookId}`];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HairSalon",
        "@id": `${SITE_URL}/#loc-spa`,
        name: "Icey Locs — Loc Spa",
        url: SITE_URL,
        telephone: loc.phoneE164,
        email: loc.email,
        image: [`${SITE_URL}/images/space/suite-wide.webp`],
        priceRange: "$$",
        address: address("loc-spa"),
        geo: { "@type": "GeoCoordinates", latitude: business.geo.latitude, longitude: business.geo.longitude },
        openingHoursSpecification: hours("loc-spa"),
        areaServed: business.serviceArea.map((name) => ({ "@type": "City", name })),
        paymentAccepted: "Credit Card, Buy Now Pay Later",
        sameAs,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Loc Spa services",
          itemListElement: services.filter((s) => s.location === "loc-spa").map(offer),
        },
      },
      {
        "@type": "HairSalon",
        additionalType: "https://en.wikipedia.org/wiki/Barber",
        "@id": `${SITE_URL}/#barber-spa`,
        name: "Icey Locs Barber Spa",
        url: `${SITE_URL}/barber-spa`,
        telephone: locations[1].phoneE164,
        priceRange: "$$",
        address: address("barber-spa"),
        geo: { "@type": "GeoCoordinates", latitude: business.geo.latitude, longitude: business.geo.longitude },
        openingHoursSpecification: hours("barber-spa"),
        parentOrganization: { "@id": `${SITE_URL}/#loc-spa` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Barber Spa services",
          itemListElement: services.filter((s) => s.location === "barber-spa").map(offer),
        },
      },
    ],
  };
}

export function faqGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.confirm)
      .map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function serviceGraph(s: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    ...(s.description ? { description: s.description.replace(/\s+/g, " ").trim() } : {}),
    provider: { "@id": `${SITE_URL}/#${s.location}` },
    areaServed: business.serviceArea.map((name) => ({ "@type": "City", name })),
    url: `${SITE_URL}${path}`,
    offers: s.options.length ? s.options.map((o) => ({ "@type": "Offer", name: o.name, price: o.price.toFixed(2), priceCurrency: "USD" })) : [offer(s)],
  };
}

/** Safe JSON-LD serializer (escapes </script>). */
export const ld = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, "\\u003c") });
