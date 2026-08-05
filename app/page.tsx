import type { Metadata } from "next";
import { getCountries, getCounts, getHeroPhotos } from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Roteiros de viagem com curadoria de quem esteve lá";
const DESCRIPTION =
  "Monte seu roteiro de viagem com atrações visitadas e avaliadas pessoalmente por Rejane Abrantes. Recomendações reais para famílias, sem lista genérica.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function Home() {
  const [countries, counts, heroPhotos] = await Promise.all([
    getCountries(),
    getCounts(),
    getHeroPhotos(),
  ]);

  return (
    <main className="flex-1">
      <HeroSection photos={heroPhotos} counts={counts} />
      <DestinationGrid countries={countries} />
    </main>
  );
}
