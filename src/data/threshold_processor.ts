import { SelectableValue } from '@grafana/data';
import { PolystatThreshold } from '../components/thresholds/types';
import { PolystatModel } from '../components/types';

/*

This supports ranged states

Thresholds are expected to be sorted by ascending value, where
  T0 = lowest decimal value, any state
  TN = highest decimal value, any state

Initial state is set to "ok"

A comparison is made using "greater than or equal to" against the value
  If value >= thresholdValue state = X

Comparisons are made in reverse order, using the range between the Nth (inclusive) threshold and N+1 (exclusive)
  InclusiveValue = T(n).value
  ExclusiveValue = T(n+1).value

When there is no n+1 threshold, the highest value threshold T(n), a simple inclusive >= comparison is made

  Example 1: (typical linear)
    T0 - 5, ok
    T1 - 10, warning
    T2 - 20, critical

  Value >= 20 (Value >= T2)
  10 <= Value < 20  (T1 <= Value < T2)
  5 <= Value < 10   (T0 <= Value < T1)

  Example 2: (reverse linear)
    T0 - 50, critical
    T1 - 90, warning
    T2 - 100, ok

  Value >= 100
  90 <= value < 100
  50 <= value < 90

  Example 3: (bounded)
    T0 - 50, critical
    T1 - 60, warning
    T2 - 70, ok
    T3 - 80, warning
    T4 - 90, critical

    Value >= 90
    80 <= Value < 90
    70 <= Value < 80
    60 <= Value < 70
    50 <= Value < 60

The "worst" state is returned after checking every threshold range

*/
function getWorstSeries(series1: PolystatModel, series2: PolystatModel): any {
  let worstSeries = series1;
  const series1ThresholdLevel = series1.thresholdLevel;
  const series2ThresholdLevel = series2.thresholdLevel;

  // State 3 is Unknown and is not be worse than CRITICAL (state 2)
  if (series2ThresholdLevel > series1ThresholdLevel) {
    // series2 has higher threshold violation
    worstSeries = series2;
  }
  if (series1ThresholdLevel === 3) {
    // series1 is in state unknown, check if series2 is in state 1 or 2
    switch (series2ThresholdLevel) {
      case 1:
        worstSeries = series2;
        break;
      case 2:
        worstSeries = series2;
        break;
    }
  }
  return worstSeries;
}

function getThresholdLevelForValue(
  thresholds: PolystatThreshold[],
  value: number,
  defaultColor: string
): { thresholdLevel: number; color: string } {
  const colorGrey = '#808080'; // "grey"
  let currentColor = defaultColor;
  if (value === null) {
    return { thresholdLevel: 3, color: colorGrey }; // No Data
  }
  // assume UNKNOWN state
  let currentState = -1;
  // skip evaluation when there are no thresholds
  if (typeof thresholds === 'undefined') {
    return { thresholdLevel: currentState, color: defaultColor };
  }
  // test "Nth" threshold
  const thresholdCount = thresholds.length;
  if (thresholdCount === 0) {
    return { thresholdLevel: currentState, color: defaultColor };
  }
  const aThreshold = thresholds[thresholdCount - 1];
  if (value >= aThreshold.value) {
    currentState = aThreshold.state.value;
    currentColor = aThreshold.color;
  }
  // if there's one threshold, just return the result
  if (thresholds.length === 1) {
    return { thresholdLevel: currentState, color: currentColor };
  }
  // now test in reverse
  for (let i = thresholdCount - 1; i > 0; i--) {
    const upperThreshold = thresholds[i];
    const lowerThreshold = thresholds[i - 1];
    if (lowerThreshold.value <= value && value < upperThreshold.value) {
      if (currentState < lowerThreshold.state.value) {
        currentState = lowerThreshold.state.value;
        currentColor = lowerThreshold.color;
      }
    }
  }
  // last check, if currentState is not set, and there is a lower threshold, use that value (inclusive range up to T1)
  if (currentState === -1) {
    currentState = thresholds[0].state.value;
    currentColor = thresholds[0].color;
  }
  return { thresholdLevel: currentState, color: currentColor };
}

function getValueByStatName(operatorName: SelectableValue, data: any): number {
  let value = data.stats.avg;
  switch (operatorName.value) {
    case 'avg':
      value = data.stats.mean;
      break;
    case 'count':
      value = data.stats.count;
      break;
    case 'current':
      value = data.stats.last;
      break;
    case 'delta':
      value = data.stats.delta;
      break;
    case 'diff':
      value = data.stats.diff;
      break;
    case 'first':
      value = data.stats.first;
      break;
    case 'logmin':
      value = data.stats.logmin;
      break;
    case 'max':
      value = data.stats.max;
      break;
    case 'min':
      value = data.stats.min;
      break;
    case 'name':
      value = data.metricName;
      break;
    case 'time_step':
      value = data.stats.timeStep;
      break;
    case 'last_time':
      value = data.timestamp;
      break;
    case 'total':
      value = data.stats.total;
      break;
    default:
      value = data.stats.avg;
      break;
  }
  return value;
}

export { getWorstSeries, getThresholdLevelForValue, getValueByStatName };
