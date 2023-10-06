import React from 'react';

import { getTextToDisplay } from './Polystat';

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
});
