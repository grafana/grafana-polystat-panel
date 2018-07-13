import _ from "lodash";

function GetDecimalsForValue(value: any, panelDecimals: any): { decimals; scaledDecimals; } {
  if (_.isNumber(panelDecimals)) {
    return {decimals: panelDecimals, scaledDecimals: null};
  }

  var delta = value / 2;
  var dec = -Math.floor(Math.log(delta) / Math.LN10);

  var magn = Math.pow(10, -dec),
      norm = delta / magn, // norm is between 1.0 and 10.0
      size;

  if (norm < 1.5) {
    size = 1;
  } else if (norm < 3) {
    size = 2;
    // special case for 2.5, requires an extra decimal
    if (norm > 2.25) {
      size = 2.5;
      ++dec;
    }
  } else if (norm < 7.5) {
    size = 5;
  } else {
    size = 10;
  }

  size *= magn;

  // reduce starting decimals if not needed
  if (Math.floor(value) === value) { dec = 0; }

  var result = {
    decimals: 0,
    scaledDecimals: 0,
  };
  result.decimals = Math.max(0, dec);
  result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
  return result;
}

/**
 *
 *
 * Find the largest font size (in pixels) that allows the string to fit in the given width.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold ?px verdana")
 *                      -- note the use of ? in place of the font size.
 * @param {width} the width in pixels the string must fit in
 * @param {minFontPx} the smallest acceptable font size in pixels
 * @param {maxFontPx} the largest acceptable font size in pixels
**/
function getTextSizeForWidth(text: string, font: any, width, minFontPx, maxFontPx) {
    var s = font.replace("?", maxFontPx);
    var w = getTextWidth(text, s);
    if (w <= width) {
      return maxFontPx;
    }
    // pad width by 10px
    width = width - 20;
    // start from large to small, return 0 for no-fit
    for (let fontSize = maxFontPx; fontSize >= minFontPx; fontSize--) {
      s = font.replace("?", fontSize);
      w = getTextWidth(text, s);
      if (w < width) {
        return Math.ceil(fontSize);
      }
    }
    // 0 if no fit
    return 0;
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text: string, font: string) {
  // re-use canvas object for better performance
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}


export {
GetDecimalsForValue,
getTextSizeForWidth,
getTextWidth
};
