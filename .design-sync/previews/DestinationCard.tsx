import DestinationCard from "@/components/DestinationCard";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23C1653A'/%3E%3C/svg%3E";

export function WithImage() {
  return (
    <div className="w-72 bg-branco p-6">
      <DestinationCard href="/portugal/lisboa" name="Lisboa" imageUrl={PLACEHOLDER_IMG} />
    </div>
  );
}

export function WithoutImage() {
  return (
    <div className="w-72 bg-branco p-6">
      <DestinationCard href="/portugal/porto" name="Porto" imageUrl={null} />
    </div>
  );
}
