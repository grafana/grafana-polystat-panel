import React, { useEffect, useState } from 'react';

import { PanelProps, GrafanaTheme2, LoadingState } from '@grafana/data';
import { PolystatOptions, PolystatModel } from './types';
import { Polystat } from './Polystat';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme, useTheme2 } from '@grafana/ui';
import { ProcessDataFrames } from '../data/processor';

interface Props extends PanelProps<PolystatOptions> {}

const getComponentStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      position: relative;
    `,
    container: css`
      align-items: center;
      justify-content: center;
      display: flex;
      height: 100%;
      width: 100%;
      & svg > g > polygon {
        fill: transparent;
      }
    `,
  };
};


export const PolystatPanel: React.FC<Props> = ({ options, data, id, width, height, replaceVariables, fieldConfig, timeZone }) => {
  const styles = useStyles2(getComponentStyles);
  const currentThemeV1 = useTheme(); // V8
  const currentThemeV2 = useTheme2(); // V9+
  let [cachedProcessedData, setCachedProcessedData] = useState<PolystatModel[]>();
  useEffect(() => {
    if (data.state === LoadingState.Done) {
      // each series is a converted to a model we can use
      const processedData = ProcessDataFrames(
        options.compositeConfig.enabled,
        options.compositeConfig.composites,
        options.overrideConfig.overrides,
        data,
        replaceVariables,
        fieldConfig,
        options.globalClickthrough,
        options.globalClickthroughNewTabEnabled,
        options.globalClickthroughSanitizedEnabled,
        options.globalClickthroughCustomTargetEnabled,
        options.globalClickthroughCustomTarget,
        options.globalOperator,
        options.globalDecimals,
        options.globalDisplayMode,
        options.globalRegexPattern,
        options.globalFillColor,
        options.globalThresholdsConfig,
        options.globalUnitFormat,
        true, // TODO: future configurable global option to not display label
        options.globalShowValueEnabled,
        options.globalShowTimestampEnabled,
        options.globalShowTimestampFormat,
        options.sortByDirection,
        options.sortByField,
        options.compositeGlobalAliasingEnabled,
        timeZone,
        currentThemeV1,
        currentThemeV2,
      );
      setCachedProcessedData(processedData);

    }
  }, [data, fieldConfig, options, replaceVariables, currentThemeV1, currentThemeV2, timeZone]);

  if (cachedProcessedData === undefined) {
    return (
      <>Loading... please wait</>
    )
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div className={cx(styles.container)}>
        <Polystat
          compositeConfig={options.compositeConfig}
          overrideConfig={options.overrideConfig}
          autoSizePolygons={options.autoSizePolygons}
          globalAutoScaleFonts={options.globalAutoScaleFonts}
          globalClickthrough={options.globalClickthrough}
          globalClickthroughNewTabEnabled={options.globalClickthroughNewTabEnabled}
          globalClickthroughSanitizedEnabled={options.globalClickthroughSanitizedEnabled}
          globalClickthroughCustomTargetEnabled={options.globalClickthroughCustomTargetEnabled}
          globalClickthroughCustomTarget={options.globalClickthroughCustomTarget}
          globalOperator={options.globalOperator}
          globalDecimals={options.globalDecimals}
          globalDisplayMode={options.globalDisplayMode}
          globalDisplayTextTriggeredEmpty={options.globalDisplayTextTriggeredEmpty}
          globalLabelFontSize={options.globalLabelFontSize}
          globalValueFontSize={options.globalValueFontSize}
          globalCompositeValueFontSize={options.globalCompositeValueFontSize}
          globalPolygonSize={options.globalPolygonSize}
          ellipseCharacters={options.ellipseCharacters}
          ellipseEnabled={options.ellipseEnabled}
          globalFillColor={options.globalFillColor}
          globalRegexPattern={options.globalRegexPattern}
          globalGradientsEnabled={options.globalGradientsEnabled}
          globalShowTimestampEnabled={options.globalShowTimestampEnabled}
          globalShowTimestampFormat={options.globalShowTimestampFormat}
          globalShowTimestampPosition={options.globalShowTimestampPosition}
          globalShowTimestampFontSize={options.globalShowTimestampFontSize}
          globalShowTimestampYOffset={options.globalShowTimestampYOffset}
          globalTextFontAutoColor={options.globalTextFontAutoColorEnabled ? currentThemeV2.colors.text.primary : '#000000'}
          globalTextFontAutoColorEnabled={options.globalTextFontAutoColorEnabled}
          globalTextFontColor={options.globalTextFontColor}
          globalTextFontFamily={options.globalTextFontFamily}
          globalThresholdsConfig={options.globalThresholdsConfig}
          globalTooltipsEnabled={options.globalTooltipsEnabled}
          globalTooltipsShowTimestampEnabled={options.globalTooltipsShowTimestampEnabled}
          globalTooltipsShowValueEnabled={options.globalTooltipsShowValueEnabled}
          globalTooltipsFontFamily={options.globalTooltipsFontFamily}
          globalUnitFormat={options.globalUnitFormat}
          autoSizeColumns={options.autoSizeColumns}
          autoSizeRows={options.autoSizeRows}
          layoutDisplayLimit={options.layoutDisplayLimit}
          layoutNumColumns={options.layoutNumColumns}
          layoutNumRows={options.layoutNumRows}
          processedData={cachedProcessedData}
          panelId={id}
          panelWidth={width}
          panelHeight={height}
          radius={options.radius}
          renderTime={new Date()}
          globalShape={options.globalShape}
          sortByDirection={options.sortByDirection}
          sortByField={options.sortByField}
          globalPolygonBorderColor={options.globalPolygonBorderColor}
          globalPolygonBorderSize={options.globalPolygonBorderSize}
          globalShowValueEnabled={options.globalShowValueEnabled}
          globalShowTooltipColumnHeadersEnabled={options.globalShowTooltipColumnHeadersEnabled}
          tooltipPrimarySortDirection={options.tooltipPrimarySortDirection}
          tooltipPrimarySortByField={options.tooltipPrimarySortByField}
          tooltipSecondarySortDirection={options.tooltipSecondarySortDirection}
          tooltipSecondarySortByField={options.tooltipSecondarySortByField}
          tooltipDisplayMode={options.tooltipDisplayMode}
          tooltipDisplayTextTriggeredEmpty={options.tooltipDisplayTextTriggeredEmpty}
          compositeGlobalAliasingEnabled={options.compositeGlobalAliasingEnabled}
        />
      </div>
    </div>
  );
};
