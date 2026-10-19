// jsdom has no canvas, so getContext returns null without this and getTextWidth cannot be exercised
import 'jest-canvas-mock';

import { AutoFontScaler, AutoFontScalerOptions } from './auto_font_scaler';
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

const makeComposite = (members: PolystatModel[]): PolystatModel =>
  createPolystatModel({ name: 'comp', displayName: 'comp', isComposite: true, showValue: true, members });

const makeLabel = (label: string): PolystatModel => createPolystatModel({ name: label, displayName: label });

describe('AutoFontScaler', () => {
  const fontFamily = 'Inter';
  const defaultAreaWidth = 200;
  const defaultAreaHeight = 100;
  // too long to fit at 6px in any of the areas used below, so it always hits the ellipsis cascade
  const oversizedLabelText = 'prod-us-east-1.kubernetes.worker-node-0417.cpu.usage.percent';

  // each test passes its data and names only the options it cares about
  const scale = (data: PolystatModel[], overrides: Partial<AutoFontScalerOptions> = {}) =>
    AutoFontScaler({
      fontFamily,
      textAreaWidth: defaultAreaWidth,
      textAreaHeight: defaultAreaHeight,
      valueEnabled: true,
      showTimestamp: false,
      data,
      ...overrides,
    });

  it('measures text width proportional to the font size', () => {
    // guards the mock itself: without it every width below collapses to the character count
    expect(getTextWidth('AAAA', '50px Inter')).toBe(120);
    expect(getTextWidth('AAAA', '100px Inter')).toBe(240);
  });

  describe('label sizing', () => {
    // a 200x100 area gives 196px of usable width (getTextSizeForWidthAndHeight keeps 98%)
    // and two lines of 50px
    it('sizes the label to 40px when the width runs out first', () => {
      // 8 characters at 40px measure 192px
      expect(scale([makeLabel('Server-A')]).activeLabelFontSize).toBe(40);
    });

    it('sizes the label to 50px when half the height runs out first', () => {
      expect(scale([makeLabel('A')]).activeLabelFontSize).toBe(50);
    });

    it('sizes the label to 240px, the maximum, when neither runs out', () => {
      const result = scale([makeLabel('A')], { textAreaWidth: 2000, textAreaHeight: 1000 });
      expect(result.activeLabelFontSize).toBe(240);
    });

    it('sizes on the longest displayName in the set, not the first', () => {
      const shortLabel = makeLabel('A');
      const longLabel = makeLabel('Very-Long-Server-Name-That-Takes-Space');
      expect(scale([shortLabel]).activeLabelFontSize).toBe(50);
      expect(scale([shortLabel, longLabel]).activeLabelFontSize).toBe(8);
    });

    it('sizes on displayName in preference to name', () => {
      const model = createPolystatModel({ name: 'A', displayName: 'Server-A' });
      expect(scale([model]).activeLabelFontSize).toBe(40);
    });
  });

  describe('value sizing', () => {
    it('sizes a 1-character value to the 50px half-height', () => {
      const result = scale([createPolystatModel()]);
      expect(result.activeValueFontSize).toBe(50);
    });

    it('returns 0 for the value font when valueEnabled is false', () => {
      const result = scale([createPolystatModel()], { valueEnabled: false });
      expect(result.activeValueFontSize).toBe(0);
    });

    it('sizes on the longest valueFormatted in the set', () => {
      const models = [
        createPolystatModel({ valueFormatted: '1' }),
        createPolystatModel({ valueFormatted: '1234567890' }),
      ];
      expect(scale(models).activeValueFontSize).toBe(32);
    });
  });

  describe('composite value sizing', () => {
    it('sizes the composite value on "displayName: valueFormatted" of the member', () => {
      // 'member-1: 0' is 11 characters, so 196 / (11 * 0.6) settles at 29px
      const composite = makeComposite([createPolystatModel({ name: 'member-1', displayName: 'member-1' })]);
      const result = scale([composite], { valueEnabled: false });
      expect(result.activeCompositeValueFontSize).toBe(29);
    });

    it('returns 0 for the composite value font when no composite has showValue', () => {
      const result = scale([createPolystatModel()], { valueEnabled: false });
      expect(result.activeCompositeValueFontSize).toBe(0);
    });

    it('sizes on the longest composite member, not the parent value', () => {
      const shortMember = createPolystatModel({ name: 'm', displayName: 'm', valueFormatted: '1' });
      const longMember = createPolystatModel({
        name: 'very-long-composite-member-name-here',
        displayName: 'very-long-composite-member-name-here',
        valueFormatted: '99999',
      });
      const resultWithShortMember = scale([makeComposite([shortMember])]);
      const resultWithLongMember = scale([makeComposite([longMember])]);
      expect(resultWithShortMember.activeValueFontSize).toBe(50);
      expect(resultWithLongMember.activeValueFontSize).toBe(7);
    });
  });

  describe('timestamp sizing', () => {
    it('sizes the timestamp within the lower 33% of the text area', () => {
      // 200 * 0.33 = 66px split over two lines = 33px, and 19 chars fit at 25px in 294px
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const result = scale([model], { textAreaWidth: 300, textAreaHeight: 200, showTimestamp: true });
      expect(result.activeTimestampFontSize).toBe(25);
    });

    it('shrinks the value font into the upper 67% when the timestamp is shown', () => {
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const withoutTimestamp = scale([model], { textAreaWidth: 300, textAreaHeight: 200 });
      const withTimestamp = scale([model], { textAreaWidth: 300, textAreaHeight: 200, showTimestamp: true });
      expect(withoutTimestamp.activeValueFontSize).toBe(100);
      expect(withTimestamp.activeValueFontSize).toBe(67);
    });

    it('returns 0 for the timestamp font when its band is below the 6px minimum', () => {
      // 30 * 0.33 = 9.9px split over two lines leaves under 5px per line
      const model = createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' });
      const result = scale([model], { textAreaWidth: 300, textAreaHeight: 30, showTimestamp: true });
      expect(result.activeTimestampFontSize).toBe(0);
    });

    it('sizes on the longest composite member timestamp, not the parent timestamp', () => {
      const withMemberTimestamp = makeComposite([createPolystatModel({ timestampFormatted: '2026-05-17 08:00:00' })]);
      const withoutMemberTimestamp = makeComposite([createPolystatModel()]);
      const resultWithMemberTimestamp = scale([withMemberTimestamp], {
        textAreaWidth: 300,
        textAreaHeight: 200,
        showTimestamp: true,
      });
      const resultWithoutMemberTimestamp = scale([withoutMemberTimestamp], {
        textAreaWidth: 300,
        textAreaHeight: 200,
        showTimestamp: true,
      });
      expect(resultWithMemberTimestamp.activeTimestampFontSize).toBe(25);
      expect(resultWithoutMemberTimestamp.activeTimestampFontSize).toBe(33);
    });
  });

  describe('ellipsis cascade', () => {
    const oversizedLabel = makeLabel(oversizedLabelText);

    it('does not truncate a label that fits', () => {
      const result = scale([createPolystatModel()]);
      expect(result.showEllipses).toBe(false);
      expect(result.numOfChars).toBe(0);
    });

    // each rung is tried in turn, and the first one that fits at 6px or better wins
    it.each([
      ['18 characters when the whole label will not fit', defaultAreaWidth, 18, 15],
      ['10 characters when 18 will not fit', 70, 10, 8],
      ['6 characters when 10 will not fit', 45, 6, 8],
    ])('truncates to %s', (_name, areaWidth, numOfChars, fontSize) => {
      const result = scale([oversizedLabel], { textAreaWidth: areaWidth });
      expect(result.showEllipses).toBe(true);
      expect(result.numOfChars).toBe(numOfChars);
      expect(result.activeLabelFontSize).toBe(fontSize);
    });

    it('does not shrink the value when the label is truncated', () => {
      const result = scale([oversizedLabel], { textAreaWidth: 45 });
      expect(result.activeValueFontSize).toBe(50);
    });

    it('sizes the truncated label for the ellipsis characters Polystat appends', () => {
      // the label is sized with the ellipsis appended; sizing one character short returns 21px
      const longerLabel = makeLabel('prod-us-east-1.kubernetes.worker-node-0417.container.cpu.usage.core.seconds.p99');
      const result = scale([longerLabel], { textAreaWidth: 267 });
      expect(result.numOfChars).toBe(18);
      expect(result.activeLabelFontSize).toBe(20);
    });
  });

  it('hides the label but still sizes the value and timestamp when nothing fits', () => {
    // 30px wide leaves no room even for the 6-character rung
    const model = createPolystatModel({
      name: oversizedLabelText,
      displayName: oversizedLabelText,
      timestampFormatted: '12:34:56',
    });
    const result = scale([model], { textAreaWidth: 30, showTimestamp: true });
    expect(result.activeLabelFontSize).toBe(0);
    expect(result.activeValueFontSize).toBe(33);
    // 8 characters at 6px measure 28.8px, just inside the 29px usable width
    expect(result.activeTimestampFontSize).toBe(6);
  });

  it('sizes an empty data set to the half-height with no truncation', () => {
    const result = scale([]);
    expect(result.activeLabelFontSize).toBe(50);
    expect(result.activeValueFontSize).toBe(50);
    expect(result.showEllipses).toBe(false);
  });
});
