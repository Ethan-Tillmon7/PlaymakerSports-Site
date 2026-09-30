import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/ui/Container';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import {
  accessoryCategories,
  ACCESSORY_GROUP_ORDER,
  inStockCategories,
  type AccessoryCategory,
} from './catalog/accessories';
import { AccessoryCard } from './components/AccessoryCard';
import { AccessoryDetailModal } from './components/AccessoryDetailModal';
import {
  ApparelSidebar,
  MobileApparelFilters,
  type AccessoryFilter,
  type ApparelSection,
} from './components/ApparelFilters';
import { CardRail } from './components/CardRail';
import { ComingSoonJerseys } from './components/ComingSoonJerseys';

// The first group's opening row is above the fold on load, so its images get priority.
const firstGroup = ACCESSORY_GROUP_ORDER.find((g) => accessoryCategories.some((c) => c.group === g));

const inlineLinkClass =
  'text-pm-black underline decoration-2 decoration-pm-yellow underline-offset-4 hover:decoration-pm-black transition-colors duration-150';

export function ApparelPage() {
  const [section, setSection] = useState<ApparelSection>('accessories');
  const [accessoryFilter, setAccessoryFilter] = useState<AccessoryFilter>('all');
  const [openCategory, setOpenCategory] = useState<AccessoryCategory | null>(null);
  const [openVariantIndex, setOpenVariantIndex] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (group: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });

  const selectAccessories = (filter: AccessoryFilter) => {
    setSection('accessories');
    setAccessoryFilter(filter);
  };
  const selectJerseys = () => setSection('jerseys');

  const activeCategory =
    section === 'accessories' && accessoryFilter !== 'all'
      ? inStockCategories.find((c) => c.id === accessoryFilter) ?? null
      : null;

  const openModal = (category: AccessoryCategory, variantIndex = 0) => {
    setOpenCategory(category);
    setOpenVariantIndex(variantIndex);
  };

  const filterProps = { section, accessoryFilter, onSelectAccessories: selectAccessories, onSelectJerseys: selectJerseys };

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
      <PageHeader
        eyebrow="Custom uniforms · Built to order"
        title={<>Gear built for the <span className="bg-pm-yellow px-[0.08em] rounded-md">play.</span></>}
      >
        <p>
          Everything here is sold at the Playmaker tent.{' '}
          <Link to="/events" className={inlineLinkClass}>
            See where we'll be next
          </Link>
          , or{' '}
          <Link to="/contact" className={inlineLinkClass}>
            message us to order
          </Link>
          .
        </p>
      </PageHeader>

      {/* ── MOBILE NAV (< lg) ── */}
      <MobileApparelFilters {...filterProps} activeCategory={activeCategory} />

      {/* ── SIDEBAR + MAIN ── */}
      <Container>
        <div className="flex items-start gap-0 lg:gap-8">
          <ApparelSidebar {...filterProps} />

          {/* Main content */}
          <div className="flex-1 min-w-0 pb-6 lg:pb-10 pt-6 lg:pt-10">
            {section === 'jerseys' && (
              <section className="animate-fade-in-fast flex justify-center pt-4">
                <ComingSoonJerseys onBrowseAccessories={() => selectAccessories('all')} />
              </section>
            )}

            {section === 'accessories' && accessoryFilter === 'all' && (
              <section className="animate-fade-in-fast">
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] m-0">
                    All Accessories
                  </h2>
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                    {inStockCategories.length} {inStockCategories.length === 1 ? 'category' : 'categories'}
                  </span>
                </div>
                {ACCESSORY_GROUP_ORDER.map((group) => {
                  const cards = accessoryCategories.filter((c) => c.group === group);
                  if (cards.length === 0) return null;
                  const isExpanded = expandedGroups.has(group);
                  const isFirstGroup = group === firstGroup;
                  return (
                    <div key={group} className="mb-12 last:mb-0">
                      <div className="flex items-center justify-between mb-4 border-b border-pm-rule">
                        <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-ink">
                          {group}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group)}
                          aria-expanded={isExpanded}
                          className="shrink-0 ml-4 -mr-2 px-2 min-h-10 inline-flex items-center font-mono text-[10px] tracking-[0.12em] uppercase text-pm-muted hover:text-pm-ink transition-colors duration-150"
                        >
                          {isExpanded ? 'Show less' : 'See all →'}
                        </button>
                      </div>
                      <CardRail
                        expanded={isExpanded}
                        expandedClassName="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12"
                        gridClassName="lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-12"
                        itemClassName="basis-[72%] sm:basis-[46%]"
                      >
                        {cards.map((c, i) => (
                          <AccessoryCard
                            key={c.id}
                            category={c}
                            onOpen={(cat) => openModal(cat)}
                            priority={!isFirstGroup ? undefined : i === 0 ? 'high' : i < 4 ? 'eager' : undefined}
                          />
                        ))}
                      </CardRail>
                    </div>
                  );
                })}
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
                <CardRail
                  gridClassName="lg:grid-cols-5 lg:gap-x-4 lg:gap-y-8"
                  itemClassName="basis-[42%] sm:basis-[30%]"
                >
                  {activeCategory.variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => openModal(activeCategory, i)}
                      className="group w-full flex flex-col text-left cursor-pointer hover:-translate-y-0.5 transition-transform duration-150"
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
                </CardRail>
              </section>
            )}
          </div>
        </div>
      </Container>

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
