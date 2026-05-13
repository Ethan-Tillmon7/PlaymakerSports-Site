import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { alsoAvailable } from '../data/apparel';
import { PAGE_META, SITE_URL } from '../seo/config';
import { ApparelInquiryForm } from '../components/forms/ApparelInquiryForm';
import { PlayerUploadForm } from '../components/forms/PlayerUploadForm';
import { useInView } from '../hooks/useInView';
import type { Product, ProductCategory } from '../types/product';
import { ProductDetailModal } from '../components/modals/ProductDetailModal';

type FilterCategory = 'All' | ProductCategory;

type CatalogState =
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error' };

const FILTER_TABS: { label: string; value: FilterCategory }[] = [
  { label: 'All Apparel', value: 'All' },
  { label: 'Jerseys', value: 'Jersey' },
  { label: 'Caps', value: 'Cap' },
  { label: 'Trinkets', value: 'Trinket' },
];

const CATEGORY_HEADING: Record<FilterCategory, string> = {
  All: 'All Apparel',
  Jersey: 'Jerseys',
  Cap: 'Caps',
  Pants: 'Pants',
  Practice: 'Practice Gear',
  Patch: 'Patches',
  Trinket: 'Trinkets',
};

const categoryStage: Record<ProductCategory, string> = {
  Jersey: 'stage-cream',
  Cap: 'stage-stone',
  Pants: 'stage-sky',
  Practice: 'stage-mint',
  Patch: 'stage-blush',
  Trinket: 'stage-paper',
};

const CAROUSEL_CATEGORIES: ProductCategory[] = ['Jersey', 'Cap', 'Pants', 'Practice', 'Patch', 'Trinket'];


const CARD_W = 190;
const CARD_GAP = 16;

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

function ProductPlaceholder({ category }: { category: ProductCategory }) {
  if (category === 'Jersey') {
    return (
      <svg viewBox="0 0 200 240" className="w-[64%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]" aria-hidden="true">
        <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="1.2" />
      </svg>
    );
  }
  if (category === 'Cap') {
    return (
      <svg
        viewBox="0 0 200 160"
        className="w-[72%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]"
        aria-hidden="true"
      >
        {/* Crown dome */}
        <path
          d="M 12 108 C 12 40 100 10 100 10 C 100 10 188 40 188 108 Z"
          fill="white"
          stroke="#D9D5C4"
          strokeWidth="1.8"
        />
        {/* Brim */}
        <rect x="2" y="106" width="196" height="20" rx="10" fill="white" stroke="#D9D5C4" strokeWidth="1.8" />
        {/* Center seam */}
        <line x1="100" y1="13" x2="100" y2="108" stroke="#E8E4D8" strokeWidth="1" />
        {/* Crown button */}
        <circle cx="100" cy="13" r="4" fill="#D9D5C4" />
        {/* Diamond mark centered in front panel */}
        <g transform="translate(82, 44) scale(0.36)">
          <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="#F5C842" />
          <path d="M50 24 L76 50 L50 76 L24 50 Z" fill="white" />
          <line x1="50" y1="8" x2="50" y2="24" stroke="white" strokeWidth="3" />
          <line x1="50" y1="76" x2="50" y2="92" stroke="white" strokeWidth="3" />
          <line x1="8" y1="50" x2="24" y2="50" stroke="white" strokeWidth="3" />
          <line x1="76" y1="50" x2="92" y2="50" stroke="white" strokeWidth="3" />
        </g>
      </svg>
    );
  }
  if (category === 'Pants') {
    return (
      <div className="w-[36%] h-[72%] bg-white border border-pm-rule shadow-[0_18px_30px_rgba(17,17,17,0.10)] relative rounded-sm">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-pm-yellow rounded-full" />
      </div>
    );
  }
  if (category === 'Practice') {
    return (
      <div className="w-[62%] h-[44%] bg-pm-black shadow-[0_18px_30px_rgba(17,17,17,0.18)] flex items-center justify-center rounded-sm">
        <span className="font-display uppercase text-[20px] tracking-[0.04em] text-pm-yellow">Practice</span>
      </div>
    );
  }
  if (category === 'Patch') {
    return (
      <div className="w-[44%] aspect-square bg-pm-yellow border-[3px] border-pm-black flex items-center justify-center shadow-[0_18px_30px_rgba(17,17,17,0.12)] rounded-sm">
        <Diamond className="w-2/3 h-2/3 text-pm-black" />
      </div>
    );
  }
  return (
    <div className="w-[48%] aspect-square border-2 border-pm-rule bg-white shadow-[0_18px_30px_rgba(17,17,17,0.08)] flex items-center justify-center rounded-lg">
      <Diamond className="w-12 h-12 text-pm-muted" />
    </div>
  );
}

