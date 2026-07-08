import type { AccessoryCategory } from '../../data/accessories';

export function AccessoryCard({
  category,
  onOpen,
}: {
  category: AccessoryCategory;
  onOpen: (category: AccessoryCategory) => void;
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
        className={`aspect-[4/5] stage-cream flex items-center justify-center rounded-xl relative overflow-hidden ${
          clickable ? 'border border-pm-rule' : 'border-2 border-dashed border-pm-yellow-deep'
        }`}
      >
        {!clickable && (
          <div className="absolute top-3 right-3 bg-pm-yellow text-pm-black font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-1 rounded-lg border-b border-pm-yellow-deep z-10">
            Coming Soon
          </div>
        )}
        {category.coverImage ? (
          <img
            src={category.coverImage}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
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
