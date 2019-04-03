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
                    modelA.clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
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
                    modelB.clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
                    modelB.valueFormatted = "385 MB/s";
                    model.push(modelB);
                });
                describe("Single Metric: Reference a cell name", function () {
                    it("returns cell name", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=A-series");
                    });
                });
                describe("Single Metric: Reference a cell value with units", function () {
                    it("returns cell value", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285%20MB%2Fs");
                    });
                });
                describe("Single Metric: Reference a raw cell value", function () {
                    it("returns cell raw value", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285");
                    });
                });
                describe("Multiple Metrics: Reference a cell name with index 0", function () {
                    it("returns cell name of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_0}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=A-series");
                    });
                });
                describe("Multiple Metrics: Reference a cell name with index 1", function () {
                    it("returns cell name of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_name_1}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=B-series");
                    });
                });
                describe("Multiple Metrics: Reference a cell formatted value with index 0", function () {
                    it("returns cell formatted value of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_0}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference a cell formatted value with index 1", function () {
                    it("returns cell formatted value of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_1}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=385%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference a cell raw value with index 0", function () {
                    it("returns cell raw value  of metric 0", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_0:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=285");
                    });
                });
                describe("Multiple Metrics: Reference a cell raw value with index 1", function () {
                    it("returns cell raw value of metric 1", function () {
                        model[1].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM=${__cell_1:raw}";
                        var url = model[1].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM=385");
                    });
                });
                describe("Multiple Metrics: Reference multiple metric names", function () {
                    it("returns cell names", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_name_0}&var-CUSTOM1=${__cell_name_1}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=A-series&var-CUSTOM1=B-series");
                    });
                });
                describe("Multiple Metrics: Reference multiple formatted values", function () {
                    it("returns formatted values", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0}&var-CUSTOM1=${__cell_1}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=285%20MB%2Fs&var-CUSTOM1=385%20MB%2Fs");
                    });
                });
                describe("Multiple Metrics: Reference multiple raw values", function () {
                    it("returns formatted values", function () {
                        model[0].clickThrough = "/dashboard/test?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result).toBe("/dashboard/test?orgId=1&var-CUSTOM0=285&var-CUSTOM1=385");
                    });
                });
                describe("Composite: Reference the composite name", function () {
                    it("returns composite name", function () {
                        var compositeName = "CompositeA";
                        var url = "/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}";
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformComposite(compositeName, url);
                        expect(result).toBe("/dashboard/test?orgId=1&var-COMPOSITE=CompositeA");
                    });
                });
                describe("Clickthrough: transformSingleMetric", function () {
                    it("returns non-encoded params", function () {
                        model[0].clickThrough =
                            "https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=${__cell_name}&var-port=9100";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(0, url, model);
                        expect(result)
                            .toBe("https://test.grafana.net/dashboard/instance-details?orgId=1&var-job=node_exporter&var-node=A-series&var-port=9100");
                    });
                });
                describe("Clickthrough: tranformNthMetric", function () {
                    it("returns non-encoded params", function () {
                        model[0].clickThrough =
                            "https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=${__cell_0:raw}&var-CUSTOM1=${__cell_1:raw}&var-port=9100";
                        var url = model[0].clickThrough;
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, model);
                        expect(result)
                            .toBe("https://test.grafana.net/dashboard/instance-details?orgId=1&var-CUSTOM0=285&var-CUSTOM1=385&var-port=9100");
                    });
                });
                describe("Clickthrough: tranformComposite", function () {
                    it("returns non-encoded params", function () {
                        var compositeName = "CompositeA";
                        var url = "https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=${__composite_name}&var-port=9100";
                        var result = clickThroughTransformer_1.ClickThroughTransformer.tranformComposite(compositeName, url);
                        expect(result)
                            .toBe("https://test.grafana.net/dashboard/test?orgId=1&var-COMPOSITE=CompositeA&var-port=9100");
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudW5pdC5qZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NwZWNzL2NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnVuaXQuamVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQVVBLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVoQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFpQixDQUFDO2dCQUN2QyxJQUFJLE9BQW1CLENBQUM7Z0JBRXhCLFVBQVUsQ0FBQztvQkFDVCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNoQyxPQUFPLEdBQUcsSUFBSSx1QkFBVSxDQUFDO3dCQUN2QixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMzRCxLQUFLLEVBQUUsVUFBVTt3QkFDakIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFlBQVksRUFBRSxTQUFTO3FCQUN4QixDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEtBQUssR0FBRzt3QkFDZCxHQUFHLEVBQUUsR0FBRzt3QkFDUixPQUFPLEVBQUUsR0FBRztxQkFDYixDQUFDO29CQUNGLElBQUksTUFBTSxHQUFHLElBQUksNkJBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQy9DLE1BQU0sQ0FBQyxZQUFZLEdBQUcsbURBQW1ELENBQUM7b0JBQzFFLE1BQU0sQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDO29CQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29C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QUNuQixtSUFBbUksQ0FBQzt3QkFDdEksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQzt3QkFDaEMsSUFBSSxNQUFNLEdBQUcsaURBQXVCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNuRSxNQUFNLENBQUMsTUFBTSxDQUFDOzZCQUNYLElBQUksQ0FBQywyR0FBMkcsQ0FBQyxDQUFDO29CQUN2SCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxRQUFRLENBQUMsaUNBQWlDLEVBQUU7b0JBQzFDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTt3QkFDL0IsSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDO3dCQUNqQyxJQUFJLEdBQUcsR0FBRyxpR0FBaUcsQ0FBQzt3QkFDNUcsSUFBSSxNQUFNLEdBQUcsaURBQXVCLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMzRSxNQUFNLENBQUMsTUFBTSxDQUFDOzZCQUNYLElBQUksQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO29CQUNwRyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVbml0IFRlc3QgZm9yIGNsaWNrUGFyYW1zXG4gKi9cblxuaW1wb3J0IHtDbGlja1Rocm91Z2hUcmFuc2Zvcm1lcn0gZnJvbSBcIi4uL2NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyXCI7XG5cbmltcG9ydCB7UG9seXN0YXRNb2RlbH0gZnJvbSBcIi4uL3BvbHlzdGF0bW9kZWxcIjtcblxuaW1wb3J0IHtUaW1lU2VyaWVzfSBmcm9tIFwiLi90aW1lc2VyaWVzXCI7XG5cbmplc3QubW9jayhcImFwcC9jb3JlL3V0aWxzL2tiblwiKTtcblxuZGVzY3JpYmUoXCJDbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiLCAoKSA9PiB7XG4gIGxldCBtb2RlbCA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICBsZXQgYVNlcmllczogVGltZVNlcmllcztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2YXIgdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGFTZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBbWzIwMCwgdGltZV0sIFsxMDEsIHRpbWUgKyAxXSwgWzU1NSwgdGltZSArIDJdXSxcbiAgICAgIGFsaWFzOiBcIkEtc2VyaWVzXCIsXG4gICAgICBzZXJpZXNOYW1lOiBcIkEtc2VyaWVzXCIsXG4gICAgICBvcGVyYXRvck5hbWU6IFwiY3VycmVudFwiLFxuICAgIH0pO1xuICAgIGFTZXJpZXMuc3RhdHMgPSB7XG4gICAgICBhdmc6IDI4NSxcbiAgICAgIGN1cnJlbnQ6IDIwMFxuICAgIH07XG4gICAgbGV0IG1vZGVsQSA9IG5ldyBQb2x5c3RhdE1vZGVsKFwiYXZnXCIsIGFTZXJpZXMpO1xuICAgIG1vZGVsQS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009JHtfX2NlbGxfbmFtZX1cIjtcbiAgICBtb2RlbEEudmFsdWVGb3JtYXR0ZWQgPSBcIjI4NSBNQi9zXCI7XG4gICAgbW9kZWwucHVzaChtb2RlbEEpO1xuICAgIC8vXG4gICAgbGV0IGJTZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBbWzQwMCwgdGltZV0sIFszODUsIHRpbWUgKyAxXSwgWzMwMCwgdGltZSArIDJdXSxcbiAgICAgIGFsaWFzOiBcIkItc2VyaWVzXCIsXG4gICAgICBzZXJpZXNOYW1lOiBcIkItc2VyaWVzXCIsXG4gICAgICBvcGVyYXRvck5hbWU6IFwiY3VycmVudFwiLFxuICAgIH0pO1xuICAgIGJTZXJpZXMuc3RhdHMgPSB7XG4gICAgICBhdmc6IDM4NSxcbiAgICAgIGN1cnJlbnQ6IDMwMFxuICAgIH07XG4gICAgbGV0IG1vZGVsQiA9IG5ldyBQb2x5c3RhdE1vZGVsKFwiYXZnXCIsIGJTZXJpZXMpO1xuICAgIG1vZGVsQi5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009JHtfX2NlbGxfbmFtZX1cIjtcbiAgICBtb2RlbEIudmFsdWVGb3JtYXR0ZWQgPSBcIjM4NSBNQi9zXCI7XG4gICAgbW9kZWwucHVzaChtb2RlbEIpO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJTaW5nbGUgTWV0cmljOiBSZWZlcmVuY2UgYSBjZWxsIG5hbWVcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPSR7X19jZWxsX25hbWV9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMF0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtU2luZ2xlTWV0cmljKDAsIHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009QS1zZXJpZXNcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIlNpbmdsZSBNZXRyaWM6IFJlZmVyZW5jZSBhIGNlbGwgdmFsdWUgd2l0aCB1bml0c1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgdmFsdWVcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPSR7X19jZWxsfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYygwLCB1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPTI4NSUyME1CJTJGc1wiKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiU2luZ2xlIE1ldHJpYzogUmVmZXJlbmNlIGEgcmF3IGNlbGwgdmFsdWVcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIHJhdyB2YWx1ZVwiLCAoKSA9PiB7XG4gICAgICBtb2RlbFswXS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009JHtfX2NlbGw6cmF3fVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYygwLCB1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPTI4NVwiKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiTXVsdGlwbGUgTWV0cmljczogUmVmZXJlbmNlIGEgY2VsbCBuYW1lIHdpdGggaW5kZXggMFwiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgbmFtZSBvZiBtZXRyaWMgMFwiLCAoKSA9PiB7XG4gICAgICBtb2RlbFswXS5jbGlja1Rocm91Z2ggPSBcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009JHtfX2NlbGxfbmFtZV8wfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPUEtc2VyaWVzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgYSBjZWxsIG5hbWUgd2l0aCBpbmRleCAxXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBuYW1lIG9mIG1ldHJpYyAxXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzFdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P29yZ0lkPTEmdmFyLUNVU1RPTT0ke19fY2VsbF9uYW1lXzF9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMV0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009Qi1zZXJpZXNcIik7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcIk11bHRpcGxlIE1ldHJpY3M6IFJlZmVyZW5jZSBhIGNlbGwgZm9ybWF0dGVkIHZhbHVlIHdpdGggaW5kZXggMFwiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGNlbGwgZm9ybWF0dGVkIHZhbHVlIG9mIG1ldHJpYyAwXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzBdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P29yZ0lkPTEmdmFyLUNVU1RPTT0ke19fY2VsbF8wfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPTI4NSUyME1CJTJGc1wiKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiTXVsdGlwbGUgTWV0cmljczogUmVmZXJlbmNlIGEgY2VsbCBmb3JtYXR0ZWQgdmFsdWUgd2l0aCBpbmRleCAxXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCBmb3JtYXR0ZWQgdmFsdWUgb2YgbWV0cmljIDFcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMV0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPSR7X19jZWxsXzF9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMV0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT009Mzg1JTIwTUIlMkZzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgYSBjZWxsIHJhdyB2YWx1ZSB3aXRoIGluZGV4IDBcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIHJhdyB2YWx1ZSAgb2YgbWV0cmljIDBcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPSR7X19jZWxsXzA6cmF3fVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPTI4NVwiKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwiTXVsdGlwbGUgTWV0cmljczogUmVmZXJlbmNlIGEgY2VsbCByYXcgdmFsdWUgd2l0aCBpbmRleCAxXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgY2VsbCByYXcgdmFsdWUgb2YgbWV0cmljIDFcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMV0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPSR7X19jZWxsXzE6cmF3fVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzFdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NPTM4NVwiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyogbXVsdGlwbGUgc3Vic3RpdHV0aW9ucyAqL1xuICBkZXNjcmliZShcIk11bHRpcGxlIE1ldHJpY3M6IFJlZmVyZW5jZSBtdWx0aXBsZSBtZXRyaWMgbmFtZXNcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjZWxsIG5hbWVzXCIsICgpID0+IHtcbiAgICAgIG1vZGVsWzBdLmNsaWNrVGhyb3VnaCA9IFwiL2Rhc2hib2FyZC90ZXN0P29yZ0lkPTEmdmFyLUNVU1RPTTA9JHtfX2NlbGxfbmFtZV8wfSZ2YXItQ1VTVE9NMT0ke19fY2VsbF9uYW1lXzF9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMF0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT00wPUEtc2VyaWVzJnZhci1DVVNUT00xPUItc2VyaWVzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgbXVsdGlwbGUgZm9ybWF0dGVkIHZhbHVlc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGZvcm1hdHRlZCB2YWx1ZXNcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NMD0ke19fY2VsbF8wfSZ2YXItQ1VTVE9NMT0ke19fY2VsbF8xfVwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NMD0yODUlMjBNQiUyRnMmdmFyLUNVU1RPTTE9Mzg1JTIwTUIlMkZzXCIpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoXCJNdWx0aXBsZSBNZXRyaWNzOiBSZWZlcmVuY2UgbXVsdGlwbGUgcmF3IHZhbHVlc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIGZvcm1hdHRlZCB2YWx1ZXNcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID0gXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ1VTVE9NMD0ke19fY2VsbF8wOnJhd30mdmFyLUNVU1RPTTE9JHtfX2NlbGxfMTpyYXd9XCI7XG4gICAgICBsZXQgdXJsID0gbW9kZWxbMF0uY2xpY2tUaHJvdWdoO1xuICAgICAgbGV0IHJlc3VsdCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgbW9kZWwpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShcIi9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DVVNUT00wPTI4NSZ2YXItQ1VTVE9NMT0zODVcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qIGNvbXBvc2l0ZXMgKi9cbiAgZGVzY3JpYmUoXCJDb21wb3NpdGU6IFJlZmVyZW5jZSB0aGUgY29tcG9zaXRlIG5hbWVcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBjb21wb3NpdGUgbmFtZVwiLCAoKSA9PiB7XG4gICAgICBsZXQgY29tcG9zaXRlTmFtZSA9IFwiQ29tcG9zaXRlQVwiO1xuICAgICAgbGV0IHVybCA9IFwiL2Rhc2hib2FyZC90ZXN0P29yZ0lkPTEmdmFyLUNPTVBPU0lURT0ke19fY29tcG9zaXRlX25hbWV9XCI7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1Db21wb3NpdGUoY29tcG9zaXRlTmFtZSwgdXJsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoXCIvZGFzaGJvYXJkL3Rlc3Q/b3JnSWQ9MSZ2YXItQ09NUE9TSVRFPUNvbXBvc2l0ZUFcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qIGVuY29kaW5nICovXG4gIGRlc2NyaWJlKFwiQ2xpY2t0aHJvdWdoOiB0cmFuc2Zvcm1TaW5nbGVNZXRyaWNcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBub24tZW5jb2RlZCBwYXJhbXNcIiwgKCkgPT4ge1xuICAgICAgbW9kZWxbMF0uY2xpY2tUaHJvdWdoID1cbiAgICAgICAgXCJodHRwczovL3Rlc3QuZ3JhZmFuYS5uZXQvZGFzaGJvYXJkL2luc3RhbmNlLWRldGFpbHM/b3JnSWQ9MSZ2YXItam9iPW5vZGVfZXhwb3J0ZXImdmFyLW5vZGU9JHtfX2NlbGxfbmFtZX0mdmFyLXBvcnQ9OTEwMFwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYygwLCB1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpXG4gICAgICAgIC50b0JlKFwiaHR0cHM6Ly90ZXN0LmdyYWZhbmEubmV0L2Rhc2hib2FyZC9pbnN0YW5jZS1kZXRhaWxzP29yZ0lkPTEmdmFyLWpvYj1ub2RlX2V4cG9ydGVyJnZhci1ub2RlPUEtc2VyaWVzJnZhci1wb3J0PTkxMDBcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiQ2xpY2t0aHJvdWdoOiB0cmFuZm9ybU50aE1ldHJpY1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIG5vbi1lbmNvZGVkIHBhcmFtc1wiLCAoKSA9PiB7XG4gICAgICBtb2RlbFswXS5jbGlja1Rocm91Z2ggPVxuICAgICAgICBcImh0dHBzOi8vdGVzdC5ncmFmYW5hLm5ldC9kYXNoYm9hcmQvaW5zdGFuY2UtZGV0YWlscz9vcmdJZD0xJnZhci1DVVNUT00wPSR7X19jZWxsXzA6cmF3fSZ2YXItQ1VTVE9NMT0ke19fY2VsbF8xOnJhd30mdmFyLXBvcnQ9OTEwMFwiO1xuICAgICAgbGV0IHVybCA9IG1vZGVsWzBdLmNsaWNrVGhyb3VnaDtcbiAgICAgIGxldCByZXN1bHQgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybU50aE1ldHJpYyh1cmwsIG1vZGVsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpXG4gICAgICAgIC50b0JlKFwiaHR0cHM6Ly90ZXN0LmdyYWZhbmEubmV0L2Rhc2hib2FyZC9pbnN0YW5jZS1kZXRhaWxzP29yZ0lkPTEmdmFyLUNVU1RPTTA9Mjg1JnZhci1DVVNUT00xPTM4NSZ2YXItcG9ydD05MTAwXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcIkNsaWNrdGhyb3VnaDogdHJhbmZvcm1Db21wb3NpdGVcIiwgKCkgPT4ge1xuICAgIGl0KFwicmV0dXJucyBub24tZW5jb2RlZCBwYXJhbXNcIiwgKCkgPT4ge1xuICAgICAgbGV0IGNvbXBvc2l0ZU5hbWUgPSBcIkNvbXBvc2l0ZUFcIjtcbiAgICAgIGxldCB1cmwgPSBcImh0dHBzOi8vdGVzdC5ncmFmYW5hLm5ldC9kYXNoYm9hcmQvdGVzdD9vcmdJZD0xJnZhci1DT01QT1NJVEU9JHtfX2NvbXBvc2l0ZV9uYW1lfSZ2YXItcG9ydD05MTAwXCI7XG4gICAgICBsZXQgcmVzdWx0ID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1Db21wb3NpdGUoY29tcG9zaXRlTmFtZSwgdXJsKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpXG4gICAgICAgIC50b0JlKFwiaHR0cHM6Ly90ZXN0LmdyYWZhbmEubmV0L2Rhc2hib2FyZC90ZXN0P29yZ0lkPTEmdmFyLUNPTVBPU0lURT1Db21wb3NpdGVBJnZhci1wb3J0PTkxMDBcIik7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==