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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUFBO2dCQWFBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBYkQsSUFhQzs7WUFFRDtnQkFPSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFpQkM7b0JBaEJDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29CQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBRS9CLElBQUksQ0FBQyxrQkFBa0IsR0FBRzt3QkFDeEIsT0FBTyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxNQUFNOzRCQUNwRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQ3RCLENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQztvQkFDRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO29CQUV4QyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDakUsSUFBSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFOzRCQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDakU7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFRCw4Q0FBa0IsR0FBbEI7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Q0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNyQyxJQUFJLGdCQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRTs0QkFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ25CO3FCQUNGO29CQUNELE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsNkNBQWlCLEdBQWpCLFVBQWtCLElBQUk7b0JBRWxCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUMvQixDQUFDO2dCQUVELHNDQUFVLEdBQVYsVUFBVyxTQUFTO29CQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDekQsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixDQUFDO2dCQUNMLHdCQUFDO1lBQUQsQ0FBQyxBQXBMRCxJQW9MQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IHsgUG9seXN0YXRNb2RlbCB9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7IGdldFdvcnN0U2VyaWVzIH0gZnJvbSBcIi4vdGhyZXNob2xkX3Byb2Nlc3NvclwiO1xuZXhwb3J0IGNsYXNzIE1ldHJpY0NvbXBvc2l0ZSB7XG4gICAgY29tcG9zaXRlTmFtZTogc3RyaW5nO1xuICAgIG1lbWJlcnM6IEFycmF5PGFueT47XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBoaWRlTWVtYmVyczogYm9vbGVhbjtcbiAgICBzaG93TmFtZTogYm9vbGVhbjtcbiAgICBzaG93VmFsdWU6IGJvb2xlYW47XG4gICAgYW5pbWF0ZU1vZGU6IHN0cmluZztcbiAgICB0aHJlc2hvbGRMZXZlbDogbnVtYmVyO1xuICAgIGNsaWNrVGhyb3VnaDogc3RyaW5nO1xuICAgIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgICBzYW5pdGl6ZWRVUkw6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlc01hbmFnZXIge1xuICAgICRzY29wZTogYW55O1xuICAgIHRlbXBsYXRlU3J2OiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgc3VnZ2VzdE1ldHJpY05hbWVzOiBhbnk7XG4gICAgbWV0cmljQ29tcG9zaXRlczogQXJyYXk8TWV0cmljQ29tcG9zaXRlPjtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgc2F2ZWRDb21wb3NpdGVzKSB7XG4gICAgICB0aGlzLiRzY29wZSA9ICRzY29wZTtcbiAgICAgIHRoaXMuJHNhbml0aXplID0gJHNhbml0aXplO1xuICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgLy8gdHlwZWFoZWFkIHJlcXVpcmVzIHRoaXMgZm9ybVxuICAgICAgdGhpcy5zdWdnZXN0TWV0cmljTmFtZXMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBfLm1hcCh0aGlzLiRzY29wZS5jdHJsLnNlcmllcywgZnVuY3Rpb24gKHNlcmllcykge1xuICAgICAgICAgIHJldHVybiBzZXJpZXMuYWxpYXM7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcyA9IHNhdmVkQ29tcG9zaXRlcztcbiAgICAgIC8vIHVwZ3JhZGUgaWYgbm8gbGFiZWwgcHJlc2VudFxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdLmxhYmVsID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XS5sYWJlbCA9IFwiQ09NUE9TSVRFIFwiICsgKGluZGV4ICsgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRNZXRyaWNDb21wb3NpdGUoKSB7XG4gICAgICBsZXQgYUNvbXBvc2l0ZSA9IG5ldyBNZXRyaWNDb21wb3NpdGUoKTtcbiAgICAgIGFDb21wb3NpdGUubGFiZWwgPSBcIkNPTVBPU0lURSBcIiArICh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoICsgMSk7XG4gICAgICBhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWUgPSBcIlwiO1xuICAgICAgYUNvbXBvc2l0ZS5tZW1iZXJzID0gW3t9XTtcbiAgICAgIGFDb21wb3NpdGUuZW5hYmxlZCA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLmNsaWNrVGhyb3VnaCA9IFwiXCI7XG4gICAgICBhQ29tcG9zaXRlLmhpZGVNZW1iZXJzID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuc2hvd05hbWUgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5zaG93VmFsdWUgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5hbmltYXRlTW9kZSA9IFwiYWxsXCI7XG4gICAgICBhQ29tcG9zaXRlLnRocmVzaG9sZExldmVsID0gMDtcbiAgICAgIGFDb21wb3NpdGUuc2FuaXRpemVVUkxFbmFibGVkID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuc2FuaXRpemVkVVJMID0gXCJcIjtcbiAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcy5wdXNoKGFDb21wb3NpdGUpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY0NvbXBvc2l0ZShpdGVtKSB7XG4gICAgICAvLyBsb2Rhc2ggXy53aXRob3V0IGNyZWF0ZXMgYSBuZXcgYXJyYXksIG5lZWQgdG8gcmVhc3NpZ24gdG8gdGhlIHBhbmVsIHdoZXJlIGl0IHdpbGwgYmUgc2F2ZWRcbiAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY0NvbXBvc2l0ZXMsIGl0ZW0pO1xuICAgICAgLy8gZml4IHRoZSBsYWJlbHNcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF0ubGFiZWwgPSBcIkNPTVBPU0lURSBcIiArIChpbmRleCArIDEpO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gcmVmZXJlbmNlIGluIHBhbmVsXG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnNhdmVkQ29tcG9zaXRlcyA9IHRoaXMubWV0cmljQ29tcG9zaXRlcztcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGFkZE1ldHJpY1RvQ29tcG9zaXRlKGNvbXBvc2l0ZSkge1xuICAgICAgaWYgKGNvbXBvc2l0ZS5tZW1iZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMgPSBbe31dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9zaXRlLm1lbWJlcnMucHVzaCh7fSk7XG4gICAgICB9XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNGcm9tQ29tcG9zaXRlKGNvbXBvc2l0ZSwgbWV0cmljKSB7XG4gICAgICBjb21wb3NpdGUubWVtYmVycyA9IF8ud2l0aG91dChjb21wb3NpdGUubWVtYmVycywgbWV0cmljKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIG1hdGNoQ29tcG9zaXRlKHBhdHRlcm4pIDogbnVtYmVyIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XTtcbiAgICAgICAgdmFyIHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWUpO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4ubWF0Y2gocmVnZXgpO1xuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDAgJiYgYUNvbXBvc2l0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgYXBwbHlDb21wb3NpdGVzKGRhdGEpIHtcbiAgICAgIGxldCBmaWx0ZXJlZE1ldHJpY3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgICAgbGV0IGNsb25lZENvbXBvc2l0ZXMgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBtYXRjaGVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgICAgIGxldCBhQ29tcG9zaXRlID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzW2ldO1xuICAgICAgICBpZiAoIWFDb21wb3NpdGUuZW5hYmxlZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50V29yc3RTZXJpZXMgPSBudWxsO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFDb21wb3NpdGUubWVtYmVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBhTWV0cmljID0gYUNvbXBvc2l0ZS5tZW1iZXJzW2pdO1xuICAgICAgICAgIC8vIGxvb2sgZm9yIHRoZSBtYXRjaGVzIHRvIHRoZSBwYXR0ZXJuIGluIHRoZSBkYXRhXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBtYXRjaCByZWdleFxuICAgICAgICAgICAgLy8gc2VyaWVzbmFtZSBtYXkgbm90IGJlIGRlZmluZWQgeWV0LCBza2lwXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFNZXRyaWMuc2VyaWVzTmFtZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYU1ldHJpYy5zZXJpZXNOYW1lKTtcbiAgICAgICAgICAgIGxldCBtYXRjaGVzID0gZGF0YVtpbmRleF0ubmFtZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbGV0IHNlcmllc0l0ZW0gPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgLy8ga2VlcCBpbmRleCBvZiB0aGUgbWF0Y2hlZCBtZXRyaWNcbiAgICAgICAgICAgICAgbWF0Y2hlZE1ldHJpY3MucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgIC8vIG9ubHkgaGlkZSBpZiByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuaGlkZU1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZE1ldHJpY3MucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzZXJpZXNJdGVtLmNsaWNrVGhyb3VnaCA9IGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoO1xuICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUoYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaGVkTWV0cmljcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3cgZGV0ZXJtaW5lIHRoZSBtb3N0IHRyaWdnZXJlZCB0aHJlc2hvbGRcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtYXRjaGVkTWV0cmljcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGxldCBpdGVtSW5kZXggPSBtYXRjaGVkTWV0cmljc1trXTtcbiAgICAgICAgICBsZXQgc2VyaWVzSXRlbSA9IGRhdGFbaXRlbUluZGV4XTtcbiAgICAgICAgICAvLyBjaGVjayB0aHJlc2hvbGRzXG4gICAgICAgICAgaWYgKGN1cnJlbnRXb3JzdFNlcmllcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudFdvcnN0U2VyaWVzID0gc2VyaWVzSXRlbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFdvcnN0U2VyaWVzID0gZ2V0V29yc3RTZXJpZXMoXG4gICAgICAgICAgICAgIGN1cnJlbnRXb3JzdFNlcmllcyxcbiAgICAgICAgICAgICAgc2VyaWVzSXRlbSxcbiAgICAgICAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJlZml4IHRoZSB2YWx1ZUZvcm1hdHRlZCB3aXRoIHRoZSBhY3R1YWwgbWV0cmljIG5hbWVcbiAgICAgICAgaWYgKGN1cnJlbnRXb3JzdFNlcmllcyAhPT0gbnVsbCkge1xuICAgICAgICAgIGxldCBjbG9uZSA9IGN1cnJlbnRXb3JzdFNlcmllcy5zaGFsbG93Q2xvbmUoKTtcbiAgICAgICAgICBjbG9uZS5uYW1lID0gYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lO1xuICAgICAgICAgIC8vIHRvb2x0aXAvbGVnZW5kIHVzZXMgdGhpcyB0byBleHBhbmQgd2hhdCB2YWx1ZXMgYXJlIGluc2lkZSB0aGUgY29tcG9zaXRlXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG1hdGNoZWRNZXRyaWNzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW1JbmRleCA9IG1hdGNoZWRNZXRyaWNzW2luZGV4XTtcbiAgICAgICAgICAgIGNsb25lLm1lbWJlcnMucHVzaChkYXRhW2l0ZW1JbmRleF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbG9uZS50aHJlc2hvbGRMZXZlbCA9IGN1cnJlbnRXb3JzdFNlcmllcy50aHJlc2hvbGRMZXZlbDtcbiAgICAgICAgICAvLyBjdXJyZW50V29yc3RTZXJpZXMudmFsdWVGb3JtYXR0ZWQgPSBjdXJyZW50V29yc3RTZXJpZXNOYW1lICsgJzogJyArIGN1cnJlbnRXb3JzdFNlcmllcy52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgICAvLyBub3cgcHVzaCB0aGUgY29tcG9zaXRlIGludG8gZGF0YVxuICAgICAgICAgIC8vIGFkZCB0aGUgY29tcG9zaXRlIHNldGluZyBmb3Igc2hvd2luZyB0aGUgbmFtZS92YWx1ZSB0byB0aGUgbmV3IGNsb25lZCBtb2RlbFxuICAgICAgICAgIGNsb25lLnNob3dOYW1lID0gYUNvbXBvc2l0ZS5zaG93TmFtZTtcbiAgICAgICAgICBjbG9uZS5zaG93VmFsdWUgPSBhQ29tcG9zaXRlLnNob3dWYWx1ZTtcbiAgICAgICAgICBjbG9uZS5hbmltYXRlTW9kZSA9IGFDb21wb3NpdGUuYW5pbWF0ZU1vZGU7XG4gICAgICAgICAgLy8gbWFyayB0aGlzIHNlcmllcyBhcyBhIGNvbXBzaXRlXG4gICAgICAgICAgY2xvbmUuaXNDb21wb3NpdGUgPSB0cnVlO1xuICAgICAgICAgIGNsb25lZENvbXBvc2l0ZXMucHVzaChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIG5vdyBtZXJnZSB0aGUgY2xvbmVkQ29tcG9zaXRlcyBpbnRvIGRhdGFcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGRhdGEsIGNsb25lZENvbXBvc2l0ZXMpO1xuICAgICAgLy8gc29ydCBieSB2YWx1ZSBkZXNjZW5kaW5nXG4gICAgICBmaWx0ZXJlZE1ldHJpY3Muc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYiAtIGE7IH0pO1xuICAgICAgLy8gbm93IHJlbW92ZSB0aGUgZmlsdGVyZWQgbWV0cmljcyBmcm9tIGZpbmFsIGxpc3RcbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBtZXRyaWNOYW1lQ2hhbmdlZChpdGVtKSB7XG4gICAgICAgIC8vIFRPRE86IHZhbGlkYXRlIGl0ZW0gaXMgYSB2YWxpZCByZWdleFxuICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlSGlkZShjb21wb3NpdGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY29tcG9zaXRlIGVuYWJsZWQgPSAgXCIgKyBjb21wb3NpdGUuZW5hYmxlZCk7XG4gICAgICBjb21wb3NpdGUuZW5hYmxlZCA9ICFjb21wb3NpdGUuZW5hYmxlZDtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cbn1cbiJdfQ==