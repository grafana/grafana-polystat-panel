import { SelectableValue } from '@grafana/data';

export interface CompositeEditorOptions {
  compositeName: string;
  displayName: string;
  members: CompositeMember[];
  enabled: boolean;
  hideMembers: boolean;
  showName: boolean;
  showValue: boolean;
  animateMode: string;
  thresholdLevel: number;
  clickThrough: string;
  newTabEnabled: boolean;
  sanitizeURLEnabled: boolean;
  sanitizedURL: string;
  label: string;
  isTemplated: boolean;
  templatedName: string;
}

export interface CompositeMember {}

export const DisplayModes: SelectableValue[] = [
  { value: 'all', label: 'Show All' },
  { value: 'triggered', label: 'Show Triggered' },
];

export interface CompositeMetric {
  seriesMatch: SelectableValue;
  compositeMatch?: CompositeItemType[];
  alias?: string;
  ID?: string;
  order: number;
}

export interface CompositeItemType {
  name: string;
  order: number;
  templatedName: string;
  isTemplated: boolean;
  displayMode: SelectableValue;
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
}
