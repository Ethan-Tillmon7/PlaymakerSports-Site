import type { PublicEvent } from '@shared/events';
import { eventDateParts, type EventStatus } from '../eventDates';
import { DateTile } from './DateTile';
import { StatusMark } from './StatusMark';

/** "Fort Walton Beach, FL" → ["Fort Walton Beach", "FL"]. */
function splitCity(city: string): [string, string | null] {
  const i = city.lastIndexOf(',');
  return i === -1 ? [city.trim(), null] : [city.slice(0, i).trim(), city.slice(i + 1).trim()];
}

export function EventCard({
  t,
  animated,
  delay = 0,
  past = false,
  status = null,
}: {
  t: PublicEvent;
  animated?: boolean;
  delay?: number;
  past?: boolean;
  status?: EventStatus;
}) {
  const live = status?.kind === 'live';
  const parts = eventDateParts(t.startDate, t.endDate);
  const [place, state] = splitCity(t.city);
  const meta = [state, parts?.weekdays].filter(Boolean).join(' · ');
  const animClass = animated === undefined ? '' : animated ? 'animate-fade-up' : 'opacity-0';

  return (
    <li
      className={`flex items-center gap-4 p-3 bg-white border rounded-xl ${live ? 'border-pm-black' : 'border-pm-rule'} ${past ? 'opacity-70' : ''} ${animClass}`}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      <DateTile parts={parts} live={live} />
      <div className="min-w-0 flex flex-col">
        <StatusMark status={status} />
        <p className="font-display uppercase text-[19px] leading-[0.95] tracking-[0.005em] text-pm-black break-words">
          {place}
        </p>
        {meta && (
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mt-1.5">{meta}</p>
        )}
      </div>
    </li>
  );
}
