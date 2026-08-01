import { AutoFontScaler } from './auto_font_scaler';
import { PolystatModel } from './types';
import { getTextWidth } from '../utils';
import { createPolystatModel } from '../test-utils/factory';

// jest-canvas-mock measures every string as text.length regardless of font size, which makes the
// font search in getTextSizeForWidthAndHeight return the same number for every input. Measure
// 0.6em per character instead so the search actually varies.
const CHAR_WIDTH_RATIO = 0.6;

beforeEach(() => {
  // getTextWidth builds a canvas per call, and the search calls it once per size from 240 down to 6
  const context = document.createElement('canvas').getContext('2d')!;
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  jest.spyOn(context, 'measureText').mockImplementation((text: string) => {
    const fontSize = parseFloat(context.font);
    return { width: text.length * fontSize * CHAR_WIDTH_RATIO } as TextMetrics;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const makeComposite = (name: string, members: PolystatModel[]): PolystatModel =>
  createPolystatModel({ name, displayName: name, isComposite: true, showValue: true, members });

const makeLabel = (label: string): PolystatModel => createPolystatModel({ name: label, displayName: label });

describe('AutoFontScaler', () => {
  const font = 'Inter';
  const width = 200;
  const height = 100;
  // long enough that it cannot fit at 6px in any of the areas used below
  const longLabelText = 'X'.repeat(60);

  it('measures text width proportional to the font size', () => {
    // guards the mock itself: without it every width below collapses to the character count
    expect(getTextWidth('AAAA', '50px Inter')).toBe(120);
    expect(getTextWidth('AAAA', '100px Inter')).toBe(240);
  });

  describe('label sizing', () => {
    it('sizes an 8-character label to 39px in a 200x100 area', () => {
      // 190px usable width over two lines of 50px; 8 chars at 39px measure 187.2px
      const result = AutoFontScaler(font, width, height, true, false, [makeLabel('Server-A')]);
      expect(result.activeLabelFontSize).toBe(39);
    });

    it('caps a 1-character label at the 50px half-height rather than the width', () => {
      const result = AutoFontScaler(font, width, height, true, false, [makeLabel('A')]);
      expect(result.activeLabelFontSize).toBe(50);
    });

    it('clamps to the 240px maximum font when width and height both allow more', () => {
      const result = AutoFontScaler(font, 2000, 1000, true, false, [makeLabel('A')]);
      expect(result.activeLabelFontSize).toBe(240);
    });

    it('sizes on the longest displayName in the set, not the first', () => {
      const short = makeLabel('A');
      const long = makeLabel('Very-Long-Server-Name-That-Takes-Space');
      expect(AutoFontScaler(font, width, height, true, false, [short]).activeLabelFontSize).toBe(50);
      expect(AutoFontScaler(font, width, height, true, false, [short, long]).activeLabelFontSize).toBe(8);
    });

    it('sizes on displayName in preference to name', () => {
      const model = createPolystatModel({ name: 'A', displayName: 'Server-A' });
      expect(AutoFontScaler(font, width, height, true, false, [model]).activeLabelFontSize).toBe(39);
    });
  });

  describe('value sizing', () => {
    it('sizes a 1-character value to the 50px half-height', () => {
      const result = AutoFontScaler(font, width, height, true, false, [createPolystatModel()]);
      expect(result.activeValueFontSize).toBe(50);
    });

    it('returns 0 for the value font when valueEnabled is false', () => {
      const result = AutoFontScaler(font, width, height, false, false, [createPolystatModel()]);
      expect(result.activeValueFontSize).toBe(0);
    });

    it('sizes on the longest valueFormatted in the set', () => {
      const models = [createPolystatModel({ valueFormatted: '1' }), createPolystatModel({ valueFormatted: '1234567890' })];
      expect(AutoFontScaler(font, width, height, true, false, models).activeValueFontSize).toBe(31);
    });
  });

  describe('composite value sizing', () => {
    it('sizes the composite value on "displayName: valueFormatted" of the member', () => {
      // 'member-1: 0' is 11 characters, so 190 / (11 * 0.6) settles at 28px
      const composite = makeComposite('comp', [createPolystatModel({ name: 'member-1', displayName: 'member-1' })]);
      const result = AutoFontScaler(font, width, height, false, false, [composite]);
      expect(result.activeCompositeValueFontSize).toBe(28);
    });

    it('returns 0 for the composite value font when no composite has showValue', () => {
      const result = AutoFontScaler(font, width, height, false, false, [createPolystatModel()]);
      expect(result.activeCompositeValueFontSize).toBe(0);
    });

    it('sizes on the longest composite member, not the parent value', () => {
      const shortMember = createPolystatModel({ name: 'm', displayName: 'm', valueFormatted: '1' });
      const longMember = createPolystatModel({
        name: 'very-long-composite-member-name-here',
        displayName: 'very-long-composite-member-name-here',
        valueFormatted: '99999',
      });
      const short = AutoFontScaler(font, width, height, true, false, [makeComposite('comp', [shortMember])]);
      const long = AutoFontScaler(font, width, height, true, false, [makeComposite('comp', [longMember])]);
      expect(short.activeValueFontSize).toBe(50);
      expect(long.activeValueFontSize).toBe(7);
    });
  });

  describe('timestamp sizing', () => {
    it('sizes the timestamp within the lower 33% of the text area', () => {
      // 200 * 0.33 = 66px split over two lines = 33px, and 19 chars fit at 24px in 285px
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const result = AutoFontScaler(font, 300, 200, true, true, [model]);
      expect(result.activeTimestampFontSize).toBe(24);
    });

    it('shrinks the value font into the upper 67% when the timestamp is shown', () => {
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const withoutTimestamp = AutoFontScaler(font, 300, 200, true, false, [model]);
      const withTimestamp = AutoFontScaler(font, 300, 200, true, true, [model]);
      expect(withoutTimestamp.activeValueFontSize).toBe(100);
      expect(withTimestamp.activeValueFontSize).toBe(67);
    });

    it('returns 0 for the timestamp font when its band is below the 6px minimum', () => {
      // 30 * 0.33 = 9.9px split over two lines leaves under 5px per line
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const result = AutoFontScaler(font, 300, 30, true, true, [model]);
      expect(result.activeTimestampFontSize).toBe(0);
    });

    it('sizes on the longest composite member timestamp, not the parent timestamp', () => {
      const withMemberTimestamp = makeComposite('comp', [
        createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' }),
      ]);
      const withoutMemberTimestamp = makeComposite('comp', [createPolystatModel()]);
      expect(AutoFontScaler(font, 300, 200, true, true, [withMemberTimestamp]).activeTimestampFontSize).toBe(24);
      expect(AutoFontScaler(font, 300, 200, true, true, [withoutMemberTimestamp]).activeTimestampFontSize).toBe(33);
    });
  });

  describe('ellipsis cascade', () => {
    const longLabel = makeLabel(longLabelText);

    it('does not truncate a label that fits', () => {
      const result = AutoFontScaler(font, width, height, true, false, [createPolystatModel()]);
      expect(result.showEllipses).toBe(false);
      expect(result.numOfChars).toBe(0);
    });

    it('truncates to 18 characters when the full label will not fit at 6px', () => {
      const result = AutoFontScaler(font, width, height, true, false, [longLabel]);
      expect(result.showEllipses).toBe(true);
      expect(result.numOfChars).toBe(18);
      expect(result.activeLabelFontSize).toBe(15);
    });

    it('truncates to 10 characters when 18 will not fit at 6px', () => {
      const result = AutoFontScaler(font, 70, height, true, false, [longLabel]);
      expect(result.numOfChars).toBe(10);
      expect(result.activeLabelFontSize).toBe(8);
    });

    it('truncates to 6 characters when 10 will not fit at 6px, leaving the value alone', () => {
      const result = AutoFontScaler(font, 45, height, true, false, [longLabel]);
      expect(result.numOfChars).toBe(6);
      expect(result.activeLabelFontSize).toBe(7);
      // truncating the label does not shrink the value, which is sized on its own
      expect(result.activeValueFontSize).toBe(50);
    });

    it('sizes the truncated label for the 3 ellipsis characters Polystat appends', () => {
      // 18 characters paint as 21 with the ellipsis; sizing for 20 returns 21px, one step too large
      const result = AutoFontScaler(font, 267, height, true, false, [makeLabel('X'.repeat(80))]);
      expect(result.numOfChars).toBe(18);
      expect(result.activeLabelFontSize).toBe(20);
    });
  });

  describe('label that cannot fit at any truncation', () => {
    it('hides the label but still sizes the value and timestamp', () => {
      // 30px wide leaves no room even for the 6-character rung
      const model = createPolystatModel({
        name: longLabelText,
        displayName: longLabelText,
        timestampFormatted: '12:34:56',
      });
      const result = AutoFontScaler(font, 30, height, true, true, [model]);
      expect(result.activeLabelFontSize).toBe(0);
      expect(result.activeValueFontSize).toBe(33);
      // 8 characters at 6px measure 28.8px, just inside the 29px usable width
      expect(result.activeTimestampFontSize).toBe(6);
    });
  });

  describe('empty data', () => {
    it('sizes an empty data set to the half-height with no truncation', () => {
      const result = AutoFontScaler(font, width, height, true, false, []);
      expect(result.activeLabelFontSize).toBe(50);
      expect(result.activeValueFontSize).toBe(50);
      expect(result.showEllipses).toBe(false);
    });
  });
});
