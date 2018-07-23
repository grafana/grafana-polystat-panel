System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1;
    var __moduleName = context_1 && context_1.id;
    function GetDecimalsForValue(value, panelDecimals) {
        if (lodash_1.default.isNumber(panelDecimals)) {
            return { decimals: panelDecimals, scaledDecimals: null };
        }
        var delta = value / 2;
        var dec = -Math.floor(Math.log(delta) / Math.LN10);
        var magn = Math.pow(10, -dec), norm = delta / magn, size;
        if (norm < 1.5) {
            size = 1;
        }
        else if (norm < 3) {
            size = 2;
            if (norm > 2.25) {
                size = 2.5;
                ++dec;
            }
        }
        else if (norm < 7.5) {
            size = 5;
        }
        else {
            size = 10;
        }
        size *= magn;
        if (Math.floor(value) === value) {
            dec = 0;
        }
        var result = {
            decimals: 0,
            scaledDecimals: 0,
        };
        result.decimals = Math.max(0, dec);
        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
        return result;
    }
    exports_1("GetDecimalsForValue", GetDecimalsForValue);
    function getTextSizeForWidth(text, font, width, minFontPx, maxFontPx) {
        var s = font.replace("?", maxFontPx);
        var w = getTextWidth(text, s);
        if (w <= width) {
            return maxFontPx;
        }
        width = width - 20;
        for (var fontSize = maxFontPx; fontSize >= minFontPx; fontSize--) {
            s = font.replace("?", fontSize);
            w = getTextWidth(text, s);
            if (w < width) {
                return Math.ceil(fontSize);
            }
        }
        return 0;
    }
    exports_1("getTextSizeForWidth", getTextSizeForWidth);
    function getTextWidth(text, font) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }
    exports_1("getTextWidth", getTextWidth);
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=utils.js.map