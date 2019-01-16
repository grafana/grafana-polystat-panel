System.register([], function (exports_1, context_1) {
    "use strict";
    var PolystatModel;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PolystatModel = (function () {
                function PolystatModel(operatorName, aSeries) {
                    if (aSeries === null) {
                        return;
                    }
                    this.animateMode = "all";
                    this.displayMode = "all";
                    this.operatorName = operatorName;
                    this.name = aSeries.alias;
                    var operatorValue = this.getValueByOperator(operatorName, aSeries);
                    this.value = operatorValue;
                    this.valueFormatted = operatorValue;
                    this.stats = aSeries.stats;
                    this.timestamp = aSeries.datapoints[aSeries.datapoints.length - 1][1];
                    this.prefix = "";
                    this.suffix = "";
                    this.seriesRaw = null;
                    this.color = "green";
                    this.clickThrough = "";
                    this.sanitizedURL = "";
                    this.sanitizeURLEnabled = true;
                    this.isComposite = false;
                    this.members = [];
                    this.thresholdLevel = 0;
                    this.showName = true;
                    this.showValue = true;
                }
                PolystatModel.prototype.getValueByOperator = function (operatorName, data) {
                    var value = data.stats.avg;
                    switch (operatorName) {
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
                PolystatModel.prototype.shallowClone = function () {
                    var clone = new PolystatModel(this.operatorName, null);
                    clone.operatorName = this.operatorName;
                    clone.thresholdLevel = this.thresholdLevel;
                    clone.value = this.value;
                    clone.valueFormatted = this.valueFormatted;
                    clone.name = this.name;
                    clone.timestamp = this.timestamp;
                    clone.prefix = this.prefix;
                    clone.suffix = this.suffix;
                    clone.seriesRaw = null;
                    clone.color = this.color;
                    clone.clickThrough = this.clickThrough;
                    clone.sanitizedURL = this.sanitizedURL;
                    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
                    clone.isComposite = this.isComposite;
                    clone.members = [];
                    return clone;
                };
                PolystatModel.prototype.deepClone = function () {
                    var clone = new PolystatModel(this.operatorName, null);
                    clone.operatorName = this.operatorName;
                    clone.thresholdLevel = this.thresholdLevel;
                    clone.value = this.value;
                    clone.valueFormatted = this.valueFormatted;
                    clone.name = this.name;
                    clone.timestamp = this.timestamp;
                    clone.prefix = this.prefix;
                    clone.suffix = this.suffix;
                    clone.seriesRaw = this.seriesRaw;
                    clone.color = this.color;
                    clone.clickThrough = this.clickThrough;
                    clone.sanitizedURL = this.sanitizedURL;
                    clone.sanitizeURLEnabled = this.sanitizeURLEnabled;
                    clone.isComposite = this.isComposite;
                    clone.members = [];
                    return clone;
                };
                return PolystatModel;
            }());
            exports_1("PolystatModel", PolystatModel);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seXN0YXRtb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2x5c3RhdG1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFNQTtnQkFzQkUsdUJBQVksWUFBb0IsRUFBRSxPQUFZO29CQUM1QyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7d0JBQ3BCLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztvQkFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUMxQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMs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QkFDakMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN6QixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDdkMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbkQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNyQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFDbkIsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFDSCxvQkFBQztZQUFELENBQUMsQUEzSUQsSUEySUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhvbGRzIGRhdGEgZm9yIHBvbHlzdGF0XG4gKlxuICogVGhpcyBjbGFzIHJlcHJlc2VudHMgdGhlIGNvbnRlbnRzIG9mIG9uZSBwb2x5Z29uXG4gKi9cblxuZXhwb3J0IGNsYXNzIFBvbHlzdGF0TW9kZWwge1xuICBhbmltYXRlTW9kZTogc3RyaW5nO1xuICBkaXNwbGF5TW9kZTogc3RyaW5nO1xuICB0aHJlc2hvbGRMZXZlbDogbnVtYmVyOyAvLyAwID0gb2ssIDEgPSB3YXJuLCAyID0gY3JpdCwgMyA9IHVua25vd24gKHNhbWUgYXMgc2Vuc3UpXG4gIHZhbHVlOiBudW1iZXI7XG4gIHZhbHVlRm9ybWF0dGVkOiBzdHJpbmc7XG4gIHN0YXRzOiBhbnk7XG4gIG5hbWU6IHN0cmluZztcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIHByZWZpeDogc3RyaW5nO1xuICBzdWZmaXg6IHN0cmluZztcbiAgc2VyaWVzUmF3OiBbYW55XTtcbiAgY29sb3I6IHN0cmluZztcbiAgY2xpY2tUaHJvdWdoOiBzdHJpbmc7XG4gIG9wZXJhdG9yTmFtZTogc3RyaW5nO1xuICBzYW5pdGl6ZWRVUkw6IHN0cmluZztcbiAgc2FuaXRpemVVUkxFbmFibGVkOiBib29sZWFuO1xuICBzaG93TmFtZTogYm9vbGVhbjtcbiAgc2hvd1ZhbHVlOiBib29sZWFuO1xuICBpc0NvbXBvc2l0ZTogYm9vbGVhbjtcbiAgbWVtYmVyczogQXJyYXk8UG9seXN0YXRNb2RlbD47XG5cbiAgY29uc3RydWN0b3Iob3BlcmF0b3JOYW1lOiBzdHJpbmcsIGFTZXJpZXM6IGFueSkge1xuICAgIGlmIChhU2VyaWVzID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0ZU1vZGUgPSBcImFsbFwiO1xuICAgIHRoaXMuZGlzcGxheU1vZGUgPSBcImFsbFwiO1xuICAgIHRoaXMub3BlcmF0b3JOYW1lID0gb3BlcmF0b3JOYW1lO1xuICAgIHRoaXMubmFtZSA9IGFTZXJpZXMuYWxpYXM7XG4gICAgbGV0IG9wZXJhdG9yVmFsdWUgPSB0aGlzLmdldFZhbHVlQnlPcGVyYXRvcihvcGVyYXRvck5hbWUsIGFTZXJpZXMpO1xuICAgIHRoaXMudmFsdWUgPSBvcGVyYXRvclZhbHVlO1xuICAgIHRoaXMudmFsdWVGb3JtYXR0ZWQgPSBvcGVyYXRvclZhbHVlO1xuICAgIHRoaXMuc3RhdHMgPSBhU2VyaWVzLnN0YXRzO1xuICAgIHRoaXMudGltZXN0YW1wID0gYVNlcmllcy5kYXRhcG9pbnRzW2FTZXJpZXMuZGF0YXBvaW50cy5sZW5ndGggLSAxXVsxXTtcbiAgICB0aGlzLnByZWZpeCA9IFwiXCI7XG4gICAgdGhpcy5zdWZmaXggPSBcIlwiO1xuICAgIHRoaXMuc2VyaWVzUmF3ID0gbnVsbDtcbiAgICB0aGlzLmNvbG9yID0gXCJncmVlblwiO1xuICAgIHRoaXMuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICB0aGlzLnNhbml0aXplZFVSTCA9IFwiXCI7XG4gICAgdGhpcy5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb21wb3NpdGUgPSBmYWxzZTtcbiAgICB0aGlzLm1lbWJlcnMgPSBbXTtcbiAgICB0aGlzLnRocmVzaG9sZExldmVsID0gMDtcbiAgICB0aGlzLnNob3dOYW1lID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dWYWx1ZSA9IHRydWU7XG4gIH1cblxuICBnZXRWYWx1ZUJ5T3BlcmF0b3Iob3BlcmF0b3JOYW1lLCBkYXRhKSB7XG4gICAgbGV0IHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gICAgc3dpdGNoIChvcGVyYXRvck5hbWUpIHtcbiAgICAgICAgY2FzZSBcImF2Z1wiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY291bnRcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5jb3VudDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY3VycmVudFwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmN1cnJlbnQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRlbHRhXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZGVsdGE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpZmZcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5kaWZmO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmaXJzdFwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmZpcnN0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJsb2dtaW5cIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5sb2dtaW47XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1heFwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLm1heDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWluXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubWluO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEubWV0cmljTmFtZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidGltZV9zdGVwXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMudGltZVN0ZXA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxhc3RfdGltZVwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnRpbWVzdGFtcDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG90YWxcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy50b3RhbDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ29waWVzIHZhbHVlcywgbGVhdmVzIG1lbWJlcnMgZW1wdHlcbiAgICovXG4gIHNoYWxsb3dDbG9uZSgpOiBQb2x5c3RhdE1vZGVsIHtcbiAgICBsZXQgY2xvbmUgPSBuZXcgUG9seXN0YXRNb2RlbCh0aGlzLm9wZXJhdG9yTmFtZSwgbnVsbCk7XG4gICAgY2xvbmUub3BlcmF0b3JOYW1lID0gdGhpcy5vcGVyYXRvck5hbWU7XG4gICAgY2xvbmUudGhyZXNob2xkTGV2ZWwgPSB0aGlzLnRocmVzaG9sZExldmVsO1xuICAgIGNsb25lLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICBjbG9uZS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMudmFsdWVGb3JtYXR0ZWQ7XG4gICAgY2xvbmUubmFtZSA9IHRoaXMubmFtZTtcbiAgICBjbG9uZS50aW1lc3RhbXAgPSB0aGlzLnRpbWVzdGFtcDtcbiAgICBjbG9uZS5wcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICBjbG9uZS5zdWZmaXggPSB0aGlzLnN1ZmZpeDtcbiAgICBjbG9uZS5zZXJpZXNSYXcgPSBudWxsOyAvLyBmb3IgYSBzaGFsbG93IGNsb25lIGRyb3AgdGhlIHNlcmllc1xuICAgIGNsb25lLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgICBjbG9uZS5jbGlja1Rocm91Z2ggPSB0aGlzLmNsaWNrVGhyb3VnaDtcbiAgICBjbG9uZS5zYW5pdGl6ZWRVUkwgPSB0aGlzLnNhbml0aXplZFVSTDtcbiAgICBjbG9uZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0aGlzLnNhbml0aXplVVJMRW5hYmxlZDtcbiAgICBjbG9uZS5pc0NvbXBvc2l0ZSA9IHRoaXMuaXNDb21wb3NpdGU7XG4gICAgY2xvbmUubWVtYmVycyA9IFtdOyAvLyB0aGlzLm1lbWJlcnM7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG4gIGRlZXBDbG9uZSgpOiBQb2x5c3RhdE1vZGVsIHtcbiAgICBsZXQgY2xvbmUgPSBuZXcgUG9seXN0YXRNb2RlbCh0aGlzLm9wZXJhdG9yTmFtZSwgbnVsbCk7XG4gICAgY2xvbmUub3BlcmF0b3JOYW1lID0gdGhpcy5vcGVyYXRvck5hbWU7XG4gICAgY2xvbmUudGhyZXNob2xkTGV2ZWwgPSB0aGlzLnRocmVzaG9sZExldmVsO1xuICAgIGNsb25lLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICBjbG9uZS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMudmFsdWVGb3JtYXR0ZWQ7XG4gICAgY2xvbmUubmFtZSA9IHRoaXMubmFtZTtcbiAgICBjbG9uZS50aW1lc3RhbXAgPSB0aGlzLnRpbWVzdGFtcDtcbiAgICBjbG9uZS5wcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICBjbG9uZS5zdWZmaXggPSB0aGlzLnN1ZmZpeDtcbiAgICBjbG9uZS5zZXJpZXNSYXcgPSB0aGlzLnNlcmllc1JhdzsgLy8gZGVlcCBjbG9uZSByZXRhaW5zIHRoZSBzZXJpZXMgKGNhcmVmdWwgb2YgbGVhayEpXG4gICAgY2xvbmUuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgIGNsb25lLmNsaWNrVGhyb3VnaCA9IHRoaXMuY2xpY2tUaHJvdWdoO1xuICAgIGNsb25lLnNhbml0aXplZFVSTCA9IHRoaXMuc2FuaXRpemVkVVJMO1xuICAgIGNsb25lLnNhbml0aXplVVJMRW5hYmxlZCA9IHRoaXMuc2FuaXRpemVVUkxFbmFibGVkO1xuICAgIGNsb25lLmlzQ29tcG9zaXRlID0gdGhpcy5pc0NvbXBvc2l0ZTtcbiAgICBjbG9uZS5tZW1iZXJzID0gW107IC8vIHRoaXMubWVtYmVycztcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbn1cbiJdfQ==