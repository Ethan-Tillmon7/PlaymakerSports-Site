import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { DiamondMarkSymbol } from './DiamondMark';
import { AnnouncementBar } from './AnnouncementBar';
import { JsonLd } from '../../seo/JsonLd';
import { SITE_URL } from '../../seo/config';
import { contact } from '../../data/contact';

const BREADCRUMB_PATHS: Record<string, string> = {
  Events: '/events',
  Apparel: '/apparel',
  About: '/about',
  FAQ: '/faq',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Playmaker Sports',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
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
  breadcrumb?: string;
  announcement?: string;
}

export function PageLayout({ children, breadcrumb, announcement }: PageLayoutProps) {
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
    <>
      <DiamondMarkSymbol />
      <JsonLd data={orgSchema} />
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {announcement && <AnnouncementBar message={announcement} />}
      {breadcrumb && (
        <div className="border-b border-pm-rule">
          <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-3 flex items-baseline font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">
            <Link to="/" className="hover:text-pm-ink">Home</Link>
            &nbsp;/&nbsp;
            <span className="text-pm-ink">{breadcrumb}</span>
          </div>
        </div>
      )}
      <Nav />
      {children}
      <Footer />
    </>
  );
}
