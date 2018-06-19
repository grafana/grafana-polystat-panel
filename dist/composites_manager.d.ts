export declare class MetricComposite {
    compositeName: string;
    members: Array<any>;
    enabled: boolean;
    hideMembers: boolean;
    showName: boolean;
    showValue: boolean;
    animateMode: number;
    thresholdLevel: number;
    clickThrough: string;
    sanitizeURLEnabled: boolean;
    sanitizedURL: string;
}
export declare class CompositesManager {
    $scope: any;
    templateSrv: any;
    $sanitize: any;
    suggestMetricNames: any;
    metricComposites: Array<MetricComposite>;
    constructor($scope: any, templateSrv: any, $sanitize: any, savedComposites: any);
    addMetricComposite(): void;
    removeMetricComposite(item: any): void;
    addMetricToComposite(composite: any): void;
    removeMetricFromComposite(composite: any, metric: any): void;
    matchComposite(pattern: any): number;
    applyComposites(data: any): any;
    getWorstSeries(series1: any, series2: any): any;
    getThresholdLevel(series: any): number;
    metricNameChanged(item: any): void;
    moveMetricCompositeUp(item: any): void;
    moveMetricCompositeDown(item: any): void;
    arraymove(arr: any, fromIndex: any, toIndex: any): void;
}
