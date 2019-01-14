// Helper class

export class TimeSeries {
  datapoints: number[][];
  alias: string;
  target: string;
  stats: any;
  thresholds: any[];
  value: number;
  seriesName: string;
  name: string;
  operatorName: string;
  constructor(opts: {datapoints: number[][], alias: string, seriesName: string, operatorName: string}) {
    this.datapoints = opts.datapoints;
    this.alias = opts.alias;
    this.target = opts.alias;
    this.seriesName = opts.seriesName;
    this.name = this.alias;
    this.operatorName = opts.operatorName;
  }
}
