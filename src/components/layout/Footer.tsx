import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-pm-black text-white px-6 sm:px-10 pt-12 pb-8">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/15">
          <div className="col-span-2 lg:col-span-1">
            <div className="bg-pm-yellow inline-flex items-baseline gap-1 px-3 py-1.5 font-display text-[36px] leading-none uppercase tracking-[0.005em] rounded-xl">
              <span className="text-white">PLAY</span><span className="text-pm-black">MAKER</span>
            </div>
            <p className="text-[14px] leading-[1.6] text-white/70 mt-5 max-w-[280px]">
              Locally run tournaments and custom apparel. Built in Lafayette, fielded across Acadiana.
            </p>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-pm-yellow mt-5">
              <Link to="/about" className="hover:text-white transition-colors duration-150">Contact us</Link>
            </p>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Events</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/events" className="hover:text-white">Schedule</Link></li>
              <li><Link to="/events" className="hover:text-white">Divisions</Link></li>
              <li><Link to="/events" className="hover:text-white">Locations</Link></li>
              <li><Link to="/events" className="hover:text-white">Past results</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Apparel</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/apparel" className="hover:text-white">Custom jerseys</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Caps &amp; pants</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Size guide</Link></li>
              <li><Link to="/apparel" className="hover:text-white">Order process</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase text-[14px] tracking-[0.16em] text-pm-yellow mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/about" className="hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/faq" className="hover:text-white">Refund policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark band */}
        <div className="py-10 border-b border-white/15 overflow-hidden">
          <div className="font-display uppercase text-[clamp(72px,14vw,180px)] leading-[0.86] tracking-[-0.01em] whitespace-nowrap">
            <span className="text-white">PLAY</span>
            <span className="text-pm-yellow">·</span>
            <span className="text-white">MAKER</span>
            <span className="text-pm-yellow">·</span>
            <span className="text-white/30">SPORTS</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[10.5px] tracking-[0.1em] uppercase text-white/45">
          <div>© 2026 Playmaker Sports LLC · Lafayette, LA</div>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-white">Privacy</Link>
            <Link to="/faq" className="hover:text-white">Terms</Link>
            <a href="#" className="hover:text-white">Instagram ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
