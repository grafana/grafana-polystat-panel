System.register(["app/plugins/sdk", "lodash", "jquery", "app/core/utils/kbn", "app/core/time_series2", "./css/polystat.css!", "./d3wrapper", "./transformers", "./metric_overrides_manager", "./composites_manager", "./tooltip", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var sdk_1, lodash_1, jquery_1, kbn_1, time_series2_1, d3wrapper_1, transformers_1, metric_overrides_manager_1, composites_manager_1, tooltip_1, utils_1, D3PolystatPanelCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (_1) {
            },
            function (d3wrapper_1_1) {
                d3wrapper_1 = d3wrapper_1_1;
            },
            function (transformers_1_1) {
                transformers_1 = transformers_1_1;
            },
            function (metric_overrides_manager_1_1) {
                metric_overrides_manager_1 = metric_overrides_manager_1_1;
            },
            function (composites_manager_1_1) {
                composites_manager_1 = composites_manager_1_1;
            },
            function (tooltip_1_1) {
                tooltip_1 = tooltip_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            D3PolystatPanelCtrl = (function (_super) {
                __extends(D3PolystatPanelCtrl, _super);
                function D3PolystatPanelCtrl($scope, $injector, templateSrv, alertSrv, $sanitize) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$sanitize = $sanitize;
                    _this.animationModes = [
                        { value: "all", text: "Show All" },
                        { value: "triggered", text: "Show Triggered" }
                    ];
                    _this.displayModes = [
                        { value: "all", text: "Show All" },
                        { value: "triggered", text: "Show Triggered" }
                    ];
                    _this.thresholdStates = [
                        { value: 0, text: "ok" },
                        { value: 1, text: "warning" },
                        { value: 2, text: "critical" },
                        { value: 3, text: "custom" }
                    ];
                    _this.shapes = [
                        { value: "hexagon_pointed_top", text: "Hexagon Pointed Top" },
                        { value: "circle", text: "Circle" },
                    ];
                    _this.fontSizes = [
                        4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32,
                        34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
                        56, 58, 60, 62, 64, 66, 68, 70
                    ];
                    _this.fontTypes = [
                        "Open Sans", "Arial", "Avant Garde", "Bookman",
                        "Consolas", "Courier", "Courier New", "Futura",
                        "Garamond", "Helvetica",
                        "Palatino", "Roboto", "Times", "Times New Roman",
                        "Verdana"
                    ];
                    _this.unitFormats = kbn_1.default.getUnitFormats();
                    _this.operatorOptions = [
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
                    _this.sortDirections = [
                        { value: "asc", text: "Ascending" },
                        { value: "desc", text: "Descending" }
                    ];
                    _this.sortFields = [
                        { value: "name", text: "Name" },
                        { value: "thresholdLevel", text: "Threshold Level" },
                        { value: "value", text: "Value" }
                    ];
                    _this.panelDefaults = {
                        savedComposites: [],
                        savedOverrides: [],
                        colors: ["#299c46", "rgba(237, 129, 40, 0.89)", "#d44a3a"],
                        polystat: {
                            animationSpeed: 2500,
                            columns: "",
                            columnAutoSize: true,
                            displayLimit: 100,
                            defaultClickThrough: "",
                            defaultClickThroughSanitize: true,
                            fontAutoScale: true,
                            fontSize: 12,
                            fontType: "Roboto",
                            globalUnitFormat: "short",
                            globalDecimals: 2,
                            globalDisplayMode: "all",
                            globalOperatorName: "avg",
                            gradientEnabled: true,
                            hexagonSortByDirection: "asc",
                            hexagonSortByField: "name",
                            maxMetrics: 0,
                            polygonBorderSize: 2,
                            polygonBorderColor: "black",
                            polygonGlobalFillColor: "white",
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
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.d3DivId = "d3_svg_" + _this.panel.id;
                    _this.containerDivId = "container_" + _this.d3DivId;
                    _this.alertSrvRef = alertSrv;
                    _this.initialized = false;
                    _this.panelContainer = null;
                    _this.templateSrv = templateSrv;
                    _this.svgContainer = null;
                    _this.panelWidth = null;
                    _this.panelHeight = null;
                    _this.polystatData = new Array();
                    _this.d3Object = null;
                    _this.data = [];
                    _this.series = [];
                    _this.polystatData = [];
                    _this.tooltipContent = [];
                    _this.overridesCtrl = new metric_overrides_manager_1.MetricOverridesManager($scope, templateSrv, $sanitize, _this.panel.savedOverrides);
                    _this.compositesManager = new composites_manager_1.CompositesManager($scope, templateSrv, $sanitize, _this.panel.savedComposites);
                    _this.events.on("init-edit-mode", _this.onInitEditMode.bind(_this));
                    _this.events.on("data-received", _this.onDataReceived.bind(_this));
                    _this.events.on("data-error", _this.onDataError.bind(_this));
                    _this.events.on("data-snapshot-load", _this.onDataReceived.bind(_this));
                    return _this;
                }
                D3PolystatPanelCtrl.prototype.onInitEditMode = function () {
                    var thisPanelPath = "public/plugins/" + this.panel.type + "/";
                    var optionsPath = thisPanelPath + "partials/editor.options.html";
                    this.addEditorTab("Options", optionsPath, 2);
                    var overridesPath = thisPanelPath + "partials/editor.overrides.html";
                    this.addEditorTab("Overrides", overridesPath, 3);
                    var compositesPath = thisPanelPath + "partials/editor.composites.html";
                    this.addEditorTab("Composites", compositesPath, 4);
                };
                D3PolystatPanelCtrl.prototype.setContainer = function (container) {
                    this.panelContainer = container;
                    this.svgContainer = container;
                };
                D3PolystatPanelCtrl.prototype.getPanelWidthFailsafe = function () {
                    var trueWidth = 0;
                    if (typeof this.panel.gridPos !== "undefined") {
                        var viewPortWidth_1 = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                        var pixelsPerSlot = viewPortWidth_1 / 24;
                        trueWidth = Math.round(this.panel.gridPos.w * pixelsPerSlot);
                        return trueWidth;
                    }
                    if (typeof this.panel.span === "undefined") {
                        if (this.editModeInitiated) {
                            trueWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
                        }
                        else {
                            trueWidth = this.panelContainer.offsetParent.clientWidth;
                        }
                    }
                    else {
                        var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                        var pixelsPerSpan = viewPortWidth / 12;
                        trueWidth = Math.round(this.panel.span * pixelsPerSpan);
                    }
                    return trueWidth;
                };
                D3PolystatPanelCtrl.prototype.getPanelHeight = function () {
                    var tmpPanelHeight = this.panel.height;
                    if ((typeof tmpPanelHeight === "undefined") || (tmpPanelHeight === "")) {
                        tmpPanelHeight = String(this.height);
                        if (typeof this.panel.span !== "undefined") {
                            var panelTitleOffset = 20;
                            if (this.panel.title !== "") {
                                panelTitleOffset = 42;
                            }
                            tmpPanelHeight = String(this.containerHeight - panelTitleOffset);
                        }
                        if (typeof tmpPanelHeight === "undefined") {
                            tmpPanelHeight = this.row.height;
                            if (typeof tmpPanelHeight === "undefined") {
                                tmpPanelHeight = "250";
                            }
                        }
                    }
                    tmpPanelHeight = tmpPanelHeight.replace("px", "");
                    var actualHeight = parseInt(tmpPanelHeight, 10);
                    return actualHeight;
                };
                D3PolystatPanelCtrl.prototype.clearSVG = function () {
                    if (jquery_1.default("#" + this.d3DivId).length) {
                        jquery_1.default("#" + this.d3DivId).remove();
                    }
                    if (jquery_1.default("#" + this.d3DivId + "-panel").length) {
                        jquery_1.default("#" + this.d3DivId + "-panel").remove();
                    }
                    if (jquery_1.default("#" + this.d3DivId + "-tooltip").length) {
                        jquery_1.default("#" + this.d3DivId + "-tooltip").remove();
                    }
                };
                D3PolystatPanelCtrl.prototype.renderD3 = function () {
                    this.setValues(this.data);
                    this.clearSVG();
                    if (this.panelWidth === 0) {
                        this.panelWidth = this.getPanelWidthFailsafe();
                    }
                    this.panelHeight = this.getPanelHeight();
                    var margin = { top: 0, right: 0, bottom: 0, left: 0 };
                    var width = this.panelWidth;
                    var height = this.panelHeight;
                    margin.top = 0;
                    if ((typeof this.panel.span !== "undefined") && (this.panel.title !== "")) {
                        margin.top = 7;
                    }
                    margin.bottom = 0;
                    if (typeof this.panel.polystat.polygonBorderSize === "undefined") {
                        this.panel.polystat.polygonBorderSize = 2;
                    }
                    if (typeof this.panel.polystat.polygonBorderColor === "undefined") {
                        this.panel.polystat.polygonBorderColor = "black";
                    }
                    var opt = {
                        width: width,
                        height: height,
                        radius: this.panel.polystat.radius,
                        radiusAutoSize: this.panel.polystat.radiusAutoSize,
                        tooltipFontSize: this.panel.polystat.tooltipFontSize,
                        tooltipFontType: this.panel.polystat.tooltipFontType,
                        data: this.polystatData,
                        displayLimit: this.panel.polystat.displayLimit,
                        globalDisplayMode: this.panel.polystat.globalDisplayMode,
                        columns: this.panel.polystat.columns,
                        columnAutoSize: this.panel.polystat.columnAutoSize,
                        rows: this.panel.polystat.rows,
                        rowAutoSize: this.panel.polystat.rowAutoSize,
                        tooltipContent: this.tooltipContent,
                        animationSpeed: this.panel.polystat.animationSpeed,
                        defaultClickThrough: this.getDefaultClickThrough(),
                        polystat: this.panel.polystat,
                    };
                    this.d3Object = new d3wrapper_1.D3Wrapper(this.templateSrv, this.svgContainer, this.d3DivId, opt);
                    this.d3Object.draw();
                };
                D3PolystatPanelCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: "", op: "=", text: "" });
                };
                D3PolystatPanelCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: "", to: "", text: "" });
                };
                D3PolystatPanelCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
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
                    elem = elem.find(".grafana-d3-polystat");
                    function render() {
                        ctrl.panelWidth = elem.width() + 20;
                        ctrl.renderD3();
                    }
                    this.events.on("render", function () {
                        ctrl.panelWidth = elem.width() + 20;
                        render();
                        ctrl.renderingCompleted();
                    });
                };
                D3PolystatPanelCtrl.prototype.setValues = function (dataList) {
                    this.dataRaw = dataList;
                    if (this.dataRaw && this.dataRaw.length) {
                        if (this.dataRaw[0].type === "table") {
                            this.panel.transform = "table";
                        }
                        else {
                            if (this.dataRaw[0].type === "docs") {
                                this.panel.transform = "json";
                            }
                            else {
                                if (this.panel.transform === "table" || this.panel.transform === "json") {
                                    this.panel.transform = "timeseries_to_rows";
                                }
                            }
                        }
                    }
                    this.polystatData.length = 0;
                    if (this.series && this.series.length > 0) {
                        for (var index = 0; index < this.series.length; index++) {
                            var aSeries = this.series[index];
                            var converted = transformers_1.Transformers.TimeSeriesToPolystat(this.panel.polystat.globalOperatorName, aSeries);
                            this.polystatData.push(converted);
                        }
                    }
                    this.applyGlobalFormatting(this.polystatData);
                    this.overridesCtrl.applyOverrides(this.polystatData);
                    this.polystatData = this.compositesManager.applyComposites(this.polystatData);
                    for (var index = 0; index < this.polystatData.length; index++) {
                        if (this.polystatData[index].clickThrough.length === 0) {
                            this.polystatData[index].clickThrough = this.getDefaultClickThrough();
                        }
                    }
                    this.polystatData = this.filterByGlobalDisplayMode(this.polystatData);
                    this.polystatData = lodash_1.default.orderBy(this.polystatData, [this.panel.polystat.hexagonSortByField], [this.panel.polystat.hexagonSortByDirection]);
                    this.tooltipContent = tooltip_1.Tooltip.generate(this.$scope, this.polystatData, this.panel.polystat);
                };
                D3PolystatPanelCtrl.prototype.applyGlobalFormatting = function (data) {
                    for (var index = 0; index < data.length; index++) {
                        var formatFunc = kbn_1.default.valueFormats[this.panel.polystat.globalUnitFormat];
                        if (formatFunc) {
                            var result = utils_1.GetDecimalsForValue(data[index].value, this.panel.polystat.globalDecimals);
                            data[index].valueFormatted = formatFunc(data[index].value, result.decimals, result.scaledDecimals);
                            data[index].valueRounded = kbn_1.default.roundValue(data[index].value, result.decimals);
                        }
                        data[index].color = this.panel.polystat.polygonGlobalFillColor;
                    }
                };
                D3PolystatPanelCtrl.prototype.filterByGlobalDisplayMode = function (data) {
                    var filteredMetrics = new Array();
                    var compositeMetrics = new Array();
                    if (this.panel.polystat.globalDisplayMode !== "all") {
                        var dataLen = data.length;
                        for (var i = 0; i < dataLen; i++) {
                            var item = data[i];
                            if (item.isComposite) {
                                compositeMetrics.push(item);
                            }
                            if (item.thresholdLevel < 1) {
                                filteredMetrics.push(i);
                            }
                        }
                        for (var i = data.length; i >= 0; i--) {
                            if (lodash_1.default.includes(filteredMetrics, i)) {
                                data.splice(i, 1);
                            }
                        }
                        if (data.length === 0) {
                            if (compositeMetrics.length > 0) {
                                data = compositeMetrics;
                            }
                        }
                    }
                    return data;
                };
                D3PolystatPanelCtrl.prototype.onDataError = function (err) {
                    console.log(err);
                    this.onDataReceived([]);
                };
                D3PolystatPanelCtrl.prototype.onDataReceived = function (dataList) {
                    this.series = dataList.map(this.seriesHandler.bind(this));
                    var data = {
                        value: 0,
                        valueFormatted: 0,
                        valueRounded: 0
                    };
                    this.setValues(data);
                    this.data = data;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new time_series2_1.default({
                        datapoints: seriesData.datapoints,
                        alias: seriesData.target,
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    return series;
                };
                D3PolystatPanelCtrl.prototype.invertColorOrder = function () {
                    var tmp = this.panel.colors[0];
                    this.panel.colors[0] = this.panel.colors[2];
                    this.panel.colors[2] = tmp;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateAnimationSpeed = function () {
                    var speed = this.panel.polystat.animationSpeed;
                    var newSpeed = 5000;
                    if (speed) {
                        if (!isNaN(parseInt(speed, 10))) {
                            var checkSpeed = parseInt(speed, 10);
                            if (checkSpeed >= 500) {
                                newSpeed = checkSpeed;
                            }
                        }
                    }
                    this.panel.polystat.animationSpeed = newSpeed;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateColumnValue = function () {
                    var columns = this.panel.polystat.columns;
                    var newColumns = 1;
                    if (columns) {
                        if (!isNaN(parseInt(columns, 10))) {
                            var checkColumns = parseInt(columns, 10);
                            if (checkColumns > 0) {
                                newColumns = checkColumns;
                            }
                        }
                    }
                    this.panel.polystat.columns = newColumns;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateRowValue = function () {
                    var rows = this.panel.polystat.rows;
                    var newRows = 1;
                    if (rows) {
                        if (!isNaN(parseInt(rows, 10))) {
                            var checkRows = parseInt(rows, 10);
                            if (checkRows > 0) {
                                newRows = checkRows;
                            }
                        }
                    }
                    this.panel.polystat.rows = newRows;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateRadiusValue = function () {
                    var radius = this.panel.polystat.radius;
                    var newRadius = 25;
                    if (radius !== null) {
                        if (!isNaN(parseInt(radius, 10))) {
                            var checkRadius = parseInt(radius, 10);
                            if (checkRadius > 0) {
                                newRadius = checkRadius;
                            }
                        }
                    }
                    this.panel.polystat.radius = newRadius;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateBorderSizeValue = function () {
                    var borderSize = this.panel.polystat.polygonBorderSize;
                    var newBorderSize = 2;
                    if (borderSize !== null) {
                        if (!isNaN(parseInt(borderSize, 10))) {
                            var checkBorderSize = parseInt(borderSize, 10);
                            if (checkBorderSize >= 0) {
                                newBorderSize = checkBorderSize;
                            }
                        }
                    }
                    this.panel.polystat.polygonBorderSize = newBorderSize;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.updatePolygonBorderColor = function () {
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.updatePolygonGlobalFillColor = function () {
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.getDefaultClickThrough = function () {
                    var url = this.panel.polystat.defaultClickThrough;
                    if ((url) && (this.panel.polystat.defaultClickThroughSanitize)) {
                        url = this.$sanitize(url);
                    }
                    return url;
                };
                D3PolystatPanelCtrl.prototype.setGlobalUnitFormat = function (subItem) {
                    this.panel.polystat.globalUnitFormat = subItem.value;
                };
                D3PolystatPanelCtrl.templateUrl = "partials/template.html";
                return D3PolystatPanelCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("D3PolystatPanelCtrl", D3PolystatPanelCtrl);
            exports_1("MetricsPanelCtrl", D3PolystatPanelCtrl);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFpQmtDLHVDQUFnQjtnQkErSGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F3QnpCO29CQXpCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkE3SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUssRUFBRSxR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QUMsQ0FBQztxQkFDM0I7b0JBQ0QsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxpREFBbUIsR0FBbkIsVUFBb0IsT0FBTztvQkFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDdkQsQ0FBQztnQkE1akJNLCtCQUFXLEdBQUcsd0JBQXdCLENBQUM7Z0JBNmpCaEQsMEJBQUM7YUFBQSxBQTlqQkQsQ0FBa0Msc0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5pbXBvcnQge01ldHJpY3NQYW5lbEN0cmx9IGZyb20gXCJhcHAvcGx1Z2lucy9zZGtcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSBcImFwcC9jb3JlL3RpbWVfc2VyaWVzMlwiO1xuXG5pbXBvcnQgXCIuL2Nzcy9wb2x5c3RhdC5jc3MhXCI7XG5pbXBvcnQgeyBEM1dyYXBwZXIgfSBmcm9tIFwiLi9kM3dyYXBwZXJcIjtcbmltcG9ydCB7IFRyYW5zZm9ybWVycyB9IGZyb20gXCIuL3RyYW5zZm9ybWVyc1wiO1xuaW1wb3J0IHsgUG9seXN0YXRNb2RlbCB9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7IE1ldHJpY092ZXJyaWRlc01hbmFnZXIgfSBmcm9tIFwiLi9tZXRyaWNfb3ZlcnJpZGVzX21hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvc2l0ZXNNYW5hZ2VyIH0gZnJvbSBcIi4vY29tcG9zaXRlc19tYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb29sdGlwIH0gZnJvbSBcIi4vdG9vbHRpcFwiO1xuaW1wb3J0IHsgR2V0RGVjaW1hbHNGb3JWYWx1ZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuY2xhc3MgRDNQb2x5c3RhdFBhbmVsQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xuICBzdGF0aWMgdGVtcGxhdGVVcmwgPSBcInBhcnRpYWxzL3RlbXBsYXRlLmh0bWxcIjtcbiAgYW5pbWF0aW9uTW9kZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJhbGxcIiwgdGV4dDogXCJTaG93IEFsbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH1cbiAgXTtcbiAgZGlzcGxheU1vZGVzID0gW1xuICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgIHsgdmFsdWU6IFwidHJpZ2dlcmVkXCIsIHRleHQ6IFwiU2hvdyBUcmlnZ2VyZWRcIiB9XG4gIF07XG4gIHRocmVzaG9sZFN0YXRlcyA9IFtcbiAgICB7IHZhbHVlOiAwLCB0ZXh0OiBcIm9rXCIgfSxcbiAgICB7IHZhbHVlOiAxLCB0ZXh0OiBcIndhcm5pbmdcIiB9LFxuICAgIHsgdmFsdWU6IDIsIHRleHQ6IFwiY3JpdGljYWxcIiB9LFxuICAgIHsgdmFsdWU6IDMsIHRleHQ6IFwiY3VzdG9tXCIgfVxuICBdO1xuICBzaGFwZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBQb2ludGVkIFRvcFwiIH0sXG4gICAgLy97IHZhbHVlOiBcImhleGFnb25fZmxhdF90b3BcIiwgdGV4dDogXCJIZXhhZ29uIEZsYXQgVG9wXCIgfSxcbiAgICB7IHZhbHVlOiBcImNpcmNsZVwiLCB0ZXh0OiBcIkNpcmNsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcImNyb3NzXCIsIHRleHQ6IFwiQ3Jvc3NcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJkaWFtb25kXCIsIHRleHQ6IFwiRGlhbW9uZFwiIH0sXG4gICAgLy97IHZhbHVlOiBcInNxdWFyZVwiLCB0ZXh0OiBcIlNxdWFyZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInN0YXJcIiwgdGV4dDogXCJTdGFyXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwidHJpYW5nbGVcIiwgdGV4dDogXCJUcmlhbmdsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInd5ZVwiLCB0ZXh0OiBcIld5ZVwiIH1cbiAgXTtcbiAgZm9udFNpemVzID0gW1xuICAgIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIgLCAxMywgMTQsIDE1LFxuICAgIDE2LCAxNywgMTgsIDE5LCAyMCwgMjIsIDI0LCAyNiwgMjgsIDMwLCAzMixcbiAgICAzNCwgMzYsIDM4LCA0MCwgNDIsIDQ0LCA0NiwgNDgsIDUwLCA1MiwgNTQsXG4gICAgNTYsIDU4LCA2MCwgNjIsIDY0LCA2NiwgNjgsIDcwXTtcbiAgZm9udFR5cGVzID0gW1xuICAgIFwiT3BlbiBTYW5zXCIsIFwiQXJpYWxcIiwgXCJBdmFudCBHYXJkZVwiLCBcIkJvb2ttYW5cIixcbiAgICBcIkNvbnNvbGFzXCIsIFwiQ291cmllclwiLCBcIkNvdXJpZXIgTmV3XCIsIFwiRnV0dXJhXCIsXG4gICAgXCJHYXJhbW9uZFwiLCBcIkhlbHZldGljYVwiLFxuICAgIFwiUGFsYXRpbm9cIiwgXCJSb2JvdG9cIiwgXCJUaW1lc1wiLCBcIlRpbWVzIE5ldyBSb21hblwiLFxuICAgIFwiVmVyZGFuYVwiXG4gIF07XG4gIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIG9wZXJhdG9yT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiBcImF2Z1wiLCB0ZXh0OiBcIkF2ZXJhZ2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiY291bnRcIiwgdGV4dDogXCJDb3VudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjdXJyZW50XCIsIHRleHQ6IFwiQ3VycmVudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZWx0YVwiLCB0ZXh0OiBcIkRlbHRhXCIgfSxcbiAgICB7IHZhbHVlOiBcImRpZmZcIiwgdGV4dDogXCJEaWZmZXJlbmNlXCIgfSxcbiAgICB7IHZhbHVlOiBcImZpcnN0XCIsIHRleHQ6IFwiRmlyc3RcIiB9LFxuICAgIHsgdmFsdWU6IFwibG9nbWluXCIsIHRleHQ6IFwiTG9nIE1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJtYXhcIiwgdGV4dDogXCJNYXhcIiB9LFxuICAgIHsgdmFsdWU6IFwibWluXCIsIHRleHQ6IFwiTWluXCIgfSxcbiAgICB7IHZhbHVlOiBcIm5hbWVcIiwgdGV4dDogXCJOYW1lXCIgfSxcbiAgICB7IHZhbHVlOiBcImxhc3RfdGltZVwiLCB0ZXh0OiBcIlRpbWUgb2YgTGFzdCBQb2ludFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aW1lX3N0ZXBcIiwgdGV4dDogXCJUaW1lIFN0ZXBcIiB9LFxuICAgIHsgdmFsdWU6IFwidG90YWxcIiwgdGV4dDogXCJUb3RhbFwiIH1cbiAgXTtcbiAgc29ydERpcmVjdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhc2NcIiwgdGV4dDogXCJBc2NlbmRpbmdcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVzY1wiLCB0ZXh0OiBcIkRlc2NlbmRpbmdcIiB9XG4gIF07XG4gIHNvcnRGaWVsZHMgPSBbXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aHJlc2hvbGRMZXZlbFwiLCB0ZXh0OiBcIlRocmVzaG9sZCBMZXZlbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ2YWx1ZVwiLCB0ZXh0OiBcIlZhbHVlXCIgfVxuICBdO1xuXG4gIGRhdGFSYXcgOiBhbnk7XG4gIHBvbHlzdGF0RGF0YTogUG9seXN0YXRNb2RlbFtdO1xuICBzY29wZXJlZjogYW55O1xuICBhbGVydFNydlJlZjogYW55O1xuICBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcGFuZWxDb250YWluZXI6IGFueTtcbiAgZDNPYmplY3Q6IEQzV3JhcHBlcjtcbiAgZGF0YTogYW55O1xuICBzZXJpZXM6IGFueVtdO1xuICB0ZW1wbGF0ZVNydjogYW55O1xuICBvdmVycmlkZXNDdHJsOiBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyO1xuICBjb21wb3NpdGVzTWFuYWdlciA6IENvbXBvc2l0ZXNNYW5hZ2VyO1xuICB0b29sdGlwQ29udGVudDogc3RyaW5nW107XG4gIGQzRGl2SWQ6IHN0cmluZztcbiAgY29udGFpbmVyRGl2SWQ6IHN0cmluZztcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIHBhbmVsV2lkdGg6IGFueTtcbiAgcGFuZWxIZWlnaHQ6IGFueTtcblxuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIHNhdmVkQ29tcG9zaXRlcyA6IFtdLFxuICAgIHNhdmVkT3ZlcnJpZGVzIDogW10sXG4gICAgY29sb3JzOiBbXCIjMjk5YzQ2XCIsIFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCIsIFwiI2Q0NGEzYVwiXSxcbiAgICBwb2x5c3RhdDoge1xuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MDAsXG4gICAgICBjb2x1bW5zOiBcIlwiLFxuICAgICAgY29sdW1uQXV0b1NpemU6IHRydWUsXG4gICAgICBkaXNwbGF5TGltaXQ6IDEwMCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IFwiXCIsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemU6IHRydWUsXG4gICAgICBmb250QXV0b1NjYWxlOiB0cnVlLFxuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICBnbG9iYWxVbml0Rm9ybWF0OiBcInNob3J0XCIsXG4gICAgICBnbG9iYWxEZWNpbWFsczogMixcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgZ2xvYmFsT3BlcmF0b3JOYW1lOiBcImF2Z1wiLFxuICAgICAgZ3JhZGllbnRFbmFibGVkOiB0cnVlLFxuICAgICAgaGV4YWdvblNvcnRCeURpcmVjdGlvbjogXCJhc2NcIixcbiAgICAgIGhleGFnb25Tb3J0QnlGaWVsZDogXCJuYW1lXCIsXG4gICAgICBtYXhNZXRyaWNzOiAwLFxuICAgICAgcG9seWdvbkJvcmRlclNpemU6IDIsXG4gICAgICBwb2x5Z29uQm9yZGVyQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgIHBvbHlnb25HbG9iYWxGaWxsQ29sb3I6IFwid2hpdGVcIixcbiAgICAgIHJhZGl1czogXCJcIixcbiAgICAgIHJhZGl1c0F1dG9TaXplOiB0cnVlLFxuICAgICAgcm93czogXCJcIixcbiAgICAgIHJvd0F1dG9TaXplOiB0cnVlLFxuICAgICAgc2hhcGU6IFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiLFxuICAgICAgdG9vbHRpcERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgdG9vbHRpcERpc3BsYXlUZXh0VHJpZ2dlcmVkRW1wdHk6IFwiT0tcIixcbiAgICAgIHRvb2x0aXBGb250U2l6ZTogMTIsXG4gICAgICB0b29sdGlwRm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFByaW1hcnlTb3J0RmllbGQ6IFwidGhyZXNob2xkTGV2ZWxcIixcbiAgICAgIHRvb2x0aXBTZWNvbmRhcnlTb3J0RGlyZWN0aW9uOiBcImRlc2NcIixcbiAgICAgIHRvb2x0aXBTZWNvbmRhcnlTb3J0RmllbGQ6IFwidmFsdWVcIixcbiAgICAgIHRvb2x0aXBUaW1lc3RhbXBFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gIH07XG5cblxuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgdGVtcGxhdGVTcnYsIGFsZXJ0U3J2LCBwcml2YXRlICRzYW5pdGl6ZSkge1xuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICAvLyBtZXJnZSBleGlzdGluZyBzZXR0aW5ncyB3aXRoIG91ciBkZWZhdWx0c1xuICAgIF8uZGVmYXVsdHModGhpcy5wYW5lbCwgdGhpcy5wYW5lbERlZmF1bHRzKTtcbiAgICB0aGlzLmQzRGl2SWQgPSBcImQzX3N2Z19cIiArIHRoaXMucGFuZWwuaWQ7XG4gICAgdGhpcy5jb250YWluZXJEaXZJZCA9IFwiY29udGFpbmVyX1wiICsgdGhpcy5kM0RpdklkO1xuICAgIHRoaXMuYWxlcnRTcnZSZWYgPSBhbGVydFNydjtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5wYW5lbENvbnRhaW5lciA9IG51bGw7XG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLnBhbmVsV2lkdGggPSBudWxsO1xuICAgIHRoaXMucGFuZWxIZWlnaHQgPSBudWxsO1xuICAgIHRoaXMucG9seXN0YXREYXRhID0gbmV3IEFycmF5PFBvbHlzdGF0TW9kZWw+KCk7XG4gICAgdGhpcy5kM09iamVjdCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy5zZXJpZXMgPSBbXTtcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IFtdO1xuICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBbXTtcbiAgICB0aGlzLm92ZXJyaWRlc0N0cmwgPSBuZXcgTWV0cmljT3ZlcnJpZGVzTWFuYWdlcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHRoaXMucGFuZWwuc2F2ZWRPdmVycmlkZXMpO1xuICAgIHRoaXMuY29tcG9zaXRlc01hbmFnZXIgPSBuZXcgQ29tcG9zaXRlc01hbmFnZXIoJHNjb3BlLCB0ZW1wbGF0ZVNydiwgJHNhbml0aXplLCB0aGlzLnBhbmVsLnNhdmVkQ29tcG9zaXRlcyk7XG4gICAgdGhpcy5ldmVudHMub24oXCJpbml0LWVkaXQtbW9kZVwiLCB0aGlzLm9uSW5pdEVkaXRNb2RlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1yZWNlaXZlZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1lcnJvclwiLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1zbmFwc2hvdC1sb2FkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gIH1cblxuXG4gIG9uSW5pdEVkaXRNb2RlKCkge1xuICAgIC8vIGRldGVybWluZSB0aGUgcGF0aCB0byB0aGlzIHBsdWdpbiBiYXNlIG9uIHRoZSBuYW1lIGZvdW5kIGluIHBhbmVsLnR5cGVcbiAgICB2YXIgdGhpc1BhbmVsUGF0aCA9IFwicHVibGljL3BsdWdpbnMvXCIgKyB0aGlzLnBhbmVsLnR5cGUgKyBcIi9cIjtcbiAgICAvLyBhZGQgdGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIHBhcnRpYWxcbiAgICB2YXIgb3B0aW9uc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3Iub3B0aW9ucy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJPcHRpb25zXCIsIG9wdGlvbnNQYXRoLCAyKTtcbiAgICB2YXIgb3ZlcnJpZGVzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5vdmVycmlkZXMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiT3ZlcnJpZGVzXCIsIG92ZXJyaWRlc1BhdGgsIDMpO1xuICAgIHZhciBjb21wb3NpdGVzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5jb21wb3NpdGVzLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIkNvbXBvc2l0ZXNcIiwgY29tcG9zaXRlc1BhdGgsIDQpO1xuICAgIC8vIGRpc2FibGVkIGZvciBub3dcbiAgICAvL3ZhciBtYXBwaW5nc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3IubWFwcGluZ3MuaHRtbFwiO1xuICAgIC8vdGhpcy5hZGRFZGl0b3JUYWIoXCJWYWx1ZSBNYXBwaW5nc1wiLCBtYXBwaW5nc1BhdGgsIDUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFtzZXRDb250YWluZXIgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSB7W3R5cGVdfSBjb250YWluZXIgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc2V0Q29udGFpbmVyKGNvbnRhaW5lcikge1xuICAgIHRoaXMucGFuZWxDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGEgcGFuZWwgYnkgdGhlIHNwYW4gYW5kIHZpZXdwb3J0XG4gIC8vIHRoZSBsaW5rIGVsZW1lbnQgb2JqZWN0IGNhbiBiZSB1c2VkIHRvIGdldCB0aGUgd2lkdGggbW9yZSByZWxpYWJseVxuICBnZXRQYW5lbFdpZHRoRmFpbHNhZmUoKSB7XG4gICAgdmFyIHRydWVXaWR0aCA9IDA7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLmdyaWRQb3MgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIDI0IHNsb3RzIGlzIGZ1bGxzY3JlZW4sIGdldCB0aGUgdmlld3BvcnQgYW5kIGRpdmlkZSB0byBhcHByb3hpbWF0ZSB0aGUgd2lkdGhcbiAgICAgIGxldCB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJTbG90ID0gdmlld1BvcnRXaWR0aCAvIDI0O1xuICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5yb3VuZCh0aGlzLnBhbmVsLmdyaWRQb3MudyAqIHBpeGVsc1BlclNsb3QpO1xuICAgICAgcmV0dXJuIHRydWVXaWR0aDtcbiAgICB9XG4gICAgLy8gZ3JhZmFuYTUgLSB1c2UgdGhpcy5wYW5lbC5ncmlkUG9zLncsIHRoaXMucGFuZWwuZ3JpZFBvcy5oXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIGNoZWNrIGlmIGluc2lkZSBlZGl0IG1vZGVcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlSW5pdGlhdGVkKSB7XG4gICAgICAgIC8vIHdpZHRoIGlzIGNsaWVudFdpZHRoIG9mIGRvY3VtZW50XG4gICAgICAgIHRydWVXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0IHRoZSB3aWR0aCBiYXNlZCBvbiB0aGUgc2NhbGVkIGNvbnRhaW5lciAodjUgbmVlZHMgdGhpcylcbiAgICAgICAgdHJ1ZVdpZHRoID0gdGhpcy5wYW5lbENvbnRhaW5lci5vZmZzZXRQYXJlbnQuY2xpZW50V2lkdGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHY0IGFuZCBwcmV2aW91cyB1c2VkIGZpeGVkIHNwYW5zXG4gICAgICB2YXIgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICAvLyBnZXQgdGhlIHBpeGVscyBvZiBhIHNwYW5cbiAgICAgIHZhciBwaXhlbHNQZXJTcGFuID0gdmlld1BvcnRXaWR0aCAvIDEyO1xuICAgICAgLy8gbXVsdGlwbHkgbnVtIHNwYW5zIGJ5IHBpeGVsc1BlclNwYW5cbiAgICAgIHRydWVXaWR0aCA9IE1hdGgucm91bmQodGhpcy5wYW5lbC5zcGFuICogcGl4ZWxzUGVyU3Bhbik7XG4gICAgfVxuICAgIHJldHVybiB0cnVlV2lkdGg7XG4gIH1cblxuICBnZXRQYW5lbEhlaWdodCgpIHtcbiAgICAvLyBwYW5lbCBjYW4gaGF2ZSBhIGZpeGVkIGhlaWdodCBzZXQgdmlhIFwiR2VuZXJhbFwiIHRhYiBpbiBwYW5lbCBlZGl0b3JcbiAgICB2YXIgdG1wUGFuZWxIZWlnaHQgPSB0aGlzLnBhbmVsLmhlaWdodDtcbiAgICBpZiAoKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikgfHwgKHRtcFBhbmVsSGVpZ2h0ID09PSBcIlwiKSkge1xuICAgICAgLy8gZ3JhZmFuYSBhbHNvIHN1cHBsaWVzIHRoZSBoZWlnaHQsIHRyeSB0byB1c2UgdGhhdCBpZiB0aGUgcGFuZWwgZG9lcyBub3QgaGF2ZSBhIGhlaWdodFxuICAgICAgdG1wUGFuZWxIZWlnaHQgPSBTdHJpbmcodGhpcy5oZWlnaHQpO1xuICAgICAgLy8gdjQgYW5kIGVhcmxpZXIgZGVmaW5lIHRoaXMgaGVpZ2h0LCBkZXRlY3Qgc3BhbiBmb3IgcHJlLXY1XG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuc3BhbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBoZWFkZXIsIGFkanVzdCBoZWlnaHQgdG8gdXNlIGFsbCBzcGFjZSBhdmFpbGFibGVcbiAgICAgICAgdmFyIHBhbmVsVGl0bGVPZmZzZXQgPSAyMDtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwudGl0bGUgIT09IFwiXCIpIHtcbiAgICAgICAgICBwYW5lbFRpdGxlT2Zmc2V0ID0gNDI7XG4gICAgICAgIH1cbiAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSBTdHJpbmcodGhpcy5jb250YWluZXJIZWlnaHQgLSBwYW5lbFRpdGxlT2Zmc2V0KTsgLy8gb2Zmc2V0IGZvciBoZWFkZXJcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gaGVpZ2h0IHN0aWxsIGNhbm5vdCBiZSBkZXRlcm1pbmVkLCBnZXQgaXQgZnJvbSB0aGUgcm93IGluc3RlYWRcbiAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSB0aGlzLnJvdy5oZWlnaHQ7XG4gICAgICAgIGlmICh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAvLyBsYXN0IHJlc29ydCAtIGRlZmF1bHQgdG8gMjUwcHggKHRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbilcbiAgICAgICAgICB0bXBQYW5lbEhlaWdodCA9IFwiMjUwXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcmVwbGFjZSBweFxuICAgIHRtcFBhbmVsSGVpZ2h0ID0gdG1wUGFuZWxIZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpO1xuICAgIC8vIGNvbnZlcnQgdG8gbnVtZXJpYyB2YWx1ZVxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSBwYXJzZUludCh0bXBQYW5lbEhlaWdodCwgMTApO1xuICAgIHJldHVybiBhY3R1YWxIZWlnaHQ7XG4gIH1cblxuICBjbGVhclNWRygpIHtcbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCkubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcIi1wYW5lbFwiKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcIi1wYW5lbFwiKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIikucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRDMoKSB7XG4gICAgdGhpcy5zZXRWYWx1ZXModGhpcy5kYXRhKTtcbiAgICB0aGlzLmNsZWFyU1ZHKCk7XG4gICAgaWYgKHRoaXMucGFuZWxXaWR0aCA9PT0gMCkge1xuICAgICAgdGhpcy5wYW5lbFdpZHRoID0gdGhpcy5nZXRQYW5lbFdpZHRoRmFpbHNhZmUoKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbEhlaWdodCA9IHRoaXMuZ2V0UGFuZWxIZWlnaHQoKTtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMH07XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYW5lbFdpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhbmVsSGVpZ2h0O1xuXG4gICAgbWFyZ2luLnRvcCA9IDA7XG4gICAgLy8gcHJlLXY1LCB3aXRoIHRpdGxlLCBzZXQgdG9wIG1hcmdpbiB0byBhdCBsZWFzdCA3cHhcbiAgICBpZiAoKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gIT09IFwidW5kZWZpbmVkXCIpICYmICh0aGlzLnBhbmVsLnRpdGxlICE9PSBcIlwiKSkge1xuICAgICAgbWFyZ2luLnRvcCA9IDc7XG4gICAgfVxuICAgIG1hcmdpbi5ib3R0b20gPSAwO1xuXG4gICAgLy8gbmV3IGF0dHJpYnV0ZXMgbWF5IG5vdCBiZSBkZWZpbmVkIGluIG9sZGVyIHBhbmVsIGRlZmluaXRpb25zXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplID0gMjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgfVxuXG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgcmFkaXVzIDogdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXMsXG4gICAgICByYWRpdXNBdXRvU2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXNBdXRvU2l6ZSxcbiAgICAgIHRvb2x0aXBGb250U2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC50b29sdGlwRm9udFNpemUsXG4gICAgICB0b29sdGlwRm9udFR5cGU6IHRoaXMucGFuZWwucG9seXN0YXQudG9vbHRpcEZvbnRUeXBlLFxuICAgICAgZGF0YTogdGhpcy5wb2x5c3RhdERhdGEsXG4gICAgICBkaXNwbGF5TGltaXQ6IHRoaXMucGFuZWwucG9seXN0YXQuZGlzcGxheUxpbWl0LFxuICAgICAgZ2xvYmFsRGlzcGxheU1vZGU6IHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsRGlzcGxheU1vZGUsXG4gICAgICBjb2x1bW5zOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMsXG4gICAgICBjb2x1bW5BdXRvU2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5BdXRvU2l6ZSxcbiAgICAgIHJvd3M6IHRoaXMucGFuZWwucG9seXN0YXQucm93cyxcbiAgICAgIHJvd0F1dG9TaXplIDogdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dBdXRvU2l6ZSxcbiAgICAgIHRvb2x0aXBDb250ZW50OiB0aGlzLnRvb2x0aXBDb250ZW50LFxuICAgICAgYW5pbWF0aW9uU3BlZWQ6IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoOiB0aGlzLmdldERlZmF1bHRDbGlja1Rocm91Z2goKSxcbiAgICAgIHBvbHlzdGF0OiB0aGlzLnBhbmVsLnBvbHlzdGF0LFxuICAgIH07XG4gICAgdGhpcy5kM09iamVjdCA9IG5ldyBEM1dyYXBwZXIodGhpcy50ZW1wbGF0ZVNydiwgdGhpcy5zdmdDb250YWluZXIsIHRoaXMuZDNEaXZJZCwgb3B0KTtcbiAgICB0aGlzLmQzT2JqZWN0LmRyYXcoKTtcbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHt2YWx1ZTogXCJcIiwgb3A6IFwiPVwiLCB0ZXh0OiBcIlwiIH0pO1xuICB9XG5cbiAgcmVtb3ZlUmFuZ2VNYXAocmFuZ2VNYXApIHtcbiAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YodGhpcy5wYW5lbC5yYW5nZU1hcHMsIHJhbmdlTWFwKTtcbiAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRSYW5nZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5wdXNoKHtmcm9tOiBcIlwiLCB0bzogXCJcIiwgdGV4dDogXCJcIn0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWF0dHJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBkM0J5Q2xhc3MgPSBlbGVtLmZpbmQoXCIuZ3JhZmFuYS1kMy1wb2x5c3RhdFwiKTtcbiAgICBkM0J5Q2xhc3MuYXBwZW5kKFwiPGRpdiBpZD1cXFwiXCIgKyBjdHJsLmNvbnRhaW5lckRpdklkICsgXCJcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgY29udGFpbmVyID0gZDNCeUNsYXNzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgY3RybC5zZXRDb250YWluZXIoY29udGFpbmVyKTtcblxuICAgIGVsZW0gPSBlbGVtLmZpbmQoXCIuZ3JhZmFuYS1kMy1wb2x5c3RhdFwiKTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIC8vIHRyeSB0byBnZXQgdGhlIHdpZHRoXG4gICAgICBjdHJsLnBhbmVsV2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIGN0cmwucmVuZGVyRDMoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudHMub24oXCJyZW5kZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRWYWx1ZXMoZGF0YUxpc3QpIHtcbiAgICB0aGlzLmRhdGFSYXcgPSBkYXRhTGlzdDtcbiAgICAvLyBhdXRvbWF0aWNhbGx5IGNvcnJlY3QgdHJhbnNmb3JtIG1vZGUgYmFzZWQgb24gZGF0YVxuICAgIGlmICh0aGlzLmRhdGFSYXcgJiYgdGhpcy5kYXRhUmF3Lmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcInRhYmxlXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5kYXRhUmF3WzBdLnR5cGUgPT09IFwiZG9jc1wiKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcImpzb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwidGFibGVcIiB8fCB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9PT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0aW1lc2VyaWVzX3RvX3Jvd3NcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWdub3JlIHRoZSBhYm92ZSBhbmQgdXNlIGEgdGltZXNlcmllc1xuICAgIHRoaXMucG9seXN0YXREYXRhLmxlbmd0aCA9IDA7XG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNlcmllcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGFTZXJpZXMgPSB0aGlzLnNlcmllc1tpbmRleF07XG4gICAgICAgIGxldCBjb252ZXJ0ZWQgPSBUcmFuc2Zvcm1lcnMuVGltZVNlcmllc1RvUG9seXN0YXQodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxPcGVyYXRvck5hbWUsIGFTZXJpZXMpO1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YS5wdXNoKGNvbnZlcnRlZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFwcGx5IGdsb2JhbCB1bml0IGZvcm1hdHRpbmcgYW5kIGRlY2ltYWxzXG4gICAgdGhpcy5hcHBseUdsb2JhbEZvcm1hdHRpbmcodGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGFwcGx5IG92ZXJyaWRlc1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybC5hcHBseU92ZXJyaWRlcyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgY29tcG9zaXRlcywgdGhpcyB3aWxsIGZpbHRlciBhcyBuZWVkZWQgYW5kIHNldCBjbGlja3Rocm91Z2hcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuY29tcG9zaXRlc01hbmFnZXIuYXBwbHlDb21wb3NpdGVzKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBnbG9iYWwgY2xpY2t0aHJvdWdoIHRvIGFsbCBpdGVtcyBub3Qgc2V0XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucG9seXN0YXREYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgaWYgKHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5jbGlja1Rocm91Z2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5jbGlja1Rocm91Z2ggPSB0aGlzLmdldERlZmF1bHRDbGlja1Rocm91Z2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZmlsdGVyIG91dCBieSBnbG9iYWxEaXNwbGF5TW9kZVxuICAgIHRoaXMucG9seXN0YXREYXRhID0gdGhpcy5maWx0ZXJCeUdsb2JhbERpc3BsYXlNb2RlKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBub3cgc29ydFxuICAgIHRoaXMucG9seXN0YXREYXRhID0gXy5vcmRlckJ5KFxuICAgICAgdGhpcy5wb2x5c3RhdERhdGEsXG4gICAgICBbdGhpcy5wYW5lbC5wb2x5c3RhdC5oZXhhZ29uU29ydEJ5RmllbGRdLFxuICAgICAgW3RoaXMucGFuZWwucG9seXN0YXQuaGV4YWdvblNvcnRCeURpcmVjdGlvbl0pO1xuICAgIC8vIGdlbmVyYXRlIHRvb2x0aXBzXG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFRvb2x0aXAuZ2VuZXJhdGUodGhpcy4kc2NvcGUsIHRoaXMucG9seXN0YXREYXRhLCB0aGlzLnBhbmVsLnBvbHlzdGF0KTtcbiAgfVxuXG4gIGFwcGx5R2xvYmFsRm9ybWF0dGluZyhkYXRhOiBhbnkpIHtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbFVuaXRGb3JtYXRdO1xuICAgICAgaWYgKGZvcm1hdEZ1bmMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IEdldERlY2ltYWxzRm9yVmFsdWUoZGF0YVtpbmRleF0udmFsdWUsIHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsRGVjaW1hbHMpO1xuICAgICAgICBkYXRhW2luZGV4XS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YVtpbmRleF0udmFsdWUsIHJlc3VsdC5kZWNpbWFscywgcmVzdWx0LnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YVtpbmRleF0udmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YVtpbmRleF0udmFsdWUsIHJlc3VsdC5kZWNpbWFscyk7XG4gICAgICB9XG4gICAgICAvLyBkZWZhdWx0IHRoZSBjb2xvciB0byB0aGUgZ2xvYmFsIHNldHRpbmdcbiAgICAgIGRhdGFbaW5kZXhdLmNvbG9yID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yO1xuICAgIH1cbiAgfVxuXG5cbiAgZmlsdGVyQnlHbG9iYWxEaXNwbGF5TW9kZShkYXRhOiBhbnkpIHtcbiAgICBsZXQgZmlsdGVyZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICBsZXQgY29tcG9zaXRlTWV0cmljcyA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgIGlmICh0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERpc3BsYXlNb2RlICE9PSBcImFsbFwiKSB7XG4gICAgICBsZXQgZGF0YUxlbiA9IGRhdGEubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhTGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAvLyBrZWVwIGlmIGNvbXBvc2l0ZVxuICAgICAgICBpZiAoaXRlbS5pc0NvbXBvc2l0ZSkge1xuICAgICAgICAgIGNvbXBvc2l0ZU1ldHJpY3MucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50aHJlc2hvbGRMZXZlbCA8IDEpIHtcbiAgICAgICAgICAvLyBwdXNoIHRoZSBpbmRleCBudW1iZXJcbiAgICAgICAgICBmaWx0ZXJlZE1ldHJpY3MucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGZpbHRlcmVkIG1ldHJpY3MsIHVzZSBzcGxpY2UgaW4gcmV2ZXJzZSBvcmRlclxuICAgICAgZm9yIChsZXQgaSA9IGRhdGEubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlcyhmaWx0ZXJlZE1ldHJpY3MsIGkpKSB7XG4gICAgICAgICAgZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAoY29tcG9zaXRlTWV0cmljcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gc2V0IGRhdGEgdG8gYmUgYWxsIG9mIHRoZSBjb21wb3NpdGVzXG4gICAgICAgICAgZGF0YSA9IGNvbXBvc2l0ZU1ldHJpY3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBvbkRhdGFFcnJvcihlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIHRoaXMub25EYXRhUmVjZWl2ZWQoW10pO1xuICB9XG5cbiAgb25EYXRhUmVjZWl2ZWQoZGF0YUxpc3QpIHtcbiAgICB0aGlzLnNlcmllcyA9IGRhdGFMaXN0Lm1hcCh0aGlzLnNlcmllc0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICB2YWx1ZTogMCxcbiAgICAgIHZhbHVlRm9ybWF0dGVkOiAwLFxuICAgICAgdmFsdWVSb3VuZGVkOiAwXG4gICAgfTtcbiAgICB0aGlzLnNldFZhbHVlcyhkYXRhKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBzZXJpZXNIYW5kbGVyKHNlcmllc0RhdGEpIHtcbiAgICB2YXIgc2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgZGF0YXBvaW50czogc2VyaWVzRGF0YS5kYXRhcG9pbnRzLFxuICAgICAgYWxpYXM6IHNlcmllc0RhdGEudGFyZ2V0LFxuICAgIH0pO1xuICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKHRoaXMucGFuZWwubnVsbFBvaW50TW9kZSk7XG4gICAgcmV0dXJuIHNlcmllcztcbiAgfVxuXG4gIGludmVydENvbG9yT3JkZXIoKSB7XG4gICAgdmFyIHRtcCA9IHRoaXMucGFuZWwuY29sb3JzWzBdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzBdID0gdGhpcy5wYW5lbC5jb2xvcnNbMl07XG4gICAgdGhpcy5wYW5lbC5jb2xvcnNbMl0gPSB0bXA7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVlZCBtdXN0IG5vdCBiZSBsZXNzIHRoYW4gNTAwbXNcbiAgICovXG4gIHZhbGlkYXRlQW5pbWF0aW9uU3BlZWQoKSB7XG4gICAgbGV0IHNwZWVkID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZDtcbiAgICBsZXQgbmV3U3BlZWQgPSA1MDAwO1xuICAgIGlmIChzcGVlZCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChzcGVlZCwgMTApKSkge1xuICAgICAgICBsZXQgY2hlY2tTcGVlZCA9IHBhcnNlSW50KHNwZWVkLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1NwZWVkID49IDUwMCkge1xuICAgICAgICAgIG5ld1NwZWVkID0gY2hlY2tTcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmFuaW1hdGlvblNwZWVkID0gbmV3U3BlZWQ7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHZhbGlkYXRlQ29sdW1uVmFsdWUoKSB7XG4gICAgbGV0IGNvbHVtbnMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnM7XG4gICAgbGV0IG5ld0NvbHVtbnMgPSAxO1xuICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KGNvbHVtbnMsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrQ29sdW1ucyA9IHBhcnNlSW50KGNvbHVtbnMsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrQ29sdW1ucyA+IDApIHtcbiAgICAgICAgICBuZXdDb2x1bW5zID0gY2hlY2tDb2x1bW5zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1ucyA9IG5ld0NvbHVtbnM7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHZhbGlkYXRlUm93VmFsdWUoKSB7XG4gICAgbGV0IHJvd3MgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3M7XG4gICAgbGV0IG5ld1Jvd3MgPSAxO1xuICAgIGlmIChyb3dzKSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHJvd3MsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrUm93cyA9IHBhcnNlSW50KHJvd3MsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrUm93cyA+IDApIHtcbiAgICAgICAgICBuZXdSb3dzID0gY2hlY2tSb3dzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQucm93cyA9IG5ld1Jvd3M7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHZhbGlkYXRlUmFkaXVzVmFsdWUoKSB7XG4gICAgbGV0IHJhZGl1cyA9IHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzO1xuICAgIGxldCBuZXdSYWRpdXMgPSAyNTtcbiAgICBpZiAocmFkaXVzICE9PSBudWxsKSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHJhZGl1cywgMTApKSkge1xuICAgICAgICBsZXQgY2hlY2tSYWRpdXMgPSBwYXJzZUludChyYWRpdXMsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrUmFkaXVzID4gMCkge1xuICAgICAgICAgIG5ld1JhZGl1cyA9IGNoZWNrUmFkaXVzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzID0gbmV3UmFkaXVzO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZUJvcmRlclNpemVWYWx1ZSgpIHtcbiAgICBsZXQgYm9yZGVyU2l6ZSA9IHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemU7XG4gICAgbGV0IG5ld0JvcmRlclNpemUgPSAyO1xuICAgIGlmIChib3JkZXJTaXplICE9PSBudWxsKSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KGJvcmRlclNpemUsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrQm9yZGVyU2l6ZSA9IHBhcnNlSW50KGJvcmRlclNpemUsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrQm9yZGVyU2l6ZSA+PSAwKSB7XG4gICAgICAgICAgbmV3Qm9yZGVyU2l6ZSA9IGNoZWNrQm9yZGVyU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplID0gbmV3Qm9yZGVyU2l6ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXBkYXRlUG9seWdvbkJvcmRlckNvbG9yKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB1cGRhdGVQb2x5Z29uR2xvYmFsRmlsbENvbG9yKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXREZWZhdWx0Q2xpY2tUaHJvdWdoKCkge1xuICAgIGxldCB1cmwgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LmRlZmF1bHRDbGlja1Rocm91Z2g7XG4gICAgaWYgKCh1cmwpICYmICh0aGlzLnBhbmVsLnBvbHlzdGF0LmRlZmF1bHRDbGlja1Rocm91Z2hTYW5pdGl6ZSkpIHtcbiAgICAgIHVybCA9IHRoaXMuJHNhbml0aXplKHVybCk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBzZXRHbG9iYWxVbml0Rm9ybWF0KHN1Ykl0ZW0pIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbFVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICB9XG59XG5cblxuZXhwb3J0IHtcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCxcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCBhcyBNZXRyaWNzUGFuZWxDdHJsXG59O1xuIl19