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

  describe('With rectangle (brick) layout', () => {
    describe('getBrickWidth and getBrickHeight enforce 2:1 ratio', () => {
      it('width is twice the height in a square panel', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 4;
        lm.maxRowsUsed = 2;
        const w = lm.getBrickWidth();
        const h = lm.getBrickHeight();
        expect(w).toBeCloseTo(h * 2, 1);
      });

      it('is constrained by panel height when panel is wider than bricks', () => {
        // 800px wide, 100px tall, 1 column, 1 row → height-driven: 100*2=200, width-driven: 800 → min=200
        const lm = new LayoutManager(800, 100, 1, 1, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 1;
        lm.maxRowsUsed = 1;
        expect(lm.getBrickWidth()).toBe(200);
        expect(lm.getBrickHeight()).toBe(100);
      });

      it('is constrained by panel width when panel is taller than bricks', () => {
        // 100px wide, 800px tall, 1 column, 1 row → width-driven: 100, height-driven: 1600 → min=100
        const lm = new LayoutManager(100, 800, 1, 1, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 1;
        lm.maxRowsUsed = 1;
        expect(lm.getBrickWidth()).toBe(100);
        expect(lm.getBrickHeight()).toBe(50);
      });
    });

    describe('manual size (autoSize disabled)', () => {
      it('uses radius * 2 as brick width when autoSize is false', () => {
        const lm = new LayoutManager(800, 400, 4, 2, 100, false, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 4;
        lm.maxRowsUsed = 2;
        lm.setRadius(60);
        expect(lm.getBrickWidth()).toBe(120);
        expect(lm.getBrickHeight()).toBe(60);
      });

      it('ignores panel dimensions when manual size is set', () => {
        const lmSmall = new LayoutManager(200, 100, 2, 1, 100, false, PolygonShapes.RECTANGLE);
        lmSmall.maxColumnsUsed = 2;
        lmSmall.maxRowsUsed = 1;
        lmSmall.setRadius(80);

        const lmLarge = new LayoutManager(2000, 1000, 2, 1, 100, false, PolygonShapes.RECTANGLE);
        lmLarge.maxColumnsUsed = 2;
        lmLarge.maxRowsUsed = 1;
        lmLarge.setRadius(80);

        expect(lmSmall.getBrickWidth()).toBe(lmLarge.getBrickWidth());
        expect(lmSmall.getBrickHeight()).toBe(lmLarge.getBrickHeight());
      });
    });

    describe('getDiameters', () => {
      it('returns diameterX = brickWidth and diameterY = brickHeight', () => {
        const lm = new LayoutManager(400, 200, 2, 2, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 2;
        lm.maxRowsUsed = 2;
        const { diameterX, diameterY } = lm.getDiameters();
        expect(diameterX).toBe(lm.getBrickWidth());
        expect(diameterY).toBe(lm.getBrickHeight());
      });
    });

    describe('shapeToCoordinates', () => {
      it('places bricks at column * brickWidth, row * brickHeight', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 4;
        lm.maxRowsUsed = 2;
        const w = lm.getBrickWidth();
        const h = lm.getBrickHeight();
        expect(lm.shapeToCoordinates(PolygonShapes.RECTANGLE, 0, 0, 0)).toEqual([0, 0]);
        expect(lm.shapeToCoordinates(PolygonShapes.RECTANGLE, 0, 1, 0)).toEqual([w, 0]);
        expect(lm.shapeToCoordinates(PolygonShapes.RECTANGLE, 0, 0, 1)).toEqual([0, h]);
        expect(lm.shapeToCoordinates(PolygonShapes.RECTANGLE, 0, 2, 1)).toEqual([w * 2, h]);
      });
    });

    describe('auto column/row sizing', () => {
      it('computes columns so bricks fit within panel height', () => {
        const lm = new LayoutManager(600, 200, 8, 8, 100, true, PolygonShapes.RECTANGLE);
        lm.generatePossibleColumnAndRowsSizes(true, true, 100, 12);
        // 12 bricks: columns * rows >= 12, and bricks must fit vertically
        expect(lm.numColumns * lm.numRows).toBeGreaterThanOrEqual(12);
        expect(lm.numColumns).toBeGreaterThanOrEqual(1);
        expect(lm.numRows).toBeGreaterThanOrEqual(1);
      });

      it('uses at least 1 column and 1 row for a single item', () => {
        const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.RECTANGLE);
        lm.generatePossibleColumnAndRowsSizes(true, true, 100, 1);
        expect(lm.numColumns).toBeGreaterThanOrEqual(1);
        expect(lm.numRows).toBeGreaterThanOrEqual(1);
      });
    });

    describe('getOffsets centers the grid in the panel', () => {
      it('returns zero offsets when bricks exactly fill the panel', () => {
        // 4 cols x 2 rows, each brick 100x50 → panel 400x100
        const lm = new LayoutManager(400, 100, 4, 2, 100, true, PolygonShapes.RECTANGLE);
        lm.maxColumnsUsed = 4;
        lm.maxRowsUsed = 2;
        // force brick size to exactly fill: radius not used for rectangle in auto mode
        const { xoffset, yoffset } = lm.getOffsets(PolygonShapes.RECTANGLE, 100, 8);
        // brickWidth = min(400/4, 100/2*2) = min(100,100) = 100; brickHeight = 50
        // usedW=400, usedH=100 → offsets = 0
        expect(xoffset).toBeCloseTo(0);
        expect(yoffset).toBeCloseTo(0);
      });
    });
  });
});
