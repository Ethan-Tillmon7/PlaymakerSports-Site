const FMT_MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const FMT_DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' });

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseISO(iso: string): Date | null {
  if (!ISO_DATE.test(iso)) return null;
  const d = new Date(iso + 'T00:00:00Z');
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Today's date as YYYY-MM-DD in the visitor's own timezone. Don't use
 * toISOString() for this: it's UTC, so after 7pm in Louisiana it already
 * returns tomorrow and an event's last day drops out of "upcoming".
 */
export function localISODate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateRange(startISO: string, endISO: string): { lines: string[] } {
  const start = parseISO(startISO);
  // A missing or malformed end date means a single-day event, not a crash:
  // Intl.DateTimeFormat.format throws a RangeError on an Invalid Date.
  const end = parseISO(endISO) ?? start;
  if (!start || !end) return { lines: ['Date TBA'] };

  const startMonth = FMT_MONTH.format(start).toUpperCase();
  const startDay = FMT_DAY.format(start);
  const endMonth = FMT_MONTH.format(end).toUpperCase();
  const endDay = FMT_DAY.format(end);

  if (start.getTime() === end.getTime()) {
    return { lines: [startMonth, startDay] };
  }

  if (start.getUTCMonth() === end.getUTCMonth()) {
    return { lines: [startMonth, `${startDay} – ${endDay}`] };
  }

  return { lines: [`${startMonth} ${startDay} – ${endMonth} ${endDay}`] };
}

const FMT_MONTH_LONG = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });
const FMT_WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });

export interface EventDateParts {
  /** Groups events under the month they start in, e.g. "2026-10". */
  monthKey: string;
  /** "October"; carries the year only when it isn't the current one. */
  monthLabel: string;
  /** Tile top line: "OCT", or "OCT–NOV" when the event spans months. */
  month: string;
  /** Tile number: "3", "24–25", or "31–1". */
  days: string;
  /** "Sat" or "Sat–Sun". */
  weekdays: string;
}

export function eventDateParts(startISO: string, endISO: string, currentYear = new Date().getFullYear()): EventDateParts | null {
  const start = parseISO(startISO);
  const end = parseISO(endISO) ?? start;
  if (!start || !end) return null;

  const year = start.getUTCFullYear();
  const sameDay = start.getTime() === end.getTime();
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const startMonth = FMT_MONTH.format(start).toUpperCase();

  return {
    monthKey: startISO.slice(0, 7),
    monthLabel: year === currentYear ? FMT_MONTH_LONG.format(start) : `${FMT_MONTH_LONG.format(start)} ${year}`,
    month: sameMonth ? startMonth : `${startMonth}–${FMT_MONTH.format(end).toUpperCase()}`,
    days: sameDay ? FMT_DAY.format(start) : `${FMT_DAY.format(start)}–${FMT_DAY.format(end)}`,
    weekdays: sameDay ? FMT_WEEKDAY.format(start) : `${FMT_WEEKDAY.format(start)}–${FMT_WEEKDAY.format(end)}`,
  };
}
