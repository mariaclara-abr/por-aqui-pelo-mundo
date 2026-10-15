import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase-admin";
import type { Aquarela } from "@/lib/premium-roteiro/docx";

// Aquarela pronta por país: public/aquarelas/NOMEDOPAIS_AQUARELA.webp, com o nome do
// país igual ao do endereço do site (grecia -> GRECIA, reino-unido -> REINO_UNIDO).
// País sem arquivo fica sem imagem: nunca se gera nem se busca outra.
export async function carregarAquarelas(origem: string, citySlugs: string[]): Promise<Aquarela[]> {
  const { data } = await createAdminClient()
    .from("cities")
    .select("slug, countries(slug)")
    .in("slug", citySlugs);
  const paises: string[] = [];
  for (const slug of citySlugs) {
    const c = data?.find((row) => row.slug === slug);
    const pais = Array.isArray(c?.countries) ? c.countries[0] : c?.countries;
    if (pais?.slug && !paises.includes(pais.slug)) paises.push(pais.slug);
  }

  const out: Aquarela[] = [];
  for (const slug of paises.slice(0, 3)) {
    const arquivo = `${slug.toUpperCase().replace(/-/g, "_")}_AQUARELA.webp`;
    try {
      const resposta = await fetch(`${origem}/aquarelas/${arquivo}`);
      if (!resposta.ok) continue;
      // Reduz antes de embutir: no Word ela aparece pequena (≈ 3 cm).
      const png = await sharp(Buffer.from(await resposta.arrayBuffer()))
        .resize({ width: 320 })
        .png()
        .toBuffer();
      const meta = await sharp(png).metadata();
      out.push({ data: png, largura: meta.width ?? 320, altura: meta.height ?? 480 });
    } catch {
      // Sem a imagem, o roteiro sai sem ela.
    }
  }
  return out;
}
