# Design-sync notes for Por Aqui Pelo Mundo

## Repo shape
This is a full Next.js (App Router) application, not a standalone component-library
package. There is no `dist/`, no exported `.d.ts`, no `main`/`module`/`exports` in
`package.json`. The converter runs in **synth-entry mode**, scanning `components/`
directly for PascalCase exports (`cfg.srcDir: "components"`, anchored via a
nonexistent `--entry` path so `resolveDistEntry` falls through to synth).

## Scope decision (confirmed with user)
Only presentational, non-backend-wired components are synced (17 total). Excluded
via `componentSrcMap: null` (they still bundle fine as private deps of included
components that import them internally, e.g. Header -> NavDrawer/AuthStatus — just
not exposed as standalone top-level DS components):
LoginForm, SignupForm, AuthStatus, NavDrawer, AvatarUploader, ItinerarySwitcherDialog,
RelatedContent, RoteiroButton, RoteiroMap, ShareItineraryDialog, SharedItineraryMap,
all of admin/* (including AboutPageForm — see below), attraction/QuestionsSection,
itinerary-ai/*, itinerary-chat/*, perfil/*.

**Re-sync risk**: this exclusion list is a hand-maintained enumeration, not a
pattern (e.g. "everything under admin/"). A new backend-wired component dropped
directly into `components/` (not a subdirectory) would need a new manual exclusion
entry, or it slips into the synced set. Mid-sync during this very run, a new file
`components/admin/AboutPageForm.tsx` appeared on disk (the user was actively working
in another window) and got auto-discovered before it was added to the exclusion list
— caught via `package-validate`'s component count jumping from 17 to 18 with an
unauthored floor card. **On every re-sync: diff the discovered component count
against 17 and investigate any new name before assuming it's fine.**

## cssEntry is a content-hashed build artifact — RE-SYNC RISK
`cfg.cssEntry` points at `.next/static/chunks/2lb_ipzckfdyr.css`, produced by
`npm run build` (Turbopack). This filename is content-hashed and WILL change on
every rebuild. Before any re-sync: run `npm run build` fresh, then
`grep -l terracota .next/static/chunks/*.css` to find the current filename (the
correct chunk has `@font-face` for Fraunces/Inter AND the `terracota`/`oliva`
Tailwind utilities — a sibling chunk is Leaflet's CSS, irrelevant since map
components are excluded from scope) and update `cfg.cssEntry` before building.

## Next.js / build-environment shims (`.design-sync/shims/`, wired via `cfg.tsconfig`)
The repo's components assume they run inside a live Next.js app; a standalone
esbuild bundle has none of that. Fixed via `.design-sync/tsconfig.dsbuild.json`
path-mapping bare specifiers to hand-written stand-ins (a supported, non-forking
technique — esbuild's tsconfig-paths resolution isn't limited to `@/` aliases):
- `next/link` → plain `<a>` wrapper (`shims/next-link.tsx`).
- `next/navigation` → no-op `usePathname`/`useRouter`/`useSearchParams`
  (`shims/next-navigation.ts`). `usePathname` deliberately returns
  `"/portugal/lisboa"`, not `"/"`, so Header's `isHome`-gated title link renders —
  a more representative default than the bare homepage state.
- `@/lib/supabase` → chainable no-op Proxy (`shims/supabase.ts`). The real module
  constructs a real Supabase client **at module scope** from
  `process.env.NEXT_PUBLIC_SUPABASE_*`, which throws (`process is not defined`) in
  a browser bundle with no Next.js env inlining — and it's reachable transitively
  via `HeroSection`/`HeroPhotoStack`/`RoteiroIndicator` → `@/lib/queries` →
  `@/lib/supabase`, not just NavDrawer.
- `@/lib/affiliates` → same file, real logic, but the two `process.env` reads
  guarded with `typeof process !== "undefined"`. **Keep this in sync with
  `lib/affiliates.ts` if that file's logic changes** — it's a duplicated copy, not
  a re-export, specifically because `AffiliateCallout`'s visual output depends on
  its real values (unlike the supabase stub, which is never actually invoked in a
  static preview's default render state).

Without these, `package-validate` failed with `ReferenceError: process is not
defined` on literally every component (one shared `_ds_bundle.js` IIFE — if any
bundled module throws during initial evaluation, ALL 17 previews fail identically,
not just the one that imports the offending module). If a Next.js version bump or
new component changes these assumptions, re-diagnose via the render-check
`firstErr` messages before touching the shims.

## Forked lib: `.design-sync/overrides/source-kit.mjs` (declared in `cfg.libOverrides`)
The bundled synth-entry writer uses bare `export * from "<file>"` for every source
file. Per the ES module spec, `export *` **never** re-exports a `default` binding —
and every component here is `export default function <Name>()`. Result: the
`[BUNDLE_EXPORT]` gate failed with "17/17 not a component on window.<Global>" even
though the render check reported everything "clean" (it was silently rendering only
the typographic floor-card fallback for all 17, since none of the real components
existed on the global at all). The fork also adds `export { default as <Name> }
from "<file>"` for every file **whose basename matches a non-excluded component
name** (checked against `componentSrcMap` and `isComponentName` at entry-generation
time) — restricting this to in-scope names keeps ~29 excluded backend/admin files
from being force-bundled just for being re-exported (bundle size: 3085 KB
force-including everything → 1288 KB scoped correctly).
**If this repo's components ever stop using `export default function <Name>()`
matching the filename, this fork's `basenameOf` assumption breaks.**

## dtsPropsFor: all 17 components have hand-written prop types
Ts-morph's auto-extraction produced generic `{[key: string]: unknown}` for every
component, because none of them declare a named `Props` type — they all use inline
destructured object-literal parameter types (e.g. `function X({ a, b }: { a: T; b:
T })`), which the extractor doesn't resolve into a named interface. Hand-written via
`cfg.dtsPropsFor` for accurate design-agent-facing contracts. **If a component's
real prop signature changes, update the matching `dtsPropsFor` entry — it will NOT
auto-sync from source.**

## Supabase-wired components composed inside included ones
`Header` composes `NavDrawer` and `AuthStatus` internally (both excluded as
standalone DS components but still transitively bundled as Header's private deps).
These read Supabase auth context via `useAuth()` (`@/lib/auth`), which uses React
Context with a safe default value (`{user: null, loading: true}` when no
`AuthProvider` wraps the tree) — so they render in a logged-out/loading skeleton
state without crashing, since `createClient()` is only invoked from user-triggered
handlers (sign-out), never on initial render. No shim was needed for `@/lib/auth`
itself.

## Known render/capture limitation: ConfirmDialog (fixed-position overlay)
`ConfirmDialog` is `position: fixed; inset: 0` with `flex items-center
justify-center` — centers against the true browser viewport. In BOTH
`package-validate`'s full-page smoke screenshot and `package-capture`'s per-story
review capture, the dialog renders visibly clipped at the top (message text cut
off) regardless of the declared `viewport` size in `cfg.overrides.ConfirmDialog`
(tried both the 900x700 single-mode default and an explicit 400x300 — identical
clipping either way). This appears to be a fundamental interaction between
`fullPage`-style screenshot capture and true `position: fixed` content when the
rest of the page has no normal-flow height. **This is graded "good" anyway** — the
real DOM/component is correct (verified by reading the visible text/buttons); only
the isolated capture tool's geometry is off. When the Claude Design agent actually
builds with this component inside a real page, it centers correctly against that
page's real viewport, just as it does in the live app. Don't re-litigate this on a
future sync without new evidence — the two `viewport` values already tried ruled
out "just set a bigger viewport" as the fix.

## Re-sync risks (forward-looking)
- The hashed cssEntry filename (see above) — the single biggest thing that goes
  stale on every rebuild.
- The four hand-written shims in `.design-sync/shims/` could drift from the real
  Next.js/Supabase APIs on a version bump.
- `@/lib/affiliates` shim is a duplicated copy of real logic (not a re-export) —
  will silently drift if the real file changes.
- The `componentSrcMap` exclusion list is a hand enumeration, not a pattern —
  new backend-wired files need manual exclusion (see AboutPageForm above).
- `dtsPropsFor` entries are hand-written and won't auto-track real prop changes.
- Preview authoring assumed a signed-out/no-router-context rendering state for
  Header, AttractionCard, etc. — if real behavior meaningfully changes in
  authenticated or active-route states, previews won't reflect that.
- `AffiliateCallout`'s "attraction" variant was deliberately NOT authored: it only
  renders configured affiliate programs, and `NEXT_PUBLIC_BOOKING_*`/
  `NEXT_PUBLIC_GETYOURGUIDE_*` aren't set in this build sandbox, so it returns
  `null`. Only the "checklist" variant (shows all programs, configured or not) is
  authored. Real credentials in the build env would make "attraction" authorable.
- `SearchBox` and `RoteiroIndicator` are composed inside a plain header-bar div for
  visual context rather than showing interactive open/expanded states, since their
  real state comes from internal `useState`/Context this static capture can't drive.
