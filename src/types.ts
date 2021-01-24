export interface PolystatThreshold {
  color: string;
  state: number;
  value: number;
}

export class MetricOverride {
  label: string;
  metricName: string;
  thresholds: PolystatThreshold[];
  colors: string[];
  unitFormat: string;
  decimals: string;
  scaledDecimals: number;
  enabled: boolean;
  operatorName: string; // avg/min/max etc
  prefix: string;
  suffix: string;
  clickThrough: string;
  newTabEnabled: boolean;
  sanitizeURLEnabled: boolean;
  sanitizedURL: string;
}

export interface PolystatConfigs {
  animationSpeed: number;
  columns: any;
  columnAutoSize: boolean;
  displayLimit: number;
  defaultClickThrough: '';
  defaultClickThroughNewTab: boolean;
  defaultClickThroughSanitize: boolean;
  fontAutoScale: boolean;
  fontSize: number;
  fontType: string;
  globalUnitFormat: string;
  globalDecimals: number;
  globalDisplayMode: string;
  globalOperatorName: string;
  globalDisplayTextTriggeredEmpty: string;
  globalThresholds?: PolystatThreshold[];
  gradientEnabled: boolean;
  hexagonSortByDirection: string;
  hexagonSortByField: string;
  maxMetrics: number;
  polygonBorderSize: number;
  polygonBorderColor: string;
  polygonGlobalFillColor: string;
  radius: any;
  radiusAutoSize: boolean;
  rows: any;
  rowAutoSize: boolean;
  shape: string;
  tooltipDisplayMode: string;
  tooltipDisplayTextTriggeredEmpty: string;
  tooltipFontSize: number;
  tooltipFontType: string;
  tooltipPrimarySortDirection: string;
  tooltipPrimarySortField: string;
  tooltipSecondarySortDirection: string;
  tooltipSecondarySortField: string;
  tooltipTimestampEnabled: boolean;
  tooltipEnabled: boolean;
  valueEnabled: boolean;
}

export enum PolygonShapes {
  HEXAGON_POINTED_TOP = 'hexagon_pointed_top',
  CIRCLE = 'circle',
  SQUARE = 'square',
}

export interface PolystatDiameters {
  diameterX: number;
  diameterY: number;
}
