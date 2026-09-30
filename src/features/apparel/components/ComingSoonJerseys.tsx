import { Button } from '@/components/ui/Button';

export function ComingSoonJerseys({ onBrowseAccessories }: { onBrowseAccessories: () => void }) {
  return (
    <div className="border border-pm-rule rounded-2xl p-10 sm:p-14 text-center max-w-[680px] flex flex-col items-center gap-5">
      <svg viewBox="0 0 200 240" className="w-24 opacity-60" aria-hidden="true">
        <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="1.4" />
      </svg>
      <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-ink">Coming Soon</span>
      <h2 className="font-display uppercase text-[clamp(28px,4vw,44px)] leading-[0.9] tracking-[0.005em] text-pm-black text-balance">
        Custom Jerseys Are On Deck
      </h2>
      <p className="text-[15px] leading-[1.6] text-pm-ink max-w-[440px]">
        Our sublimated and tackle-twill jersey builder is coming soon. In the meantime, gear up with our
        accessories.
      </p>
      <Button variant="secondary" size="lg" onClick={onBrowseAccessories} className="mt-2">
        Browse accessories
      </Button>
    </div>
  );
}
