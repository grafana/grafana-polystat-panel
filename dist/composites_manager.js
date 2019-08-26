System.register(["lodash", "app/core/utils/kbn", "./threshold_processor", "./clickThroughTransformer"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, clickThroughTransformer_1, MetricComposite, CompositesManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (threshold_processor_1_1) {
                threshold_processor_1 = threshold_processor_1_1;
            },
            function (clickThroughTransformer_1_1) {
                clickThroughTransformer_1 = clickThroughTransformer_1_1;
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
                function CompositesManager($scope, templateSrv, $sanitize, savedComposites) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$sanitize = $sanitize;
                    this.templateSrv = templateSrv;
                    this.subTabIndex = 0;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricComposites = savedComposites;
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        if (typeof this.metricComposites[index].label === "undefined") {
                            this.metricComposites[index].label = "COMPOSITE " + (index + 1);
                        }
                    }
                }
                CompositesManager.prototype.addMetricComposite = function () {
                    var aComposite = new MetricComposite();
                    aComposite.label = "COMPOSITE " + (this.metricComposites.length + 1);
                    aComposite.compositeName = "";
                    aComposite.members = [{}];
                    aComposite.enabled = true;
                    aComposite.clickThrough = "";
                    aComposite.hideMembers = true;
                    aComposite.showName = true;
                    aComposite.showValue = true;
                    aComposite.animateMode = "all";
                    aComposite.thresholdLevel = 0;
                    aComposite.newTabEnabled = true;
                    aComposite.sanitizeURLEnabled = true;
                    aComposite.sanitizedURL = "";
                    this.metricComposites.push(aComposite);
                };
                CompositesManager.prototype.removeMetricComposite = function (item) {
                    this.metricComposites = lodash_1.default.without(this.metricComposites, item);
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        this.metricComposites[index].label = "COMPOSITE " + (index + 1);
                    }
                    this.$scope.ctrl.panel.savedComposites = this.metricComposites;
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
                        if (matches && matches.length > 0 && aComposite.enabled) {
                            return index;
                        }
                    }
                    return -1;
                };
                CompositesManager.prototype.applyComposites = function (data) {
                    var filteredMetrics = new Array();
                    var clonedComposites = new Array();
                    for (var i = 0; i < this.metricComposites.length; i++) {
                        var matchedMetrics = new Array();
                        var aComposite = this.metricComposites[i];
                        if (!aComposite.enabled) {
                            continue;
                        }
                        var currentWorstSeries = null;
                        for (var j = 0; j < aComposite.members.length; j++) {
                            var aMetric = aComposite.members[j];
                            for (var index = 0; index < data.length; index++) {
                                if (typeof aMetric.seriesName === "undefined") {
                                    continue;
                                }
                                var regex = kbn_1.default.stringToJsRegex(aMetric.seriesName);
                                var matches = data[index].name.match(regex);
                                if (matches && matches.length > 0) {
                                    var seriesItem = data[index];
                                    matchedMetrics.push(index);
                                    if (aComposite.hideMembers) {
                                        filteredMetrics.push(index);
                                    }
                                    if (aComposite.clickThrough.length > 0) {
                                        var url = this.templateSrv.replaceWithText(aComposite.clickThrough);
                                        url = clickThroughTransformer_1.ClickThroughTransformer.tranformComposite(aComposite.compositeName, url);
                                        url = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(index, url, data);
                                        url = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, data);
                                        seriesItem.clickThrough = url;
                                        seriesItem.sanitizedURL = this.$sanitize(url);
                                    }
                                }
                            }
                        }
                        if (matchedMetrics.length === 0) {
                            continue;
                        }
                        for (var k = 0; k < matchedMetrics.length; k++) {
                            var itemIndex = matchedMetrics[k];
                            var seriesItem = data[itemIndex];
                            if (currentWorstSeries === null) {
                                currentWorstSeries = seriesItem;
                            }
                            else {
                                currentWorstSeries = threshold_processor_1.getWorstSeries(currentWorstSeries, seriesItem, this.$scope.ctrl.panel.polystat.polygonGlobalFillColor);
                            }
                        }
                        if (currentWorstSeries !== null) {
                            var clone = currentWorstSeries.shallowClone();
                            clone.name = aComposite.compositeName;
                            for (var index = 0; index < matchedMetrics.length; index++) {
                                var itemIndex = matchedMetrics[index];
                                clone.members.push(data[itemIndex]);
                            }
                            clone.thresholdLevel = currentWorstSeries.thresholdLevel;
                            clone.showName = aComposite.showName;
                            clone.showValue = aComposite.showValue;
                            clone.animateMode = aComposite.animateMode;
                            clone.newTabEnabled = aComposite.newTabEnabled;
                            clone.sanitizeURLEnabled = aComposite.sanitizeURLEnabled;
                            clone.isComposite = true;
                            clonedComposites.push(clone);
                        }
                    }
                    Array.prototype.push.apply(data, clonedComposites);
                    filteredMetrics.sort(function (a, b) { return b - a; });
                    for (var i = data.length; i >= 0; i--) {
                        if (lodash_1.default.includes(filteredMetrics, i)) {
                            data.splice(i, 1);
                        }
                    }
                    return data;
                };
                CompositesManager.prototype.metricNameChanged = function (metric) {
                    console.log("metric name changed: '" + metric.seriesName + "'");
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.toggleHide = function (composite) {
                    console.log("composite enabled =  " + composite.enabled);
                    composite.enabled = !composite.enabled;
                    this.$scope.ctrl.refresh();
                };
                return CompositesManager;
            }());
            exports_1("CompositesManager", CompositesManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQUFBO2dCQWNBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBZEQsSUFjQzs7WUFFRDtnQkFRSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFrQkM7b0JBakJDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29CQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUVyQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3hCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDcEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN0QixDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztvQkFFeEMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQ2pFLElBQUksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDN0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJB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LENBQUMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0wsd0JBQUM7WUFBRCxDQUFDLEFBL0xELElBK0xDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5pbXBvcnQgeyBQb2x5c3RhdE1vZGVsIH0gZnJvbSBcIi4vcG9seXN0YXRtb2RlbFwiO1xuaW1wb3J0IHsgZ2V0V29yc3RTZXJpZXMgfSBmcm9tIFwiLi90aHJlc2hvbGRfcHJvY2Vzc29yXCI7XG5pbXBvcnQge0NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyfSBmcm9tIFwiLi9jbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljQ29tcG9zaXRlIHtcbiAgICBjb21wb3NpdGVOYW1lOiBzdHJpbmc7XG4gICAgbWVtYmVyczogQXJyYXk8YW55PjtcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIGhpZGVNZW1iZXJzOiBib29sZWFuO1xuICAgIHNob3dOYW1lOiBib29sZWFuO1xuICAgIHNob3dWYWx1ZTogYm9vbGVhbjtcbiAgICBhbmltYXRlTW9kZTogc3RyaW5nO1xuICAgIHRocmVzaG9sZExldmVsOiBudW1iZXI7XG4gICAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gICAgbmV3VGFiRW5hYmxlZDogYm9vbGVhbjtcbiAgICBzYW5pdGl6ZVVSTEVuYWJsZWQ6IGJvb2xlYW47XG4gICAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvc2l0ZXNNYW5hZ2VyIHtcbiAgICAkc2NvcGU6IGFueTtcbiAgICB0ZW1wbGF0ZVNydjogYW55O1xuICAgICRzYW5pdGl6ZTogYW55O1xuICAgIHN1Z2dlc3RNZXRyaWNOYW1lczogYW55O1xuICAgIG1ldHJpY0NvbXBvc2l0ZXM6IEFycmF5PE1ldHJpY0NvbXBvc2l0ZT47XG4gICAgc3ViVGFiSW5kZXg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgc2F2ZWRDb21wb3NpdGVzKSB7XG4gICAgICB0aGlzLiRzY29wZSA9ICRzY29wZTtcbiAgICAgIHRoaXMuJHNhbml0aXplID0gJHNhbml0aXplO1xuICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgdGhpcy5zdWJUYWJJbmRleCA9IDA7XG4gICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICB0aGlzLnN1Z2dlc3RNZXRyaWNOYW1lcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzID0gc2F2ZWRDb21wb3NpdGVzO1xuICAgICAgLy8gdXBncmFkZSBpZiBubyBsYWJlbCBwcmVzZW50XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF0ubGFiZWwgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdLmxhYmVsID0gXCJDT01QT1NJVEUgXCIgKyAoaW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE1ldHJpY0NvbXBvc2l0ZSgpIHtcbiAgICAgIGxldCBhQ29tcG9zaXRlID0gbmV3IE1ldHJpY0NvbXBvc2l0ZSgpO1xuICAgICAgYUNvbXBvc2l0ZS5sYWJlbCA9IFwiQ09NUE9TSVRFIFwiICsgKHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGggKyAxKTtcbiAgICAgIGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZSA9IFwiXCI7XG4gICAgICBhQ29tcG9zaXRlLm1lbWJlcnMgPSBbe31dO1xuICAgICAgYUNvbXBvc2l0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgIGFDb21wb3NpdGUuaGlkZU1lbWJlcnMgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5zaG93TmFtZSA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLnNob3dWYWx1ZSA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLmFuaW1hdGVNb2RlID0gXCJhbGxcIjtcbiAgICAgIGFDb21wb3NpdGUudGhyZXNob2xkTGV2ZWwgPSAwO1xuICAgICAgYUNvbXBvc2l0ZS5uZXdUYWJFbmFibGVkID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuc2FuaXRpemVVUkxFbmFibGVkID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuc2FuaXRpemVkVVJMID0gXCJcIjtcbiAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcy5wdXNoKGFDb21wb3NpdGUpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY0NvbXBvc2l0ZShpdGVtKSB7XG4gICAgICAvLyBsb2Rhc2ggXy53aXRob3V0IGNyZWF0ZXMgYSBuZXcgYXJyYXksIG5lZWQgdG8gcmVhc3NpZ24gdG8gdGhlIHBhbmVsIHdoZXJlIGl0IHdpbGwgYmUgc2F2ZWRcbiAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMsIGl0ZW0pO1xuICAgICAgLy8gZml4IHRoZSBsYWJlbHNcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF0ubGFiZWwgPSBcIkNPTVBPU0lURSBcIiArIChpbmRleCArIDEpO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gcmVmZXJlbmNlIGluIHBhbmVsXG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnNhdmVkQ29tcG9zaXRlcyA9IHRoaXMubWV0cmljQ29tcG9zaXRlcztcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGFkZE1ldHJpY1RvQ29tcG9zaXRlKGNvbXBvc2l0ZSkge1xuICAgICAgaWYgKGNvbXBvc2l0ZS5tZW1iZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMgPSBbe31dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMucHVzaCh7fSk7XG4gICAgICB9XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNGcm9tQ29tcG9zaXRlKGNvbXBvc2l0ZSwgbWV0cmljKSB7XG4gICAgICBjb21wb3NpdGUubWVtYmVycyA9IF8ud2l0aG91dChjb21wb3NpdGUubWVtYmVycywgbWV0cmljKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIG1hdGNoQ29tcG9zaXRlKHBhdHRlcm4pIDogbnVtYmVyIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XTtcbiAgICAgICAgdmFyIHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWUpO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4ubWF0Y2gocmVnZXgpO1xuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDAgJiYgYUNvbXBvc2l0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgYXBwbHlDb21wb3NpdGVzKGRhdGEpIHtcbiAgICAgIGxldCBmaWx0ZXJlZE1ldHJpY3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgICAgbGV0IGNsb25lZENvbXBvc2l0ZXMgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBtYXRjaGVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2ldO1xuICAgICAgICBpZiAoIWFDb21wb3NpdGUuZW5hYmxlZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50V29yc3RTZXJpZXMgPSBudWxsO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFDb21wb3NpdGUubWVtYmVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBhTWV0cmljID0gYUNvbXBvc2l0ZS5tZW1iZXJzW2pdO1xuICAgICAgICAgIC8vIGxvb2sgZm9yIHRoZSBtYXRjaGVzIHRvIHRoZSBwYXR0ZXJuIGluIHRoZSBkYXRhXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBtYXRjaCByZWdleFxuICAgICAgICAgICAgLy8gc2VyaWVzbmFtZSBtYXkgbm90IGJlIGRlZmluZWQgeWV0LCBza2lwXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFNZXRyaWMuc2VyaWVzTmFtZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYU1ldHJpYy5zZXJpZXNOYW1lKTtcbiAgICAgICAgICAgIGxldCBtYXRjaGVzID0gZGF0YVtpbmRleF0ubmFtZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbGV0IHNlcmllc0l0ZW0gPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgLy8ga2VlcCBpbmRleCBvZiB0aGUgbWF0Y2hlZCBtZXRyaWNcbiAgICAgICAgICAgICAgbWF0Y2hlZE1ldHJpY3MucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgIC8vIG9ubHkgaGlkZSBpZiByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuaGlkZU1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZE1ldHJpY3MucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9jZXNzIHRlbXBsYXRlIHZhcmlhYmxlc1xuICAgICAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dChhQ29tcG9zaXRlLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgICAgLy8gYXBwbHkgYm90aCB0eXBlcyBvZiB0cmFuc2Zvcm1zLCBvbmUgdGFyZ2V0ZWQgYXQgdGhlIGRhdGEgaXRlbSBpbmRleCwgYW5kIHNlY29uZGx5IHRoZSBudGggdmFyaWFudFxuICAgICAgICAgICAgICAgIHVybCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtQ29tcG9zaXRlKGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZSwgdXJsKTtcbiAgICAgICAgICAgICAgICB1cmwgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYyhpbmRleCwgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB1cmwgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIGRhdGEpO1xuICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uY2xpY2tUaHJvdWdoID0gdXJsO1xuICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUodXJsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hlZE1ldHJpY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IGRldGVybWluZSB0aGUgbW9zdCB0cmlnZ2VyZWQgdGhyZXNob2xkXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbWF0Y2hlZE1ldHJpY3MubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBsZXQgaXRlbUluZGV4ID0gbWF0Y2hlZE1ldHJpY3Nba107XG4gICAgICAgICAgbGV0IHNlcmllc0l0ZW0gPSBkYXRhW2l0ZW1JbmRleF07XG4gICAgICAgICAgLy8gY2hlY2sgdGhyZXNob2xkc1xuICAgICAgICAgIGlmIChjdXJyZW50V29yc3RTZXJpZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRXb3JzdFNlcmllcyA9IHNlcmllc0l0ZW07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRXb3JzdFNlcmllcyA9IGdldFdvcnN0U2VyaWVzKFxuICAgICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMsXG4gICAgICAgICAgICAgIHNlcmllc0l0ZW0sXG4gICAgICAgICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucGFuZWwucG9seXN0YXQucG9seWdvbkdsb2JhbEZpbGxDb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFByZWZpeCB0aGUgdmFsdWVGb3JtYXR0ZWQgd2l0aCB0aGUgYWN0dWFsIG1ldHJpYyBuYW1lXG4gICAgICAgIGlmIChjdXJyZW50V29yc3RTZXJpZXMgIT09IG51bGwpIHtcbiAgICAgICAgICBsZXQgY2xvbmUgPSBjdXJyZW50V29yc3RTZXJpZXMuc2hhbGxvd0Nsb25lKCk7XG4gICAgICAgICAgY2xvbmUubmFtZSA9IGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZTtcbiAgICAgICAgICAvLyB0b29sdGlwL2xlZ2VuZCB1c2VzIHRoaXMgdG8gZXhwYW5kIHdoYXQgdmFsdWVzIGFyZSBpbnNpZGUgdGhlIGNvbXBvc2l0ZVxuICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBtYXRjaGVkTWV0cmljcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBpdGVtSW5kZXggPSBtYXRjaGVkTWV0cmljc1tpbmRleF07XG4gICAgICAgICAgICBjbG9uZS5tZW1iZXJzLnB1c2goZGF0YVtpdGVtSW5kZXhdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2xvbmUudGhyZXNob2xkTGV2ZWwgPSBjdXJyZW50V29yc3RTZXJpZXMudGhyZXNob2xkTGV2ZWw7XG4gICAgICAgICAgLy8gY3VycmVudFdvcnN0U2VyaWVzLnZhbHVlRm9ybWF0dGVkID0gY3VycmVudFdvcnN0U2VyaWVzTmFtZSArICc6ICcgKyBjdXJyZW50V29yc3RTZXJpZXMudmFsdWVGb3JtYXR0ZWQ7XG4gICAgICAgICAgLy8gbm93IHB1c2ggdGhlIGNvbXBvc2l0ZSBpbnRvIGRhdGFcbiAgICAgICAgICAvLyBhZGQgdGhlIGNvbXBvc2l0ZSBzZXRpbmcgZm9yIHNob3dpbmcgdGhlIG5hbWUvdmFsdWUgdG8gdGhlIG5ldyBjbG9uZWQgbW9kZWxcbiAgICAgICAgICBjbG9uZS5zaG93TmFtZSA9IGFDb21wb3NpdGUuc2hvd05hbWU7XG4gICAgICAgICAgY2xvbmUuc2hvd1ZhbHVlID0gYUNvbXBvc2l0ZS5zaG93VmFsdWU7XG4gICAgICAgICAgY2xvbmUuYW5pbWF0ZU1vZGUgPSBhQ29tcG9zaXRlLmFuaW1hdGVNb2RlO1xuICAgICAgICAgIGNsb25lLm5ld1RhYkVuYWJsZWQgPSBhQ29tcG9zaXRlLm5ld1RhYkVuYWJsZWQ7XG4gICAgICAgICAgY2xvbmUuc2FuaXRpemVVUkxFbmFibGVkID0gYUNvbXBvc2l0ZS5zYW5pdGl6ZVVSTEVuYWJsZWQ7XG4gICAgICAgICAgLy8gbWFyayB0aGlzIHNlcmllcyBhcyBhIGNvbXBzaXRlXG4gICAgICAgICAgY2xvbmUuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgICAgIGNsb25lZENvbXBvc2l0ZXMucHVzaChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIG5vdyBtZXJnZSB0aGUgY2xvbmVkQ29tcG9zaXRlcyBpbnRvIGRhdGFcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGRhdGEsIGNsb25lZENvbXBvc2l0ZXMpO1xuICAgICAgLy8gc29ydCBieSB2YWx1ZSBkZXNjZW5kaW5nXG4gICAgICBmaWx0ZXJlZE1ldHJpY3Muc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYiAtIGE7IH0pO1xuICAgICAgLy8gbm93IHJlbW92ZSB0aGUgZmlsdGVyZWQgbWV0cmljcyBmcm9tIGZpbmFsIGxpc3RcbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBtZXRyaWNOYW1lQ2hhbmdlZChtZXRyaWMpIHtcbiAgICAgIC8vIFRPRE86IHZhbGlkYXRlIGl0ZW0gaXMgYSB2YWxpZCByZWdleFxuICAgICAgY29uc29sZS5sb2coXCJtZXRyaWMgbmFtZSBjaGFuZ2VkOiAnXCIgKyBtZXRyaWMuc2VyaWVzTmFtZSArIFwiJ1wiKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZUhpZGUoY29tcG9zaXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImNvbXBvc2l0ZSBlbmFibGVkID0gIFwiICsgY29tcG9zaXRlLmVuYWJsZWQpO1xuICAgICAgY29tcG9zaXRlLmVuYWJsZWQgPSAhY29tcG9zaXRlLmVuYWJsZWQ7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG59XG4iXX0=