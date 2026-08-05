import DestinationGrid from "@/components/DestinationGrid";

const photo = (fill: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23${fill}'/%3E%3C/svg%3E`;

const countries = [
  { id: "1", slug: "portugal", name: "Portugal", cover_image_url: photo("C1653A") },
  { id: "2", slug: "italia", name: "Itália", cover_image_url: photo("4A5D43") },
  { id: "3", slug: "japao", name: "Japão", cover_image_url: photo("2B2620") },
] as any;

export function WithCountries() {
  return <DestinationGrid countries={countries} />;
}

export function Empty() {
  return <DestinationGrid countries={[]} />;
}
