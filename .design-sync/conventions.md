## Por Aqui Pelo Mundo — design conventions

"Diário de bordo" editorial travel style: quiet, photo-led, no gradients or generic
review-app chrome. Curation over crowds — star ratings are curatorial (1–5, never a
crowd average) and always render in terracota, never yellow/gold.

### No provider wrapper needed
Every synced component renders standalone — there is no root `ThemeProvider` or
similar to wrap. A few components (`Header`, and internals it composes) read from
React Context for auth/session state, but that Context has a safe default value, so
omitting a wrapper just renders the signed-out/default state, not an error.

### Styling idiom: Tailwind utility classes with this brand's custom names
Not generic Tailwind — the palette and type scale are custom tokens (from
`tailwind.config.ts`, shipped in `styles.css`). Use these names, not raw hex or
default Tailwind colors:

| Name | Class prefix | Hex | Use |
|---|---|---|---|
| Terracota | `terracota` (e.g. `bg-terracota`, `text-terracota`) | `#C1653A` | Primary actions, links, curation stars |
| Oliva | `oliva` | `#4A5D43` | Secondary text, tag/etiqueta labels |
| Areia | `areia` | `#F0E6D2` | Page/card background |
| Tinta | `tinta` | `#2B2620` | Primary text |
| Branco | `branco` | `#FFFFFF` | Alternate/card-on-areia background |

Typography: `font-serif` (Fraunces, via `--font-fraunces`) for titles and attraction
names; `font-sans` (Inter, via `--font-inter`, Tailwind's default) for body text,
buttons, nav. Corners are soft, never sharp or bubble-round: `rounded-lg`/`rounded-xl`
(cards, dialogs), `rounded-full` (pills, avatars, icon buttons) — avoid `rounded-sm`
or square corners on cards.

No box-shadows beyond `shadow-sm` (cards use it sparingly); no gradients except the
deliberate photo-legibility overlay on `DestinationCard` (`bg-gradient-to-t
from-black/65`) — don't reuse that pattern elsewhere, it's specific to text-over-photo
legibility, not a general decorative device.

### Where the truth lives
Read `styles.css` (imports the compiled `_ds_bundle.css` closure — every class above
is defined there) before styling. Each component's `.prompt.md` carries its
prop contract and a real usage example ported from this repo's own compositions.

### Build snippet
```jsx
<AttractionCard
  attraction={{
    id: "1", slug: "torre-de-belem", name: "Torre de Belém",
    category: "ponto_turistico", curation_rating: 5,
    attraction_photos: [{ url: "/photo.jpg", order: 0 }],
    attraction_tags: [{ tags: { id: "t1", name: "Imperdível", slug: "imperdivel" } }],
  }}
  countrySlug="portugal"
  citySlug="lisboa"
/>
```
For new layout glue (grids, section wrappers) that isn't one of the 17 shipped
components, follow the same idiom: `bg-areia`/`bg-branco` backgrounds, `font-serif`
headings in `text-tinta`, `oliva` for supporting copy, `terracota` for the one primary
action per section — never introduce a color outside this table.
