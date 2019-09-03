////<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import {MetricsPanelCtrl} from "app/plugins/sdk";
import _ from "lodash";
import $ from "jquery";
import kbn from "app/core/utils/kbn";
import TimeSeries from "app/core/time_series2";

import "./css/polystat.css!";
import { D3Wrapper } from "./d3wrapper";
import { Transformers } from "./transformers";
import { PolystatModel } from "./polystatmodel";
import { MetricOverridesManager, MetricOverride } from "./metric_overrides_manager";
import { CompositesManager } from "./composites_manager";
import { Tooltip } from "./tooltip";
import { GetDecimalsForValue, RGBToHex } from "./utils";
import {ClickThroughTransformer} from "./clickThroughTransformer";


class D3PolystatPanelCtrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";
  animationModes = [
    { value: "all", text: "Show All" },
    { value: "triggered", text: "Show Triggered" }
  ];
  displayModes = [
    { value: "all", text: "Show All" },
    { value: "triggered", text: "Show Triggered" }
  ];
  thresholdStates = [
    { value: 0, text: "ok" },
    { value: 1, text: "warning" },
    { value: 2, text: "critical" },
    { value: 3, text: "custom" }
  ];
  shapes = [
    { value: "hexagon_pointed_top", text: "Hexagon Pointed Top" },
    //{ value: "hexagon_flat_top", text: "Hexagon Flat Top" },
    { value: "circle", text: "Circle" },
    //{ value: "cross", text: "Cross" },
    //{ value: "diamond", text: "Diamond" },
    //{ value: "square", text: "Square" },
    //{ value: "star", text: "Star" },
    //{ value: "triangle", text: "Triangle" },
    //{ value: "wye", text: "Wye" }
  ];
  fontSizes = [
    4, 5, 6, 7, 8, 9, 10, 11, 12 , 13, 14, 15,
    16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32,
    34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
    56, 58, 60, 62, 64, 66, 68, 70];
  unitFormats = kbn.getUnitFormats();
  operatorOptions = [
    { value: "avg", text: "Average" },
    { value: "count", text: "Count" },
    { value: "current", text: "Current" },
    { value: "delta", text: "Delta" },
    { value: "diff", text: "Difference" },
    { value: "first", text: "First" },
    { value: "logmin", text: "Log Min" },
    { value: "max", text: "Max" },
    { value: "min", text: "Min" },
    { value: "name", text: "Name" },
    { value: "last_time", text: "Time of Last Point" },
    { value: "time_step", text: "Time Step" },
    { value: "total", text: "Total" }
  ];
  sortDirections = [
    { value: "asc", text: "Ascending" },
    { value: "desc", text: "Descending" }
  ];
  sortFields = [
    { value: "name", text: "Name" },
    { value: "thresholdLevel", text: "Threshold Level" },
    { value: "value", text: "Value" }
  ];

  dataRaw : any;
  polystatData: PolystatModel[];
  scoperef: any;
  alertSrvRef: any;
  initialized: boolean;
  panelContainer: any;
  d3Object: D3Wrapper;
  data: any;
  series: any[];
  templateSrv: any;
  overridesCtrl: MetricOverridesManager;
  compositesManager : CompositesManager;
  tooltipContent: string[];
  d3DivId: string;
  containerDivId: string;
  svgContainer: any;
  panelWidth: any;
  panelHeight: any;

  panelDefaults = {
    savedComposites : [],
    savedOverrides: Array<MetricOverride>(),
    colors: ["#299c46", "rgba(237, 129, 40, 0.89)", "#d44a3a"],
    polystat: {
      animationSpeed: 2500,
      columns: "",
      columnAutoSize: true,
      displayLimit: 100,
      defaultClickThrough: "",
      defaultClickThroughSanitize: false,
      fontAutoScale: true,
      fontSize: 12,
      fontType: "Roboto",
      globalUnitFormat: "short",
      globalDecimals: 2,
      globalDisplayMode: "all",
      globalOperatorName: "avg",
      globalDisplayTextTriggeredEmpty: "OK",
      gradientEnabled: true,
      hexagonSortByDirection: "asc",
      hexagonSortByField: "name",
      maxMetrics: 0,
      polygonBorderSize: 2,
      polygonBorderColor: "black",
      polygonGlobalFillColor: "#0a50a1",
      radius: "",
      radiusAutoSize: true,
      rows: "",
      rowAutoSize: true,
      shape: "hexagon_pointed_top",
      tooltipDisplayMode: "all",
      tooltipDisplayTextTriggeredEmpty: "OK",
      tooltipFontSize: 12,
      tooltipFontType: "Roboto",
      tooltipPrimarySortDirection: "desc",
      tooltipPrimarySortField: "thresholdLevel",
      tooltipSecondarySortDirection: "desc",
      tooltipSecondarySortField: "value",
      tooltipTimestampEnabled: true,
    },
  };


  constructor($scope, $injector, templateSrv, alertSrv, private $sanitize) {
    super($scope, $injector);
    // merge existing settings with our defaults
    _.defaultsDeep(this.panel, this.panelDefaults);

    this.d3DivId = "d3_svg_" + this.panel.id;
    this.containerDivId = "container_" + this.d3DivId;
    this.alertSrvRef = alertSrv;
    this.initialized = false;
    this.panelContainer = null;
    this.templateSrv = templateSrv;
    this.svgContainer = null;
    this.panelWidth = null;
    this.panelHeight = null;
    this.polystatData = new Array<PolystatModel>();
    this.d3Object = null;
    this.data = [];
    this.series = [];
    this.polystatData = [];
    this.tooltipContent = [];
    this.overridesCtrl = new MetricOverridesManager($scope, templateSrv, $sanitize, this.panel.savedOverrides);
    this.compositesManager = new CompositesManager($scope, templateSrv, $sanitize, this.panel.savedComposites);
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    this.events.on("data-received", this.onDataReceived.bind(this));
    this.events.on("data-error", this.onDataError.bind(this));
    this.events.on("data-snapshot-load", this.onDataReceived.bind(this));
  }


  onInitEditMode() {
    // determine the path to this plugin base on the name found in panel.type
    var thisPanelPath = "public/plugins/" + this.panel.type + "/";
    // add the relative path to the partial
    var optionsPath = thisPanelPath + "partials/editor.options.html";
    this.addEditorTab("Options", optionsPath, 2);
    var overridesPath = thisPanelPath + "partials/editor.overrides.html";
    this.addEditorTab("Overrides", overridesPath, 3);
    var compositesPath = thisPanelPath + "partials/editor.composites.html";
    this.addEditorTab("Composites", compositesPath, 4);
    // disabled for now
    //var mappingsPath = thisPanelPath + "partials/editor.mappings.html";
    //this.addEditorTab("Value Mappings", mappingsPath, 5);
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
    var trueWidth = 0;
    if (typeof this.panel.gridPos !== "undefined") {
      // 24 slots is fullscreen, get the viewport and divide to approximate the width
      let viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      let pixelsPerSlot = viewPortWidth / 24;
      trueWidth = Math.round(this.panel.gridPos.w * pixelsPerSlot);
      return trueWidth;
    }
    // grafana5 - use this.panel.gridPos.w, this.panel.gridPos.h
    if (typeof this.panel.span === "undefined") {
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
      var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      // get the pixels of a span
      var pixelsPerSpan = viewPortWidth / 12;
      // multiply num spans by pixelsPerSpan
      trueWidth = Math.round(this.panel.span * pixelsPerSpan);
    }
    return trueWidth;
  }

  getPanelHeight() {
    // panel can have a fixed height set via "General" tab in panel editor
    var tmpPanelHeight = this.panel.height;
    if ((typeof tmpPanelHeight === "undefined") || (tmpPanelHeight === "")) {
      // grafana also supplies the height, try to use that if the panel does not have a height
      tmpPanelHeight = String(this.height);
      // v4 and earlier define this height, detect span for pre-v5
      if (typeof this.panel.span !== "undefined") {
        // if there is no header, adjust height to use all space available
        var panelTitleOffset = 20;
        if (this.panel.title !== "") {
          panelTitleOffset = 42;
        }
        tmpPanelHeight = String(this.containerHeight - panelTitleOffset); // offset for header
      }
      if (typeof tmpPanelHeight === "undefined") {
        // height still cannot be determined, get it from the row instead
        tmpPanelHeight = this.row.height;
        if (typeof tmpPanelHeight === "undefined") {
          // last resort - default to 250px (this should never happen)
          tmpPanelHeight = "250";
        }
      }
    }
    // replace px
    tmpPanelHeight = tmpPanelHeight.replace("px", "");
    // convert to numeric value
    var actualHeight = parseInt(tmpPanelHeight, 10);
    return actualHeight;
  }

  clearSVG() {
    if ($("#" + this.d3DivId).length) {
      $("#" + this.d3DivId).remove();
    }
    if ($("#" + this.d3DivId + "-panel").length) {
      $("#" + this.d3DivId + "-panel").remove();
    }
    if ($("#" + this.d3DivId + "-tooltip").length) {
      $("#" + this.d3DivId + "-tooltip").remove();
    }
  }

  renderD3() {
    this.setValues(this.data);
    this.clearSVG();
    if (this.panelWidth === 0) {
      this.panelWidth = this.getPanelWidthFailsafe();
    }
    this.panelHeight = this.getPanelHeight();
    var margin = {top: 0, right: 0, bottom: 0, left: 0};
    var width = this.panelWidth;
    var height = this.panelHeight;

    margin.top = 0;
    // pre-v5, with title, set top margin to at least 7px
    if ((typeof this.panel.span !== "undefined") && (this.panel.title !== "")) {
      margin.top = 7;
    }
    margin.bottom = 0;

    // new attributes may not be defined in older panel definitions
    if (typeof this.panel.polystat.polygonBorderSize === "undefined") {
      this.panel.polystat.polygonBorderSize = 2;
    }
    if (typeof this.panel.polystat.polygonBorderColor === "undefined") {
      this.panel.polystat.polygonBorderColor = "black";
    }

    var opt = {
      width: width,
      height: height,
      radius : this.panel.polystat.radius,
      radiusAutoSize: this.panel.polystat.radiusAutoSize,
      tooltipFontSize: this.panel.polystat.tooltipFontSize,
      tooltipFontType: this.panel.polystat.tooltipFontType,
      data: this.polystatData,
      displayLimit: this.panel.polystat.displayLimit,
      globalDisplayMode: this.panel.polystat.globalDisplayMode,
      columns: this.panel.polystat.columns,
      columnAutoSize: this.panel.polystat.columnAutoSize,
      rows: this.panel.polystat.rows,
      rowAutoSize : this.panel.polystat.rowAutoSize,
      tooltipContent: this.tooltipContent,
      animationSpeed: this.panel.polystat.animationSpeed,
      defaultClickThrough: this.getDefaultClickThrough(NaN),
      polystat: this.panel.polystat,
    };
    this.d3Object = new D3Wrapper(this.templateSrv, this.svgContainer, this.d3DivId, opt);
    this.d3Object.draw();
  }

  removeValueMap(map) {
    var index = _.indexOf(this.panel.valueMaps, map);
    this.panel.valueMaps.splice(index, 1);
    this.render();
  }

  addValueMap() {
    this.panel.valueMaps.push({value: "", op: "=", text: "" });
  }

  removeRangeMap(rangeMap) {
    var index = _.indexOf(this.panel.rangeMaps, rangeMap);
    this.panel.rangeMaps.splice(index, 1);
    this.render();
  }

  addRangeMap() {
    this.panel.rangeMaps.push({from: "", to: "", text: ""});
  }

  link(scope, elem, attrs, ctrl) {
    if (!scope) {
       return;
    }
    if (!attrs) {
      return;
    }
    var panelByClass = elem.find(".grafana-d3-polystat");
    panelByClass.append("<div style=\"width: 100%; height: 100%;\" id=\"" + ctrl.containerDivId + "\"></div>");
    var container = panelByClass[0].childNodes[0];
    ctrl.setContainer(container);

    elem = elem.find(".grafana-d3-polystat");

    function render() {
      // try to get the width
      ctrl.panelWidth = elem.width() + 20;
      ctrl.renderD3();
    }
    this.events.on("render", function() {
      // try to get the width
      ctrl.panelWidth = elem.width() + 20;
      render();
      ctrl.renderingCompleted();
    });
  }

  setValues(dataList) {
    this.dataRaw = dataList;
    // automatically correct transform mode based on data
    if (this.dataRaw && this.dataRaw.length) {
      if (this.dataRaw[0].type === "table") {
        this.panel.transform = "table";
      } else {
        if (this.dataRaw[0].type === "docs") {
          this.panel.transform = "json";
        } else {
          if (this.panel.transform === "table" || this.panel.transform === "json") {
            this.panel.transform = "timeseries_to_rows";
          }
        }
      }
    }
    // ignore the above and use a timeseries
    this.polystatData.length = 0;
    if (this.series && this.series.length > 0) {
      for (let index = 0; index < this.series.length; index++) {
        let aSeries = this.series[index];
        let converted = Transformers.TimeSeriesToPolystat(this.panel.polystat.globalOperatorName, aSeries);
        this.polystatData.push(converted);
      }
    }
    // apply global unit formatting and decimals
    this.applyGlobalFormatting(this.polystatData);
    // now sort
    this.polystatData = _.orderBy(
      this.polystatData,
      [this.panel.polystat.hexagonSortByField],
      [this.panel.polystat.hexagonSortByDirection]);
    // this needs to be performed after sorting rules are applied
    // apply overrides
    this.overridesCtrl.applyOverrides(this.polystatData);
    // apply composites, this will filter as needed and set clickthrough
    this.polystatData = this.compositesManager.applyComposites(this.polystatData);
    // apply global clickthrough to all items not set
    for (let index = 0; index < this.polystatData.length; index++) {
      if (this.polystatData[index].clickThrough.length === 0) {
        // add the series alias as a var to the clickthroughurl
        this.polystatData[index].clickThrough = this.getDefaultClickThrough(index);
        this.polystatData[index].sanitizeURLEnabled = this.panel.polystat.defaultClickThroughSanitize;
        this.polystatData[index].sanitizedURL = this.$sanitize(this.polystatData[index].clickThrough);
      }
    }
    // filter out by globalDisplayMode
    this.polystatData = this.filterByGlobalDisplayMode(this.polystatData);
    // generate tooltips
    this.tooltipContent = Tooltip.generate(this.$scope, this.polystatData, this.panel.polystat);
  }

  applyGlobalFormatting(data: any) {
    for (let index = 0; index < data.length; index++) {
      var formatFunc = kbn.valueFormats[this.panel.polystat.globalUnitFormat];
      if (formatFunc) {
        let result = GetDecimalsForValue(data[index].value, this.panel.polystat.globalDecimals);
        data[index].valueFormatted = formatFunc(data[index].value, result.decimals, result.scaledDecimals);
        data[index].valueRounded = kbn.roundValue(data[index].value, result.decimals);
      }
      // default the color to the global setting
      data[index].color = this.panel.polystat.polygonGlobalFillColor;
    }
  }


  filterByGlobalDisplayMode(data: any) {
    let filteredMetrics = new Array<number>();
    let compositeMetrics = new Array<PolystatModel>();
    if (this.panel.polystat.globalDisplayMode !== "all") {
      let dataLen = data.length;
      for (let i = 0; i < dataLen; i++) {
        let item = data[i];
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

  onDataError(err) {
    console.log(err);
    this.onDataReceived([]);
  }

  onDataReceived(dataList) {
    this.series = dataList.map(this.seriesHandler.bind(this));
    var data = {
      value: 0,
      valueFormatted: 0,
      valueRounded: 0
    };
    this.setValues(data);
    this.data = data;
    this.render();
  }

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target,
    });
    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

  invertColorOrder() {
    var tmp = this.panel.colors[0];
    this.panel.colors[0] = this.panel.colors[2];
    this.panel.colors[2] = tmp;
    this.render();
  }

  /**
   * Speed must not be less than 500ms
   */
  validateAnimationSpeed() {
    let speed = this.panel.polystat.animationSpeed;
    let newSpeed = 5000;
    if (speed) {
      if (!isNaN(parseInt(speed, 10))) {
        let checkSpeed = parseInt(speed, 10);
        if (checkSpeed >= 500) {
          newSpeed = checkSpeed;
        }
      }
    }
    this.panel.polystat.animationSpeed = newSpeed;
    this.render();
  }

  validateColumnValue() {
    let columns = this.panel.polystat.columns;
    let newColumns = 1;
    if (columns) {
      if (!isNaN(parseInt(columns, 10))) {
        let checkColumns = parseInt(columns, 10);
        if (checkColumns > 0) {
          newColumns = checkColumns;
        }
      }
    }
    this.panel.polystat.columns = newColumns;
    this.render();
  }

  validateRowValue() {
    let rows = this.panel.polystat.rows;
    let newRows = 1;
    if (rows) {
      if (!isNaN(parseInt(rows, 10))) {
        let checkRows = parseInt(rows, 10);
        if (checkRows > 0) {
          newRows = checkRows;
        }
      }
    }
    this.panel.polystat.rows = newRows;
    this.render();
  }

  validateRadiusValue() {
    let radius = this.panel.polystat.radius;
    let newRadius = 25;
    if (radius !== null) {
      if (!isNaN(parseInt(radius, 10))) {
        let checkRadius = parseInt(radius, 10);
        if (checkRadius > 0) {
          newRadius = checkRadius;
        }
      }
    }
    this.panel.polystat.radius = newRadius;
    this.render();
  }

  validateBorderSizeValue() {
    let borderSize = this.panel.polystat.polygonBorderSize;
    let newBorderSize = 2;
    if (borderSize !== null) {
      if (!isNaN(parseInt(borderSize, 10))) {
        let checkBorderSize = parseInt(borderSize, 10);
        if (checkBorderSize >= 0) {
          newBorderSize = checkBorderSize;
        }
      }
    }
    this.panel.polystat.polygonBorderSize = newBorderSize;
    this.render();
  }

  updatePolygonBorderColor() {
    this.panel.polystat.polygonBorderColor = RGBToHex(this.panel.polystat.polygonBorderColor);
    this.render();
  }

  updatePolygonGlobalFillColor() {
    this.panel.polystat.polygonGlobalFillColor = RGBToHex(this.panel.polystat.polygonGlobalFillColor);
    this.render();
  }

  getDefaultClickThrough(index: number) {
    let url = this.panel.polystat.defaultClickThrough;
    // apply both types of transforms, one targeted at the data item index, and secondly the nth variant
    url = ClickThroughTransformer.tranformSingleMetric(index, url, this.polystatData);
    url = ClickThroughTransformer.tranformNthMetric(url, this.polystatData);
    // process template variables inside clickthrough
    url = this.templateSrv.replaceWithText(url);
    return url;
  }

  setGlobalUnitFormat(subItem) {
    this.panel.polystat.globalUnitFormat = subItem.value;
  }
}


export {
  D3PolystatPanelCtrl,
  D3PolystatPanelCtrl as MetricsPanelCtrl
};
