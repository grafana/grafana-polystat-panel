import { InsertTime } from './deframer';
import {
  Field,
  FieldType,
  reduceField,
  textUtil,
  DataFrame,
  PanelData,
  getFieldDisplayName,
  formattedValueToString,
  getValueFormat,
  stringToJsRegex,
  InterpolateFunction,
  FieldConfigSource,
  GrafanaTheme2,
  GrafanaTheme,
} from '@grafana/data';
import { includes as lodashIncludes } from 'lodash';
import { DisplayModes, OperatorOptions, PolystatModel } from '../components/types';
import { GLOBAL_FILL_COLOR_RGBA } from '../components/defaults';
import { GetDecimalsForValue, SortVariableValuesByField, roundValue } from '../utils';
import { ApplyComposites } from './composite_processor';
import { CompositeItemType } from 'components/composites/types';
import { ApplyOverrides } from './override_processor';
import { OverrideItemType } from '../components/overrides/types';
import { PolystatThreshold } from '../components/thresholds/types';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { GetMappedValue, getMappings } from './valueMappingsWrapper';
import { GetValueByOperator } from './stats';
import { TimeFormatter } from './time_formatter';

/**
 * Converts dataframes to internal model
 *
 * @param   {DataFrame[]}    data                [data description]
 * @param   {string[]}     globalRegexPattern  [globalRegexPattern description]
 *
 * @return  {DataFrame[]}                      [return description]
 */
export function ProcessDataFrames(
  compositesEnabled: boolean,
  composites: CompositeItemType[],
  overrides: OverrideItemType[],
  data: PanelData,
  replaceVariables: InterpolateFunction,
  fieldConfig: FieldConfigSource<any>,
  globalClickthrough: string,
  globalClickthroughTabEnabled: boolean,
  globalClickthroughSanitizedEnabled: boolean,
  globalClickthroughCustomTargetEnabled: boolean,
  globalClickthroughCustomTarget: string,
  globalOperator: string,
  globalDecimals: number,
  globalDisplayMode: string,
  globalRegexPattern: string,
  globalFillColor: string,
  globalThresholds: PolystatThreshold[],
  globalUnitFormat: string,
  globalShowLabel: boolean,
  globalShowValue: boolean,
  globalShowTimestamp: boolean,
  globalShowTimestampFormat: string,
  sortByDirection: number,
  sortByField: string,
  compositesGlobalAliasingEnabled: boolean,
  timeZone: string,
  themeV1: GrafanaTheme,
  themeV2: GrafanaTheme2,
): PolystatModel[] {

  // check if data contains a field called Time of type time
  let processedData = InsertTime(data.series);
  let internalData = [] as PolystatModel[];

  processedData.map((item) => {
    const models = DataFrameToPolystat(item, globalOperator);
    for (const aModel of models) {
      internalData.push(aModel);
    }
  });
  internalData = ApplyGlobalRegexPattern(internalData, globalRegexPattern);
  // formatting can change colors due to value maps
  internalData = ApplyGlobalFormatting(
    internalData,
    fieldConfig,
    globalUnitFormat,
    globalDecimals,
    globalFillColor,
    globalShowLabel,
    globalShowValue,
    globalShowTimestamp,
    globalShowTimestampFormat,
    timeZone,
    themeV2);
  // applies overrides and global thresholds (and mappings)
  internalData = ApplyOverrides(
    overrides,
    internalData,
    fieldConfig,
    globalFillColor,
    globalThresholds,
    replaceVariables,
    timeZone,
    themeV1,
    themeV2
  );
  // composites
  if (compositesEnabled) {
    internalData = ApplyComposites(
      composites,
      internalData,
      replaceVariables,
      compositesGlobalAliasingEnabled,
      timeZone,
      globalRegexPattern);
  }
  // clickthroughs
  internalData = ApplyGlobalClickThrough(
    internalData,
    globalClickthrough,
    globalClickthroughTabEnabled,
    globalClickthroughSanitizedEnabled,
    globalClickthroughCustomTargetEnabled,
    globalClickthroughCustomTarget,
    replaceVariables
  );
  // filter by global display mode
  internalData = FilterByGlobalDisplayMode(internalData, globalDisplayMode);
  // final step sorting
  internalData = SortVariableValuesByField(internalData, sortByField, sortByDirection);
  return internalData;
}

/**
 * renames according to a global regex pattern
 * @param {PolystatModel[]} data [series description]
 * @param {string[]} regexPattern [regexPattern description]
 * @return {PolystatModel[]} [return description]
 */
