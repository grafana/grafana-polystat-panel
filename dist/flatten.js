System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function flatten(target, opts) {
        opts = opts || {};
        var delimiter = opts.delimiter || ".";
        var maxDepth = opts.maxDepth || 3;
        var currentDepth = 1;
        var output = {};
        function step(object, prev) {
            Object.keys(object).forEach(function (key) {
                var value = object[key];
                var isarray = opts.safe && Array.isArray(value);
                var type = Object.prototype.toString.call(value);
                var isobject = type === "[object Object]";
                var newKey = prev ? prev + delimiter + key : key;
                if (!opts.maxDepth) {
                    maxDepth = currentDepth + 1;
                }
                if (!isarray && isobject && Object.keys(value).length && currentDepth < maxDepth) {
                    ++currentDepth;
                    return step(value, newKey);
                }
                output[newKey] = value;
            });
        }
        step(target, null);
        return output;
    }
    exports_1("flatten", flatten);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=flatten.js.map