import {
  ScopedVars,
  InterpolateFunction,
  escapeStringForRegex,
  stringToJsRegex,
  textUtil,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

import { ClickThroughTransformer } from './clickThroughTransformer';
import { CUSTOM_SPLIT_DELIMITER } from './constants';
import { ApplyGlobalRegexPattern } from './regex';
import { getWorstSeries } from './threshold';
import { TimeFormatter } from './timeFormatter';
import { CompositeDataModel, CompositeItemType, CompositeMetric } from './types';

export const customFormatter = (value: unknown): string => {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return (value as string[]).join(CUSTOM_SPLIT_DELIMITER);
  }
  return value as string;
};

export const resolveCompositeTemplates = (
  metricComposites: CompositeItemType[],
  replaceVariables: InterpolateFunction
): CompositeItemType[] => {
  const ret: CompositeItemType[] = [];
  metricComposites.forEach((item: CompositeItemType) => {
    const resolved = replaceVariables(item.name, undefined, customFormatter).split(CUSTOM_SPLIT_DELIMITER);
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

export const resolveMemberTemplates = (
  compositeName: string,
  members: CompositeMetric[],
  replaceVariables: InterpolateFunction
): CompositeMetric[] => {
  const ret: CompositeMetric[] = [];
  const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
  const compositeNameRegex = new RegExp(`^${compositeName}$`);
  members.forEach((member) => {
    if (member.seriesMatch) {
      const matchResult = member.seriesMatch.match(variableRegex);
      if (matchResult && matchResult.length > 0) {
        matchResult.forEach((aMatch) => {
          const scopedVars: ScopedVars = {
            compositeName: { text: 'compositeName', value: compositeName },
          };
          const resolvedSeriesNames = replaceVariables(aMatch, scopedVars, customFormatter).split(CUSTOM_SPLIT_DELIMITER);
          if (resolvedSeriesNames && resolvedSeriesNames.length) {
            resolvedSeriesNames.forEach((aName) => {
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

const resolveMemberAliasTemplates = (name: string, matches: RegExpMatchArray): string => {
  const scopedVars: ScopedVars = {};
  matches.forEach((matchName: string, i: number) => {
    scopedVars[i] = { text: i, value: matchName };
  });
  if (matches.groups) {
    Object.keys(matches.groups).forEach((key) => {
      scopedVars[key.replace(/\s+/g, '_')] = { text: key, value: matches.groups?.[key] };
    });
  }
  return getTemplateSrv().replace(name, scopedVars);
};

const shallowClone = (item: CompositeDataModel): CompositeDataModel => {
  const clone: CompositeDataModel = {
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
  data: CompositeDataModel[],
  replaceVariables: InterpolateFunction,
  compositesGlobalAliasingEnabled: boolean,
  timeZone: string,
  globalRegexPattern?: string
): CompositeDataModel[] => {
  if (!composites) {
    return data;
  }

  const filteredMetrics: number[] = [];
  const keepMetrics: number[] = [];
  const clonedComposites: CompositeDataModel[] = [];
  const resolvedComposites = resolveCompositeTemplates(composites, replaceVariables);

  for (let i = 0; i < resolvedComposites.length; i++) {
    const matchedMetrics: number[] = [];
    const aComposite = resolvedComposites[i];
    if (!aComposite.showComposite) {
      continue;
    }

    let currentWorstSeries: CompositeDataModel | null = null;
    const templatedMembers = resolveMemberTemplates(aComposite.name, aComposite.metrics, replaceVariables);

    for (let j = 0; j < templatedMembers.length; j++) {
      const aMetric = templatedMembers[j];
      for (let index = 0; index < data.length; index++) {
        if (typeof aMetric.seriesMatch === 'undefined') {
          continue;
        }
        let metricName = aMetric.seriesMatch;
        if (aMetric.seriesNameEscaped !== undefined) {
          metricName = aMetric.seriesNameEscaped;
        }
        const regex = stringToJsRegex(metricName);
        const matches = regex.exec(data[index].name);
        if (matches && matches.length > 0) {
          const seriesItem = data[index];
          if (aMetric.alias && aMetric.alias.length > 0) {
            seriesItem.displayName = resolveMemberAliasTemplates(aMetric.alias, matches);
          }

          matchedMetrics.push(index);
          if (!aComposite.showMembers) {
            filteredMetrics.push(index);
          } else {
            keepMetrics.push(index);
          }

          if (aComposite.clickThrough && aComposite.clickThrough.length > 0) {
            let url = aComposite.clickThrough;
            url = ClickThroughTransformer.transformComposite(aComposite.name, url);
            url = ClickThroughTransformer.transformSingleMetric(index, url, data);
            url = ClickThroughTransformer.transformNthMetric(url, data);
            url = replaceVariables(url);
            seriesItem.clickThrough = url;
            seriesItem.sanitizedURL = textUtil.sanitizeUrl(url);
            seriesItem.customClickthroughTarget = aComposite.clickThroughCustomTarget;
            seriesItem.customClickthroughTargetEnabled = aComposite.clickThroughCustomTargetEnabled;
          }

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

    for (let k = 0; k < matchedMetrics.length; k++) {
      const itemIndex = matchedMetrics[k];
      const seriesItem = data[itemIndex];
      if (currentWorstSeries === null) {
        currentWorstSeries = seriesItem;
      } else {
        currentWorstSeries = getWorstSeries(currentWorstSeries, seriesItem);
      }
    }

    if (currentWorstSeries !== null) {
      const clone = shallowClone(currentWorstSeries);
      clone.name = aComposite.name;
      clone.displayName = aComposite.name;
      for (let index = 0; index < matchedMetrics.length; index++) {
        const itemIndex = matchedMetrics[index];
        clone.members.push({
          ...data[itemIndex],
          name: data[itemIndex].displayName || data[itemIndex].name,
        });
      }
      clone.thresholdLevel = currentWorstSeries.thresholdLevel;
      clone.showName = aComposite.showName;
      clone.showValue = aComposite.showValue;
      clone.showTimestamp = aComposite.showTimestampEnabled;
      clone.displayMode = aComposite.displayMode;
      clone.newTabEnabled = aComposite.clickThroughOpenNewTab;
      clone.sanitizeURLEnabled = aComposite.clickThroughSanitize;
      clone.customClickthroughTarget = aComposite.clickThroughCustomTarget;
      clone.customClickthroughTargetEnabled = aComposite.clickThroughCustomTargetEnabled;
      clone.isComposite = true;
      clonedComposites.push(clone);
    }
  }

  if (compositesGlobalAliasingEnabled && globalRegexPattern) {
    Array.prototype.push.apply(data, ApplyGlobalRegexPattern(clonedComposites, globalRegexPattern));
  } else {
    Array.prototype.push.apply(data, clonedComposites);
  }

  for (let i = 0; i < keepMetrics.length; i++) {
    const keptMetric = keepMetrics[i];
    const location = filteredMetrics.indexOf(keptMetric);
    if (location >= 0) {
      filteredMetrics.splice(location, 1);
    }
  }

  filteredMetrics.sort((a, b) => b - a);

  for (let i = data.length; i >= 0; i--) {
    if (filteredMetrics.includes(i)) {
      data.splice(i, 1);
    }
  }

  return data;
};
