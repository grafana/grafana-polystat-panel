/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export declare class MetricOverride {
    metricName: string;
    thresholds: Array<any>;
    colors: Array<string>;
    unitFormat: string;
    decimals: string;
    scaledDecimals: number;
    enabled: boolean;
    operatorName: string;
    prefix: string;
    suffix: string;
    clickThrough: string;
    sanitizeURLEnabled: boolean;
    sanitizedURL: string;
}
export declare class MetricOverridesManager {
    metricOverrides: Array<MetricOverride>;
    $scope: any;
    $sanitize: any;
    templateSrv: any;
    suggestMetricNames: any;
    constructor($scope: any, templateSrv: any, $sanitize: any, savedOverrides: any);
    addMetricOverride(): void;
    removeMetricOverride(override: any): void;
    matchOverride(pattern: any): number;
    applyOverrides(data: any): void;
    addThreshold(override: any): void;
    setThresholdColor(threshold: any): void;
    validateThresholdColor(threshold: any): void;
    sortThresholds(override: any): void;
    removeThreshold(override: any, threshold: any): void;
    invertColorOrder(override: any): void;
    setUnitFormat(override: any, subItem: any): void;
    moveMetricOverrideUp(override: any): void;
    moveMetricOverrideDown(override: any): void;
    arraymove(arr: any, fromIndex: any, toIndex: any): void;
}
