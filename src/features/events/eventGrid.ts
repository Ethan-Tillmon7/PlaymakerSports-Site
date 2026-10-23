import { SPORTS, type PublicEvent, type Sport } from '@shared/events';

/** The events card grid: 1 / 2 / 3 columns. Shared by the list, the past list and the skeleton. */
export const eventGridClass = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3';

export const SPORT_LABELS: Record<Sport, string> = {
  baseball: 'Baseball',
  softball: 'Softball',
  soccer: 'Soccer',
};

export interface SportGroup {
  /** null = events that carry no sport (the Sheet source). */
  sport: Sport | null;
  key: string;
  label: string;
  events: PublicEvent[];
}

/** True when at least one event carries a sport, i.e. the feed came from the dashboard. */
export function hasSports(events: PublicEvent[]): boolean {
  return events.some((t) => t.sport !== undefined);
}

/**
 * Buckets events by sport in the fixed order baseball, softball, soccer, each
 * bucket in feed (date) order. Sports with no events are left out rather than
 * shown empty. Any event without a sport lands in a trailing "Other events"
 * bucket so a mixed feed still shows everything; today that bucket only exists
 * while the Sheet is the source, and the page then skips sport headers entirely.
 */
export function groupBySport(events: PublicEvent[]): SportGroup[] {
  const buckets = new Map<Sport | null, PublicEvent[]>();
  for (const t of events) {
    const key = t.sport ?? null;
    const list = buckets.get(key);
    if (list) list.push(t);
    else buckets.set(key, [t]);
  }

  const groups: SportGroup[] = [];
  for (const sport of SPORTS) {
    const list = buckets.get(sport);
    if (list) groups.push({ sport, key: sport, label: SPORT_LABELS[sport], events: list });
  }
  const rest = buckets.get(null);
  if (rest) groups.push({ sport: null, key: 'other', label: 'Other events', events: rest });
  return groups;
}
