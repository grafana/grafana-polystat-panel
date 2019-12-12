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
                    override.newTabEnabled = true;
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
                MetricOverridesManager.prototype.metricNameChanged = function (override) {
                    console.log("metricNameChanged: '" + override.metricName + "'");
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
                                data[index].newTabEnabled = anOverride.newTabEnabled;
                                data[index].sanitizeURLEnabled = anOverride.sanitizeURLEnabled;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQUFBO2dCQWdCQSxDQUFDO2dCQUFELHFCQUFDO1lBQUQsQ0FBQyxBQWhCRCxJQWdCQzs7WUFFRDtnQkFRSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFzQztvQkFBbEYsaUJBa0JDO29CQWpCRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO29CQUU3QixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7b0JBRXZDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDaEUsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMs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LFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFFRCwrQ0FBYyxHQUFkLFVBQWUsUUFBUTtvQkFDckIsUUFBUSxDQUFDLFVBQVUsR0FBRyxnQkFBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFFRCxnREFBZSxHQUFmLFVBQWdCLFFBQVEsRUFBRSxTQUFTO29CQUNqQyxRQUFRLENBQUMsVUFBVSxHQUFHLGdCQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBRUQsOENBQWEsR0FBYixVQUFjLFFBQVEsRUFBRSxPQUFPO29CQUMzQixRQUFRLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLENBQUM7Z0JBRUwsNkJBQUM7WUFBRCxDQUFDLEFBeExELElBd0xDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5pbXBvcnQgeyBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlLCBnZXRWYWx1ZUJ5U3RhdE5hbWUgfSBmcm9tIFwiLi90aHJlc2hvbGRfcHJvY2Vzc29yXCI7XG5pbXBvcnQgeyBSR0JUb0hleCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge0NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyfSBmcm9tIFwiLi9jbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljT3ZlcnJpZGUge1xuICBsYWJlbDogc3RyaW5nO1xuICBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIHRocmVzaG9sZHM6IEFycmF5PGFueT47XG4gIGNvbG9yczogQXJyYXk8c3RyaW5nPjtcbiAgdW5pdEZvcm1hdDogc3RyaW5nO1xuICBkZWNpbWFsczogc3RyaW5nO1xuICBzY2FsZWREZWNpbWFsczogbnVtYmVyO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBvcGVyYXRvck5hbWU6IHN0cmluZzsgLy8gYXZnL21pbi9tYXggZXRjXG4gIHByZWZpeDogc3RyaW5nO1xuICBzdWZmaXg6IHN0cmluZztcbiAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gIG5ld1RhYkVuYWJsZWQ6IGJvb2xlYW47XG4gIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIHtcbiAgICBtZXRyaWNPdmVycmlkZXMgOiBBcnJheSA8IE1ldHJpY092ZXJyaWRlID47XG4gICAgJHNjb3BlOiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgdGVtcGxhdGVTcnY6IGFueTtcbiAgICBzdWdnZXN0TWV0cmljTmFtZXM6IGFueTtcbiAgICBhY3RpdmVPdmVycmlkZUluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIG1ldHJpY092ZXJyaWRlczogQXJyYXk8TWV0cmljT3ZlcnJpZGU+KSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRzYW5pdGl6ZSA9ICRzYW5pdGl6ZTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgICB0aGlzLmFjdGl2ZU92ZXJyaWRlSW5kZXggPSAwO1xuICAgICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IG1ldHJpY092ZXJyaWRlcztcbiAgICAgICAgLy8gdXBncmFkZSBpZiBubyBsYWJlbCBwcmVzZW50XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XS5sYWJlbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID0gXCJPVkVSUklERSBcIiArIChpbmRleCArIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZE1ldHJpY092ZXJyaWRlKCkge1xuICAgICAgICBsZXQgb3ZlcnJpZGUgPSBuZXcgTWV0cmljT3ZlcnJpZGUoKTtcbiAgICAgICAgb3ZlcnJpZGUubGFiZWwgPSBcIk9WRVJSSURFIFwiICsgKHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aCArIDEpO1xuICAgICAgICBvdmVycmlkZS5tZXRyaWNOYW1lID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IFtdO1xuICAgICAgICBvdmVycmlkZS5jb2xvcnMgPSBbXG4gICAgICAgICAgXCIjMjk5YzQ2XCIsIC8vIFwicmdiYSg1MCwgMTcyLCA0NSwgMSlcIiwgLy8gZ3JlZW5cbiAgICAgICAgICBcIiNlNWFjMGVcIiwgLy8gXCJyZ2JhKDIzNywgMTI5LCA0MCwgMSlcIiwgLy8geWVsbG93XG4gICAgICAgICAgXCIjYmYxYjAwXCIsIC8vIFwicmdiYSgyNDUsIDU0LCA1NCwgMSlcIiwgLy8gcmVkXG4gICAgICAgICAgXCIjZmZmZmZmXCIgLy8gd2hpdGVcbiAgICAgICAgXTtcbiAgICAgICAgb3ZlcnJpZGUuZGVjaW1hbHMgPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgb3ZlcnJpZGUudW5pdEZvcm1hdCA9IFwic2hvcnRcIjtcbiAgICAgICAgb3ZlcnJpZGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUub3BlcmF0b3JOYW1lID0gXCJhdmdcIjtcbiAgICAgICAgb3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMgPSBudWxsO1xuICAgICAgICBvdmVycmlkZS5wcmVmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zdWZmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5uZXdUYWJFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgb3ZlcnJpZGUuc2FuaXRpemVVUkxFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXMucHVzaChvdmVycmlkZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWV0cmljT3ZlcnJpZGUob3ZlcnJpZGUpIHtcbiAgICAgIC8vIGxvZGFzaCBfLndpdGhvdXQgY3JlYXRlcyBhIG5ldyBhcnJheSwgbmVlZCB0byByZWFzc2lnbiB0byB0aGUgcGFuZWwgd2hlcmUgaXQgd2lsbCBiZSBzYXZlZFxuICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXMgPSBfLndpdGhvdXQodGhpcy5tZXRyaWNPdmVycmlkZXMsIG92ZXJyaWRlKTtcbiAgICAgIC8vIGZpeCB0aGUgbGFiZWxzXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XS5sYWJlbCA9IFwiT1ZFUlJJREUgXCIgKyAoaW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlYXNzaWduIHJlZmVyZW5jZSBpbiBwYW5lbFxuICAgICAgdGhpcy4kc2NvcGUuY3RybC5wYW5lbC5zYXZlZE92ZXJyaWRlcyA9IHRoaXMubWV0cmljT3ZlcnJpZGVzO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbWV0cmljTmFtZUNoYW5nZWQob3ZlcnJpZGUpIHtcbiAgICAgIC8vIFRPRE86IHZhbGlkYXRlIGl0ZW0gaXMgYSB2YWxpZCByZWdleFxuICAgICAgY29uc29sZS5sb2coXCJtZXRyaWNOYW1lQ2hhbmdlZDogJ1wiICsgb3ZlcnJpZGUubWV0cmljTmFtZSArIFwiJ1wiKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZUhpZGUob3ZlcnJpZGUpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvdmVycmlkZSBlbmFibGVkID0gIFwiICsgb3ZlcnJpZGUuZW5hYmxlZCk7XG4gICAgICBvdmVycmlkZS5lbmFibGVkID0gIW92ZXJyaWRlLmVuYWJsZWQ7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBtYXRjaE92ZXJyaWRlKHBhdHRlcm4pIDogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGFuT3ZlcnJpZGUgPSB0aGlzLm1ldHJpY092ZXJyaWRlc1tpbmRleF07XG4gICAgICAgICAgICB2YXIgcmVnZXggPSBrYm4uc3RyaW5nVG9Kc1JlZ2V4KGFuT3ZlcnJpZGUubWV0cmljTmFtZSk7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwICYmIGFuT3ZlcnJpZGUuZW5hYmxlZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuXG4gICAgYXBwbHlPdmVycmlkZXMoZGF0YSkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBtYXRjaEluZGV4ID0gdGhpcy5tYXRjaE92ZXJyaWRlKGRhdGFbaW5kZXhdLm5hbWUpO1xuICAgICAgICBpZiAobWF0Y2hJbmRleCA+PSAwKSB7XG4gICAgICAgICAgbGV0IGFTZXJpZXMgPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW21hdGNoSW5kZXhdO1xuICAgICAgICAgIC8vIHNldCB0aGUgb3BlcmF0b3JzXG4gICAgICAgICAgYVNlcmllcy5vcGVyYXRvck5hbWUgPSBhbk92ZXJyaWRlLm9wZXJhdG9yTmFtZTtcbiAgICAgICAgICBsZXQgZGF0YVZhbHVlID0gZ2V0VmFsdWVCeVN0YXROYW1lKGFTZXJpZXMub3BlcmF0b3JOYW1lLCBhU2VyaWVzKTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VyaWVzMiBvcGVyYXRvcjogXCIgKyBzZXJpZXMyLm9wZXJhdG9yTmFtZSk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcmllczIgdmFsdWU6IFwiICsgc2VyaWVzMlZhbHVlKTtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZShcbiAgICAgICAgICAgIGFuT3ZlcnJpZGUudGhyZXNob2xkcyxcbiAgICAgICAgICAgIGRhdGFWYWx1ZSxcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucGFuZWwucG9seXN0YXQucG9seWdvbkdsb2JhbEZpbGxDb2xvcik7XG4gICAgICAgICAgLy8gc2V0IHZhbHVlIHRvIHdoYXQgd2FzIHJldHVybmVkXG4gICAgICAgICAgZGF0YVtpbmRleF0udmFsdWUgPSBkYXRhVmFsdWU7XG4gICAgICAgICAgZGF0YVtpbmRleF0uY29sb3IgPSByZXN1bHQuY29sb3I7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFwcGx5T3ZlcnJpZGVzOiB2YWx1ZSA9IFwiICsgZGF0YVtpbmRleF0udmFsdWUgKyBcIiBjb2xvciBcIiArIGRhdGFbaW5kZXhdLmNvbG9yKTtcbiAgICAgICAgICBkYXRhW2luZGV4XS50aHJlc2hvbGRMZXZlbCA9IHJlc3VsdC50aHJlc2hvbGRMZXZlbDtcbiAgICAgICAgICAvLyBmb3JtYXQgaXRcbiAgICAgICAgICB2YXIgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbYW5PdmVycmlkZS51bml0Rm9ybWF0XTtcbiAgICAgICAgICBpZiAoZm9ybWF0RnVuYykge1xuICAgICAgICAgICAgLy8gcHV0IHRoZSB2YWx1ZSBpbiBxdW90ZXMgdG8gZXNjYXBlIFwibW9zdFwiIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAgICAgICAgZGF0YVtpbmRleF0udmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGFbaW5kZXhdLnZhbHVlLCBhbk92ZXJyaWRlLmRlY2ltYWxzLCBhbk92ZXJyaWRlLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCBhbk92ZXJyaWRlLmRlY2ltYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gY29weSB0aGUgdGhyZXNob2xkIGRhdGEgaW50byB0aGUgb2JqZWN0XG4gICAgICAgICAgZGF0YVtpbmRleF0udGhyZXNob2xkcyA9IGFuT3ZlcnJpZGUudGhyZXNob2xkcztcbiAgICAgICAgICBkYXRhW2luZGV4XS5wcmVmaXggPSBhbk92ZXJyaWRlLnByZWZpeDtcbiAgICAgICAgICBkYXRhW2luZGV4XS5zdWZmaXggPSBhbk92ZXJyaWRlLnN1ZmZpeDtcbiAgICAgICAgICAvLyBzZXQgdGhlIHVybCwgcmVwbGFjZSB0ZW1wbGF0ZSB2YXJzXG4gICAgICAgICAgaWYgKChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaCkgJiYgKGFuT3ZlcnJpZGUuY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gdGhpcy50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgLy8gYXBwbHkgYm90aCB0eXBlcyBvZiB0cmFuc2Zvcm1zLCBvbmUgdGFyZ2V0ZWQgYXQgdGhlIGRhdGEgaXRlbSBpbmRleCwgYW5kIHNlY29uZGx5IHRoZSBudGggdmFyaWFudFxuICAgICAgICAgICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1TaW5nbGVNZXRyaWMoaW5kZXgsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICB1cmwgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIGRhdGEpO1xuICAgICAgICAgICAgZGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoID0gdXJsO1xuICAgICAgICAgICAgZGF0YVtpbmRleF0ubmV3VGFiRW5hYmxlZCA9IGFuT3ZlcnJpZGUubmV3VGFiRW5hYmxlZDtcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdLnNhbml0aXplVVJMRW5hYmxlZCA9IGFuT3ZlcnJpZGUuc2FuaXRpemVVUkxFbmFibGVkO1xuICAgICAgICAgICAgaWYgKGFuT3ZlcnJpZGUuc2FuaXRpemVVUkxFbmFibGVkKSB7XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnNhbml0aXplZFVSTCA9IHRoaXMuJHNhbml0aXplKGRhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuXG4gICAgYWRkVGhyZXNob2xkKG92ZXJyaWRlKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzLnB1c2goIHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHN0YXRlOiAwLFxuICAgICAgICBjb2xvcjogXCIjMjk5YzQ2XCIsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc29ydFRocmVzaG9sZHMob3ZlcnJpZGUpO1xuICAgIH1cblxuICAgIC8vIHN0b3JlIHVzZXIgc2VsZWN0aW9uIG9mIGNvbG9yIHRvIGJlIHVzZWQgZm9yIGFsbCBpdGVtcyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHN0YXRlXG4gICAgc2V0VGhyZXNob2xkQ29sb3IodGhyZXNob2xkKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwic2V0VGhyZXNob2xkQ29sb3I6IGNvbG9yIHNldCB0byBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aHJlc2hvbGQuY29sb3IgPSBSR0JUb0hleCh0aHJlc2hvbGQuY29sb3IpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInNldFRocmVzaG9sZENvbG9yOiBwYXJzZWQgY29sb3Igc2V0IHRvIFwiICsgdGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlVGhyZXNob2xkQ29sb3IodGhyZXNob2xkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlZhbGlkYXRlIGNvbG9yIFwiICsgdGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRocmVzaG9sZENvbG9yKG92ZXJyaWRlLCB0aHJlc2hvbGQpIHtcbiAgICAgIC8vIHRocmVzaG9sZC5zdGF0ZSBkZXRlcm1pbmVzIHRoZSBjb2xvciB1c2VkXG4gICAgICAvL2NvbnNvbGUubG9nKFwidGhyZXNob2xkIHN0YXRlID0gXCIgKyB0aHJlc2hvbGQuc3RhdGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm92ZXJyaWRlIGNvbG9yWzBdOiBcIiArIG92ZXJyaWRlLmNvbG9yc1swXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib3ZlcnJpZGUgY29sb3JbMV06IFwiICsgb3ZlcnJpZGUuY29sb3JzWzFdKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvdmVycmlkZSBjb2xvclsyXTogXCIgKyBvdmVycmlkZS5jb2xvcnNbMl0pO1xuICAgICAgdGhyZXNob2xkLmNvbG9yID0gb3ZlcnJpZGUuY29sb3JzW3RocmVzaG9sZC5zdGF0ZV07XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBzb3J0VGhyZXNob2xkcyhvdmVycmlkZSkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IF8ub3JkZXJCeShvdmVycmlkZS50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiYXNjXCJdKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHJlbW92ZVRocmVzaG9sZChvdmVycmlkZSwgdGhyZXNob2xkKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzID0gXy53aXRob3V0KG92ZXJyaWRlLnRocmVzaG9sZHMsIHRocmVzaG9sZCk7XG4gICAgICB0aGlzLnNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICBzZXRVbml0Rm9ybWF0KG92ZXJyaWRlLCBzdWJJdGVtKSB7XG4gICAgICAgIG92ZXJyaWRlLnVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIH1cblxufVxuIl19