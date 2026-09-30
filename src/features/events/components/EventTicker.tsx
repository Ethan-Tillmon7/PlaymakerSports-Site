import { useState } from 'react';
import { Link } from 'react-router-dom';
import { localISODate } from '@/lib/dates';
import { formatDateRange } from '../eventDates';
import { useEvents } from '../useEvents';

// The loop translates the track by -50%, so each half has to be wider than the
// strip or a gap scrolls into view. ~8 items clears a 1480px container.
const MIN_ITEMS_PER_HALF = 8;

export function EventTicker() {
  const [paused, setPaused] = useState(false);
  // The ticker is optional garnish on the hero: on any failure it stays hidden.
  const result = useEvents();
  const today = localISODate();
  const events = result.status === 'success' ? result.events.filter((t) => t.endDate >= today) : [];

  // Hidden until upcoming events load (also covers SSR/prerender, where the
  // effect never runs and the API isn't reachable).
  if (events.length === 0) return null;

  const reps = Math.ceil(MIN_ITEMS_PER_HALF / events.length);
  const items = Array.from({ length: reps }, () => events).flat();

  return (
    <Link
      to="/events"
      aria-label={`See all ${events.length} upcoming ${events.length === 1 ? 'event' : 'events'}`}
      className="block border-t border-white/[0.07] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-stretch h-[52px]">
        {/* "Upcoming" label */}
        <div className="flex-shrink-0 flex items-center px-5 bg-pm-yellow border-r-2 border-[#c9a628]">
          <span className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-pm-black font-bold">
            Upcoming
          </span>
        </div>

        {/* Scrolling track — items rendered twice for a seamless loop */}
        <div className="flex-1 overflow-hidden flex items-center">
          <div
            className="flex animate-ticker motion-reduce:animate-none"
            // Keep the scroll speed constant (~3s per item) however many events there are.
            style={{ animationPlayState: paused ? 'paused' : 'running', animationDuration: `${items.length * 3}s` }}
          >
            {[...items, ...items].map((t, i) => {
              const { lines } = formatDateRange(t.startDate, t.endDate);
              const dateLabel = lines.join(' ');
              return (
                <div
                  key={`${t.id}-${i}`}
                  className="inline-flex items-center gap-3 px-9 h-[52px] border-r border-white/[0.07] flex-shrink-0"
                  aria-hidden={i >= events.length ? true : undefined}
                >
                  <span className="text-pm-yellow text-[7px]">◆</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-pm-yellow">
                    {dateLabel}
                  </span>
                  <span className="text-white/15 text-xs">·</span>
                  <span className="font-display text-[13px] uppercase text-white/85">
                    {t.city}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
