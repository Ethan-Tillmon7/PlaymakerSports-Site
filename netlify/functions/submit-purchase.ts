import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { getSheetsClient, SHEET_ID } from './_sheets';

const purchaseSchema = z.object({
  contact_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  jersey_style_interest: z.string().min(1),
  quantity: z.number().int().min(1),
  sku: z.string().min(1),
  notes: z.string().optional(),
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

  const parsed = purchaseSchema.safeParse(body);
  if (!parsed.success) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Validation failed', issues: parsed.error.issues }),
    };
  }

  try {
    const sheets = getSheetsClient();
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      'Individual Purchase',
      parsed.data.contact_name,
      parsed.data.email,
      parsed.data.phone ?? '',
      parsed.data.jersey_style_interest,
      String(parsed.data.quantity),
      parsed.data.sku,
      parsed.data.notes ?? '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'SalesOrders!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Archive!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('submit-purchase error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to save order' }),
    };
  }
};
