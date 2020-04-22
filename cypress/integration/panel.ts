/// <reference path="../../node_modules/@grafana/e2e/cypress/support/index.d.ts" />
import { e2e } from '@grafana/e2e';

const addTestDataSource = () => {
  // This get auto-removed within `afterEach` of @grafana/e2e
  e2e.flows.addDataSource({
    checkHealth: true,
    expectedAlertMessage: 'Success',
    name: 'TestDataDB',
  });
};

const addPanel = () => {
  // @todo remove `@ts-ignore` when possible
  // @ts-ignore
  e2e.getScenarioContext().then(({ lastAddedDataSource }) => {
    // This get auto-removed within `afterEach` of @grafana/e2e
    e2e.flows.addPanel({
      dataSourceName: lastAddedDataSource,
    });
  });
};

e2e.scenario({
  describeName: 'Smoke tests',
  itName: 'Login, create data source, dashboard and panel',
  scenario: () => {
    // Paths are relative to <project-root>/provisioning
    const provisionPaths = [
      'datasources/testdata.yml',
    ];

    e2e().readProvisions(provisionPaths).then(() => {
      addTestDataSource();
      e2e.flows.addDashboard();
      addPanel();
    });
  },
});
