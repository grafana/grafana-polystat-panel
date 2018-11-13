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
                    var mappingsPath = thisPanelPath + "partials/editor.mappings.html";
                    this.addEditorTab("Value Mappings", mappingsPath, 5);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFpQmtDLHVDQUFnQjtnQkErSGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F3QnpCO29CQXpCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkE3SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUssRUFBRSxR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RyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO3dCQUM5RCxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDM0I7b0JBQ0QsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxpREFBbUIsR0FBbkIsVUFBb0IsT0FBTztvQkFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDdkQsQ0FBQztnQkEzakJNLCtCQUFXLEdBQUcsd0JBQXdCLENBQUM7Z0JBNGpCaEQsMEJBQUM7YUFBQSxBQTdqQkQsQ0FBa0Msc0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5pbXBvcnQge01ldHJpY3NQYW5lbEN0cmx9IGZyb20gXCJhcHAvcGx1Z2lucy9zZGtcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCBrYm4gZnJvbSBcImFwcC9jb3JlL3V0aWxzL2tiblwiO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSBcImFwcC9jb3JlL3RpbWVfc2VyaWVzMlwiO1xuXG5pbXBvcnQgXCIuL2Nzcy9wb2x5c3RhdC5jc3MhXCI7XG5pbXBvcnQgeyBEM1dyYXBwZXIgfSBmcm9tIFwiLi9kM3dyYXBwZXJcIjtcbmltcG9ydCB7IFRyYW5zZm9ybWVycyB9IGZyb20gXCIuL3RyYW5zZm9ybWVyc1wiO1xuaW1wb3J0IHsgUG9seXN0YXRNb2RlbCB9IGZyb20gXCIuL3BvbHlzdGF0bW9kZWxcIjtcbmltcG9ydCB7IE1ldHJpY092ZXJyaWRlc01hbmFnZXIgfSBmcm9tIFwiLi9tZXRyaWNfb3ZlcnJpZGVzX21hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvc2l0ZXNNYW5hZ2VyIH0gZnJvbSBcIi4vY29tcG9zaXRlc19tYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb29sdGlwIH0gZnJvbSBcIi4vdG9vbHRpcFwiO1xuaW1wb3J0IHsgR2V0RGVjaW1hbHNGb3JWYWx1ZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuY2xhc3MgRDNQb2x5c3RhdFBhbmVsQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xuICBzdGF0aWMgdGVtcGxhdGVVcmwgPSBcInBhcnRpYWxzL3RlbXBsYXRlLmh0bWxcIjtcbiAgYW5pbWF0aW9uTW9kZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJhbGxcIiwgdGV4dDogXCJTaG93IEFsbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH1cbiAgXTtcbiAgZGlzcGxheU1vZGVzID0gW1xuICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgIHsgdmFsdWU6IFwidHJpZ2dlcmVkXCIsIHRleHQ6IFwiU2hvdyBUcmlnZ2VyZWRcIiB9XG4gIF07XG4gIHRocmVzaG9sZFN0YXRlcyA9IFtcbiAgICB7IHZhbHVlOiAwLCB0ZXh0OiBcIm9rXCIgfSxcbiAgICB7IHZhbHVlOiAxLCB0ZXh0OiBcIndhcm5pbmdcIiB9LFxuICAgIHsgdmFsdWU6IDIsIHRleHQ6IFwiY3JpdGljYWxcIiB9LFxuICAgIHsgdmFsdWU6IDMsIHRleHQ6IFwiY3VzdG9tXCIgfVxuICBdO1xuICBzaGFwZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBQb2ludGVkIFRvcFwiIH0sXG4gICAgLy97IHZhbHVlOiBcImhleGFnb25fZmxhdF90b3BcIiwgdGV4dDogXCJIZXhhZ29uIEZsYXQgVG9wXCIgfSxcbiAgICB7IHZhbHVlOiBcImNpcmNsZVwiLCB0ZXh0OiBcIkNpcmNsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcImNyb3NzXCIsIHRleHQ6IFwiQ3Jvc3NcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJkaWFtb25kXCIsIHRleHQ6IFwiRGlhbW9uZFwiIH0sXG4gICAgLy97IHZhbHVlOiBcInNxdWFyZVwiLCB0ZXh0OiBcIlNxdWFyZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInN0YXJcIiwgdGV4dDogXCJTdGFyXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwidHJpYW5nbGVcIiwgdGV4dDogXCJUcmlhbmdsZVwiIH0sXG4gICAgLy97IHZhbHVlOiBcInd5ZVwiLCB0ZXh0OiBcIld5ZVwiIH1cbiAgXTtcbiAgZm9udFNpemVzID0gW1xuICAgIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIgLCAxMywgMTQsIDE1LFxuICAgIDE2LCAxNywgMTgsIDE5LCAyMCwgMjIsIDI0LCAyNiwgMjgsIDMwLCAzMixcbiAgICAzNCwgMzYsIDM4LCA0MCwgNDIsIDQ0LCA0NiwgNDgsIDUwLCA1MiwgNTQsXG4gICAgNTYsIDU4LCA2MCwgNjIsIDY0LCA2NiwgNjgsIDcwXTtcbiAgZm9udFR5cGVzID0gW1xuICAgIFwiT3BlbiBTYW5zXCIsIFwiQXJpYWxcIiwgXCJBdmFudCBHYXJkZVwiLCBcIkJvb2ttYW5cIixcbiAgICBcIkNvbnNvbGFzXCIsIFwiQ291cmllclwiLCBcIkNvdXJpZXIgTmV3XCIsIFwiRnV0dXJhXCIsXG4gICAgXCJHYXJhbW9uZFwiLCBcIkhlbHZldGljYVwiLFxuICAgIFwiUGFsYXRpbm9cIiwgXCJSb2JvdG9cIiwgXCJUaW1lc1wiLCBcIlRpbWVzIE5ldyBSb21hblwiLFxuICAgIFwiVmVyZGFuYVwiXG4gIF07XG4gIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIG9wZXJhdG9yT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiBcImF2Z1wiLCB0ZXh0OiBcIkF2ZXJhZ2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiY291bnRcIiwgdGV4dDogXCJDb3VudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjdXJyZW50XCIsIHRleHQ6IFwiQ3VycmVudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZWx0YVwiLCB0ZXh0OiBcIkRlbHRhXCIgfSxcbiAgICB7IHZhbHVlOiBcImRpZmZcIiwgdGV4dDogXCJEaWZmZXJlbmNlXCIgfSxcbiAgICB7IHZhbHVlOiBcImZpcnN0XCIsIHRleHQ6IFwiRmlyc3RcIiB9LFxuICAgIHsgdmFsdWU6IFwibG9nbWluXCIsIHRleHQ6IFwiTG9nIE1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJtYXhcIiwgdGV4dDogXCJNYXhcIiB9LFxuICAgIHsgdmFsdWU6IFwibWluXCIsIHRleHQ6IFwiTWluXCIgfSxcbiAgICB7IHZhbHVlOiBcIm5hbWVcIiwgdGV4dDogXCJOYW1lXCIgfSxcbiAgICB7IHZhbHVlOiBcImxhc3RfdGltZVwiLCB0ZXh0OiBcIlRpbWUgb2YgTGFzdCBQb2ludFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aW1lX3N0ZXBcIiwgdGV4dDogXCJUaW1lIFN0ZXBcIiB9LFxuICAgIHsgdmFsdWU6IFwidG90YWxcIiwgdGV4dDogXCJUb3RhbFwiIH1cbiAgXTtcbiAgc29ydERpcmVjdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhc2NcIiwgdGV4dDogXCJBc2NlbmRpbmdcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVzY1wiLCB0ZXh0OiBcIkRlc2NlbmRpbmdcIiB9XG4gIF07XG4gIHNvcnRGaWVsZHMgPSBbXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aHJlc2hvbGRMZXZlbFwiLCB0ZXh0OiBcIlRocmVzaG9sZCBMZXZlbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ2YWx1ZVwiLCB0ZXh0OiBcIlZhbHVlXCIgfVxuICBdO1xuXG4gIGRhdGFSYXcgOiBhbnk7XG4gIHBvbHlzdGF0RGF0YTogUG9seXN0YXRNb2RlbFtdO1xuICBzY29wZXJlZjogYW55O1xuICBhbGVydFNydlJlZjogYW55O1xuICBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcGFuZWxDb250YWluZXI6IGFueTtcbiAgZDNPYmplY3Q6IEQzV3JhcHBlcjtcbiAgZGF0YTogYW55O1xuICBzZXJpZXM6IGFueVtdO1xuICB0ZW1wbGF0ZVNydjogYW55O1xuICBvdmVycmlkZXNDdHJsOiBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyO1xuICBjb21wb3NpdGVzTWFuYWdlciA6IENvbXBvc2l0ZXNNYW5hZ2VyO1xuICB0b29sdGlwQ29udGVudDogc3RyaW5nW107XG4gIGQzRGl2SWQ6IHN0cmluZztcbiAgY29udGFpbmVyRGl2SWQ6IHN0cmluZztcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIHBhbmVsV2lkdGg6IGFueTtcbiAgcGFuZWxIZWlnaHQ6IGFueTtcblxuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIHNhdmVkQ29tcG9zaXRlcyA6IFtdLFxuICAgIHNhdmVkT3ZlcnJpZGVzIDogW10sXG4gICAgY29sb3JzOiBbXCIjMjk5YzQ2XCIsIFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCIsIFwiI2Q0NGEzYVwiXSxcbiAgICBwb2x5c3RhdDoge1xuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MDAsXG4gICAgICBjb2x1bW5zOiBcIlwiLFxuICAgICAgY29sdW1uQXV0b1NpemU6IHRydWUsXG4gICAgICBkaXNwbGF5TGltaXQ6IDEwMCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IFwiXCIsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemU6IHRydWUsXG4gICAgICBmb250QXV0b1NjYWxlOiB0cnVlLFxuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICBnbG9iYWxVbml0Rm9ybWF0OiBcInNob3J0XCIsXG4gICAgICBnbG9iYWxEZWNpbWFsczogMixcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgZ2xvYmFsT3BlcmF0b3JOYW1lOiBcImF2Z1wiLFxuICAgICAgZ3JhZGllbnRFbmFibGVkOiB0cnVlLFxuICAgICAgaGV4YWdvblNvcnRCeURpcmVjdGlvbjogXCJhc2NcIixcbiAgICAgIGhleGFnb25Tb3J0QnlGaWVsZDogXCJuYW1lXCIsXG4gICAgICBtYXhNZXRyaWNzOiAwLFxuICAgICAgcG9seWdvbkJvcmRlclNpemU6IDIsXG4gICAgICBwb2x5Z29uQm9yZGVyQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgIHBvbHlnb25HbG9iYWxGaWxsQ29sb3I6IFwid2hpdGVcIixcbiAgICAgIHJhZGl1czogXCJcIixcbiAgICAgIHJhZGl1c0F1dG9TaXplOiB0cnVlLFxuICAgICAgcm93czogXCJcIixcbiAgICAgIHJvd0F1dG9TaXplOiB0cnVlLFxuICAgICAgc2hhcGU6IFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiLFxuICAgICAgdG9vbHRpcERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgdG9vbHRpcERpc3BsYXlUZXh0VHJpZ2dlcmVkRW1wdHk6IFwiT0tcIixcbiAgICAgIHRvb2x0aXBGb250U2l6ZTogMTIsXG4gICAgICB0b29sdGlwRm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFByaW1hcnlTb3J0RmllbGQ6IFwidGhyZXNob2xkTGV2ZWxcIixcbiAgICAgIHRvb2x0aXBTZWNvbmRhcnlTb3J0RGlyZWN0aW9uOiBcImRlc2NcIixcbiAgICAgIHRvb2x0aXBTZWNvbmRhcnlTb3J0RmllbGQ6IFwidmFsdWVcIixcbiAgICAgIHRvb2x0aXBUaW1lc3RhbXBFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gIH07XG5cblxuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgdGVtcGxhdGVTcnYsIGFsZXJ0U3J2LCBwcml2YXRlICRzYW5pdGl6ZSkge1xuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICAvLyBtZXJnZSBleGlzdGluZyBzZXR0aW5ncyB3aXRoIG91ciBkZWZhdWx0c1xuICAgIF8uZGVmYXVsdHModGhpcy5wYW5lbCwgdGhpcy5wYW5lbERlZmF1bHRzKTtcbiAgICB0aGlzLmQzRGl2SWQgPSBcImQzX3N2Z19cIiArIHRoaXMucGFuZWwuaWQ7XG4gICAgdGhpcy5jb250YWluZXJEaXZJZCA9IFwiY29udGFpbmVyX1wiICsgdGhpcy5kM0RpdklkO1xuICAgIHRoaXMuYWxlcnRTcnZSZWYgPSBhbGVydFNydjtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5wYW5lbENvbnRhaW5lciA9IG51bGw7XG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLnBhbmVsV2lkdGggPSBudWxsO1xuICAgIHRoaXMucGFuZWxIZWlnaHQgPSBudWxsO1xuICAgIHRoaXMucG9seXN0YXREYXRhID0gbmV3IEFycmF5PFBvbHlzdGF0TW9kZWw+KCk7XG4gICAgdGhpcy5kM09iamVjdCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy5zZXJpZXMgPSBbXTtcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IFtdO1xuICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBbXTtcbiAgICB0aGlzLm92ZXJyaWRlc0N0cmwgPSBuZXcgTWV0cmljT3ZlcnJpZGVzTWFuYWdlcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHRoaXMucGFuZWwuc2F2ZWRPdmVycmlkZXMpO1xuICAgIHRoaXMuY29tcG9zaXRlc01hbmFnZXIgPSBuZXcgQ29tcG9zaXRlc01hbmFnZXIoJHNjb3BlLCB0ZW1wbGF0ZVNydiwgJHNhbml0aXplLCB0aGlzLnBhbmVsLnNhdmVkQ29tcG9zaXRlcyk7XG4gICAgdGhpcy5ldmVudHMub24oXCJpbml0LWVkaXQtbW9kZVwiLCB0aGlzLm9uSW5pdEVkaXRNb2RlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1yZWNlaXZlZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1lcnJvclwiLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1zbmFwc2hvdC1sb2FkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gIH1cblxuXG4gIG9uSW5pdEVkaXRNb2RlKCkge1xuICAgIC8vIGRldGVybWluZSB0aGUgcGF0aCB0byB0aGlzIHBsdWdpbiBiYXNlIG9uIHRoZSBuYW1lIGZvdW5kIGluIHBhbmVsLnR5cGVcbiAgICB2YXIgdGhpc1BhbmVsUGF0aCA9IFwicHVibGljL3BsdWdpbnMvXCIgKyB0aGlzLnBhbmVsLnR5cGUgKyBcIi9cIjtcbiAgICAvLyBhZGQgdGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIHBhcnRpYWxcbiAgICB2YXIgb3B0aW9uc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3Iub3B0aW9ucy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJPcHRpb25zXCIsIG9wdGlvbnNQYXRoLCAyKTtcbiAgICB2YXIgb3ZlcnJpZGVzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5vdmVycmlkZXMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiT3ZlcnJpZGVzXCIsIG92ZXJyaWRlc1BhdGgsIDMpO1xuICAgIHZhciBjb21wb3NpdGVzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5jb21wb3NpdGVzLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIkNvbXBvc2l0ZXNcIiwgY29tcG9zaXRlc1BhdGgsIDQpO1xuICAgIHZhciBtYXBwaW5nc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3IubWFwcGluZ3MuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiVmFsdWUgTWFwcGluZ3NcIiwgbWFwcGluZ3NQYXRoLCA1KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBbc2V0Q29udGFpbmVyIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0ge1t0eXBlXX0gY29udGFpbmVyIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNldENvbnRhaW5lcihjb250YWluZXIpIHtcbiAgICB0aGlzLnBhbmVsQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gY29udGFpbmVyO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBhIHBhbmVsIGJ5IHRoZSBzcGFuIGFuZCB2aWV3cG9ydFxuICAvLyB0aGUgbGluayBlbGVtZW50IG9iamVjdCBjYW4gYmUgdXNlZCB0byBnZXQgdGhlIHdpZHRoIG1vcmUgcmVsaWFibHlcbiAgZ2V0UGFuZWxXaWR0aEZhaWxzYWZlKCkge1xuICAgIHZhciB0cnVlV2lkdGggPSAwO1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5ncmlkUG9zICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyAyNCBzbG90cyBpcyBmdWxsc2NyZWVuLCBnZXQgdGhlIHZpZXdwb3J0IGFuZCBkaXZpZGUgdG8gYXBwcm94aW1hdGUgdGhlIHdpZHRoXG4gICAgICBsZXQgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyU2xvdCA9IHZpZXdQb3J0V2lkdGggLyAyNDtcbiAgICAgIHRydWVXaWR0aCA9IE1hdGgucm91bmQodGhpcy5wYW5lbC5ncmlkUG9zLncgKiBwaXhlbHNQZXJTbG90KTtcbiAgICAgIHJldHVybiB0cnVlV2lkdGg7XG4gICAgfVxuICAgIC8vIGdyYWZhbmE1IC0gdXNlIHRoaXMucGFuZWwuZ3JpZFBvcy53LCB0aGlzLnBhbmVsLmdyaWRQb3MuaFxuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyBjaGVjayBpZiBpbnNpZGUgZWRpdCBtb2RlXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZUluaXRpYXRlZCkge1xuICAgICAgICAvLyB3aWR0aCBpcyBjbGllbnRXaWR0aCBvZiBkb2N1bWVudFxuICAgICAgICB0cnVlV2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldCB0aGUgd2lkdGggYmFzZWQgb24gdGhlIHNjYWxlZCBjb250YWluZXIgKHY1IG5lZWRzIHRoaXMpXG4gICAgICAgIHRydWVXaWR0aCA9IHRoaXMucGFuZWxDb250YWluZXIub2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB2NCBhbmQgcHJldmlvdXMgdXNlZCBmaXhlZCBzcGFuc1xuICAgICAgdmFyIHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgLy8gZ2V0IHRoZSBwaXhlbHMgb2YgYSBzcGFuXG4gICAgICB2YXIgcGl4ZWxzUGVyU3BhbiA9IHZpZXdQb3J0V2lkdGggLyAxMjtcbiAgICAgIC8vIG11bHRpcGx5IG51bSBzcGFucyBieSBwaXhlbHNQZXJTcGFuXG4gICAgICB0cnVlV2lkdGggPSBNYXRoLnJvdW5kKHRoaXMucGFuZWwuc3BhbiAqIHBpeGVsc1BlclNwYW4pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVdpZHRoO1xuICB9XG5cbiAgZ2V0UGFuZWxIZWlnaHQoKSB7XG4gICAgLy8gcGFuZWwgY2FuIGhhdmUgYSBmaXhlZCBoZWlnaHQgc2V0IHZpYSBcIkdlbmVyYWxcIiB0YWIgaW4gcGFuZWwgZWRpdG9yXG4gICAgdmFyIHRtcFBhbmVsSGVpZ2h0ID0gdGhpcy5wYW5lbC5oZWlnaHQ7XG4gICAgaWYgKCh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHx8ICh0bXBQYW5lbEhlaWdodCA9PT0gXCJcIikpIHtcbiAgICAgIC8vIGdyYWZhbmEgYWxzbyBzdXBwbGllcyB0aGUgaGVpZ2h0LCB0cnkgdG8gdXNlIHRoYXQgaWYgdGhlIHBhbmVsIGRvZXMgbm90IGhhdmUgYSBoZWlnaHRcbiAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gU3RyaW5nKHRoaXMuaGVpZ2h0KTtcbiAgICAgIC8vIHY0IGFuZCBlYXJsaWVyIGRlZmluZSB0aGlzIGhlaWdodCwgZGV0ZWN0IHNwYW4gZm9yIHByZS12NVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGVhZGVyLCBhZGp1c3QgaGVpZ2h0IHRvIHVzZSBhbGwgc3BhY2UgYXZhaWxhYmxlXG4gICAgICAgIHZhciBwYW5lbFRpdGxlT2Zmc2V0ID0gMjA7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLnRpdGxlICE9PSBcIlwiKSB7XG4gICAgICAgICAgcGFuZWxUaXRsZU9mZnNldCA9IDQyO1xuICAgICAgICB9XG4gICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gU3RyaW5nKHRoaXMuY29udGFpbmVySGVpZ2h0IC0gcGFuZWxUaXRsZU9mZnNldCk7IC8vIG9mZnNldCBmb3IgaGVhZGVyXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIGhlaWdodCBzdGlsbCBjYW5ub3QgYmUgZGV0ZXJtaW5lZCwgZ2V0IGl0IGZyb20gdGhlIHJvdyBpbnN0ZWFkXG4gICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gdGhpcy5yb3cuaGVpZ2h0O1xuICAgICAgICBpZiAodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgLy8gbGFzdCByZXNvcnQgLSBkZWZhdWx0IHRvIDI1MHB4ICh0aGlzIHNob3VsZCBuZXZlciBoYXBwZW4pXG4gICAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSBcIjI1MFwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJlcGxhY2UgcHhcbiAgICB0bXBQYW5lbEhlaWdodCA9IHRtcFBhbmVsSGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKTtcbiAgICAvLyBjb252ZXJ0IHRvIG51bWVyaWMgdmFsdWVcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gcGFyc2VJbnQodG1wUGFuZWxIZWlnaHQsIDEwKTtcbiAgICByZXR1cm4gYWN0dWFsSGVpZ2h0O1xuICB9XG5cbiAgY2xlYXJTVkcoKSB7XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLmQzRGl2SWQpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCkucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItcGFuZWxcIikubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItcGFuZWxcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckQzKCkge1xuICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuZGF0YSk7XG4gICAgdGhpcy5jbGVhclNWRygpO1xuICAgIGlmICh0aGlzLnBhbmVsV2lkdGggPT09IDApIHtcbiAgICAgIHRoaXMucGFuZWxXaWR0aCA9IHRoaXMuZ2V0UGFuZWxXaWR0aEZhaWxzYWZlKCk7XG4gICAgfVxuICAgIHRoaXMucGFuZWxIZWlnaHQgPSB0aGlzLmdldFBhbmVsSGVpZ2h0KCk7XG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIGxlZnQ6IDB9O1xuICAgIHZhciB3aWR0aCA9IHRoaXMucGFuZWxXaWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYW5lbEhlaWdodDtcblxuICAgIG1hcmdpbi50b3AgPSAwO1xuICAgIC8vIHByZS12NSwgd2l0aCB0aXRsZSwgc2V0IHRvcCBtYXJnaW4gdG8gYXQgbGVhc3QgN3B4XG4gICAgaWYgKCh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuICE9PSBcInVuZGVmaW5lZFwiKSAmJiAodGhpcy5wYW5lbC50aXRsZSAhPT0gXCJcIikpIHtcbiAgICAgIG1hcmdpbi50b3AgPSA3O1xuICAgIH1cbiAgICBtYXJnaW4uYm90dG9tID0gMDtcblxuICAgIC8vIG5ldyBhdHRyaWJ1dGVzIG1heSBub3QgYmUgZGVmaW5lZCBpbiBvbGRlciBwYW5lbCBkZWZpbml0aW9uc1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IDI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yID0gXCJibGFja1wiO1xuICAgIH1cblxuICAgIHZhciBvcHQgPSB7XG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHJhZGl1cyA6IHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzQXV0b1NpemUsXG4gICAgICB0b29sdGlwRm9udFNpemU6IHRoaXMucGFuZWwucG9seXN0YXQudG9vbHRpcEZvbnRTaXplLFxuICAgICAgdG9vbHRpcEZvbnRUeXBlOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBGb250VHlwZSxcbiAgICAgIGRhdGE6IHRoaXMucG9seXN0YXREYXRhLFxuICAgICAgZGlzcGxheUxpbWl0OiB0aGlzLnBhbmVsLnBvbHlzdGF0LmRpc3BsYXlMaW1pdCxcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERpc3BsYXlNb2RlLFxuICAgICAgY29sdW1uczogdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zLFxuICAgICAgY29sdW1uQXV0b1NpemU6IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1uQXV0b1NpemUsXG4gICAgICByb3dzOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MsXG4gICAgICByb3dBdXRvU2l6ZSA6IHRoaXMucGFuZWwucG9seXN0YXQucm93QXV0b1NpemUsXG4gICAgICB0b29sdGlwQ29udGVudDogdGhpcy50b29sdGlwQ29udGVudCxcbiAgICAgIGFuaW1hdGlvblNwZWVkOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmFuaW1hdGlvblNwZWVkLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaDogdGhpcy5nZXREZWZhdWx0Q2xpY2tUaHJvdWdoKCksXG4gICAgICBwb2x5c3RhdDogdGhpcy5wYW5lbC5wb2x5c3RhdCxcbiAgICB9O1xuICAgIHRoaXMuZDNPYmplY3QgPSBuZXcgRDNXcmFwcGVyKHRoaXMudGVtcGxhdGVTcnYsIHRoaXMuc3ZnQ29udGFpbmVyLCB0aGlzLmQzRGl2SWQsIG9wdCk7XG4gICAgdGhpcy5kM09iamVjdC5kcmF3KCk7XG4gIH1cblxuICByZW1vdmVWYWx1ZU1hcChtYXApIHtcbiAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YodGhpcy5wYW5lbC52YWx1ZU1hcHMsIG1hcCk7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkVmFsdWVNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMucHVzaCh7dmFsdWU6IFwiXCIsIG9wOiBcIj1cIiwgdGV4dDogXCJcIiB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7ZnJvbTogXCJcIiwgdG86IFwiXCIsIHRleHQ6IFwiXCJ9KTtcbiAgfVxuXG4gIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgaWYgKCFzY29wZSkge1xuICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhdHRycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZDNCeUNsYXNzID0gZWxlbS5maW5kKFwiLmdyYWZhbmEtZDMtcG9seXN0YXRcIik7XG4gICAgZDNCeUNsYXNzLmFwcGVuZChcIjxkaXYgaWQ9XFxcIlwiICsgY3RybC5jb250YWluZXJEaXZJZCArIFwiXFxcIj48L2Rpdj5cIik7XG4gICAgdmFyIGNvbnRhaW5lciA9IGQzQnlDbGFzc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgIGN0cmwuc2V0Q29udGFpbmVyKGNvbnRhaW5lcik7XG5cbiAgICBlbGVtID0gZWxlbS5maW5kKFwiLmdyYWZhbmEtZDMtcG9seXN0YXRcIik7XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICBjdHJsLnJlbmRlckQzKCk7XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzLm9uKFwicmVuZGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgd2lkdGhcbiAgICAgIGN0cmwucGFuZWxXaWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBjdHJsLnJlbmRlcmluZ0NvbXBsZXRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5kYXRhUmF3ID0gZGF0YUxpc3Q7XG4gICAgLy8gYXV0b21hdGljYWxseSBjb3JyZWN0IHRyYW5zZm9ybSBtb2RlIGJhc2VkIG9uIGRhdGFcbiAgICBpZiAodGhpcy5kYXRhUmF3ICYmIHRoaXMuZGF0YVJhdy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmRhdGFSYXdbMF0udHlwZSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0YWJsZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcImRvY3NcIikge1xuICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJqc29uXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFuZWwudHJhbnNmb3JtID09PSBcInRhYmxlXCIgfHwgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9IFwidGltZXNlcmllc190b19yb3dzXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlnbm9yZSB0aGUgYWJvdmUgYW5kIHVzZSBhIHRpbWVzZXJpZXNcbiAgICB0aGlzLnBvbHlzdGF0RGF0YS5sZW5ndGggPSAwO1xuICAgIGlmICh0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zZXJpZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBhU2VyaWVzID0gdGhpcy5zZXJpZXNbaW5kZXhdO1xuICAgICAgICBsZXQgY29udmVydGVkID0gVHJhbnNmb3JtZXJzLlRpbWVTZXJpZXNUb1BvbHlzdGF0KHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsT3BlcmF0b3JOYW1lLCBhU2VyaWVzKTtcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGEucHVzaChjb252ZXJ0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhcHBseSBnbG9iYWwgdW5pdCBmb3JtYXR0aW5nIGFuZCBkZWNpbWFsc1xuICAgIHRoaXMuYXBwbHlHbG9iYWxGb3JtYXR0aW5nKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBvdmVycmlkZXNcbiAgICB0aGlzLm92ZXJyaWRlc0N0cmwuYXBwbHlPdmVycmlkZXModGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGFwcGx5IGNvbXBvc2l0ZXMsIHRoaXMgd2lsbCBmaWx0ZXIgYXMgbmVlZGVkIGFuZCBzZXQgY2xpY2t0aHJvdWdoXG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSB0aGlzLmNvbXBvc2l0ZXNNYW5hZ2VyLmFwcGx5Q29tcG9zaXRlcyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgZ2xvYmFsIGNsaWNrdGhyb3VnaCB0byBhbGwgaXRlbXMgbm90IHNldFxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBvbHlzdGF0RGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGlmICh0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoID0gdGhpcy5nZXREZWZhdWx0Q2xpY2tUaHJvdWdoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZpbHRlciBvdXQgYnkgZ2xvYmFsRGlzcGxheU1vZGVcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuZmlsdGVyQnlHbG9iYWxEaXNwbGF5TW9kZSh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gbm93IHNvcnRcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IF8ub3JkZXJCeShcbiAgICAgIHRoaXMucG9seXN0YXREYXRhLFxuICAgICAgW3RoaXMucGFuZWwucG9seXN0YXQuaGV4YWdvblNvcnRCeUZpZWxkXSxcbiAgICAgIFt0aGlzLnBhbmVsLnBvbHlzdGF0LmhleGFnb25Tb3J0QnlEaXJlY3Rpb25dKTtcbiAgICAvLyBnZW5lcmF0ZSB0b29sdGlwc1xuICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBUb29sdGlwLmdlbmVyYXRlKHRoaXMuJHNjb3BlLCB0aGlzLnBvbHlzdGF0RGF0YSwgdGhpcy5wYW5lbC5wb2x5c3RhdCk7XG4gIH1cblxuICBhcHBseUdsb2JhbEZvcm1hdHRpbmcoZGF0YTogYW55KSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxVbml0Rm9ybWF0XTtcbiAgICAgIGlmIChmb3JtYXRGdW5jKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBHZXREZWNpbWFsc0ZvclZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERlY2ltYWxzKTtcbiAgICAgICAgZGF0YVtpbmRleF0udmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGFbaW5kZXhdLnZhbHVlLCByZXN1bHQuZGVjaW1hbHMsIHJlc3VsdC5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGFbaW5kZXhdLnZhbHVlLCByZXN1bHQuZGVjaW1hbHMpO1xuICAgICAgfVxuICAgICAgLy8gZGVmYXVsdCB0aGUgY29sb3IgdG8gdGhlIGdsb2JhbCBzZXR0aW5nXG4gICAgICBkYXRhW2luZGV4XS5jb2xvciA9IHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkdsb2JhbEZpbGxDb2xvcjtcbiAgICB9XG4gIH1cblxuXG4gIGZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUoZGF0YTogYW55KSB7XG4gICAgbGV0IGZpbHRlcmVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgbGV0IGNvbXBvc2l0ZU1ldHJpY3MgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICBpZiAodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSAhPT0gXCJhbGxcIikge1xuICAgICAgbGV0IGRhdGFMZW4gPSBkYXRhLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8ga2VlcCBpZiBjb21wb3NpdGVcbiAgICAgICAgaWYgKGl0ZW0uaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICBjb21wb3NpdGVNZXRyaWNzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgLy8gcHVzaCB0aGUgaW5kZXggbnVtYmVyXG4gICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZU1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIHNldCBkYXRhIHRvIGJlIGFsbCBvZiB0aGUgY29tcG9zaXRlc1xuICAgICAgICAgIGRhdGEgPSBjb21wb3NpdGVNZXRyaWNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB2YWx1ZUZvcm1hdHRlZDogMCxcbiAgICAgIHZhbHVlUm91bmRlZDogMFxuICAgIH07XG4gICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICBpbnZlcnRDb2xvck9yZGVyKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnBhbmVsLmNvbG9yc1swXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzJdID0gdG1wO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlZWQgbXVzdCBub3QgYmUgbGVzcyB0aGFuIDUwMG1zXG4gICAqL1xuICB2YWxpZGF0ZUFuaW1hdGlvblNwZWVkKCkge1xuICAgIGxldCBzcGVlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQ7XG4gICAgbGV0IG5ld1NwZWVkID0gNTAwMDtcbiAgICBpZiAoc3BlZWQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoc3BlZWQsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrU3BlZWQgPSBwYXJzZUludChzcGVlZCwgMTApO1xuICAgICAgICBpZiAoY2hlY2tTcGVlZCA+PSA1MDApIHtcbiAgICAgICAgICBuZXdTcGVlZCA9IGNoZWNrU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCA9IG5ld1NwZWVkO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZUNvbHVtblZhbHVlKCkge1xuICAgIGxldCBjb2x1bW5zID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zO1xuICAgIGxldCBuZXdDb2x1bW5zID0gMTtcbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChjb2x1bW5zLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0NvbHVtbnMgPSBwYXJzZUludChjb2x1bW5zLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0NvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgbmV3Q29sdW1ucyA9IGNoZWNrQ29sdW1ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMgPSBuZXdDb2x1bW5zO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJvd1ZhbHVlKCkge1xuICAgIGxldCByb3dzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzO1xuICAgIGxldCBuZXdSb3dzID0gMTtcbiAgICBpZiAocm93cykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyb3dzLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1Jvd3MgPSBwYXJzZUludChyb3dzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1Jvd3MgPiAwKSB7XG4gICAgICAgICAgbmV3Um93cyA9IGNoZWNrUm93cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MgPSBuZXdSb3dzO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJhZGl1c1ZhbHVlKCkge1xuICAgIGxldCByYWRpdXMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cztcbiAgICBsZXQgbmV3UmFkaXVzID0gMjU7XG4gICAgaWYgKHJhZGl1cyAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyYWRpdXMsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrUmFkaXVzID0gcGFyc2VJbnQocmFkaXVzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1JhZGl1cyA+IDApIHtcbiAgICAgICAgICBuZXdSYWRpdXMgPSBjaGVja1JhZGl1cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVCb3JkZXJTaXplVmFsdWUoKSB7XG4gICAgbGV0IGJvcmRlclNpemUgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplO1xuICAgIGxldCBuZXdCb3JkZXJTaXplID0gMjtcbiAgICBpZiAoYm9yZGVyU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChib3JkZXJTaXplLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0JvcmRlclNpemUgPSBwYXJzZUludChib3JkZXJTaXplLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0JvcmRlclNpemUgPj0gMCkge1xuICAgICAgICAgIG5ld0JvcmRlclNpemUgPSBjaGVja0JvcmRlclNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IG5ld0JvcmRlclNpemU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25Cb3JkZXJDb2xvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXBkYXRlUG9seWdvbkdsb2JhbEZpbGxDb2xvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpIHtcbiAgICBsZXQgdXJsID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoO1xuICAgIGlmICgodXJsKSAmJiAodGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemUpKSB7XG4gICAgICB1cmwgPSB0aGlzLiRzYW5pdGl6ZSh1cmwpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgc2V0R2xvYmFsVW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxVbml0Rm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgfVxufVxuXG5cbmV4cG9ydCB7XG4gIEQzUG9seXN0YXRQYW5lbEN0cmwsXG4gIEQzUG9seXN0YXRQYW5lbEN0cmwgYXMgTWV0cmljc1BhbmVsQ3RybFxufTtcbiJdfQ==