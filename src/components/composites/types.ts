import { SelectableValue } from '@grafana/data';

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
  seriesName?: string;
  seriesNameEscaped?: string;
}

export interface CompositeItemType {
  name: string;
  label: string;
  order: number;
  isTemplated: boolean;
  displayMode: string;
  enabled: boolean;
  showName: boolean;
  showValue: boolean;
  showComposite: boolean;
  showMembers: boolean;
  showTimestampEnabled: boolean;
  showTimestampFormat: string;
  showTimestampYOffset: number;
  metrics: CompositeMetric[];
  clickThrough: string | '';
  clickThroughSanitize: boolean;
  clickThroughOpenNewTab: boolean;
  clickThroughCustomTargetEnabled: boolean;
  clickThroughCustomTarget: string;
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
  context: any;
}

export interface CompositeMetricItemProps {
  metric: CompositeMetric;
  index: number;
  disabled: boolean;
  removeMetric: any;
  updateMetric: any;
  updateMetricAlias: any;
  context: any;
}
