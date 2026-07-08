import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { PAGE_META, SITE_URL } from '../seo/config';
import { ContactForm } from '../components/forms/ContactForm';
import homeplate from '../assets/images/misc/homeplate.jpg';

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

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
        <div className="flex-1 min-w-0 animate-fade-up">
          <header className="mb-10">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-pm-yellow-deep">
              Players · Parents · Coaches
            </span>
            <h1 className="font-display uppercase text-[clamp(36px,5vw,56px)] leading-[0.86] tracking-[-0.005em] text-pm-black mt-4">
              Get in Touch
            </h1>
          </header>
          <ContactForm />
        </div>

        <div className="w-full lg:w-[480px] xl:w-[560px] shrink-0 flex items-center">
          <img
            src={homeplate}
            alt="Home plate at a baseball field"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </PageLayout>
  );
}
