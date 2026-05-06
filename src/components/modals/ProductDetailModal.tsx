import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Diamond } from '../layout/DiamondMark';
import type { Product, ProductCategory } from '../../types/product';

interface ProductDetailModalProps {
  initialProduct: Product;
  allProducts: Product[];
  onClose: () => void;
}

type ModalStep = 'detail' | 'form' | 'success';

const categoryStage: Record<ProductCategory, string> = {
  Jersey: 'stage-cream',
  Cap: 'stage-stone',
  Pants: 'stage-sky',
  Practice: 'stage-mint',
  Patch: 'stage-blush',
  Trinket: 'stage-paper',
};

function ProductPlaceholder({ category }: { category: ProductCategory }) {
  if (category === 'Jersey') {
    return (
      <svg viewBox="0 0 200 240" className="w-[55%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]" aria-hidden="true">
        <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="1.2" />
      </svg>
    );
  }
  if (category === 'Cap') {
    return (
      <svg
        viewBox="0 0 200 160"
        className="w-[66%] drop-shadow-[0_18px_30px_rgba(17,17,17,0.10)]"
        aria-hidden="true"
      >
        <path
          d="M 12 108 C 12 40 100 10 100 10 C 100 10 188 40 188 108 Z"
          fill="white"
          stroke="#D9D5C4"
          strokeWidth="1.8"
        />
        <rect x="2" y="106" width="196" height="20" rx="10" fill="white" stroke="#D9D5C4" strokeWidth="1.8" />
        <line x1="100" y1="13" x2="100" y2="108" stroke="#E8E4D8" strokeWidth="1" />
        <circle cx="100" cy="13" r="4" fill="#D9D5C4" />
        <g transform="translate(82, 44) scale(0.36)">
          <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="#F5C842" />
          <path d="M50 24 L76 50 L50 76 L24 50 Z" fill="white" />
          <line x1="50" y1="8" x2="50" y2="24" stroke="white" strokeWidth="3" />
          <line x1="50" y1="76" x2="50" y2="92" stroke="white" strokeWidth="3" />
          <line x1="8" y1="50" x2="24" y2="50" stroke="white" strokeWidth="3" />
          <line x1="76" y1="50" x2="92" y2="50" stroke="white" strokeWidth="3" />
        </g>
      </svg>
    );
  }
  if (category === 'Pants') {
    return (
      <div className="w-[36%] h-[72%] bg-white border border-pm-rule shadow-[0_18px_30px_rgba(17,17,17,0.10)] relative rounded-sm">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-pm-yellow rounded-full" />
      </div>
    );
  }
  if (category === 'Practice') {
    return (
      <div className="w-[62%] h-[44%] bg-pm-black shadow-[0_18px_30px_rgba(17,17,17,0.18)] flex items-center justify-center rounded-sm">
        <span className="font-display uppercase text-[24px] tracking-[0.04em] text-pm-yellow">Practice</span>
      </div>
    );
  }
  if (category === 'Patch') {
    return (
      <div className="w-[44%] aspect-square bg-pm-yellow border-[3px] border-pm-black flex items-center justify-center shadow-[0_18px_30px_rgba(17,17,17,0.12)] rounded-sm">
        <Diamond className="w-2/3 h-2/3 text-pm-black" />
      </div>
    );
  }
  return (
    <div className="w-[48%] aspect-square border-2 border-pm-rule bg-white shadow-[0_18px_30px_rgba(17,17,17,0.08)] flex items-center justify-center rounded-lg">
      <Diamond className="w-16 h-16 text-pm-muted" />
    </div>
  );
}

