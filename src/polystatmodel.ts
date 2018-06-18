/**
 * Holds data for polystat
 *
 * This clas represents the contents of one polygon
 */
export class PolystatModel {
  value: number;
  valueFormatted: number;
  name: string;
  timestamp: number;
  prefix: string;
  suffix: string;
  seriesRaw: [any];
  color: string;
  clickThrough: string;
  members: Array<any>;

  constructor(aSeries: any) {
    this.name = aSeries.alias;
    this.value = aSeries.stats.current;
    this.valueFormatted = aSeries.stats.current;
    this.timestamp = aSeries.datapoints[aSeries.datapoints.length - 1][1];
    this.prefix = "";
    this.suffix = "";
    this.seriesRaw = aSeries;
    this.color = "green";
    this.clickThrough = "";
    this.members = [];
  }
}
