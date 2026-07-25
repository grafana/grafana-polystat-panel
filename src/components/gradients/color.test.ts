/**
 * Tests for color helpers (hex-string based, backed by @grafana/data colorManipulator)
 */

import { normalizeToHex, darken } from './color';

describe('normalizeToHex', () => {
  it('returns hex input unchanged', () => {
    expect(normalizeToHex('#ed8128')).toBe('#ed8128');
  });

  it('converts rgba with full alpha to hex', () => {
    expect(normalizeToHex('rgba(41, 156, 70, 1)')).toBe('#299c46');
  });

  it('converts rgba with full alpha to hex for critical color', () => {
    expect(normalizeToHex('rgba(245, 54, 54, 1)')).toBe('#f53636');
  });
});

describe('darken', () => {
  it('scales each channel by the given factor', () => {
    expect(darken('#ed8128', 0.7)).toBe('#a65a1c');
  });

  it('matches the Gradients.tsx production pipeline for the ok color', () => {
    expect(darken('#299c46', 0.7)).toBe('#1d6d31');
  });

  it('matches the Gradients.tsx production pipeline for the critical color', () => {
    expect(darken('#f53636', 0.7)).toBe('#ac2626');
  });

  it('leaves black unchanged regardless of factor', () => {
    expect(darken('#000000', 0.7)).toBe('#000000');
  });

  it('leaves white unchanged at factor 1', () => {
    expect(darken('#ffffff', 1)).toBe('#ffffff');
  });

  it('returns input unchanged when it is not a valid hex color', () => {
    expect(darken('not-a-color', 0.7)).toBe('not-a-color');
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
