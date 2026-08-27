import { expect, test } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

import { itemCount, LAYOUT_VIEWPORT, openLayoutDashboard, PANELS } from './layout-dashboard';

// Auto-sizing has to pack every polygon into the panel and center what it packs, across
// extreme aspect ratios. Pixel sizes are not asserted, they move with Grafana's chrome.

/**
 * Reads the polygon layout out of the svg that owns the given panel's labels. Anchoring on a
 * plugin data-testid keeps the svg elements in Grafana's own chrome out of the query.
 *
 * Returns the polygon count per row and the unrounded gap between the outermost polygon centers
 * and the viewBox edges. Equal gaps on opposing edges means the grid is centered.
 */
const readLayout = (page: Page, panelId: number) =>
  page.locator(`[data-testid="polystat-label-${panelId}-0"]`).evaluate((label: SVGTextElement) => {
    const svg = label.closest('svg')!;
    const panelSize = `${svg.getAttribute('width')}x${svg.getAttribute('height')}`;
    const [viewX, viewY, viewWidth, viewHeight] = svg.getAttribute('viewBox')!.split(',').map(Number);
    const parseTranslate = (element: Element) => {
      const match = element.getAttribute('transform')!.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/)!;
      return { x: Number(match[1]), y: Number(match[2]) };
    };
    const origin = parseTranslate(svg.querySelector('g')!);
    const centers = Array.from(svg.querySelectorAll('path[transform]')).map((path) => {
      const point = parseTranslate(path);
      return { x: origin.x + point.x, y: origin.y + point.y };
    });

    const rows = new Map<number, number>();
    for (const center of centers) {
      rows.set(center.y, (rows.get(center.y) ?? 0) + 1);
    }
    const rowCounts = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, count]) => count);

    const xs = centers.map((center) => center.x);
    const ys = centers.map((center) => center.y);
    return {
      panelSize,
      rowCounts,
      gaps: {
        left: Math.min(...xs) - viewX,
        right: viewX + viewWidth - Math.max(...xs),
        top: Math.min(...ys) - viewY,
        bottom: viewY + viewHeight - Math.max(...ys),
      },
    };
  });

test.use({ viewport: LAYOUT_VIEWPORT });

test.beforeEach(async ({ page }) => {
  await openLayoutDashboard(page);
});

for (const panel of PANELS) {
  test(`${panel.name} packs and centers its polygons`, async ({ page }) => {
    const items = itemCount(panel.rowCounts);
    await expect(page.locator(`[data-testid^="polystat-label-${panel.id}-"]`)).toHaveCount(items);

    const { panelSize, rowCounts, gaps } = await readLayout(page, panel.id);

    // rowCounts is what findOptimalColumns chose for this panel's pixel size, so it moves if either
    // the optimizer or Grafana's chrome changes. Reporting the measured size says which.
    expect(rowCounts, `panel ${panel.id} measured ${panelSize}`).toEqual(panel.rowCounts);
    // round the difference rather than each side: the two differ by a fraction of a pixel from the
    // hex stagger, and rounding them separately flips whenever they straddle a .5 boundary
    expect(Math.round(Math.abs(gaps.left - gaps.right))).toBe(0);
    expect(Math.round(Math.abs(gaps.top - gaps.bottom))).toBe(0);
  });
}
