import React from 'react';
import { render } from '@testing-library/react';

import { Polystat } from './Polystat';
import { PolygonShapes, PolystatOptions } from './types';
import { createPolystatModel, createPolystatOptions } from '../test-utils/factory';

// Polygons must stay inside the panel when a manual grid is larger than the data.
describe('Polystat layout centering', () => {
  const makeData = (count: number) =>
    Array.from({ length: count }, (_, i) => createPolystatModel({ name: `metric-${i}`, displayName: `metric-${i}` }));

  const round2 = (value: number) => Math.round(value * 100) / 100;

  // the factory already defaults to an 8x8 grid on an 800x200 panel
  const manualGrid = (overrides: Partial<PolystatOptions>): Partial<PolystatOptions> => ({
    autoSizeColumns: false,
    autoSizeRows: false,
    ...overrides,
  });

  const renderPanel = (overrides: Partial<PolystatOptions>) => {
    const { container } = render(<Polystat {...createPolystatOptions(overrides)} />);
    const svg = container.querySelector('svg')!;
    const parseTranslate = (element: Element) => {
      const match = element.getAttribute('transform')!.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/)!;
      return { x: Number(match[1]), y: Number(match[2]) };
    };
    // the group transform folds into every center, so a stray nudge shows up in centers
    const origin = parseTranslate(svg.querySelector('g')!);
    const centers = Array.from(svg.querySelectorAll('path[transform]')).map((path) => {
      const point = parseTranslate(path);
      return [round2(origin.x + point.x), round2(origin.y + point.y)];
    });
    return {
      viewBox: svg
        .getAttribute('viewBox')!
        .split(',')
        .map((value) => round2(Number(value))),
      centers,
    };
  };

  // circles and squares are not drawn as paths, so their positions come off their own attributes
  const renderUniform = (overrides: Partial<PolystatOptions>) => {
    const { container } = render(<Polystat {...createPolystatOptions(overrides)} />);
    const svg = container.querySelector('svg')!;
    const read = (element: Element, ...names: string[]) => names.map((name) => Number(element.getAttribute(name)));
    return {
      viewBox: svg
        .getAttribute('viewBox')!
        .split(',')
        .map((value) => round2(Number(value))),
      circles: Array.from(svg.querySelectorAll('circle')).map((c) => read(c, 'cx', 'cy', 'r')),
      squares: Array.from(svg.querySelectorAll('rect')).map((r) => read(r, 'x', 'y', 'width')),
    };
  };

  it('centers circles when a manual grid is larger than the data', () => {
    const { viewBox, circles } = renderUniform(
      manualGrid({ panelHeight: 400, globalShape: PolygonShapes.CIRCLE, processedData: makeData(4) })
    );

    // the row spans x = -100..700 (cx 0..600 with r 100), exactly matching the viewBox
    expect(viewBox).toEqual([-100, -200, 800, 400]);
    expect(circles).toEqual([
      [0, 0, 100],
      [200, 0, 100],
      [400, 0, 100],
      [600, 0, 100],
    ]);
  });

  it('centers squares when a manual grid is larger than the data', () => {
    const { viewBox, squares } = renderUniform(
      manualGrid({ panelHeight: 400, globalShape: PolygonShapes.SQUARE, processedData: makeData(4) })
    );

    // the row spans x = 0..800 (x 0..600 plus a 200 width), exactly matching the viewBox
    expect(viewBox).toEqual([0, -100, 800, 400]);
    expect(squares).toEqual([
      [0, 0, 200],
      [200, 0, 200],
      [400, 0, 200],
      [600, 0, 200],
    ]);
  });

  it('places pointed-top hexagons on one centered row', () => {
    // 3 items in an 8x8 manual grid leaves 5 unused columns and 7 unused rows
    const { viewBox, centers } = renderPanel(
      manualGrid({ globalShape: PolygonShapes.HEXAGON_POINTED_TOP, processedData: makeData(3) })
    );

    expect(viewBox).toEqual([-226.8, -100, 800, 200]);
    expect(centers).toEqual([
      [0, 0],
      [173.21, 0],
      [346.41, 0],
    ]);
  });

  it('places flat-top hexagons on one centered row', () => {
    const { viewBox, centers } = renderPanel(
      manualGrid({ globalShape: PolygonShapes.HEXAGON_FLAT_TOP, processedData: makeData(3) })
    );

    expect(viewBox).toEqual([-284.53, -66.67, 800, 200]);
    // flat-top staggers odd columns down by half a hex height
    expect(centers).toEqual([
      [0, 0],
      [115.47, 66.67],
      [230.94, 0],
    ]);
  });

  it('places a fully occupied 4x2 grid', () => {
    const { viewBox, centers } = renderPanel(
      manualGrid({
        layoutNumColumns: 4,
        layoutNumRows: 2,
        panelHeight: 400,
        globalShape: PolygonShapes.HEXAGON_POINTED_TOP,
        processedData: makeData(8),
      })
    );

    expect(viewBox).toEqual([-88.9, -123.02, 800, 400]);
    // the second row is offset right by half a hex width
    expect(centers).toEqual([
      [0, 0],
      [177.78, 0],
      [355.56, 0],
      [533.33, 0],
      [88.89, 153.96],
      [266.67, 153.96],
      [444.44, 153.96],
      [622.22, 153.96],
    ]);
  });
});
