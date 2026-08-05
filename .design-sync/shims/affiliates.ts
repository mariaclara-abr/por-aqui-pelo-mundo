// design-sync build shim for @/lib/affiliates — identical to the real module
// except the two env reads are guarded with `typeof process`, since the bare
// `process` global doesn't exist in a standalone esbuild bundle (no Next.js
// env inlining) and throws on load, before any component even renders.
// Keep this in sync with lib/affiliates.ts if that file's logic changes.
export type AffiliateProgramId =
  | "booking"
  | "getyourguide"
  | "safetywing"
  | "travelsim"
  | "rentcars";

export interface AffiliateLocation {
  cityName: string;
  countryName?: string;
}

export interface AffiliateProgram {
  id: AffiliateProgramId;
  label: string;
  checklistLabel: string;
  attractionCtaLabel?: string;
  isConfigured: boolean;
  buildUrl?: (location: AffiliateLocation) => string;
}

const bookingAffiliateId =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID : undefined;
const getYourGuidePartnerId =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID : undefined;

export const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
  {
    id: "booking",
    label: "Booking.com",
    checklistLabel: "Hotel",
    attractionCtaLabel: "Hospedagem próxima",
    isConfigured: !!bookingAffiliateId,
    buildUrl: ({ cityName, countryName }) =>
      `https://www.booking.com/searchresults.html?aid=${bookingAffiliateId}&ss=${encodeURIComponent(
        [cityName, countryName].filter(Boolean).join(", "),
      )}`,
  },
  {
    id: "getyourguide",
    label: "GetYourGuide",
    checklistLabel: "Ingressos e passeios",
    attractionCtaLabel: "Ingressos e passeios por aqui",
    isConfigured: !!getYourGuidePartnerId,
    buildUrl: ({ cityName }) =>
      `https://www.getyourguide.com/s/?q=${encodeURIComponent(cityName)}&partner_id=${getYourGuidePartnerId}`,
  },
  {
    id: "safetywing",
    label: "SafetyWing",
    checklistLabel: "Seguro viagem",
    isConfigured: false,
  },
  {
    id: "travelsim",
    label: "TravelSIM",
    checklistLabel: "eSIM",
    isConfigured: false,
  },
  {
    id: "rentcars",
    label: "Rentcars",
    checklistLabel: "Aluguel de carro",
    isConfigured: false,
  },
];

export function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
