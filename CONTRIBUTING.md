# Contributing

Using Claude Code or another AI assistant? Have it read this file before making changes.

## What this is

The marketing site for Playmaker Sports: Home, Events, Apparel, About, FAQ and Contact. `/customizer` is an early jersey proof of concept and not a public page.

- **Front end:** React 19 + TypeScript + Vite, styled with Tailwind. Every public page is prerendered to static HTML at build time, so it loads fast and search engines can read it.
- **Back end:** Netlify Functions. The Events page reads tournaments from a Google Sheet, or from the Playmaker dashboard (Supabase) when `EVENTS_SOURCE=supabase`. The Contact form writes to that same spreadsheet and sends email through Resend. The contact endpoint is rate limited (5 submissions per minute per IP); past that it answers 429 and the form shows a "too many tries" message.
- **Hosting:** Netlify. Every PR gets a deploy preview, and `main` is the live site.

## Where things live

| Path | What's there |
| --- | --- |
| `src/features/<page>/` | One folder per page: `<Name>Page.tsx` at the root, its components in `components/`, files only it imports in `assets/`, and its helpers |
| `src/components/` | UI shared across pages (`layout/`, `ui/`, `seo/`). No page-specific logic |
| `src/hooks/`, `src/lib/`, `src/stores/`, `src/config/` | Shared hooks, utilities, Zustand stores, site config and per-page meta tags |
| `src/assets/images/` | Photos. `inventory/<category>/` feeds the Apparel catalog: folder names must match `accessories.ts` exactly |
| `netlify/functions/` | One file per endpoint. File names are public URLs, so never rename them. `submit-contact.ts` is a Netlify **v2** function (`export default async (req: Request)`) that declares its own `path` and `rateLimit` in an exported `config`; the others are **v1** handlers reached through `/api/*` redirects in `netlify.toml` |
| `netlify/lib/` | Function helpers: `sheets.ts` (Google Sheets client, `appendRows`, `safecell`) `http.ts` (JSON responses and body parsing, with a v1 `event` flavour and a v2 `Request` flavour) and `supabase.ts` (one-fetch RPC call to the dashboard) |
| `shared/` | Types and zod validation shared by the site and the functions, e.g. the contact form schema |
| `public/` | Static files served as-is (favicons, `robots.txt`, `sitemap.xml`) |
| `src/legacy/` | Parked code that is kept but not used. Leave it alone |

Import rules are enforced by ESLint. Inside a feature, use relative imports. Across folders, use `@/…` (and `@shared/…` for `shared/`). One page can import from another page's folder only through its `index.ts`. If `npm run lint` flags an import, move the code; don't silence the rule.

**Naming:** components `PascalCase.tsx`, hooks `useThing.ts`, other modules `camelCase.ts`, and folders and asset files `kebab-case` (lowercase, no spaces).

## Running it

Use Node 20 (it matches Netlify).

```bash
npm ci            # install exact dependency versions
npm run dev       # UI at http://localhost:5173. No secrets needed, but /api/* calls won't work
npm run build     # type-check, build and prerender. Must pass before you open a PR
npm run lint      # ESLint. Must pass before you open a PR
```

Most copy, image and styling work only needs `npm run dev`.

The functions run under `netlify dev` (`netlify dev --offline --port 8888`, no Netlify login needed) and need these environment variables in a local `.env`. `netlify dev` does not enforce the contact rate limit; check that on a deploy preview.

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEETS_ID`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `EVENTS_SOURCE` (optional: `sheet`, the default, or `supabase`)
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` (only with `EVENTS_SOURCE=supabase`)

Ask Ethan for these values instead of guessing them. They point at the **live** spreadsheet and send **real** email, so don't submit the contact form locally unless Ethan has given you a test setup. Never commit `.env` or any key file.

## Making a change

1. Branch off `main`. Name it `fix/<slug>` or `feat/<slug>`.
2. Open a PR. The `CI` check (build + lint) must pass. Open the Netlify deploy preview and check your change there.
3. **Copy, images or styling:** merge it yourself once CI is green, then let Ethan know.
4. **Anything in `netlify/functions/`, `netlify/lib/` or `shared/`, the Google Sheets setup, or email:** request a review from @Ethan-Tillmon7 and wait for it. Don't self-merge.
5. **Never push to `main` directly.** Pushing to `main` deploys to the live site immediately.

## House rules

- **Sheets writes** go through `appendRows()` in `netlify/lib/sheets.ts`, with `safecell()` on every user-entered string. Never call `values.append` directly; without the right options, a write can overwrite existing rows.
- **New endpoints are v2 functions.** Copy the shape of `submit-contact.ts`: `export default async (req: Request)`, `jsonResponse`/`readJsonRequest` from `netlify/lib/http.ts`, and `export const config: Config = { path: '/api/<name>' }`. A v2 function with a `path` must not also get a `netlify.toml` redirect; a v1 function must. Leave the `rateLimit` on `submit-contact` as it is.
- **The Sheet is mapped by column position.** Never reorder, rename or insert columns in the middle of a tab the functions read or write.
- **User input in email HTML** goes through `esc()`.
- **Resend doesn't throw on failure.** It returns `{ error }`. Check it and log it.
- **Don't touch `src/legacy/`.**
- **Custom jerseys stay off the site.** Don't add jersey ordering, pricing or "custom jersey" copy to public pages.
- **Keep each page's meta tags and JSON-LD intact** (the `src/config/pageMeta.ts` entries and the `src/components/seo/` components). Don't add new pages without checking with Ethan first. A new route also needs prerender, sitemap and meta entries, or it ships as an empty page.
- **Design:** no drop shadows (elevation is a darker bottom border), and Anton headings are always uppercase. Yellow is for calls to action and highlights, not whole sections. Match what's already there.
- **Buttons** come from `<Button>` / `<ButtonLink>` in `src/components/ui/` (or `buttonClass()` for a plain `<a>`): variants `primary`, `secondary` and `ghost` (the transparent one for black backgrounds), sizes `sm`/`md`/`lg`/`xl`. Pair one yellow primary with a ghost, never two yellows.
- **Mono labels** use the `text-label` (11px) and `text-label-sm` (10px) tokens from `tailwind.config.js`, uppercase and tracked. 10px is the floor for the whole site and Inter body copy never goes under 13px; don't add smaller arbitrary sizes.
- **Touch:** every tap target is at least 44px (`h-11` / `min-h-11`), hover styles only apply on devices that hover, and every control has an `active:` state. Transitions name real CSS properties (`transition-colors`, `transition-[background-color,transform]`), never `transition-all`.
