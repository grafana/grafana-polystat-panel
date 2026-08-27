import { expect, test } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

import { itemCount, LAYOUT_VIEWPORT, openLayoutDashboard, PANELS } from './layout-dashboard';

// Auto-sizing has to pack every polygon into the panel and center what it packs, across
// extreme aspect ratios. Pixel sizes are not asserted, they move with Grafana's chrome.

/**
 * Reads the polygon layout out of the svg that owns the given panel's labels. Anchoring on a
 * plugin data-testid keeps the svg elements in Grafana's own chrome out of the query.
 *
 * Returns the polygon count per row and the gap between the outermost polygon centers and the
 * viewBox edges, rounded to whole pixels. Equal gaps on opposing edges means the grid is centered.
 */
const readLayout = (page: Page, panelId: number) =>
  page.locator(`[data-testid="polystat-label-${panelId}-0"]`).evaluate((label: SVGTextElement) => {
    const svg = label.closest('svg')!;
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
      rowCounts,
      gaps: {
        left: Math.round(Math.min(...xs) - viewX),
        right: Math.round(viewX + viewWidth - Math.max(...xs)),
        top: Math.round(Math.min(...ys) - viewY),
        bottom: Math.round(viewY + viewHeight - Math.max(...ys)),
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

    const { rowCounts, gaps } = await readLayout(page, panel.id);

    expect(rowCounts).toEqual(panel.rowCounts);
    expect(gaps.left).toBe(gaps.right);
    expect(gaps.top).toBe(gaps.bottom);
  });
}
