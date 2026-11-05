import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { askTo } from '@/lib/contactLink';
import type { AccessoryCategory } from '../catalog/accessories';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** How long the sheet takes to leave (`.sheet`, components.css) before it unmounts. */
const EXIT_MS = 300;

interface AccessoryDetailModalProps {
  category: AccessoryCategory;
  onClose: () => void;
}

/**
 * Every design in one category, and a way to ask about it: a sheet from the
 * bottom on phones, a centred panel on desktop. It grows from the page and
 * leaves the same way.
 */
export function AccessoryDetailModal({ category, onClose }: AccessoryDetailModalProps) {
  const { variants } = category;
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  // Move focus to the sheet's title on open, so nothing is ringed until someone
  // tabs, and hand it back to the card that opened it.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    titleRef.current?.focus({ preventScroll: true });
    return () => opener?.focus?.({ preventScroll: true });
  }, []);

  const closing = useRef(false);
  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      // Keep Tab inside the dialog; the page behind it is inert while it's open.
      if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !nodes.includes(active as HTMLElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !nodes.includes(active as HTMLElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return createPortal(
    // A press on the dimmed page behind the sheet closes it.
    <div className={visible ? 'sheet-backdrop open' : 'sheet-backdrop'} onClick={handleClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sheet on-day"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <div className="min-w-0">
            <h2
              ref={titleRef}
              id={titleId}
              tabIndex={-1}
              className="sheet-title text-[24px] font-semibold leading-[1.2] tracking-[-0.022em] text-pm-black"
            >
              {category.name}
            </h2>
            <p className="small mt-1">
              {variants.length} {variants.length === 1 ? 'design' : 'designs'} · {category.desc}
            </p>
          </div>
          <button type="button" className="sheet-close" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="sheet-body">
          <ul className="designs">
            {variants.map((v) => (
              <li key={v.id}>
                {/* Decorative: the design's name is the line under it. */}
                <ResponsiveImage image={v.image} alt="" sizes="(min-width:768px) 214px, (min-width:560px) 30vw, 45vw" />
                <span>{v.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sheet-foot">
          <p className="small">
            Sold at the tent.{' '}
            <Link to="/events" className="link">
              See where we'll be next.
            </Link>
          </p>
          <ButtonLink to={askTo(`${category.name.toLowerCase()} from the tent`, 'Parent')} arrow className="w-full sm:w-auto">
            Ask about this
          </ButtonLink>
        </div>
      </div>
    </div>,
    document.body,
  );
}
