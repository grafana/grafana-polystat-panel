import _ from 'lodash';

function GetDecimalsForValue(value: any, panelDecimals: any): { decimals; scaledDecimals } {
  if (_.isNumber(panelDecimals)) {
    return { decimals: panelDecimals, scaledDecimals: null };
  }

  const delta = value / 2;
  let dec = -Math.floor(Math.log(delta) / Math.LN10);

  const magn = Math.pow(10, -dec);
  const norm = delta / magn; // norm is between 1.0 and 10.0
  let size;

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
  if (Math.floor(value) === value) {
    dec = 0;
  }

  const result = {
    decimals: 0,
    scaledDecimals: 0,
  };
  result.decimals = Math.max(0, dec);
  result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
  return result;
}

/**
 * Find the largest font size (in pixels) that allows the string to fit in the given width.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold ?px verdana")
 *                      -- note the use of ? in place of the font size.
 * @param {width} the width in pixels the string must fit in
 * @param {minFontPx} the smallest acceptable font size in pixels
 * @param {maxFontPx} the largest acceptable font size in pixels
 */
function getTextSizeForWidth(text: string, font: any, width, minFontPx, maxFontPx) {
  let s = font.replace('?', maxFontPx);
  let w = getTextWidth(text, s);
  if (w <= width) {
    return maxFontPx;
  }
  // pad width by 10px
  width = width - 20;
  // start from large to small, return 0 for no-fit
  for (let fontSize = maxFontPx; fontSize >= minFontPx; fontSize--) {
    s = font.replace('?', fontSize);
    w = getTextWidth(text, s);
    if (w < width) {
      return Math.ceil(fontSize);
    }
  }
  // 0 if no fit
  return 0;
}

/**
 * Find the largest font size (in pixels) that allows the string to fit in the given width.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold ?px verdana")
 *                      -- note the use of ? in place of the font size.
 * @param {width} the width in pixels the string must fit in
 * @param {height} the height in pixels
 * @param {minFontPx} the smallest acceptable font size in pixels
 * @param {maxFontPx} the largest acceptable font size in pixels
 */
function getTextSizeForWidthAndHeight(text: string, font: any, width: number, height: number, minFontPx: number, maxFontPx: number) {
  let s = font.replace('?', maxFontPx);
  let w = getTextWidth(text, s);
  // need to pad the width: use 80% of the space (leave 10% padding on each side)
  width = width * 0.8;
  //console.log("Estimating size for text: " + text + " inside width: " + width + " using font: " + font);
  if (w <= width && maxFontPx <= height) {
    return maxFontPx;
  }
  // start from large to small, return 0 for no-fit
  for (let fontSize = maxFontPx; fontSize >= minFontPx; fontSize--) {
    s = font.replace('?', fontSize);
    w = getTextWidth(text, s);
    //console.log("calc width = " + w);
    // has to fit within the width of the text area, and not exceed the height
    if (w < width && fontSize <= height) {
      //console.log("estimated size: " + Math.ceil(fontSize));
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
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function RGBToHex(text: string) {
  // check if in rgb notation
  if (!text.startsWith('rgb')) {
    return text;
  }
  let hex = '#FFFFFF';
  try {
    const a = text.split('(')[1].split(')')[0];
    const b = a.split(',');
    const c = b.map(x => {
      // For each array element
      x = parseInt(x, 10).toString(16); // Convert to a base16 string
      return x.length === 1 ? '0' + x : x; // Add zero if we get only one character
    });
    hex = '#' + c.join('');
  } catch (e) {
    return hex;
  }
  return hex;
}

function SortVariableValuesByField(options, field: any, sortOrder: number) {
  if (sortOrder === 0) {
    return options;
  }

  const sortType = Math.ceil(sortOrder / 2);
  const reverseSort = sortOrder % 2 === 0;

  if (sortType === 1) {
    const sortField = options[field];
    options = _.sortBy(options, sortField);
  } else if (sortType === 2) {
    options = _.sortBy(options, opt => {
      const matchField = opt[field];
      const matches = matchField.match(/.*?(\d+).*/);
      if (!matches || matches.length < 2) {
        return -1;
      } else {
        return parseInt(matches[1], 10);
      }
    });
  } else if (sortType === 3) {
    options = _.sortBy(options, opt => {
      return _.toLower(opt[field]);
    });
  }

  if (reverseSort) {
    options = options.reverse();
  }

  return options;
}

export { GetDecimalsForValue, getTextSizeForWidth, getTextSizeForWidthAndHeight, getTextWidth, RGBToHex, SortVariableValuesByField };
