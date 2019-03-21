System.register(["lodash", "app/core/utils/kbn", "./threshold_processor", "./utils", "./clickThroughTransformer"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, utils_1, clickThroughTransformer_1, MetricOverride, MetricOverridesManager;
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
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (clickThroughTransformer_1_1) {
                clickThroughTransformer_1 = clickThroughTransformer_1_1;
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
                function MetricOverridesManager($scope, templateSrv, $sanitize, metricOverrides) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$sanitize = $sanitize;
                    this.templateSrv = templateSrv;
                    this.activeOverrideIndex = 0;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricOverrides = metricOverrides;
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        if (typeof this.metricOverrides[index].label === "undefined") {
                            this.metricOverrides[index].label = "OVERRIDE " + (index + 1);
                        }
                    }
                }
                MetricOverridesManager.prototype.addMetricOverride = function () {
                    var override = new MetricOverride();
                    override.label = "OVERRIDE " + (this.metricOverrides.length + 1);
                    override.metricName = "";
                    override.thresholds = [];
                    override.colors = [
                        "#299c46",
                        "#e5ac0e",
                        "#bf1b00",
                        "#ffffff"
                    ];
                    override.decimals = "";
                    override.enabled = true;
                    override.unitFormat = "short";
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
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        this.metricOverrides[index].label = "OVERRIDE " + (index + 1);
                    }
                    this.$scope.ctrl.panel.savedOverrides = this.metricOverrides;
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.toggleHide = function (override) {
                    override.enabled = !override.enabled;
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.matchOverride = function (pattern) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        var regex = kbn_1.default.stringToJsRegex(anOverride.metricName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0 && anOverride.enabled) {
                            return index;
                        }
                    }
                    return -1;
                };
                MetricOverridesManager.prototype.applyOverrides = function (data) {
                    for (var index = 0; index < data.length; index++) {
                        var matchIndex = this.matchOverride(data[index].name);
                        if (matchIndex >= 0) {
                            var aSeries = data[index];
                            var anOverride = this.metricOverrides[matchIndex];
                            aSeries.operatorName = anOverride.operatorName;
                            var dataValue = threshold_processor_1.getValueByStatName(aSeries.operatorName, aSeries);
                            var result = threshold_processor_1.getThresholdLevelForValue(anOverride.thresholds, dataValue, this.$scope.ctrl.panel.polystat.polygonGlobalFillColor);
                            data[index].value = dataValue;
                            data[index].color = result.color;
                            data[index].thresholdLevel = result.thresholdLevel;
                            var formatFunc = kbn_1.default.valueFormats[anOverride.unitFormat];
                            if (formatFunc) {
                                data[index].valueFormatted = formatFunc(data[index].value, anOverride.decimals, anOverride.scaledDecimals);
                                data[index].valueRounded = kbn_1.default.roundValue(data[index].value, anOverride.decimals);
                            }
                            data[index].thresholds = anOverride.thresholds;
                            data[index].prefix = anOverride.prefix;
                            data[index].suffix = anOverride.suffix;
                            if ((anOverride.clickThrough) && (anOverride.clickThrough.length > 0)) {
                                var url = this.templateSrv.replaceWithText(anOverride.clickThrough);
                                url = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(index, url, data);
                                url = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, data);
                                data[index].clickThrough = url;
                                if (anOverride.sanitizeURLEnabled) {
                                    data[index].sanitizedURL = this.$sanitize(data[index].clickThrough);
                                }
                            }
                        }
                    }
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
                    threshold.color = utils_1.RGBToHex(threshold.color);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.validateThresholdColor = function (threshold) {
                    console.log("Validate color " + threshold.color);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.updateThresholdColor = function (override, threshold) {
                    threshold.color = override.colors[threshold.state];
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.sortThresholds = function (override) {
                    override.thresholds = lodash_1.default.orderBy(override.thresholds, ["value"], ["asc"]);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.removeThreshold = function (override, threshold) {
                    override.thresholds = lodash_1.default.without(override.thresholds, threshold);
                    this.sortThresholds(override);
                };
                MetricOverridesManager.prototype.setUnitFormat = function (override, subItem) {
                    override.unitFormat = subItem.value;
                };
                return MetricOverridesManager;
            }());
            exports_1("MetricOverridesManager", MetricOverridesManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQUFBO2dCQWVBLENBQUM7Z0JBQUQscUJBQUM7WUFBRCxDQUFDLEFBZkQsSUFlQzs7WUFFRDtnQkFRSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFzQztvQkFBbEYsaUJBa0JDO29CQWpCRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO29CQUU3QixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7b0JBRXZDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDaEUsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FB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LFFBQVEsRUFBRSxTQUFTO29CQUNqQyxRQUFRLENBQUMsVUFBVSxHQUFHLGdCQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBRUQsOENBQWEsR0FBYixVQUFjLFFBQVEsRUFBRSxPQUFPO29CQUMzQixRQUFRLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLENBQUM7Z0JBRUwsNkJBQUM7WUFBRCxDQUFDLEFBL0tELElBK0tDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5pbXBvcnQgeyBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlLCBnZXRWYWx1ZUJ5U3RhdE5hbWUgfSBmcm9tIFwiLi90aHJlc2hvbGRfcHJvY2Vzc29yXCI7XG5pbXBvcnQgeyBSR0JUb0hleCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge0NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyfSBmcm9tIFwiLi9jbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljT3ZlcnJpZGUge1xuICBsYWJlbDogc3RyaW5nO1xuICBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIHRocmVzaG9sZHM6IEFycmF5PGFueT47XG4gIGNvbG9yczogQXJyYXk8c3RyaW5nPjtcbiAgdW5pdEZvcm1hdDogc3RyaW5nO1xuICBkZWNpbWFsczogc3RyaW5nO1xuICBzY2FsZWREZWNpbWFsczogbnVtYmVyO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBvcGVyYXRvck5hbWU6IHN0cmluZzsgLy8gYXZnL21pbi9tYXggZXRjXG4gIHByZWZpeDogc3RyaW5nO1xuICBzdWZmaXg6IHN0cmluZztcbiAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIHtcbiAgICBtZXRyaWNPdmVycmlkZXMgOiBBcnJheSA8IE1ldHJpY092ZXJyaWRlID47XG4gICAgJHNjb3BlOiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgdGVtcGxhdGVTcnY6IGFueTtcbiAgICBzdWdnZXN0TWV0cmljTmFtZXM6IGFueTtcbiAgICBhY3RpdmVPdmVycmlkZUluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIG1ldHJpY092ZXJyaWRlczogQXJyYXk8TWV0cmljT3ZlcnJpZGU+KSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRzYW5pdGl6ZSA9ICRzYW5pdGl6ZTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgICB0aGlzLmFjdGl2ZU92ZXJyaWRlSW5kZXggPSAwO1xuICAgICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IG1ldHJpY092ZXJyaWRlcztcbiAgICAgICAgLy8gdXBncmFkZSBpZiBubyBsYWJlbCBwcmVzZW50XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XS5sYWJlbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID0gXCJPVkVSUklERSBcIiArIChpbmRleCArIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZE1ldHJpY092ZXJyaWRlKCkge1xuICAgICAgICBsZXQgb3ZlcnJpZGUgPSBuZXcgTWV0cmljT3ZlcnJpZGUoKTtcbiAgICAgICAgb3ZlcnJpZGUubGFiZWwgPSBcIk9WRVJSSURFIFwiICsgKHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aCArIDEpO1xuICAgICAgICBvdmVycmlkZS5tZXRyaWNOYW1lID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IFtdO1xuICAgICAgICBvdmVycmlkZS5jb2xvcnMgPSBbXG4gICAgICAgICAgXCIjMjk5YzQ2XCIsIC8vIFwicmdiYSg1MCwgMTcyLCA0NSwgMSlcIiwgLy8gZ3JlZW5cbiAgICAgICAgICBcIiNlNWFjMGVcIiwgLy8gXCJyZ2JhKDIzNywgMTI5LCA0MCwgMSlcIiwgLy8geWVsbG93XG4gICAgICAgICAgXCIjYmYxYjAwXCIsIC8vIFwicmdiYSgyNDUsIDU0LCA1NCwgMSlcIiwgLy8gcmVkXG4gICAgICAgICAgXCIjZmZmZmZmXCIgLy8gd2hpdGVcbiAgICAgICAgXTtcbiAgICAgICAgb3ZlcnJpZGUuZGVjaW1hbHMgPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgb3ZlcnJpZGUudW5pdEZvcm1hdCA9IFwic2hvcnRcIjtcbiAgICAgICAgb3ZlcnJpZGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUub3BlcmF0b3JOYW1lID0gXCJhdmdcIjtcbiAgICAgICAgb3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMgPSBudWxsO1xuICAgICAgICBvdmVycmlkZS5wcmVmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zdWZmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcy5wdXNoKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNPdmVycmlkZShvdmVycmlkZSkge1xuICAgICAgLy8gbG9kYXNoIF8ud2l0aG91dCBjcmVhdGVzIGEgbmV3IGFycmF5LCBuZWVkIHRvIHJlYXNzaWduIHRvIHRoZSBwYW5lbCB3aGVyZSBpdCB3aWxsIGJlIHNhdmVkXG4gICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY092ZXJyaWRlcywgb3ZlcnJpZGUpO1xuICAgICAgLy8gZml4IHRoZSBsYWJlbHNcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID0gXCJPVkVSUklERSBcIiArIChpbmRleCArIDEpO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gcmVmZXJlbmNlIGluIHBhbmVsXG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnNhdmVkT3ZlcnJpZGVzID0gdGhpcy5tZXRyaWNPdmVycmlkZXM7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB0b2dnbGVIaWRlKG92ZXJyaWRlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib3ZlcnJpZGUgZW5hYmxlZCA9ICBcIiArIG92ZXJyaWRlLmVuYWJsZWQpO1xuICAgICAgb3ZlcnJpZGUuZW5hYmxlZCA9ICFvdmVycmlkZS5lbmFibGVkO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbWF0Y2hPdmVycmlkZShwYXR0ZXJuKSA6IG51bWJlciB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFyIHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhbk92ZXJyaWRlLm1ldHJpY05hbWUpO1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCAmJiBhbk92ZXJyaWRlLmVuYWJsZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cblxuICAgIGFwcGx5T3ZlcnJpZGVzKGRhdGEpIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBsZXQgbWF0Y2hJbmRleCA9IHRoaXMubWF0Y2hPdmVycmlkZShkYXRhW2luZGV4XS5uYW1lKTtcbiAgICAgICAgaWYgKG1hdGNoSW5kZXggPj0gMCkge1xuICAgICAgICAgIGxldCBhU2VyaWVzID0gZGF0YVtpbmRleF07XG4gICAgICAgICAgbGV0IGFuT3ZlcnJpZGUgPSB0aGlzLm1ldHJpY092ZXJyaWRlc1ttYXRjaEluZGV4XTtcbiAgICAgICAgICAvLyBzZXQgdGhlIG9wZXJhdG9yc1xuICAgICAgICAgIGFTZXJpZXMub3BlcmF0b3JOYW1lID0gYW5PdmVycmlkZS5vcGVyYXRvck5hbWU7XG4gICAgICAgICAgbGV0IGRhdGFWYWx1ZSA9IGdldFZhbHVlQnlTdGF0TmFtZShhU2VyaWVzLm9wZXJhdG9yTmFtZSwgYVNlcmllcyk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcmllczIgb3BlcmF0b3I6IFwiICsgc2VyaWVzMi5vcGVyYXRvck5hbWUpO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJpZXMyIHZhbHVlOiBcIiArIHNlcmllczJWYWx1ZSk7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUoXG4gICAgICAgICAgICBhbk92ZXJyaWRlLnRocmVzaG9sZHMsXG4gICAgICAgICAgICBkYXRhVmFsdWUsXG4gICAgICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IpO1xuICAgICAgICAgIC8vIHNldCB2YWx1ZSB0byB3aGF0IHdhcyByZXR1cm5lZFxuICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlID0gZGF0YVZhbHVlO1xuICAgICAgICAgIGRhdGFbaW5kZXhdLmNvbG9yID0gcmVzdWx0LmNvbG9yO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhcHBseU92ZXJyaWRlczogdmFsdWUgPSBcIiArIGRhdGFbaW5kZXhdLnZhbHVlICsgXCIgY29sb3IgXCIgKyBkYXRhW2luZGV4XS5jb2xvcik7XG4gICAgICAgICAgZGF0YVtpbmRleF0udGhyZXNob2xkTGV2ZWwgPSByZXN1bHQudGhyZXNob2xkTGV2ZWw7XG4gICAgICAgICAgLy8gZm9ybWF0IGl0XG4gICAgICAgICAgdmFyIGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW2FuT3ZlcnJpZGUudW5pdEZvcm1hdF07XG4gICAgICAgICAgaWYgKGZvcm1hdEZ1bmMpIHtcbiAgICAgICAgICAgIC8vIHB1dCB0aGUgdmFsdWUgaW4gcXVvdGVzIHRvIGVzY2FwZSBcIm1vc3RcIiBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhW2luZGV4XS52YWx1ZSwgYW5PdmVycmlkZS5kZWNpbWFscywgYW5PdmVycmlkZS5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgYW5PdmVycmlkZS5kZWNpbWFscyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGNvcHkgdGhlIHRocmVzaG9sZCBkYXRhIGludG8gdGhlIG9iamVjdFxuICAgICAgICAgIGRhdGFbaW5kZXhdLnRocmVzaG9sZHMgPSBhbk92ZXJyaWRlLnRocmVzaG9sZHM7XG4gICAgICAgICAgZGF0YVtpbmRleF0ucHJlZml4ID0gYW5PdmVycmlkZS5wcmVmaXg7XG4gICAgICAgICAgZGF0YVtpbmRleF0uc3VmZml4ID0gYW5PdmVycmlkZS5zdWZmaXg7XG4gICAgICAgICAgLy8gc2V0IHRoZSB1cmwsIHJlcGxhY2UgdGVtcGxhdGUgdmFyc1xuICAgICAgICAgIGlmICgoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gpICYmIChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaC5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KGFuT3ZlcnJpZGUuY2xpY2tUaHJvdWdoKTtcbiAgICAgICAgICAgIC8vIGFwcGx5IGJvdGggdHlwZXMgb2YgdHJhbnNmb3Jtcywgb25lIHRhcmdldGVkIGF0IHRoZSBkYXRhIGl0ZW0gaW5kZXgsIGFuZCBzZWNvbmRseSB0aGUgbnRoIHZhcmlhbnRcbiAgICAgICAgICAgIHVybCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtU2luZ2xlTWV0cmljKGluZGV4LCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCA9IHVybDtcbiAgICAgICAgICAgIGlmIChhbk92ZXJyaWRlLnNhbml0aXplVVJMRW5hYmxlZCkge1xuICAgICAgICAgICAgICBkYXRhW2luZGV4XS5zYW5pdGl6ZWRVUkwgPSB0aGlzLiRzYW5pdGl6ZShkYXRhW2luZGV4XS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICB9XG5cblxuICAgIGFkZFRocmVzaG9sZChvdmVycmlkZSkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcy5wdXNoKCB7XG4gICAgICAgIHZhbHVlOiAwLFxuICAgICAgICBzdGF0ZTogMCxcbiAgICAgICAgY29sb3I6IFwiIzI5OWM0NlwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZSB1c2VyIHNlbGVjdGlvbiBvZiBjb2xvciB0byBiZSB1c2VkIGZvciBhbGwgaXRlbXMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBzdGF0ZVxuICAgIHNldFRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcInNldFRocmVzaG9sZENvbG9yOiBjb2xvciBzZXQgdG8gXCIgKyB0aHJlc2hvbGQuY29sb3IpO1xuICAgICAgdGhyZXNob2xkLmNvbG9yID0gUkdCVG9IZXgodGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJzZXRUaHJlc2hvbGRDb2xvcjogcGFyc2VkIGNvbG9yIHNldCB0byBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZVRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgY29uc29sZS5sb2coXCJWYWxpZGF0ZSBjb2xvciBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaHJlc2hvbGRDb2xvcihvdmVycmlkZSwgdGhyZXNob2xkKSB7XG4gICAgICAvLyB0aHJlc2hvbGQuc3RhdGUgZGV0ZXJtaW5lcyB0aGUgY29sb3IgdXNlZFxuICAgICAgLy9jb25zb2xlLmxvZyhcInRocmVzaG9sZCBzdGF0ZSA9IFwiICsgdGhyZXNob2xkLnN0YXRlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvdmVycmlkZSBjb2xvclswXTogXCIgKyBvdmVycmlkZS5jb2xvcnNbMF0pO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm92ZXJyaWRlIGNvbG9yWzFdOiBcIiArIG92ZXJyaWRlLmNvbG9yc1sxXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib3ZlcnJpZGUgY29sb3JbMl06IFwiICsgb3ZlcnJpZGUuY29sb3JzWzJdKTtcbiAgICAgIHRocmVzaG9sZC5jb2xvciA9IG92ZXJyaWRlLmNvbG9yc1t0aHJlc2hvbGQuc3RhdGVdO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgc29ydFRocmVzaG9sZHMob3ZlcnJpZGUpIHtcbiAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMgPSBfLm9yZGVyQnkob3ZlcnJpZGUudGhyZXNob2xkcywgW1widmFsdWVcIl0sIFtcImFzY1wiXSk7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICByZW1vdmVUaHJlc2hvbGQob3ZlcnJpZGUsIHRocmVzaG9sZCkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IF8ud2l0aG91dChvdmVycmlkZS50aHJlc2hvbGRzLCB0aHJlc2hvbGQpO1xuICAgICAgdGhpcy5zb3J0VGhyZXNob2xkcyhvdmVycmlkZSk7XG4gICAgfVxuXG4gICAgc2V0VW5pdEZvcm1hdChvdmVycmlkZSwgc3ViSXRlbSkge1xuICAgICAgICBvdmVycmlkZS51bml0Rm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICB9XG5cbn1cbiJdfQ==