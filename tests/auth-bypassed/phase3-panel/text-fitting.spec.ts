import { expect, test } from '@grafana/plugin-e2e';

// Label and value text has to stay inside the polygon it belongs to. Both hexagons narrow away
// from their center, so a text box sized against the widest point escapes through the angled
// edges. The unit tests mock measureText, so only a browser can confirm the real glyph widths.
//
// Panels come from provisioning/dashboards/Layout-Space-Optimization.json. Panel 4 renders
// values up to '20.00', which is the width that used to escape the flat-top edges.
const PANELS = [
  { id: 1, name: 'wide 4:1 pointed-top' },
  { id: 2, name: 'square 1:1 pointed-top' },
  { id: 3, name: 'tall 1:4 pointed-top' },
  { id: 4, name: 'wide 4:1 flat-top' },
];
const TOTAL_ITEMS = 76;

// The dashboard is ~36 grid rows tall; a 720p viewport would leave the lower panels unmounted
test.use({ viewport: { width: 1600, height: 2400 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/d/layout-space-opt/layout-space-optimization?kiosk');
  await expect(page.locator('[data-testid^="polystat-label-"]')).toHaveCount(TOTAL_ITEMS, { timeout: 30000 });
});

for (const panel of PANELS) {
  test(`${panel.name} keeps all text inside its polygons`, async ({ page }) => {
    const escaped = await page
      .locator(`[data-testid="polystat-label-${panel.id}-0"]`)
      .evaluate((label: SVGTextElement, panelId) => {
        const svg = label.closest('svg')!;
        const outside: Array<{ index: number; kind: string; text: string }> = [];

        Array.from(svg.querySelectorAll('path[transform]')).forEach((polygon, index) => {
          const match = polygon.getAttribute('transform')!.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/)!;
          const centerX = Number(match[1]);
          const centerY = Number(match[2]);

          for (const kind of ['label', 'value']) {
            const text = svg.querySelector(`[data-testid="polystat-${kind}-${panelId}-${index}"]`) as SVGTextElement;
            if (!text) {
              continue;
            }
            const box = text.getBBox();
            const corners = [
              [box.x, box.y],
              [box.x + box.width, box.y],
              [box.x, box.y + box.height],
              [box.x + box.width, box.y + box.height],
            ];
            // the path's own geometry decides what is inside, so the shapes stay defined in one place.
            // its d is drawn around the origin, so corners are measured relative to the polygon center.
            const escapes = corners.some(
              ([x, y]) => !(polygon as SVGGeometryElement).isPointInFill(new DOMPoint(x - centerX, y - centerY))
            );
            if (escapes) {
              outside.push({ index, kind, text: text.textContent ?? '' });
            }
          }
        });
        return outside;
      }, panel.id);

    expect(escaped).toEqual([]);
  });
}
