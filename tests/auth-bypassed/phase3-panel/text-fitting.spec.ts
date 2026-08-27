import { expect, test } from '@grafana/plugin-e2e';

import { itemCount, LAYOUT_VIEWPORT, openLayoutDashboard, PANELS } from './layout-dashboard';

// Label and value text has to stay inside the polygon it belongs to. Both hexagons narrow away
// from their center, so a text box sized against the widest point escapes through the angled
// edges. The unit tests mock measureText, so only a browser can confirm the real glyph widths.
//
// Panel 4 renders values up to '20.00', the width that used to escape the flat-top edges. Panel 5
// is flat-top with timestamps, where the label, value and timestamp share the same narrowed box.

test.use({ viewport: LAYOUT_VIEWPORT });

test.beforeEach(async ({ page }) => {
  await openLayoutDashboard(page);
});

for (const panel of PANELS) {
  test(`${panel.name} keeps all text inside its polygons`, async ({ page }) => {
    const { checked, escaped } = await page.locator(`[data-testid="polystat-label-${panel.id}-0"]`).evaluate(
      (label: SVGTextElement, { panelId, textKinds }) => {
        const svg = label.closest('svg')!;
        const outside: Array<{ index: number; kind: string; text: string }> = [];
        // counted so a missed lookup shows up as under-coverage instead of a silent pass
        let inspected = 0;

        Array.from(svg.querySelectorAll('path[transform]')).forEach((polygon, index) => {
          const match = polygon.getAttribute('transform')!.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/)!;
          const centerX = Number(match[1]);
          const centerY = Number(match[2]);

          for (const kind of textKinds) {
            const text = svg.querySelector(`[data-testid="polystat-${kind}-${panelId}-${index}"]`) as SVGTextElement;
            if (!text) {
              continue;
            }
            const box = text.getBBox();
            // a 0px font gives a zero-size box whose corners all collapse onto the anchor, which is
            // always inside the polygon. Counting only painted boxes keeps that from passing as a
            // check; AutoFontScaler emits 0px whenever the text will not fit.
            if (box.width === 0 || box.height === 0) {
              continue;
            }
            inspected++;
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
        return { checked: inspected, escaped: outside };
      },
      { panelId: panel.id, textKinds: panel.textKinds }
    );

    // every polygon must contribute each of its text kinds, or the check below inspected nothing
    expect(checked).toBe(itemCount(panel.rowCounts) * panel.textKinds.length);
    expect(escaped).toEqual([]);
  });
}
