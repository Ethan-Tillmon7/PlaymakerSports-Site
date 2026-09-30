import { eventGridClass } from '../eventGrid';

export function EventSkeleton() {
  return (
    <div role="status" aria-label="Loading the event schedule">
      <div className="h-8 w-40 bg-shimmer animate-shimmer rounded-lg mb-5" />
      <div className={eventGridClass}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-white border border-pm-rule rounded-xl">
            <div className="w-16 sm:w-[72px] aspect-square bg-shimmer animate-shimmer rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-shimmer animate-shimmer rounded w-3/5" />
              <div className="h-3 bg-shimmer animate-shimmer rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
