import {CompositesManager, MetricComposite} from "../composites_manager";
import {getWorstSeries} from "../threshold_processor";
import {PolystatModel} from "../polystatmodel";
import {TimeSeries} from "./timeseries";
jest.mock("app/core/utils/kbn");

describe("CompositesManager", () => {
  let aModel: PolystatModel;
  let bModel: PolystatModel;
  let aSeries: TimeSeries;
  let bSeries: TimeSeries;
  let mgr: CompositesManager;

  beforeEach(() => {
    var time = new Date().getTime();
    aSeries = new TimeSeries({
      datapoints: [[200, time], [101, time + 1], [555, time + 2]],
      alias: "A-series",
      seriesName: "A-series",
      operatorName: "current",
    });
    aSeries.stats = {
      avg: 285,
      current: 200
    };
    aSeries.value = 200;
    aSeries.thresholds = [];
    aSeries.thresholds.push( {
      value: 180,
      state: 1,
      color: "yellow",
    });
    aSeries.thresholds.push( {
      value: 200,
      state: 2,
      color: "red",
    });
    bSeries = new TimeSeries({
      datapoints: [[100, time], [1, time + 1], [42, time + 2]],
      alias: "B-series",
      seriesName: "B-series",
      operatorName: "current",
    });
    bSeries.stats = {
      avg: 68,
      current: 100
    };
    bSeries.value = 100;
    bSeries.thresholds = [];
    bSeries.thresholds.push( {
      value: 50,
      state: 1,
      color: "yellow",
    });
    bSeries.thresholds.push( {
      value: 120,
      state: 2,
      color: "red",
    });
    aModel = new PolystatModel("current", aSeries);
    bModel = new PolystatModel("current", bSeries);

    let aComposite = new MetricComposite();
    aComposite.compositeName = "composite1";
    aComposite.clickThrough = "";
    aComposite.enabled = true;
    aComposite.members = [
      {seriesName: "A-series"}
    ];
    mgr = new CompositesManager(null, null, null, [aComposite]);
  });

  describe("Adding new composite", () => {
    it("returns 2 composites", () => {
      mgr.addMetricComposite();
      expect(mgr.metricComposites.length).toBe(2);
    });
  });

  /* needs real kbn, not a mock */
  describe("Matching composites", () => {
    it("does not find composite5", () => {
      let found = mgr.matchComposite("composite5");
      expect(found).toBe(-1);
    });
    it("finds composite1", () => {
      let found = mgr.matchComposite("composite1");
      expect(found).toBe(0);
    });
  });

  describe("Worst Series", () => {
    it("returns A-series", () => {
      let result = getWorstSeries(aSeries, bSeries, "#ffffff");
      expect(result.alias).toBe("A-series");
    });
    it("returns A-series when aSeries.value is 20", () => {
      aSeries.stats.current = 20;
      let result = getWorstSeries(aSeries, bSeries, "#ffffff");
      expect(result.alias).toBe("A-series");
    });
    it("returns B-series when aSeries.value is null", () => {
      aSeries.value = null;
      aSeries.stats.current = null;
      let result = getWorstSeries(aSeries, bSeries, "#ffffff");
      expect(result.alias).toBe("B-series");
    });
    it("returns A-series when aSeries.value and bSeries.value are null", () => {
      aSeries.value = null;
      bSeries.value = null;
      let result = getWorstSeries(aSeries, bSeries, "#ffffff");
      expect(result.alias).toBe("A-series");
    });

    /* test for nodata
        if (series1.name === "GPU_0") {
          series1.value = NaN;
          series1.valueFormatted = "";
          series1.valueRounded = NaN;
          series1.stats.current = null;
        }
    */
  });

  describe("Composite Colors", () => {
    it("returns A-series", () => {
      //let data = mgr.applyComposites([aSeries, bSeries]);
      let data = mgr.applyComposites([aModel, bModel]);
      //console.log("data is: " + data);
      expect(data.length).toBe(3);
      //var str = JSON.stringify(data[2], null, 2); // spacing level = 2
      //console.log("data[2] is: " + str);
      expect(data[2].color === "green");
      aModel.value = 181;
      aModel.valueFormatted = "181";
      //console.log("trying value 20");
      let datax = mgr.applyComposites([aModel, bModel]);
      //str = JSON.stringify(datax[2], null, 2);
      //console.log("datax[2] is: " + str);
      expect(datax[2].color).toBe("green");
    });
  });

  /*
  describe("Series Thresholds", () => {
    it("A-series threshold level is critical", () => {
      let result = mgr.getThresholdLevelForSeriesValue(aSeries);
      expect(result).toBe(2);
    });
    it("B-series threshold level is warning", () => {
      let result = mgr.getThresholdLevelForSeriesValue(bSeries);
      expect(result).toBe(1);
    });
    it("A-series threshold level is warning", () => {
      aSeries.value = 181;
      let result = mgr.getThresholdLevelForSeriesValue(aSeries);
      expect(result).toBe(1);
    });
    it("A-series threshold level is ok", () => {
      aSeries.value = 20;
      let result = mgr.getThresholdLevelForSeriesValue(aSeries);
      expect(result).toBe(0);
    });
    it("A-series threshold level is unknown", () => {
      aSeries.value = null;
      let result = mgr.getThresholdLevelForSeriesValue(aSeries);
      expect(result).toBe(3);
    });
  });
  */
  // apply composite test

  /* needs a mock for this.$scope.ctrl.refresh(); */
  /*
  describe("Removing metric from composite", () => {
    it("returns 1 composite", () => {
      let aComposite = mgr.metricComposites[0];
      mgr.removeMetricFromComposite(aComposite, "A-Series");
      expect(mgr.metricComposites.length).toBe(1);
    });
  });
  */
});
