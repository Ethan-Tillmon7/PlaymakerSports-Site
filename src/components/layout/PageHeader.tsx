import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { NightGround } from './NightGround';

interface PageHeaderProps {
  /** The page's name in the breadcrumb, e.g. "Events". */
  breadcrumb: string;
  title: ReactNode;
  /** The one-line intro under the H1. */
  lede?: ReactNode;
  /** More content in the title column, under the lede (About's tagline and facts). */
  children?: ReactNode;
  /** A right-hand column on desktop; under the title on phones (Contact's form, About's photo). */
  aside?: ReactNode;
  /** Sits under the title column on desktop and after `aside` on phones (Contact's "What to include"). */
  below?: ReactNode;
  /** Width of the `aside` column: a form card, or a wider photo centred on the title. */
  asideAs?: 'form' | 'photo';
}

const ASIDE_GRID = {
  form: 'grid gap-9 lg:gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(400px,500px)] lg:grid-rows-[auto_1fr]',
  photo: 'grid gap-10 lg:gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-center',
} as const;

/**
 * The header every page but home opens on: the night ground, a breadcrumb, the
 * Anton H1 and a one-line intro, closed by the blue awning stripe where night
 * turns to day. The H1 lands at the same height on every page.
 */
export function PageHeader({ breadcrumb, title, lede, children, aside, below, asideAs = 'form' }: PageHeaderProps) {
  const heading = (
    <div className="min-w-0">
      <nav className="crumbs enter" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{breadcrumb}</span>
      </nav>
      <h1 id="page-title" className="page-h1 mt-3 enter">
        {title}
      </h1>
      {lede && <p className={`page-lede mt-5 enter enter-2 ${aside ? 'max-w-[540px]' : ''}`}>{lede}</p>}
      {children}
    </div>
  );

  return (
    <>
      <NightGround variant="page" labelledBy="page-title">
        <Container className={`relative pt-8 pb-12 lg:pt-12 ${asideAs === 'photo' && aside ? 'lg:pb-20' : 'lg:pb-16'}`}>
          {aside ? (
            <div className={ASIDE_GRID[asideAs]}>
              {heading}
              <div className={`min-w-0 enter enter-2 ${asideAs === 'form' ? 'lg:col-start-2 lg:row-start-1 lg:row-span-2' : ''}`}>
                {aside}
              </div>
              {below && <div className="min-w-0 max-w-[540px] lg:self-end enter enter-2">{below}</div>}
            </div>
          ) : (
            heading
          )}
        </Container>
      </NightGround>
      <div className="awning" aria-hidden="true" />
    </>
  );
}
