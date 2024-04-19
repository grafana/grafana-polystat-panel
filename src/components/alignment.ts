import { PolygonShapes } from "./types";

export const GetAlignments = (
  shape: PolygonShapes,
  diameterX: number,
  diameterY: number,
  textAreaHeight: number,
  activeValueFontSize: number,
  activeLabelFontSize: number,
  activeTimestampFontSize: number,
  showTimestampEnabled: boolean,
) => {
  let valueWithLabelTextAlignment = textAreaHeight / 2 / 2 + activeValueFontSize / 2;
  let valueOnlyTextAlignment = activeValueFontSize / 2;
  let labelWithValueTextAlignment = -(textAreaHeight / 2 / 2) + activeLabelFontSize / 2;
  let labelOnlyTextAlignment = activeLabelFontSize / 2;
  let labelTextAlignmentX = 0;
  let labelValueAlignmentX = 0;
  let valueWithTimestampAlignment = valueWithLabelTextAlignment / 2;
  let timestampAlignment = textAreaHeight * 0.33 / 2 + activeTimestampFontSize / 2;
  switch (shape) {
    case PolygonShapes.HEXAGON_POINTED_TOP:
      // offset when only showing label
      labelOnlyTextAlignment = activeLabelFontSize * 0.37;
      if (showTimestampEnabled && activeTimestampFontSize > 0) {
        // adjust value down
        valueWithLabelTextAlignment = textAreaHeight * 0.67 / 2 + activeValueFontSize / 2;
      }
      break;
    case PolygonShapes.CIRCLE:
      // offset when only showing label
      labelOnlyTextAlignment = activeLabelFontSize * 0.37;
      if (showTimestampEnabled && activeTimestampFontSize > 0) {
        // adjust value down
        valueWithLabelTextAlignment = textAreaHeight * 0.67 / 2 + activeValueFontSize / 2;
      }
      break;
    case PolygonShapes.SQUARE:
      // square is "centered" at top left, not the center

      // compute alignment for each text element, base coordinate is in the top left corner (text is anchored at its bottom):
      // - Value text (bottom text) will be aligned (positively i.e. lower) in the middle of the bottom half of the text area
      // - Label text (top text) will be aligned in the middle of the top half of the text area
      valueWithLabelTextAlignment = diameterY / 1.5 + activeValueFontSize / 2;
      valueOnlyTextAlignment = diameterY / 2 + activeLabelFontSize * 0.37;
      labelWithValueTextAlignment = diameterY / 4 + activeLabelFontSize / 2;
      // alignment is equal to the half of height plus a fraction of the fontSize
      labelOnlyTextAlignment = diameterY / 2 + activeLabelFontSize * 0.37;
      //
      labelTextAlignmentX = diameterX / 2;
      labelValueAlignmentX = diameterX / 2;
      if (showTimestampEnabled && activeTimestampFontSize > 0) {
        // line spacing offset is needed
        timestampAlignment = diameterY / 1.5 - (activeTimestampFontSize * 0.67);
      }
      break;
  }
  return {
    valueWithLabelTextAlignment,
    valueOnlyTextAlignment,
    valueWithTimestampAlignment,
    labelWithValueTextAlignment,
    labelOnlyTextAlignment,
    labelTextAlignmentX,
    labelValueAlignmentX,
    timestampAlignment,
  };
};
