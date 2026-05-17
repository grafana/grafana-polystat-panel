import { AutoFontScaler } from './auto_font_scaler';
import { PolystatModel } from './types';
import { getTextSizeForWidthAndHeight } from '../utils';

jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');
  return {
    ...actual,
    getTextSizeForWidthAndHeight: jest.fn(actual.getTextSizeForWidthAndHeight),
  };
});

const mockedGetTextSize = getTextSizeForWidthAndHeight as jest.MockedFunction<typeof getTextSizeForWidthAndHeight>;

const makeModel = (overrides: Partial<PolystatModel> = {}): PolystatModel => ({
  displayMode: 'all',
  thresholdLevel: 0,
  value: 0,
  valueFormatted: '0',
  valueRounded: 0,
  stats: {},
  name: 'metric',
  displayName: 'metric',
  timestamp: Date.now(),
  timestampFormatted: '',
  prefix: '',
  suffix: '',
  color: '#000000',
  clickThrough: '',
  operatorName: 'mean',
  newTabEnabled: false,
  customClickthroughTargetEnabled: false,
  customClickthroughTarget: '',
  sanitizedURL: '',
  sanitizeURLEnabled: false,
  showName: true,
  showValue: true,
  showTimestamp: false,
  isComposite: false,
  members: [],
  ...overrides,
});

const makeComposite = (name: string, members: PolystatModel[]): PolystatModel =>
  makeModel({ name, displayName: name, isComposite: true, showValue: true, members });

// O(1) font size calculation: largest font where text fits width and height
const enableRealisticTextSizing = () => {
  mockedGetTextSize.mockImplementation(
    (text: string, _font: string, width: number, height: number, minFont: number, maxFont: number) => {
      const areaWidth = Math.round(width * 0.95);
      const fitted = Math.floor(areaWidth / (text.length * 0.6));
      const capped = Math.min(fitted, height, maxFont);
      return capped >= minFont ? Math.ceil(capped) : 0;
    }
  );
};

