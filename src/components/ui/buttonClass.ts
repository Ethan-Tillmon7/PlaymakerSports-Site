export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonStyle {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Layout only (margins, width). Size and color come from the props. */
  className?: string;
}

// Chunky "equipment" buttons: a 2px bottom lip instead of a shadow that hardens
// to black on hover, and a slight press on tap (DESIGN.md → Buttons).
const BASE =
  'font-display uppercase tracking-[0.04em] inline-flex items-center justify-center rounded-xl border-b-2 hover:border-pm-black transition-[colors,transform] duration-150 active:scale-[0.97]';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-pm-yellow text-pm-black hover:bg-pm-yellow-deep border-pm-yellow-deep',
  secondary: 'bg-white text-pm-black hover:bg-pm-paper-2 border border-pm-rule',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[14px]',
  md: 'h-10 px-5 text-[15px]',
  lg: 'h-11 px-6 text-[16px]',
  xl: 'h-12 px-7 text-[18px]',
};

/** Class string for a site button. For plain <a> tags; prefer <Button>/<ButtonLink>. */
export function buttonClass({ variant = 'primary', size = 'lg', className }: ButtonStyle = {}): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}
