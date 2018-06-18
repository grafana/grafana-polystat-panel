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

export {
  GetDecimalsForValue
};
