import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { useDismiss } from '@/hooks/useDismiss';
import { useOverNight } from '@/hooks/useNightGround';
import { contactTo } from '@/lib/contactLink';
import { Brand } from './Brand';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Apparel', to: '/apparel' },
  { label: 'Events', to: '/events' },
  { label: 'FAQ', to: '/faq' },
];

/**
 * The floating bar. Light glass over day sections, dark glass while a black
 * ground is behind it (see useNightGround). The glass rules are `.nav-pill`
 * in components.css.
 */
export function Nav() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const night = useOverNight();
  const contact = contactTo(pathname);

  // Esc or a tap anywhere outside the bar closes the mobile menu.
  useDismiss(rootRef, mobileOpen, () => {
    setMobileOpen(false);
    // Esc leaves focus inside a menu that is now hidden; hand it back to the button.
    if (rootRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
  });

  const isCurrent = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div ref={rootRef} className={night ? 'nav-pill night' : 'nav-pill'}>
      <nav className="h-14 flex items-center px-1.5 lg:px-4" aria-label="Primary">
        {/* Left: links on desktop, the menu button below lg */}
        <div className="flex-1 flex items-center">
          <button
            ref={toggleRef}
            type="button"
            data-nav-toggle
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-pm-paper-2 active:bg-pm-paper-2 transition-colors duration-150"
          >
            <svg
              className="w-5 h-5 text-pm-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {/* The three bars fold into a cross */}
              <path
                d="M4 6h16"
                className={`[transform-box:fill-box] origin-center transition-transform duration-200 ease-out ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`}
              />
              <path d="M4 12h16" className={`transition-opacity duration-150 ease-out ${mobileOpen ? 'opacity-0' : ''}`} />
              <path
                d="M4 18h16"
                className={`[transform-box:fill-box] origin-center transition-transform duration-200 ease-out ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`}
              />
            </svg>
          </button>

          <ul className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} aria-current={isCurrent(to) ? 'page' : undefined} className="nav-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" aria-label="Playmaker Sports home" className="shrink-0 mx-3 lg:mx-6">
          <Brand sizeClass="text-[17px] lg:text-[18px]" />
        </Link>

        <div className="flex-1 flex items-center justify-end">
          <ButtonLink to={contact} variant="dark" size="sm">
            Contact
          </ButtonLink>
        </div>
      </nav>

      {/* An overlay, so it never pushes the page down. `hidden` keeps it out of
          the tab order; components.css turns that into a fade from the button. */}
      <div id="mobile-nav" hidden={!mobileOpen} className="lg:hidden absolute top-full -inset-x-px mt-2">
        <ul className="card flex flex-col p-1.5 gap-0.5">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                aria-current={isCurrent(to) ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                className="nav-link block"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link to={contact} onClick={() => setMobileOpen(false)} className="nav-link block">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
