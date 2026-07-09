# Playmaker Sports

Marketing site + jersey customizer for Playmaker Sports (React 19 + TypeScript + Vite).

**Status:** Phase 1B complete — full marketing site (Home, Events, Apparel, About, FAQ, Contact) with SSR prerendering, live Google Sheets data via Netlify Functions, and RHF + Zod forms. Phase 2 (the real jersey customizer UI) is not yet started; `/customizer` is a Phase 0 proof-of-concept.

## Quick start

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
netlify dev       # Vite + Netlify Functions together at http://localhost:8888
npm run build     # type-check (tsc -b) + production build
npm run lint      # ESLint
```

`netlify dev` (not `npm run dev`) is required to exercise the Google Sheets functions locally. See `.env` requirements in [CLAUDE.md](CLAUDE.md).

## Documentation

Project docs live in [docs/](docs/) (git-ignored, local-only):

- [CLAUDE.md](CLAUDE.md) — architecture, routing, design system, backend, and working guidance
- [docs/md/playmaker-context-brief.md](docs/md/playmaker-context-brief.md) — full scope, phases, and client decisions
- [docs/md/design-system.md](docs/md/design-system.md) — canonical design spec
- [docs/md/sheets-schema.md](docs/md/sheets-schema.md) — Google Sheets column contract
