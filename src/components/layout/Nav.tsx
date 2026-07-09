import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Apparel', to: '/apparel' },
  { label: 'Events', to: '/events' },
  { label: 'FAQ', to: '/faq' },
];

export function Nav() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-[10px] z-30 w-[calc(100%-20px)] max-w-[800px] mx-auto bg-white rounded-[28px] shadow-[0_2px_8px_-2px_rgba(245,200,66,0.30)]">

      {/* ── Main row ── */}
      <nav className="h-16 flex items-center px-5 sm:px-6">

        {/* Left — desktop: nav links | mobile: hamburger */}
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            className={`lg:hidden -ml-1 flex items-center justify-center w-11 h-11 rounded-lg hover:bg-pm-paper-2 transition-colors duration-150 ${mobileOpen ? 'bg-pm-paper-2' : ''}`}
          >
            <svg className="w-5 h-5 text-pm-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          <ul className="hidden lg:flex items-center gap-1 font-display uppercase text-[14px] tracking-[0.04em]">
            {navLinks.map(({ label, to }) => {
              const active = pathname === to || (to !== '/' && pathname.startsWith(to));
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`px-3 py-1.5 rounded-lg transition-[colors,background-color] duration-200 inline-block ${
                      active
                        ? 'text-pm-black bg-pm-paper-2'
                        : 'text-pm-ink hover:text-pm-black hover:bg-pm-paper-2'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Center — logo */}
        <Link to="/" aria-label="Playmaker Sports home" className="shrink-0 mx-4 lg:mx-6">
          <span className="bg-pm-yellow inline-flex items-baseline gap-1 px-2 py-1 font-display text-[20px] lg:text-[22px] leading-none uppercase tracking-[0.005em] rounded-lg">
            <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
          </span>
        </Link>

        {/* Right — contact CTA */}
        <div className="flex-1 flex items-center justify-end">
          <Link
            to="/contact"
            className="font-display uppercase text-[13px] lg:text-[14px] tracking-[0.04em] bg-pm-yellow text-pm-black px-4 lg:px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl whitespace-nowrap"
          >
            Contact
          </Link>
        </div>

      </nav>

      {/* ── Mobile dropdown — absolute overlay so it never pushes page content down ── */}
      <div
        className={`lg:hidden absolute top-full inset-x-0 mt-2 origin-top transition-[opacity,transform] duration-200 ease-out ${
          mobileOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col py-2 px-3 gap-0.5 font-display uppercase text-[14px] tracking-[0.04em] bg-white rounded-[20px] shadow-[0_8px_24px_-6px_rgba(17,17,17,0.18)]">
          {navLinks.map(({ label, to }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-[colors,background-color] duration-200 ${
                    active
                      ? 'text-pm-black bg-pm-paper-2'
                      : 'text-pm-ink hover:text-pm-black hover:bg-pm-paper-2'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
}
