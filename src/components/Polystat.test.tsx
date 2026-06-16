import React from 'react';

import { getTextToDisplay, buildTriggerCache, formatCompositeValueAndTimestamp } from './Polystat';
import { PolystatModel } from './types';

const createMember = (overrides: Partial<PolystatModel> = {}): PolystatModel => ({
  displayMode: 'all',
  thresholdLevel: 0,
  value: 100,
  valueFormatted: '100.00',
  valueRounded: 100,
  stats: {},
  name: 'member-a',
  displayName: 'member-a',
  timestamp: Date.now(),
  timestampFormatted: '12:00:00',
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

const createComposite = (members: PolystatModel[], overrides: Partial<PolystatModel> = {}): PolystatModel => ({
  ...createMember({
    name: 'composite-a',
    displayName: 'composite-a',
    isComposite: true,
    displayMode: 'all',
    members,
    ...overrides,
  }),
});

describe('Test Polystat', () => {
  describe('Ellipse Generation', () => {
    it('returns ellipses only for metrics that require them', () => {
      const shortName = getTextToDisplay(true, true, 12, true, 12, 'abc', 'abc');
      expect(shortName).toEqual('abc');
      const longName = getTextToDisplay(true, true, 12, true, 12, '123456789012', '123456789012');
      expect(longName).toEqual('123456789012');
      const veryLongName = getTextToDisplay(true, true, 12, true, 9, '1234567890123', '1234567890123');
      expect(veryLongName).toEqual('123456789...');
    });
  });

  describe('buildTriggerCache', () => {
    it('returns empty array when no members are triggered', () => {
      const item = createComposite([
        createMember({ name: 'ok-1', thresholdLevel: 0 }),
        createMember({ name: 'ok-2', thresholdLevel: 0 }),
      ]);
      const cache = buildTriggerCache(item);
      expect(cache).toEqual([]);
    });

    it('returns only triggered members (thresholdLevel > 0)', () => {
      const item = createComposite([
        createMember({ name: 'ok', thresholdLevel: 0, value: 10 }),
        createMember({ name: 'warn', thresholdLevel: 1, value: 50 }),
        createMember({ name: 'crit', thresholdLevel: 2, value: 90 }),
      ]);
      const cache = buildTriggerCache(item);
      expect(cache).toHaveLength(2);
      expect(cache[0].name).toBe('crit');
      expect(cache[1].name).toBe('warn');
    });

    it('sorts by thresholdLevel desc, then value desc, then name asc', () => {
      const item = createComposite([
        createMember({ name: 'b-warn', thresholdLevel: 1, value: 30 }),
        createMember({ name: 'a-warn', thresholdLevel: 1, value: 30 }),
        createMember({ name: 'crit-low', thresholdLevel: 2, value: 50 }),
        createMember({ name: 'crit-high', thresholdLevel: 2, value: 90 }),
      ]);
      const cache = buildTriggerCache(item);
      expect(cache).toHaveLength(4);
      expect(cache.map((c: any) => c.name)).toEqual([
        'crit-high',
        'crit-low',
        'a-warn',
        'b-warn',
      ]);
    });
  });

  describe('formatCompositeValueAndTimestamp', () => {
    it('returns item valueFormatted when no members exist', () => {
      const item = createComposite([], { valueFormatted: '42.00', timestampFormatted: '10:00:00' });
      item.members = [];
      const [value, timestamp] = formatCompositeValueAndTimestamp(0, item, 'OK');
      expect(value).toBe('42.00');
      expect(timestamp).toBe('10:00:00');
    });

    it('cycles through members in displayMode "all"', () => {
      const members = [
        createMember({ name: 'A', valueFormatted: '10.00', timestampFormatted: '10:00' }),
        createMember({ name: 'B', valueFormatted: '20.00', timestampFormatted: '11:00' }),
        createMember({ name: 'C', valueFormatted: '30.00', timestampFormatted: '12:00' }),
      ];
      const item = createComposite(members, { displayMode: 'all' });

      const [val0] = formatCompositeValueAndTimestamp(0, item, 'OK');
      expect(val0).toContain('A');
      expect(val0).toContain('10.00');

      const [val1] = formatCompositeValueAndTimestamp(1, item, 'OK');
      expect(val1).toContain('B');
      expect(val1).toContain('20.00');

      const [val2] = formatCompositeValueAndTimestamp(2, item, 'OK');
      expect(val2).toContain('C');
      expect(val2).toContain('30.00');
    });

    it('wraps around when frame index exceeds member count', () => {
      const members = [
        createMember({ name: 'A', valueFormatted: '10.00' }),
        createMember({ name: 'B', valueFormatted: '20.00' }),
      ];
      const item = createComposite(members, { displayMode: 'all' });

      const [val0] = formatCompositeValueAndTimestamp(0, item, 'OK');
      const [val2] = formatCompositeValueAndTimestamp(2, item, 'OK');
      expect(val0).toEqual(val2);

      const [val1] = formatCompositeValueAndTimestamp(1, item, 'OK');
      const [val3] = formatCompositeValueAndTimestamp(3, item, 'OK');
      expect(val1).toEqual(val3);
    });

    it('returns globalDisplayTextTriggeredEmpty when no members are triggered in non-all mode', () => {
      const members = [
        createMember({ name: 'ok-1', thresholdLevel: 0 }),
        createMember({ name: 'ok-2', thresholdLevel: 0 }),
      ];
      const item = createComposite(members, { displayMode: 'triggered' });

      const [value, timestamp] = formatCompositeValueAndTimestamp(0, item, 'ALL OK');
      expect(value).toBe('ALL OK');
      expect(timestamp).toBe('');
    });

    it('cycles through only triggered members in non-all mode', () => {
      const members = [
        createMember({ name: 'ok', thresholdLevel: 0, valueFormatted: '10.00' }),
        createMember({ name: 'warn', thresholdLevel: 1, valueFormatted: '50.00' }),
        createMember({ name: 'crit', thresholdLevel: 2, valueFormatted: '90.00' }),
      ];
      const item = createComposite(members, { displayMode: 'triggered' });

      const [val0] = formatCompositeValueAndTimestamp(0, item, 'OK');
      expect(val0).toContain('crit');

      const [val1] = formatCompositeValueAndTimestamp(1, item, 'OK');
      expect(val1).toContain('warn');
    });

    it('returns timestamp from the selected member', () => {
      const members = [
        createMember({ name: 'A', valueFormatted: '10.00', timestampFormatted: '10:00:00' }),
        createMember({ name: 'B', valueFormatted: '20.00', timestampFormatted: '11:00:00' }),
      ];
      const item = createComposite(members, { displayMode: 'all' });

      const [, ts0] = formatCompositeValueAndTimestamp(0, item, 'OK');
      expect(ts0).toBe('10:00:00');

      const [, ts1] = formatCompositeValueAndTimestamp(1, item, 'OK');
      expect(ts1).toBe('11:00:00');
    });
  });

  describe('animation metric index cycling', () => {
    it('should advance all animated items independently', () => {
      const indexes = [0, 0, 0];
      const animatedItems = [0, 2];
      const memberLengths = [3, 0, 2];

      const newIndexes = [...indexes];
      for (let i = 0; i < animatedItems.length; i++) {
        const index = animatedItems[i];
        let metricIndex = newIndexes[index];
        metricIndex++;
        metricIndex %= memberLengths[index];
        newIndexes[index] = metricIndex;
      }

      expect(newIndexes[0]).toBe(1);
      expect(newIndexes[1]).toBe(0);
      expect(newIndexes[2]).toBe(1);
    });

    it('should wrap around when reaching member count', () => {
      const indexes = [2, 1];
      const animatedItems = [0, 1];
      const memberLengths = [3, 2];

      const newIndexes = [...indexes];
      for (let i = 0; i < animatedItems.length; i++) {
        const index = animatedItems[i];
        let metricIndex = newIndexes[index];
        metricIndex++;
        metricIndex %= memberLengths[index];
        newIndexes[index] = metricIndex;
      }

      expect(newIndexes[0]).toBe(0);
      expect(newIndexes[1]).toBe(0);
    });

    it('should not lose changes when multiple items are animated (batch update)', () => {
      const indexes = [5, 3, 7];
      const animatedItems = [0, 1, 2];
      const memberLengths = [10, 5, 8];

      const newIndexes = [...indexes];
      for (let i = 0; i < animatedItems.length; i++) {
        const index = animatedItems[i];
        let metricIndex = newIndexes[index];
        metricIndex++;
        metricIndex %= memberLengths[index];
        newIndexes[index] = metricIndex;
      }

      expect(newIndexes[0]).toBe(6);
      expect(newIndexes[1]).toBe(4);
      expect(newIndexes[2]).toBe(0);
    });
  });
});
