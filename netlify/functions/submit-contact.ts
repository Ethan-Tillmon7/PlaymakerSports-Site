import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { Resend } from 'resend';
import { getSheetsClient, SHEET_ID } from './_sheets';

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
      data.name,
      data.email,
      data.phone ?? '',
      data.message,
      data.event_name ?? '',
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
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Playmaker Sports <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `New Contact: ${data.role} — ${data.name}`,
      html: `
        <p><strong>Role:</strong> ${data.role}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone ?? '—'}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <p><strong>Event:</strong> ${data.event_name ?? '—'}</p>
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
