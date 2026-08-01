import { expect, test } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

import { gotoProvisionedDashboard, RENDER_TIMEOUT } from './helpers';

// Checks AutoFontScaler against real browser text metrics. The unit tests mock measureText, so they
// pin the arithmetic but not the real glyph widths. Pixel sizes are not asserted, they vary by machine.
//
// Panel ids come from provisioning/dashboards/Font-Scaling-Test.json:
//   1 = wide panel, 2 = narrow panel (both labelled ServerAlpha), 3 = label too long to fit,
//   4 = value and timestamp both shown
const LONG_LABEL = 'AVeryLongServerNameThatCannotPossiblyFitInsideThisPolygon';

const readText = (page: Page, testId: string) =>
  page.locator(`[data-testid="${testId}"]`).evaluate((element: SVGTextElement) => ({
    text: element.textContent ?? '',
    fontSize: parseFloat(element.getAttribute('font-size') ?? ''),
  }));

test.beforeEach(async ({ page }) => {
  await gotoProvisionedDashboard(page, 'font-scaling-test');
  // every panel has painted, not just the first
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(4, { timeout: RENDER_TIMEOUT });
});

test('label font size shrinks with the polygon', async ({ page }) => {
  const wide = await readText(page, 'polystat-label-1-0');
  const narrow = await readText(page, 'polystat-label-2-0');

  expect(wide.text).toBe('ServerAlpha');
  expect(narrow.text).toBe('ServerAlpha');
  // identical text in a narrower polygon has to be drawn smaller
  expect(narrow.fontSize).toBeLessThan(wide.fontSize);
});

test('a label too long to fit is truncated at a cascade length', async ({ page }) => {
  const tooLong = await readText(page, 'polystat-label-3-0');

  // Desktop Chrome pins the viewport, so the panel geometry is fixed and the cascade always settles
  // on the first rung. Asserting the exact string pins which rung fired.
  expect(tooLong.text).toBe(LONG_LABEL.slice(0, 18) + '...');
  expect(tooLong.fontSize).toBeGreaterThan(0);
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
