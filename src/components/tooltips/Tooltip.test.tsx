import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { Tooltip, TooltipProps } from './Tooltip';
import { PolystatModel } from 'components/types';
import { FieldConfig, FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from 'data/processor';
import { CompositeItemType } from 'components/composites/types';
import { ApplyComposites } from 'data/composite_processor';

describe('Test Tooltips', () => {
  var compositeA: CompositeItemType;

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
  var modelB: PolystatModel;

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
    //
    const frameB = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'B-series', type: FieldType.number, values: [500, 510, 520] },
      ],
    });
    // operator mean
    modelB = DataFrameToPolystat(frameB, 'mean');
    modelB.operatorName = 'mean';
    //
    compositeA = {
      name: 'composite-a',
      label: 'composite-a',
      order: 0,
      templatedName: 'composite-a',
      isTemplated: false,
      displayMode: 'all',
      enabled: true,
      showName: true,
      showMembers: false,
      showValue: true,
      showComposite: true,
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      metrics: [
        {
          seriesMatch: '/series/',
          order: 0,
        },
      ],
    };
  });

  describe('Tooltip Generation', () => {
    it('returns tooltip for single metric', () => {
      render(<Tooltip reference={aRef} {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with one metric', () => {
      const applied = ApplyComposites([compositeA], [modelA], (val) => val);
      props.data = applied[0];
      render(<Tooltip reference={aRef} {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with two metrics', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB], (val) => val);
      props.data = applied[0];
      render(<Tooltip reference={aRef} {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
  });
});
