interface IconProps {
  className?: string;
}

// One stroke weight for every icon. Size comes from the class (or from the
// component's own CSS, as with `.btn svg`).
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
} as const;

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} {...stroke}>
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg className={className} {...stroke}>
      <path d="M12 8v5M12 16.5v.5M12 3l9.5 17h-19Z" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} {...stroke}>
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
