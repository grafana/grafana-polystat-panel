import { test, expect } from '@playwright/test';

test('Check Grafana Version from Help Button', async ({ page }) => {
  // Navigate to a provisioned dashboard to bypass Grafana 13+ home-page modals
  await page.goto('http://localhost:3000/d/e2e-test-dashboard');
  const locator = page.getByRole('button', { name: 'Help' });
  await locator.waitFor();
  await locator.click();
  const versionPattern = RegExp('Grafana v\\d+');
  await expect(page.getByText(versionPattern)).toContainText('Grafana v');
});
