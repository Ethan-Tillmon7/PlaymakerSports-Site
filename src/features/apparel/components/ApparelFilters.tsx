import { useRef, useState } from 'react';
import { useDismiss } from '@/hooks/useDismiss';
import { ACCESSORY_GROUP_ORDER, inStockCategories, type AccessoryCategory } from '../catalog/accessories';

export type ApparelSection = 'accessories' | 'jerseys';
/** 'all' or an accessory category id. */
export type AccessoryFilter = 'all' | string;

interface FilterProps {
  section: ApparelSection;
  accessoryFilter: AccessoryFilter;
  onSelectAccessories: (filter: AccessoryFilter) => void;
  onSelectJerseys: () => void;
}

const subItemClass = (active: boolean) =>
  `w-full text-left px-3 py-2.5 lg:py-2 font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
    active ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
  }`;

/** Phone/tablet filter bar (< lg): a category pill with a floating menu, plus the Jerseys tab. */
export function MobileApparelFilters({
  section,
  accessoryFilter,
  activeCategory,
  onSelectAccessories,
  onSelectJerseys,
}: FilterProps & { activeCategory: AccessoryCategory | null }) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  useDismiss(barRef, open, () => setOpen(false));

  const pickAccessories = (filter: AccessoryFilter) => {
    onSelectAccessories(filter);
    setOpen(false);
  };
  const pickJerseys = () => {
    onSelectJerseys();
    setOpen(false);
  };

  return (
    <section className="lg:hidden border-b border-pm-rule bg-white sticky top-[74px] z-20">
      <div ref={barRef} className="relative max-w-[1480px] mx-auto px-6 h-14 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="apparel-filter-menu"
          className={`shrink-0 px-4 h-10 inline-flex items-center gap-2 font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
            section === 'accessories' ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
          }`}
        >
          <span className="truncate max-w-[45vw]">
            {section === 'accessories' && activeCategory ? activeCategory.name : 'Accessories'}
          </span>
          <span aria-hidden="true" className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
        <button
          type="button"
          onClick={pickJerseys}
          className={`shrink-0 px-4 h-10 inline-flex items-center font-display uppercase text-[13px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
            section === 'jerseys' ? 'bg-pm-black text-white' : 'text-pm-ink hover:bg-pm-paper-2'
          }`}
        >
          Jerseys · Soon
        </button>

        {/* Filter dropdown — absolute overlay so it floats over content instead of pushing it down */}
        <div
          id="apparel-filter-menu"
          className={`absolute top-full inset-x-6 mt-2 origin-top z-30 transition-[opacity,transform,visibility] duration-200 ease-out ${
            open ? 'visible opacity-100 scale-y-100 pointer-events-auto' : 'invisible opacity-0 scale-y-95 pointer-events-none'
          }`}
        >
          <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto flex flex-col gap-0.5 p-3 bg-white border border-pm-rule rounded-2xl shadow-[0_8px_24px_-6px_rgba(17,17,17,0.18)]">
            <button
              type="button"
              onClick={() => pickAccessories('all')}
              className={subItemClass(section === 'accessories' && accessoryFilter === 'all')}
            >
              All Accessories
            </button>
            {ACCESSORY_GROUP_ORDER.map((group) => {
              const cards = inStockCategories.filter((c) => c.group === group);
              if (cards.length === 0) return null;
              return (
                <div key={group} className="mt-2">
                  <span className="block px-3 pb-1 font-mono text-[9px] tracking-[0.14em] uppercase text-pm-muted">
                    {group}
                  </span>
                  {cards.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pickAccessories(c.id)}
                      className={subItemClass(accessoryFilter === c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Desktop sidebar (lg+): a collapsible accessory list and the Jerseys entry. */
export function ApparelSidebar({ section, accessoryFilter, onSelectAccessories, onSelectJerseys }: FilterProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-20 self-start border-r border-pm-rule py-6 pr-4 min-h-[calc(100dvh-80px)]">
      {/* Accessories dropdown */}
      <button
        type="button"
        onClick={() => {
          setExpanded((o) => !o);
          onSelectAccessories('all');
        }}
        className={`w-full flex items-center justify-between px-3 py-2 font-display uppercase text-[14px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
          section === 'accessories' ? 'text-pm-black' : 'text-pm-ink hover:bg-pm-paper-2'
        }`}
      >
        <span>Accessories</span>
        <span aria-hidden="true" className={`transition-transform duration-150 ${expanded ? '' : '-rotate-90'}`}>▾</span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-0.5 mt-0.5 pl-2">
          <button
            type="button"
            onClick={() => onSelectAccessories('all')}
            className={subItemClass(section === 'accessories' && accessoryFilter === 'all')}
          >
            All Accessories
          </button>
          {ACCESSORY_GROUP_ORDER.map((group) => {
            const cards = inStockCategories.filter((c) => c.group === group);
            if (cards.length === 0) return null;
            return (
              <div key={group} className="mt-2">
                <span className="block px-3 pb-1 font-mono text-[9px] tracking-[0.14em] uppercase text-pm-muted">
                  {group}
                </span>
                {cards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectAccessories(c.id)}
                    className={subItemClass(section === 'accessories' && accessoryFilter === c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-pm-rule my-4" />

      {/* Jerseys */}
      <button
        type="button"
        onClick={onSelectJerseys}
        className={`w-full flex items-center justify-between px-3 py-2 font-display uppercase text-[14px] tracking-[0.04em] rounded-lg transition-colors duration-150 ${
          section === 'jerseys' ? 'bg-pm-black text-white' : 'text-pm-muted hover:bg-pm-paper-2'
        }`}
      >
        <span>Jerseys</span>
        <span className="font-mono text-[9px] tracking-[0.12em]">Soon</span>
      </button>
    </aside>
  );
}
