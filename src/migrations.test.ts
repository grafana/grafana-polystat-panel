import { PanelModel } from '@grafana/data';
import { CompositeItemType } from 'components/composites/types';
import { OverrideItemType } from 'components/overrides/types';
import { PolystatOptions } from 'components/types';

import { PolystatPanelChangedHandler } from './migrations';

describe('Polystat -> PolystatV2 migrations', () => {
  it('only migrates old polystat', () => {
    const panel = {} as PanelModel;
    const options = PolystatPanelChangedHandler(panel, 'some-panel-id', {});
    expect(options).toEqual({});
  });

  it('correctly converts top level config to new names', () => {
    const panel = {
      options: {
        autoSizeColumns: false,
        layoutNumColumns: '',
      },
    } as PanelModel;

    const oldPolystatOptions = {
      angular: {
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
      },
    };
    const options = PolystatPanelChangedHandler(panel, 'grafana-polystat-panel', oldPolystatOptions) as PolystatOptions;
    console.log('top level...');
    console.log(JSON.stringify(options, null, 2));
    expect(options.layoutNumColumns).toEqual('6');
    expect(options.autoSizeColumns).toEqual(true);
    expect(options.globalClickthrough).toEqual('https://grafana.com');
  });

  it('correctly moves animation speed to compositeConfig', () => {
    const panel = {
      options: {
        compositeConfig: {
          composites: [] as CompositeItemType[],
          enabled: true,
          animationSpeed: '500',
        },
      },
    } as PanelModel;

    const oldPolystatOptions = {
      angular: {
        animationSpeed: 2500,
      },
    };
    const options = PolystatPanelChangedHandler(panel, 'grafana-polystat-panel', oldPolystatOptions) as PolystatOptions;
    console.log('animation...');
    console.log(JSON.stringify(options, null, 2));
    expect(options.compositeConfig.animationSpeed).toEqual('2500');
  });

  it('correctly migrates overrides', () => {
    const panel = {
      options: {
        overrideConfig: {
          overrides: [] as OverrideItemType[],
        },
      },
    } as PanelModel;

    const oldPolystatOptions = {
      angular: {
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
      },
    };
    const options = PolystatPanelChangedHandler(panel, 'grafana-polystat-panel', oldPolystatOptions) as PolystatOptions;
    console.log('overrides...');
    console.log(JSON.stringify(options, null, 2));
    expect(options.overrideConfig.overrides[0].label).toEqual('OVERRIDE 1');
  });

  it('correctly migrates composites to compositeConfig', () => {
    const panel = {
      options: {
        compositeConfig: {
          composites: [] as CompositeItemType[],
          enabled: true,
          animationSpeed: '500',
        },
      },
    } as PanelModel;

    const oldPolystatOptions = {
      angular: {
        animationSpeed: 2500,
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
      },
    };
    const options = PolystatPanelChangedHandler(panel, 'grafana-polystat-panel', oldPolystatOptions) as PolystatOptions;
    console.log('composites...');
    console.log(JSON.stringify(options, null, 2));
    expect(options.compositeConfig.animationSpeed).toEqual('2500');
  });
});

/*
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
*/
