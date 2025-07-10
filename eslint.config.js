import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist', 'build', '.next', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      import: importPlugin,
      prettier,
    },
    rules: {
      // React Rules
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',

      // React Hooks
      'react-hooks/exhaustive-deps': 'warn',

      // Import Order
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Prevent Duplicate imports
      'import/no-duplicates': 'warn',

      // Prettier Integration
      'prettier/prettier': 'warn',
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
  },

  // React Hooks
  {
    files: ['**/*.{ts,tsx}'],
    ...reactHooks.configs['recommended-latest'],
  },

  // React-Vite Rules (hot reload edge cases)
  {
    files: ['**/*.{ts,tsx}'],
    ...reactRefresh.configs.vite,
  },
]);
