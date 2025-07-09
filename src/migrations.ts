import { PanelModel, convertOldAngularValueMappings, ValueMapping } from '@grafana/data';
import { config } from "@grafana/runtime";
import { satisfies, coerce } from "semver";
import { CompositeItemType, CompositeMetric } from 'components/composites/types';
import { OverrideItemType } from './components/overrides/types';
import { PolystatThreshold } from './components/thresholds/types';

import { DisplayModes, FontFamilies, PolygonShapes, PolystatOptions, ShowTimestampFormats, ShowTimestampPositions } from './components/types';
interface AngularPolystatOptions {
  animationSpeed: number;
  columnAutoSize: boolean;
  columns: string;
  defaultClickThrough: string;
  defaultClickThroughNewTab: boolean;
  defaultClickThroughSanitize: boolean;
  displayLimit: number;
  ellipseCharacters: number;
  ellipseEnabled: boolean;
  fontAutoColor: boolean;
  fontAutoScale: boolean;
  fontSize: number;
  fontType: string,
  globalDecimals: number;
  globalDisplayMode: string;
  globalDisplayTextTriggeredEmpty: string;
  globalOperatorName: string;
  globalThresholds: AngularThreshold[];
  globalUnitFormat: string;
  gradientEnabled: boolean;
  hexagonSortByDirection: number;
  hexagonSortByField: string;
  maxMetrics: number;
  polygonBorderColor: string;
  polygonBorderSize: number;
  polygonGlobalFillColor: string;
  radius: string;
  radiusAutoSize: boolean;
  regexPattern: string;
  rowAutoSize: boolean;
  rows: string;
  shape: string;
  tooltipDisplayMode: string;
  tooltipDisplayTextTriggeredEmpty: string;
  tooltipEnabled: boolean;
  tooltipFontSize: number;
  tooltipFontType: string,
  tooltipPrimarySortDirection: number;
  tooltipPrimarySortField: string;
  tooltipSecondarySortDirection: number;
  tooltipSecondarySortField: string;
  tooltipTimestampEnabled: boolean;
  valueEnabled: boolean;
}

export interface AngularThreshold {
  color: string;
  state: number;
  value: number;
}

export interface AngularOverride {
  clickThrough: string;
  colors: string[];
  decimals: number;
  enabled: true;
  label: string;
  metricName: string;
  newTabEnabled: boolean;
  operatorName: string;
  prefix: string;
  sanitizeURLEnabled: boolean;
  suffix: string;
  unitFormat: string;
  thresholds: AngularThreshold[];
}
export interface AngularSavedOverrides {
  savedOverrides: AngularOverride[];
}

export interface CompositeMembers {
  seriesName: string;
}
export interface CompositeItem {
  animateMode: string;
  clickThrough: string;
  compositeName: string;
  displayName: string;
  enabled: boolean;
  hideMembers: boolean;
  label: string;
  members: CompositeMembers[];
  newTabEnabled: boolean;
  sanitizeURLEnabled: boolean;
  sanitizedURL: string;
  showName: boolean;
  showValue: boolean;
  thresholdLevel: number;
}

export interface AngularSavedComposites {
  savedComposites: CompositeItem[];
}

/**
 * This is called when the panel is imported or reloaded
 */
