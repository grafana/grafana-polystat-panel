
/**
 * Tests for transforms
 */

//import {TimeSeries} from "../../tests/timeseries";

// Helper class
/*
class TimeSeries {
  datapoints: number[][];
  alias: string;
  target: string;
  constructor(opts: {datapoints: number[][], alias: string}) {
    this.datapoints = opts.datapoints;
    this.alias = opts.alias;
    this.target = opts.alias;
  }
}
*/
//import {Transformers} from "../src/transformers";
//import {PolystatModel} from "../src/polystatmodel";
// get this working...
//import "app/core/time_series2";

describe("Transforms", () => {
    // Datasource sends timeseries
  describe("With time series data", () => {
    /*
    let xAxisSeries: TimeSeries;
    let yAxisSeries: TimeSeries;

    let hexbin: PolystatModel;
    beforeEach(() => {
      var time = new Date().getTime();
      xAxisSeries = new TimeSeries({
        datapoints: [[200, time], [101, time + 1], [555, time + 2]],
        alias: "A-series",
      });
      yAxisSeries = new TimeSeries({
        datapoints: [[888, time], [777, time + 1], [444, time + 2]],
        alias: "B-Series",
      });
    });
    */
    /*
    it("Can convert to hexbin", async() => {
      let bins = Transformers.TimeSeriesToHexbin(xAxisSeries, yAxisSeries);
      console.log(bins);
      expect(bins.series[0][0]).toEqual(200);
      expect(bins.series[0][1]).toEqual(888);
      expect(bins.series[2][0]).toEqual(555);
      expect(bins.series[2][1]).toEqual(444);
    });
    */
  });

  // Datasource sends ElasticSearch results
  describe("With elasticsearch data", () => {
    it("Can convert to hexbin", () => {
      expect(true).toBeTruthy();
    });
  });

  // Datasource sends a table
  describe("With Table data", () => {
    const tableData = [{
      columns: [
        {
          text: "Time",
          type: "time"
        }, {
          text: "xitem"
        }, {
          text: "yitem"
        }, {
          text: "nonitem"
        }
      ],
      rows: [
        [1492759673649, 20, 15, "ignore2"]
      ],
      type: "table"
    }];
    it("Converts Table Data", () => {
      console.log(tableData);
    });
    /*
    it("Can convert x and y items to hexbin", async() => {
      let xColumn = 1;
      let yColumn = 2;
      let bins = Transformers.TableDataToHexbin(tableData, xColumn, yColumn);
      console.log(bins);
      expect(bins.series[0][0]).toEqual(20);
      expect(bins.series[0][1]).toEqual(15);
    });
    */
    /*
    it("Can convert x and time items to hexbin", async () => {
      let xColumn = 0;
      let yColumn = 1;
      let bins = Transformers.TableDataToHexbin(tableData, xColumn, yColumn);
      console.log(bins);
      expect(bins.series[0][0]).toEqual(1492759673649);
      expect(bins.series[0][1]).toEqual(20);
    });
    */
    /*
    it("Can convert y and time items to hexbin", async() => {
      let xColumn = 0;
      let yColumn = 2;
      let bins = Transformers.TableDataToHexbin(tableData, xColumn, yColumn);
      console.log(bins);
      expect(bins.series[0][0]).toEqual(1492759673649);
      expect(bins.series[0][1]).toEqual(15);
    });
    */
});

  // Datasource sends JSON
  describe("With JSON data", () => {
    it("Can convert to hexbin", () => {
      let rawData = [
        {
          type: "docs",
          datapoints: [
          {
            timestamp: "time",
            message: "message",
            nested: {
              level2: "level2-value"
            }
          }
        ]
      }];
      console.log(rawData);
      expect(true).toBeTruthy();
    });
  });
});
