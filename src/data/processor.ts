import { InsertTime } from './deframer';
// @ts-ignore
import { colors, useTheme2, convertOldAngularValueMappings, getStandardFieldConfigs } from '@grafana/ui';
import {
  FieldType,
  reduceField,
  textUtil,
  DataFrame,
  PanelData,
  getFieldDisplayName,
  FieldCalcs,
  formattedValueToString,
  getValueFormat,
  stringToJsRegex,
  InterpolateFunction,
  FieldConfigSource,
  ScopedVars,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { includes as lodashIncludes } from 'lodash';
import { PolystatModel } from 'components/types';
import { GLOBAL_FILL_COLOR_RGBA } from 'components/defaults';
import { GetDecimalsForValue, SortVariableValuesByField } from 'utils';
import { ApplyComposites } from './composite_processor';
import { CompositeItemType } from 'components/composites/types';
import { ApplyOverrides } from './metric_overrides_manager';
import { OverrideItemType } from 'components/overrides/types';
import { PolystatThreshold } from 'components/thresholds/types';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { GetMappedValue } from './valueMappingsWrapper';

/**
 * Converts dataframes to internal model
 *
 * @param   {PanelData}    data                [data description]
 * @param   {string[]}     globalRegexPattern  [globalRegexPattern description]
 *
 * @return  {DataFrame[]}                      [return description]
 */
export function ProcessDataFrames(
  composites: CompositeItemType[],
  overrides: OverrideItemType[],
  data: PanelData,
  replaceVariables: InterpolateFunction,
  fieldConfig: FieldConfigSource<any>,
  globalClickthrough: string,
  globalClickthroughTabEnabled: boolean,
  globalClickthroughSanitizedEnabled: boolean,
  globalDecimals: number,
  globalDisplayMode: string,
  globalRegexPattern: string,
  globalFillColor: string,
  globalThresholds: PolystatThreshold[],
  globalUnitFormat: string,
  sortByDirection: number,
  sortByField: string
): PolystatModel[] {
  // console.log(JSON.stringify(data));
  // check if data contains a field called Time of type time
  let processedData = InsertTime(data.series);
  let internalData = [] as PolystatModel[];
  // just one for now...
  processedData.map((item) => {
    const model = DataFrameToPolystat(item);
    internalData.push(model);
  });
  internalData = ApplyGlobalRegexPattern(internalData, globalRegexPattern);
  // colors (done in global formatting for speed)
  //ApplyGlobalColors(internalData, globalFillColor);
  // formatting can change colors due to value maps
  //debugger;
  internalData = ApplyGlobalFormatting(internalData, fieldConfig, globalUnitFormat, globalDecimals, globalFillColor);
  // applies overrides and global thresholds
  internalData = ApplyOverrides(overrides, internalData, globalFillColor, globalThresholds, replaceVariables);
  // composites
  internalData = ApplyComposites(composites, internalData, replaceVariables);
  // clickthroughs
  internalData = ApplyGlobalClickThrough(
    internalData,
    globalClickthrough,
    globalClickthroughTabEnabled,
    globalClickthroughSanitizedEnabled
  );
  // filter by global display mode
  internalData = FilterByGlobalDisplayMode(internalData, globalDisplayMode);
  // final step sorting
  internalData = SortVariableValuesByField(internalData, sortByField, sortByDirection);
  return internalData;
}

/**
 * renames according to a global regex pattern
 *
 * @param   {DataFrame[]}  series        [series description]
 * @param   {string[]}     regexPattern  [regexPattern description]
 *
 * @return  {DataFrame[]}                [return description]
 */
const ApplyGlobalRegexPattern = (data: PolystatModel[], regexPattern: string) => {
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
          data[i].name = extractedTxt;
        }
      }
    }
  }
  return data;
};

const ApplyGlobalClickThrough = (
  data: PolystatModel[],
  globalClickthrough: string,
  globalClickthroughNewTabEnabled: boolean,
  globalClickthroughSanitizedEnabled: boolean
) => {
  for (let index = 0; index < data.length; index++) {
    if (data[index].clickThrough.length === 0) {
      data[index].clickThrough = processDefaultClickThrough(index, globalClickthrough, data);
      data[index].newTabEnabled = globalClickthroughNewTabEnabled;
      data[index].sanitizeURLEnabled = globalClickthroughSanitizedEnabled;
      if (data[index].sanitizeURLEnabled) {
        data[index].sanitizedURL = textUtil.sanitize(data[index].clickThrough);
      }
    }
  }
  return data;
};

const processDefaultClickThrough = (index: number, globalClickthrough: string, data: PolystatModel[]): string => {
  let url = globalClickthrough;
  // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
  url = ClickThroughTransformer.transformSingleMetric(index, url, data);
  url = ClickThroughTransformer.transformNthMetric(url, data);
  // process template variables inside clickthrough
  const templateVars: ScopedVars = {};
  url = getTemplateSrv().replace(url, templateVars);
  return url;
};

