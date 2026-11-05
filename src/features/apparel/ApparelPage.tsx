import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/ui/Container';
import { ArrowIcon } from '@/components/ui/icons';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Tabs } from '@/components/ui/Tabs';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { askTo } from '@/lib/contactLink';
import {
  accessoryCategories,
  ACCESSORY_GROUP_ORDER,
  inStockCategories,
  type AccessoryCategory,
  type AccessoryGroup,
} from './catalog/accessories';
import { AccessoryDetailModal } from './components/AccessoryDetailModal';
import { TeamUniforms } from './components/TeamUniforms';

const PANEL_ID = 'shelves';
const TAB_PREFIX = 'shelf-tab';

type ShelfFilter = 'All' | AccessoryGroup;

// One shelf per kind of accessory that has photos, in catalog order.
const shelves = ACCESSORY_GROUP_ORDER.map((group) => ({
  group,
  categories: inStockCategories.filter((c) => c.group === group),
})).filter((shelf) => shelf.categories.length > 0);

const comingSoon = accessoryCategories.filter((c) => c.comingSoon);

const tabs: { value: ShelfFilter; label: string; count: number }[] = [
  { value: 'All', label: 'All', count: inStockCategories.length },
  ...shelves.map((shelf) => ({ value: shelf.group, label: shelf.group, count: shelf.categories.length })),
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const shelfId = (group: string) => `shelf-${group.toLowerCase().replace(/\s+/g, '-')}`;

export function ApparelPage() {
  const [filter, setFilter] = useState<ShelfFilter>('All');
  // False until a tab is pressed: the shelves only animate in on a change.
  const [swapped, setSwapped] = useState(false);
  const [openCategory, setOpenCategory] = useState<AccessoryCategory | null>(null);

  const shown = filter === 'All' ? shelves : shelves.filter((shelf) => shelf.group === filter);

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

      <PageHeader
        breadcrumb="Apparel"
        title={<>Gear built for the <mark>play.</mark></>}
        lede={
          <>
            Everything here is sold at the Playmaker tent.{' '}
            <Link to="/events" className="link">
              See where we'll be next
            </Link>
            , or{' '}
            <Link to="/contact" className="link">
              message us to order
            </Link>
            .
          </>
        }
      />

      {/* ── TEAM UNIFORMS ── */}
      <section id="uniforms" className="sec-warm border-b border-pm-rule scroll-mt-24" aria-labelledby="uniform-title">
        <Container className="sec-y grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
          <TeamUniforms headingId="uniform-title" />
        </Container>
      </section>

      {/* ── THE TENT TABLE: every kind of accessory, by shelf ── */}
      <section id="accessories" className="bg-white scroll-mt-24" aria-labelledby="acc-title">
        <Container className="sec-y">
          <div className="sec-head">
            <div className="min-w-0">
              <h2 id="acc-title" className="h-section">
                From the tent
              </h2>
              <p className="lead">
                Sold on site at every event. See something you like?{' '}
                <Link to={askTo('something from the tent', 'Parent')} className="link">
                  Ask and we'll set it aside.
                </Link>
              </p>
            </div>
            <Tabs
              items={tabs}
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setSwapped(true);
              }}
              label="Filter accessories by kind"
              idPrefix={TAB_PREFIX}
              controls={PANEL_ID}
              className="self-start md:self-auto"
            />
          </div>

          <div id={PANEL_ID} role="tabpanel" aria-labelledby={`${TAB_PREFIX}-${filter}`} className="flex flex-col gap-14 lg:gap-16">
            {shown.map((shelf, si) => (
              <section
                // Keyed by tab as well, so a shelf that stays on screen still plays its entrance.
                key={`${filter}-${shelf.group}`}
                aria-labelledby={shelfId(shelf.group)}
                className={swapped ? 'shelf-in' : undefined}
              >
                <div className="shelf-head">
                  <h3 id={shelfId(shelf.group)}>{shelf.group}</h3>
                  <span className="small">
                    {plural(shelf.categories.reduce((sum, c) => sum + c.variants.length, 0), 'design', 'designs')}
                  </span>
                </div>
                <ul className="shelf">
                  {shelf.categories.map((c) => (
                    <li key={c.id}>
                      <button type="button" className="gear" onClick={() => setOpenCategory(c)}>
                        <span className="photo">
                          {c.coverImage && (
                            <ResponsiveImage
                              image={c.coverImage}
                              // Decorative: the category name is the button's text.
                              alt=""
                              sizes="(min-width:1480px) 332px, (min-width:1100px) 23vw, (min-width:768px) 31vw, 46vw"
                              // The first shelf is on screen, or close to it, on load.
                              loading={si === 0 ? 'eager' : 'lazy'}
                            />
                          )}
                        </span>
                        <span className="flex items-start justify-between gap-3 mt-3">
                          <span className="min-w-0">
                            <span className="title block">{c.name}</span>
                            <span className="small block">{plural(c.variants.length, 'design', 'designs')}</span>
                          </span>
                          <ArrowIcon className="go mt-1.5" />
                        </span>
                        <span className="desc">{c.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {/* Not on the table yet. Shown with everything, not inside one kind. */}
            {filter === 'All' && comingSoon.length > 0 && (
              <section aria-labelledby="shelf-soon" className={swapped ? 'shelf-in' : undefined}>
                <div className="shelf-head">
                  <h3 id="shelf-soon">Coming soon</h3>
                  <span className="small">{comingSoon.length} more on the way</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {comingSoon.map((c) => (
                    <li key={c.id} className="soon">
                      <span className="title">{c.name}</span>
                      <span className="badge badge-outline">Coming soon</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </Container>
      </section>

      {openCategory && <AccessoryDetailModal category={openCategory} onClose={() => setOpenCategory(null)} />}
    </PageLayout>
  );
}
