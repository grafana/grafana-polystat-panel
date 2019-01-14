/**
 * Tests for utils
 */
import {MetricOverridesManager} from "../metric_overrides_manager";
import {PolystatModel} from "../polystatmodel";

import {TimeSeries} from "./timeseries";
jest.mock("app/core/utils/kbn");

describe("MetricOverridesManager", () => {
  let model: PolystatModel;
  let aSeries: TimeSeries;
  let mgr: MetricOverridesManager;

  beforeEach(() => {
    mgr = new MetricOverridesManager(null, null, null, []);
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

    model = new PolystatModel("avg", aSeries);
  });
  describe("Adding new override", () => {
    it("returns an override", () => {
      mgr.addMetricOverride();
      console.log(model);
      expect(mgr.metricOverrides.length).toBe(1);
    });
  });
});
