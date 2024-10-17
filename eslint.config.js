// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import drizzle from 'eslint-plugin-drizzle';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const patchedConfig = fixupConfigRules([
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
]);

const config = [
  ...patchedConfig,
  {
    plugins: { drizzle },
    ignores: [
      '.next/*',
      '.vercel/*',
      'src/components/shadcn/*',
      'node_modules/*',
    ],
  },
];

export default config;
