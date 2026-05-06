import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { getSheetsClient, SHEET_ID } from './_sheets';

const SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL', 'A2XL', 'A3XL'] as const;

const inquirySchema = z.object({
  type: z.literal('inquiry'),
  team_name: z.string().min(1),
  contact_name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  jersey_style_interest: z.string().optional(),
  roster_count: z.number().int().min(12),
  sku: z.string().optional(),
  notes: z.string().optional(),
});

const playerSchema = z.object({
  player_name: z.string().min(1),
  number: z.number().int().min(0).max(99),
  size: z.enum(SIZES),
});

const rosterSchema = z.object({
  type: z.literal('roster'),
  team_name: z.string().min(1),
  players: z.array(playerSchema).min(1),
});

const submitSchema = z.discriminatedUnion('type', [inquirySchema, rosterSchema]);

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

  const parsed = submitSchema.safeParse(body);
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

    if (parsed.data.type === 'inquiry') {
      const { type: _type, ...data } = parsed.data;
      const row = [
        timestamp,
        data.team_name,
        data.contact_name,
        data.email,
        data.phone ?? '',
        data.jersey_style_interest ?? '',
        String(data.roster_count),
        data.sku ?? '',
        data.notes ?? '',
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'SalesOrders!A:I',
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Archive!A:I',
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
    } else {
      const rows = parsed.data.players.map((p) => [
        timestamp,
        parsed.data.team_name,
        p.player_name,
        String(p.number),
        p.size,
      ]);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'CustomerContacts!A:E',
        valueInputOption: 'RAW',
        requestBody: { values: rows },
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('submit-order error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to save submission' }),
    };
  }
};
