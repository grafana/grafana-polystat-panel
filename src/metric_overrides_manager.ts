import _ from "lodash";
import kbn from "app/core/utils/kbn";

export class MetricOverride {
    metricName: string;
    thresholds: Array<number>;
    colors: Array<string>;
    unitFormat: string;
    decimals: string;
    scaledDecimals: number;
    enabled: boolean;
    valueName: string;
    clickThrough: string;
    prefix: string;
    suffix: string;
}

export class MetricOverridesManager {
    metricOverrides : Array < MetricOverride >;
    $scope: any;
    templateSrv: any;
    suggestMetricNames: any;
    constructor($scope, templateSrv, savedOverrides) {
        this.$scope = $scope;
        this.templateSrv = templateSrv;
        // typeahead requires this form
        this.suggestMetricNames = () => {
            return _.map(this.$scope.ctrl.series, function (series) {
                return series.alias;
            });
        };
        this.metricOverrides = savedOverrides || new Array<MetricOverride>();
    }

    addMetricOverride() {
        let override = new MetricOverride();
        override.metricName = "";
        override.thresholds = [];
        override.colors = ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"];
        override.decimals = "";
        override.enabled = true;
        override.unitFormat = "";
        override.clickThrough = "";
        override.valueName = "avg";
        override.scaledDecimals = null;
        override.prefix = "";
        override.suffix = "";
        this.metricOverrides.push(override);
    }

    removeMetricOverride(override) {
        this.metricOverrides = _.without(this.metricOverrides, override);
        this.$scope.ctrl.refresh();
    }

    matchOverride(pattern) : number {
        for (let index = 0; index < this.metricOverrides.length; index++) {
            let anOverride = this.metricOverrides[index];
            var regex = kbn.stringToJsRegex(anOverride.metricName);
            var matches = pattern.match(regex);
            if (matches && matches.length > 0) {
                return index;
            }
        }
        return -1;
    }

    applyOverrides(data) {
        for (let index = 0; index < data.length; index++) {
            let matchIndex = this.matchOverride(data[index].name);
            if (matchIndex >= 0) {
                data[index].color = this.getColorForValue(matchIndex, data[index].value);
                // format it
                let anOverride = this.metricOverrides[matchIndex];
                var formatFunc = kbn.valueFormats[anOverride.unitFormat];
                if (formatFunc) {
                    // put the value in quotes to escape "most" special characters
                    data[index].valueFormatted = formatFunc(data[index].value, anOverride.decimals, anOverride.scaledDecimals);
                    data[index].valueRounded = kbn.roundValue(data[index].value, anOverride.decimals);
                }
                // copy the threshold data into the object
                data[index].thresholds = anOverride.thresholds;
                data[index].prefix = anOverride.prefix;
                data[index].suffix = anOverride.suffix;
                // set the url, replace template vars
                if ((anOverride.clickThrough) && (anOverride.clickThrough.length > 0)) {
                    data[index].clickThrough = this.templateSrv.replaceWithText(anOverride.clickThrough);
                }
            }
        }
    }

    getColorForValue(index, value): string {
        let anOverride = this.metricOverrides[index];
        for (let i = anOverride.thresholds.length; i > 0; i--) {
            if (value >= anOverride.thresholds[i - 1]) {
                return anOverride.colors[i];
            }
        }
        return _.first(anOverride.colors);
    }

    invertColorOrder(override) {
        override.colors.reverse();
        this.$scope.ctrl.refresh();
    }

    setUnitFormat(override, subItem) {
        override.unitFormat = subItem.value;
    }

    moveMetricOverrideUp(override) {
        for (let index = 0; index < this.metricOverrides.length; index++) {
            let anOverride = this.metricOverrides[index];
            if (override === anOverride) {
                if (index > 0) {
                    this.arraymove(this.metricOverrides, index, index - 1);
                    break;
                }
            }
        }
    }
    moveMetricOverrideDown(override) {
        for (let index = 0; index < this.metricOverrides.length; index++) {
            let anOverride = this.metricOverrides[index];
            if (override === anOverride) {
                if (index < this.metricOverrides.length) {
                    this.arraymove(this.metricOverrides, index, index + 1);
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
