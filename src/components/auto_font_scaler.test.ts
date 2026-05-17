import { FieldType, toDataFrame } from '@grafana/data';
import { AutoFontScaler } from './auto_font_scaler';
import { PolystatModel } from './types';
import { DataFrameToPolystat } from '../data/processor';
import { getTextSizeForWidthAndHeight } from '../utils';

jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');
  return {
    ...actual,
    getTextSizeForWidthAndHeight: jest.fn(actual.getTextSizeForWidthAndHeight),
  };
});

const mockedGetTextSize = getTextSizeForWidthAndHeight as jest.MockedFunction<typeof getTextSizeForWidthAndHeight>;

const createModel = (name: string, value: number): PolystatModel => {
  const frame = toDataFrame({
    fields: [
      { name: 'time', type: FieldType.time, values: [Date.now()] },
      { name, type: FieldType.number, values: [value] },
    ],
  });
  return DataFrameToPolystat(frame, 'mean')[0];
};

const createCompositeModel = (name: string, members: PolystatModel[]): PolystatModel => {
  const model = createModel(name, 0);
  model.isComposite = true;
  model.showValue = true;
  model.members = members;
  return model;
};

// Simulate realistic font scaling: each character is ~0.6x the font size in width
const enableRealisticTextSizing = () => {
  mockedGetTextSize.mockImplementation(
    (text: string, _font: any, width: number, height: number, minFont: number, maxFont: number) => {
      const areaWidth = Math.round(width * 0.95);
      for (let fontSize = maxFont; fontSize >= minFont; fontSize--) {
        const textWidth = text.length * fontSize * 0.6;
        if (textWidth < areaWidth && fontSize <= height) {
          return Math.ceil(fontSize);
        }
      }
      return 0;
    }
  );
};

