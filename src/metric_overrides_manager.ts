///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from "lodash";
import kbn from "app/core/utils/kbn";
import { getThresholdLevelForValue, getValueByStatName } from "./threshold_processor";

export class MetricOverride {
    metricName: string;
    thresholds: Array<any>;
    colors: Array<string>;
    unitFormat: string;
    decimals: string;
    scaledDecimals: number;
    enabled: boolean;
    operatorName: string; // avg/min/max etc
    prefix: string;
    suffix: string;
    clickThrough: string;
    sanitizeURLEnabled: boolean;
    sanitizedURL: string;
}

export class MetricOverridesManager {
    metricOverrides : Array < MetricOverride >;
    $scope: any;
    $sanitize: any;
    templateSrv: any;
    suggestMetricNames: any;

    constructor($scope, templateSrv, $sanitize, savedOverrides) {
        this.$scope = $scope;
        this.$sanitize = $sanitize;
        this.templateSrv = templateSrv;
        // typeahead requires this form
        this.suggestMetricNames = () => {
            return _.map(this.$scope.ctrl.series, function (series) {
                return series.alias;
            });
        };
        this.metricOverrides = savedOverrides;
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
        override.operatorName = "avg";
        override.scaledDecimals = null;
        override.prefix = "";
        override.suffix = "";
        override.sanitizeURLEnabled = true;
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
            let aSeries = data[index];
              let anOverride = this.metricOverrides[matchIndex];
              // set the operators
              aSeries.operatorName = anOverride.operatorName;
              let dataValue = getValueByStatName(aSeries.operatorName, aSeries);
              //console.log("series2 operator: " + series2.operatorName);
              //console.log("series2 value: " + series2Value);
              var result = getThresholdLevelForValue(anOverride.thresholds, dataValue);
              // set value to what was returned
              data[index].value = dataValue;
              data[index].color = result.color;
              //console.log("applyOverrides: value = " + data[index].value + " color " + data[index].color);
              data[index].thresholdLevel = result.thresholdLevel;
              // format it
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
                  if (anOverride.sanitizeURLEnabled) {
                      data[index].sanitizedURL = this.$sanitize(data[index].clickThrough);
                  }
              }
          }
      }
  }


    addThreshold(override) {
      override.thresholds.push( {
        value: 0,
        state: 0,
        color: "#299c46",
      });
      this.sortThresholds(override);
    }

    // store user selection of color to be used for all items with the corresponding state
    setThresholdColor(threshold) {
      console.log("Threshold color set to " + threshold.color);
      this.$scope.ctrl.refresh();
    }

    validateThresholdColor(threshold) {
      console.log("Validate color " + threshold.color);
      this.$scope.ctrl.refresh();
    }

    sortThresholds(override) {
      override.thresholds = _.orderBy(override.thresholds, ["value"], ["asc"]);
      this.$scope.ctrl.refresh();
    }

    removeThreshold(override, threshold) {
      override.thresholds = _.without(override.thresholds, threshold);
      this.sortThresholds(override);
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
