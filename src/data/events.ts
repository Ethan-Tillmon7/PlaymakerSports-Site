export interface Tournament {
  id: string;
  startDate: string;  // ISO: "2026-05-09"
  endDate: string;    // ISO: "2026-05-11" — equals startDate for single-day events
  city: string;       // City, State — no venue/park detail
}

export const tournaments: Tournament[] = [
  {
    id: '2026-05-09-vinny-castro-usssa-fl',
    startDate: '2026-05-09',
    endDate: '2026-05-09',
    city: 'New Smyrna, FL',
  },
  {
    id: '2026-05-23-vinny-castro-usssa-fl',
    startDate: '2026-05-23',
    endDate: '2026-05-23',
    city: 'Oviedo, FL',
  },
  {
    id: '2026-06-21-jimmy-greer-alexandria-la',
    startDate: '2026-06-21',
    endDate: '2026-06-21',
    city: 'Alexandria, LA',
  },
  {
    id: '2026-07-17-lafayette-little-league',
    startDate: '2026-07-17',
    endDate: '2026-07-17',
    city: 'Lafayette, LA',
  },
];
