import { FieldConfig, FieldType, toDataFrame } from '@grafana/data';
import { DataFrameToPolystat } from '../../data/processor';
import { PolystatModel } from '../../components/types';

const field: FieldConfig = {
  decimals: 2,
  unit: 'MBs',
};

const time = new Date('01 October 2022 10:28 UTC').getTime();
//
const frameA = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'A-series02', type: FieldType.number, values: [200, 210, 220], config: field },
  ],
});
export const modelA: PolystatModel = DataFrameToPolystat(frameA, 'mean')[0];
//
const frameB = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'B-series03', type: FieldType.number, values: [500, 510, 520] },
  ],
});
//
export const modelB: PolystatModel = DataFrameToPolystat(frameB, 'mean')[0];
const frameC = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'C-series01', type: FieldType.number, values: [333, 444, 555] },
  ],
});
export const modelC: PolystatModel = DataFrameToPolystat(frameC, 'mean')[0];

/*
  Numerical Metric Names
*/
const numericalFrameA = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: '02', type: FieldType.number, values: [200, 210, 220], config: field },
  ],
});
export const numericalModelA: PolystatModel = DataFrameToPolystat(numericalFrameA, 'mean')[0];

const numericalFrameB = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: '03', type: FieldType.number, values: [500, 510, 520] },
  ],
});
export const numericalModelB: PolystatModel = DataFrameToPolystat(numericalFrameB, 'mean')[0];

const numericalFrameC = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: '01', type: FieldType.number, values: [333, 444, 555] },
  ],
});
export const numericalModelC: PolystatModel = DataFrameToPolystat(numericalFrameC, 'mean')[0];

/*
  Numerical Metric Names
*/
const casedFrameA = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'series-a1', type: FieldType.number, values: [200, 210, 220], config: field },
  ],
});
export const casedModelA: PolystatModel = DataFrameToPolystat(casedFrameA, 'mean')[0];

const casedFrameB = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'series-a3', type: FieldType.number, values: [500, 510, 520] },
  ],
});
export const casedModelB: PolystatModel = DataFrameToPolystat(casedFrameB, 'mean')[0];

const casedFrameC = toDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
    { name: 'series-A2', type: FieldType.number, values: [333, 444, 555] },
  ],
});
export const casedModelC: PolystatModel = DataFrameToPolystat(casedFrameC, 'mean')[0];
