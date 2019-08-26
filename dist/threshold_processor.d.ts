declare function getWorstSeries(series1: any, series2: any, defaultColor: string): any;
declare function getThresholdLevelForValue(thresholds: any, value: number, defaultColor: string): {
    thresholdLevel: number;
    color: string;
};
declare function getValueByStatName(operatorName: string, data: any): number;
export { getWorstSeries, getThresholdLevelForValue, getValueByStatName };
