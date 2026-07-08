import { useRef, useState } from 'react';
import { Diamond } from '../layout/DiamondMark';
import { useInView } from '../../hooks/useInView';
import type { Product, ProductCategory } from '../../types/product';

type FilterCategory = 'All' | ProductCategory;

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

export function CatalogSkeleton() {
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

export function ProductPlaceholder({ category }: { category: ProductCategory }) {
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

export function ProductCard({ product, onClick }: ProductCardProps) {
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

export function CarouselCategorySection({ category, products, onProductClick, onSeeAll }: CarouselCategorySectionProps) {
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
