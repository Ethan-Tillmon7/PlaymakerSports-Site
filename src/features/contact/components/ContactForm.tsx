import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type FieldError, type Resolver } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { AlertIcon } from '@/components/ui/icons';
import type { ContactRole } from '@/lib/contactLink';
import { classifyFailure, fetchWithTimeout, type RequestFailure } from '@/lib/http';
import { API } from '@shared/api';
import { CONTACT_LIMITS, CONTACT_ROLES, contactSchema, type ContactSubmission } from '@shared/contact';

type SubmitError = RequestFailure | 'invalid' | 'rate_limited';

const submitErrorCopy: Record<SubmitError, string> = {
  offline: "You're offline. Your message is still here, so send it once you have signal.",
  timeout: "This is taking too long, probably a weak connection. Your message is still here, so try sending it again.",
  server: "We couldn't send your message just now. It's still here, so try again in a minute.",
  invalid: "Something in the form didn't go through. Check each field and send it again.",
  rate_limited: "Too many tries in a row. Wait a minute, then send it again. Your message is still here.",
};

// The role toggles, in the order they're shown. The message hint follows the
// role: a coach, a parent and a tournament director are each asked for the
// details their request needs.
const ROLES: { value: ContactRole; label: string; hint: string }[] = [
  { value: 'Coach', label: 'Coach', hint: 'Tell us what you need, how many, and when.' },
  { value: 'Parent', label: 'Parent', hint: "Tell us what you saw at the tent, or what you're looking for." },
  { value: 'Player', label: 'Player', hint: "Tell us what you saw at the tent, or what you're looking for." },
  { value: 'Event Organizer', label: 'Event organizer', hint: 'Tell us about your tournament: where, when, and how many teams.' },
];

type RequiredField = 'name' | 'email' | 'message';

// What the form says when a required field is empty or the email is malformed.
// The schema's own messages (shared/contact.ts) still cover everything else,
// such as the length limits.
const MISSING: Record<RequiredField, string> = {
  name: 'Add your name so we know who to reply to.',
  email: 'Add an email so we can write back.',
  message: 'Tell us what you need. A line or two is plenty.',
};
const EMAIL_INVALID = 'That email looks off. Check it for a typo.';

function requiredError(field: RequiredField, error: FieldError | undefined, value: string | undefined): string | undefined {
  if (!error) return undefined;
  if (!value?.trim()) return MISSING[field];
  if (field === 'email' && error.type !== 'too_big') return EMAIL_INVALID;
  return error.message;
}

/** A started message is one line; anything longer in the URL is cut. */
const ASK_LIMIT = 160;

function isRole(value: string | null): value is ContactRole {
  return (CONTACT_ROLES as readonly string[]).includes(value ?? '');
}

function FieldErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="err">
      <AlertIcon />
      <span>{error}</span>
    </p>
  );
}

