/**
 * Tests for the padding getTextSizeForWidth reserves before searching for a font size.
 *
 * Lives in its own file because it has to replace the canvas measureText mock: jest-canvas-mock
 * measures every string as text.length regardless of font size, which makes the font search return
 * the same answer for every input and never exercise the padding line at all.
 */
import 'jest-canvas-mock';

import { getTextSizeForWidth } from './utils';

const CHAR_WIDTH_RATIO = 0.5;

beforeEach(() => {
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

describe('getTextSizeForWidth proportional padding', () => {
  // The reserve is max(2, round(width * 0.05)). 'AAAA' measures 2em, so the answer is the largest
  // integer below half the padded width. A flat 20px reserve would instead give 39, 4 and 0.
  it.each([
    ['scales the reserve with the width', 100, 47],
    ['keeps a narrow area usable', 30, 13],
    ['leaves an area narrower than the old flat reserve usable', 20, 8],
  ])('%s', (_name, width, expected) => {
    expect(getTextSizeForWidth('AAAA', '?px sans-serif', width, 6, 240)).toBe(expected);
  });
});
