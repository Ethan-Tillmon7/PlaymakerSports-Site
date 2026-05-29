import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tournaments } from '../../data/events';
import { formatDateRange } from '../../lib/dates';

export function EventTicker() {
  const [paused, setPaused] = useState(false);
  const items = tournaments.filter((t) => t.published);

  if (items.length === 0) return null;

  return (
    <Link
      to="/events"
      aria-label="Upcoming events ticker"
      className="block border-t border-white/[0.07] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-stretch h-[52px]">
        {/* "Upcoming" label */}
        <div className="flex-shrink-0 flex items-center px-5 bg-pm-yellow border-r-2 border-[#c9a628]">
          <span className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-pm-black font-bold">
            Upcoming
          </span>
        </div>

        {/* Scrolling track — items rendered twice for seamless loop */}
        <div className="flex-1 overflow-hidden flex items-center">
          <div
            className="flex animate-ticker motion-reduce:animate-none"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
          >
            {[...items, ...items].map((t, i) => {
              const { lines } = formatDateRange(t.startDate, t.endDate);
              const dateLabel = lines.join(' ');
              return (
                <div
                  key={`${t.id}-${i}`}
                  className="inline-flex items-center gap-3 px-9 h-[52px] border-r border-white/[0.07] flex-shrink-0"
                  aria-hidden={i >= items.length ? true : undefined}
                >
                  <span className="text-pm-yellow text-[7px]">◆</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-pm-yellow">
                    {dateLabel}
                  </span>
                  <span className="text-white/15 text-xs">·</span>
                  <span className="font-display text-[13px] uppercase text-white/85">
                    {t.location}
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
