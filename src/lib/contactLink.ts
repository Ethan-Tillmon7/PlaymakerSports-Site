import type { To } from 'react-router-dom';
import type { CONTACT_ROLES } from '@shared/contact';

export type ContactRole = (typeof CONTACT_ROLES)[number];

/** Pages that carry the contact form themselves, at `#contact`. */
const PAGES_WITH_FORM = ['/', '/contact'];

/** Where a plain "Contact" link goes: the form on this page if it has one, else /contact. */
export function contactTo(pathname: string): To {
  // "/contact/" and "/contact" are the same page.
  const page = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return PAGES_WITH_FORM.includes(page) ? { pathname, hash: '#contact' } : '/contact';
}

/**
 * An "ask" link: opens the contact form with the role chosen and the message
 * started ("I'm interested in <ask>. "). ContactForm reads `role` and `ask`
 * from the query string. `onHome` keeps the visitor on the home page and
 * scrolls up to the form there.
 */
export function askTo(ask: string, role: ContactRole, { onHome = false }: { onHome?: boolean } = {}): To {
  const search = `?${new URLSearchParams({ role, ask })}`;
  return onHome ? { pathname: '/', search, hash: '#contact' } : { pathname: '/contact', search };
}
