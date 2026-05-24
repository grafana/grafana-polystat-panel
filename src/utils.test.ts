/**
 * Tests for utils
 */

import {
  GetDecimalsForValue,
  SortVariableValuesByField,
  getTextOrValue,
  getTextSizeForWidth,
  getTextSizeForWidthAndHeight,
} from './utils';

describe('Utils GetDecimalsForValue', () => {
  describe('With decimals', () => {
    it('returns 2 decimals', () => {
      const result = GetDecimalsForValue(10.55, 2);
      expect(result.decimals).toBe(2);
    });
    it('returns 1 decimal', () => {
      const result = GetDecimalsForValue(10.55, 1);
      expect(result.decimals).toBe(1);
    });
  });
});

describe('Utils getTextOrValue', () => {
  describe('Text Content', () => {
    it('returns text', () => {
      const result = getTextOrValue('ABC');
      expect(result).toBe('ABC');
    });
    it('returns text', () => {
      const result = getTextOrValue('ABC_123');
      expect(result).toBe('ABC_123');
    });
  });
  describe('Numeric Content', () => {
    it('returns number', () => {
      const result = getTextOrValue(42);
      expect(result).toBe(42);
    });
    it('returns number', () => {
      const result = getTextOrValue('42');
      expect(result).toBe(42);
    });
  });
});

describe('Utils SortVariableValuesByField', () => {
  describe('Simple Alphabetical Label', () => {
    const testData = [
      {
        name: 'C',
        value: 3.0,
      },
      {
        name: 'A',
        value: 1.0,
      },
      {
        name: 'B',
        value: 2.0,
      },
    ];
    describe('Using name field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'name', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 1);
        expect(result[0].name).toBe('A');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('C');
      });
      it('returns descending case sensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 2);
        expect(result[0].name).toBe('C');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('A');
      });
      it('returns same order (numerical asc)', () => {
        const result = SortVariableValuesByField(testData, 'name', 3);
        expect(result).toStrictEqual(testData);
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'name', 4);
        expect(result[0].name).toBe('B');
        expect(result[1].name).toBe('A');
        expect(result[2].name).toBe('C');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 5);
        expect(result[0].name).toBe('A');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('C');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 6);
        expect(result[0].name).toBe('C');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('A');
      });
    });
    describe('Using value field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'value', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 1);
        expect(result[0].name).toBe('A');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('C');
      });
      it('returns descending case sensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 2);
        expect(result[0].name).toBe('C');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('A');
      });
      it('returns numerical value ascending order (numerical asc)', () => {
        const result = SortVariableValuesByField(testData, 'value', 3);
        expect(result[0].name).toBe('A');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('C');
      });
      it('returns numerical value descending order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'value', 4);
        expect(result[0].name).toBe('C');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('A');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 5);
        expect(result[0].name).toBe('A');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('C');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 6);
        expect(result[0].name).toBe('C');
        expect(result[1].name).toBe('B');
        expect(result[2].name).toBe('A');
      });
    });
  });

  describe('Alphanumeric Label', () => {
    const testData = [
      {
        name: 'A_00',
        value: 0.0,
      },
      {
        name: 'A_10',
        value: 10.0,
      },
      {
        name: 'A_20',
        value: 20.0,
      },
      {
        name: 'A_02',
        value: 2.0,
      },
    ];
    describe('Using name field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'name', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 1);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 2);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'name', 3);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'name', 4);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 5);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 6);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
    });
    describe('Using value field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'value', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 1);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 2);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'value', 3);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'value', 4);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 5);
        expect(result[0].name).toBe('A_00');
        expect(result[1].name).toBe('A_02');
        expect(result[2].name).toBe('A_10');
        expect(result[3].name).toBe('A_20');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 6);
        expect(result[0].name).toBe('A_20');
        expect(result[1].name).toBe('A_10');
        expect(result[2].name).toBe('A_02');
        expect(result[3].name).toBe('A_00');
      });
    });
  });

  // numeric labels
  describe('Numeric Label', () => {
    const testData = [
      {
        name: '00',
        value: 0.0,
      },
      {
        name: '10',
        value: 10.0,
      },
      {
        name: '20',
        value: 20.0,
      },
      {
        name: '02',
        value: 2.0,
      },
    ];
    describe('Using name field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'name', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 1);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 2);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'name', 3);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'name', 4);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 5);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 6);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
    });
    describe('Using value field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'value', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 1);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 2);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'value', 3);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'value', 4);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 5);
        expect(result[0].name).toBe('00');
        expect(result[1].name).toBe('02');
        expect(result[2].name).toBe('10');
        expect(result[3].name).toBe('20');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 6);
        expect(result[0].name).toBe('20');
        expect(result[1].name).toBe('10');
        expect(result[2].name).toBe('02');
        expect(result[3].name).toBe('00');
      });
    });
  });

  // example data from bug#204
  describe('Alphanumeric Label', () => {
    const testData = [
      {
        name: 'web_server_04',
        value: 28.05,
      },
      {
        name: 'web_server_03',
        value: 28.64,
      },
      {
        name: 'web_server_02',
        value: 27.66,
      },
      {
        name: 'web_server_01',
        value: 21.12,
      },
    ];
    describe('Using name field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'name', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 1);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_03');
        expect(result[3].name).toBe('web_server_04');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'name', 2);
        expect(result[0].name).toBe('web_server_04');
        expect(result[1].name).toBe('web_server_03');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'name', 3);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_03');
        expect(result[3].name).toBe('web_server_04');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'name', 4);
        expect(result[0].name).toBe('web_server_04');
        expect(result[1].name).toBe('web_server_03');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 5);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_03');
        expect(result[3].name).toBe('web_server_04');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'name', 6);
        expect(result[0].name).toBe('web_server_04');
        expect(result[1].name).toBe('web_server_03');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
    });
    describe('Using value field', () => {
      it('returns same ordered data (no-sorting)', () => {
        const result = SortVariableValuesByField(testData, 'value', 0);
        expect(result).toStrictEqual(testData);
      });
      it('returns ascending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 1);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_04');
        expect(result[3].name).toBe('web_server_03');
      });
      it('returns descending case sensitive Alphanumeric order', () => {
        const result = SortVariableValuesByField(testData, 'value', 2);
        expect(result[0].name).toBe('web_server_03');
        expect(result[1].name).toBe('web_server_04');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
      it('returns numerical ascending', () => {
        const result = SortVariableValuesByField(testData, 'value', 3);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_04');
        expect(result[3].name).toBe('web_server_03');
      });
      it('returns reverse order (numerical desc)', () => {
        const result = SortVariableValuesByField(testData, 'value', 4);
        expect(result[0].name).toBe('web_server_03');
        expect(result[1].name).toBe('web_server_04');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
      it('returns ascending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 5);
        expect(result[0].name).toBe('web_server_01');
        expect(result[1].name).toBe('web_server_02');
        expect(result[2].name).toBe('web_server_04');
        expect(result[3].name).toBe('web_server_03');
      });
      it('returns descending case insensitive Alphabetical order', () => {
        const result = SortVariableValuesByField(testData, 'value', 6);
        expect(result[0].name).toBe('web_server_03');
        expect(result[1].name).toBe('web_server_04');
        expect(result[2].name).toBe('web_server_02');
        expect(result[3].name).toBe('web_server_01');
      });
    });
  });
});