interface CategoryCarouselProps {
  category: ProductCategory;
  products: Product[];
  onViewAll: (category: ProductCategory) => void;
  onProductClick: (product: Product) => void;
}

function CategoryCarousel({ category, products, onViewAll, onProductClick }: CategoryCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      setVisibleCount(
        Math.max(1, Math.floor((containerRef.current.offsetWidth + CARD_GAP) / (CARD_W + CARD_GAP)))
      );
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < products.length;

  const advance = () =>
    setStartIndex((i) => Math.min(i + visibleCount, Math.max(0, products.length - visibleCount)));
  const retreat = () =>
    setStartIndex((i) => Math.max(0, i - visibleCount));

  const categoryLabel = CATEGORY_HEADING[category];

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-baseline justify-between border-t border-pm-black pt-4 mb-5">
        <h2 className="font-display uppercase text-[28px] leading-none tracking-[0.005em] m-0">
          {categoryLabel}
        </h2>
        <button
          type="button"
          onClick={() => onViewAll(category)}
          className="font-display uppercase text-[13px] tracking-[0.04em] text-pm-black border-b-2 border-pm-yellow pb-0.5 hover:border-pm-black transition-colors duration-150"
        >
          See all {categoryLabel.toLowerCase()} →
        </button>
      </div>

      {/* Outer: relative for button positioning, px-5 gives buttons room */}
      <div className="relative px-5">
        {/* Inner: clips the track, measured for visibleCount */}
        <div className="relative overflow-hidden" ref={containerRef}>
          <div
            className="flex gap-4 transition-transform duration-200"
            style={{ transform: `translateX(-${startIndex * (CARD_W + CARD_GAP)}px)` }}
          >
            {products.map((product) => (
              <article
                key={product.sku}
                className="w-[190px] flex-shrink-0 flex flex-col hover:-translate-y-0.5 transition-transform duration-150 cursor-pointer group"
                onClick={() => onProductClick(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onProductClick(product);
                  }
                }}
              >
                <div className={`${categoryStage[product.category]} aspect-[4/5] relative overflow-hidden rounded-xl`}>
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
                      <ProductPlaceholder category={product.category} />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">
                    SKU · {product.sku}
                  </div>
                </div>
                <div className="pt-4 flex flex-col flex-1">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">{product.category}</span>
                  <h3 className="font-display uppercase text-[22px] leading-[0.95] tracking-[0.005em] mt-2 text-pm-black">
                    {product.displayName}
                  </h3>
                  <p className="text-[13px] leading-[1.5] text-pm-ink mt-2">{product.description}</p>
                  {product.sizesAvailable.length > 0 && (
                    <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted mt-3">
                      {product.sizesAvailable.join(' · ')}
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-pm-rule font-display text-[18px] leading-none text-pm-black">
                    {product.basePrice != null ? (
                      <>
                        ${product.basePrice}
                        <span className="text-pm-muted text-[13px]">/team</span>
                      </>
                    ) : (
                      <span className="text-[14px] text-pm-muted">Inquire for pricing</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right fade — inside overflow-hidden so it clips to track edge */}
          {canNext && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-pm-paper pointer-events-none" />
          )}
        </div>

        {/* Buttons — outside overflow-hidden so they are not clipped */}
        {canPrev && (
          <button
            type="button"
            onClick={retreat}
            aria-label={`Previous ${categoryLabel}`}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-pm-yellow border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-lg flex items-center justify-center text-pm-black font-bold text-lg z-10 transition-colors duration-150"
          >
            ‹
          </button>
        )}
        {canNext && (
          <button
            type="button"
            onClick={advance}
            aria-label={`Next ${categoryLabel}`}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-pm-yellow border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-lg flex items-center justify-center text-pm-black font-bold text-lg z-10 transition-colors duration-150"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}


export function ApparelPage() {
  const [catalogState, setCatalogState] = useState<CatalogState>({ status: 'loading' });
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalProducts, setModalProducts] = useState<Product[]>([]);

  const [catalogRef, catalogInView] = useInView();
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

  const displayedProducts =
    catalogState.status === 'success'
      ? activeCategory === 'All'
        ? catalogState.data
        : catalogState.data.filter((p) => p.category === activeCategory)
      : [];

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
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">
            Custom uniforms · Acadiana made
          </span>
          <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
            Jerseys<br />built for<br />the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span>
          </h1>
        </div>
      </header>

      {/* ── CATEGORY FILTER ── */}
      <section className="border-b border-pm-rule bg-white sticky top-16 z-20">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between gap-4 overflow-x-auto">
          <ul className="flex items-center gap-1 font-display uppercase text-[14px] tracking-[0.04em] whitespace-nowrap">
            {FILTER_TABS.map(({ label, value }) => (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(value)}
                  className={`px-4 h-9 inline-flex items-center transition-colors duration-150 rounded-lg ${
                    activeCategory === value
                      ? 'bg-pm-black text-white'
                      : 'text-pm-ink hover:bg-pm-paper-2'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] uppercase text-pm-muted shrink-0">
            {catalogState.status === 'success' && (
              <span>{displayedProducts.length} {displayedProducts.length === 1 ? 'item' : 'items'}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalog" ref={catalogRef} className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-14 pb-16">

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

        {/* ALL view — stacked carousels per category */}
        {catalogState.status === 'success' && catalogState.data.length > 0 && activeCategory === 'All' && (
          <>
            {CAROUSEL_CATEGORIES
              .map((cat) => ({ cat, items: catalogState.data.filter((p) => p.category === cat) }))
              .filter(({ items }) => items.length > 0)
              .map(({ cat, items }) => (
                <CategoryCarousel
                  key={cat}
                  category={cat}
                  products={items}
                  onViewAll={(c) => setActiveCategory(c)}
                  onProductClick={(product) => {
                    setSelectedProduct(product);
                    setModalProducts(items);
                  }}
                />
              ))}
          </>
        )}

        {/* SINGLE-CATEGORY view — existing grid */}
        {catalogState.status === 'success' && catalogState.data.length > 0 && activeCategory !== 'All' && (
          <>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">
                {CATEGORY_HEADING[activeCategory]}
              </h2>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                {displayedProducts.length} {displayedProducts.length === 1 ? 'style' : 'styles'}
              </span>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px]">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Nothing here yet</span>
                <p className="text-[15px] leading-[1.6] text-pm-ink mt-3">
                  No {CATEGORY_HEADING[activeCategory].toLowerCase()} in the catalog yet.{' '}
                  <button
                    type="button"
                    onClick={() => setActiveCategory('All')}
                    className="underline hover:text-pm-yellow-deep"
                  >
                    View all apparel
                  </button>{' '}
                  or <a href="#order" className="underline hover:text-pm-yellow-deep">get a quote.</a>
                </p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20 ${catalogInView ? 'animate-fade-up' : 'opacity-0'}`}>
                {displayedProducts.map((product, i) => (
                  <article
                    key={product.sku}
                    className="group flex flex-col hover:-translate-y-0.5 transition-transform duration-150 cursor-pointer"
                    style={{ animationDelay: `${i * 80}ms` }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalProducts(displayedProducts);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProduct(product);
                        setModalProducts(displayedProducts);
                      }
                    }}
                  >
                    <div className={`${categoryStage[product.category]} aspect-[4/5] relative overflow-hidden rounded-xl`}>
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
                          <ProductPlaceholder category={product.category} />
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
                        <div className="font-display text-[22px] leading-none text-pm-black">
                          {product.basePrice != null
                            ? `$${product.basePrice}`
                            : <span className="text-[16px] text-pm-muted">Inquire for pricing</span>
                          }
                          {product.basePrice != null && (
                            <span className="text-pm-muted text-[14px]">/team</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

      </section>

      {/* ── ALSO AVAILABLE ── */}
      {false && (
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
      )}

      {/* ── ORDER + ROSTER ── */}
      <section id="order" className="bg-pm-paper-2 border-t border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left — Get a quote */}
            <div>
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
              <ApparelInquiryForm />
            </div>

            {/* Right — Submit your roster */}
            <div>
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
                    Add each player's name, number, and size. Mix sizes freely at no extra charge.
                  </p>
                </div>
              </div>
              <PlayerUploadForm />
            </div>

          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          initialProduct={selectedProduct}
          allProducts={modalProducts}
          onClose={() => {
            setSelectedProduct(null);
            setModalProducts([]);
          }}
        />
      )}
    </PageLayout>
  );
}
