// Copyright (c) 2014, Hugh Kennedy
// Based on code from https://github.com/hughsk/flat/blob/master/index.js
//

export function flatten(target, opts): any {
    opts = opts || {};

    let delimiter = opts.delimiter || ".";
    let maxDepth = opts.maxDepth || 3;
    let currentDepth = 1;
    let output = {};

    function step(object, prev) {
        Object.keys(object).forEach(function (key) {
            let value = object[key];
            let isarray = opts.safe && Array.isArray(value);
            let type = Object.prototype.toString.call(value);
            let isobject = type === "[object Object]";

            let newKey = prev ? prev + delimiter + key : key;

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
