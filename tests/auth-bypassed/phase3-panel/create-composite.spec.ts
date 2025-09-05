import { expect, test } from '@grafana/plugin-e2e';

test('test composite creation', async ({ page, panelEditPage }) => {
  await panelEditPage.datasource.set('TestData DB');
  await panelEditPage.setVisualization('Polystat');
  await page.getByLabel('Series count', { exact: true }).click();
  await page.getByLabel('Series count', { exact: true }).fill('10');
  await page.getByTestId('data-testid RefreshPicker run button').click();
  await page.getByLabel('Composites', { exact: true }).click();
  await page.getByRole('button', { name: 'Add Composite' }).click();
  await page.getByLabel('Composites Composites field').getByRole('textbox').nth(1).fill('Composite-A');
  await page.getByLabel('Composites Composites field').getByRole('textbox').nth(1).press('Enter');
  await page.getByRole('button', { name: 'Add Metric' }).click();
  await page.locator('#cmi-field-index-0').getByRole('textbox').pressSequentially('/A.*/');
  await page.keyboard.press('Enter');
  await expect(panelEditPage.refreshPanel()).toBeOK();
  // without the display limit set to 10, this will be "dotted"
  await expect(panelEditPage.panel.locator.getByText('Composite-A')).toBeVisible();
});
