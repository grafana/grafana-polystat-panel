import { FieldConfigSource, PanelModel, SelectableValue } from '@grafana/data';
import { CompositeItemType, CompositeMetric, DisplayModes } from 'components/composites/types';
import { OverrideItemType } from 'components/overrides/types';

import { PolystatOptions } from './components/types';

export const PolystatPanelChangedHandler = (
  panel: PanelModel<Partial<PolystatOptions>> | any,
  prevPluginId: string,
  prevOptions: any
) => {
  console.log('inside migration handler');
  if (prevPluginId === 'grafana-polystat-panel' && prevOptions.angular) {
    const angular = prevOptions.angular;
    let options: PolystatOptions = panel.options;
    // @ts-ignore
    const fieldConfig: FieldConfigSource = panel.fieldConfig ?? { defaults: {}, overrides: [] };
    if (angular.animationSpeed) {
      options.compositeConfig.animationSpeed = angular.animationSpeed.toString();
    }
    if (angular.columnAutoSize) {
      options.autoSizeColumns = angular.columnAutoSize;
    }
    if (angular.columns) {
      options.layoutNumColumns = angular.columns;
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
      options.globalTextFontAutoColor = angular.fontAutoColor;
    }
    if (angular.fontColor) {
      options.globalTextFontColor = angular.fontColor;
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
      options.radius = angular.radius;
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
      options.layoutNumRows = angular.rows;
    }
    if (angular.shape) {
      options.globalShape = angular.shape;
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
          operatorName: { label: 'avg', value: 'avg' } as SelectableValue,
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
              anOverride.operatorName = v;
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
    // Composites
    options.compositeConfig = {
      composites: [],
      enabled: true,
      animationSpeed: '2500',
    };

    if (angular.savedComposites?.length) {
      let index = 0;
      for (const composite of angular.savedComposites) {
        let aComposite: CompositeItemType = {
          name: `COMPOSITE-${index}`,
          order: index,
          templatedName: '',
          isTemplated: false,
          displayMode: DisplayModes[0],
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
              aComposite.displayMode = v;
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
    // Mappings?
    //const valuemap: ValueMap = { type: MappingType.ValueToText, options: {} };
    //fieldConfig.defaults.mappings = [valuemap];

    return options;
  }
  return {};
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
