import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { contactSchema } from '../../shared/contact';
import { json, readJsonBody } from '../lib/http';
import { appendRows, safecell } from '../lib/sheets';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const MAX_BODY_BYTES = 20_000;

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

  // Resend failure is non-fatal — the Sheets row is the source of record. But the SDK
  // returns API failures as `{ error }` instead of throwing, so check it explicitly;
  // otherwise a rejected send (unverified sender domain, sandbox recipient limit)
  // disappears without a log line.
  try {
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      throw new Error('RESEND_API_KEY or CONTACT_EMAIL is not set');
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Resend's sandbox sender only delivers to the Resend account owner's address.
    // Set CONTACT_FROM_EMAIL to a verified-domain sender (e.g. notifications@playmakersports.co)
    // once playmakersports.co is verified in Resend.
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Playmaker Sports <onboarding@resend.dev>',
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

  return json(200, { success: true });
};
