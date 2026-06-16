import { test, expect } from '@playwright/test';

import packageJSON from '../../../package.json';

test('Check Plugin Installed', async ({ page }) => {
  const urlToPlugin = `http://localhost:3000/plugins/${packageJSON.name}`;
  await page.goto(urlToPlugin);
  const pluginVersion = packageJSON.version;
  const pattern = new RegExp(`Version:?.*${pluginVersion}`);
  await expect(page.getByText(pattern).first()).toContainText(pluginVersion);
});