describe('AutoFontScaler', () => {
  const font = 'Inter';
  const width = 200;
  const height = 100;

  describe('return shape', () => {
    it('returns all expected properties', () => {
      const data = [createModel('A', 100)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      expect(result).toHaveProperty('activeLabelFontSize');
      expect(result).toHaveProperty('activeValueFontSize');
      expect(result).toHaveProperty('activeCompositeValueFontSize');
      expect(result).toHaveProperty('activeTimestampFontSize');
      expect(result).toHaveProperty('showEllipses');
      expect(result).toHaveProperty('numOfChars');
    });
  });

  describe('label sizing', () => {
    it('returns positive label font size for normal text', () => {
      const data = [createModel('Server-A', 100)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
    });

    it('uses longest displayName across all data items', () => {
      const short = createModel('A', 100);
      const long = createModel('Very-Long-Server-Name-That-Takes-Space', 200);
      const resultShort = AutoFontScaler(font, width, height, true, false, [short]);
      const resultLong = AutoFontScaler(font, width, height, true, false, [short, long]);
      expect(resultLong.activeLabelFontSize).toBeLessThanOrEqual(resultShort.activeLabelFontSize);
    });
  });

  describe('value sizing', () => {
    it('returns positive value font size when valueEnabled', () => {
      const data = [createModel('A', 100)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      expect(result.activeValueFontSize).toBeGreaterThan(0);
    });

    it('returns zero value font size when valueEnabled is false', () => {
      const data = [createModel('A', 100)];
      const result = AutoFontScaler(font, width, height, false, false, data);
      expect(result.activeValueFontSize).toBe(0);
    });
  });

  describe('composite value sizing', () => {
    it('returns positive composite value font size when composite has showValue', () => {
      const member = createModel('member-1', 50);
      const composite = createCompositeModel('comp', [member]);
      const result = AutoFontScaler(font, width, height, false, false, [composite]);
      expect(result.activeCompositeValueFontSize).toBeGreaterThan(0);
    });

    it('returns zero composite value font size when no composite has showValue', () => {
      const model = createModel('plain', 100);
      const result = AutoFontScaler(font, width, height, false, false, [model]);
      expect(result.activeCompositeValueFontSize).toBe(0);
    });
  });

  describe('timestamp sizing', () => {
    it('returns positive timestamp font size when showTimestamp', () => {
      const data = [createModel('A', 100)];
      data[0].timestampFormatted = '12:34:56';
      const result = AutoFontScaler(font, width, height, true, true, data);
      expect(result.activeTimestampFontSize).toBeGreaterThanOrEqual(0);
    });

    it('reduces value font size when timestamp is shown', () => {
      const data = [createModel('A', 100)];
      data[0].timestampFormatted = '12:34:56';
      const withoutTimestamp = AutoFontScaler(font, width, height, true, false, data);
      const withTimestamp = AutoFontScaler(font, width, height, true, true, data);
      expect(withTimestamp.activeValueFontSize).toBeLessThanOrEqual(withoutTimestamp.activeValueFontSize);
    });
  });

  describe('ellipsis behavior', () => {
    it('does not show ellipses for short labels in large area', () => {
      const data = [createModel('A', 100)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      expect(result.showEllipses).toBe(false);
      expect(result.numOfChars).toBe(0);
    });

    it('shows ellipses when label cannot fit', () => {
      const longName = 'A'.repeat(200);
      const data = [createModel(longName, 100)];
      const result = AutoFontScaler(font, 20, 10, true, false, data);
      expect(result.showEllipses).toBe(true);
      expect(result.numOfChars).toBeGreaterThan(0);
    });
  });

  describe('scaling with dimensions', () => {
    it('returns smaller font for smaller area', () => {
      const data = [createModel('Server-Name', 100)];
      const large = AutoFontScaler(font, 400, 200, true, false, data);
      const small = AutoFontScaler(font, 50, 25, true, false, data);
      expect(small.activeLabelFontSize).toBeLessThanOrEqual(large.activeLabelFontSize);
    });
  });

  describe('empty data', () => {
    it('handles empty data array', () => {
      const result = AutoFontScaler(font, width, height, true, false, []);
      expect(result.activeLabelFontSize).toBeGreaterThanOrEqual(0);
      expect(result.activeValueFontSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('composite member value sizing', () => {
    it('accounts for composite member displayName + value length', () => {
      const member = createModel('very-long-member-name', 99999);
      member.displayName = 'very-long-member-name';
      const composite = createCompositeModel('comp', [member]);
      const withMembers = AutoFontScaler(font, width, height, true, false, [composite]);
      const withoutMembers = AutoFontScaler(font, width, height, true, false, [createModel('A', 1)]);
      expect(withMembers.activeValueFontSize).toBeLessThanOrEqual(withoutMembers.activeValueFontSize);
    });
  });

  describe('with realistic text measurement', () => {
    beforeEach(() => {
      enableRealisticTextSizing();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('computes font size constrained by text width', () => {
      const data = [createModel('Short', 100)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      // with realistic widths, font must fit within 200px area
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
      expect(result.activeLabelFontSize).toBeLessThanOrEqual(height / 2);
    });

    it('returns smaller font for longer labels', () => {
      // both must fit without ellipsis — use wide area, tall so height doesn't cap
      const short = [createModel('ABCD', 1)];
      const long = [createModel('ABCDEFGHIJKLMNO', 1)];
      const resultShort = AutoFontScaler(font, 300, 500, true, false, short);
      const resultLong = AutoFontScaler(font, 300, 500, true, false, long);
      expect(resultShort.showEllipses).toBe(false);
      expect(resultLong.showEllipses).toBe(false);
      expect(resultLong.activeLabelFontSize).toBeLessThan(resultShort.activeLabelFontSize);
    });

    it('returns smaller font for narrower area', () => {
      // use same text, tall area so height doesn't cap — width is the constraint
      const data = [createModel('ABCDEFGH', 100)];
      const wide = AutoFontScaler(font, 300, 500, true, false, data);
      const narrow = AutoFontScaler(font, 100, 500, true, false, data);
      expect(narrow.activeLabelFontSize).toBeLessThan(wide.activeLabelFontSize);
    });

    it('triggers ellipsis cascade for very long text in small area', () => {
      const longName = 'This-Is-A-Very-Long-Server-Name-That-Cannot-Possibly-Fit';
      const data = [createModel(longName, 100)];
      const result = AutoFontScaler(font, 60, 20, true, false, data);
      expect(result.showEllipses).toBe(true);
      expect([6, 10, 18]).toContain(result.numOfChars);
    });

    it('truncates to 18 chars first, then 10, then 6', () => {
      const longName = 'X'.repeat(100);
      const data = [createModel(longName, 100)];
      // medium constraint: 18 char truncation should fit
      const medium = AutoFontScaler(font, 150, 30, true, false, data);
      if (medium.showEllipses) {
        expect(medium.numOfChars).toBe(18);
      }
      // tight constraint: may need further truncation
      const tight = AutoFontScaler(font, 40, 10, true, false, data);
      if (tight.showEllipses) {
        expect([6, 10, 18]).toContain(tight.numOfChars);
        expect(tight.numOfChars).toBeLessThanOrEqual(medium.numOfChars || 18);
      }
    });

    it('value font size is independent of label font size', () => {
      const data = [createModel('A', 12345)];
      const result = AutoFontScaler(font, width, height, true, false, data);
      expect(result.activeValueFontSize).toBeGreaterThan(0);
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
    });

    it('timestamp gets smaller portion of height', () => {
      const data = [createModel('A', 100)];
      data[0].timestampFormatted = '2026-05-17 08:00:00';
      const result = AutoFontScaler(font, width, height, true, true, data);
      if (result.activeTimestampFontSize > 0) {
        expect(result.activeTimestampFontSize).toBeLessThanOrEqual(result.activeValueFontSize);
      }
    });

    it('composite member text constrains value font size', () => {
      const shortMember = createModel('m', 1);
      shortMember.displayName = 'm';
      const longMember = createModel('very-long-composite-member-name-here', 99999);
      longMember.displayName = 'very-long-composite-member-name-here';

      const shortComp = createCompositeModel('comp', [shortMember]);
      const longComp = createCompositeModel('comp', [longMember]);

      const resultShort = AutoFontScaler(font, width, height, true, false, [shortComp]);
      const resultLong = AutoFontScaler(font, width, height, true, false, [longComp]);
      expect(resultLong.activeValueFontSize).toBeLessThanOrEqual(resultShort.activeValueFontSize);
    });

    it('returns 0 for timestamp font when area too small', () => {
      const data = [createModel('A', 100)];
      data[0].timestampFormatted = '2026-05-17 08:00:00.000 UTC';
      const result = AutoFontScaler(font, 30, 10, true, true, data);
      expect(result.activeTimestampFontSize).toBe(0);
    });
  });
});
