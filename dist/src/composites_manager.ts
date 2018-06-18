import _ from "lodash";
import kbn from "app/core/utils/kbn";

export class MetricComposite {
    compositeName: string;
    members: Array<any>;
    enabled: boolean;
    clickThrough: string;
    hideMembers: boolean;
    showName: boolean;
    showValue: boolean;
    animateMode: number;
}

export class CompositesManager {
    $scope: any;
    templateSrv: any;
    suggestMetricNames: any;
    metricComposites: Array<MetricComposite>;

    constructor($scope, templateSrv, savedComposites) {
        this.$scope = $scope;
        this.templateSrv = templateSrv;
        // typeahead requires this form
        this.suggestMetricNames = () => {
            return _.map(this.$scope.ctrl.series, function (series) {
                return series.alias;
            });
        };
        this.metricComposites = savedComposites || new Array<MetricComposite>();
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
        aComposite.animateMode = 0;
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
        for (var i = 0; i < this.metricComposites.length; i++) {
            let matchedMetrics = new Array<number>();
            var aComposite = this.metricComposites[i];
            var currentWorstSeries = null;
            for (var j = 0; j < aComposite.members.length; j++) {
                var aMetric = aComposite.members[j];
                var seriesItem = null;
                // look for the metric in the data
                for (let index = 0; index < data.length; index++) {
                    if (data[index].name === aMetric.seriesName) {
                        seriesItem = data[index];
                        // keep index of the matched metric
                        matchedMetrics.push(index);
                        // only hide if requested
                        if (aComposite.hideMembers) {
                            filteredMetrics.push(index);
                        }
                        if (aComposite.clickThrough.length > 0) {
                            seriesItem.clickThrough = aComposite.clickThrough;
                        }
                        seriesItem.showValue = aComposite.showValue;
                        seriesItem.showName = aComposite.showName;
                        break;
                    }
                }
                if (!seriesItem) {
                    continue;
                }
                // check thresholds
                if (currentWorstSeries === null) {
                    currentWorstSeries = seriesItem;
                } else {
                    currentWorstSeries = this.getWorstSeries(currentWorstSeries, seriesItem);
                }
            }
            // Prefix the valueFormatted with the actual metric name
            if (currentWorstSeries !== null) {
                var clone = Object.assign({}, currentWorstSeries);
                // clone the object or it will modify the original
                clone.valueFormattedWithPrefix = clone.name + ": " + clone.valueFormatted;
                clone.valueRawFormattedWithPrefix = clone.name + ": " + clone.value;
                //clone.valueFormatted = clone.name + ": " + clone.valueFormatted;
                //clone.valueFormatted = clone.name + ": " + clone.valueFormatted;
                clone.name = aComposite.compositeName;
                // tooltip/legend uses this to expand what values are inside the composite
                for (let index = 0; index < matchedMetrics.length; index++) {
                    let itemIndex = matchedMetrics[index];
                    clone.members.push(data[itemIndex]);
                }
                // currentWorstSeries.valueFormatted = currentWorstSeriesName + ': ' + currentWorstSeries.valueFormatted;
                // now push the composite into data
                data.push(clone);
            }
        }
        // sort by value descending
        filteredMetrics.sort(function (a, b) { return b - a; });
        // now remove the filtered metrics from final list
        for (let i = 0; i < filteredMetrics.length; i++) {
            data.splice(filteredMetrics[i], 1);
        }
        return data;
    }

    getWorstSeries(series1, series2) {
        var worstSeries = series1;
        var series1thresholdLevel = this.getThresholdLevel(series1);
        var series2thresholdLevel = this.getThresholdLevel(series2);
        // console.log("Series1 threshold level: " + series1thresholdLevel);
        // console.log("Series2 threshold level: " + series2thresholdLevel);
        if (series2thresholdLevel > series1thresholdLevel) {
            // series2 has higher threshold violation
            worstSeries = series2;
        }
        return worstSeries;
    }

    // returns level of threshold, 0 = ok, 1 = warnimg, 2 = critical
    getThresholdLevel(series) {
        // default to ok
        var thresholdLevel = 0;
        var value = series.value;
        var thresholds = series.thresholds;
        // if no thresholds are defined, return 0
        if (thresholds === undefined) {
            return thresholdLevel;
        }
        // make sure thresholds is an array of size 2
        if (thresholds.length !== 2) {
            return thresholdLevel;
        }
        if (value >= thresholds[0]) {
            // value is equal or greater than first threshold
            thresholdLevel = 1;
        }
        if (value >= thresholds[1]) {
            // value is equal or greater than second threshold
            thresholdLevel = 2;
        }
        return thresholdLevel;
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
