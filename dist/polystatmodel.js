System.register([], function (exports_1, context_1) {
    "use strict";
    var PolystatModel;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PolystatModel = (function () {
                function PolystatModel(operatorName, aSeries) {
                    if (aSeries === null) {
                        return;
                    }
                    this.animateMode = "all";
                    this.displayMode = "all";
                    this.operatorName = operatorName;
                    this.name = aSeries.alias;
                    var operatorValue = this.getValueByOperator(operatorName, aSeries);
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
                PolystatModel.prototype.getValueByOperator = function (operatorName, data) {
                    var value = data.stats.avg;
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
                };
                PolystatModel.prototype.shallowClone = function () {
                    var clone = new PolystatModel(this.operatorName, null);
                    clone.operatorName = this.operatorName;
                    clone.thresholdLevel = this.thresholdLevel;
                    clone.value = this.value;
                    clone.valueFormatted = this.valueFormatted;
                    clone.name = this.name;
                    clone.timestamp = this.timestamp;
                    clone.prefix = this.prefix;
                    clone.suffix = this.suffix;
                    clone.seriesRaw = null;
                    clone.color = this.color;
                    clone.clickThrough = this.clickThrough;
                    clone.sanitizedURL = this.sanitizedURL;
                    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
                    clone.isComposite = this.isComposite;
                    clone.members = [];
                    return clone;
                };
                PolystatModel.prototype.deepClone = function () {
                    var clone = new PolystatModel(this.operatorName, null);
                    clone.operatorName = this.operatorName;
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
                    clone.isComposite = this.isComposite;
                    clone.members = [];
                    return clone;
                };
                return PolystatModel;
            }());
            exports_1("PolystatModel", PolystatModel);
        }
    };
});
//# sourceMappingURL=polystatmodel.js.map