import { expect, test } from '@grafana/plugin-e2e';

test('a11y', { tag: ['@a11y'] }, async ({ panelEditPage, scanForA11yViolations }) => {
  await panelEditPage.datasource.set('TestData DB');
  await panelEditPage.setVisualization('Polystat');
  // panel will display A-series
  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.locator.getByText('A-series')).toBeVisible();

  const locatorStr = panelEditPage.panel.locator.toString();
  const match = locatorStr.match(/locator\((['"])(.*?)\1\)/);
  const selector = match ? match[1] : null;
  const report = await scanForA11yViolations(selector ? { include: selector } : undefined);
  expect(report).toHaveNoA11yViolations();
});
