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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9BO2dCQUFBO2dCQWVBLENBQUM7Z0JBQUQscUJBQUM7WUFBRCxDQUFDLEFBZkQsSUFlQzs7WUFFRDtnQkFPSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFzQztvQkFBbEYsaUJBaUJDO29CQWhCRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUUvQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7b0JBRXZDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDaEUsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUMvRDtxQkFDRjtnQkFDTCxDQUFDO2dCQUVELGtEQUFp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O2dCQUVELDhDQUFhLEdBQWIsVUFBYyxRQUFRLEVBQUUsT0FBTztvQkFDM0IsUUFBUSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVMLDZCQUFDO1lBQUQsQ0FBQyxBQXpLRCxJQXlLQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IHsgZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZSwgZ2V0VmFsdWVCeVN0YXROYW1lIH0gZnJvbSBcIi4vdGhyZXNob2xkX3Byb2Nlc3NvclwiO1xuaW1wb3J0IHsgUkdCVG9IZXggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgTWV0cmljT3ZlcnJpZGUge1xuICBsYWJlbDogc3RyaW5nO1xuICBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIHRocmVzaG9sZHM6IEFycmF5PGFueT47XG4gIGNvbG9yczogQXJyYXk8c3RyaW5nPjtcbiAgdW5pdEZvcm1hdDogc3RyaW5nO1xuICBkZWNpbWFsczogc3RyaW5nO1xuICBzY2FsZWREZWNpbWFsczogbnVtYmVyO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBvcGVyYXRvck5hbWU6IHN0cmluZzsgLy8gYXZnL21pbi9tYXggZXRjXG4gIHByZWZpeDogc3RyaW5nO1xuICBzdWZmaXg6IHN0cmluZztcbiAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gIHNhbml0aXplVVJMRW5hYmxlZDogYm9vbGVhbjtcbiAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIHtcbiAgICBtZXRyaWNPdmVycmlkZXMgOiBBcnJheSA8IE1ldHJpY092ZXJyaWRlID47XG4gICAgJHNjb3BlOiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgdGVtcGxhdGVTcnY6IGFueTtcbiAgICBzdWdnZXN0TWV0cmljTmFtZXM6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgbWV0cmljT3ZlcnJpZGVzOiBBcnJheTxNZXRyaWNPdmVycmlkZT4pIHtcbiAgICAgICAgdGhpcy4kc2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHRoaXMuJHNhbml0aXplID0gJHNhbml0aXplO1xuICAgICAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgICAgIC8vIHR5cGVhaGVhZCByZXF1aXJlcyB0aGlzIGZvcm1cbiAgICAgICAgdGhpcy5zdWdnZXN0TWV0cmljTmFtZXMgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXy5tYXAodGhpcy4kc2NvcGUuY3RybC5zZXJpZXMsIGZ1bmN0aW9uIChzZXJpZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VyaWVzLmFsaWFzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzID0gbWV0cmljT3ZlcnJpZGVzO1xuICAgICAgICAvLyB1cGdyYWRlIGlmIG5vIGxhYmVsIHByZXNlbnRcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdLmxhYmVsID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlc1tpbmRleF0ubGFiZWwgPSBcIk9WRVJSSURFIFwiICsgKGluZGV4ICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTWV0cmljT3ZlcnJpZGUoKSB7XG4gICAgICAgIGxldCBvdmVycmlkZSA9IG5ldyBNZXRyaWNPdmVycmlkZSgpO1xuICAgICAgICBvdmVycmlkZS5sYWJlbCA9IFwiT1ZFUlJJREUgXCIgKyAodGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoICsgMSk7XG4gICAgICAgIG92ZXJyaWRlLm1ldHJpY05hbWUgPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS50aHJlc2hvbGRzID0gW107XG4gICAgICAgIG92ZXJyaWRlLmNvbG9ycyA9IFtcbiAgICAgICAgICBcIiMyOTljNDZcIiwgLy8gXCJyZ2JhKDUwLCAxNzIsIDQ1LCAxKVwiLCAvLyBncmVlblxuICAgICAgICAgIFwiI2U1YWMwZVwiLCAvLyBcInJnYmEoMjM3LCAxMjksIDQwLCAxKVwiLCAvLyB5ZWxsb3dcbiAgICAgICAgICBcIiNiZjFiMDBcIiwgLy8gXCJyZ2JhKDI0NSwgNTQsIDU0LCAxKVwiLCAvLyByZWRcbiAgICAgICAgICBcIiNmZmZmZmZcIiAvLyB3aGl0ZVxuICAgICAgICBdO1xuICAgICAgICBvdmVycmlkZS5kZWNpbWFscyA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBvdmVycmlkZS51bml0Rm9ybWF0ID0gXCJzaG9ydFwiO1xuICAgICAgICBvdmVycmlkZS5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5vcGVyYXRvck5hbWUgPSBcImF2Z1wiO1xuICAgICAgICBvdmVycmlkZS5zY2FsZWREZWNpbWFscyA9IG51bGw7XG4gICAgICAgIG92ZXJyaWRlLnByZWZpeCA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLnN1ZmZpeCA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLnNhbml0aXplVVJMRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzLnB1c2gob3ZlcnJpZGUpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY092ZXJyaWRlKG92ZXJyaWRlKSB7XG4gICAgICAvLyBsb2Rhc2ggXy53aXRob3V0IGNyZWF0ZXMgYSBuZXcgYXJyYXksIG5lZWQgdG8gcmVhc3NpZ24gdG8gdGhlIHBhbmVsIHdoZXJlIGl0IHdpbGwgYmUgc2F2ZWRcbiAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzID0gXy53aXRob3V0KHRoaXMubWV0cmljT3ZlcnJpZGVzLCBvdmVycmlkZSk7XG4gICAgICAvLyBmaXggdGhlIGxhYmVsc1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlc1tpbmRleF0ubGFiZWwgPSBcIk9WRVJSSURFIFwiICsgKGluZGV4ICsgMSk7XG4gICAgICB9XG4gICAgICAvLyByZWFzc2lnbiByZWZlcmVuY2UgaW4gcGFuZWxcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucGFuZWwuc2F2ZWRPdmVycmlkZXMgPSB0aGlzLm1ldHJpY092ZXJyaWRlcztcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZUhpZGUob3ZlcnJpZGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwib3ZlcnJpZGUgZW5hYmxlZCA9ICBcIiArIG92ZXJyaWRlLmVuYWJsZWQpO1xuICAgICAgb3ZlcnJpZGUuZW5hYmxlZCA9ICFvdmVycmlkZS5lbmFibGVkO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbWF0Y2hPdmVycmlkZShwYXR0ZXJuKSA6IG51bWJlciB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFyIHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhbk92ZXJyaWRlLm1ldHJpY05hbWUpO1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCAmJiBhbk92ZXJyaWRlLmVuYWJsZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cblxuICAgIGFwcGx5T3ZlcnJpZGVzKGRhdGEpIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIGxldCBtYXRjaEluZGV4ID0gdGhpcy5tYXRjaE92ZXJyaWRlKGRhdGFbaW5kZXhdLm5hbWUpO1xuICAgICAgICAgIGlmIChtYXRjaEluZGV4ID49IDApIHtcbiAgICAgICAgICAgIGxldCBhU2VyaWVzID0gZGF0YVtpbmRleF07XG4gICAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbbWF0Y2hJbmRleF07XG4gICAgICAgICAgICAgIC8vIHNldCB0aGUgb3BlcmF0b3JzXG4gICAgICAgICAgICAgIGFTZXJpZXMub3BlcmF0b3JOYW1lID0gYW5PdmVycmlkZS5vcGVyYXRvck5hbWU7XG4gICAgICAgICAgICAgIGxldCBkYXRhVmFsdWUgPSBnZXRWYWx1ZUJ5U3RhdE5hbWUoYVNlcmllcy5vcGVyYXRvck5hbWUsIGFTZXJpZXMpO1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VyaWVzMiBvcGVyYXRvcjogXCIgKyBzZXJpZXMyLm9wZXJhdG9yTmFtZSk7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJpZXMyIHZhbHVlOiBcIiArIHNlcmllczJWYWx1ZSk7XG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKFxuICAgICAgICAgICAgICAgIGFuT3ZlcnJpZGUudGhyZXNob2xkcyxcbiAgICAgICAgICAgICAgICBkYXRhVmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy4kc2NvcGUuY3RybC5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yKTtcbiAgICAgICAgICAgICAgLy8gc2V0IHZhbHVlIHRvIHdoYXQgd2FzIHJldHVybmVkXG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlID0gZGF0YVZhbHVlO1xuICAgICAgICAgICAgICBkYXRhW2luZGV4XS5jb2xvciA9IHJlc3VsdC5jb2xvcjtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFwcGx5T3ZlcnJpZGVzOiB2YWx1ZSA9IFwiICsgZGF0YVtpbmRleF0udmFsdWUgKyBcIiBjb2xvciBcIiArIGRhdGFbaW5kZXhdLmNvbG9yKTtcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0udGhyZXNob2xkTGV2ZWwgPSByZXN1bHQudGhyZXNob2xkTGV2ZWw7XG4gICAgICAgICAgICAgIC8vIGZvcm1hdCBpdFxuICAgICAgICAgICAgICB2YXIgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbYW5PdmVycmlkZS51bml0Rm9ybWF0XTtcbiAgICAgICAgICAgICAgaWYgKGZvcm1hdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgIC8vIHB1dCB0aGUgdmFsdWUgaW4gcXVvdGVzIHRvIGVzY2FwZSBcIm1vc3RcIiBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhW2luZGV4XS52YWx1ZSwgYW5PdmVycmlkZS5kZWNpbWFscywgYW5PdmVycmlkZS5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgYW5PdmVycmlkZS5kZWNpbWFscyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gY29weSB0aGUgdGhyZXNob2xkIGRhdGEgaW50byB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnRocmVzaG9sZHMgPSBhbk92ZXJyaWRlLnRocmVzaG9sZHM7XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnByZWZpeCA9IGFuT3ZlcnJpZGUucHJlZml4O1xuICAgICAgICAgICAgICBkYXRhW2luZGV4XS5zdWZmaXggPSBhbk92ZXJyaWRlLnN1ZmZpeDtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSB1cmwsIHJlcGxhY2UgdGVtcGxhdGUgdmFyc1xuICAgICAgICAgICAgICBpZiAoKGFuT3ZlcnJpZGUuY2xpY2tUaHJvdWdoKSAmJiAoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCA9IHRoaXMudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KGFuT3ZlcnJpZGUuY2xpY2tUaHJvdWdoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChhbk92ZXJyaWRlLnNhbml0aXplVVJMRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnNhbml0aXplZFVSTCA9IHRoaXMuJHNhbml0aXplKGRhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuXG4gICAgYWRkVGhyZXNob2xkKG92ZXJyaWRlKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzLnB1c2goIHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHN0YXRlOiAwLFxuICAgICAgICBjb2xvcjogXCIjMjk5YzQ2XCIsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc29ydFRocmVzaG9sZHMob3ZlcnJpZGUpO1xuICAgIH1cblxuICAgIC8vIHN0b3JlIHVzZXIgc2VsZWN0aW9uIG9mIGNvbG9yIHRvIGJlIHVzZWQgZm9yIGFsbCBpdGVtcyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHN0YXRlXG4gICAgc2V0VGhyZXNob2xkQ29sb3IodGhyZXNob2xkKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwic2V0VGhyZXNob2xkQ29sb3I6IGNvbG9yIHNldCB0byBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aHJlc2hvbGQuY29sb3IgPSBSR0JUb0hleCh0aHJlc2hvbGQuY29sb3IpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInNldFRocmVzaG9sZENvbG9yOiBwYXJzZWQgY29sb3Igc2V0IHRvIFwiICsgdGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlVGhyZXNob2xkQ29sb3IodGhyZXNob2xkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlZhbGlkYXRlIGNvbG9yIFwiICsgdGhyZXNob2xkLmNvbG9yKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRocmVzaG9sZENvbG9yKG92ZXJyaWRlLCB0aHJlc2hvbGQpIHtcbiAgICAgIC8vIHRocmVzaG9sZC5zdGF0ZSBkZXRlcm1pbmVzIHRoZSBjb2xvciB1c2VkXG4gICAgICAvL2NvbnNvbGUubG9nKFwidGhyZXNob2xkIHN0YXRlID0gXCIgKyB0aHJlc2hvbGQuc3RhdGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm92ZXJyaWRlIGNvbG9yWzBdOiBcIiArIG92ZXJyaWRlLmNvbG9yc1swXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib3ZlcnJpZGUgY29sb3JbMV06IFwiICsgb3ZlcnJpZGUuY29sb3JzWzFdKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvdmVycmlkZSBjb2xvclsyXTogXCIgKyBvdmVycmlkZS5jb2xvcnNbMl0pO1xuICAgICAgdGhyZXNob2xkLmNvbG9yID0gb3ZlcnJpZGUuY29sb3JzW3RocmVzaG9sZC5zdGF0ZV07XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBzb3J0VGhyZXNob2xkcyhvdmVycmlkZSkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IF8ub3JkZXJCeShvdmVycmlkZS50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiYXNjXCJdKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHJlbW92ZVRocmVzaG9sZChvdmVycmlkZSwgdGhyZXNob2xkKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzID0gXy53aXRob3V0KG92ZXJyaWRlLnRocmVzaG9sZHMsIHRocmVzaG9sZCk7XG4gICAgICB0aGlzLnNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICBzZXRVbml0Rm9ybWF0KG92ZXJyaWRlLCBzdWJJdGVtKSB7XG4gICAgICAgIG92ZXJyaWRlLnVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIH1cblxufVxuIl19