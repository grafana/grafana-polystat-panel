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
    if (this.thresholds && this.thresholds.length) {
      this.$scope.thresholds = this.thresholds;
    } else {
      this.$scope.thresholds = undefined;
    }
    this.$scope.callback();
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
  setThresholdColor(threshold: PolystatThreshold) {
    threshold.color = RGBToHex(threshold.color);
    this.doRefresh();
  }

  updateThresholdColor(threshold: PolystatThreshold) {
    const colors = this.$scope.colors;
    // threshold.state determines the color used
    threshold.color = colors[threshold.state];
    this.doRefresh();
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
      colors: '=',
      override: '=?',
      callback: '&',
    },
    templateUrl: './public/plugins/grafana-polystat-panel/partials/thresholds.html',
  };
}
coreModule.directive('polyThresholds', polyThresholds);
