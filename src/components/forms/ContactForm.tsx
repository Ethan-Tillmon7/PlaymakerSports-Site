import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  role: z.enum(['Player', 'Parent', 'Coach'], { message: 'Please select a role' }),
  name: z.string().min(1, 'Required'),
  email: z.email('Enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Required'),
  event_name: z.string().optional(),
});

type FormValues = {
  role: 'Player' | 'Parent' | 'Coach';
  name: string;
  email: string;
  phone?: string;
  message: string;
  event_name?: string;
};

function Field({
  label,
  required,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mb-1.5"
      >
        {label}
        {required && <span className="text-pm-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-pm-error">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-ink bg-white focus:outline-none focus:border-pm-black transition-colors duration-150';

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues> });

  const onSubmit = async (values: FormValues) => {
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-success">
          Message received
        </span>
        <p className="font-display uppercase text-[22px] leading-[1.1] tracking-[0.005em] mt-2 text-pm-black">
          We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="I am a" required error={errors.role?.message} htmlFor="cf-role">
        <select {...register('role')} id="cf-role" className={inputClass}>
          <option value="" disabled>
            Select…
          </option>
          <option value="Player">Player</option>
          <option value="Parent">Parent</option>
          <option value="Coach">Coach</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" required error={errors.name?.message} htmlFor="cf-name">
          <input {...register('name')} id="cf-name" className={inputClass} placeholder="Full name" />
        </Field>
        <Field label="Email" required error={errors.email?.message} htmlFor="cf-email">
          <input
            {...register('email')}
            id="cf-email"
            type="email"
            className={inputClass}
            placeholder="you@email.com"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Phone" error={errors.phone?.message} htmlFor="cf-phone">
          <input
            {...register('phone')}
            id="cf-phone"
            type="tel"
            className={inputClass}
            placeholder="(337) 555-0100"
          />
        </Field>
        <Field label="Tournament or event" error={errors.event_name?.message} htmlFor="cf-event">
          <input
            {...register('event_name')}
            id="cf-event"
            className={inputClass}
            placeholder="Optional"
          />
        </Field>
      </div>

      <Field label="Message" required error={errors.message?.message} htmlFor="cf-message">
        <textarea
          {...register('message')}
          id="cf-message"
          rows={5}
          className="w-full border border-pm-rule rounded-xl px-4 py-3 text-[15px] text-pm-ink bg-white focus:outline-none focus:border-pm-black transition-colors duration-150 resize-none"
          placeholder="What can we help you with?"
        />
      </Field>

      {submitStatus === 'error' && (
        <p className="text-[13px] text-pm-error">
          Something went wrong. Please try again or reach out directly.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-7 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={isSubmitting ? 'animate-pulse' : ''}>
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </span>
      </button>
    </form>
  );
}
