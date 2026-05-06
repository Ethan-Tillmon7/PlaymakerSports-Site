export const SITE_URL = 'https://playmakersportsla.com'; // TODO: confirm domain with Jake

export const PAGE_META = {
  home: {
    title: 'Playmaker Sports — Youth Tournaments & Custom Jerseys · Lafayette, LA',
    description: 'Host of Acadiana youth baseball and softball tournaments. Custom sublimated and tackle-twill jerseys printed locally in Lafayette, LA.',
    path: '',
  },
  events: {
    title: 'Tournament Schedule · Playmaker Sports',
    description: 'Upcoming youth baseball and softball tournaments in Acadiana. Dates, locations, and division info for Summer 2026.',
    path: '/events',
  },
  apparel: {
    title: 'Custom Youth Jerseys & Uniforms · Playmaker Sports',
    description: 'Sublimated and tackle-twill jerseys, caps, and pants. YS–Adult 3XL. Custom uniforms built in Acadiana.',
    path: '/apparel',
  },
  about: {
    title: 'About · Playmaker Sports',
    description: 'Locally run youth sports tournaments and custom uniforms, built in Lafayette, LA by Jake Johnson.',
    path: '/about',
  },
  faq: {
    title: 'FAQ · Playmaker Sports',
    description: 'Common questions about tournaments, apparel orders, refunds, and weather cancellation policies.',
    path: '/faq',
  },
} as const;
