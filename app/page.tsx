import type { Metadata } from "next";
import {
  getAboutPageContent,
  getCountries,
  getCounts,
  getSiteReviews,
  getTravelTips,
} from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import WelcomeMarquee from "@/components/WelcomeMarquee";
import AuthorBand from "@/components/AuthorBand";
import AIRoteiroBand from "@/components/AIRoteiroBand";
import { EasySimSlimBanner, RentcarsSlimBanner, SeguroViagemSlimBanner } from "@/components/AffiliateCallout";
import TravelTipsBand from "@/components/TravelTipsBand";
import SiteReviewsSection from "@/components/SiteReviewsSection";
import { buildOpenGraph } from "@/lib/metadata";
import JsonLd, { websiteLd } from "@/components/JsonLd";

export const revalidate = 60;

const TITLE = "Roteiros de viagem em família feitos por quem esteve lá";
const DESCRIPTION =
  "Roteiros e dicas de Disney, Europa, Dubai e Brasil, visitados e avaliados pessoalmente por Rejane Abrantes. Viagem com crianças e casal, sem lista genérica.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function Home() {
  const [countries, counts, siteReviews, about, tips] = await Promise.all([
    getCountries(),
    getCounts(),
    getSiteReviews(),
    getAboutPageContent(),
    getTravelTips(),
  ]);

  const publishedCountries = countries.filter(
    (country) => country.status === "published",
  );
  const comingSoonCountries = countries.filter(
    (country) => country.status === "draft",
  );

  return (
    <main className="flex-1">
      <JsonLd data={websiteLd(DESCRIPTION)} />
      <HeroSection counts={counts} />
      <DestinationGrid
        countries={publishedCountries}
        comingSoonCountries={comingSoonCountries}
      />
      <AuthorBand
        authorName={about.author_name}
        authorPhotoUrl={about.author_photo_url}
      />
      <TravelTipsBand tipCount={tips.length} />
      <EasySimSlimBanner />
      <AIRoteiroBand />
      <WelcomeMarquee />
      <RentcarsSlimBanner />
      <SeguroViagemSlimBanner />
      <SiteReviewsSection reviews={siteReviews} />
    </main>
  );
}
