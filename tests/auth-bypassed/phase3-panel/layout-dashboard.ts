import { expect } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

// Shared setup for the specs that read provisioning/dashboards/Layout-Space-Optimization.json.
// Not a *.spec.ts, so Playwright's default testMatch does not collect it as a test file.
//
// rowCounts is how many polygons share each y, top row first. Flat-top staggers by column,
// so its 20 items land on 4 alternating y values rather than 2 full rows.
//
// These are the column counts findOptimalColumns picks for each panel's rendered pixel size, so
// they depend on Grafana's chrome as well as on the optimizer. Measured at the pinned viewport
// against Grafana 10.1 through 13.2, where panels 1-5 render 1550x170, 762x398, 368x854, 1156x170
// and 1156x246. If a Grafana upgrade shifts a panel across a candidate boundary, re-derive them;
// the spec reports the measured size on failure.
//
// textKinds is which text elements each panel paints, which is what the text-fitting spec counts.
// Only panel 5 enables timestamps.
export const PANELS = [
  { id: 1, name: 'wide 4:1 pointed-top', rowCounts: [11, 9], textKinds: ['label', 'value'] },
  { id: 2, name: 'square 1:1 pointed-top', rowCounts: [6, 6, 4], textKinds: ['label', 'value'] },
  { id: 3, name: 'tall 1:4 pointed-top', rowCounts: [3, 3, 3, 3, 3, 3, 2], textKinds: ['label', 'value'] },
  { id: 4, name: 'wide 4:1 flat-top', rowCounts: [6, 5, 5, 4], textKinds: ['label', 'value'] },
  {
    id: 5,
    name: 'flat-top with timestamp',
    rowCounts: [3, 3],
    textKinds: ['label', 'value', 'timestamp'],
  },
];

export const itemCount = (rowCounts: number[]) => rowCounts.reduce((total, count) => total + count, 0);

export const TOTAL_ITEMS = PANELS.reduce((total, panel) => total + itemCount(panel.rowCounts), 0);

// The dashboard is 44 grid rows tall; a 720p viewport would leave the lower panels unmounted
export const LAYOUT_VIEWPORT = { width: 1600, height: 2400 };

/**
 * Opens the dashboard and waits for every panel to paint, not just the first.
 *
 * The label count doubles as an error check: detectLayoutIssue() renders only an error div, with
 * no labels at all, so a panel falling back to it cannot reach the expected total.
 */
export const openLayoutDashboard = async (page: Page) => {
  await page.goto('/d/layout-space-opt/layout-space-optimization?kiosk');
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(TOTAL_ITEMS, { timeout: 30000 });
};