export const PolystatPanelMigrationHandler = (panel: PanelModel<PolystatOptions>): Partial<PolystatOptions> => {
  // add defaults values for v2.1.15 feature

  //@ts-ignore
  if (!panel.polystat) {
    // not angular, just return the options if currently set
    if (!panel.options) {
      // This happens on the first load or when migrating from angular
      return {} as any;
    }
    //
    // have react-based settings, modifications to new config will be processed here
    //
    // ensure there is a default for new feature in v2.1.15
    if (!panel.options.globalValueFontSize) {
      panel.options.globalValueFontSize = 14;
    }
    // @ts-ignore
    if (panel.options.globalFontSize) {
      // @ts-ignore
      panel.options.globalLabelFontSize = panel.options.globalFontSize;
      // @ts-ignore
      delete panel.options.globalFontSize;
    }
    return panel.options;
  }
  //@ts-ignore
  const newDefaults = migrateDefaults(panel.polystat);
  let options = newDefaults;
  //@ts-ignore
  delete panel.polystat;
  //@ts-ignore
  const migratedOverrides = migrateOverrides(panel);
  //@ts-ignore
  const migratedComposites = migrateComposites(panel, newDefaults.compositeConfig.animationSpeed);
  //console.log(JSON.stringify(newDefaults, null, 2));
  options.compositeConfig = migratedComposites.compositeConfig;
  options.overrideConfig = migratedOverrides.overrideConfig;
  // convert range and value maps
  const newMaps = migrateValueAndRangeMaps(panel);
  panel.fieldConfig = {
    defaults: {
      mappings: newMaps,
    },
    overrides: [],
  };
  //@ts-ignore
  delete panel.mappingType;
  //@ts-ignore
  delete panel.rangeMaps;
  //@ts-ignore
  delete panel.valueMaps;
  // merge defaults
  //@ts-ignore
  delete panel.savedComposites;
  //@ts-ignore
  delete panel.savedOverrides;
  //@ts-ignore
  delete panel.colors;

  // clean up undefined
  // @ts-ignore
  Object.keys(panel).forEach((key) => (panel[key] === undefined ? delete panel[key] : {}));
  // @ts-ignore
  Object.keys(options).forEach((key) => (options[key] === undefined ? delete options[key] : {}));

  return options;
};

