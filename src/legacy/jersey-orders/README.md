# Jersey order stack (parked)

The Phase 1B jersey storefront: a Sheet-driven product catalog, a product modal with
"buy", a team inquiry form, and a roster upload. No route has rendered any of it since
`88b5f06` (2026-07-08), when `/apparel` was rebuilt around the accessory catalog and
jerseys became a "Coming Soon" panel.

It is kept, not deleted, for when jerseys return.

## Status

- **Not bundled.** Nothing outside this folder imports it, and an ESLint rule forbids
  anything outside `src/legacy/` from doing so. Vite never includes it in the site.
- **Still type-checked and linted**, so a breaking change to a shared component shows up.
- **Its write endpoints are switched off.** `submit-order` and `submit-purchase` in
  `netlify/functions/` return 410 unless `LEGACY_JERSEY_ORDERS=on`. `get-catalog` is still
  deployed and read-only. The `/api/*` redirects for all three were removed in PR 14, so
  they only answer at `/.netlify/functions/<name>`.

## Contents

| File | What it is |
| --- | --- |
| `components/JerseyCatalog.tsx` | Product cards, carousels, skeleton for a `Product[]` |
| `components/ProductDetailModal.tsx` | Product modal; POSTs `/api/submit-purchase` |
| `components/ApparelInquiryForm.tsx` | Team inquiry; POSTs `/api/submit-order` (`type: inquiry`) |
| `components/PlayerUploadForm.tsx` | Roster upload; POSTs `/api/submit-order` (`type: roster`) |
| `jerseyCards.tsx` | Static jersey card data, style options, sizes |
| `types.ts` | `Product`, `ProductCategory` (mirrors `netlify/functions/get-catalog.ts`) |

## Reviving it

1. Route a component from `src/features/apparel/`, moving what's needed into that feature.
2. Re-check the `Catalog` tab and the `SalesOrders` / `Archive` / `CustomerContacts` column
   layouts against `docs/reference/sheets-schema.md`, because functions map columns by index.
3. Move the request/response shapes into `shared/`, as `contact.ts` does.
4. Set `LEGACY_JERSEY_ORDERS=on` in Netlify and restore the three `[[redirects]]` blocks in
   `netlify.toml` (`/api/get-catalog`, `/api/submit-order`, `/api/submit-purchase`).
5. Delete this folder once nothing is left in it.
