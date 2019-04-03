System.register(["xss"], function (exports_1, context_1) {
    "use strict";
    var xss_1, XSSWL, sanitizeXSS;
    var __moduleName = context_1 && context_1.id;
    function sanitize(unsanitizedString) {
        try {
            return sanitizeXSS.process(unsanitizedString);
        }
        catch (error) {
            console.log("String could not be sanitized", unsanitizedString);
            return unsanitizedString;
        }
    }
    exports_1("sanitize", sanitize);
    function hasAnsiCodes(input) {
        return /\u001b\[\d{1,2}m/.test(input);
    }
    exports_1("hasAnsiCodes", hasAnsiCodes);
    return {
        setters: [
            function (xss_1_1) {
                xss_1 = xss_1_1;
            }
        ],
        execute: function () {
            XSSWL = Object.keys(xss_1.default.whiteList).reduce(function (acc, element) {
                acc[element] = xss_1.default.whiteList[element].concat(["class", "style"]);
                return acc;
            }, {});
            sanitizeXSS = new xss_1.default.FilterXSS({
                whiteList: XSSWL,
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Rlc3RzL19fbW9ja3NfXy9hcHAvY29yZS91dGlscy90ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFvQkEsU0FBZ0IsUUFBUSxDQUFDLGlCQUF5QjtRQUNoRCxJQUFJO1lBQ0YsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDL0M7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNoRSxPQUFPLGlCQUFpQixDQUFDO1NBQzFCO0lBQ0gsQ0FBQzs7SUFFRCxTQUFnQixZQUFZLENBQUMsS0FBYTtRQUN4QyxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7Ozs7Ozs7WUEzQkssS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxPQUFPO2dCQUMzRCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsYUFBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDakUsT0FBTyxHQUFHLENBQUM7WUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFRCxXQUFXLEdBQUcsSUFBSSxhQUFHLENBQUMsU0FBUyxDQUFDO2dCQUNwQyxTQUFTLEVBQUUsS0FBSzthQUNqQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeHNzIGZyb20gXCJ4c3NcIjtcblxuXG5cbmNvbnN0IFhTU1dMID0gT2JqZWN0LmtleXMoeHNzLndoaXRlTGlzdCkucmVkdWNlKChhY2MsIGVsZW1lbnQpID0+IHtcbiAgYWNjW2VsZW1lbnRdID0geHNzLndoaXRlTGlzdFtlbGVtZW50XS5jb25jYXQoW1wiY2xhc3NcIiwgXCJzdHlsZVwiXSk7XG4gIHJldHVybiBhY2M7XG59LCB7fSk7XG5cbmNvbnN0IHNhbml0aXplWFNTID0gbmV3IHhzcy5GaWx0ZXJYU1Moe1xuICB3aGl0ZUxpc3Q6IFhTU1dMLFxufSk7XG5cbi8qKlxuICogUmV0dXJucyBzdHJpbmcgc2FmZSBmcm9tIFhTUyBhdHRhY2tzLlxuICpcbiAqIEV2ZW4gdGhvdWdoIHdlIGFsbG93IHRoZSBzdHlsZS1hdHRyaWJ1dGUsIHRoZXJlJ3Mgc3RpbGwgZGVmYXVsdCBmaWx0ZXJpbmcgYXBwbGllZCB0byBpdFxuICogSW5mbzogaHR0cHM6Ly9naXRodWIuY29tL2xlaXpvbmdtaW4vanMteHNzI2N1c3RvbWl6ZS1jc3MtZmlsdGVyXG4gKiBXaGl0ZWxpc3Q6IGh0dHBzOi8vZ2l0aHViLmNvbS9sZWl6b25nbWluL2pzLWNzcy1maWx0ZXIvYmxvYi9tYXN0ZXIvbGliL2RlZmF1bHQuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplKHVuc2FuaXRpemVkU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICB0cnkge1xuICAgIHJldHVybiBzYW5pdGl6ZVhTUy5wcm9jZXNzKHVuc2FuaXRpemVkU3RyaW5nKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhcIlN0cmluZyBjb3VsZCBub3QgYmUgc2FuaXRpemVkXCIsIHVuc2FuaXRpemVkU3RyaW5nKTtcbiAgICByZXR1cm4gdW5zYW5pdGl6ZWRTdHJpbmc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0Fuc2lDb2RlcyhpbnB1dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXFx1MDAxYlxcW1xcZHsxLDJ9bS8udGVzdChpbnB1dCk7XG59XG4iXX0=