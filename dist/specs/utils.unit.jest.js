System.register(["../utils"], function (exports_1, context_1) {
    "use strict";
    var utils_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            describe("Utils GetDecimalsForValue", function () {
                describe("With decimals", function () {
                    it("returns 2 decimals", function () {
                        var result = utils_1.GetDecimalsForValue(10.55, 2);
                        expect(result.decimals).toBe(2);
                    });
                    it("returns 1 decimal", function () {
                        var result = utils_1.GetDecimalsForValue(10.55, 1);
                        expect(result.decimals).toBe(1);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMudW5pdC5qZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NwZWNzL3V0aWxzLnVuaXQuamVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQU1BLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtnQkFDcEMsUUFBUSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsRUFBRSxDQUFDLG9CQUFvQixFQUFFO3dCQUN2QixJQUFJLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxDQUFDLENBQUMsQ0FBQztvQkFDSCxFQUFFLENBQUMsbUJBQW1CLEVBQUU7d0JBQ3RCLElBQUksTUFBTSxHQUFHLDJCQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciB1dGlsc1xuICovXG5cbmltcG9ydCB7R2V0RGVjaW1hbHNGb3JWYWx1ZX0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmRlc2NyaWJlKFwiVXRpbHMgR2V0RGVjaW1hbHNGb3JWYWx1ZVwiLCAoKSA9PiB7XG4gIGRlc2NyaWJlKFwiV2l0aCBkZWNpbWFsc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIDIgZGVjaW1hbHNcIiwgKCkgPT4ge1xuICAgICAgbGV0IHJlc3VsdCA9IEdldERlY2ltYWxzRm9yVmFsdWUoMTAuNTUsIDIpO1xuICAgICAgZXhwZWN0KHJlc3VsdC5kZWNpbWFscykudG9CZSgyKTtcbiAgICB9KTtcbiAgICBpdChcInJldHVybnMgMSBkZWNpbWFsXCIsICgpID0+IHtcbiAgICAgIGxldCByZXN1bHQgPSBHZXREZWNpbWFsc0ZvclZhbHVlKDEwLjU1LCAxKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuZGVjaW1hbHMpLnRvQmUoMSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=