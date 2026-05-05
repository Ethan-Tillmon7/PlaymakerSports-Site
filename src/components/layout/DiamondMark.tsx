export function DiamondMarkSymbol() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="pm-diamond" viewBox="0 0 100 100">
          <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="miter" strokeLinecap="square">
            <path d="M50 8 L92 50 L50 92 L8 50 Z" />
            <path d="M50 24 L76 50 L50 76 L24 50 Z" />
            <path d="M50 8 L50 24" />
            <path d="M50 76 L50 92" />
            <path d="M8 50 L24 50" />
            <path d="M76 50 L92 50" />
          </g>
        </symbol>
        <symbol id="jersey" viewBox="0 0 200 240">
          <path d="M50 30 L80 18 Q100 26 120 18 L150 30 L182 56 L168 88 L148 78 L148 218 Q148 224 142 224 L58 224 Q52 224 52 218 L52 78 L32 88 L18 56 Z" />
        </symbol>
      </defs>
    </svg>
  );
}

interface DiamondProps {
  className?: string;
}

export function Diamond({ className = 'w-7 h-7' }: DiamondProps) {
  return (
    <svg className={className}>
      <use href="#pm-diamond" />
    </svg>
  );
}
