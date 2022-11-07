import { SelectableValue } from '@grafana/data';
import { CompositeItemType } from 'components/composites/types';
import { OverrideItemType } from './overrides/types';
import { PolystatThreshold } from './thresholds/types';

export interface PolystatOptions {
  autoSizeColumns: boolean;
  autoSizeRows: boolean;
  autoSizePolygons: boolean;
  ellipseCharacters: number;
  ellipseEnabled: boolean;
  globalAutoScaleFonts: boolean;
  globalClickthrough: string;
  globalClickthroughNewTabEnabled: boolean;
  globalClickthroughSanitizedEnabled: boolean;
  globalDecimals: number;
  globalDisplayMode: string;
  globalDisplayTextTriggeredEmpty: string;
  globalFillColor: string;
  globalFontSize: number;
  globalGradientsEnabled: boolean;
  globalOperator: string;
  globalPolygonBorderSize: number;
  globalPolygonBorderColor: string;
  globalPolygonSize: number;
  globalRegexPattern: string;
  globalShape: PolygonShapes;
  globalShowValueEnabled: boolean;
  globalTextFontColor: string;
  globalTextFontAutoColor: string;
  globalTextFontAutoColorEnabled: boolean;
  globalThresholdsConfig: PolystatThreshold[];
  globalTooltipsEnabled: boolean;
  globalTooltipsShowTimestampEnabled: boolean;
  globalUnitFormat: string;
  layoutDisplayLimit: number;
  layoutNumColumns: number;
  layoutNumRows: number;
  processedData?: PolystatModel[] | null;
  panelHeight: any;
  panelWidth: any;
  panelId: number;
  radius: number | null;
  renderTime?: Date;
  sortByField: string;
  sortByDirection: number;
  overrideConfig: {
    overrides: OverrideItemType[];
  };
  compositeConfig: {
    animationSpeed: string;
    composites: CompositeItemType[];
    enabled: boolean;
  };
  tooltipPrimarySortDirection: number;
  tooltipPrimarySortByField: string;
  tooltipSecondarySortDirection: number;
  tooltipSecondarySortByField: string;
  tooltipDisplayMode: string;
  tooltipDisplayTextTriggeredEmpty: string;
}

export interface PolystatModel {
  displayMode?: string;
  thresholdLevel?: number; // 0 = ok, 1 = warn, 2 = crit, 3 = unknown (same as sensu)
  value: number;
  valueFormatted: string;
  valueRounded: number;
  stats: any;
  name: string;
  displayName: string; // Used for composites
  timestamp: number;
  prefix: string;
  suffix: string;
  color: string;
  clickThrough: string;
  operatorName: string;
  newTabEnabled: boolean;
  sanitizedURL: string;
  sanitizeURLEnabled: boolean;
  showName: boolean;
  showValue: boolean;
  isComposite: boolean;
  members: PolystatModel[];
  triggerCache?: any; // holds animation frame info
}

export enum PolygonShapes {
  HEXAGON_POINTED_TOP = 'hexagon_pointed_top',
  CIRCLE = 'circle',
  SQUARE = 'square',
}

export const PolygonNamedShapes = [
  { value: 'hexagon_pointed_top', label: 'Hexagon Pointed Top' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
];

export interface PolystatDiameters {
  diameterX: number;
  diameterY: number;
}

export const OperatorOptions: SelectableValue[] = [
  { value: 'mean', label: 'Mean (avg)' },
  { value: 'sum', label: 'Sum' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'last', label: 'Last' },
  { value: 'lastNotNull', label: 'Last Not Null' },
  { value: 'first', label: 'First' },
  { value: 'firstNotNull', label: 'First Not Null' },
  { value: 'count', label: 'Count' },
  { value: 'allIsNull', label: 'All Is Null (boolean)' },
  { value: 'allIsZero', label: 'All Is Zero (boolean)' },
  { value: 'delta', label: 'Delta' },
  { value: 'diff', label: 'Difference' },
  { value: 'diffperc', label: 'Difference (Percent)' },
  { value: 'last_time', label: 'Time of Last Point' },
  { value: 'logmin', label: 'Log Min' },
  { value: 'name', label: 'Name' },
  { value: 'nonNullCount', label: 'Non Null Count' },
  { value: 'previousDeltaUp', label: 'Previous Delta Up' },
  { value: 'range', label: 'Range' },
  { value: 'step', label: 'Step' },
];

export const SortOptions = [
  { value: 0, label: 'Disabled' },
  { value: 1, label: 'Alphabetical (asc)' },
  { value: 2, label: 'Alphabetical (desc)' },
  { value: 3, label: 'Numerical (asc)' },
  { value: 4, label: 'Numerical (desc)' },
  { value: 5, label: 'Alphabetical (case-insensitive, asc)' },
  { value: 6, label: 'Alphabetical (case-insensitive, desc)' },
];

export const SortOptionOperators = ['disabled', 'asc', 'desc', 'asc', 'desc', 'iasc', 'idesc'];

export const SortByFieldOptions = [
  { value: 'name', label: 'Name' },
  { value: 'thresholdLevel', label: 'Threshold Level' },
  { value: 'value', label: 'Value' },
];

export const DisplayModes = [
  { value: 'all', label: 'Show All' },
  { value: 'triggered', label: 'Show Triggered' },
];

export const AnimationModes = [
  { value: 'all', text: 'Show All' },
  { value: 'triggered', text: 'Show Triggered' },
];
