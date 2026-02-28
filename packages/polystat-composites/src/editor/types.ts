import { SelectableValue } from '@grafana/data';
import { CompositeItemType, CompositeMetric } from '../core/types';

export const DisplayModes: SelectableValue[] = [
  { value: 'all', label: 'Show All' },
  { value: 'triggered', label: 'Show Triggered' },
];

export type { CompositeItemType, CompositeMetric };

export interface CompositeItemTracker {
  composite: CompositeItemType;
  order: number;
  ID: string;
}

export interface CompositeItemProps {
  composite: CompositeItemType;
  ID: string;
  enabled: boolean;
  setter?: (order: number, value: CompositeItemType) => void;
  remover?: (compositeIndex: number) => void;
  moveUp?: (index: number) => void;
  moveDown?: (index: number) => void;
  createDuplicate?: (index: number) => void;
  context: any;
}

export interface CompositeMetricItemProps {
  metric: CompositeMetric;
  index: number;
  disabled: boolean;
  removeMetric?: (index: number) => void;
  updateMetric?: (index: number, value: string) => void;
  updateMetricAlias?: (index: number, alias: string) => void;
  context: any;
}
