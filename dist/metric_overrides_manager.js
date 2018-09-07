System.register(["lodash", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, MetricOverride, MetricOverridesManager;
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
                            var anOverride = this.metricOverrides[matchIndex];
                            var dataValue = this.getValueByStatName(anOverride, data[index]);
                            data[index].value = dataValue;
                            data[index].color = this.getColorForValue(matchIndex, data[index].value);
                            data[index].thresholdLevel = this.getThresholdLevelForValue(matchIndex, data[index].value);
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
                MetricOverridesManager.prototype.getValueByStatName = function (settings, data) {
                    var value = data.stats.avg;
                    switch (settings.operatorName) {
                        case "avg":
                            value = data.stats.avg;
                            break;
                        case "count":
                            value = data.stats.count;
                            break;
                        case "current":
                            value = data.stats.current;
                            break;
                        case "delta":
                            value = data.stats.delta;
                            break;
                        case "diff":
                            value = data.stats.diff;
                            break;
                        case "first":
                            value = data.stats.first;
                            break;
                        case "logmin":
                            value = data.stats.logmin;
                            break;
                        case "max":
                            value = data.stats.max;
                            break;
                        case "min":
                            value = data.stats.min;
                            break;
                        case "name":
                            value = data.metricName;
                            break;
                        case "time_step":
                            value = data.stats.timeStep;
                            break;
                        case "last_time":
                            value = data.timestamp;
                            break;
                        case "total":
                            value = data.stats.total;
                            break;
                        default:
                            value = data.stats.avg;
                            break;
                    }
                    return value;
                };
                MetricOverridesManager.prototype.getColorForValue = function (index, value) {
                    var lastColor = "#808080";
                    if (value === null) {
                        return lastColor;
                    }
                    var anOverride = this.metricOverrides[index];
                    for (var i = anOverride.thresholds.length - 1; i >= 0; i--) {
                        var aThreshold = anOverride.thresholds[i];
                        if (value >= aThreshold.value) {
                            return aThreshold.color;
                        }
                        lastColor = aThreshold.color;
                    }
                    return lastColor;
                };
                MetricOverridesManager.prototype.getThresholdLevelForValue = function (index, value) {
                    if (value === null) {
                        return 3;
                    }
                    var anOverride = this.metricOverrides[index];
                    var lastState = 0;
                    for (var i = anOverride.thresholds.length - 1; i >= 0; i--) {
                        var aThreshold = anOverride.thresholds[i];
                        if (value >= aThreshold.value) {
                            return aThreshold.state;
                        }
                    }
                    return lastState;
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
                    switch (threshold.state) {
                        case 0:
                            threshold.color = "#299c46";
                            break;
                        case 1:
                            threshold.color = "rgba(237, 129, 40, 0.89)";
                            break;
                        case 2:
                            threshold.color = "#d44a3a";
                            break;
                    }
                };
                MetricOverridesManager.prototype.validateThresholdColor = function (threshold) {
                    switch (threshold.state) {
                        case 0:
                            threshold.color = "#299c46";
                            break;
                        case 1:
                            threshold.color = "rgba(237, 129, 40, 0.89)";
                            break;
                        case 2:
                            threshold.color = "#d44a3a";
                            break;
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21ldHJpY19vdmVycmlkZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUtBO2dCQUFBO2dCQWNBLENBQUM7Z0JBQUQscUJBQUM7WUFBRCxDQUFDLEFBZEQsSUFjQzs7WUFFRDtnQkFPSSxnQ0FBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjO29CQUExRCxpQkFXQztvQkFWRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUUvQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3RCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDbEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN4QixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7Z0JBQzFDLENBQUM7Z0JBRUQsa0RBQWlCLEdBQWpCO29CQUNJLElBQUksUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7b0JBQ3BDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUN6QixRQUFRLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFDekIsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLHdCQUF3QixFQUFFLDBCQUEwQixFQUFFLHlCQUF5QixDQUFDLENBQUM7b0JBQ3BHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUN2QixRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDeEIs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QUNKO3FCQUNKO2dCQUNMLENBQUM7Z0JBQ0QsdURBQXNCLEdBQXRCLFVBQXVCLFFBQVE7b0JBQzNCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDOUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDN0MsSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFOzRCQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtnQ0FDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZELE1BQU07NkJBQ1Q7eUJBQ0o7cUJBQ0o7Z0JBQ0wsQ0FBQztnQkFFRCwwQ0FBUyxHQUFULFVBQVUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPO29CQUM3QixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0wsNkJBQUM7WUFBRCxDQUFDLEFBNVBELElBNFBDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5cbmV4cG9ydCBjbGFzcyBNZXRyaWNPdmVycmlkZSB7XG4gICAgbWV0cmljTmFtZTogc3RyaW5nO1xuICAgIHRocmVzaG9sZHM6IEFycmF5PGFueT47XG4gICAgY29sb3JzOiBBcnJheTxzdHJpbmc+O1xuICAgIHVuaXRGb3JtYXQ6IHN0cmluZztcbiAgICBkZWNpbWFsczogc3RyaW5nO1xuICAgIHNjYWxlZERlY2ltYWxzOiBudW1iZXI7XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBvcGVyYXRvck5hbWU6IHN0cmluZzsgLy8gYXZnL21pbi9tYXggZXRjXG4gICAgcHJlZml4OiBzdHJpbmc7XG4gICAgc3VmZml4OiBzdHJpbmc7XG4gICAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gICAgc2FuaXRpemVVUkxFbmFibGVkOiBib29sZWFuO1xuICAgIHNhbml0aXplZFVSTDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTWV0cmljT3ZlcnJpZGVzTWFuYWdlciB7XG4gICAgbWV0cmljT3ZlcnJpZGVzIDogQXJyYXkgPCBNZXRyaWNPdmVycmlkZSA+O1xuICAgICRzY29wZTogYW55O1xuICAgICRzYW5pdGl6ZTogYW55O1xuICAgIHRlbXBsYXRlU3J2OiBhbnk7XG4gICAgc3VnZ2VzdE1ldHJpY05hbWVzOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHNhdmVkT3ZlcnJpZGVzKSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRzYW5pdGl6ZSA9ICRzYW5pdGl6ZTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICAgIHRoaXMuc3VnZ2VzdE1ldHJpY05hbWVzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IHNhdmVkT3ZlcnJpZGVzO1xuICAgIH1cblxuICAgIGFkZE1ldHJpY092ZXJyaWRlKCkge1xuICAgICAgICBsZXQgb3ZlcnJpZGUgPSBuZXcgTWV0cmljT3ZlcnJpZGUoKTtcbiAgICAgICAgb3ZlcnJpZGUubWV0cmljTmFtZSA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMgPSBbXTtcbiAgICAgICAgb3ZlcnJpZGUuY29sb3JzID0gW1wicmdiYSgyNDUsIDU0LCA1NCwgMC45KVwiLCBcInJnYmEoMjM3LCAxMjksIDQwLCAwLjg5KVwiLCBcInJnYmEoNTAsIDE3MiwgNDUsIDAuOTcpXCJdO1xuICAgICAgICBvdmVycmlkZS5kZWNpbWFscyA9IFwiXCI7XG4gICAgICAgIG92ZXJyaWRlLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBvdmVycmlkZS51bml0Rm9ybWF0ID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgICAgb3ZlcnJpZGUub3BlcmF0b3JOYW1lID0gXCJhdmdcIjtcbiAgICAgICAgb3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMgPSBudWxsO1xuICAgICAgICBvdmVycmlkZS5wcmVmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zdWZmaXggPSBcIlwiO1xuICAgICAgICBvdmVycmlkZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcy5wdXNoKG92ZXJyaWRlKTtcbiAgICB9XG5cbiAgICByZW1vdmVNZXRyaWNPdmVycmlkZShvdmVycmlkZSkge1xuICAgICAgICB0aGlzLm1ldHJpY092ZXJyaWRlcyA9IF8ud2l0aG91dCh0aGlzLm1ldHJpY092ZXJyaWRlcywgb3ZlcnJpZGUpO1xuICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBtYXRjaE92ZXJyaWRlKHBhdHRlcm4pIDogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljT3ZlcnJpZGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGFuT3ZlcnJpZGUgPSB0aGlzLm1ldHJpY092ZXJyaWRlc1tpbmRleF07XG4gICAgICAgICAgICB2YXIgcmVnZXggPSBrYm4uc3RyaW5nVG9Kc1JlZ2V4KGFuT3ZlcnJpZGUubWV0cmljTmFtZSk7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBhcHBseU92ZXJyaWRlcyhkYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IG1hdGNoSW5kZXggPSB0aGlzLm1hdGNoT3ZlcnJpZGUoZGF0YVtpbmRleF0ubmFtZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFuT3ZlcnJpZGUgPSB0aGlzLm1ldHJpY092ZXJyaWRlc1ttYXRjaEluZGV4XTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YVZhbHVlID0gdGhpcy5nZXRWYWx1ZUJ5U3RhdE5hbWUoYW5PdmVycmlkZSwgZGF0YVtpbmRleF0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCB2YWx1ZSB0byB3aGF0IHdhcyByZXR1cm5lZFxuICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlID0gZGF0YVZhbHVlO1xuICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLmNvbG9yID0gdGhpcy5nZXRDb2xvckZvclZhbHVlKG1hdGNoSW5kZXgsIGRhdGFbaW5kZXhdLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS50aHJlc2hvbGRMZXZlbCA9IHRoaXMuZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZShtYXRjaEluZGV4LCBkYXRhW2luZGV4XS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gZm9ybWF0IGl0XG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW2FuT3ZlcnJpZGUudW5pdEZvcm1hdF07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHV0IHRoZSB2YWx1ZSBpbiBxdW90ZXMgdG8gZXNjYXBlIFwibW9zdFwiIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YVtpbmRleF0udmFsdWUsIGFuT3ZlcnJpZGUuZGVjaW1hbHMsIGFuT3ZlcnJpZGUuc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgYW5PdmVycmlkZS5kZWNpbWFscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHRocmVzaG9sZCBkYXRhIGludG8gdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdLnRocmVzaG9sZHMgPSBhbk92ZXJyaWRlLnRocmVzaG9sZHM7XG4gICAgICAgICAgICAgICAgZGF0YVtpbmRleF0ucHJlZml4ID0gYW5PdmVycmlkZS5wcmVmaXg7XG4gICAgICAgICAgICAgICAgZGF0YVtpbmRleF0uc3VmZml4ID0gYW5PdmVycmlkZS5zdWZmaXg7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSB1cmwsIHJlcGxhY2UgdGVtcGxhdGUgdmFyc1xuICAgICAgICAgICAgICAgIGlmICgoYW5PdmVycmlkZS5jbGlja1Rocm91Z2gpICYmIChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaC5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XS5jbGlja1Rocm91Z2ggPSB0aGlzLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dChhbk92ZXJyaWRlLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbk92ZXJyaWRlLnNhbml0aXplVVJMRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUoZGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFZhbHVlQnlTdGF0TmFtZShzZXR0aW5ncywgZGF0YSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgICAgICAgc3dpdGNoIChzZXR0aW5ncy5vcGVyYXRvck5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJhdmdcIjpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNvdW50XCI6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmNvdW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImN1cnJlbnRcIjpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuY3VycmVudDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkZWx0YVwiOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5kZWx0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkaWZmXCI6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmRpZmY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlyc3RcIjpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZmlyc3Q7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibG9nbWluXCI6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmxvZ21pbjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtYXhcIjpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubWF4O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5taW47XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5tZXRyaWNOYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRpbWVfc3RlcFwiOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy50aW1lU3RlcDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsYXN0X3RpbWVcIjpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEudGltZXN0YW1wO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRvdGFsXCI6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLnRvdGFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXRDb2xvckZvclZhbHVlKGluZGV4LCB2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgIGxldCBsYXN0Q29sb3IgPSBcIiM4MDgwODBcIjsgLy8gXCJncmV5XCI7XG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RDb2xvcjtcbiAgICAgIH1cbiAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdO1xuICAgICAgZm9yIChsZXQgaSA9IGFuT3ZlcnJpZGUudGhyZXNob2xkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgYVRocmVzaG9sZCA9IGFuT3ZlcnJpZGUudGhyZXNob2xkc1tpXTtcbiAgICAgICAgICBpZiAodmFsdWUgPj0gYVRocmVzaG9sZC52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFUaHJlc2hvbGQuY29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICBsYXN0Q29sb3IgPSBhVGhyZXNob2xkLmNvbG9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxhc3RDb2xvcjtcbiAgfVxuXG4gICAgLy8gdXNlciBtYXkgZGVmaW5lIHRoZSB0aHJlc2hvbGQgd2l0aCBqdXN0IG9uZSB2YWx1ZVxuICAgIGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUoaW5kZXgsIHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAzOyAvLyBObyBEYXRhXG4gICAgICB9XG4gICAgICBsZXQgYW5PdmVycmlkZSA9IHRoaXMubWV0cmljT3ZlcnJpZGVzW2luZGV4XTtcbiAgICAgIGxldCBsYXN0U3RhdGUgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IGFuT3ZlcnJpZGUudGhyZXNob2xkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgYVRocmVzaG9sZCA9IGFuT3ZlcnJpZGUudGhyZXNob2xkc1tpXTtcbiAgICAgICAgaWYgKHZhbHVlID49IGFUaHJlc2hvbGQudmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gYVRocmVzaG9sZC5zdGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxhc3RTdGF0ZTtcbiAgICB9XG5cbiAgICBhZGRUaHJlc2hvbGQob3ZlcnJpZGUpIHtcbiAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMucHVzaCgge1xuICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgc3RhdGU6IDAsXG4gICAgICAgIGNvbG9yOiBcIiMyOTljNDZcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zb3J0VGhyZXNob2xkcyhvdmVycmlkZSk7XG4gICAgfVxuXG4gICAgLy8gc3RvcmUgdXNlciBzZWxlY3Rpb24gb2YgY29sb3IgdG8gYmUgdXNlZCBmb3IgYWxsIGl0ZW1zIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGVcbiAgICBzZXRUaHJlc2hvbGRDb2xvcih0aHJlc2hvbGQpIHtcbiAgICAgIHN3aXRjaCAodGhyZXNob2xkLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aHJlc2hvbGQuY29sb3IgPSBcIiMyOTljNDZcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRocmVzaG9sZC5jb2xvciA9IFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aHJlc2hvbGQuY29sb3IgPSBcIiNkNDRhM2FcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZVRocmVzaG9sZENvbG9yKHRocmVzaG9sZCkge1xuICAgICAgc3dpdGNoICh0aHJlc2hvbGQuc3RhdGUpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHRocmVzaG9sZC5jb2xvciA9IFwiIzI5OWM0NlwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhyZXNob2xkLmNvbG9yID0gXCJyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSlcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRocmVzaG9sZC5jb2xvciA9IFwiI2Q0NGEzYVwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRUaHJlc2hvbGRzKG92ZXJyaWRlKSB7XG4gICAgICBvdmVycmlkZS50aHJlc2hvbGRzID0gXy5vcmRlckJ5KG92ZXJyaWRlLnRocmVzaG9sZHMsIFtcInZhbHVlXCJdLCBbXCJhc2NcIl0pO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlVGhyZXNob2xkKG92ZXJyaWRlLCB0aHJlc2hvbGQpIHtcbiAgICAgIG92ZXJyaWRlLnRocmVzaG9sZHMgPSBfLndpdGhvdXQob3ZlcnJpZGUudGhyZXNob2xkcywgdGhyZXNob2xkKTtcbiAgICAgIHRoaXMuc29ydFRocmVzaG9sZHMob3ZlcnJpZGUpO1xuICAgIH1cblxuICAgIGludmVydENvbG9yT3JkZXIob3ZlcnJpZGUpIHtcbiAgICAgIG92ZXJyaWRlLmNvbG9ycy5yZXZlcnNlKCk7XG4gICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBzZXRVbml0Rm9ybWF0KG92ZXJyaWRlLCBzdWJJdGVtKSB7XG4gICAgICAgIG92ZXJyaWRlLnVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIH1cblxuICAgIG1vdmVNZXRyaWNPdmVycmlkZVVwKG92ZXJyaWRlKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRlID09PSBhbk92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5bW92ZSh0aGlzLm1ldHJpY092ZXJyaWRlcywgaW5kZXgsIGluZGV4IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtb3ZlTWV0cmljT3ZlcnJpZGVEb3duKG92ZXJyaWRlKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1ldHJpY092ZXJyaWRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhbk92ZXJyaWRlID0gdGhpcy5tZXRyaWNPdmVycmlkZXNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRlID09PSBhbk92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5tZXRyaWNPdmVycmlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXltb3ZlKHRoaXMubWV0cmljT3ZlcnJpZGVzLCBpbmRleCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJyYXltb3ZlKGFyciwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gYXJyW2Zyb21JbmRleF07XG4gICAgICAgIGFyci5zcGxpY2UoZnJvbUluZGV4LCAxKTtcbiAgICAgICAgYXJyLnNwbGljZSh0b0luZGV4LCAwLCBlbGVtZW50KTtcbiAgICB9XG59XG4iXX0=