// Public API of the about feature. Other features import only from here.
// Never export the page: routes.tsx lazy-loads it.
export { Reasons } from './components/Reasons';
export { FACTS, OUR_STORY, OUR_STORY_INTRO, OUR_STORY_PARTNERS, STORY_STATEMENT } from './ourStory';
