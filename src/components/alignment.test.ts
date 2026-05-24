import { GetAlignments } from './alignment';
import { PolygonShapes } from './types';

// Common params used across all test cases
const DX = 100;
const DY = 80;
const TEXT_H = 40;
const V_FONT = 14;
const L_FONT = 12;
const TS_FONT = 10;

describe('GetAlignments', () => {
  describe('default shape (HEXAGON_POINTED_TOP) — no timestamp', () => {
    const result = GetAlignments(PolygonShapes.HEXAGON_POINTED_TOP, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, false);

    it('valueOnlyTextAlignment = valueFont/2', () => {
      expect(result.valueOnlyTextAlignment).toBeCloseTo(V_FONT / 2);
    });

    it('labelOnlyTextAlignment = labelFont * 0.37 for HEXAGON_POINTED_TOP', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(L_FONT * 0.37);
    });

    it('valueWithLabelTextAlignment uses default formula (no timestamp)', () => {
      // no timestamp branch: default formula
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(TEXT_H / 4 + V_FONT / 2);
    });

    it('labelWithValueTextAlignment = -textAreaHeight/4 + labelFont/2', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(-TEXT_H / 4 + L_FONT / 2);
    });

    it('timestampAlignment uses default formula', () => {
      expect(result.timestampAlignment).toBeCloseTo((TEXT_H * 0.33) / 2 + TS_FONT / 2);
    });

    it('labelTextAlignmentX = 0 (no override)', () => {
      expect(result.labelTextAlignmentX).toBe(0);
    });

    it('labelValueAlignmentX = 0 (no override)', () => {
      expect(result.labelValueAlignmentX).toBe(0);
    });
  });

  describe('HEXAGON_POINTED_TOP — with timestamp', () => {
    const result = GetAlignments(PolygonShapes.HEXAGON_POINTED_TOP, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, true);

    it('valueWithLabelTextAlignment shifts down when timestamp enabled', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo((TEXT_H * 0.67) / 2 + V_FONT / 2);
    });

    it('labelOnlyTextAlignment still uses 0.37 factor', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(L_FONT * 0.37);
    });
  });

  describe('HEXAGON_FLAT_TOP — no timestamp', () => {
    const result = GetAlignments(PolygonShapes.HEXAGON_FLAT_TOP, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, false);

    it('labelOnlyTextAlignment = labelFont * 0.37', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(L_FONT * 0.37);
    });

    it('valueWithLabelTextAlignment = valueFont * 0.85', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(V_FONT * 0.85);
    });

    it('labelWithValueTextAlignment = -(valueFont * 0.25)', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(-(V_FONT * 0.25));
    });

    it('labelTextAlignmentX = 0 (no override)', () => {
      expect(result.labelTextAlignmentX).toBe(0);
    });
  });

  describe('HEXAGON_FLAT_TOP — with timestamp', () => {
    const result = GetAlignments(PolygonShapes.HEXAGON_FLAT_TOP, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, true);

    it('valueWithLabelTextAlignment = valueFont * 1.1 when timestamp enabled', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(V_FONT * 1.1);
    });

    it('labelWithValueTextAlignment stays at -(valueFont * 0.25)', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(-(V_FONT * 0.25));
    });
  });

  describe('CIRCLE — no timestamp', () => {
    const result = GetAlignments(PolygonShapes.CIRCLE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, false);

    it('labelOnlyTextAlignment = labelFont * 0.37', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(L_FONT * 0.37);
    });

    it('valueWithLabelTextAlignment uses default formula (no timestamp branch)', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(TEXT_H / 4 + V_FONT / 2);
    });

    it('labelWithValueTextAlignment = -textAreaHeight/4 + labelFont/2', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(-TEXT_H / 4 + L_FONT / 2);
    });
  });

  describe('CIRCLE — with timestamp', () => {
    const result = GetAlignments(PolygonShapes.CIRCLE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, true);

    it('valueWithLabelTextAlignment shifts down when timestamp enabled', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo((TEXT_H * 0.67) / 2 + V_FONT / 2);
    });
  });

  describe('SQUARE — no timestamp', () => {
    const result = GetAlignments(PolygonShapes.SQUARE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, false);

    it('valueWithLabelTextAlignment = diameterY/1.5 + valueFont/2', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(DY / 1.5 + V_FONT / 2);
    });

    it('labelWithValueTextAlignment = diameterY/4 + labelFont/2', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(DY / 4 + L_FONT / 2);
    });

    it('labelOnlyTextAlignment = diameterY/2 + labelFont*0.37', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(DY / 2 + L_FONT * 0.37);
    });

    it('labelTextAlignmentX = diameterX/2', () => {
      expect(result.labelTextAlignmentX).toBeCloseTo(DX / 2);
    });

    it('labelValueAlignmentX = diameterX/2', () => {
      expect(result.labelValueAlignmentX).toBeCloseTo(DX / 2);
    });

    it('timestampAlignment uses default formula when no timestamp', () => {
      expect(result.timestampAlignment).toBeCloseTo((TEXT_H * 0.33) / 2 + TS_FONT / 2);
    });
  });

  describe('SQUARE — with timestamp', () => {
    const result = GetAlignments(PolygonShapes.SQUARE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, true);

    it('timestampAlignment = diameterY/1.5 - timestampFont*0.67', () => {
      expect(result.timestampAlignment).toBeCloseTo(DY / 1.5 - TS_FONT * 0.67);
    });

    it('valueWithLabelTextAlignment still = diameterY/1.5 + valueFont/2', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(DY / 1.5 + V_FONT / 2);
    });
  });

  describe('RECTANGLE — no timestamp', () => {
    const result = GetAlignments(PolygonShapes.RECTANGLE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, false);

    it('valueWithLabelTextAlignment = diameterY*0.67 + valueFont/2', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(DY * 0.67 + V_FONT / 2);
    });

    it('labelWithValueTextAlignment = diameterY*0.28 + labelFont/2', () => {
      expect(result.labelWithValueTextAlignment).toBeCloseTo(DY * 0.28 + L_FONT / 2);
    });

    it('labelOnlyTextAlignment = diameterY/2 + labelFont*0.37', () => {
      expect(result.labelOnlyTextAlignment).toBeCloseTo(DY / 2 + L_FONT * 0.37);
    });

    it('labelTextAlignmentX = diameterX/2', () => {
      expect(result.labelTextAlignmentX).toBeCloseTo(DX / 2);
    });

    it('labelValueAlignmentX = diameterX/2', () => {
      expect(result.labelValueAlignmentX).toBeCloseTo(DX / 2);
    });

    it('timestampAlignment uses default formula when no timestamp', () => {
      expect(result.timestampAlignment).toBeCloseTo((TEXT_H * 0.33) / 2 + TS_FONT / 2);
    });
  });

  describe('RECTANGLE — with timestamp', () => {
    const result = GetAlignments(PolygonShapes.RECTANGLE, DX, DY, TEXT_H, V_FONT, L_FONT, TS_FONT, true);

    it('timestampAlignment = diameterY*0.67 - timestampFont*0.67', () => {
      expect(result.timestampAlignment).toBeCloseTo(DY * 0.67 - TS_FONT * 0.67);
    });

    it('valueWithLabelTextAlignment still = diameterY*0.67 + valueFont/2', () => {
      expect(result.valueWithLabelTextAlignment).toBeCloseTo(DY * 0.67 + V_FONT / 2);
    });
  });
});
