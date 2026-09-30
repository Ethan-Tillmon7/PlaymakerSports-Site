import tentMeta from '@/assets/images/brand/Playmaker-Tent.jpeg?w=1024;1600&format=webp&quality=62&as=meta:src;width;height;format';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { buttonClass } from '@/components/ui/buttonClass';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL, contact } from '@/config/site';
import { useScrollOut } from '@/hooks/useScrollOut';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

const values = [
  { stat: '2025',      label: 'Year founded'      },
  { stat: 'Lafayette', label: 'Home base'          },
  { stat: '6U–18U',   label: 'Divisions served'   },
];

// Darkened, blur-on-scroll full-viewport background — the largest generated
// WebP width covers every device; a heavier srcset buys nothing here.
const heroBg = [...tentMeta].sort((a, b) => b.width - a.width)[0].src;

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function AboutPage() {
  // Zoom + blur the photo as the hero scrolls away. Written straight to the
  // element once per frame, so scrolling doesn't re-render the page.
  const bgRef = useRef<HTMLDivElement>(null);
  const heroRef = useScrollOut<HTMLElement>((progress) => {
    const bg = bgRef.current;
    if (!bg || prefersReducedMotion) return;
    bg.style.transform = `scale(${1 + progress * 0.1})`;
    bg.style.filter = progress > 0 ? `blur(${progress * 7}px)` : '';
  });
  const [valuesRef, valuesInView] = useInView();

  const countedYear = useCountUp(2025, 1200, valuesInView, 2000);

  return (
    <PageLayout breadcrumb="About" breadcrumbTone="onDark" ground="night">
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
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* All content — stays sharp */}
        <div className="relative z-[2] max-w-[1100px] mx-auto px-6 sm:px-10 py-24 w-full text-center animate-fade-up">

          {/* ── Heading + story ── */}
          <div className="max-w-[640px] mx-auto">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow">
            Our backstory
          </span>
          <h1 className="font-display uppercase text-[clamp(52px,8vw,96px)] leading-[0.85] tracking-[-0.01em] text-white mt-4 text-balance">
            About Playmaker
          </h1>
          <h2 className="font-display uppercase text-[clamp(16px,2.2vw,26px)] leading-[1.1] tracking-[0.01em] text-white/65 mt-5 mb-8">
            Built for the game, made for the moment
          </h2>
          <div className="space-y-5">
            <p className="text-[15px] leading-[1.7] text-white/80">
              Playmaker Sports was founded in 2025 with a straightforward mission: to deliver premium apparel, accessories, and tournament merchandise to athletes and families across the US. From jerseys and gear to custom player cards and exclusive event merchandise, we're committed to making every tournament experience even better.
            </p>
            <p className="text-[15px] leading-[1.7] text-white/80">
              We believe the best brands are built through relationships. That's why we partner with tournament directors, coaches, and organizations to provide reliable service, quality products, and a shopping experience players and families look forward to every weekend.
            </p>
          </div>
          </div>

          {/* ── Stats ── */}
          <div ref={valuesRef} className="mt-14 py-10 border-y border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
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
          <div className="mt-16 sm:mt-20">
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
                  className={buttonClass()}
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
                <ButtonLink to="/faq">See the FAQ</ButtonLink>
              )}
            </div>
          </div>

        </div>
      </section>

    </PageLayout>
  );
}
