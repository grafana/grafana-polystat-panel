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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQUFBO2dCQWFBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBYkQsSUFhQzs7WUFFRDtnQkFRSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFrQkM7b0JBakJDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29CQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUVyQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3hCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDcEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN0QixDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztvQkFFeEMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQ2pFLElBQUksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDN0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJB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cmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IHsgUG9seXN0YXRNb2RlbCB9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7IGdldFdvcnN0U2VyaWVzIH0gZnJvbSBcIi4vdGhyZXNob2xkX3Byb2Nlc3NvclwiO1xuaW1wb3J0IHtDbGlja1Rocm91Z2hUcmFuc2Zvcm1lcn0gZnJvbSBcIi4vY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1ldHJpY0NvbXBvc2l0ZSB7XG4gICAgY29tcG9zaXRlTmFtZTogc3RyaW5nO1xuICAgIG1lbWJlcnM6IEFycmF5PGFueT47XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBoaWRlTWVtYmVyczogYm9vbGVhbjtcbiAgICBzaG93TmFtZTogYm9vbGVhbjtcbiAgICBzaG93VmFsdWU6IGJvb2xlYW47XG4gICAgYW5pbWF0ZU1vZGU6IHN0cmluZztcbiAgICB0aHJlc2hvbGRMZXZlbDogbnVtYmVyO1xuICAgIGNsaWNrVGhyb3VnaDogc3RyaW5nO1xuICAgIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgICBzYW5pdGl6ZWRVUkw6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlc01hbmFnZXIge1xuICAgICRzY29wZTogYW55O1xuICAgIHRlbXBsYXRlU3J2OiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgc3VnZ2VzdE1ldHJpY05hbWVzOiBhbnk7XG4gICAgbWV0cmljQ29tcG9zaXRlczogQXJyYXk8TWV0cmljQ29tcG9zaXRlPjtcbiAgICBzdWJUYWJJbmRleDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoJHNjb3BlLCB0ZW1wbGF0ZVNydiwgJHNhbml0aXplLCBzYXZlZENvbXBvc2l0ZXMpIHtcbiAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgdGhpcy4kc2FuaXRpemUgPSAkc2FuaXRpemU7XG4gICAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgICB0aGlzLnN1YlRhYkluZGV4ID0gMDtcbiAgICAgIC8vIHR5cGVhaGVhZCByZXF1aXJlcyB0aGlzIGZvcm1cbiAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gXy5tYXAodGhpcy4kc2NvcGUuY3RybC5zZXJpZXMsIGZ1bmN0aW9uIChzZXJpZXMpIHtcbiAgICAgICAgICByZXR1cm4gc2VyaWVzLmFsaWFzO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMgPSBzYXZlZENvbXBvc2l0ZXM7XG4gICAgICAvLyB1cGdyYWRlIGlmIG5vIGxhYmVsIHByZXNlbnRcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XS5sYWJlbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF0ubGFiZWwgPSBcIkNPTVBPU0lURSBcIiArIChpbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkTWV0cmljQ29tcG9zaXRlKCkge1xuICAgICAgbGV0IGFDb21wb3NpdGUgPSBuZXcgTWV0cmljQ29tcG9zaXRlKCk7XG4gICAgICBhQ29tcG9zaXRlLmxhYmVsID0gXCJDT01QT1NJVEUgXCIgKyAodGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aCArIDEpO1xuICAgICAgYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lID0gXCJcIjtcbiAgICAgIGFDb21wb3NpdGUubWVtYmVycyA9IFt7fV07XG4gICAgICBhQ29tcG9zaXRlLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgICAgYUNvbXBvc2l0ZS5oaWRlTWVtYmVycyA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLnNob3dOYW1lID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuc2hvd1ZhbHVlID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuYW5pbWF0ZU1vZGUgPSBcImFsbFwiO1xuICAgICAgYUNvbXBvc2l0ZS50aHJlc2hvbGRMZXZlbCA9IDA7XG4gICAgICBhQ29tcG9zaXRlLnNhbml0aXplVVJMRW5hYmxlZCA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLnNhbml0aXplZFVSTCA9IFwiXCI7XG4gICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMucHVzaChhQ29tcG9zaXRlKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNDb21wb3NpdGUoaXRlbSkge1xuICAgICAgLy8gbG9kYXNoIF8ud2l0aG91dCBjcmVhdGVzIGEgbmV3IGFycmF5LCBuZWVkIHRvIHJlYXNzaWduIHRvIHRoZSBwYW5lbCB3aGVyZSBpdCB3aWxsIGJlIHNhdmVkXG4gICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMgPSBfLndpdGhvdXQodGhpcy5tZXRyaWNDb21wb3NpdGVzLCBpdGVtKTtcbiAgICAgIC8vIGZpeCB0aGUgbGFiZWxzXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdLmxhYmVsID0gXCJDT01QT1NJVEUgXCIgKyAoaW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlYXNzaWduIHJlZmVyZW5jZSBpbiBwYW5lbFxuICAgICAgdGhpcy4kc2NvcGUuY3RybC5wYW5lbC5zYXZlZENvbXBvc2l0ZXMgPSB0aGlzLm1ldHJpY0NvbXBvc2l0ZXM7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBhZGRNZXRyaWNUb0NvbXBvc2l0ZShjb21wb3NpdGUpIHtcbiAgICAgIGlmIChjb21wb3NpdGUubWVtYmVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvc2l0ZS5tZW1iZXJzID0gW3t9XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvc2l0ZS5tZW1iZXJzLnB1c2goe30pO1xuICAgICAgfVxuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWV0cmljRnJvbUNvbXBvc2l0ZShjb21wb3NpdGUsIG1ldHJpYykge1xuICAgICAgY29tcG9zaXRlLm1lbWJlcnMgPSBfLndpdGhvdXQoY29tcG9zaXRlLm1lbWJlcnMsIG1ldHJpYyk7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBtYXRjaENvbXBvc2l0ZShwYXR0ZXJuKSA6IG51bWJlciB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBsZXQgYUNvbXBvc2l0ZSA9IHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF07XG4gICAgICAgIHZhciByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lKTtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwICYmIGFDb21wb3NpdGUuZW5hYmxlZCkge1xuICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGFwcGx5Q29tcG9zaXRlcyhkYXRhKSB7XG4gICAgICBsZXQgZmlsdGVyZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICAgIGxldCBjbG9uZWRDb21wb3NpdGVzID0gbmV3IEFycmF5PFBvbHlzdGF0TW9kZWw+KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWF0Y2hlZE1ldHJpY3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgICAgICBsZXQgYUNvbXBvc2l0ZSA9IHRoaXMubWV0cmljQ29tcG9zaXRlc1tpXTtcbiAgICAgICAgaWYgKCFhQ29tcG9zaXRlLmVuYWJsZWQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VycmVudFdvcnN0U2VyaWVzID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhQ29tcG9zaXRlLm1lbWJlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgYU1ldHJpYyA9IGFDb21wb3NpdGUubWVtYmVyc1tqXTtcbiAgICAgICAgICAvLyBsb29rIGZvciB0aGUgbWF0Y2hlcyB0byB0aGUgcGF0dGVybiBpbiB0aGUgZGF0YVxuICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgLy8gbWF0Y2ggcmVnZXhcbiAgICAgICAgICAgIC8vIHNlcmllc25hbWUgbWF5IG5vdCBiZSBkZWZpbmVkIHlldCwgc2tpcFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhTWV0cmljLnNlcmllc05hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVnZXggPSBrYm4uc3RyaW5nVG9Kc1JlZ2V4KGFNZXRyaWMuc2VyaWVzTmFtZSk7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlcyA9IGRhdGFbaW5kZXhdLm5hbWUubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGxldCBzZXJpZXNJdGVtID0gZGF0YVtpbmRleF07XG4gICAgICAgICAgICAgIC8vIGtlZXAgaW5kZXggb2YgdGhlIG1hdGNoZWQgbWV0cmljXG4gICAgICAgICAgICAgIG1hdGNoZWRNZXRyaWNzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICAvLyBvbmx5IGhpZGUgaWYgcmVxdWVzdGVkXG4gICAgICAgICAgICAgIGlmIChhQ29tcG9zaXRlLmhpZGVNZW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChhQ29tcG9zaXRlLmNsaWNrVGhyb3VnaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJvY2VzcyB0ZW1wbGF0ZSB2YXJpYWJsZXNcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gdGhpcy50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgICAgIC8vIGFwcGx5IGJvdGggdHlwZXMgb2YgdHJhbnNmb3Jtcywgb25lIHRhcmdldGVkIGF0IHRoZSBkYXRhIGl0ZW0gaW5kZXgsIGFuZCBzZWNvbmRseSB0aGUgbnRoIHZhcmlhbnRcbiAgICAgICAgICAgICAgICB1cmwgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybUNvbXBvc2l0ZShhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWUsIHVybCk7XG4gICAgICAgICAgICAgICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1TaW5nbGVNZXRyaWMoaW5kZXgsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBzZXJpZXNJdGVtLmNsaWNrVGhyb3VnaCA9IHVybDtcbiAgICAgICAgICAgICAgICBzZXJpZXNJdGVtLnNhbml0aXplZFVSTCA9IHRoaXMuJHNhbml0aXplKHVybCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoZWRNZXRyaWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyBkZXRlcm1pbmUgdGhlIG1vc3QgdHJpZ2dlcmVkIHRocmVzaG9sZFxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG1hdGNoZWRNZXRyaWNzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgbGV0IGl0ZW1JbmRleCA9IG1hdGNoZWRNZXRyaWNzW2tdO1xuICAgICAgICAgIGxldCBzZXJpZXNJdGVtID0gZGF0YVtpdGVtSW5kZXhdO1xuICAgICAgICAgIC8vIGNoZWNrIHRocmVzaG9sZHNcbiAgICAgICAgICBpZiAoY3VycmVudFdvcnN0U2VyaWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBzZXJpZXNJdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBnZXRXb3JzdFNlcmllcyhcbiAgICAgICAgICAgICAgY3VycmVudFdvcnN0U2VyaWVzLFxuICAgICAgICAgICAgICBzZXJpZXNJdGVtLFxuICAgICAgICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQcmVmaXggdGhlIHZhbHVlRm9ybWF0dGVkIHdpdGggdGhlIGFjdHVhbCBtZXRyaWMgbmFtZVxuICAgICAgICBpZiAoY3VycmVudFdvcnN0U2VyaWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNsb25lID0gY3VycmVudFdvcnN0U2VyaWVzLnNoYWxsb3dDbG9uZSgpO1xuICAgICAgICAgIGNsb25lLm5hbWUgPSBhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWU7XG4gICAgICAgICAgLy8gdG9vbHRpcC9sZWdlbmQgdXNlcyB0aGlzIHRvIGV4cGFuZCB3aGF0IHZhbHVlcyBhcmUgaW5zaWRlIHRoZSBjb21wb3NpdGVcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbWF0Y2hlZE1ldHJpY3MubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlbUluZGV4ID0gbWF0Y2hlZE1ldHJpY3NbaW5kZXhdO1xuICAgICAgICAgICAgY2xvbmUubWVtYmVycy5wdXNoKGRhdGFbaXRlbUluZGV4XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsb25lLnRocmVzaG9sZExldmVsID0gY3VycmVudFdvcnN0U2VyaWVzLnRocmVzaG9sZExldmVsO1xuICAgICAgICAgIC8vIGN1cnJlbnRXb3JzdFNlcmllcy52YWx1ZUZvcm1hdHRlZCA9IGN1cnJlbnRXb3JzdFNlcmllc05hbWUgKyAnOiAnICsgY3VycmVudFdvcnN0U2VyaWVzLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgICAgIC8vIG5vdyBwdXNoIHRoZSBjb21wb3NpdGUgaW50byBkYXRhXG4gICAgICAgICAgLy8gYWRkIHRoZSBjb21wb3NpdGUgc2V0aW5nIGZvciBzaG93aW5nIHRoZSBuYW1lL3ZhbHVlIHRvIHRoZSBuZXcgY2xvbmVkIG1vZGVsXG4gICAgICAgICAgY2xvbmUuc2hvd05hbWUgPSBhQ29tcG9zaXRlLnNob3dOYW1lO1xuICAgICAgICAgIGNsb25lLnNob3dWYWx1ZSA9IGFDb21wb3NpdGUuc2hvd1ZhbHVlO1xuICAgICAgICAgIGNsb25lLmFuaW1hdGVNb2RlID0gYUNvbXBvc2l0ZS5hbmltYXRlTW9kZTtcbiAgICAgICAgICAvLyBtYXJrIHRoaXMgc2VyaWVzIGFzIGEgY29tcHNpdGVcbiAgICAgICAgICBjbG9uZS5pc0NvbXBvc2l0ZSA9IHRydWU7XG4gICAgICAgICAgY2xvbmVkQ29tcG9zaXRlcy5wdXNoKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gbm93IG1lcmdlIHRoZSBjbG9uZWRDb21wb3NpdGVzIGludG8gZGF0YVxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZGF0YSwgY2xvbmVkQ29tcG9zaXRlcyk7XG4gICAgICAvLyBzb3J0IGJ5IHZhbHVlIGRlc2NlbmRpbmdcbiAgICAgIGZpbHRlcmVkTWV0cmljcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiIC0gYTsgfSk7XG4gICAgICAvLyBub3cgcmVtb3ZlIHRoZSBmaWx0ZXJlZCBtZXRyaWNzIGZyb20gZmluYWwgbGlzdFxuICAgICAgLy8gcmVtb3ZlIGZpbHRlcmVkIG1ldHJpY3MsIHVzZSBzcGxpY2UgaW4gcmV2ZXJzZSBvcmRlclxuICAgICAgZm9yIChsZXQgaSA9IGRhdGEubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlcyhmaWx0ZXJlZE1ldHJpY3MsIGkpKSB7XG4gICAgICAgICAgZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1ldHJpY05hbWVDaGFuZ2VkKGl0ZW0pIHtcbiAgICAgICAgLy8gVE9ETzogdmFsaWRhdGUgaXRlbSBpcyBhIHZhbGlkIHJlZ2V4XG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB0b2dnbGVIaWRlKGNvbXBvc2l0ZSkge1xuICAgICAgY29uc29sZS5sb2coXCJjb21wb3NpdGUgZW5hYmxlZCA9ICBcIiArIGNvbXBvc2l0ZS5lbmFibGVkKTtcbiAgICAgIGNvbXBvc2l0ZS5lbmFibGVkID0gIWNvbXBvc2l0ZS5lbmFibGVkO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxufVxuIl19