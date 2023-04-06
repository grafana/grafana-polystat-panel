import { DataFrame, FieldType, toDataFrame } from '@grafana/data';
import { getMetricHints } from './metric_hints';

describe('Test Metric Hints', () => {
  let frame1: DataFrame;
  let frame2: DataFrame;
  let time: number;

  beforeEach(() => {
    time = new Date().getTime();
    frame1 = toDataFrame({
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

    frame2 = toDataFrame({
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

  });


  describe('Metric Hints', () => {
    it('returns set of hint from labels', () => {
      const hints = getMetricHints([frame1, frame2]);
      expect(hints.size).toEqual(3);
      let val = [...hints][0];
      expect(val).toEqual('A-series');
      val = [...hints][1];
      expect(val).toEqual('B with Label');
      val = [...hints][2];
      expect(val).toEqual('C-series');
    });
    it('returns hints no labels', () => {
      const hints = getMetricHints([frame2]);
      expect(hints.size).toEqual(1);
      let val = [...hints][0];
      expect(val).toEqual('C-series');
    });

  });

});
