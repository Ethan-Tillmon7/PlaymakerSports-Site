// No trailing slash — paths from PAGE_META are appended directly.
export const SITE_URL = 'https://playmakersports.co';

export const PAGE_META = {
  home: {
    title: 'Playmaker Sports — Custom Jerseys & Tournament Apparel',
    description: 'Premium apparel, accessories, and tournament merchandise for youth athletes and families across the US. Custom jerseys, player cards, and event merch.',
    path: '',
  },
  events: {
    title: 'Tournament Schedule · Playmaker Sports',
    description: 'Upcoming youth baseball and softball tournaments where you can find the Playmaker Sports tent. Dates, locations, and division info for Summer 2026.',
    path: '/events',
  },
  apparel: {
    title: 'Custom Youth Jerseys & Uniforms · Playmaker Sports',
    description: 'Sublimated and tackle-twill jerseys, caps, and pants. YS–Adult 3XL. Custom team uniform orders welcome.',
    path: '/apparel',
  },
  about: {
    title: 'About · Playmaker Sports',
    description: 'Founded in 2025 to deliver premium apparel, accessories, and tournament merchandise to athletes and families across the US.',
    path: '/about',
  },
  faq: {
    title: 'FAQ · Playmaker Sports',
    description: 'Common questions about tournaments, apparel orders, refunds, and weather cancellation policies.',
    path: '/faq',
  },
  contact: {
    title: 'Contact · Playmaker Sports',
    description: 'Get in touch with Playmaker Sports. Players, parents, and coaches welcome.',
    path: '/contact',
  },
} as const;
