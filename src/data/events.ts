export interface Tournament {
  id: string;
  startDate: string;  // ISO: "2026-05-09"
  endDate: string;    // ISO: "2026-05-11" — equals startDate for single-day events
  city: string;       // City, State — no venue/park detail
}
