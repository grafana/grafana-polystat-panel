import { expect, test } from '@grafana/plugin-e2e';

test('check grafana version', async ({ grafanaVersion }) => {
  expect(grafanaVersion).toEqual("10.3.3");
});

// TODO: test panel creation
