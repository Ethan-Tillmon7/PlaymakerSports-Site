import { useState, type CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { Diamond } from '@/components/layout/DiamondMark';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Tabs } from '@/components/ui/Tabs';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { OUR_STORY_PARTNERS } from '@/features/about';
import { useInView } from '@/hooks/useInView';
import { askTo } from '@/lib/contactLink';
import { localISODate } from '@/lib/dates';
import { EventCard } from './components/EventCard';
import { NextStopPanel, NextStopSkeleton } from './components/UpcomingEvents';
import { eventStatus, groupByMonth } from './eventDates';
import { bySport, failureCopy, SPORT_LABELS, sportTabs, STATE_TITLE_CLASS, upcomingOf, type SportFilter } from './eventView';
import { useEvents } from './useEvents';

const PANEL_ID = 'schedule-panel';
const TAB_PREFIX = 'schedule-tab';

export function EventsPage() {
  const result = useEvents({ showLoadingBar: true });
  const [panelRef, inView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  const [sport, setSport] = useState<SportFilter>('all');
  // Set by the first tab change: from then on new dates slide in from the side the tab moved toward.
  const [direction, setDirection] = useState<1 | -1 | null>(null);

  const today = localISODate();
  const upcoming = upcomingOf(result.status === 'success' ? result.events : [], today);

  // The dashboard feed carries a sport on every event, so the list can be
  // filtered by it. The Sheet feed has none, and the page shows no tabs.
  const tabs = sportTabs(upcoming);
  const filter = tabs?.some((tab) => tab.value === sport) ? sport : 'all';
  const [next, ...later] = bySport(upcoming, filter);
  const swap = direction ? ({ '--dir': direction } as CSSProperties) : undefined;

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

      <PageHeader
        breadcrumb="Events"
        title="Events & tournaments"
        lede="Upcoming tournaments where you can find the Playmaker Sports tent."
      />

      <section aria-labelledby="sched-title">
        <Container className="sec-y">
          <div className="sec-head">
            <h2 id="sched-title" className="h-section">
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

          {/* Loading: the same shape as the dates, so nothing jumps when they arrive. */}
          {result.status === 'loading' && (
            <div role="status" aria-label="Loading the schedule">
              <div className="card board next-panel in">
                <NextStopSkeleton />
                <div className="p-6 sm:p-8 lg:p-10 lg:w-[400px] flex flex-col justify-center gap-3 border-t border-pm-rule lg:border-t-0" aria-hidden="true">
                  <span className="sk sk-line" />
                  <span className="sk sk-line" style={{ width: '80%' }} />
                  <span className="sk mt-2" style={{ width: 120, height: 36 }} />
                </div>
              </div>
              <div className="mt-10 lg:mt-12" aria-hidden="true">
                <div className="month-head">
                  <span className="sk" style={{ width: 160, height: 22 }} />
                  <span className="sk sk-line" style={{ width: 56 }} />
                </div>
                <ul className="ev-grid">
                  {[0, 1].map((i) => (
                    <li key={i} className="ev">
                      <span className="sk" style={{ width: 68, height: 68, borderRadius: 10, flex: 'none' }} />
                      <div className="flex-1">
                        <span className="sk" style={{ width: '55%', height: 24 }} />
                        <span className="sk sk-line mt-2.5" style={{ width: '40%' }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Loaded: the next stop leads, then every date after it, by month. */}
          {result.status === 'success' && next && (
            <div
              // Keyed by tab, so the dates remount and the slide plays on every change.
              key={filter}
              id={PANEL_ID}
              role={tabs ? 'tabpanel' : undefined}
              aria-labelledby={tabs ? `${TAB_PREFIX}-${filter}` : undefined}
            >
              <div
                ref={panelRef}
                className={['card board next-panel', inView ? 'in' : '', direction ? 'swapped' : ''].filter(Boolean).join(' ')}
                style={swap}
              >
                <NextStopPanel t={next} today={today} />
                <div className="p-6 sm:p-8 lg:p-10 lg:w-[400px] flex flex-col justify-center items-start gap-4 border-t border-pm-rule lg:border-t-0">
                  <p className="text-[16px] leading-[1.55] text-pm-muted">
                    Game-day accessories are sold on site at every event. See something you like? Ask and we'll set it aside.
                  </p>
                  <ButtonLink to="/apparel#accessories" variant="secondary" size="sm" arrow>
                    All apparel
                  </ButtonLink>
                </div>
              </div>

              <div className={`flex flex-col gap-10 mt-10 lg:mt-12 ${direction ? 'swapped' : ''}`} style={swap}>
                {groupByMonth(later).map((group) => (
                  <section key={group.key} aria-labelledby={`month-${group.key}`}>
                    <div className="month-head">
                      <h3 id={`month-${group.key}`}>{group.label}</h3>
                      <span className="small">
                        {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <ul className="ev-grid">
                      {group.events.map((t) => (
                        <EventCard key={t.id} t={t} status={eventStatus(t, today)} />
                      ))}
                    </ul>
                  </section>
                ))}
                {later.length === 0 && (
                  <p className="small">
                    {filter === 'all' ? 'No more dates posted yet.' : `No more ${SPORT_LABELS[filter].toLowerCase()} dates posted yet.`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Nothing upcoming. The Sheet feed may still hold past dates; they aren't shown. */}
          {result.status === 'success' && !next && (
            <div className="card state-in px-6 py-14 sm:py-20 flex flex-col items-center text-center">
              <Diamond className="w-9 h-9 text-pm-yellow-ink" />
              <p className={`${STATE_TITLE_CLASS} mt-5`}>Schedule posts soon</p>
              <p className="small mt-2 max-w-[40ch]">The next dates are being confirmed.</p>
              <ButtonLink to="/contact" variant="secondary" size="sm" className="mt-6">
                Ask us where we'll be
              </ButtonLink>
            </div>
          )}

          {result.status === 'error' && (
            <div role="alert" className="card state-in px-6 py-14 sm:py-20 flex flex-col items-center text-center">
              <p className={STATE_TITLE_CLASS}>Couldn't load the schedule</p>
              <p className="small mt-2 max-w-[40ch]">{failureCopy[result.reason]}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                <Button variant="dark" size="sm" onClick={result.retry}>
                  Try again
                </Button>
                <ButtonLink to="/contact" variant="secondary" size="sm">
                  Ask us where we'll be
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* For tournament directors */}
      <section className="sec-warm border-t border-pm-rule" aria-labelledby="host-title">
        <Container className="py-12 lg:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="min-w-0">
            <h2 id="host-title" className="h-section">
              Running a tournament?
            </h2>
            <p className="lead mt-3">{OUR_STORY_PARTNERS}</p>
          </div>
          <ButtonLink
            to={askTo('bringing the Playmaker tent to our tournament', 'Event Organizer')}
            size="lg"
            arrow
            className="self-start md:self-auto"
          >
            Ask about bringing the tent
          </ButtonLink>
        </Container>
      </section>
    </PageLayout>
  );
}
