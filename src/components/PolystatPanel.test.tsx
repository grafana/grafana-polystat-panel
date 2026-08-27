import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldConfigSource, LoadingState, EventBusSrv, toDataFrame, FieldType } from '@grafana/data';

import { PolystatPanel } from './PolystatPanel';
import { createPolystatOptions } from '../test-utils/factory';

jest.mock('./Polystat', () => ({
  Polystat: (props: any) => <div data-testid="polystat-mock">{props.processedData?.length ?? 0} items</div>,
}));

// Polystat itself is mocked, so only the fields that steer data processing matter here.
// These are the values that differ from the factory's neutral defaults.
const makeOptions = () =>
  createPolystatOptions({
    globalClickthroughNewTabEnabled: true,
    globalFillColor: 'rgba(10, 85, 161, 1)',
    globalLabelFontSize: 14,
    globalValueFontSize: 22,
    globalCompositeValueFontSize: 22,
    globalPolygonBorderSize: 2,
    globalPolygonBorderColor: 'rgba(0, 0, 0, 0)',
    globalShowTimestampFormat: 'HH:mm:ss',
    globalTextFontAutoColorEnabled: true,
    globalTextFontColor: '#000000',
    globalTooltipsEnabled: true,
    globalTooltipsShowTimestampEnabled: true,
    layoutNumColumns: 6,
    layoutNumRows: 6,
    panelHeight: 400,
    panelWidth: 600,
    sortByDirection: 0,
    compositeConfig: { animationSpeed: '1500', composites: [], enabled: false },
    tooltipPrimarySortDirection: 0,
    tooltipPrimarySortByField: 'threshold',
    tooltipSecondarySortDirection: 0,
    tooltipSecondarySortByField: 'value',
  });

const time = new Date('01 October 2022 10:28 UTC').getTime();

const createPanelData = (state: LoadingState) => ({
  state,
  series: [
    toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
      ],
    }),
  ],
  timeRange: {
    from: new Date(time) as any,
    to: new Date(time + 2) as any,
    raw: { from: 'now-1h', to: 'now' },
  },
});

const fieldConfig: FieldConfigSource = {
  defaults: {},
  overrides: [],
};

const createProps = (overrides: Record<string, any> = {}) => ({
  id: 1,
  data: createPanelData(LoadingState.Done),
  timeRange: {
    from: new Date(time) as any,
    to: new Date(time + 2) as any,
    raw: { from: 'now-1h', to: 'now' },
  },
  timeZone: 'utc',
  options: makeOptions(),
  transparent: false,
  width: 600,
  height: 400,
  fieldConfig,
  renderCounter: 0,
  title: 'Test Polystat',
  eventBus: new EventBusSrv(),
  replaceVariables: (v: string) => v,
  onOptionsChange: jest.fn(),
  onFieldConfigChange: jest.fn(),
  onChangeTimeRange: jest.fn(),
  ...overrides,
});

describe('PolystatPanel', () => {
  it('should render loading state when data is not done', () => {
    const props = createProps({
      data: createPanelData(LoadingState.Loading),
    });
    render(<PolystatPanel {...(props as any)} />);
    expect(screen.getByText('Loading... please wait')).toBeInTheDocument();
    expect(screen.queryByTestId('polystat-mock')).not.toBeInTheDocument();
  });

  it('should render Polystat component when data is done', () => {
    const props = createProps();
    render(<PolystatPanel {...(props as any)} />);
    expect(screen.queryByText('Loading... please wait')).not.toBeInTheDocument();
    expect(screen.getByTestId('polystat-mock')).toBeInTheDocument();
  });

  it('should process data frames and pass results to Polystat', () => {
    const props = createProps();
    render(<PolystatPanel {...(props as any)} />);
    const polystat = screen.getByTestId('polystat-mock');
    expect(polystat.textContent).toBe('1 items');
  });

  it('should render loading state when data state transitions to streaming', () => {
    const props = createProps({
      data: createPanelData(LoadingState.Streaming),
    });
    render(<PolystatPanel {...(props as any)} />);
    expect(screen.getByText('Loading... please wait')).toBeInTheDocument();
  });

  it('should apply width and height to container', () => {
    const props = createProps({ width: 800, height: 500 });
    const { container } = render(<PolystatPanel {...(props as any)} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle('width: 800px');
    expect(wrapper).toHaveStyle('height: 500px');
  });

  it('should process multiple data frames', () => {
    const multiSeriesData = {
      state: LoadingState.Done,
      series: [
        toDataFrame({
          fields: [
            { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
            { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
          ],
        }),
        toDataFrame({
          fields: [
            { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
            { name: 'B-series', type: FieldType.number, values: [300, 310, 320] },
          ],
        }),
      ],
      timeRange: {
        from: new Date(time) as any,
        to: new Date(time + 2) as any,
        raw: { from: 'now-1h', to: 'now' },
      },
    };
    const props = createProps({ data: multiSeriesData });
    render(<PolystatPanel {...(props as any)} />);
    const polystat = screen.getByTestId('polystat-mock');
    expect(polystat.textContent).toBe('2 items');
  });
});
