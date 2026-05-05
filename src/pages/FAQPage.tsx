import { useState } from 'react';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { DiamondMarkSymbol } from '../components/layout/DiamondMark';

// TODO: Replace with real FAQ content from Jake
const faqs = [
  {
    question: 'What happens if the tournament is cancelled due to weather?',
    answer: 'We monitor weather closely and will notify all registered teams as early as possible. Rain-out games are rescheduled when possible. Contact us for details on our cancellation policy.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'Refund and credit policies vary by event. Contact us directly for specifics on a particular tournament.',
  },
  {
    question: 'How do I place an apparel order?',
    answer: 'Browse the catalog on our Apparel page and reach out through the contact form. We send a digital proof same-day and ship to the dugout within seven business days.',
  },
  {
    question: 'What is the minimum order quantity for jerseys?',
    answer: 'Minimum order is 12 pieces per style. Mix sizes freely — YS through Adult 3XL at no extra charge.',
  },
  {
    question: 'Can I upload my own logo or artwork?',
    answer: "Absolutely. We accept AI, EPS, PDF, or high-res PNG files. If you only have a phone photo, we'll vector it for free.",
  },
  {
    question: 'What age divisions do your tournaments include?',
    answer: 'Divisions vary by event. Check the Events page or contact us for the breakdown of each tournament.',
  },
  {
    question: 'Where are tournaments held?',
    answer: 'All tournaments are held at fields across Acadiana — primarily in the Lafayette Parish area. Exact locations are listed on the Events page for each tournament.',
  },
  {
    question: 'Do you offer rush orders on apparel?',
    answer: 'Yes, for an additional fee. Contact us to discuss timeline and availability.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-pm-rule last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="font-display uppercase text-[16px] lg:text-[18px] tracking-[0.02em] text-pm-black group-hover:text-pm-yellow-deep transition-colors duration-150">
          {question}
        </span>
        <span className={`shrink-0 w-6 h-6 flex items-center justify-center border-2 border-pm-rule rounded-lg transition-colors duration-150 ${open ? 'bg-pm-yellow border-pm-yellow-deep' : 'group-hover:border-pm-ink'}`}>
          <svg className="w-3 h-3 text-pm-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
          </svg>
        </span>
      </button>
      {open && (
        <p className="pb-5 text-[14px] leading-[1.65] text-pm-ink max-w-[640px]">
          {answer}
        </p>
      )}
    </li>
  );
}

export function FAQPage() {
  return (
    <>
      <DiamondMarkSymbol />

      {/* Breadcrumb strip — sits above the nav on interior pages */}
      <div className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-3 flex items-baseline justify-between font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">
          <div><a href="/" className="hover:text-pm-ink">Home</a> &nbsp;/&nbsp; <span className="text-pm-ink">FAQ</span></div>
        </div>
      </div>
      <Nav />

      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-10 pb-12 lg:pt-16 lg:pb-16">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Common questions</span>
          <h1 className="font-display uppercase text-[clamp(56px,9vw,160px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-6">
            FAQ
          </h1>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-14 lg:py-16">
        <div className="max-w-[760px]">
          <ul>
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </ul>
        </div>

        <div className="mt-12 border border-pm-rule rounded-xl p-7 max-w-[760px]">
          <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">Still have questions?</span>
          <p className="font-display uppercase text-[22px] leading-[1] tracking-[0.005em] mt-2 text-pm-black">
            Get in touch
          </p>
          <a
            href="/about"
            className="mt-5 font-display uppercase text-[14px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-9 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-colors border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
          >
            Contact us →
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
