import { includes as lodashIncludes } from 'lodash';
import { PolystatModel } from '../components/types';
import { getWorstSeries } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { stringToJsRegex, escapeStringForRegex, ScopedVars, InterpolateFunction, textUtil } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { CompositeItemType, CompositeMetric } from '../components/composites/types';
import { CUSTOM_SPLIT_DELIMITER } from './types';
import { ApplyGlobalRegexPattern } from './processor';
import { TimeFormatter } from './time_formatter';

export const resolveCompositeTemplates = (
  metricComposites: CompositeItemType[],
  replaceVariables: InterpolateFunction
): CompositeItemType[] => {
  const ret: CompositeItemType[] = [];
  metricComposites.forEach((item: CompositeItemType) => {
    const resolved = replaceVariables(item.name, undefined, customFormatter).split(CUSTOM_SPLIT_DELIMITER);
    // if the composite name has template syntax, mark it as isTemplated true
    const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
    const matchResult = item.name.match(variableRegex);
    if (matchResult && matchResult.length > 0) {
      item.isTemplated = true;
    }
    resolved.forEach((newName: string) => {
      ret.push({
        ...item,
        name: newName,
        isTemplated: item.isTemplated,
      });
    });
  });

  return ret;
};

export const customFormatter = (value: any) => {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return value.join(CUSTOM_SPLIT_DELIMITER);
  }
  return value;
};

export const resolveMemberTemplates = (
  compositeName: string,
  members: CompositeMetric[],
  replaceVariables: InterpolateFunction
): CompositeMetric[] => {
  const ret: CompositeMetric[] = [];
  const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
  // the metric name must exactly match the composite name
  const compositeNameRegex = new RegExp(`^${compositeName}$`);
  members.forEach((member) => {
    // Resolve templates in series names
    if (member.seriesMatch) {
      const matchResult = member.seriesMatch.match(variableRegex);
      if (matchResult && matchResult.length > 0) {
        matchResult.forEach((aMatch) => {
          // expand the templatedName (append compositeName to the variables first)
          const scopedVars: ScopedVars = {
            compositeName: { text: 'compositeName', value: compositeName },
          };
          // template variables can be multi-select, or "all", iterate over each match
          const resolvedSeriesNames = replaceVariables(aMatch, scopedVars, customFormatter).split(CUSTOM_SPLIT_DELIMITER);
          // iterate over the array of names
          if (resolvedSeriesNames && resolvedSeriesNames.length) {
            resolvedSeriesNames.forEach((aName) => {
              // exact match of the composite name is required
              if (aName.match(compositeNameRegex)) {
                const newName = member.seriesMatch.replace(aMatch, aName);
                const escapedName = escapeStringForRegex(aName);
                const newNameEscaped = member.seriesMatch.replace(aMatch, escapedName);
                ret.push({
                  ...member,
                  seriesName: newName,
                  seriesNameEscaped: newNameEscaped,
                });
              }
            });
          }
        });
      } else {
        ret.push(member);
      }
    }
  });

  return ret;
};

const resolveMemberAliasTemplates = (name: string, matches: any): string => {
  const scopedVars: ScopedVars = {};
  matches.forEach((name: string, i: number) => {
    scopedVars[i] = { text: i, value: name };
  });
  if (matches.groups) {
    Object.keys(matches.groups).forEach((key) => {
      scopedVars[key.replace(/\s+/g, '_')] = { text: key, value: matches.groups[key] };
    });
  }
  return getTemplateSrv().replace(name, scopedVars);
};

/**
 * Copies values, leaves members empty
 */
const shallowClone = (item: PolystatModel): PolystatModel => {
  const clone: PolystatModel = {
    value: item.value,
    valueFormatted: item.valueFormatted,
    valueRounded: item.valueRounded,
    stats: item.stats,
    name: item.name,
    displayName: item.displayName,
    timestamp: item.timestamp,
    timestampFormatted: item.timestampFormatted,
    prefix: item.prefix,
    suffix: item.suffix,
    color: item.color,
    clickThrough: item.clickThrough,
    operatorName: item.operatorName,
    newTabEnabled: item.newTabEnabled,
    sanitizedURL: item.sanitizedURL,
    sanitizeURLEnabled: item.sanitizeURLEnabled,
    customClickthroughTargetEnabled: false,
    customClickthroughTarget: '',
    showName: item.showName,
    showValue: item.showValue,
    showTimestamp: item.showTimestamp,
    isComposite: item.isComposite,
    members: [],
    mappings: item.mappings,
  };
  return clone;
};

