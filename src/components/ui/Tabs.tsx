import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  /** How many items are behind the tab. */
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  /** `direction` is -1 when the new tab is to the left of the old one, else 1. */
  onChange: (value: T, direction: 1 | -1) => void;
  /** Names the tablist for screen readers, e.g. "Filter by sport". */
  label: string;
  /** Prefix for each tab's id (`<idPrefix>-<value>`), so a panel can point back with aria-labelledby. */
  idPrefix: string;
  /** id of the panel the tabs control. */
  controls: string;
  className?: string;
}

// The effect only measures the DOM; on the server it would be a no-op.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * A segmented tablist. The selected state is one white thumb that glides
 * between tabs instead of jumping. The thumb is added after mount, so the
 * prerendered tabs still show a selected tab on their own.
 */
export function Tabs<T extends string>({ items, value, onChange, label, idPrefix, controls, className }: TabsProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; width: number } | null>(null);
  // The first placement is not a move, so it doesn't animate.
  const [ready, setReady] = useState(false);
  const selected = items.findIndex((item) => item.value === value);

  useIsomorphicLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const place = () => {
      const on = group.querySelector<HTMLElement>('[aria-selected="true"]');
      if (on) setThumb({ x: on.offsetLeft, width: on.offsetWidth });
    };
    place();
    // Tab widths change with the viewport and when the webfont lands.
    const observer = new ResizeObserver(place);
    observer.observe(group);
    void document.fonts?.ready.then(place);
    return () => observer.disconnect();
  }, [value, items.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const pick = (index: number) => {
    if (index !== selected) onChange(items[index].value, index < selected ? -1 : 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + items.length) % items.length;
    pick(next);
    groupRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="tablist"
      aria-label={label}
      className={['tabs', thumb ? 'has-thumb' : '', ready ? 'ready' : '', className].filter(Boolean).join(' ')}
    >
      {thumb && (
        <span
          aria-hidden="true"
          className="tabs-thumb"
          style={{ width: thumb.width, transform: `translateX(${thumb.x}px)` }}
        />
      )}
      {items.map((item, i) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          id={`${idPrefix}-${item.value}`}
          aria-selected={item.value === value}
          aria-controls={controls}
          tabIndex={item.value === value ? 0 : -1}
          className="tab"
          onClick={() => pick(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {item.label}
          {item.count !== undefined && (
            <>
              {' '}
              <span className="tab-n">{item.count}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}
