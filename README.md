# Playmaker Customizer

Phase 0 scaffold for the Playmaker Sports jersey customizer.

> **Status:** Phase 0 complete. The data → render loop is proven.
> Next: trace real vector art from Jake's mockups, then move into Phase 1A (marketing site skeleton).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## What's here

```
src/
├── types/jersey.ts          ← The architectural spine. JerseyDesign type +
│                              every customization axis from brief §4.2.
│                              Adding a new axis = add a field here, the
│                              compiler will tell you everywhere it needs
│                              to be wired up.
│
├── store/jerseyStore.ts     ← Zustand store. Single source of truth.
│                              The customizer UI, the AI chatbot, and the
│                              PDF export all read/write through here.
│
├── assets/templates/
│   └── jersey-front.svg     ← Starter SVG with named regions/slots.
│                              Naming contract:
│                                id="region-{key}" → recolored from
│                                  design.colors[key]
│                                id="slot-{slot}" → text/image inserted
│                                  from design.placements[slot]
│
├── components/
│   ├── JerseyCanvas.tsx     ← Renders the SVG, mutates by id on every
│   │                          design.revision bump. Pure DOM-driven SVG —
│   │                          Fabric.js comes in Phase 2 when we need
│   │                          drag/resize for placement content.
│   │
│   └── ControlPanel.tsx     ← Phase 0 plumbing UI. Exercises every store
│                              action so the loop is provable. NOT the real
│                              customizer UI — that's Phase 2A.
│
└── App.tsx                  ← Demo page. Brand-themed header + canvas + panel.
```

## The architectural rule (do not break)

**Every mutation goes through the Zustand store.** No component owns its own copy of design state. The UI controls write to the store; the canvas reads from it. The AI chatbot will write to the same store via structured `<design_update>` JSON. The PDF export will serialize from it. This is what keeps the system coherent as features are added.

If you're tempted to put state into `useState` in a customizer component, stop. Put it in `jerseyStore` instead.

## Naming contracts (don't break these either)

The SVG templates and the TypeScript types share name keys. Change one, you must change the other:

| TS type field | SVG id |
|---|---|
| `colors.base` | `id="region-base"` |
| `colors.accent` | `id="region-collar"`, `id="region-sleeve-*"` (when contrast mode) |
| `bodyPattern === 'pinstripe'` | `id="overlay-pinstripe"` (toggled visible) |
| `placements['jersey-front-center']` | `id="slot-jersey-front-center"` |
| `placements['jersey-front-lower-left']` | `id="slot-jersey-front-lower-left"` |
| ...etc. | one slot per `PlacementSlot` value |

## What's intentionally not done yet

- **Real vector art.** The current `jersey-front.svg` is a placeholder built from rough paths. Trace from the Laffy mockups (or get a designer to) before any client review.
- **Other 6 garment views.** Only `jersey-front` exists. Phase 2A adds back, cap × 2, pants × 3.
- **Fabric.js overlay layer.** Pure DOM-driven SVG is enough for Phase 0. Fabric goes on top once we need draggable/resizable logos in Phase 2.
- **AI chatbot.** Phase 2B.
- **PDF export.** Phase 2B. Validate vendor compatibility *before* shipping.
- **Roster CSV import, save/resume, mobile responsive pass.** Phases 2A → 2C.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3 (brand palette in `tailwind.config.js`)
- Zustand 5
- Fabric.js 6 (installed; not yet used — Phase 2)
- Google Fonts: Anton (display), Inter (body), Oswald (athletic numbers)

## Brand tokens

Configured in `tailwind.config.js`:

| Class | Hex | Use |
|---|---|---|
| `bg-brand-yellow` | `#F5C842` | Primary CTA, brand block |
| `bg-brand-black` | `#111111` | Headings, primary text |
| `bg-brand-white` | `#FFFFFF` | Backgrounds, "PLAY" wordmark |
| `bg-athletic-navy` | `#1A2B5C` | Common jersey color, dark accents |
| `bg-athletic-cream` | `#E8D89A` | Throwback / vintage accents |

> Hex values are visual reads from the rasterized logo PDF. Replace with exact values from the source vector before final lock.
