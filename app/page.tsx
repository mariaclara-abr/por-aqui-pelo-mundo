import { getCountries, getCounts, getHeroPhotos } from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";

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
