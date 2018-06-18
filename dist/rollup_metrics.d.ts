export declare class Rollup {
    name: string;
    thresholds: [any];
    valueMaps: [any];
    constructor(metricName: any, thresholds: any, valueMaps: any);
}
export declare class RollupMetrics {
    rollups: Map<string, Rollup[]>;
    constructor();
    AddRollup(rollupName: any, metricName: any, thresholds: any, valueMaps: any): void;
    DeleteRollup(rollupName: any): void;
    UpdateRollup(rollupName: any, metricName: any, thresholds: any, valueMaps: any): void;
    EvaluateRollup(rollupName: any): number;
}
