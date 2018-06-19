export declare class PolystatModel {
    thresholdLevel: number;
    value: number;
    valueFormatted: number;
    name: string;
    timestamp: number;
    prefix: string;
    suffix: string;
    seriesRaw: [any];
    color: string;
    clickThrough: string;
    sanitizedURL: string;
    sanitizeURLEnabled: boolean;
    showName: boolean;
    showValue: boolean;
    members: Array<PolystatModel>;
    constructor(aSeries: any);
    shallowClone(): PolystatModel;
}
