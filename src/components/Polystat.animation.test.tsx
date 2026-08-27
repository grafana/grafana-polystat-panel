import React from 'react';
import { act, render } from '@testing-library/react';

import { Polystat } from './Polystat';
import { LayoutManager } from './layout/layoutManager';
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

  it('paints the first member before any interval elapses', () => {
    const { container } = render(<Polystat {...createPolystatOptions(options)} />);

    // rendered directly, not by the tick, which is why the assertions below start after tick 2
    expect(valueText(container)).toBe('cpu: 11.00');
  });

  it('advances exactly one member per interval and wraps around', () => {
    const { container } = render(<Polystat {...createPolystatOptions(options)} />);

    // member 0 is shown on mount and repainted by the first tick, so it is displayed for two
    // intervals while every other member gets one
    tick(2);
    expect(valueText(container)).toBe('mem: 22.00');
    tick(1);
    expect(valueText(container)).toBe('disk: 33.00');
    tick(1);
    expect(valueText(container)).toBe('cpu: 11.00');
    tick(1);
    expect(valueText(container)).toBe('mem: 22.00');
  });

  it('keeps ticking after the interval is torn down and remounted', () => {
    const first = render(<Polystat {...createPolystatOptions(options)} />);
    tick(2);
    expect(valueText(first.container)).toBe('mem: 22.00');
    first.unmount();

    // a stale interval writing through a released ref would throw or resume mid-cycle
    const second = render(<Polystat {...createPolystatOptions(options)} />);
    tick(2);
    expect(valueText(second.container)).toBe('mem: 22.00');
  });

  it('repaints without re-running the layout', () => {
    // generatePoints runs once per render. The tick writes text through refs, so it must not
    // trigger one: holding the member indexes in state re-solved the whole layout every frame.
    const generatePoints = jest.spyOn(LayoutManager.prototype, 'generatePoints');
    const { container } = render(<Polystat {...createPolystatOptions(options)} />);
    const rendersOnMount = generatePoints.mock.calls.length;

    tick(3);

    expect(valueText(container)).toBe('disk: 33.00');
    expect(generatePoints.mock.calls.length).toBe(rendersOnMount);
    generatePoints.mockRestore();
  });
});
