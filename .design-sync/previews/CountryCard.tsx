import CountryCard from "@/components/CountryCard";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23C1653A'/%3E%3C/svg%3E";

const country = {
  id: "1",
  slug: "portugal",
  name: "Portugal",
  cover_image_url: PLACEHOLDER_IMG,
} as any;

export function Default() {
  return (
    <div className="w-72 bg-branco p-6">
      <CountryCard country={country} />
    </div>
  );
}
