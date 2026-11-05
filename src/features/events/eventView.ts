import { SPORTS, type PublicEvent, type Sport } from '@shared/events';
import type { RequestFailure } from '@/lib/http';
import { eventDateParts, formatDateRange, type EventStatus } from './eventDates';

// How one event reads on screen. Everything here is derived from PublicEvent:
// two dates, a "City, ST" string and (from the dashboard feed only) a sport.

export const SPORT_LABELS: Record<Sport, string> = {
  baseball: 'Baseball',
  softball: 'Softball',
  soccer: 'Soccer',
};

const FMT_MONTH_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const FMT_DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' });

/** "Fort Walton Beach, FL" → ["Fort Walton Beach", "FL"]. No comma: the whole string, no state. */
export function splitCity(city: string): [string, string | null] {
  const i = city.lastIndexOf(',');
  return i === -1 ? [city.trim(), null] : [city.slice(0, i).trim(), city.slice(i + 1).trim()];
}

/** "Nov 7–8", "Dec 5", or "Oct 31 – Nov 1" across a month boundary. */
export function stopDate(t: PublicEvent): string {
  const start = new Date(`${t.startDate}T00:00:00Z`);
  const end = new Date(`${t.endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return 'Date TBA';
  if (Number.isNaN(end.getTime()) || t.endDate === t.startDate) return FMT_MONTH_DAY.format(start);
  return start.getUTCMonth() === end.getUTCMonth()
    ? `${FMT_MONTH_DAY.format(start)}–${FMT_DAY.format(end)}`
    : `${FMT_MONTH_DAY.format(start)} – ${FMT_MONTH_DAY.format(end)}`;
}

/**
 * "Baseball · LA · Sat–Sun". The sport is only there on the dashboard feed.
 * An event that runs across a month boundary also spells its dates out
 * ("OCT 31 – NOV 1"): the tile's "31–1" alone is ambiguous.
 */
export function metaLine(t: PublicEvent, { weekdays = true }: { weekdays?: boolean } = {}): string {
  const [, state] = splitCity(t.city);
  const days = weekdays ? eventDateParts(t.startDate, t.endDate)?.weekdays : null;
  const crossesMonth = t.startDate.slice(0, 7) !== t.endDate.slice(0, 7);
  const range = weekdays && crossesMonth ? formatDateRange(t.startDate, t.endDate).lines.join(' ') : null;
  return [t.sport ? SPORT_LABELS[t.sport] : null, state, days, range].filter(Boolean).join(' · ');
}

/** "Happening now", "Tomorrow", "In 3 days". Null more than six days out. */
export function statusLabel(status: EventStatus): string | null {
  if (!status) return null;
  if (status.kind === 'live') return 'Happening now';
  return status.days === 1 ? 'Tomorrow' : `In ${status.days} days`;
}

/** Events that haven't ended, in feed (date) order. */
export function upcomingOf(events: PublicEvent[], today: string): PublicEvent[] {
  return events.filter((t) => t.endDate >= today);
}

export type SportFilter = 'all' | Sport;

/**
 * The sport tabs for a list of events, with counts, or null when there is
 * nothing to filter by: the Sheet feed carries no sport at all, and a feed
 * with a single sport would give "All" and one identical tab.
 */
export function sportTabs(events: PublicEvent[]): { value: SportFilter; label: string; count: number }[] | null {
  const present = SPORTS.filter((sport) => events.some((t) => t.sport === sport));
  if (present.length < 2) return null;
  return [
    { value: 'all', label: 'All', count: events.length },
    ...present.map((sport) => ({
      value: sport,
      label: SPORT_LABELS[sport],
      count: events.filter((t) => t.sport === sport).length,
    })),
  ];
}

export function bySport(events: PublicEvent[], filter: SportFilter): PublicEvent[] {
  return filter === 'all' ? events : events.filter((t) => t.sport === filter);
}

export const failureCopy: Record<RequestFailure, string> = {
  offline: "You're offline. Once you have signal again, try reloading the schedule.",
  timeout: 'The schedule is taking too long to load. The connection may be weak, so give it another try.',
  server: "We couldn't load the schedule just now. Try again in a moment.",
};
