import { expect } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

// Shared setup for the specs that exercise auto-sizing across panel aspect ratios.
// Not a *.spec.ts, so Playwright's default testMatch does not collect it as a test file.
//
// Each case is its own single-panel dashboard under provisioning/dashboards/, sized to fit the
// default viewport in kiosk mode. One combined dashboard needed a 1600x2400 viewport to keep the
// lower panels mounted, which is not a shape any user has open and made a lazy-mount failure look
// like a layout failure.
//
// rowCounts is how many polygons share each y, top row first, and is what findOptimalColumns chose
// for that panel's rendered pixel size. It therefore moves if either the optimizer or Grafana's
// chrome changes; the spec reports the measured size on failure. textKinds is which text elements
// the panel paints, which is what the text-fitting spec counts.
//
// Measured against Grafana 10.1 through 13.2 at the project's default viewport, where the panels
// render 1230x246, 602x550, 131x588, 1230x246 and 916x322. If a Grafana upgrade shifts one across
// a candidate boundary, re-derive its counts.
export interface LayoutPanel {
  uid: string;
  slug: string;
  name: string;
  rowCounts: number[];
  textKinds: string[];
}

export const PANELS: LayoutPanel[] = [
  {
    uid: 'layout-wide-pointed',
    slug: 'layout-wide-pointed-top',
    name: 'wide pointed-top',
    rowCounts: [10, 10],
    textKinds: ['label', 'value'],
  },
  {
    uid: 'layout-square-pointed',
    slug: 'layout-square-pointed-top',
    name: 'square pointed-top',
    rowCounts: [4, 4, 4, 4],
    textKinds: ['label', 'value'],
  },
  {
    uid: 'layout-tall-pointed',
    slug: 'layout-tall-pointed-top',
    name: 'tall pointed-top',
    rowCounts: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    textKinds: ['label', 'value'],
  },
  {
    uid: 'layout-wide-flat',
    slug: 'layout-wide-flat-top',
    name: 'wide flat-top',
    rowCounts: [5, 5, 5, 5],
    textKinds: ['label', 'value'],
  },
  {
    uid: 'layout-flat-timestamp',
    slug: 'layout-flat-top-timestamp',
    name: 'flat-top with timestamp',
    rowCounts: [3, 3],
    textKinds: ['label', 'value', 'timestamp'],
  },
];

export const itemCount = (rowCounts: number[]) => rowCounts.reduce((total, count) => total + count, 0);

/**
 * Opens one case's dashboard and waits for its panel to paint.
 *
 * The label count doubles as an error check: detectLayoutIssue() renders only an error div, with no
 * labels at all, so a panel falling back to it cannot reach the expected count.
 */
export const openLayoutPanel = async (page: Page, panel: LayoutPanel) => {
  await page.goto(`/d/${panel.uid}/${panel.slug}?kiosk`);
  await expect(page.locator('[data-testid^="polystat-label-1-"]')).toHaveCount(itemCount(panel.rowCounts), {
    timeout: 30000,
  });
};
