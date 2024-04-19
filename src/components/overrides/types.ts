import { PolystatThreshold } from 'components/thresholds/types';

export interface OverrideItemProps {
  override: OverrideItemType;
  ID: string;
  enabled: boolean;
  setter: any;
  remover: any;
  moveUp: any;
  moveDown: any;
  createDuplicate: any;
  context: any;
}

export interface OverrideItemType {
  label: string;
  metricName: string;
  alias: string;
  thresholds: PolystatThreshold[];
  colors: string[];
  unitFormat: string;
  decimals: string;
  scaledDecimals: number | null;
  enabled: boolean;
  operatorName: string; // mean/min/max etc
  prefix: string;
  suffix: string;
  clickThrough: string | '';
  clickThroughSanitize: boolean;
  clickThroughOpenNewTab: boolean;
  clickThroughCustomTargetEnabled: boolean;
  clickThroughCustomTarget: string;
  showTimestampEnabled: boolean;
  showTimestampFormat: string;
  showTimestampYOffset: number;
  order: number;
}

export interface OverrideItemTracker {
  override: OverrideItemType;
  order: number;
  ID: string;
}
