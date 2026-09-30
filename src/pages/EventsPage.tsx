import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Diamond } from '../components/layout/DiamondMark';
import { PAGE_META, SITE_URL } from '../seo/config';
import { useInView } from '../hooks/useInView';
import { eventDateParts, localISODate, type EventDateParts } from '../lib/dates';
import { classifyFailure, fetchWithTimeout, type RequestFailure } from '../lib/http';
import { useLoadingBarStore } from '../store/loadingBarStore';
import type { Tournament } from '../data/events';

type EventStatus = { kind: 'live' } | { kind: 'soon'; days: number } | null;

const DAY_MS = 86_400_000;

/** Live while today falls inside the event; "soon" when it starts within 6 days. */
function eventStatus(t: Tournament, today: string): EventStatus {
  if (t.startDate <= today && today <= t.endDate) return { kind: 'live' };
  const days = Math.round((Date.parse(t.startDate) - Date.parse(today)) / DAY_MS);
  return days >= 1 && days <= 6 ? { kind: 'soon', days } : null;
}

function DateTile({ parts, live = false }: { parts: EventDateParts | null; live?: boolean }) {
  // A live event inverts the tile: the one black date on a page of yellow ones.
  const tone = live
    ? 'bg-pm-black text-pm-yellow border-pm-black'
    : 'bg-pm-yellow text-pm-black border-pm-yellow-deep';
  return (
    <div className={`${tone} w-16 sm:w-[72px] aspect-square flex flex-col items-center justify-center leading-none border-b-2 rounded-lg shrink-0`}>
      {parts ? (
        <>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{parts.month}</span>
          <span
            className={`font-display tabular-nums mt-1 ${
              parts.days.includes('–') ? 'text-[20px] sm:text-[23px]' : 'text-[26px] sm:text-[30px]'
            }`}
          >
            {parts.days}
          </span>
        </>
      ) : (
        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-center">Date TBA</span>
      )}
    </div>
  );
}

/** "Fort Walton Beach, FL" → ["Fort Walton Beach", "FL"]. */
function splitCity(city: string): [string, string | null] {
  const i = city.lastIndexOf(',');
  return i === -1 ? [city.trim(), null] : [city.slice(0, i).trim(), city.slice(i + 1).trim()];
}

function StatusMark({ status }: { status: EventStatus }) {
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

function TournamentCard({
  t,
  animated,
  delay = 0,
  past = false,
  status = null,
}: {
  t: Tournament;
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

const cardGridClass = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3';

/** Upcoming events bucketed by the month they start in, in schedule order. */
function groupByMonth(events: Tournament[]) {
  const groups: { key: string; label: string; events: Tournament[] }[] = [];
  for (const t of events) {
    const parts = eventDateParts(t.startDate, t.endDate);
    const key = parts?.monthKey ?? 'tba';
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.events.push(t);
    else groups.push({ key, label: parts?.monthLabel ?? 'Date TBA', events: [t] });
  }
  return groups;
}

function TournamentSkeleton() {
  return (
    <div role="status" aria-label="Loading the event schedule">
      <div className="h-8 w-40 bg-shimmer animate-shimmer rounded-lg mb-5" />
      <div className={cardGridClass}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-white border border-pm-rule rounded-xl">
            <div className="w-16 sm:w-[72px] aspect-square bg-shimmer animate-shimmer rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-shimmer animate-shimmer rounded w-3/5" />
              <div className="h-3 bg-shimmer animate-shimmer rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ctaClass =
  'font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl';

const failureCopy: Record<RequestFailure, string> = {
  offline: "You're offline. Once you have signal again, try reloading the schedule.",
  timeout: 'The schedule is taking too long to load. The connection may be weak, so give it another try.',
  server: "We couldn't load the schedule just now. Try again in a moment.",
};

function NoUpcomingEvents() {
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
      <Link to="/contact" className={`${ctaClass} mt-7`}>
        Contact us for info
      </Link>
    </div>
  );
}

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: Tournament[] }
  | { status: 'error'; reason: RequestFailure };

export function EventsPage() {
  const [state, setState] = useState<FetchState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [listRef, listInView] = useInView();
  const loadingBar = useLoadingBarStore();

  useEffect(() => {
    const controller = new AbortController();
    loadingBar.start();
    fetchWithTimeout('/api/get-events', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        setState({ status: 'success', data: data as Tournament[] });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', reason: classifyFailure(err) });
      })
      .finally(() => loadingBar.done());
    return () => controller.abort();
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  const today = localISODate();
  const allEvents = state.status === 'success' ? state.data : [];
  const upcomingEvents = allEvents.filter((t) => t.endDate >= today);
  const pastEvents = [...allEvents].filter((t) => t.endDate < today).reverse();

  return (
    <PageLayout breadcrumb="Events">
      <Helmet>
        <title>{PAGE_META.events.title}</title>
        <meta name="description" content={PAGE_META.events.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.events.path}`} />
        <meta property="og:title" content={PAGE_META.events.title} />
        <meta property="og:description" content={PAGE_META.events.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.events.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHeader eyebrow="Tournaments · Where to find us" title="Events & Tournaments" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-12 lg:py-16">
        {state.status === 'loading' && <TournamentSkeleton />}

        {state.status === 'success' && allEvents.length === 0 && <NoUpcomingEvents />}

        {state.status === 'success' && allEvents.length > 0 && (
          <>
            {upcomingEvents.length > 0 ? (
              <div ref={listRef} className="flex flex-col gap-12 lg:gap-14">
                {groupByMonth(upcomingEvents).map((group) => {
                  const offset = upcomingEvents.indexOf(group.events[0]);
                  return (
                    <section key={group.key} aria-labelledby={`month-${group.key}`}>
                      <div className="flex items-baseline justify-between gap-4 mb-5 pb-3 border-b-2 border-pm-black">
                        <h2
                          id={`month-${group.key}`}
                          className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-[0.95] tracking-[0.005em] text-pm-black"
                        >
                          {group.label}
                        </h2>
                        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted shrink-0">
                          {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
                        </span>
                      </div>
                      <ul className={cardGridClass}>
                        {group.events.map((t, i) => (
                          <TournamentCard
                            key={t.id}
                            t={t}
                            animated={listInView}
                            delay={Math.min(offset + i, 10) * 50}
                            status={eventStatus(t, today)}
                          />
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            ) : (
              <NoUpcomingEvents />
            )}

            {pastEvents.length > 0 && (
              <details className="mt-14 pt-6 border-t border-pm-rule group">
                <summary className="cursor-pointer inline-flex items-center gap-2 min-h-10 list-none [&::-webkit-details-marker]:hidden">
                  <svg
                    className="w-3.5 h-3.5 text-pm-muted transition-transform duration-150 group-open:rotate-90 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">
                    Past events ({pastEvents.length})
                  </span>
                </summary>
                <ul className={`mt-6 ${cardGridClass}`}>
                  {pastEvents.map((t) => (
                    <TournamentCard key={t.id} t={t} past />
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        {state.status === 'error' && (
          <div role="alert" className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">
              Couldn't load schedule
            </span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">{failureCopy[state.reason]}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={retry} className={ctaClass}>
                Try again
              </button>
              <Link
                to="/contact"
                className="font-display uppercase text-[15px] tracking-[0.04em] bg-white text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-paper-2 transition-[colors,transform] duration-150 active:scale-[0.97] border border-pm-rule border-b-2 hover:border-pm-black rounded-xl"
              >
                Ask us where we'll be
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
