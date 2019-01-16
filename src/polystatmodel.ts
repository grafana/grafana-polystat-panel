/**
 * Holds data for polystat
 *
 * This clas represents the contents of one polygon
 */

export class PolystatModel {
  animateMode: string;
  displayMode: string;
  thresholdLevel: number; // 0 = ok, 1 = warn, 2 = crit, 3 = unknown (same as sensu)
  value: number;
  valueFormatted: string;
  stats: any;
  name: string;
  timestamp: number;
  prefix: string;
  suffix: string;
  seriesRaw: [any];
  color: string;
  clickThrough: string;
  operatorName: string;
  sanitizedURL: string;
  sanitizeURLEnabled: boolean;
  showName: boolean;
  showValue: boolean;
  isComposite: boolean;
  members: Array<PolystatModel>;

  constructor(operatorName: string, aSeries: any) {
    if (aSeries === null) {
      return;
    }
    this.animateMode = "all";
    this.displayMode = "all";
    this.operatorName = operatorName;
    this.name = aSeries.alias;
    let operatorValue = this.getValueByOperator(operatorName, aSeries);
    this.value = operatorValue;
    this.valueFormatted = operatorValue;
    this.stats = aSeries.stats;
    this.timestamp = aSeries.datapoints[aSeries.datapoints.length - 1][1];
    this.prefix = "";
    this.suffix = "";
    this.seriesRaw = null;
    this.color = "green";
    this.clickThrough = "";
    this.sanitizedURL = "";
    this.sanitizeURLEnabled = true;
    this.isComposite = false;
    this.members = [];
    this.thresholdLevel = 0;
    this.showName = true;
    this.showValue = true;
  }

  getValueByOperator(operatorName, data) {
    let value = data.stats.avg;
    switch (operatorName) {
        case "avg":
            value = data.stats.avg;
            break;
        case "count":
            value = data.stats.count;
            break;
        case "current":
            value = data.stats.current;
            break;
        case "delta":
            value = data.stats.delta;
            break;
        case "diff":
            value = data.stats.diff;
            break;
        case "first":
            value = data.stats.first;
            break;
        case "logmin":
            value = data.stats.logmin;
            break;
        case "max":
            value = data.stats.max;
            break;
        case "min":
            value = data.stats.min;
            break;
        case "name":
            value = data.metricName;
            break;
        case "time_step":
            value = data.stats.timeStep;
            break;
        case "last_time":
            value = data.timestamp;
            break;
        case "total":
            value = data.stats.total;
            break;
        default:
            value = data.stats.avg;
            break;
    }
    return value;
  }

  /**
   * Copies values, leaves members empty
   */
  shallowClone(): PolystatModel {
    let clone = new PolystatModel(this.operatorName, null);
    clone.operatorName = this.operatorName;
    clone.thresholdLevel = this.thresholdLevel;
    clone.value = this.value;
    clone.valueFormatted = this.valueFormatted;
    clone.name = this.name;
    clone.timestamp = this.timestamp;
    clone.prefix = this.prefix;
    clone.suffix = this.suffix;
    clone.seriesRaw = null; // for a shallow clone drop the series
    clone.color = this.color;
    clone.clickThrough = this.clickThrough;
    clone.sanitizedURL = this.sanitizedURL;
    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
    clone.isComposite = this.isComposite;
    clone.members = []; // this.members;
    return clone;
  }
  deepClone(): PolystatModel {
    let clone = new PolystatModel(this.operatorName, null);
    clone.operatorName = this.operatorName;
    clone.thresholdLevel = this.thresholdLevel;
    clone.value = this.value;
    clone.valueFormatted = this.valueFormatted;
    clone.name = this.name;
    clone.timestamp = this.timestamp;
    clone.prefix = this.prefix;
    clone.suffix = this.suffix;
    clone.seriesRaw = this.seriesRaw; // deep clone retains the series (careful of leak!)
    clone.color = this.color;
    clone.clickThrough = this.clickThrough;
    clone.sanitizedURL = this.sanitizedURL;
    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
    clone.isComposite = this.isComposite;
    clone.members = []; // this.members;
    return clone;
  }
}
