import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { classifyFailure, fetchWithTimeout, type RequestFailure } from '@/lib/http';
import { API } from '@shared/api';
import { CONTACT_LIMITS, contactSchema, type ContactSubmission } from '@shared/contact';

type SubmitError = RequestFailure | 'invalid';

const submitErrorCopy: Record<SubmitError, string> = {
  offline: "You're offline. Your message is still here, so send it once you have signal.",
  timeout: "This is taking too long, probably a weak connection. Your message is still here, so try sending it again.",
  server: "We couldn't send your message just now. It's still here, so try again in a minute.",
  invalid: "Something in the form didn't go through. Check each field and send it again.",
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
  htmlFor: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mb-1.5"
      >
        {label}
        {required && <span className="text-pm-error ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-[12px] text-pm-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria wiring so screen readers announce a field's error with the field. */
const errorProps = (id: string, error?: string) =>
  error ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } : {};

// 16px, not 15px: iOS Safari zooms the whole page when a field under 16px gets focus.
const inputClass =
  'w-full border border-pm-rule rounded-xl px-4 h-11 text-[16px] text-pm-ink bg-white focus:outline-none focus:border-pm-black aria-[invalid=true]:border-pm-error transition-colors duration-150';

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSubmission>({ resolver: zodResolver(contactSchema) as Resolver<ContactSubmission>, defaultValues: { role: 'Coach' } });

  const messageLength = useWatch({ control, name: 'message' })?.length ?? 0;

  useEffect(() => {
    if (submitStatus === 'success') successRef.current?.focus();
  }, [submitStatus]);

  const onSubmit = async (values: ContactSubmission) => {
    setSubmitError(null);
    try {
      const res = await fetchWithTimeout(API.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        timeoutMs: 20000,
      });
      if (res.status === 400 || res.status === 413) {
        setSubmitError('invalid');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitStatus('success');
      reset();
    } catch (err) {
      // react-hook-form keeps every value on failure; nothing the person typed is lost.
      setSubmitError(classifyFailure(err));
    }
  };

  if (submitStatus === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-pm-success/30 bg-pm-success/5 rounded-xl p-8 focus:outline-none"
      >
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
    // noValidate: zod owns validation so every error shows in the same place and style.
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="I am a" required error={errors.role?.message} htmlFor="cf-role">
        <select {...register('role')} id="cf-role" className={inputClass} {...errorProps('cf-role', errors.role?.message)}>
          <option value="Event Organizer">Event Organizer</option>
          <option value="Player">Player</option>
          <option value="Parent">Parent</option>
          <option value="Coach">Coach</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" required error={errors.name?.message} htmlFor="cf-name">
          <input
            {...register('name')}
            id="cf-name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            aria-required="true"
            className={inputClass}
            placeholder="Full name"
            {...errorProps('cf-name', errors.name?.message)}
          />
        </Field>
        <Field label="Email" required error={errors.email?.message} htmlFor="cf-email">
          <input
            {...register('email')}
            id="cf-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            maxLength={CONTACT_LIMITS.email}
            aria-required="true"
            className={inputClass}
            placeholder="you@email.com"
            {...errorProps('cf-email', errors.email?.message)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Phone" error={errors.phone?.message} htmlFor="cf-phone">
          <input
            {...register('phone')}
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            className={inputClass}
            placeholder="(337) 555-0100"
            {...errorProps('cf-phone', errors.phone?.message)}
          />
        </Field>
        <Field label="Tournament or event" error={errors.event_name?.message} htmlFor="cf-event">
          <input
            {...register('event_name')}
            id="cf-event"
            maxLength={CONTACT_LIMITS.event_name}
            className={inputClass}
            placeholder="Optional"
            {...errorProps('cf-event', errors.event_name?.message)}
          />
        </Field>
      </div>

      <Field label="Message" required error={errors.message?.message} htmlFor="cf-message">
        <textarea
          {...register('message')}
          id="cf-message"
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          aria-required="true"
          className="w-full border border-pm-rule rounded-xl px-4 py-3 text-[16px] text-pm-ink bg-white focus:outline-none focus:border-pm-black aria-[invalid=true]:border-pm-error transition-colors duration-150 resize-none"
          placeholder="What can we help you with?"
          {...errorProps('cf-message', errors.message?.message)}
        />
        {messageLength > CONTACT_LIMITS.message * 0.8 && (
          <p className="mt-1 text-right font-mono text-[10px] tracking-[0.1em] uppercase text-pm-muted tabular-nums" aria-live="polite">
            {messageLength.toLocaleString('en-US')} / {CONTACT_LIMITS.message.toLocaleString('en-US')}
          </p>
        )}
      </Field>

      {/* Honeypot. Off-screen and out of the tab order, so only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input {...register('company')} id="cf-company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {submitError && (
        <p role="alert" className="text-[13px] leading-[1.5] text-pm-error">
          {submitErrorCopy[submitError]}
        </p>
      )}

      <div className="flex">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={isSubmitting ? 'animate-pulse' : ''}>
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </span>
        </Button>
      </div>
    </form>
  );
}
