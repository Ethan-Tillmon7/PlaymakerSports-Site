import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { paletteFor, type AccessoryCategory } from '../../data/accessories';

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

  const selected = variants[index];
  const palette = paletteFor(category);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 120);
  }, [onClose]);

  const navigate = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + variants.length) % variants.length),
    [variants.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
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
        className={`relative bg-white rounded-2xl border-2 border-pm-black w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col transition-[opacity,transform] duration-150 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
                  className="w-8 h-8 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors"
                  aria-label="Previous design"
                >
                  ‹
                </button>
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                  {index + 1} / {variants.length}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="w-8 h-8 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors"
                  aria-label="Next design"
                >
                  ›
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 bg-pm-black text-white rounded-full flex items-center justify-center hover:bg-pm-ink transition-colors text-[12px]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Image column */}
          <div
            className="stage-cream w-full md:w-[44%] flex-shrink-0 flex items-center justify-center relative md:border-r border-b md:border-b-0 border-pm-rule"
            style={{ minHeight: '260px' }}
          >
            {selected?.imageUrl && (
              <img src={selected.imageUrl} alt={selected.label} className="w-full h-full object-contain p-6" />
            )}
            {selected?.label && (
              <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.1em] uppercase text-pm-muted bg-white/70 px-2 py-1 rounded">
                {selected.label}
              </span>
            )}
          </div>

          {/* Info column */}
          <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
            <div>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-pm-muted">Accessory</span>
              <h2 className="font-display uppercase text-[clamp(28px,3.5vw,42px)] leading-[0.95] tracking-[0.005em] text-pm-black mt-1">
                {category.name}
              </h2>
            </div>

            <p className="text-[15px] leading-[1.6] text-pm-ink">{category.desc}</p>

            {palette.length > 0 && (
              <div>
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-2">
                  Colors available
                </span>
                <div className="flex flex-wrap gap-2">
                  {palette.map((c) => (
                    <span
                      key={c.token}
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
                    aria-current={i === index}
                    className={`aspect-square stage-cream rounded-lg overflow-hidden border-2 transition-colors ${
                      i === index ? 'border-pm-black' : 'border-pm-rule hover:border-pm-ink'
                    }`}
                  >
                    <img src={v.imageUrl} alt={v.label} className="w-full h-full object-cover" />
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
