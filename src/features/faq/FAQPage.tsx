import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { FAQItem } from './components/FAQItem';
import { allFaqs, faqGroups } from './faqs';

const topicId = (topic: string) => `faq-${topic.toLowerCase().replace(/\s+/g, '-')}`;

export function FAQPage() {
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
      <PageHeader
        breadcrumb="FAQ"
        title="Good questions"
        lede="The ones coaches and parents ask most, with refunds, payment and shipping covered too."
      />

      {/* Topics on the left stay in view while the answers scroll. On phones
          "Didn't find yours?" moves below the answers. */}
      <section aria-label="Questions and answers">
        <Container className="sec-y grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]">
          <aside className="contents lg:block lg:sticky lg:top-24 lg:self-start">
            <nav className="topics" aria-label="Topics">
              {faqGroups.map((group) => (
                <a key={group.topic} href={`#${topicId(group.topic)}`}>
                  {group.topic}{' '}
                  <span>
                    {group.faqs.length} {group.faqs.length === 1 ? 'question' : 'questions'}
                  </span>
                </a>
              ))}
            </nav>
            <div className="order-3 lg:order-none pt-6 lg:mt-6 border-t border-pm-rule">
              <p className="title">Didn't find yours?</p>
              <p className="small mt-1">Tell us what you need and we'll follow up.</p>
              <ButtonLink to="/contact" variant="secondary" size="sm" arrow className="mt-4">
                Ask us directly
              </ButtonLink>
            </div>
          </aside>

          <div className="order-2 lg:order-none min-w-0 flex flex-col gap-14 lg:gap-16">
            {faqGroups.map((group, gi) => (
              <section key={group.topic} id={topicId(group.topic)} className="scroll-mt-24" aria-labelledby={`${topicId(group.topic)}-title`}>
                <h2 id={`${topicId(group.topic)}-title`} className="h-section mb-6">
                  {group.topic}
                </h2>
                {group.faqs.map((faq, i) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} defaultOpen={gi === 0 && i === 0} />
                ))}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
