import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { JsonLd } from '../seo/JsonLd';
import { useInView } from '../hooks/useInView';

const faqGroups = [
  {
    topic: 'Tournaments',
    faqs: [
      {
        question: 'What happens if the tournament is cancelled due to weather?',
        answer: 'We monitor weather closely and will notify all registered teams as early as possible. Rain-out games are rescheduled when possible. Contact us for details on our cancellation policy.',
      },
      {
        question: 'What is your refund policy?',
        answer: 'Refund and credit policies vary by event. Contact us directly for specifics on a particular tournament.',
      },
      {
        question: 'What age divisions do your tournaments include?',
        answer: 'Divisions vary by event. Check the Events page or contact us for the breakdown of each tournament.',
      },
      {
        question: 'Where are tournaments held?',
        answer: 'All tournaments are held at fields across Acadiana — primarily in the Lafayette Parish area. Exact locations are listed on the Events page for each tournament.',
      },
    ],
  },
  {
    topic: 'Apparel',
    faqs: [
      {
        question: 'How do I place an apparel order?',
        answer: 'Browse the catalog on our Apparel page and reach out through the contact form. We send a digital proof same-day.',
      },
      {
        question: 'Can I upload my own logo or artwork?',
        answer: "Absolutely. We accept AI, EPS, PDF, or high-res PNG files. If you only have a phone photo, we'll vector it for free.",
      },
      {
        question: 'Do you offer rush orders on apparel?',
        answer: 'Yes, for an additional fee. Contact us to discuss timeline and availability.',
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
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">Common questions</span>
          <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
            FAQ
          </h1>
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

        <div className="mt-14 border border-pm-rule rounded-xl p-7 max-w-[480px] mx-auto text-center">
          <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted">Still have questions?</span>
          <p className="font-display uppercase text-[22px] leading-[1] tracking-[0.005em] mt-2 text-pm-black">
            Get in touch
          </p>
          <Link
            to="/about"
            className="mt-5 font-display uppercase text-[14px] tracking-[0.04em] bg-pm-yellow text-pm-black px-5 h-9 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl"
          >
            Contact us
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
