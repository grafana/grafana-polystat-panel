System.register(["lodash", "app/core/utils/kbn", "./threshold_processor", "./utils"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, utils_1, MetricOverride, MetricOverridesManager;
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
                    console.log("override enabled =  " + override.enabled);
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
                                data[index].clickThrough = this.templateSrv.replaceWithText(anOverride.clickThrough);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9BO2dCQUFBO2dCQWVBLENBQUM7Z0JBQUQscUJBQUM7WUFBRCxDQUFDLEFBZkQsSUFlQzs7WUFFRDtnQkFRSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFzQztvQkFBbEYsaUJBa0JDO29CQWpCRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO29CQUU3QixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7b0JBRXZDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDaEUsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxD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QUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUVELDhDQUFhLEdBQWIsVUFBYyxRQUFRLEVBQUUsT0FBTztvQkFDM0IsUUFBUSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVMLDZCQUFDO1lBQUQsQ0FBQyxBQTNLRCxJQTJLQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IHsgZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZSwgZ2V0VmFsdWVCeVN0YXROYW1lIH0gZnJvbSBcIi4vdGhyZXNob2xkX3Byb2Nlc3NvclwiO1xuaW1wb3J0IHsgUkdCVG9IZXggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljT3ZlcnJpZGUge1xuICBsYWJlbDogc3RyaW5nO1xuICBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIHRocmVzaG9sZHM6IEFycmF5PGFueT47XG4gIGNvbG9yczogQXJyYXk8c3RyaW5nPjtcbiAgdW5pdEZvcm1hdDogc3RyaW5nO1xuICBkZWNpbWFsczogc3RyaW5nO1xuICBzY2FsZWREZWNpbWFsczogbnVtYmVyO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBvcGVyYXRvck5hbWU6IHN0cmluZzsgLy8gYXZnL21pbi9tYXggZXRjXG4gIHByZWZpeDogc3RyaW5nO1xuICBzdWZmaXg6IHN0cmluZztcbiAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIHtcbiAgICBtZXRyaWNPdmVycmlkZXMgOiBBcnJheSA8IE1ldHJpY092ZXJyaWRlID47XG4gICAgJHNjb3BlOiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgdGVtcGxhdGVTcnY6IGFueTtcbiAgICBzdWdnZXN0TWV0cmljTmFtZXM6IGFueTtcbiAgICBhY3RpdmVPdmVycmlkZUluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIG1ldHJpY092ZXJyaWRlczogQXJyYXk8TWV0cmljT3ZlcnJpZGU+KSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRzYW5pdGl6ZSA9ICRzYW5pdGl6ZTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgICB0aGlzLmFjdGl2ZU92ZXJyaWRlSW5kZXggPSAwO1xuICAgICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IG1ldHJpY092ZXJyaWRlcztcbiAgICAgICAgLy8gdXBncmFkZSBpZiBubyBsYWJlbCBwcmVzZW50XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XS5sYWJlbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID0gXCJPVkVSUklERSBcIiArIChpbmRleCArIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZE1ldHJpY092ZXJyaWRlKCkge1xuICAgICAgICBsZXQgb3ZlcnJpZGUgPSBuZXcgTWV0cmljT3ZlcnJpZGUoKTtcbiAgICAgICAgb3ZlcnJpZGUubGFiZWwgPSBcIk9WRVJSSURFIFwiICsgKHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aCArIDEpO1xuICAgICAgICBvdmVycmlkZS5tZXRyaWNOYW1lID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IFtdO1xuICAgICAgICBvdmVycmlkZS5jb2xvcnMgPSBbXG4gICAgICAgICAgXCIjMjk5YzQ2XCIsIC8vIFwicmdiYSg1MCwgMTcyLCA0NSwgMSlcIiwgLy8gZ3JlZW5cbiAgICAgICAgICBcIiNlNWFjMGVcIiwgLy8gXCJyZ2JhKDIzNywgMTI5LCA0MCwgMSlcIiwgLy8geWVsbG93XG4gICAgICAgICAgXCIjYmYxYjAwXCIsIC8vIFwicmdiYSgyNDUsIDU0LCA1NCwgMSlcIiwgLy8gcmVkXG4gICAgICAgICAgXCIjZmZmZmZmXCIgLy8gd2hpdGVcbiAgICAgICAgXTtcbiAgICAgICAgb3ZlcnJpZGUuZGVjaW1hbHMgPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgb3ZlcnJpZGUudW5pdEZvcm1hdCA9IFwic2hvcnRcIjtcbiAgICAgICAgb3ZlcnJpZGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUub3BlcmF0b3JOYW1lID0gXCJhdmdcIjtcbiAgICAgICAgb3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMgPSBudWxsO1xuICAgICAgICBvdmVycmlkZS5wcmVmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zdWZmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcy5wdXNoKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNPdmVycmlkZShvdmVycmlkZSkge1xuICAgICAgLy8gbG9kYXNoIF8ud2l0aG91dCBjcmVhdGVzIGEgbmV3IGFycmF5LCBuZWVkIHRvIHJlYXNzaWduIHRvIHRoZSBwYW5lbCB3aGVyZSBpdCB3aWxsIGJlIHNhdmVkXG4gICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY092ZXJyaWRlcywgb3ZlcnJpZGUpO1xuICAgICAgLy8gZml4IHRoZSBsYWJlbHNcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID0gXCJPVkVSUklERSBcIiArIChpbmRleCArIDEpO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gcmVmZXJlbmNlIGluIHBhbmVsXG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnNhdmVkT3ZlcnJpZGVzID0gdGhpcy5tZXRyaWNPdmVycmlkZXM7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB0b2dnbGVIaWRlKG92ZXJyaWRlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm92ZXJyaWRlIGVuYWJsZWQgPSAgXCIgKyBvdmVycmlkZS5lbmFibGVkKTtcbiAgICAgIG92ZXJyaWRlLmVuYWJsZWQgPSAhb3ZlcnJpZGUuZW5hYmxlZDtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIG1hdGNoT3ZlcnJpZGUocGF0dGVybikgOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XTtcbiAgICAgICAgICAgIHZhciByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYW5PdmVycmlkZS5tZXRyaWNOYW1lKTtcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gcGF0dGVybi5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDAgJiYgYW5PdmVycmlkZS5lbmFibGVkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG5cbiAgICBhcHBseU92ZXJyaWRlcyhkYXRhKSB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBsZXQgbWF0Y2hJbmRleCA9IHRoaXMubWF0Y2hPdmVycmlkZShkYXRhW2luZGV4XS5uYW1lKTtcbiAgICAgICAgICBpZiAobWF0Y2hJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICBsZXQgYVNlcmllcyA9IGRhdGFbaW5kZXhdO1xuICAgICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW21hdGNoSW5kZXhdO1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIG9wZXJhdG9yc1xuICAgICAgICAgICAgICBhU2VyaWVzLm9wZXJhdG9yTmFtZSA9IGFuT3ZlcnJpZGUub3BlcmF0b3JOYW1lO1xuICAgICAgICAgICAgICBsZXQgZGF0YVZhbHVlID0gZ2V0VmFsdWVCeVN0YXROYW1lKGFTZXJpZXMub3BlcmF0b3JOYW1lLCBhU2VyaWVzKTtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcmllczIgb3BlcmF0b3I6IFwiICsgc2VyaWVzMi5vcGVyYXRvck5hbWUpO1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VyaWVzMiB2YWx1ZTogXCIgKyBzZXJpZXMyVmFsdWUpO1xuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZShcbiAgICAgICAgICAgICAgICBhbk92ZXJyaWRlLnRocmVzaG9sZHMsXG4gICAgICAgICAgICAgICAgZGF0YVZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucGFuZWwucG9seXN0YXQucG9seWdvbkdsb2JhbEZpbGxDb2xvcik7XG4gICAgICAgICAgICAgIC8vIHNldCB2YWx1ZSB0byB3aGF0IHdhcyByZXR1cm5lZFxuICAgICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZSA9IGRhdGFWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0uY29sb3IgPSByZXN1bHQuY29sb3I7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhcHBseU92ZXJyaWRlczogdmFsdWUgPSBcIiArIGRhdGFbaW5kZXhdLnZhbHVlICsgXCIgY29sb3IgXCIgKyBkYXRhW2luZGV4XS5jb2xvcik7XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnRocmVzaG9sZExldmVsID0gcmVzdWx0LnRocmVzaG9sZExldmVsO1xuICAgICAgICAgICAgICAvLyBmb3JtYXQgaXRcbiAgICAgICAgICAgICAgdmFyIGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW2FuT3ZlcnJpZGUudW5pdEZvcm1hdF07XG4gICAgICAgICAgICAgIGlmIChmb3JtYXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAvLyBwdXQgdGhlIHZhbHVlIGluIHF1b3RlcyB0byBlc2NhcGUgXCJtb3N0XCIgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YVtpbmRleF0udmFsdWUsIGFuT3ZlcnJpZGUuZGVjaW1hbHMsIGFuT3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0udmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YVtpbmRleF0udmFsdWUsIGFuT3ZlcnJpZGUuZGVjaW1hbHMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHRocmVzaG9sZCBkYXRhIGludG8gdGhlIG9iamVjdFxuICAgICAgICAgICAgICBkYXRhW2luZGV4XS50aHJlc2hvbGRzID0gYW5PdmVycmlkZS50aHJlc2hvbGRzO1xuICAgICAgICAgICAgICBkYXRhW2luZGV4XS5wcmVmaXggPSBhbk92ZXJyaWRlLnByZWZpeDtcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0uc3VmZml4ID0gYW5PdmVycmlkZS5zdWZmaXg7XG4gICAgICAgICAgICAgIC8vIHNldCB0aGUgdXJsLCByZXBsYWNlIHRlbXBsYXRlIHZhcnNcbiAgICAgICAgICAgICAgaWYgKChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaCkgJiYgKGFuT3ZlcnJpZGUuY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS5jbGlja1Rocm91Z2ggPSB0aGlzLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgICAgICBpZiAoYW5PdmVycmlkZS5zYW5pdGl6ZVVSTEVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS5zYW5pdGl6ZWRVUkwgPSB0aGlzLiRzYW5pdGl6ZShkYXRhW2luZGV4XS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICB9XG5cblxuICAgIGFkZFRocmVzaG9sZChvdmVycmlkZSkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcy5wdXNoKCB7XG4gICAgICAgIHZhbHVlOiAwLFxuICAgICAgICBzdGF0ZTogMCxcbiAgICAgICAgY29sb3I6IFwiIzI5OWM0NlwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZSB1c2VyIHNlbGVjdGlvbiBvZiBjb2xvciB0byBiZSB1c2VkIGZvciBhbGwgaXRlbXMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBzdGF0ZVxuICAgIHNldFRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcInNldFRocmVzaG9sZENvbG9yOiBjb2xvciBzZXQgdG8gXCIgKyB0aHJlc2hvbGQuY29sb3IpO1xuICAgICAgdGhyZXNob2xkLmNvbG9yID0gUkdCVG9IZXgodGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJzZXRUaHJlc2hvbGRDb2xvcjogcGFyc2VkIGNvbG9yIHNldCB0byBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZVRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgY29uc29sZS5sb2coXCJWYWxpZGF0ZSBjb2xvciBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaHJlc2hvbGRDb2xvcihvdmVycmlkZSwgdGhyZXNob2xkKSB7XG4gICAgICAvLyB0aHJlc2hvbGQuc3RhdGUgZGV0ZXJtaW5lcyB0aGUgY29sb3IgdXNlZFxuICAgICAgLy9jb25zb2xlLmxvZyhcInRocmVzaG9sZCBzdGF0ZSA9IFwiICsgdGhyZXNob2xkLnN0YXRlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvdmVycmlkZSBjb2xvclswXTogXCIgKyBvdmVycmlkZS5jb2xvcnNbMF0pO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm92ZXJyaWRlIGNvbG9yWzFdOiBcIiArIG92ZXJyaWRlLmNvbG9yc1sxXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib3ZlcnJpZGUgY29sb3JbMl06IFwiICsgb3ZlcnJpZGUuY29sb3JzWzJdKTtcbiAgICAgIHRocmVzaG9sZC5jb2xvciA9IG92ZXJyaWRlLmNvbG9yc1t0aHJlc2hvbGQuc3RhdGVdO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgc29ydFRocmVzaG9sZHMob3ZlcnJpZGUpIHtcbiAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMgPSBfLm9yZGVyQnkob3ZlcnJpZGUudGhyZXNob2xkcywgW1widmFsdWVcIl0sIFtcImFzY1wiXSk7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICByZW1vdmVUaHJlc2hvbGQob3ZlcnJpZGUsIHRocmVzaG9sZCkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IF8ud2l0aG91dChvdmVycmlkZS50aHJlc2hvbGRzLCB0aHJlc2hvbGQpO1xuICAgICAgdGhpcy5zb3J0VGhyZXNob2xkcyhvdmVycmlkZSk7XG4gICAgfVxuXG4gICAgc2V0VW5pdEZvcm1hdChvdmVycmlkZSwgc3ViSXRlbSkge1xuICAgICAgICBvdmVycmlkZS51bml0Rm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICB9XG5cbn1cbiJdfQ==