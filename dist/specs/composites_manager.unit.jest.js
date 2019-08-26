System.register(["../composites_manager", "../threshold_processor", "../polystatmodel", "./timeseries"], function (exports_1, context_1) {
    "use strict";
    var composites_manager_1, threshold_processor_1, polystatmodel_1, timeseries_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (composites_manager_1_1) {
                composites_manager_1 = composites_manager_1_1;
            },
            function (threshold_processor_1_1) {
                threshold_processor_1 = threshold_processor_1_1;
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
            describe("CompositesManager", function () {
                var aModel;
                var bModel;
                var aSeries;
                var bSeries;
                var mgr;
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
                    aSeries.value = 200;
                    aSeries.thresholds = [];
                    aSeries.thresholds.push({
                        value: 180,
                        state: 1,
                        color: "yellow",
                    });
                    aSeries.thresholds.push({
                        value: 200,
                        state: 2,
                        color: "red",
                    });
                    bSeries = new timeseries_1.TimeSeries({
                        datapoints: [[100, time], [1, time + 1], [42, time + 2]],
                        alias: "B-series",
                        seriesName: "B-series",
                        operatorName: "current",
                    });
                    bSeries.stats = {
                        avg: 68,
                        current: 100
                    };
                    bSeries.value = 100;
                    bSeries.thresholds = [];
                    bSeries.thresholds.push({
                        value: 50,
                        state: 1,
                        color: "yellow",
                    });
                    bSeries.thresholds.push({
                        value: 120,
                        state: 2,
                        color: "red",
                    });
                    aModel = new polystatmodel_1.PolystatModel("current", aSeries);
                    bModel = new polystatmodel_1.PolystatModel("current", bSeries);
                    var aComposite = new composites_manager_1.MetricComposite();
                    aComposite.compositeName = "composite1";
                    aComposite.clickThrough = "";
                    aComposite.enabled = true;
                    aComposite.members = [
                        { seriesName: "A-series" }
                    ];
                    mgr = new composites_manager_1.CompositesManager(null, null, null, [aComposite]);
                });
                describe("Adding new composite", function () {
                    it("returns 2 composites", function () {
                        mgr.addMetricComposite();
                        expect(mgr.metricComposites.length).toBe(2);
                    });
                });
                describe("Matching composites", function () {
                    it("does not find composite5", function () {
                        var found = mgr.matchComposite("composite5");
                        expect(found).toBe(-1);
                    });
                    it("finds composite1", function () {
                        var found = mgr.matchComposite("composite1");
                        expect(found).toBe(0);
                    });
                });
                describe("Worst Series", function () {
                    it("returns A-series", function () {
                        var result = threshold_processor_1.getWorstSeries(aSeries, bSeries, "#ffffff");
                        expect(result.alias).toBe("A-series");
                    });
                    it("returns A-series when aSeries.value is 20", function () {
                        aSeries.stats.current = 20;
                        var result = threshold_processor_1.getWorstSeries(aSeries, bSeries, "#ffffff");
                        expect(result.alias).toBe("A-series");
                    });
                    it("returns B-series when aSeries.value is null", function () {
                        aSeries.value = null;
                        aSeries.stats.current = null;
                        var result = threshold_processor_1.getWorstSeries(aSeries, bSeries, "#ffffff");
                        expect(result.alias).toBe("B-series");
                    });
                    it("returns A-series when aSeries.value and bSeries.value are null", function () {
                        aSeries.value = null;
                        bSeries.value = null;
                        var result = threshold_processor_1.getWorstSeries(aSeries, bSeries, "#ffffff");
                        expect(result.alias).toBe("A-series");
                    });
                });
                describe("Composite Colors", function () {
                    it("returns A-series", function () {
                        var data = mgr.applyComposites([aModel, bModel]);
                        expect(data.length).toBe(3);
                        expect(data[2].color === "green");
                        aModel.value = 181;
                        aModel.valueFormatted = "181";
                        var datax = mgr.applyComposites([aModel, bModel]);
                        expect(datax[2].color).toBe("green");
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLnVuaXQuamVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjcy9jb21wb3NpdGVzX21hbmFnZXIudW5pdC5qZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSUEsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRWhDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDNUIsSUFBSSxNQUFxQixDQUFDO2dCQUMxQixJQUFJLE1BQXFCLENBQUM7Z0JBQzFCLElBQUksT0FBbUIsQ0FBQztnQkFDeEIsSUFBSSxPQUFtQixDQUFDO2dCQUN4QixJQUFJLEdBQXNCLENBQUM7Z0JBRTNCLFVBQVUsQ0FBQztvQkFDVCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNoQyxPQUFPLEdBQUcsSUFBSSx1QkFBVSxDQUFDO3dCQUN2QixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMzRCxLQUFLLEVBQUUsVUFBVTt3QkFDakIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFlBQVksRUFBRSxTQUFTO3FCQUN4QixDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEtBQUssR0FBRzt3QkFDZCxHQUFHLEVBQUUsR0FBRzt3QkFDUixPQUFPLEVBQUUsR0FBRztxQkFDYixDQUFDO29CQUNGLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO29CQUNwQixPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUU7d0JBQ3ZCLEtBQUssRUFBRSxHQUFHO3dCQUNWLEtB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QUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3hDLENBQUMsQ0FBQyxDQUFDO2dCQVVMLENBQUMsQ0FBQyxDQUFDO2dCQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtvQkFDM0IsRUFBRSxDQUFDLGtCQUFrQixFQUFFO3dCQUVyQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBRWpELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUc1QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQzt3QkFDbEMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7d0JBQ25CLE1BQU0sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO3dCQUU5QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBR2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQXlDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlc01hbmFnZXIsIE1ldHJpY0NvbXBvc2l0ZX0gZnJvbSBcIi4uL2NvbXBvc2l0ZXNfbWFuYWdlclwiO1xuaW1wb3J0IHtnZXRXb3JzdFNlcmllc30gZnJvbSBcIi4uL3RocmVzaG9sZF9wcm9jZXNzb3JcIjtcbmltcG9ydCB7UG9seXN0YXRNb2RlbH0gZnJvbSBcIi4uL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7VGltZVNlcmllc30gZnJvbSBcIi4vdGltZXNlcmllc1wiO1xuamVzdC5tb2NrKFwiYXBwL2NvcmUvdXRpbHMva2JuXCIpO1xuXG5kZXNjcmliZShcIkNvbXBvc2l0ZXNNYW5hZ2VyXCIsICgpID0+IHtcbiAgbGV0IGFNb2RlbDogUG9seXN0YXRNb2RlbDtcbiAgbGV0IGJNb2RlbDogUG9seXN0YXRNb2RlbDtcbiAgbGV0IGFTZXJpZXM6IFRpbWVTZXJpZXM7XG4gIGxldCBiU2VyaWVzOiBUaW1lU2VyaWVzO1xuICBsZXQgbWdyOiBDb21wb3NpdGVzTWFuYWdlcjtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2YXIgdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGFTZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBbWzIwMCwgdGltZV0sIFsxMDEsIHRpbWUgKyAxXSwgWzU1NSwgdGltZSArIDJdXSxcbiAgICAgIGFsaWFzOiBcIkEtc2VyaWVzXCIsXG4gICAgICBzZXJpZXNOYW1lOiBcIkEtc2VyaWVzXCIsXG4gICAgICBvcGVyYXRvck5hbWU6IFwiY3VycmVudFwiLFxuICAgIH0pO1xuICAgIGFTZXJpZXMuc3RhdHMgPSB7XG4gICAgICBhdmc6IDI4NSxcbiAgICAgIGN1cnJlbnQ6IDIwMFxuICAgIH07XG4gICAgYVNlcmllcy52YWx1ZSA9IDIwMDtcbiAgICBhU2VyaWVzLnRocmVzaG9sZHMgPSBbXTtcbiAgICBhU2VyaWVzLnRocmVzaG9sZHMucHVzaCgge1xuICAgICAgdmFsdWU6IDE4MCxcbiAgICAgIHN0YXRlOiAxLFxuICAgICAgY29sb3I6IFwieWVsbG93XCIsXG4gICAgfSk7XG4gICAgYVNlcmllcy50aHJlc2hvbGRzLnB1c2goIHtcbiAgICAgIHZhbHVlOiAyMDAsXG4gICAgICBzdGF0ZTogMixcbiAgICAgIGNvbG9yOiBcInJlZFwiLFxuICAgIH0pO1xuICAgIGJTZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBbWzEwMCwgdGltZV0sIFsxLCB0aW1lICsgMV0sIFs0MiwgdGltZSArIDJdXSxcbiAgICAgIGFsaWFzOiBcIkItc2VyaWVzXCIsXG4gICAgICBzZXJpZXNOYW1lOiBcIkItc2VyaWVzXCIsXG4gICAgICBvcGVyYXRvck5hbWU6IFwiY3VycmVudFwiLFxuICAgIH0pO1xuICAgIGJTZXJpZXMuc3RhdHMgPSB7XG4gICAgICBhdmc6IDY4LFxuICAgICAgY3VycmVudDogMTAwXG4gICAgfTtcbiAgICBiU2VyaWVzLnZhbHVlID0gMTAwO1xuICAgIGJTZXJpZXMudGhyZXNob2xkcyA9IFtdO1xuICAgIGJTZXJpZXMudGhyZXNob2xkcy5wdXNoKCB7XG4gICAgICB2YWx1ZTogNTAsXG4gICAgICBzdGF0ZTogMSxcbiAgICAgIGNvbG9yOiBcInllbGxvd1wiLFxuICAgIH0pO1xuICAgIGJTZXJpZXMudGhyZXNob2xkcy5wdXNoKCB7XG4gICAgICB2YWx1ZTogMTIwLFxuICAgICAgc3RhdGU6IDIsXG4gICAgICBjb2xvcjogXCJyZWRcIixcbiAgICB9KTtcbiAgICBhTW9kZWwgPSBuZXcgUG9seXN0YXRNb2RlbChcImN1cnJlbnRcIiwgYVNlcmllcyk7XG4gICAgYk1vZGVsID0gbmV3IFBvbHlzdGF0TW9kZWwoXCJjdXJyZW50XCIsIGJTZXJpZXMpO1xuXG4gICAgbGV0IGFDb21wb3NpdGUgPSBuZXcgTWV0cmljQ29tcG9zaXRlKCk7XG4gICAgYUNvbXBvc2l0ZS5jb21wb3NpdGVOYW1lID0gXCJjb21wb3NpdGUxXCI7XG4gICAgYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2ggPSBcIlwiO1xuICAgIGFDb21wb3NpdGUuZW5hYmxlZCA9IHRydWU7XG4gICAgYUNvbXBvc2l0ZS5tZW1iZXJzID0gW1xuICAgICAge3Nlcmllc05hbWU6IFwiQS1zZXJpZXNcIn1cbiAgICBdO1xuICAgIG1nciA9IG5ldyBDb21wb3NpdGVzTWFuYWdlcihudWxsLCBudWxsLCBudWxsLCBbYUNvbXBvc2l0ZV0pO1xuICB9KTtcblxuICBkZXNjcmliZShcIkFkZGluZyBuZXcgY29tcG9zaXRlXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgMiBjb21wb3NpdGVzXCIsICgpID0+IHtcbiAgICAgIG1nci5hZGRNZXRyaWNDb21wb3NpdGUoKTtcbiAgICAgIGV4cGVjdChtZ3IubWV0cmljQ29tcG9zaXRlcy5sZW5ndGgpLnRvQmUoMik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qIG5lZWRzIHJlYWwga2JuLCBub3QgYSBtb2NrICovXG4gIGRlc2NyaWJlKFwiTWF0Y2hpbmcgY29tcG9zaXRlc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJkb2VzIG5vdCBmaW5kIGNvbXBvc2l0ZTVcIiwgKCkgPT4ge1xuICAgICAgbGV0IGZvdW5kID0gbWdyLm1hdGNoQ29tcG9zaXRlKFwiY29tcG9zaXRlNVwiKTtcbiAgICAgIGV4cGVjdChmb3VuZCkudG9CZSgtMSk7XG4gICAgfSk7XG4gICAgaXQoXCJmaW5kcyBjb21wb3NpdGUxXCIsICgpID0+IHtcbiAgICAgIGxldCBmb3VuZCA9IG1nci5tYXRjaENvbXBvc2l0ZShcImNvbXBvc2l0ZTFcIik7XG4gICAgICBleHBlY3QoZm91bmQpLnRvQmUoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiV29yc3QgU2VyaWVzXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgQS1zZXJpZXNcIiwgKCkgPT4ge1xuICAgICAgbGV0IHJlc3VsdCA9IGdldFdvcnN0U2VyaWVzKGFTZXJpZXMsIGJTZXJpZXMsIFwiI2ZmZmZmZlwiKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxpYXMpLnRvQmUoXCJBLXNlcmllc1wiKTtcbiAgICB9KTtcbiAgICBpdChcInJldHVybnMgQS1zZXJpZXMgd2hlbiBhU2VyaWVzLnZhbHVlIGlzIDIwXCIsICgpID0+IHtcbiAgICAgIGFTZXJpZXMuc3RhdHMuY3VycmVudCA9IDIwO1xuICAgICAgbGV0IHJlc3VsdCA9IGdldFdvcnN0U2VyaWVzKGFTZXJpZXMsIGJTZXJpZXMsIFwiI2ZmZmZmZlwiKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxpYXMpLnRvQmUoXCJBLXNlcmllc1wiKTtcbiAgICB9KTtcbiAgICBpdChcInJldHVybnMgQi1zZXJpZXMgd2hlbiBhU2VyaWVzLnZhbHVlIGlzIG51bGxcIiwgKCkgPT4ge1xuICAgICAgYVNlcmllcy52YWx1ZSA9IG51bGw7XG4gICAgICBhU2VyaWVzLnN0YXRzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgbGV0IHJlc3VsdCA9IGdldFdvcnN0U2VyaWVzKGFTZXJpZXMsIGJTZXJpZXMsIFwiI2ZmZmZmZlwiKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxpYXMpLnRvQmUoXCJCLXNlcmllc1wiKTtcbiAgICB9KTtcbiAgICBpdChcInJldHVybnMgQS1zZXJpZXMgd2hlbiBhU2VyaWVzLnZhbHVlIGFuZCBiU2VyaWVzLnZhbHVlIGFyZSBudWxsXCIsICgpID0+IHtcbiAgICAgIGFTZXJpZXMudmFsdWUgPSBudWxsO1xuICAgICAgYlNlcmllcy52YWx1ZSA9IG51bGw7XG4gICAgICBsZXQgcmVzdWx0ID0gZ2V0V29yc3RTZXJpZXMoYVNlcmllcywgYlNlcmllcywgXCIjZmZmZmZmXCIpO1xuICAgICAgZXhwZWN0KHJlc3VsdC5hbGlhcykudG9CZShcIkEtc2VyaWVzXCIpO1xuICAgIH0pO1xuXG4gICAgLyogdGVzdCBmb3Igbm9kYXRhXG4gICAgICAgIGlmIChzZXJpZXMxLm5hbWUgPT09IFwiR1BVXzBcIikge1xuICAgICAgICAgIHNlcmllczEudmFsdWUgPSBOYU47XG4gICAgICAgICAgc2VyaWVzMS52YWx1ZUZvcm1hdHRlZCA9IFwiXCI7XG4gICAgICAgICAgc2VyaWVzMS52YWx1ZVJvdW5kZWQgPSBOYU47XG4gICAgICAgICAgc2VyaWVzMS5zdGF0cy5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICovXG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiQ29tcG9zaXRlIENvbG9yc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIEEtc2VyaWVzXCIsICgpID0+IHtcbiAgICAgIC8vbGV0IGRhdGEgPSBtZ3IuYXBwbHlDb21wb3NpdGVzKFthU2VyaWVzLCBiU2VyaWVzXSk7XG4gICAgICBsZXQgZGF0YSA9IG1nci5hcHBseUNvbXBvc2l0ZXMoW2FNb2RlbCwgYk1vZGVsXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZGF0YSBpczogXCIgKyBkYXRhKTtcbiAgICAgIGV4cGVjdChkYXRhLmxlbmd0aCkudG9CZSgzKTtcbiAgICAgIC8vdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGFbMl0sIG51bGwsIDIpOyAvLyBzcGFjaW5nIGxldmVsID0gMlxuICAgICAgLy9jb25zb2xlLmxvZyhcImRhdGFbMl0gaXM6IFwiICsgc3RyKTtcbiAgICAgIGV4cGVjdChkYXRhWzJdLmNvbG9yID09PSBcImdyZWVuXCIpO1xuICAgICAgYU1vZGVsLnZhbHVlID0gMTgxO1xuICAgICAgYU1vZGVsLnZhbHVlRm9ybWF0dGVkID0gXCIxODFcIjtcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0cnlpbmcgdmFsdWUgMjBcIik7XG4gICAgICBsZXQgZGF0YXggPSBtZ3IuYXBwbHlDb21wb3NpdGVzKFthTW9kZWwsIGJNb2RlbF0pO1xuICAgICAgLy9zdHIgPSBKU09OLnN0cmluZ2lmeShkYXRheFsyXSwgbnVsbCwgMik7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZGF0YXhbMl0gaXM6IFwiICsgc3RyKTtcbiAgICAgIGV4cGVjdChkYXRheFsyXS5jb2xvcikudG9CZShcImdyZWVuXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICAvKlxuICBkZXNjcmliZShcIlNlcmllcyBUaHJlc2hvbGRzXCIsICgpID0+IHtcbiAgICBpdChcIkEtc2VyaWVzIHRocmVzaG9sZCBsZXZlbCBpcyBjcml0aWNhbFwiLCAoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gbWdyLmdldFRocmVzaG9sZExldmVsRm9yU2VyaWVzVmFsdWUoYVNlcmllcyk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKDIpO1xuICAgIH0pO1xuICAgIGl0KFwiQi1zZXJpZXMgdGhyZXNob2xkIGxldmVsIGlzIHdhcm5pbmdcIiwgKCkgPT4ge1xuICAgICAgbGV0IHJlc3VsdCA9IG1nci5nZXRUaHJlc2hvbGRMZXZlbEZvclNlcmllc1ZhbHVlKGJTZXJpZXMpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgxKTtcbiAgICB9KTtcbiAgICBpdChcIkEtc2VyaWVzIHRocmVzaG9sZCBsZXZlbCBpcyB3YXJuaW5nXCIsICgpID0+IHtcbiAgICAgIGFTZXJpZXMudmFsdWUgPSAxODE7XG4gICAgICBsZXQgcmVzdWx0ID0gbWdyLmdldFRocmVzaG9sZExldmVsRm9yU2VyaWVzVmFsdWUoYVNlcmllcyk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKDEpO1xuICAgIH0pO1xuICAgIGl0KFwiQS1zZXJpZXMgdGhyZXNob2xkIGxldmVsIGlzIG9rXCIsICgpID0+IHtcbiAgICAgIGFTZXJpZXMudmFsdWUgPSAyMDtcbiAgICAgIGxldCByZXN1bHQgPSBtZ3IuZ2V0VGhyZXNob2xkTGV2ZWxGb3JTZXJpZXNWYWx1ZShhU2VyaWVzKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoMCk7XG4gICAgfSk7XG4gICAgaXQoXCJBLXNlcmllcyB0aHJlc2hvbGQgbGV2ZWwgaXMgdW5rbm93blwiLCAoKSA9PiB7XG4gICAgICBhU2VyaWVzLnZhbHVlID0gbnVsbDtcbiAgICAgIGxldCByZXN1bHQgPSBtZ3IuZ2V0VGhyZXNob2xkTGV2ZWxGb3JTZXJpZXNWYWx1ZShhU2VyaWVzKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoMyk7XG4gICAgfSk7XG4gIH0pO1xuICAqL1xuICAvLyBhcHBseSBjb21wb3NpdGUgdGVzdFxuXG4gIC8qIG5lZWRzIGEgbW9jayBmb3IgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7ICovXG4gIC8qXG4gIGRlc2NyaWJlKFwiUmVtb3ZpbmcgbWV0cmljIGZyb20gY29tcG9zaXRlXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgMSBjb21wb3NpdGVcIiwgKCkgPT4ge1xuICAgICAgbGV0IGFDb21wb3NpdGUgPSBtZ3IubWV0cmljQ29tcG9zaXRlc1swXTtcbiAgICAgIG1nci5yZW1vdmVNZXRyaWNGcm9tQ29tcG9zaXRlKGFDb21wb3NpdGUsIFwiQS1TZXJpZXNcIik7XG4gICAgICBleHBlY3QobWdyLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgIH0pO1xuICB9KTtcbiAgKi9cbn0pO1xuIl19