import type { Page } from '@playwright/test';

// provisioned dashboards use the same string for their uid and slug
export const gotoProvisionedDashboard = (page: Page, uid: string) => page.goto(`/d/${uid}/${uid}?kiosk`);

// the plugin has to load and the query has to run before anything is painted
export const RENDER_TIMEOUT = 30000;
