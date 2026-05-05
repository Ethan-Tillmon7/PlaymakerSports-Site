import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { DiamondMarkSymbol } from '../components/layout/DiamondMark';

export function EventsPage() {
  return (
    <>
      <DiamondMarkSymbol />

      {/* Breadcrumb strip — sits above the nav on interior pages */}
      <div className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-3 flex items-baseline justify-between font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">
          <div><a href="/" className="hover:text-pm-ink">Home</a> &nbsp;/&nbsp; <span className="text-pm-ink">Events</span></div>
        </div>
      </div>
      <Nav />

      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Tournaments · Acadiana</span>
          <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6">
            Events &amp;<br />Tournaments
          </h1>
          <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] text-pm-ink mt-6 max-w-[520px]">
            Upcoming tournament schedule with dates, locations, and division info. Check back soon or get in touch for the latest.
          </p>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-16">
        <div className="border border-pm-rule rounded-xl p-10 text-center max-w-[640px] mx-auto">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-muted">Coming soon</span>
          <h2 className="font-display uppercase text-[clamp(24px,2.5vw,36px)] leading-none tracking-[0.005em] mt-4 text-pm-black">
            Schedule dropping shortly
          </h2>
          <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
            Dates, locations, divisions, and registration details for Summer 2026 are being finalized.
          </p>
          <a
            href="/about"
            className="mt-7 font-display uppercase text-[15px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-10 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
          >
            Contact us for info
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
