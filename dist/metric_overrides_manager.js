System.register(["lodash", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, MetricOverride, MetricOverridesManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }
        ],
        execute: function () {
            MetricOverride = (function () {
                function MetricOverride() {
                }
                return MetricOverride;
            }());
            exports_1("MetricOverride", MetricOverride);
            MetricOverridesManager = (function () {
                function MetricOverridesManager($scope, templateSrv, $sanitize, savedOverrides) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$sanitize = $sanitize;
                    this.templateSrv = templateSrv;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricOverrides = savedOverrides || new Array();
                }
                MetricOverridesManager.prototype.addMetricOverride = function () {
                    var override = new MetricOverride();
                    override.metricName = "";
                    override.thresholds = [];
                    override.colors = ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"];
                    override.decimals = "";
                    override.enabled = true;
                    override.unitFormat = "";
                    override.clickThrough = "";
                    override.operatorName = "avg";
                    override.scaledDecimals = null;
                    override.prefix = "";
                    override.suffix = "";
                    override.sanitizeURLEnabled = true;
                    this.metricOverrides.push(override);
                };
                MetricOverridesManager.prototype.removeMetricOverride = function (override) {
                    this.metricOverrides = lodash_1.default.without(this.metricOverrides, override);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.matchOverride = function (pattern) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        var regex = kbn_1.default.stringToJsRegex(anOverride.metricName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0) {
                            return index;
                        }
                    }
                    return -1;
                };
                MetricOverridesManager.prototype.applyOverrides = function (data) {
                    for (var index = 0; index < data.length; index++) {
                        var matchIndex = this.matchOverride(data[index].name);
                        if (matchIndex >= 0) {
                            var anOverride = this.metricOverrides[matchIndex];
                            var dataValue = this.getValueByStatName(anOverride, data[index]);
                            data[index].value = dataValue;
                            data[index].color = this.getColorForValue(matchIndex, data[index].value);
                            data[index].thresholdLevel = this.getThresholdLevelForValue(matchIndex, data[index].value);
                            var formatFunc = kbn_1.default.valueFormats[anOverride.unitFormat];
                            if (formatFunc) {
                                data[index].valueFormatted = formatFunc(data[index].value, anOverride.decimals, anOverride.scaledDecimals);
                                data[index].valueRounded = kbn_1.default.roundValue(data[index].value, anOverride.decimals);
                            }
                            data[index].thresholds = anOverride.thresholds;
                            data[index].prefix = anOverride.prefix;
                            data[index].suffix = anOverride.suffix;
                            if ((anOverride.clickThrough) && (anOverride.clickThrough.length > 0)) {
                                data[index].clickThrough = this.templateSrv.replaceWithText(anOverride.clickThrough);
                                if (anOverride.sanitizeURLEnabled) {
                                    data[index].sanitizedURL = this.$sanitize(data[index].clickThrough);
                                }
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.getValueByStatName = function (settings, data) {
                    var value = data.stats.avg;
                    switch (settings.operatorName) {
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
                MetricOverridesManager.prototype.getColorForValue = function (index, value) {
                    var anOverride = this.metricOverrides[index];
                    var lastColor = "rgba(50, 172, 45, 0.97)";
                    for (var i = anOverride.thresholds.length - 1; i >= 0; i--) {
                        var aThreshold = anOverride.thresholds[i];
                        if (value >= aThreshold.value) {
                            return aThreshold.color;
                        }
                        lastColor = aThreshold.color;
                    }
                    return lastColor;
                };
                MetricOverridesManager.prototype.getThresholdLevelForValue = function (index, value) {
                    var anOverride = this.metricOverrides[index];
                    var lastState = 0;
                    for (var i = anOverride.thresholds.length - 1; i >= 0; i--) {
                        var aThreshold = anOverride.thresholds[i];
                        if (value >= aThreshold.value) {
                            return aThreshold.state;
                        }
                        lastState = aThreshold.state;
                    }
                    return lastState;
                };
                MetricOverridesManager.prototype.addThreshold = function (override) {
                    override.thresholds.push({
                        value: 0,
                        state: 0,
                        color: "#299c46",
                    });
                    this.sortThresholds(override);
                };
                MetricOverridesManager.prototype.setThresholdColor = function (threshold) {
                    switch (threshold.state) {
                        case 0:
                            threshold.color = "#299c46";
                            break;
                        case 1:
                            threshold.color = "rgba(237, 129, 40, 0.89)";
                            break;
                        case 2:
                            threshold.color = "#d44a3a";
                            break;
                    }
                };
                MetricOverridesManager.prototype.validateThresholdColor = function (threshold) {
                    switch (threshold.state) {
                        case 0:
                            threshold.color = "#299c46";
                            break;
                        case 1:
                            threshold.color = "rgba(237, 129, 40, 0.89)";
                            break;
                        case 2:
                            threshold.color = "#d44a3a";
                            break;
                    }
                };
                MetricOverridesManager.prototype.sortThresholds = function (override) {
                    override.thresholds = lodash_1.default.orderBy(override.thresholds, ["value"], ["asc"]);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.removeThreshold = function (override, threshold) {
                    override.thresholds = lodash_1.default.without(override.thresholds, threshold);
                    this.sortThresholds(override);
                };
                MetricOverridesManager.prototype.invertColorOrder = function (override) {
                    override.colors.reverse();
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.setUnitFormat = function (override, subItem) {
                    override.unitFormat = subItem.value;
                };
                MetricOverridesManager.prototype.moveMetricOverrideUp = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index > 0) {
                                this.arraymove(this.metricOverrides, index, index - 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.moveMetricOverrideDown = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index < this.metricOverrides.length) {
                                this.arraymove(this.metricOverrides, index, index + 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.arraymove = function (arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                };
                return MetricOverridesManager;
            }());
            exports_1("MetricOverridesManager", MetricOverridesManager);
        }
    };
});
//# sourceMappingURL=metric_overrides_manager.js.map