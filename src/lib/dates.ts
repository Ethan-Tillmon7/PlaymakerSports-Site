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
