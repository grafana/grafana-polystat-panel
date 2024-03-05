import { expect, test } from '@grafana/plugin-e2e';

test('check grafana version match', async ({ grafanaVersion }) => {
  expect(grafanaVersion).toEqual("10.3.3");
});

test('check grafana license status', async ({ page }) => {
  await expect(page.locator('id=license')).toHaveText('Open Source');
});

test('check grafana enterprise version with commit hash', async ({ page }) => {
  await expect(page.locator('id=version')).toHaveText('v10.3.3 (252761264e22ece57204b327f9130d3b44592c01)');
});
