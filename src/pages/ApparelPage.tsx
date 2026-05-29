import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { Diamond } from '../components/layout/DiamondMark';
import { PAGE_META, SITE_URL } from '../seo/config';
import { ApparelInquiryForm } from '../components/forms/ApparelInquiryForm';
import { PlayerUploadForm } from '../components/forms/PlayerUploadForm';
import { useInView } from '../hooks/useInView';
import type { Product, ProductCategory } from '../types/product';
import { ProductDetailModal } from '../components/modals/ProductDetailModal';
import { useLoadingBarStore } from '../store/loadingBarStore';

type FilterCategory = 'All' | ProductCategory;
type ActiveView = FilterCategory | 'get-a-quote' | 'submit-roster';

type CatalogState =
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error' };

const SIDEBAR_FILTER_TABS: { label: string; value: FilterCategory }[] = [
  { label: 'All Apparel', value: 'All' },
  { label: 'Jerseys', value: 'Jersey' },
  { label: 'Trinkets', value: 'Trinket' },
];

const SIDEBAR_FORM_TABS: { label: string; value: 'get-a-quote' | 'submit-roster' }[] = [
  { label: 'Custom Order', value: 'get-a-quote' },
];

// Combined for mobile tab strip (consumed by the mobile sidebar in Task 7)
export const MOBILE_TABS = [
  ...SIDEBAR_FILTER_TABS,
  ...SIDEBAR_FORM_TABS,
] as { label: string; value: ActiveView }[];

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

// Cap excluded
const CATALOG_CATEGORIES: ProductCategory[] = ['Jersey', 'Pants', 'Practice', 'Patch', 'Trinket'];


function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col">
          <div className="aspect-[4/5] bg-shimmer animate-shimmer rounded-xl" />
          <div className="pt-5 space-y-3">
            <div className="h-3 bg-shimmer animate-shimmer rounded w-20" />
            <div className="h-5 bg-shimmer animate-shimmer rounded w-32" />
            <div className="h-3 bg-shimmer animate-shimmer rounded w-full" />
            <div className="h-3 bg-shimmer animate-shimmer rounded w-3/4" />
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

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <article
      className="group flex flex-col hover:-translate-y-0.5 transition-transform duration-150 cursor-pointer"
      onClick={() => onClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(product);
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
      <div className="pt-3 flex flex-col flex-1">
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">{product.category}</span>
        <h3 className="font-display uppercase text-[19px] leading-[0.95] tracking-[0.005em] mt-1.5 text-pm-black">
          {product.displayName}
        </h3>
        <p className="text-[12.5px] leading-[1.5] text-pm-ink mt-1.5">{product.description}</p>
        {product.sizesAvailable.length > 0 && (
          <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted mt-2">
            {product.sizesAvailable.join(' · ')}
          </div>
        )}
        <div className="flex-1 min-h-[12px]" />
        <div className="pt-2.5 border-t border-pm-rule font-display text-[16px] leading-none text-pm-black">
          {product.basePrice != null ? (
            <>
              ${product.basePrice}
              <span className="text-pm-muted text-[12px]">/team</span>
            </>
          ) : (
            <span className="text-[13px] text-pm-muted">Inquire for pricing</span>
          )}
        </div>
      </div>
    </article>
  );
}

interface CategorySectionProps {
  category: ProductCategory;
  products: Product[];
  onProductClick: (product: Product) => void;
}

interface CarouselCategorySectionProps extends CategorySectionProps {
  onSeeAll: () => void;
}

