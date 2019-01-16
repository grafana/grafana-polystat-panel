export declare class MetricComposite {
    compositeName: string;
    members: Array<any>;
    enabled: boolean;
    hideMembers: boolean;
    showName: boolean;
    showValue: boolean;
    animateMode: string;
    thresholdLevel: number;
    clickThrough: string;
    sanitizeURLEnabled: boolean;
    sanitizedURL: string;
    label: string;
}
export declare class CompositesManager {
    $scope: any;
    templateSrv: any;
    $sanitize: any;
    suggestMetricNames: any;
    metricComposites: Array<MetricComposite>;
    subTabIndex: number;
    constructor($scope: any, templateSrv: any, $sanitize: any, savedComposites: any);
    addMetricComposite(): void;
    removeMetricComposite(item: any): void;
    addMetricToComposite(composite: any): void;
    removeMetricFromComposite(composite: any, metric: any): void;
    matchComposite(pattern: any): number;
    applyComposites(data: any): any;
    metricNameChanged(item: any): void;
    toggleHide(composite: any): void;
}
