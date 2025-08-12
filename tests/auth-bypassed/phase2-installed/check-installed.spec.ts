import { test, expect } from '@playwright/test';

import packageJSON from '../../../package.json';

test('Check Plugin Installed', async ({ page }) => {
  // construct url to the plugin
  const urlToPlugin = `http://localhost:3000/plugins/${packageJSON.name}`;
  await page.goto(urlToPlugin);
  const locator = page.getByRole('button', { name: 'Help' });
  await locator.waitFor();
  // get version from package.json
  const pluginVersion = packageJSON.version;
  const pattern = new RegExp(`Version:?.*${pluginVersion}`);
  await expect(page.getByText(pattern).first()).toContainText(pluginVersion);
});
