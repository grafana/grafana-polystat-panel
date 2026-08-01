import { expect, test } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

// Checks AutoFontScaler against real browser text metrics. The unit tests mock measureText, so they
// pin the arithmetic but not the real glyph widths. Pixel sizes are not asserted, they vary by machine.
//
// Panel ids come from provisioning/dashboards/Font-Scaling-Test.json:
//   1 = wide panel, 2 = narrow panel (both labelled ServerAlpha), 3 = label too long to fit,
//   4 = value and timestamp both shown, 5 = polygon too small for any text, 6 = composite
const LONG_LABEL = 'AVeryLongServerNameThatCannotPossiblyFitInsideThisPolygon';

const readText = (page: Page, testId: string) =>
  page.locator(`[data-testid="${testId}"]`).evaluate((element: SVGTextElement) => ({
    text: element.textContent ?? '',
    fontSize: parseFloat(element.getAttribute('font-size') ?? ''),
  }));

test.beforeEach(async ({ page }) => {
  await page.goto('/d/font-scaling-test/font-scaling-test?kiosk');
  // every panel has painted, not just the first
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(6, { timeout: 30000 });
});

test('label font size shrinks with the polygon', async ({ page }) => {
  const widePanelLabel = await readText(page, 'polystat-label-1-0');
  const narrowPanelLabel = await readText(page, 'polystat-label-2-0');

  expect(widePanelLabel.text).toBe('ServerAlpha');
  expect(narrowPanelLabel.text).toBe('ServerAlpha');
  // identical text in a narrower polygon has to be drawn smaller
  expect(narrowPanelLabel.fontSize).toBeLessThan(widePanelLabel.fontSize);
});

test('a label too long to fit is truncated at a cascade length', async ({ page }) => {
  const truncatedLabel = await readText(page, 'polystat-label-3-0');

  // Desktop Chrome pins the viewport, so the panel geometry is fixed and the cascade always settles
  // on the first rung. Asserting the exact string pins which rung fired. The '...' is written out
  // rather than imported from src, so this stays a black box check of what the browser painted.
  expect(truncatedLabel.text).toBe(LONG_LABEL.slice(0, 18) + '...');
  expect(truncatedLabel.fontSize).toBeGreaterThan(0);
});

test('the timestamp is drawn smaller than the value it shares space with', async ({ page }) => {
  const label = await readText(page, 'polystat-label-4-0');
  const value = await readText(page, 'polystat-value-4-0');
  const timestamp = await readText(page, 'polystat-timestamp-4-0');

  expect(label.text).toBe('ServerBeta');
  expect(value.text).not.toBe('');
  expect(timestamp.text).not.toBe('');

  // the value gets the upper 67% of the text area and the timestamp the lower 33%
  expect(timestamp.fontSize).toBeLessThan(value.fontSize);
  expect(timestamp.fontSize).toBeGreaterThan(0);
});

test('paints nothing when the polygon is too small for any text', async ({ page }) => {
  // AutoFontScaler returns 0 for every font size here. The unit tests assert those zeroes; only a
  // browser can confirm that a 0px font actually paints nothing rather than clamping to a minimum.
  await expect(page.locator('[data-testid="polystat-label-5-0"]')).toBeHidden();
  await expect(page.locator('[data-testid="polystat-value-5-0"]')).toBeHidden();

  // the elements are still in the DOM, so this is measuring what was painted, not what was skipped
  await expect(page.locator('[data-testid="polystat-label-5-0"]')).toBeAttached();
});

test('sizes a composite on its member text', async ({ page }) => {
  const label = await readText(page, 'polystat-label-6-0');
  const value = await readText(page, 'polystat-value-6-0');

  expect(label.text).toBe('cluster-a');
  // the scaler measures 'displayName: valueFormatted' of the member, not the composite's own value
  expect(value.text).toBe('cpu: 42.00');
  expect(value.fontSize).toBeGreaterThan(0);
  // the member string is longer than the composite name, so it is drawn smaller
  expect(value.fontSize).toBeLessThan(label.fontSize);
});
