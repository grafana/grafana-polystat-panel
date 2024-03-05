import { PolystatModel } from '../components/types';
import { FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat, ApplyGlobalRegexPattern, processDefaultClickThrough, ApplyGlobalClickThrough } from './processor';

describe('Main Processor', () => {
  let modelA: PolystatModel;
  let models: PolystatModel[];
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
    modelA.clickThrough = 'https://grafana.com';

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
    models[0].clickThrough = 'https://grafana.com/frameB';
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

  describe('Bug 308', () => {
    it('returns polystat model with columns named as expected', () => {
      const time = new Date().getTime();
      const frameSQL = toDataFrame({
        fields: [
          { name: 'Time', type: FieldType.time, values: [time]},
          { name: 'count', type: FieldType.number, values: [3], labels: {'severity': 'high'} },
          { name: 'count', type: FieldType.number, values: [0], labels: { 'severity': 'low'} },
          { name: 'count', type: FieldType.number, values: [5], labels: { 'severity': 'critical'} },
          { name: 'count', type: FieldType.number, values: [2], labels: { 'severity': 'medium' } },
        ],
      });
      const model = DataFrameToPolystat(frameSQL, 'lastNotNull');
      console.log(JSON.stringify(model, null, 2));
      expect(model.length).toEqual(4);
      expect(model[0].displayName).toEqual('count high');
      expect(model[0].stats['lastNotNull']).toEqual(3);
      expect(model[1].displayName).toEqual('count low');
      expect(model[1].stats['lastNotNull']).toEqual(0);
      expect(model[2].displayName).toEqual('count critical');
      expect(model[2].stats['lastNotNull']).toEqual(5);
      expect(model[3].displayName).toEqual('count medium');
      expect(model[3].stats['lastNotNull']).toEqual(2);
    });
  });

  describe('Test ApplyGlobalRegexPattern', () => {
    it('returns polystat model with -series removed from names', () => {
      const processed = ApplyGlobalRegexPattern(models, '/(.*)-series/');
      console.log(JSON.stringify(processed, null, 2));
      expect(processed[0].displayName).toEqual('A');
      expect(processed[1].displayName).toEqual('B');
    });
  });

  describe('Test processDefaultClickThrough', () => {
    const replaceVariables = (str: string) => {
      return str.replace(/\${machine}/g, 'machineA');
    }
    const globalClickthrough = '/d/dashboard?var-machine=${machine}';
    it('returns polystat model with global clickthrough applied', () => {
      // ensure not set
      modelA.clickThrough = '';
      const newUrl = processDefaultClickThrough(
        0,
        globalClickthrough,
        [modelA],
        replaceVariables
      );
      console.log(JSON.stringify(newUrl, null, 2));
      expect(newUrl).toEqual('/d/dashboard?var-machine=machineA');
    });
    it('returns polystat model with global clickthrough not applied', () => {
      // ensure not set
      modelA.clickThrough = '/d/dashboard-other?var-machine=${machine}';
      const applied = ApplyGlobalClickThrough(
        [modelA],
        globalClickthrough,
        false,
        false,
        false,
        '',
        replaceVariables
        );
      expect(applied[0].clickThrough).toEqual('/d/dashboard-other?var-machine=${machine}');
    });
  });
});
