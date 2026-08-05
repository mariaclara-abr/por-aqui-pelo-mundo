// design-sync build shim for @/lib/supabase — the real module constructs a
// Supabase client at MODULE SCOPE from process.env.NEXT_PUBLIC_SUPABASE_*,
// which doesn't exist in a standalone esbuild bundle (no Next.js env inlining)
// and throws on load, before any component even renders. None of the synced
// previews trigger an actual query (the callers gate real fetches behind
// interaction/effects that don't fire in a static default render), so a
// chainable no-op is a safe stand-in — never a source of real data.
function chain(): any {
  return new Proxy(() => {}, {
    get(_target, prop) {
      if (prop === "then") return (resolve: (v: unknown) => unknown) => resolve({ data: [], error: null });
      return () => chain();
    },
    apply() {
      return chain();
    },
  });
}

export const supabase: any = { from: () => chain() };
