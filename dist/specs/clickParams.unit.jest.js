System.register(["../clickParams", "../polystatmodel", "./timeseries"], function (exports_1, context_1) {
    "use strict";
    var clickParams_1, polystatmodel_1, timeseries_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (clickParams_1_1) {
                clickParams_1 = clickParams_1_1;
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
            describe("clickParams", function () {
                var model;
                var aSeries;
                beforeEach(function () {
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
                    model.clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name}";
                });
                describe("Reference a cell name", function () {
                    it("returns cell name", function () {
                        console.log(model);
                        var url = model.clickThrough;
                        var result = clickParams_1.convertSingleMetricParams(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=A-series");
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tQYXJhbXMudW5pdC5qZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NwZWNzL2NsaWNrUGFyYW1zLnVuaXQuamVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQVNBLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVoQyxRQUFRLENBQUMsYUFBYSxFQUFFO2dCQUN0QixJQUFJLEtBQW9CLENBQUM7Z0JBQ3pCLElBQUksT0FBbUIsQ0FBQztnQkFFeEIsVUFBVSxDQUFDO29CQUNULElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2hDLE9BQU8sR0FBRyxJQUFJLHVCQUFVLENBQUM7d0JBQ3ZCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzNELEtBQUssRUFBRSxVQUFVO3dCQUNqQixVQUFVLEVBQUUsVUFBVTt3QkFDdEIsWUFBWSxFQUFFLFNBQVM7cUJBQ3hCLENBQUMsQ0FBQztvQkFDSCxPQUFPLENBQUMsS0FBSyxHQUFHO3dCQUNkLEdBQUcsRUFBRSxHQUFHO3dCQUNSLE9BQU8sRUFBRSxHQUFHO3FCQUNiLENBQUM7b0JBQ0YsS0FBSyxHQUFHLElBQUksNkJBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsMkNBQTJDLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtvQkFDaEMsRUFBRSxDQUFDLG1CQUFtQixFQUFFO3dCQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUM3QixJQUFJLE1BQU0sR0FBRyx1Q0FBeUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztvQkFDN0QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVW5pdCBUZXN0IGZvciBjbGlja1BhcmFtc1xuICovXG5cbmltcG9ydCB7Y29udmVydFNpbmdsZU1ldHJpY1BhcmFtc30gZnJvbSBcIi4uL2NsaWNrUGFyYW1zXCI7XG5cbmltcG9ydCB7UG9seXN0YXRNb2RlbH0gZnJvbSBcIi4uL3BvbHlzdGF0bW9kZWxcIjtcblxuaW1wb3J0IHtUaW1lU2VyaWVzfSBmcm9tIFwiLi90aW1lc2VyaWVzXCI7XG5qZXN0Lm1vY2soXCJhcHAvY29yZS91dGlscy9rYm5cIik7XG5cbmRlc2NyaWJlKFwiY2xpY2tQYXJhbXNcIiwgKCkgPT4ge1xuICBsZXQgbW9kZWw6IFBvbHlzdGF0TW9kZWw7XG4gIGxldCBhU2VyaWVzOiBUaW1lU2VyaWVzO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgYVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IFtbMjAwLCB0aW1lXSwgWzEwMSwgdGltZSArIDFdLCBbNTU1LCB0aW1lICsgMl1dLFxuICAgICAgYWxpYXM6IFwiQS1zZXJpZXNcIixcbiAgICAgIHNlcmllc05hbWU6IFwiQS1zZXJpZXNcIixcbiAgICAgIG9wZXJhdG9yTmFtZTogXCJjdXJyZW50XCIsXG4gICAgfSk7XG4gICAgYVNlcmllcy5zdGF0cyA9IHtcbiAgICAgIGF2ZzogMjg1LFxuICAgICAgY3VycmVudDogMjAwXG4gICAgfTtcbiAgICBtb2RlbCA9IG5ldyBQb2x5c3RhdE1vZGVsKFwiYXZnXCIsIGFTZXJpZXMpO1xuICAgIG1vZGVsLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGxfbmFtZX1cIjtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiUmVmZXJlbmNlIGEgY2VsbCBuYW1lXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBuYW1lXCIsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKG1vZGVsKTtcbiAgICAgIGxldCB1cmwgPSBtb2RlbC5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gY29udmVydFNpbmdsZU1ldHJpY1BhcmFtcyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT1BLXNlcmllc1wiKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==