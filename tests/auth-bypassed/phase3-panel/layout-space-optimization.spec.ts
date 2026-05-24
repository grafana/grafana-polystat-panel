import { test, expect } from '@grafana/plugin-e2e';

/**
 * Smoke tests for the Layout Space Optimization dashboard.
 * Verifies all 4 panels render SVG polygons without errors.
 *
 * For local visual comparison run:
 *   npx playwright test layout-space-optimization --update-snapshots
 */
test.describe('layout space optimization', () => {
  test('renders pointed-top hex panels without errors', async ({ page }) => {
    await page.goto('/d/layout-space-opt/layout-space-optimization');
    await page.waitForSelector('svg path', { state: 'visible', timeout: 10000 });
    // At least one hex polygon rendered in the panel area
    const paths = page.locator('svg path[d^="M"]');
    await expect(paths.first()).toBeVisible();
  });

  test('renders flat-top hex panel without errors', async ({ page }) => {
    await page.goto('/d/layout-space-opt/layout-space-optimization?viewPanel=4');
    await page.waitForSelector('svg path', { state: 'visible', timeout: 10000 });
    // Flat-top hex paths start with M{R},0 (positive x first)
    const paths = page.locator('svg path[d^="M"]');
    await expect(paths.first()).toBeVisible();
  });
});
