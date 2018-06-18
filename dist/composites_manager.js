System.register(["lodash", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, kbn_1, MetricComposite, CompositesManager;
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
            MetricComposite = (function () {
                function MetricComposite() {
                }
                return MetricComposite;
            }());
            exports_1("MetricComposite", MetricComposite);
            CompositesManager = (function () {
                function CompositesManager($scope, templateSrv, savedComposites) {
                    var _this = this;
                    this.$scope = $scope;
                    this.templateSrv = templateSrv;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricComposites = savedComposites || new Array();
                }
                CompositesManager.prototype.addMetricComposite = function () {
                    var aComposite = new MetricComposite();
                    aComposite.compositeName = "";
                    aComposite.members = [{}];
                    aComposite.enabled = true;
                    aComposite.clickThrough = "";
                    aComposite.hideMembers = true;
                    aComposite.showName = true;
                    aComposite.showValue = true;
                    aComposite.animateMode = 0;
                    this.metricComposites.push(aComposite);
                };
                CompositesManager.prototype.removeMetricComposite = function (item) {
                    this.metricComposites = lodash_1.default.without(this.metricComposites, item);
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.addMetricToComposite = function (composite) {
                    if (composite.members === undefined) {
                        composite.members = [{}];
                    }
                    else {
                        composite.members.push({});
                    }
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.removeMetricFromComposite = function (composite, metric) {
                    composite.members = lodash_1.default.without(composite.members, metric);
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.matchComposite = function (pattern) {
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        var aComposite = this.metricComposites[index];
                        var regex = kbn_1.default.stringToJsRegex(aComposite.compositeName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0) {
                            return index;
                        }
                    }
                    return -1;
                };
                CompositesManager.prototype.applyComposites = function (data) {
                    var filteredMetrics = new Array();
                    for (var i = 0; i < this.metricComposites.length; i++) {
                        var matchedMetrics = new Array();
                        var aComposite = this.metricComposites[i];
                        var currentWorstSeries = null;
                        for (var j = 0; j < aComposite.members.length; j++) {
                            var aMetric = aComposite.members[j];
                            var seriesItem = null;
                            for (var index = 0; index < data.length; index++) {
                                if (data[index].name === aMetric.seriesName) {
                                    seriesItem = data[index];
                                    matchedMetrics.push(index);
                                    if (aComposite.hideMembers) {
                                        filteredMetrics.push(index);
                                    }
                                    if (aComposite.clickThrough.length > 0) {
                                        seriesItem.clickThrough = aComposite.clickThrough;
                                    }
                                    seriesItem.showValue = aComposite.showValue;
                                    seriesItem.showName = aComposite.showName;
                                    break;
                                }
                            }
                            if (!seriesItem) {
                                continue;
                            }
                            if (currentWorstSeries === null) {
                                currentWorstSeries = seriesItem;
                            }
                            else {
                                currentWorstSeries = this.getWorstSeries(currentWorstSeries, seriesItem);
                            }
                        }
                        if (currentWorstSeries !== null) {
                            var clone = Object.assign({}, currentWorstSeries);
                            clone.valueFormattedWithPrefix = clone.name + ": " + clone.valueFormatted;
                            clone.valueRawFormattedWithPrefix = clone.name + ": " + clone.value;
                            clone.name = aComposite.compositeName;
                            for (var index = 0; index < matchedMetrics.length; index++) {
                                var itemIndex = matchedMetrics[index];
                                clone.members.push(data[itemIndex]);
                            }
                            data.push(clone);
                        }
                    }
                    filteredMetrics.sort(function (a, b) { return b - a; });
                    for (var i_1 = 0; i_1 < filteredMetrics.length; i_1++) {
                        data.splice(filteredMetrics[i_1], 1);
                    }
                    return data;
                };
                CompositesManager.prototype.getWorstSeries = function (series1, series2) {
                    var worstSeries = series1;
                    var series1thresholdLevel = this.getThresholdLevel(series1);
                    var series2thresholdLevel = this.getThresholdLevel(series2);
                    if (series2thresholdLevel > series1thresholdLevel) {
                        worstSeries = series2;
                    }
                    return worstSeries;
                };
                CompositesManager.prototype.getThresholdLevel = function (series) {
                    var thresholdLevel = 0;
                    var value = series.value;
                    var thresholds = series.thresholds;
                    if (thresholds === undefined) {
                        return thresholdLevel;
                    }
                    if (thresholds.length !== 2) {
                        return thresholdLevel;
                    }
                    if (value >= thresholds[0]) {
                        thresholdLevel = 1;
                    }
                    if (value >= thresholds[1]) {
                        thresholdLevel = 2;
                    }
                    return thresholdLevel;
                };
                CompositesManager.prototype.moveMetricCompositeUp = function (item) {
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        var aComposite = this.metricComposites[index];
                        if (item === aComposite) {
                            if (index > 0) {
                                this.arraymove(this.metricComposites, index, index - 1);
                                break;
                            }
                        }
                    }
                };
                CompositesManager.prototype.moveMetricCompositeDown = function (item) {
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        var anOverride = this.metricComposites[index];
                        if (item === anOverride) {
                            if (index < this.metricComposites.length) {
                                this.arraymove(this.metricComposites, index, index + 1);
                                break;
                            }
                        }
                    }
                };
                CompositesManager.prototype.arraymove = function (arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                };
                return CompositesManager;
            }());
            exports_1("CompositesManager", CompositesManager);
        }
    };
});
//# sourceMappingURL=composites_manager.js.map