export const ApplyGlobalRegexPattern = (data: PolystatModel[], regexPattern: string): PolystatModel[] => {
  for (let i = 0; i < data.length; i++) {
    if (regexPattern !== '') {
      const regexVal = stringToJsRegex(regexPattern);
      if (data[i].name && regexVal.test(data[i].name.toString())) {
        const temp = regexVal.exec(data[i].name.toString());
        if (!temp) {
          continue;
        }
        let extractedTxt = '';
        if (temp.length > 1) {
          temp.slice(1).forEach((value, i) => {
            if (value) {
              extractedTxt += extractedTxt.length > 0 ? ' ' + value.toString() : value.toString();
            }
          });
          data[i].displayName = extractedTxt;
        }
      }
    }
  }
  return data;
};

export const ApplyGlobalClickThrough = (
  data: PolystatModel[],
  globalClickthrough: string,
  globalClickthroughNewTabEnabled: boolean,
  globalClickthroughSanitizedEnabled: boolean,
  globalClickthroughCustomTargetEnabled: boolean,
  globalClickthroughCustomTarget: string,
  replaceVariables: InterpolateFunction
): PolystatModel[] => {
  for (let index = 0; index < data.length; index++) {
    if (data[index].clickThrough.length === 0) {
      data[index].clickThrough = processDefaultClickThrough(index, globalClickthrough, data, replaceVariables);
      data[index].newTabEnabled = globalClickthroughNewTabEnabled;
      data[index].sanitizeURLEnabled = globalClickthroughSanitizedEnabled;
      // always provide both versions and overrides and composites can specify which one to use
      data[index].sanitizedURL = textUtil.sanitize(data[index].clickThrough);
      data[index].customClickthroughTargetEnabled = globalClickthroughCustomTargetEnabled;
      data[index].customClickthroughTarget = globalClickthroughCustomTarget;
    }
  }
  return data;
};

/**
 * Only called for dataframes that do not have a clickthrough specified via overrides or composites.
 * @param {number}              index
 * @param {string}              globalClickthrough string containing the GlobalClickthrough text
 * @param {PolystatModel[]}     data array of data
 * @param {InterpolateFunction} replaceVariables function from template server
 * @return {string} New URL with default clickthrough processed replacements and template variables
 */
export const processDefaultClickThrough = (
  index: number,
  globalClickthrough: string,
  data: PolystatModel[],
  replaceVariables: InterpolateFunction): string => {
  let url = globalClickthrough;
  // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
  url = ClickThroughTransformer.transformSingleMetric(index, url, data);
  url = ClickThroughTransformer.transformNthMetric(url, data);
  // process template variables inside clickthrough
  url = replaceVariables(url);
  return url;
};

export const ApplyGlobalFormatting = (
  data: PolystatModel[],
  fieldConfig: FieldConfigSource<any>,
  globalUnitFormat: string,
  globalDecimals: number,
  globalFillColor: string,
  globalShowLabel: boolean,
  globalShowValue: boolean,
  globalShowTimestampEnabled: boolean,
  globalShowTimestampFormat: string,
  timeZone: string,
  theme: GrafanaTheme2
): PolystatModel[] => {
  let realGlobalFillColor = theme.visualization.getColorByName(globalFillColor);
  const formatFunc = getValueFormat(globalUnitFormat);
  for (let index = 0; index < data.length; index++) {
    // Check for mapped value, if nothing set, format value
    if (data[index].value !== null) {
      data[index].showName = globalShowLabel;
      data[index].showValue = globalShowValue;
      const mappings = getMappings(fieldConfig.defaults.mappings, data[index].mappings);
      const mappedValue = GetMappedValue(mappings!, data[index].value);
      if (mappedValue && mappedValue.text !== '') {
        data[index].valueFormatted = mappedValue.text;
        if (globalShowTimestampEnabled) {
          data[index].timestampFormatted = TimeFormatter(timeZone, data[index].timestamp, globalShowTimestampFormat);
          data[index].showTimestamp = true;
        }
        // set color also
        if (mappedValue.color) {
          let realColor = theme.visualization.getColorByName(mappedValue.color);
          data[index].color = realColor;
        } else {
          data[index].color = realGlobalFillColor;
        }
      } else {
        if (formatFunc) {
          const result = GetDecimalsForValue(data[index].value, globalDecimals);
          const formatted = formatFunc(data[index].value, result.decimals, result.scaledDecimals);
          data[index].valueFormatted = formatted.text;
          if (formatted.suffix) {
            data[index].valueFormatted += ` ${formatted.suffix}`;
          }
          if (formatted.prefix) {
            data[index].valueFormatted = `{$formatted.prefix} ${data[index].valueFormatted}`;
          }
          const valueRounded = roundValue(data[index].value, result.decimals);
          if (valueRounded !== null) {
            data[index].valueRounded = valueRounded;
          }
          if (globalShowTimestampEnabled) {
            data[index].timestampFormatted = TimeFormatter(timeZone, data[index].timestamp, globalShowTimestampFormat);
            data[index].showTimestamp = true;
          }
        }
        data[index].color = realGlobalFillColor;
      }
    }
  }
  return data;
};

