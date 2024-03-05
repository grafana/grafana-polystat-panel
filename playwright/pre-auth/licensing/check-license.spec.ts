import { expect, test } from '@grafana/plugin-e2e';
import { Page } from '@playwright/test';

test('check grafana license status', async ({ page }) => {
  await isLicensed(page, true);
});

async function isLicensed(page: Page, expected: boolean) {
  return await expect(page.locator('id=license')).toHaveText('Open Source');
}
