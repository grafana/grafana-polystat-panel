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

  describe('getHexPointedTopRadius', () => {
    it('returns a positive radius for a 400x200 panel with 4 cols and 2 rows', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      const r = lm.getHexPointedTopRadius();
      expect(r).toBeGreaterThan(0);
    });
    it('returns a larger radius when given fewer actual cols/rows', () => {
      const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      const rDefault = lm.getHexPointedTopRadius();
      const rActual = lm.getHexPointedTopRadius(2, 2);
      expect(rActual).toBeGreaterThan(rDefault);
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

  describe('findOptimalColumns', () => {
    it('produces a larger radius than the 0.75 heuristic on a wide panel', () => {
      // 0.75 heuristic: cols = ceil(4 * sqrt(20) * 0.75) = ceil(13.4) = 14 → radius ≈ 79.6
      const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      const optCols = lm.findOptimalColumns(20, 2000, 500);
      const optRows = Math.ceil(20 / optCols);
      const SQRT3 = 1.7320508075688772;
      const optRadius = Math.min(
        2000 / ((optCols + 0.5) * SQRT3),
        500  / ((optRows + 1 / 3) * 1.5)
      );
      expect(optRadius).toBeGreaterThan(79.6);
    });

    it('handles a square panel without regression', () => {
      const lm = new LayoutManager(400, 400, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      const cols = lm.findOptimalColumns(16, 400, 400);
      expect(cols).toBeGreaterThanOrEqual(1);
      expect(cols).toBeLessThanOrEqual(16);
    });

    it('returns 1 for a single item', () => {
      const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      expect(lm.findOptimalColumns(1, 400, 200)).toBe(1);
    });

    it('caps at n for large panels', () => {
      const lm = new LayoutManager(5000, 100, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      expect(lm.findOptimalColumns(5, 5000, 100)).toBeLessThanOrEqual(5);
    });
  });

  describe('generatePossibleColumnAndRowsSizes — hex auto-size', () => {
    it('produces more space-efficient column count than 0.75 heuristic on 4:1 panel', () => {
      const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      lm.generatePossibleColumnAndRowsSizes(true, true, 100, 20);
      // old heuristic: cols = ceil(4 * sqrt(20) * 0.75) = 14
      // new optimizer must beat radius achieved with 14 cols
      const SQRT3 = 1.7320508075688772;
      const oldRadius = Math.min(2000 / ((14 + 0.5) * SQRT3), 500 / ((2 + 1/3) * 1.5));
      const newRadius = Math.min(
        2000 / ((lm.numColumns + 0.5) * SQRT3),
        500  / ((lm.numRows    + 1/3) * 1.5)
      );
      expect(newRadius).toBeGreaterThan(oldRadius);
    });
  });

  describe('HEXAGON_FLAT_TOP shape exists in PolygonShapes', () => {
    it('enum value equals hexagon_flat_top', () => {
      expect(PolygonShapes.HEXAGON_FLAT_TOP).toBe('hexagon_flat_top');
    });
  });

  describe('getOffsetsHexagonPointedTop — uses maxColumnsUsed not numColumns', () => {
    it('centering uses actual columns, not the configured max', () => {
      // 4 items on an 8-col panel: maxColumnsUsed should be 4 (all in row 0)
      const lm = new LayoutManager(800, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 1;
      const { xoffset } = lm.getOffsets(PolygonShapes.HEXAGON_POINTED_TOP, 100, 4);
      // With 4 actual cols on an 800px panel, radius ≈ 800/((4+0.5)*SQRT3) ≈ 102.6
      // The xoffset must be negative (content centered, not left-aligned)
      expect(xoffset).toBeLessThan(0);
      // And the magnitude must reflect centering (gap / 2 < panel width)
      expect(Math.abs(xoffset)).toBeLessThan(800);
    });
  });

  describe('With flat-top hexagon layout', () => {
    describe('getHexFlatTopRadius', () => {
      it('returns a positive radius for a 400x200 panel', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        expect(lm.getHexFlatTopRadius()).toBeGreaterThan(0);
      });

      it('returns a larger radius with fewer actual cols/rows', () => {
        const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        const rDefault = lm.getHexFlatTopRadius();
        const rActual = lm.getHexFlatTopRadius(2, 2);
        expect(rActual).toBeGreaterThan(rDefault);
      });
    });

    describe('getHexFlatTopDiameters', () => {
      it('diameterX = 2R and diameterY = SQRT3*R', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        lm.maxColumnsUsed = 4;
        lm.maxRowsUsed = 2;
        const { diameterX, diameterY } = lm.getHexFlatTopDiameters();
        const r = lm.getHexFlatTopRadius(4, 2);
        const SQRT3 = 1.7320508075688772;
        expect(diameterX).toBeCloseTo(r * 2, 1);
        expect(diameterY).toBeCloseTo(r * SQRT3, 1);
      });
    });

    describe('findOptimalColumnsFlatTop', () => {
      it('produces a larger radius than the 0.75 heuristic on a 4:1 panel', () => {
        const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        const SQRT3 = 1.7320508075688772;
        const heuristicCols = Math.ceil((2000 / 500) * Math.sqrt(20) * 0.75);
        const heuristicRows = Math.ceil(20 / heuristicCols);
        const heuristicRadius = Math.min(
          2000 / ((heuristicCols + 1 / 3) * 1.5),
          500 / ((heuristicRows + 0.5) * SQRT3)
        );
        const optCols = lm.findOptimalColumnsFlatTop(20, 2000, 500);
        const optRows = Math.ceil(20 / optCols);
        const optRadius = Math.min(
          2000 / ((optCols + 1 / 3) * 1.5),
          500 / ((optRows + 0.5) * SQRT3)
        );
        expect(optRadius).toBeGreaterThan(heuristicRadius);
      });
    });

    describe('shapeToCoordinates — flat-top', () => {
      it('col 0 row 0 is at (0, 0)', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        expect(lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, 50, 0, 0)).toEqual([0, 0]);
      });

      it('col 1 row 0 is shifted right by 1.5R and down by SQRT3*R/2 (odd column offset)', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        const SQRT3 = 1.7320508075688772;
        const r = 50;
        const [x, y] = lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, r, 1, 0);
        expect(x).toBeCloseTo(1.5 * r, 1);
        expect(y).toBeCloseTo((SQRT3 / 2) * r, 1);
      });

      it('col 2 row 0 is at (3R, 0) — even column, no vertical offset', () => {
        const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        const r = 50;
        const [x, y] = lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, r, 2, 0);
        expect(x).toBeCloseTo(3 * r, 1);
        expect(y).toBeCloseTo(0, 1);
      });
    });

    describe('generatePossibleColumnAndRowsSizes — flat-top auto-size', () => {
      it('covers all items and uses at least 1 col/row', () => {
        const lm = new LayoutManager(800, 400, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
        lm.generatePossibleColumnAndRowsSizes(true, true, 100, 20);
        expect(lm.numColumns * lm.numRows).toBeGreaterThanOrEqual(20);
        expect(lm.numColumns).toBeGreaterThanOrEqual(1);
        expect(lm.numRows).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
