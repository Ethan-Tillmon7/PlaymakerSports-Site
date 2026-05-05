/**
 * JerseyDesign — the architectural spine of the customizer.
 *
 * Per the Master Context Brief §4.2, every variation observed in the Laffy
 * mockups maps to one of the axes below. The customizer UI, the AI chatbot
 * (via structured <design_update> JSON), and the PDF export all read from
 * and write to the same JerseyDesign object held in the Zustand store.
 *
 * Adding a new customization axis means: (1) add the field here, (2) the
 * compiler will tell you everywhere it needs to be handled, (3) add an SVG
 * region or text overlay to support it. That's the discipline.
 */

// ─── Color ──────────────────────────────────────────────────────────────────
// Hex color string. We keep it as a branded string to make intent obvious
// at call sites and to allow future validation without changing the type.
export type HexColor = `#${string}`;

// ─── Garment & view ─────────────────────────────────────────────────────────
export type GarmentType = 'jersey' | 'cap' | 'pants';

export type GarmentView =
  | 'jersey-front'
  | 'jersey-back'
  | 'cap-front'
  | 'cap-back'
  | 'pants-front'
  | 'pants-back'
  | 'pants-side';

// All seven views the PDF export needs, per brief §4.1.
export const ALL_VIEWS: readonly GarmentView[] = [
  'jersey-front',
  'jersey-back',
  'cap-front',
  'cap-back',
  'pants-front',
  'pants-back',
  'pants-side',
] as const;

// ─── Style axes (from brief §4.2) ───────────────────────────────────────────
export type JerseyStyle = 'pullover' | 'full-button';

export type SleeveTreatment =
  | 'solid'
  | 'contrast'   // sleeves a different color than the body
  | 'ringer'     // colored band at the cuff
  | 'banded';    // multiple horizontal bands

export type BodyPattern =
  | 'solid'
  | 'pinstripe'
  | 'horizontal-stripe-panel'  // the throwback gradient-stripes look
  | 'gradient-fade';

export type PantAccent = 'plain' | 'side-stripe' | 'waistband-contrast';

// ─── Typography (player-facing — wordmark, name, number) ────────────────────
export type WordmarkStyle = 'script' | 'block' | 'condensed-block';

export type NumberFontStyle =
  | 'block-outlined'   // the canonical "athletic" look from the mockups
  | 'block-shadow'
  | 'modern-flat';

// ─── Placement slots (from brief §4.3) ──────────────────────────────────────
// Anywhere the customizer can place a logo, patch, or graphic.
export type PlacementSlot =
  | 'jersey-front-center'        // large script wordmark area
  | 'jersey-front-lower-left'    // small number or patch
  | 'jersey-front-body-graphic'  // large silhouette / state icon
  | 'jersey-back-upper'          // NAME
  | 'jersey-back-center'         // NUMBER
  | 'cap-front-center'           // primary logo
  | 'cap-back-bottom'            // small number
  | 'pants-back-waistband'       // small logo
  | 'pants-side-seam';           // stripe

export interface PlacementContent {
  /**
   * Discriminator — what kind of content lives in this slot.
   * 'text' covers wordmarks, names, numbers.
   * 'image' covers uploaded logos and patches.
   * 'graphic' covers built-in silhouettes (state icons, etc.).
   */
  kind: 'text' | 'image' | 'graphic';
  text?: string;
  imageUrl?: string;
  graphicId?: string;            // e.g. 'louisiana-with-L'
  fillColor?: HexColor;
  outlineColor?: HexColor;
  /** Rough scale 0–2; 1 is the SVG slot's natural size. */
  scale?: number;
}

// ─── Color slots ────────────────────────────────────────────────────────────
// These map 1:1 to named regions in the SVG templates. The SVG file has
// elements with id="region-base", id="region-accent", etc., and the
// renderer recolors them by id from this object.
export interface ColorScheme {
  base: HexColor;        // primary garment color
  accent: HexColor;      // sleeves, stripes, secondary
  outline: HexColor;     // number outlines, trim
  text: HexColor;        // name and number fill
}

// ─── Roster ─────────────────────────────────────────────────────────────────
export interface RosterEntry {
  id: string;
  name: string;          // appears on jersey-back-upper
  number: string;        // appears on jersey-back-center & cap-back-bottom
  size?: 'YS' | 'YM' | 'YL' | 'AS' | 'AM' | 'AL' | 'AXL' | 'A2XL';
}

// ─── The full design object ─────────────────────────────────────────────────
export interface JerseyDesign {
  /** Stable id; used for save/resume and for the eventual filename. */
  id: string;

  /** Human-readable name e.g. "Lafayette Tigers — 2026". */
  teamName: string;

  /** Style axes. */
  jerseyStyle: JerseyStyle;
  sleeveTreatment: SleeveTreatment;
  bodyPattern: BodyPattern;
  pantAccent: PantAccent;

  /** Color scheme — applied to all garment views. */
  colors: ColorScheme;

  /** Typography choices for player-facing text. */
  wordmarkStyle: WordmarkStyle;
  numberFontStyle: NumberFontStyle;

  /**
   * Slot-keyed placement content. A slot may be absent (slot empty) or
   * present with content. The renderer iterates this map per view.
   */
  placements: Partial<Record<PlacementSlot, PlacementContent>>;

  /** Team roster — drives per-player NAME/NUMBER on the back. */
  roster: RosterEntry[];

  /** Internal — bumped on every mutation, useful for change detection. */
  revision: number;
}

// ─── A sensible starting design ─────────────────────────────────────────────
// Used as the initial Zustand state. Mirrors a "Lafayette navy pinstripe"
// aesthetic from page 1 of the LaffyLittleLeagueFINALOptions deck.
export const INITIAL_DESIGN: JerseyDesign = {
  id: 'design-001',
  teamName: 'Lafayette',
  jerseyStyle: 'pullover',
  sleeveTreatment: 'solid',
  bodyPattern: 'pinstripe',
  pantAccent: 'side-stripe',
  colors: {
    base: '#FFFFFF',
    accent: '#1A2B5C',  // athletic navy
    outline: '#F5C842', // brand yellow
    text: '#1A2B5C',
  },
  wordmarkStyle: 'script',
  numberFontStyle: 'block-outlined',
  placements: {
    'jersey-front-center': {
      kind: 'text',
      text: 'Lafayette',
      fillColor: '#1A2B5C',
    },
    'jersey-front-lower-left': {
      kind: 'text',
      text: '55',
      fillColor: '#1A2B5C',
      outlineColor: '#F5C842',
    },
    'jersey-back-upper': {
      kind: 'text',
      text: 'NAME',
      fillColor: '#1A2B5C',
    },
    'jersey-back-center': {
      kind: 'text',
      text: '55',
      fillColor: '#1A2B5C',
      outlineColor: '#F5C842',
    },
  },
  roster: [],
  revision: 0,
};
