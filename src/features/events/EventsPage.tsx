import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { useInView } from '@/hooks/useInView';
import { localISODate } from '@/lib/dates';
import type { RequestFailure } from '@/lib/http';
import { EventCard } from './components/EventCard';
import { EventSkeleton } from './components/EventSkeleton';
import { NoUpcomingEvents } from './components/NoUpcomingEvents';
import { eventStatus, groupByMonth } from './eventDates';
import { eventGridClass } from './eventGrid';
import { useEvents } from './useEvents';

const failureCopy: Record<RequestFailure, string> = {
  offline: "You're offline. Once you have signal again, try reloading the schedule.",
  timeout: 'The schedule is taking too long to load. The connection may be weak, so give it another try.',
  server: "We couldn't load the schedule just now. Try again in a moment.",
};

export function EventsPage() {
  const result = useEvents({ showLoadingBar: true });
  const [listRef, listInView] = useInView();

  const today = localISODate();
  const allEvents = result.status === 'success' ? result.events : [];
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

      <Container className="py-12 lg:py-16">
        {result.status === 'loading' && <EventSkeleton />}

        {result.status === 'success' && allEvents.length === 0 && <NoUpcomingEvents />}

        {result.status === 'success' && allEvents.length > 0 && (
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
                      <ul className={eventGridClass}>
                        {group.events.map((t, i) => (
                          <EventCard
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
                <ul className={`mt-6 ${eventGridClass}`}>
                  {pastEvents.map((t) => (
                    <EventCard key={t.id} t={t} past />
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        {result.status === 'error' && (
          <div role="alert" className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">
              Couldn't load schedule
            </span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">{failureCopy[result.reason]}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <Button size="md" onClick={result.retry}>
                Try again
              </Button>
              <ButtonLink to="/contact" variant="secondary" size="md">
                Ask us where we'll be
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </PageLayout>
  );
}
