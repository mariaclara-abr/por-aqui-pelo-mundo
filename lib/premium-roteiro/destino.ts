// Destino mostrado na cena da tela de geração: o globo gira até a primeira cidade e
// pinta de terracota os países da viagem. Não usa a IA: vem só do cadastro.

import { createAdminClient } from "@/lib/supabase-admin";

export interface DestinoCena {
  // Cidades da viagem, na ordem em que o viajante as listou.
  cidades: { nome: string; pais: string; lat: number; lng: number }[];
  // Códigos ADM0_A3 (Natural Earth) dos países da viagem; os que não existem no
  // mapa 110m (Mônaco, Ilhas Cayman) ficam de fora e o globo destaca só a cidade.
  paises: string[];
}

// slug do país no site -> código ADM0_A3 do mapa do globo (public/geo/paises-110m.json).
const A3: Record<string, string> = {
  alemanha: "DEU", argentina: "ARG", belgica: "BEL", brasil: "BRA", chile: "CHL",
  "emirados-arabes": "ARE", espanha: "ESP", "estados-unidos": "USA", franca: "FRA",
  grecia: "GRC", guatemala: "GTM", holanda: "NLD", india: "IND", inglaterra: "GBR",
  italia: "ITA", jamaica: "JAM", mexico: "MEX", panama: "PAN", paraguai: "PRY",
  peru: "PER", "porto-rico": "PRI", portugal: "PRT", suica: "CHE", uruguai: "URY",
};

export async function montarDestino(citySlugs: string[]): Promise<DestinoCena | null> {
  const admin = createAdminClient();
  const { data: cidades } = await admin
    .from("cities")
    .select("id, slug, name, latitude, longitude, countries(slug, name)")
    .in("slug", citySlugs);
  if (!cidades?.length) return null;

  const saida: DestinoCena["cidades"] = [];
  const paises = new Set<string>();
  for (const slug of citySlugs) {
    const c = cidades.find((row) => row.slug === slug);
    if (!c) continue;
    const pais = Array.isArray(c.countries) ? c.countries[0] : c.countries;
    let lat = c.latitude;
    let lng = c.longitude;
    if (lat == null || lng == null) {
      // Cidade sem coordenada própria: usa o centro das atrações cadastradas nela.
      const { data: atracoes } = await admin
        .from("attractions")
        .select("latitude, longitude")
        .eq("city_id", c.id)
        .not("latitude", "is", null);
      if (!atracoes?.length) continue;
      lat = atracoes.reduce((s, a) => s + Number(a.latitude), 0) / atracoes.length;
      lng = atracoes.reduce((s, a) => s + Number(a.longitude), 0) / atracoes.length;
    }
    saida.push({ nome: c.name, pais: pais?.name ?? "", lat: Number(lat), lng: Number(lng) });
    if (pais && A3[pais.slug]) paises.add(A3[pais.slug]);
  }
  return saida.length ? { cidades: saida, paises: [...paises] } : null;
}
