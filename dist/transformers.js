System.register(["./flatten", "lodash", "./polystatmodel"], function (exports_1, context_1) {
    "use strict";
    var flatten_1, lodash_1, polystatmodel_1, Transformers;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (flatten_1_1) {
                flatten_1 = flatten_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (polystatmodel_1_1) {
                polystatmodel_1 = polystatmodel_1_1;
            }
        ],
        execute: function () {
            Transformers = (function () {
                function Transformers() {
                }
                Transformers.TimeSeriesToPolystat = function (operatorName, series) {
                    var aPolystat = new polystatmodel_1.PolystatModel(operatorName, series);
                    return aPolystat;
                };
                Transformers.GetColumnsJSONData = function (data) {
                    if (!data || data.length === 0) {
                        return [];
                    }
                    var names = {};
                    for (var i = 0; i < data.length; i++) {
                        var series = data[i];
                        if (series.type !== "docs") {
                            continue;
                        }
                        var maxDocs = Math.min(series.datapoints.length, 100);
                        for (var y = 0; y < maxDocs; y++) {
                            var doc = series.datapoints[y];
                            var flattened = flatten_1.flatten(doc, null);
                            for (var propName in flattened) {
                                if (flattened.hasOwnProperty(propName)) {
                                    names[propName] = true;
                                }
                            }
                        }
                    }
                    return lodash_1.default.map(names, function (value, key) {
                        return { text: key, value: value };
                    });
                };
                return Transformers;
            }());
            exports_1("Transformers", Transformers);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQWtCQTtnQkFBQTtnQkErRkEsQ0FBQztnQkE3RlEsaUNBQW9CLEdBQTNCLFVBQTRCLFlBQW9CLEVBQUUsTUFBVztvQkFNM0QsSUFBSSxTQUFTLEdBQUcsSUFBSSw2QkFBYSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFReEQsT0FBTyxTQUFTLENBQUM7Z0JBQ25CLENBQUM7Z0JBaURNLCtCQUFrQixHQUF6QixVQUEwQixJQUFJO29CQUM1QixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUM5QixPQUFPLEVBQUUsQ0FBQztxQkFDWDtvQkFDRCxJQUFJLEtBQUssR0FBUSxFQUFFLENBQUM7b0JBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNwQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7NEJBQzFCLFNBQVM7eUJBQ1Y7d0JBR0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDaEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDL0IsSUFBSSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ25DLEtBQUssSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO2dDQUM5QixJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7b0NBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7aUNBQ3hCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUdELE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsS0FBSyxFQUFFLEdBQUc7d0JBQ3RDLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDSCxtQkFBQztZQUFELENBQUMsQUEvRkQsSUErRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIE1ldHJpYyB0cmFuc2Zvcm1zXG5cbiBBdmcvTWluL01heCBldGNcbiBUaW1lU2VyaWVzIHRvIEhleGJpblxuIFRhYmxlIHRvIEhleGJpblxuID8gdG8gSGV4YmluXG4gKi9cblxuLypcbiBIZXhiaW4gcmVxdWlyZXMgdHdvIHNlcmllcyBpbiB0aGlzIGZvcm06XG4gIGFycmF5W11beCx5XVxuKi9cblxuaW1wb3J0IHtmbGF0dGVufSBmcm9tIFwiLi9mbGF0dGVuXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQge1BvbHlzdGF0TW9kZWx9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybWVycyB7XG5cbiAgc3RhdGljIFRpbWVTZXJpZXNUb1BvbHlzdGF0KG9wZXJhdG9yTmFtZTogc3RyaW5nLCBzZXJpZXM6IGFueSk6IGFueSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkNvbnZlcnRpbmcgdGltZSBzZXJpZXMgdG8gaGV4YmluXCIpO1xuICAgIC8vIG9ubHkgdXNlIG1pbiBsZW5ndGgsIGFuZCBzdGFydCBmcm9tIHRoZSBcImVuZFwiXG4gICAgLy8gdXNlIHRpbWVzdGFtcCBvZiBYXG4gICAgLy9sZXQgdHNMZW5ndGggPSBzZXJpZXMuZGF0YXBvaW50cy5sZW5ndGg7XG4gICAgLy9sZXQgYmlucyA9IFtdO1xuICAgIGxldCBhUG9seXN0YXQgPSBuZXcgUG9seXN0YXRNb2RlbChvcGVyYXRvck5hbWUsIHNlcmllcyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiB0aW1lIHNlcmllcyBpbiBYOiBcIiArIHRzTGVuZ3RoKTtcbiAgICAvL2ZvciAobGV0IGluZGV4ID0gdHNMZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgLy9mb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdHNMZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIC8vIGdldCB0aGUgbnVtYmVyIG9mIG1ldHJpY3NcbiAgICAvLyAgbGV0IGFQb2x5c3RhdCA9IG5ldyBQb2x5c3RhdE1vZGVsKHNlcmllcyk7XG4gICAgLy8gIGJpbnMucHVzaChhUG9seXN0YXQpO1xuICAgIC8vfVxuICAgIHJldHVybiBhUG9seXN0YXQ7XG4gIH1cblxuICAvKlxuICBzdGF0aWMgVGltZVNlcmllc1RvSGV4YmluKHhUaW1lU2VyaWVzIDogYW55LCB5VGltZVNlcmllcyA6IGFueSkgOiBQb2x5c3RhdE1vZGVsIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiQ29udmVydGluZyB0aW1lIHNlcmllcyB0byBoZXhiaW5cIik7XG4gICAgLy8gb25seSB1c2UgbWluIGxlbmd0aCwgYW5kIHN0YXJ0IGZyb20gdGhlIFwiZW5kXCJcbiAgICAvLyB1c2UgdGltZXN0YW1wIG9mIFhcbiAgICBsZXQgdHNMZW5ndGggPSB4VGltZVNlcmllcy5kYXRhcG9pbnRzLmxlbmd0aDtcbiAgICBsZXQgdHNZTGVuZ3RoID0geVRpbWVTZXJpZXMuZGF0YXBvaW50cy5sZW5ndGg7XG4gICAgaWYgKHRzWUxlbmd0aCA8IHRzTGVuZ3RoKSB7XG4gICAgICB0c0xlbmd0aCA9IHRzWUxlbmd0aDtcbiAgICB9XG4gICAgbGV0IGJpbnMgPSBuZXcgUG9seXN0YXRNb2RlbChcImF2Z1wiLCB4VGltZVNlcmllcyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiB0aW1lIHNlcmllcyBpbiBYOiBcIiArIHRzTGVuZ3RoKTtcbiAgICAvL2ZvciAobGV0IGluZGV4ID0gdHNMZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRzTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBsZXQgeCA9IHhUaW1lU2VyaWVzLmRhdGFwb2ludHNbaW5kZXhdWzBdO1xuICAgICAgLy9sZXQgeFRpbWUgPSB4VGltZVNlcmllcy5kYXRhcG9pbnRzW2luZGV4XVsxXTtcbiAgICAgIGxldCB5ID0geVRpbWVTZXJpZXMuZGF0YXBvaW50c1tpbmRleF1bMF07XG4gICAgICAvL2xldCB5VGltZSA9IHlUaW1lU2VyaWVzLmRhdGFwb2ludHNbaW5kZXhdWzFdO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInkgaXMgXCIgKyB5ICsgXCIgdGltZTogXCIgKyB5VGltZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwieCBpcyBcIiArIHggKyBcIiB0aW1lOiBcIiArIHhUaW1lKTtcbiAgICAgIGJpbnMucHVzaCh4LCB5KTtcbiAgICB9XG4gICAgcmV0dXJuIGJpbnM7XG4gIH1cbiAgKi9cblxuXG4vKlxuICBzdGF0aWMgVGFibGVEYXRhVG9IZXhiaW4odGFibGVEYXRhIDogYW55LCB4Q29sdW1uIDogbnVtYmVyLCB5Q29sdW1uIDogbnVtYmVyKSA6IFBvbHlzdGF0TW9kZWwge1xuICAgIGxldCBiaW5zID0gbmV3IFBvbHlzdGF0TW9kZWwoW10pO1xuICAgIGNvbnNvbGUubG9nKHRhYmxlRGF0YVswXS50eXBlKTtcbiAgICBpZiAodGFibGVEYXRhWzBdLnR5cGUgPT09IFwidGFibGVcIikge1xuICAgICAgY29uc29sZS5sb2coXCJpdCBpcyBhIHRhYmxlXCIpO1xuICAgICAgbGV0IHRzTGVuZ3RoID0gdGFibGVEYXRhWzBdLnJvd3MubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRzTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCB0aW1lU3RhbXAgPSB0YWJsZURhdGFbMF0ucm93c1tpbmRleF1bMF07XG4gICAgICAgIGxldCB4Q29sdW1uVmFsdWUgPSB0YWJsZURhdGFbMF0ucm93c1tpbmRleF1beENvbHVtbl07XG4gICAgICAgIGxldCB5Q29sdW1uVmFsdWUgPSB0YWJsZURhdGFbMF0ucm93c1tpbmRleF1beUNvbHVtbl07XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyB0aW1lIGNvbHVtbiBcIiArIHRpbWVTdGFtcCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyB4IGNvbHVtbiBcIiArIHhDb2x1bW5WYWx1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyB4IGNvbHVtbiBcIiArIHlDb2x1bW5WYWx1ZSk7XG4gICAgICAgIGJpbnMucHVzaCh4Q29sdW1uVmFsdWUsIHlDb2x1bW5WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiaW5zO1xuICB9XG4qL1xuICBzdGF0aWMgR2V0Q29sdW1uc0pTT05EYXRhKGRhdGEpOiBhbnkge1xuICAgIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB2YXIgbmFtZXM6IGFueSA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlcmllcyA9IGRhdGFbaV07XG4gICAgICBpZiAoc2VyaWVzLnR5cGUgIT09IFwiZG9jc1wiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBvbmx5IGxvb2sgYXQgMTAwIGRvY3NcbiAgICAgIHZhciBtYXhEb2NzID0gTWF0aC5taW4oc2VyaWVzLmRhdGFwb2ludHMubGVuZ3RoLCAxMDApO1xuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYXhEb2NzOyB5KyspIHtcbiAgICAgICAgdmFyIGRvYyA9IHNlcmllcy5kYXRhcG9pbnRzW3ldO1xuICAgICAgICB2YXIgZmxhdHRlbmVkID0gZmxhdHRlbihkb2MsIG51bGwpO1xuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICBpZiAoZmxhdHRlbmVkLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgbmFtZXNbcHJvcE5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiB0aGlzIHdhcyB2YWx1ZToga2V5IGluIG9yaWdpbmFsIGNvZGVcbiAgICByZXR1cm4gXy5tYXAobmFtZXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICByZXR1cm4geyB0ZXh0OiBrZXksIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==