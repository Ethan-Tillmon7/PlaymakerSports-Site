import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ButtonLink } from '@/components/ui/Button';
import { paletteFor, type AccessoryCategory } from '../catalog/accessories';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

const SWIPE_THRESHOLD = 50; // px of horizontal travel to commit a variant change
const SWIPE_VELOCITY = 0.11; // px/ms: a flick commits even below the distance threshold
const SWIPE_DEADZONE = 8; // px before a touch counts as a drag at all (a tap stays a tap)
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const STAGE_SIZES = '(min-width:768px) 400px, 90vw';

interface AccessoryDetailModalProps {
  category: AccessoryCategory;
  initialVariantIndex?: number;
  onClose: () => void;
}

export function AccessoryDetailModal({ category, initialVariantIndex = 0, onClose }: AccessoryDetailModalProps) {
  const { variants } = category;
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(0, initialVariantIndex), Math.max(0, variants.length - 1)),
  );
  const [visible, setVisible] = useState(false);
  // Which way the last navigation went and how many have happened. The counter
  // keys the stage so each change restarts the entrance; null = nothing yet,
  // so opening the modal doesn't slide (the modal's own fade+scale covers that).
  const [slide, setSlide] = useState<{ dir: 1 | -1; n: number } | null>(null);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const selected = variants[index];
  const palette = paletteFor(category);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Move focus into the dialog on open and hand it back to the card that opened it.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => opener?.focus?.({ preventScroll: true });
  }, []);

  const closing = useRef(false);
  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    setTimeout(onClose, 150);
  }, [onClose]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + variants.length) % variants.length);
      setSlide((s) => ({ dir, n: (s?.n ?? 0) + 1 }));
    },
    [variants.length],
  );

  // Touch swipe on the image area — mirrors the ‹ › arrows / arrow keys, but the
  // image follows the finger and a flick commits on velocity. The transform is
  // written to the stage wrapper's ref directly so a move never re-renders.
  // A second finger (pinch-zoom), a browser-cancelled touch, or a mostly-vertical
  // drag abandons the swipe so it can't commit on the way out.
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const resetStage = (animated: boolean) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.transition = animated ? 'transform 200ms cubic-bezier(0, 0, 0.2, 1)' : '';
    el.style.transform = '';
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1 || variants.length < 2) {
      touchStart.current = null;
      resetStage(false);
      return;
    }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: performance.now() };
    if (stageRef.current) stageRef.current.style.transition = '';
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start || e.touches.length > 1) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SWIPE_DEADZONE) {
      // Vertical: let the page scroll and drop the swipe.
      touchStart.current = null;
      resetStage(true);
      return;
    }
    if (Math.abs(dx) < SWIPE_DEADZONE || !stageRef.current) return;
    stageRef.current.style.transform = `translateX(${dx}px)`;
  };
  const onTouchCancel = () => {
    touchStart.current = null;
    resetStage(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || variants.length < 2 || e.touches.length > 0) {
      resetStage(true);
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const elapsed = Math.max(1, performance.now() - start.t);
    const velocity = Math.abs(dx) / elapsed;
    const horizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_DEADZONE;
    if (horizontal && (Math.abs(dx) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY)) {
      // navigate() remounts the stage (new key), which discards the dragged
      // transform and plays the slide-in entrance from the right side.
      navigate(dx < 0 ? 1 : -1);
    } else {
      resetStage(true);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      // Keep Tab inside the dialog; the page behind it is inert while it's open.
      if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose, navigate]);

  // Warm the previous and next designs at the stage's own sizes so the slide
  // entrance never plays over an empty stage while the file downloads.
  useEffect(() => {
    if (variants.length < 2) return;
    const warm = (i: number) => {
      const v = variants[(i + variants.length) % variants.length];
      if (!v?.image) return;
      const img = new Image();
      img.sizes = STAGE_SIZES;
      img.srcset = v.image.srcset;
      img.src = v.image.src;
    };
    warm(index + 1);
    warm(index - 1);
  }, [index, variants]);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-150 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(17,17,17,0.65)' }}
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white rounded-2xl border-2 border-pm-black w-full max-w-[900px] max-h-[90dvh] overflow-hidden flex flex-col transition-[opacity,transform] duration-150 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-pm-rule flex-shrink-0">
          <div className="flex items-center gap-3">
            {variants.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-11 h-11 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 active:scale-[0.95] transition-[background-color,border-color,transform] duration-150 ease-out"
                  aria-label="Previous design"
                >
                  ‹
                </button>
                <span className="font-mono text-label uppercase text-pm-muted tabular-nums" aria-live="polite" aria-atomic="true">
                  <span className="sr-only">Design </span>
                  {index + 1} / {variants.length}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="w-11 h-11 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 active:scale-[0.95] transition-[background-color,border-color,transform] duration-150 ease-out"
                  aria-label="Next design"
                >
                  ›
                </button>
              </>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="w-11 h-11 bg-pm-black text-white rounded-full flex items-center justify-center hover:bg-pm-ink active:scale-[0.95] transition-[background-color,transform] duration-150 ease-out text-[13px]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Image column */}
          <div
            className="stage-cream w-full md:w-[44%] flex-shrink-0 flex items-center justify-center relative md:border-r border-b md:border-b-0 border-pm-rule touch-pan-y"
            style={{ minHeight: '260px' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
            {selected?.image && (
              <div
                ref={stageRef}
                key={slide?.n ?? 0}
                className={`w-full h-full flex items-center justify-center ${slide ? 'animate-slide-in' : ''}`}
                style={slide ? ({ '--dir': slide.dir } as React.CSSProperties) : undefined}
              >
                <ResponsiveImage
                  image={selected.image}
                  alt={selected.label}
                  sizes={STAGE_SIZES}
                  loading="eager"
                  className="w-full h-full object-contain p-6"
                />
              </div>
            )}
            {selected?.label && (
              <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate font-mono text-label-sm uppercase text-pm-muted bg-white/70 px-2 py-1 rounded">
                {selected.label}
              </span>
            )}
            {variants.length > 1 && (
              <span className="md:hidden absolute bottom-3 right-3 font-mono text-label-sm uppercase text-pm-muted bg-white/70 px-2 py-1 rounded">
                Swipe to browse
              </span>
            )}
          </div>

          {/* Info column */}
          <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain p-6 gap-5">
            <div>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-pm-muted">Accessory</span>
              <h2 id={titleId} className="font-display uppercase text-[clamp(28px,3.5vw,42px)] leading-[0.95] tracking-[0.005em] text-pm-black mt-1 break-words">
                {category.name}
              </h2>
            </div>

            <p className="text-[15px] leading-[1.6] text-pm-ink">{category.desc}</p>

            <div className="border-t border-pm-rule pt-4">
              <p className="text-[14px] leading-[1.6] text-pm-ink">
                Pick one up at the Playmaker tent, or message us to order.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <ButtonLink to="/contact" size="sm">
                  Message us to order
                </ButtonLink>
                <ButtonLink to="/events" variant="secondary" size="sm">
                  Find the tent
                </ButtonLink>
              </div>
            </div>

            {palette.length > 0 && (
              <div>
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-2">
                  Colors available
                </span>
                <div className="flex flex-wrap gap-2">
                  {palette.map((c) => (
                    <span
                      key={c.token}
                      role="img"
                      title={c.name}
                      aria-label={c.name}
                      className="w-6 h-6 rounded-full border border-pm-rule"
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-2">
                {variants.length} {variants.length === 1 ? 'Design' : 'Designs'}
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      if (i === index) return;
                      setIndex(i);
                      setSlide((s) => ({ dir: i > index ? 1 : -1, n: (s?.n ?? 0) + 1 }));
                    }}
                    title={v.label}
                    aria-label={v.label}
                    aria-pressed={i === index}
                    className={`aspect-square stage-cream rounded-lg overflow-hidden border-2 transition-colors ${
                      i === index ? 'border-pm-black' : 'border-pm-rule hover:border-pm-ink'
                    }`}
                  >
                    <ResponsiveImage
                      image={v.image}
                      alt=""
                      sizes="96px"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
