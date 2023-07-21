import React, { useEffect, createRef, useCallback } from 'react';
import { Tooltip as ReactTooltip, VariantType } from 'react-tooltip';

import { useStyles2, Portal, useTheme2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2, textUtil } from '@grafana/data';
import { hexbin } from 'd3-hexbin';
import { symbol as d3symbol, symbolCircle, symbolSquare } from 'd3';

import { Gradients } from './gradients/Gradients';
import { PolystatOptions, PolygonShapes, PolystatModel, DisplayModes } from './types';
import { LayoutManager } from './layout/layoutManager';
import { getTextSizeForWidthAndHeight } from '../utils';
import { orderBy as lodashOrderBy } from 'lodash';

import { Tooltip } from './tooltips/Tooltip';

export const Polystat: React.FC<PolystatOptions> = (options) => {
  const divStyles = useStyles2(getWrapperStyles);
  const svgStyles = useStyles2(getSVGStyles);
  const svgPathStyles = useStyles2(getSVGPathStyles);
  const noTriggerTextStyles = useStyles2(getNoTriggerTextStyles);
  const errorMessageStyles = useStyles2(getErrorMessageStyles);
  const tooltipTheme = useTheme2().isDark ? 'dark' : 'light';
  // used to change/animate text in polygon
  const [animationRefs, setAnimationRefs] = React.useState([] as any);
  // tracks which metric to display during animation of a composite
  const [animationMetricIndexes, setAnimationMetricIndexes] = React.useState([] as any);
  const [animatedItems, setAnimatedItems] = React.useState([] as any);

  useEffect(() => {
    // clear animationRefs and set new ones
    if (options.processedData!.length > 0) {
      const newAnimationRefs = [];
      const newAnimationMetricIndexes = [];
      for (let i = 0; i < options.processedData!.length; i++) {
        newAnimationRefs.push(createRef());
        newAnimationMetricIndexes.push(0);
      }
      if (newAnimationRefs.length > 0) {
        setAnimationRefs(newAnimationRefs);
        setAnimationMetricIndexes(newAnimationMetricIndexes);
      }
    }
  }, [options.processedData]);

  /*
    This is the animation method that will cycle through the metrics for a composite
   */
  const animateComposite = useCallback(() => {
    //console.log(new Date().toLocaleString() + ` animate loop...`);
    for (let i = 0; i < animatedItems.length; i++) {
      let index = animatedItems[i];
      let metricIndex = animationMetricIndexes[index];
      if (animationRefs.length > 0 && animationRefs[index].current) {
        //console.log(`animating ref ${index}`);
        if (options.processedData) {
          const item = options.processedData[index];
          const val = formatCompositeValue(metricIndex, item, options.globalDisplayTextTriggeredEmpty);
          if (animationRefs[index].current.innerHTML !== null) {
            animationRefs[index].current.innerHTML = val;
          }
        }
      }
      metricIndex++;
      if (options.processedData && options.processedData[index] && options.processedData[index].members.length) {
        metricIndex %= options.processedData[index].members.length;
      }
      animationMetricIndexes[index] = metricIndex;
      setAnimationMetricIndexes(animationMetricIndexes);
    }
  }, [
    animationMetricIndexes,
    animationRefs,
    animatedItems,
    options.processedData,
    options.globalDisplayTextTriggeredEmpty,
  ]);

  /*
    Determine which items should be animated
  */
  useEffect(() => {
    let shouldAnimate = false;
    const animate = [] as any;
    options.processedData!.map((item, index) => {
      if (item.isComposite && item.showValue) {
        shouldAnimate = true;
        animate.push(index);
      }
    });
    setAnimatedItems(animate);
    let tick: NodeJS.Timer;
    if (shouldAnimate) {
      let speed = parseInt(options.compositeConfig.animationSpeed, 10);
      if (speed < 200 || isNaN(speed)) {
        console.log(`WARNING: speed in configuration is too fast, setting to 200ms`);
        speed = 200;
      }
      tick = setInterval(animateComposite, speed);
    }
    return () => {
      clearInterval(tick);
    };
    // TODO: this is a hack to prevent re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.compositeConfig.animationSpeed, options.processedData, animationRefs]);

  if (options.processedData && options.processedData.length === 0) {
    return <div className={noTriggerTextStyles}>{options.globalDisplayTextTriggeredEmpty}</div>;
  }
  if (!options.autoSizeColumns && !options.autoSizeRows) {
    const limit = options.layoutNumColumns * options.layoutNumRows;
    if (limit < options.processedData!.length) {
      return (
        <div className={errorMessageStyles}>
          Not enoughs rows and columns for data. There are {options.processedData!.length} items to display, and only{' '}
          {limit} places allocated.{' '}
        </div>
      );
    }
  }

  const lm = new LayoutManager(
    options.panelWidth,
    options.panelHeight,
    options.layoutNumColumns,
    options.layoutNumRows,
    options.layoutDisplayLimit,
    options.autoSizePolygons,
    options.globalShape
  );
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // determine how many rows and columns are going to be generated
  lm.generatePossibleColumnAndRowsSizes(options.autoSizeColumns, options.autoSizeRows, options.processedData!.length);
  // to determine the radius, the actual number of rows and columns that will be used needs to be calculated
  lm.generateActualColumnAndRowUsage(options.processedData, options.layoutDisplayLimit);
  // next the radius can be determined from actual rows and columns being used
  let radius = 0;
  if (!options.autoSizePolygons && options.globalPolygonSize) {
    if (options.globalPolygonSize < 0 || isNaN(options.globalPolygonSize)) {
      // force min size if below zero or NaN
      options.globalPolygonSize = 50;
      console.log(`WARNING: polygon size is manually set to an invalid value, forcing to 50px`);
    } else {
      lm.setRadius(options.globalPolygonSize);
    }
    radius = options.globalPolygonSize;
  } else {
    radius = lm.generateRadius(options.globalShape);
  }
  // using the known number of columns and rows that can be used in addition to the radius,
  // generate the points to be filled
  const calculatedPoints = lm.generatePoints(options.processedData, options.layoutDisplayLimit, options.globalShape);

  const aHexbin = hexbin()
    .radius(radius)
    .extent([
      [0, 0],
      [options.panelWidth, options.panelHeight],
    ]);
  const { diameterX, diameterY } = lm.getDiameters();
  const { xoffset, yoffset } = lm.getOffsets(options.globalShape, options.processedData!.length);

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

  let customShape: any;
  switch (options.globalShape) {
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

  // calculate the fontsize based on the shape and the text
  let activeLabelFontSize = options.globalFontSize;
  // font sizes are independent for label and values
  let activeValueFontSize = options.globalFontSize;
  let showEllipses = false;
  let numOfChars = options.ellipseCharacters;

  if (options.globalAutoScaleFonts) {
    const result = autoFontScaler(
      options.globalTextFontFamily,
      textAreaWidth,
      textAreaHeight,
      options.globalShowValueEnabled,
      options.processedData!
    );
    activeLabelFontSize = result.activeLabelFontSize;
    activeValueFontSize = result.activeValueFontSize;
    showEllipses = result.showEllipses;
    numOfChars = result.numOfChars;
  }
  const alignments = getAlignments(
    options.globalShape,
    diameterX,
    diameterY,
    textAreaHeight,
    activeValueFontSize,
    activeLabelFontSize
  );

  // this MUST be unique for gradients to work properly
  const gradientId = `polystat_${options.panelId}_` + Math.floor(Math.random() * 10000).toString();

  const drawShape = (index: number, shape: PolygonShapes) => {
    let fillColor = options.processedData![index].color;
    if (options.globalGradientsEnabled) {
      // TODO: safari needs the location.href
      fillColor = `url(#${gradientId}_linear_gradient_state_data_${index})`;
    }
    const useRadius = lm.generateRadius(options.globalShape);
    const coords = getCoords(index);

    switch (shape as any) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        return (
          <path
            data-tooltip-id='polystat-tooltip'
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            className={svgPathStyles}
            key="polystat-tooltip"
            transform={`translate(${coords.x}, ${coords.y})`}
            d={customShape}
            fill={fillColor}
            stroke={options.globalPolygonBorderColor}
            strokeWidth={options.globalPolygonBorderSize + 'px'}
          />
        );
      case PolygonShapes.CIRCLE:
        return (
          <circle
            data-tooltip-id="polystat-tooltip"
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            key="polystat-tooltip"
            className={svgPathStyles}
            cx={coords.x}
            cy={coords.y}
            r={useRadius}
            fill={fillColor}
          />
        );
      case PolygonShapes.SQUARE:
        return (
          <rect
            data-tooltip-id="polystat-tooltip"
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            key="polystat-tooltip"
            className={svgPathStyles}
            x={coords.x}
            y={coords.y}
            height={useRadius * 2}
            width={useRadius * 2}
            fill={fillColor}
          />
        );
      default:
        return (
          <path
            data-tooltip-id="polystat-tooltip"
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            className={svgPathStyles}
            key="polystat-tooltip"
            transform={`translate(${coords.x}, ${coords.y})`}
            d={customShape}
            fill={fillColor}
            stroke={options.globalPolygonBorderColor}
            strokeWidth={options.globalPolygonBorderSize + 'px'}
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
    text: string,
    alias: string
  ) => {
    if (alias !== '') {
      text = alias;
    }
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

          {options.processedData!.map((item, index) => {
            const coords = getCoords(index);
            // TODO: should resolve this during processing
            const ctt = resolveClickThroughTarget(item);
            const useUrl = item.sanitizeURLEnabled ? item.sanitizedURL : item.clickThrough;
            return (
              <>
                {useUrl.length > 0 ? (
                  <a target={ctt} href={useUrl}>
                    {drawShape(index, options.globalShape)}
                  </a>
                ) : (
                  drawShape(index, options.globalShape)
                )}
                <text
                  className="toplabel"
                  x={coords.x + alignments.labelTextAlignmentX}
                  y={coords.y + alignments.labelWithValueTextAlignment}
                  textAnchor="middle"
                  fontFamily={options.globalTextFontFamily}
                  fontSize={activeLabelFontSize + 'px'}
                  style={{
                    fill: options.globalTextFontAutoColorEnabled
                      ? options.globalTextFontAutoColor
                      : options.globalTextFontColor,
                    pointerEvents: 'none',
                  }}
                >
                  {item.showName &&
                    getTextToDisplay(
                      options.globalAutoScaleFonts,
                      options.ellipseEnabled,
                      options.ellipseCharacters,
                      showEllipses,
                      numOfChars,
                      item.name,
                      item.displayName
                    )}
                </text>

                <text
                  ref={animationRefs[index]}
                  className={`valueLabel${index}`}
                  x={coords.x + alignments.labelValueAlignmentX}
                  y={coords.y + alignments.valueWithLabelTextAlignment}
                  textAnchor="middle"
                  fontFamily={options.globalTextFontFamily}
                  fontSize={activeValueFontSize + 'px'}
                  style={{
                    fill: options.globalTextFontAutoColorEnabled
                      ? options.globalTextFontAutoColor
                      : options.globalTextFontColor,
                    pointerEvents: 'none',
                  }}
                >
                  {item.showValue &&
                    (item.isComposite
                      ? formatCompositeValue(0, item, options.globalDisplayTextTriggeredEmpty)
                      : item.valueFormatted)}
                </text>

              </>
            );
          })}
        </g>
      </svg>
      {options.globalTooltipsEnabled && (
        <Portal>
          <ReactTooltip
            style={{
              boxShadow: 'rgba(1, 4, 9, 0.75) 0px 4px 8px 0px',
            }}
            id="polystat-tooltip"
            place={'bottom'} // TODO: make this configurable
            float={true}
            variant={tooltipTheme} // TODO: this could be made configurable (auto, or specified)
            opacity={1} // TODO: make this configurable
            clickable={false} // TODO: make this configurable, extend with per-line clickthrough
            render={({ content, activeAnchor }) => {
              // generate tooltip for item
              if (content) {
                const contentIndex = parseInt(content, 10);
                return (
                  <Tooltip
                    data={options.processedData![contentIndex]}
                    renderTime={options.renderTime!}
                    showTime={options.globalTooltipsShowTimestampEnabled}
                    valueEnabled={options.globalShowValueEnabled}
                    tooltipColumnHeadersEnabled={options.globalShowTooltipColumnHeadersEnabled}
                    primarySortByField={options.tooltipPrimarySortByField}
                    primarySortDirection={options.tooltipPrimarySortDirection}
                    secondarySortByField={options.tooltipSecondarySortByField}
                    secondarySortDirection={options.tooltipSecondarySortDirection}
                    displayMode={options.tooltipDisplayMode}
                    tooltipDisplayTextTriggeredEmpty={options.tooltipDisplayTextTriggeredEmpty}
                    tooltipFontFamily={options.globalTooltipsFontFamily}
                  />
                )
              }
              return (<></>)
            }} />
        </Portal>

      )}
    </div>
  );
};

/*
              The element #{content} is currently not active.
              <br />
              Relevant attribute: {activeAnchor?.getAttribute('data-some-relevant-attr') || 'not set'}
            </span>
*/

const buildTriggerCache = (item: any) => {
  let triggerCache = [];
  for (let i = 0; i < item.members.length; i++) {
    const aMember = item.members[i];
    if (aMember.thresholdLevel > 0) {
      // add to list
      const cachedMemberState = {
        index: i,
        name: aMember.name,
        value: aMember.value,
        thresholdLevel: aMember.thresholdLevel,
      };
      triggerCache.push(cachedMemberState);
    }
  }
  // sort it
  triggerCache = lodashOrderBy(triggerCache, ['thresholdLevel', 'value', 'name'], ['desc', 'desc', 'asc']);
  return triggerCache;
};

const formatCompositeValue = (frames: number, item: PolystatModel, globalDisplayTextTriggeredEmpty: string) => {
  // TODO: if just one value, could speed this up
  let content = item.valueFormatted;
  const len = item.members.length;
  if (len > 0) {
    let triggeredIndex = -1;
    if (item.displayMode === DisplayModes[0].value) {
      triggeredIndex = frames % len;
    } else {
      if (typeof item.triggerCache === 'undefined') {
        item.triggerCache = buildTriggerCache(item);
      }
      if (item.triggerCache.length > 0) {
        const z = frames % item.triggerCache.length;
        triggeredIndex = item.triggerCache[z].index;
      } else {
        // nothing triggered        //triggeredIndex = frames % len;
        return globalDisplayTextTriggeredEmpty;
      }
    }
    const aMember = Object.assign({}, item.members[triggeredIndex]);
    content = aMember.name + ': ' + aMember.valueFormatted;
  }
  return textUtil.sanitize(content);
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
  fontFamily: string,
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
        const checkContent = data[i].members[counter].displayName + ': ' + data[i].members[counter].valueFormatted;
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
    fontFamily,
    minFont,
    maxFont,
    maxLinesToDisplay,
    textAreaWidth,
    textAreaHeight
  );
  let activeValueFontSize = computeTextFontSize(
    maxValue,
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

const getNoTriggerTextStyles = (theme: GrafanaTheme2) => css`
  font-size: ${theme.typography.h1.fontSize};
  text-align: center;
  justify-content: center;
  color: ${theme.colors.success.shade};
`;

const getErrorMessageStyles = (theme: GrafanaTheme2) => css`
  font-size: ${theme.typography.h1.fontSize};
  text-align: center;
  justify-content: center;
  color: ${theme.colors.error.shade};
`;

const getWrapperStyles = (theme: GrafanaTheme2) => css`
  fill: transparent;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const getSVGStyles = (theme: GrafanaTheme2) => css`
  text-align: center;
  align-items: center;
  justify-content: center;
  fill: transparent;
`;

const getSVGPathStyles = (theme: GrafanaTheme2) => css`
  outline: none !important;
`;
