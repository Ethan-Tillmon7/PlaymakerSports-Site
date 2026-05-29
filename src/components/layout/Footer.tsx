import { Link } from 'react-router-dom';
import { contact } from '../../data/contact';

export function Footer() {
  return (
    <footer className="bg-pm-black text-white px-6 sm:px-10 pt-8 pb-0">
      <div className="max-w-[1480px] mx-auto">

        {/* Row 1 — Brand + Nav */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-6 border-b border-white/15">

          {/* Brand */}
          <div className="shrink-0">
            <div className="bg-pm-yellow inline-flex items-baseline gap-1 px-3 py-1.5 font-display text-[28px] leading-none uppercase tracking-[0.005em] rounded-xl">
              <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
            </div>
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-pm-yellow/70 mt-2">
              Made for the Moment
            </p>
            <p className="text-[13px] leading-[1.5] text-white/60 mt-2 max-w-[220px]">
              Sports merch and custom apparel, built in Lafayette.
            </p>
          </div>

          {/* Nav — collapsed wrapping flex */}
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            <div>
              <h4 className="font-display uppercase text-[12px] tracking-[0.16em] text-pm-yellow mb-2">Events</h4>
              <ul className="flex flex-col gap-2 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
                <li><Link to="/events" className="hover:text-white transition-colors duration-150">Schedule</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display uppercase text-[12px] tracking-[0.16em] text-pm-yellow mb-2">Apparel</h4>
              <ul className="flex flex-col gap-2 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
                <li><Link to="/apparel" className="hover:text-white transition-colors duration-150">Custom jerseys</Link></li>
                <li><Link to="/apparel" className="hover:text-white transition-colors duration-150">Accessories</Link></li>
                <li><Link to="/apparel" className="hover:text-white transition-colors duration-150">Player cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display uppercase text-[12px] tracking-[0.16em] text-pm-yellow mb-2">Company</h4>
              <ul className="flex flex-col gap-2 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
                <li><Link to="/about" className="hover:text-white transition-colors duration-150">About</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors duration-150">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors duration-150">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Row 2 — Copyright (inside footer, no separate element) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 font-mono text-[10.5px] tracking-[0.1em] uppercase text-white/45">
          <div>© 2026 Playmaker Sports LLC · Lafayette, LA</div>
          <div className="flex gap-6">
            {contact.instagram && (
              <a
                href={`https://www.instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-150"
              >
                Instagram ↗
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
