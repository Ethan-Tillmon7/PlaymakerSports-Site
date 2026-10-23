import type { PublicEvent } from '@shared/events';
import { eventDateParts, formatDateRange, type EventStatus } from '../eventDates';
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
  // Multi-day events spell the range out ("OCT 31 – NOV 1"): the tile's
  // "31–1" alone is ambiguous across a month boundary. Each part is unbreakable
  // so a narrow card wraps between parts, never inside a date.
  const range = t.endDate !== t.startDate ? formatDateRange(t.startDate, t.endDate).lines.join(' ') : null;
  const meta = [state, parts?.weekdays, range].filter((part): part is string => Boolean(part));
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
        {meta.length > 0 && (
          <p className="font-mono text-label uppercase text-pm-muted mt-1.5">
            {meta.map((part, i) => (
              <span key={part}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{part}</span>
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}
