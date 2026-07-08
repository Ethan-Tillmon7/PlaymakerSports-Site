import type { Handler } from '@netlify/functions';
import { getSheetsClient, SHEET_ID } from './_sheets';

interface PublicEvent {
  id: string;
  startDate: string;
  endDate: string;
  city: string;
}

function extractCity(location: string): string {
  const stateMatch = location.match(/,\s*([A-Z]{2})\s*$/);
  const state = stateMatch ? stateMatch[1] : '';
  const cityPart = location.split(/\s*[/,]/)[0].trim();
  return state ? `${cityPart}, ${state}` : cityPart;
}

export const handler: Handler = async () => {
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Events!A6:K',
    });

    const rows = res.data.values ?? [];
    const tournaments: PublicEvent[] = rows
      .filter((row) => row[1] && row[10] === 'TRUE' && row[5])
      .map((row) => ({
        id: String(row[0] ?? ''),
        startDate: String(row[1] ?? ''),
        endDate: String(row[2] ?? ''),
        city: extractCity(String(row[5])),
      }))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournaments),
    };
  } catch (err) {
    console.error('get-events error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load events' }),
    };
  }
};