/** aria wiring so screen readers announce a field's error with the field. */
const errorProps = (id: string, error?: string) =>
  error ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-err` } : {};

/**
 * The contact form: the intro line, the fields, and the sent state. It posts
 * to /api/submit-contact with the shared/contact.ts schema. An "ask" link
 * (askTo in lib/contactLink) arrives as ?role=…&ask=… and starts the message.
 */
export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    setFocus,
    trigger,
    clearErrors,
  } = useForm<ContactSubmission>({ resolver: zodResolver(contactSchema) as Resolver<ContactSubmission>, defaultValues: { role: 'Coach' } });

  const values = useWatch({ control });
  const messageLength = values.message?.length ?? 0;
  const hint = ROLES.find((role) => role.value === values.role)?.hint ?? ROLES[0].hint;

  useEffect(() => {
    if (sentTo) sentRef.current?.focus({ preventScroll: true });
  }, [sentTo]);

  // An "ask" link starts the message and picks the role. It never replaces
  // something the person has already typed.
  const ask = searchParams.get('ask')?.trim().slice(0, ASK_LIMIT);
  const askRole = searchParams.get('role');
  // A new ask while the sent state is showing brings the form back first.
  const [seenAsk, setSeenAsk] = useState(ask);
  if (ask !== seenAsk) {
    setSeenAsk(ask);
    if (ask) setSentTo(null);
  }
  useEffect(() => {
    if (!ask || getValues('message')?.trim()) return;
    setValue('message', `I'm interested in ${ask}. `);
    // An earlier empty submit may have flagged the box.
    clearErrors('message');
    if (isRole(askRole)) setValue('role', askRole);
    // Next frame, once the form is on screen.
    const frame = requestAnimationFrame(() => {
      const box = document.getElementById('cf-message') as HTMLTextAreaElement | null;
      box?.focus({ preventScroll: true });
      box?.setSelectionRange(box.value.length, box.value.length);
    });
    return () => cancelAnimationFrame(frame);
  }, [ask, askRole, getValues, setValue, clearErrors]);

  /**
   * A required field checks itself when it's left with something in it, and
   * once flagged it clears as soon as it's right, not on the next submit.
   */
  const live = (field: RequiredField) => {
    const props = register(field);
    return {
      ...props,
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        void props.onBlur(e);
        if (e.target.value.trim()) void trigger(field);
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        void props.onChange(e);
        if (errors[field]) void trigger(field);
      },
    };
  };

  const onSubmit = async (submission: ContactSubmission) => {
    setSubmitError(null);
    try {
      const res = await fetchWithTimeout(API.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
        timeoutMs: 20000,
      });
      if (res.status === 400 || res.status === 413) {
        setSubmitError('invalid');
        return;
      }
      if (res.status === 429) {
        // Netlify's rate limit on submit-contact: 5 sends per minute per IP.
        setSubmitError('rate_limited');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Echo the address back, so a typo is caught now and not after a week of silence.
      setSentTo(submission.email.trim());
      reset();
    } catch (err) {
      // react-hook-form keeps every value on failure; nothing the person typed is lost.
      setSubmitError(classifyFailure(err));
    }
  };

  if (sentTo) {
    return (
      <div data-sent role="status" className="py-8 sm:py-10 flex flex-col items-start">
        <span className="sent-check">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div className="sent-copy">
          <p ref={sentRef} tabIndex={-1} className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-pm-black mt-5 outline-none">
            Message sent
          </p>
          <p className="small mt-1.5">We'll be in touch soon. We'll reply to {sentTo}.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-6"
            onClick={() => {
              setSentTo(null);
              // Once the form is back on screen.
              requestAnimationFrame(() => setFocus('name'));
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    );
  }

  const nameError = requiredError('name', errors.name, values.name);
  const emailError = requiredError('email', errors.email, values.email);
  const messageError = requiredError('message', errors.message, values.message);

  return (
    <>
      <p className="small mt-1.5">Tell us what you're after and we'll follow up. The more specific, the better.</p>

      {/* noValidate: zod owns validation so every error shows in the same place and style. */}
      <form
        onSubmit={(e) => {
          // The busy button ignores clicks, but Enter in a field would still send a second copy.
          if (isSubmitting) e.preventDefault();
          else void handleSubmit(onSubmit)(e);
        }}
        noValidate
        className="mt-5 space-y-4"
      >
        <fieldset className="fld">
          <legend className="fld-legend">
            <span>
              I am a<span className="req" aria-hidden="true">*</span>
            </span>
          </legend>
          <div className="toggles">
            {ROLES.map((role) => (
              <label key={role.value} className="toggle">
                <input {...register('role')} type="radio" value={role.value} className="sr-only" />
                <span>{role.label}</span>
              </label>
            ))}
          </div>
          <FieldErrorText id="cf-role-err" error={errors.role?.message} />
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fld">
            <label htmlFor="cf-name">
              <span>
                Name<span className="req" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              {...live('name')}
              id="cf-name"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name}
              aria-required="true"
              className="input"
              placeholder="Full name"
              {...errorProps('cf-name', nameError)}
            />
            <FieldErrorText id="cf-name-err" error={nameError} />
          </div>
          <div className="fld">
            <label htmlFor="cf-email">
              <span>
                Email<span className="req" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              {...live('email')}
              id="cf-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              maxLength={CONTACT_LIMITS.email}
              aria-required="true"
              className="input"
              placeholder="you@email.com"
              {...errorProps('cf-email', emailError)}
            />
            <FieldErrorText id="cf-email-err" error={emailError} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fld">
            <label htmlFor="cf-phone">
              Phone <span className="opt">Optional</span>
            </label>
            <input
              {...register('phone')}
              id="cf-phone"
              type="tel"
              autoComplete="tel"
              maxLength={CONTACT_LIMITS.phone}
              className="input"
              placeholder="(337) 555-0100"
              {...errorProps('cf-phone', errors.phone?.message)}
            />
            <FieldErrorText id="cf-phone-err" error={errors.phone?.message} />
          </div>
          <div className="fld">
            <label htmlFor="cf-event" className="whitespace-nowrap">
              Tournament or event <span className="opt">Optional</span>
            </label>
            <input
              {...register('event_name')}
              id="cf-event"
              maxLength={CONTACT_LIMITS.event_name}
              className="input"
              {...errorProps('cf-event', errors.event_name?.message)}
            />
            <FieldErrorText id="cf-event-err" error={errors.event_name?.message} />
          </div>
        </div>

        <div className="fld">
          <label htmlFor="cf-message">
            <span>
              Message<span className="req" aria-hidden="true">*</span>
            </span>
          </label>
          <textarea
            {...live('message')}
            id="cf-message"
            rows={4}
            maxLength={CONTACT_LIMITS.message}
            aria-required="true"
            className="input"
            placeholder={hint}
            {...errorProps('cf-message', messageError)}
          />
          <FieldErrorText id="cf-message-err" error={messageError} />
          {messageLength > CONTACT_LIMITS.message * 0.8 && (
            <p className="caption mt-1.5 text-right tabular-nums" aria-live="polite">
              {messageLength.toLocaleString('en-US')} / {CONTACT_LIMITS.message.toLocaleString('en-US')}
            </p>
          )}
        </div>

        {/* Honeypot. Off-screen and out of the tab order, so only bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor="cf-company">Company</label>
          <input {...register('company')} id="cf-company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {submitError && (
          <p role="alert" className="err">
            <AlertIcon />
            <span>{submitErrorCopy[submitError]}</span>
          </p>
        )}

        {/* aria-busy, not disabled: the button keeps its width, its place in the
            tab order and its label for screen readers while it works. */}
        <button type="submit" data-submit aria-busy={isSubmitting || undefined} className="btn btn-primary btn-lg w-full">
          <svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
          <span>{isSubmitting ? 'Sending' : 'Send message'}</span>
        </button>
      </form>
    </>
  );
}
