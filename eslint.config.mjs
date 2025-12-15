import { defineConfig } from 'eslint/config';
import baseConfig from './.config/eslint.config.mjs';
import grafanaEslintPluginPlugins from '@grafana/eslint-plugin-plugins';

export default defineConfig([
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/provisioning-private',
      '**/coverage',
      '**/.DS_Store',
      '.vscode/*.log',
      '.yarn/install-state.gz',
      '**/.eslintcache',
      '**/.idea',
      '**/.stignore',
      '**/blob-report/',
      'tests/.auth',
      'tests/.cache/',
      '**/playwright/',
      '**/playwright-report/',
      '**/test-results/',
    ],
  },
  ...baseConfig,
  {
    plugins: {
      'grafana/plugins': grafanaEslintPluginPlugins,
    },

    rules: {
    },
  },
]);
