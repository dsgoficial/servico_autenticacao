import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...prettierConfig.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'prettier/prettier': ['error', {
        'endOfLine': 'auto'
      }]
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    }
  }
];