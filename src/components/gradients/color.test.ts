/**
 * Tests for color helpers (hex-string based, backed by @grafana/data colorManipulator)
 */

import { normalizeToHex, darken } from './color';

describe('normalizeToHex', () => {
  it.each([
    ['hex unchanged', '#ed8128', '#ed8128'],
    ['rgba full alpha to hex', 'rgba(41, 156, 70, 1)', '#299c46'],
    ['rgba full alpha to hex (critical)', 'rgba(245, 54, 54, 1)', '#f53636'],
    // 1-unit alpha byte drift vs the old Color.RGBAToHex ('#ed8128e2'), accepted as negligible
    ['rgba partial alpha to 8-digit hex', 'rgba(237, 129, 40, 0.89)', '#ed8128e3'],
  ])('%s', (_name, input, expected) => {
    expect(normalizeToHex(input)).toBe(expected);
  });
});

describe('darken', () => {
  it.each([
    ['scales channels by factor', '#ed8128', 0.7, '#a65a1c'],
    ['darkens ok color', '#299c46', 0.7, '#1d6d31'],
    ['darkens critical color', '#f53636', 0.7, '#ac2626'],
    ['black unchanged', '#000000', 0.7, '#000000'],
    ['white unchanged at factor 1', '#ffffff', 1, '#ffffff'],
    ['invalid color unchanged', 'not-a-color', 0.7, 'not-a-color'],
    ['non-rgb color unchanged', 'hsl(120, 100%, 50%)', 0.7, 'hsl(120, 100%, 50%)'],
  ])('%s', (_name, hex, factor, expected) => {
    expect(darken(hex, factor)).toBe(expected);
  });
});
