import type { Config } from '@netlify/functions';
import { Resend } from 'resend';
import { contactSchema } from '../../shared/contact';
import { renderNotice, renderThanks } from '../lib/contactEmails';
import { jsonResponse, readJsonRequest } from '../lib/http';
import { appendRows, safecell } from '../lib/sheets';

const MAX_BODY_BYTES = 20_000;

// v2 function: `path` replaces the netlify.toml redirect, and `rateLimit` runs on
// the function itself (5 submissions per 60 s per IP + domain → 429), so it holds
// however the function is reached. netlify dev does not enforce rateLimit.
export const config: Config = {
  path: '/api/submit-contact',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};

export default async (req: Request) => {
  const body = await readJsonRequest(req, contactSchema, { maxBytes: MAX_BODY_BYTES });
  if (!body.ok) return body.response;
  const data = body.data;

  if (data.company) {
    // Honeypot filled: answer like a success so the bot moves on; save nothing and email no one.
    return jsonResponse(200, { success: true });
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
    return jsonResponse(500, { error: 'Failed to save submission' });
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
      ...renderNotice(data, timestamp),
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
      ...renderThanks(),
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (err) {
    console.error('submit-contact autoreply error:', err);
  }

  return jsonResponse(200, { success: true });
};
