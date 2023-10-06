import { getTemplateSrv } from '@grafana/runtime';
import {
  getValueFormat,
  stringToJsRegex,
  ScopedVars,
  InterpolateFunction,
  textUtil,
  getColorForTheme,
  FieldConfigSource,
} from '@grafana/data';
import { useTheme, useTheme2 } from '@grafana/ui';
import { getThresholdLevelForValue } from './threshold_processor';
import { GetValueByOperator } from './stats';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { PolystatModel } from '../components/types';
import { CUSTOM_SPLIT_DELIMITER } from './types';
import { OverrideItemType } from '../components/overrides/types';
import { PolystatThreshold } from 'components/thresholds/types';
import { GetMappedValue } from './valueMappingsWrapper';

const roundValue = (num: number, decimals: number) => {
  if (num === null) {
    return null;
  }
  const n = Math.pow(10, decimals);
  const formatted = (n * num).toFixed(decimals);
  return Math.round(parseFloat(formatted)) / n;
};

const customFormatter = (value: any): string => {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return value.join(CUSTOM_SPLIT_DELIMITER);
  }
  return value;
};

const resolveOverrideTemplates = (overrides: OverrideItemType[]): OverrideItemType[] => {
  const ret: OverrideItemType[] = [];
  const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
  overrides.forEach((override) => {
    // Resolve templates in series names
    if (override.metricName) {
      const matchResult = override.metricName.match(variableRegex);
      if (matchResult && matchResult.length > 0) {
        matchResult.forEach((template: any) => {
          const templateVars: ScopedVars = {};
          const resolvedSeriesNames = getTemplateSrv()
            .replace(template, templateVars, customFormatter)
            .split(CUSTOM_SPLIT_DELIMITER);
          resolvedSeriesNames.forEach((seriesName) => {
            const newName = override.metricName.replace(template, seriesName);
            ret.push({
              ...override,
              metricName: newName,
            });
          });
        });
      } else {
        // does not match template, but can match a simple regex
        ret.push(override);
      }
    }
  });

  return ret;
};

export const MatchOverride = (pattern: string, overrides: OverrideItemType[]): OverrideItemType | null => {
  const resolvedOverrides = resolveOverrideTemplates(overrides);
  for (let index = 0; index < resolvedOverrides.length; index++) {
    const anOverride = resolvedOverrides[index];
    const regex = stringToJsRegex(anOverride.metricName);
    const matches = pattern.match(regex);
    if (matches && matches.length > 0 && anOverride.enabled) {
      return resolvedOverrides[index];
    }
  }
  return null;
};

export const ApplyOverrides = (
  overrides: OverrideItemType[],
  data: PolystatModel[],
  fieldConfig: FieldConfigSource<any>,
  globalFillColor: string,
  globalThresholds: PolystatThreshold[],
  replaceVariables: InterpolateFunction | null
) => {
  // v9 compatible
  const theme2 = useTheme2();
  const oldTheme = useTheme();
  // determine real color
  let realGlobalFillColor = '';
  if (typeof theme2.visualization !== 'undefined') {
    realGlobalFillColor = theme2.visualization.getColorByName(globalFillColor);
  } else {
    realGlobalFillColor = getColorForTheme(globalFillColor, oldTheme);
  }

  if (!overrides) {
    return data;
  }

  for (let index = 0; index < data.length; index++) {
    const anOverride = MatchOverride(data[index].name, overrides);
    if (anOverride) {
      const aSeries = data[index];
      // set the operators
      aSeries.operatorName = anOverride.operatorName;
      const dataValue = GetValueByOperator(aSeries.name, aSeries, aSeries.operatorName, aSeries.stats);
      // Use defaults or the specific threshold
      const thresholds =
        anOverride.thresholds && anOverride.thresholds.length ? anOverride.thresholds : globalThresholds;
      const result = getThresholdLevelForValue(thresholds, dataValue, globalFillColor);
      let useColor = result.color;
      if (typeof theme2.visualization !== 'undefined') {
        useColor = theme2.visualization.getColorByName(result.color);
      } else {
        useColor = getColorForTheme(result.color, oldTheme);
      }
      // set value to what was returned
      data[index].value = dataValue;
      data[index].color = useColor;
      data[index].thresholdLevel = result.thresholdLevel;
      // format it
      // TODO: fix me!
      const mappedValue = GetMappedValue(fieldConfig.defaults.mappings!, data[index].value);
      if (mappedValue && mappedValue.text !== '') {
        data[index].valueFormatted = mappedValue.text;
        // set color also
        if (mappedValue.color) {
          let realColor = theme2.visualization.getColorByName(mappedValue.color);
          data[index].color = realColor;
        } else {
          data[index].color = realGlobalFillColor;
        }
      } else {
        const formatFunc = getValueFormat(anOverride.unitFormat);
        if (formatFunc) {
          // put the value in quotes to escape "most" special characters
          const decimals: number = +anOverride.decimals;
          const formatted = formatFunc(data[index].value, decimals, anOverride.scaledDecimals);
          data[index].valueFormatted = formatted.text;
          // spaces are included with the formatFunc
          if (formatted.suffix) {
            data[index].valueFormatted += formatted.suffix;
          }
          if (formatted.prefix) {
            data[index].valueFormatted = formatted.prefix + data[index].valueFormatted;
          }
          data[index].valueRounded = roundValue(data[index].value, decimals) || data[index].value;
        }
      }
      // add prefix/suffix to formatted value
      if (anOverride.prefix !== '') {
        data[index].valueFormatted = anOverride.prefix + ' ' + data[index].valueFormatted;
      }
      if (anOverride.suffix !== '') {
        data[index].valueFormatted = data[index].valueFormatted + ' ' + anOverride.suffix;
      }
      if (anOverride.alias !== '') {
        data[index].displayName = anOverride.alias;
      }
      data[index].prefix = anOverride.prefix;
      data[index].suffix = anOverride.suffix;
      // set the url, replace template vars
      if (anOverride.clickThrough && anOverride.clickThrough.length > 0) {
        const regex = stringToJsRegex(anOverride.metricName);
        const matches = regex.exec(data[index].name);
        const templateVars: ScopedVars = {};
        if (matches && matches.length > 0) {
          matches.forEach((name: string, i: number) => {
            templateVars[i] = { text: i, value: name };
          });
        }
        let url = getTemplateSrv().replace(anOverride.clickThrough, templateVars);
        // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
        url = ClickThroughTransformer.transformSingleMetric(index, url, data);
        url = ClickThroughTransformer.transformNthMetric(url, data);
        url = ClickThroughTransformer.transformByRegex(anOverride.metricName, data[index], url);
        data[index].clickThrough = url;
        data[index].newTabEnabled = anOverride.clickThroughOpenNewTab;
        data[index].sanitizeURLEnabled = anOverride.clickThroughSanitize;
        // provide both versions, what is displayed is determined later
        data[index].sanitizedURL = textUtil.sanitize(data[index].clickThrough);
        data[index].customClickthroughTargetEnabled = anOverride.clickThroughCustomTargetEnabled;
        data[index].customClickthroughTarget = anOverride.clickThroughCustomTarget;
      }
    } else if (globalThresholds && globalThresholds.length) {
      const result = getThresholdLevelForValue(globalThresholds, data[index].value, globalFillColor);
      // set value to what was returned
      data[index].color = result.color;
      data[index].thresholdLevel = result.thresholdLevel;
    }
  }
  return data;
};
