import type { Metadata } from "next";
import {
  getAboutPageContent,
  getCitiesBySlugs,
  getCounts,
  getSiteReviews,
  getTravelTips,
} from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import WelcomeMarquee from "@/components/WelcomeMarquee";
import AuthorBand from "@/components/AuthorBand";
import AIRoteiroBand from "@/components/AIRoteiroBand";
import { EasySimSlimBanner, RentcarsSlimBanner, SeguroViagemSlimBanner } from "@/components/AffiliateCallout";
import TravelTipsBand from "@/components/TravelTipsBand";
import SiteReviewsSection from "@/components/SiteReviewsSection";
import FaqSection from "@/components/home/FaqSection";
import TrendingDestinations from "@/components/home/TrendingDestinations";
import { buildOpenGraph } from "@/lib/metadata";
import JsonLd, { websiteLd } from "@/components/JsonLd";

export const revalidate = 60;

const TITLE = "Por Aqui Pelo Mundo: roteiros de viagem em família";
const DESCRIPTION =
  "Roteiros e dicas de Disney, Europa, Dubai e Brasil, visitados e avaliados pessoalmente por Rejane Abrantes. Viagem com crianças e casal, sem lista genérica.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function Home() {
  const [counts, siteReviews, about, tips, trendingCities] = await Promise.all([
    getCounts(),
    getSiteReviews(),
    getAboutPageContent(),
    getTravelTips(),
    getCitiesBySlugs(["orlando", "florianopolis", "gramado"]),
  ]);

  return (
    <main className="flex-1">
      <JsonLd data={websiteLd(DESCRIPTION)} />
      <HeroSection counts={counts} />
      <AuthorBand about={about} />
      <TrendingDestinations cities={trendingCities} />
      <TravelTipsBand tipCount={tips.length} />
      <AIRoteiroBand />
      <EasySimSlimBanner />
      <WelcomeMarquee />
      <RentcarsSlimBanner />
      <SeguroViagemSlimBanner />
      <SiteReviewsSection reviews={siteReviews} />
      <FaqSection />
    </main>
  );
}
