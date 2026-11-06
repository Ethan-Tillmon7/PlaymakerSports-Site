import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { PublicEvent } from '@shared/events';
import { Diamond } from '@/components/layout/DiamondMark';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/icons';
import { Tabs } from '@/components/ui/Tabs';
import { useInView } from '@/hooks/useInView';
import { askTo } from '@/lib/contactLink';
import { localISODate } from '@/lib/dates';
import { eventDateParts, eventStatus } from '../eventDates';
import { bySport, failureCopy, metaLine, splitCity, SPORT_LABELS, sportTabs, STATE_TITLE_CLASS, statusLabel, stopDate, upcomingOf, type SportFilter } from '../eventView';
import type { EventsState } from '../useEvents';

const PANEL_ID = 'board-panel';
const TAB_PREFIX = 'board-tab';
/** Rows listed after the next stop. The Events page has the rest. */
const AFTER = 3;

/** The next stop: the lead panel of the board, shared with the Events page. */
export function NextStopPanel({ t, today }: { t: PublicEvent; today: string }) {
  const status = eventStatus(t, today);
  const label = statusLabel(status);
  const parts = eventDateParts(t.startDate, t.endDate);
  const [place] = splitCity(t.city);
  const meta = metaLine(t);

  return (
    <div className="board-next p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
      {label && <span className={`badge self-start mb-4 ${status?.kind === 'live' ? 'badge-yellow' : 'badge-outline'}`}>{label}</span>}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="board-tile">
          <span className="mono">{parts?.month ?? 'TBA'}</span>
          {parts && <span className="display text-[clamp(26px,3.2vw,40px)] tnum">{parts.days}</span>}
        </div>
        <div className="min-w-0">
          <p className="board-city display">{place}</p>
          {meta && <p className="small mt-2">{meta}</p>}
        </div>
      </div>
    </div>
  );
}

/** Grey blocks in the shape of the next stop, so nothing jumps when the dates arrive. */
export function NextStopSkeleton() {
  return (
    <div className="board-next p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
      <span className="sk" style={{ width: 72, height: 22, borderRadius: 999 }} />
      <div className="flex items-center gap-4 sm:gap-6 mt-4">
        <span className="sk sk-tile" />
        <div className="min-w-0 flex-1">
          <span className="sk sk-city" />
          <span className="sk sk-line mt-3" style={{ width: 170 }} />
        </div>
      </div>
    </div>
  );
}

/**
 * The home page's schedule board: sport tabs when the feed has sports, the
 * next stop, and the few dates after it. `result` comes from the page's one
 * useEvents() call, which also feeds the hero's "Next stop" line. Prerender
 * and first paint show the loading shape, since the fetch only runs in the browser.
 */
export function UpcomingEvents({ result, headingId }: { result: EventsState & { retry: () => void }; headingId: string }) {
  const [boardRef, inView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  const [sport, setSport] = useState<SportFilter>('all');
  // Set by the first tab change: from then on new dates slide in from the side the tab moved toward.
  const [direction, setDirection] = useState<1 | -1 | null>(null);

  const today = localISODate();
  const upcoming = result.status === 'success' ? upcomingOf(result.events, today) : [];
  const tabs = sportTabs(upcoming);
  // A sport can drop out of the feed between fetches; fall back to everything.
  const filter = tabs?.some((tab) => tab.value === sport) ? sport : 'all';
  const [next, ...rest] = bySport(upcoming, filter);
  const after = rest.slice(0, AFTER);

  const boardClass = ['card board', inView ? 'in' : '', direction ? 'swapped' : ''].filter(Boolean).join(' ');

  return (
    <>
      <div className="sec-head">
        <h2 id={headingId} className="h-section">
          Where the tent is next
        </h2>
        {tabs && (
          <Tabs
            items={tabs}
            value={filter}
            onChange={(value, dir) => {
              setSport(value);
              setDirection(dir);
            }}
            label="Filter by sport"
            idPrefix={TAB_PREFIX}
            controls={PANEL_ID}
            className="self-start md:self-auto"
          />
        )}
      </div>

      <div ref={boardRef} className={boardClass} style={direction ? ({ '--dir': direction } as CSSProperties) : undefined}>
        {result.status === 'loading' && (
          <div role="status" aria-label="Loading the schedule" className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <NextStopSkeleton />
            <ul className="px-6 sm:px-8 lg:px-10 py-1 lg:py-4 flex flex-col justify-center" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="sk-row">
                  <span className="sk sk-line" />
                  <span className="sk sk-line" style={{ width: '42%' }} />
                  <span className="sk sk-line" style={{ width: 76 }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.status === 'success' && next && (
          <div
            // Keyed by tab, so the dates remount and the slide plays on every change.
            key={filter}
            id={PANEL_ID}
            role={tabs ? 'tabpanel' : undefined}
            aria-labelledby={tabs ? `${TAB_PREFIX}-${filter}` : undefined}
            className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
          >
            <NextStopPanel t={next} today={today} />
            <ul className="px-6 sm:px-8 lg:px-10 py-1 lg:py-4 flex flex-col justify-center" aria-label="After that">
              {after.map((t) => {
                const [place] = splitCity(t.city);
                return (
                  <li key={t.id} className="board-row">
                    <Link to="/events" className="board-link">
                      <span className="mono">{stopDate(t)}</span>
                      <span className="title">{place}</span>
                      <span className="small">{metaLine(t, { weekdays: false })}</span>
                      <ArrowIcon className="go" />
                    </Link>
                  </li>
                );
              })}
              {after.length === 0 && (
                <li className="board-none small">
                  {filter === 'all' ? 'No more dates posted yet.' : `No more ${SPORT_LABELS[filter].toLowerCase()} dates posted yet.`}
                </li>
              )}
            </ul>
          </div>
        )}

        {result.status === 'success' && !next && (
          <div className="state-in px-6 py-14 sm:py-16 flex flex-col items-center text-center">
            <Diamond className="w-9 h-9 text-pm-yellow-ink" />
            <p className={`${STATE_TITLE_CLASS} mt-5`}>Schedule posts soon</p>
            <p className="small mt-2 max-w-[40ch]">The next dates are being confirmed. Check the full schedule for the latest.</p>
          </div>
        )}

        {result.status === 'error' && (
          <div role="alert" className="state-in px-6 py-14 sm:py-16 flex flex-col items-center text-center">
            <p className={STATE_TITLE_CLASS}>Couldn't load the schedule</p>
            <p className="small mt-2 max-w-[40ch]">
              {result.reason === 'server'
                ? "That's on our end, not the season. Try again, or open the full schedule."
                : failureCopy[result.reason]}
            </p>
            <Button variant="secondary" size="sm" className="mt-6" onClick={result.retry}>
              Try again
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 lg:px-10 py-4 border-t border-pm-rule bg-pm-paper">
          <p className="text-[15px] leading-[1.5] text-pm-muted">
            Running a tournament?{' '}
            <Link to={askTo('bringing the Playmaker tent to our tournament', 'Event Organizer', { onHome: true })} className="link">
              Ask about bringing the tent.
            </Link>
          </p>
          <ButtonLink to="/events" variant="secondary" size="sm" arrow className="self-start sm:self-auto">
            All events
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
