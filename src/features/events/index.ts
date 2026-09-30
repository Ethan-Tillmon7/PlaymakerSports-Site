// Public API of the events feature. Other features import only from here.
// Never export the page: routes.tsx lazy-loads it, and exporting it here would
// pull it into whatever chunk imports this file.
export { EventTicker } from './components/EventTicker';
