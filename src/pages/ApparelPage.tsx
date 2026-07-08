import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { accessoryCategories, type AccessoryCategory } from '../data/accessories';
import { AccessoryCard } from '../components/apparel/AccessoryCard';
import { AccessoryDetailModal } from '../components/modals/AccessoryDetailModal';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';

type Section = 'accessories' | 'jerseys';
type AccessoryFilter = 'all' | string; // 'all' or a category id

const inStock = accessoryCategories.filter((c) => !c.comingSoon);

function ComingSoonJerseys() {
  return (
    <div className="border border-pm-rule rounded-2xl p-10 sm:p-14 text-center max-w-[680px] flex flex-col items-center gap-5">
      <svg viewBox="0 0 200 240" className="w-24 opacity-60" aria-hidden="true">
        <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="1.4" />
      </svg>
      <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Coming Soon</span>
      <h2 className="font-display uppercase text-[clamp(28px,4vw,44px)] leading-[0.9] tracking-[0.005em] text-pm-black">
        Custom Jerseys Are On Deck
      </h2>
      <p className="text-[15px] leading-[1.6] text-pm-ink max-w-[440px]">
        Our sublimated and tackle-twill jersey builder is coming soon. In the meantime, gear up with our
        accessories.
      </p>
    </div>
  );
}

export function ApparelPage() {
  const [section, setSection] = useState<Section>('accessories');
  const [accessoryFilter, setAccessoryFilter] = useState<AccessoryFilter>('all');
  const [accessoriesExpanded, setAccessoriesExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<AccessoryCategory | null>(null);
  const [openVariantIndex, setOpenVariantIndex] = useState(0);

  const selectAccessories = (filter: AccessoryFilter) => {
    setSection('accessories');
    setAccessoryFilter(filter);
    setMobileMenuOpen(false);
  };
  const selectJerseys = () => {
    setSection('jerseys');
    setMobileMenuOpen(false);
  };

  const activeCategory =
    section === 'accessories' && accessoryFilter !== 'all'
      ? inStock.find((c) => c.id === accessoryFilter) ?? null
      : null;

  const openModal = (category: AccessoryCategory, variantIndex = 0) => {
    setOpenCategory(category);
    setOpenVariantIndex(variantIndex);
  };

  const subItemClass = (active: boolean) =>
    `w-full text-left px-3 py-2 font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
      active ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
    }`;

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
            Gear built for the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span>
          </h1>
        </div>
      </header>

      {/* ── MOBILE NAV (< lg) ── */}
      <section className="lg:hidden border-b border-pm-rule bg-white sticky top-20 z-20">
        <div className="max-w-[1480px] mx-auto px-6 h-14 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`shrink-0 px-4 h-9 inline-flex items-center gap-2 font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
              section === 'accessories' ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
            }`}
          >
            {section === 'accessories' && activeCategory ? activeCategory.name : 'Accessories'} ▾
          </button>
          <button
            type="button"
            onClick={selectJerseys}
            className={`shrink-0 px-4 h-9 inline-flex items-center font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
              section === 'jerseys' ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
            }`}
          >
            Jerseys · Soon
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-pm-rule px-6 py-3 flex flex-col gap-0.5 animate-fade-in-fast">
            <button
              type="button"
              onClick={() => selectAccessories('all')}
              className={subItemClass(section === 'accessories' && accessoryFilter === 'all')}
            >
              All Accessories
            </button>
            {inStock.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectAccessories(c.id)}
                className={subItemClass(accessoryFilter === c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── SIDEBAR + MAIN ── */}
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10">
        <div className="flex items-start gap-0 lg:gap-8">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-20 self-start border-r border-pm-rule py-6 pr-4 min-h-[calc(100vh-80px)]">
            {/* Accessories dropdown */}
            <button
              type="button"
              onClick={() => {
                setAccessoriesExpanded((o) => !o);
                selectAccessories('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 font-display uppercase text-[14px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
                section === 'accessories' ? 'text-pm-black' : 'text-pm-ink hover:bg-pm-paper-2'
              }`}
            >
              <span>Accessories</span>
              <span className={`transition-transform duration-150 ${accessoriesExpanded ? '' : '-rotate-90'}`}>▾</span>
            </button>

            {accessoriesExpanded && (
              <ul className="flex flex-col gap-0.5 mt-0.5 pl-2">
                <li>
                  <button
                    type="button"
                    onClick={() => selectAccessories('all')}
                    className={subItemClass(section === 'accessories' && accessoryFilter === 'all')}
                  >
                    All Accessories
                  </button>
                </li>
                {inStock.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectAccessories(c.id)}
                      className={subItemClass(section === 'accessories' && accessoryFilter === c.id)}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-pm-rule my-4" />

            {/* Jerseys */}
            <button
              type="button"
              onClick={selectJerseys}
              className={`w-full flex items-center justify-between px-3 py-2 font-display uppercase text-[14px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
                section === 'jerseys' ? 'bg-pm-black text-white' : 'text-pm-muted hover:bg-pm-paper-2'
              }`}
            >
              <span>Jerseys</span>
              <span className="font-mono text-[9px] tracking-[0.12em]">Soon</span>
            </button>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 pb-6 lg:pb-10 pt-6 lg:pt-10">
            {section === 'jerseys' && (
              <section className="animate-fade-in-fast flex justify-center pt-4">
                <ComingSoonJerseys />
              </section>
            )}

            {section === 'accessories' && accessoryFilter === 'all' && (
              <section className="animate-fade-in-fast">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">
                    All Accessories
                  </h2>
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                    {inStock.length} in stock
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {accessoryCategories.map((c) => (
                    <AccessoryCard key={c.id} category={c} onOpen={(cat) => openModal(cat)} />
                  ))}
                </div>
              </section>
            )}

            {section === 'accessories' && activeCategory && (
              <section className="animate-fade-in-fast">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">
                    {activeCategory.name}
                  </h2>
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                    {activeCategory.variants.length} {activeCategory.variants.length === 1 ? 'design' : 'designs'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                  {activeCategory.variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => openModal(activeCategory, i)}
                      className="group flex flex-col text-left cursor-pointer hover:-translate-y-0.5 transition-transform duration-150"
                    >
                      <div className="aspect-square stage-cream rounded-xl overflow-hidden border border-pm-rule">
                        <ResponsiveImage
                          image={v.image}
                          alt={v.label}
                          sizes="(min-width:1024px) 260px, (min-width:640px) 30vw, 45vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-pm-muted mt-2 leading-tight">
                        {v.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {openCategory && (
        <AccessoryDetailModal
          category={openCategory}
          initialVariantIndex={openVariantIndex}
          onClose={() => setOpenCategory(null)}
        />
      )}
    </PageLayout>
  );
}
