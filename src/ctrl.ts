import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import $ from 'jquery';
import kbn from 'grafana/app/core/utils/kbn';
import TimeSeries from 'grafana/app/core/time_series2';

import { D3Wrapper } from './d3wrapper';
import { Transformers } from './transformers';
import { PolystatModel } from './polystatmodel';
import { MetricOverridesManager } from './metric_overrides_manager';
import { CompositesManager } from './composites_manager';
import { Tooltip } from './tooltip';
import { GetDecimalsForValue, SortVariableValuesByField, getMappedValue } from './utils';
import { ClickThroughTransformer } from './clickThroughTransformer';
import { PolystatConfigs } from 'types';
import { convertOldAngularValueMapping } from '@grafana/ui';
import { LegacyResponseData, DataFrame, PanelEvents, stringToJsRegex } from '@grafana/data';
import { DataProcessor } from './core/data_processor';
import { getProcessedDataFrames } from './core/dataframe';
import { InsertTime } from './data/deframer';
class D3PolystatPanelCtrl extends MetricsPanelCtrl {
  processor: DataProcessor;
  static templateUrl = 'partials/template.html';
  animationModes = [
    { value: 'all', text: 'Show All' },
    { value: 'triggered', text: 'Show Triggered' },
  ];
  displayModes = [
    { value: 'all', text: 'Show All' },
    { value: 'triggered', text: 'Show Triggered' },
  ];
  shapes = [
    { value: 'hexagon_pointed_top', text: 'Hexagon Pointed Top' },
    //{ value: 'hexagon_flat_top', text: 'Hexagon Flat Top' },
    { value: 'circle', text: 'Circle' },
    //{ value: "cross", text: "Cross" },
    //{ value: 'diamond', text: 'Diamond' },
    { value: 'square', text: 'Square' },
    //{ value: "star", text: "Star" },
    //{ value: "triangle", text: "Triangle" },
    //{ value: "wye", text: "Wye" }
  ];
  fontSizes = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
    48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70,
  ];
  unitFormats = kbn.getUnitFormats();
  operatorOptions = [
    { value: 'avg', text: 'Average' },
    { value: 'count', text: 'Count' },
    { value: 'current', text: 'Current' },
    { value: 'delta', text: 'Delta' },
    { value: 'diff', text: 'Difference' },
    { value: 'first', text: 'First' },
    { value: 'logmin', text: 'Log Min' },
    { value: 'max', text: 'Max' },
    { value: 'min', text: 'Min' },
    { value: 'name', text: 'Name' },
    { value: 'last_time', text: 'Time of Last Point' },
    { value: 'time_step', text: 'Time Step' },
    { value: 'total', text: 'Total' },
  ];
  sortDirections = [
    { value: 'asc', text: 'Ascending' },
    { value: 'desc', text: 'Descending' },
  ];
  sortFields = [
    { value: 'name', text: 'Name' },
    { value: 'thresholdLevel', text: 'Threshold Level' },
    { value: 'value', text: 'Value' },
  ];
  // new method for sorting same as template vars
  sortOptions = [
    { value: 0, text: 'Disabled' },
    { value: 1, text: 'Alphabetical (asc)' },
    { value: 2, text: 'Alphabetical (desc)' },
    { value: 3, text: 'Numerical (asc)' },
    { value: 4, text: 'Numerical (desc)' },
    { value: 5, text: 'Alphabetical (case-insensitive, asc)' },
    { value: 6, text: 'Alphabetical (case-insensitive, desc)' },
  ];

  polystatData: PolystatModel[];
  initialized: boolean;
  panelContainer: any;
  d3Object: D3Wrapper;
  series: any[];
  templateSrv: any;
  overridesCtrl: MetricOverridesManager;
  compositesManager: CompositesManager;
  tooltipContent: string[];
  d3DivId: string;
  containerDivId: string;
  svgContainer: any;
  mappingTypes = [
    { text: 'value to text', value: 1 },
    { text: 'range to text', value: 2 },
  ];
  panelWidth: any;
  panelHeight: any;
  panelDefaults = {
    nullPointMode: 'connected',
    savedComposites: [],
    savedOverrides: [], // Array<MetricOverride>(),
    colors: ['#299c46', '#ED8128', '#d44a3a', '#4040a0'],
    valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
    rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
    mappingType: 1,
    polystat: {
      animationSpeed: 2500,
      columns: '',
      columnAutoSize: true,
      displayLimit: 100,
      defaultClickThrough: '',
      defaultClickThroughNewTab: false,
      defaultClickThroughSanitize: false,
      ellipseEnabled: false,
      ellipseCharacters: 18,
      fontAutoScale: true,
      fontSize: 12,
      fontType: 'Roboto',
      fontAutoColor: true,
      globalUnitFormat: 'short',
      globalDecimals: 2,
      globalDisplayMode: 'all',
      globalOperatorName: 'avg',
      globalDisplayTextTriggeredEmpty: 'OK',
      gradientEnabled: true,
      hexagonSortByDirection: 'asc',
      hexagonSortByField: 'name',
      maxMetrics: 0,
      polygonBorderSize: 2,
      polygonBorderColor: '#000000',
      polygonGlobalFillColor: '#0a55a1', // 'rgb(10, 80, 161)'  '#0a55a1'
      radius: '',
      radiusAutoSize: true,
      rows: '',
      rowAutoSize: true,
      shape: 'hexagon_pointed_top',
      tooltipDisplayMode: 'all',
      tooltipDisplayTextTriggeredEmpty: 'OK',
      tooltipFontSize: 12,
      tooltipFontType: 'Roboto',
      tooltipPrimarySortDirection: 'desc',
      tooltipPrimarySortField: 'thresholdLevel',
      tooltipSecondarySortDirection: 'desc',
      tooltipSecondarySortField: 'value',
      tooltipTimestampEnabled: true,
      tooltipEnabled: true,
      valueEnabled: true,
      regexPattern: '',
    },
  };

  /** @ngInject */
  constructor($scope, $injector, templateSrv, private $sanitize) {
    super($scope, $injector);
    // merge existing settings with our defaults
    _.defaultsDeep(this.panel, this.panelDefaults);
    // @ts-ignore
    this.useDataFrames = true;
    this.processor = new DataProcessor({
      xaxis: { mode: 'custom' },
      aliasColors: {},
    });
    this.d3DivId = 'd3_svg_' + this.panel.id;
    this.containerDivId = 'container_' + this.d3DivId;
    this.initialized = false;
    this.panelContainer = null;
    this.templateSrv = templateSrv;
    this.svgContainer = null;
    this.panelWidth = null;
    this.panelHeight = null;
    this.polystatData = [] as PolystatModel[];
    this.d3Object = null;
    this.series = [];
    this.tooltipContent = [];
    // convert old sort method to new
    this.migrateSortDirections();
    this.overridesCtrl = new MetricOverridesManager($scope, templateSrv, $sanitize, this.panel.savedOverrides);
    this.compositesManager = new CompositesManager($scope, templateSrv, $sanitize, this.panel.savedComposites);
    // events
    this.events.on(PanelEvents.dataFramesReceived, this.onDataFramesReceived.bind(this));
    this.events.on(PanelEvents.dataError, this.onDataError.bind(this));
    this.events.on(PanelEvents.dataSnapshotLoad, this.onSnapshotLoad.bind(this));
    this.events.on(PanelEvents.editModeInitialized, this.onInitEditMode.bind(this));
  }

  migrateSortDirections() {
    if (this.panel.polystat.hexagonSortByDirection === 'asc') {
      this.panel.polystat.hexagonSortByDirection = 1;
    }
    if (this.panel.polystat.hexagonSortByDirection === 'desc') {
      this.panel.polystat.hexagonSortByDirection = 2;
    }
    if (this.panel.polystat.tooltipPrimarySortDirection === 'asc') {
      this.panel.polystat.tooltipPrimarySortDirection = 1;
    }
    if (this.panel.polystat.tooltipPrimarySortDirection === 'desc') {
      this.panel.polystat.tooltipPrimarySortDirection = 2;
    }
    if (this.panel.polystat.tooltipSecondarySortDirection === 'asc') {
      this.panel.polystat.tooltipSecondarySortDirection = 1;
    }
    if (this.panel.polystat.tooltipSecondarySortDirection === 'desc') {
      this.panel.polystat.tooltipSecondarySortDirection = 2;
    }
  }

  onInitEditMode() {
    // determine the path to this plugin base on the name found in panel.type
    const thisPanelPath = 'public/plugins/' + this.panel.type + '/';
    // add the relative path to the partial
    const optionsPath = thisPanelPath + 'partials/editor.options.html';
    this.addEditorTab('Options', optionsPath, 2);
    const overridesPath = thisPanelPath + 'partials/editor.overrides.html';
    this.addEditorTab('Overrides', overridesPath, 3);
    const compositesPath = thisPanelPath + 'partials/editor.composites.html';
    this.addEditorTab('Composites', compositesPath, 4);
    const mappingsPath = thisPanelPath + 'partials/editor.mappings.html';
    this.addEditorTab('Value Mappings', mappingsPath, 5);
  }

  /**
   * [setContainer description]
   * @param {[type]} container [description]
   */
  setContainer(container) {
    this.panelContainer = container;
    this.svgContainer = container;
  }

  // determine the width of a panel by the span and viewport
  // the link element object can be used to get the width more reliably
  getPanelWidthFailsafe() {
    let trueWidth = 0;
    if (typeof this.panel.gridPos !== 'undefined') {
      // 24 slots is fullscreen, get the viewport and divide to approximate the width
      const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const pixelsPerSlot = viewPortWidth / 24;
      trueWidth = Math.round(this.panel.gridPos.w * pixelsPerSlot);
      return trueWidth;
    }
    // grafana5 - use this.panel.gridPos.w, this.panel.gridPos.h
    if (typeof this.panel.span === 'undefined') {
      // check if inside edit mode
      if (this.editModeInitiated) {
        // width is clientWidth of document
        trueWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
      } else {
        // get the width based on the scaled container (v5 needs this)
        trueWidth = this.panelContainer.offsetParent.clientWidth;
      }
    } else {
      // v4 and previous used fixed spans
      const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      // get the pixels of a span
      const pixelsPerSpan = viewPortWidth / 12;
      // multiply num spans by pixelsPerSpan
      trueWidth = Math.round(this.panel.span * pixelsPerSpan);
    }
    return trueWidth;
  }

  getPanelHeight() {
    // panel can have a fixed height set via "General" tab in panel editor
    let tmpPanelHeight = this.panel.height;
    if (typeof tmpPanelHeight === 'undefined' || tmpPanelHeight === '') {
      // grafana also supplies the height, try to use that if the panel does not have a height
      tmpPanelHeight = String(this.height);
      // v4 and earlier define this height, detect span for pre-v5
      if (typeof this.panel.span !== 'undefined') {
        // if there is no header, adjust height to use all space available
        let panelTitleOffset = 20;
        if (this.panel.title !== '') {
          panelTitleOffset = 42;
        }
        tmpPanelHeight = String(this.containerHeight - panelTitleOffset); // offset for header
      }
      if (typeof tmpPanelHeight === 'undefined') {
        // height still cannot be determined, get it from the row instead
        tmpPanelHeight = this.row.height;
        if (typeof tmpPanelHeight === 'undefined') {
          // last resort - default to 250px (this should never happen)
          tmpPanelHeight = '250';
        }
      }
    }
    // replace px
    tmpPanelHeight = tmpPanelHeight.replace('px', '');
    // convert to numeric value
    const actualHeight = parseInt(tmpPanelHeight, 10);
    return actualHeight;
  }

  clearSVG() {
    if ($('#' + this.d3DivId).length) {
      $('#' + this.d3DivId).remove();
    }
    if ($('#' + this.d3DivId + '-panel').length) {
      $('#' + this.d3DivId + '-panel').remove();
    }
    if ($('#' + this.d3DivId + '-tooltip').length) {
      $('#' + this.d3DivId + '-tooltip').remove();
    }
  }

  applyRegexPattern() {
    let seriesList = this.series;
    for (let i = 0; i < seriesList.length; i++) {
      if (this.panel.polystat.regexPattern !== '' && this.panel.polystat.regexPattern !== undefined) {
        const regexVal = stringToJsRegex(this.panel.polystat.regexPattern);
        if (seriesList[i].id && regexVal.test(seriesList[i].id.toString())) {
          const temp = regexVal.exec(seriesList[i].id.toString());
          if (!temp) {
            continue;
          }
          let extractedTxt = '';
          if (temp.length > 1) {
            temp.slice(1).forEach((value, i) => {
              if (value) {
                extractedTxt += extractedTxt.length > 0 ? ' ' + value.toString() : value.toString();
              }
            });
            seriesList[i].alias = extractedTxt;
            seriesList[i].label = extractedTxt;
          }
        }
      } else {
        seriesList[i].alias = seriesList[i].id;
        seriesList[i].label = seriesList[i].id;
      }
    }
    this.series = seriesList;
  }

  renderD3() {
    //this.setValues(this.data);
    this.clearSVG();
    if (this.panelWidth === 0) {
      this.panelWidth = this.getPanelWidthFailsafe();
    }
    this.panelHeight = this.getPanelHeight();
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = this.panelWidth;
    const height = this.panelHeight;

    margin.top = 0;
    // pre-v5, with title, set top margin to at least 7px
    if (typeof this.panel.span !== 'undefined' && this.panel.title !== '') {
      margin.top = 7;
    }
    margin.bottom = 0;

    const config: PolystatConfigs = this.panel.polystat;

    // new attributes may not be defined in older panel definitions
    if (typeof config.polygonBorderSize === 'undefined') {
      config.polygonBorderSize = 0;
    }
    if (typeof config.polygonBorderColor === 'undefined') {
      config.polygonBorderColor = '#000000';
    }

    if (this.polystatData.length === 0) {
      this.d3Object = null;
      // no data
      this.svgContainer.innerHTML = `<div
          style="text-align: center;
          vertical-align: middle;
          font-size: x-large;
          line-height: ${height}px;"
          id="${this.d3DivId}">
        NO DATA
        </div>`;
      return;
    }
    // try deep copy of data so we don't get a reference and leak
    const copiedData = _.cloneDeep(this.polystatData);
    const opt = {
      width: width,
      height: height,
      radius: config.radius,
      radiusAutoSize: config.radiusAutoSize,
      tooltipFontSize: config.tooltipFontSize,
      tooltipFontType: config.tooltipFontType,
      data: copiedData,
      displayLimit: config.displayLimit,
      globalDisplayMode: config.globalDisplayMode,
      columns: config.columns,
      columnAutoSize: config.columnAutoSize,
      rows: config.rows,
      rowAutoSize: config.rowAutoSize,
      tooltipContent: this.tooltipContent,
      animationSpeed: config.animationSpeed,
      defaultClickThrough: this.getDefaultClickThrough(NaN),
      polystat: config,
    };
    this.d3Object = null;
    this.d3Object = new D3Wrapper(this.templateSrv, this.svgContainer, this.d3DivId, opt);
    this.d3Object.draw();
  }

  removeValueMap(map) {
    const index = _.indexOf(this.panel.valueMaps, map);
    this.panel.valueMaps.splice(index, 1);
    this.render();
  }

  applyRegex() {
    this.applyRegexPattern();
    this.render();
  }

  addValueMap() {
    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
  }

  removeRangeMap(rangeMap) {
    const index = _.indexOf(this.panel.rangeMaps, rangeMap);
    this.panel.rangeMaps.splice(index, 1);
    this.render();
  }

  addRangeMap() {
    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
  }

  // Called for global or override
  onThresholdsChanged(override?: any) {
    // Query and reprocess
    this.panel.refresh();
  }

  link(scope, elem, attrs, ctrl) {
    if (!scope) {
      return;
    }
    if (!attrs) {
      return;
    }
    const panelByClass = elem.find('.grafana-d3-polystat');
    panelByClass.append('<div style="width: 100%; height: 100%;" id="' + ctrl.containerDivId + '"></div>');
    const container = panelByClass[0].childNodes[0];
    ctrl.setContainer(container);

    elem = elem.find('.grafana-d3-polystat');

    const render = () => {
      // try to get the width
      ctrl.panelWidth = elem.width();
      ctrl.renderD3();
    };
    this.events.on(PanelEvents.render, () => {
      // try to get the width
      ctrl.panelWidth = elem.width();
      render();
      ctrl.renderingCompleted();
    });
  }

  setValues() {
    const config: PolystatConfigs = this.panel.polystat;
    // ignore the above and use a timeseries
    this.polystatData.length = 0;
    this.applyRegexPattern();
    if (this.series && this.series.length > 0) {
      for (let index = 0; index < this.series.length; index++) {
        const aSeries = this.series[index];
        // omit series with no datapoints
        if (aSeries.datapoints.length > 0) {
          const converted = Transformers.TimeSeriesToPolystat(config.globalOperatorName, aSeries);
          this.polystatData.push(converted);
        }
      }
    }
    // apply global unit formatting and decimals
    this.applyGlobalFormatting(this.polystatData);
    // now sort
    this.polystatData = _.orderBy(
      this.polystatData,
      [config.hexagonSortByField],
      [this.panel.polystat.hexagonSortByDirection]
    );
    // this needs to be performed after sorting rules are applied
    // apply overrides
    if (
      this.overridesCtrl.metricOverrides.length === 0 ||
      this.overridesCtrl.metricOverrides.length !== this.panel.savedOverrides
    ) {
      this.overridesCtrl.metricOverrides = this.panel.savedOverrides;
    }
    this.overridesCtrl.applyOverrides(this.polystatData);

    // apply composites, this will filter as needed and set clickthrough
    if (
      this.compositesManager.metricComposites.length === 0 ||
      this.compositesManager.metricComposites.length !== this.panel.savedComposites
    ) {
      this.compositesManager.metricComposites = this.panel.savedComposites;
    }
    this.polystatData = this.compositesManager.applyComposites(this.polystatData);

    // apply global clickthrough to all items not set
    for (let index = 0; index < this.polystatData.length; index++) {
      if (this.polystatData[index].clickThrough.length === 0) {
        // add the series alias as a var to the clickthrough url
        this.polystatData[index].clickThrough = this.getDefaultClickThrough(index);
        this.polystatData[index].newTabEnabled = config.defaultClickThroughNewTab;
        this.polystatData[index].sanitizeURLEnabled = config.defaultClickThroughSanitize;
        this.polystatData[index].sanitizedURL = this.$sanitize(this.polystatData[index].clickThrough);
      }
    }
    // filter out by globalDisplayMode
    this.polystatData = this.filterByGlobalDisplayMode(this.polystatData);
    // now sort by field specified
    this.polystatData = SortVariableValuesByField(
      this.polystatData,
      this.panel.polystat.hexagonSortByField,
      this.panel.polystat.hexagonSortByDirection
    );
    // generate tooltips
    this.tooltipContent = Tooltip.generate(this.$scope, this.polystatData, config);
  }

  applyGlobalFormatting(data: any) {
    const mappings = convertOldAngularValueMapping(this.panel);
    for (let index = 0; index < data.length; index++) {
      // Check for mapped value, if nothing set, format value
      if (data[index].value !== null) {
        const mappedValue = getMappedValue(mappings, data[index].value.toString());
        if (mappedValue && mappedValue.text !== '') {
          data[index].valueFormatted = mappedValue.text;
        } else {
          const formatFunc = kbn.valueFormats[this.panel.polystat.globalUnitFormat];
          if (formatFunc) {
            const result = GetDecimalsForValue(data[index].value, this.panel.polystat.globalDecimals);
            data[index].valueFormatted = formatFunc(data[index].value, result.decimals, result.scaledDecimals);
            data[index].valueRounded = kbn.roundValue(data[index].value, result.decimals);
          }
        }
        // default the color to the global setting
        data[index].color = this.panel.polystat.polygonGlobalFillColor;
      }
    }
  }

  filterByGlobalDisplayMode(data: any) {
    const filteredMetrics: number[] = [];
    const compositeMetrics: PolystatModel[] = [];
    if (this.panel.polystat.globalDisplayMode !== 'all') {
      const dataLen = data.length;
      for (let i = 0; i < dataLen; i++) {
        const item = data[i];
        // keep if composite
        if (item.isComposite) {
          compositeMetrics.push(item);
        }
        if (item.thresholdLevel < 1) {
          // push the index number
          filteredMetrics.push(i);
        }
      }
      // remove filtered metrics, use splice in reverse order
      for (let i = data.length; i >= 0; i--) {
        if (_.includes(filteredMetrics, i)) {
          data.splice(i, 1);
        }
      }
      if (data.length === 0) {
        if (compositeMetrics.length > 0) {
          // set data to be all of the composites
          data = compositeMetrics;
        }
      }
    }
    return data;
  }

  onDataError(err: DataFrame[]) {
    console.log(err);
    this.onDataFramesReceived([]);
    this.render();
  }

  onSnapshotLoad(dataList: LegacyResponseData[]) {
    this.onDataFramesReceived(getProcessedDataFrames(dataList));
  }

  seriesToPolystat(globalOperatorName: string, data: any) {
    const converted = Transformers.TimeSeriesToPolystat(globalOperatorName, data);
    return converted;
  }

  tableToPolystat(globalOperatorName: string, data: any) {
    return null;
  }

  onDataFramesReceived(data: DataFrame[]) {
    // console.log(JSON.stringify(data));
    // check if data contains a field called Time of type time
    data = InsertTime(data);
    // if it does not, insert one with time "now"
    this.series = this.processor.getSeriesList({ dataList: data, range: this.range }).map((ts) => {
      ts.color = undefined; // remove whatever the processor set
      // TODO: this needs to be added to the editor options
      ts.flotpairs = ts.getFlotPairs(this.panel.nullPointMode);
      return ts;
    });

    // @ts-ignore
    this.dataWarning = null;
    const datapointsCount = _.reduce(
      this.series,
      (sum, series) => {
        return sum + series.datapoints.length;
      },
      0
    );

    if (datapointsCount === 0) {
      // @ts-ignore
      this.dataWarning = {
        title: 'No data points',
        tip: 'No datapoints returned from data query',
      };
    } else {
      for (const series of this.series) {
        if (series.isOutsideRange) {
          // @ts-ignore
          this.dataWarning = {
            title: 'Data points outside time range',
            tip: 'Can be caused by timezone mismatch or missing time filter in query',
          };
          break;
        }
      }
    }
    this.setValues();
    this.render();
  }

  seriesHandler(seriesData) {
    const series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target,
    });
    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

  invertColorOrder() {
    const tmp = this.panel.colors[0];
    this.panel.colors[0] = this.panel.colors[2];
    this.panel.colors[2] = tmp;
    this.render();
  }

  /**
   * Speed must not be less than 500ms
   */
  validateAnimationSpeed() {
    const speed = this.panel.polystat.animationSpeed;
    let newSpeed = 5000;
    if (speed) {
      if (!isNaN(parseInt(speed, 10))) {
        const checkSpeed = parseInt(speed, 10);
        if (checkSpeed >= 500) {
          newSpeed = checkSpeed;
        } else {
          // Min speed is 500
          newSpeed = 500;
        }
      }
    }
    this.panel.polystat.animationSpeed = newSpeed;
    this.render();
  }

  validateDisplayLimit() {
    const limit = this.panel.polystat.displayLimit;
    let newLimit = 100;
    if (limit === null) {
      newLimit = 0;
    } else {
      if (!isNaN(parseInt(limit, 10))) {
        const checkLimit = parseInt(limit, 10);
        if (checkLimit >= 0) {
          newLimit = checkLimit;
        }
      }
    }
    // 0 means unlimited
    if (newLimit === 0) {
      this.panel.polystat.displayLimit = '';
    } else {
      this.panel.polystat.displayLimit = newLimit;
    }
    this.render();
  }

  validateColumnValue() {
    if (this.panel.polystat.columnAutoSize) {
      this.panel.polystat.columns = '';
    } else {
      const columns = this.panel.polystat.columns;
      let newColumns = 1;
      if (columns) {
        if (!isNaN(parseInt(columns, 10))) {
          const checkColumns = parseInt(columns, 10);
          if (checkColumns > 0) {
            newColumns = checkColumns;
          }
        }
      }
      this.panel.polystat.columns = newColumns;
    }
    this.render();
  }

  validateRowValue() {
    if (this.panel.polystat.rowAutoSize) {
      this.panel.polystat.rows = '';
    } else {
      const rows = this.panel.polystat.rows;
      let newRows = 1;
      if (rows) {
        if (!isNaN(parseInt(rows, 10))) {
          const checkRows = parseInt(rows, 10);
          if (checkRows > 0) {
            newRows = checkRows;
          }
        }
      }
      this.panel.polystat.rows = newRows;
    }
    this.render();
  }

  validateRadiusValue() {
    if (this.panel.polystat.radiusAutoSize) {
      this.panel.polystat.radius = '';
    } else {
      const radius = this.panel.polystat.radius;
      let newRadius = 25;
      if (radius !== null) {
        if (!isNaN(parseInt(radius, 10))) {
          const checkRadius = parseInt(radius, 10);
          if (checkRadius > 0) {
            newRadius = checkRadius;
          }
        }
      }
      this.panel.polystat.radius = newRadius;
    }
    this.render();
  }

  validateFontColorValue() {
    if (this.panel.polystat.fontAutoColor) {
      this.panel.polystat.fontColor = '';
    } else if (!this.panel.polystat.fontColor) {
      this.panel.polystat.fontColor = 'black';
    }

    this.render();
  }

  validateBorderSizeValue() {
    const borderSize = this.panel.polystat.polygonBorderSize;
    let newBorderSize = 2;
    if (borderSize !== null) {
      if (!isNaN(parseInt(borderSize, 10))) {
        const checkBorderSize = parseInt(borderSize, 10);
        if (checkBorderSize >= 0) {
          newBorderSize = checkBorderSize;
        }
      }
    }
    this.panel.polystat.polygonBorderSize = newBorderSize;
    this.render();
  }

  getDefaultClickThrough(index: number) {
    let url = this.panel.polystat.defaultClickThrough;
    // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
    url = ClickThroughTransformer.transformSingleMetric(index, url, this.polystatData);
    url = ClickThroughTransformer.transformNthMetric(url, this.polystatData);
    // process template variables inside clickthrough
    url = this.templateSrv.replace(url, 'text');
    return url;
  }

  setGlobalUnitFormat(subItem) {
    this.panel.polystat.globalUnitFormat = subItem.value;
    this.panel.refresh();
  }
}

export { D3PolystatPanelCtrl, D3PolystatPanelCtrl as MetricsPanelCtrl };
