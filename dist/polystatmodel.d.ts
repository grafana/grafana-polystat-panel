export declare class PolystatModel {
    thresholdLevel: number;
    value: number;
    valueFormatted: number;
    stats: any;
    name: string;
    timestamp: number;
    prefix: string;
    suffix: string;
    seriesRaw: [any];
    color: string;
    clickThrough: string;
    operatorName: string;
    sanitizedURL: string;
    sanitizeURLEnabled: boolean;
    showName: boolean;
    showValue: boolean;
    members: Array<PolystatModel>;
    constructor(operatorName: string, aSeries: any);
    getValueByOperator(operatorName: any, data: any): any;
    shallowClone(): PolystatModel;
}
