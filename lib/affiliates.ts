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
  // Rótulo usado no checklist "Antes de viajar" em /meu-roteiro.
  checklistLabel: string;
  // Rótulo usado na página de atração, quando difere do label do programa.
  attractionCtaLabel?: string;
  isConfigured: boolean;
  buildUrl?: (location: AffiliateLocation) => string;
}

const bookingAffiliateId = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID;
const getYourGuidePartnerId = process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID;

// Só Booking.com e GetYourGuide têm link real por enquanto (cobrem hospedagem
// e ingressos, as duas fontes de receita priorizadas). Os outros três ficam
// no checklist como "em breve": quando a conta de afiliado existir, basta
// setar a env var e trocar isConfigured/buildUrl aqui — nenhuma outra
// mudança de UI é necessária.
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
      `https://www.getyourguide.com/s/?q=${encodeURIComponent(
        cityName,
      )}&partner_id=${getYourGuidePartnerId}`,
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
