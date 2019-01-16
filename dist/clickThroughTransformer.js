System.register([], function (exports_1, context_1) {
    "use strict";
    var ClickThroughTransformer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ClickThroughTransformer = (function () {
                function ClickThroughTransformer() {
                }
                ClickThroughTransformer.tranformSingleMetric = function (index, url, data) {
                    if (isNaN(index)) {
                        return url;
                    }
                    var item = data[index];
                    if (url.match(this.cellName)) {
                        url = url.replace(this.cellName, item.name);
                    }
                    if (url.match(this.cellValue)) {
                        url = url.replace(this.cellValue, encodeURIComponent(item.valueFormatted));
                    }
                    if (url.match(this.cellRawValue)) {
                        url = url.replace(this.cellRawValue, item.value.toString());
                    }
                    return url;
                };
                ClickThroughTransformer.tranformNthMetric = function (url, data) {
                    while (url.match(this.nthCellName)) {
                        var matched = url.match(this.nthCellName);
                        if (matched.length >= 2) {
                            var captureIndex = matched[1];
                            var nthName = data[captureIndex].name;
                            url = url.replace(this.nthCellName, nthName);
                        }
                    }
                    while (url.match(this.nthCellValue)) {
                        var matched = url.match(this.nthCellValue);
                        if (matched.length >= 2) {
                            var captureIndex = matched[1];
                            var nthValue = data[captureIndex].valueFormatted;
                            url = url.replace(this.nthCellValue, encodeURIComponent(nthValue));
                        }
                    }
                    while (url.match(this.nthCellRawValue)) {
                        var matched = url.match(this.nthCellRawValue);
                        if (matched.length >= 2) {
                            var captureIndex = matched[1];
                            var nthValue = data[captureIndex].value;
                            url = url.replace(this.nthCellRawValue, nthValue.toString());
                        }
                    }
                    return url;
                };
                ClickThroughTransformer.tranformComposite = function (name, url) {
                    if (url.match(this.compositeName)) {
                        url = url.replace(this.compositeName, name);
                    }
                    return url;
                };
                ClickThroughTransformer.cellName = /\${__cell_name}/;
                ClickThroughTransformer.cellValue = /\${__cell}/;
                ClickThroughTransformer.cellRawValue = /\${__cell:raw}/;
                ClickThroughTransformer.nthCellName = /\${__cell_name_(\d+)}/;
                ClickThroughTransformer.nthCellValue = /\${__cell_(\d+)}/;
                ClickThroughTransformer.nthCellRawValue = /\${__cell_(\d+):raw}/;
                ClickThroughTransformer.compositeName = /\${__composite_name}/;
                return ClickThroughTransformer;
            }());
            exports_1("ClickThroughTransformer", ClickThroughTransformer);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBS0E7Z0JBNEVBLENBQUM7Z0JBakVRLDRDQUFvQixHQUEzQixVQUE0QixLQUFhLEVBQUUsR0FBVyxFQUFFLElBQTBCO29CQUNoRixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDaEIsT0FBTyxHQUFHLENBQUM7cUJBQ1o7b0JBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV2QixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUU1QixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDN0M7b0JBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFFN0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztxQkFDNUU7b0JBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTt3QkFFaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7cUJBQzdEO29CQUNELE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBRU0seUNBQWlCLEdBQXhCLFVBQXlCLEdBQVcsRUFBRSxJQUEwQjtvQkFDOUQsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTt3QkFDbEMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBRTFDLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7NEJBRXZCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQzs0QkFFdEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQzt5QkFDOUM7cUJBQ0Y7b0JBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTt3QkFDbkMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQzNDLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7NEJBRXZCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsQ0FBQzs0QkFFakQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3lCQUNwRTtxQkFDRjtvQkFDRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO3dCQUN0QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDOUMsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTs0QkFFdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDOzRCQUV4QyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3lCQUM5RDtxQkFDRjtvQkFDRCxPQUFPLEdBQUcsQ0FBQztnQkFDYixDQUFDO2dCQUVNLHlDQUFpQixHQUF4QixVQUF5QixJQUFZLEVBQUUsR0FBVztvQkFFaEQsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFFakMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDN0M7b0JBQ0QsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkF6RU0sZ0NBQVEsR0FBVyxpQkFBaUIsQ0FBQztnQkFDckMsaUNBQVMsR0FBVyxZQUFZLENBQUM7Z0JBQ2pDLG9DQUFZLEdBQVcsZ0JBQWdCLENBQUM7Z0JBRXhDLG1DQUFXLEdBQVcsdUJBQXVCLENBQUM7Z0JBQzlDLG9DQUFZLEdBQVcsa0JBQWtCLENBQUM7Z0JBQzFDLHVDQUFlLEdBQVcsc0JBQXNCLENBQUM7Z0JBRWpELHFDQUFhLEdBQVcsc0JBQXNCLENBQUM7Z0JBbUV4RCw4QkFBQzthQUFBLEFBNUVEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb252ZXJ0IG1vZGVsIGRhdGEgdG8gdXJsIHBhcmFtc1xuICovXG5pbXBvcnQge1BvbHlzdGF0TW9kZWx9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcblxuY2xhc3MgQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIge1xuICBzdGF0aWMgY2VsbE5hbWU6IFJlZ0V4cCA9IC9cXCR7X19jZWxsX25hbWV9LztcbiAgc3RhdGljIGNlbGxWYWx1ZTogUmVnRXhwID0gL1xcJHtfX2NlbGx9LztcbiAgc3RhdGljIGNlbGxSYXdWYWx1ZTogUmVnRXhwID0gL1xcJHtfX2NlbGw6cmF3fS87XG5cbiAgc3RhdGljIG50aENlbGxOYW1lOiBSZWdFeHAgPSAvXFwke19fY2VsbF9uYW1lXyhcXGQrKX0vO1xuICBzdGF0aWMgbnRoQ2VsbFZhbHVlOiBSZWdFeHAgPSAvXFwke19fY2VsbF8oXFxkKyl9LztcbiAgc3RhdGljIG50aENlbGxSYXdWYWx1ZTogUmVnRXhwID0gL1xcJHtfX2NlbGxfKFxcZCspOnJhd30vO1xuXG4gIHN0YXRpYyBjb21wb3NpdGVOYW1lOiBSZWdFeHAgPSAvXFwke19fY29tcG9zaXRlX25hbWV9LztcblxuICBzdGF0aWMgdHJhbmZvcm1TaW5nbGVNZXRyaWMoaW5kZXg6IG51bWJlciwgdXJsOiBzdHJpbmcsIGRhdGE6IEFycmF5PFBvbHlzdGF0TW9kZWw+KSB7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgbGV0IGl0ZW0gPSBkYXRhW2luZGV4XTtcbiAgICAvLyBjaGVjayBpZiB1cmwgY29udGFpbnMgYW55IGRlcmVmZXJlbmNpbmdcbiAgICBpZiAodXJsLm1hdGNoKHRoaXMuY2VsbE5hbWUpKSB7XG4gICAgICAvLyByZXBsYWNlIHdpdGggc2VyaWVzIG5hbWVcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKHRoaXMuY2VsbE5hbWUsIGl0ZW0ubmFtZSk7XG4gICAgfVxuICAgIGlmICh1cmwubWF0Y2godGhpcy5jZWxsVmFsdWUpKSB7XG4gICAgICAvLyByZXBsYWNlIHdpdGggZm9ybWF0dGVkIHZhbHVlLCBhbmQgZW5jb2RlZFxuICAgICAgdXJsID0gdXJsLnJlcGxhY2UodGhpcy5jZWxsVmFsdWUsIGVuY29kZVVSSUNvbXBvbmVudChpdGVtLnZhbHVlRm9ybWF0dGVkKSk7XG4gICAgfVxuICAgIGlmICh1cmwubWF0Y2godGhpcy5jZWxsUmF3VmFsdWUpKSB7XG4gICAgICAvLyByZXBsYWNlIHdpdGggdmFsdWVcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKHRoaXMuY2VsbFJhd1ZhbHVlLCBpdGVtLnZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgc3RhdGljIHRyYW5mb3JtTnRoTWV0cmljKHVybDogc3RyaW5nLCBkYXRhOiBBcnJheTxQb2x5c3RhdE1vZGVsPikge1xuICAgIHdoaWxlICh1cmwubWF0Y2godGhpcy5udGhDZWxsTmFtZSkpIHtcbiAgICAgIGxldCBtYXRjaGVkID0gdXJsLm1hdGNoKHRoaXMubnRoQ2VsbE5hbWUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm1hdGNoZWQ6IFwiICsgbWF0Y2hlZCk7XG4gICAgICBpZiAobWF0Y2hlZC5sZW5ndGggPj0gMikge1xuICAgICAgICAvLyBnZXQgdGhlIGNhcHR1cmUgbnVtYmVyXG4gICAgICAgIGxldCBjYXB0dXJlSW5kZXggPSBtYXRjaGVkWzFdO1xuICAgICAgICBsZXQgbnRoTmFtZSA9IGRhdGFbY2FwdHVyZUluZGV4XS5uYW1lO1xuICAgICAgICAvLyByZXBsYWNlIHdpdGggc2VyaWVzIG5hbWVcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UodGhpcy5udGhDZWxsTmFtZSwgbnRoTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlICh1cmwubWF0Y2godGhpcy5udGhDZWxsVmFsdWUpKSB7XG4gICAgICBsZXQgbWF0Y2hlZCA9IHVybC5tYXRjaCh0aGlzLm50aENlbGxWYWx1ZSk7XG4gICAgICBpZiAobWF0Y2hlZC5sZW5ndGggPj0gMikge1xuICAgICAgICAvLyBnZXQgdGhlIGNhcHR1cmUgbnVtYmVyXG4gICAgICAgIGxldCBjYXB0dXJlSW5kZXggPSBtYXRjaGVkWzFdO1xuICAgICAgICBsZXQgbnRoVmFsdWUgPSBkYXRhW2NhcHR1cmVJbmRleF0udmFsdWVGb3JtYXR0ZWQ7XG4gICAgICAgIC8vIHJlcGxhY2Ugd2l0aCBmb3JtYXR0ZWQgdmFsdWUgZW5jb2RlZFxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSh0aGlzLm50aENlbGxWYWx1ZSwgZW5jb2RlVVJJQ29tcG9uZW50KG50aFZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlICh1cmwubWF0Y2godGhpcy5udGhDZWxsUmF3VmFsdWUpKSB7XG4gICAgICBsZXQgbWF0Y2hlZCA9IHVybC5tYXRjaCh0aGlzLm50aENlbGxSYXdWYWx1ZSk7XG4gICAgICBpZiAobWF0Y2hlZC5sZW5ndGggPj0gMikge1xuICAgICAgICAvLyBnZXQgdGhlIGNhcHR1cmUgbnVtYmVyXG4gICAgICAgIGxldCBjYXB0dXJlSW5kZXggPSBtYXRjaGVkWzFdO1xuICAgICAgICBsZXQgbnRoVmFsdWUgPSBkYXRhW2NhcHR1cmVJbmRleF0udmFsdWU7XG4gICAgICAgIC8vIHJlcGxhY2Ugd2l0aCByYXcgdmFsdWVcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UodGhpcy5udGhDZWxsUmF3VmFsdWUsIG50aFZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgc3RhdGljIHRyYW5mb3JtQ29tcG9zaXRlKG5hbWU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcbiAgICAvLyBjaGVjayBpZiB1cmwgY29udGFpbnMgYW55IGRlcmVmZXJlbmNpbmdcbiAgICBpZiAodXJsLm1hdGNoKHRoaXMuY29tcG9zaXRlTmFtZSkpIHtcbiAgICAgIC8vIHJlcGxhY2Ugd2l0aCBzZXJpZXMgbmFtZVxuICAgICAgdXJsID0gdXJsLnJlcGxhY2UodGhpcy5jb21wb3NpdGVOYW1lLCBuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG59XG5cbmV4cG9ydCB7XG4gIENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyXG59O1xuIl19