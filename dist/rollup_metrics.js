System.register([], function (exports_1, context_1) {
    "use strict";
    var Rollup, RollupMetrics;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Rollup = (function () {
                function Rollup(metricName, thresholds, valueMaps) {
                    this.name = metricName;
                    this.thresholds = thresholds;
                    this.valueMaps = valueMaps;
                }
                return Rollup;
            }());
            exports_1("Rollup", Rollup);
            RollupMetrics = (function () {
                function RollupMetrics() {
                    this.rollups = new Map();
                }
                RollupMetrics.prototype.AddRollup = function (rollupName, metricName, thresholds, valueMaps) {
                    var metrics = [];
                    if (this.rollups.has(rollupName)) {
                        metrics = this.rollups.get(rollupName);
                    }
                    metrics.push(new Rollup(metricName, thresholds, valueMaps));
                    this.rollups.set(rollupName, metrics);
                };
                RollupMetrics.prototype.DeleteRollup = function (rollupName) {
                    if (this.rollups.has(rollupName)) {
                        this.rollups.delete(rollupName);
                    }
                };
                RollupMetrics.prototype.UpdateRollup = function (rollupName, metricName, thresholds, valueMaps) {
                    if (this.rollups.has(rollupName)) {
                        console.log(metricName + thresholds + valueMaps);
                    }
                };
                RollupMetrics.prototype.EvaluateRollup = function (rollupName) {
                    var status = 0;
                    if (this.rollups.has(rollupName)) {
                        status = 1;
                    }
                    return status;
                };
                return RollupMetrics;
            }());
            exports_1("RollupMetrics", RollupMetrics);
        }
    };
});
//# sourceMappingURL=rollup_metrics.js.map