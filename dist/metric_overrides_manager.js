System.register(["lodash", "app/core/utils/kbn", "./threshold_processor"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, MetricOverride, MetricOverridesManager;
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
            MetricOverride = (function () {
                function MetricOverride() {
                }
                return MetricOverride;
            }());
            exports_1("MetricOverride", MetricOverride);
            MetricOverridesManager = (function () {
                function MetricOverridesManager($scope, templateSrv, $sanitize, savedOverrides) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$sanitize = $sanitize;
                    this.templateSrv = templateSrv;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricOverrides = savedOverrides;
                }
                MetricOverridesManager.prototype.addMetricOverride = function () {
                    var override = new MetricOverride();
                    override.metricName = "";
                    override.thresholds = [];
                    override.colors = ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"];
                    override.decimals = "";
                    override.enabled = true;
                    override.unitFormat = "";
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
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.matchOverride = function (pattern) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        var regex = kbn_1.default.stringToJsRegex(anOverride.metricName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0) {
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
                            var result = threshold_processor_1.getThresholdLevelForValue(anOverride.thresholds, dataValue);
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
                    console.log("Threshold color set to " + threshold.color);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.validateThresholdColor = function (threshold) {
                    console.log("Validate color " + threshold.color);
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
                MetricOverridesManager.prototype.invertColorOrder = function (override) {
                    override.colors.reverse();
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.setUnitFormat = function (override, subItem) {
                    override.unitFormat = subItem.value;
                };
                MetricOverridesManager.prototype.moveMetricOverrideUp = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index > 0) {
                                this.arraymove(this.metricOverrides, index, index - 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.moveMetricOverrideDown = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index < this.metricOverrides.length) {
                                this.arraymove(this.metricOverrides, index, index + 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.arraymove = function (arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                };
                return MetricOverridesManager;
            }());
            exports_1("MetricOverridesManager", MetricOverridesManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUFBO2dCQWNBLENBQUM7Z0JBQUQscUJBQUM7WUFBRCxDQUFDLEFBZEQsSUFjQzs7WUFFRDtnQkFPSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjO29CQUExRCxpQkFXQztvQkFWRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUUvQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7Z0JBQzFDLENBQUM7Z0JBRUQsa0RBQWlCLEdBQWpCO29CQUNJLElBQUksUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7b0JBQ3BDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUN6QixRQUFRLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFDekIsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLHdCQUF3QixFQUFFLDBCQUEwQixFQUFFLHlCQUF5QixDQUFDLENBQUM7b0JBQ3BHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUN2QixRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFD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QyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztnQkFDTCw2QkFBQztZQUFELENBQUMsQUFsS0QsSUFrS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCB7IGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUsIGdldFZhbHVlQnlTdGF0TmFtZSB9IGZyb20gXCIuL3RocmVzaG9sZF9wcm9jZXNzb3JcIjtcblxuZXhwb3J0IGNsYXNzIE1ldHJpY092ZXJyaWRlIHtcbiAgICBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gICAgdGhyZXNob2xkczogQXJyYXk8YW55PjtcbiAgICBjb2xvcnM6IEFycmF5PHN0cmluZz47XG4gICAgdW5pdEZvcm1hdDogc3RyaW5nO1xuICAgIGRlY2ltYWxzOiBzdHJpbmc7XG4gICAgc2NhbGVkRGVjaW1hbHM6IG51bWJlcjtcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIG9wZXJhdG9yTmFtZTogc3RyaW5nOyAvLyBhdmcvbWluL21heCBldGNcbiAgICBwcmVmaXg6IHN0cmluZztcbiAgICBzdWZmaXg6IHN0cmluZztcbiAgICBjbGlja1Rocm91Z2g6IHN0cmluZztcbiAgICBzYW5pdGl6ZVVSTEVuYWJsZWQ6IGJvb2xlYW47XG4gICAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIHtcbiAgICBtZXRyaWNPdmVycmlkZXMgOiBBcnJheSA8IE1ldHJpY092ZXJyaWRlID47XG4gICAgJHNjb3BlOiBhbnk7XG4gICAgJHNhbml0aXplOiBhbnk7XG4gICAgdGVtcGxhdGVTcnY6IGFueTtcbiAgICBzdWdnZXN0TWV0cmljTmFtZXM6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgc2F2ZWRPdmVycmlkZXMpIHtcbiAgICAgICAgdGhpcy4kc2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHRoaXMuJHNhbml0aXplID0gJHNhbml0aXplO1xuICAgICAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgICAgIC8vIHR5cGVhaGVhZCByZXF1aXJlcyB0aGlzIGZvcm1cbiAgICAgICAgdGhpcy5zdWdnZXN0TWV0cmljTmFtZXMgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXy5tYXAodGhpcy4kc2NvcGUuY3RybC5zZXJpZXMsIGZ1bmN0aW9uIChzZXJpZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VyaWVzLmFsaWFzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzID0gc2F2ZWRPdmVycmlkZXM7XG4gICAgfVxuXG4gICAgYWRkTWV0cmljT3ZlcnJpZGUoKSB7XG4gICAgICAgIGxldCBvdmVycmlkZSA9IG5ldyBNZXRyaWNPdmVycmlkZSgpO1xuICAgICAgICBvdmVycmlkZS5tZXRyaWNOYW1lID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IFtdO1xuICAgICAgICBvdmVycmlkZS5jb2xvcnMgPSBbXCJyZ2JhKDI0NSwgNTQsIDU0LCAwLjkpXCIsIFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCIsIFwicmdiYSg1MCwgMTcyLCA0NSwgMC45NylcIl07XG4gICAgICAgIG92ZXJyaWRlLmRlY2ltYWxzID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIG92ZXJyaWRlLnVuaXRGb3JtYXQgPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5vcGVyYXRvck5hbWUgPSBcImF2Z1wiO1xuICAgICAgICBvdmVycmlkZS5zY2FsZWREZWNpbWFscyA9IG51bGw7XG4gICAgICAgIG92ZXJyaWRlLnByZWZpeCA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLnN1ZmZpeCA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLnNhbml0aXplVVJMRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzLnB1c2gob3ZlcnJpZGUpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY092ZXJyaWRlKG92ZXJyaWRlKSB7XG4gICAgICAgIHRoaXMubWV0cmljT3ZlcnJpZGVzID0gXy53aXRob3V0KHRoaXMubWV0cmljT3ZlcnJpZGVzLCBvdmVycmlkZSk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIG1hdGNoT3ZlcnJpZGUocGF0dGVybikgOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XTtcbiAgICAgICAgICAgIHZhciByZWdleCA9IGtibi5zdHJpbmdUb0pzUmVnZXgoYW5PdmVycmlkZS5tZXRyaWNOYW1lKTtcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gcGF0dGVybi5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuXG4gICAgYXBwbHlPdmVycmlkZXMoZGF0YSkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgbGV0IG1hdGNoSW5kZXggPSB0aGlzLm1hdGNoT3ZlcnJpZGUoZGF0YVtpbmRleF0ubmFtZSk7XG4gICAgICAgICAgaWYgKG1hdGNoSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgbGV0IGFTZXJpZXMgPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgbGV0IGFuT3ZlcnJpZGUgPSB0aGlzLm1ldHJpY092ZXJyaWRlc1ttYXRjaEluZGV4XTtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgYVNlcmllcy5vcGVyYXRvck5hbWUgPSBhbk92ZXJyaWRlLm9wZXJhdG9yTmFtZTtcbiAgICAgICAgICAgICAgbGV0IGRhdGFWYWx1ZSA9IGdldFZhbHVlQnlTdGF0TmFtZShhU2VyaWVzLm9wZXJhdG9yTmFtZSwgYVNlcmllcyk7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJpZXMyIG9wZXJhdG9yOiBcIiArIHNlcmllczIub3BlcmF0b3JOYW1lKTtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcmllczIgdmFsdWU6IFwiICsgc2VyaWVzMlZhbHVlKTtcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUoYW5PdmVycmlkZS50aHJlc2hvbGRzLCBkYXRhVmFsdWUpO1xuICAgICAgICAgICAgICAvLyBzZXQgdmFsdWUgdG8gd2hhdCB3YXMgcmV0dXJuZWRcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0udmFsdWUgPSBkYXRhVmFsdWU7XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLmNvbG9yID0gcmVzdWx0LmNvbG9yO1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwbHlPdmVycmlkZXM6IHZhbHVlID0gXCIgKyBkYXRhW2luZGV4XS52YWx1ZSArIFwiIGNvbG9yIFwiICsgZGF0YVtpbmRleF0uY29sb3IpO1xuICAgICAgICAgICAgICBkYXRhW2luZGV4XS50aHJlc2hvbGRMZXZlbCA9IHJlc3VsdC50aHJlc2hvbGRMZXZlbDtcbiAgICAgICAgICAgICAgLy8gZm9ybWF0IGl0XG4gICAgICAgICAgICAgIHZhciBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1thbk92ZXJyaWRlLnVuaXRGb3JtYXRdO1xuICAgICAgICAgICAgICBpZiAoZm9ybWF0RnVuYykge1xuICAgICAgICAgICAgICAgICAgLy8gcHV0IHRoZSB2YWx1ZSBpbiBxdW90ZXMgdG8gZXNjYXBlIFwibW9zdFwiIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0udmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGFbaW5kZXhdLnZhbHVlLCBhbk92ZXJyaWRlLmRlY2ltYWxzLCBhbk92ZXJyaWRlLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCBhbk92ZXJyaWRlLmRlY2ltYWxzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBjb3B5IHRoZSB0aHJlc2hvbGQgZGF0YSBpbnRvIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0udGhyZXNob2xkcyA9IGFuT3ZlcnJpZGUudGhyZXNob2xkcztcbiAgICAgICAgICAgICAgZGF0YVtpbmRleF0ucHJlZml4ID0gYW5PdmVycmlkZS5wcmVmaXg7XG4gICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnN1ZmZpeCA9IGFuT3ZlcnJpZGUuc3VmZml4O1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIHVybCwgcmVwbGFjZSB0ZW1wbGF0ZSB2YXJzXG4gICAgICAgICAgICAgIGlmICgoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gpICYmIChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaC5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoID0gdGhpcy50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgICAgICAgaWYgKGFuT3ZlcnJpZGUuc2FuaXRpemVVUkxFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUoZGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG5cbiAgICBhZGRUaHJlc2hvbGQob3ZlcnJpZGUpIHtcbiAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMucHVzaCgge1xuICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgc3RhdGU6IDAsXG4gICAgICAgIGNvbG9yOiBcIiMyOTljNDZcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zb3J0VGhyZXNob2xkcyhvdmVycmlkZSk7XG4gICAgfVxuXG4gICAgLy8gc3RvcmUgdXNlciBzZWxlY3Rpb24gb2YgY29sb3IgdG8gYmUgdXNlZCBmb3IgYWxsIGl0ZW1zIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGVcbiAgICBzZXRUaHJlc2hvbGRDb2xvcih0aHJlc2hvbGQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhyZXNob2xkIGNvbG9yIHNldCB0byBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZVRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgY29uc29sZS5sb2coXCJWYWxpZGF0ZSBjb2xvciBcIiArIHRocmVzaG9sZC5jb2xvcik7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBzb3J0VGhyZXNob2xkcyhvdmVycmlkZSkge1xuICAgICAgb3ZlcnJpZGUudGhyZXNob2xkcyA9IF8ub3JkZXJCeShvdmVycmlkZS50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiYXNjXCJdKTtcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHJlbW92ZVRocmVzaG9sZChvdmVycmlkZSwgdGhyZXNob2xkKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzID0gXy53aXRob3V0KG92ZXJyaWRlLnRocmVzaG9sZHMsIHRocmVzaG9sZCk7XG4gICAgICB0aGlzLnNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICBpbnZlcnRDb2xvck9yZGVyKG92ZXJyaWRlKSB7XG4gICAgICBvdmVycmlkZS5jb2xvcnMucmV2ZXJzZSgpO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgc2V0VW5pdEZvcm1hdChvdmVycmlkZSwgc3ViSXRlbSkge1xuICAgICAgICBvdmVycmlkZS51bml0Rm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICB9XG5cbiAgICBtb3ZlTWV0cmljT3ZlcnJpZGVVcChvdmVycmlkZSkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChvdmVycmlkZSA9PT0gYW5PdmVycmlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheW1vdmUodGhpcy5tZXRyaWNPdmVycmlkZXMsIGluZGV4LCBpbmRleCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZU1ldHJpY092ZXJyaWRlRG93bihvdmVycmlkZSkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChvdmVycmlkZSA9PT0gYW5PdmVycmlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5bW92ZSh0aGlzLm1ldHJpY092ZXJyaWRlcywgaW5kZXgsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFycmF5bW92ZShhcnIsIGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGFycltmcm9tSW5kZXhdO1xuICAgICAgICBhcnIuc3BsaWNlKGZyb21JbmRleCwgMSk7XG4gICAgICAgIGFyci5zcGxpY2UodG9JbmRleCwgMCwgZWxlbWVudCk7XG4gICAgfVxufVxuIl19