describe('getTextSizeForWidth proportional padding', () => {
  it('returns a non-negative font size for a short string in a 50px wide area', () => {
    const result = getTextSizeForWidth('A', '?px sans-serif', 50, 6, 240);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('returns a non-negative font size for a short string in a 400px wide area', () => {
    const result = getTextSizeForWidth('A', '?px sans-serif', 400, 6, 240);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe('getTextSizeForWidthAndHeight', () => {
  it('returns maxFontPx when text has zero measured width and font fits height', () => {
    // canvas mock in test env returns width=0, so any font fits width constraint
    // maxFontPx=24 fits height=240, so result should be maxFontPx
    const result = getTextSizeForWidthAndHeight('A', '?px sans-serif', 100, 240, 6, 24);
    expect(result).toBe(24);
  });
});

describe('getTextSizeForWidth', () => {
  // jest-canvas-mock TextMetrics returns width = text.length (number of chars).
  // 'Hello World' has 11 chars → w=11. 'A' has 1 char → w=1.

  it('returns maxFontPx when text width fits within the available width (early return)', () => {
    // w=11, width=50 → 11 <= 50 → early return maxFontPx
    expect(getTextSizeForWidth('Hello World', '?px sans-serif', 50, 6, 100)).toBe(100);
    // w=11, width=100 → 11 <= 100 → early return
    expect(getTextSizeForWidth('Hello World', '?px sans-serif', 100, 6, 100)).toBe(100);
  });

  it('returns maxFontPx when text width exactly equals the available width', () => {
    // w=11 ('Hello World'), width=11 → 11 <= 11 → early return maxFontPx
    expect(getTextSizeForWidth('Hello World', '?px sans-serif', 11, 6, 100)).toBe(100);
  });

  it('returns 0 when text width exceeds available width and loop finds no fit', () => {
    // w=11 ('Hello World'), width=1 → 11 > 1 → falls through; loop checks w < (1-2)=-1 → never true → 0
    expect(getTextSizeForWidth('Hello World', '?px sans-serif', 1, 6, 100)).toBe(0);
  });

  it('returns 0 when width is negative', () => {
    // w=1 ('A'), width=-1 → 1 <= -1 is false → loop, w < (-1-2)=-3 → never true → 0
    expect(getTextSizeForWidth('A', '?px sans-serif', -1, 6, 240)).toBe(0);
  });
});

describe('getTextSizeForWidthAndHeight height-constraint behavior', () => {
  // jest-canvas-mock TextMetrics returns width = text.length.
  // 'test text' has 9 chars → w=9. width is adjusted: Math.round(width * 0.98).
  // With width=200: adjusted=196 → 9 <= 196 (width satisfied), so height is the binding constraint.
  // getTextSizeForWidthAndHeight checks: w <= width && maxFontPx <= height → early return maxFontPx.
  // If not, linear scan: w <= width && fontSize <= height → return fontSize.
  const testCases = [
    { name: 'returns maxFontPx when height >= maxFontPx', width: 200, height: 240, min: 6, max: 100, expected: 100 },
    { name: 'returns height when height < maxFontPx', width: 200, height: 50, min: 6, max: 100, expected: 50 },
    { name: 'returns minFontPx when height = minFontPx', width: 200, height: 6, min: 6, max: 100, expected: 6 },
    { name: 'returns 0 when height < minFontPx', width: 200, height: 5, min: 6, max: 100, expected: 0 },
    { name: 'caps at maxFontPx even with generous height', width: 200, height: 500, min: 6, max: 100, expected: 100 },
  ];
  testCases.forEach(({ name, width, height, min, max, expected }) => {
    it(name, () => {
      expect(getTextSizeForWidthAndHeight('test text', '?px sans-serif', width, height, min, max)).toBe(expected);
    });
  });
});
