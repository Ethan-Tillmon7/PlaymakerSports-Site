export interface Tournament {
  id: string;
  startDate: string;       // ISO: "2026-05-09"
  endDate: string;         // ISO: "2026-05-11" — equals startDate for single-day events
  name: string;
  organizer: string;
  location: string;
  ageGroups?: string;
  sourceUrl?: string;
  notes?: string;
  attending: boolean;
  published: boolean;
}

export const tournaments: Tournament[] = [
  {
    id: '2026-05-09-vinny-castro-usssa-fl',
    startDate: '2026-05-09',
    endDate: '2026-05-09',
    name: "CFL USSSA Mother's Day Bash",
    organizer: 'Vinny Castro (USSSA FL)',
    location: 'New Smyrna / Apopka, FL',
    sourceUrl: 'https://flbaseball.usssa.com/event/cfl-usssa-mothers-day-bash-3/',
    attending: true,
    published: true,
  },
  {
    id: '2026-05-23-vinny-castro-usssa-fl',
    startDate: '2026-05-23',
    endDate: '2026-05-23',
    name: 'CFL USSSA Memorial Day Classic',
    organizer: 'Vinny Castro (USSSA FL)',
    location: 'Oviedo / Ocoee, FL',
    sourceUrl: 'https://flbaseball.usssa.com/event/cfl-usssa-memorial-day-classic-2/',
    attending: true,
    published: true,
  },
  {
    id: '2026-06-21-jimmy-greer-alexandria-la',
    startDate: '2026-06-21',
    endDate: '2026-06-21',
    name: 'Battle at the Red',
    organizer: 'Jimmy Greer (LA Fastpitch)',
    location: 'Alexandria, LA',
    sourceUrl: 'https://lafastpitch.usssa.com/event/battle-at-the-red-free-if-reg-by-2-1-26/',
    notes: 'Fastpitch',
    attending: true,
    published: true,
  },
  {
    id: '2026-07-17-lafayette-little-league',
    startDate: '2026-07-17',
    endDate: '2026-07-17',
    name: 'Lafayette Little League Baseball',
    organizer: 'Lafayette Little League (Peter)',
    location: 'Lafayette, LA',
    attending: true,
    published: true,
  },
];
