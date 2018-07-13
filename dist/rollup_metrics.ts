/**
 *
 */

 export class Rollup {
    name: string;
    thresholds: [any];
    valueMaps: [any];

    constructor(metricName, thresholds, valueMaps) {
        this.name = metricName;
        this.thresholds = thresholds;
        this.valueMaps = valueMaps;
    }
 }

export class RollupMetrics {

    rollups : Map < string, Rollup[] >;

    constructor() {
        this.rollups = new Map();
    }

    AddRollup(rollupName, metricName, thresholds, valueMaps) {
        let metrics = [];
        if (this.rollups.has(rollupName)) {
            metrics = this.rollups.get(rollupName);
        }
        metrics.push(new Rollup(metricName, thresholds, valueMaps));
        this.rollups.set(rollupName, metrics);
    }

    DeleteRollup(rollupName) {
        if (this.rollups.has(rollupName)) {
            this.rollups.delete(rollupName);
        }
    }

    UpdateRollup(rollupName, metricName, thresholds, valueMaps) {
        if (this.rollups.has(rollupName)) {
            console.log(metricName + thresholds + valueMaps);
            //this.rollups.set(rollupName, new Rollup(metricName, thresholds, valueMaps));
        }
    }

    EvaluateRollup(rollupName): number {
        let status = 0;
        if (this.rollups.has(rollupName)) {
            status = 1;
        }
        return status;
    }
}
