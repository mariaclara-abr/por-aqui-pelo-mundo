import Header from "@/components/Header";

// Header composes NavDrawer/AuthStatus (auth-context reads, no Provider here
// so they render their safe logged-out/loading defaults — see NOTES.md).
export function Default() {
  return <Header />;
}
