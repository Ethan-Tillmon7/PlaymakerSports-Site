import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { Resend } from 'resend';
import { getSheetsClient, SHEET_ID } from './_sheets';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const safecell = (s: string) => (/^[=+\-@\t\r]/.test(s) ? "'" + s : s);

const schema = z.object({
  role: z.enum(['Player', 'Parent', 'Coach']),
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  event_name: z.string().optional(),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
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

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'Playmaker Sports <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `New Contact: ${data.role} — ${data.name}`,
      html: `
        <p><strong>Role:</strong> ${esc(data.role)}</p>
        <p><strong>Name:</strong> ${esc(data.name)}</p>
        <p><strong>Email:</strong> ${esc(data.email)}</p>
        <p><strong>Phone:</strong> ${esc(data.phone ?? '—')}</p>
        <p><strong>Message:</strong> ${esc(data.message)}</p>
        <p><strong>Event:</strong> ${esc(data.event_name ?? '—')}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Submitted ${timestamp}</p>
      `,
    });
  } catch (err) {
    console.error('submit-contact resend error:', err);
    // Resend failure is non-fatal — Sheets write is the source of record
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
