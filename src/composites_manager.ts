import _ from 'lodash';
import { PolystatModel } from './polystatmodel';
import { getWorstSeries } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { stringToJsRegex, escapeStringForRegex, ScopedVars } from '@grafana/data';

export class MetricComposite {
  compositeName: string;
  displayName: string;
  members: any[];
  enabled: boolean;
  hideMembers: boolean;
  showName: boolean;
  showValue: boolean;
  animateMode: string;
  thresholdLevel: number;
  clickThrough: string;
  newTabEnabled: boolean;
  sanitizeURLEnabled: boolean;
  sanitizedURL: string;
  label: string;
  isTemplated: boolean;
  templatedName: string;
}

export class CompositesManager {
  $scope: any;
  templateSrv: any;
  $sanitize: any;
  suggestMetricNames: any;
  metricComposites: MetricComposite[];
  subTabIndex: number;
  customSplitDelimiter: string;

  constructor($scope, templateSrv, $sanitize, savedComposites) {
    this.$scope = $scope;
    this.$sanitize = $sanitize;
    this.templateSrv = templateSrv;
    this.customSplitDelimiter = '#️⃣🔠🆗🆗🔠#️⃣';
    this.subTabIndex = 0;
    // typeahead requires this form
    this.suggestMetricNames = () => {
      return _.map(this.$scope.ctrl.series, (series) => {
        return series.alias;
      });
    };
    this.metricComposites = savedComposites;
    // upgrade if no label present
    for (let index = 0; index < this.metricComposites.length; index++) {
      if (typeof this.metricComposites[index].label === 'undefined') {
        this.metricComposites[index].label = 'COMPOSITE ' + (index + 1);
      }
    }
  }

  addMetricComposite() {
    const aComposite = new MetricComposite();
    aComposite.label = 'COMPOSITE ' + (this.metricComposites.length + 1);
    aComposite.compositeName = '';
    aComposite.displayName = '';
    aComposite.members = [{}];
    aComposite.enabled = true;
    aComposite.clickThrough = '';
    aComposite.hideMembers = true;
    aComposite.showName = true;
    aComposite.showValue = true;
    aComposite.animateMode = 'all';
    aComposite.thresholdLevel = 0;
    aComposite.newTabEnabled = true;
    aComposite.sanitizeURLEnabled = true;
    aComposite.sanitizedURL = '';
    this.metricComposites.push(aComposite);
  }

  removeMetricComposite(item) {
    // lodash _.without creates a new array, need to reassign to the panel where it will be saved
    this.metricComposites = _.without(this.metricComposites, item);
    // fix the labels
    for (let index = 0; index < this.metricComposites.length; index++) {
      this.metricComposites[index].label = 'COMPOSITE ' + (index + 1);
    }
    // reassign reference in panel
    this.$scope.ctrl.panel.savedComposites = this.metricComposites;
    this.$scope.ctrl.refresh();
  }

  addMetricToComposite(composite) {
    if (composite.members === undefined) {
      composite.members = [{}];
    } else {
      composite.members.push({});
    }
    this.$scope.ctrl.refresh();
  }

  removeMetricFromComposite(composite, metric) {
    composite.members = _.without(composite.members, metric);
    this.$scope.ctrl.refresh();
  }

  resolveCompositeTemplates(): MetricComposite[] {
    const ret: MetricComposite[] = [];
    this.metricComposites.forEach((item: MetricComposite) => {
      const resolved = this.templateSrv
        .replace(item.compositeName, this.templateSrv.ScopedVars, this.customFormatter)
        .split('#️⃣🔠🆗🆗🔠#️⃣');
      resolved.forEach((newName) => {
        ret.push({
          ...item,
          compositeName: newName,
          isTemplated: true,
          templatedName: item.compositeName,
        });
      });
    });

    return ret;
  }

