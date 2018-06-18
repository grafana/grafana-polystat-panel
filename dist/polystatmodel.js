System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PolystatModel;
    return {
        setters: [],
        execute: function () {
            PolystatModel = (function () {
                function PolystatModel(aSeries) {
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
                return PolystatModel;
            }());
            exports_1("PolystatModel", PolystatModel);
        }
    };
});
//# sourceMappingURL=polystatmodel.js.map