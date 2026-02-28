/*jshint esversion: 9 */

process.env.TZ = 'UTC';
const { grafanaESModules, nodeModulesToTransform } = require('./.config/jest/utils');
const base = require('./.config/jest.config');

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@grafana/polystat-composites$': '<rootDir>/packages/polystat-composites/src/index.ts',
    '^@grafana/polystat-composites/core$': '<rootDir>/packages/polystat-composites/src/core/index.ts',
    '^@grafana/polystat-composites/editor$': '<rootDir>/packages/polystat-composites/src/editor/index.ts',
    '^@grafana/polystat-composites/migrations$': '<rootDir>/packages/polystat-composites/src/migrations/index.ts',
  },
  // Inform jest to only transform specific node_module packages.
  transformIgnorePatterns: [nodeModulesToTransform([...grafanaESModules, 'rxjs', 'robust-predicates', 'd3-.*', 'delaunator', 'internmap'])],
};