  customFormatter(value: any) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return value.join('#️⃣🔠🆗🆗🔠#️⃣');
    }
    return value;
  }

  resolveMemberTemplates(
    compositeName: string,
    isTemplated: boolean,
    templatedName: string,
    members: any[],
    vars: ScopedVars[] = this.templateSrv.ScopedVars
  ): any[] {
    const ret: any[] = [];
    const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
    members.forEach((member) => {
      // Resolve templates in series names
      if (member.seriesName) {
        const matchResult = member.seriesName.match(variableRegex);
        if (matchResult && matchResult.length > 0) {
          matchResult.forEach((template) => {
            // if the template contains the composite template, replace it with the compositeName
            if (isTemplated && template.includes(templatedName)) {
              // replace it
              template = template.replace(templatedName, compositeName);
            }
            const resolvedSeriesNames = [this.templateSrv.replace(template, vars, 'raw')];
            resolvedSeriesNames.forEach((seriesName) => {
              const newName = member.seriesName.replace(matchResult, seriesName);
              const escapedName = escapeStringForRegex(seriesName);
              const newSeriesNameEscaped = member.seriesName.replace(matchResult, escapedName);

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
  }

  resolveMemberAliasTemplates(name: string, matches: any): string {
    const templateVars: ScopedVars = {};
    matches.forEach((name: string, i: number) => {
      templateVars[i] = { text: i, value: name };
    });
    if (matches.groups) {
      Object.keys(matches.groups).forEach((key) => {
        templateVars[key.replace(/\s+/g, '_')] = { text: key, value: matches.groups[key] };
      });
    }
    return this.templateSrv.replace(name, templateVars);
  }

  applyComposites(data: PolystatModel[]) {
    const filteredMetrics: number[] = [];
    const clonedComposites: PolystatModel[] = [];
    // the composite Name can be a template variable
    // the composite should only match specific metrics or expanded templated metrics that use the composite name
    const resolvedComposites = this.resolveCompositeTemplates();
    for (let i = 0; i < resolvedComposites.length; i++) {
      const matchedMetrics: number[] = [];
      const aComposite = resolvedComposites[i];
      if (!aComposite.enabled) {
        continue;
      }
      let currentWorstSeries = null;
      // this should filter the members that are matches for the composite name
      const templatedMembers = this.resolveMemberTemplates(
        aComposite.compositeName,
        aComposite.isTemplated,
        aComposite.templatedName,
        aComposite.members,
        {
          ...this.templateSrv.ScopedVars,
          compositeName: { text: 'compositeName', value: aComposite.compositeName },
        }
      );
      for (let j = 0; j < templatedMembers.length; j++) {
        const aMetric = templatedMembers[j];
        // look for the matches to the pattern in the data
        for (let index = 0; index < data.length; index++) {
          // match regex
          // seriesname may not be defined yet, skip
          if (typeof aMetric.seriesName === 'undefined') {
            continue;
          }
          const regex = stringToJsRegex(aMetric.seriesNameEscaped);
          const matches = regex.exec(data[index].name);
          if (matches && matches.length > 0) {
            const seriesItem = data[index];
            // Template out the name of the metric using the alias
            if (aMetric.alias && aMetric.alias.length > 0) {
              seriesItem.displayName = this.resolveMemberAliasTemplates(aMetric.alias, matches);
            }

            // keep index of the matched metric
            matchedMetrics.push(index);
            // only hide if requested
            if (aComposite.hideMembers) {
              filteredMetrics.push(index);
            }
            if (aComposite.clickThrough && aComposite.clickThrough.length > 0) {
              // process template variables
              let url = this.templateSrv.replace(aComposite.clickThrough, 'text');
              // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
              url = ClickThroughTransformer.tranformComposite(aComposite.compositeName, url);
              url = ClickThroughTransformer.tranformSingleMetric(index, url, data);
              url = ClickThroughTransformer.tranformNthMetric(url, data);
              seriesItem.clickThrough = url;
              seriesItem.sanitizedURL = this.$sanitize(url);
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
        const clone = currentWorstSeries.shallowClone();
        clone.name = aComposite.compositeName;
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
        // add the composite seting for showing the name/value to the new cloned model
        clone.showName = aComposite.showName;
        clone.showValue = aComposite.showValue;
        clone.animateMode = aComposite.animateMode;
        clone.newTabEnabled = aComposite.newTabEnabled;
        clone.sanitizeURLEnabled = aComposite.sanitizeURLEnabled;
        // mark this series as a compsite
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
      if (_.includes(filteredMetrics, i)) {
        data.splice(i, 1);
      }
    }
    return data;
  }

  metricNameChanged(metric) {
    // TODO: validate item is a valid regex
    this.$scope.ctrl.refresh();
  }

  toggleHide(composite) {
    composite.enabled = !composite.enabled;
    this.$scope.ctrl.refresh();
  }
}
