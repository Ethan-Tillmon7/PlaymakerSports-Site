import { useCallback, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) return;
      // Fallback for environments without IntersectionObserver — reveal
      // immediately so scroll-triggered content never stays hidden.
      if (typeof IntersectionObserver === 'undefined') {
        setInView(true);
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            observerRef.current = null;
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options },
      );
      observer.observe(el);
      observerRef.current = observer;
    },
    // options is a literal in every call site; omitting from deps is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [ref, inView] as const;
}
