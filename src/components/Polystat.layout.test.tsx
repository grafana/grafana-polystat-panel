import React from 'react';
import { render } from '@testing-library/react';

import { Polystat } from './Polystat';
import { PolygonShapes } from './types';
import { createPolystatModel, createPolystatOptions } from '../test-utils/factory';

// Polygons must stay inside the panel when a manual grid is larger than the data.
describe('Polystat layout centering', () => {
  const makeData = (count: number) =>
    Array.from({ length: count }, (_, i) =>
      createPolystatModel({ name: `metric-${i}`, displayName: `metric-${i}`, value: i })
    );

  const round2 = (value: number) => Math.round(value * 100) / 100;

  const renderPanel = (overrides: Parameters<typeof createPolystatOptions>[0]) => {
    const { container } = render(<Polystat {...createPolystatOptions(overrides)} />);
    const svg = container.querySelector('svg')!;
    const parseTranslate = (element: Element) => {
      const match = element.getAttribute('transform')!.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/)!;
      return { x: Number(match[1]), y: Number(match[2]) };
    };
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
      origin: [origin.x, origin.y],
      centers,
    };
  };

  // 3 items in an 8x8 manual grid leaves 5 unused columns and 7 unused rows
  const UNDER_FILLED = {
    autoSizeColumns: false,
    autoSizeRows: false,
    autoSizePolygons: true,
    layoutNumColumns: 8,
    layoutNumRows: 8,
    panelWidth: 800,
    panelHeight: 200,
    processedData: makeData(3),
  };

  it('places pointed-top hexagons on one centered row', () => {
    const { viewBox, origin, centers } = renderPanel({
      ...UNDER_FILLED,
      globalShape: PolygonShapes.HEXAGON_POINTED_TOP,
    });

    expect(origin).toEqual([0, 0]);
    expect(viewBox).toEqual([-226.8, -100, 800, 200]);
    expect(centers).toEqual([
      [0, 0],
      [173.21, 0],
      [346.41, 0],
    ]);
  });

  it('places flat-top hexagons on one centered row', () => {
    const { viewBox, origin, centers } = renderPanel({
      ...UNDER_FILLED,
      globalShape: PolygonShapes.HEXAGON_FLAT_TOP,
    });

    expect(origin).toEqual([0, 0]);
    expect(viewBox).toEqual([-284.53, -66.67, 800, 200]);
    // flat-top staggers odd columns down by half a hex height
    expect(centers).toEqual([
      [0, 0],
      [115.47, 66.67],
      [230.94, 0],
    ]);
  });

  it('places a fully occupied 4x2 grid', () => {
    const { viewBox, origin, centers } = renderPanel({
      autoSizeColumns: false,
      autoSizeRows: false,
      autoSizePolygons: true,
      layoutNumColumns: 4,
      layoutNumRows: 2,
      panelWidth: 800,
      panelHeight: 400,
      globalShape: PolygonShapes.HEXAGON_POINTED_TOP,
      processedData: makeData(8),
    });

    expect(origin).toEqual([0, 0]);
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
