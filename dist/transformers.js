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
//# sourceMappingURL=transformers.js.map