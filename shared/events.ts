/** The sports the site groups events by, in display order. */
export const SPORTS = ['baseball', 'softball', 'soccer'] as const;
export type Sport = (typeof SPORTS)[number];

/**
 * One published event as the site sees it: the public projection of a row in
 * the Events sheet tab, or of the dashboard's `site_public_events()` RPC when
 * EVENTS_SOURCE=supabase. Dates are ISO YYYY-MM-DD; endDate === startDate for a
 * single-day event. city is "City, ST" with no venue detail.
 */
export interface PublicEvent {
  id: string;
  startDate: string;
  endDate: string;
  city: string;
  /**
   * Set on every event from the dashboard (rows with an unknown sport are
   * skipped server-side). Absent on Sheet rows: the tab has no sport column.
   */
  sport?: Sport;
}