// split into three parts
// config normally found in "polystat" section
// then "savedOverrides" and "savedComposites"
// a "good" react config just has an "options" section
export const migrateDefaults = (angular: AngularPolystatOptions) => {
  let options: PolystatOptions = {
    autoSizeColumns: true,
    autoSizeRows: true,
    autoSizePolygons: true,
    ellipseCharacters: 18,
    ellipseEnabled: false,
    globalAutoScaleFonts: true,
    globalClickthrough: '',
    globalClickthroughNewTabEnabled: false,
    globalClickthroughSanitizedEnabled: false,
    globalClickthroughCustomTargetEnabled: false,
    globalClickthroughCustomTarget: '',
    globalDecimals: 2,
    globalDisplayMode: 'all',
    globalDisplayTextTriggeredEmpty: '',
    globalFillColor: '',
    globalLabelFontSize: 12,
    globalValueFontSize: 14,
    globalCompositeValueFontSize: 14,
    globalGradientsEnabled: false,
    globalOperator: 'mean',
    globalPolygonBorderSize: 1,
    globalPolygonBorderColor: '',
    globalPolygonSize: '50',
    globalRegexPattern: '',
    globalShape: PolygonShapes.HEXAGON_POINTED_TOP,
    globalShowValueEnabled: true,
    globalShowTooltipColumnHeadersEnabled: true,
    globalShowTimestampEnabled: false,
    globalShowTimestampFormat: ShowTimestampFormats[0].value,
    globalShowTimestampPosition: ShowTimestampPositions[0].value,
    globalShowTimestampFontSize: 12,
    globalShowTimestampYOffset: 0,
    globalTextFontColor: '#000000',
    globalTextFontAutoColor: '#000000',
    globalTextFontAutoColorEnabled: false,
    globalTextFontFamily: FontFamilies.INTER,
    globalThresholdsConfig: [],
    globalTooltipsEnabled: true,
    globalTooltipsShowTimestampEnabled: true,
    globalTooltipsShowValueEnabled: true,
    globalTooltipsFontFamily: FontFamilies.INTER,
    globalUnitFormat: '',
    layoutDisplayLimit: 100,
    layoutNumColumns: 8,
    layoutNumRows: 8,
    panelHeight: undefined,
    panelWidth: undefined,
    panelId: 0,
    radius: 100,
    renderTime: undefined,
    sortByField: '',
    sortByDirection: 0,
    overrideConfig: {
      overrides: [],
    },
    compositeGlobalAliasingEnabled: false,
    compositeConfig: {
      animationSpeed: '',
      composites: [],
      enabled: false,
    },
    tooltipPrimarySortDirection: 0,
    tooltipPrimarySortByField: '',
    tooltipSecondarySortDirection: 0,
    tooltipSecondarySortByField: '',
    tooltipDisplayMode: 'all',
    tooltipDisplayTextTriggeredEmpty: '',
  };

  if (angular.animationSpeed) {
    if (options.compositeConfig) {
      options.compositeConfig.animationSpeed = angular.animationSpeed.toString();
    }
  }
  if (angular.columnAutoSize) {
    options.autoSizeColumns = angular.columnAutoSize;
  }
  if (angular.columns) {
    let numColumns = parseInt(angular.columns, 10);
    if (isNaN(numColumns) || numColumns < 1) {
      numColumns = 8;
    }
    options.layoutNumColumns = numColumns;
  }
  if (angular.defaultClickThrough) {
    options.globalClickthrough = angular.defaultClickThrough;
  }
  if (angular.defaultClickThroughNewTab) {
    options.globalClickthroughNewTabEnabled = angular.defaultClickThroughNewTab;
  }
  if (angular.defaultClickThroughSanitize) {
    options.globalClickthroughSanitizedEnabled = angular.defaultClickThroughSanitize;
  }
  if (angular.displayLimit) {
    options.layoutDisplayLimit = angular.displayLimit;
  }
  if (angular.ellipseCharacters) {
    options.ellipseCharacters = angular.ellipseCharacters;
  }
  if (angular.ellipseEnabled) {
    options.ellipseEnabled = angular.ellipseEnabled;
  }
  if (angular.fontAutoColor) {
    options.globalTextFontAutoColorEnabled = angular.fontAutoColor;
  }
  if (angular.fontAutoScale) {
    options.globalAutoScaleFonts = angular.fontAutoScale;
  }
  if (angular.fontSize) {
    options.globalLabelFontSize = angular.fontSize;
  }
  options.globalTextFontFamily = FontFamilies.INTER;
  if (hasRobotoFont()) {
    options.globalTextFontFamily = FontFamilies.ROBOTO;
  }
  if (angular.globalDecimals) {
    options.globalDecimals = angular.globalDecimals;
  }
  if (angular.globalDisplayMode) {
    options.globalDisplayMode = angular.globalDisplayMode;
  }
  if (angular.globalDisplayTextTriggeredEmpty) {
    options.globalDisplayTextTriggeredEmpty = angular.globalDisplayTextTriggeredEmpty;
  }
  if (angular.globalOperatorName) {
    options.globalOperator = convertOperators(angular.globalOperatorName);
  }
  if (angular.globalThresholds) {
    options.globalThresholdsConfig = [];
    for (const threshold of angular.globalThresholds) {
      const migratedThreshold: PolystatThreshold = {
        value: threshold.value,
        state: threshold.state,
        color: threshold.color,
      };
      options.globalThresholdsConfig.push(migratedThreshold);
    }
  }

  if (angular.globalUnitFormat) {
    options.globalUnitFormat = angular.globalUnitFormat;
  }
  if (angular.gradientEnabled) {
    options.globalGradientsEnabled = angular.gradientEnabled;
  }
  if (angular.hexagonSortByDirection) {
    options.sortByDirection = angular.hexagonSortByDirection;
  }
  if (angular.hexagonSortByField) {
    options.sortByField = angular.hexagonSortByField;
  }
  if (angular.polygonBorderColor) {
    options.globalPolygonBorderColor = angular.polygonBorderColor;
  }
  if (angular.polygonBorderSize) {
    options.globalPolygonBorderSize = angular.polygonBorderSize;
  }
  if (angular.polygonGlobalFillColor) {
    options.globalFillColor = angular.polygonGlobalFillColor;
  }
  if (angular.radius) {
    let radius = parseFloat(angular.radius);
    if (isNaN(radius) || radius < 0) {
      radius = 0;
    }
    options.radius = radius;
  }
  if (angular.radiusAutoSize) {
    options.autoSizePolygons = angular.radiusAutoSize;
  }
  if (angular.regexPattern) {
    options.globalRegexPattern = angular.regexPattern;
  }
  if (angular.rowAutoSize) {
    options.autoSizeRows = angular.rowAutoSize;
  }
  if (angular.rows) {
    let numRows = parseInt(angular.rows, 10);
    if (isNaN(numRows) || numRows < 1) {
      numRows = 8;
    }
    options.layoutNumRows = numRows;
  }

  if (angular.shape) {
    switch (angular.shape) {
      case 'circle':
        options.globalShape = PolygonShapes.CIRCLE;
        break;
      case 'square':
        options.globalShape = PolygonShapes.SQUARE;
        break;
      case 'hexagon_pointed_top':
      default:
        options.globalShape = PolygonShapes.HEXAGON_POINTED_TOP;
    }
  }
  if (angular.tooltipDisplayMode) {
    options.tooltipDisplayMode = angular.tooltipDisplayMode;
  }
  if (angular.tooltipDisplayTextTriggeredEmpty) {
    options.tooltipDisplayTextTriggeredEmpty = angular.tooltipDisplayTextTriggeredEmpty;
  }
  if (angular.tooltipEnabled) {
    options.globalTooltipsEnabled = angular.tooltipEnabled;
  }
  if (angular.tooltipPrimarySortDirection) {
    options.tooltipPrimarySortDirection = angular.tooltipPrimarySortDirection;
  }
  if (angular.tooltipPrimarySortField) {
    options.tooltipPrimarySortByField = angular.tooltipPrimarySortField;
  }
  if (angular.tooltipSecondarySortDirection) {
    options.tooltipSecondarySortDirection = angular.tooltipSecondarySortDirection;
  }
  if (angular.tooltipSecondarySortField) {
    options.tooltipSecondarySortByField = angular.tooltipSecondarySortField;
  }
  if (angular.tooltipTimestampEnabled) {
    options.globalTooltipsShowTimestampEnabled = angular.tooltipTimestampEnabled;
  }
  options.globalTooltipsFontFamily = FontFamilies.INTER;
  if (hasRobotoFont()) {
    options.globalTooltipsFontFamily = FontFamilies.ROBOTO;
  }
  if (angular.valueEnabled) {
    options.globalShowValueEnabled = angular.valueEnabled;
  }

  return options;
};

