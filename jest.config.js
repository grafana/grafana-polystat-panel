/*jshint esversion: 9 */

process.env.TZ = 'UTC';
const { grafanaESModules, nodeModulesToTransform } = require('./.config/jest/utils');

module.exports = {
  // Jest configuration provided by Grafana
  ...require('./.config/jest.config'),
  // Inform jest to only transform specific node_module packages.
  transformIgnorePatterns: [nodeModulesToTransform([...grafanaESModules, 'rxjs', 'robust-predicates', 'd3-.*', 'delaunator', 'internmap'])],
};
