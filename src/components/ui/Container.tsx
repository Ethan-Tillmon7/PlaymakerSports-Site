import type { ElementType, ReactNode } from 'react';

interface ContainerProps {
  /** Element to render; defaults to div. */
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

/** The site's content column: 1480px max, centered, 24px/40px side gutters. */
export function Container({ as: Tag = 'div', className, id, children }: ContainerProps) {
  const classes = ['max-w-[1480px] mx-auto px-6 sm:px-10', className].filter(Boolean).join(' ');
  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}
