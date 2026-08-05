import HeroSection from "@/components/HeroSection";

const photo = (fill: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23${fill}'/%3E%3C/svg%3E`;

const photos = [
  { url: photo("C1653A"), alt: "Rua de Lisboa" },
  { url: photo("4A5D43"), alt: "Praia do Algarve" },
  { url: photo("2B2620"), alt: "Serra da Estrela" },
];

export function WithCounts() {
  return (
    <HeroSection
      photos={photos}
      counts={{ countries: 3, cities: 12, attractions: 87 }}
    />
  );
}

export function WithoutCounts() {
  return <HeroSection photos={photos} counts={{ countries: 0, cities: 0, attractions: 0 }} />;
}
