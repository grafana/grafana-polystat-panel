///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from "lodash";
import kbn from "app/core/utils/kbn";
import { PolystatModel } from "./polystatmodel";
import { getWorstSeries } from "./threshold_processor";
export class MetricComposite {
    compositeName: string;
    members: Array<any>;
    enabled: boolean;
    hideMembers: boolean;
    showName: boolean;
    showValue: boolean;
    animateMode: string;
    thresholdLevel: number;
    clickThrough: string;
    sanitizeURLEnabled: boolean;
    sanitizedURL: string;
}

export class CompositesManager {
    $scope: any;
    templateSrv: any;
    $sanitize: any;
    suggestMetricNames: any;
    metricComposites: Array<MetricComposite>;

    constructor($scope, templateSrv, $sanitize, savedComposites) {
        this.$scope = $scope;
        this.$sanitize = $sanitize;
        this.templateSrv = templateSrv;
        // typeahead requires this form
        this.suggestMetricNames = () => {
            return _.map(this.$scope.ctrl.series, function (series) {
                return series.alias;
            });
        };
        this.metricComposites = savedComposites;
    }

    addMetricComposite() {
        let aComposite = new MetricComposite();
        aComposite.compositeName = "";
        aComposite.members = [{}];
        aComposite.enabled = true;
        aComposite.clickThrough = "";
        aComposite.hideMembers = true;
        aComposite.showName = true;
        aComposite.showValue = true;
        aComposite.animateMode = "all";
        aComposite.thresholdLevel = 0;
        aComposite.sanitizeURLEnabled = true;
        aComposite.sanitizedURL = "";
        this.metricComposites.push(aComposite);
    }

    removeMetricComposite(item) {
        this.metricComposites = _.without(this.metricComposites, item);
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

    matchComposite(pattern) : number {
        for (let index = 0; index < this.metricComposites.length; index++) {
            let aComposite = this.metricComposites[index];
            var regex = kbn.stringToJsRegex(aComposite.compositeName);
            var matches = pattern.match(regex);
            if (matches && matches.length > 0) {
              return index;
            }
        }
        return -1;
    }

    applyComposites(data) {
        let filteredMetrics = new Array<number>();
        let clonedComposites = new Array<PolystatModel>();
        for (let i = 0; i < this.metricComposites.length; i++) {
            let matchedMetrics = new Array<number>();
            let aComposite = this.metricComposites[i];
            let currentWorstSeries = null;
            for (let j = 0; j < aComposite.members.length; j++) {
                let aMetric = aComposite.members[j];
                // look for the matches to the pattern in the data
                for (let index = 0; index < data.length; index++) {
                    // match regex
                    // seriesname may not be defined yet, skip
                    if (typeof aMetric.seriesName === "undefined") {
                      continue;
                    }
                    let regex = kbn.stringToJsRegex(aMetric.seriesName);
                    let matches = data[index].name.match(regex);
                    if (matches && matches.length > 0) {
                        let seriesItem = data[index];
                        // keep index of the matched metric
                        matchedMetrics.push(index);
                        // only hide if requested
                        if (aComposite.hideMembers) {
                            filteredMetrics.push(index);
                        }
                        if (aComposite.clickThrough.length > 0) {
                            seriesItem.clickThrough = aComposite.clickThrough;
                            seriesItem.sanitizedURL = this.$sanitize(aComposite.clickThrough);
                        }
                    }
                }
            }
            if (matchedMetrics.length === 0) {
               continue;
            }
            // now determine the most triggered threshold
            for (let k = 0; k < matchedMetrics.length; k++) {
                let itemIndex = matchedMetrics[k];
                let seriesItem = data[itemIndex];
                // check thresholds
                if (currentWorstSeries === null) {
                    currentWorstSeries = seriesItem;
                } else {
                    currentWorstSeries = getWorstSeries(currentWorstSeries, seriesItem);
                }
            }
            // Prefix the valueFormatted with the actual metric name
            if (currentWorstSeries !== null) {
                let clone = currentWorstSeries.shallowClone();
                clone.name = aComposite.compositeName;
                // tooltip/legend uses this to expand what values are inside the composite
                for (let index = 0; index < matchedMetrics.length; index++) {
                    let itemIndex = matchedMetrics[index];
                    clone.members.push(data[itemIndex]);
                }
                clone.thresholdLevel = currentWorstSeries.thresholdLevel;
                // currentWorstSeries.valueFormatted = currentWorstSeriesName + ': ' + currentWorstSeries.valueFormatted;
                // now push the composite into data
                // add the composite seting for showing the name/value to the new cloned model
                clone.showName = aComposite.showName;
                clone.showValue = aComposite.showValue;
                clone.animateMode = aComposite.animateMode;
                // mark this series as a compsite
                clone.isComposite = true;
                clonedComposites.push(clone);
            }
        }
        // now merge the clonedComposites into data
        Array.prototype.push.apply(data, clonedComposites);
        // sort by value descending
        filteredMetrics.sort(function (a, b) { return b - a; });
        // now remove the filtered metrics from final list
        // remove filtered metrics, use splice in reverse order
        for (let i = data.length; i >= 0; i--) {
          if (_.includes(filteredMetrics, i)) {
            data.splice(i, 1);
          }
        }
        return data;
    }


    metricNameChanged(item) {
        // TODO: validate item is a valid regex
        console.log(item);
        this.$scope.ctrl.refresh();
    }

    moveMetricCompositeUp(item) {
        for (let index = 0; index < this.metricComposites.length; index++) {
            let aComposite = this.metricComposites[index];
            if (item === aComposite) {
                if (index > 0) {
                    this.arraymove(this.metricComposites, index, index - 1);
                    break;
                }
            }
        }
    }

    moveMetricCompositeDown(item) {
        for (let index = 0; index < this.metricComposites.length; index++) {
            let anOverride = this.metricComposites[index];
            if (item === anOverride) {
                if (index < this.metricComposites.length) {
                    this.arraymove(this.metricComposites, index, index + 1);
                    break;
                }
            }
        }
    }

    arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
}
