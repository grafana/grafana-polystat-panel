System.register(["../src/metric_overrides_manager", "../src/polystatmodel", "./timeseries"], function (exports_1, context_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRyaWNfb3ZlcnJpZGVzX21hbmFnZXIudW5pdC5qZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NwZWNzL2V0cmljX292ZXJyaWRlc19tYW5hZ2VyLnVuaXQuamVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQU1BLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVoQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ2pDLElBQUksS0FBb0IsQ0FBQztnQkFDekIsSUFBSSxPQUFtQixDQUFDO2dCQUN4QixJQUFJLEdBQTJCLENBQUM7Z0JBRWhDLFVBQVUsQ0FBQztvQkFDVCxHQUFHLEdBQUcsSUFBSSxpREFBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDaEMsT0FBTyxHQUFHLElBQUksdUJBQVUsQ0FBQzt3QkFDdkIsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDM0QsS0FBSyxFQUFFLFVBQVU7d0JBQ2pCLFVBQVUsRUFBRSxVQUFVO3dCQUN0QixZQUFZLEVBQUUsU0FBUztxQkFDeEIsQ0FBQyxDQUFDO29CQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUc7d0JBQ2QsR0FBRyxFQUFFLEdBQUc7d0JBQ1IsT0FBTyxFQUFFLEdBQUc7cUJBQ2IsQ0FBQztvQkFFRixLQUFLLEdBQUcsSUFBSSw2QkFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLHFCQUFxQixFQUFFO29CQUM5QixFQUFFLENBQUMscUJBQXFCLEVBQUU7d0JBQ3hCLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO3dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciB1dGlsc1xuICovXG5pbXBvcnQge01ldHJpY092ZXJyaWRlc01hbmFnZXJ9IGZyb20gXCIuLi9zcmMvbWV0cmljX292ZXJyaWRlc19tYW5hZ2VyXCI7XG5pbXBvcnQge1BvbHlzdGF0TW9kZWx9IGZyb20gXCIuLi9zcmMvcG9seXN0YXRtb2RlbFwiO1xuaW1wb3J0IHtUaW1lU2VyaWVzfSBmcm9tIFwiLi90aW1lc2VyaWVzXCI7XG5qZXN0Lm1vY2soXCJhcHAvY29yZS91dGlscy9rYm5cIik7XG5cbmRlc2NyaWJlKFwiTWV0cmljT3ZlcnJpZGVzTWFuYWdlclwiLCAoKSA9PiB7XG4gIGxldCBtb2RlbDogUG9seXN0YXRNb2RlbDtcbiAgbGV0IGFTZXJpZXM6IFRpbWVTZXJpZXM7XG4gIGxldCBtZ3I6IE1ldHJpY092ZXJyaWRlc01hbmFnZXI7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgbWdyID0gbmV3IE1ldHJpY092ZXJyaWRlc01hbmFnZXIobnVsbCwgbnVsbCwgbnVsbCwgW10pO1xuICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgYVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IFtbMjAwLCB0aW1lXSwgWzEwMSwgdGltZSArIDFdLCBbNTU1LCB0aW1lICsgMl1dLFxuICAgICAgYWxpYXM6IFwiQS1zZXJpZXNcIixcbiAgICAgIHNlcmllc05hbWU6IFwiQS1zZXJpZXNcIixcbiAgICAgIG9wZXJhdG9yTmFtZTogXCJjdXJyZW50XCIsXG4gICAgfSk7XG4gICAgYVNlcmllcy5zdGF0cyA9IHtcbiAgICAgIGF2ZzogMjg1LFxuICAgICAgY3VycmVudDogMjAwXG4gICAgfTtcblxuICAgIG1vZGVsID0gbmV3IFBvbHlzdGF0TW9kZWwoXCJhdmdcIiwgYVNlcmllcyk7XG4gIH0pO1xuICBkZXNjcmliZShcIkFkZGluZyBuZXcgb3ZlcnJpZGVcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBhbiBvdmVycmlkZVwiLCAoKSA9PiB7XG4gICAgICBtZ3IuYWRkTWV0cmljT3ZlcnJpZGUoKTtcbiAgICAgIGNvbnNvbGUubG9nKG1vZGVsKTtcbiAgICAgIGV4cGVjdChtZ3IubWV0cmljT3ZlcnJpZGVzLmxlbmd0aCkudG9CZSgxKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==