import type { Handler, HandlerResponse } from '@netlify/functions';
import { z } from 'zod';
import { SPORTS, type PublicEvent, type Sport } from '../../shared/events';
import { json } from '../lib/http';
import { getSheetsClient, SHEET_ID } from '../lib/sheets';
import { rpc } from '../lib/supabase';

/**
 * "New Smyrna / Apopka, FL" → "New Smyrna, FL". The dashboard can also append
 * a venue as "City, ST · Venue"; that suffix is dropped first so the state is
 * still found at the end.
 */
function extractCity(location: string): string {
  const head = location.split(/\s*·\s*/)[0].trim();
  const stateMatch = head.match(/,\s*([A-Z]{2})\s*$/);
  const state = stateMatch ? stateMatch[1] : '';
  const cityPart = head.split(/\s*[/,]/)[0].trim();
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

/** Blank, unreadable, or before-start end dates collapse to a single-day event. */
function toEndDate(raw: unknown, startDate: string): string {
  const parsedEnd = toISODate(raw);
  return parsedEnd && parsedEnd >= startDate ? parsedEnd : startDate;
}

const SPORT_SET: ReadonlySet<string> = new Set(SPORTS);

/** Strict whitelist, case-insensitive. Anything else is null and the row is skipped. */
function toSport(raw: unknown): Sport | null {
  const s = String(raw ?? '').trim().toLowerCase();
  return SPORT_SET.has(s) ? (s as Sport) : null;
}

function byStartDate(events: PublicEvent[]): PublicEvent[] {
  return events.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

// ── Source: Google Sheet (EVENTS_SOURCE unset or "sheet") ──

async function readSheet(): Promise<PublicEvent[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Events!A6:K',
  });

  const rows = res.data.values ?? [];
  const events: PublicEvent[] = [];
  rows.forEach((row, i) => {
    const published = String(row[10] ?? '').trim().toUpperCase() === 'TRUE';
    const location = String(row[5] ?? '').trim();
    if (!published || !location || !row[1]) return;

    const startDate = toISODate(row[1]);
    if (!startDate) {
      console.warn(`get-events: skipping sheet row ${i + 6}, unreadable startDate "${row[1]}"`);
      return;
    }

    events.push({
      // A blank id would collide as a React key; fall back to something unique.
      id: String(row[0] ?? '').trim() || `row-${i + 6}`,
      startDate,
      endDate: toEndDate(row[2], startDate),
      city: extractCity(location),
    });
  });
  return byStartDate(events);
}

// ── Source: dashboard Supabase (EVENTS_SOURCE=supabase) ──

/**
 * One row of `site_public_events()` (PMS-Docs 06-Repo-Exchange/04, item 16).
 * Everything is nullable text on the dashboard side, so the shape is loose
 * here and the row-level rules below decide what ships.
 */
const rpcRow = z.object({
  id: z.union([z.string(), z.number()]).nullish(),
  start_date: z.string().nullish(),
  end_date: z.string().nullish(),
  location: z.string().nullish(),
  sport: z.string().nullish(),
});

async function readSupabase(): Promise<PublicEvent[]> {
  const data = await rpc('site_public_events');
  if (!Array.isArray(data)) throw new Error('site_public_events did not return an array');

  const events: PublicEvent[] = [];
  data.forEach((raw: unknown, i) => {
    const parsed = rpcRow.safeParse(raw);
    if (!parsed.success) {
      console.warn(`get-events: skipping rpc row ${i + 1}, unexpected shape`);
      return;
    }
    const row = parsed.data;
    const where = `rpc row ${i + 1}${row.id != null && row.id !== '' ? ` (id ${row.id})` : ''}`;

    const location = (row.location ?? '').trim();
    if (!location) {
      console.warn(`get-events: skipping ${where}, blank location`);
      return;
    }
    const startDate = toISODate(row.start_date);
    if (!startDate) {
      console.warn(`get-events: skipping ${where}, unreadable start_date "${row.start_date ?? ''}"`);
      return;
    }
    // Same skip-rather-than-ship rule as dates: a sport the page can't bucket
    // never reaches the client.
    const sport = toSport(row.sport);
    if (!sport) {
      console.warn(`get-events: skipping ${where}, unknown sport "${row.sport ?? ''}"`);
      return;
    }

    events.push({
      id: String(row.id ?? '').trim() || `rpc-${i + 1}`,
      startDate,
      endDate: toEndDate(row.end_date, startDate),
      city: extractCity(location),
      sport,
    });
  });
  return byStartDate(events);
}

export const handler: Handler = async (): Promise<HandlerResponse> => {
  try {
    // Unset means the Sheet, so a deploy without the var behaves as before.
    // Any other value is a config typo and fails loudly rather than quietly
    // serving the retired Sheet.
    const source = (process.env.EVENTS_SOURCE ?? '').trim().toLowerCase() || 'sheet';
    let events: PublicEvent[];
    if (source === 'sheet') events = await readSheet();
    else if (source === 'supabase') events = await readSupabase();
    else throw new Error(`EVENTS_SOURCE must be "sheet" or "supabase", got "${source}"`);

    // Browsers always revalidate; Netlify's CDN serves a cached copy for 2 min
    // (and a stale one while it refetches). A QR-code rush at a tournament then
    // costs one upstream read, not one per phone, and stays under the API quota.
    return json(200, events, {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    });
  } catch (err) {
    console.error('get-events error:', err);
    return json(500, { error: 'Failed to load events' }, { 'Cache-Control': 'no-store' });
  }
};
