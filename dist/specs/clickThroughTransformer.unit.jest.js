System.register(["../clickThroughTransformer", "../polystatmodel", "./timeseries"], function (exports_1, context_1) {
    "use strict";
    var clickThroughTransformer_1, polystatmodel_1, timeseries_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (clickThroughTransformer_1_1) {
                clickThroughTransformer_1 = clickThroughTransformer_1_1;
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
            describe("ClickThroughTransformer", function () {
                var model = new Array();
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
                    var modelA = new polystatmodel_1.PolystatModel("avg", aSeries);
                    modelA.clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name}";
                    modelA.valueFormatted = "285 MB/s";
                    model.push(modelA);
                    var bSeries = new timeseries_1.TimeSeries({
                        datapoints: [[400, time], [385, time + 1], [300, time + 2]],
                        alias: "B-series",
                        seriesName: "B-series",
                        operatorName: "current",
                    });
                    bSeries.stats = {
                        avg: 385,
                        current: 300
                    };
                    var modelB = new polystatmodel_1.PolystatModel("avg", bSeries);
                    modelB.clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name}";
                    modelB.valueFormatted = "385 MB/s";
                    model.push(modelB);
                });
                describe("Single Metric: Reference a cell name", function () {
                    it("returns cell name", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=A-series");
                    });
                });
                describe("Single Metric: Reference a cell value with units", function () {
                    it("returns cell value", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=285%20MB%2Fs");
                    });
                });
                describe("Single Metric: Reference a raw cell value", function () {
                    it("returns cell raw value", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=285");
                    });
                });
                describe("Multiple Metrics: Reference a cell name with index 0", function () {
                    it("returns cell name of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name_0}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=A-series");
                    });
                });
                describe("Multiple Metrics: Reference a cell name with index 1", function () {
                    it("returns cell name of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_name_1}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=B-series");
                    });
                });
                describe("Multiple Metrics: Reference a cell formatted value with index 0", function () {
                    it("returns cell formatted value of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_0}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=285%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference a cell formatted value with index 1", function () {
                    it("returns cell formatted value of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_1}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=385%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference a cell raw value with index 0", function () {
                    it("returns cell raw value  of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_0:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=285");
                    });
                });
                describe("Multiple Metrics: Reference a cell raw value with index 1", function () {
                    it("returns cell raw value of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?var-CUSTOM=${__cell_1:raw}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM=385");
                    });
                });
                describe("Multiple Metrics: Reference multiple metric names", function () {
                    it("returns cell names", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM0=${__cell_name_0}&var-CUSTOM1=${__cell_name_1}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM0=A-series&var-CUSTOM1=B-series");
                    });
                });
                describe("Multiple Metrics: Reference multiple formatted values", function () {
                    it("returns formatted values", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM0=${__cell_0}&var-CUSTOM1=${__cell_1}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM0=285%20MB%2Fs&var-CUSTOM1=385%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference multiple raw values", function () {
                    it("returns formatted values", function () {
                        model[0].clickThrough = "/dashboard/test?var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?var-CUSTOM0=285&var-CUSTOM1=385");
                    });
                });
                describe("Composite: Reference the composite name", function () {
                    it("returns composite name", function () {
                        var compositeName = "CompositeA";
                        var url = "/dashboard/test?var-COMPOSITE=${__composite_name}";
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformComposite(compositeName, url);
                        expect(result).toBe("/dashboard/test?var-COMPOSITE=CompositeA");
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudW5pdC5qZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NwZWNzL2NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnVuaXQuamVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQVNBLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVoQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFpQixDQUFDO2dCQUN2QyxJQUFJLE9BQW1CLENBQUM7Z0JBRXhCLFVBQVUsQ0FBQztvQkFDVCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNoQyxPQUFPLEdBQUcsSUFBSSx1QkFBVSxDQUFDO3dCQUN2QixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMzRCxLQUFLLEVBQUUsVUFBVTt3QkFDakIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFlBQVksRUFBRSxTQUFTO3FCQUN4QixDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEtBQUssR0FBRzt3QkFDZCxHQUFHLEVBQUUsR0FBRzt3QkFDUixPQUFPLEVBQUUsR0FBRztxQkFDYixDQUFDO29CQUNGLElBQUksTUFBTSxHQUFHLElBQUksNkJBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQy9DLE1BQU0sQ0FBQyxZQUFZLEdBQUcsMkNBQTJDLENBQUM7b0JBQ2xFLE1BQU0sQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDO29CQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29C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QUcsaURBQXVCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNuRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7b0JBQ3pFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUdILFFBQVEsQ0FBQyx5Q0FBeUMsRUFBRTtvQkFDbEQsRUFBRSxDQUFDLHdCQUF3QixFQUFFO3dCQUMzQixJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUM7d0JBQ2pDLElBQUksR0FBRyxHQUFHLG1EQUFtRCxDQUFDO3dCQUM5RCxJQUFJLE1BQU0sR0FBRyxpREFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzNFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztvQkFDbEUsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVW5pdCBUZXN0IGZvciBjbGlja1BhcmFtc1xuICovXG5cbmltcG9ydCB7Q2xpY2tUaHJvdWdoVHJhbnNmb3JtZXJ9IGZyb20gXCIuLi9jbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiO1xuXG5pbXBvcnQge1BvbHlzdGF0TW9kZWx9IGZyb20gXCIuLi9wb2x5c3RhdG1vZGVsXCI7XG5cbmltcG9ydCB7VGltZVNlcmllc30gZnJvbSBcIi4vdGltZXNlcmllc1wiO1xuamVzdC5tb2NrKFwiYXBwL2NvcmUvdXRpbHMva2JuXCIpO1xuXG5kZXNjcmliZShcIkNsaWNrVGhyb3VnaFRyYW5zZm9ybWVyXCIsICgpID0+IHtcbiAgbGV0IG1vZGVsID0gbmV3IEFycmF5PFBvbHlzdGF0TW9kZWw+KCk7XG4gIGxldCBhU2VyaWVzOiBUaW1lU2VyaWVzO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgYVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IFtbMjAwLCB0aW1lXSwgWzEwMSwgdGltZSArIDFdLCBbNTU1LCB0aW1lICsgMl1dLFxuICAgICAgYWxpYXM6IFwiQS1zZXJpZXNcIixcbiAgICAgIHNlcmllc05hbWU6IFwiQS1zZXJpZXNcIixcbiAgICAgIG9wZXJhdG9yTmFtZTogXCJjdXJyZW50XCIsXG4gICAgfSk7XG4gICAgYVNlcmllcy5zdGF0cyA9IHtcbiAgICAgIGF2ZzogMjg1LFxuICAgICAgY3VycmVudDogMjAwXG4gICAgfTtcbiAgICBsZXQgbW9kZWxBID0gbmV3IFBvbHlzdGF0TW9kZWwoXCJhdmdcIiwgYVNlcmllcyk7XG4gICAgbW9kZWxBLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGxfbmFtZX1cIjtcbiAgICBtb2RlbEEudmFsdWVGb3JtYXR0ZWQgPSBcIjI4NSBNQi9zXCI7XG4gICAgbW9kZWwucHVzaChtb2RlbEEpO1xuICAgIC8vXG4gICAgbGV0IGJTZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBbWzQwMCwgdGltZV0sIFszODUsIHRpbWUgKyAxXSwgWzMwMCwgdGltZSArIDJdXSxcbiAgICAgIGFsaWFzOiBcIkItc2VyaWVzXCIsXG4gICAgICBzZXJpZXNOYW1lOiBcIkItc2VyaWVzXCIsXG4gICAgICBvcGVyYXRvck5hbWU6IFwiY3VycmVudFwiLFxuICAgIH0pO1xuICAgIGJTZXJpZXMuc3RhdHMgPSB7XG4gICAgICBhdmc6IDM4NSxcbiAgICAgIGN1cnJlbnQ6IDMwMFxuICAgIH07XG4gICAgbGV0IG1vZGVsQiA9IG5ldyBQb2x5c3RhdE1vZGVsKFwiYXZnXCIsIGJTZXJpZXMpO1xuICAgIG1vZGVsQi5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NPSR7X19jZWxsX25hbWV9XCI7XG4gICAgbW9kZWxCLnZhbHVlRm9ybWF0dGVkID0gXCIzODUgTUIvc1wiO1xuICAgIG1vZGVsLnB1c2gobW9kZWxCKTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiU2luZ2xlIE1ldHJpYzogUmVmZXJlbmNlIGEgY2VsbCBuYW1lXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBuYW1lXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzBdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGxfbmFtZX1cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFswXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1TaW5nbGVNZXRyaWMoMCwgdXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009QS1zZXJpZXNcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIlNpbmdsZSBNZXRyaWM6IFJlZmVyZW5jZSBhIGNlbGwgdmFsdWUgd2l0aCB1bml0c1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgdmFsdWVcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0ke19fY2VsbH1cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFswXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1TaW5nbGVNZXRyaWMoMCwgdXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009Mjg1JTIwTUIlMkZzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJTaW5nbGUgTWV0cmljOiBSZWZlcmVuY2UgYSByYXcgY2VsbCB2YWx1ZVwiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgcmF3IHZhbHVlXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzBdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGw6cmF3fVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYygwLCB1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0yODVcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIk11bHRpcGxlIE1ldHJpY3M6IFJlZmVyZW5jZSBhIGNlbGwgbmFtZSB3aXRoIGluZGV4IDBcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIG5hbWUgb2YgbWV0cmljIDBcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0ke19fY2VsbF9uYW1lXzB9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMF0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NPUEtc2VyaWVzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgYSBjZWxsIG5hbWUgd2l0aCBpbmRleCAxXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBuYW1lIG9mIG1ldHJpYyAxXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzFdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGxfbmFtZV8xfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzFdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT1CLXNlcmllc1wiKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiTXVsdGlwbGUgTWV0cmljczogUmVmZXJlbmNlIGEgY2VsbCBmb3JtYXR0ZWQgdmFsdWUgd2l0aCBpbmRleCAwXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBmb3JtYXR0ZWQgdmFsdWUgb2YgbWV0cmljIDBcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0ke19fY2VsbF8wfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0yODUlMjBNQiUyRnNcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIk11bHRpcGxlIE1ldHJpY3M6IFJlZmVyZW5jZSBhIGNlbGwgZm9ybWF0dGVkIHZhbHVlIHdpdGggaW5kZXggMVwiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgZm9ybWF0dGVkIHZhbHVlIG9mIG1ldHJpYyAxXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzFdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009JHtfX2NlbGxfMX1cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFsxXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009Mzg1JTIwTUIlMkZzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgYSBjZWxsIHJhdyB2YWx1ZSB3aXRoIGluZGV4IDBcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIHJhdyB2YWx1ZSAgb2YgbWV0cmljIDBcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0ke19fY2VsbF8wOnJhd31cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFswXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT009Mjg1XCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgYSBjZWxsIHJhdyB2YWx1ZSB3aXRoIGluZGV4IDFcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIHJhdyB2YWx1ZSBvZiBtZXRyaWMgMVwiLCAoKSA9PiB7XG4gICAgICBtb2RlbFsxXS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NPSR7X19jZWxsXzE6cmF3fVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzFdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTT0zODVcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qIG11bHRpcGxlIHN1YnN0aXR1dGlvbnMgKi9cbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgbXVsdGlwbGUgbWV0cmljIG5hbWVzXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBuYW1lc1wiLCAoKSA9PiB7XG4gICAgICBtb2RlbFswXS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NMD0ke19fY2VsbF9uYW1lXzB9JnZhci1DVVNUT00xPSR7X19jZWxsX25hbWVfMX1cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFswXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT00wPUEtc2VyaWVzJnZhci1DVVNUT00xPUItc2VyaWVzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgbXVsdGlwbGUgZm9ybWF0dGVkIHZhbHVlc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGZvcm1hdHRlZCB2YWx1ZXNcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/dmFyLUNVU1RPTTA9JHtfX2NlbGxfMH0mdmFyLUNVU1RPTTE9JHtfX2NlbGxfMX1cIjtcbiAgICAgIGxldCB1cmwgPSBtb2RlbFswXS5jbGlja1Rocm91Z2g7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCBtb2RlbCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKFwiL2Rhc2hib2FyZC90ZXN0P3Zhci1DVVNUT00wPTI4NSUyME1CJTJGcyZ2YXItQ1VTVE9NMT0zODUlMjBNQiUyRnNcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIk11bHRpcGxlIE1ldHJpY3M6IFJlZmVyZW5jZSBtdWx0aXBsZSByYXcgdmFsdWVzXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgZm9ybWF0dGVkIHZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICBtb2RlbFswXS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NMD0ke19fY2VsbF8wOnJhd30mdmFyLUNVU1RPTTE9JHtfX2NlbGxfMTpyYXd9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMF0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD92YXItQ1VTVE9NMD0yODUmdmFyLUNVU1RPTTE9Mzg1XCIpO1xuICAgIH0pO1xuICB9KTtcblxuICAvKiBjb21wb3NpdGVzICovXG4gIGRlc2NyaWJlKFwiQ29tcG9zaXRlOiBSZWZlcmVuY2UgdGhlIGNvbXBvc2l0ZSBuYW1lXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY29tcG9zaXRlIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgbGV0IGNvbXBvc2l0ZU5hbWUgPSBcIkNvbXBvc2l0ZUFcIjtcbiAgICAgIGxldCB1cmwgPSBcIi9kYXNoYm9hcmQvdGVzdD92YXItQ09NUE9TSVRFPSR7X19jb21wb3NpdGVfbmFtZX1cIjtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybUNvbXBvc2l0ZShjb21wb3NpdGVOYW1lLCB1cmwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD92YXItQ09NUE9TSVRFPUNvbXBvc2l0ZUFcIik7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==