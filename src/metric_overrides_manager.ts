import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import { getThresholdLevelForValue, getValueByStatName } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { stringToJsRegex } from '@grafana/data';
import { MetricOverride, PolystatThreshold, PolystatConfigs } from 'types';

export class MetricOverridesManager {
  metricOverrides: MetricOverride[];
  $scope: any;
  $sanitize: any;
  templateSrv: any;
  suggestMetricNames: any;
  activeOverrideIndex: number;

  constructor($scope, templateSrv, $sanitize, metricOverrides: MetricOverride[]) {
    this.$scope = $scope;
    this.$sanitize = $sanitize;
    this.templateSrv = templateSrv;
    this.activeOverrideIndex = 0;
    // typeahead requires this form
    this.suggestMetricNames = () => {
      return _.map(this.$scope.ctrl.series, series => {
        return series.alias;
      });
    };
    this.metricOverrides = metricOverrides;
    // upgrade if no label present
    for (let index = 0; index < this.metricOverrides.length; index++) {
      if (typeof this.metricOverrides[index].label === 'undefined') {
        this.metricOverrides[index].label = 'OVERRIDE ' + (index + 1);
      }
    }
  }

  addMetricOverride() {
    const override = new MetricOverride();
    override.label = 'OVERRIDE ' + (this.metricOverrides.length + 1);
    override.metricName = '';
    override.thresholds = [];
    override.colors = [
      '#299c46', // "rgba(50, 172, 45, 1)", // green
      '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
      '#bf1b00', // "rgba(245, 54, 54, 1)", // red
      '#ffffff', // white
    ];
    override.decimals = '';
    override.enabled = true;
    override.unitFormat = 'short';
    override.clickThrough = '';
    override.operatorName = 'avg';
    override.scaledDecimals = null;
    override.prefix = '';
    override.suffix = '';
    override.newTabEnabled = true;
    override.sanitizeURLEnabled = true;
    this.metricOverrides.push(override);
  }

  removeMetricOverride(override: MetricOverride) {
    // lodash _.without creates a new array, need to reassign to the panel where it will be saved
    this.metricOverrides = _.without(this.metricOverrides, override);
    // fix the labels
    for (let index = 0; index < this.metricOverrides.length; index++) {
      this.metricOverrides[index].label = 'OVERRIDE ' + (index + 1);
    }
    // reassign reference in panel
    this.$scope.ctrl.panel.savedOverrides = this.metricOverrides;
    this.$scope.ctrl.refresh();
  }

  metricNameChanged(override: MetricOverride) {
    // TODO: validate item is a valid regex
    console.log("metricNameChanged: '" + override.metricName + "'");
    this.$scope.ctrl.refresh();
  }

  toggleHide(override: MetricOverride) {
    //console.log("override enabled =  " + override.enabled);
    override.enabled = !override.enabled;
    this.$scope.ctrl.refresh();
  }

  matchOverride(pattern: string): number {
    for (let index = 0; index < this.metricOverrides.length; index++) {
      const anOverride = this.metricOverrides[index];
      const regex = stringToJsRegex(anOverride.metricName);
      const matches = pattern.match(regex);
      if (matches && matches.length > 0 && anOverride.enabled) {
        return index;
      }
    }
    return -1;
  }

  applyOverrides(data) {
    const config: PolystatConfigs = this.$scope.ctrl.panel.polystat;
    for (let index = 0; index < data.length; index++) {
      const matchIndex = this.matchOverride(data[index].name);
      if (matchIndex >= 0) {
        const aSeries = data[index];
        const anOverride = this.metricOverrides[matchIndex];
        // set the operators
        aSeries.operatorName = anOverride.operatorName;
        const dataValue = getValueByStatName(aSeries.operatorName, aSeries);
        //console.log("series2 operator: " + series2.operatorName);
        //console.log("series2 value: " + series2Value);

        // Use defaults or the specific threshold
        const thresholds = anOverride.thresholds && anOverride.thresholds.length ? anOverride.thresholds : config.globalThresholds;

        const result = getThresholdLevelForValue(thresholds, dataValue, config.polygonGlobalFillColor);
        // set value to what was returned
        data[index].value = dataValue;
        data[index].color = result.color;
        //console.log("applyOverrides: value = " + data[index].value + " color " + data[index].color);
        data[index].thresholdLevel = result.thresholdLevel;
        // format it
        const formatFunc = kbn.valueFormats[anOverride.unitFormat];
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
        if (anOverride.clickThrough && anOverride.clickThrough.length > 0) {
          let url = this.templateSrv.replaceWithText(anOverride.clickThrough);
          // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
          url = ClickThroughTransformer.tranformSingleMetric(index, url, data);
          url = ClickThroughTransformer.tranformNthMetric(url, data);
          data[index].clickThrough = url;
          data[index].newTabEnabled = anOverride.newTabEnabled;
          data[index].sanitizeURLEnabled = anOverride.sanitizeURLEnabled;
          if (anOverride.sanitizeURLEnabled) {
            data[index].sanitizedURL = this.$sanitize(data[index].clickThrough);
          }
        }
      } else if (config.globalThresholds && config.globalThresholds.length) {
        const result = getThresholdLevelForValue(config.globalThresholds, data[index].value, config.polygonGlobalFillColor);
        // set value to what was returned
        data[index].color = result.color;
        data[index].thresholdLevel = result.thresholdLevel;
      }
    }
  }

  onSetThresholds = (thresholds: PolystatThreshold[]) => {
    console.log('OVERRIDE (threshold)', thresholds);
  };

  setUnitFormat(override, subItem) {
    override.unitFormat = subItem.value;
  }
}
