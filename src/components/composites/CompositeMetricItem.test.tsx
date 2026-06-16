import React from 'react';
import { render } from '@testing-library/react';

import { CompositeMetricItem } from './CompositeMetricItem';
import { CompositeMetricItemProps, CompositeMetric } from './types';
import { FieldType, toDataFrame } from '@grafana/data';

describe('Test CompositeMetricItem', () => {
  const time = new Date().getTime();

  const frameA = toDataFrame({
    fields: [
      { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
      { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
    ],
  });

  const aMetric: CompositeMetric = {
    seriesMatch: '.*',
    order: 0,
  }
  const props: CompositeMetricItemProps = {
    metric: aMetric,
    index: 0,
    disabled: false,
    removeMetric: undefined,
    updateMetric: undefined,
    updateMetricAlias: undefined,
    context: { data: [frameA] },
  };
  beforeEach(() => { });

  describe('Metric Hints', () => {
    it('returns set of hint from labels', () => {
      const { container } = render(
        <CompositeMetricItem {...props} />
      );
      console.log(container.innerHTML);
      expect(container.innerHTML).toMatchSnapshot();
    });
  });
});