export const migrateOverrides = (angular: AngularSavedOverrides) => {
  let options = {} as any;

  options.overrideConfig = {
    overrides: [],
  };
  // Overrides
  if (angular.savedOverrides?.length) {
    let order = 0;
    for (const seriesOverride of angular.savedOverrides) {
      let anOverride: OverrideItemType = {
        label: '',
        metricName: '',
        alias: '',
        thresholds: [],
        colors: [],
        unitFormat: '',
        decimals: '',
        scaledDecimals: 0,
        enabled: true,
        operatorName: 'avg',
        prefix: '',
        suffix: '',
        clickThrough: '',
        clickThroughSanitize: true,
        clickThroughOpenNewTab: true,
        clickThroughCustomTargetEnabled: false,
        clickThroughCustomTarget: '',
        order: order,
        showTimestampEnabled: false,
        showTimestampFormat: ShowTimestampFormats[0].value,
        showTimestampYOffset: 0,
      };
      for (const p of Object.keys(seriesOverride)) {
        // @ts-ignore
        const v = seriesOverride[p];
        switch (p) {
          // Ignore
          case '$$hashKey':
            break;
          case 'clickThrough':
            anOverride.clickThrough = v;
            break;
          case 'colors':
            anOverride.colors = v;
            break;
          case 'decimals':
            anOverride.decimals = v;
            break;
          case 'enabled':
            anOverride.enabled = v;
            break;
          case 'label':
            anOverride.label = v;
            break;
          case 'metricName':
            anOverride.metricName = v;
            break;
          case 'newTabEnabled':
            anOverride.clickThroughOpenNewTab = v;
            break;
          case 'operatorName':
            anOverride.operatorName = convertOperators(v);
            break;
          case 'prefix':
            anOverride.prefix = v;
            break;
          case 'sanitizeURLEnabled':
            anOverride.clickThroughSanitize = v;
            break;
          case 'suffix':
            anOverride.suffix = v;
            break;
          case 'thresholds':
            /*
              "color": "#e5ac0e",
              "state": 1,
              "value": 78
              */
            anOverride.thresholds = [];
            for (const threshold of v) {
              const migratedThreshold: PolystatThreshold = {
                value: threshold.value,
                state: threshold.state,
                color: threshold.color,
              };
              anOverride.thresholds.push(migratedThreshold);
            }
            break;
          case 'unitFormat':
            anOverride.unitFormat = v;
            break;
          default:
            console.log('Ignore override migration:', p, v);
        }
      }
      options.overrideConfig.overrides.push(anOverride);
      order++;
    }
  }
  return options;
};

export const convertOperators = (operator: string) => {
  switch (operator) {
    case 'avg':
      return 'mean';
    case 'current':
      return 'last'; // lastNotNull?
    case 'time_step':
      return 'step';
    case 'total':
      return 'sum';
    default:
      return operator;
  }
};

