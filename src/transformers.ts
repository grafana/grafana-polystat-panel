/*
 Metric transforms

 Avg/Min/Max etc
 TimeSeries to Hexbin
 Table to Hexbin
 ? to Hexbin
 */

/*
 Hexbin requires two series in this form:
  array[][x,y]
*/

import { flatten } from './flatten';
import _ from 'lodash';
import { PolystatModel } from './polystatmodel';

export class Transformers {
  static TimeSeriesToPolystat(operatorName: string, series: any): any {
    // only use min length, and start from the "end"
    // use timestamp of X
    //let tsLength = series.datapoints.length;
    //let bins = [];
    const aPolystat = new PolystatModel(operatorName, series);
    //for (let index = tsLength - 1; index >= 0; index--) {
    //for (let index = 0; index < tsLength; index++) {
    // get the number of metrics
    //  let aPolystat = new PolystatModel(series);
    //  bins.push(aPolystat);
    //}
    return aPolystat;
  }

  static GetColumnsJSONData(data): any {
    if (!data || data.length === 0) {
      return [];
    }
    const names: any = {};
    for (let i = 0; i < data.length; i++) {
      const series = data[i];
      if (series.type !== 'docs') {
        continue;
      }

      // only look at 100 docs
      const maxDocs = Math.min(series.datapoints.length, 100);
      for (let y = 0; y < maxDocs; y++) {
        const doc = series.datapoints[y];
        const flattened = flatten(doc, null);
        for (const propName in flattened) {
          if (flattened.hasOwnProperty(propName)) {
            names[propName] = true;
          }
        }
      }
    }

    // TODO: this was value: key in original code
    return _.map(names, (value, key) => {
      return { text: key, value: value };
    });
  }
}
