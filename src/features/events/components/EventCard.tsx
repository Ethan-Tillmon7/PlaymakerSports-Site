import type { PublicEvent } from '@shared/events';
import { eventDateParts, type EventStatus } from '../eventDates';
import { metaLine, splitCity, statusLabel } from '../eventView';

/**
 * One date on the Events page: the date tile, the city in Anton, and a line of
 * sport, state and weekdays. `status` adds "In 3 days" or "Happening now" for
 * events inside the next week.
 */
export function EventCard({ t, status = null }: { t: PublicEvent; status?: EventStatus }) {
  const parts = eventDateParts(t.startDate, t.endDate);
  const [place] = splitCity(t.city);
  const meta = metaLine(t);
  const label = statusLabel(status);

  return (
    <li className="ev">
      <div className="ev-tile">
        <span className="mono">{parts?.month ?? 'TBA'}</span>
        {parts && <span className="display tnum">{parts.days}</span>}
      </div>
      <div className="min-w-0">
        <p className="ev-city display">{place}</p>
        {meta && <p className="small mt-1.5">{meta}</p>}
      </div>
      {label && <span className={`badge ${status?.kind === 'live' ? 'badge-yellow' : 'badge-outline'}`}>{label}</span>}
    </li>
  );
}
