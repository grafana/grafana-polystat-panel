import { expect, test } from '@grafana/plugin-e2e';

test('data query should return polystat with label A-series', async ({ gotoPanelEditPage }) => {
  // start from the provisioned Polystat panel; plugin-e2e's setVisualization is unreliable on Grafana 12.4
  const panelEditPage = await gotoPanelEditPage({ dashboard: { uid: 'e2e-test-dashboard' }, id: '1' });
  await panelEditPage.datasource.set('TestData DB');
  // panel will display A-series
  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.locator.getByText('A-series')).toBeVisible();
});
