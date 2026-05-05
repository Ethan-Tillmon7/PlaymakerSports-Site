import { useJerseyStore } from '../store/jerseyStore';
import type {
  BodyPattern,
  SleeveTreatment,
  HexColor,
} from '../types/jersey';

/**
 * ControlPanel — Phase 0 plumbing. Every input writes to the Zustand
 * store, the canvas re-renders, the loop is proven.
 *
 * This is intentionally not the real customizer UI. The real UI is a
 * step-by-step wizard built in Phase 2A. This panel exists so we can
 * mash buttons during development and confirm nothing's wired wrong.
 */
export function ControlPanel() {
  const design = useJerseyStore((s) => s.design);
  const setColors = useJerseyStore((s) => s.setColors);
  const setBodyPattern = useJerseyStore((s) => s.setBodyPattern);
  const setSleeveTreatment = useJerseyStore((s) => s.setSleeveTreatment);
  const setPlacement = useJerseyStore((s) => s.setPlacement);
  const setTeamName = useJerseyStore((s) => s.setTeamName);
  const reset = useJerseyStore((s) => s.reset);

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
      <header className="border-b border-neutral-200 pb-3">
        <h2 className="text-2xl font-display tracking-wider">Controls</h2>
        <p className="text-xs text-neutral-500 font-body uppercase tracking-widest mt-1">
          Phase 0 · Round-trip test · revision {design.revision}
        </p>
      </header>

      {/* Team name → wordmark */}
      <Field label="Team name (wordmark)">
        <input
          type="text"
          value={design.placements['jersey-front-center']?.text ?? ''}
          onChange={(e) => {
            setTeamName(e.target.value);
            setPlacement('jersey-front-center', {
              kind: 'text',
              text: e.target.value,
              fillColor: design.colors.text,
            });
          }}
          className="w-full border border-neutral-300 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-yellow"
        />
      </Field>

      {/* Player number */}
      <Field label="Player number">
        <input
          type="text"
          value={design.placements['jersey-front-lower-left']?.text ?? ''}
          onChange={(e) =>
            setPlacement('jersey-front-lower-left', {
              kind: 'text',
              text: e.target.value,
              fillColor: design.colors.text,
              outlineColor: design.colors.outline,
            })
          }
          maxLength={3}
          className="w-24 border border-neutral-300 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-yellow"
        />
      </Field>

      {/* Color pickers */}
      <Field label="Colors">
        <div className="grid grid-cols-2 gap-3">
          <ColorInput
            label="Base"
            value={design.colors.base}
            onChange={(v) => setColors({ base: v })}
          />
          <ColorInput
            label="Accent"
            value={design.colors.accent}
            onChange={(v) => setColors({ accent: v })}
          />
          <ColorInput
            label="Outline"
            value={design.colors.outline}
            onChange={(v) => setColors({ outline: v })}
          />
          <ColorInput
            label="Text"
            value={design.colors.text}
            onChange={(v) => setColors({ text: v })}
          />
        </div>
      </Field>

      {/* Body pattern */}
      <Field label="Body pattern">
        <SegmentedControl<BodyPattern>
          value={design.bodyPattern}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'pinstripe', label: 'Pinstripe' },
            { value: 'horizontal-stripe-panel', label: 'Stripe panel' },
            { value: 'gradient-fade', label: 'Fade' },
          ]}
          onChange={setBodyPattern}
        />
      </Field>

      {/* Sleeve treatment */}
      <Field label="Sleeves">
        <SegmentedControl<SleeveTreatment>
          value={design.sleeveTreatment}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'contrast', label: 'Contrast' },
            { value: 'ringer', label: 'Ringer' },
            { value: 'banded', label: 'Banded' },
          ]}
          onChange={setSleeveTreatment}
        />
      </Field>

      {/* Brand presets — quick way to confirm color recoloring works */}
      <Field label="Brand presets">
        <div className="flex gap-2">
          <PresetButton
            label="Playmaker"
            onClick={() =>
              setColors({
                base: '#FFFFFF',
                accent: '#111111',
                outline: '#F5C842',
                text: '#111111',
              })
            }
          />
          <PresetButton
            label="Lafayette navy"
            onClick={() =>
              setColors({
                base: '#FFFFFF',
                accent: '#1A2B5C',
                outline: '#F5C842',
                text: '#1A2B5C',
              })
            }
          />
          <PresetButton
            label="Throwback"
            onClick={() =>
              setColors({
                base: '#FFFFFF',
                accent: '#E8D89A',
                outline: '#1A2B5C',
                text: '#1A2B5C',
              })
            }
          />
        </div>
      </Field>

      <button
        onClick={reset}
        className="w-full py-2 border border-neutral-300 rounded text-sm font-body uppercase tracking-widest text-neutral-600 hover:bg-neutral-100 transition"
      >
        Reset
      </button>
    </div>
  );
}

// ─── tiny helpers ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-body uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: HexColor;
  onChange: (v: HexColor) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-body">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value as HexColor)}
        className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
      />
      <span className="text-neutral-600">{label}</span>
    </label>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-2 text-sm font-body rounded border transition ${
            value === opt.value
              ? 'bg-brand-black text-brand-white border-brand-black'
              : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-xs font-body uppercase tracking-wider rounded border border-brand-black bg-brand-yellow hover:bg-brand-black hover:text-brand-yellow transition"
    >
      {label}
    </button>
  );
}
