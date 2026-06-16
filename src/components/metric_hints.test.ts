import { DataFrame, FieldType, toDataFrame } from '@grafana/data';
import { getMetricHints } from './metric_hints';

describe('Test Metric Hints', () => {
  let wideFrame: DataFrame;
  let narrowFrame: DataFrame;
  let frameCW: DataFrame;
  let frameInfluxDB: DataFrame;
  let time: number;

  beforeEach(() => {
    time = new Date().getTime();

    wideFrame = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
        {
          name: 'B-series',
          type: FieldType.number,
          values: [100, 110, 120],
          labels: { '__name__': 'B with Label', 'fake-label-b': 'BName' }
        },
      ],
    });

    narrowFrame = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        {
          name: 'C-series',
          type: FieldType.number,
          values: [101, 111, 121],
          labels: { '__not_name__': 'C with label', 'fake-label-c': 'CLabel' }
        },
      ],
    });

    // sample cloudwatch dataframe
    frameCW = toDataFrame({
      name: '5XXError',
      fields: [
        { name: 'Time', type: FieldType.time, values: [time, time + 1, time + 2] },
        {
          name: 'Value',
          type: 'number',
          typeInfo: { frame: 'float64', nullable: true },
          labels: {},
          config: {
            displayNameFromDS: '5XXError',
            links: [],
          },
          values: [1.1, 2.2, 3.3],
        },
      ],
    });

    frameInfluxDB = toDataFrame({
      name: 'changePctDay.mean { coin: btc currency: usd }',
      fields: [
        { name: 'Time', type: FieldType.time, values: [time, time + 1, time + 2] },
        {
          name: 'value',
          type: 'number',
          typeInfo: { frame: 'float64', nullable: true },
          labels: {
            "coin": "btc",
            "currency": "usd"
          },
          config: {
            displayNameFromDS: 'changePctDay.mean { coin: btc currency: usd }',
            links: [],
          },
          values: [1.1, 2.2, 3.3],
        },
      ],
    });

  });


  describe('Metric Hints', () => {
    it('returns set of hints from labels', () => {
      const hints = getMetricHints([wideFrame, narrowFrame]);
      expect(hints.size).toEqual(3);
      let val = [...hints][0];
      expect(val).toEqual('A-series');
      val = [...hints][1];
      expect(val).toEqual('B with Label{fake-label-b="BName"}');
      val = [...hints][2];
      expect(val).toEqual('C-series');
    });
    it('returns hints with no labels', () => {
      const hints = getMetricHints([narrowFrame]);
      expect(hints.size).toEqual(1);
      let val = [...hints][0];
      expect(val).toEqual('C-series');
    });
    it('returns hints from a CW frame', () => {
      const hints = getMetricHints([frameCW]);
      expect(hints.size).toEqual(1);
      let val = [...hints][0];
      expect(val).toEqual('5XXError');
    });
    it('returns hints from an influxdb source', () => {
      const hints = getMetricHints([frameInfluxDB]);
      expect(hints.size).toEqual(1);
      let val = [...hints][0];
      expect(val).toEqual('changePctDay.mean { coin: btc currency: usd }');
    });

  });

});