export const ApplyComposites = (
  composites: CompositeItemType[],
  data: PolystatModel[],
  replaceVariables: InterpolateFunction,
  compositesGlobalAliasingEnabled: boolean,
  timeZone: string,
  globalRegexPattern?: string,
): PolystatModel[] => {
  if (!composites) {
    return data;
  }

  const filteredMetrics: number[] = [];
  const keepMetrics: number[] = [];
  const clonedComposites: PolystatModel[] = [];
  // the composite Name can be a template variable
  // the composite should only match specific metrics or expanded templated metrics that use the composite name
  const resolvedComposites = resolveCompositeTemplates(composites, replaceVariables);
  for (let i = 0; i < resolvedComposites.length; i++) {
    const matchedMetrics: number[] = [];
    const aComposite = resolvedComposites[i];
    if (!aComposite.showComposite) {
      continue;
    }
    let currentWorstSeries = null;
    // this should filter the members that are matches for the composite name
    const templatedMembers = resolveMemberTemplates(aComposite.name, aComposite.metrics, replaceVariables);
    for (let j = 0; j < templatedMembers.length; j++) {
      const aMetric = templatedMembers[j];
      // look for the matches to the pattern in the data
      for (let index = 0; index < data.length; index++) {
        // match regex
        // seriesName may not be defined yet, skip
        if (typeof aMetric.seriesMatch === 'undefined') {
          continue;
        }
        // name may not be escaped, check both
        let metricName = aMetric.seriesMatch;
        if (aMetric.seriesNameEscaped !== undefined) {
          metricName = aMetric.seriesNameEscaped;
        }
        const regex = stringToJsRegex(metricName);
        const matches = regex.exec(data[index].name);
        if (matches && matches.length > 0) {
          const seriesItem = data[index];
          // Template out the name of the metric using the alias
          if (aMetric.alias && aMetric.alias.length > 0) {
            seriesItem.displayName = resolveMemberAliasTemplates(aMetric.alias, matches);
          }

          // keep index of the matched metric
          matchedMetrics.push(index);
          // only hide if requested
          if (!aComposite.showMembers) {
            filteredMetrics.push(index);
          } else {
            keepMetrics.push(index);
          }
          if (aComposite.clickThrough && aComposite.clickThrough.length > 0) {
            let url = aComposite.clickThrough;
            // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
            url = ClickThroughTransformer.transformComposite(aComposite.name, url);
            url = ClickThroughTransformer.transformSingleMetric(index, url, data);
            url = ClickThroughTransformer.transformNthMetric(url, data);
            // lastly apply template variables
            url = replaceVariables(url);
            seriesItem.clickThrough = url;
            seriesItem.sanitizedURL = textUtil.sanitizeUrl(url);
            seriesItem.customClickthroughTarget = aComposite.clickThroughCustomTarget;
            seriesItem.customClickthroughTargetEnabled = aComposite.clickThroughCustomTargetEnabled;
          }
          // process the timestamp display
          if (aComposite.showTimestampEnabled) {
            seriesItem.timestampFormatted = TimeFormatter(timeZone, data[index].timestamp, aComposite.showTimestampFormat);
            seriesItem.showTimestamp = true;
          }
        }
      }
    }
    if (matchedMetrics.length === 0) {
      continue;
    }
    // now determine the most triggered threshold

    for (let k = 0; k < matchedMetrics.length; k++) {
      const itemIndex = matchedMetrics[k];
      const seriesItem = data[itemIndex];
      // check thresholds
      if (currentWorstSeries === null) {
        currentWorstSeries = seriesItem;
      } else {
        currentWorstSeries = getWorstSeries(currentWorstSeries, seriesItem);
      }
    }
    // Prefix the valueFormatted with the actual metric name
    if (currentWorstSeries !== null) {
      const clone = shallowClone(currentWorstSeries);
      clone.name = aComposite.name;
      clone.displayName = aComposite.name;
      // tooltip/legend uses this to expand what values are inside the composite
      for (let index = 0; index < matchedMetrics.length; index++) {
        const itemIndex = matchedMetrics[index];
        clone.members.push({
          ...data[itemIndex],
          name: data[itemIndex].displayName || data[itemIndex].name,
        });
      }
      clone.thresholdLevel = currentWorstSeries.thresholdLevel;
      // currentWorstSeries.valueFormatted = currentWorstSeriesName + ': ' + currentWorstSeries.valueFormatted;
      // now push the composite into data
      // add the composite setting for showing the name/value to the new cloned model
      clone.showName = aComposite.showName;
      clone.showValue = aComposite.showValue;
      clone.showTimestamp = aComposite.showTimestampEnabled;
      clone.displayMode = aComposite.displayMode;
      clone.newTabEnabled = aComposite.clickThroughOpenNewTab;
      clone.sanitizeURLEnabled = aComposite.clickThroughSanitize;
      clone.customClickthroughTarget = aComposite.clickThroughCustomTarget;
      clone.customClickthroughTargetEnabled = aComposite.clickThroughCustomTargetEnabled;
      // mark this series as a composite
      clone.isComposite = true;
      clonedComposites.push(clone);
    }
  }
  // now merge the clonedComposites into data
  if(compositesGlobalAliasingEnabled && globalRegexPattern) {
    Array.prototype.push.apply(data, ApplyGlobalRegexPattern(clonedComposites, globalRegexPattern))
  } else {
    Array.prototype.push.apply(data, clonedComposites);
  }
  // remove the keepMetrics from the filteredMetrics list
  // these have been marked by at least one composite to be displayed
  for (let i = 0; i < keepMetrics.length; i++) {
    const keptMetric = keepMetrics[i];
    const location = filteredMetrics.indexOf(keptMetric);
    if (location >= 0) {
      filteredMetrics.splice(location, 1);
    }
  }
  // sort by value descending
  filteredMetrics.sort((a, b) => {
    return b - a;
  });
  // now remove the filtered metrics from final list
  // remove filtered metrics, use splice in reverse order
  for (let i = data.length; i >= 0; i--) {
    if (lodashIncludes(filteredMetrics, i)) {
      data.splice(i, 1);
    }
  }
  return data;
};
