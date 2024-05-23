import { test, expect } from '@playwright/test';

test('Check Grafana Version from Help Button', async ({ page }) => {
  await page.goto('http://localhost:3000/', {waitUntil: 'networkidle'});
  await page.getByLabel('Help').click();
  await expect(page.getByText('Grafana v')).toContainText('v');
});
