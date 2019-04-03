System.register([], function (exports_1, context_1) {
    "use strict";
    var TimeSeries;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            TimeSeries = (function () {
                function TimeSeries(opts) {
                    this.datapoints = opts.datapoints;
                    this.alias = opts.alias;
                    this.target = opts.alias;
                    this.seriesName = opts.seriesName;
                    this.name = this.alias;
                    this.operatorName = opts.operatorName;
                }
                return TimeSeries;
            }());
            exports_1("TimeSeries", TimeSeries);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXNlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL19fbW9ja3NfXy90aW1lc2VyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFFQTtnQkFVRSxvQkFBWSxJQUF1RjtvQkFDakcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDeEMsQ0FBQztnQkFDSCxpQkFBQztZQUFELENBQUMsQUFsQkQsSUFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIZWxwZXIgY2xhc3NcblxuZXhwb3J0IGNsYXNzIFRpbWVTZXJpZXMge1xuICBkYXRhcG9pbnRzOiBudW1iZXJbXVtdO1xuICBhbGlhczogc3RyaW5nO1xuICB0YXJnZXQ6IHN0cmluZztcbiAgc3RhdHM6IGFueTtcbiAgdGhyZXNob2xkczogYW55W107XG4gIHZhbHVlOiBudW1iZXI7XG4gIHNlcmllc05hbWU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBvcGVyYXRvck5hbWU6IHN0cmluZztcbiAgY29uc3RydWN0b3Iob3B0czoge2RhdGFwb2ludHM6IG51bWJlcltdW10sIGFsaWFzOiBzdHJpbmcsIHNlcmllc05hbWU6IHN0cmluZywgb3BlcmF0b3JOYW1lOiBzdHJpbmd9KSB7XG4gICAgdGhpcy5kYXRhcG9pbnRzID0gb3B0cy5kYXRhcG9pbnRzO1xuICAgIHRoaXMuYWxpYXMgPSBvcHRzLmFsaWFzO1xuICAgIHRoaXMudGFyZ2V0ID0gb3B0cy5hbGlhcztcbiAgICB0aGlzLnNlcmllc05hbWUgPSBvcHRzLnNlcmllc05hbWU7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5hbGlhcztcbiAgICB0aGlzLm9wZXJhdG9yTmFtZSA9IG9wdHMub3BlcmF0b3JOYW1lO1xuICB9XG59XG4iXX0=