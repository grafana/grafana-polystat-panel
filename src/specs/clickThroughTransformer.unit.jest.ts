/**
 * Unit Test for clickParams
 */

import {ClickThroughTransformer} from "../clickThroughTransformer";

import {PolystatModel} from "../polystatmodel";

import {TimeSeries} from "./timeseries";

jest.mock("app/core/utils/kbn");

describe("ClickThroughTransformer", () => {
  let model = new Array<PolystatModel>();
  let aSeries: TimeSeries;

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
    let modelA = new PolystatModel("avg", aSeries);
    modelA.clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
    modelA.valueFormatted = "285 MB/s";
    model.push(modelA);
    //
    let bSeries = new TimeSeries({
      datapoints: [[400, time], [385, time + 1], [300, time + 2]],
      alias: "B-series",
      seriesName: "B-series",
      operatorName: "current",
    });
    bSeries.stats = {
      avg: 385,
      current: 300
    };
    let modelB = new PolystatModel("avg", bSeries);
    modelB.clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
    modelB.valueFormatted = "385 MB/s";
    model.push(modelB);
  });
  describe("Single Metric: Reference a cell name", () => {
    it("returns cell name", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformSingleMetric(0, url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=A-series");
    });
  });
  describe("Single Metric: Reference a cell value with units", () => {
    it("returns cell value", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformSingleMetric(0, url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285%20MB%2Fs");
    });
  });
  describe("Single Metric: Reference a raw cell value", () => {
    it("returns cell raw value", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell:raw}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformSingleMetric(0, url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285");
    });
  });
  describe("Multiple Metrics: Reference a cell name with index 0", () => {
    it("returns cell name of metric 0", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_0}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=A-series");
    });
  });
  describe("Multiple Metrics: Reference a cell name with index 1", () => {
    it("returns cell name of metric 1", () => {
      model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_1}";
      let url = model[1].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=B-series");
    });
  });
  describe("Multiple Metrics: Reference a cell formatted value with index 0", () => {
    it("returns cell formatted value of metric 0", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_0}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285%20MB%2Fs");
    });
  });
  describe("Multiple Metrics: Reference a cell formatted value with index 1", () => {
    it("returns cell formatted value of metric 1", () => {
      model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_1}";
      let url = model[1].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=385%20MB%2Fs");
    });
  });
  describe("Multiple Metrics: Reference a cell raw value with index 0", () => {
    it("returns cell raw value  of metric 0", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_0:raw}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285");
    });
  });
  describe("Multiple Metrics: Reference a cell raw value with index 1", () => {
    it("returns cell raw value of metric 1", () => {
      model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_1:raw}";
      let url = model[1].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=385");
    });
  });

  /* multiple substitutions */
  describe("Multiple Metrics: Reference multiple metric names", () => {
    it("returns cell names", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_name_0}&var-CUSTOM1=${__cell_name_1}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=A-series&var-CUSTOM1=B-series");
    });
  });
  describe("Multiple Metrics: Reference multiple formatted values", () => {
    it("returns formatted values", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0}&var-CUSTOM1=${__cell_1}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=285%20MB%2Fs&var-CUSTOM1=385%20MB%2Fs");
    });
  });
  describe("Multiple Metrics: Reference multiple raw values", () => {
    it("returns formatted values", () => {
      model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=285&var-CUSTOM1=385");
    });
  });

  /* composites */
  describe("Composite: Reference the composite name", () => {
    it("returns composite name", () => {
      let compositeName = "CompositeA";
      let url = "/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}";
      let result = ClickThroughTransformer.tranformComposite(compositeName, url);
      expect(result).toBe("/dashboard/test?orgId=1&var-COMPOSITE=CompositeA");
    });
  });

  /* encoding */
  describe("Clickthrough: transformSingleMetric", () => {
    it("returns non-encoded params", () => {
      model[0].clickThrough =
        "https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=${__cell_name}&var-port=9100";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformSingleMetric(0, url, model);
      expect(result)
        .toBe("https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=A-series&var-port=9100");
    });
  });

  describe("Clickthrough: tranformNthMetric", () => {
    it("returns non-encoded params", () => {
      model[0].clickThrough =
        "https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}&var-port=9100";
      let url = model[0].clickThrough;
      let result = ClickThroughTransformer.tranformNthMetric(url, model);
      expect(result)
        .toBe("https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=285&var-CUSTOM1=385&var-port=9100");
    });
  });

  describe("Clickthrough: tranformComposite", () => {
    it("returns non-encoded params", () => {
      let compositeName = "CompositeA";
      let url = "https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}&var-port=9100";
      let result = ClickThroughTransformer.tranformComposite(compositeName, url);
      expect(result)
        .toBe("https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=CompositeA&var-port=9100");
    });
  });

});
