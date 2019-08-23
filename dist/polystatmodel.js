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
                    this.newTabEnabled = true;
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
                    clone.newTabEnabled = this.newTabEnabled;
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
                    clone.newTabEnabled = this.newTabEnabled;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seXN0YXRtb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2x5c3RhdG1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFNQTtnQkF1QkUsdUJBQVksWUFBb0IsRUFBRSxPQUFZO29CQUM1QyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7d0JBQ3BCLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztvQkFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUMxQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMs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LENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQzNCLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDakMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN6QixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDdkMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO29CQUN6QyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUNuRCxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3JDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNuQixPQUFPLEtBQUssQ0FBQztnQkFDZixDQUFDO2dCQUNILG9CQUFDO1lBQUQsQ0FBQyxBQS9JRCxJQStJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSG9sZHMgZGF0YSBmb3IgcG9seXN0YXRcbiAqXG4gKiBUaGlzIGNsYXMgcmVwcmVzZW50cyB0aGUgY29udGVudHMgb2Ygb25lIHBvbHlnb25cbiAqL1xuXG5leHBvcnQgY2xhc3MgUG9seXN0YXRNb2RlbCB7XG4gIGFuaW1hdGVNb2RlOiBzdHJpbmc7XG4gIGRpc3BsYXlNb2RlOiBzdHJpbmc7XG4gIHRocmVzaG9sZExldmVsOiBudW1iZXI7IC8vIDAgPSBvaywgMSA9IHdhcm4sIDIgPSBjcml0LCAzID0gdW5rbm93biAoc2FtZSBhcyBzZW5zdSlcbiAgdmFsdWU6IG51bWJlcjtcbiAgdmFsdWVGb3JtYXR0ZWQ6IHN0cmluZztcbiAgc3RhdHM6IGFueTtcbiAgbmFtZTogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgcHJlZml4OiBzdHJpbmc7XG4gIHN1ZmZpeDogc3RyaW5nO1xuICBzZXJpZXNSYXc6IFthbnldO1xuICBjb2xvcjogc3RyaW5nO1xuICBjbGlja1Rocm91Z2g6IHN0cmluZztcbiAgb3BlcmF0b3JOYW1lOiBzdHJpbmc7XG4gIG5ld1RhYkVuYWJsZWQ6IGJvb2xlYW47XG4gIHNhbml0aXplZFVSTDogc3RyaW5nO1xuICBzYW5pdGl6ZVVSTEVuYWJsZWQ6IGJvb2xlYW47XG4gIHNob3dOYW1lOiBib29sZWFuO1xuICBzaG93VmFsdWU6IGJvb2xlYW47XG4gIGlzQ29tcG9zaXRlOiBib29sZWFuO1xuICBtZW1iZXJzOiBBcnJheTxQb2x5c3RhdE1vZGVsPjtcblxuICBjb25zdHJ1Y3RvcihvcGVyYXRvck5hbWU6IHN0cmluZywgYVNlcmllczogYW55KSB7XG4gICAgaWYgKGFTZXJpZXMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hbmltYXRlTW9kZSA9IFwiYWxsXCI7XG4gICAgdGhpcy5kaXNwbGF5TW9kZSA9IFwiYWxsXCI7XG4gICAgdGhpcy5vcGVyYXRvck5hbWUgPSBvcGVyYXRvck5hbWU7XG4gICAgdGhpcy5uYW1lID0gYVNlcmllcy5hbGlhcztcbiAgICBsZXQgb3BlcmF0b3JWYWx1ZSA9IHRoaXMuZ2V0VmFsdWVCeU9wZXJhdG9yKG9wZXJhdG9yTmFtZSwgYVNlcmllcyk7XG4gICAgdGhpcy52YWx1ZSA9IG9wZXJhdG9yVmFsdWU7XG4gICAgdGhpcy52YWx1ZUZvcm1hdHRlZCA9IG9wZXJhdG9yVmFsdWU7XG4gICAgdGhpcy5zdGF0cyA9IGFTZXJpZXMuc3RhdHM7XG4gICAgdGhpcy50aW1lc3RhbXAgPSBhU2VyaWVzLmRhdGFwb2ludHNbYVNlcmllcy5kYXRhcG9pbnRzLmxlbmd0aCAtIDFdWzFdO1xuICAgIHRoaXMucHJlZml4ID0gXCJcIjtcbiAgICB0aGlzLnN1ZmZpeCA9IFwiXCI7XG4gICAgdGhpcy5zZXJpZXNSYXcgPSBudWxsO1xuICAgIHRoaXMuY29sb3IgPSBcImdyZWVuXCI7XG4gICAgdGhpcy5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgIHRoaXMuc2FuaXRpemVkVVJMID0gXCJcIjtcbiAgICB0aGlzLm5ld1RhYkVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuc2FuaXRpemVVUkxFbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29tcG9zaXRlID0gZmFsc2U7XG4gICAgdGhpcy5tZW1iZXJzID0gW107XG4gICAgdGhpcy50aHJlc2hvbGRMZXZlbCA9IDA7XG4gICAgdGhpcy5zaG93TmFtZSA9IHRydWU7XG4gICAgdGhpcy5zaG93VmFsdWUgPSB0cnVlO1xuICB9XG5cbiAgZ2V0VmFsdWVCeU9wZXJhdG9yKG9wZXJhdG9yTmFtZSwgZGF0YSkge1xuICAgIGxldCB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICAgIHN3aXRjaCAob3BlcmF0b3JOYW1lKSB7XG4gICAgICAgIGNhc2UgXCJhdmdcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvdW50XCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuY291bnQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImN1cnJlbnRcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5jdXJyZW50O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkZWx0YVwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmRlbHRhO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaWZmXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZGlmZjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmlyc3RcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5maXJzdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibG9nbWluXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubG9nbWluO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtYXhcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5tYXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1pblwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLm1pbjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLm1ldHJpY05hbWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRpbWVfc3RlcFwiOlxuICAgICAgICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLnRpbWVTdGVwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJsYXN0X3RpbWVcIjpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS50aW1lc3RhbXA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRvdGFsXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMudG90YWw7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyB2YWx1ZXMsIGxlYXZlcyBtZW1iZXJzIGVtcHR5XG4gICAqL1xuICBzaGFsbG93Q2xvbmUoKTogUG9seXN0YXRNb2RlbCB7XG4gICAgbGV0IGNsb25lID0gbmV3IFBvbHlzdGF0TW9kZWwodGhpcy5vcGVyYXRvck5hbWUsIG51bGwpO1xuICAgIGNsb25lLm9wZXJhdG9yTmFtZSA9IHRoaXMub3BlcmF0b3JOYW1lO1xuICAgIGNsb25lLnRocmVzaG9sZExldmVsID0gdGhpcy50aHJlc2hvbGRMZXZlbDtcbiAgICBjbG9uZS52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgY2xvbmUudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnZhbHVlRm9ybWF0dGVkO1xuICAgIGNsb25lLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgY2xvbmUudGltZXN0YW1wID0gdGhpcy50aW1lc3RhbXA7XG4gICAgY2xvbmUucHJlZml4ID0gdGhpcy5wcmVmaXg7XG4gICAgY2xvbmUuc3VmZml4ID0gdGhpcy5zdWZmaXg7XG4gICAgY2xvbmUuc2VyaWVzUmF3ID0gbnVsbDsgLy8gZm9yIGEgc2hhbGxvdyBjbG9uZSBkcm9wIHRoZSBzZXJpZXNcbiAgICBjbG9uZS5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgY2xvbmUuY2xpY2tUaHJvdWdoID0gdGhpcy5jbGlja1Rocm91Z2g7XG4gICAgY2xvbmUubmV3VGFiRW5hYmxlZCA9IHRoaXMubmV3VGFiRW5hYmxlZDtcbiAgICBjbG9uZS5zYW5pdGl6ZWRVUkwgPSB0aGlzLnNhbml0aXplZFVSTDtcbiAgICBjbG9uZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0aGlzLnNhbml0aXplVVJMRW5hYmxlZDtcbiAgICBjbG9uZS5pc0NvbXBvc2l0ZSA9IHRoaXMuaXNDb21wb3NpdGU7XG4gICAgY2xvbmUubWVtYmVycyA9IFtdOyAvLyB0aGlzLm1lbWJlcnM7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG4gIGRlZXBDbG9uZSgpOiBQb2x5c3RhdE1vZGVsIHtcbiAgICBsZXQgY2xvbmUgPSBuZXcgUG9seXN0YXRNb2RlbCh0aGlzLm9wZXJhdG9yTmFtZSwgbnVsbCk7XG4gICAgY2xvbmUub3BlcmF0b3JOYW1lID0gdGhpcy5vcGVyYXRvck5hbWU7XG4gICAgY2xvbmUudGhyZXNob2xkTGV2ZWwgPSB0aGlzLnRocmVzaG9sZExldmVsO1xuICAgIGNsb25lLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICBjbG9uZS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMudmFsdWVGb3JtYXR0ZWQ7XG4gICAgY2xvbmUubmFtZSA9IHRoaXMubmFtZTtcbiAgICBjbG9uZS50aW1lc3RhbXAgPSB0aGlzLnRpbWVzdGFtcDtcbiAgICBjbG9uZS5wcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICBjbG9uZS5zdWZmaXggPSB0aGlzLnN1ZmZpeDtcbiAgICBjbG9uZS5zZXJpZXNSYXcgPSB0aGlzLnNlcmllc1JhdzsgLy8gZGVlcCBjbG9uZSByZXRhaW5zIHRoZSBzZXJpZXMgKGNhcmVmdWwgb2YgbGVhayEpXG4gICAgY2xvbmUuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgIGNsb25lLmNsaWNrVGhyb3VnaCA9IHRoaXMuY2xpY2tUaHJvdWdoO1xuICAgIGNsb25lLnNhbml0aXplZFVSTCA9IHRoaXMuc2FuaXRpemVkVVJMO1xuICAgIGNsb25lLm5ld1RhYkVuYWJsZWQgPSB0aGlzLm5ld1RhYkVuYWJsZWQ7XG4gICAgY2xvbmUuc2FuaXRpemVVUkxFbmFibGVkID0gdGhpcy5zYW5pdGl6ZVVSTEVuYWJsZWQ7XG4gICAgY2xvbmUuaXNDb21wb3NpdGUgPSB0aGlzLmlzQ29tcG9zaXRlO1xuICAgIGNsb25lLm1lbWJlcnMgPSBbXTsgLy8gdGhpcy5tZW1iZXJzO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxufVxuIl19