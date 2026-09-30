import type { EventDateParts } from '../eventDates';

export function DateTile({ parts, live = false }: { parts: EventDateParts | null; live?: boolean }) {
  // A live event inverts the tile: the one black date on a page of yellow ones.
  const tone = live
    ? 'bg-pm-black text-pm-yellow border-pm-black'
    : 'bg-pm-yellow text-pm-black border-pm-yellow-deep';
  return (
    <div className={`${tone} w-16 sm:w-[72px] aspect-square flex flex-col items-center justify-center leading-none border-b-2 rounded-lg shrink-0`}>
      {parts ? (
        <>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{parts.month}</span>
          <span
            className={`font-display tabular-nums mt-1 ${
              parts.days.includes('–') ? 'text-[20px] sm:text-[23px]' : 'text-[26px] sm:text-[30px]'
            }`}
          >
            {parts.days}
          </span>
        </>
      ) : (
        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-center">Date TBA</span>
      )}
    </div>
  );
}
