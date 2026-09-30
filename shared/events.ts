/**
 * One published event as the site sees it: the public projection of a row in
 * the Events sheet tab. Dates are ISO YYYY-MM-DD; endDate === startDate for a
 * single-day event. city is "City, ST" with no venue detail.
 */
export interface PublicEvent {
  id: string;
  startDate: string;
  endDate: string;
  city: string;
}
