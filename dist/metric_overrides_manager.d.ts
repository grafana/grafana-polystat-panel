export declare class MetricOverride {
    metricName: string;
    thresholds: Array<number>;
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
    getValueByStatName(settings: any, data: any): any;
    getColorForValue(index: any, value: any): string;
    getThresholdLevelForValue(index: any, value: number): number;
    invertColorOrder(override: any): void;
    setUnitFormat(override: any, subItem: any): void;
    moveMetricOverrideUp(override: any): void;
    moveMetricOverrideDown(override: any): void;
    arraymove(arr: any, fromIndex: any, toIndex: any): void;
}
