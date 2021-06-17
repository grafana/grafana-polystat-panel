import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import { getThresholdLevelForValue, getValueByStatName } from './threshold_processor';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { getMappedValue, stringToJsRegex } from '@grafana/data';
import { convertOldAngularValueMapping } from '@grafana/ui';
import { MetricOverride, PolystatThreshold, PolystatConfigs } from 'types';
import { PolystatModel } from './polystatmodel';

export class MetricOverridesManager {
  metricOverrides: MetricOverride[];
  $scope: any;
  $sanitize: any;
  templateSrv: any;
  suggestMetricNames: any;
  activeOverrideIndex: number;
  customSplitDelimiter: string;

  constructor($scope, templateSrv, $sanitize, metricOverrides: MetricOverride[]) {
    this.$scope = $scope;
    this.$sanitize = $sanitize;
    this.templateSrv = templateSrv;
    // note: this delimiter appears to not work when referenced this way
    // TODO: use this as a constant (test)
    this.customSplitDelimiter = '#️⃣🔠🆗🆗🔠#️⃣';
    this.activeOverrideIndex = 0;
    // typeahead requires this form
    this.suggestMetricNames = () => {
      return _.map(this.$scope.ctrl.series, (series) => {
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
      '#4040a0', // blue
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
    // console.log("metricNameChanged: '" + override.metricName + "'");
    this.$scope.ctrl.refresh();
  }

  toggleHide(override: MetricOverride) {
    override.enabled = !override.enabled;
    this.$scope.ctrl.refresh();
  }

  matchOverride(pattern: string): MetricOverride {
    const resolvedOverrides = this.resolveOverrideTemplates();
    for (let index = 0; index < resolvedOverrides.length; index++) {
      const anOverride = resolvedOverrides[index];
      // TODO: might be needed
      //const escaped = escapeStringForRegex(anOverride.metricName)
      //const regex = stringToJsRegex(escaped);
      const regex = stringToJsRegex(anOverride.metricName);
      const matches = pattern.match(regex);
      if (matches && matches.length > 0 && anOverride.enabled) {
        return resolvedOverrides[index];
      }
    }
    return undefined;
  }

  resolveOverrideTemplates(): any[] {
    const ret: any[] = [];
    const variableRegex = /\$(\w+)|\[\[([\s\S]+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::(\w+))?}/g;
    this.metricOverrides.forEach((override) => {
      // Resolve templates in series names
      const matchResult = override.metricName.match(variableRegex);
      if (matchResult && matchResult.length > 0) {
        matchResult.forEach((template) => {
          const resolvedSeriesNames = this.templateSrv
            .replace(template, this.templateSrv.ScopedVars, this.customFormatter)
            .split('#️⃣🔠🆗🆗🔠#️⃣');
          //const resolvedSeriesNames = this.templateSrv
          //  .replace(template, this.templateSrv.ScopedVars, 'raw');
          resolvedSeriesNames.forEach((seriesName) => {
            const newName = override.metricName.replace(template, seriesName);
            ret.push({
              ...override,
              metricName: newName,
            });
          });
        });
      } else {
        // does not match template, but can match a simple regex
        ret.push(override);
      }
    });

    return ret;
  }

  customFormatter(value: any) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return value.join('#️⃣🔠🆗🆗🔠#️⃣');
    }
    return value;
  }

  applyOverrides(data: PolystatModel[]) {
    const config: PolystatConfigs = this.$scope.ctrl.panel.polystat;
    for (let index = 0; index < data.length; index++) {
      const anOverride = this.matchOverride(data[index].name);
      if (anOverride) {
        const aSeries = data[index];
        // set the operators
        aSeries.operatorName = anOverride.operatorName;
        const dataValue = getValueByStatName(aSeries.operatorName, aSeries);

        // Use defaults or the specific threshold
        const thresholds =
          anOverride.thresholds && anOverride.thresholds.length ? anOverride.thresholds : config.globalThresholds;

        const result = getThresholdLevelForValue(thresholds, dataValue, config.polygonGlobalFillColor);
        // set value to what was returned
        data[index].value = dataValue;
        data[index].color = result.color;
        data[index].thresholdLevel = result.thresholdLevel;
        // format it
        const mappings = convertOldAngularValueMapping(this.$scope.ctrl.panel);
        const mappedValue = getMappedValue(mappings, data[index].value.toString());
        if (mappedValue && mappedValue.text !== '') {
          data[index].valueFormatted = mappedValue.text;
        } else {
          const formatFunc = kbn.valueFormats[anOverride.unitFormat];
          if (formatFunc) {
            // put the value in quotes to escape "most" special characters
            data[index].valueFormatted = formatFunc(data[index].value, anOverride.decimals, anOverride.scaledDecimals);
            data[index].valueRounded = kbn.roundValue(data[index].value, anOverride.decimals);
          }
        }
        // copy the threshold data into the object
        data[index].prefix = anOverride.prefix;
        data[index].suffix = anOverride.suffix;
        // set the url, replace template vars
        if (anOverride.clickThrough && anOverride.clickThrough.length > 0) {
          let url = this.templateSrv.replace(anOverride.clickThrough, 'text');
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
        const result = getThresholdLevelForValue(
          config.globalThresholds,
          data[index].value,
          config.polygonGlobalFillColor
        );
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
