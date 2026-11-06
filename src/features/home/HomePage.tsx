import tentMeta from '@/assets/images/brand/playmaker-tent.jpeg?w=640;960;1280&format=webp&quality=72&as=meta:src;width;height;format';
import { Fragment, lazy, Suspense, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { NightGround } from '@/components/layout/NightGround';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Facts } from '@/components/ui/Facts';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { FACTS, OUR_STORY, Reasons } from '@/features/about';
import { ContactCard } from '@/features/contact';
import { NextStop, UpcomingEvents, useEvents } from '@/features/events';
import { FAQTeaser } from '@/features/faq';
import { useInView } from '@/hooks/useInView';
import { nightGroundRef } from '@/hooks/useNightGround';
import { askTo } from '@/lib/contactLink';
import { toResponsive } from '@/lib/responsiveImage';

const tent = toResponsive(tentMeta);

// The apparel blocks pull in the whole accessory catalog (every inventory
// photo's srcset), which would multiply this eager chunk. They sit well below
// the fold, so they load as their own chunk; the prerendered HTML already
// contains them.
const TeamUniforms = lazy(() => import('@/features/apparel').then((m) => ({ default: m.TeamUniforms })));
const ApparelShowcase = lazy(() => import('@/features/apparel').then((m) => ({ default: m.ApparelShowcase })));

const BRAND_RAIL = ['Playmaker Sports', 'Baseball', 'Softball', 'Soccer', 'Made for the moment'];

/** Our story: the tent, lit, on its own night. The photo fades into the black toward the words. */
function StoryPanel() {
  const [inViewRef, inView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  // One stable ref for both jobs: the reveal, and telling the nav it's over a black ground.
  const attach = useMemo(
    () => (el: HTMLDivElement | null) => {
      inViewRef(el);
      const leaveNight = nightGroundRef(el);
      return () => {
        inViewRef(null);
        leaveNight?.();
      };
    },
    [inViewRef],
  );

  return (
    <div ref={attach} data-night className={inView ? 'story on-night in' : 'story on-night'}>
      <figure className="story-photo">
        <ResponsiveImage
          image={tent}
          alt="The Playmaker Sports tent, with its blue canopy and yellow logo, set up outside a tournament venue"
          sizes="(min-width:1480px) 733px, (min-width:1024px) 50vw, 100vw"
          // Not lazy: the photo is clipped away until the panel is revealed, and a
          // lazy image only starts loading then, so the reveal would play on an empty box.
          loading="eager"
          fetchPriority="low"
        />
        <figcaption>The Playmaker tent, set up for the weekend</figcaption>
      </figure>
      <div className="story-copy">
        <h2 id="story-title" className="h-section">
          Our story
        </h2>
        <div className="story-body">
          {OUR_STORY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Facts facts={FACTS} className="mt-7" />
        <ButtonLink to="/about" variant="secondary" arrow className="mt-8">
          About Playmaker
        </ButtonLink>
      </div>
    </div>
  );
}

export function HomePage() {
  // One fetch for the hero's "Next stop" line and the schedule board.
  const schedule = useEvents();

  return (
    <PageLayout>
      <Helmet>
        <title>{PAGE_META.home.title}</title>
        <meta name="description" content={PAGE_META.home.description} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content={PAGE_META.home.title} />
        <meta property="og:description" content={PAGE_META.home.description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── HERO: night ground, the form is the one lit card ── */}
      <NightGround variant="home" labelledBy="hero-title">
        <Container className="relative pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid gap-9 lg:gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(400px,500px)]">
            <div className="hero-copy min-w-0 flex flex-col items-start">
              <NextStop result={schedule} />
              <h1 id="hero-title" className="hero-h1 mt-6">
                <span className="ln">Upgrade your</span> <span className="ln">team's look.</span>{' '}
                <span className="wipe">
                  <span className="ln">We'll take it</span> <span className="ln">from there.</span>
                </span>
              </h1>
              <p className="page-lede max-w-[540px] mt-6 xl:mt-auto xl:pt-6 enter enter-2">
                Custom team uniforms built to order, and the game-day accessories players already line up for at the
                Playmaker tent. Tell us what you need and the Playmaker Sports team takes it from there.
              </p>
            </div>
            <div className="min-w-0 enter enter-2">
              <ContactCard />
            </div>
          </div>
        </Container>
      </NightGround>

      {/* ── BRAND RAIL: the canopy. Blue cloth, white lettering, yellow marks. ── */}
      <p className="brand-rail">
        {BRAND_RAIL.map((word, i) => (
          <Fragment key={word}>
            {i > 0 && (
              <svg aria-hidden="true">
                <use href="#pm-diamond" />
              </svg>
            )}
            <span>{word}</span>
          </Fragment>
        ))}
      </p>

      {/* ── THE THREE REASONS ── */}
      <section className="bg-white border-b border-pm-rule">
        <Container className="py-10 lg:py-14">
          <Reasons />
        </Container>
      </section>

      {/* ── OUR STORY ── */}
      <section aria-labelledby="story-title">
        <div className="max-w-pm mx-auto px-3 sm:px-10 pt-[var(--sec-y)]">
          <StoryPanel />
        </div>
      </section>

      {/* ── SCHEDULE BOARD ── */}
      <section id="events" className="scroll-mt-24" aria-labelledby="events-title">
        <Container className="sec-y">
          <UpcomingEvents result={schedule} headingId="events-title" />
        </Container>
      </section>

      {/* ── TEAM UNIFORMS ── */}
      <section className="sec-warm border-y border-pm-rule" aria-labelledby="uniform-title">
        <Container className="sec-y grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
          <Suspense fallback={<div className="min-h-[420px]" />}>
            <TeamUniforms headingId="uniform-title" onHome />
          </Suspense>
        </Container>
      </section>

      {/* ── THE TENT TABLE ── */}
      <section className="bg-white" aria-labelledby="apparel-title">
        <Container className="sec-y">
          <div className="sec-head">
            <div className="min-w-0">
              <h2 id="apparel-title" className="h-section">
                From the tent
              </h2>
              <p className="lead">
                Sold on site at every event. See something you like?{' '}
                <Link to={askTo('something from the tent', 'Parent', { onHome: true })} className="link">
                  Ask and we'll set it aside.
                </Link>
              </p>
            </div>
            <ButtonLink to="/apparel#accessories" variant="secondary" size="sm" arrow className="self-start md:self-auto">
              All apparel
            </ButtonLink>
          </div>
          <Suspense fallback={<div className="min-h-[420px]" />}>
            <ApparelShowcase />
          </Suspense>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-pm-rule" aria-labelledby="faq-title">
        <Container className="sec-y grid gap-8 lg:gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div>
            <h2 id="faq-title" className="h-section">
              Good questions
            </h2>
            <p className="lead mt-3 max-w-[38ch]">
              The ones coaches and parents ask most. The full list covers refunds, payment and shipping too.
            </p>
            <ButtonLink to="/faq" variant="secondary" size="sm" arrow className="mt-5">
              Read the FAQ
            </ButtonLink>
          </div>
          <FAQTeaser />
        </Container>
      </section>
    </PageLayout>
  );
}
