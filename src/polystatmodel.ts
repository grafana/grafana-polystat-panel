/**
 * Holds data for polystat
 *
 * This clas represents the contents of one polygon
 */

export class PolystatModel {
  thresholdLevel: number; // 0 = ok, 1 = warn, 2 = crit, 3 = unknown (same as sensu)
  value: number;
  valueFormatted: number;
  stats: any;
  name: string;
  timestamp: number;
  prefix: string;
  suffix: string;
  seriesRaw: [any];
  color: string;
  clickThrough: string;
  sanitizedURL: string;
  sanitizeURLEnabled: boolean;
  showName: boolean;
  showValue: boolean;
  members: Array<PolystatModel>;

  constructor(aSeries: any) {
    if (aSeries === null) {
      return;
    }
    this.name = aSeries.alias;
    this.value = aSeries.stats.current;
    this.valueFormatted = aSeries.stats.current;
    this.stats = aSeries.stats;
    this.timestamp = aSeries.datapoints[aSeries.datapoints.length - 1][1];
    this.prefix = "";
    this.suffix = "";
    this.seriesRaw = aSeries;
    this.color = "green";
    this.clickThrough = "";
    this.sanitizedURL = "";
    this.sanitizeURLEnabled = true;
    this.members = [];
    this.thresholdLevel = 0;
    this.showName = true;
    this.showValue = true;
  }

  /**
   * Copies values, leaves members empty
   */
  shallowClone(): PolystatModel {
    let clone = new PolystatModel(null);
    clone.thresholdLevel = this.thresholdLevel;
    clone.value = this.value;
    clone.valueFormatted = this.valueFormatted;
    clone.name = this.name;
    clone.timestamp = this.timestamp;
    clone.prefix = this.prefix;
    clone.suffix = this.suffix;
    clone.seriesRaw = this.seriesRaw;
    clone.color = this.color;
    clone.clickThrough = this.clickThrough;
    clone.sanitizedURL = this.sanitizedURL;
    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
    clone.members = []; // this.members;
    return clone;
  }
}
