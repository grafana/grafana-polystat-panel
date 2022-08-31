import { PolystatModel } from '../components/types';
import { FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from './processor';
import { getWorstSeries } from './threshold_processor';
import { CompositeItemType } from 'components/composites/types';
import { ApplyComposites } from './composite_processor';

describe('Composite Processor', () => {
  var modelA: PolystatModel;
  var modelB: PolystatModel;
  var compositeA: CompositeItemType;

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

  describe('Gets Worst Series A (no thresholds set)', () => {
    it('returns A-series as worst', () => {
      const worst = getWorstSeries(modelA, modelB);
      console.log(JSON.stringify(worst));
      expect(worst.name).toBe(modelA.name);
    });
  });
  describe('Creates composite result', () => {
    it('returns an applied composite', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB], (val) => val);
      console.log(JSON.stringify(applied));
      expect(applied.length).toBe(1);
    });
  });
});
