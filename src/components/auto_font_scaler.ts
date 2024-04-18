import { PolystatModel } from "./types";
import { getTextSizeForWidthAndHeight } from '../utils';


export const AutoFontScalar = (
  fontFamily: string,
  textAreaWidth: number,
  textAreaHeight: number,
  valueEnabled: boolean,
  showTimestamp: boolean,
  data: PolystatModel[]
) => {
  // TODO: 6 is VERY small, perhaps 10 as a min?
  // A hint from the config could be used (max characters)
  const minFont = 6;
  const maxFont = 240;
  // this ensures we have space between label and value
  const maxLinesToDisplay = 2;
  let showEllipses = false;
  // number of characters to show on polygon
  let numOfChars = 0;

  // find the most text that will be displayed over all items
  // displayName will have the "processed" name with Global Regex applied
  let maxLabel = getMaxLabel(data);
  // estimate how big of a font can be used
  // Two lines of text must fit with vertical spacing included
  // if it is too small, hide everything
  let activeLabelFontSize = computeTextFontSize(
    maxLabel,
    fontFamily,
    minFont,
    maxFont,
    maxLinesToDisplay,
    textAreaWidth,
    textAreaHeight
  );
  if (activeLabelFontSize < minFont) {
    showEllipses = true;
    numOfChars = 18;
    maxLabel = maxLabel.substring(0, numOfChars + 2);
    activeLabelFontSize = computeTextFontSize(
      maxLabel,
      fontFamily,
      minFont,
      maxFont,
      maxLinesToDisplay,
      textAreaWidth,
      textAreaHeight
    );
    if (activeLabelFontSize < minFont) {
      numOfChars = 10;
      maxLabel = maxLabel.substring(0, numOfChars + 2);
      activeLabelFontSize = computeTextFontSize(
        maxLabel,
        fontFamily,
        minFont,
        maxFont,
        maxLinesToDisplay,
        textAreaWidth,
        textAreaHeight
      );
      if (activeLabelFontSize < minFont) {
        numOfChars = 6;
        maxLabel = maxLabel.substring(0, numOfChars + 2);
        activeLabelFontSize = computeTextFontSize(
          maxLabel,
          fontFamily,
          minFont,
          maxFont,
          maxLinesToDisplay,
          textAreaWidth,
          textAreaHeight
        );
      }
    }
  }

  // same for the value and timestamp option, also check for sub metrics size in case of composite
  let {maxValue, maxTimestamp} = getMaxValueAndTimestamp(data);
  // assume no timestamp
  let activeValueFontSize = computeTextFontSize(
    maxValue,
    fontFamily,
    minFont,
    maxFont,
    maxLinesToDisplay,
    textAreaWidth,
    textAreaHeight
  );
  if (showTimestamp) {
    // two lines to be displayed, sharing half of the normal space for the value
    activeValueFontSize = computeTextFontSize(
      maxValue,
      fontFamily,
      minFont,
      maxFont,
      2,
      textAreaWidth,
      (textAreaHeight * 0.67)
    );
  }
  // timestamp shares the same space as the value, but is always smaller
  let activeTimestampFontSize = computeTextFontSize(
    maxTimestamp,
    fontFamily,
    minFont,
    maxFont,
    2,
    textAreaWidth,
    (textAreaHeight * 0.33)
  );

  if (activeTimestampFontSize < minFont) {
    // do not render it, too small
    activeTimestampFontSize = 0;
  }

  // NOTE: allow different sizes, the value could be displayed larger than the label
  // value should never be larger than the label
  //if (activeValueFontSize > activeLabelFontSize) {
  //  activeValueFontSize = activeLabelFontSize;
  //}
  if (!valueEnabled) {
    activeValueFontSize = 0;
  }
  return { activeLabelFontSize, activeValueFontSize, activeTimestampFontSize, showEllipses, numOfChars };
};

/**
 * Finds the longest text that to be displayed
 *
 * @param   {PolystatModel[]}  data  [PolystatModel data]
 *
 * @return  {string}                     [longest label as a string]
 */
const getMaxLabel = (data: PolystatModel[]): string => {
  let maxLabel = '';
  for (let i = 0; i < data.length; i++) {
    let nameToCheck = data[i].name;
    // use the displayName since it has been formatted
    if (data[i].displayName !== '') {
      nameToCheck = data[i].displayName;
    }
    if (nameToCheck.length > maxLabel.length) {
      maxLabel = nameToCheck;
    }
  }
  return maxLabel;
};

/**
 * Finds the longest value and timestamp text to be displayed
 *
 * @param   {PolystatModel[]} data [PolystatModel data]
 *
 * @return  {string[]} [value,timestamp]
 */
const getMaxValueAndTimestamp = (data: PolystatModel[]) => {
  // same for the value, also check for sub metrics size in case of composite
  // timestamp is also calculated here
  let maxValue = '';
  let maxTimestamp = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i].valueFormatted.length > maxValue.length) {
      maxValue = data[i].valueFormatted;
    }
    if (data[i].timestampFormatted.length > maxTimestamp.length) {
      maxTimestamp = data[i].timestampFormatted;
    }
    const subMetricCount = data[i].members.length;
    if (subMetricCount > 0) {
      let counter = 0;
      while (counter < subMetricCount) {
        const checkContent = data[i].members[counter].displayName + ': ' + data[i].members[counter].valueFormatted;
        if (checkContent && checkContent.length > maxValue.length) {
          maxValue = checkContent;
        }
        const checkCompositeTimestamp = data[i].members[counter].timestampFormatted;
        if (checkCompositeTimestamp && checkCompositeTimestamp.length > maxTimestamp.length) {
          maxTimestamp = checkCompositeTimestamp;
        }
        counter++;
      }
    }
  }
  //console.log(`maxValue: ${maxValue} maxTimestamp: ${maxTimestamp}`);
  return {maxValue, maxTimestamp};
};

const computeTextFontSize = (
  text: string,
  font: string,
  minFont: number,
  maxFont: number,
  linesToDisplay: number,
  textAreaWidth: number,
  textAreaHeight: number
): number => {
  return getTextSizeForWidthAndHeight(
    text,
    `?px ${font}`,
    textAreaWidth,
    textAreaHeight / linesToDisplay, // multiple lines of text
    minFont,
    maxFont
  );
};
