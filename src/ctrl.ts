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
import { MetricOverridesManager } from "./metric_overrides_manager";
import { CompositesManager } from "./composites_manager";
import { Tooltip } from "./tooltip";

const panelDefaults = {
  animationModes: [
    { value: "all", text: "Show All" },
    { value: "triggered", text: "Show Triggered" },
  ],
  displayModes: [
    { value: "all", text: "Show All" },
    { value: "triggered", text: "Show Triggered" },
  ],
  savedComposites : [],
  savedOverrides : [],
  fontSizes: [
    4, 5, 6, 7, 8, 9, 10, 11, 12 , 13, 14, 15,
    16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32,
    34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
    56, 58, 60, 62, 64, 66, 68, 70],
  fontTypes: [
    "normal", "Arial", "Avant Garde", "Bookman",
    "Consolas", "Courier", "Courier New", "Futura",
    "Garamond", "Helvetica", "Open Sans",
    "Palatino", "Times", "Times New Roman",
    "Verdana"
  ],
  unitFormats: kbn.getUnitFormats(),
  operatorOptions: [
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
    { value: "total", text: "Total" },
  ],
  operatorName: "avg", // operator applied to time series
  colors: ["#299c46", "rgba(237, 129, 40, 0.89)", "#d44a3a"],
  notcolors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
  decimals: 2, // decimal precision
  format: "none", // unit format
  sortDirections: [
    "Ascending",
    "Descending",
  ],
  sortFields: [
    "Name",
    "Threshold Level",
    "Value",
  ],
  polystat: {
    globalDisplayMode: "All",
    globalOperatorName: "avg",
    rows: "auto",
    rowAutoSize: true,
    columns: "auto",
    columnAutoSize: true,
    displayLimit: 100,
    maxMetrics: 0,
    radius: "auto",
    radiusAutoSize: true,
    tooltipFontSize: 12,
    tooltipFontType: "normal",
    animationSpeed: 2500,
    defaultClickThrough: "",
    defaultClickThroughSanitize: true,
    hexagonSortByDirection: "Ascending",
    hexagonSortByField: "Name",
    tooltipPrimarySortDirection: "Ascending",
    tooltipPrimarySortField: "Name",
    tooltipSecondarySortDirection: "Descending",
    tooltipSecondarySortField: "Value",
    tooltipTimestampEnabled: true,
    fontSize: 12,
    fontAutoScale: false,
  },
};

class D3PolystatPanelCtrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";
  dataRaw : any;
  polystatData: PolystatModel[];
  containerDivId: any;
  scoperef: any;
  alertSrvRef: any;
  initialized: boolean;
  panelContainer: any;
  panelWidth: any;
  panelHeight: any;
  d3Object: D3Wrapper;
  data: any;
  series: any[];
  templateSrv: any;
  overridesCtrl: MetricOverridesManager;
  compositesManager : CompositesManager;
  tooltipContent: string[];

  constructor($scope, $injector, templateSrv, alertSrv, private $sanitize) {
    super($scope, $injector);
    // merge existing settings with our defaults
    _.defaults(this.panel, panelDefaults);
    this.panel.d3DivId = "d3_svg_" + this.panel.id;
    this.containerDivId = "container_" + this.panel.d3DivId;
    this.alertSrvRef = alertSrv;
    this.initialized = false;
    this.panelContainer = null;
    this.templateSrv = templateSrv;
    this.panel.svgContainer = null;
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
    var mappingsPath = thisPanelPath + "partials/editor.mappings.html";
    this.addEditorTab("Value Mappings", mappingsPath, 5);
  }

  /**
   * [setContainer description]
   * @param {[type]} container [description]
   */
  setContainer(container) {
    this.panelContainer = container;
    this.panel.svgContainer = container;
  }

  // determine the width of a panel by the span and viewport
  getPanelWidth() {
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
    if ($("#" + this.panel.d3DivId).length) {
      $("#" + this.panel.d3DivId).remove();
    }
    if ($("#" + this.panel.d3DivId + "-panel").length) {
      $("#" + this.panel.d3DivId + "-panel").remove();
    }
    if ($("#" + this.panel.d3DivId + "-tooltip").length) {
      $("#" + this.panel.d3DivId + "-tooltip").remove();
    }
  }

  renderD3() {
    this.setValues(this.data);
    this.clearSVG();
    this.panelWidth = this.getPanelWidth();
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
      defaultClickThrough: this.getDefaultClickThrough(),
      polystat: this.panel.polystat,
    };
    this.d3Object = new D3Wrapper(this.templateSrv, this.panel.svgContainer, this.panel.d3DivId, opt);
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
    var d3ByClass = elem.find(".grafana-d3-polystat");
    d3ByClass.append("<div id=\"" + ctrl.containerDivId + "\"></div>");
    var container = d3ByClass[0].childNodes[0];
    ctrl.setContainer(container);
    function render() {
      ctrl.renderD3();
    }
    this.events.on("render", function() {
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
    //debugger;
    // ignore the above and use a timeseries
    this.polystatData.length = 0;
    if (this.series && this.series.length > 0) {
      for (let index = 0; index < this.series.length; index++) {
        let aSeries = this.series[index];
        let converted = Transformers.TimeSeriesToPolystat(this.panel.polystat.globalOperatorName, aSeries);
        this.polystatData.push(converted);
      }
    }
    // apply overrides
    this.overridesCtrl.applyOverrides(this.polystatData);
    // apply composites, this will filter as needed and set clickthrough
    this.polystatData = this.compositesManager.applyComposites(this.polystatData);
    // apply global clickthrough to all items not set
    for (let index = 0; index < this.polystatData.length; index++) {
      if (this.polystatData[index].clickThrough.length === 0) {
        this.polystatData[index].clickThrough = this.getDefaultClickThrough();
      }
    }
    // now sort
    //this.polystatData = _.orderBy(this.polystatData, ["name"], ["desc"]);
    let hexagonSortDirection = "asc";
    switch (this.panel.polystat.hexagonSortByDirection) {
      case "Ascending":
        hexagonSortDirection = "asc";
        break;
      case "Descending":
        hexagonSortDirection = "desc";
        break;
    }
    let hexagonSortField = "name";
    switch (this.panel.polystat.hexagonSortByField) {
      case "Name":
        hexagonSortField = "name";
        break;
      case "Threshold Level":
        hexagonSortField = "thresholdLevel";
        break;
      case "Value":
        hexagonSortField = "value";
        break;
    }
    this.polystatData = _.orderBy(this.polystatData, [hexagonSortField], [hexagonSortDirection]);
    // filter out by globalDisplayMode
    this.polystatData = this.filterByGlobalDisplayMode(this.polystatData);
    // generate tooltips
    this.tooltipContent = Tooltip.generate(this.$scope, this.polystatData, this.panel.polystat.tooltipTimestampEnabled);
  }

  filterByGlobalDisplayMode(data: any) {
    let filteredMetrics = [];
    if (this.panel.polystat.globalDisplayMode !== "all") {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.thresholdLevel < 1) {
          filteredMetrics.push(item);
        }
      }
      for (let i = 0; i < filteredMetrics.length; i++) {
        data.splice(filteredMetrics[i], 1);
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
    if (radius) {
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

  getDefaultClickThrough() {
    let url = this.panel.polystat.defaultClickThrough;
    if ((url) && (this.panel.polystat.defaultClickThroughSanitize)) {
      url = this.$sanitize(url);
    }
    return url;
  }
}


export {
  D3PolystatPanelCtrl,
  D3PolystatPanelCtrl as MetricsPanelCtrl
};
