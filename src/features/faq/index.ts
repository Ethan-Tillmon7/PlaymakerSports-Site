// Public API of the faq feature. Other features import only from here.
// Never export the page: routes.tsx lazy-loads it.
export { FaqTeaser } from './components/FaqTeaser';
