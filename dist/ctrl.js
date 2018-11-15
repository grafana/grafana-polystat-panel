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
                        savedOverrides: Array(),
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
                    lodash_1.default.defaultsDeep(_this.panel, _this.panelDefaults);
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
                    var panelByClass = elem.find(".grafana-d3-polystat");
                    panelByClass.append("<div style=\"width: 100%; height: 100%;\" id=\"" + ctrl.containerDivId + "\"></div>");
                    var container = panelByClass[0].childNodes[0];
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
                    this.panel.polystat.polygonGlobalFillColor = utils_1.RGBToHex(this.panel.polystat.polygonGlobalFillColor);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFpQmtDLHVDQUFnQjtnQkErSGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F5QnpCO29CQTFCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkE3SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUssRUFBRSxR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QUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsRUFBRTt3QkFDOUQsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzNCO29CQUNELE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsaURBQW1CLEdBQW5CLFVBQW9CLE9BQU87b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZELENBQUM7Z0JBOWpCTSwrQkFBVyxHQUFHLHdCQUF3QixDQUFDO2dCQStqQmhELDBCQUFDO2FBQUEsQUFoa0JELENBQWtDLHNCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuaW1wb3J0IHtNZXRyaWNzUGFuZWxDdHJsfSBmcm9tIFwiYXBwL3BsdWdpbnMvc2RrXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcblxuaW1wb3J0IFwiLi9jc3MvcG9seXN0YXQuY3NzIVwiO1xuaW1wb3J0IHsgRDNXcmFwcGVyIH0gZnJvbSBcIi4vZDN3cmFwcGVyXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm1lcnMgfSBmcm9tIFwiLi90cmFuc2Zvcm1lcnNcIjtcbmltcG9ydCB7IFBvbHlzdGF0TW9kZWwgfSBmcm9tIFwiLi9wb2x5c3RhdG1vZGVsXCI7XG5pbXBvcnQgeyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyLCBNZXRyaWNPdmVycmlkZSB9IGZyb20gXCIuL21ldHJpY19vdmVycmlkZXNfbWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlc01hbmFnZXIgfSBmcm9tIFwiLi9jb21wb3NpdGVzX21hbmFnZXJcIjtcbmltcG9ydCB7IFRvb2x0aXAgfSBmcm9tIFwiLi90b29sdGlwXCI7XG5pbXBvcnQgeyBHZXREZWNpbWFsc0ZvclZhbHVlLCBSR0JUb0hleCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuY2xhc3MgRDNQb2x5c3RhdFBhbmVsQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xuICBzdGF0aWMgdGVtcGxhdGVVcmwgPSBcInBhcnRpYWxzL3RlbXBsYXRlLmh0bWxcIjtcbiAgYW5pbWF0aW9uTW9kZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJhbGxcIiwgdGV4dDogXCJTaG93IEFsbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH1cbiAgXTtcbiAgZGlzcGxheU1vZGVzID0gW1xuICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgIHsgdmFsdWU6IFwidHJpZ2dlcmVkXCIsIHRleHQ6IFwiU2hvdyBUcmlnZ2VyZWRcIiB9XG4gIF07XG4gIHRocmVzaG9sZFN0YXRlcyA9IFtcbiAgICB7IHZhbHVlOiAwLCB0ZXh0OiBcIm9rXCIgfSxcbiAgICB7IHZhbHVlOiAxLCB0ZXh0OiBcIndhcm5pbmdcIiB9LFxuICAgIHsgdmFsdWU6IDIsIHRleHQ6IFwiY3JpdGljYWxcIiB9LFxuICAgIHsgdmFsdWU6IDMsIHRleHQ6IFwiY3VzdG9tXCIgfVxuICBdO1xuICBzaGFwZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBQb2ludGVkIFRvcFwiIH0sXG4gICAgLy97IHZhbHVlOiBcImhleGFnb25fZmxhdF90b3BcIiwgdGV4dDogXCJIZXhhZ29uIEZsYXQgVG9wXCIgfSxcbiAgICB7IHZhbHVlOiBcImNpcmNsZVwiLCB0ZXh0OiBcIkNpcmNsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcImNyb3NzXCIsIHRleHQ6IFwiQ3Jvc3NcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJkaWFtb25kXCIsIHRleHQ6IFwiRGlhbW9uZFwiIH0sXG4gICAgLy97IHZhbHVlOiBcInNxdWFyZVwiLCB0ZXh0OiBcIlNxdWFyZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInN0YXJcIiwgdGV4dDogXCJTdGFyXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwidHJpYW5nbGVcIiwgdGV4dDogXCJUcmlhbmdsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInd5ZVwiLCB0ZXh0OiBcIld5ZVwiIH1cbiAgXTtcbiAgZm9udFNpemVzID0gW1xuICAgIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIgLCAxMywgMTQsIDE1LFxuICAgIDE2LCAxNywgMTgsIDE5LCAyMCwgMjIsIDI0LCAyNiwgMjgsIDMwLCAzMixcbiAgICAzNCwgMzYsIDM4LCA0MCwgNDIsIDQ0LCA0NiwgNDgsIDUwLCA1MiwgNTQsXG4gICAgNTYsIDU4LCA2MCwgNjIsIDY0LCA2NiwgNjgsIDcwXTtcbiAgZm9udFR5cGVzID0gW1xuICAgIFwiT3BlbiBTYW5zXCIsIFwiQXJpYWxcIiwgXCJBdmFudCBHYXJkZVwiLCBcIkJvb2ttYW5cIixcbiAgICBcIkNvbnNvbGFzXCIsIFwiQ291cmllclwiLCBcIkNvdXJpZXIgTmV3XCIsIFwiRnV0dXJhXCIsXG4gICAgXCJHYXJhbW9uZFwiLCBcIkhlbHZldGljYVwiLFxuICAgIFwiUGFsYXRpbm9cIiwgXCJSb2JvdG9cIiwgXCJUaW1lc1wiLCBcIlRpbWVzIE5ldyBSb21hblwiLFxuICAgIFwiVmVyZGFuYVwiXG4gIF07XG4gIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIG9wZXJhdG9yT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiBcImF2Z1wiLCB0ZXh0OiBcIkF2ZXJhZ2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiY291bnRcIiwgdGV4dDogXCJDb3VudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjdXJyZW50XCIsIHRleHQ6IFwiQ3VycmVudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZWx0YVwiLCB0ZXh0OiBcIkRlbHRhXCIgfSxcbiAgICB7IHZhbHVlOiBcImRpZmZcIiwgdGV4dDogXCJEaWZmZXJlbmNlXCIgfSxcbiAgICB7IHZhbHVlOiBcImZpcnN0XCIsIHRleHQ6IFwiRmlyc3RcIiB9LFxuICAgIHsgdmFsdWU6IFwibG9nbWluXCIsIHRleHQ6IFwiTG9nIE1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJtYXhcIiwgdGV4dDogXCJNYXhcIiB9LFxuICAgIHsgdmFsdWU6IFwibWluXCIsIHRleHQ6IFwiTWluXCIgfSxcbiAgICB7IHZhbHVlOiBcIm5hbWVcIiwgdGV4dDogXCJOYW1lXCIgfSxcbiAgICB7IHZhbHVlOiBcImxhc3RfdGltZVwiLCB0ZXh0OiBcIlRpbWUgb2YgTGFzdCBQb2ludFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aW1lX3N0ZXBcIiwgdGV4dDogXCJUaW1lIFN0ZXBcIiB9LFxuICAgIHsgdmFsdWU6IFwidG90YWxcIiwgdGV4dDogXCJUb3RhbFwiIH1cbiAgXTtcbiAgc29ydERpcmVjdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhc2NcIiwgdGV4dDogXCJBc2NlbmRpbmdcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVzY1wiLCB0ZXh0OiBcIkRlc2NlbmRpbmdcIiB9XG4gIF07XG4gIHNvcnRGaWVsZHMgPSBbXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aHJlc2hvbGRMZXZlbFwiLCB0ZXh0OiBcIlRocmVzaG9sZCBMZXZlbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ2YWx1ZVwiLCB0ZXh0OiBcIlZhbHVlXCIgfVxuICBdO1xuXG4gIGRhdGFSYXcgOiBhbnk7XG4gIHBvbHlzdGF0RGF0YTogUG9seXN0YXRNb2RlbFtdO1xuICBzY29wZXJlZjogYW55O1xuICBhbGVydFNydlJlZjogYW55O1xuICBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcGFuZWxDb250YWluZXI6IGFueTtcbiAgZDNPYmplY3Q6IEQzV3JhcHBlcjtcbiAgZGF0YTogYW55O1xuICBzZXJpZXM6IGFueVtdO1xuICB0ZW1wbGF0ZVNydjogYW55O1xuICBvdmVycmlkZXNDdHJsOiBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyO1xuICBjb21wb3NpdGVzTWFuYWdlciA6IENvbXBvc2l0ZXNNYW5hZ2VyO1xuICB0b29sdGlwQ29udGVudDogc3RyaW5nW107XG4gIGQzRGl2SWQ6IHN0cmluZztcbiAgY29udGFpbmVyRGl2SWQ6IHN0cmluZztcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIHBhbmVsV2lkdGg6IGFueTtcbiAgcGFuZWxIZWlnaHQ6IGFueTtcblxuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIHNhdmVkQ29tcG9zaXRlcyA6IFtdLFxuICAgIHNhdmVkT3ZlcnJpZGVzOiBBcnJheTxNZXRyaWNPdmVycmlkZT4oKSxcbiAgICBjb2xvcnM6IFtcIiMyOTljNDZcIiwgXCJyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSlcIiwgXCIjZDQ0YTNhXCJdLFxuICAgIHBvbHlzdGF0OiB7XG4gICAgICBhbmltYXRpb25TcGVlZDogMjUwMCxcbiAgICAgIGNvbHVtbnM6IFwiXCIsXG4gICAgICBjb2x1bW5BdXRvU2l6ZTogdHJ1ZSxcbiAgICAgIGRpc3BsYXlMaW1pdDogMTAwLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaDogXCJcIixcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2hTYW5pdGl6ZTogdHJ1ZSxcbiAgICAgIGZvbnRBdXRvU2NhbGU6IHRydWUsXG4gICAgICBmb250U2l6ZTogMTIsXG4gICAgICBmb250VHlwZTogXCJSb2JvdG9cIixcbiAgICAgIGdsb2JhbFVuaXRGb3JtYXQ6IFwic2hvcnRcIixcbiAgICAgIGdsb2JhbERlY2ltYWxzOiAyLFxuICAgICAgZ2xvYmFsRGlzcGxheU1vZGU6IFwiYWxsXCIsXG4gICAgICBnbG9iYWxPcGVyYXRvck5hbWU6IFwiYXZnXCIsXG4gICAgICBncmFkaWVudEVuYWJsZWQ6IHRydWUsXG4gICAgICBoZXhhZ29uU29ydEJ5RGlyZWN0aW9uOiBcImFzY1wiLFxuICAgICAgaGV4YWdvblNvcnRCeUZpZWxkOiBcIm5hbWVcIixcbiAgICAgIG1heE1ldHJpY3M6IDAsXG4gICAgICBwb2x5Z29uQm9yZGVyU2l6ZTogMixcbiAgICAgIHBvbHlnb25Cb3JkZXJDb2xvcjogXCJibGFja1wiLFxuICAgICAgcG9seWdvbkdsb2JhbEZpbGxDb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgcmFkaXVzOiBcIlwiLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRydWUsXG4gICAgICByb3dzOiBcIlwiLFxuICAgICAgcm93QXV0b1NpemU6IHRydWUsXG4gICAgICBzaGFwZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsXG4gICAgICB0b29sdGlwRGlzcGxheU1vZGU6IFwiYWxsXCIsXG4gICAgICB0b29sdGlwRGlzcGxheVRleHRUcmlnZ2VyZWRFbXB0eTogXCJPS1wiLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiAxMixcbiAgICAgIHRvb2x0aXBGb250VHlwZTogXCJSb2JvdG9cIixcbiAgICAgIHRvb2x0aXBQcmltYXJ5U29ydERpcmVjdGlvbjogXCJkZXNjXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnRGaWVsZDogXCJ0aHJlc2hvbGRMZXZlbFwiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnRGaWVsZDogXCJ2YWx1ZVwiLFxuICAgICAgdG9vbHRpcFRpbWVzdGFtcEVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgfTtcblxuXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCB0ZW1wbGF0ZVNydiwgYWxlcnRTcnYsIHByaXZhdGUgJHNhbml0aXplKSB7XG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xuICAgIC8vIG1lcmdlIGV4aXN0aW5nIHNldHRpbmdzIHdpdGggb3VyIGRlZmF1bHRzXG4gICAgXy5kZWZhdWx0c0RlZXAodGhpcy5wYW5lbCwgdGhpcy5wYW5lbERlZmF1bHRzKTtcblxuICAgIHRoaXMuZDNEaXZJZCA9IFwiZDNfc3ZnX1wiICsgdGhpcy5wYW5lbC5pZDtcbiAgICB0aGlzLmNvbnRhaW5lckRpdklkID0gXCJjb250YWluZXJfXCIgKyB0aGlzLmQzRGl2SWQ7XG4gICAgdGhpcy5hbGVydFNydlJlZiA9IGFsZXJ0U3J2O1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBhbmVsQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMucGFuZWxXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5wYW5lbEhlaWdodCA9IG51bGw7XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnNlcmllcyA9IFtdO1xuICAgIHRoaXMucG9seXN0YXREYXRhID0gW107XG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFtdO1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybCA9IG5ldyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgdGhpcy5wYW5lbC5zYXZlZE92ZXJyaWRlcyk7XG4gICAgdGhpcy5jb21wb3NpdGVzTWFuYWdlciA9IG5ldyBDb21wb3NpdGVzTWFuYWdlcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHRoaXMucGFuZWwuc2F2ZWRDb21wb3NpdGVzKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImluaXQtZWRpdC1tb2RlXCIsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXJlY2VpdmVkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLWVycm9yXCIsIHRoaXMub25EYXRhRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXNuYXBzaG90LWxvYWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG5cbiAgb25Jbml0RWRpdE1vZGUoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBwYXRoIHRvIHRoaXMgcGx1Z2luIGJhc2Ugb24gdGhlIG5hbWUgZm91bmQgaW4gcGFuZWwudHlwZVxuICAgIHZhciB0aGlzUGFuZWxQYXRoID0gXCJwdWJsaWMvcGx1Z2lucy9cIiArIHRoaXMucGFuZWwudHlwZSArIFwiL1wiO1xuICAgIC8vIGFkZCB0aGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgcGFydGlhbFxuICAgIHZhciBvcHRpb25zUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5vcHRpb25zLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIk9wdGlvbnNcIiwgb3B0aW9uc1BhdGgsIDIpO1xuICAgIHZhciBvdmVycmlkZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm92ZXJyaWRlcy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJPdmVycmlkZXNcIiwgb3ZlcnJpZGVzUGF0aCwgMyk7XG4gICAgdmFyIGNvbXBvc2l0ZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLmNvbXBvc2l0ZXMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiQ29tcG9zaXRlc1wiLCBjb21wb3NpdGVzUGF0aCwgNCk7XG4gICAgLy8gZGlzYWJsZWQgZm9yIG5vd1xuICAgIC8vdmFyIG1hcHBpbmdzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5tYXBwaW5ncy5odG1sXCI7XG4gICAgLy90aGlzLmFkZEVkaXRvclRhYihcIlZhbHVlIE1hcHBpbmdzXCIsIG1hcHBpbmdzUGF0aCwgNSk7XG4gIH1cblxuICAvKipcbiAgICogW3NldENvbnRhaW5lciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtbdHlwZV19IGNvbnRhaW5lciBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZXRDb250YWluZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5wYW5lbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIC8vIGRldGVybWluZSB0aGUgd2lkdGggb2YgYSBwYW5lbCBieSB0aGUgc3BhbiBhbmQgdmlld3BvcnRcbiAgLy8gdGhlIGxpbmsgZWxlbWVudCBvYmplY3QgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSB3aWR0aCBtb3JlIHJlbGlhYmx5XG4gIGdldFBhbmVsV2lkdGhGYWlsc2FmZSgpIHtcbiAgICB2YXIgdHJ1ZVdpZHRoID0gMDtcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuZ3JpZFBvcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gMjQgc2xvdHMgaXMgZnVsbHNjcmVlbiwgZ2V0IHRoZSB2aWV3cG9ydCBhbmQgZGl2aWRlIHRvIGFwcHJveGltYXRlIHRoZSB3aWR0aFxuICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgbGV0IHBpeGVsc1BlclNsb3QgPSB2aWV3UG9ydFdpZHRoIC8gMjQ7XG4gICAgICB0cnVlV2lkdGggPSBNYXRoLnJvdW5kKHRoaXMucGFuZWwuZ3JpZFBvcy53ICogcGl4ZWxzUGVyU2xvdCk7XG4gICAgICByZXR1cm4gdHJ1ZVdpZHRoO1xuICAgIH1cbiAgICAvLyBncmFmYW5hNSAtIHVzZSB0aGlzLnBhbmVsLmdyaWRQb3MudywgdGhpcy5wYW5lbC5ncmlkUG9zLmhcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuc3BhbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gY2hlY2sgaWYgaW5zaWRlIGVkaXQgbW9kZVxuICAgICAgaWYgKHRoaXMuZWRpdE1vZGVJbml0aWF0ZWQpIHtcbiAgICAgICAgLy8gd2lkdGggaXMgY2xpZW50V2lkdGggb2YgZG9jdW1lbnRcbiAgICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnZXQgdGhlIHdpZHRoIGJhc2VkIG9uIHRoZSBzY2FsZWQgY29udGFpbmVyICh2NSBuZWVkcyB0aGlzKVxuICAgICAgICB0cnVlV2lkdGggPSB0aGlzLnBhbmVsQ29udGFpbmVyLm9mZnNldFBhcmVudC5jbGllbnRXaWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdjQgYW5kIHByZXZpb3VzIHVzZWQgZml4ZWQgc3BhbnNcbiAgICAgIHZhciB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgIC8vIGdldCB0aGUgcGl4ZWxzIG9mIGEgc3BhblxuICAgICAgdmFyIHBpeGVsc1BlclNwYW4gPSB2aWV3UG9ydFdpZHRoIC8gMTI7XG4gICAgICAvLyBtdWx0aXBseSBudW0gc3BhbnMgYnkgcGl4ZWxzUGVyU3BhblxuICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5yb3VuZCh0aGlzLnBhbmVsLnNwYW4gKiBwaXhlbHNQZXJTcGFuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVXaWR0aDtcbiAgfVxuXG4gIGdldFBhbmVsSGVpZ2h0KCkge1xuICAgIC8vIHBhbmVsIGNhbiBoYXZlIGEgZml4ZWQgaGVpZ2h0IHNldCB2aWEgXCJHZW5lcmFsXCIgdGFiIGluIHBhbmVsIGVkaXRvclxuICAgIHZhciB0bXBQYW5lbEhlaWdodCA9IHRoaXMucGFuZWwuaGVpZ2h0O1xuICAgIGlmICgodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB8fCAodG1wUGFuZWxIZWlnaHQgPT09IFwiXCIpKSB7XG4gICAgICAvLyBncmFmYW5hIGFsc28gc3VwcGxpZXMgdGhlIGhlaWdodCwgdHJ5IHRvIHVzZSB0aGF0IGlmIHRoZSBwYW5lbCBkb2VzIG5vdCBoYXZlIGEgaGVpZ2h0XG4gICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmhlaWdodCk7XG4gICAgICAvLyB2NCBhbmQgZWFybGllciBkZWZpbmUgdGhpcyBoZWlnaHQsIGRldGVjdCBzcGFuIGZvciBwcmUtdjVcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhlYWRlciwgYWRqdXN0IGhlaWdodCB0byB1c2UgYWxsIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgICB2YXIgcGFuZWxUaXRsZU9mZnNldCA9IDIwO1xuICAgICAgICBpZiAodGhpcy5wYW5lbC50aXRsZSAhPT0gXCJcIikge1xuICAgICAgICAgIHBhbmVsVGl0bGVPZmZzZXQgPSA0MjtcbiAgICAgICAgfVxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmNvbnRhaW5lckhlaWdodCAtIHBhbmVsVGl0bGVPZmZzZXQpOyAvLyBvZmZzZXQgZm9yIGhlYWRlclxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBoZWlnaHQgc3RpbGwgY2Fubm90IGJlIGRldGVybWluZWQsIGdldCBpdCBmcm9tIHRoZSByb3cgaW5zdGVhZFxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IHRoaXMucm93LmhlaWdodDtcbiAgICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIC8vIGxhc3QgcmVzb3J0IC0gZGVmYXVsdCB0byAyNTBweCAodGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuKVxuICAgICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gXCIyNTBcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXBsYWNlIHB4XG4gICAgdG1wUGFuZWxIZWlnaHQgPSB0bXBQYW5lbEhlaWdodC5yZXBsYWNlKFwicHhcIiwgXCJcIik7XG4gICAgLy8gY29udmVydCB0byBudW1lcmljIHZhbHVlXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9IHBhcnNlSW50KHRtcFBhbmVsSGVpZ2h0LCAxMCk7XG4gICAgcmV0dXJuIGFjdHVhbEhlaWdodDtcbiAgfVxuXG4gIGNsZWFyU1ZHKCkge1xuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIikubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJEMygpIHtcbiAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuY2xlYXJTVkcoKTtcbiAgICBpZiAodGhpcy5wYW5lbFdpZHRoID09PSAwKSB7XG4gICAgICB0aGlzLnBhbmVsV2lkdGggPSB0aGlzLmdldFBhbmVsV2lkdGhGYWlsc2FmZSgpO1xuICAgIH1cbiAgICB0aGlzLnBhbmVsSGVpZ2h0ID0gdGhpcy5nZXRQYW5lbEhlaWdodCgpO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwfTtcbiAgICB2YXIgd2lkdGggPSB0aGlzLnBhbmVsV2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFuZWxIZWlnaHQ7XG5cbiAgICBtYXJnaW4udG9wID0gMDtcbiAgICAvLyBwcmUtdjUsIHdpdGggdGl0bGUsIHNldCB0b3AgbWFyZ2luIHRvIGF0IGxlYXN0IDdweFxuICAgIGlmICgodHlwZW9mIHRoaXMucGFuZWwuc3BhbiAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKHRoaXMucGFuZWwudGl0bGUgIT09IFwiXCIpKSB7XG4gICAgICBtYXJnaW4udG9wID0gNztcbiAgICB9XG4gICAgbWFyZ2luLmJvdHRvbSA9IDA7XG5cbiAgICAvLyBuZXcgYXR0cmlidXRlcyBtYXkgbm90IGJlIGRlZmluZWQgaW4gb2xkZXIgcGFuZWwgZGVmaW5pdGlvbnNcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPSAyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9XG5cbiAgICB2YXIgb3B0ID0ge1xuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICByYWRpdXMgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyxcbiAgICAgIHJhZGl1c0F1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1c0F1dG9TaXplLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBGb250U2l6ZSxcbiAgICAgIHRvb2x0aXBGb250VHlwZTogdGhpcy5wYW5lbC5wb2x5c3RhdC50b29sdGlwRm9udFR5cGUsXG4gICAgICBkYXRhOiB0aGlzLnBvbHlzdGF0RGF0YSxcbiAgICAgIGRpc3BsYXlMaW1pdDogdGhpcy5wYW5lbC5wb2x5c3RhdC5kaXNwbGF5TGltaXQsXG4gICAgICBnbG9iYWxEaXNwbGF5TW9kZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSxcbiAgICAgIGNvbHVtbnM6IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1ucyxcbiAgICAgIGNvbHVtbkF1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbkF1dG9TaXplLFxuICAgICAgcm93czogdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzLFxuICAgICAgcm93QXV0b1NpemUgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd0F1dG9TaXplLFxuICAgICAgdG9vbHRpcENvbnRlbnQ6IHRoaXMudG9vbHRpcENvbnRlbnQsXG4gICAgICBhbmltYXRpb25TcGVlZDogdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IHRoaXMuZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpLFxuICAgICAgcG9seXN0YXQ6IHRoaXMucGFuZWwucG9seXN0YXQsXG4gICAgfTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbmV3IEQzV3JhcHBlcih0aGlzLnRlbXBsYXRlU3J2LCB0aGlzLnN2Z0NvbnRhaW5lciwgdGhpcy5kM0RpdklkLCBvcHQpO1xuICAgIHRoaXMuZDNPYmplY3QuZHJhdygpO1xuICB9XG5cbiAgcmVtb3ZlVmFsdWVNYXAobWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwudmFsdWVNYXBzLCBtYXApO1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFZhbHVlTWFwKCkge1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnB1c2goe3ZhbHVlOiBcIlwiLCBvcDogXCI9XCIsIHRleHQ6IFwiXCIgfSk7XG4gIH1cblxuICByZW1vdmVSYW5nZU1hcChyYW5nZU1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFJhbmdlTWFwKCkge1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnB1c2goe2Zyb206IFwiXCIsIHRvOiBcIlwiLCB0ZXh0OiBcIlwifSk7XG4gIH1cblxuICBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgIGlmICghc2NvcGUpIHtcbiAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYXR0cnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHBhbmVsQnlDbGFzcyA9IGVsZW0uZmluZChcIi5ncmFmYW5hLWQzLXBvbHlzdGF0XCIpO1xuICAgIHBhbmVsQnlDbGFzcy5hcHBlbmQoXCI8ZGl2IHN0eWxlPVxcXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1xcXCIgaWQ9XFxcIlwiICsgY3RybC5jb250YWluZXJEaXZJZCArIFwiXFxcIj48L2Rpdj5cIik7XG4gICAgdmFyIGNvbnRhaW5lciA9IHBhbmVsQnlDbGFzc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgIGN0cmwuc2V0Q29udGFpbmVyKGNvbnRhaW5lcik7XG5cbiAgICBlbGVtID0gZWxlbS5maW5kKFwiLmdyYWZhbmEtZDMtcG9seXN0YXRcIik7XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICBjdHJsLnJlbmRlckQzKCk7XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzLm9uKFwicmVuZGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgd2lkdGhcbiAgICAgIGN0cmwucGFuZWxXaWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBjdHJsLnJlbmRlcmluZ0NvbXBsZXRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5kYXRhUmF3ID0gZGF0YUxpc3Q7XG4gICAgLy8gYXV0b21hdGljYWxseSBjb3JyZWN0IHRyYW5zZm9ybSBtb2RlIGJhc2VkIG9uIGRhdGFcbiAgICBpZiAodGhpcy5kYXRhUmF3ICYmIHRoaXMuZGF0YVJhdy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmRhdGFSYXdbMF0udHlwZSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0YWJsZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcImRvY3NcIikge1xuICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJqc29uXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFuZWwudHJhbnNmb3JtID09PSBcInRhYmxlXCIgfHwgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9IFwidGltZXNlcmllc190b19yb3dzXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlnbm9yZSB0aGUgYWJvdmUgYW5kIHVzZSBhIHRpbWVzZXJpZXNcbiAgICB0aGlzLnBvbHlzdGF0RGF0YS5sZW5ndGggPSAwO1xuICAgIGlmICh0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zZXJpZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBhU2VyaWVzID0gdGhpcy5zZXJpZXNbaW5kZXhdO1xuICAgICAgICBsZXQgY29udmVydGVkID0gVHJhbnNmb3JtZXJzLlRpbWVTZXJpZXNUb1BvbHlzdGF0KHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsT3BlcmF0b3JOYW1lLCBhU2VyaWVzKTtcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGEucHVzaChjb252ZXJ0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhcHBseSBnbG9iYWwgdW5pdCBmb3JtYXR0aW5nIGFuZCBkZWNpbWFsc1xuICAgIHRoaXMuYXBwbHlHbG9iYWxGb3JtYXR0aW5nKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBvdmVycmlkZXNcbiAgICB0aGlzLm92ZXJyaWRlc0N0cmwuYXBwbHlPdmVycmlkZXModGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGFwcGx5IGNvbXBvc2l0ZXMsIHRoaXMgd2lsbCBmaWx0ZXIgYXMgbmVlZGVkIGFuZCBzZXQgY2xpY2t0aHJvdWdoXG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSB0aGlzLmNvbXBvc2l0ZXNNYW5hZ2VyLmFwcGx5Q29tcG9zaXRlcyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgZ2xvYmFsIGNsaWNrdGhyb3VnaCB0byBhbGwgaXRlbXMgbm90IHNldFxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBvbHlzdGF0RGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGlmICh0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoID0gdGhpcy5nZXREZWZhdWx0Q2xpY2tUaHJvdWdoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZpbHRlciBvdXQgYnkgZ2xvYmFsRGlzcGxheU1vZGVcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuZmlsdGVyQnlHbG9iYWxEaXNwbGF5TW9kZSh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gbm93IHNvcnRcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IF8ub3JkZXJCeShcbiAgICAgIHRoaXMucG9seXN0YXREYXRhLFxuICAgICAgW3RoaXMucGFuZWwucG9seXN0YXQuaGV4YWdvblNvcnRCeUZpZWxkXSxcbiAgICAgIFt0aGlzLnBhbmVsLnBvbHlzdGF0LmhleGFnb25Tb3J0QnlEaXJlY3Rpb25dKTtcbiAgICAvLyBnZW5lcmF0ZSB0b29sdGlwc1xuICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBUb29sdGlwLmdlbmVyYXRlKHRoaXMuJHNjb3BlLCB0aGlzLnBvbHlzdGF0RGF0YSwgdGhpcy5wYW5lbC5wb2x5c3RhdCk7XG4gIH1cblxuICBhcHBseUdsb2JhbEZvcm1hdHRpbmcoZGF0YTogYW55KSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxVbml0Rm9ybWF0XTtcbiAgICAgIGlmIChmb3JtYXRGdW5jKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBHZXREZWNpbWFsc0ZvclZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERlY2ltYWxzKTtcbiAgICAgICAgZGF0YVtpbmRleF0udmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGFbaW5kZXhdLnZhbHVlLCByZXN1bHQuZGVjaW1hbHMsIHJlc3VsdC5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCByZXN1bHQuZGVjaW1hbHMpO1xuICAgICAgfVxuICAgICAgLy8gZGVmYXVsdCB0aGUgY29sb3IgdG8gdGhlIGdsb2JhbCBzZXR0aW5nXG4gICAgICBkYXRhW2luZGV4XS5jb2xvciA9IHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkdsb2JhbEZpbGxDb2xvcjtcbiAgICB9XG4gIH1cblxuXG4gIGZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUoZGF0YTogYW55KSB7XG4gICAgbGV0IGZpbHRlcmVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgbGV0IGNvbXBvc2l0ZU1ldHJpY3MgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICBpZiAodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSAhPT0gXCJhbGxcIikge1xuICAgICAgbGV0IGRhdGFMZW4gPSBkYXRhLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8ga2VlcCBpZiBjb21wb3NpdGVcbiAgICAgICAgaWYgKGl0ZW0uaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICBjb21wb3NpdGVNZXRyaWNzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgLy8gcHVzaCB0aGUgaW5kZXggbnVtYmVyXG4gICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZU1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIHNldCBkYXRhIHRvIGJlIGFsbCBvZiB0aGUgY29tcG9zaXRlc1xuICAgICAgICAgIGRhdGEgPSBjb21wb3NpdGVNZXRyaWNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB2YWx1ZUZvcm1hdHRlZDogMCxcbiAgICAgIHZhbHVlUm91bmRlZDogMFxuICAgIH07XG4gICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICBpbnZlcnRDb2xvck9yZGVyKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnBhbmVsLmNvbG9yc1swXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzJdID0gdG1wO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlZWQgbXVzdCBub3QgYmUgbGVzcyB0aGFuIDUwMG1zXG4gICAqL1xuICB2YWxpZGF0ZUFuaW1hdGlvblNwZWVkKCkge1xuICAgIGxldCBzcGVlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQ7XG4gICAgbGV0IG5ld1NwZWVkID0gNTAwMDtcbiAgICBpZiAoc3BlZWQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoc3BlZWQsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrU3BlZWQgPSBwYXJzZUludChzcGVlZCwgMTApO1xuICAgICAgICBpZiAoY2hlY2tTcGVlZCA+PSA1MDApIHtcbiAgICAgICAgICBuZXdTcGVlZCA9IGNoZWNrU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCA9IG5ld1NwZWVkO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZUNvbHVtblZhbHVlKCkge1xuICAgIGxldCBjb2x1bW5zID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zO1xuICAgIGxldCBuZXdDb2x1bW5zID0gMTtcbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChjb2x1bW5zLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0NvbHVtbnMgPSBwYXJzZUludChjb2x1bW5zLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0NvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgbmV3Q29sdW1ucyA9IGNoZWNrQ29sdW1ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMgPSBuZXdDb2x1bW5zO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJvd1ZhbHVlKCkge1xuICAgIGxldCByb3dzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzO1xuICAgIGxldCBuZXdSb3dzID0gMTtcbiAgICBpZiAocm93cykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyb3dzLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1Jvd3MgPSBwYXJzZUludChyb3dzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1Jvd3MgPiAwKSB7XG4gICAgICAgICAgbmV3Um93cyA9IGNoZWNrUm93cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MgPSBuZXdSb3dzO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJhZGl1c1ZhbHVlKCkge1xuICAgIGxldCByYWRpdXMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cztcbiAgICBsZXQgbmV3UmFkaXVzID0gMjU7XG4gICAgaWYgKHJhZGl1cyAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyYWRpdXMsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrUmFkaXVzID0gcGFyc2VJbnQocmFkaXVzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1JhZGl1cyA+IDApIHtcbiAgICAgICAgICBuZXdSYWRpdXMgPSBjaGVja1JhZGl1cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVCb3JkZXJTaXplVmFsdWUoKSB7XG4gICAgbGV0IGJvcmRlclNpemUgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplO1xuICAgIGxldCBuZXdCb3JkZXJTaXplID0gMjtcbiAgICBpZiAoYm9yZGVyU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChib3JkZXJTaXplLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0JvcmRlclNpemUgPSBwYXJzZUludChib3JkZXJTaXplLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0JvcmRlclNpemUgPj0gMCkge1xuICAgICAgICAgIG5ld0JvcmRlclNpemUgPSBjaGVja0JvcmRlclNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IG5ld0JvcmRlclNpemU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25Cb3JkZXJDb2xvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXBkYXRlUG9seWdvbkdsb2JhbEZpbGxDb2xvcigpIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IgPSBSR0JUb0hleCh0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXREZWZhdWx0Q2xpY2tUaHJvdWdoKCkge1xuICAgIGxldCB1cmwgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LmRlZmF1bHRDbGlja1Rocm91Z2g7XG4gICAgaWYgKCh1cmwpICYmICh0aGlzLnBhbmVsLnBvbHlzdGF0LmRlZmF1bHRDbGlja1Rocm91Z2hTYW5pdGl6ZSkpIHtcbiAgICAgIHVybCA9IHRoaXMuJHNhbml0aXplKHVybCk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBzZXRHbG9iYWxVbml0Rm9ybWF0KHN1Ykl0ZW0pIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbFVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICB9XG59XG5cblxuZXhwb3J0IHtcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCxcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCBhcyBNZXRyaWNzUGFuZWxDdHJsXG59O1xuIl19