export const migrateValueAndRangeMaps = (panel: any) => {
  // value maps first
  panel.mappingType = 1;
  let newValueMappings: ValueMapping[] = [];
  if (panel.valueMaps !== undefined) {
    newValueMappings = convertOldAngularValueMappings(panel);
  }
  // range maps second
  panel.mappingType = 2;
  let newRangeMappings: ValueMapping[] = [];
  if (panel.rangeMaps !== undefined) {
    newRangeMappings = convertOldAngularValueMappings(panel);
  }
  // append together
  const newMappings = newValueMappings.concat(newRangeMappings);
  // get uniques only
  return [...new Map(newMappings.map((v) => [JSON.stringify(v), v])).values()];
};

export const migrateComposites = (angular: AngularSavedComposites, animationSpeed: string) => {
  let options = {} as any;
  // Composites
  options.compositeConfig = {
    composites: [],
    enabled: true,
    animationSpeed: animationSpeed,
  };

  if (angular.savedComposites?.length) {
    let index = 0;
    for (const composite of angular.savedComposites) {
      let aComposite: CompositeItemType = {
        name: `COMPOSITE-${index}`,
        label: `COMPOSITE-${index}`,
        order: index,
        isTemplated: false,
        displayMode: DisplayModes[0].value,
        enabled: true,
        showName: true,
        showValue: true,
        showComposite: true,
        showMembers: false,
        showTimestampEnabled: false,
        showTimestampFormat: ShowTimestampFormats[0].value,
        showTimestampYOffset: 0,
        metrics: [],
        clickThrough: '',
        clickThroughSanitize: true,
        clickThroughOpenNewTab: true,
        clickThroughCustomTargetEnabled: false,
        clickThroughCustomTarget: ''
      };
      index++;
      for (const p of Object.keys(composite)) {
        // @ts-ignore
        const v = composite[p];
        switch (p) {
          // Ignore
          case '$$hashKey':
            break;
          case 'animateMode':
            if (v !== 'all') {
              aComposite.displayMode = DisplayModes[1].value;
            }
            break;
          case 'clickThrough':
            aComposite.clickThrough = v;
            break;
          case 'compositeName':
            aComposite.name = v;
            break;
          // Ignore
          case 'displayName':
            break;
          case 'enabled':
            // this is now .showComposite
            aComposite.showComposite = v;
            break;
          case 'hideMembers':
            aComposite.showMembers = !v;
            break;
          case 'label':
            aComposite.label = v;
            break;
          case 'members':
            /*
              {
                "$$hashKey": "object:150",
                "seriesName": "/P2/"
              }
              */
            let memberIndex = 0;
            let members: CompositeMetric[] = [];
            // not sure about this...
            for (const aMember of Object.keys(v)) {
              const x = v[aMember];
              let member: CompositeMetric = {
                seriesMatch: x.seriesName,
                order: memberIndex,
              };
              members.push(member);
              memberIndex++;
            }
            aComposite.metrics = members;
            break;
          case 'newTabEnabled':
            aComposite.clickThroughOpenNewTab = v;
            break;
          case 'sanitizeURLEnabled':
            aComposite.clickThroughSanitize = v;
            break;
          // Ignore
          case 'sanitizedURL':
            break;
          case 'showName':
            aComposite.showName = v;
            break;
          case 'showValue':
            aComposite.showValue = v;
            break;
          default:
            console.log('Ignore composite migration:', p, v);
        }
      }
      options.compositeConfig.composites.push(aComposite);
    }
  }
  return options;
};

/**
 * This is called when the panel changes from another panel
 *
 * not currently used
 */
export const PolystatPanelChangedHandler = (
  panel: PanelModel<Partial<PolystatOptions>> | any,
  prevPluginId: string,
  prevOptions: any
) => {
  // Changing from angular polystat panel
  if (prevPluginId === 'polystat' && prevOptions.angular) {
    console.log('detected old panel');
    const oldOpts = prevOptions.angular;
    console.log(JSON.stringify(oldOpts));
  }

  return {};
};

// Roboto font was removed Dec 1, 2022, and releases after that date should not attempt to use it
export const hasRobotoFont = () => {
  const version = coerce(config.buildInfo.version);
  if (version !== null) {
    if (satisfies(version, "<9.4.0")) {
      return true;
    }
  }
  return false;
};
