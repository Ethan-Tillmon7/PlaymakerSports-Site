import { useEffect, type RefObject } from 'react';

/**
 * The light on a night header (NightGround): it sweeps in once from the bottom
 * left, settles at `rest`, then eases after the pointer. Only two elements ever
 * get a transform, and the frame loop stops once the light has settled.
 *
 * `rest` is "x,y" as fractions of the header. Under reduced motion the light
 * is placed at rest and never moves.
 */
export function useHeaderLight(heroRef: RefObject<HTMLElement | null>, rest: string): void {
  useEffect(() => {
    const hero = heroRef.current;
    const field = hero?.querySelector<HTMLElement>('[data-field]');
    const lamp = hero?.querySelector<HTMLElement>('[data-lamp]');
    const wash = hero?.querySelector<HTMLElement>('[data-lamp-wash]');
    if (!hero || !field || !lamp || !wash) return;

    const [restX, restY] = rest.split(',').map(Number);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let box = hero.getBoundingClientRect();
    let offX = field.offsetLeft;
    let offY = field.offsetTop;
    // Where the light is, and where it's headed.
    let x = reduced ? box.width * restX : box.width * 0.02;
    let y = reduced ? box.height * restY : box.height * 0.9;
    let tx = box.width * restX;
    let ty = box.height * restY;
    let tau = 420;
    let last = 0;
    let frame = 0;

    const measure = () => {
      box = hero.getBoundingClientRect();
      offX = field.offsetLeft;
      offY = field.offsetTop;
    };
    const paint = () => {
      wash.style.transform = `translate3d(${x}px,${y}px,0)`;
      lamp.style.transform = `translate3d(${x - offX}px,${y - offY}px,0)`;
    };
    const tick = (now: number) => {
      const k = 1 - Math.exp(-Math.min(64, now - last) / tau);
      last = now;
      x += (tx - x) * k;
      y += (ty - y) * k;
      paint();
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const go = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    for (const el of [lamp, wash]) {
      el.style.left = '0';
      el.style.top = '0';
      el.classList.add('lit');
    }
    measure();
    paint();

    const onResize = () => {
      measure();
      if (reduced) {
        x = box.width * restX;
        y = box.height * restY;
        paint();
      }
    };
    window.addEventListener('resize', onResize);
    if (reduced) return () => window.removeEventListener('resize', onResize);

    go();
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tau = 130;
      tx = e.clientX - box.left;
      ty = e.clientY - box.top;
      go();
    };
    hero.addEventListener('pointerenter', measure);
    hero.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      hero.removeEventListener('pointerenter', measure);
      hero.removeEventListener('pointermove', onMove);
    };
  }, [heroRef, rest]);
}
