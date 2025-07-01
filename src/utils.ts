import { sortBy as lodashSortBy, toLower as lodashToLower, isNumber as lodashIsNumber } from 'lodash';

function GetDecimalsForValue(value: any, panelDecimals: any): { decimals: number; scaledDecimals: any } {
  if (lodashIsNumber(panelDecimals)) {
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
 * @param {number} width width in pixels the string must fit in
 * @param {number} minFontPx the smallest acceptable font size in pixels
 * @param {number} maxFontPx the largest acceptable font size in pixels
 */
function getTextSizeForWidth(text: string, font: any, width: number, minFontPx: number, maxFontPx: number) {
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
 * @param {number} width the width in pixels the string must fit in
 * @param {number} height the height in pixels
 * @param {number} minFontPx the smallest acceptable font size in pixels
 * @param {number} maxFontPx the largest acceptable font size in pixels
 */
function getTextSizeForWidthAndHeight(
  text: string,
  font: any,
  width: number,
  height: number,
  minFontPx: number,
  maxFontPx: number
) {
  let s = font.replace('?', maxFontPx);
  let w = getTextWidth(text, s);
  //console.log(`getTextSizeForWidthAndHeight: width raw ${width}`);
  // need to pad the width: use 95% of the space (leave 10% padding on each side)
  // and ensure it is a whole number
  width = Math.round(width * 0.95);
  //console.log(`getTextSizeForWidthAndHeight: width reduced ${width}`);
  if (w <= width && maxFontPx <= height) {
    return maxFontPx;
  }
  // start from large to small, return 0 for no-fit
  for (let fontSize = maxFontPx; fontSize >= minFontPx; fontSize--) {
    s = font.replace('?', fontSize);
    w = getTextWidth(text, s);
    // has to fit within the width of the text area, and not exceed the height
    if (w < width && fontSize <= height) {
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
  // intentional use of deprecated function (no widely implemented alternative)
  // eslint-disable-next-line deprecation/deprecation
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return 40; // unknown due to context failure
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
    const c = b.map((x) => {
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

function getTextOrValue(o: any) {
  if (isNaN(o)) {
    return o;
  } else {
    return Number(o);
  }
}

function SortVariableValuesByField(options: any, sortField: string, sortOrder: number) {
  if (sortOrder === 0) {
    return options;
  }
  const sortType = Math.ceil(sortOrder / 2);
  const reverseSort = sortOrder % 2 === 0;

  switch (sortType) {
    case 1: // Alphabetical Case Sensitive
      options = lodashSortBy(options, sortField);
      break;
    case 2: // Numerical with sub-match
      options = lodashSortBy(options, (item) => {
        // if the content of the field to sort by is textual, check if there is a numerical area to sort by
        if (isNaN(item[sortField])) {
          const matchField = item[sortField];
          const matches = matchField.match(/.*?(\d+).*/);
          if (!matches || matches.length < 2) {
            return -1;
          } else {
            return parseInt(matches[1], 10);
          }
        } else {
          return getTextOrValue(item[sortField]);
        }
      });
      break;
    case 3: // Alphabetical Case Insensitive
      options = lodashSortBy(options, (item) => {
        const itemContent = item[sortField];
        if (isNaN(itemContent)) {
          return lodashToLower(item[sortField]);
        } else {
          return itemContent;
        }
      });
      break;
    case 4: // Natural Sort
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      options = options.slice(); // Shallow clone original array
      options.sort((a: any, b: any) => {
        return collator.compare(a[sortField], b[sortField]);
      });
      break;
  }

  if (reverseSort) {
    options = options.reverse();
  }

  return options;
}

const roundValue = (num: number, decimals: number): number | null => {
  if (num === null) {
    return null;
  }
  const n = Math.pow(10, decimals);
  const formatted = (n * num).toFixed(decimals);
  return Math.round(parseFloat(formatted)) / n;
};

export {
  GetDecimalsForValue,
  getTextSizeForWidth,
  getTextSizeForWidthAndHeight,
  getTextWidth,
  RGBToHex,
  SortVariableValuesByField,
  getTextOrValue,
  roundValue
};
