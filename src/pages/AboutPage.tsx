import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';

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
      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Built in Lafayette</span>
          <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6">
            About<br />Playmaker
          </h1>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Coming soon</span>
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
            Our story
          </h2>
          <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
            Background on Playmaker Sports — locally run tournaments and custom uniforms, built for Acadiana.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
