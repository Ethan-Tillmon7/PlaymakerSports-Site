import { useEffect, useRef } from 'react';

/**
 * Tracks how far an element has scrolled past the top of the viewport and
 * reports it to `onProgress`: 0 when the element top is at/below the viewport
 * top, 1 when it has fully scrolled past.
 *
 * Runs at most once per animation frame and never sets React state, so a
 * scroll-linked effect (write styles to a ref inside `onProgress`) doesn't
 * re-render the page on every scroll event.
 */
export function useScrollOut<T extends HTMLElement = HTMLDivElement>(
  onProgress: (progress: number) => void,
) {
  const ref = useRef<T | null>(null);
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / height));
      if (progress !== last) {
        last = progress;
        callback.current(progress);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
