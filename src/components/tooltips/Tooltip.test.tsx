import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { Tooltip, TooltipProps } from './Tooltip';
import { PolystatModel } from 'components/types';
import { FieldConfig, FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from 'data/processor';

describe('Test Tooltips', () => {
  const aRef = createRef();
  const field: FieldConfig = {
    decimals: 2,
    unit: 'MBs',
  };
  const props: TooltipProps = {
    data: undefined,
    valueEnabled: true,
    reference: aRef,
    followMouse: false,
    visible: true,
    renderTime: undefined,
    showTime: true,
    primarySortByField: 'threshold',
    primarySortDirection: 0,
    secondarySortByField: 'value',
    secondarySortDirection: 0,
    displayMode: 'all',
    tooltipDisplayTextTriggeredEmpty: 'EMPTY',
  };
  var modelA: PolystatModel;
  beforeEach(() => {
    //const event = new Date('05 October 2011 14:48 UTC');
    const time = new Date('01 October 2022 10:28 UTC').getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220], config: field },
      ],
    });
    modelA = DataFrameToPolystat(frameA, 'mean');
    modelA.isComposite = false;
    props.data = modelA;
    props.renderTime = new Date('01 October 2022 10:28 UTC');
  });

  describe('Tooltip Generation', () => {
    it('returns tooltip for single metric', () => {
      render(<Tooltip reference={aRef} {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
  });
});
