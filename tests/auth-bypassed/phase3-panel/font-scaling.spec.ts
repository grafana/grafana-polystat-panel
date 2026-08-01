import { expect, test } from '@grafana/plugin-e2e';

// Exercises AutoFontScaler against real browser text metrics. The unit tests in
// src/components/auto_font_scaler.test.ts mock CanvasRenderingContext2D.measureText, so they pin the
// search arithmetic but cannot prove the font sizes hold up against real glyph widths. Exact font
// sizes are not asserted here — they depend on the machine's fonts.
//
// Panel ids come from provisioning/dashboards/Font-Scaling-Test.json:
//   1 = wide panel, 2 = narrow panel (both labelled ServerAlpha), 3 = label too long to fit
const labelOf = (panelId: number) => `[data-testid="polystat-label-${panelId}-0"]`;
const LONG_LABEL = 'AVeryLongServerNameThatCannotPossiblyFitInsideThisPolygon';

test('label font size shrinks with the polygon, and labels too long to fit are truncated', async ({ page }) => {
  await page.goto('/d/font-scaling-test/font-scaling-test?kiosk');
  // every panel has painted, not just the first
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(3, { timeout: 30000 });

  const read = (panelId: number) =>
    page.locator(labelOf(panelId)).evaluate((label) => ({
      text: label.textContent ?? '',
      fontSize: parseFloat(label.getAttribute('font-size') ?? ''),
    }));

  const wide = await read(1);
  const narrow = await read(2);
  const tooLong = await read(3);

  for (const label of [wide, narrow, tooLong]) {
    expect(Number.isNaN(label.fontSize)).toBe(false);
    expect(label.fontSize).not.toBe(0);
  }

  expect(wide.text).toBe('ServerAlpha');
  expect(narrow.text).toBe('ServerAlpha');
  // identical text in a narrower polygon has to be drawn smaller
  expect(narrow.fontSize).toBeLessThan(wide.fontSize);

  // Polystat renders substring(0, numOfChars) + '...', so the painted text is a genuine prefix of
  // the metric name followed by an ellipsis, cut at one of the cascade lengths
  expect(tooLong.text.endsWith('...')).toBe(true);
  const shown = tooLong.text.slice(0, -'...'.length);
  expect(LONG_LABEL.startsWith(shown)).toBe(true);
  expect([6, 10, 18]).toContain(shown.length);
});
