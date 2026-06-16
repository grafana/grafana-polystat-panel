/**
 * Unit Test for clickParams
 */
import { FieldConfig, FieldType, toDataFrame } from '@grafana/data';

import { ClickThroughTransformer } from './clickThroughTransformer';
import { PolystatModel } from '../components/types';
import { DataFrameToPolystat } from './processor';

describe('ClickThroughTransformer', () => {
  let modelA: PolystatModel;
  let modelB: PolystatModel;
  let modelC: PolystatModel;
  let models: PolystatModel[] = [];
  const field: FieldConfig = {
    decimals: 2,
    unit: 'MBs',
  };
  beforeEach(() => {
    const time = new Date().getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220], config: field },
      ],
    });
    // operator mean
    modelA = DataFrameToPolystat(frameA, 'mean')[0];
    modelA.operatorName = 'mean';
    modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}';
    models.push(modelA);
    const frameB = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'B-series', type: FieldType.number, values: [500, 510, 520], config: field },
      ],
    });
    // operator mean
    modelB = DataFrameToPolystat(frameB, 'mean')[0];
    modelB.operatorName = 'mean';
    modelB.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}';
    models.push(modelB);
    const frameC = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: '1.0-2+auto10', type: FieldType.number, values: [600, 610, 620], config: field },
      ],
    });
    // operator mean
    modelC = DataFrameToPolystat(frameC, 'mean')[0];
    modelC.operatorName = 'mean';
    modelC.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}';
    models.push(modelC);
  });
  describe('Single Metric: Reference a cell name', () => {
    it('returns cell name', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=A-series');
    });
  });
  describe('Single Metric: Reference a cell name with encoding required', () => {
    it('returns cell name', () => {
      const url = modelC.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(2, url, models);
      // this should be an encoded value
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=1.0-2%2Bauto10');
    });
  });

  describe('Single Metric: Reference a cell value with units', () => {
    it('returns cell value', () => {
      console.log(JSON.stringify(modelA));
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=210.00%20MB%2Fs');
    });
  });
  describe('Single Metric: Reference a raw cell value', () => {
    it('returns cell raw value', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell:raw}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=210');
    });
  });
  describe('Multiple Metrics: Reference a cell name with index 0', () => {
    it('returns cell name of metric 0', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_0}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=A-series');
    });
  });
  describe('Multiple Metrics: Reference a cell name with index 1', () => {
    it('returns cell name of metric 1', () => {
      modelB.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_1}';
      const url = modelB.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=B-series');
    });
  });
  describe('Multiple Metrics: Reference a cell formatted value with index 0', () => {
    it('returns cell formatted value of metric 0', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_0}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=210.00%20MB%2Fs');
    });
  });
  describe('Multiple Metrics: Reference a cell formatted value with index 1', () => {
    it('returns cell formatted value of metric 1', () => {
      modelB.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_1}';
      const url = modelB.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=510.00%20MB%2Fs');
    });
  });
  describe('Multiple Metrics: Reference a cell raw value with index 0', () => {
    it('returns cell raw value  of metric 0', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_0:raw}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=210');
    });
  });
  describe('Multiple Metrics: Reference a cell raw value with index 1', () => {
    it('returns cell raw value of metric 1', () => {
      modelB.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM=${__cell_1:raw}';
      const url = modelB.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM=510');
    });
  });

  /* multiple substitutions */
  describe('Multiple Metrics: Reference multiple metric names', () => {
    it('returns cell name multiple times', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell_name}&var-CUSTOM1=${__cell_name}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=A-series&var-CUSTOM1=A-series');
    });
  });
  describe('Multiple Metrics: Reference multiple metric names', () => {
    it('returns cell value multiple times', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell}&var-CUSTOM1=${__cell}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=210.00%20MB%2Fs&var-CUSTOM1=210.00%20MB%2Fs');
    });
  });
  describe('Multiple Metrics: Reference multiple metric names', () => {
    it('returns cell raw value multiple times', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell:raw}&var-CUSTOM1=${__cell:raw}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=210&var-CUSTOM1=210');
    });
  });
  describe('Multiple Metrics: Reference multiple metric names', () => {
    it('returns cell names', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell_name_0}&var-CUSTOM1=${__cell_name_1}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=A-series&var-CUSTOM1=B-series');
    });
  });
  describe('Multiple Metrics: Reference multiple formatted values', () => {
    it('returns formatted values', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0}&var-CUSTOM1=${__cell_1}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=210.00%20MB%2Fs&var-CUSTOM1=510.00%20MB%2Fs');
    });
  });
  describe('Multiple Metrics: Reference multiple raw values', () => {
    it('returns formatted values', () => {
      modelA.clickThrough = '/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe('/dashboard/test?orgId=1&var-CUSTOM0=210&var-CUSTOM1=510');
    });
  });

  /* composites */
  describe('Composite: Reference the composite name', () => {
    it('returns composite name', () => {
      const compositeName = 'CompositeA';
      const url = '/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}';
      const result = ClickThroughTransformer.transformComposite(compositeName, url);
      expect(result).toBe('/dashboard/test?orgId=1&var-COMPOSITE=CompositeA');
    });
  });

  /* encoding */
  describe('Clickthrough: transformSingleMetric', () => {
    it('returns non-encoded params', () => {
      modelA.clickThrough =
        'https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=${__cell_name}&var-port=9100';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformSingleMetric(0, url, models);
      expect(result).toBe(
        'https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=A-series&var-port=9100'
      );
    });
  });

  describe('Clickthrough: transformNthMetric', () => {
    it('returns non-encoded params', () => {
      modelA.clickThrough =
        'https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}&var-port=9100';
      const url = modelA.clickThrough;
      const result = ClickThroughTransformer.transformNthMetric(url, models);
      expect(result).toBe(
        'https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=210&var-CUSTOM1=510&var-port=9100'
      );
    });
  });

  describe('Clickthrough: transformComposite', () => {
    it('returns non-encoded params', () => {
      const compositeName = 'CompositeA';
      const url = 'https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}&var-port=9100';
      const result = ClickThroughTransformer.transformComposite(compositeName, url);
      expect(result).toBe('https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=CompositeA&var-port=9100');
    });
  });
});
