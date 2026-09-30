import { Helmet } from 'react-helmet-async';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PAGE_META } from '@/config/pageMeta';
import { SITE_URL } from '@/config/site';
import { ContactForm } from './ContactForm';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { toResponsive } from '@/lib/responsiveImage';
import homeplateMeta from '@/assets/images/misc/homeplate.jpg?w=480;768;1120&format=webp&quality=72&as=meta:src;width;height;format';

const homeplate = toResponsive(homeplateMeta);

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

      <PageHeader eyebrow="Players · Parents · Coaches" title="Get in Touch" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-12 lg:py-16 grid lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_560px] gap-12 lg:gap-16">
        <div className="min-w-0 max-w-[760px] animate-fade-up">
          <ContactForm />
        </div>

        {/* Decorative: fills the column to the form's height on desktop, dropped on phones where it would only push the footer down. */}
        <div className="hidden lg:block relative min-h-[360px]">
          <ResponsiveImage
            image={homeplate}
            alt="Home plate at a baseball field"
            sizes="(min-width: 1280px) 560px, 480px"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </PageLayout>
  );
}
