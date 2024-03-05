import { expect, test } from '@grafana/plugin-e2e';

test('check grafana version', async ({ grafanaVersion }) => {
  expect(grafanaVersion).toEqual("10.3.3");
});

test('data query should return polystat with label A-series', async ({ panelEditPage }) => {
  await panelEditPage.datasource.set('gdev-testdata');
  await panelEditPage.setVisualization('Polystat');
  // first render will show OK in the display
  await expect(panelEditPage.panel.locator.getByText('OK')).toBeVisible();
  await expect(panelEditPage.refreshPanel()).toBeOK();
  // second will show A-series
  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.locator.getByText('A-series')).toBeVisible();
});
