import type { AccessoryItem } from '../../data/apparel';

export function AccessoryCard({
  item,
  onInquire,
}: {
  item: AccessoryItem;
  onInquire: () => void;
}) {
  return (
    <article className={`flex flex-col ${item.comingSoon ? 'opacity-60' : ''}`}>
      <div
        className={`aspect-[4/5] stage-cream flex items-center justify-center rounded-xl relative overflow-hidden ${
          item.comingSoon
            ? 'border-2 border-dashed border-pm-yellow-deep'
            : 'border border-pm-rule'
        }`}
      >
        {item.comingSoon && (
          <div className="absolute top-3 right-3 bg-pm-yellow text-pm-black font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-1 rounded-lg border-b border-pm-yellow-deep">
            Coming Soon
          </div>
        )}
        <span className="font-display uppercase text-[18px] tracking-[0.02em] text-pm-muted text-center px-4 leading-tight">
          {item.name}
        </span>
      </div>
      <div className="pt-3 flex flex-col flex-1">
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted">
          {item.price}
        </span>
        <h3 className="font-display uppercase text-[19px] leading-[0.95] tracking-[0.005em] mt-1.5 text-pm-black">
          {item.name}
        </h3>
        <p className="text-[12.5px] leading-[1.5] text-pm-ink mt-1.5">{item.desc}</p>
        <div className="flex-1 min-h-[12px]" />
        {!item.comingSoon && (
          <div className="pt-2.5 border-t border-pm-rule">
            <button
              type="button"
              onClick={onInquire}
              className="font-display uppercase text-[13px] tracking-[0.04em] bg-pm-yellow text-pm-black px-4 h-9 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Inquire
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
