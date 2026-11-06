import { Nav } from './Nav';
import { Footer } from './Footer';
import { DiamondMarkSymbol } from './DiamondMark';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, contact } from '@/config/site';

const BREADCRUMB_PATHS: Record<string, string> = {
  Events: '/events',
  Apparel: '/apparel',
  About: '/about',
  FAQ: '/faq',
  Contact: '/contact',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Playmaker Sports',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  foundingDate: '2025',
  founder: { '@type': 'Person', name: 'Jake Johnson' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lafayette',
    addressRegion: 'LA',
    addressCountry: 'US',
  },
  sameAs: contact.instagram ? [`https://www.instagram.com/${contact.instagram}`] : [],
};

interface PageLayoutProps {
  children: React.ReactNode;
  /** The page's name, for the breadcrumb JSON-LD. PageHeader shows the visible breadcrumb. */
  breadcrumb?: string;
}

export function PageLayout({ children, breadcrumb }: PageLayoutProps) {
  const breadcrumbSchema = breadcrumb ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: breadcrumb,
        item: `${SITE_URL}${BREADCRUMB_PATHS[breadcrumb] ?? ''}`,
      },
    ],
  } : null;

  return (
    // Full-height column so the footer sits at the bottom on short pages
    // (FAQ, 404) instead of floating with bare paper beneath it.
    <div className="min-h-[100svh] flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-primary btn-sm"
      >
        Skip to content
      </a>
      <DiamondMarkSymbol />
      <JsonLd data={orgSchema} />
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <Nav />
      {/* Every page opens on a night ground (the home hero, PageHeader) that
          slides up under the floating nav: the 58px the bar takes in flow. Its
          10px gap from the top is sticky offset, which takes no space. */}
      <main id="main" tabIndex={-1} className="flex-1 -mt-[58px] focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
