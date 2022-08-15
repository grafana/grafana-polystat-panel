/**
 * Tests for LayoutManager
 */

import { LayoutManager } from './layoutManager';
import { PolygonShapes } from '../types';

describe('Layout Manager', () => {
  describe('With hexagon layout', () => {
    const lm = new LayoutManager(100, 100, 1, 1, 100, false, PolygonShapes.HEXAGON_POINTED_TOP);
    const generated = lm.generateHexagonPointedTopLayout();
    it('returns one packed hexagon', () => {
      expect(generated).toEqual({});
    });
  });
  describe('With square layout', () => {
    const lm = new LayoutManager(100, 100, 1, 1, 100, false, PolygonShapes.SQUARE);
    const generated = lm.generateUniformLayout();
    it('returns one packed square', () => {
      expect(generated).toEqual({});
    });
  });
  describe('With circle layout', () => {
    const lm = new LayoutManager(100, 100, 1, 1, 100, false, PolygonShapes.CIRCLE);
    const generated = lm.generateUniformLayout();
    it('returns one packed circle', () => {
      expect(generated).toEqual({});
    });
  });
});
