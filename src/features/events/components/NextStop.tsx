import { Link } from 'react-router-dom';
import { ArrowIcon } from '@/components/ui/icons';
import { localISODate } from '@/lib/dates';
import { stopDate, upcomingOf } from '../eventView';
import type { EventsState } from '../useEvents';

/**
 * "Next stop · Nov 7–8 · Lake Charles, LA": one quiet line above the home
 * headline that carries the schedule. The feed arrives after first paint (and
 * is never in the prerendered HTML), so the line's height is held open and it
 * fades in. With no upcoming date, or a failed fetch, the space stays empty.
 */
export function NextStop({ result }: { result: EventsState }) {
  const next = result.status === 'success' ? upcomingOf(result.events, localISODate())[0] : undefined;

  return (
    <div className="min-h-9 [@media(pointer:coarse)]:min-h-11 max-w-full">
      {next && (
        <Link to={{ pathname: '/', hash: '#events' }} className="next-stop enter">
          <span className="badge badge-yellow">Next stop</span>
          <span className="where tnum">
            {stopDate(next)} · {next.city}
          </span>
          <ArrowIcon />
        </Link>
      )}
    </div>
  );
}
