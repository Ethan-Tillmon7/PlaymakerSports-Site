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
