import { expect, test } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

// Auto-sizing has to pack every polygon into the panel and center what it packs, across
// extreme aspect ratios. Pixel sizes are not asserted, they move with Grafana's chrome.
//
// Panel ids come from provisioning/dashboards/Layout-Space-Optimization.json:
//   1 = wide 4:1 pointed-top (20 items), 2 = square 1:1 pointed-top (16 items),
//   3 = tall 1:4 pointed-top (20 items), 4 = wide 4:1 flat-top (20 items)
//
// rowCounts is how many polygons share each y, top row first. Flat-top staggers by column,
// so its 20 items land on 4 alternating y values rather than 2 full rows.
const PANELS = [
  { id: 1, name: 'wide 4:1 pointed-top', rowCounts: [11, 9] },
  { id: 2, name: 'square 1:1 pointed-top', rowCounts: [6, 6, 4] },
  { id: 3, name: 'tall 1:4 pointed-top', rowCounts: [3, 3, 3, 3, 3, 3, 2] },
  { id: 4, name: 'wide 4:1 flat-top', rowCounts: [6, 5, 5, 4] },
];
const TOTAL_ITEMS = PANELS.reduce((sum, panel) => sum + panel.rowCounts.reduce((a, b) => a + b, 0), 0);

/**
 * Reads the polygon layout out of the svg that owns the given panel's labels. Anchoring on a
 * plugin data-testid keeps Grafana's own chrome svgs out of the query.
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

// The dashboard is ~36 grid rows tall; a 720p viewport would leave the lower panels unmounted
test.use({ viewport: { width: 1600, height: 2400 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/d/layout-space-opt/layout-space-optimization?kiosk');
  // every panel has painted, not just the first
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(TOTAL_ITEMS, { timeout: 30000 });
});

for (const panel of PANELS) {
  test(`${panel.name} packs and centers its polygons`, async ({ page }) => {
    const items = panel.rowCounts.reduce((a, b) => a + b, 0);
    await expect(page.locator(`[data-testid^="polystat-label-${panel.id}-"]`)).toHaveCount(items);

    const { rowCounts, gaps } = await readLayout(page, panel.id);

    expect(rowCounts).toEqual(panel.rowCounts);
    expect(gaps.left).toBe(gaps.right);
    expect(gaps.top).toBe(gaps.bottom);
  });
}

test('no panel falls back to the layout error message', async ({ page }) => {
  await expect(page.getByText('Not enough rows and columns for data')).toHaveCount(0);
});
