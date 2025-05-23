import { test, expect } from '@playwright/test';

import packageJSON from '../../../package.json';

test('Check Plugin Installed', async ({ page }) => {
  //await page.goto('http://localhost:3000/plugins');
  await page.goto('http://localhost:3000/plugins/grafana-polystat-panel', {waitUntil: 'networkidle'});
  // get version from package.json
  const pluginVersion = packageJSON.version;
  await expect(page.getByText(new RegExp(`Version:?\\s*${pluginVersion}`)).first()).toContainText(pluginVersion);
});
