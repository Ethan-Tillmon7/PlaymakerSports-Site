import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { JsonLd } from '../seo/JsonLd';
import { useInView } from '../hooks/useInView';

const faqGroups = [
  {
    topic: 'Events',
    faqs: [
      {
        question: 'What happens if there is severe weather at a tournament?',
        answer: 'If there is severe weather or heavy rain during the tournament weekend, there is a possibility we may not be able to attend. Outside of weather-related circumstances, we fully plan on being at every event we commit to.',
      },
      {
        question: 'What is your refund policy?',
        answer: 'Card purchases are refunded directly through the Square app. Cash purchases can be refunded in cash, Venmo, Zelle, or Cash App.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'Square is our preferred option. We also accept cash, Cash App, Venmo, and Zelle.',
      },
    ],
  },
  {
    topic: 'Apparel',
    faqs: [
      {
        question: 'What does Playmaker Sports sell?',
        answer: 'We carry jerseys, sliding mitts, arm sleeves, sunglasses, chains and necklaces, eye black, cooling towels, hats, batting gloves, player cards, and other sports accessories. Hats and player cards are our newest additions.',
      },
      {
        question: 'Can you make custom jerseys for my team?',
        answer: "Yes — we're already capable of fulfilling custom jersey orders. Send us your inspiration photos or mockups and we'll work with you from there. Our long-term goal is to expand this into full custom team travel ball uniforms.",
      },
      {
        question: 'How do I place an apparel order?',
        answer: 'Browse the catalog on our Apparel page and reach out through the contact form. We send a digital proof same-day.',
      },
      {
        question: 'Can I upload my own logo or artwork?',
        answer: "Absolutely. We accept AI, EPS, PDF, or high-res PNG files. If you only have a phone photo, we'll work with it.",
      },
    ],
  },
];

const allFaqs = faqGroups.flatMap((g) => g.faqs);

function FAQItem({ question, answer, index, listInView }: {
  question: string;
  answer: string;
  index: number;
  listInView: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`border-b border-pm-rule last:border-b-0 ${listInView ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="font-display uppercase text-[16px] lg:text-[17px] tracking-[0.02em] text-pm-black group-hover:text-pm-yellow-deep transition-colors duration-150">
          {question}
        </span>
        <span className={`shrink-0 w-6 h-6 flex items-center justify-center border-2 border-pm-rule rounded-lg transition-colors duration-150 ${open ? 'bg-pm-yellow border-pm-yellow-deep' : 'group-hover:border-pm-ink'}`}>
          <svg
            className={`w-3 h-3 text-pm-black transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] leading-[1.65] text-pm-ink">
            {answer}
          </p>
        </div>
      </div>
    </li>
  );
}

export function FAQPage() {
  const [faqRef, faqInView] = useInView();

  return (
    <PageLayout breadcrumb="FAQ">
      <Helmet>
        <title>{PAGE_META.faq.title}</title>
        <meta name="description" content={PAGE_META.faq.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.faq.path}`} />
        <meta property="og:title" content={PAGE_META.faq.title} />
        <meta property="og:description" content={PAGE_META.faq.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.faq.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }} />
      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Common questions</span>
            <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
              FAQ
            </h1>
          </div>
          {/* <div className="shrink-0 bg-pm-black rounded-xl px-5 py-4 flex flex-col items-center gap-3">
            <div className="text-center">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/40">Still have questions?</span>
              <p className="font-display uppercase text-[17px] leading-[1] tracking-[0.005em] mt-1 text-white">Get in touch</p>
            </div>
            <Link
              to="/contact"
              className="font-display uppercase text-[12px] tracking-[0.04em] bg-pm-yellow text-pm-black px-4 h-8 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
            >
              Contact us
            </Link>
          </div> */}
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-14 lg:py-16">
        <div ref={faqRef} className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">
          {faqGroups.map((group, gi) => {
            const indexOffset = faqGroups.slice(0, gi).reduce((sum, g) => sum + g.faqs.length, 0);
            return (
              <div key={group.topic}>
                <div className="mb-5 pb-4 border-b-2 border-pm-black">
                  <h2 className="font-display uppercase text-[clamp(22px,2.5vw,32px)] leading-[0.95] tracking-[0.005em] text-pm-black">
                    {group.topic}
                  </h2>
                </div>
                <ul>
                  {group.faqs.map((faq, i) => (
                    <FAQItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                      index={indexOffset + i}
                      listInView={faqInView}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </section>
    </PageLayout>
  );
}
