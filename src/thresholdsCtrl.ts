import _ from 'lodash';

import coreModule from 'grafana/app/core/core_module';
import { PolystatThreshold } from 'types';
import { RGBToHex } from 'utils';

export class ThresholdsCtrl {
  thresholdStates = [
    { value: 0, text: 'ok' },
    { value: 1, text: 'warning' },
    { value: 2, text: 'critical' },
    { value: 3, text: 'custom' },
  ];

  thresholds: PolystatThreshold[] = [];

  /** @ngInject */
  constructor(private $scope: any) {
    if ($scope.thresholds) {
      this.thresholds = [...$scope.thresholds];
    }
  }

  private sortThresholds() {
    this.thresholds = _.orderBy(this.thresholds, ['value'], ['asc']);
  }

  private doRefresh() {
    // bind the original
    this.$scope.thresholds = this.thresholds;

    const callback = this.$scope.onChange();
    console.log('callback', callback );
  }

  addThreshold() {
    this.thresholds.push({
      value: 0,
      state: 0,
      color: '#299c46',
    });
    this.sortThresholds();
    this.doRefresh();
  }

  // store user selection of color to be used for all items with the corresponding state
  setThresholdColor(threshold:PolystatThreshold) {
    console.log("setThresholdColor:", threshold);
    threshold.color = RGBToHex(threshold.color);
    //console.log("setThresholdColor: parsed color set to " + threshold.color);
    this.doRefresh();
  }

  updateThresholdColor(threshold: PolystatThreshold) {
    console.log('WHERE DO the colors come from?', threshold);
    // threshold.state determines the color used
    //console.log("threshold state = " + threshold.state);
    //console.log("override color[0]: " + override.colors[0]);
    //console.log("override color[1]: " + override.colors[1]);
    //console.log("override color[2]: " + override.colors[2]);
    //threshold.color = override.colors[threshold.state];
    //this.$scope.ctrl.refresh();
  }

  removeThreshold(threshold: PolystatThreshold) {
    this.thresholds = _.without(this.thresholds, threshold);
    this.sortThresholds();
    this.doRefresh();
  }
}

export function polyThresholds() {
  return {
    controller: ThresholdsCtrl,
    controllerAs: 'ctrl',
    restrict: 'E',  
    scope: {
      thresholds: '=',
      override: '=?',
      onChange: '&',
    },
    templateUrl: './public/plugins/grafana-polystat-panel/partials/thresholds.html',
  };
}
coreModule.directive('polyThresholds', polyThresholds);
