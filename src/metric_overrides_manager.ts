///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from "lodash";
import kbn from "app/core/utils/kbn";
import { getThresholdLevelForValue, getValueByStatName } from "./threshold_processor";
import { RGBToHex } from "./utils";
import {ClickThroughTransformer} from "./clickThroughTransformer";

export class MetricOverride {
  label: string;
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
    activeOverrideIndex: number;

    constructor($scope, templateSrv, $sanitize, metricOverrides: Array<MetricOverride>) {
        this.$scope = $scope;
        this.$sanitize = $sanitize;
        this.templateSrv = templateSrv;
        this.activeOverrideIndex = 0;
        // typeahead requires this form
        this.suggestMetricNames = () => {
            return _.map(this.$scope.ctrl.series, function (series) {
                return series.alias;
            });
        };
        this.metricOverrides = metricOverrides;
        // upgrade if no label present
        for (let index = 0; index < this.metricOverrides.length; index++) {
          if (typeof this.metricOverrides[index].label === "undefined") {
            this.metricOverrides[index].label = "OVERRIDE " + (index + 1);
          }
        }
    }

    addMetricOverride() {
        let override = new MetricOverride();
        override.label = "OVERRIDE " + (this.metricOverrides.length + 1);
        override.metricName = "";
        override.thresholds = [];
        override.colors = [
          "#299c46", // "rgba(50, 172, 45, 1)", // green
          "#e5ac0e", // "rgba(237, 129, 40, 1)", // yellow
          "#bf1b00", // "rgba(245, 54, 54, 1)", // red
          "#ffffff" // white
        ];
        override.decimals = "";
        override.enabled = true;
        override.unitFormat = "short";
        override.clickThrough = "";
        override.operatorName = "avg";
        override.scaledDecimals = null;
        override.prefix = "";
        override.suffix = "";
        override.sanitizeURLEnabled = true;
        this.metricOverrides.push(override);
    }

    removeMetricOverride(override) {
      // lodash _.without creates a new array, need to reassign to the panel where it will be saved
      this.metricOverrides = _.without(this.metricOverrides, override);
      // fix the labels
      for (let index = 0; index < this.metricOverrides.length; index++) {
        this.metricOverrides[index].label = "OVERRIDE " + (index + 1);
      }
      // reassign reference in panel
      this.$scope.ctrl.panel.savedOverrides = this.metricOverrides;
      this.$scope.ctrl.refresh();
    }

    toggleHide(override) {
      //console.log("override enabled =  " + override.enabled);
      override.enabled = !override.enabled;
      this.$scope.ctrl.refresh();
    }

    matchOverride(pattern) : number {
        for (let index = 0; index < this.metricOverrides.length; index++) {
            let anOverride = this.metricOverrides[index];
            var regex = kbn.stringToJsRegex(anOverride.metricName);
            var matches = pattern.match(regex);
            if (matches && matches.length > 0 && anOverride.enabled ) {
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
          var result = getThresholdLevelForValue(
            anOverride.thresholds,
            dataValue,
            this.$scope.ctrl.panel.polystat.polygonGlobalFillColor);
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
            let url = this.templateSrv.replaceWithText(anOverride.clickThrough);
            // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
            url = ClickThroughTransformer.tranformSingleMetric(index, url, data);
            url = ClickThroughTransformer.tranformNthMetric(url, data);
            data[index].clickThrough = url;
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
      //console.log("setThresholdColor: color set to " + threshold.color);
      threshold.color = RGBToHex(threshold.color);
      //console.log("setThresholdColor: parsed color set to " + threshold.color);
      this.$scope.ctrl.refresh();
    }

    validateThresholdColor(threshold) {
      console.log("Validate color " + threshold.color);
      this.$scope.ctrl.refresh();
    }

    updateThresholdColor(override, threshold) {
      // threshold.state determines the color used
      //console.log("threshold state = " + threshold.state);
      //console.log("override color[0]: " + override.colors[0]);
      //console.log("override color[1]: " + override.colors[1]);
      //console.log("override color[2]: " + override.colors[2]);
      threshold.color = override.colors[threshold.state];
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

    setUnitFormat(override, subItem) {
        override.unitFormat = subItem.value;
    }

}
