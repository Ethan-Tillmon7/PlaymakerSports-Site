import { JerseyCanvas } from '../components/JerseyCanvas';
import { ControlPanel } from '../components/ControlPanel';

export function CustomizerPage() {
  return (
    <div className="min-h-screen bg-pm-paper-2">
      <header className="bg-pm-black border-b-4 border-pm-yellow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="bg-pm-yellow inline-flex items-baseline gap-1 px-2 py-1 font-display text-[22px] leading-none uppercase">
            <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
          </div>
          <span className="text-pm-muted font-mono text-[11px] uppercase tracking-[0.1em]">
            Customizer · Phase 0
          </span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-6 items-start">
        <section className="flex justify-center"><JerseyCanvas /></section>
        <section className="flex justify-center"><ControlPanel /></section>
      </main>
    </div>
  );
}