describe('AutoFontScaler', () => {
  const font = 'Inter';
  const width = 200;
  const height = 100;

  describe('return shape', () => {
    it('returns all expected properties', () => {
      const result = AutoFontScaler(font, width, height, true, false, [makeModel()]);
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
      const result = AutoFontScaler(font, width, height, true, false, [makeModel({ name: 'Server-A', displayName: 'Server-A' })]);
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
    });

    it('uses longest displayName across all data items', () => {
      const short = makeModel({ name: 'A', displayName: 'A' });
      const long = makeModel({ name: 'Very-Long-Server-Name-That-Takes-Space', displayName: 'Very-Long-Server-Name-That-Takes-Space' });
      const resultShort = AutoFontScaler(font, width, height, true, false, [short]);
      const resultLong = AutoFontScaler(font, width, height, true, false, [short, long]);
      expect(resultLong.activeLabelFontSize).toBeLessThanOrEqual(resultShort.activeLabelFontSize);
    });
  });

  describe('value sizing', () => {
    it('returns positive value font size when valueEnabled', () => {
      const result = AutoFontScaler(font, width, height, true, false, [makeModel()]);
      expect(result.activeValueFontSize).toBeGreaterThan(0);
    });

    it('returns zero value font size when valueEnabled is false', () => {
      const result = AutoFontScaler(font, width, height, false, false, [makeModel()]);
      expect(result.activeValueFontSize).toBe(0);
    });
  });

  describe('composite value sizing', () => {
    it('returns positive composite value font size when composite has showValue', () => {
      const composite = makeComposite('comp', [makeModel({ name: 'member-1', displayName: 'member-1' })]);
      const result = AutoFontScaler(font, width, height, false, false, [composite]);
      expect(result.activeCompositeValueFontSize).toBeGreaterThan(0);
    });

    it('returns zero composite value font size when no composite has showValue', () => {
      const result = AutoFontScaler(font, width, height, false, false, [makeModel()]);
      expect(result.activeCompositeValueFontSize).toBe(0);
    });
  });

  describe('timestamp sizing', () => {
    it('returns non-negative timestamp font size when showTimestamp', () => {
      const model = makeModel({ timestampFormatted: '12:34:56' });
      const result = AutoFontScaler(font, width, height, true, true, [model]);
      expect(result.activeTimestampFontSize).toBeGreaterThanOrEqual(0);
    });

    it('reduces value font size when timestamp is shown', () => {
      const model = makeModel({ timestampFormatted: '12:34:56' });
      const withoutTimestamp = AutoFontScaler(font, width, height, true, false, [model]);
      const withTimestamp = AutoFontScaler(font, width, height, true, true, [model]);
      expect(withTimestamp.activeValueFontSize).toBeLessThanOrEqual(withoutTimestamp.activeValueFontSize);
    });
  });

  describe('ellipsis behavior', () => {
    it('does not show ellipses for short labels in large area', () => {
      const result = AutoFontScaler(font, width, height, true, false, [makeModel()]);
      expect(result.showEllipses).toBe(false);
      expect(result.numOfChars).toBe(0);
    });

    it('shows ellipses when label cannot fit', () => {
      const model = makeModel({ name: 'A'.repeat(200), displayName: 'A'.repeat(200) });
      const result = AutoFontScaler(font, 20, 10, true, false, [model]);
      expect(result.showEllipses).toBe(true);
      expect(result.numOfChars).toBeGreaterThan(0);
    });
  });

  describe('scaling with dimensions', () => {
    it('returns smaller font for smaller area', () => {
      const model = makeModel({ name: 'Server-Name', displayName: 'Server-Name' });
      const large = AutoFontScaler(font, 400, 200, true, false, [model]);
      const small = AutoFontScaler(font, 50, 25, true, false, [model]);
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
      const member = makeModel({ name: 'very-long-member-name', displayName: 'very-long-member-name', valueFormatted: '99999' });
      const composite = makeComposite('comp', [member]);
      const withMembers = AutoFontScaler(font, width, height, true, false, [composite]);
      const withoutMembers = AutoFontScaler(font, width, height, true, false, [makeModel()]);
      expect(withMembers.activeValueFontSize).toBeLessThanOrEqual(withoutMembers.activeValueFontSize);
    });
  });

  describe('with realistic text measurement', () => {
    beforeEach(() => {
      enableRealisticTextSizing();
    });

    afterEach(() => {
      mockedGetTextSize.mockRestore();
    });

    it('computes font size constrained by text width', () => {
      const result = AutoFontScaler(font, width, height, true, false, [makeModel({ name: 'Short', displayName: 'Short' })]);
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
      expect(result.activeLabelFontSize).toBeLessThanOrEqual(height / 2);
    });

    it('returns smaller font for longer labels', () => {
      const short = [makeModel({ name: 'ABCD', displayName: 'ABCD' })];
      const long = [makeModel({ name: 'ABCDEFGHIJKLMNO', displayName: 'ABCDEFGHIJKLMNO' })];
      const resultShort = AutoFontScaler(font, 300, 500, true, false, short);
      const resultLong = AutoFontScaler(font, 300, 500, true, false, long);
      expect(resultShort.showEllipses).toBe(false);
      expect(resultLong.showEllipses).toBe(false);
      expect(resultLong.activeLabelFontSize).toBeLessThan(resultShort.activeLabelFontSize);
    });

    it('returns smaller font for narrower area', () => {
      const model = makeModel({ name: 'ABCDEFGH', displayName: 'ABCDEFGH' });
      const wide = AutoFontScaler(font, 300, 500, true, false, [model]);
      const narrow = AutoFontScaler(font, 100, 500, true, false, [model]);
      expect(narrow.activeLabelFontSize).toBeLessThan(wide.activeLabelFontSize);
    });

    it('triggers ellipsis cascade for very long text in small area', () => {
      const longName = 'This-Is-A-Very-Long-Server-Name-That-Cannot-Possibly-Fit';
      const model = makeModel({ name: longName, displayName: longName });
      const result = AutoFontScaler(font, 60, 20, true, false, [model]);
      expect(result.showEllipses).toBe(true);
      expect([6, 10, 18]).toContain(result.numOfChars);
    });

    it('truncates to progressively shorter lengths', () => {
      const longName = 'X'.repeat(100);
      const model = makeModel({ name: longName, displayName: longName });
      // tight constraint forces ellipsis
      const result = AutoFontScaler(font, 40, 10, true, false, [model]);
      expect(result.showEllipses).toBe(true);
      expect([6, 10, 18]).toContain(result.numOfChars);
    });

    it('value font size is independent of label font size', () => {
      const model = makeModel({ name: 'A', displayName: 'A', valueFormatted: '12345' });
      const result = AutoFontScaler(font, width, height, true, false, [model]);
      expect(result.activeValueFontSize).toBeGreaterThan(0);
      expect(result.activeLabelFontSize).toBeGreaterThan(0);
    });

    it('timestamp gets smaller portion of height', () => {
      const model = makeModel({ timestampFormatted: '2026-05-17 08:00:00' });
      // use large enough area that both value and timestamp get positive sizes
      const result = AutoFontScaler(font, 300, 200, true, true, [model]);
      expect(result.activeTimestampFontSize).toBeGreaterThan(0);
      expect(result.activeTimestampFontSize).toBeLessThanOrEqual(result.activeValueFontSize);
    });

    it('composite member text constrains value font size', () => {
      const shortMember = makeModel({ name: 'm', displayName: 'm', valueFormatted: '1' });
      const longMember = makeModel({
        name: 'very-long-composite-member-name-here',
        displayName: 'very-long-composite-member-name-here',
        valueFormatted: '99999',
      });

      const shortComp = makeComposite('comp', [shortMember]);
      const longComp = makeComposite('comp', [longMember]);

      const resultShort = AutoFontScaler(font, width, height, true, false, [shortComp]);
      const resultLong = AutoFontScaler(font, width, height, true, false, [longComp]);
      expect(resultLong.activeValueFontSize).toBeLessThanOrEqual(resultShort.activeValueFontSize);
    });

    it('returns 0 for timestamp font when area too small', () => {
      const model = makeModel({ timestampFormatted: '2026-05-17 08:00:00.000 UTC' });
      const result = AutoFontScaler(font, 30, 10, true, true, [model]);
      expect(result.activeTimestampFontSize).toBe(0);
    });
  });
});
