// from grafana core

import { map as isArray } from 'lodash';
import { DataFrame, DataQueryResponseData, guessFieldTypes, toDataFrame } from '@grafana/data';

/**
 * Use for loading snapshot data
 *
 * @param   {DataQueryResponseData[][]}  results  [results description]
 *
 * @return  {DataFrame[]}                         [return description]
 */
export function getProcessedDataFrames(results?: DataQueryResponseData[]): DataFrame[] {
  if (!results || !isArray(results)) {
    return [];
  }

  const dataFrames: DataFrame[] = [];

  for (const result of results) {
    const dataFrame = guessFieldTypes(toDataFrame(result));

    if (dataFrame.fields && dataFrame.fields.length) {
      // clear out the cached info
      for (const field of dataFrame.fields) {
        field.state = null;
      }
    }

    dataFrames.push(dataFrame);
  }

  return dataFrames;
}
