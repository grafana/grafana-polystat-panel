import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    httpCredentials: {
      username: 'admin',
      password: 'admin',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // 0. Auth used by after-auth project test files
    {
      name: 'auth',
      testDir: 'node_modules/@grafana/plugin-e2e/dist/auth',
      testMatch: [/.*\.js/],
    },
    // 1. Run all unauthenticated tests using Chrome.
    {
      name: 'not-authenticated',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: [/pre-auth\/.*\.spec\.ts/],
    },
    // 2. Run all authenticated tests in parallel using Chrome.
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      testMatch: [/post-auth\/.*\.spec\.ts/],
      dependencies: ['auth'],
    },
  ],

});
