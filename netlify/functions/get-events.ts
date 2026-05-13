import type { Handler } from '@netlify/functions';
import { getSheetsClient, SHEET_ID } from './_sheets';

interface Tournament {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
  organizer: string;
  location: string;
  ageGroups?: string;
  sourceUrl?: string;
  notes?: string;
  attending: boolean;
  published: boolean;
}

export const handler: Handler = async () => {
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Events!A6:K',
    });

    const rows = res.data.values ?? [];
    const tournaments: Tournament[] = rows
      .filter((row) => row[1] && row[10] === 'TRUE')
      .map((row) => ({
        id: String(row[0] ?? ''),
        startDate: String(row[1] ?? ''),
        endDate: String(row[2] ?? ''),
        name: String(row[3] ?? ''),
        organizer: String(row[4] ?? ''),
        location: String(row[5] ?? ''),
        ageGroups: row[6] ? String(row[6]) : undefined,
        sourceUrl: row[7] ? String(row[7]) : undefined,
        notes: row[8] ? String(row[8]) : undefined,
        attending: row[9] === 'TRUE',
        published: true,
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
