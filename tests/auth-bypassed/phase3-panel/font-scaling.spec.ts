import { expect, test } from '@grafana/plugin-e2e';

// Exercises AutoFontScaler against real browser text metrics. The unit tests in
// src/components/auto_font_scaler.test.ts mock CanvasRenderingContext2D.measureText, so they pin the
// search arithmetic but cannot prove the font sizes hold up against real glyph widths. Exact font
// sizes are not asserted here — they depend on the machine's fonts.
test('label font size shrinks with the polygon, and labels too long to fit are truncated', async ({ page }) => {
  await page.goto('/d/font-scaling-test/font-scaling-test?kiosk');
  await expect(page.locator('[data-testid^="polystat-label-"]').first()).toBeAttached({ timeout: 30000 });
  // all three panels have painted, not just the first
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(3, { timeout: 30000 });

  const labels = await page.evaluate(() =>
    Array.from(document.querySelectorAll<SVGTextElement>('[data-testid^="polystat-label-"]')).map((label) => ({
      text: label.textContent ?? '',
      fontSize: parseFloat(label.getAttribute('font-size') ?? ''),
      // the polygon each label belongs to, used to tell the wide panel from the narrow one
      svgWidth: label.closest('svg')!.getBoundingClientRect().width,
    }))
  );

  for (const label of labels) {
    expect(Number.isNaN(label.fontSize)).toBe(false);
    expect(label.fontSize).not.toBe(0);
  }

  const [wide, narrow] = labels
    .filter((label) => label.text === 'ServerAlpha')
    .sort((a, b) => b.svgWidth - a.svgWidth);

  expect(wide).toBeTruthy();
  expect(narrow).toBeTruthy();
  // identical text in a narrower polygon has to be drawn smaller
  expect(narrow.fontSize).toBeLessThan(wide.fontSize);

  const truncated = labels.find((label) => label.text.endsWith('...'));
  expect(truncated).toBeTruthy();
  // Polystat renders substring(0, numOfChars) + '...', and the cascade stops at 18, 10 or 6
  expect([9, 13, 21]).toContain(truncated!.text.length);
});
