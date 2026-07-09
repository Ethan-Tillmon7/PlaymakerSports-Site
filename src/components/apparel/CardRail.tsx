import { Children } from 'react';

interface CardRailProps {
  children: React.ReactNode;
  /** lg-prefixed grid classes applied when the container becomes a grid (e.g. "lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12"). */
  gridClassName: string;
  /** Rail-mode basis/width for each item, controlling how much the next card peeks (e.g. "basis-[72%] sm:basis-[46%]"). */
  itemClassName: string;
  /** When true, render a full grid at ALL breakpoints (no rail) — the "See all" expanded state. */
  expanded?: boolean;
  /** Grid classes (base + responsive) used at every breakpoint when `expanded` (e.g. "grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12"). */
  expandedClassName?: string;
}

/**
 * Responsive card container: a swipable horizontal snap-rail below lg, the
 * existing CSS grid at lg+. Wraps each child in a snap item and overlays a
 * static right-edge fade (rail mode only). No JS — CSS scroll-snap + touch.
 *
 * When `expanded`, it drops the rail entirely and renders a full grid at every
 * breakpoint (used by the group "See all" toggle).
 */
export function CardRail({
  children,
  gridClassName,
  itemClassName,
  expanded = false,
  expandedClassName = '',
}: CardRailProps) {
  if (expanded) {
    return <div className={`grid ${expandedClassName}`}>{children}</div>;
  }

  return (
    <div className="relative">
      <div
        className={`flex gap-x-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] lg:grid lg:overflow-visible lg:pb-0 ${gridClassName}`}
      >
        {Children.map(children, (child) => (
          <div className={`snap-start shrink-0 ${itemClassName} lg:basis-auto lg:w-auto`}>
            {child}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-pm-paper to-transparent lg:hidden"
      />
    </div>
  );
}
