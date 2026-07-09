import tentMeta from '../assets/images/brand/Playmaker-Tent.jpeg?w=1024;1600&format=webp&quality=62&as=metadata';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { contact } from '../data/contact';
import { useScrollOut } from '../hooks/useScrollOut';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';

const values = [
  { stat: '2025',      label: 'Year founded'      },
  { stat: 'Lafayette', label: 'Home base'          },
  { stat: '6U–14U',   label: 'Divisions served'   },
];

// Darkened, blur-on-scroll full-viewport background — the largest generated
// WebP width covers every device; a heavier srcset buys nothing here.
const heroBg = [...tentMeta].sort((a, b) => b.width - a.width)[0].src;

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function AboutPage() {
  const [heroRef, heroProgress] = useScrollOut();
  const [valuesRef, valuesInView] = useInView();

  const bgScale = prefersReducedMotion ? 1 : 1 + heroProgress * 0.1;
  const bgBlur  = prefersReducedMotion ? 0 : heroProgress * 7;
  const countedYear = useCountUp(2025, 1200, valuesInView);

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

      {/* ── SINGLE FULL SECTION ── */}
      <section
        ref={heroRef}
        className="relative -mt-16 min-h-[100svh] overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Photo background — zooms in and blurs as you scroll past */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${bgScale})`,
            filter: `blur(${bgBlur}px)`,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* All content — stays sharp */}
        <div className="relative z-[2] max-w-[1100px] mx-auto px-6 sm:px-10 py-24 w-full text-center animate-fade-up">

          {/* ── Heading ── */}
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow">
            Our backstory
          </span>

          {/* ── Story ── */}
          <div className="mt-10 pt-10 border-t border-white/20 max-w-[640px] mx-auto">
          <h1 className="font-display uppercase text-[clamp(52px,8vw,96px)] leading-[0.85] tracking-[-0.01em] text-white">
            About Playmaker
          </h1>
          <h2 className="font-display uppercase text-[clamp(16px,2.2vw,26px)] leading-[1.1] tracking-[0.01em] text-white/65 mt-4 mb-8">
            Built for the game, rooted in Lafayette
          </h2>
          <div className="space-y-5">
            <p className="text-[15px] leading-[1.7] text-white/80">
              Playmaker Sports was founded in 2025 with a straightforward mission: bring high-quality merchandise and a better buying experience to tournaments across the South.
            </p>
            <p className="text-[15px] leading-[1.7] text-white/80">
              We show up to events throughout the region — stocking jerseys, accessories, batting gear, hats, player cards, and custom apparel for athletes from 6U to high school. From Acadiana to wherever the schedule takes us, Playmaker is on the sideline.
            </p>
            <p className="text-[15px] leading-[1.7] text-white/80">
              What separates us from the big vendors is simple: when you reach out to Playmaker, you're talking to a real person who genuinely cares. We build relationships with tournament directors, coaches, and families because every athlete deserves to look and feel the part.
            </p>
          </div>
          </div>

          {/* ── Stats ── */}
          <div ref={valuesRef} className="mt-12 pt-12 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {values.map((v, i) => (
              <div key={v.label}>
                <div className="font-display uppercase text-[clamp(32px,4vw,56px)] leading-none tracking-[0.005em] text-white">
                  {i === 0 ? countedYear : v.stat}
                </div>
                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-yellow mt-2">
                  {v.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="mt-12 pt-12 border-t border-white/20">
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/50">
              Get in touch
            </span>
            <h2 className="font-display uppercase text-[clamp(36px,5vw,72px)] leading-[0.90] tracking-[0.005em] text-white mt-3">
              Ready to work together?
            </h2>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep rounded-xl"
                >
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-white/10 text-white px-6 h-11 inline-flex items-center justify-center border border-white/25 hover:bg-white/20 transition-[colors,transform] duration-150 active:scale-[0.97] rounded-xl"
                >
                  {contact.phone}
                </a>
              )}
              {!contact.email && !contact.phone && (
                <Link
                  to="/faq"
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep rounded-xl"
                >
                  See the FAQ
                </Link>
              )}
            </div>
          </div>

        </div>
      </section>

    </PageLayout>
  );
}
