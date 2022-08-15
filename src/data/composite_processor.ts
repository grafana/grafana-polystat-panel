import { includes as lodashIncludes } from 'lodash';
import { PolystatModel } from '../components/types';
import { getWorstSeries } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { stringToJsRegex, escapeStringForRegex, ScopedVars, InterpolateFunction, textUtil } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { CompositeItemType, CompositeMetric } from 'components/composites/types';
import { CUSTOM_SPLIT_DELIMITER } from './types';

//@ts-ignore
const upgradeComposites = (metricComposites: CompositeItemType[]) => {
  for (let index = 0; index < metricComposites.length; index++) {
    if (typeof metricComposites[index].name === 'undefined') {
      metricComposites[index].name = 'COMPOSITE ' + (index + 1);
    }
  }
  return metricComposites;
};

const resolveCompositeTemplates = (
  metricComposites: CompositeItemType[],
  replaceVariables: InterpolateFunction
): CompositeItemType[] => {
  const ret: CompositeItemType[] = [];
  //const sv: ScopedVars = {}; // TODO: where do these come from now?
  metricComposites.forEach((item: CompositeItemType) => {
    const firstResolve = replaceVariables(item.name); // the ScopedVars should expand here
    const resolved = replaceVariables(firstResolve, {}, customFormatter).split(CUSTOM_SPLIT_DELIMITER);
    //const resolved = getTemplateSrv()
    //  .replace(item.compositeName, sv, customFormatter)
    //  .split(CUSTOM_SPLIT_DELIMITER);
    resolved.forEach((newName: string) => {
      ret.push({
        ...item,
        name: newName,
        isTemplated: true,
        templatedName: item.name,
      });
    });
  });

  return ret;
};

const customFormatter = (value: any) => {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return value.join(CUSTOM_SPLIT_DELIMITER);
  }
  return value;
};

const resolveMemberTemplates = (
  compositeName: string,
  isTemplated: boolean,
  templatedName: string,
  members: CompositeMetric[],
  replaceVariables: InterpolateFunction
): any[] => {
  const ret: any[] = [];
  const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
  members.forEach((member) => {
    // Resolve templates in series names
    if (member.seriesMatch.label) {
      const matchResult = member.seriesMatch.value.match(variableRegex);
      if (matchResult && matchResult.length > 0) {
        matchResult.forEach((template) => {
          // if the template contains the composite template, replace it with the compositeName
          if (isTemplated && template.includes(templatedName)) {
            // replace it
            template = template.replace(templatedName, compositeName);
          }
          const resolvedSeriesNames = [replaceVariables(template, {}, 'raw')];
          resolvedSeriesNames.forEach((seriesName) => {
            const newName = member.seriesMatch.label.replace(matchResult, seriesName);
            const escapedName = escapeStringForRegex(seriesName);
            const newSeriesNameEscaped = member.seriesMatch.label.replace(matchResult, escapedName);

            ret.push({
              ...member,
              seriesName: newName,
              seriesNameEscaped: newSeriesNameEscaped,
            });
          });
        });
      } else {
        ret.push(member);
      }
    }
  });

  return ret;
};

const resolveMemberAliasTemplates = (name: string, matches: any): string => {
  const templateVars: ScopedVars = {};
  matches.forEach((name: string, i: number) => {
    templateVars[i] = { text: i, value: name };
  });
  if (matches.groups) {
    Object.keys(matches.groups).forEach((key) => {
      templateVars[key.replace(/\s+/g, '_')] = { text: key, value: matches.groups[key] };
    });
  }
  return getTemplateSrv().replace(name, templateVars);
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
    prefix: item.prefix,
    suffix: item.suffix,
    seriesRaw: undefined,
    color: item.color,
    clickThrough: item.clickThrough,
    operatorName: item.operatorName,
    newTabEnabled: item.newTabEnabled,
    sanitizedURL: item.sanitizedURL,
    sanitizeURLEnabled: item.sanitizeURLEnabled,
    showName: item.showName,
    showValue: item.showValue,
    isComposite: item.isComposite,
    members: [],
  };
  return clone;
};

export const ApplyComposites = (
  composites: CompositeItemType[],
  data: PolystatModel[],
  replaceVariables: InterpolateFunction
): PolystatModel[] => {
  if (!composites) {
    return data;
  }
  const filteredMetrics: number[] = [];
  const clonedComposites: PolystatModel[] = [];
  // the composite Name can be a template variable
  // the composite should only match specific metrics or expanded templated metrics that use the composite name
  const resolvedComposites = resolveCompositeTemplates(composites, replaceVariables);
  for (let i = 0; i < resolvedComposites.length; i++) {
    const matchedMetrics: number[] = [];
    const aComposite = resolvedComposites[i];
    if (!aComposite.enabled) {
      continue;
    }
    let currentWorstSeries = null;
    // this should filter the members that are matches for the composite name
    const templatedMembers = resolveMemberTemplates(
      aComposite.name,
      aComposite.isTemplated,
      aComposite.templatedName,
      aComposite.metrics,
      replaceVariables
    );
    for (let j = 0; j < templatedMembers.length; j++) {
      const aMetric = templatedMembers[j];
      // look for the matches to the pattern in the data
      for (let index = 0; index < data.length; index++) {
        // match regex
        // seriesName may not be defined yet, skip
        if (typeof aMetric.seriesName === 'undefined') {
          continue;
        }
        // name may not be escaped, check both
        let metricName = aMetric.seriesName;
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
          }
          if (aComposite.clickThrough && aComposite.clickThrough.length > 0) {
            // process template variables
            let url = replaceVariables(aComposite.clickThrough);
            // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
            url = ClickThroughTransformer.transformComposite(aComposite.name, url);
            url = ClickThroughTransformer.transformSingleMetric(index, url, data);
            url = ClickThroughTransformer.transformNthMetric(url, data);
            seriesItem.clickThrough = url;
            seriesItem.sanitizedURL = textUtil.sanitizeUrl(url);
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
      clone.displayMode = aComposite.displayMode.value;
      clone.newTabEnabled = aComposite.clickThroughOpenNewTab;
      clone.sanitizeURLEnabled = aComposite.clickThroughSanitize;
      // mark this series as a composite
      clone.isComposite = true;
      clonedComposites.push(clone);
    }
  }
  // now merge the clonedComposites into data
  Array.prototype.push.apply(data, clonedComposites);
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
