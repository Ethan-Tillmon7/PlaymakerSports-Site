import { useCallback, useRef, type ReactNode } from 'react';
import { useHeaderLight } from '@/hooks/useHeaderLight';
import { nightGroundRef } from '@/hooks/useNightGround';

// Where the chalk infield sits and where the light comes to rest ("x,y" as
// fractions of the header). Home: the field rises from the bottom left, under
// the headline. Every other page: it hangs from the top right, clear of the title.
const FIELDS = {
  home: {
    field: 'w-[150vw] sm:w-[1100px] left-[-60vw] sm:left-[-380px] bottom-[-34vw] sm:bottom-[-520px]',
    light: '0.3,0.62',
  },
  page: {
    field: 'w-[120vw] sm:w-[860px] right-[-58vw] sm:right-[-250px] top-[-80vw] sm:top-[-430px]',
    light: '0.72,0.2',
  },
} as const;

interface NightGroundProps {
  variant: keyof typeof FIELDS;
  /** id of the heading that names this section. */
  labelledBy: string;
  children: ReactNode;
}

/**
 * The black ground every page opens on: a faint chalk infield, lit by a lamp
 * that follows the pointer. It slides up under the floating nav (the 68px
 * spacer clears it) and tells the nav to turn to dark glass while it's there.
 */
export function NightGround({ variant, labelledBy, children }: NightGroundProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { field, light } = FIELDS[variant];
  useHeaderLight(ref, light);
  // Stable, so React attaches it once and the nav's observer isn't re-registered on every render.
  const attach = useCallback((el: HTMLElement | null) => {
    ref.current = el;
    return nightGroundRef(el);
  }, []);

  return (
    <section
      ref={attach}
      data-night
      className="night-ground on-night"
      aria-labelledby={labelledBy}
    >
      <div className="beam" aria-hidden="true" />
      <div className="wash" aria-hidden="true">
        <i className="lamp-wash" data-lamp-wash />
      </div>
      <div data-field className={`infield ${field}`} aria-hidden="true">
        <svg className="chalk" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path vectorEffect="non-scaling-stroke" d="M50 8 L92 50 L50 92 L8 50 Z" />
          <path vectorEffect="non-scaling-stroke" d="M50 24 L76 50 L50 76 L24 50 Z" />
          <path vectorEffect="non-scaling-stroke" d="M50 8 L50 24M50 76 L50 92M8 50 L24 50M76 50 L92 50" />
        </svg>
        <div className="chalk-lit">
          <i className="lamp" data-lamp />
        </div>
      </div>
      <div className="h-[68px]" />
      {children}
    </section>
  );
}
