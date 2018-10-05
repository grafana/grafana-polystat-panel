declare function getWorstSeries(series1: any, series2: any): any;
declare function getThresholdLevelForValue(thresholds: any, value: number): {
    thresholdLevel: number;
    color: string;
};
declare function getValueByStatName(operatorName: string, data: any): number;
export { getWorstSeries, getThresholdLevelForValue, getValueByStatName };
