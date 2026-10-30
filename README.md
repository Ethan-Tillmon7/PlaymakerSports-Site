# Playmaker Sports

Marketing site + jersey customizer for Playmaker Sports (React 19 + TypeScript + Vite, hosted on Netlify).

**Status:** Phase 1B complete. The full marketing site (Home, Events, Apparel, About, FAQ, Contact) is SSR-prerendered. Events come from Google Sheets or the Playmaker dashboard (Supabase) through Netlify Functions, and the Contact form writes to the Sheet and emails through Resend. Phase 2 (the real jersey customizer UI) hasn't started; `/customizer` is a Phase 0 proof of concept.

## Quick start

Use Node 20 (it matches Netlify).

```bash
npm ci
npm run dev                          # Vite at http://localhost:5173 (no functions; /api/* won't work)
netlify dev --offline --port 8888    # Vite + Netlify Functions at http://localhost:8888 (needs .env)
npm run build                        # type-check, build, SSR build, prerender
npm run lint                         # ESLint, including the import-boundary rules
```

Outside contributors: start with [CONTRIBUTING.md](CONTRIBUTING.md). It covers env vars, branching, review rules and house rules.

## Layout

| Path | What's there |
| --- | --- |
| `src/app/` | Entry points (`main.tsx`, `entry-server.tsx`), app shell and route table |
| `src/features/<page>/` | One folder per page: `<Name>Page.tsx` plus its own `components/`, `assets/` and helpers |
| `src/components/` | Feature-agnostic UI: `layout/`, `ui/`, `seo/` |
| `src/hooks/`, `src/lib/`, `src/stores/`, `src/config/` | Shared hooks, utilities, Zustand stores, site config and per-page meta |
| `src/assets/images/` | `brand/`, `misc/`, and `inventory/<category>/` (the Apparel catalog is built from these folders) |
| `src/legacy/jersey-orders/` | Parked jersey order stack: unrouted and lint-fenced |
| `shared/` | Zod schemas and types shared by the site and the functions |
| `netlify/functions/` | One file per endpoint; file names are public URLs |
| `netlify/lib/` | Function helpers: Sheets, Supabase, HTTP |
| `scripts/prerender.ts` | Build step that writes static HTML for every public route |
| `public/` | Static files served as-is |

## Documentation

Project docs live in `docs/`. The folder is git-ignored and shared with the team through Google Drive, so these links only resolve in a local checkout that has it. Start at [docs/README.md](docs/README.md), the index.

- [CLAUDE.md](CLAUDE.md): architecture, routing, design system, backend and working guidance (local; git-ignored)
- [DESIGN.md](DESIGN.md): canonical design spec (local; git-ignored)
- [docs/reference/playmaker-context-brief.md](docs/reference/playmaker-context-brief.md): full scope, phases and client decisions
- [docs/reference/sheets-schema.md](docs/reference/sheets-schema.md): Google Sheets column contract
- [docs/map/CLAUDE.md](docs/map/CLAUDE.md): system map (what each piece is, and what a change hits)
