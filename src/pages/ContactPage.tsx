import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { ContactForm } from '../components/forms/ContactForm';

export function ContactPage() {
  return (
    <PageLayout breadcrumb="Contact">
      <Helmet>
        <title>{PAGE_META.contact.title}</title>
        <meta name="description" content={PAGE_META.contact.description} />
        <link rel="canonical" href={`${SITE_URL}${PAGE_META.contact.path}`} />
        <meta property="og:title" content={PAGE_META.contact.title} />
        <meta property="og:description" content={PAGE_META.contact.description} />
        <meta property="og:url" content={`${SITE_URL}${PAGE_META.contact.path}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="border-b border-pm-rule">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-8 animate-fade-up">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">
            Players · Parents · Coaches
          </span>
          <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
            Get in Touch
          </h1>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 py-12">
        <div className="max-w-[560px]">
          <ContactForm />
        </div>
      </section>
    </PageLayout>
  );
}
