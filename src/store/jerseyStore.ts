import { create } from 'zustand';
import type {
  JerseyDesign,
  PlacementSlot,
  PlacementContent,
  ColorScheme,
  RosterEntry,
} from '../types/jersey';
import { INITIAL_DESIGN } from '../types/jersey';

/**
 * The customizer store. This is the architectural spine of the app —
 * the canvas reads from it, the AI chatbot writes to it via structured
 * <design_update> JSON, and the PDF export serializes from it.
 *
 * Discipline: never mutate `design` from outside; always go through an
 * action below. That's what gives us a single audit trail.
 */
interface JerseyStore {
  design: JerseyDesign;

  // ── Coarse-grained replacement (used by AI chatbot for full-design
  //    updates and by save/resume) ────────────────────────────────────────
  setDesign: (design: JerseyDesign) => void;
  applyPartial: (patch: Partial<JerseyDesign>) => void;

  // ── Fine-grained actions (used by the manual UI controls) ──────────────
  setColors: (colors: Partial<ColorScheme>) => void;
  setTeamName: (name: string) => void;
  setBodyPattern: (pattern: JerseyDesign['bodyPattern']) => void;
  setSleeveTreatment: (s: JerseyDesign['sleeveTreatment']) => void;
  setJerseyStyle: (style: JerseyDesign['jerseyStyle']) => void;

  setPlacement: (slot: PlacementSlot, content: PlacementContent | null) => void;

  // ── Roster ─────────────────────────────────────────────────────────────
  addRosterEntry: (entry: RosterEntry) => void;
  removeRosterEntry: (id: string) => void;
  setRoster: (roster: RosterEntry[]) => void;

  // ── Reset ──────────────────────────────────────────────────────────────
  reset: () => void;
}

/** Bump the revision counter on every mutation. */
const bump = (d: JerseyDesign): JerseyDesign => ({
  ...d,
  revision: d.revision + 1,
});

export const useJerseyStore = create<JerseyStore>((set) => ({
  design: INITIAL_DESIGN,

  setDesign: (design) => set({ design: bump(design) }),

  applyPartial: (patch) =>
    set((s) => ({ design: bump({ ...s.design, ...patch }) })),

  setColors: (colors) =>
    set((s) => ({
      design: bump({
        ...s.design,
        colors: { ...s.design.colors, ...colors },
      }),
    })),

  setTeamName: (name) =>
    set((s) => ({ design: bump({ ...s.design, teamName: name }) })),

  setBodyPattern: (bodyPattern) =>
    set((s) => ({ design: bump({ ...s.design, bodyPattern }) })),

  setSleeveTreatment: (sleeveTreatment) =>
    set((s) => ({ design: bump({ ...s.design, sleeveTreatment }) })),

  setJerseyStyle: (jerseyStyle) =>
    set((s) => ({ design: bump({ ...s.design, jerseyStyle }) })),

  setPlacement: (slot, content) =>
    set((s) => {
      const next = { ...s.design.placements };
      if (content === null) {
        delete next[slot];
      } else {
        next[slot] = content;
      }
      return { design: bump({ ...s.design, placements: next }) };
    }),

  addRosterEntry: (entry) =>
    set((s) => ({
      design: bump({ ...s.design, roster: [...s.design.roster, entry] }),
    })),

  removeRosterEntry: (id) =>
    set((s) => ({
      design: bump({
        ...s.design,
        roster: s.design.roster.filter((r) => r.id !== id),
      }),
    })),

  setRoster: (roster) =>
    set((s) => ({ design: bump({ ...s.design, roster }) })),

  reset: () => set({ design: INITIAL_DESIGN }),
}));
