import { test, expect } from '@playwright/test';

test('Check Grafana Version from Help Button', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const locator = page.getByRole('button', { name: 'Help' });
  await locator.waitFor();
  await locator.click();
  const versionPattern = RegExp('Grafana v\\d+');
  await expect(page.getByText(versionPattern)).toContainText('Grafana v');
});
