import { Tour } from "@/types/tour";

// Backup text used only if the server breaks. To change the real text, edit backend/src/data instead
export const tours: Tour[] = [
  {
    slug: "sigiriya-day-tour",
    name: "Sigiriya Day Tour",
    duration: "Full Day (approx. 10–12 hours)",
    pickupTime: "[PICKUP TIME]",
    description:
      "Visit the iconic Sigiriya Rock Fortress, a UNESCO World Heritage Site, in a comfortable air-conditioned vehicle with a private driver for the day.",
    highlights: [
      "Climb Sigiriya Rock Fortress",
      "Ancient frescoes and Mirror Wall",
      "Views over the Central Province lowlands",
      "Optional stop at a local village or spice garden",
    ],
    included: [
      "Private air-conditioned transport",
      "Experienced driver",
      "Hotel pickup and drop-off",
    ],
    startingPrice: "[TOUR PRICE]",
    image: "/images/tours/sigiriya.jpg",
  },
  {
    slug: "galle-day-tour",
    name: "Galle Day Tour",
    duration: "Full Day (approx. 8–10 hours)",
    pickupTime: "[PICKUP TIME]",
    description:
      "Explore the historic Galle Fort along Sri Lanka's south coast, with time to enjoy colonial architecture, boutique shops, and ocean views.",
    highlights: [
      "Galle Fort ramparts and lighthouse",
      "Dutch colonial streets and architecture",
      "Coastal scenery along the southern coastline",
      "Optional beach stop",
    ],
    included: [
      "Private air-conditioned transport",
      "Experienced driver",
      "Hotel pickup and drop-off",
    ],
    startingPrice: "[TOUR PRICE]",
    image: "/images/tours/galle.jpg",
  },
  {
    slug: "kandy-day-tour",
    name: "Kandy Day Tour",
    duration: "Full Day (approx. 10–12 hours)",
    pickupTime: "[PICKUP TIME]",
    description:
      "Discover the cultural capital of Sri Lanka, home to the Temple of the Sacred Tooth Relic and scenic hill-country views.",
    highlights: [
      "Temple of the Sacred Tooth Relic",
      "Kandy Lake and city viewpoint",
      "Botanical gardens (optional)",
      "Scenic hill-country drive",
    ],
    included: [
      "Private air-conditioned transport",
      "Experienced driver",
      "Hotel pickup and drop-off",
    ],
    startingPrice: "[TOUR PRICE]",
    image: "/images/tours/kandy.jpg",
  },
  {
    slug: "custom-tour",
    name: "[TOUR NAME] — Custom Tour",
    duration: "[TOUR DURATION]",
    pickupTime: "[PICKUP TIME]",
    description:
      "A placeholder package for an additional tour. Replace this entry in src/data/tours.ts with a real itinerary, e.g. Yala Safari, Nuwara Eliya, or Ella.",
    highlights: ["[HIGHLIGHT 1]", "[HIGHLIGHT 2]", "[HIGHLIGHT 3]"],
    included: [
      "Private air-conditioned transport",
      "Experienced driver",
      "Hotel pickup and drop-off",
    ],
    startingPrice: "[TOUR PRICE]",
    image: "/images/tours/custom.jpg",
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
