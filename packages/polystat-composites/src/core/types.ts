import { ValueMapping } from '@grafana/data';

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
  clickThrough: string;
  clickThroughSanitize: boolean;
  clickThroughOpenNewTab: boolean;
  clickThroughCustomTargetEnabled: boolean;
  clickThroughCustomTarget: string;
}

export interface CompositeDataModel {
  displayMode?: string;
  thresholdLevel?: number;
  value: number;
  valueFormatted: string;
  valueRounded: number;
  stats: unknown;
  name: string;
  displayName: string;
  timestamp: number;
  prefix: string;
  suffix: string;
  color: string;
  clickThrough: string;
  operatorName: string;
  newTabEnabled: boolean;
  customClickthroughTargetEnabled: boolean;
  customClickthroughTarget: string;
  sanitizedURL: string;
  sanitizeURLEnabled: boolean;
  showName: boolean;
  showValue: boolean;
  showTimestamp: boolean;
  timestampFormatted: string;
  isComposite: boolean;
  members: CompositeDataModel[];
  triggerCache?: unknown;
  mappings?: ValueMapping[];
}
