import RoteiroIndicator from "@/components/RoteiroIndicator";

// RoteiroIndicator reads its item count from RoteiroContext (@/lib/roteiro),
// which isn't exported for mocking and whose real Provider does async
// Supabase/localStorage sync — too heavy for a static preview. This shows
// the component's real default (empty-roteiro) state, composed in the header
// icon row it actually ships in, so the icon reads in context rather than
// as a bare, tiny render.
export function InHeaderBar() {
  return (
    <div className="flex items-center justify-end gap-3 bg-areia px-4 py-3">
      <RoteiroIndicator />
    </div>
  );
}
