import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { PAGE_META, SITE_URL } from '../seo/config';
import type { Tournament } from '../data/events';

function StatusPill({ status, text }: { status: Tournament['status']; text: string }) {
  if (status === 'open') return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-success bg-pm-success/10 px-2.5 py-1 border border-pm-success/30 rounded-full">
      {text}
    </span>
  );
  if (status === 'almost') return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-yellow-deep bg-pm-yellow-soft px-2.5 py-1 border border-pm-yellow-deep/40 rounded-full">
      {text}
    </span>
  );
  return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted bg-pm-rule/40 px-2.5 py-1 border border-pm-rule rounded-full">
      {text}
    </span>
  );
}

function TournamentSkeleton() {
  return (
    <div className="bg-white border border-pm-black rounded-xl overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr_auto] items-center gap-4 sm:gap-6 px-4 sm:px-5 py-4 animate-pulse ${i < 3 ? 'border-b border-pm-rule' : ''}`}
        >
          <div className="aspect-square bg-pm-rule rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-pm-rule rounded w-40" />
            <div className="h-3 bg-pm-rule rounded w-64" />
          </div>
          <div className="hidden sm:block h-6 bg-pm-rule rounded w-16" />
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

  useEffect(() => {
    fetch('/api/get-events')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Tournament[]>;
      })
      .then((data) => setState({ status: 'success', data }))
      .catch(() => setState({ status: 'error' }));
  }, []);

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
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Tournaments · Acadiana</span>
          <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6">
            Events &amp;<br />Tournaments
          </h1>
          <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] text-pm-ink mt-6 max-w-[520px]">
            Upcoming tournament schedule with dates, locations, and division info.
          </p>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        {state.status === 'loading' && <TournamentSkeleton />}

        {state.status === 'success' && state.data.length === 0 && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <Diamond className="w-6 h-6 text-pm-yellow mx-auto mb-4" />
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Off-season</span>
            <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
              No events scheduled yet
            </h2>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
              Check back soon — the next season's schedule will post here when confirmed.
            </p>
            <Link
              to="/about"
              className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Contact us for info
            </Link>
          </div>
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <div className="bg-white border border-pm-black rounded-xl overflow-hidden">
            {state.data.map((t, i) => (
              <div
                key={t.name}
                className={`grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr_auto] items-center gap-4 sm:gap-6 px-4 sm:px-5 py-4 ${i < state.data.length - 1 ? 'border-b border-pm-rule' : ''}`}
              >
                <div className="bg-pm-yellow text-pm-black aspect-square flex flex-col items-center justify-center leading-none border-b-2 border-pm-yellow-deep rounded-lg">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{t.month}</span>
                  <span className="font-display text-[24px] sm:text-[28px] mt-0.5">{t.day}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display uppercase text-[17px] sm:text-[20px] leading-[0.95] tracking-[0.005em] text-pm-black">{t.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                    <span>{t.location}</span><span className="text-pm-rule">·</span>
                    <span>{t.division}</span><span className="text-pm-rule">·</span>
                    <span>{t.games}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center col-start-3">
                  <StatusPill status={t.status} text={t.spotsText} />
                </div>
              </div>
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Couldn't load schedule</span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
              Something went wrong loading the event schedule.
            </p>
            <Link
              to="/about"
              className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Contact us for the latest
            </Link>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
