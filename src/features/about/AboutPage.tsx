import tentMeta from '@/assets/images/brand/playmaker-tent.jpeg?w=640;960;1280&format=webp&quality=72&as=meta:src;width;height;format';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/ui/Container';
import { Facts } from '@/components/ui/Facts';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { toResponsive } from '@/lib/responsiveImage';
import { Reasons } from './components/Reasons';
import { FACTS, OUR_STORY } from './ourStory';

const tent = toResponsive(tentMeta);

export function AboutPage() {
  return (
    <PageLayout breadcrumb="About">
      <Helmet>
        <title>{PAGE_META.about.title}</title>
        <meta name="description" content={PAGE_META.about.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.about.path}`} />
        <meta property="og:title" content={PAGE_META.about.title} />
        <meta property="og:description" content={PAGE_META.about.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.about.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* The tent is the one lit card on the night ground. */}
      <PageHeader
        breadcrumb="About"
        title="About Playmaker"
        asideAs="photo"
        aside={
          <figure>
            <div className="lit-photo">
              <ResponsiveImage
                image={tent}
                alt="The Playmaker Sports tent, with its blue canopy and yellow logo, set up outside a tournament venue"
                sizes="(min-width:1024px) 560px, 100vw"
                loading="eager"
              />
            </div>
            <figcaption className="caption mt-3">The Playmaker tent, set up for the weekend</figcaption>
          </figure>
        }
      >
        <p className="statement !text-white mt-6 max-w-[20ch] enter enter-2">Built for the game, made for the moment.</p>
        <Facts facts={FACTS} className="mt-9 enter enter-2" />
      </PageHeader>

      <section aria-labelledby="story-title">
        <Container className="sec-y grid gap-8 lg:gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <h2 id="story-title" className="h-section">
            Our story
          </h2>
          <div className="prose min-w-0">
            {OUR_STORY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* The three reasons, each with somewhere to go. */}
      <section className="bg-white border-t border-pm-rule" aria-labelledby="why-title">
        <Container className="sec-y">
          <h2 id="why-title" className="h-section mb-[clamp(28px,3vw,44px)]">
            Why Playmaker
          </h2>
          <Reasons withLinks />
        </Container>
      </section>
    </PageLayout>
  );
}