const ApplyGlobalFormatting = (
  data: PolystatModel[],
  fieldConfig: FieldConfigSource<any>,
  globalUnitFormat: string,
  globalDecimals: number,
  globalFillColor: string
) => {
  const theme = useTheme2();
  let realGlobalFillColor = theme.visualization.getColorByName(globalFillColor);
  console.log(`globalUnitFormat: ${globalUnitFormat}`);
  const formatFunc = getValueFormat(globalUnitFormat);
  for (let index = 0; index < data.length; index++) {
    // Check for mapped value, if nothing set, format value
    if (data[index].value !== null) {
      const mappedValue = GetMappedValue(fieldConfig.defaults.mappings, data[index].value);
      console.log(mappedValue);
      if (mappedValue && mappedValue.text !== '') {
        data[index].valueFormatted = mappedValue.text;
        // set color also
        if (mappedValue.color) {
          let realColor = theme.visualization.getColorByName(mappedValue.color);
          data[index].color = realColor;
          console.log('set color:' + data[index].color);
        } else {
          data[index].color = realGlobalFillColor;
          console.log('set color:' + data[index].color);
        }
      } else {
        if (formatFunc) {
          console.log('yes, have formatFunc for global unit');
          const result = GetDecimalsForValue(data[index].value, globalDecimals);
          const formatted = formatFunc(data[index].value, result.decimals, result.scaledDecimals);
          console.log(formatted);
          data[index].valueFormatted = formatted.text;
          if (formatted.suffix) {
            data[index].valueFormatted += ` ${formatted.suffix}`;
          }
          if (formatted.prefix) {
            data[index].valueFormatted = `{$formatted.prefix} ${data[index].valueFormatted}`;
          }
          data[index].valueRounded = roundValue(data[index].value, result.decimals);
        }
        data[index].color = realGlobalFillColor;
        console.log('set color:' + data[index].color);
      }
    }
  }
  return data;
};

const FilterByGlobalDisplayMode = (data: any, globalDisplayMode: string) => {
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

const roundValue = (num: number, decimals: number) => {
  if (num === null) {
    return null;
  }
  const n = Math.pow(10, decimals);
  const formatted = (n * num).toFixed(decimals);
  return Math.round(parseFloat(formatted)) / n;
};

export function DataFrameToPolystat(frame: DataFrame): PolystatModel {
  // @ts-ignore
  const shortenValue = (value: string, length: number) => {
    if (value.length > length) {
      return value.substring(0, length).concat('...');
    } else {
      return value;
    }
  };

  // get the value field
  const valueField = frame.fields.find((field) => field.type === FieldType.number);
  // using a bogus reducer returns the "standard" calcs
  const standardCalcs = reduceField({ field: valueField, reducers: ['bogus'] });
  //const x = getDisplayProcessor({ field: valueField, theme: useTheme2() });
  const valueFieldName = getFieldDisplayName(valueField, frame);
  const operatorValue = getValueByOperator(valueFieldName, 'avg', standardCalcs);
  //const y = x(operatorValue);

  let maxDecimals = 4;
  if (valueField.config.decimals !== undefined) {
    maxDecimals = valueField.config.decimals;
  }
  const result = getValueFormat(valueField.config.unit)(operatorValue, maxDecimals, undefined, undefined);
  const valueFormatted = formattedValueToString(result);

  const model: PolystatModel = {
    seriesRaw: frame,
    animateMode: 'all',
    displayMode: 'all',
    thresholdLevel: 0,
    value: operatorValue,
    valueFormatted: valueFormatted,
    valueRounded: roundValue(operatorValue, maxDecimals),
    stats: standardCalcs,
    name: valueFieldName, // aSeries.name,
    displayName: valueFieldName, // aSeries.name,
    timestamp: 0,
    prefix: '',
    suffix: '',
    color: GLOBAL_FILL_COLOR_RGBA,
    clickThrough: '',
    operatorName: '',
    newTabEnabled: true,
    sanitizedURL: '',
    sanitizeURLEnabled: true,
    showName: true,
    showValue: true,
    isComposite: false,
    members: [],
  };
  return model;
}

function getValueByOperator(metricName: string, operatorName: string, calcs: FieldCalcs) {
  let value = calcs.avg;
  switch (operatorName) {
    case 'avg':
      value = calcs.mean;
      break;
    case 'count':
      value = calcs.count;
      break;
    case 'current':
      value = calcs.last;
      break;
    case 'delta':
      value = calcs.delta;
      break;
    case 'diff':
      value = calcs.diff;
      break;
    case 'first':
      value = calcs.first;
      break;
    case 'logmin':
      value = calcs.logmin;
      break;
    case 'max':
      value = calcs.max;
      break;
    case 'min':
      value = calcs.min;
      break;
    case 'name':
      value = metricName;
      break;
    case 'time_step':
      value = calcs.step;
      break;
    case 'last_time':
      value = 'ugh'; // TODO: pass in timestamp data.timestamp;
      break;
    case 'total':
      value = calcs.sum;
      break;
    default:
      value = calcs.mean;
      break;
  }
  return value;
}