import { PanelModel, RangeMap, ValueMap, SpecialValueMap } from '@grafana/data';
import { config } from "@grafana/runtime";

import {
  PolystatPanelMigrationHandler,
  migrateDefaults,
  migrateComposites,
  migrateOverrides,
  AngularSavedComposites,
  AngularSavedOverrides,
  migrateValueAndRangeMaps,
  hasRobotoFont,
} from './migrations';

describe('Polystat -> PolystatV2 migrations', () => {
  it('only migrates old polystat', () => {
    const panel = {} as PanelModel;
    const options = PolystatPanelMigrationHandler(panel);
    expect(options).toEqual({});
  });

  it('migrates old polystat config', () => {
    const panel = {} as PanelModel;
    panel.options = {};
    //@ts-ignore
    panel.polystat = {
      animationSpeed: 2500,
      columnAutoSize: true,
      columns: '6',
      defaultClickThrough: 'https://grafana.com',
      defaultClickThroughNewTab: false,
      defaultClickThroughSanitize: true,
      displayLimit: 100,
      ellipseCharacters: 18,
      ellipseEnabled: false,
      fontAutoColor: true,
      fontAutoScale: true,
      fontSize: 12,
      fontType: 'Roboto',
      globalDecimals: 2,
      globalDisplayMode: 'all',
      globalDisplayTextTriggeredEmpty: 'OK',
      globalOperatorName: 'avg',
      globalUnitFormat: 'short',
      gradientEnabled: true,
      hexagonSortByDirection: 1,
      hexagonSortByField: 'name',
      maxMetrics: 0,
      polygonBorderColor: '#000000',
      polygonBorderSize: 2,
      polygonGlobalFillColor: '#0a55a1',
      radius: '',
      radiusAutoSize: true,
      regexPattern: '',
      rowAutoSize: true,
      rows: '',
      shape: 'square',
      tooltipDisplayMode: 'all',
      tooltipDisplayTextTriggeredEmpty: 'OK',
      tooltipEnabled: true,
      tooltipFontSize: 12,
      tooltipFontType: 'Roboto',
      tooltipPrimarySortDirection: 2,
      tooltipPrimarySortField: 'thresholdLevel',
      tooltipSecondarySortDirection: 2,
      tooltipSecondarySortField: 'value',
      tooltipTimestampEnabled: true,
      valueEnabled: true,
    };
    const options = PolystatPanelMigrationHandler(panel);
    expect(options).toMatchSnapshot();
  });

  it('migrates old polystat config with mappings', () => {
    const panel = {
      options: {},
      mappingType: 1,
      rangeMaps: [
        {
          from: 'null',
          text: 'N/A',
          to: 'null',
        },
      ],
      valueMaps: [
        {
          op: '=',
          text: 'N/A',
          value: 'null',
        },
        {
          op: '=',
          text: 'Nominal',
          value: '30.386',
        },
      ],
    } as unknown as PanelModel;
    //@ts-ignore
    panel.polystat = {
      animationSpeed: 2500,
      columnAutoSize: true,
      columns: '6',
      defaultClickThrough: 'https://grafana.com',
      defaultClickThroughNewTab: false,
      defaultClickThroughSanitize: true,
      displayLimit: 100,
      ellipseCharacters: 18,
      ellipseEnabled: false,
      fontAutoColor: true,
      fontAutoScale: true,
      fontSize: 12,
      fontType: 'Roboto',
      globalDecimals: 2,
      globalDisplayMode: 'all',
      globalDisplayTextTriggeredEmpty: 'OK',
      globalOperatorName: 'avg',
      globalUnitFormat: 'short',
      gradientEnabled: true,
      hexagonSortByDirection: 1,
      hexagonSortByField: 'name',
      maxMetrics: 0,
      polygonBorderColor: '#000000',
      polygonBorderSize: 2,
      polygonGlobalFillColor: '#0a55a1',
      radius: '',
      radiusAutoSize: true,
      regexPattern: '',
      rowAutoSize: true,
      rows: '',
      shape: 'square',
      tooltipDisplayMode: 'all',
      tooltipDisplayTextTriggeredEmpty: 'OK',
      tooltipEnabled: true,
      tooltipFontSize: 12,
      tooltipFontType: 'Roboto',
      tooltipPrimarySortDirection: 2,
      tooltipPrimarySortField: 'thresholdLevel',
      tooltipSecondarySortDirection: 2,
      tooltipSecondarySortField: 'value',
      tooltipTimestampEnabled: true,
      valueEnabled: true,
    };
    const options = PolystatPanelMigrationHandler(panel);
    expect(options).toMatchSnapshot();
    expect(panel).toMatchSnapshot();
    // @ts-ignore
    expect(panel.fieldConfig.defaults.mappings[0].options.result.text).toEqual('N/A');
    // @ts-ignore
    expect(panel.fieldConfig.defaults.mappings[1].options).toEqual({ '30.386': { color: undefined, text: 'Nominal' } });
  });

  it('correctly converts top level config to new names', () => {
    const oldPolystatOptions = {
      polystat: {
        animationSpeed: 2500,
        columnAutoSize: true,
        columns: '6',
        defaultClickThrough: 'https://grafana.com',
        defaultClickThroughNewTab: false,
        defaultClickThroughSanitize: true,
        displayLimit: 100,
        ellipseCharacters: 18,
        ellipseEnabled: false,
        fontAutoColor: true,
        fontAutoScale: true,
        fontSize: 12,
        fontType: 'Roboto',
        globalDecimals: 2,
        globalDisplayMode: 'all',
        globalDisplayTextTriggeredEmpty: 'OK',
        globalOperatorName: 'avg',
        globalThresholds: [],
        globalUnitFormat: 'short',
        gradientEnabled: true,
        hexagonSortByDirection: 1,
        hexagonSortByField: 'name',
        maxMetrics: 0,
        polygonBorderColor: '#000000',
        polygonBorderSize: 2,
        polygonGlobalFillColor: '#0a55a1',
        radius: '',
        radiusAutoSize: true,
        regexPattern: '',
        rowAutoSize: true,
        rows: '',
        shape: 'square',
        tooltipDisplayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'OK',
        tooltipEnabled: true,
        tooltipFontSize: 12,
        tooltipFontType: 'Roboto',
        tooltipPrimarySortDirection: 2,
        tooltipPrimarySortField: 'thresholdLevel',
        tooltipSecondarySortDirection: 2,
        tooltipSecondarySortField: 'value',
        tooltipTimestampEnabled: true,
        valueEnabled: true,
      },
    };
    const options = migrateDefaults(oldPolystatOptions.polystat);
    //console.log('top level...');
    //console.log(JSON.stringify(options, null, 2));
    expect(options.layoutNumColumns).toEqual(6);
    expect(options.autoSizeColumns).toEqual(true);
    expect(options.globalClickthrough).toEqual('https://grafana.com');
    expect(options.compositeConfig.animationSpeed).toEqual('2500');
  });

  it('correctly migrates global thresholds', () => {
    const oldPolystatOptions = {
      polystat: {
        animationSpeed: 2500,
        columnAutoSize: true,
        columns: '6',
        defaultClickThrough: 'https://grafana.com',
        defaultClickThroughNewTab: false,
        defaultClickThroughSanitize: true,
        displayLimit: 100,
        ellipseCharacters: 18,
        ellipseEnabled: false,
        fontAutoColor: true,
        fontAutoScale: true,
        fontSize: 12,
        fontType: 'Roboto',
        globalDecimals: 2,
        globalDisplayMode: 'all',
        globalDisplayTextTriggeredEmpty: 'OK',
        globalOperatorName: 'avg',
        globalThresholds: [
          {
            value: 0,
            state: 0,
            color: '#299c46',
          },
          {
            value: 60,
            state: 1,
            color: '#ED8128',
          },
          {
            value: 70,
            state: 2,
            color: '#d44a3a',
          },
        ],
        globalUnitFormat: 'short',
        gradientEnabled: true,
        hexagonSortByDirection: 1,
        hexagonSortByField: 'name',
        maxMetrics: 0,
        polygonBorderColor: '#000000',
        polygonBorderSize: 2,
        polygonGlobalFillColor: '#0a55a1',
        radius: '',
        radiusAutoSize: true,
        regexPattern: '',
        rowAutoSize: true,
        rows: '',
        shape: 'square',
        tooltipDisplayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'OK',
        tooltipEnabled: true,
        tooltipFontSize: 12,
        tooltipFontType: 'Roboto',
        tooltipPrimarySortDirection: 2,
        tooltipPrimarySortField: 'thresholdLevel',
        tooltipSecondarySortDirection: 2,
        tooltipSecondarySortField: 'value',
        tooltipTimestampEnabled: true,
        valueEnabled: true,
      },
    };
    const options = migrateDefaults(oldPolystatOptions.polystat);
    //console.log('global thresholds...');
    expect(options.globalThresholdsConfig.length).toEqual(3);
    expect(options.globalThresholdsConfig[0].color).toEqual('#299c46');
    expect(options.globalThresholdsConfig[1].color).toEqual('#ED8128');
    expect(options.globalThresholdsConfig[2].color).toEqual('#d44a3a');
  });

  it('correctly migrates overrides', () => {
    const oldPolystatOptions: AngularSavedOverrides = {
      savedOverrides: [
        {
          clickThrough: '',
          colors: ['#299c46', '#e5ac0e', '#bf1b00', '#4040a0'],
          decimals: 3,
          enabled: true,
          label: 'OVERRIDE 1',
          metricName: '/.*TempInC.*/',
          newTabEnabled: true,
          operatorName: 'current',
          prefix: '',
          sanitizeURLEnabled: true,
          suffix: '',
          thresholds: [
            {
              color: '#299c46',
              state: 0,
              value: 0,
            },
            {
              color: '#e5ac0e',
              state: 1,
              value: 25,
            },
            {
              color: '#bf1b00',
              state: 2,
              value: 32,
            },
          ],
          unitFormat: 'celsius',
        },
        {
          clickThrough: '',
          colors: ['#299c46', '#e5ac0e', '#bf1b00', '#4040a0'],
          decimals: 3,
          enabled: true,
          label: 'OVERRIDE 2',
          metricName: '/.*TempInF.*/',
          newTabEnabled: true,
          operatorName: 'current',
          prefix: '',
          sanitizeURLEnabled: true,
          suffix: '',
          thresholds: [
            {
              color: '#299c46',
              state: 0,
              value: 0,
            },
            {
              color: '#e5ac0e',
              state: 1,
              value: 78,
            },
            {
              color: '#bf1b00',
              state: 2,
              value: 82,
            },
          ],
          unitFormat: 'fahrenheit',
        },
      ],
    };
    const options = migrateOverrides(oldPolystatOptions);
    //console.log('overrides...');
    //console.log(JSON.stringify(options.overrideConfig, null, 2));
    expect(options.overrideConfig.overrides[0].label).toEqual('OVERRIDE 1');
    expect(options.overrideConfig.overrides[0].thresholds[0].color).toEqual('#299c46');
  });

  it('correctly migrates composites to compositeConfig', () => {
    /*
    const panel = {
      options: {
        compositeConfig: {
          composites: [] as CompositeItemType[],
          enabled: true,
          animationSpeed: '500',
        },
      },
    } as PanelModel;
    */

    const oldPolystatOptions: AngularSavedComposites = {
      savedComposites: [
        {
          animateMode: 'all',
          clickThrough: '',
          compositeName: 'P1',
          displayName: '',
          enabled: true,
          hideMembers: true,
          label: 'COMPOSITE 1',
          members: [
            {
              seriesName: '/P1/',
            },
          ],
          newTabEnabled: true,
          sanitizeURLEnabled: true,
          sanitizedURL: '',
          showName: true,
          showValue: true,
          thresholdLevel: 0,
        },
        {
          animateMode: 'all',
          clickThrough: '',
          compositeName: 'P2',
          displayName: '',
          enabled: true,
          hideMembers: true,
          label: 'COMPOSITE 2',
          members: [
            {
              seriesName: '/P2/',
            },
          ],
          newTabEnabled: true,
          sanitizeURLEnabled: true,
          sanitizedURL: '',
          showName: true,
          showValue: true,
          thresholdLevel: 0,
        },
      ],
    };
    const options = migrateComposites(oldPolystatOptions, '2222');
    //console.log('composites...');
    //console.log(JSON.stringify(options, null, 2));
    expect(options.compositeConfig.animationSpeed).toEqual('2222');
  });

  it('correctly migrates range and value maps', () => {
    const aPanel = {
      mappingType: 1,
      valueMaps: [
        {
          op: '=',
          text: 'N/A',
          value: 'null',
        },
        {
          op: '=',
          text: 'Nominal',
          value: '30.386',
        },
      ],
      rangeMaps: [
        {
          from: 'null',
          text: 'N/A',
          to: 'null',
        },
        {
          from: '30',
          text: 'Nominal',
          to: '40',
        },
      ],
    };
    const newMaps = migrateValueAndRangeMaps(aPanel);
    //console.log(JSON.stringify(newMaps, null, 2));
    expect(newMaps.length).toEqual(3);
    const aSpecialMap = newMaps[0] as SpecialValueMap;
    expect(aSpecialMap.type).toEqual('special');
    expect(aSpecialMap.options.result.text).toEqual('N/A');
    const aValueMap = newMaps[1] as ValueMap;
    expect(aValueMap.type).toEqual('value');
    expect(aValueMap.options).toEqual({ '30.386': { text: 'Nominal' } });
    const aRangeMap = newMaps[2] as RangeMap;
    expect(aRangeMap.type).toEqual('range');
    expect(aRangeMap.options.from).toEqual(30);
    expect(aRangeMap.options.to).toEqual(40);
    expect(aRangeMap.options.result.text).toEqual('Nominal');
  });
  it('checks if roboto is available to runtime', () => {
    const versions = new Map<string, boolean>([
      ["8.4.11", true],
      ["8.5.21", true],
      ["9.1.0", true],
      ["9.2.0", true],
      ["9.3.0", true],
      ["9.4.0", false],
      ["9.4.3", false],
    ]);
    for (let [key, value] of versions) {
      config.buildInfo.version = key;
      expect(hasRobotoFont()).toEqual(value);
    }
  });
});
