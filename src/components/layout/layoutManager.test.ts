/**
 * Tests for LayoutManager
 */

import { LayoutManager } from './layoutManager';
import { PolygonShapes } from '../types';

describe('Layout Manager', () => {
  const SQRT3 = 1.7320508075688772;
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
      const optRadius = Math.min(2000 / ((optCols + 0.5) * SQRT3), 500 / ((optRows + 1 / 3) * 1.5));
      expect(optRadius).toBeGreaterThan(79.6);
    });

    it('picks a square grid for a square panel', () => {
      const lm = new LayoutManager(400, 400, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      // clamped to [1, n] either way, so only the exact count distinguishes a real search
      expect(lm.findOptimalColumns(16, 400, 400)).toBe(4);
    });

    it('pins the column count on the wide panel the optimizer was written for', () => {
      const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      expect(lm.findOptimalColumns(20, 2000, 500)).toBe(10);
    });

    // The closed-form estimate alone lands on the wrong integer here; only the neighbor search
    // recovers the better count. These fail if findOptimalColumnsImpl degrades to round(approx).
    it.each([
      ['wide panel, 4 items', 4, 300, 100, 4, 3],
      ['wide panel, 3 items', 3, 800, 400, 3, 2],
    ])('searches past the closed-form estimate on a %s', (_name, n, width, height, expected, estimate) => {
      const lm = new LayoutManager(width, height, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      expect(Math.round(Math.sqrt((n * width * 1.5) / (height * SQRT3)))).toBe(estimate);
      expect(lm.findOptimalColumns(n, width, height)).toBe(expected);
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
      const oldRadius = Math.min(2000 / ((14 + 0.5) * SQRT3), 500 / ((2 + 1 / 3) * 1.5));
      const newRadius = Math.min(2000 / ((lm.numColumns + 0.5) * SQRT3), 500 / ((lm.numRows + 1 / 3) * 1.5));
      expect(newRadius).toBeGreaterThan(oldRadius);
    });
  });

  describe('findOptimalColumnsFlatTop', () => {
    it('pins the column count on a wide panel', () => {
      const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      expect(lm.findOptimalColumnsFlatTop(20, 2000, 500)).toBe(10);
    });

    it.each([
      ['4 items', 4, 400, 200, 4, 3],
      ['3 items', 3, 600, 400, 3, 2],
    ])('searches past the closed-form estimate with %s', (_name, n, width, height, expected, estimate) => {
      const lm = new LayoutManager(width, height, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      expect(Math.round(Math.sqrt((n * width * SQRT3) / (height * 1.5)))).toBe(estimate);
      expect(lm.findOptimalColumnsFlatTop(n, width, height)).toBe(expected);
    });
  });

  describe('HEXAGON_FLAT_TOP shape exists in PolygonShapes', () => {
    it('enum value equals hexagon_flat_top', () => {
      expect(PolygonShapes.HEXAGON_FLAT_TOP).toBe('hexagon_flat_top');
    });
  });

  describe('getOffsetsHexagonPointedTop — uses maxColumnsUsed not numColumns', () => {
    const pointedTop = (numColumns: number, numRows: number) => {
      const lm = new LayoutManager(800, 200, numColumns, numRows, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 1;
      return lm.getOffsets(PolygonShapes.HEXAGON_POINTED_TOP, 100, 4);
    };

    it('centering uses actual columns, not the configured max', () => {
      // 4 items on an 8x8 configured grid, all in row 0. Sizing from numColumns/numRows instead
      // would give xoffset -303, so the exact value is what separates the two.
      const { xoffset, yoffset } = pointedTop(8, 8);
      expect(Math.round(xoffset * 100) / 100).toBe(-140.2);
      expect(yoffset).toBe(-100);
    });

    it('gives the same offsets whether the grid is over-sized or exact', () => {
      expect(pointedTop(8, 8)).toEqual(pointedTop(4, 1));
    });
  });

  describe('getOffsetsHexagonFlatTop', () => {
    // xoffset and yoffset are negative for any input by construction, since the radius is chosen so
    // the grid fits. Asserting the sign proves nothing, so these pin the magnitude.
    const round2 = (value: number) => Math.round(value * 100) / 100;

    const flatTop = (width: number, height: number, columns: number, rows: number) => {
      const lm = new LayoutManager(width, height, columns, rows, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.maxColumnsUsed = columns;
      lm.maxRowsUsed = rows;
      return lm;
    };

    it('puts a lone hexagon at the middle of the panel', () => {
      const { xoffset, yoffset } = flatTop(400, 200, 1, 1).getOffsetsHexagonFlatTop(1);
      // one hexagon centered on a 400x200 panel sits at exactly half of each dimension
      expect(round2(xoffset)).toBe(-200);
      expect(round2(yoffset)).toBe(-100);
    });

    it('centers a 3x2 grid that fills the panel', () => {
      const { xoffset, yoffset } = flatTop(200, 150, 3, 2).getOffsetsHexagonFlatTop(6);
      expect(round2(xoffset)).toBe(-48.04);
      expect(round2(yoffset)).toBe(-30.01);
    });

    it('shifts the grid up by half a hex when odd columns stagger down', () => {
      // maxColumnsUsed 2 with dataSize 2 adds heightOffset 0.5, so the used height grows by half a
      // hex and the offset shrinks from the single-column case
      expect(round2(flatTop(400, 200, 1, 1).getOffsetsHexagonFlatTop(1).yoffset)).toBe(-100);
      expect(round2(flatTop(400, 200, 2, 1).getOffsetsHexagonFlatTop(2).yoffset)).toBe(-66.67);
    });

    it('never sees a second column without enough items to reach the last row', () => {
      // heightOffset keys off maxColumnsUsed alone. Rows fill left to right, so any layout the
      // fill can actually produce with 2+ columns already has dataSize >= maxRowsUsed + 1.
      for (let columns = 1; columns <= 12; columns++) {
        for (let rows = 1; rows <= 12; rows++) {
          for (let dataSize = 1; dataSize <= 40; dataSize++) {
            const lm = new LayoutManager(800, 400, columns, rows, 0, true, PolygonShapes.HEXAGON_FLAT_TOP);
            lm.generateActualColumnAndRowUsage(new Array(dataSize).fill(0), 0);
            if (lm.maxColumnsUsed > 1) {
              expect(dataSize).toBeGreaterThanOrEqual(lm.maxRowsUsed + 1);
            }
          }
        }
      }
    });
  });

  describe('getDiameters for HEXAGON_FLAT_TOP', () => {
    it('returns diameterX = 2*R and diameterY = SQRT3*R via getDiameters', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 2;
      const R = lm.getHexFlatTopRadius(4, 2);
      const { diameterX, diameterY } = lm.getDiameters();
      expect(diameterX).toBeCloseTo(R * 2, 1);
      expect(diameterY).toBeCloseTo(R * Math.sqrt(3), 1);
    });
  });

  describe('getOffsets for uniform shapes with an under-filled manual grid', () => {
    // 4 items in a manual 8-column grid on a short 800x100 panel. Height caps the radius at 50, so
    // the row is only 400px wide and needs a real offset to center. Sizing from numColumns would
    // claim the full 800px, leave nothing to center, and strand the row in the right half.
    const build = (shape: PolygonShapes, numColumns: number) => {
      const lm = new LayoutManager(800, 100, numColumns, 8, 100, true, shape);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 1;
      return lm;
    };

    it('centers circles on the columns the data fills, not the configured max', () => {
      expect(build(PolygonShapes.CIRCLE, 8).getOffsets(PolygonShapes.CIRCLE, 100, 4).xoffset).toBe(-250);
    });

    it('centers squares on the columns the data fills, not the configured max', () => {
      expect(build(PolygonShapes.SQUARE, 8).getOffsets(PolygonShapes.SQUARE, 100, 4).xoffset).toBe(-200);
    });

    it.each([
      ['circle', PolygonShapes.CIRCLE],
      ['square', PolygonShapes.SQUARE],
    ])('gives %s the same offsets whether the grid is over-sized or exact', (_name, shape) => {
      expect(build(shape, 8).getOffsets(shape, 100, 4)).toEqual(build(shape, 4).getOffsets(shape, 100, 4));
    });
  });

  describe('getTextArea', () => {
    const build = (shape: PolygonShapes) => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, shape);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 2;
      return lm;
    };

    it('gives a rectangle brick its whole height', () => {
      const lm = build(PolygonShapes.RECTANGLE);
      const { diameterX, diameterY } = lm.getDiameters();
      expect(lm.getTextArea()).toEqual({ textAreaWidth: diameterX, textAreaHeight: diameterY });
    });

    it.each([
      ['pointed-top hexagon', PolygonShapes.HEXAGON_POINTED_TOP],
      ['circle', PolygonShapes.CIRCLE],
      ['square', PolygonShapes.SQUARE],
    ])('gives %s the full width and half the height', (_name, shape) => {
      const lm = build(shape);
      const { diameterX, diameterY } = lm.getDiameters();
      expect(lm.getTextArea()).toEqual({ textAreaWidth: diameterX, textAreaHeight: diameterY / 2 });
    });

    it('narrows a flat-top hexagon to 70% width so the value line clears the angled edges', () => {
      const lm = build(PolygonShapes.HEXAGON_FLAT_TOP);
      const { diameterX, diameterY } = lm.getDiameters();
      expect(lm.getTextArea()).toEqual({ textAreaWidth: diameterX * 0.7, textAreaHeight: diameterY / 2 });
    });

    it('keeps the flat-top box inside the hexagon at the largest font it allows', () => {
      const lm = build(PolygonShapes.HEXAGON_FLAT_TOP);
      const radius = lm.getHexFlatTopRadius(4, 2);
      const { textAreaWidth, textAreaHeight } = lm.getTextArea();
      // the value line sits ~1.11 * font below center, where the hexagon has narrowed
      const largestFont = textAreaHeight / 2;
      const halfWidthAtValueLine = radius - (1.11 * largestFont) / Math.sqrt(3);
      expect(textAreaWidth / 2).toBeLessThanOrEqual(halfWidthAtValueLine);
    });
  });

  describe('generateRadius for HEXAGON_FLAT_TOP', () => {
    it('returns positive radius after layout generation', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 2;
      const r = lm.generateRadius(PolygonShapes.HEXAGON_FLAT_TOP);
      expect(r).toBeGreaterThan(0);
    });
    it('matches getHexFlatTopRadius(maxColumnsUsed, maxRowsUsed)', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 2;
      const r = lm.generateRadius(PolygonShapes.HEXAGON_FLAT_TOP);
      expect(r).toBeCloseTo(lm.getHexFlatTopRadius(4, 2), 1);
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
        const heuristicRadius = Math.min(2000 / ((heuristicCols + 1 / 3) * 1.5), 500 / ((heuristicRows + 0.5) * SQRT3));
        const optCols = lm.findOptimalColumnsFlatTop(20, 2000, 500);
        const optRows = Math.ceil(20 / optCols);
        const optRadius = Math.min(2000 / ((optCols + 1 / 3) * 1.5), 500 / ((optRows + 0.5) * SQRT3));
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
