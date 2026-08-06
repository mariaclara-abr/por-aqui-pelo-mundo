import type { Metadata } from "next";
import {
  getCountries,
  getCounts,
  getHeroPhotos,
  getSiteReviews,
} from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import SiteReviewsSection from "@/components/SiteReviewsSection";
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
  const [countries, counts, heroPhotos, siteReviews] = await Promise.all([
    getCountries(),
    getCounts(),
    getHeroPhotos(),
    getSiteReviews(),
  ]);

  return (
    <main className="flex-1">
      <HeroSection photos={heroPhotos} counts={counts} />
      <DestinationGrid countries={countries} />
      <SiteReviewsSection reviews={siteReviews} />
    </main>
  );
}
