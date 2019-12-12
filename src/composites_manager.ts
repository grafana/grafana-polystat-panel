import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import { PolystatModel } from './polystatmodel';
import { getWorstSeries } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';

export class MetricComposite {
  compositeName: string;
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
}

export class CompositesManager {
  $scope: any;
  templateSrv: any;
  $sanitize: any;
  suggestMetricNames: any;
  metricComposites: MetricComposite[];
  subTabIndex: number;

  constructor($scope, templateSrv, $sanitize, savedComposites) {
    this.$scope = $scope;
    this.$sanitize = $sanitize;
    this.templateSrv = templateSrv;
    this.subTabIndex = 0;
    // typeahead requires this form
    this.suggestMetricNames = () => {
      return _.map(this.$scope.ctrl.series, series => {
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

  matchComposite(pattern): number {
    for (let index = 0; index < this.metricComposites.length; index++) {
      const aComposite = this.metricComposites[index];
      const regex = kbn.stringToJsRegex(aComposite.compositeName);
      const matches = pattern.match(regex);
      if (matches && matches.length > 0 && aComposite.enabled) {
        return index;
      }
    }
    return -1;
  }

  applyComposites(data) {
    const filteredMetrics = new Array<number>();
    const clonedComposites = new Array<PolystatModel>();
    for (let i = 0; i < this.metricComposites.length; i++) {
      const matchedMetrics = new Array<number>();
      const aComposite = this.metricComposites[i];
      if (!aComposite.enabled) {
        continue;
      }
      let currentWorstSeries = null;
      for (let j = 0; j < aComposite.members.length; j++) {
        const aMetric = aComposite.members[j];
        // look for the matches to the pattern in the data
        for (let index = 0; index < data.length; index++) {
          // match regex
          // seriesname may not be defined yet, skip
          if (typeof aMetric.seriesName === 'undefined') {
            continue;
          }
          const regex = kbn.stringToJsRegex(aMetric.seriesName);
          const matches = data[index].name.match(regex);
          if (matches && matches.length > 0) {
            const seriesItem = data[index];
            // keep index of the matched metric
            matchedMetrics.push(index);
            // only hide if requested
            if (aComposite.hideMembers) {
              filteredMetrics.push(index);
            }
            if (aComposite.clickThrough.length > 0) {
              // process template variables
              let url = this.templateSrv.replaceWithText(aComposite.clickThrough);
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
          currentWorstSeries = getWorstSeries(currentWorstSeries, seriesItem, this.$scope.ctrl.panel.polystat.polygonGlobalFillColor);
        }
      }
      // Prefix the valueFormatted with the actual metric name
      if (currentWorstSeries !== null) {
        const clone = currentWorstSeries.shallowClone();
        clone.name = aComposite.compositeName;
        // tooltip/legend uses this to expand what values are inside the composite
        for (let index = 0; index < matchedMetrics.length; index++) {
          const itemIndex = matchedMetrics[index];
          clone.members.push(data[itemIndex]);
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
    console.log("metric name changed: '" + metric.seriesName + "'");
    this.$scope.ctrl.refresh();
  }

  toggleHide(composite) {
    console.log('composite enabled =  ' + composite.enabled);
    composite.enabled = !composite.enabled;
    this.$scope.ctrl.refresh();
  }
}
