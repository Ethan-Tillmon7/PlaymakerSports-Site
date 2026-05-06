import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { processSteps, alsoAvailable } from '../data/apparel';
import { PAGE_META, SITE_URL } from '../seo/config';
import { ApparelInquiryForm } from '../components/forms/ApparelInquiryForm';
import { PlayerUploadForm } from '../components/forms/PlayerUploadForm';
import { useInView } from '../hooks/useInView';
import type { Product } from '../types/product';

type CatalogState =
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error' };

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col animate-pulse">
          <div className="aspect-[4/5] bg-pm-rule rounded-xl" />
          <div className="pt-5 space-y-3">
            <div className="h-3 bg-pm-rule rounded w-20" />
            <div className="h-5 bg-pm-rule rounded w-32" />
            <div className="h-3 bg-pm-rule rounded w-full" />
            <div className="h-3 bg-pm-rule rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ApparelPage() {
  const [catalogState, setCatalogState] = useState<CatalogState>({ status: 'loading' });
  const [activeSku, setActiveSku] = useState<string | undefined>(undefined);

  const [catalogRef, catalogInView] = useInView();
  const [processRef, processInView] = useInView();
  const [orderRef, orderInView] = useInView();
  const [rosterRef, rosterInView] = useInView();

  useEffect(() => {
    fetch('/api/get-catalog')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Product[]>;
      })
      .then((data) => setCatalogState({ status: 'success', data }))
      .catch(() => setCatalogState({ status: 'error' }));
  }, []);

  const handleGetQuote = (sku: string) => {
    setActiveSku(sku);
    // Small timeout lets React render the updated prop before scrolling
    setTimeout(() => {
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Show first 4 products sorted by displayOrder (the full catalog rebuild is Phase 1D)
  const displayedProducts =
    catalogState.status === 'success' ? catalogState.data.slice(0, 4) : [];

  return (
    <PageLayout breadcrumb="Apparel">
      <Helmet>
        <title>{PAGE_META.apparel.title}</title>
        <meta name="description" content={PAGE_META.apparel.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.apparel.path}`} />
        <meta property="og:title" content={PAGE_META.apparel.title} />
        <meta property="og:description" content={PAGE_META.apparel.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.apparel.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── PAGE HEADER ── */}
      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20 animate-fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-20 items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Custom uniforms · Acadiana made</span>
              <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6 m-0">
                Jerseys<br />built for<br />the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span>
              </h1>
            </div>
            <div className="max-w-[420px]">
              <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] text-pm-ink">
                Pick a base, drop your wordmark, choose numbers and names. Sublimated or tackle-twill, sized YS through Adult 3XL. We send proofs the same day and ship to the dugout in seven business days.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-7">
                <a href="#catalog" className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl">
                  Browse catalog
                </a>
                <a href="#order" className="font-display uppercase text-[16px] tracking-[0.04em] text-pm-black border-b-2 border-pm-black pb-0.5 hover:text-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97]">
                  Get a quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── CATEGORY FILTER ── */}
      <section className="border-b border-pm-rule bg-white sticky top-16 z-20">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between gap-4 overflow-x-auto">
          <ul className="flex items-center gap-1 font-display uppercase text-[14px] tracking-[0.04em] whitespace-nowrap">
            {[
              { label: 'All Apparel', active: true },
              { label: 'Jerseys' },
              { label: 'Caps' },
              { label: 'Pants' },
              { label: 'Practice' },
              { label: 'Patches' },
            ].map(({ label, active }) => (
              <li key={label}>
                <a
                  href="#"
                  className={`px-4 h-9 inline-flex items-center ${
                    active ? 'bg-pm-black text-white rounded-lg' : 'text-pm-ink hover:bg-pm-paper-2 rounded-lg'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] uppercase text-pm-muted shrink-0">
            <span>Sort</span>
            <button className="inline-flex items-center gap-2 border border-pm-rule px-3 h-9 hover:border-pm-ink rounded-lg">
              Featured <span className="text-pm-muted">&#9660;</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CATALOG GRID ── */}
      <section id="catalog" className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">Jerseys</h2>
          {catalogState.status === 'success' && (
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
              {catalogState.data.length} styles
            </span>
          )}
        </div>

        {catalogState.status === 'loading' && <CatalogSkeleton />}

        {catalogState.status === 'error' && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px]">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Catalog unavailable</span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-3">
              Catalog temporarily unavailable. Reach out via the form below.
            </p>
            <a href="#order" className="mt-6 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl">
              Get a quote anyway
            </a>
          </div>
        )}

        {catalogState.status === 'success' && catalogState.data.length === 0 && (
          <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px]">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Coming soon</span>
            <p className="text-[15px] leading-[1.6] text-pm-ink mt-3">
              Catalog coming soon — <a href="#order" className="underline hover:text-pm-yellow-deep">get a quote anyway.</a>
            </p>
          </div>
        )}

        {catalogState.status === 'success' && displayedProducts.length > 0 && (
          <div ref={catalogRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
            {displayedProducts.map((product, i) => (
              <article
                key={product.sku}
                className={`group flex flex-col hover:-translate-y-0.5 transition-transform duration-150 ${catalogInView ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="stage-cream aspect-[4/5] relative overflow-hidden rounded-xl">
                  <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-black/60 bg-white/70 px-2 py-1">
                    {product.category}
                  </div>

                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.displayName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 240" className="w-[64%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]" aria-hidden="true">
                        <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="1.2" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">
                    <span>SKU · {product.sku}</span>
                  </div>
                </div>

                <div className="pt-5 flex flex-col flex-1">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">{product.category}</span>
                  <h3 className="font-display uppercase text-[26px] leading-[0.95] tracking-[0.005em] mt-2 text-pm-black">{product.displayName}</h3>
                  <p className="text-[14px] leading-[1.55] text-pm-ink mt-2">{product.description}</p>

                  {product.sizesAvailable.length > 0 && (
                    <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted mt-3">
                      {product.sizesAvailable.join(' · ')}
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-5 pt-4 border-t border-pm-rule">
                    <div>
                      <div className="font-display text-[22px] leading-none text-pm-black">
                        {product.basePrice != null
                          ? `$${product.basePrice}`
                          : <span className="text-[16px] text-pm-muted">Inquire for pricing</span>
                        }
                        {product.basePrice != null && (
                          <span className="text-pm-muted text-[14px]">/team min 12</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGetQuote(product.sku)}
                      className="font-display uppercase text-[14px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow group-hover:border-pm-black transition-colors"
                    >
                      Get a quote
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-pm-paper-2 border-y border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-8">
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">02 / Process</div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <h2 className="font-display uppercase text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[0.005em] m-0">
                From idea to dugout in 7 days.
              </h2>
              <a href="#" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border-b-2 border-pm-yellow pb-1 hover:border-pm-black self-start">
                Full timeline
              </a>
            </div>
          </div>

          <div ref={processRef}>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((step, i) => (
              <li
                key={step.num}
                className={`p-6 flex flex-col border rounded-xl ${
                  step.yellow ? 'bg-pm-yellow border-pm-yellow-deep' : 'bg-white border-pm-rule'
                } ${processInView ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`font-display text-[44px] leading-none ${step.yellow ? 'text-pm-black' : 'text-pm-yellow-deep'}`}>
                  {step.num}
                </span>
                <h3 className="font-display uppercase text-[22px] leading-[1] tracking-[0.005em] mt-3 text-pm-black">{step.title}</h3>
                <p className={`text-[14px] leading-[1.55] mt-3 flex-1 ${step.yellow ? 'text-pm-black' : 'text-pm-ink'}`}>
                  {step.desc}
                </p>
                <span className={`font-mono text-[10px] tracking-[0.1em] uppercase mt-5 ${step.yellow ? 'text-pm-black/70' : 'text-pm-muted'}`}>
                  {step.day}
                </span>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>

      {/* ── ALSO AVAILABLE ── */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">Also available</h2>
          <a href="#" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border-b-2 border-pm-yellow pb-1 hover:border-pm-black">
            Full catalog
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {alsoAvailable.map((item) => (
            <a key={item.title} href="#" className="group flex flex-col">
              <div className={`${item.stage} aspect-[4/5] relative rounded-xl overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.render()}
                </div>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted bg-white px-2 py-1">
                  {item.label}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="font-display uppercase text-[20px] leading-[1] tracking-[0.005em] text-pm-black">{item.title}</h3>
                <div className="flex items-center justify-between mt-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-muted">
                  <span>{item.price}</span>
                  <span className="group-hover:text-pm-ink">Browse</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="bg-pm-yellow border-y border-pm-black">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-black/70">Ready when you are</span>
            <h2 className="font-display uppercase text-[clamp(40px,6vw,88px)] leading-[0.88] tracking-[0.005em] mt-3 text-pm-black">
              Wear it<br />on opening day.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#catalog" className="font-display uppercase text-[17px] tracking-[0.04em] bg-pm-black text-white px-7 h-12 inline-flex items-center justify-center hover:bg-pm-ink transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-black/40 hover:border-white rounded-xl">
              Start an order
            </a>
            <Link to="/about" className="font-display uppercase text-[17px] tracking-[0.04em] bg-transparent text-pm-black px-7 h-12 inline-flex items-center justify-center border-b-2 border-pm-black hover:bg-pm-black hover:text-pm-yellow transition-[colors,transform] duration-150 active:scale-[0.97] rounded-xl">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ── ORDER FORM ── */}
      <section id="order" className="bg-pm-paper-2 border-t border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
          <div
            ref={orderRef}
            className={`grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-10 ${orderInView ? 'animate-fade-up' : 'opacity-0'}`}
          >
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">Request</div>
            <div>
              <h2 className="font-display uppercase text-[clamp(32px,4.5vw,56px)] leading-[0.95] tracking-[0.005em] m-0">
                Get a quote
              </h2>
              <p className="text-[15px] leading-[1.6] text-pm-ink mt-4 max-w-[480px]">
                Tell us your team, style, and roster count — we'll send a digital proof same-day.
              </p>
            </div>
          </div>
          <div className="max-w-[720px]">
            <ApparelInquiryForm initialSku={activeSku} />
          </div>
        </div>
      </section>

      {/* ── ROSTER UPLOAD ── */}
      <section id="roster" className="border-t border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
          <div
            ref={rosterRef}
            className={`grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-8 items-baseline border-t border-pm-black pt-6 mb-10 ${rosterInView ? 'animate-fade-up' : 'opacity-0'}`}
          >
            <div className="font-mono text-[12px] tracking-[0.1em] text-pm-muted pt-1.5">Roster</div>
            <div>
              <h2 className="font-display uppercase text-[clamp(32px,4.5vw,56px)] leading-[0.95] tracking-[0.005em] m-0">
                Submit your roster
              </h2>
              <p className="text-[15px] leading-[1.6] text-pm-ink mt-4 max-w-[480px]">
                Add each player's name, number, and size. Minimum 12 pieces — mix sizes freely at no extra charge.
              </p>
            </div>
          </div>
          <PlayerUploadForm />
        </div>
      </section>

    </PageLayout>
  );
}
