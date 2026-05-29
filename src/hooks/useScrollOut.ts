import { useEffect, useRef, useState } from 'react';

/**
 * Tracks how far an element has scrolled past the top of the viewport.
 * progress: 0 when element top is at/below viewport top, 1 when fully scrolled past.
 */
export function useScrollOut<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { top, height } = el.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, -top / height)));
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return [ref, progress] as const;
}
