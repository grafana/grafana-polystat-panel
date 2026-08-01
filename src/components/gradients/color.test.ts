/**
 * Tests for color helpers (hex-string based, backed by @grafana/data colorManipulator)
 */

import { darken } from './color';

describe('darken', () => {
  it.each([
    ['scales channels by factor', '#ed8128', 0.7, '#a65a1c'],
    ['darkens ok color', '#299c46', 0.7, '#1d6d31'],
    ['darkens critical color', '#f53636', 0.7, '#ac2626'],
    ['preserves alpha', '#f5363680', 0.7, '#ac262680'],
    ['black unchanged', '#000000', 0.7, '#000000'],
    ['white unchanged at factor 1', '#ffffff', 1, '#ffffff'],
    ['invalid color unchanged', 'not-a-color', 0.7, 'not-a-color'],
    ['non-rgb color unchanged', 'hsl(120, 100%, 50%)', 0.7, 'hsl(120, 100%, 50%)'],
  ])('%s', (_name, hex, factor, expected) => {
    expect(darken(hex, factor)).toBe(expected);
  });
});
