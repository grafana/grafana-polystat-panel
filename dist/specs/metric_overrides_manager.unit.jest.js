System.register(["../metric_overrides_manager", "../polystatmodel", "./timeseries"], function (exports_1, context_1) {
    "use strict";
    var metric_overrides_manager_1, polystatmodel_1, timeseries_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (metric_overrides_manager_1_1) {
                metric_overrides_manager_1 = metric_overrides_manager_1_1;
            },
            function (polystatmodel_1_1) {
                polystatmodel_1 = polystatmodel_1_1;
            },
            function (timeseries_1_1) {
                timeseries_1 = timeseries_1_1;
            }
        ],
        execute: function () {
            jest.mock("app/core/utils/kbn");
            describe("MetricOverridesManager", function () {
                var model;
                var aSeries;
                var mgr;
                beforeEach(function () {
                    mgr = new metric_overrides_manager_1.MetricOverridesManager(null, null, null, []);
                    var time = new Date().getTime();
                    aSeries = new timeseries_1.TimeSeries({
                        datapoints: [[200, time], [101, time + 1], [555, time + 2]],
                        alias: "A-series",
                        seriesName: "A-series",
                        operatorName: "current",
                    });
                    aSeries.stats = {
                        avg: 285,
                        current: 200
                    };
                    model = new polystatmodel_1.PolystatModel("avg", aSeries);
                });
                describe("Adding new override", function () {
                    it("returns an override", function () {
                        mgr.addMetricOverride();
                        console.log(model);
                        expect(mgr.metricOverrides.length).toBe(1);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljX292ZXJyaWRlc19tYW5hZ2VyLnVuaXQuamVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjcy9tZXRyaWNfb3ZlcnJpZGVzX21hbmFnZXIudW5pdC5qZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBT0EsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRWhDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDakMsSUFBSSxLQUFvQixDQUFDO2dCQUN6QixJQUFJLE9BQW1CLENBQUM7Z0JBQ3hCLElBQUksR0FBMkIsQ0FBQztnQkFFaEMsVUFBVSxDQUFDO29CQUNULEdBQUcsR0FBRyxJQUFJLGlEQUFzQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNoQyxPQUFPLEdBQUcsSUFBSSx1QkFBVSxDQUFDO3dCQUN2QixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMzRCxLQUFLLEVBQUUsVUFBVTt3QkFDakIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFlBQVksRUFBRSxTQUFTO3FCQUN4QixDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEtBQUssR0FBRzt3QkFDZCxHQUFHLEVBQUUsR0FBRzt3QkFDUixPQUFPLEVBQUUsR0FBRztxQkFDYixDQUFDO29CQUVGLEtBQUssR0FBRyxJQUFJLDZCQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7b0JBQzlCLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTt3QkFDeEIsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7d0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIHV0aWxzXG4gKi9cbmltcG9ydCB7TWV0cmljT3ZlcnJpZGVzTWFuYWdlcn0gZnJvbSBcIi4uL21ldHJpY19vdmVycmlkZXNfbWFuYWdlclwiO1xuaW1wb3J0IHtQb2x5c3RhdE1vZGVsfSBmcm9tIFwiLi4vcG9seXN0YXRtb2RlbFwiO1xuXG5pbXBvcnQge1RpbWVTZXJpZXN9IGZyb20gXCIuL3RpbWVzZXJpZXNcIjtcbmplc3QubW9jayhcImFwcC9jb3JlL3V0aWxzL2tiblwiKTtcblxuZGVzY3JpYmUoXCJNZXRyaWNPdmVycmlkZXNNYW5hZ2VyXCIsICgpID0+IHtcbiAgbGV0IG1vZGVsOiBQb2x5c3RhdE1vZGVsO1xuICBsZXQgYVNlcmllczogVGltZVNlcmllcztcbiAgbGV0IG1ncjogTWV0cmljT3ZlcnJpZGVzTWFuYWdlcjtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBtZ3IgPSBuZXcgTWV0cmljT3ZlcnJpZGVzTWFuYWdlcihudWxsLCBudWxsLCBudWxsLCBbXSk7XG4gICAgdmFyIHRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBhU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgZGF0YXBvaW50czogW1syMDAsIHRpbWVdLCBbMTAxLCB0aW1lICsgMV0sIFs1NTUsIHRpbWUgKyAyXV0sXG4gICAgICBhbGlhczogXCJBLXNlcmllc1wiLFxuICAgICAgc2VyaWVzTmFtZTogXCJBLXNlcmllc1wiLFxuICAgICAgb3BlcmF0b3JOYW1lOiBcImN1cnJlbnRcIixcbiAgICB9KTtcbiAgICBhU2VyaWVzLnN0YXRzID0ge1xuICAgICAgYXZnOiAyODUsXG4gICAgICBjdXJyZW50OiAyMDBcbiAgICB9O1xuXG4gICAgbW9kZWwgPSBuZXcgUG9seXN0YXRNb2RlbChcImF2Z1wiLCBhU2VyaWVzKTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiQWRkaW5nIG5ldyBvdmVycmlkZVwiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGFuIG92ZXJyaWRlXCIsICgpID0+IHtcbiAgICAgIG1nci5hZGRNZXRyaWNPdmVycmlkZSgpO1xuICAgICAgY29uc29sZS5sb2cobW9kZWwpO1xuICAgICAgZXhwZWN0KG1nci5tZXRyaWNPdmVycmlkZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19