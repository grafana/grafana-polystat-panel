export declare class MetricOverride {
    label: string;
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
    activeOverrideIndex: number;
    constructor($scope: any, templateSrv: any, $sanitize: any, metricOverrides: Array<MetricOverride>);
    addMetricOverride(): void;
    removeMetricOverride(override: any): void;
    toggleHide(override: any): void;
    matchOverride(pattern: any): number;
    applyOverrides(data: any): void;
    addThreshold(override: any): void;
    setThresholdColor(threshold: any): void;
    validateThresholdColor(threshold: any): void;
    updateThresholdColor(override: any, threshold: any): void;
    sortThresholds(override: any): void;
    removeThreshold(override: any, threshold: any): void;
    setUnitFormat(override: any, subItem: any): void;
}
