/**
 * Tests for color helpers (hex-string based, backed by @grafana/data colorManipulator)
 */

import { normalizeToHex, darken } from './color';

describe('normalizeToHex', () => {
  it.each([
    ['returns hex input unchanged', '#ed8128', '#ed8128'],
    ['converts rgba with full alpha to hex', 'rgba(41, 156, 70, 1)', '#299c46'],
    ['converts rgba with full alpha to hex for critical color', 'rgba(245, 54, 54, 1)', '#f53636'],
    // colorManipulator.asHexString rounds the alpha byte differently than the old Color.RGBAToHex
    // (which produced '#ed8128e2' for this input) — 1-unit alpha drift, accepted as visually negligible.
    ['converts rgba with partial alpha to 8-digit hex', 'rgba(237, 129, 40, 0.89)', '#ed8128e3'],
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
