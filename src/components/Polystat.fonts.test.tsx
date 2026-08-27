import React from 'react';
import { render } from '@testing-library/react';

import { Polystat } from './Polystat';
import { PolygonShapes, PolystatOptions } from './types';
import { createPolystatModel, createPolystatOptions } from '../test-utils/factory';

/**
 * Flat-top caps the label font at the value font, so short labels do not overflow the upper angled
 * edges. AutoFontScaler reports a value font of 0 when the value is disabled or will not fit at the
 * minimum size, and capping against that would hide the label too.
 *
 * Font sizes here come from the jest-canvas-mock measurement of one pixel per character, so they
 * are stable but not the sizes a browser produces. What matters is which of them are zero.
 */
describe('font sizing by shape', () => {
  const makeData = (count: number, showValue: boolean) =>
    Array.from({ length: count }, (_, i) =>
      createPolystatModel({ name: `srv-${i}`, displayName: `srv-${i}`, showValue, valueFormatted: '1.00' })
    );

  const fontsFor = (overrides: Partial<PolystatOptions>, showValue: boolean) => {
    const { container } = render(
      <Polystat
        {...createPolystatOptions({
          panelWidth: 800,
          panelHeight: 400,
          globalAutoScaleFonts: true,
          globalShowValueEnabled: showValue,
          processedData: makeData(4, showValue),
          ...overrides,
        })}
      />
    );
    const read = (kind: string) =>
      container.querySelector(`[data-testid="polystat-${kind}-1-0"]`)?.getAttribute('font-size');
    return { label: read('label'), value: read('value') };
  };

  it('still draws the label on a flat-top hexagon when the value is turned off', () => {
    expect(fontsFor({ globalShape: PolygonShapes.HEXAGON_FLAT_TOP }, false)).toEqual({
      label: '53px',
      value: '0px',
    });
  });

  it('caps the flat-top label at the value font when both are shown', () => {
    const { label, value } = fontsFor({ globalShape: PolygonShapes.HEXAGON_FLAT_TOP }, true);
    expect(label).toBe('53px');
    expect(value).toBe('53px');
  });

  it('leaves the pointed-top label alone when the value is turned off', () => {
    // pointed-top never caps, so this is the size the flat-top case is measured against
    expect(fontsFor({ globalShape: PolygonShapes.HEXAGON_POINTED_TOP }, false)).toEqual({
      label: '57px',
      value: '0px',
    });
  });
});
