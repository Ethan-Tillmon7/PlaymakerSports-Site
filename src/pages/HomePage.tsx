import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { tournaments } from '../data/events';
import type { Tournament } from '../data/events';
import { PAGE_META, SITE_URL } from '../seo/config';

function StatusPill({ status, text }: { status: Tournament['status']; text: string }) {
  if (status === 'open') return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-success bg-pm-success/10 px-2.5 py-1 border border-pm-success/30 rounded-full">
      {text}
    </span>
  );
  if (status === 'almost') return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-yellow-deep bg-pm-yellow-soft px-2.5 py-1 border border-pm-yellow-deep/40 rounded-full">
      {text}
    </span>
  );
  return (
    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted bg-pm-rule/40 px-2.5 py-1 border border-pm-rule rounded-full">
      {text}
    </span>
  );
}

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
      {/* -mt-16 pulls the hero up behind the floating nav so its dark bg fills the side gaps */}
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

        {/* Metadata strip */}
        <div className="relative max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-0 flex items-baseline justify-between font-mono text-[10.5px] tracking-[0.1em] uppercase text-white/25">
          <div><span className="text-white/50">01</span> · Lafayette, LA · est. 2024</div>
          <div className="hidden sm:block">Locally run · Parent-tested · League-approved</div>
        </div>

        {/* Centered hero content */}
        <div className="relative max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-20 lg:pt-16 lg:pb-28 flex flex-col items-center text-center">

          <Diamond className="w-7 h-7 text-pm-yellow shrink-0 mb-8" />

          <h1 className="font-display uppercase leading-[0.84] tracking-[-0.005em] text-white m-0">
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

          <p className="text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-white/50 max-w-[560px] mt-8">
            Built for the Saturday lineup card. We host the tournaments your kids want to play in — and outfit the teams who show up to win them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link to="/events" className="font-display uppercase text-[18px] tracking-[0.04em] bg-pm-yellow text-pm-black px-7 h-12 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors duration-150 border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl">
              View events
            </Link>
            <Link to="/apparel" className="font-display uppercase text-[18px] tracking-[0.04em] bg-transparent text-white px-7 h-12 inline-flex items-center justify-center hover:bg-white/10 transition-colors duration-150 border-b-2 border-white/30 hover:border-white/60 rounded-xl">
              Shop apparel
            </Link>
          </div>

          <div className="mt-8 font-mono text-[10.5px] tracking-[0.08em] uppercase text-white/30">
            <Link to="/events" className="text-white/40 hover:text-white/70 underline underline-offset-4 decoration-white/20 transition-colors duration-150">
              View full schedule
            </Link>
          </div>
        </div>

        {/* Marquee */}
        <div className="bg-pm-yellow border-t-2 border-pm-yellow-deep overflow-hidden">
          <div className="ticker-track flex whitespace-nowrap font-display uppercase text-[clamp(38px,6vw,72px)] leading-none tracking-[0.005em] py-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-8 pr-8" aria-hidden={i === 1 ? true : undefined}>
                {['Bayou Classic', 'Cajun Showdown', 'Sugarcane Slam', 'Gulf Coast Cup', 'Acadiana Open', 'Spring Opener'].map((name) => (
                  <>
                    <span key={name} className="text-pm-black">{name}</span>
                    <span key={`${name}-dot`} className="text-pm-black/40">&#9670;</span>
                  </>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── SERVICES ── */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-8">
          <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">02 / What we do</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-display uppercase text-[clamp(32px,4.5vw,56px)] leading-[0.95] tracking-[0.005em] m-0 max-w-[820px]">
              Two things,<br />done for the <span className="bg-pm-yellow px-2 rounded-md">parish</span>.
            </h2>
            <p className="text-[15px] leading-[1.55] text-pm-muted max-w-[360px]">
              No upsells, no spreadsheet portals. Just tournaments parents want to drive to and uniforms that show up before opening day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="group bg-white border border-pm-rule hover:border-pm-black transition-colors flex flex-col rounded-xl overflow-hidden">
            <div className="aspect-[2/1] img-stripe relative border-b border-pm-rule group-hover:border-pm-black transition-colors flex items-end justify-between p-4">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted bg-white/80 px-2 py-1">[ image · field at golden hour ]</span>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-pm-yellow text-pm-black px-2 py-1">01</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">Weekend tournaments</span>
              <h3 className="font-display uppercase text-[20px] lg:text-[24px] leading-[0.95] tracking-[0.005em] mt-3 text-pm-black">
                Tournaments that run on time.
              </h3>
              <p className="text-[14px] leading-[1.6] text-pm-ink mt-3 max-w-[440px]">
                Three-game guarantees, real umpires, brackets posted on time. We handle pool play, fields, and the trophy that ends up on a kid's dresser.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-y-2 gap-x-6 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                <li>• 6U through 14U</li>
                <li>• Coach &amp; kid pitch</li>
                <li>• Acadiana &amp; Gulf Coast</li>
                <li>• Insured &amp; sanctioned</li>
              </ul>
              <Link to="/events" className="font-display uppercase text-[15px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow self-start mt-6 group-hover:border-pm-black transition-colors">
                See the schedule
              </Link>
            </div>
          </article>

          <article className="group bg-white border border-pm-rule hover:border-pm-black transition-colors flex flex-col rounded-xl overflow-hidden">
            <div className="aspect-[2/1] img-stripe-warm relative border-b border-pm-rule group-hover:border-pm-black transition-colors flex items-end justify-between p-4">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black/70 bg-white/80 px-2 py-1">[ image · jersey flat lay ]</span>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-pm-black text-white px-2 py-1">02</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">Custom apparel</span>
              <h3 className="font-display uppercase text-[20px] lg:text-[24px] leading-[0.95] tracking-[0.005em] mt-3 text-pm-black">
                Uniforms that beat opening day.
              </h3>
              <p className="text-[14px] leading-[1.6] text-pm-ink mt-3 max-w-[440px]">
                Jerseys, caps, pants, and patches — designed with you, printed locally, and shipped to the dugout in seven business days.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-y-2 gap-x-6 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                <li>• Sublimated &amp; tackle-twill</li>
                <li>• Numbers &amp; names included</li>
                <li>• 7-day turnaround</li>
                <li>• YS through Adult 3XL</li>
              </ul>
              <Link to="/apparel" className="font-display uppercase text-[15px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow self-start mt-6 group-hover:border-pm-black transition-colors">
                Start an order
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="bg-pm-paper-2 border-y border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-8">
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">03 / Upcoming</div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <h2 className="font-display uppercase text-[clamp(32px,4.5vw,56px)] leading-[0.95] tracking-[0.005em] m-0">Upcoming Events</h2>
              <Link to="/events" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border-b-2 border-pm-yellow pb-1 hover:border-pm-black self-start">
                Full schedule
              </Link>
            </div>
          </div>

          <div className="bg-white border border-pm-black rounded-xl overflow-hidden">
            {tournaments.map((t, i) => (
              <Link
                key={t.name}
                to="/events"
                className={`group grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr_auto] items-center gap-4 sm:gap-6 px-4 sm:px-5 py-4 hover:bg-pm-paper-2 transition-colors ${i < tournaments.length - 1 ? 'border-b border-pm-rule' : ''}`}
              >
                <div className="bg-pm-yellow text-pm-black aspect-square flex flex-col items-center justify-center leading-none border-b-2 border-pm-yellow-deep group-hover:border-pm-black rounded-lg">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{t.month}</span>
                  <span className="font-display text-[24px] sm:text-[28px] mt-0.5">{t.day}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display uppercase text-[17px] sm:text-[20px] leading-[0.95] tracking-[0.005em] text-pm-black">{t.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                    <span>{t.location}</span><span className="text-pm-rule">·</span>
                    <span>{t.division}</span><span className="text-pm-rule">·</span>
                    <span>{t.games}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 col-start-3">
                  <StatusPill status={t.status} text={t.spotsText} />
                  <span className="font-display uppercase text-[15px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow group-hover:border-pm-black">
                    Details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPAREL TEASER ── */}
      <section className="bg-pm-black text-white">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-white/30 pt-6 mb-8">
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-yellow pt-1.5">04 / Apparel</div>
            <h2 className="font-display uppercase text-[clamp(36px,5.5vw,80px)] leading-[0.92] tracking-[0.005em] m-0 text-white max-w-[1000px]">
              Custom uniforms.<br />Shipped to the dugout.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-end">
            <p className="text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-white/75 max-w-[600px]">
              Pick a base, drop your wordmark, choose numbers and names. We send proofs the same day, print locally, and ship to the field in seven business days.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/apparel" className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-white transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-yellow-deep rounded-xl">
                Browse jerseys
              </Link>
              <Link to="/about" className="font-display uppercase text-[16px] tracking-[0.04em] bg-transparent text-white px-6 h-11 inline-flex items-center justify-center border-b-2 border-pm-yellow hover:bg-white/5 rounded-xl">
                Get a quote
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <div className="aspect-[3/4] bg-white relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 img-stripe" />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted bg-white px-2 py-1 rounded-md">[ home jersey ]</div>
              <div className="absolute top-3 right-3 font-display text-[40px] leading-none text-pm-black/15">07</div>
            </div>
            <div className="aspect-[3/4] bg-pm-yellow relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 img-stripe-warm" />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black bg-white px-2 py-1 rounded-md">[ road jersey ]</div>
              <div className="absolute top-3 right-3 font-display text-[40px] leading-none text-pm-black/30">12</div>
            </div>
            <div className="aspect-[3/4] bg-pm-navy relative overflow-hidden rounded-lg">
              <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 9px)' }} />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black bg-pm-yellow px-2 py-1 rounded-md">[ alternate ]</div>
              <div className="absolute top-3 right-3 font-display text-[40px] leading-none text-white/25">23</div>
            </div>
            <div className="aspect-[3/4] bg-pm-cream relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 img-stripe" />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black bg-white px-2 py-1 rounded-md">[ throwback ]</div>
              <div className="absolute top-3 right-3 font-display text-[40px] leading-none text-pm-black/20">42</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="bg-pm-yellow border-y border-pm-black">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-black/70">Get on the schedule</span>
            <h2 className="font-display uppercase text-[clamp(44px,6vw,96px)] leading-[0.88] tracking-[0.005em] mt-3 text-pm-black">
              Make<br />the play.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/events" className="font-display uppercase text-[17px] tracking-[0.04em] bg-pm-black text-white px-7 h-12 inline-flex items-center justify-center hover:bg-pm-ink transition-colors border-b-2 border-black/40 hover:border-white rounded-xl">
              View events
            </Link>
            <Link to="/apparel" className="font-display uppercase text-[17px] tracking-[0.04em] bg-transparent text-pm-black px-7 h-12 inline-flex items-center justify-center border-b-2 border-pm-black hover:bg-pm-black hover:text-pm-yellow transition-colors rounded-xl">
              Order apparel
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
