import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { PAGE_META, SITE_URL } from '../seo/config';
import { EventTicker } from '../components/homepage/EventTicker';

export function HomePage() {
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

      {/* ── HERO ── */}
      <header className="relative bg-pm-black overflow-hidden -mt-16">

        {/* Atmospheric background layers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 14px)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0.07) 40%, transparent 70%)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 130% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)'
          }} />
        </div>

        {/* Spacer clears the nav overlap */}
        <div className="h-16" />


        {/* Centered hero content */}
        <div className="relative max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-20 lg:pt-16 lg:pb-28 flex flex-col items-center text-center">

          <Diamond
            className="w-7 h-7 text-pm-yellow shrink-0 mb-8"
            style={{
              animation: 'fadeUp 0.5s ease-out both 0ms, breathe 3.5s ease-in-out 0.5s infinite',
            }}
          />

          <h1 className="font-display uppercase leading-[0.84] tracking-[-0.005em] text-white m-0 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <span className="block text-[clamp(76px,14.5vw,232px)]">
              <span className="inline-block bg-pm-yellow px-[0.10em] pb-[0.04em] rounded-lg">
                <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
              </span>
            </span>
            <span className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-5">
              <span className="flex-1 max-w-[80px] lg:max-w-[160px] h-px bg-white/20" />
              <span className="font-display text-[clamp(22px,3.8vw,54px)] tracking-[0.30em] sm:tracking-[0.34em] text-white/50">
                SPORTS
              </span>
              <span className="flex-1 max-w-[80px] lg:max-w-[160px] h-px bg-white/20" />
            </span>
          </h1>

          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/35 mt-6 animate-fade-up" style={{ animationDelay: '190ms' }}>
            Made for the Moment
          </p>

          <p className="text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-white/50 max-w-[560px] mt-7 animate-fade-up" style={{ animationDelay: '280ms' }}>
            Built for the Saturday lineup card. We host the tournaments your kids want to play in — and outfit the teams who show up to win them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: '420ms' }}>
            <Link to="/events" className="font-display uppercase text-[18px] tracking-[0.04em] bg-pm-yellow text-pm-black px-7 h-12 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl">
              View events
            </Link>
            <Link to="/apparel" className="font-display uppercase text-[18px] tracking-[0.04em] bg-transparent text-white px-7 h-12 inline-flex items-center justify-center hover:bg-white/10 transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-white/30 hover:border-white/60 rounded-xl">
              Shop apparel
            </Link>
          </div>
        </div>{/* end hero content */}

        <EventTicker />
      </header>

    </PageLayout>
  );
}
