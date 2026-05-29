import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JERSEY_STYLE_OPTIONS } from '../../data/apparel';

const schema = z.object({
  team_name: z.string().min(1, 'Required'),
  contact_name: z.string().min(1, 'Required'),
  email: z.email('Enter a valid email'),
  phone: z.string().optional(),
  jersey_style_interest: z.string().optional(),
  roster_count: z.coerce.number().int().min(1, 'Enter your roster size'),
  sku: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = {
  team_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  jersey_style_interest?: string;
  roster_count: number;
  sku?: string;
  notes?: string;
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mb-1.5">
        {label}{required && <span className="text-pm-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-pm-error">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-ink bg-white focus:outline-none focus:border-pm-black transition-colors duration-150';

export function ApparelInquiryForm({ initialSku }: { initialSku?: string }) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues> });

  useEffect(() => {
    if (initialSku) {
      setValue('sku', initialSku);
    }
  }, [initialSku, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'inquiry', ...values }),
      });
      if (!res.ok) throw new Error();
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="border border-pm-success/30 bg-pm-success/5 rounded-xl p-8">
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-success">Request received</span>
        <p className="font-display uppercase text-[22px] leading-[1.1] tracking-[0.005em] mt-2 text-pm-black">
          We'll send a proof same-day — check your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {initialSku && (
        <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted bg-pm-paper-2 border border-pm-rule rounded-xl px-4 py-3">
          Inquiring about SKU: <span className="text-pm-black">{initialSku}</span>
        </div>
      )}

      <input type="hidden" {...register('sku')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Team name" required error={errors.team_name?.message}>
          <input {...register('team_name')} className={inputClass} placeholder="Acadiana Sluggers" />
        </Field>
        <Field label="Contact name" required error={errors.contact_name?.message}>
          <input {...register('contact_name')} className={inputClass} placeholder="Coach Smith" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email" required error={errors.email?.message}>
          <input {...register('email')} type="email" className={inputClass} placeholder="coach@team.com" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register('phone')} type="tel" className={inputClass} placeholder="(337) 555-0100" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Jersey style interest" error={errors.jersey_style_interest?.message}>
          <select {...register('jersey_style_interest')} className={inputClass}>
            <option value="">Select a style…</option>
            {JERSEY_STYLE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Custom">Custom / Not sure yet</option>
          </select>
        </Field>
        <Field label="Roster size" required error={errors.roster_count?.message}>
          <input {...register('roster_count')} type="number" min={1} className={inputClass} placeholder="18" />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full border border-pm-rule rounded-xl px-4 py-3 text-[15px] text-pm-ink bg-white focus:outline-none focus:border-pm-black transition-colors duration-150 resize-none"
          placeholder="Colors, artwork files, rush timeline, special requests…"
        />
      </Field>

      {submitStatus === 'error' && (
        <p className="text-[13px] text-pm-error">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-7 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={isSubmitting ? 'animate-pulse' : ''}>
          {isSubmitting ? 'Sending…' : 'Request a quote'}
        </span>
      </button>
    </form>
  );
}