function CarouselCategorySection({ category, products, onProductClick, onSeeAll }: CarouselCategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [sectionRef, sectionInView] = useInView();

  function handleMouseDown(e: React.MouseEvent) {
    isDown.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current?.scrollLeft ?? 0;
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDown.current || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4) setDragging(true);
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  }

  function handleMouseUp() {
    isDown.current = false;
    setDragging(false);
  }

  return (
    <div ref={sectionRef} className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display uppercase text-[28px] leading-none tracking-[0.005em] m-0">
          {CATEGORY_HEADING[category]}
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="font-mono text-[10px] tracking-[0.12em] uppercase text-pm-muted hover:text-pm-ink transition-colors duration-150 shrink-0 ml-4"
        >
          See all →
        </button>
      </div>
      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] select-none ${
          dragging ? 'cursor-grabbing [&>*]:pointer-events-none' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {products.map((product, i) => (
          <div
            key={product.sku}
            className={`flex-none w-[200px] ${sectionInView ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProductCard
              product={product}
              onClick={onProductClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


export function ApparelPage() {
  const [catalogState, setCatalogState] = useState<CatalogState>({ status: 'loading' });
  const [activeView, setActiveView] = useState<ActiveView>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalProducts, setModalProducts] = useState<Product[]>([]);

  const [catalogRef, catalogInView] = useInView();

  const loadingBar = useLoadingBarStore();

  const isFormView = activeView === 'get-a-quote' || activeView === 'submit-roster';
  const activeCategory: FilterCategory = isFormView ? 'All' : (activeView as FilterCategory);

  const displayedProducts =
    catalogState.status === 'success' && !isFormView
      ? activeCategory === 'All'
        ? catalogState.data
        : catalogState.data.filter((p) => p.category === activeCategory)
      : [];

  useEffect(() => {
    loadingBar.start();
    fetch('/api/get-catalog')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        loadingBar.done();
        setCatalogState({ status: 'success', data });
      })
      .catch(() => {
        loadingBar.done();
        setCatalogState({ status: 'error' });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            Jerseys built for the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span>
          </h1>
        </div>
      </header>

      {/* ── MOBILE TAB STRIP (< lg) ── */}
      <section className="lg:hidden border-b border-pm-rule bg-white sticky top-20 z-20">
        <div className="max-w-[1480px] mx-auto px-6 h-14 flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {MOBILE_TABS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveView(value)}
              className={`shrink-0 px-4 h-9 inline-flex items-center font-display uppercase text-[13px] tracking-[0.04em] transition-colors duration-150 rounded-lg ${
                activeView === value || (isFormView && value === 'get-a-quote')
                  ? 'bg-pm-black text-white'
                  : 'text-pm-ink hover:bg-pm-paper-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── SIDEBAR + MAIN CONTENT ── */}
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10">
        <div className="flex items-start gap-0 lg:gap-8">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-20 self-start border-r border-pm-rule py-6 pr-4 min-h-[calc(100vh-80px)]">

            {/* Filter tabs */}
            <ul className="flex flex-col gap-0.5">
              {SIDEBAR_FILTER_TABS.map(({ label, value }) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => setActiveView(value)}
                    className={`w-full text-left px-3 py-2 font-display uppercase text-[14px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
                      activeView === value
                        ? 'bg-pm-black text-white'
                        : 'text-pm-ink hover:bg-pm-paper-2'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-pm-rule my-4" />

            {/* Form tabs */}
            <ul className="flex flex-col gap-0.5">
              {SIDEBAR_FORM_TABS.map(({ label, value }) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => setActiveView(value)}
                    className={`w-full text-left px-3 py-2 font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 border-l-2 ${
                      isFormView
                        ? 'border-pm-yellow bg-pm-paper-2 text-pm-black'
                        : 'border-transparent text-pm-ink hover:bg-pm-paper-2'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

          </aside>

          {/* Main content */}
          <div className={`flex-1 min-w-0 pb-6 lg:pb-10 ${isFormView ? 'pt-0' : 'pt-6 lg:pt-10'}`}>

            {/* ── FORM VIEW ── */}
            {isFormView && (
              <div key="form" className="animate-fade-in-fast">
                {/* ── FULL-WIDTH TAB BAR ── */}
                <div className="border-b border-pm-rule flex items-end gap-0 w-full">
                  <button
                    type="button"
                    onClick={() => setActiveView('All')}
                    className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted hover:text-pm-ink transition-colors duration-150 pr-5 pb-3 pt-4 border-r border-pm-rule mr-5 inline-flex items-center gap-1 shrink-0"
                  >
                    ← Catalog
                  </button>
                  {(['get-a-quote', 'submit-roster'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveView(tab)}
                      className={`font-display uppercase text-[14px] tracking-[0.04em] px-4 pb-3 pt-4 border-b-2 -mb-px transition-colors duration-150 ${
                        activeView === tab
                          ? 'border-pm-yellow text-pm-black'
                          : 'border-transparent text-pm-muted hover:text-pm-ink'
                      }`}
                    >
                      {tab === 'get-a-quote' ? 'Get a Quote' : 'Submit Roster'}
                    </button>
                  ))}
                </div>

                {/* ── FORM CONTENT (intro + form) — added in Task 3 ── */}
                <div className="pt-10 pb-16">
                  {/* ── INTRO BLOCK ── */}
                  <div className="max-w-[520px] mb-10 pb-8 border-b-[1.5px] border-pm-black">
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                      {activeView === 'get-a-quote' ? 'Request' : 'Roster'}
                    </span>
                    <h2 className="font-display uppercase text-[clamp(32px,4vw,48px)] leading-[0.95] tracking-[0.005em] mt-2 mb-0 text-pm-black">
                      {activeView === 'get-a-quote' ? 'Get a Quote' : 'Submit Your Roster'}
                    </h2>
                    <p className="text-[15px] leading-[1.6] text-pm-ink mt-4 max-w-[420px]">
                      {activeView === 'get-a-quote'
                        ? "Tell us your team, style, and roster count — we'll send a digital proof same-day."
                        : "Add each player's name, number, and size. Mix sizes freely at no extra charge."}
                    </p>
                  </div>

                  {/* ── FORM (constrained to 520px) ── */}
                  <div className="max-w-[520px]">
                    {activeView === 'get-a-quote' ? <ApparelInquiryForm /> : <PlayerUploadForm />}
                  </div>
                </div>
              </div>
            )}

            {/* ── CATALOG VIEW ── */}
            {!isFormView && (
              <section key="catalog" id="catalog" ref={catalogRef} className="animate-fade-in-fast">

                {catalogState.status === 'loading' && <CatalogSkeleton />}

                {catalogState.status === 'error' && (
                  <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px]">
                    <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Catalog unavailable</span>
                    <p className="text-[15px] leading-[1.6] text-pm-ink mt-3">
                      Catalog temporarily unavailable. Reach out via the form below.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveView('get-a-quote')}
                      className="mt-6 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
                    >
                      Get a quote anyway
                    </button>
                  </div>
                )}

                {catalogState.status === 'success' && catalogState.data.length === 0 && (
                  <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px]">
                    <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Coming soon</span>
                    <p className="text-[15px] leading-[1.6] text-pm-ink mt-3">
                      Catalog coming soon —{' '}
                      <button
                        type="button"
                        onClick={() => setActiveView('get-a-quote')}
                        className="underline hover:text-pm-yellow-deep"
                      >
                        get a quote anyway.
                      </button>
                    </p>
                  </div>
                )}

                {/* ALL view */}
                {catalogState.status === 'success' && catalogState.data.length > 0 && activeCategory === 'All' && (
                  <>
                    {CATALOG_CATEGORIES
                      .map((cat) => ({ cat, items: catalogState.data.filter((p) => p.category === cat) }))
                      .filter(({ items }) => items.length > 0)
                      .map(({ cat, items }) => (
                        <CarouselCategorySection
                          key={cat}
                          category={cat}
                          products={items}
                          onProductClick={(product) => {
                            setSelectedProduct(product);
                            setModalProducts(items);
                          }}
                          onSeeAll={() => setActiveView(cat)}
                        />
                      ))}
                  </>
                )}

                {/* SINGLE-CATEGORY view */}
                {catalogState.status === 'success' && catalogState.data.length > 0 && activeCategory !== 'All' && (
                  <>
                    <div className="flex items-baseline justify-between mb-4">
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
                            onClick={() => setActiveView('All')}
                            className="underline hover:text-pm-yellow-deep"
                          >
                            View all apparel
                          </button>{' '}
                          or{' '}
                          <button
                            type="button"
                            onClick={() => setActiveView('get-a-quote')}
                            className="underline hover:text-pm-yellow-deep"
                          >
                            get a quote.
                          </button>
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {displayedProducts.map((product, i) => (
                          <div
                            key={product.sku}
                            className={catalogInView ? 'animate-fade-up' : 'opacity-0'}
                            style={{ animationDelay: `${i * 80}ms` }}
                          >
                            <ProductCard
                              product={product}
                              onClick={(p) => {
                                setSelectedProduct(p);
                                setModalProducts(displayedProducts);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

              </section>
            )}

          </div>
        </div>
      </div>

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
