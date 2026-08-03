import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { PAGE_META, SITE_URL } from '../seo/config';
import { useInView } from '../hooks/useInView';
import { formatDateRange } from '../lib/dates';
import { useLoadingBarStore } from '../store/loadingBarStore';
import type { Tournament } from '../data/events';

function DateTile({ startDate, endDate }: { startDate: string; endDate: string }) {
  const { lines } = formatDateRange(startDate, endDate);

  if (lines.length === 2) {
    return (
      <div className="bg-pm-yellow text-pm-black w-[56px] sm:w-[72px] aspect-square flex flex-col items-center justify-center leading-none border-b-2 border-pm-yellow-deep rounded-lg shrink-0">
        <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{lines[0]}</span>
        <span className="font-display text-[24px] sm:text-[28px] mt-0.5">{lines[1]}</span>
      </div>
    );
  }

  return (
    <div className="bg-pm-yellow text-pm-black flex items-center justify-center px-2 border-b-2 border-pm-yellow-deep rounded-lg shrink-0 min-h-[56px] sm:min-h-[72px]">
      <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.08em] uppercase text-center leading-tight">
        {lines[0]}
      </span>
    </div>
  );
}

function TournamentRow({
  t,
  i,
  total,
  animated,
  delay = 0,
}: {
  t: Tournament;
  i: number;
  total: number;
  animated?: boolean;
  delay?: number;
}) {
  const animClass =
    animated === undefined ? '' : animated ? 'animate-fade-up' : 'opacity-0';

  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-center gap-4 sm:gap-6 px-4 sm:px-5 py-4 hover:-translate-y-0.5 transition-transform duration-150 ${
        i < total - 1 ? 'border-b border-pm-rule' : ''
      } ${animClass}`}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      <DateTile startDate={t.startDate} endDate={t.endDate} />
      <span className="font-mono text-[13px] tracking-[0.06em] uppercase text-pm-ink">
        {t.city}
      </span>
    </div>
  );
}

function TournamentSkeleton() {
  return (
    <div className="bg-white border border-pm-black rounded-xl overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`grid grid-cols-[56px_1fr] items-center gap-4 sm:gap-6 px-4 sm:px-5 py-4 ${
            i < 3 ? 'border-b border-pm-rule' : ''
          }`}
        >
          <div className="aspect-square bg-shimmer animate-shimmer rounded-lg" />
          <div className="h-4 bg-shimmer animate-shimmer rounded w-32" />
        </div>
      ))}
    </div>
  );
}

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: Tournament[] }
  | { status: 'error' };

export function EventsPage() {
  const [state, setState] = useState<FetchState>({ status: 'loading' });
  const [listRef, listInView] = useInView();
  const loadingBar = useLoadingBarStore();

  useEffect(() => {
    loadingBar.start();
    fetch('/api/get-events')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Tournament[]>;
      })
      .then((data) => {
        loadingBar.done();
        setState({ status: 'success', data });
      })
      .catch(() => {
        loadingBar.done();
        setState({ status: 'error' });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date().toISOString().split('T')[0];
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

      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">
            Tournaments · Where to find us
          </span>
          <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
            Events &amp; Tournaments
          </h1>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        {state.status === 'loading' && <TournamentSkeleton />}

        {state.status === 'success' && allEvents.length === 0 && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <Diamond className="w-6 h-6 text-pm-yellow mx-auto mb-4" />
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Schedule</span>
            <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
              No upcoming events confirmed
            </h2>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
              The schedule for the next few weeks is being finalized — check back soon, or contact us for the latest.
            </p>
            <Link
              to="/about"
              className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Contact us for info
            </Link>
          </div>
        )}

        {state.status === 'success' && allEvents.length > 0 && (
          <>
            {upcomingEvents.length > 0 ? (
              <div ref={listRef} className="bg-white border border-pm-black rounded-xl overflow-hidden">
                {upcomingEvents.map((t, i) => (
                  <TournamentRow
                    key={t.id}
                    t={t}
                    i={i}
                    total={upcomingEvents.length}
                    animated={listInView}
                    delay={i * 80}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
                <Diamond className="w-6 h-6 text-pm-yellow mx-auto mb-4" />
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Schedule</span>
                <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
                  No upcoming events confirmed
                </h2>
                <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
                  The schedule for the next few weeks is being finalized — check back soon, or contact us for the latest.
                </p>
                <Link
                  to="/about"
                  className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
                >
                  Contact us for info
                </Link>
              </div>
            )}

            {pastEvents.length > 0 && (
              <details className="mt-12 group">
                <summary className="cursor-pointer flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden">
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
                    2026 past events ({pastEvents.length})
                  </span>
                </summary>
                <div className="mt-6 bg-white border border-pm-rule rounded-xl overflow-hidden opacity-80">
                  {pastEvents.map((t, i) => (
                    <TournamentRow key={t.id} t={t} i={i} total={pastEvents.length} />
                  ))}
                </div>
              </details>
            )}
          </>
        )}

        {state.status === 'error' && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">
              Couldn't load schedule
            </span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
              Something went wrong loading the event schedule.
            </p>
            <Link
              to="/about"
              className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Contact us for the latest
            </Link>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
