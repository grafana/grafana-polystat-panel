import { expect, test } from '@grafana/plugin-e2e';

test('test composite creation', async ({ page, gotoPanelEditPage }) => {
  // start from the provisioned Polystat panel; plugin-e2e's setVisualization is unreliable on Grafana 12.4
  const panelEditPage = await gotoPanelEditPage({ dashboard: { uid: 'e2e-test-dashboard' }, id: '1' });
  await panelEditPage.datasource.set('TestData DB');
  await page.getByRole('spinbutton', { name: 'Series count', exact: true }).fill('10');
  await page.getByTestId('data-testid RefreshPicker run button').click();
  await page.getByRole('button', { name: 'Add Composite' }).click();

  // Composite name — data-testid added to Input in CompositeItem.tsx
  await page.getByTestId('composite-name-input-0').fill('Composite-A');

  await page.getByRole('button', { name: 'Add Metric' }).click();

  // Metric/RegEx — Field wrapper keeps id="cmi-field-index-0" from CompositeMetricItem.tsx
  // Cascader with allowCustomValue: pressSequentially + Enter commits the custom value
  const metricInput = page.locator('#cmi-field-index-0').locator('input');
  await metricInput.pressSequentially('/A.*/');
  await metricInput.press('Enter');

  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.locator.getByText('Composite-A')).toBeVisible();
});
