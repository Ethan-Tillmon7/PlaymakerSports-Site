/**
 * The "Our Story" copy, verbatim from Jake (2026-11-04), one string per
 * paragraph. /about and the homepage both render this, so edit it here only.
 */
export const OUR_STORY = [
  'Playmaker Sports was founded in 2025 by Jake Johnson, a University of Louisiana at Lafayette graduate and former club lacrosse player. Driven by a lifelong passion for sports, Jake started the business to continue working in the sports industry and build something that gives back to the athletic community. Today, Playmaker Sports delivers premium apparel, accessories, and tournament merchandise to athletes and families across the United States.',
  "We believe the best brands are built through relationships. That's why we partner with tournament directors, coaches, and organizations to provide reliable service, quality products, and a booth that players and families look forward to visiting every weekend.",
] as const;

/** Cuts `text` just before `marker`. A reworded paragraph fails the build here instead of shipping a broken excerpt. */
function before(text: string, marker: string): string {
  const at = text.indexOf(marker);
  if (at === -1) throw new Error(`ourStory: "${marker}" is no longer in the Our Story copy`);
  return text.slice(0, at).trim();
}

/** The home page's short version: the first paragraph without its closing "Today, …" sentence. */
export const OUR_STORY_INTRO = before(OUR_STORY[0], 'Today, Playmaker Sports delivers');

/**
 * The second paragraph's closing words, set large on the home page with the
 * last two lit yellow. Checked against the paragraph so the two can't drift.
 */
const STATEMENT_TAIL = 'booth that players and families look forward to visiting every weekend.';
if (!OUR_STORY[1].endsWith(STATEMENT_TAIL)) throw new Error('ourStory: the statement line is no longer in the Our Story copy');
export const STORY_STATEMENT = {
  lead: 'A booth that players and families look forward to visiting',
  lit: 'every weekend.',
} as const;

/**
 * The partnership sentence on its own, for tournament directors on the Events
 * page: the second paragraph from "we partner" on, as a sentence of its own.
 */
const PARTNERS_MARKER = "That's why we partner ";
const partnersAt = OUR_STORY[1].indexOf(PARTNERS_MARKER);
if (partnersAt === -1) throw new Error('ourStory: the partnership sentence is no longer in the Our Story copy');
export const OUR_STORY_PARTNERS = `We partner ${OUR_STORY[1].slice(partnersAt + PARTNERS_MARKER.length)}`;

/** Label over value, shown on the home story panel and in the About header. */
export const FACTS = [
  { label: 'Founded', value: '2025' },
  { label: 'Home base', value: 'Lafayette, LA' },
  { label: 'Divisions', value: '6U–18U' },
] as const;

/** Jake's three reasons (2026-11-04), verbatim. `link` is where each one leads from the About page. */
export const REASONS = [
  {
    title: 'Custom uniforms, designed your way',
    body: "Any style. Any design. Any size. We create custom uniforms built to match your team's vision.",
    link: { label: 'Team uniforms', to: '/apparel#uniforms' },
  },
  {
    title: 'At the tournaments you already play',
    body: 'Playmaker Sports travels nationwide, primarily serving tournaments throughout the South, bringing merchandise directly to the fields and athletes.',
    link: { label: 'All events', to: '/events' },
  },
  {
    title: 'Locally owned. Athlete operated.',
    body: 'Founded and operated by a former club lacrosse player and college student. Built on a genuine love for sports and a commitment to making every team, athlete, and customer feel valued.',
    link: { label: 'Reach out', to: '/contact' },
  },
] as const;
