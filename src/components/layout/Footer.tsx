import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ArrowIcon } from '@/components/ui/icons';
import { contact } from '@/config/site';
import { useInView } from '@/hooks/useInView';
import { nightGroundRef } from '@/hooks/useNightGround';
import { contactTo } from '@/lib/contactLink';
import { Brand } from './Brand';

/**
 * Sign-off and footer in one black ground. The tagline is set to the full
 * width of the page column (`.signoff`, components.css) and ends every page
 * with the same line and the same way to reach out.
 */
export function Footer() {
  const { pathname } = useLocation();
  const [signoffRef, signoffInView] = useInView({ threshold: 0.25, rootMargin: '0px' });
  const reachOut = useMemo(() => contactTo(pathname), [pathname]);

  return (
    <footer
      ref={nightGroundRef}
      data-night
      className="bg-pm-black text-white on-night overflow-hidden pb-[max(20px,env(safe-area-inset-bottom))]"
    >
      <Container>
        <div className="signoff-wrap pt-14 lg:pt-20 pb-10 lg:pb-14 border-b border-white/15">
          <p ref={signoffRef} className={signoffInView ? 'signoff in' : 'signoff'}>
            <span className="l1">Made for the</span>{' '}
            <span className="l2">
              <mark>moment.</mark>
            </span>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-9 lg:mt-12">
            <p className="text-[clamp(16px,1.25vw,18px)] leading-[1.55] text-white/75 max-w-[44ch]">
              Tell us what you need and the Playmaker Sports team takes it from there.
            </p>
            <ButtonLink to={reachOut} size="lg" arrow className="self-start sm:self-auto">
              Reach out
            </ButtonLink>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 py-9 border-b border-white/15">
          <div className="shrink-0">
            <Link to="/" aria-label="Playmaker Sports home" className="inline-block">
              <Brand sizeClass="text-[40px] sm:text-[48px]" large />
            </Link>
            <p className="text-[14px] leading-[1.55] text-white/65 mt-5 max-w-[300px]">
              Custom team uniforms and game-day accessories, from the tent at the tournament. Lafayette, LA.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-14 gap-y-6">
            <div>
              <h2 className="foot-h">Events</h2>
              <ul>
                <li><Link to="/events" className="foot-link">Schedule</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="foot-h">Apparel</h2>
              <ul>
                <li><Link to="/apparel#uniforms" className="foot-link">Custom jerseys</Link></li>
                <li><Link to="/apparel#accessories" className="foot-link">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="foot-h">Company</h2>
              <ul>
                <li><Link to="/about" className="foot-link">About</Link></li>
                <li><Link to={reachOut} className="foot-link">Contact</Link></li>
                <li><Link to="/faq" className="foot-link">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 text-[13px] text-white/60">
          <div>© 2026 Playmaker Sports LLC · Lafayette, LA</div>
          {contact.instagram && (
            <a
              href={`https://www.instagram.com/${contact.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-11 hover:text-white active:text-white transition-colors duration-150"
            >
              Instagram <ArrowIcon className="w-3.5 h-3.5 -rotate-45" />
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
