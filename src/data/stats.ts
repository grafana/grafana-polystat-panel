import { FieldCalcs } from '@grafana/data';
import { PolystatModel } from '../components/types';

export function GetValueByOperator(
  metricName: string,
  data: PolystatModel | null,
  operatorName: string,
  calcs: FieldCalcs
) {
  switch (operatorName) {
    case 'name':
      return metricName;
    case 'last_time':
      if (data) {
        return data.timestamp;
      } else {
        return Date.now();
      }
    default:
      let aValue = calcs[operatorName];
      return aValue;
  }
}
