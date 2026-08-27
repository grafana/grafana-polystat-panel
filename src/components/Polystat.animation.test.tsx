import React from 'react';
import { act, render } from '@testing-library/react';

import { Polystat } from './Polystat';
import { PolystatOptions } from './types';
import { createPolystatModel, createPolystatOptions } from '../test-utils/factory';

/**
 * A composite with showValue cycles through its members on an interval, writing each member's text
 * straight into the value element through a ref. The tick must advance exactly one member per
 * interval: React may run a state updater more than once, so the writes cannot live inside one.
 */
describe('composite value animation', () => {
  const members = [
    createPolystatModel({ name: 'cpu', displayName: 'cpu', valueFormatted: '11.00' }),
    createPolystatModel({ name: 'mem', displayName: 'mem', valueFormatted: '22.00' }),
    createPolystatModel({ name: 'disk', displayName: 'disk', valueFormatted: '33.00' }),
  ];

  const composite = createPolystatModel({
    name: 'cluster-a',
    displayName: 'cluster-a',
    isComposite: true,
    showValue: true,
    displayMode: 'all',
    members,
  });

  const options: Partial<PolystatOptions> = {
    panelWidth: 400,
    panelHeight: 400,
    processedData: [composite],
    compositeConfig: { animationSpeed: '1000', composites: [], enabled: true },
  };

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const valueText = (container: HTMLElement) =>
    container.querySelector('[data-testid="polystat-value-1-0"]')!.innerHTML;

  const tick = (times: number) => {
    for (let i = 0; i < times; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
  };

  it('advances exactly one member per interval and wraps around', () => {
    const { container } = render(<Polystat {...createPolystatOptions(options)} />);

    // the first tick paints member 0, so the sequence trails the tick count by one
    tick(1);
    expect(valueText(container)).toBe('cpu: 11.00');
    tick(1);
    expect(valueText(container)).toBe('mem: 22.00');
    tick(1);
    expect(valueText(container)).toBe('disk: 33.00');
    tick(1);
    expect(valueText(container)).toBe('cpu: 11.00');
  });
});
