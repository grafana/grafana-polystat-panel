import { PolystatModel } from '../components/types';
import { FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from './processor';
import { getThresholdLevelForValue, getWorstSeries } from './threshold_processor';
import { DEFAULT_CRITICAL_COLOR_HEX, DEFAULT_OK_COLOR_HEX, DEFAULT_WARNING_COLOR_HEX } from 'components/defaults';
import { OverrideItemType } from 'components/overrides/types';
import { PolystatThreshold } from 'components/thresholds/types';
describe('Threshold Processor', () => {
  var modelA: PolystatModel;
  var modelB: PolystatModel;
  var thresholds: PolystatThreshold[];
  //@ts-ignore
  var overrideA: OverrideItemType;
  beforeEach(() => {
    const time = new Date().getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
      ],
    });
    // operator mean
    modelA = DataFrameToPolystat(frameA, 'mean');
    modelA.operatorName = 'mean';

    const frameB = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'B-series', type: FieldType.number, values: [500, 510, 520] },
      ],
    });
    // operator mean
    modelB = DataFrameToPolystat(frameB, 'mean');
    modelB.operatorName = 'mean';

    thresholds = [
      {
        color: DEFAULT_OK_COLOR_HEX,
        state: 0,
        value: 10,
      },
      {
        color: DEFAULT_WARNING_COLOR_HEX,
        state: 1,
        value: 20,
      },
      {
        color: DEFAULT_CRITICAL_COLOR_HEX,
        state: 2,
        value: 30,
      },
    ];
    overrideA = {
      label: 'OVERRIDE-0',
      metricName: '/A/',
      alias: '',
      thresholds: thresholds,
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
      order: 0,
    };
  });

  describe('Gets Worst Series A (no thresholds set)', () => {
    it('returns A-series as worst', () => {
      const worst = getWorstSeries(modelA, modelB);
      console.log(JSON.stringify(worst));
      expect(worst.name).toBe(modelA.name);
    });
  });
  describe('Gets States for A-series', () => {
    it('returns A-series with state OK', () => {
      const aLevel = getThresholdLevelForValue(thresholds, 10, DEFAULT_OK_COLOR_HEX);
      console.log(JSON.stringify(aLevel));
      expect(aLevel.thresholdLevel).toBe(0);
      expect(aLevel.color).toBe('#299c46');
    });
    it('returns A-series with state WARNING', () => {
      const aLevel = getThresholdLevelForValue(thresholds, 21, DEFAULT_OK_COLOR_HEX);
      console.log(JSON.stringify(aLevel));
      expect(aLevel.thresholdLevel).toBe(1);
      expect(aLevel.color).toBe('#ed8128');
    });
    it('returns A-series with state CRITICAL', () => {
      const aLevel = getThresholdLevelForValue(thresholds, 40, DEFAULT_OK_COLOR_HEX);
      console.log(JSON.stringify(aLevel));
      expect(aLevel.thresholdLevel).toBe(2);
      expect(aLevel.color).toBe('#f53636');
    });
  });
});
