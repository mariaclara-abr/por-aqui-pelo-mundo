import type { Metadata } from "next";
import {
  getAboutPageContent,
  getCountries,
  getCounts,
  getHeroPhotos,
  getSiteReviews,
} from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import AuthorBand from "@/components/AuthorBand";
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
  const [countries, counts, heroPhotos, siteReviews, about] =
    await Promise.all([
      getCountries(),
      getCounts(),
      getHeroPhotos(),
      getSiteReviews(),
      getAboutPageContent(),
    ]);

  return (
    <main className="flex-1">
      <HeroSection photos={heroPhotos} counts={counts} />
      <DestinationGrid countries={countries} />
      <AuthorBand
        authorName={about.author_name}
        authorPhotoUrl={about.author_photo_url}
      />
      <SiteReviewsSection reviews={siteReviews} />
    </main>
  );
}
