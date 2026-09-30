import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

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
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { regex: '^@/legacy(/|$)', message: 'src/legacy is quarantined; nothing outside it may import it.' },
          { regex: '^@/features/[^/]+/.+', message: 'Import another feature only through its index.ts (e.g. @/features/events). Inside a feature, use relative imports.' },
          { regex: '^@/app(/|$)', message: 'Features must not depend on the app shell.' },
        ],
      }],
    },
  },
  {
    files: ['src/{components,hooks,lib,stores,config,styles}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { regex: '^@/(features|legacy|app)(/|$)', message: 'Shared code must stay feature-agnostic: no imports from features/, legacy/ or app/.' },
        ],
      }],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ regex: '^@/legacy(/|$)', message: 'src/legacy is quarantined; nothing outside it may import it.' }],
      }],
    },
  },
  {
    files: ['shared/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ regex: '^(@/|@shared/|\\.\\./src/|\\.\\./netlify/)', message: 'shared/ holds contracts only: relative imports within shared/ and zod.' }],
      }],
    },
  },
])
