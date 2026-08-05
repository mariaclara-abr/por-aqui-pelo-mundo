// Função pura, sem dependência de client/server do Supabase — usada tanto no
// browser (lib/roteiro.tsx) quanto no servidor (lib/itinerary-ai.ts) pra
// decidir se uma atração de um novo país pode entrar num roteiro que já tem
// atrações de outro país. Roteiros vazios aceitam qualquer país; contas
// Premium não têm esse limite.
export function canAddCountryToItinerary(
  existingCountrySlugs: string[],
  newCountrySlug: string,
  isPremium: boolean,
): boolean {
  if (isPremium) return true;
  const distinct = new Set(existingCountrySlugs);
  return distinct.size === 0 || distinct.has(newCountrySlug);
}
