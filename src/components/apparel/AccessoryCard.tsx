import type { AccessoryCategory } from '../../data/accessories';
import { ResponsiveImage } from '../ui/ResponsiveImage';

export function AccessoryCard({
  category,
  onOpen,
  priority,
}: {
  category: AccessoryCategory;
  onOpen: (category: AccessoryCategory) => void;
  /**
   * Above-the-fold card: 'eager' skips lazy-loading; 'high' also jumps the fetch
   * queue. Keep 'high' to one card so photos don't starve the fonts on slow links.
   */
  priority?: 'high' | 'eager';
}) {
  const colorCount = new Set(category.variants.flatMap((v) => v.colors)).size;
  const clickable = !category.comingSoon && category.variants.length > 0;

  const meta = clickable
    ? [
        `${category.variants.length} ${category.variants.length === 1 ? 'Design' : 'Designs'}`,
        colorCount > 0 ? `${colorCount} ${colorCount === 1 ? 'Color' : 'Colors'}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Coming Soon';

  return (
    <article
      className={`flex flex-col ${clickable ? 'group cursor-pointer hover:-translate-y-0.5 transition-transform duration-150' : 'opacity-60'}`}
      {...(clickable
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: () => onOpen(category),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(category);
              }
            },
          }
        : {})}
    >
      <div
        className={`stage-cream flex items-center justify-center rounded-xl relative overflow-hidden ${
          clickable ? 'aspect-[4/5] border border-pm-rule' : 'aspect-[4/3] border-2 border-dashed border-pm-yellow-deep'
        }`}
      >
        {!clickable && (
          <div className="absolute top-3 right-3 bg-pm-yellow text-pm-black font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-1 rounded-lg border-b border-pm-yellow-deep z-10">
            Coming Soon
          </div>
        )}
        {category.coverImage ? (
          // sizes matches the CardRail slot, not the lg grid: 72%/46% of the
          // padded container below lg, then (container - sidebar - gaps) / cols:
          // 3 cols at lg, 4 at xl.
          <ResponsiveImage
            image={category.coverImage}
            alt={category.name}
            sizes="(min-width:1480px) 269px, (min-width:1280px) calc((100vw - 404px) / 4), (min-width:1024px) calc((100vw - 380px) / 3), (min-width:640px) calc(46vw - 37px), calc(72vw - 35px)"
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority === 'high' ? 'high' : undefined}
          />
        ) : (
          <span className="font-display uppercase text-[18px] tracking-[0.02em] text-pm-muted text-center px-4 leading-tight">
            {category.name}
          </span>
        )}
      </div>
      <div className="pt-3 flex flex-col flex-1">
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">{meta}</span>
        <h3 className="font-display uppercase text-[19px] leading-[0.95] tracking-[0.005em] mt-1.5 text-pm-black">
          {category.name}
        </h3>
        <p className="text-[12.5px] leading-[1.5] text-pm-ink mt-1.5">{category.desc}</p>
      </div>
    </article>
  );
}
