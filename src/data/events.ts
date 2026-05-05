export interface Tournament {
  month: string;
  day: string;
  name: string;
  location: string;
  division: string;
  games: string;
  status: 'open' | 'almost' | 'full';
  spotsText: string;
}

export const tournaments: Tournament[] = [
  {
    month: 'May', day: '18',
    name: 'Bayou Classic 8U',
    location: 'Lafayette, LA', division: 'Coach-Pitch · 8U', games: '3-game guarantee',
    status: 'open', spotsText: 'Open',
  },
  {
    month: 'Jun', day: '07',
    name: 'Cajun Showdown 10U',
    location: 'Broussard, LA', division: 'Kid-Pitch · 10U', games: '4-game min',
    status: 'almost', spotsText: 'Filling fast',
  },
  {
    month: 'Jun', day: '21',
    name: 'Sugarcane Slam 12U',
    location: 'New Iberia, LA', division: 'Kid-Pitch · 12U', games: '3-game guarantee',
    status: 'open', spotsText: 'Open',
  },
  {
    month: 'Jul', day: '12',
    name: 'Gulf Coast Cup 14U',
    location: 'Lake Charles, LA', division: 'Kid-Pitch · 14U', games: '5-game minimum',
    status: 'open', spotsText: 'Open',
  },
];
