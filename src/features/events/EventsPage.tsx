import { Helmet } from 'react-helmet-async';
import type { PublicEvent } from '@shared/events';
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
import { eventGridClass, groupBySport, hasSports } from './eventGrid';
import { useEvents } from './useEvents';

const failureCopy: Record<RequestFailure, string> = {
  offline: "You're offline. Once you have signal again, try reloading the schedule.",
  timeout: 'The schedule is taking too long to load. The connection may be weak, so give it another try.',
  server: "We couldn't load the schedule just now. Try again in a moment.",
};

const monthHeadingClass = {
  // Top-level month headers (Sheet feed, no sports): the section title.
  section: 'font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-[0.95] tracking-[0.005em] text-pm-black',
  // Month labels inside a sport section: a mono eyebrow, so the sport stays the headline.
  sub: 'font-mono text-label uppercase text-pm-yellow-ink',
} as const;

/** A run of month groups for one list of events, each month a card grid. */
function MonthGroups({
  events,
  level,
  animated,
  today,
  delayOf,
}: {
  events: PublicEvent[];
  level: keyof typeof monthHeadingClass;
  animated: boolean;
  today: string;
  delayOf: (t: PublicEvent) => number;
}) {
  const Heading = level === 'section' ? 'h2' : 'h3';
  return (
    <>
      {groupByMonth(events).map((group) => {
        const id = `month-${events[0]?.sport ?? 'all'}-${group.key}`;
        return (
          <section key={group.key} aria-labelledby={id}>
            {level === 'section' ? (
              <div className="flex items-baseline justify-between gap-4 mb-5 pb-3 border-b-2 border-pm-black">
                <Heading id={id} className={monthHeadingClass.section}>
                  {group.label}
                </Heading>
                <span className="font-mono text-label uppercase text-pm-muted shrink-0">
                  {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
                </span>
              </div>
            ) : (
              <Heading id={id} className={`${monthHeadingClass.sub} mb-3`}>
                {group.label}
              </Heading>
            )}
            <ul className={eventGridClass}>
              {group.events.map((t) => (
                <EventCard key={t.id} t={t} animated={animated} delay={delayOf(t)} status={eventStatus(t, today)} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

export function EventsPage() {
  const result = useEvents({ showLoadingBar: true });
  const [listRef, listInView] = useInView();

  const today = localISODate();
  const allEvents = result.status === 'success' ? result.events : [];
  const upcomingEvents = allEvents.filter((t) => t.endDate >= today);
  const pastEvents = [...allEvents].filter((t) => t.endDate < today).reverse();

  // The dashboard feed carries a sport on every event, so the page leads with
  // Baseball / Softball / Soccer sections and months inside them. The Sheet
  // feed has no sport, and keeps the month-only layout.
  const sportGroups = hasSports(upcomingEvents) ? groupBySport(upcomingEvents) : null;
  // Stagger cards in the order they appear on screen, not feed order.
  const rendered = sportGroups ? sportGroups.flatMap((g) => g.events) : upcomingEvents;
  const delayOf = (t: PublicEvent) => Math.min(rendered.indexOf(t), 10) * 50;

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
                {sportGroups ? (
                  sportGroups.map((group) => (
                    <section key={group.key} aria-labelledby={`sport-${group.key}`}>
                      <div className="flex items-baseline justify-between gap-4 mb-6 pb-3 border-b-2 border-pm-black">
                        <h2
                          id={`sport-${group.key}`}
                          className="font-display uppercase text-[clamp(28px,3vw,44px)] leading-[0.95] tracking-[0.005em] text-pm-black"
                        >
                          {group.label}
                        </h2>
                        <span className="font-mono text-label uppercase text-pm-muted shrink-0">
                          {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-8">
                        <MonthGroups events={group.events} level="sub" animated={listInView} today={today} delayOf={delayOf} />
                      </div>
                    </section>
                  ))
                ) : (
                  <MonthGroups events={upcomingEvents} level="section" animated={listInView} today={today} delayOf={delayOf} />
                )}
              </div>
            ) : (
              <NoUpcomingEvents />
            )}

            {pastEvents.length > 0 && (
              <details className="mt-14 pt-6 border-t border-pm-rule group">
                <summary className="cursor-pointer inline-flex items-center gap-2 min-h-11 list-none [&::-webkit-details-marker]:hidden">
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
          <div role="alert" className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto animate-fade-up">
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
