interface BrandProps {
  /** Tailwind text-size classes for the PLAY/MAKER block; SPORTS scales with `large`. */
  sizeClass: string;
  /** The footer's large lockup: wider gap, bigger SPORTS line. */
  large?: boolean;
}

/** The mark: the PLAY/MAKER block with SPORTS set wide underneath, as on the tent. */
export function Brand({ sizeClass, large = false }: BrandProps) {
  return (
    <span className={large ? 'brand brand-lg' : 'brand'}>
      <span className={`lockup ${sizeClass}`}>
        <span className="play">Play</span>
        <span className="maker">maker</span>
      </span>
      <span className="brand-sports">Sports</span>
    </span>
  );
}
