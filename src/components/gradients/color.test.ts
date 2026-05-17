/**
 * Tests for Color
 */

import { Color, createColor, asHex, asRGB, rgbaToHex, fromHex, mul, blendWith } from './color';

describe('Color', () => {
  describe('createColor', () => {
    it('stores r, g, b values', () => {
      const c = createColor(10, 85, 161);
      expect(c.r).toBe(10);
      expect(c.g).toBe(85);
      expect(c.b).toBe(161);
    });
  });

  describe('asHex', () => {
    it('returns hex string for a color', () => {
      const c = createColor(41, 156, 70);
      expect(asHex(c)).toBe('#299c46');
    });

    it('returns hex string with zero components', () => {
      const c = createColor(0, 0, 0);
      expect(asHex(c)).toBe('#000000');
    });

    it('returns hex string for white', () => {
      const c = createColor(255, 255, 255);
      expect(asHex(c)).toBe('#ffffff');
    });
  });

  describe('asRGB', () => {
    it('returns rgb string', () => {
      const c = createColor(237, 129, 40);
      expect(asRGB(c)).toBe('rgb(237,129,40)');
    });
  });

  describe('rgbaToHex', () => {
    it('returns hex with alpha for rgba input', () => {
      const generated = rgbaToHex('rgba(237, 129, 40, 0.89)');
      expect(generated).toEqual('#ed8128e2');
    });

    it('returns hex with full alpha for rgba(1)', () => {
      const generated = rgbaToHex('rgba(245, 54, 54, 1)');
      expect(generated).toEqual('#f53636ff');
    });
  });

  describe('fromHex', () => {
    it('returns Color with r, g, b from hex string', () => {
      const c = fromHex('#ed8128');
      expect(c.r).toBe(237);
      expect(c.g).toBe(129);
      expect(c.b).toBe(40);
    });
  });

  describe('mul', () => {
    it('returns a multiplied color', () => {
      const start = createColor(237, 129, 40);
      const light = createColor(255, 255, 255);
      const result = mul(start, light, 0.7);
      expect(result.r).toBe(Math.round((255 / 255) * 237 * 0.7));
      expect(result.g).toBe(Math.round((255 / 255) * 129 * 0.7));
      expect(result.b).toBe(Math.round((255 / 255) * 40 * 0.7));
    });

    it('returns a new Color object', () => {
      const start = createColor(100, 100, 100);
      const light = createColor(255, 255, 255);
      const result = mul(start, light, 0.5);
      expect(result).not.toBe(start);
    });
  });

  describe('blendWith', () => {
    it('returns blended color at midpoint', () => {
      const c1 = createColor(0, 0, 0);
      const c2 = createColor(255, 255, 255);
      const result = blendWith(c1, c2, 0.5);
      expect(result.r).toBe(128);
      expect(result.g).toBe(128);
      expect(result.b).toBe(128);
    });

    it('returns other color at alpha 0', () => {
      const c1 = createColor(100, 100, 100);
      const c2 = createColor(200, 200, 200);
      const result = blendWith(c1, c2, 0);
      expect(result.r).toBe(200);
      expect(result.g).toBe(200);
      expect(result.b).toBe(200);
    });

    it('returns self color at alpha 1', () => {
      const c1 = createColor(100, 100, 100);
      const c2 = createColor(200, 200, 200);
      const result = blendWith(c1, c2, 1);
      expect(result.r).toBe(100);
      expect(result.g).toBe(100);
      expect(result.b).toBe(100);
    });
  });

  describe('Gradients.tsx production path', () => {
    it('reproduces the gradient generation pipeline', () => {
      const aColorStart = fromHex(rgbaToHex('rgba(237, 129, 40, 1)'));
      const light = createColor(255, 255, 255);
      const aColorEnd = mul(aColorStart, light, 0.7);
      const startHex = asHex(aColorStart);
      const endHex = asHex(aColorEnd);
      expect(startHex).toBe('#ed8128');
      expect(endHex).toBe('#a65a1c');
    });
  });
});
