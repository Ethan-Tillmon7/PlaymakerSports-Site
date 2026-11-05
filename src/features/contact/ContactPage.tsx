import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/ui/Container';
import { ArrowIcon } from '@/components/ui/icons';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL, contact } from '@/config/site';
import { stopDate, upcomingOf, useEvents } from '@/features/events';
import { localISODate } from '@/lib/dates';
import { ContactCard } from './components/ContactCard';

// What to send, by who's asking. The same three asks as the form's message hints.
const ASKS = [
  { who: 'Coaches', what: 'What you need, how many, and when.' },
  { who: 'Parents and players', what: "What you saw at the tent, or what you're looking for." },
  { who: 'Event organizers', what: 'Your tournament: where, when, and how many teams.' },
];

export function ContactPage() {
  const schedule = useEvents();
  const next = schedule.status === 'success' ? upcomingOf(schedule.events, localISODate())[0] : undefined;

  return (
    <PageLayout breadcrumb="Contact">
      <Helmet>
        <title>{PAGE_META.contact.title}</title>
        <meta name="description" content={PAGE_META.contact.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.contact.path}`} />
        <meta property="og:title" content={PAGE_META.contact.title} />
        <meta property="og:description" content={PAGE_META.contact.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.contact.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* The form is the one lit card: second on phones, the right column on desktop. */}
      <PageHeader
        breadcrumb="Contact"
        title="Get in touch"
        lede="Tell us what you need and the Playmaker Sports team takes it from there."
        aside={<ContactCard />}
        below={
          <>
            <h2 className="text-[15px] font-semibold leading-[1.4] tracking-[-0.01em] text-white mb-3">What to include</h2>
            <dl className="asks">
              {ASKS.map((ask) => (
                <div key={ask.who}>
                  <dt>{ask.who}</dt>
                  <dd>{ask.what}</dd>
                </div>
              ))}
            </dl>
          </>
        }
      />

      <section aria-labelledby="find-title">
        <Container className="sec-y grid gap-8 lg:gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <h2 id="find-title" className="h-section">
            Or find us here
          </h2>
          <div className="min-w-0">
            <Link to="/events" className="row-link">
              <span className="min-w-0">
                <span className="title block">At the tent</span>
                {/* The next stop arrives with the schedule; until then (or without one) the line still reads whole. */}
                <span className="small block mt-0.5">
                  {next && `Next stop: ${stopDate(next)} in ${next.city}. `}See the full schedule.
                </span>
              </span>
              <ArrowIcon className="go" />
            </Link>
            <Link to="/faq" className="row-link">
              <span className="min-w-0">
                <span className="title block">In the FAQ</span>
                <span className="small block mt-0.5">Weather, refunds, payment, orders and shipping.</span>
              </span>
              <ArrowIcon className="go" />
            </Link>
            {contact.instagram && (
              <a
                href={`https://www.instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link"
              >
                <span className="min-w-0">
                  <span className="title block">On Instagram</span>
                  <span className="small block mt-0.5">Follow Playmaker Sports.</span>
                </span>
                <ArrowIcon className="go -rotate-45" />
              </a>
            )}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
