export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonStyle {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Layout only (margins, width). Size and color come from the props. */
  className?: string;
}

// Chunky "equipment" buttons: a 2px bottom lip instead of a shadow that hardens
// on hover, and a press-in on pointer-down (DESIGN.md → Buttons). The transition
// lists real properties: `colors` is not one, and silently animates nothing.
const BASE =
  'font-display uppercase tracking-[0.04em] select-none inline-flex items-center justify-center rounded-xl border-b-2 transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97]';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-pm-yellow text-pm-black hover:bg-pm-yellow-deep border-pm-yellow-deep hover:border-pm-black',
  secondary: 'bg-white text-pm-black hover:bg-pm-paper-2 border border-pm-rule hover:border-pm-black',
  /** The secondary action on a black ground (hero, About): no fill, a white/30 lip. */
  ghost: 'bg-transparent text-white hover:bg-white/10 border-white/30 hover:border-white/60',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-[14px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-11 px-6 text-[16px]',
  xl: 'h-12 px-7 text-[18px]',
};

/** Class string for a site button. For plain <a> tags; prefer <Button>/<ButtonLink>. */
export function buttonClass({ variant = 'primary', size = 'lg', className }: ButtonStyle = {}): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}
