"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
describe("Transforms", function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        describe("With time series data", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        }); });
        describe("With elasticsearch data", function () {
            it("Can convert to hexbin", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    expect(true).toBeTruthy();
                    return [2];
                });
            }); });
        });
        describe("With Table data", function () { return __awaiter(_this, void 0, void 0, function () {
            var tableData;
            var _this = this;
            return __generator(this, function (_a) {
                tableData = [{
                        columns: [
                            {
                                text: "Time",
                                type: "time"
                            }, {
                                text: "xitem"
                            }, {
                                text: "yitem"
                            }, {
                                text: "nonitem"
                            }
                        ],
                        rows: [
                            [1492759673649, 20, 15, "ignore2"]
                        ],
                        type: "table"
                    }];
                it("Converts Table Data", function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log(tableData);
                        return [2];
                    });
                }); });
                return [2];
            });
        }); });
        describe("With JSON data", function () {
            it("Can convert to hexbin", function () { return __awaiter(_this, void 0, void 0, function () {
                var rawData;
                return __generator(this, function (_a) {
                    rawData = [
                        {
                            type: "docs",
                            datapoints: [
                                {
                                    timestamp: "time",
                                    message: "message",
                                    nested: {
                                        level2: "level2-value"
                                    }
                                }
                            ]
                        }
                    ];
                    console.log(rawData);
                    expect(true).toBeTruthy();
                    return [2];
                });
            }); });
        });
        return [2];
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLnVuaXQuamVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjcy90cmFuc2Zvcm1lcnMudW5pdC5qZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxpQkFtSEE7QUFuSEEsUUFBUSxDQUFDLFlBQVksRUFBRTs7O1FBRXJCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTs7OzthQTRCakMsQ0FBQyxDQUFDO1FBR0gsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1lBQ2xDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTs7b0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7O2lCQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUdILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTs7OztnQkFDcEIsU0FBUyxHQUFHLENBQUM7d0JBQ2pCLE9BQU8sRUFBRTs0QkFDUDtnQ0FDRSxJQUFJLEVBQUUsTUFBTTtnQ0FDWixJQUFJLEVBQUUsTUFBTTs2QkFDYixFQUFFO2dDQUNELElBQUksRUFBRSxPQUFPOzZCQUNkLEVBQUU7Z0NBQ0QsSUFBSSxFQUFFLE9BQU87NkJBQ2QsRUFBRTtnQ0FDRCxJQUFJLEVBQUUsU0FBUzs2QkFDaEI7eUJBQ0Y7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKLENBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDO3lCQUNuQzt3QkFDRCxJQUFJLEVBQUUsT0FBTztxQkFDZCxDQUFDLENBQUM7Z0JBQ0gsRUFBRSxDQUFDLHFCQUFxQixFQUFFOzt3QkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O3FCQUN4QixDQUFDLENBQUM7OzthQStCTixDQUFDLENBQUM7UUFHRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsRUFBRSxDQUFDLHVCQUF1QixFQUFFOzs7b0JBQ3RCLE9BQU8sR0FBRzt3QkFDWjs0QkFDRSxJQUFJLEVBQUUsTUFBTTs0QkFDWixVQUFVLEVBQUU7Z0NBQ1o7b0NBQ0UsU0FBUyxFQUFFLE1BQU07b0NBQ2pCLE9BQU8sRUFBRSxTQUFTO29DQUNsQixNQUFNLEVBQUU7d0NBQ04sTUFBTSxFQUFFLGNBQWM7cUNBQ3ZCO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDOzs7aUJBQzNCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDOzs7S0FDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogVGVzdHMgZm9yIHRyYW5zZm9ybXNcbiAqL1xuXG4vL2ltcG9ydCB7VGltZVNlcmllc30gZnJvbSBcIi4uLy4uL3Rlc3RzL3RpbWVzZXJpZXNcIjtcblxuLy8gSGVscGVyIGNsYXNzXG4vKlxuY2xhc3MgVGltZVNlcmllcyB7XG4gIGRhdGFwb2ludHM6IG51bWJlcltdW107XG4gIGFsaWFzOiBzdHJpbmc7XG4gIHRhcmdldDogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihvcHRzOiB7ZGF0YXBvaW50czogbnVtYmVyW11bXSwgYWxpYXM6IHN0cmluZ30pIHtcbiAgICB0aGlzLmRhdGFwb2ludHMgPSBvcHRzLmRhdGFwb2ludHM7XG4gICAgdGhpcy5hbGlhcyA9IG9wdHMuYWxpYXM7XG4gICAgdGhpcy50YXJnZXQgPSBvcHRzLmFsaWFzO1xuICB9XG59XG4qL1xuLy9pbXBvcnQge1RyYW5zZm9ybWVyc30gZnJvbSBcIi4uL3NyYy90cmFuc2Zvcm1lcnNcIjtcbi8vaW1wb3J0IHtQb2x5c3RhdE1vZGVsfSBmcm9tIFwiLi4vc3JjL3BvbHlzdGF0bW9kZWxcIjtcbi8vIGdldCB0aGlzIHdvcmtpbmcuLi5cbi8vaW1wb3J0IFwiYXBwL2NvcmUvdGltZV9zZXJpZXMyXCI7XG5cbmRlc2NyaWJlKFwiVHJhbnNmb3Jtc1wiLCBhc3luYygpID0+IHtcbiAgICAvLyBEYXRhc291cmNlIHNlbmRzIHRpbWVzZXJpZXNcbiAgZGVzY3JpYmUoXCJXaXRoIHRpbWUgc2VyaWVzIGRhdGFcIiwgYXN5bmMoKSA9PiB7XG4gICAgLypcbiAgICBsZXQgeEF4aXNTZXJpZXM6IFRpbWVTZXJpZXM7XG4gICAgbGV0IHlBeGlzU2VyaWVzOiBUaW1lU2VyaWVzO1xuXG4gICAgbGV0IGhleGJpbjogUG9seXN0YXRNb2RlbDtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICB4QXhpc1NlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgICAgZGF0YXBvaW50czogW1syMDAsIHRpbWVdLCBbMTAxLCB0aW1lICsgMV0sIFs1NTUsIHRpbWUgKyAyXV0sXG4gICAgICAgIGFsaWFzOiBcIkEtc2VyaWVzXCIsXG4gICAgICB9KTtcbiAgICAgIHlBeGlzU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgICBkYXRhcG9pbnRzOiBbWzg4OCwgdGltZV0sIFs3NzcsIHRpbWUgKyAxXSwgWzQ0NCwgdGltZSArIDJdXSxcbiAgICAgICAgYWxpYXM6IFwiQi1TZXJpZXNcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICovXG4gICAgLypcbiAgICBpdChcIkNhbiBjb252ZXJ0IHRvIGhleGJpblwiLCBhc3luYygpID0+IHtcbiAgICAgIGxldCBiaW5zID0gVHJhbnNmb3JtZXJzLlRpbWVTZXJpZXNUb0hleGJpbih4QXhpc1NlcmllcywgeUF4aXNTZXJpZXMpO1xuICAgICAgY29uc29sZS5sb2coYmlucyk7XG4gICAgICBleHBlY3QoYmlucy5zZXJpZXNbMF1bMF0pLnRvRXF1YWwoMjAwKTtcbiAgICAgIGV4cGVjdChiaW5zLnNlcmllc1swXVsxXSkudG9FcXVhbCg4ODgpO1xuICAgICAgZXhwZWN0KGJpbnMuc2VyaWVzWzJdWzBdKS50b0VxdWFsKDU1NSk7XG4gICAgICBleHBlY3QoYmlucy5zZXJpZXNbMl1bMV0pLnRvRXF1YWwoNDQ0KTtcbiAgICB9KTtcbiAgICAqL1xuICB9KTtcblxuICAvLyBEYXRhc291cmNlIHNlbmRzIEVsYXN0aWNTZWFyY2ggcmVzdWx0c1xuICBkZXNjcmliZShcIldpdGggZWxhc3RpY3NlYXJjaCBkYXRhXCIsICgpID0+IHtcbiAgICBpdChcIkNhbiBjb252ZXJ0IHRvIGhleGJpblwiLCBhc3luYygpID0+IHtcbiAgICAgIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIERhdGFzb3VyY2Ugc2VuZHMgYSB0YWJsZVxuICBkZXNjcmliZShcIldpdGggVGFibGUgZGF0YVwiLCBhc3luYygpID0+IHtcbiAgICBjb25zdCB0YWJsZURhdGEgPSBbe1xuICAgICAgY29sdW1uczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJUaW1lXCIsXG4gICAgICAgICAgdHlwZTogXCJ0aW1lXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRleHQ6IFwieGl0ZW1cIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGV4dDogXCJ5aXRlbVwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0ZXh0OiBcIm5vbml0ZW1cIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgcm93czogW1xuICAgICAgICBbMTQ5Mjc1OTY3MzY0OSwgMjAsIDE1LCBcImlnbm9yZTJcIl1cbiAgICAgIF0sXG4gICAgICB0eXBlOiBcInRhYmxlXCJcbiAgICB9XTtcbiAgICBpdChcIkNvbnZlcnRzIFRhYmxlIERhdGFcIiwgYXN5bmMoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0YWJsZURhdGEpO1xuICAgIH0pO1xuICAgIC8qXG4gICAgaXQoXCJDYW4gY29udmVydCB4IGFuZCB5IGl0ZW1zIHRvIGhleGJpblwiLCBhc3luYygpID0+IHtcbiAgICAgIGxldCB4Q29sdW1uID0gMTtcbiAgICAgIGxldCB5Q29sdW1uID0gMjtcbiAgICAgIGxldCBiaW5zID0gVHJhbnNmb3JtZXJzLlRhYmxlRGF0YVRvSGV4YmluKHRhYmxlRGF0YSwgeENvbHVtbiwgeUNvbHVtbik7XG4gICAgICBjb25zb2xlLmxvZyhiaW5zKTtcbiAgICAgIGV4cGVjdChiaW5zLnNlcmllc1swXVswXSkudG9FcXVhbCgyMCk7XG4gICAgICBleHBlY3QoYmlucy5zZXJpZXNbMF1bMV0pLnRvRXF1YWwoMTUpO1xuICAgIH0pO1xuICAgICovXG4gICAgLypcbiAgICBpdChcIkNhbiBjb252ZXJ0IHggYW5kIHRpbWUgaXRlbXMgdG8gaGV4YmluXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCB4Q29sdW1uID0gMDtcbiAgICAgIGxldCB5Q29sdW1uID0gMTtcbiAgICAgIGxldCBiaW5zID0gVHJhbnNmb3JtZXJzLlRhYmxlRGF0YVRvSGV4YmluKHRhYmxlRGF0YSwgeENvbHVtbiwgeUNvbHVtbik7XG4gICAgICBjb25zb2xlLmxvZyhiaW5zKTtcbiAgICAgIGV4cGVjdChiaW5zLnNlcmllc1swXVswXSkudG9FcXVhbCgxNDkyNzU5NjczNjQ5KTtcbiAgICAgIGV4cGVjdChiaW5zLnNlcmllc1swXVsxXSkudG9FcXVhbCgyMCk7XG4gICAgfSk7XG4gICAgKi9cbiAgICAvKlxuICAgIGl0KFwiQ2FuIGNvbnZlcnQgeSBhbmQgdGltZSBpdGVtcyB0byBoZXhiaW5cIiwgYXN5bmMoKSA9PiB7XG4gICAgICBsZXQgeENvbHVtbiA9IDA7XG4gICAgICBsZXQgeUNvbHVtbiA9IDI7XG4gICAgICBsZXQgYmlucyA9IFRyYW5zZm9ybWVycy5UYWJsZURhdGFUb0hleGJpbih0YWJsZURhdGEsIHhDb2x1bW4sIHlDb2x1bW4pO1xuICAgICAgY29uc29sZS5sb2coYmlucyk7XG4gICAgICBleHBlY3QoYmlucy5zZXJpZXNbMF1bMF0pLnRvRXF1YWwoMTQ5Mjc1OTY3MzY0OSk7XG4gICAgICBleHBlY3QoYmlucy5zZXJpZXNbMF1bMV0pLnRvRXF1YWwoMTUpO1xuICAgIH0pO1xuICAgICovXG59KTtcblxuICAvLyBEYXRhc291cmNlIHNlbmRzIEpTT05cbiAgZGVzY3JpYmUoXCJXaXRoIEpTT04gZGF0YVwiLCAoKSA9PiB7XG4gICAgaXQoXCJDYW4gY29udmVydCB0byBoZXhiaW5cIiwgYXN5bmMoKSA9PiB7XG4gICAgICBsZXQgcmF3RGF0YSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiZG9jc1wiLFxuICAgICAgICAgIGRhdGFwb2ludHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aW1lc3RhbXA6IFwidGltZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBuZXN0ZWQ6IHtcbiAgICAgICAgICAgICAgbGV2ZWwyOiBcImxldmVsMi12YWx1ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XTtcbiAgICAgIGNvbnNvbGUubG9nKHJhd0RhdGEpO1xuICAgICAgZXhwZWN0KHRydWUpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==