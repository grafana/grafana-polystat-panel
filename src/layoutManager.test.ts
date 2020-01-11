/**
 * Tests for LayoutManager
 */

import { LayoutManager } from './layoutManager';

describe('Layout Manager', () => {
  describe('With hexagon layout', () => {
    const lm = new LayoutManager(100, 100, 1, 1, 100, 'hexagon_pointed_top');
    const generated = lm.generateHexagonPointedTopLayout();
    it('returns one packed hexagon', () => {
      expect(generated).toEqual({});
    });
  });
  describe('With square layout', () => {
    const lm = new LayoutManager(100, 100, 1, 1, 100, 'square');
    const generated = lm.generateSquareLayout();
    it('returns one packed square', () => {
      expect(generated).toEqual({});
    });
  });
});
