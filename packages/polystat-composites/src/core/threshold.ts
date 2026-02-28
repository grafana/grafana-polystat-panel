import { CompositeDataModel } from './types';

export const getWorstSeries = (series1: CompositeDataModel, series2: CompositeDataModel): CompositeDataModel => {
  let worstSeries = series1;
  const series1ThresholdLevel = series1.thresholdLevel;
  const series2ThresholdLevel = series2.thresholdLevel;

  if (series1ThresholdLevel === undefined || series2ThresholdLevel === undefined) {
    return worstSeries;
  }

  if (series2ThresholdLevel > series1ThresholdLevel) {
    worstSeries = series2;
  }
  if (series1ThresholdLevel === 3) {
    switch (series2ThresholdLevel) {
      case 1:
      case 2:
        worstSeries = series2;
        break;
    }
  }
  return worstSeries;
};