function DetailView({ product, onPurchase }: { product: Product; onPurchase: () => void }) {
  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
      {/* Image column */}
      <div
        className={`${categoryStage[product.category]} w-full md:w-[44%] flex-shrink-0 flex items-center justify-center relative md:border-r border-b md:border-b-0 border-pm-rule`}
        style={{ minHeight: '220px' }}
      >
        {product.teamId && (
          <span className="absolute top-3 left-3 bg-pm-navy text-pm-yellow font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-md">
            {product.teamId}
          </span>
        )}
        <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.1em] uppercase text-pm-muted">
          SKU · {product.sku}
        </span>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.displayName}
            className="w-full h-full object-contain"
          />
        ) : (
          <ProductPlaceholder category={product.category} />
        )}
      </div>

      {/* Info column */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
        <div>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-pm-muted">
            {product.category}
          </span>
          <h2 className="font-display uppercase text-[clamp(28px,3.5vw,42px)] leading-[0.95] tracking-[0.005em] text-pm-black mt-1">
            {product.displayName}
          </h2>
        </div>

        <p className="text-[15px] leading-[1.6] text-pm-ink">{product.description}</p>

        <div className="border-t border-pm-rule pt-4">
          <div className="font-display text-[28px] leading-none text-pm-black">
            {product.basePrice != null ? (
              <>
                ${product.basePrice}
                <span className="font-sans text-[14px] text-pm-muted ml-2 font-normal">each</span>
              </>
            ) : (
              <span className="text-[18px] text-pm-muted">Inquire for pricing</span>
            )}
          </div>
        </div>

        {product.sizesAvailable.length > 0 && (
          <div>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-2">
              Available sizes
            </span>
            <div className="flex flex-wrap gap-2">
              {product.sizesAvailable.map((s) => (
                <span
                  key={s}
                  className="bg-pm-paper-2 border border-pm-rule rounded-md px-3 py-1 font-mono text-[11px] tracking-[0.06em] uppercase text-pm-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-pm-rule pt-4 mt-auto">
          <button
            type="button"
            onClick={onPurchase}
            className="w-full font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black h-12 rounded-xl border-b-2 border-pm-yellow-deep hover:border-pm-black hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97]"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

const purchaseFormSchema = z.object({
  contactName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  size: z.string().min(1, 'Please select a size'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

function PurchaseForm({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema) as Resolver<PurchaseFormValues>,
    defaultValues: { quantity: 1 },
  });

  const selectedSize = watch('size');

  const onSubmit = async (values: PurchaseFormValues) => {
    setSubmitError(null);
    const jerseyStyleInterest = product.sizesAvailable.length > 0
      ? `${product.displayName} — Size ${values.size}`
      : `${product.displayName}${values.size ? ` — ${values.size}` : ''}`;

    try {
      const res = await fetch('/api/submit-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: values.contactName,
          email: values.email,
          phone: values.phone || undefined,
          jersey_style_interest: jerseyStyleInterest,
          quantity: values.quantity,
          sku: product.sku,
          notes: values.notes || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setSubmitError('Something went wrong — please try again or use the form below.');
    }
  };

  return (
    <div className="overflow-y-auto p-6 flex flex-col gap-5">
      {/* Product summary bar */}
      <div className="flex items-center gap-3 p-3 bg-pm-paper-2 rounded-xl border border-pm-rule">
        <div className={`${categoryStage[product.category]} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
          {product.category === 'Cap' ? (
            <svg viewBox="0 0 200 160" className="w-6 h-5" aria-hidden="true">
              <path d="M 12 108 C 12 40 100 10 100 10 C 100 10 188 40 188 108 Z" fill="white" stroke="#D9D5C4" strokeWidth="4" />
              <rect x="2" y="106" width="196" height="24" rx="12" fill="white" stroke="#D9D5C4" strokeWidth="4" />
            </svg>
          ) : (
            <svg viewBox="0 0 200 240" className="w-6 h-6" aria-hidden="true">
              <use href="#jersey" fill="#FFFFFF" stroke="#D9D5C4" strokeWidth="2" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-display uppercase text-[14px] leading-none text-pm-black truncate">
            {product.displayName}
          </div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-pm-muted mt-0.5">
            {product.basePrice != null ? `$${product.basePrice} each` : 'Inquire for pricing'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="pm-name" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
            Full name <span className="text-pm-yellow-deep">*</span>
          </label>
          <input
            id="pm-name"
            {...register('contactName')}
            className="w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-black placeholder:text-pm-muted focus:outline-none focus:border-pm-black transition-colors"
            placeholder="Your name"
          />
          {errors.contactName && (
            <p className="text-[12px] text-red-500 mt-1">{errors.contactName.message}</p>
          )}
        </div>

        {/* Email + Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pm-email" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
              Email <span className="text-pm-yellow-deep">*</span>
            </label>
            <input
              id="pm-email"
              {...register('email')}
              type="email"
              className="w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-black placeholder:text-pm-muted focus:outline-none focus:border-pm-black transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-[12px] text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="pm-phone" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
              Phone <span className="text-pm-muted/60">(optional)</span>
            </label>
            <input
              id="pm-phone"
              {...register('phone')}
              type="tel"
              className="w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-black placeholder:text-pm-muted focus:outline-none focus:border-pm-black transition-colors"
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        {/* Size */}
        {product.sizesAvailable.length > 0 ? (
          <div role="group" aria-labelledby="pm-size-label">
            <span id="pm-size-label" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
              Size <span className="text-pm-yellow-deep">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {product.sizesAvailable.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue('size', s, { shouldValidate: true })}
                  className={`px-4 h-10 rounded-xl border-2 font-mono text-[12px] tracking-[0.06em] uppercase transition-colors ${
                    selectedSize === s
                      ? 'border-pm-black bg-pm-black text-white'
                      : 'border-pm-rule bg-pm-paper-2 text-pm-ink hover:border-pm-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.size && (
              <p className="text-[12px] text-red-500 mt-1">{errors.size.message}</p>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="pm-size" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
              Size <span className="text-pm-yellow-deep">*</span>
            </label>
            <input
              id="pm-size"
              {...register('size')}
              className="w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-black placeholder:text-pm-muted focus:outline-none focus:border-pm-black transition-colors"
              placeholder="e.g. Medium, 7 3/8, 32x30..."
            />
            {errors.size && (
              <p className="text-[12px] text-red-500 mt-1">{errors.size.message}</p>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className="w-32">
          <label htmlFor="pm-quantity" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
            Quantity <span className="text-pm-yellow-deep">*</span>
          </label>
          <input
            id="pm-quantity"
            {...register('quantity')}
            type="number"
            min={1}
            className="w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-black focus:outline-none focus:border-pm-black transition-colors"
          />
          {errors.quantity && (
            <p className="text-[12px] text-red-500 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="pm-notes" className="font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted block mb-1.5">
            Notes <span className="text-pm-muted/60">(optional)</span>
          </label>
          <textarea
            id="pm-notes"
            {...register('notes')}
            rows={3}
            className="w-full border border-pm-rule rounded-xl px-4 py-3 text-[15px] text-pm-black placeholder:text-pm-muted focus:outline-none focus:border-pm-black transition-colors resize-none"
            placeholder="Anything else Jake should know?"
          />
        </div>

        {submitError && (
          <p className="text-[13px] text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black h-12 rounded-xl border-b-2 border-pm-yellow-deep hover:border-pm-black hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}

function SuccessView({
  product,
  onClose,
  onBrowseMore,
}: {
  product: Product;
  onClose: () => void;
  onBrowseMore: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 text-center min-h-[320px]">
      <div className="w-14 h-14 bg-pm-yellow border-b-2 border-pm-yellow-deep rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-display text-[22px] text-pm-black">✓</span>
      </div>
      <div>
        <h3 className="font-display uppercase text-[clamp(22px,2.5vw,32px)] leading-none tracking-[0.005em] text-pm-black">
          Order request sent.
        </h3>
        <p className="text-[15px] leading-[1.6] text-pm-ink mt-3 max-w-[400px]">
          Jake will follow up to confirm your <strong>{product.displayName}</strong> order and arrange payment.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBrowseMore}
          className="font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-6 h-11 rounded-xl border-b-2 border-pm-yellow-deep hover:border-pm-black transition-[colors,transform] duration-150 active:scale-[0.97]"
        >
          Browse more
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-display uppercase text-[15px] tracking-[0.04em] text-pm-ink border-b-2 border-pm-rule hover:border-pm-black transition-colors px-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ProductDetailModal({ initialProduct, allProducts, onClose }: ProductDetailModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.max(0, allProducts.findIndex((p) => p.sku === initialProduct.sku))
  );
  const [step, setStep] = useState<ModalStep>('detail');
  const [visible, setVisible] = useState(false);

  const currentProduct = allProducts[currentIndex] ?? initialProduct;

  // Animate in on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 120);
  }, [onClose]);

  const navigate = useCallback((dir: 1 | -1) => {
    setCurrentIndex((i) => (i + dir + allProducts.length) % allProducts.length);
    setStep('detail');
  }, [allProducts.length]);

  // Keyboard: Escape closes, arrows navigate (detail step only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (step !== 'detail') return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, handleClose, navigate]);

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
          {step === 'detail' ? (
            <div className="flex items-center gap-3">
              {allProducts.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors"
                    aria-label="Previous product"
                  >
                    ‹
                  </button>
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">
                    {currentIndex + 1} / {allProducts.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(1)}
                    className="w-8 h-8 border border-pm-rule rounded-lg flex items-center justify-center hover:border-pm-black hover:bg-pm-paper-2 transition-colors"
                    aria-label="Next product"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStep('detail')}
              className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-pm-muted hover:text-pm-ink transition-colors"
            >
              ‹ Back
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 bg-pm-black text-white rounded-full flex items-center justify-center hover:bg-pm-ink transition-colors text-[12px]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body — swapped by step */}
        {step === 'detail' && (
          <DetailView
            product={currentProduct}
            onPurchase={() => setStep('form')}
          />
        )}
        {step === 'form' && (
          <PurchaseForm product={currentProduct} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && (
          <SuccessView
            product={currentProduct}
            onClose={handleClose}
            onBrowseMore={() => setStep('detail')}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
