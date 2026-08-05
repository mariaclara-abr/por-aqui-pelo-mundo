import CurationRating from "@/components/CurationRating";

export function AllRatings() {
  return (
    <div className="flex flex-col gap-4 bg-branco p-6">
      {[5, 4, 3, 2, 1].map((rating) => (
        <CurationRating key={rating} rating={rating} />
      ))}
    </div>
  );
}

export function WithoutLabel() {
  return (
    <div className="flex items-center gap-6 bg-branco p-6">
      <CurationRating rating={5} showLabel={false} />
      <CurationRating rating={3} showLabel={false} />
    </div>
  );
}

export function SmallAlignedEnd() {
  return (
    <div className="flex w-64 justify-end bg-areia p-6">
      <CurationRating rating={4} size="sm" alignEnd />
    </div>
  );
}
