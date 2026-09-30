import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Patterns match the import string, so each boundary has an alias form (@/…) and a
// relative form (../…). Relative imports are fine inside a feature; leaving the
// feature root is what's forbidden, and how many ../ that takes depends on depth.
const LEGACY = [
  { regex: '^@/legacy(/|$)', message: 'src/legacy is quarantined; nothing outside it may import it.' },
  { regex: '^(\\.\\./)+legacy(/|$)', message: 'src/legacy is quarantined; nothing outside it may import it.' },
]
const FEATURE = [
  ...LEGACY,
  { regex: '^@/features/[^/]+/.+', message: 'Import another feature only through its index.ts (e.g. @/features/events). Inside a feature, use relative imports.' },
  { regex: '^@/app(/|$)', message: 'Features must not depend on the app shell.' },
  { regex: '^(\\.\\./)+app(/|$)', message: 'Features must not depend on the app shell.' },
]
const leaveFeature = (depth) => ({
  regex: `^(\\.\\./){${depth}}`,
  message: 'This relative path leaves the feature. Import another feature through @/features/<name>, and shared code through @/.',
})
const restrict = (files, patterns) => ({ files, rules: { 'no-restricted-imports': ['error', { patterns }] } })

function boundaryConfigs() {
  return [
    // Feature files at depth 1–3 below src/features/<name>/.
    restrict(['src/features/*/*.{ts,tsx}'], [...FEATURE, leaveFeature(1)]),
    restrict(['src/features/*/*/*.{ts,tsx}'], [...FEATURE, leaveFeature(2)]),
    restrict(['src/features/*/*/*/**/*.{ts,tsx}'], [...FEATURE, leaveFeature(3)]),
    restrict(['src/{components,hooks,lib,stores,config,styles}/**/*.{ts,tsx}'], [
      { regex: '^@/(features|legacy|app)(/|$)', message: 'Shared code must stay feature-agnostic: no imports from features/, legacy/ or app/.' },
      { regex: '^(\\.\\./)+(features|legacy|app)(/|$)', message: 'Shared code must stay feature-agnostic: no imports from features/, legacy/ or app/.' },
    ]),
    restrict(['src/app/**/*.{ts,tsx}'], LEGACY),
    restrict(['shared/**/*.ts'], [
      { regex: '^(@/|@shared/|\\.\\./src/|\\.\\./netlify/)', message: 'shared/ holds contracts only: relative imports within shared/ and zod.' },
    ]),
  ]
}

export default defineConfig([
  globalIgnores(['dist', '.netlify', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Honor the `_`-prefix convention for intentionally-unused vars/args,
      // and ignore rest-siblings (e.g. `const { drop: _drop, ...rest } = obj`).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // ── Import boundaries (docs/superpowers/specs/2026-09-30-feature-structure-design.md) ──
  // Each file gets one merged pattern list: a later flat-config block's
  // no-restricted-imports replaces an earlier one's options instead of adding to them.
  ...boundaryConfigs(),
])
