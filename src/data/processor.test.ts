import { PolystatModel } from '../components/types';
import { FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from './processor';

describe('Main Processor', () => {
  var modelA: PolystatModel;
  var models: PolystatModel[];
  beforeEach(() => {
    const time = new Date().getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
      ],
    });
    // operator mean
    modelA = DataFrameToPolystat(frameA, 'mean')[0];
    modelA.operatorName = 'mean';

    // wide
    const frameB = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
        { name: 'B-series', type: FieldType.number, values: [201, 211, 221] },
      ],
    });
    // operator mean
    modelA = DataFrameToPolystat(frameA, 'mean')[0];
    models = DataFrameToPolystat(frameB, 'mean');
  });

  describe('With single result', () => {
    it('returns polystat model', () => {
      expect(modelA.isComposite).toBe(false);
      expect(modelA.stats.mean).toEqual(210);
      const staticStats = {
        sum: 630,
        max: 220,
        min: 200,
        logmin: 200,
        mean: 210,
        last: 220,
        first: 200,
        lastNotNull: 220,
        firstNotNull: 200,
        count: 3,
        nonNullCount: 3,
        allIsNull: false,
        allIsZero: false,
        range: 20,
        diff: 20,
        delta: 20,
        step: 10,
        diffperc: 0.1,
        previousDeltaUp: true,
      };
      for (const statKey of Object.keys(staticStats)) {
        const modelStat = modelA.stats[statKey];
        const staticStat = staticStats[statKey as keyof typeof staticStats];
        //console.log(`stat ${stat} static ${staticStat} computed ${convertedStat}`);
        expect(modelStat).toEqual(staticStat);
      }
      console.log(JSON.stringify(modelA.stats, null, 2));
    });

    it('returns polystat model from wide dataframe', () => {
      expect(models[0].stats.mean).toEqual(210);
      expect(models[1].stats.mean).toEqual(211);
      const staticStats = {
        sum: 630,
        max: 220,
        min: 200,
        logmin: 200,
        mean: 210,
        last: 220,
        first: 200,
        lastNotNull: 220,
        firstNotNull: 200,
        count: 3,
        nonNullCount: 3,
        allIsNull: false,
        allIsZero: false,
        range: 20,
        diff: 20,
        delta: 20,
        step: 10,
        diffperc: 0.1,
        previousDeltaUp: true,
      };
      for (const statKey of Object.keys(staticStats)) {
        const modelStat = models[0].stats[statKey];
        const staticStat = staticStats[statKey as keyof typeof staticStats];
        //console.log(`stat ${stat} static ${staticStat} computed ${convertedStat}`);
        expect(modelStat).toEqual(staticStat);
      }
      console.log(JSON.stringify(models[0], null, 2));
      console.log(JSON.stringify(models[1], null, 2));
    });
  });
});
