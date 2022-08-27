import { SelectableValue } from '@grafana/data';

export interface CompositeMember {}

export const DisplayModes: SelectableValue[] = [
  { value: 'all', label: 'Show All' },
  { value: 'triggered', label: 'Show Triggered' },
];

export interface CompositeMetric {
  seriesMatch: string;
  compositeMatch?: CompositeItemType[];
  alias?: string;
  ID?: string;
  order: number;
}

export interface CompositeItemType {
  name: string;
  label: string;
  order: number;
  templatedName: string;
  isTemplated: boolean;
  displayMode: string;
  enabled: boolean;
  showName: boolean;
  showValue: boolean;
  showComposite: boolean;
  showMembers: boolean;
  metrics: CompositeMetric[];
  clickThrough: string | '';
  clickThroughSanitize: boolean;
  clickThroughOpenNewTab: boolean;
}

export interface CompositeItemTracker {
  composite: CompositeItemType;
  order: number;
  ID: string;
}

export interface CompositeItemProps {
  composite: CompositeItemType;
  ID: string;
  enabled: boolean;
  setter: any;
  remover: any;
  moveUp: any;
  moveDown: any;
  createDuplicate: any;
}

export interface CompositeMetricItemProps {
  metric: CompositeMetric;
  index: number;
  disabled: boolean;
  removeMetric: any;
  updateMetric: any;
  updateMetricAlias: any;
}
