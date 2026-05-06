import type { Handler } from '@netlify/functions';
import { getSheetsClient, SHEET_ID } from './_sheets';

interface Tournament {
  month: string;
  day: string;
  name: string;
  location: string;
  division: string;
  games: string;
  status: 'open' | 'almost' | 'full';
  spotsText: string;
}

export const handler: Handler = async () => {
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'EventSchedule!A2:H',
    });

    const rows = res.data.values ?? [];
    const tournaments: Tournament[] = rows
      .filter((row) => row[0])
      .map((row) => ({
        month: String(row[0] ?? ''),
        day: String(row[1] ?? ''),
        name: String(row[2] ?? ''),
        location: String(row[3] ?? ''),
        division: String(row[4] ?? ''),
        games: String(row[5] ?? ''),
        status: (['open', 'almost', 'full'].includes(row[6])
          ? row[6]
          : 'open') as Tournament['status'],
        spotsText: String(row[7] ?? ''),
      }));

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
