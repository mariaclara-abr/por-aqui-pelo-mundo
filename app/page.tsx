import type { Metadata } from "next";
import {
  getAboutPageContent,
  getCountries,
  getCounts,
  getSiteReviews,
} from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import WelcomeMarquee from "@/components/WelcomeMarquee";
import AuthorBand from "@/components/AuthorBand";
import AIRoteiroBand from "@/components/AIRoteiroBand";
import SiteReviewsSection from "@/components/SiteReviewsSection";
import HomeFooterBand from "@/components/HomeFooterBand";
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
  const [countries, counts, siteReviews, about] = await Promise.all([
    getCountries(),
    getCounts(),
    getSiteReviews(),
    getAboutPageContent(),
  ]);

  return (
    <main className="flex-1">
      <HeroSection counts={counts} />
      <DestinationGrid countries={countries} />
      <AIRoteiroBand />
      <WelcomeMarquee />
      <AuthorBand
        authorName={about.author_name}
        authorPhotoUrl={about.author_photo_url}
      />
      <SiteReviewsSection reviews={siteReviews} />
      <HomeFooterBand />
    </main>
  );
}
