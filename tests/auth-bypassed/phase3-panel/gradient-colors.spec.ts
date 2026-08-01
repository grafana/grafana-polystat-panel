import { expect, test } from '@grafana/plugin-e2e';

// Guards the coarse gradient failures: polygons painted all black (a stop-color the browser
// could not parse, or a fill pointing at a gradient that is not in defs) and polygons painted
// one solid color (both stops identical, so no gradient at all). Exact channel math belongs to
// src/components/gradients/color.test.ts, so no color values are asserted here.
test('polygons are filled with a real two-tone gradient', async ({ page }) => {
  await page.goto('/d/gradient-colors-test/gradient-colors-test?kiosk');
  await expect(page.locator('path[fill^="url(#"]').first()).toBeAttached({ timeout: 30000 });

  const fills = await page.evaluate(() =>
    Array.from(document.querySelectorAll<SVGPathElement>('path[fill^="url(#"]')).map((path) => {
      const gradientId = path.getAttribute('fill')!.slice('url(#'.length, -1);
      const gradient = document.getElementById(gradientId);
      return {
        gradientId,
        found: gradient !== null,
        stopColors: Array.from(gradient?.querySelectorAll('stop') ?? []).map(
          (stop) => getComputedStyle(stop).stopColor
        ),
      };
    })
  );

  expect(fills.length).toBeGreaterThan(0);

  for (const fill of fills) {
    expect(fill.found).toBe(true);
    expect(fill.stopColors).toHaveLength(2);
    // a gradient whose stops match is a solid fill
    expect(fill.stopColors[0]).not.toBe(fill.stopColors[1]);
    for (const stopColor of fill.stopColors) {
      expect(stopColor).not.toBe('rgb(0, 0, 0)');
      expect(stopColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  }

  // one gradient per polygon, no reuse
  expect(new Set(fills.map((fill) => fill.gradientId)).size).toBe(fills.length);
});
