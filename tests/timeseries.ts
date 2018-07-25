export class TimeSeries {
  datapoints: number[][];
  alias: string;
  target: string;
  stats: any;
  constructor(opts: {datapoints: number[][], alias: string}) {
    this.datapoints = opts.datapoints;
    this.alias = opts.alias;
    this.target = opts.alias;
  }
}
