/**
 * Tests for utils
 */

import { GetDecimalsForValue, SortVariableValuesByField } from './utils';

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

describe('Utils SortVariableValuesByField', () => {
  describe('Simple Alphabetal Data', () => {
    const testData = [
      {
        name: "C",
        value: 3.0,
      },
      {
        name: "A",
        value: 1.0,
      },
      {
        name: "B",
        value: 2.0,
      },
    ];
    it('returns same ordered data (no-sorting)', () => {
      const result = SortVariableValuesByField(testData, "name", 0);
      expect(result).toStrictEqual(testData);
    });
    it('returns ascending case sensitive Alphabetical order', () => {
      const result = SortVariableValuesByField(testData, "name", 1);
      expect(result[0].name).toBe("A");
      expect(result[1].name).toBe("B");
      expect(result[2].name).toBe("C");
    });
    it('returns descending case sensitive Alphabetical order', () => {
      const result = SortVariableValuesByField(testData, "name", 2);
      expect(result[0].name).toBe("C");
      expect(result[1].name).toBe("B");
      expect(result[2].name).toBe("A");
    });
    it('returns same order (numerical asc)', () => {
      const result = SortVariableValuesByField(testData, "name", 3);
      expect(result).toStrictEqual(testData);
    });
    it('returns reverse order (numerical desc)', () => {
      const result = SortVariableValuesByField(testData, "name", 4);
      expect(result[0].name).toBe("B");
      expect(result[1].name).toBe("A");
      expect(result[2].name).toBe("C");
    });
    it('returns ascending case insensitive Alphabetical order', () => {
      const result = SortVariableValuesByField(testData, "name", 5);
      expect(result[0].name).toBe("A");
      expect(result[1].name).toBe("B");
      expect(result[2].name).toBe("C");
    });
    it('returns descending case insensitive Alphabetical order', () => {
      const result = SortVariableValuesByField(testData, "name", 6);
      expect(result[0].name).toBe("C");
      expect(result[1].name).toBe("B");
      expect(result[2].name).toBe("A");
    });

  });
  describe('Alphanumeric Data', () => {
    const testData = [
      {
        name: "A_00",
        value: 3.0,
      },
      {
        name: "A_10",
        value: 10.0,
      },
      {
        name: "A_20",
        value: 20.0,
      },
      {
        name: "A_02",
        value: 2.0,
      },
    ];
    it('returns same ordered data (no-sorting)', () => {
      const result = SortVariableValuesByField(testData, "name", 0);
      expect(result).toStrictEqual(testData);
    });
    it('returns ascending case sensitive Alphanumeric order', () => {
      const result = SortVariableValuesByField(testData, "name", 1);
      expect(result[0].name).toBe("A_00");
      expect(result[1].name).toBe("A_02");
      expect(result[2].name).toBe("A_10");
      expect(result[3].name).toBe("A_20");
    });
    it('returns descending case sensitive Alphanumeric order', () => {
      const result = SortVariableValuesByField(testData, "name", 2);
      expect(result[0].name).toBe("A_20");
      expect(result[1].name).toBe("A_10");
      expect(result[2].name).toBe("A_02");
      expect(result[3].name).toBe("A_00");
    });
  });
});
