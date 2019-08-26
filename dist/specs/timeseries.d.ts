export declare class TimeSeries {
    datapoints: number[][];
    alias: string;
    target: string;
    stats: any;
    thresholds: any[];
    value: number;
    seriesName: string;
    name: string;
    operatorName: string;
    constructor(opts: {
        datapoints: number[][];
        alias: string;
        seriesName: string;
        operatorName: string;
    });
}
