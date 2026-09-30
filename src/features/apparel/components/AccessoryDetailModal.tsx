import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { paletteFor, type AccessoryCategory } from '../catalog/accessories';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

const SWIPE_THRESHOLD = 50; // px of horizontal travel to commit a variant change
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
    setTimeout(onClose, 120);
  }, [onClose]);

  const navigate = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + variants.length) % variants.length),
    [variants.length],
  );

  // Touch swipe on the image area — mirrors the ‹ › arrows / arrow keys.
  // A second finger (pinch-zoom) or a browser-cancelled touch abandons the swipe
  // so it can't commit on the way out; the next single-finger swipe starts clean.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      touchStart.current = null;
      return;
    }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchCancel = () => {
    touchStart.current = null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || variants.length < 2 || e.touches.length > 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Commit only on a dominantly-horizontal drag past the threshold.
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      navigate(dx < 0 ? 1 : -1);
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

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(17,17,17,0.65)' }}
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white rounded-2xl border-2 border-pm-black w-full max-w-[900px] max-h-[90dvh] overflow-hidden flex flex-col transition-[opacity,transform] duration-150 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
                  className="w-10 h-10 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors duration-150"
                  aria-label="Previous design"
                >
                  ‹
                </button>
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted tabular-nums" aria-live="polite" aria-atomic="true">
                  <span className="sr-only">Design </span>
                  {index + 1} / {variants.length}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="w-10 h-10 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors duration-150"
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
            className="w-10 h-10 bg-pm-black text-white rounded-full flex items-center justify-center hover:bg-pm-ink transition-colors duration-150 text-[13px]"
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
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
            {selected?.image && (
              <ResponsiveImage
                image={selected.image}
                alt={selected.label}
                sizes="(min-width:768px) 400px, 90vw"
                loading="eager"
                className="w-full h-full object-contain p-6"
              />
            )}
            {selected?.label && (
              <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate font-mono text-[9px] tracking-[0.1em] uppercase text-pm-muted bg-white/70 px-2 py-1 rounded">
                {selected.label}
              </span>
            )}
            {variants.length > 1 && (
              <span className="md:hidden absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.1em] uppercase text-pm-muted bg-white/70 px-2 py-1 rounded">
                Swipe to browse
              </span>
            )}
          </div>

          {/* Info column */}
          <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
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
                <Link
                  to="/contact"
                  className="font-display uppercase text-[14px] tracking-[0.04em] bg-pm-yellow text-pm-black px-4 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
                >
                  Message us to order
                </Link>
                <Link to="/events" className="text-[14px] px-4 h-10 font-display uppercase tracking-[0.04em] bg-white text-pm-black inline-flex items-center justify-center hover:bg-pm-paper-2 transition-[colors,transform] duration-150 active:scale-[0.97] border border-pm-rule border-b-2 hover:border-pm-black rounded-xl">
                  Find the tent
                </Link>
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
                    onClick={() => setIndex(i)}
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
