import tseslint from 'typescript-eslint';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import cypressPlugin from 'eslint-plugin-cypress';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// We export a plain array. This is the "Flat Config" standard.
// No wrapper function = no signature deprecation warning.
export default [
  {
    // GLOBAL IGNORES
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/*.d.ts',
      '.vscode/*',
      '**/.husky/',
      '**/*.js',
      '**/package-lock.json',
      'eslint.config.mjs',
      '**/screenshots/',
      '**/videos/',
      '**/reports/',
      '**/cypress/reports/',
      '**/jsonlogs/',
      'generate-report.cjs',
      'archive-report.js',
      '**/*.html',
    ],
  },

  // Spread the recommended configs directly into the array
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 1. LEGACY BRIDGES
  ...fixupConfigRules(
    compat.config({
      extends: ['plugin:import/typescript', 'plugin:prettier/recommended'],
    })
  ),

  {
    // 2. MAIN RULES (For Test Files)
    files: ['**/*.ts', '**/cypress/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
      cypress: cypressPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        Given: 'readonly',
        When: 'readonly',
        Then: 'readonly',
        And: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/no-async-tests': 'error',
      'cypress/assertion-before-screenshot': 'error',
      'no-console': 'off',
    },
  },

  {
    // 3. OVERRIDE FOR CONFIG FILES
    files: ['*.config.ts', 'cypress.config.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
