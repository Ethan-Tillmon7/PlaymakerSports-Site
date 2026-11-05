import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '@/components/ui/icons';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { useInView } from '@/hooks/useInView';
import { inStockCategories } from '../catalog/accessories';

// The homepage rail, in this order. An id with no photos yet is skipped.
const SHOWCASE_IDS = ['chains', 'sliding-mitts', 'arm-sleeves', 'cooling-towels'];

const showcase = SHOWCASE_IDS.flatMap((id) => inStockCategories.find((c) => c.id === id) ?? []);

/**
 * A few things from the tent table, for the homepage: a swipe rail below lg, a
 * four-up grid above. Each card opens the accessories on /apparel. Showcase
 * only: no prices and no order path.
 */
export function ApparelShowcase() {
  const railRef = useRef<HTMLUListElement | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  const attachRail = useMemo(
    () => (el: HTMLUListElement | null) => {
      railRef.current = el;
      inViewRef(el);
    },
    [inViewRef],
  );

  // Below desktop the row scrolls sideways, and a short bar shows how far along
  // it is. The thumb is written straight to the element, once per frame.
  useEffect(() => {
    const rail = railRef.current;
    const bar = barRef.current;
    const thumb = bar?.firstElementChild as HTMLElement | null;
    if (!rail || !bar || !thumb) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const room = rail.scrollWidth - rail.clientWidth;
      bar.classList.toggle('on', room > 1);
      if (room <= 1) return;
      const track = bar.clientWidth;
      const width = Math.max(16, (track * rail.clientWidth) / rail.scrollWidth);
      thumb.style.width = `${width}px`;
      thumb.style.transform = `translateX(${(track - width) * Math.min(1, Math.max(0, rail.scrollLeft / room))}px)`;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    rail.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    // Shown first so its track has a width to measure.
    bar.classList.add('on');
    draw();
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  return (
    <>
      <ul
        ref={attachRail}
        aria-label="A few things on the table"
        className={`table-rail -mx-6 px-6 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 ${inView ? 'in' : ''}`}
      >
        {showcase.map((c) => (
          <li key={c.id}>
            <Link to="/apparel#accessories" className="gear">
              <span className="photo">
                {c.coverImage && (
                  <ResponsiveImage
                    image={c.coverImage}
                    // Decorative: the category name is the link's text.
                    alt=""
                    sizes="(min-width:1480px) 332px, (min-width:1024px) 23vw, (min-width:640px) 38vw, 68vw"
                  />
                )}
              </span>
              <span className="flex items-center justify-between gap-3 mt-3">
                <span className="min-w-0">
                  <span className="title block">{c.name}</span>
                  <span className="small block">
                    {c.variants.length} {c.variants.length === 1 ? 'design' : 'designs'}
                  </span>
                </span>
                <ArrowIcon className="go" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={barRef} className="rail-progress" aria-hidden="true">
        <i />
      </div>
    </>
  );
}
