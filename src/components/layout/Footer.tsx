import { Link } from 'react-router-dom';
import { contact } from '../../data/contact';

export function Footer() {
  return (
    <footer className="bg-pm-black text-white px-6 sm:px-10 pt-12 pb-8">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/15">
          <div className="col-span-2 lg:col-span-1">
            <div className="bg-pm-yellow inline-flex items-baseline gap-1 px-3 py-1.5 font-display text-[36px] leading-none uppercase tracking-[0.005em] rounded-xl">
              <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
            </div>
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-pm-yellow/70 mt-3">
              Made for the Moment
            </p>
            <p className="text-[14px] leading-[1.6] text-white/70 mt-4 max-w-[280px]">
              Sports merchandise and custom apparel. Built in Lafayette, fielded across the South.
            </p>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-pm-yellow mt-5">
              <Link to="/about" className="hover:text-white transition-colors duration-150">Contact us</Link>
            </p>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Events</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/events" className="hover:text-white">Schedule</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Apparel</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/apparel" className="hover:text-white">Custom jerseys</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Accessories</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Hats</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Player cards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/about" className="hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-10 font-mono text-[10.5px] tracking-[0.1em] uppercase text-white/45">
          <div>© 2026 Playmaker Sports LLC · Lafayette, LA</div>
          <div className="flex gap-6">
            {contact.instagram && (
              <a
                href={`https://www.instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
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
