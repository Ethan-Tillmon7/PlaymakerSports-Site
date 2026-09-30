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
  Contact: '/contact',
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
  /** 'onDark' when the page pulls a dark hero up under the nav (About), so the breadcrumb stays legible. */
  breadcrumbTone?: 'onPaper' | 'onDark';
  /** Ground under the page. 'night' for all-dark pages (Home, About), so a short
   *  page on a tall screen doesn't show a paper band above the black footer. */
  ground?: 'paper' | 'night';
}

export function PageLayout({ children, breadcrumb, announcement, breadcrumbTone = 'onPaper', ground = 'paper' }: PageLayoutProps) {
  const onDark = breadcrumbTone === 'onDark';
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
    <div className="min-h-[100dvh] flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-pm-yellow focus:text-pm-black focus:font-display focus:uppercase focus:text-[14px] focus:tracking-[0.04em] focus:px-4 focus:h-10 focus:inline-flex focus:items-center focus:rounded-xl focus:border-b-2 focus:border-pm-yellow-deep"
      >
        Skip to content
      </a>
      <DiamondMarkSymbol />
      <JsonLd data={orgSchema} />
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {announcement && <AnnouncementBar message={announcement} />}
      {breadcrumb && (
        <div className="hidden xl:block relative h-0 overflow-visible z-20 pointer-events-none">
          <div className="absolute top-[10px] left-0 right-0 h-16 flex items-center max-w-[1480px] mx-auto px-6 sm:px-10">
            <div className={`flex-1 flex items-center gap-1 font-mono text-[10.5px] tracking-[0.1em] uppercase pointer-events-auto ${onDark ? 'text-white/60' : 'text-pm-muted'}`}>
              <Link to="/" className={`transition-colors duration-150 ${onDark ? 'hover:text-white' : 'hover:text-pm-ink'}`}>Home</Link>
              <span className="mx-1">/</span>
              <span className={onDark ? 'text-white' : 'text-pm-ink'}>{breadcrumb}</span>
            </div>
            <div className="w-[calc(100%-20px)] max-w-[800px] shrink-0" />
            <div className="flex-1" />
          </div>
        </div>
      )}
      <Nav />
      <main id="main" tabIndex={-1} className={`flex-1 focus:outline-none ${ground === 'night' ? 'bg-pm-black' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
