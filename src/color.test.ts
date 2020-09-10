/**
 * Tests for Color
 */

import { Color } from './color';

describe('Color Gradient', () => {
  describe('With rgba', () => {
    const rgbaValue = 'rgba(237, 129, 40, 0.89)';
    it('returns valid gradient', () => {
      const generated = Color.RGBAToHex(rgbaValue);
      expect(generated).toEqual('#ed8128e2');
    });
  });
});
