import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { contactSchema } from '../../shared/contact';
import { json, readJsonBody } from '../lib/http';
import { appendRows, safecell } from '../lib/sheets';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const MAX_BODY_BYTES = 20_000;

// Mirrors SITE_URL in src/config/site.ts; functions can't import from src/.
const APPAREL_URL = 'https://playmakersports.co/apparel';

// The auto-reply goes to whatever address the submitter typed, so it is fully static:
// nothing from the submission (name, message) is reflected back to that address.
const AUTOREPLY_SUBJECT = 'Thanks for reaching out to Playmaker Sports';
const AUTOREPLY_TEXT = `Thanks for reaching out to Playmaker Sports!

We got your message, and someone from our team will get back to you soon. Need to add something? Just reply to this email.

In the meantime, browse our gear: ${APPAREL_URL}

Playmaker Sports`;
const AUTOREPLY_HTML = `
  <p>Thanks for reaching out to Playmaker Sports!</p>
  <p>We got your message, and someone from our team will get back to you soon. Need to add something? Just reply to this email.</p>
  <p>In the meantime, <a href="${APPAREL_URL}">browse our gear</a>.</p>
  <p>Playmaker Sports</p>
`;

export const handler: Handler = async (event) => {
  const body = readJsonBody(event, contactSchema, { maxBytes: MAX_BODY_BYTES });
  if (!body.ok) return body.response;
  const data = body.data;

  if (data.company) {
    // Honeypot filled: answer like a success so the bot moves on; save nothing and email no one.
    return json(200, { success: true });
  }
  const timestamp = new Date().toISOString();

  try {
    await appendRows('ContactRequests!A1', [[
      timestamp,
      data.role,
      safecell(data.name),
      safecell(data.email),
      safecell(data.phone ?? ''),
      safecell(data.message),
      safecell(data.event_name ?? ''),
    ]]);
  } catch (err) {
    console.error('submit-contact sheets error:', err);
    return json(500, { error: 'Failed to save submission' });
  }

  // Resend's sandbox sender only delivers to the Resend account owner's address.
  // Set CONTACT_FROM_EMAIL to a verified-domain sender (e.g. notifications@playmakersports.co)
  // once playmakersports.co is verified in Resend.
  const from = process.env.CONTACT_FROM_EMAIL || 'Playmaker Sports <onboarding@resend.dev>';

  // Resend failure is non-fatal — the Sheets row is the source of record. But the SDK
  // returns API failures as `{ error }` instead of throwing, so check it explicitly;
  // otherwise a rejected send (unverified sender domain, sandbox recipient limit)
  // disappears without a log line.
  try {
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      throw new Error('RESEND_API_KEY or CONTACT_EMAIL is not set');
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to: process.env.CONTACT_EMAIL,
      replyTo: data.email,
      subject: `New Contact: ${data.role} — ${data.name.replace(/\s+/g, ' ')}`,
      html: `
        <p><strong>Role:</strong> ${esc(data.role)}</p>
        <p><strong>Name:</strong> ${esc(data.name)}</p>
        <p><strong>Email:</strong> ${esc(data.email)}</p>
        <p><strong>Phone:</strong> ${esc(data.phone || '—')}</p>
        <p><strong>Message:</strong><br/>${esc(data.message).replace(/\r?\n/g, '<br/>')}</p>
        <p><strong>Event:</strong> ${esc(data.event_name || '—')}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Submitted ${timestamp}</p>
      `,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (err) {
    console.error('submit-contact resend error:', err);
  }

  // Auto-reply to the submitter. Separate try so it doesn't depend on the team send.
  // Same non-fatal, check-`{ error }` rules as above.
  try {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL,
      subject: AUTOREPLY_SUBJECT,
      html: AUTOREPLY_HTML,
      text: AUTOREPLY_TEXT,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (err) {
    console.error('submit-contact autoreply error:', err);
  }

  return json(200, { success: true });
};
