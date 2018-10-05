System.register(["lodash", "app/core/utils/kbn", "./threshold_processor"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, MetricComposite, CompositesManager;
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
                                currentWorstSeries = threshold_processor_1.getWorstSeries(currentWorstSeries, seriesItem);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUFBO2dCQVlBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBWkQsSUFZQzs7WUFFRDtnQkFPSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFXQztvQkFWRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUUvQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztnQkFDNUMsQ0FBQztnQkFFRCw4Q0FBa0IsR0FBbEI7b0JBQ0ksSUFBSSxVQUFVLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztvQkFDdkMsVUFBVSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7b0JBQzlCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQzFCLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQUM3QixVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDOUIsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JB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QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQy9ELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDOUMsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFOzRCQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO2dDQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dDQUN4RCxNQUFNOzZCQUNUO3lCQUNKO3FCQUNKO2dCQUNMLENBQUM7Z0JBRUQscUNBQVMsR0FBVCxVQUFVLEdBQUcsRUFBRSxTQUFTLEVBQUUsT0FBTztvQkFDN0IsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO2dCQUNMLHdCQUFDO1lBQUQsQ0FBQyxBQXpMRCxJQXlMQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IHsgUG9seXN0YXRNb2RlbCB9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7IGdldFdvcnN0U2VyaWVzIH0gZnJvbSBcIi4vdGhyZXNob2xkX3Byb2Nlc3NvclwiO1xuZXhwb3J0IGNsYXNzIE1ldHJpY0NvbXBvc2l0ZSB7XG4gICAgY29tcG9zaXRlTmFtZTogc3RyaW5nO1xuICAgIG1lbWJlcnM6IEFycmF5PGFueT47XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBoaWRlTWVtYmVyczogYm9vbGVhbjtcbiAgICBzaG93TmFtZTogYm9vbGVhbjtcbiAgICBzaG93VmFsdWU6IGJvb2xlYW47XG4gICAgYW5pbWF0ZU1vZGU6IHN0cmluZztcbiAgICB0aHJlc2hvbGRMZXZlbDogbnVtYmVyO1xuICAgIGNsaWNrVGhyb3VnaDogc3RyaW5nO1xuICAgIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgICBzYW5pdGl6ZWRVUkw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvc2l0ZXNNYW5hZ2VyIHtcbiAgICAkc2NvcGU6IGFueTtcbiAgICB0ZW1wbGF0ZVNydjogYW55O1xuICAgICRzYW5pdGl6ZTogYW55O1xuICAgIHN1Z2dlc3RNZXRyaWNOYW1lczogYW55O1xuICAgIG1ldHJpY0NvbXBvc2l0ZXM6IEFycmF5PE1ldHJpY0NvbXBvc2l0ZT47XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHNhdmVkQ29tcG9zaXRlcykge1xuICAgICAgICB0aGlzLiRzY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy4kc2FuaXRpemUgPSAkc2FuaXRpemU7XG4gICAgICAgIHRoaXMudGVtcGxhdGVTcnYgPSB0ZW1wbGF0ZVNydjtcbiAgICAgICAgLy8gdHlwZWFoZWFkIHJlcXVpcmVzIHRoaXMgZm9ybVxuICAgICAgICB0aGlzLnN1Z2dlc3RNZXRyaWNOYW1lcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBfLm1hcCh0aGlzLiRzY29wZS5jdHJsLnNlcmllcywgZnVuY3Rpb24gKHNlcmllcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXJpZXMuYWxpYXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzID0gc2F2ZWRDb21wb3NpdGVzO1xuICAgIH1cblxuICAgIGFkZE1ldHJpY0NvbXBvc2l0ZSgpIHtcbiAgICAgICAgbGV0IGFDb21wb3NpdGUgPSBuZXcgTWV0cmljQ29tcG9zaXRlKCk7XG4gICAgICAgIGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZSA9IFwiXCI7XG4gICAgICAgIGFDb21wb3NpdGUubWVtYmVycyA9IFt7fV07XG4gICAgICAgIGFDb21wb3NpdGUuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgICAgYUNvbXBvc2l0ZS5oaWRlTWVtYmVycyA9IHRydWU7XG4gICAgICAgIGFDb21wb3NpdGUuc2hvd05hbWUgPSB0cnVlO1xuICAgICAgICBhQ29tcG9zaXRlLnNob3dWYWx1ZSA9IHRydWU7XG4gICAgICAgIGFDb21wb3NpdGUuYW5pbWF0ZU1vZGUgPSBcImFsbFwiO1xuICAgICAgICBhQ29tcG9zaXRlLnRocmVzaG9sZExldmVsID0gMDtcbiAgICAgICAgYUNvbXBvc2l0ZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBhQ29tcG9zaXRlLnNhbml0aXplZFVSTCA9IFwiXCI7XG4gICAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcy5wdXNoKGFDb21wb3NpdGUpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY0NvbXBvc2l0ZShpdGVtKSB7XG4gICAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMsIGl0ZW0pO1xuICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBhZGRNZXRyaWNUb0NvbXBvc2l0ZShjb21wb3NpdGUpIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZS5tZW1iZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbXBvc2l0ZS5tZW1iZXJzID0gW3t9XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBvc2l0ZS5tZW1iZXJzLnB1c2goe30pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY0Zyb21Db21wb3NpdGUoY29tcG9zaXRlLCBtZXRyaWMpIHtcbiAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMgPSBfLndpdGhvdXQoY29tcG9zaXRlLm1lbWJlcnMsIG1ldHJpYyk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIG1hdGNoQ29tcG9zaXRlKHBhdHRlcm4pIDogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XTtcbiAgICAgICAgICAgIHZhciByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gcGF0dGVybi5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBhcHBseUNvbXBvc2l0ZXMoZGF0YSkge1xuICAgICAgICBsZXQgZmlsdGVyZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICAgICAgbGV0IGNsb25lZENvbXBvc2l0ZXMgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgICAgICAgICBsZXQgYUNvbXBvc2l0ZSA9IHRoaXMubWV0cmljQ29tcG9zaXRlc1tpXTtcbiAgICAgICAgICAgIGxldCBjdXJyZW50V29yc3RTZXJpZXMgPSBudWxsO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhQ29tcG9zaXRlLm1lbWJlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYU1ldHJpYyA9IGFDb21wb3NpdGUubWVtYmVyc1tqXTtcbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciB0aGUgbWF0Y2hlcyB0byB0aGUgcGF0dGVybiBpbiB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCByZWdleFxuICAgICAgICAgICAgICAgICAgICAvLyBzZXJpZXNuYW1lIG1heSBub3QgYmUgZGVmaW5lZCB5ZXQsIHNraXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhTWV0cmljLnNlcmllc05hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnZXggPSBrYm4uc3RyaW5nVG9Kc1JlZ2V4KGFNZXRyaWMuc2VyaWVzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVzID0gZGF0YVtpbmRleF0ubmFtZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlcmllc0l0ZW0gPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgaW5kZXggb2YgdGhlIG1hdGNoZWQgbWV0cmljXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkTWV0cmljcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaGlkZSBpZiByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhQ29tcG9zaXRlLmhpZGVNZW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNJdGVtLmNsaWNrVGhyb3VnaCA9IGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUoYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoZWRNZXRyaWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBub3cgZGV0ZXJtaW5lIHRoZSBtb3N0IHRyaWdnZXJlZCB0aHJlc2hvbGRcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbWF0Y2hlZE1ldHJpY3MubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUluZGV4ID0gbWF0Y2hlZE1ldHJpY3Nba107XG4gICAgICAgICAgICAgICAgbGV0IHNlcmllc0l0ZW0gPSBkYXRhW2l0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgdGhyZXNob2xkc1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50V29yc3RTZXJpZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFdvcnN0U2VyaWVzID0gc2VyaWVzSXRlbTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBnZXRXb3JzdFNlcmllcyhjdXJyZW50V29yc3RTZXJpZXMsIHNlcmllc0l0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFByZWZpeCB0aGUgdmFsdWVGb3JtYXR0ZWQgd2l0aCB0aGUgYWN0dWFsIG1ldHJpYyBuYW1lXG4gICAgICAgICAgICBpZiAoY3VycmVudFdvcnN0U2VyaWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lID0gY3VycmVudFdvcnN0U2VyaWVzLnNoYWxsb3dDbG9uZSgpO1xuICAgICAgICAgICAgICAgIGNsb25lLm5hbWUgPSBhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWU7XG4gICAgICAgICAgICAgICAgLy8gdG9vbHRpcC9sZWdlbmQgdXNlcyB0aGlzIHRvIGV4cGFuZCB3aGF0IHZhbHVlcyBhcmUgaW5zaWRlIHRoZSBjb21wb3NpdGVcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbWF0Y2hlZE1ldHJpY3MubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtSW5kZXggPSBtYXRjaGVkTWV0cmljc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNsb25lLm1lbWJlcnMucHVzaChkYXRhW2l0ZW1JbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbG9uZS50aHJlc2hvbGRMZXZlbCA9IGN1cnJlbnRXb3JzdFNlcmllcy50aHJlc2hvbGRMZXZlbDtcbiAgICAgICAgICAgICAgICAvLyBjdXJyZW50V29yc3RTZXJpZXMudmFsdWVGb3JtYXR0ZWQgPSBjdXJyZW50V29yc3RTZXJpZXNOYW1lICsgJzogJyArIGN1cnJlbnRXb3JzdFNlcmllcy52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgICAgICAgICAvLyBub3cgcHVzaCB0aGUgY29tcG9zaXRlIGludG8gZGF0YVxuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgY29tcG9zaXRlIHNldGluZyBmb3Igc2hvd2luZyB0aGUgbmFtZS92YWx1ZSB0byB0aGUgbmV3IGNsb25lZCBtb2RlbFxuICAgICAgICAgICAgICAgIGNsb25lLnNob3dOYW1lID0gYUNvbXBvc2l0ZS5zaG93TmFtZTtcbiAgICAgICAgICAgICAgICBjbG9uZS5zaG93VmFsdWUgPSBhQ29tcG9zaXRlLnNob3dWYWx1ZTtcbiAgICAgICAgICAgICAgICBjbG9uZS5hbmltYXRlTW9kZSA9IGFDb21wb3NpdGUuYW5pbWF0ZU1vZGU7XG4gICAgICAgICAgICAgICAgLy8gbWFyayB0aGlzIHNlcmllcyBhcyBhIGNvbXBzaXRlXG4gICAgICAgICAgICAgICAgY2xvbmUuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsb25lZENvbXBvc2l0ZXMucHVzaChjbG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IG1lcmdlIHRoZSBjbG9uZWRDb21wb3NpdGVzIGludG8gZGF0YVxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShkYXRhLCBjbG9uZWRDb21wb3NpdGVzKTtcbiAgICAgICAgLy8gc29ydCBieSB2YWx1ZSBkZXNjZW5kaW5nXG4gICAgICAgIGZpbHRlcmVkTWV0cmljcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiIC0gYTsgfSk7XG4gICAgICAgIC8vIG5vdyByZW1vdmUgdGhlIGZpbHRlcmVkIG1ldHJpY3MgZnJvbSBmaW5hbCBsaXN0XG4gICAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRhdGEubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChfLmluY2x1ZGVzKGZpbHRlcmVkTWV0cmljcywgaSkpIHtcbiAgICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIG1ldHJpY05hbWVDaGFuZ2VkKGl0ZW0pIHtcbiAgICAgICAgLy8gVE9ETzogdmFsaWRhdGUgaXRlbSBpcyBhIHZhbGlkIHJlZ2V4XG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBtb3ZlTWV0cmljQ29tcG9zaXRlVXAoaXRlbSkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGFDb21wb3NpdGUgPSB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IGFDb21wb3NpdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXltb3ZlKHRoaXMubWV0cmljQ29tcG9zaXRlcywgaW5kZXgsIGluZGV4IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVNZXRyaWNDb21wb3NpdGVEb3duKGl0ZW0pIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBhbk92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5bW92ZSh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMsIGluZGV4LCBpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcnJheW1vdmUoYXJyLCBmcm9tSW5kZXgsIHRvSW5kZXgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBhcnJbZnJvbUluZGV4XTtcbiAgICAgICAgYXJyLnNwbGljZShmcm9tSW5kZXgsIDEpO1xuICAgICAgICBhcnIuc3BsaWNlKHRvSW5kZXgsIDAsIGVsZW1lbnQpO1xuICAgIH1cbn1cbiJdfQ==