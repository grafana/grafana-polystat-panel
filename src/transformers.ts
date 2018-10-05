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

import {flatten} from "./flatten";
import _ from "lodash";
import {PolystatModel} from "./polystatmodel";

export class Transformers {

  static TimeSeriesToPolystat(operatorName: string, series: any): any {
    //console.log("Converting time series to hexbin");
    // only use min length, and start from the "end"
    // use timestamp of X
    //let tsLength = series.datapoints.length;
    //let bins = [];
    let aPolystat = new PolystatModel(operatorName, series);
    //console.log("Number of time series in X: " + tsLength);
    //for (let index = tsLength - 1; index >= 0; index--) {
    //for (let index = 0; index < tsLength; index++) {
      // get the number of metrics
    //  let aPolystat = new PolystatModel(series);
    //  bins.push(aPolystat);
    //}
    return aPolystat;
  }

  /*
  static TimeSeriesToHexbin(xTimeSeries : any, yTimeSeries : any) : PolystatModel {
    //console.log("Converting time series to hexbin");
    // only use min length, and start from the "end"
    // use timestamp of X
    let tsLength = xTimeSeries.datapoints.length;
    let tsYLength = yTimeSeries.datapoints.length;
    if (tsYLength < tsLength) {
      tsLength = tsYLength;
    }
    let bins = new PolystatModel("avg", xTimeSeries);
    //console.log("Number of time series in X: " + tsLength);
    //for (let index = tsLength - 1; index >= 0; index--) {
    for (let index = 0; index < tsLength; index++) {
      let x = xTimeSeries.datapoints[index][0];
      //let xTime = xTimeSeries.datapoints[index][1];
      let y = yTimeSeries.datapoints[index][0];
      //let yTime = yTimeSeries.datapoints[index][1];
      //console.log("y is " + y + " time: " + yTime);
      //console.log("x is " + x + " time: " + xTime);
      bins.push(x, y);
    }
    return bins;
  }
  */


/*
  static TableDataToHexbin(tableData : any, xColumn : number, yColumn : number) : PolystatModel {
    let bins = new PolystatModel([]);
    console.log(tableData[0].type);
    if (tableData[0].type === "table") {
      console.log("it is a table");
      let tsLength = tableData[0].rows.length;
      for (let index = 0; index < tsLength; index++) {
        let timeStamp = tableData[0].rows[index][0];
        let xColumnValue = tableData[0].rows[index][xColumn];
        let yColumnValue = tableData[0].rows[index][yColumn];
        console.log("getting time column " + timeStamp);
        console.log("getting x column " + xColumnValue);
        console.log("getting x column " + yColumnValue);
        bins.push(xColumnValue, yColumnValue);
      }
    }
    return bins;
  }
*/
  static GetColumnsJSONData(data): any {
    if (!data || data.length === 0) {
      return [];
    }
    var names: any = {};
    for (var i = 0; i < data.length; i++) {
      var series = data[i];
      if (series.type !== "docs") {
        continue;
      }

      // only look at 100 docs
      var maxDocs = Math.min(series.datapoints.length, 100);
      for (var y = 0; y < maxDocs; y++) {
        var doc = series.datapoints[y];
        var flattened = flatten(doc, null);
        for (var propName in flattened) {
          if (flattened.hasOwnProperty(propName)) {
            names[propName] = true;
          }
        }
      }
    }

    // TODO: this was value: key in original code
    return _.map(names, function (value, key) {
      return { text: key, value: value };
    });
  }
}

