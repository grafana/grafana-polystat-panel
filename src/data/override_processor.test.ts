/**
 * Tests for utils
 */
//import 'jest-canvas-mock';
import { renderHook } from '@testing-library/react';

import { ApplyOverrides, MatchOverride } from './override_processor';
import { OverrideItemType } from 'components/overrides/types';
import { PolystatModel, ShowTimestampFormats } from '../components/types';
import { FieldConfigSource, FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from './processor';
import { useTheme, useTheme2 } from '@grafana/ui';

describe('Test Overrides', () => {
  let modelA: PolystatModel;
  let overrideA: OverrideItemType = {
    label: 'OVERRIDE-0',
    metricName: '/A/',
    alias: '',
    thresholds: [],
    colors: [],
    unitFormat: 'short',
    decimals: '2',
    scaledDecimals: 0,
    enabled: true,
    operatorName: 'mean',
    prefix: '',
    suffix: '',
    clickThrough: '',
    clickThroughSanitize: false,
    clickThroughOpenNewTab: false,
    clickThroughCustomTargetEnabled: false,
    clickThroughCustomTarget: '',
    order: 0,
    showTimestampEnabled: false,
    showTimestampFormat: ShowTimestampFormats[0].value,
    showTimestampYOffset: 0,
  };
  const replaceVariables = (str: string) => {
    return str.replace(/\${noVariable}/g, 'noValue');
  }

  beforeEach(() => {
    const time = new Date().getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
      ],
    });
    modelA = DataFrameToPolystat(frameA, 'mean')[0];
  });
  describe('Override affects model', () => {
    it('returns an override match', () => {
      const { result } = renderHook(() => MatchOverride(modelA.name, [overrideA], replaceVariables));
      expect(result.current).not.toBeNull();
      expect(result.current?.label).toBe('OVERRIDE-0');
    });
    it('returns an overridden model', () => {
      const fieldConfig: FieldConfigSource<any> = {
        defaults: {
          mappings: [],
        },
        overrides: [],
      };
      const { result } = renderHook(() => ApplyOverrides([overrideA], [modelA], fieldConfig, 'white', [], replaceVariables, 'utc', useTheme(), useTheme2()));
      expect(result.current).not.toBeNull();
      const x = result.current;
      const modified = x[0];
      //console.log(JSON.stringify(modified));
      expect(modified.valueFormatted).toBe('210.00');
      expect(modified.color).toBe('#ffffff');
    });
  });
});
