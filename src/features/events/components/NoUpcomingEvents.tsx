import { Diamond } from '@/components/layout/DiamondMark';
import { ButtonLink } from '@/components/ui/Button';

export function NoUpcomingEvents() {
  return (
    <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
      <Diamond className="w-6 h-6 text-pm-yellow mx-auto mb-4" />
      <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Schedule</span>
      <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
        No upcoming events confirmed
      </h2>
      <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
        The schedule for the next few weeks is being finalized — check back soon, or contact us for the latest.
      </p>
      <ButtonLink to="/contact" size="md" className="mt-7">
        Contact us for info
      </ButtonLink>
    </div>
  );
}
