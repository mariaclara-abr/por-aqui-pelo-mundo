export type AffiliateProgramId =
  | "booking"
  | "getyourguide"
  | "safetywing"
  | "easysim"
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
  // Rótulo do botão no checklist, quando difere de "Ver opções".
  checklistCtaLabel?: string;
  // Benefício exibido junto ao botão (ex: cupom de desconto).
  benefit?: string;
  isConfigured: boolean;
  buildUrl?: (location: AffiliateLocation) => string;
}

const bookingAffiliateId = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID;
const getYourGuidePartnerId = process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID;

// Booking.com, GetYourGuide e EasySim têm link real por enquanto. Os outros
// ficam no checklist como "em breve": quando a conta de afiliado existir,
// basta setar a env var e trocar isConfigured/buildUrl aqui, nenhuma outra
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
    id: "easysim",
    label: "EasySim",
    checklistLabel: "eSIM ou chip físico",
    attractionCtaLabel: "Internet no destino (eSIM ou chip físico)",
    checklistCtaLabel: "Comprar com desconto",
    benefit: "40% de desconto com o cupom Poraquipelomundo",
    isConfigured: true,
    // Link fixo e público da parceria, não depende do destino.
    buildUrl: () =>
      "https://www.easysim4u.com/?ref=HODESLJQ&utm_source=affiliate&utm_medium=referral&utm_campaign=poraquipelomundo&link_id=54",
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
