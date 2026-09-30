import { useEffect, useRef, useState } from 'react';

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Counts from `from` up to `target` once `active` turns true. Until then (and in
 * the prerendered HTML, and for reduced-motion visitors) it shows `target`, so the
 * number is never wrong: no "0" for crawlers, no-JS, or a slow hydrate.
 */
export function useCountUp(target: number, duration = 1200, active = false, from = 0): string {
  const [value, setValue] = useState(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(from + easeOutQuad(progress) * (target - from)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [active, target, duration, from]);

  return String(value);
}
