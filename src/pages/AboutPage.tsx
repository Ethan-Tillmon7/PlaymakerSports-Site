import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { contact } from '../data/contact';

const values = [
  { stat: '7-day', label: 'Turnaround' },
  { stat: '12-piece', label: 'Minimum order' },
  { stat: 'Acadiana', label: 'Based & fielded' },
  { stat: '6U–14U', label: 'Divisions covered' },
];

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

      {/* ── PAGE HEADER ── */}
      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Built in Lafayette</span>
          <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6">
            About<br />Playmaker
          </h1>
        </div>
      </header>

      {/* ── JAKE'S STORY ── */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">The backstory</span>
            <h2 className="font-display uppercase text-[clamp(32px,4vw,56px)] leading-[0.95] tracking-[0.005em] mt-4 text-pm-black">
              Jake Johnson,<br />Playmaker Sports
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-pm-ink max-w-[560px]">
              <p>
                Playmaker Sports is a Lafayette-based youth sports operation run by Jake Johnson. Jake has been organizing youth baseball and softball tournaments across Acadiana for years, building a reputation for well-run events that start on time and finish right.
              </p>
              <p>
                Alongside the tournament business, Playmaker handles custom uniform orders for teams across the region — sublimated and tackle-twill jerseys, caps, and pants, sized for every player from 6U to high school.
              </p>
            </div>
          </div>

          {/* Photo slot — placeholder stripe until Jake sends a photo */}
          <div className="aspect-[4/5] img-stripe rounded-xl overflow-hidden border border-pm-rule relative">
            <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted bg-white/80 px-2 py-1">
              [ photo · Jake Johnson ]
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES / STATS ── */}
      <section className="bg-pm-paper-2 border-y border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.label} className="bg-white border border-pm-rule rounded-xl p-6">
                <div className="font-display uppercase text-[clamp(28px,3vw,44px)] leading-none tracking-[0.005em] text-pm-black">
                  {v.stat}
                </div>
                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mt-2">
                  {v.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="bg-pm-yellow border-b border-pm-black">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-black/70">Get in touch</span>
              <h2 className="font-display uppercase text-[clamp(40px,5.5vw,80px)] leading-[0.90] tracking-[0.005em] mt-3 text-pm-black">
                Ready to<br />work together?
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-black text-white px-6 h-11 inline-flex items-center justify-center hover:bg-pm-ink transition-colors border-b-2 border-black/40 rounded-xl"
                >
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-transparent text-pm-black px-6 h-11 inline-flex items-center justify-center border-b-2 border-pm-black hover:bg-pm-black/10 transition-colors rounded-xl"
                >
                  {contact.phone}
                </a>
              )}
              {!contact.email && !contact.phone && (
                <Link
                  to="/faq"
                  className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-black text-white px-6 h-11 inline-flex items-center justify-center hover:bg-pm-ink transition-colors border-b-2 border-black/40 rounded-xl"
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
