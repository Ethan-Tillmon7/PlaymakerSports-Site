import type { Handler, HandlerResponse } from '@netlify/functions';
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

/**
 * Jake types dates by hand, and Sheets returns the cell's *displayed* value, so
 * `2026-05-09` can come back as `5/9/2026` if the cell's format changed. Accept
 * both and normalize to ISO; anything else is null and the row is skipped
 * rather than shipped to a client that can't render it.
 */
function toISODate(raw: unknown): string | null {
  const s = String(raw ?? '').trim();
  let y: number, m: number, d: number;
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else if ((match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) {
    [m, d, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else {
    return null;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export const handler: Handler = async (): Promise<HandlerResponse> => {
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Events!A6:K',
    });

    const rows = res.data.values ?? [];
    const tournaments: PublicEvent[] = [];
    rows.forEach((row, i) => {
      const published = String(row[10] ?? '').trim().toUpperCase() === 'TRUE';
      const location = String(row[5] ?? '').trim();
      if (!published || !location || !row[1]) return;

      const startDate = toISODate(row[1]);
      if (!startDate) {
        console.warn(`get-events: skipping sheet row ${i + 6}, unreadable startDate "${row[1]}"`);
        return;
      }
      // Blank, unreadable, or before-start end dates collapse to a single-day event.
      const parsedEnd = toISODate(row[2]);
      const endDate = parsedEnd && parsedEnd >= startDate ? parsedEnd : startDate;

      tournaments.push({
        // A blank id would collide as a React key; fall back to something unique.
        id: String(row[0] ?? '').trim() || `row-${i + 6}`,
        startDate,
        endDate,
        city: extractCity(location),
      });
    });
    tournaments.sort((a, b) => a.startDate.localeCompare(b.startDate));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Browsers always revalidate; Netlify's CDN serves a cached copy for 2 min
        // (and a stale one while it refetches). A QR-code rush at a tournament then
        // costs one Sheets read, not one per phone, and stays under the API quota.
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
      body: JSON.stringify(tournaments),
    };
  } catch (err) {
    console.error('get-events error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: 'Failed to load events' }),
    };
  }
};
