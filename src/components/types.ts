import { DataFrame } from '@grafana/data';
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
  globalFillColor: string;
  globalFontSize: number;
  globalGradientsEnabled: boolean;
  globalPolygonBorderSize: number;
  globalPolygonBorderColor: string;
  globalPolygonSize: number;
  globalRegexPattern: string;
  globalShape: PolygonShapes;
  globalShowValueEnabled: boolean;
  globalTextFontColor: string;
  globalTextFontAutoColorEnabled: boolean;
  globalThresholdsConfig: PolystatThreshold[];
  globalTooltipsEnabled: boolean;
  globalTooltipsShowTimestampEnabled: boolean;
  globalUnitFormat: string;
  layoutDisplayLimit: number;
  layoutNumColumns: number;
  layoutNumRows: number;
  processedData: PolystatModel[] | null;
  panelHeight: any;
  panelWidth: any;
  panelId: number;
  radius: number | null;
  renderTime: Date;
  sortByField: string;
  sortByDirection: number;
  overrideConfig: {
    overrides: OverrideItemType[];
  };
  compositeConfig: {
    animationSpeed: string;
    composites: CompositeItemType[];
  };
  tooltipPrimarySortDirection: string;
  tooltipPrimarySortByField: string;
  tooltipSecondarySortDirection: string;
  tooltipSecondarySortByField: string;
}

export interface PolystatModel {
  animateMode?: string;
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
  seriesRaw: DataFrame;
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

export const OperatorOptions = [
  { value: 0, label: 'Average (mean)' },
  { value: 1, label: 'Count' },
  { value: 2, label: 'Current' },
  { value: 3, label: 'Delta' },
  { value: 4, label: 'Difference' },
  { value: 5, label: 'First' },
  { value: 6, label: 'Log Min' },
  { value: 7, label: 'Max' },
  { value: 8, label: 'Min' },
  { value: 9, label: 'Name' },
  { value: 10, label: 'Time of Last Point' },
  { value: 11, label: 'Time Step' },
  { value: 12, label: 'Total' },
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
