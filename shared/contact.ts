import { z } from 'zod';

export const CONTACT_ROLES = ['Event Organizer', 'Player', 'Parent', 'Coach'] as const;

/**
 * Field limits. They keep one submission well under the 50,000-character Sheets
 * cell cap, which would otherwise fail the append and lose the message.
 */
export const CONTACT_LIMITS = { name: 100, email: 254, phone: 30, event_name: 150, message: 5000 } as const;

/** The contact form's contract, validated by the form and again by submit-contact. */
export const contactSchema = z.object({
  role: z.enum(CONTACT_ROLES, { message: 'Please select a role' }),
  name: z
    .string()
    .trim()
    .min(1, 'Enter your name')
    .max(CONTACT_LIMITS.name, `Keep it under ${CONTACT_LIMITS.name} characters`),
  email: z.email('Enter a valid email, like you@email.com').max(CONTACT_LIMITS.email, 'That email is too long'),
  phone: z.string().trim().max(CONTACT_LIMITS.phone, `Keep it under ${CONTACT_LIMITS.phone} characters`).optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Tell us what you need')
    .max(CONTACT_LIMITS.message, `Keep it under ${CONTACT_LIMITS.message.toLocaleString('en-US')} characters`),
  event_name: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.event_name, `Keep it under ${CONTACT_LIMITS.event_name} characters`)
    .optional(),
  // Honeypot: visually hidden and out of the tab order. People never fill it; bots do.
  company: z.string().optional(),
});

export type ContactSubmission = z.input<typeof contactSchema>;
