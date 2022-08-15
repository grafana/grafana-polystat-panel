/**
 * Tests for utils
 */

import { GetDecimalsForValue, SortVariableValuesByField, getTextOrValue } from './utils';

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
