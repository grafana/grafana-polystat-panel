import { expect, test } from '@grafana/plugin-e2e';

test('data query should return polystat with label A-series', async ({ panelEditPage }) => {
  await panelEditPage.datasource.set('TestData DB');
  await panelEditPage.setVisualization('Polystat');
  // panel will display A-series
  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.locator.getByText('A-series')).toBeVisible();
});
