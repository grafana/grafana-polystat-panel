import { PanelModel } from '@grafana/data';
import { CompositeItemType, CompositeMetric } from 'components/composites/types';
import { OverrideItemType } from 'components/overrides/types';
import { DisplayModes, PolygonShapes } from 'components/types';
import { PolystatOptions } from './components/types';

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
  globalDecimals: number;
  globalDisplayMode: string;
  globalDisplayTextTriggeredEmpty: string;
  globalOperatorName: string;
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
  //console.log('inside migration handler');
  if (!panel.options) {
    // This happens on the first load or when migrating from angular
    //console.log('inside migration handle - no panel options detected');

    return {} as any;
  }

  //const previousVersion = parseFloat(panel.pluginVersion || '6.1');
  //console.log(`inside migration handler ${previousVersion}`);

  //let options = panel.options as any;
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
  // merge defaults
  //@ts-ignore
  delete panel.savedComposites;
  //@ts-ignore
  delete panel.savedOverrides;
  //@ts-ignore
  delete panel.colors;

  //console.log(JSON.stringify(options, null, 2));

  return options;
};

// split into three parts
// config normally found in "polystat" section
// then "savedOverrides" and "savedComposites"
// a "good" react config just has an "options" section
export const migrateDefaults = (angular: AngularPolystatOptions) => {
  let options: PolystatOptions = {
    autoSizeColumns: false,
    autoSizeRows: false,
    autoSizePolygons: false,
    ellipseCharacters: 0,
    ellipseEnabled: false,
    globalAutoScaleFonts: false,
    globalClickthrough: '',
    globalClickthroughNewTabEnabled: false,
    globalClickthroughSanitizedEnabled: false,
    globalDecimals: 0,
    globalDisplayMode: '',
    globalDisplayTextTriggeredEmpty: '',
    globalFillColor: '',
    globalFontSize: 0,
    globalGradientsEnabled: false,
    globalOperator: '',
    globalPolygonBorderSize: 0,
    globalPolygonBorderColor: '',
    globalPolygonSize: 0,
    globalRegexPattern: '',
    globalShape: PolygonShapes.HEXAGON_POINTED_TOP,
    globalShowValueEnabled: false,
    globalTextFontColor: '',
    globalTextFontAutoColor: '',
    globalTextFontAutoColorEnabled: false,
    globalThresholdsConfig: [],
    globalTooltipsEnabled: false,
    globalTooltipsShowTimestampEnabled: false,
    globalUnitFormat: '',
    layoutDisplayLimit: 0,
    layoutNumColumns: 0,
    layoutNumRows: 0,
    processedData: [],
    panelHeight: undefined,
    panelWidth: undefined,
    panelId: 0,
    radius: 0,
    renderTime: undefined,
    sortByField: '',
    sortByDirection: 0,
    overrideConfig: {
      overrides: [],
    },
    compositeConfig: {
      animationSpeed: '',
      composites: [],
      enabled: false,
    },
    tooltipPrimarySortDirection: 0,
    tooltipPrimarySortByField: '',
    tooltipSecondarySortDirection: 0,
    tooltipSecondarySortByField: '',
    tooltipDisplayMode: '',
    tooltipDisplayTextTriggeredEmpty: '',
  };

  if (angular.animationSpeed) {
    options.compositeConfig.animationSpeed = angular.animationSpeed.toString();
  }
  if (angular.columnAutoSize) {
    options.autoSizeColumns = angular.columnAutoSize;
  }
  if (angular.columns) {
    options.layoutNumColumns = parseInt(angular.columns, 10);
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
    options.globalFontSize = angular.fontSize;
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
  // TODO: convert to v8 operators...
  if (angular.globalOperatorName) {
    options.globalOperator = angular.globalOperatorName;
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
  // ignore, this was not used in the panel (duplicate of displayLimit)
  //if (angular.maxMetrics) {
  // options.layoutDisplayLimit = angular.maxMetrics;
  //}
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
    options.radius = parseFloat(angular.radius);
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
    options.layoutNumRows = parseInt(angular.rows, 10);
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
  if (angular.valueEnabled) {
    options.globalShowValueEnabled = angular.valueEnabled;
  }

  return options;
};

export const migrateOverrides = (angular: AngularSavedOverrides) => {
  console.log('inside migrateOverrides');

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
        order: order,
      };
      for (const p of Object.keys(seriesOverride)) {
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
            anOverride.thresholds = v;
            // cleanup
            for (const threshold of anOverride.thresholds) {
              delete threshold['$$hashKey'];
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
  return 'current';
};

export const migrateComposites = (angular: AngularSavedComposites, animationSpeed: string) => {
  console.log('inside migrateComposites');

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
        order: index,
        templatedName: '',
        isTemplated: false,
        displayMode: DisplayModes[0].value,
        enabled: true,
        showName: true,
        showValue: true,
        showComposite: true,
        showMembers: false,
        metrics: [],
        clickThrough: '',
        clickThroughSanitize: true,
        clickThroughOpenNewTab: true,
      };
      index++;
      for (const p of Object.keys(composite)) {
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
            aComposite.name = v;
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

/*

This is the previous Angular Config

polystat": {
    "animationSpeed": 2500,
    "columnAutoSize": true,
    "columns": "",
    "defaultClickThrough": "",
    "defaultClickThroughNewTab": false,
    "defaultClickThroughSanitize": false,
    "displayLimit": 100,
    "ellipseCharacters": 18,
    "ellipseEnabled": false,
    "fontAutoColor": true,
    "fontAutoScale": true,
    "fontSize": 12,
    "fontType": "Roboto",
    "globalDecimals": 2,
    "globalDisplayMode": "all",
    "globalDisplayTextTriggeredEmpty": "OK",
    "globalOperatorName": "avg",
    "globalUnitFormat": "short",
    "gradientEnabled": true,
    "hexagonSortByDirection": 1,
    "hexagonSortByField": "name",
    "maxMetrics": 0,
    "polygonBorderColor": "#000000",
    "polygonBorderSize": 2,
    "polygonGlobalFillColor": "#0a55a1",
    "radius": "",
    "radiusAutoSize": true,
    "regexPattern": "",
    "rowAutoSize": true,
    "rows": "",
    "shape": "square",
    "tooltipDisplayMode": "all",
    "tooltipDisplayTextTriggeredEmpty": "OK",
    "tooltipEnabled": true,
    "tooltipFontSize": 12,
    "tooltipFontType": "Roboto",
    "tooltipPrimarySortDirection": 2,
    "tooltipPrimarySortField": "thresholdLevel",
    "tooltipSecondarySortDirection": 2,
    "tooltipSecondarySortField": "value",
    "tooltipTimestampEnabled": true,
    "valueEnabled": true
},
"savedComposites": [
    {
      "$$hashKey": "object:91",
      "animateMode": "all",
      "clickThrough": "",
      "compositeName": "P1",
      "displayName": "",
      "enabled": true,
      "hideMembers": true,
      "label": "COMPOSITE 1",
      "members": [
        {
          "$$hashKey": "object:105",
          "seriesName": "/P1/"
        }
      ],
      "newTabEnabled": true,
      "sanitizeURLEnabled": true,
      "sanitizedURL": "",
      "showName": true,
      "showValue": true,
      "thresholdLevel": 0
    },
  ],
  "savedOverrides": [
    {
      "$$hashKey": "object:114",
      "clickThrough": "",
      "colors": [
        "#299c46",
        "#e5ac0e",
        "#bf1b00",
        "#4040a0"
      ],
      "decimals": 3,
      "enabled": true,
      "label": "OVERRIDE 1",
      "metricName": "/TempInC/",
      "newTabEnabled": true,
      "operatorName": "current",
      "prefix": "",
      "sanitizeURLEnabled": true,
      "suffix": "",
      "unitFormat": "celsius"
    }
  ],
*/
