// @ts-ignore
import React, { useState, useEffect, MouseEvent, useRef, createRef } from 'react';

import { useStyles } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';
import { hexbin } from 'd3-hexbin';
import { symbol as d3symbol, symbolCircle, symbolSquare } from 'd3';

import { Gradients } from './gradients/Gradients';
import { PolystatOptions, PolygonShapes, PolystatModel } from './types';
import { LayoutManager } from './layout/layoutManager';
import { getTextSizeForWidthAndHeight } from '../utils';

import { Tooltip } from './tooltips/Tooltip';

export const Polystat: React.FC<PolystatOptions> = (options) => {
  const divStyles = useStyles(getWrapperStyles);
  const svgStyles = useStyles(getSVGStyles);

  const [elRefs, setElRefs] = React.useState([]);
  const messageStyleWarning = {
    color: 'yellow',
  };
  const messageStyleError = {
    color: 'red',
  };

  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(options.processedData.length)
        .fill(0)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [options.processedData.length]);

  const [showTooltips, setShowTooltips] = useState([]);

  useEffect(() => {
    // add or remove refs
    setShowTooltips((tt) => Array(options.processedData.length).fill(false));
  }, [options.processedData.length]);

  if (options.processedData.length === 0) {
    return <div style={messageStyleWarning}>Wait for rendering to complete...</div>;
  }
  if (!options.autoSizeColumns && !options.autoSizeRows) {
    const limit = options.layoutNumColumns * options.layoutNumRows;
    if (limit < options.processedData.length) {
      return (
        <div style={messageStyleError}>
          Not enoughs rows and columns for data. There are {options.processedData.length} items to display, and only{' '}
          {limit} places allocated.{' '}
        </div>
      );
    }
  }

  /*
  const [lm] = useState(
    new LayoutManager(
      options.panelWidth,
      options.panelHeight,
      options.numColumns,
      options.numRows,
      options.displayLimit,
      options.radiusAutoSize,
      options.shape
    )
  );
  */
  const lm = new LayoutManager(
    options.panelWidth,
    options.panelHeight,
    options.layoutNumColumns,
    options.layoutNumRows,
    options.layoutDisplayLimit,
    options.autoSizePolygons,
    options.shape
  );
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  //console.log(`yes... ${options.panelWidth} ${options.panelHeight}`);
  // determine how many rows and columns are going to be generated
  lm.generatePossibleColumnAndRowsSizes(options.autoSizeColumns, options.autoSizeRows, options.processedData.length);
  // to determine the radius, the actual number of rows and columns that will be used needs to be calculated
  lm.generateActualColumnAndRowUsage(options.processedData, options.layoutDisplayLimit);
  // next the radius can be determined from actual rows and columns being used
  let radius = 0;
  if (!options.autoSizePolygons && options.globalPolygonSize) {
    lm.setRadius(options.globalPolygonSize);
    radius = options.globalPolygonSize;
  } else {
    radius = lm.generateRadius(options.shape);
  }
  // using the known number of columns and rows that can be used in addition to the radius,
  // generate the points to be filled
  const calculatedPoints = lm.generatePoints(options.processedData, options.layoutDisplayLimit, options.shape);

  const aHexbin = hexbin()
    .radius(radius)
    .extent([
      [0, 0],
      [options.panelWidth, options.panelHeight],
    ]);
  const { diameterX, diameterY } = lm.getDiameters();
  const { xoffset, yoffset } = lm.getOffsets(options.shape, options.processedData.length);

  // compute text area size (used to calculate the fontsize)
  const textAreaWidth = diameterX;
  const textAreaHeight = diameterY / 2; // Top and bottom of hexagon are not used
  // symbols use the area for their size
  let innerArea = diameterX * diameterY;
  // use the smaller of diameterX or Y
  if (diameterX < diameterY) {
    innerArea = diameterX * diameterX;
  }
  if (diameterY < diameterX) {
    innerArea = diameterY * diameterY;
  }
  // square and circle do not use this
  const symbol = d3symbol().size(innerArea);

  let customShape = null;
  switch (options.shape as any) {
    case PolygonShapes.HEXAGON_POINTED_TOP:
      customShape = aHexbin.hexagon(radius);
      break;
    case PolygonShapes.CIRCLE:
      customShape = symbol.type(symbolCircle);
      break;
    case PolygonShapes.SQUARE:
      customShape = symbol.type(symbolSquare);
      break;
    default:
      customShape = aHexbin.hexagon(radius);
      break;
  }
  // @ts-ignore
  const miscBin = (data: any): any => {
    for (let i = 0; i < data.length; i++) {
      data[i].x = data[i][0];
      data[i].y = data[i][1];
    }
    return data;
  };
  // @ts-ignore
  const resolveClickThroughTarget = (d: any): string => {
    let clickThroughTarget = '_self';
    if (d.newTabEnabled === true) {
      clickThroughTarget = '_blank';
    }
    return clickThroughTarget;
  };

  const getCoords = (i: number) => {
    const xValue = calculatedPoints[i][0];
    const yValue = calculatedPoints[i][1];
    return { x: xValue, y: yValue };
  };
  const ct1 = '_blank';
  // calculate the fontsize based on the shape and the text
  let activeLabelFontSize = options.globalFontSize;
  // font sizes are independent for label and values
  let activeValueFontSize = options.globalFontSize;
  let showEllipses = false;
  let numOfChars = options.ellipseCharacters;

  if (options.globalAutoScaleFonts) {
    const result = autoFontScaler(textAreaWidth, textAreaHeight, options.valueEnabled, options.processedData);
    activeLabelFontSize = result.activeLabelFontSize;
    activeValueFontSize = result.activeValueFontSize;
    showEllipses = result.showEllipses;
    numOfChars = result.numOfChars;
  }
  const alignments = getAlignments(
    options.shape,
    diameterX,
    diameterY,
    textAreaHeight,
    activeValueFontSize,
    activeLabelFontSize
  );

  // this MUST be unique for gradients to work properly
  const gradientId = `polystat_${options.panelId}_` + Math.floor(Math.random() * 10000).toString();

  const handleTooltipShow = (e: MouseEvent<SVGPathElement>, index: number) => {
    e.preventDefault();
    // Do something
    let newState = [...showTooltips];
    console.log(`handleTooltipShow ${newState[index]}`);
    newState[index] = true;
    setShowTooltips(newState);
  };

  const handleTooltipHide = (e: MouseEvent<SVGPathElement>, index: number) => {
    e.preventDefault();
    // Do something
    let newState = [...showTooltips];
    console.log(`handleTooltipHide ${newState[index]}`);
    newState[index] = false;
    setShowTooltips(newState);
  };

  const handleTooltipMove = (e: MouseEvent<SVGPathElement>, index: number) => {
    e.preventDefault();
    // Do something
  };

  const drawShape = (index: number, shape: PolygonShapes) => {
    let fillColor = options.processedData[index].color;
    if (options.globalGradientsEnabled) {
      // TODO: safari needs the location.href
      fillColor = `url(#${gradientId}_linear_gradient_state_data_${index})`;
    }
    const useRadius = lm.generateRadius(options.shape);
    const coords = getCoords(index);
    switch (shape as any) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        return (
          <path
            ref={elRefs[index]}
            transform={`translate(${coords.x}, ${coords.y})`}
            d={customShape}
            fill={fillColor}
            stroke={options.globalPolygonBorderColor}
            strokeWidth={options.globalPolygonBorderSize + 'px'}
            onMouseMove={(e) => handleTooltipMove(e, index)}
            onMouseOver={(e) => handleTooltipShow(e, index)}
            onMouseOut={(e) => handleTooltipHide(e, index)}
          />
        );
      case PolygonShapes.CIRCLE:
        return (
          <circle
            className="circle"
            cx={coords.x}
            cy={coords.y}
            r={useRadius}
            fill={fillColor}
            onMouseMove={(e) => handleTooltipMove(e, index)}
            onMouseOver={(e) => handleTooltipShow(e, index)}
            onMouseOut={(e) => handleTooltipHide(e, index)}
          />
        );
      case PolygonShapes.SQUARE:
        return (
          <rect
            className="rect"
            x={coords.x}
            y={coords.y}
            height={useRadius * 2}
            width={useRadius * 2}
            fill={fillColor}
            onMouseMove={(e) => handleTooltipMove(e, index)}
            onMouseOver={(e) => handleTooltipShow(e, index)}
            onMouseOut={(e) => handleTooltipHide(e, index)}
          />
        );
      default:
        return (
          <path
            transform={`translate(${coords.x}, ${coords.y})`}
            d={customShape}
            fill={fillColor}
            stroke={options.globalPolygonBorderColor}
            strokeWidth={options.globalPolygonBorderSize + 'px'}
            onMouseMove={(e) => handleTooltipMove(e, index)}
            onMouseOver={(e) => handleTooltipShow(e, index)}
            onMouseOut={(e) => handleTooltipHide(e, index)}
          />
        );
    }
  };

  const getTextToDisplay = (
    autoSizeFonts: boolean,
    ellipseEnabled: boolean,
    ellipseCharacters: number,
    showEllipses: boolean,
    numOfChars: number,
    text: string
  ) => {
    if (showEllipses) {
      return text.substring(0, numOfChars) + '...';
    }
    if (!autoSizeFonts && ellipseEnabled && text.length > ellipseCharacters) {
      return text.substring(0, ellipseCharacters) + '...';
    }
    return text;
  };

  return (
    <div className={divStyles}>
      <svg
        className={svgStyles}
        width={options.panelWidth}
        height={options.panelHeight}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`${xoffset},${yoffset},${options.panelWidth},${options.panelHeight}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Gradients gradientId={gradientId} data={options.processedData} />

          {options.processedData.map((item, index) => {
            //let shapeData = null;
            //if (hasClick) {
            //  shapeData = <a target={ct1} href={url1}> {drawShape(0, options.shape)} </a>
            //} else {
            //  shapeData = drawShape(0, options.shape);
            //}
            const coords = getCoords(index);
            return (
              <>
                {item.clickThrough.length > 0 ? (
                  <a target={ct1} href={item.clickThrough}>
                    {' '}
                    {drawShape(index, options.shape)}{' '}
                  </a>
                ) : (
                  drawShape(index, options.shape)
                )}
                <Tooltip
                  data={options.processedData[index]}
                  renderTime={options.renderTime}
                  valueEnabled={options.valueEnabled}
                  visible={showTooltips[index]}
                  followMouse={true}
                  reference={elRefs[index]}
                  primarySortByField={options.tooltipPrimarySortByField}
                  primarySortDirection={options.tooltipPrimarySortDirection}
                  secondarySortByField={options.tooltipSecondarySortByField}
                  secondarySortDirection={options.tooltipSecondarySortDirection}
                />
                <text
                  className="toplabel"
                  x={coords.x + alignments.labelTextAlignmentX}
                  y={coords.y + alignments.labelWithValueTextAlignment}
                  textAnchor="middle"
                  fontFamily="Roboto"
                  fontSize={activeLabelFontSize + 'px'}
                  style={{ fill: 'black', pointerEvents: 'none' }}
                >
                  {getTextToDisplay(
                    options.globalAutoScaleFonts,
                    options.ellipseEnabled,
                    options.ellipseCharacters,
                    showEllipses,
                    numOfChars,
                    item.name
                  )}
                </text>

                <text
                  className={`valueLabel${index}`}
                  x={coords.x + alignments.labelValueAlignmentX}
                  y={coords.y + alignments.valueWithLabelTextAlignment}
                  textAnchor="middle"
                  fontFamily="Roboto"
                  fontSize={activeValueFontSize + 'px'}
                  style={{ fill: 'black', pointerEvents: 'none' }}
                >
                  {item.valueFormatted}
                </text>
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const getAlignments = (
  shape: PolygonShapes,
  diameterX: number,
  diameterY: number,
  textAreaHeight: number,
  activeValueFontSize: number,
  activeLabelFontSize: number
) => {
  let valueWithLabelTextAlignment = textAreaHeight / 2 / 2 + activeValueFontSize / 2;
  let valueOnlyTextAlignment = activeValueFontSize / 2;
  let labelWithValueTextAlignment = -(textAreaHeight / 2 / 2) + activeLabelFontSize / 2;
  let labelOnlyTextAlignment = activeLabelFontSize / 2;
  let labelTextAlignmentX = 0;
  let labelValueAlignmentX = 0;

  switch (shape) {
    case PolygonShapes.HEXAGON_POINTED_TOP:
      // offset when only showing label
      labelOnlyTextAlignment = activeLabelFontSize * 0.37;
      break;
    case PolygonShapes.CIRCLE:
      // offset when only showing label
      labelOnlyTextAlignment = activeLabelFontSize * 0.37;
      break;
    case PolygonShapes.SQUARE:
      // square is "centered" at top left, not the center

      // compute alignment for each text element, base coordinate is at the top left corner (text is anchored at its bottom):
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
      break;
  }
  return {
    valueWithLabelTextAlignment,
    valueOnlyTextAlignment,
    labelWithValueTextAlignment,
    labelOnlyTextAlignment,
    labelTextAlignmentX,
    labelValueAlignmentX,
  };
};

const autoFontScaler = (
  textAreaWidth: number,
  textAreaHeight: number,
  valueEnabled: boolean,
  data: PolystatModel[]
) => {
  // TODO: 6 is VERY small, perhaps 10 as a min?
  // A hint from the config could be used (max characters)
  const minFont = 6;
  const maxFont = 240;
  // this ensures we have space between label and value
  const maxLinesToDisplay = 2;
  let showEllipses = false;
  //number of characters to show on polygon
  let numOfChars = 0;
  // find the most text that will be displayed over all items
  let maxLabel = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i].name.length > maxLabel.length) {
      maxLabel = data[i].name;
    }
  }
  // same for the value, also check for sub metrics size in case of composite
  let maxValue = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i].valueFormatted.length > maxValue.length) {
      maxValue = data[i].valueFormatted;
    }
    const subMetricCount = data[i].members.length;
    if (subMetricCount > 0) {
      let counter = 0;
      while (counter < subMetricCount) {
        const checkContent = data[i].members[counter].valueFormatted;
        if (checkContent && checkContent.length > maxValue.length) {
          maxValue = checkContent;
        }
        counter++;
      }
    }
  }
  // estimate how big of a font can be used
  // Two lines of text must fit with vertical spacing included
  // if it is too small, hide everything
  let activeLabelFontSize = computeTextFontSize(
    maxLabel,
    minFont,
    maxFont,
    maxLinesToDisplay,
    textAreaWidth,
    textAreaHeight
  );
  let activeValueFontSize = computeTextFontSize(
    maxValue,
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
          minFont,
          maxFont,
          maxLinesToDisplay,
          textAreaWidth,
          textAreaHeight
        );
      }
    }
  }
  // NOTE: allow different sizes, the value could be displayed larger than the label
  // value should never be larger than the label
  //if (activeValueFontSize > activeLabelFontSize) {
  //  activeValueFontSize = activeLabelFontSize;
  //}
  if (!valueEnabled) {
    activeValueFontSize = 0;
  }
  return { activeLabelFontSize, activeValueFontSize, showEllipses, numOfChars };
};

const computeTextFontSize = (
  text: string,
  minFont: number,
  maxFont: number,
  linesToDisplay: number,
  textAreaWidth: number,
  textAreaHeight: number
): number => {
  return getTextSizeForWidthAndHeight(
    text,
    '?px sans-serif', // use sans-serif for sizing
    textAreaWidth,
    textAreaHeight / linesToDisplay, // multiple lines of text
    minFont,
    maxFont
  );
};

const getWrapperStyles = (theme: GrafanaTheme) => css`
  fill: transparent;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const getSVGStyles = (theme: GrafanaTheme) => css`
  text-align: center;
  align-items: center;
  justify-content: center;
  fill: transparent;
`;

// @ts-ignore
const getTooltipStyles = (theme: GrafanaTheme) => css`
  position: absolute;
  width: max-content;
  color: white;
  height: auto;
  padding: 10px;
  background-color: black;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 1020;
`;

// @ts-ignore
const getPolystatPanelQuadrantStyles = (theme: GrafanaTheme) => css`
  position: absolute;
  color: white;
  height: auto;
  padding: 10px;
  background-color: black;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;
