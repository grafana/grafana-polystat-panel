import { CompositesManager, MetricComposite } from './composites_manager';
import { getWorstSeries } from './threshold_processor';
import { PolystatModel } from './polystatmodel';
import { TimeSeries } from './specs/timeseries';

jest.mock('grafana/app/core/utils/kbn');

describe('CompositesManager', () => {
  let aModel: PolystatModel;
  let bModel: PolystatModel;
  let aSeries: TimeSeries;
  let bSeries: TimeSeries;
  let mgr: CompositesManager;

  beforeEach(() => {
    const time = new Date().getTime();
    aSeries = new TimeSeries({
      datapoints: [
        [200, time],
        [101, time + 1],
        [555, time + 2],
      ],
      alias: 'A-series',
      seriesName: 'A-series',
      operatorName: 'current',
    });
    aSeries.stats = {
      avg: 285,
      current: 200,
    };
    aSeries.value = 200;
    aSeries.thresholds = [];
    aSeries.thresholds.push({
      value: 180,
      state: 1,
      color: 'yellow',
    });
    aSeries.thresholds.push({
      value: 200,
      state: 2,
      color: 'red',
    });
    bSeries = new TimeSeries({
      datapoints: [
        [100, time],
        [1, time + 1],
        [42, time + 2],
      ],
      alias: 'B-series',
      seriesName: 'B-series',
      operatorName: 'current',
    });
    bSeries.stats = {
      avg: 68,
      current: 100,
    };
    bSeries.value = 100;
    bSeries.thresholds = [];
    bSeries.thresholds.push({
      value: 50,
      state: 1,
      color: 'yellow',
    });
    bSeries.thresholds.push({
      value: 120,
      state: 2,
      color: 'red',
    });
    aModel = new PolystatModel('current', aSeries);
    bModel = new PolystatModel('current', bSeries);

    const aComposite = new MetricComposite();
    aComposite.compositeName = 'composite1';
    aComposite.clickThrough = '';
    aComposite.enabled = true;
    aComposite.members = [{ seriesName: 'A-series' }];
    mgr = new CompositesManager(null, null, null, [aComposite]);
  });

  describe('Adding new composite', () => {
    it('returns 2 composites', () => {
      mgr.addMetricComposite();
      expect(mgr.metricComposites.length).toBe(2);
    });
  });


  describe('Worst Series', () => {
    it('returns A-series', () => {
      aModel.thresholdLevel = 1;
      bModel.thresholdLevel = 1;
      const result = getWorstSeries(aModel, bModel);
      expect(result.name).toBe('A-series');
    });
    it('returns B-series when bModel.thresholdLevel is 2', () => {
      aModel.thresholdLevel = 1;
      bModel.thresholdLevel = 2;
      const result = getWorstSeries(aModel, bModel);
      expect(result.name).toBe('B-series');
    });
    it('returns B-series when aModel.thresholdLevel is 3', () => {
      aModel.thresholdLevel = 3;
      bModel.thresholdLevel = 1;
      const result = getWorstSeries(aModel, bModel);
      expect(result.name).toBe('B-series');
    });
    it('returns A-series when aModel.thresholdLevel and bModel.thresholdLevel are 3', () => {
      aModel.thresholdLevel = 3;
      bModel.thresholdLevel = 3;
      const result = getWorstSeries(aModel, bModel);
      expect(result.name).toBe('A-series');
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

  describe('Composite Colors', () => {
    it('returns A-series', () => {
      const data = mgr.applyComposites([aModel, bModel]);
      expect(data.length).toBe(3);
      expect(data[2].color === 'green');
      aModel.value = 181;
      aModel.valueFormatted = '181';
      const datax = mgr.applyComposites([aModel, bModel]);
      expect(datax[2].color).toBe('green');
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
