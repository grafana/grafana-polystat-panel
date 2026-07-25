/**
 * Tests for color helpers (hex-string based, backed by @grafana/data colorManipulator)
 */

import { normalizeToHex, darken } from './color';

describe('normalizeToHex', () => {
  it.each([
    ['returns hex input unchanged', '#ed8128', '#ed8128'],
    ['converts rgba with full alpha to hex', 'rgba(41, 156, 70, 1)', '#299c46'],
    ['converts rgba with full alpha to hex for critical color', 'rgba(245, 54, 54, 1)', '#f53636'],
  ])('%s', (_name, input, expected) => {
    expect(normalizeToHex(input)).toBe(expected);
  });
});

describe('darken', () => {
  it.each([
    ['scales each channel by the given factor', '#ed8128', 0.7, '#a65a1c'],
    ['matches the Gradients.tsx production pipeline for the ok color', '#299c46', 0.7, '#1d6d31'],
    ['matches the Gradients.tsx production pipeline for the critical color', '#f53636', 0.7, '#ac2626'],
    ['leaves black unchanged regardless of factor', '#000000', 0.7, '#000000'],
    ['leaves white unchanged at factor 1', '#ffffff', 1, '#ffffff'],
    ['returns input unchanged when it is not a valid hex color', 'not-a-color', 0.7, 'not-a-color'],
  ])('%s', (_name, hex, factor, expected) => {
    expect(darken(hex, factor)).toBe(expected);
  });
});

describe('Gradients.tsx production path', () => {
  it('reproduces the gradient generation pipeline for hex input', () => {
    const startHex = normalizeToHex('#ed8128');
    const endHex = darken(startHex, 0.7);
    expect(startHex).toBe('#ed8128');
    expect(endHex).toBe('#a65a1c');
  });

  it('reproduces the gradient generation pipeline for rgba input', () => {
    const startHex = normalizeToHex('rgba(41, 156, 70, 1)');
    const endHex = darken(startHex, 0.7);
    expect(startHex).toBe('#299c46');
    expect(endHex).toBe('#1d6d31');
  });
});
