System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PolystatModel;
    return {
        setters: [],
        execute: function () {
            PolystatModel = (function () {
                function PolystatModel(aSeries) {
                    if (aSeries === null) {
                        return;
                    }
                    this.name = aSeries.alias;
                    this.value = aSeries.stats.current;
                    this.valueFormatted = aSeries.stats.current;
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
                PolystatModel.prototype.shallowClone = function () {
                    var clone = new PolystatModel(null);
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