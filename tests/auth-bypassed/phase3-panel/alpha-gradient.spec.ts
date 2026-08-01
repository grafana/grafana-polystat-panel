import { expect, test } from '@grafana/plugin-e2e';

// A fill color with alpha < 1 keeps its alpha in the gradient stops. The old Color
// class dropped it, so translucent colors rendered opaque under gradients while
// rendering translucent with gradients off.
test('translucent fill color keeps its alpha in the gradient stops', async ({ page }) => {
  await page.goto('/d/alpha-gradient-test/alpha-gradient-test?kiosk');
  const stops = page.locator('linearGradient[id$="_linear_gradient_state_data_0"] stop');
  await expect(stops.first()).toBeAttached({ timeout: 30000 });

  const rendered = await stops.evaluateAll((nodes) =>
    nodes.map((node) => ({
      stopColor: node.getAttribute('stop-color'),
      computed: getComputedStyle(node).stopColor,
    }))
  );

  expect(rendered).toEqual([
    { stopColor: '#f5363680', computed: 'rgba(245, 54, 54, 0.5)' },
    { stopColor: '#ac262680', computed: 'rgba(172, 38, 38, 0.5)' },
  ]);
});
