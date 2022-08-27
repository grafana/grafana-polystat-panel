import React from 'react';
import { PanelProps, GrafanaTheme } from '@grafana/data';
// @ts-ignore
import { PolystatOptions, PolygonShapes, PolystatModel } from './types';
import { Polystat } from './Polystat';
import { css, cx } from 'emotion';
import { useStyles } from '@grafana/ui';
import { ProcessDataFrames } from 'data/processor';

interface Props extends PanelProps<PolystatOptions> {}

const getComponentStyles = (theme: GrafanaTheme) => {
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

export const PolystatPanel: React.FC<Props> = ({ options, data, id, width, height, replaceVariables, fieldConfig }) => {
  const styles = useStyles(getComponentStyles);
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
    options.globalOperator,
    options.globalDecimals,
    options.globalDisplayMode,
    options.globalRegexPattern,
    options.globalFillColor,
    options.globalThresholdsConfig,
    options.globalUnitFormat,
    options.sortByDirection,
    options.sortByField
  );
  const renderTime = new Date();
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
          globalOperator={options.globalOperator}
          globalDecimals={options.globalDecimals}
          globalDisplayMode={options.globalDisplayMode}
          globalDisplayTextTriggeredEmpty={options.globalDisplayTextTriggeredEmpty}
          globalFontSize={options.globalFontSize}
          globalPolygonSize={options.globalPolygonSize}
          ellipseCharacters={options.ellipseCharacters}
          ellipseEnabled={options.ellipseEnabled}
          globalFillColor={options.globalFillColor}
          globalRegexPattern={options.globalRegexPattern}
          globalGradientsEnabled={options.globalGradientsEnabled}
          globalTextFontAutoColor={'black'}
          globalTextFontAutoColorEnabled={options.globalTextFontAutoColorEnabled}
          globalTextFontColor={options.globalTextFontColor}
          globalThresholdsConfig={options.globalThresholdsConfig}
          globalTooltipsEnabled={options.globalTooltipsEnabled}
          globalTooltipsShowTimestampEnabled={options.globalTooltipsShowTimestampEnabled}
          globalUnitFormat={options.globalUnitFormat}
          autoSizeColumns={options.autoSizeColumns}
          autoSizeRows={options.autoSizeRows}
          layoutDisplayLimit={options.layoutDisplayLimit}
          layoutNumColumns={options.layoutNumColumns}
          layoutNumRows={options.layoutNumRows}
          processedData={processedData}
          panelId={id}
          panelWidth={width}
          panelHeight={height}
          radius={options.radius}
          renderTime={renderTime}
          globalShape={options.globalShape}
          sortByDirection={options.sortByDirection}
          sortByField={options.sortByField}
          globalPolygonBorderColor={options.globalPolygonBorderColor}
          globalPolygonBorderSize={options.globalPolygonBorderSize}
          globalShowValueEnabled={options.globalShowValueEnabled}
          tooltipPrimarySortDirection={options.tooltipPrimarySortDirection}
          tooltipPrimarySortByField={options.tooltipPrimarySortByField}
          tooltipSecondarySortDirection={options.tooltipSecondarySortDirection}
          tooltipSecondarySortByField={options.tooltipSecondarySortByField}
          tooltipDisplayMode={options.tooltipDisplayMode}
          tooltipDisplayTextTriggeredEmpty={options.tooltipDisplayTextTriggeredEmpty}
        />
      </div>
    </div>
  );
};
