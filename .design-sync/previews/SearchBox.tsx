import SearchBox from "@/components/SearchBox";

// SearchBox has no controlled-open prop — its real default is the closed
// icon-button state, which reads as a bare tiny icon in isolation. Composed
// in the header icon row it actually ships in for visual context.
export function InHeaderBar() {
  return (
    <div className="flex items-center justify-end gap-3 bg-areia px-4 py-3">
      <SearchBox />
    </div>
  );
}
