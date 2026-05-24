import { test, expect } from '@grafana/plugin-e2e';

/**
 * Visual regression spec for panel space optimization.
 *
 * Workflow:
 *   Before optimization: npx playwright test layout-space-optimization --update-snapshots
 *   After optimization:  npx playwright test layout-space-optimization
 *   Compare diffs in playwright-report/ to verify larger polygons.
 */
test.describe('layout space optimization', () => {
  test('renders optimization dashboard and captures screenshot for visual comparison', async ({
    page,
  }) => {
    await page.goto('/d/layout-space-opt/layout-space-optimization');
    await page.waitForSelector('svg', { state: 'visible', timeout: 10000 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('layout-space-opt-full.png', {
      fullPage: false,
      threshold: 0.05,
    });
  });
});
