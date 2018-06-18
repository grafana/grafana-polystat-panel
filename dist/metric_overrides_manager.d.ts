export declare class MetricOverride {
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
export declare class MetricOverridesManager {
    metricOverrides: Array<MetricOverride>;
    $scope: any;
    templateSrv: any;
    suggestMetricNames: any;
    constructor($scope: any, templateSrv: any, savedOverrides: any);
    addMetricOverride(): void;
    removeMetricOverride(override: any): void;
    matchOverride(pattern: any): number;
    applyOverrides(data: any): void;
    getColorForValue(index: any, value: any): string;
    invertColorOrder(override: any): void;
    setUnitFormat(override: any, subItem: any): void;
    moveMetricOverrideUp(override: any): void;
    moveMetricOverrideDown(override: any): void;
    arraymove(arr: any, fromIndex: any, toIndex: any): void;
}
