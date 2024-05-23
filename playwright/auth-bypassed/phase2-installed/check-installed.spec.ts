import { test, expect } from '@playwright/test';

test('Check Plugin Installed', async ({ page }) => {
  //await page.goto('http://localhost:3000/plugins');
  await page.goto('http://localhost:3000/plugins/grafana-polystat-panel', {waitUntil: 'networkidle'});
//  const pluginVersion = page.getByText('Version', { exact: true });
 // expect(pluginVersion).toHaveText("2.1.11");
  const pluginVersion = '2.1.11';
  await expect(page.getByText(`Version${pluginVersion}`)).toContainText(pluginVersion);
  //expect(found).toBeTruthy;
});