const FilterByGlobalDisplayMode = (data: any, globalDisplayMode: string): PolystatModel[] => {
  const filteredMetrics: number[] = [];
  const compositeMetrics: PolystatModel[] = [];
  if (globalDisplayMode !== 'all') {
    const dataLen = data.length;
    for (let i = 0; i < dataLen; i++) {
      const item = data[i];
      // keep if composite
      if (item.isComposite) {
        compositeMetrics.push(item);
      }
      if (item.thresholdLevel < 1) {
        // push the index number
        filteredMetrics.push(i);
      }
    }
    // remove filtered metrics, use splice in reverse order
    for (let i = data.length; i >= 0; i--) {
      if (lodashIncludes(filteredMetrics, i)) {
        data.splice(i, 1);
      }
    }
    if (data.length === 0) {
      if (compositeMetrics.length > 0) {
        // set data to be all of the composites
        data = compositeMetrics;
      }
    }
  }
  return data;
};

export const DataFrameToPolystat = (frame: DataFrame, globalOperator: string): PolystatModel[] => {

  const valueFields: Field[] = [];
  let newestTimestamp = 0;

  for (const aField of frame.fields) {
    if (aField.type === FieldType.number) {
      valueFields.push(aField);
    }
    else if (aField.type === FieldType.time) {
      // get the "newest" timestamp from data
      // check if timestamp is 0
      let aTimestamp = 0;
      let timestampIndex = aField.values.length - 1;
      try {
        aTimestamp = aField.values.get(timestampIndex);
      } catch {
        // @ts-ignore, workaround for 9.5+ removal of VectorArray
        aTimestamp = aField.values[timestampIndex];
      }
      if (newestTimestamp === 0) {
        newestTimestamp = aTimestamp;
      }
      // check if data timestamp is newer
      if (aTimestamp > newestTimestamp) {
        newestTimestamp = aTimestamp;
      }
    }
  }
  if (newestTimestamp === 0) {
    // use current time if none is found
    newestTimestamp = new Date().getTime()
  }
  const models: PolystatModel[] = [];

  for (const valueField of valueFields) {
    const valueFieldName = getFieldDisplayName(valueField!, frame);
    const standardCalcs = reduceField({ field: valueField!, reducers: ['bogus'] });
    //
    // side effect of getFieldDisplayName: it modifies content of valueField.state by adding a displayName
    // file a bug? deframer has been fixed to clone the the field.state to work around the issue
    //
    //if (valueField.state?.displayName !== undefined) {
    //  delete valueField.state?.displayName;
    //}
    const operatorValue = GetValueByOperator(valueFieldName, null, globalOperator, standardCalcs);

    let maxDecimals = 4;
    if (valueField!.config.decimals !== undefined && valueField!.config.decimals !== null) {
      maxDecimals = valueField!.config.decimals;
    }
    const result = getValueFormat(valueField!.config.unit)(operatorValue, maxDecimals, undefined, undefined);
    const valueFormatted = formattedValueToString(result);
    const model: PolystatModel = {
      displayMode: DisplayModes[0].value,
      thresholdLevel: 0,
      value: operatorValue,
      valueFormatted: valueFormatted,
      valueRounded: roundValue(operatorValue, maxDecimals) || operatorValue,
      stats: standardCalcs,
      name: valueFieldName,
      displayName: valueFieldName,
      timestamp: newestTimestamp,
      timestampFormatted: '',
      prefix: '',
      suffix: '',
      color: GLOBAL_FILL_COLOR_RGBA,
      clickThrough: '',
      operatorName: OperatorOptions[0].value,
      newTabEnabled: true,
      sanitizedURL: '',
      sanitizeURLEnabled: true,
      showName: true,
      showValue: true,
      showTimestamp: false,
      isComposite: false,
      members: [],
      customClickthroughTargetEnabled: false,
      customClickthroughTarget: '',
      mappings: valueField.config.mappings || [],
    };
    models.push(model);
  }
  return models;
}
