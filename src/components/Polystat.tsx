import React, { useEffect, createRef, useCallback } from 'react';
import { textUtil } from '@grafana/data';
import { useStyles2, Portal, useTheme2 } from '@grafana/ui';
import { symbol as d3symbol, symbolCircle, symbolSquare } from 'd3';
import { hexbin } from 'd3-hexbin';
import { orderBy as lodashOrderBy } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { Gradients } from './gradients/Gradients';
import { LayoutManager } from './layout/layoutManager';
import { PolystatOptions, PolygonShapes, PolystatModel, DisplayModes, TimestampPositions } from './types';

import { getErrorMessageStyles, getNoTriggerTextStyles, getSVGPathStyles, getSVGStyles, getWrapperStyles } from './styles';
import { Tooltip } from './tooltips/Tooltip';
import { AutoFontScalar } from './auto_font_scaler';
import { GetAlignments } from './alignment';
import { getTemplateSrv } from '@grafana/runtime';

export const Polystat: React.FC<PolystatOptions> = (options) => {
  const divStyles = useStyles2(getWrapperStyles);
  const svgStyles = useStyles2(getSVGStyles);
  const svgPathStyles = useStyles2(getSVGPathStyles);
  const noTriggerTextStyles = useStyles2(getNoTriggerTextStyles);
  const errorMessageStyles = useStyles2(getErrorMessageStyles);
  const tooltipTheme = useTheme2().isDark ? 'dark' : 'light';
  // used to change/animate text in polygon
  const [animationRefs, setAnimationRefs] = React.useState([] as any);
  const [animationTimestampRefs, setAnimationTimestampRefs] = React.useState([] as any);
  // tracks which metric to display during animation of a composite
  const [animationMetricIndexes, setAnimationMetricIndexes] = React.useState([] as any);
  const [animatedItems, setAnimatedItems] = React.useState<number[]>([]);
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  // this MUST be unique for gradients to work properly
  const [uniquePanelId] = React.useState<string>(`polystat_${options.panelId}_` + Math.floor(Math.random() * 10000).toString());

  const updateAnimation = (data: PolystatModel[]) => {
    if (data.length > 0) {
      const newAnimationRefs = [];
      const newAnimationTimestampRefs = [];
      const newAnimationMetricIndexes = [];
      for (let i = 0; i < data!.length; i++) {
        newAnimationRefs.push(createRef());
        newAnimationTimestampRefs.push(createRef());
        newAnimationMetricIndexes.push(0);
      }
      if (newAnimationRefs.length > 0) {
        if (animationRefs.length !== newAnimationRefs.length) {
          setAnimationRefs(newAnimationRefs);
          setAnimationTimestampRefs(newAnimationTimestampRefs);
          setAnimationMetricIndexes(newAnimationMetricIndexes);
        }
      }
    }
  };

  /*
    This is the animation method that will cycle through the metrics for a composite
   */
  const animateComposite = useCallback(() => {
    for (let i = 0; i < animatedItems.length; i++) {
      let index = animatedItems[i];
      let metricIndex = animationMetricIndexes[index];

      // composites can have animated values displayed
      let isValueAnimated = false;
      if (options.globalShowValueEnabled ||
        (options.processedData && options.processedData[index].isComposite && options.processedData[index].showValue)
      ) {
        isValueAnimated = true;
      }
      if (isValueAnimated && options.processedData && (animationRefs.length > 0 && animationRefs[index].current)) {
        const item = options.processedData[index];
        const val = formatCompositeValueAndTimestamp(metricIndex, item, options.globalDisplayTextTriggeredEmpty)[0];
        if (animationRefs[index].current.innerHTML !== null) {
          animationRefs[index].current.innerHTML = val;
        }
      }
      // currently global setting determines if timestamp is animated
      if (options.globalShowTimestampEnabled && options.processedData && (animationTimestampRefs.length > 0 && animationTimestampRefs[index].current)) {
        const item = options.processedData[index];
        const ts = formatCompositeValueAndTimestamp(metricIndex, item, options.globalDisplayTextTriggeredEmpty)[1];
        if (animationTimestampRefs[index].current.innerHTML !== null) {
          animationTimestampRefs[index].current.innerHTML = ts;
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
    animationTimestampRefs,
    animatedItems,
    options.processedData,
    options.globalDisplayTextTriggeredEmpty,
    options.globalShowTimestampEnabled,
    options.globalShowValueEnabled,
  ]);

  /*
    Determine which items should be animated
  */

  useEffect(() => {
    let shouldAnimate = false;
    const animate: number[] = [];
    options.processedData!.map((item, index) => {
      if (item.isComposite && item.showValue) {
        shouldAnimate = true;
        animate.push(index);
      }
    });
    // check array content equality
    if (JSON.stringify(animatedItems) !== JSON.stringify(animate)) {
      if (options.processedData) {
        updateAnimation(options.processedData);
        setAnimatedItems(animate);
      }
    }
    let tick: NodeJS.Timeout;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.compositeConfig.animationSpeed, options.processedData, animationRefs]);

  const detectNoDataEmptyState = () => {
    if (options.processedData && options.processedData.length === 0) {
      return <div className={noTriggerTextStyles}>{options.globalDisplayTextTriggeredEmpty}</div>;
    }
    return null;
  };

  const detectLayoutIssue = () => {
    if (!options.autoSizeColumns && !options.autoSizeRows) {
      const limit = options.layoutNumColumns * options.layoutNumRows;
      if (limit < options.processedData!.length) {
        return (
          <div className={errorMessageStyles}>
            Not enough rows and columns for data. There are {options.processedData!.length} items to display, and only{' '}
            {limit} places allocated.{' '} See the Display Limit setting in category Layout{' '}
          </div>
        );
      }
    }
    return null;
  };

  const lm = new LayoutManager(
    options.panelWidth,
    options.panelHeight,
    options.layoutNumColumns,
    options.layoutNumRows,
    options.layoutDisplayLimit,
    options.autoSizePolygons,
    options.globalShape
  );

  // determine how many rows and columns are going to be generated
  lm.generatePossibleColumnAndRowsSizes(options.autoSizeColumns, options.autoSizeRows, options.layoutDisplayLimit, options.processedData!.length);
  // to determine the radius, the actual number of rows and columns that will be used needs to be calculated
  lm.generateActualColumnAndRowUsage(options.processedData, options.layoutDisplayLimit);
  // next the radius can be determined from actual rows and columns being used
  let radius = 0;
  if (!options.autoSizePolygons && options.globalPolygonSize) {
    // user specified the size as either numeric, or template variable
    let calculatedGlobalPolygonSize = options.globalPolygonSize;
    let useNumber = NaN;
    if (!isNaN(Number(calculatedGlobalPolygonSize))) {
      useNumber = Number(calculatedGlobalPolygonSize);
    } else {
      // handle templated size
      let replaced = getTemplateSrv().replace(calculatedGlobalPolygonSize);
      if (!isNaN(Number(replaced))) {
        useNumber = Number(replaced);
      } else {
        useNumber = NaN;
      }
    }
    if (useNumber < 0 || isNaN(useNumber)) {
      // force min size if below zero or NaN
      useNumber = 50;
      console.log(`WARNING: polygon size is manually set to an invalid value, forcing to 50px`);
    } else {
      lm.setRadius(useNumber);
    }
    radius = useNumber;
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
  const { xoffset, yoffset } = lm.getOffsets(options.globalShape, options.layoutDisplayLimit, options.processedData!.length);

  // compute text area size (used to calculate the fontsize)
  const textAreaWidth = diameterX;
  const textAreaHeight = diameterY / 2; // Top and bottom of hexagon are not used
  // symbols use the area for their size
  let innerArea = diameterX * diameterY;
  // use the smallest of diameterX or Y
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

  const resolveClickThroughTarget = (d: PolystatModel): string => {
    let clickThroughTarget = '_self';
    if (d.newTabEnabled) {
      clickThroughTarget = '_blank';
    }
    // when a custom clickthrough is enabled, override the default _self
    if (d.customClickthroughTargetEnabled) {
      clickThroughTarget = d.customClickthroughTarget;
    }
    return clickThroughTarget;
  };

  const getCoords = (i: number) => {
    if (i < calculatedPoints.length) {
      const xValue = calculatedPoints[i].x;
      const yValue = calculatedPoints[i].y;
      return { x: xValue, y: yValue };
    }
    return null;
  };

  // calculate the fontsize based on the shape and the text
  let activeLabelFontSize = options.globalLabelFontSize;
  // font sizes are independent for label and values
  let activeValueFontSize = options.globalValueFontSize;
  let activeCompositeValueFontSize = options.globalCompositeValueFontSize;
  // timestamp sizing
  let activeTimestampFontSize = options.globalShowTimestampFontSize;
  let showEllipses = false;
  let numOfChars = options.ellipseCharacters;

  let hasShowTimeStampEnabled = options.globalShowTimestampEnabled;
  let hasShowValueEnabled = options.globalShowValueEnabled;

  if (options.globalAutoScaleFonts) {
    const result = AutoFontScalar(
      options.globalTextFontFamily,
      textAreaWidth,
      textAreaHeight,
      hasShowValueEnabled,
      hasShowTimeStampEnabled,
      options.processedData!
    );
    activeLabelFontSize = result.activeLabelFontSize;
    activeValueFontSize = result.activeValueFontSize;
    activeCompositeValueFontSize = result.activeCompositeValueFontSize;
    activeTimestampFontSize = result.activeTimestampFontSize;
    showEllipses = result.showEllipses;
    numOfChars = result.numOfChars;
  }

  const alignments = GetAlignments(
    options.globalShape,
    diameterX,
    diameterY,
    textAreaHeight,
    activeValueFontSize,
    activeLabelFontSize,
    activeTimestampFontSize,
    hasShowTimeStampEnabled
  );

  let timestampLineSpacing = Math.ceil(activeValueFontSize * 0.20);
  if (activeValueFontSize > activeTimestampFontSize) {
    timestampLineSpacing = Math.ceil(activeTimestampFontSize * 0.20);
  }
  // composites can have their own settings for displaying the value
  let compositeTimestampLineSpacing = Math.ceil(activeCompositeValueFontSize);
  if (activeCompositeValueFontSize > activeTimestampFontSize) {
    // ABOVE
    compositeTimestampLineSpacing = Math.ceil(activeTimestampFontSize * 0.75);
    // BELOW
    if (options.globalShowTimestampPosition === TimestampPositions.BELOW_VALUE) {
      compositeTimestampLineSpacing = Math.ceil(activeTimestampFontSize);
    }
  }


  const drawShape = (index: number, shape: PolygonShapes) => {
    let fillColor = options.processedData![index].color;
    if (options.globalGradientsEnabled) {
      // TODO: safari needs the location.href
      fillColor = `url(#${uniquePanelId}_linear_gradient_state_data_${index})`;
    }
    const useRadius = lm.generateRadius(options.globalShape);
    const coords = getCoords(index);
    if (!coords) {
      return;
    }

    switch (shape as any) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        return (
          <path
            data-tooltip-id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : null}
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            className={svgPathStyles}
            key={`polystat-tooltip-${uniquePanelId}`}
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
            data-tooltip-id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : null}
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            key={`polystat-tooltip-${uniquePanelId}`}
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
            data-tooltip-id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : null}
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            key={`polystat-tooltip-${uniquePanelId}`}
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
            data-tooltip-id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : null}
            data-tooltip-content={index}
            data-tooltip-position-strategy='fixed'
            className={svgPathStyles}
            key={`polystat-tooltip-${uniquePanelId}`}
            transform={`translate(${coords.x}, ${coords.y})`}
            d={customShape}
            fill={fillColor}
            stroke={options.globalPolygonBorderColor}
            strokeWidth={options.globalPolygonBorderSize + 'px'}
          />
        );
    }
  };

  // allows the polygon to fill the horizontal space if the manually specified number of columns has not been used
  let marginLeft = margin.left;
  if ((!options.autoSizeColumns) && (radius) && (lm.maxColumnsUsed < options.layoutNumColumns)) {
    let difference = options.layoutNumColumns - lm.maxColumnsUsed;
    marginLeft += radius * difference;
  }
  // allows the polygon to fill the vertical space if the manually specified number of rows has not been used
  let marginTop = margin.top;
  if ((!options.autoSizeRows) && (radius) && (lm.maxRowsUsed < options.layoutNumRows)) {
    let difference = options.layoutNumRows - lm.maxRowsUsed;
    // always starts at zero, skip offset for first row used
    marginTop += radius * (difference - 1);
  }

  const getLabelContent = (item: PolystatModel, index: number, coords: { x: number, y: number }) => {
    let verticalAlignment = alignments.labelWithValueTextAlignment;
    if (!item.showValue) {
      verticalAlignment = alignments.labelOnlyTextAlignment;
    }
    return (
      <text
        className="toplabel"
        x={coords.x + alignments.labelTextAlignmentX}
        y={coords.y + verticalAlignment}
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
        {
          item.showName &&
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
    );
  };

  const getValueContent = (item: PolystatModel, index: number, coords: { x: number, y: number }) => {
    // default
    let verticalAlignment = alignments.valueWithLabelTextAlignment;
    // check if showTimeStamp is enabled
    // TODO: the show value should be inside the item also
    if (options.globalShowTimestampEnabled) {
      // TODO: the offset should be put inside the item also to handle overrides and composites correctly
      if (isNaN(options.globalShowTimestampYOffset)) {
        options.globalShowTimestampYOffset = 0;
      }
      switch (options.globalShowTimestampPosition) {
        case TimestampPositions.ABOVE_VALUE:
          verticalAlignment = alignments.valueWithLabelTextAlignment;
          break;
        case TimestampPositions.BELOW_VALUE:
          verticalAlignment = alignments.timestampAlignment + timestampLineSpacing;
          if (item.isComposite && item.showValue) {
            // compositeTimestampLineSpacing not used for composite here
            verticalAlignment = alignments.timestampAlignment;
          }
          break;
      }
    }
    let valueContent = "";
    if (item.isComposite) {
      if (item.showValue) {
        valueContent = formatCompositeValueAndTimestamp(0, item,
          options.globalDisplayTextTriggeredEmpty)[0];
      }
    } else {
      if (options.globalShowValueEnabled) {
        valueContent = item.valueFormatted;
      }
    }
    let useFontSize = activeValueFontSize;
    if (item.isComposite) {
      useFontSize = activeCompositeValueFontSize;
    }
    return (
      <text
        ref={animationRefs[index]}
        className={`valueLabel${index}`}
        x={coords.x + alignments.labelValueAlignmentX}
        y={coords.y + verticalAlignment}
        textAnchor="middle"
        fontFamily={options.globalTextFontFamily}
        fontSize={useFontSize + 'px'}
        style={{
          fill: options.globalTextFontAutoColorEnabled
            ? options.globalTextFontAutoColor
            : options.globalTextFontColor,
          pointerEvents: 'none',
        }}
      >
        {valueContent}
      </text>
    );
  };

  const getTimestampForValueContent = (item: PolystatModel, index: number, coords: { x: number, y: number }) => {
    // TODO: the offset should be put inside the item also to handle overrides and composites correctly
    if (isNaN(options.globalShowTimestampYOffset)) {
      options.globalShowTimestampYOffset = 0;
    }
    let verticalAlignment = alignments.timestampAlignment - timestampLineSpacing + options.globalShowTimestampYOffset;
    switch (options.globalShowTimestampPosition) {
      case TimestampPositions.ABOVE_VALUE:
        if (item.showValue) {
          verticalAlignment = alignments.timestampAlignment - timestampLineSpacing + options.globalShowTimestampYOffset;
          if (item.isComposite) {
            verticalAlignment = alignments.timestampAlignment - compositeTimestampLineSpacing + options.globalShowTimestampYOffset;
          }
        } else {
          // the below calc can be used when value is not displayed
          verticalAlignment = alignments.valueWithLabelTextAlignment + options.globalShowTimestampYOffset;
        }
        break;
      case TimestampPositions.BELOW_VALUE:
        verticalAlignment = alignments.valueWithLabelTextAlignment + options.globalShowTimestampYOffset;
        if (item.isComposite && item.showValue) {
          verticalAlignment = activeCompositeValueFontSize + compositeTimestampLineSpacing + options.globalShowTimestampYOffset;
        }
        break;
    }
    return (
      <text
        ref={animationTimestampRefs[index]}
        className={`timestampLabel${index}`}
        x={coords.x + alignments.labelValueAlignmentX}
        y={coords.y + verticalAlignment}
        textAnchor="middle"
        fontFamily={options.globalTextFontFamily}
        fontSize={activeTimestampFontSize + 'px'}
        style={{
          fill: options.globalTextFontAutoColorEnabled
            ? options.globalTextFontAutoColor
            : options.globalTextFontColor,
          pointerEvents: 'none',
        }}
      >
        {options.globalShowTimestampEnabled &&
          (item.isComposite
            ? formatCompositeValueAndTimestamp(0, item, options.globalDisplayTextTriggeredEmpty)[1]
            : item.timestampFormatted)}
      </text>
    )
  };

  const detectEmptyState = detectNoDataEmptyState();
  if (detectEmptyState !== null) {
    return detectEmptyState;
  }

  const layoutIssueDetected = detectLayoutIssue();
  if (layoutIssueDetected !== null) {
    return layoutIssueDetected;
  }

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

        <g transform={`translate(${marginLeft},${marginTop})`}>
          <Gradients gradientId={uniquePanelId} data={options.processedData} />

          {options.processedData!.map((item, index) => {
            const coords = getCoords(index);
            if (!coords) {
              return;
            }
            const useUrl = item.sanitizeURLEnabled ? item.sanitizedURL : item.clickThrough;
            // determine if a target is required
            const resolvedClickthroughTarget = resolveClickThroughTarget(item);
            let clickableUrl: JSX.Element;
            // only add target attribute when there is one specified
            if ((resolvedClickthroughTarget.length > 0) && (useUrl.length > 0)) {
              clickableUrl = <a target={resolvedClickthroughTarget} href={useUrl}>
                {drawShape(index, options.globalShape)}
              </a>;
            } else {
              clickableUrl = <a href={useUrl}>
                {drawShape(index, options.globalShape)}
              </a>;
            }
            return (
              <>
                {useUrl.length > 0 && clickableUrl ? (
                  clickableUrl
                ) : (
                  drawShape(index, options.globalShape)
                )}
                {getLabelContent(item, index, coords)}
                {getValueContent(item, index, coords)}
                {getTimestampForValueContent(item, index, coords)}
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
            id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : undefined}
            place={'bottom'} // TODO: make this configurable
            float={true}
            variant={tooltipTheme} // TODO: this could be made configurable (auto, or specified)
            opacity={1} // TODO: make this configurable
            clickable={false} // TODO: make this configurable, extend with per-line clickthrough
            render={({ content }) => {
              // generate tooltip for item
              if (content) {
                const contentIndex = parseInt(content, 10);
                return (
                  <Tooltip
                    data={options.processedData![contentIndex]}
                    renderTime={options.renderTime!}
                    showTime={options.globalTooltipsShowTimestampEnabled}
                    valueEnabled={options.globalTooltipsShowValueEnabled}
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

export const getTextToDisplay = (
  autoSizeFonts: boolean,
  ellipseEnabled: boolean,
  ellipseCharacters: number,
  showEllipses: boolean,
  numOfChars: number,
  text: string,
  displayName: string
) => {
  if (displayName !== '') {
    text = displayName;
  }
  if (showEllipses) {
    if (text.length > numOfChars) {
      return text.substring(0, numOfChars) + '...';
    }
  }
  if (!autoSizeFonts && ellipseEnabled && text.length > ellipseCharacters) {
    return text.substring(0, ellipseCharacters) + '...';
  }
  return text;
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

const formatCompositeValueAndTimestamp = (frames: number, item: PolystatModel, globalDisplayTextTriggeredEmpty: string) => {
  // TODO: if just one value, could speed this up
  let content = item.valueFormatted;
  let timestampContent = item.timestampFormatted;
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
        return [globalDisplayTextTriggeredEmpty, ''];
      }
    }
    const aMember = Object.assign({}, item.members[triggeredIndex]);
    content = aMember.name + ': ' + aMember.valueFormatted;
    timestampContent = aMember.timestampFormatted;
  }
  return [textUtil.sanitize(content), timestampContent];
};
