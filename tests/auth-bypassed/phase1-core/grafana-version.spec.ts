import { test, expect } from '@playwright/test';

test('Check Grafana Version from Help Button', async ({ page }) => {
  await page.goto('http://localhost:3000/', {waitUntil: 'networkidle'});
  // only works from v10+
  await page.getByLabel('Help').click();
  const versionPattern = RegExp('Grafana v\\d+');
  await expect(page.getByText(versionPattern)).toContainText('Grafana v');
});
