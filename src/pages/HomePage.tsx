import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { tournaments } from '../data/events';
import { formatDateRange } from '../lib/dates';
import { PAGE_META, SITE_URL } from '../seo/config';

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const tileRef = useRef<HTMLAnchorElement>(null);
  const [tileWidth, setTileWidth] = useState(224);

  useEffect(() => {
    if (tileRef.current) {
      setTileWidth(tileRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isPaused || tournaments.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % tournaments.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused]);

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

        {/* Metadata text flanking the nav pill — absolutely positioned at nav row height */}
        <div className="absolute top-[10px] left-0 right-0 pointer-events-none z-10 h-16">
          <div className="h-full max-w-[1480px] mx-auto px-6 sm:px-10 flex items-center gap-4 font-mono text-[10.5px] tracking-[0.1em] uppercase text-white/25">
            <div className="hidden lg:block flex-1">
              <span className="text-white/50">01</span> · Lafayette, LA · est. 2024
            </div>
            {/* Spacer matching the nav pill's max-width */}
            <div className="w-[calc(100%-20px)] max-w-[800px] shrink-0" />
            <div className="hidden lg:block flex-1 text-right">
              Locally run · Parent-tested · League-approved
            </div>
          </div>
        </div>

        {/* Centered hero content */}
        <div className="relative max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-20 lg:pt-16 lg:pb-28 flex flex-col items-center text-center">

          <Diamond className="w-7 h-7 text-pm-yellow shrink-0 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }} />

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
        </div>

        {/* ── UPCOMING EVENTS STRIP — auto-advance carousel ── */}
        <div
          className="relative border-t border-white/[0.07]"
          onMouseEnter={() => { setIsPaused(true); setShowArrows(true); }}
          onMouseLeave={() => { setIsPaused(false); setShowArrows(false); }}
        >
          <div className="max-w-[1480px] mx-auto flex">
            {/* "Upcoming" label */}
            <div className="shrink-0 flex items-center px-6 sm:px-10 py-5 border-r border-white/[0.07]">
              <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-white/25">Upcoming</span>
            </div>

            {/* Carousel track */}
            <div className="flex-1 relative overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${activeIndex * tileWidth}px)` }}
              >
                {tournaments.map((t, i) => {
                  const { lines } = formatDateRange(t.startDate, t.endDate);
                  const dateDisplay = lines.join(' ');
                  return (
                    <Link
                      key={t.id}
                      ref={i === 0 ? tileRef : undefined}
                      to="/events"
                      className="group shrink-0 w-56 flex flex-col justify-center gap-0.5 px-6 sm:px-8 py-5 hover:bg-white/[0.04] transition-colors duration-150"
                    >
                      <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/25">{dateDisplay}</span>
                      <span className="font-display uppercase text-[17px] leading-none tracking-[0.005em] text-pm-yellow group-hover:text-pm-yellow-deep transition-colors duration-150">{t.name}</span>
                      <span className="font-mono text-[9.5px] tracking-[0.05em] uppercase text-white/35 mt-0.5">{t.location}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Prev arrow */}
              {showArrows && activeIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => i - 1)}
                  aria-label="Previous event"
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-pm-yellow border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-lg flex items-center justify-center text-pm-black font-bold z-10 transition-colors duration-150"
                >
                  ‹
                </button>
              )}

              {/* Next arrow */}
              {showArrows && activeIndex < tournaments.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => i + 1)}
                  aria-label="Next event"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-pm-yellow border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-lg flex items-center justify-center text-pm-black font-bold z-10 transition-colors duration-150"
                >
                  ›
                </button>
              )}
            </div>

            {/* Full schedule link */}
            <Link
              to="/events"
              className="shrink-0 flex items-center px-6 sm:px-10 py-5 border-l border-white/[0.07] hover:bg-white/[0.04] transition-colors duration-150"
            >
              <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/35 hover:text-pm-yellow transition-colors duration-150">
                Full schedule →
              </span>
            </Link>
          </div>

          {/* Dot indicators */}
          {tournaments.length > 1 && (
            <div className="flex justify-center gap-2 py-2">
              {tournaments.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to event ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                    i === activeIndex ? 'bg-pm-yellow' : 'bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

    </PageLayout>
  );
}
