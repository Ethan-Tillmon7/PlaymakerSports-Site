export type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyle {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Layout only (margins, width). Size and color come from the props. */
  className?: string;
}

// The button rules live in components.css (`.btn`): a 1px border, a small soft
// shadow, an Inter 600 label and a press-in on pointer-down. Yellow `primary`
// is the page's one main action; `dark` is the nav's; `secondary` is the white
// outline; `ghost` is the secondary action on a black ground.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  secondary: 'btn-outline',
  ghost: 'btn-ghost',
};

// 36 / 40 / 44px tall. On touch screens every size is at least 44px.
const SIZES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

/** Class string for a site button. For plain <a> tags; prefer <Button>/<ButtonLink>. */
export function buttonClass({ variant = 'primary', size = 'md', className }: ButtonStyle = {}): string {
  return ['btn', VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}
