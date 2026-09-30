interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  /** Optional supporting line under the H1. */
  children?: React.ReactNode;
  /** Right-hand slot, bottom-aligned with the H1 on wide screens. */
  aside?: React.ReactNode;
}

/**
 * The interior-page header: mono eyebrow, Anton H1 16px below, pm-rule bottom
 * border. Every paper-ground page (Events, Apparel, FAQ, Contact) opens with it
 * so the H1 lands at the same height on each one.
 */
export function PageHeader({ eyebrow, title, children, aside }: PageHeaderProps) {
  return (
    <header className="border-b border-pm-rule">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-ink">{eyebrow}</span>
          <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4 text-balance">
            {title}
          </h1>
          {children && <div className="text-[15px] leading-[1.6] text-pm-ink mt-4 max-w-[60ch]">{children}</div>}
        </div>
        {aside}
      </div>
    </header>
  );
}
