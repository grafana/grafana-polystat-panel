System.register(["lodash", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, MetricComposite, CompositesManager;
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
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricComposites = savedComposites;
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
                    aComposite.animateMode = "all";
                    aComposite.thresholdLevel = 0;
                    aComposite.sanitizeURLEnabled = true;
                    aComposite.sanitizedURL = "";
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
                    var clonedComposites = new Array();
                    for (var i = 0; i < this.metricComposites.length; i++) {
                        var matchedMetrics = new Array();
                        var aComposite = this.metricComposites[i];
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
                                        seriesItem.clickThrough = aComposite.clickThrough;
                                        seriesItem.sanitizedURL = this.$sanitize(aComposite.clickThrough);
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
                                currentWorstSeries = this.getWorstSeries(currentWorstSeries, seriesItem);
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
                CompositesManager.prototype.getWorstSeries = function (series1, series2) {
                    var worstSeries = series1;
                    var series1thresholdLevel = this.getThresholdLevelForSeriesValue(series1);
                    var series2thresholdLevel = this.getThresholdLevelForSeriesValue(series2);
                    if (series2thresholdLevel > series1thresholdLevel) {
                        worstSeries = series2;
                    }
                    if (series1thresholdLevel === 3) {
                        switch (series2thresholdLevel) {
                            case 1:
                                worstSeries = series2;
                                break;
                            case 2:
                                worstSeries = series2;
                                break;
                        }
                    }
                    return worstSeries;
                };
                CompositesManager.prototype.getThresholdLevelForSeriesValue = function (series) {
                    var value = series.value;
                    if (value === null) {
                        return 3;
                    }
                    var lastState = 0;
                    for (var i = series.thresholds.length - 1; i >= 0; i--) {
                        var aThreshold = series.thresholds[i];
                        if (value >= aThreshold.value) {
                            return aThreshold.state;
                        }
                    }
                    return lastState;
                };
                CompositesManager.prototype.metricNameChanged = function (item) {
                    console.log(item);
                    this.$scope.ctrl.refresh();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUFBO2dCQVlBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBWkQsSUFZQzs7WUFFRDtnQkFPSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFXQztvQkFWRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUUvQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztnQkFDNUMsQ0FBQztnQkFFRCw4Q0FBa0IsR0FBbEI7b0JBQ0ksSUFBSSxVQUFVLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztvQkFDdkMsVUFBVSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7b0JBQzlCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQzFCLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQUM3QixVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDOUIsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQzNC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QUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDL0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLElBQUksS0FBSyxVQUFVLEVBQUU7NEJBQ3JCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7Z0NBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hELE1BQU07NkJBQ1Q7eUJBQ0o7cUJBQ0o7Z0JBQ0wsQ0FBQztnQkFFRCxxQ0FBUyxHQUFULFVBQVUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPO29CQUM3QixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0wsd0JBQUM7WUFBRCxDQUFDLEFBaE9ELElBZ09DIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5pbXBvcnQgeyBQb2x5c3RhdE1vZGVsIH0gZnJvbSBcIi4vcG9seXN0YXRtb2RlbFwiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljQ29tcG9zaXRlIHtcbiAgICBjb21wb3NpdGVOYW1lOiBzdHJpbmc7XG4gICAgbWVtYmVyczogQXJyYXk8YW55PjtcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIGhpZGVNZW1iZXJzOiBib29sZWFuO1xuICAgIHNob3dOYW1lOiBib29sZWFuO1xuICAgIHNob3dWYWx1ZTogYm9vbGVhbjtcbiAgICBhbmltYXRlTW9kZTogc3RyaW5nO1xuICAgIHRocmVzaG9sZExldmVsOiBudW1iZXI7XG4gICAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gICAgc2FuaXRpemVVUkxFbmFibGVkOiBib29sZWFuO1xuICAgIHNhbml0aXplZFVSTDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlc01hbmFnZXIge1xuICAgICRzY29wZTogYW55O1xuICAgIHRlbXBsYXRlU3J2OiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgc3VnZ2VzdE1ldHJpY05hbWVzOiBhbnk7XG4gICAgbWV0cmljQ29tcG9zaXRlczogQXJyYXk8TWV0cmljQ29tcG9zaXRlPjtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgc2F2ZWRDb21wb3NpdGVzKSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRzYW5pdGl6ZSA9ICRzYW5pdGl6ZTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMgPSBzYXZlZENvbXBvc2l0ZXM7XG4gICAgfVxuXG4gICAgYWRkTWV0cmljQ29tcG9zaXRlKCkge1xuICAgICAgICBsZXQgYUNvbXBvc2l0ZSA9IG5ldyBNZXRyaWNDb21wb3NpdGUoKTtcbiAgICAgICAgYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lID0gXCJcIjtcbiAgICAgICAgYUNvbXBvc2l0ZS5tZW1iZXJzID0gW3t9XTtcbiAgICAgICAgYUNvbXBvc2l0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgICAgICBhQ29tcG9zaXRlLmhpZGVNZW1iZXJzID0gdHJ1ZTtcbiAgICAgICAgYUNvbXBvc2l0ZS5zaG93TmFtZSA9IHRydWU7XG4gICAgICAgIGFDb21wb3NpdGUuc2hvd1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgYUNvbXBvc2l0ZS5hbmltYXRlTW9kZSA9IFwiYWxsXCI7XG4gICAgICAgIGFDb21wb3NpdGUudGhyZXNob2xkTGV2ZWwgPSAwO1xuICAgICAgICBhQ29tcG9zaXRlLnNhbml0aXplVVJMRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIGFDb21wb3NpdGUuc2FuaXRpemVkVVJMID0gXCJcIjtcbiAgICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzLnB1c2goYUNvbXBvc2l0ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWV0cmljQ29tcG9zaXRlKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzID0gXy53aXRob3V0KHRoaXMubWV0cmljQ29tcG9zaXRlcywgaXRlbSk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGFkZE1ldHJpY1RvQ29tcG9zaXRlKGNvbXBvc2l0ZSkge1xuICAgICAgICBpZiAoY29tcG9zaXRlLm1lbWJlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMgPSBbe31dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMucHVzaCh7fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWV0cmljRnJvbUNvbXBvc2l0ZShjb21wb3NpdGUsIG1ldHJpYykge1xuICAgICAgICBjb21wb3NpdGUubWVtYmVycyA9IF8ud2l0aG91dChjb21wb3NpdGUubWVtYmVycywgbWV0cmljKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbWF0Y2hDb21wb3NpdGUocGF0dGVybikgOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGFDb21wb3NpdGUgPSB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFyIHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWUpO1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGFwcGx5Q29tcG9zaXRlcyhkYXRhKSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZE1ldHJpY3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgICAgICBsZXQgY2xvbmVkQ29tcG9zaXRlcyA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG1hdGNoZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICAgICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2ldO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRXb3JzdFNlcmllcyA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFDb21wb3NpdGUubWVtYmVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBhTWV0cmljID0gYUNvbXBvc2l0ZS5tZW1iZXJzW2pdO1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIHRoZSBtYXRjaGVzIHRvIHRoZSBwYXR0ZXJuIGluIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgIC8vIHNlcmllc25hbWUgbWF5IG5vdCBiZSBkZWZpbmVkIHlldCwgc2tpcFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFNZXRyaWMuc2VyaWVzTmFtZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYU1ldHJpYy5zZXJpZXNOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBkYXRhW2luZGV4XS5uYW1lLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VyaWVzSXRlbSA9IGRhdGFbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCBpbmRleCBvZiB0aGUgbWF0Y2hlZCBtZXRyaWNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRNZXRyaWNzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25seSBoaWRlIGlmIHJlcXVlc3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuaGlkZU1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZE1ldHJpY3MucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uY2xpY2tUaHJvdWdoID0gYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzSXRlbS5zYW5pdGl6ZWRVUkwgPSB0aGlzLiRzYW5pdGl6ZShhQ29tcG9zaXRlLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hlZE1ldHJpY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5vdyBkZXRlcm1pbmUgdGhlIG1vc3QgdHJpZ2dlcmVkIHRocmVzaG9sZFxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtYXRjaGVkTWV0cmljcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIGxldCBpdGVtSW5kZXggPSBtYXRjaGVkTWV0cmljc1trXTtcbiAgICAgICAgICAgICAgICBsZXQgc2VyaWVzSXRlbSA9IGRhdGFbaXRlbUluZGV4XTtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayB0aHJlc2hvbGRzXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRXb3JzdFNlcmllcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBzZXJpZXNJdGVtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRXb3JzdFNlcmllcyA9IHRoaXMuZ2V0V29yc3RTZXJpZXMoY3VycmVudFdvcnN0U2VyaWVzLCBzZXJpZXNJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQcmVmaXggdGhlIHZhbHVlRm9ybWF0dGVkIHdpdGggdGhlIGFjdHVhbCBtZXRyaWMgbmFtZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRXb3JzdFNlcmllcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjbG9uZSA9IGN1cnJlbnRXb3JzdFNlcmllcy5zaGFsbG93Q2xvbmUoKTtcbiAgICAgICAgICAgICAgICBjbG9uZS5uYW1lID0gYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lO1xuICAgICAgICAgICAgICAgIC8vIHRvb2x0aXAvbGVnZW5kIHVzZXMgdGhpcyB0byBleHBhbmQgd2hhdCB2YWx1ZXMgYXJlIGluc2lkZSB0aGUgY29tcG9zaXRlXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG1hdGNoZWRNZXRyaWNzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbUluZGV4ID0gbWF0Y2hlZE1ldHJpY3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjbG9uZS5tZW1iZXJzLnB1c2goZGF0YVtpdGVtSW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xvbmUudGhyZXNob2xkTGV2ZWwgPSBjdXJyZW50V29yc3RTZXJpZXMudGhyZXNob2xkTGV2ZWw7XG4gICAgICAgICAgICAgICAgLy8gY3VycmVudFdvcnN0U2VyaWVzLnZhbHVlRm9ybWF0dGVkID0gY3VycmVudFdvcnN0U2VyaWVzTmFtZSArICc6ICcgKyBjdXJyZW50V29yc3RTZXJpZXMudmFsdWVGb3JtYXR0ZWQ7XG4gICAgICAgICAgICAgICAgLy8gbm93IHB1c2ggdGhlIGNvbXBvc2l0ZSBpbnRvIGRhdGFcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGNvbXBvc2l0ZSBzZXRpbmcgZm9yIHNob3dpbmcgdGhlIG5hbWUvdmFsdWUgdG8gdGhlIG5ldyBjbG9uZWQgbW9kZWxcbiAgICAgICAgICAgICAgICBjbG9uZS5zaG93TmFtZSA9IGFDb21wb3NpdGUuc2hvd05hbWU7XG4gICAgICAgICAgICAgICAgY2xvbmUuc2hvd1ZhbHVlID0gYUNvbXBvc2l0ZS5zaG93VmFsdWU7XG4gICAgICAgICAgICAgICAgY2xvbmUuYW5pbWF0ZU1vZGUgPSBhQ29tcG9zaXRlLmFuaW1hdGVNb2RlO1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhpcyBzZXJpZXMgYXMgYSBjb21wc2l0ZVxuICAgICAgICAgICAgICAgIGNsb25lLmlzQ29tcG9zaXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbG9uZWRDb21wb3NpdGVzLnB1c2goY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyBtZXJnZSB0aGUgY2xvbmVkQ29tcG9zaXRlcyBpbnRvIGRhdGFcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZGF0YSwgY2xvbmVkQ29tcG9zaXRlcyk7XG4gICAgICAgIC8vIHNvcnQgYnkgdmFsdWUgZGVzY2VuZGluZ1xuICAgICAgICBmaWx0ZXJlZE1ldHJpY3Muc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYiAtIGE7IH0pO1xuICAgICAgICAvLyBub3cgcmVtb3ZlIHRoZSBmaWx0ZXJlZCBtZXRyaWNzIGZyb20gZmluYWwgbGlzdFxuICAgICAgICAvLyByZW1vdmUgZmlsdGVyZWQgbWV0cmljcywgdXNlIHNwbGljZSBpbiByZXZlcnNlIG9yZGVyXG4gICAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhmaWx0ZXJlZE1ldHJpY3MsIGkpKSB7XG4gICAgICAgICAgICBkYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgZ2V0V29yc3RTZXJpZXMoc2VyaWVzMSwgc2VyaWVzMikge1xuICAgICAgICB2YXIgd29yc3RTZXJpZXMgPSBzZXJpZXMxO1xuICAgICAgICB2YXIgc2VyaWVzMXRocmVzaG9sZExldmVsID0gdGhpcy5nZXRUaHJlc2hvbGRMZXZlbEZvclNlcmllc1ZhbHVlKHNlcmllczEpO1xuICAgICAgICB2YXIgc2VyaWVzMnRocmVzaG9sZExldmVsID0gdGhpcy5nZXRUaHJlc2hvbGRMZXZlbEZvclNlcmllc1ZhbHVlKHNlcmllczIpO1xuICAgICAgICAvLyBTdGF0ZSAzIGlzIFVua25vd24gYW5kIGlzIG5vdCBiZSB3b3JzZSB0aGFuIENSSVRJQ0FMIChzdGF0ZSAyKVxuICAgICAgICBpZiAoc2VyaWVzMnRocmVzaG9sZExldmVsID4gc2VyaWVzMXRocmVzaG9sZExldmVsKSB7XG4gICAgICAgICAgLy8gc2VyaWVzMiBoYXMgaGlnaGVyIHRocmVzaG9sZCB2aW9sYXRpb25cbiAgICAgICAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcmllczF0aHJlc2hvbGRMZXZlbCA9PT0gMykge1xuICAgICAgICAgIC8vIHNlcmllczEgaXMgaW4gc3RhdGUgdW5rbm93biwgY2hlY2sgaWYgc2VyaWVzMiBpcyBpbiBzdGF0ZSAxIG9yIDJcbiAgICAgICAgICBzd2l0Y2ggKHNlcmllczJ0aHJlc2hvbGRMZXZlbCkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdvcnN0U2VyaWVzO1xuICAgIH1cblxuICAgIC8vIHVzZXIgbWF5IGRlZmluZSB0aGUgdGhyZXNob2xkIHdpdGgganVzdCBvbmUgdmFsdWVcbiAgICBnZXRUaHJlc2hvbGRMZXZlbEZvclNlcmllc1ZhbHVlKHNlcmllcyk6IG51bWJlciB7XG4gICAgICB2YXIgdmFsdWUgPSBzZXJpZXMudmFsdWU7XG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIDM7IC8vIE5vIERhdGFcbiAgICAgIH1cbiAgICAgIC8vIGFzc3VtZSBPSyBzdGF0ZVxuICAgICAgbGV0IGxhc3RTdGF0ZSA9IDA7XG4gICAgICBmb3IgKGxldCBpID0gc2VyaWVzLnRocmVzaG9sZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGFUaHJlc2hvbGQgPSBzZXJpZXMudGhyZXNob2xkc1tpXTtcbiAgICAgICAgaWYgKHZhbHVlID49IGFUaHJlc2hvbGQudmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gYVRocmVzaG9sZC5zdGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxhc3RTdGF0ZTtcbiAgICB9XG5cbiAgICBtZXRyaWNOYW1lQ2hhbmdlZChpdGVtKSB7XG4gICAgICAgIC8vIFRPRE86IHZhbGlkYXRlIGl0ZW0gaXMgYSB2YWxpZCByZWdleFxuICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbW92ZU1ldHJpY0NvbXBvc2l0ZVVwKGl0ZW0pIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBhQ29tcG9zaXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5bW92ZSh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMsIGluZGV4LCBpbmRleCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlTWV0cmljQ29tcG9zaXRlRG93bihpdGVtKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF07XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gYW5PdmVycmlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheW1vdmUodGhpcy5tZXRyaWNDb21wb3NpdGVzLCBpbmRleCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJyYXltb3ZlKGFyciwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gYXJyW2Zyb21JbmRleF07XG4gICAgICAgIGFyci5zcGxpY2UoZnJvbUluZGV4LCAxKTtcbiAgICAgICAgYXJyLnNwbGljZSh0b0luZGV4LCAwLCBlbGVtZW50KTtcbiAgICB9XG59XG4iXX0=