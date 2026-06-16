import { SelectableValue } from '@grafana/data';

export interface PolystatThreshold {
  color: string;
  state: number;
  value: number;
}

export interface ThresholdItemTracker {
  threshold: PolystatThreshold;
  order: number;
  ID: string;
}

export const ThresholdStates: SelectableValue[] = [
  { value: 0, label: 'ok' },
  { value: 1, label: 'warning' },
  { value: 2, label: 'critical' },
  { value: 3, label: 'custom' },
];
