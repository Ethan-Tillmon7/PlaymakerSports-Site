import { useSyncExternalStore } from 'react';

// The nav is dark glass while a black ground (a page header, the story panel,
// the footer) is behind it, and light glass over everything else. Grounds
// register themselves here; the nav reads one boolean.

/** Grounds currently under the nav. */
const under = new Set<Element>();
/** Grounds registered but not yet reported on by the observer. */
const pending = new Set<Element>();
const listeners = new Set<() => void>();
let observer: IntersectionObserver | null = null;

const notify = () => listeners.forEach((listener) => listener());

function getObserver(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        pending.delete(entry.target);
        if (entry.isIntersecting) under.add(entry.target);
        else under.delete(entry.target);
      }
      notify();
    },
    // A thin band at the nav's height: 40px down from the top of the viewport.
    { rootMargin: '-40px 0px -92% 0px' },
  );
  return observer;
}

/**
 * Ref callback for a black ground: `<section ref={nightGroundRef} data-night>`.
 * Stable across renders, so React attaches it once.
 */
export function nightGroundRef(el: Element | null): void | (() => void) {
  const io = getObserver();
  if (!el || !io) return;
  pending.add(el);
  io.observe(el);
  return () => {
    io.unobserve(el);
    pending.delete(el);
    under.delete(el);
    notify();
  };
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// A ground that has just mounted counts as "under" until the observer says
// otherwise. Every page opens on a black header, so this keeps the nav dark
// across a route change instead of blinking light for a frame.
const overNight = () => under.size > 0 || pending.size > 0;

/** True while the nav sits over a black ground. Prerendered as true. */
export function useOverNight(): boolean {
  return useSyncExternalStore(subscribe, overNight, () => true);
}
