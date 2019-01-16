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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXNlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3RpbWVzZXJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQUVBO2dCQVVFLG9CQUFZLElBQXVGO29CQUNqRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUN4QyxDQUFDO2dCQUNILGlCQUFDO1lBQUQsQ0FBQyxBQWxCRCxJQWtCQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlciBjbGFzc1xuXG5leHBvcnQgY2xhc3MgVGltZVNlcmllcyB7XG4gIGRhdGFwb2ludHM6IG51bWJlcltdW107XG4gIGFsaWFzOiBzdHJpbmc7XG4gIHRhcmdldDogc3RyaW5nO1xuICBzdGF0czogYW55O1xuICB0aHJlc2hvbGRzOiBhbnlbXTtcbiAgdmFsdWU6IG51bWJlcjtcbiAgc2VyaWVzTmFtZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIG9wZXJhdG9yTmFtZTogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihvcHRzOiB7ZGF0YXBvaW50czogbnVtYmVyW11bXSwgYWxpYXM6IHN0cmluZywgc2VyaWVzTmFtZTogc3RyaW5nLCBvcGVyYXRvck5hbWU6IHN0cmluZ30pIHtcbiAgICB0aGlzLmRhdGFwb2ludHMgPSBvcHRzLmRhdGFwb2ludHM7XG4gICAgdGhpcy5hbGlhcyA9IG9wdHMuYWxpYXM7XG4gICAgdGhpcy50YXJnZXQgPSBvcHRzLmFsaWFzO1xuICAgIHRoaXMuc2VyaWVzTmFtZSA9IG9wdHMuc2VyaWVzTmFtZTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmFsaWFzO1xuICAgIHRoaXMub3BlcmF0b3JOYW1lID0gb3B0cy5vcGVyYXRvck5hbWU7XG4gIH1cbn1cbiJdfQ==