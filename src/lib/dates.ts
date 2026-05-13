const FMT_MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const FMT_DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' });

function parseISO(iso: string): Date {
  return new Date(iso + 'T00:00:00Z');
}

export function formatDateRange(startISO: string, endISO: string): { lines: string[] } {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  const startMonth = FMT_MONTH.format(start).toUpperCase();
  const startDay = FMT_DAY.format(start);
  const endMonth = FMT_MONTH.format(end).toUpperCase();
  const endDay = FMT_DAY.format(end);

  if (startISO === endISO) {
    return { lines: [startMonth, startDay] };
  }

  if (start.getUTCMonth() === end.getUTCMonth()) {
    return { lines: [startMonth, `${startDay} – ${endDay}`] };
  }

  return { lines: [`${startMonth} ${startDay} – ${endMonth} ${endDay}`] };
}
