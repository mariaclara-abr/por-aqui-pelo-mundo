// design-sync build shim for next/navigation — the real hooks read from a
// Next.js App Router context (and internal process.env.__NEXT_* flags) that
// don't exist outside a live Next app and throw on load. These no-op stand-ins
// let components render in a static "on a content page, no query params"
// state — deliberately NOT "/" so Header's isHome-gated title link renders
// (a more representative default preview than the bare homepage state).
export function usePathname(): string {
  return "/portugal/lisboa";
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useRouter() {
  return {
    push() {},
    replace() {},
    back() {},
    forward() {},
    refresh() {},
    prefetch() {},
  };
}
