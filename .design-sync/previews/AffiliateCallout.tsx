import AffiliateCallout from "@/components/AffiliateCallout";

// Only the "checklist" variant is authored: "attraction" only renders
// programs with a configured affiliate ID, and NEXT_PUBLIC_BOOKING_*/
// GETYOURGUIDE_* aren't set in this build sandbox (see @/lib/affiliates
// shim in .design-sync/shims — same guarded env reads as the real module),
// so it would render nothing here. Real credentials would light those
// entries up in a live deploy without any component change.
export function Checklist() {
  return (
    <div className="w-96 bg-areia p-6">
      <AffiliateCallout variant="checklist" location={{ cityName: "Lisboa", countryName: "Portugal" }} />
    </div>
  );
}
