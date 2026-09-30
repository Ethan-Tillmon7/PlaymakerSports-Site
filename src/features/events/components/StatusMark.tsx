import type { EventStatus } from '../eventDates';

export function StatusMark({ status }: { status: EventStatus }) {
  if (!status) return null;
  if (status.kind === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 self-start mb-2 bg-pm-yellow text-pm-black font-mono text-[9.5px] tracking-[0.12em] uppercase px-2 py-1 rounded-lg border-b border-pm-yellow-deep">
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-pm-black" />
        Happening now
      </span>
    );
  }
  return (
    <span className="block mb-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-pm-yellow-ink">
      {status.days === 1 ? 'Tomorrow' : `In ${status.days} days`}
    </span>
  );
}
