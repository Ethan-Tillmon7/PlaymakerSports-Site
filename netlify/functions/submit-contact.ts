import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { Resend } from 'resend';
import { getSheetsClient, SHEET_ID, safecell } from './_sheets';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Limits match ContactForm.tsx. They keep one submission well under the 50,000-
// character Sheets cell cap, which would otherwise fail the append and lose the message.
const schema = z.object({
  role: z.enum(['Event Organizer', 'Player', 'Parent', 'Coach']),
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(5000),
  event_name: z.string().trim().max(150).optional(),
  // Honeypot: a visually hidden field people never see. Bots that fill every input do.
  company: z.string().optional(),
});

const MAX_BODY_BYTES = 20_000;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if ((event.body?.length ?? 0) > MAX_BODY_BYTES) {
    return {
      statusCode: 413,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Submission too large' }),
    };
  }

  let body: unknown;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Validation failed', issues: parsed.error.issues }),
    };
  }

  const data = parsed.data;
  if (data.company) {
    // Answer like a success so the bot moves on; save nothing and email no one.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  }
  const timestamp = new Date().toISOString();

  try {
    const sheets = getSheetsClient();
    const row = [
      timestamp,
      data.role,
      safecell(data.name),
      safecell(data.email),
      safecell(data.phone ?? ''),
      safecell(data.message),
      safecell(data.event_name ?? ''),
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'ContactRequests!A1',
      valueInputOption: 'RAW',
      // INSERT_ROWS, not the default OVERWRITE: append writes just below the table it
      // detects, and a Sheets "Table" that covers only the header makes that row 2 —
      // so OVERWRITE replaced the previous submission every time.
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
  } catch (err) {
    console.error('submit-contact sheets error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to save submission' }),
    };
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

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
