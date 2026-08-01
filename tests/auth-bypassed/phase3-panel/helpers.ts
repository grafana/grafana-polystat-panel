import type { Page } from '@playwright/test';

// Provisioned dashboards under provisioning/dashboards use the same string for their uid and slug.
export const gotoProvisionedDashboard = (page: Page, uid: string) => page.goto(`/d/${uid}/${uid}?kiosk`);

// Grafana has to start, load the plugin and run the query before anything is painted, so the first
// assertion in a spec needs a longer timeout than Playwright's default.
export const RENDER_TIMEOUT = 30000;
