System.register(["app/plugins/sdk", "lodash", "jquery", "app/core/utils/kbn", "app/core/time_series2", "./css/polystat.css!", "./d3wrapper", "./transformers", "./metric_overrides_manager", "./composites_manager", "./tooltip", "./utils", "./clickThroughTransformer"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var sdk_1, lodash_1, jquery_1, kbn_1, time_series2_1, d3wrapper_1, transformers_1, metric_overrides_manager_1, composites_manager_1, tooltip_1, utils_1, clickThroughTransformer_1, D3PolystatPanelCtrl;
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
            },
            function (clickThroughTransformer_1_1) {
                clickThroughTransformer_1 = clickThroughTransformer_1_1;
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
                        defaultClickThrough: this.getDefaultClickThrough(NaN),
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
                    this.polystatData = this.filterByGlobalDisplayMode(this.polystatData);
                    this.polystatData = lodash_1.default.orderBy(this.polystatData, [this.panel.polystat.hexagonSortByField], [this.panel.polystat.hexagonSortByDirection]);
                    this.overridesCtrl.applyOverrides(this.polystatData);
                    this.polystatData = this.compositesManager.applyComposites(this.polystatData);
                    for (var index = 0; index < this.polystatData.length; index++) {
                        if (this.polystatData[index].clickThrough.length === 0) {
                            this.polystatData[index].clickThrough = this.getDefaultClickThrough(index);
                            this.polystatData[index].sanitizeURLEnabled = this.panel.polystat.defaultClickThroughSanitize;
                            this.polystatData[index].sanitizedURL = this.$sanitize(this.polystatData[index].clickThrough);
                        }
                    }
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
                    this.panel.polystat.polygonBorderColor = utils_1.RGBToHex(this.panel.polystat.polygonBorderColor);
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.updatePolygonGlobalFillColor = function () {
                    this.panel.polystat.polygonGlobalFillColor = utils_1.RGBToHex(this.panel.polystat.polygonGlobalFillColor);
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.getDefaultClickThrough = function (index) {
                    var url = this.panel.polystat.defaultClickThrough;
                    url = clickThroughTransformer_1.ClickThroughTransformer.tranformSingleMetric(index, url, this.polystatData);
                    url = clickThroughTransformer_1.ClickThroughTransformer.tranformNthMetric(url, this.polystatData);
                    url = this.templateSrv.replaceWithText(url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFrQmtDLHVDQUFnQjtnQkEwSGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F5QnpCO29CQTFCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkF4SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUss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Z0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUNsRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRUQsb0RBQXNCLEdBQXRCLFVBQXVCLEtBQWE7b0JBQ2xDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO29CQUVsRCxHQUFHLEdBQUcsaURBQXVCLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ2xGLEdBQUcsR0FBRyxpREFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUV4RSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVDLE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsaURBQW1CLEdBQW5CLFVBQW9CLE9BQU87b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZELENBQUM7Z0JBaGtCTSwrQkFBVyxHQUFHLHdCQUF3QixDQUFDO2dCQWlrQmhELDBCQUFDO2FBQUEsQUFsa0JELENBQWtDLHNCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuaW1wb3J0IHtNZXRyaWNzUGFuZWxDdHJsfSBmcm9tIFwiYXBwL3BsdWdpbnMvc2RrXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcblxuaW1wb3J0IFwiLi9jc3MvcG9seXN0YXQuY3NzIVwiO1xuaW1wb3J0IHsgRDNXcmFwcGVyIH0gZnJvbSBcIi4vZDN3cmFwcGVyXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm1lcnMgfSBmcm9tIFwiLi90cmFuc2Zvcm1lcnNcIjtcbmltcG9ydCB7IFBvbHlzdGF0TW9kZWwgfSBmcm9tIFwiLi9wb2x5c3RhdG1vZGVsXCI7XG5pbXBvcnQgeyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyLCBNZXRyaWNPdmVycmlkZSB9IGZyb20gXCIuL21ldHJpY19vdmVycmlkZXNfbWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlc01hbmFnZXIgfSBmcm9tIFwiLi9jb21wb3NpdGVzX21hbmFnZXJcIjtcbmltcG9ydCB7IFRvb2x0aXAgfSBmcm9tIFwiLi90b29sdGlwXCI7XG5pbXBvcnQgeyBHZXREZWNpbWFsc0ZvclZhbHVlLCBSR0JUb0hleCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge0NsaWNrVGhyb3VnaFRyYW5zZm9ybWVyfSBmcm9tIFwiLi9jbGlja1Rocm91Z2hUcmFuc2Zvcm1lclwiO1xuXG5cbmNsYXNzIEQzUG9seXN0YXRQYW5lbEN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gXCJwYXJ0aWFscy90ZW1wbGF0ZS5odG1sXCI7XG4gIGFuaW1hdGlvbk1vZGVzID0gW1xuICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgIHsgdmFsdWU6IFwidHJpZ2dlcmVkXCIsIHRleHQ6IFwiU2hvdyBUcmlnZ2VyZWRcIiB9XG4gIF07XG4gIGRpc3BsYXlNb2RlcyA9IFtcbiAgICB7IHZhbHVlOiBcImFsbFwiLCB0ZXh0OiBcIlNob3cgQWxsXCIgfSxcbiAgICB7IHZhbHVlOiBcInRyaWdnZXJlZFwiLCB0ZXh0OiBcIlNob3cgVHJpZ2dlcmVkXCIgfVxuICBdO1xuICB0aHJlc2hvbGRTdGF0ZXMgPSBbXG4gICAgeyB2YWx1ZTogMCwgdGV4dDogXCJva1wiIH0sXG4gICAgeyB2YWx1ZTogMSwgdGV4dDogXCJ3YXJuaW5nXCIgfSxcbiAgICB7IHZhbHVlOiAyLCB0ZXh0OiBcImNyaXRpY2FsXCIgfSxcbiAgICB7IHZhbHVlOiAzLCB0ZXh0OiBcImN1c3RvbVwiIH1cbiAgXTtcbiAgc2hhcGVzID0gW1xuICAgIHsgdmFsdWU6IFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiLCB0ZXh0OiBcIkhleGFnb24gUG9pbnRlZCBUb3BcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJoZXhhZ29uX2ZsYXRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBGbGF0IFRvcFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjaXJjbGVcIiwgdGV4dDogXCJDaXJjbGVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJjcm9zc1wiLCB0ZXh0OiBcIkNyb3NzXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwiZGlhbW9uZFwiLCB0ZXh0OiBcIkRpYW1vbmRcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJzcXVhcmVcIiwgdGV4dDogXCJTcXVhcmVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJzdGFyXCIsIHRleHQ6IFwiU3RhclwiIH0sXG4gICAgLy97IHZhbHVlOiBcInRyaWFuZ2xlXCIsIHRleHQ6IFwiVHJpYW5nbGVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJ3eWVcIiwgdGV4dDogXCJXeWVcIiB9XG4gIF07XG4gIGZvbnRTaXplcyA9IFtcbiAgICA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyICwgMTMsIDE0LCAxNSxcbiAgICAxNiwgMTcsIDE4LCAxOSwgMjAsIDIyLCAyNCwgMjYsIDI4LCAzMCwgMzIsXG4gICAgMzQsIDM2LCAzOCwgNDAsIDQyLCA0NCwgNDYsIDQ4LCA1MCwgNTIsIDU0LFxuICAgIDU2LCA1OCwgNjAsIDYyLCA2NCwgNjYsIDY4LCA3MF07XG4gIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIG9wZXJhdG9yT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiBcImF2Z1wiLCB0ZXh0OiBcIkF2ZXJhZ2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiY291bnRcIiwgdGV4dDogXCJDb3VudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjdXJyZW50XCIsIHRleHQ6IFwiQ3VycmVudFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZWx0YVwiLCB0ZXh0OiBcIkRlbHRhXCIgfSxcbiAgICB7IHZhbHVlOiBcImRpZmZcIiwgdGV4dDogXCJEaWZmZXJlbmNlXCIgfSxcbiAgICB7IHZhbHVlOiBcImZpcnN0XCIsIHRleHQ6IFwiRmlyc3RcIiB9LFxuICAgIHsgdmFsdWU6IFwibG9nbWluXCIsIHRleHQ6IFwiTG9nIE1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJtYXhcIiwgdGV4dDogXCJNYXhcIiB9LFxuICAgIHsgdmFsdWU6IFwibWluXCIsIHRleHQ6IFwiTWluXCIgfSxcbiAgICB7IHZhbHVlOiBcIm5hbWVcIiwgdGV4dDogXCJOYW1lXCIgfSxcbiAgICB7IHZhbHVlOiBcImxhc3RfdGltZVwiLCB0ZXh0OiBcIlRpbWUgb2YgTGFzdCBQb2ludFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aW1lX3N0ZXBcIiwgdGV4dDogXCJUaW1lIFN0ZXBcIiB9LFxuICAgIHsgdmFsdWU6IFwidG90YWxcIiwgdGV4dDogXCJUb3RhbFwiIH1cbiAgXTtcbiAgc29ydERpcmVjdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhc2NcIiwgdGV4dDogXCJBc2NlbmRpbmdcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVzY1wiLCB0ZXh0OiBcIkRlc2NlbmRpbmdcIiB9XG4gIF07XG4gIHNvcnRGaWVsZHMgPSBbXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0aHJlc2hvbGRMZXZlbFwiLCB0ZXh0OiBcIlRocmVzaG9sZCBMZXZlbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ2YWx1ZVwiLCB0ZXh0OiBcIlZhbHVlXCIgfVxuICBdO1xuXG4gIGRhdGFSYXcgOiBhbnk7XG4gIHBvbHlzdGF0RGF0YTogUG9seXN0YXRNb2RlbFtdO1xuICBzY29wZXJlZjogYW55O1xuICBhbGVydFNydlJlZjogYW55O1xuICBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcGFuZWxDb250YWluZXI6IGFueTtcbiAgZDNPYmplY3Q6IEQzV3JhcHBlcjtcbiAgZGF0YTogYW55O1xuICBzZXJpZXM6IGFueVtdO1xuICB0ZW1wbGF0ZVNydjogYW55O1xuICBvdmVycmlkZXNDdHJsOiBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyO1xuICBjb21wb3NpdGVzTWFuYWdlciA6IENvbXBvc2l0ZXNNYW5hZ2VyO1xuICB0b29sdGlwQ29udGVudDogc3RyaW5nW107XG4gIGQzRGl2SWQ6IHN0cmluZztcbiAgY29udGFpbmVyRGl2SWQ6IHN0cmluZztcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIHBhbmVsV2lkdGg6IGFueTtcbiAgcGFuZWxIZWlnaHQ6IGFueTtcblxuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIHNhdmVkQ29tcG9zaXRlcyA6IFtdLFxuICAgIHNhdmVkT3ZlcnJpZGVzOiBBcnJheTxNZXRyaWNPdmVycmlkZT4oKSxcbiAgICBjb2xvcnM6IFtcIiMyOTljNDZcIiwgXCJyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSlcIiwgXCIjZDQ0YTNhXCJdLFxuICAgIHBvbHlzdGF0OiB7XG4gICAgICBhbmltYXRpb25TcGVlZDogMjUwMCxcbiAgICAgIGNvbHVtbnM6IFwiXCIsXG4gICAgICBjb2x1bW5BdXRvU2l6ZTogdHJ1ZSxcbiAgICAgIGRpc3BsYXlMaW1pdDogMTAwLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaDogXCJcIixcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2hTYW5pdGl6ZTogZmFsc2UsXG4gICAgICBmb250QXV0b1NjYWxlOiB0cnVlLFxuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICBnbG9iYWxVbml0Rm9ybWF0OiBcInNob3J0XCIsXG4gICAgICBnbG9iYWxEZWNpbWFsczogMixcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgZ2xvYmFsT3BlcmF0b3JOYW1lOiBcImF2Z1wiLFxuICAgICAgZ2xvYmFsRGlzcGxheVRleHRUcmlnZ2VyZWRFbXB0eTogXCJPS1wiLFxuICAgICAgZ3JhZGllbnRFbmFibGVkOiB0cnVlLFxuICAgICAgaGV4YWdvblNvcnRCeURpcmVjdGlvbjogXCJhc2NcIixcbiAgICAgIGhleGFnb25Tb3J0QnlGaWVsZDogXCJuYW1lXCIsXG4gICAgICBtYXhNZXRyaWNzOiAwLFxuICAgICAgcG9seWdvbkJvcmRlclNpemU6IDIsXG4gICAgICBwb2x5Z29uQm9yZGVyQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgIHBvbHlnb25HbG9iYWxGaWxsQ29sb3I6IFwiIzBhNTBhMVwiLFxuICAgICAgcmFkaXVzOiBcIlwiLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRydWUsXG4gICAgICByb3dzOiBcIlwiLFxuICAgICAgcm93QXV0b1NpemU6IHRydWUsXG4gICAgICBzaGFwZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsXG4gICAgICB0b29sdGlwRGlzcGxheU1vZGU6IFwiYWxsXCIsXG4gICAgICB0b29sdGlwRGlzcGxheVRleHRUcmlnZ2VyZWRFbXB0eTogXCJPS1wiLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiAxMixcbiAgICAgIHRvb2x0aXBGb250VHlwZTogXCJSb2JvdG9cIixcbiAgICAgIHRvb2x0aXBQcmltYXJ5U29ydERpcmVjdGlvbjogXCJkZXNjXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnRGaWVsZDogXCJ0aHJlc2hvbGRMZXZlbFwiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnRGaWVsZDogXCJ2YWx1ZVwiLFxuICAgICAgdG9vbHRpcFRpbWVzdGFtcEVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgfTtcblxuXG4gIC8qKiBAbmdJbmplY3QgKi9cbiAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IsIHRlbXBsYXRlU3J2LCBhbGVydFNydiwgcHJpdmF0ZSAkc2FuaXRpemUpIHtcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XG4gICAgLy8gbWVyZ2UgZXhpc3Rpbmcgc2V0dGluZ3Mgd2l0aCBvdXIgZGVmYXVsdHNcbiAgICBfLmRlZmF1bHRzRGVlcCh0aGlzLnBhbmVsLCB0aGlzLnBhbmVsRGVmYXVsdHMpO1xuXG4gICAgdGhpcy5kM0RpdklkID0gXCJkM19zdmdfXCIgKyB0aGlzLnBhbmVsLmlkO1xuICAgIHRoaXMuY29udGFpbmVyRGl2SWQgPSBcImNvbnRhaW5lcl9cIiArIHRoaXMuZDNEaXZJZDtcbiAgICB0aGlzLmFsZXJ0U3J2UmVmID0gYWxlcnRTcnY7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMucGFuZWxDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMudGVtcGxhdGVTcnYgPSB0ZW1wbGF0ZVNydjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IG51bGw7XG4gICAgdGhpcy5wYW5lbFdpZHRoID0gbnVsbDtcbiAgICB0aGlzLnBhbmVsSGVpZ2h0ID0gbnVsbDtcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgIHRoaXMuZDNPYmplY3QgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMuc2VyaWVzID0gW107XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBbXTtcbiAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gW107XG4gICAgdGhpcy5vdmVycmlkZXNDdHJsID0gbmV3IE1ldHJpY092ZXJyaWRlc01hbmFnZXIoJHNjb3BlLCB0ZW1wbGF0ZVNydiwgJHNhbml0aXplLCB0aGlzLnBhbmVsLnNhdmVkT3ZlcnJpZGVzKTtcbiAgICB0aGlzLmNvbXBvc2l0ZXNNYW5hZ2VyID0gbmV3IENvbXBvc2l0ZXNNYW5hZ2VyKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgdGhpcy5wYW5lbC5zYXZlZENvbXBvc2l0ZXMpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiaW5pdC1lZGl0LW1vZGVcIiwgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtcmVjZWl2ZWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtZXJyb3JcIiwgdGhpcy5vbkRhdGFFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtc25hcHNob3QtbG9hZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICB9XG5cblxuICBvbkluaXRFZGl0TW9kZSgpIHtcbiAgICAvLyBkZXRlcm1pbmUgdGhlIHBhdGggdG8gdGhpcyBwbHVnaW4gYmFzZSBvbiB0aGUgbmFtZSBmb3VuZCBpbiBwYW5lbC50eXBlXG4gICAgdmFyIHRoaXNQYW5lbFBhdGggPSBcInB1YmxpYy9wbHVnaW5zL1wiICsgdGhpcy5wYW5lbC50eXBlICsgXCIvXCI7XG4gICAgLy8gYWRkIHRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBwYXJ0aWFsXG4gICAgdmFyIG9wdGlvbnNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm9wdGlvbnMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiT3B0aW9uc1wiLCBvcHRpb25zUGF0aCwgMik7XG4gICAgdmFyIG92ZXJyaWRlc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3Iub3ZlcnJpZGVzLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIk92ZXJyaWRlc1wiLCBvdmVycmlkZXNQYXRoLCAzKTtcbiAgICB2YXIgY29tcG9zaXRlc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3IuY29tcG9zaXRlcy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJDb21wb3NpdGVzXCIsIGNvbXBvc2l0ZXNQYXRoLCA0KTtcbiAgICAvLyBkaXNhYmxlZCBmb3Igbm93XG4gICAgLy92YXIgbWFwcGluZ3NQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm1hcHBpbmdzLmh0bWxcIjtcbiAgICAvL3RoaXMuYWRkRWRpdG9yVGFiKFwiVmFsdWUgTWFwcGluZ3NcIiwgbWFwcGluZ3NQYXRoLCA1KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBbc2V0Q29udGFpbmVyIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0ge1t0eXBlXX0gY29udGFpbmVyIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNldENvbnRhaW5lcihjb250YWluZXIpIHtcbiAgICB0aGlzLnBhbmVsQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gY29udGFpbmVyO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBhIHBhbmVsIGJ5IHRoZSBzcGFuIGFuZCB2aWV3cG9ydFxuICAvLyB0aGUgbGluayBlbGVtZW50IG9iamVjdCBjYW4gYmUgdXNlZCB0byBnZXQgdGhlIHdpZHRoIG1vcmUgcmVsaWFibHlcbiAgZ2V0UGFuZWxXaWR0aEZhaWxzYWZlKCkge1xuICAgIHZhciB0cnVlV2lkdGggPSAwO1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5ncmlkUG9zICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyAyNCBzbG90cyBpcyBmdWxsc2NyZWVuLCBnZXQgdGhlIHZpZXdwb3J0IGFuZCBkaXZpZGUgdG8gYXBwcm94aW1hdGUgdGhlIHdpZHRoXG4gICAgICBsZXQgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyU2xvdCA9IHZpZXdQb3J0V2lkdGggLyAyNDtcbiAgICAgIHRydWVXaWR0aCA9IE1hdGgucm91bmQodGhpcy5wYW5lbC5ncmlkUG9zLncgKiBwaXhlbHNQZXJTbG90KTtcbiAgICAgIHJldHVybiB0cnVlV2lkdGg7XG4gICAgfVxuICAgIC8vIGdyYWZhbmE1IC0gdXNlIHRoaXMucGFuZWwuZ3JpZFBvcy53LCB0aGlzLnBhbmVsLmdyaWRQb3MuaFxuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyBjaGVjayBpZiBpbnNpZGUgZWRpdCBtb2RlXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZUluaXRpYXRlZCkge1xuICAgICAgICAvLyB3aWR0aCBpcyBjbGllbnRXaWR0aCBvZiBkb2N1bWVudFxuICAgICAgICB0cnVlV2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldCB0aGUgd2lkdGggYmFzZWQgb24gdGhlIHNjYWxlZCBjb250YWluZXIgKHY1IG5lZWRzIHRoaXMpXG4gICAgICAgIHRydWVXaWR0aCA9IHRoaXMucGFuZWxDb250YWluZXIub2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB2NCBhbmQgcHJldmlvdXMgdXNlZCBmaXhlZCBzcGFuc1xuICAgICAgdmFyIHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgLy8gZ2V0IHRoZSBwaXhlbHMgb2YgYSBzcGFuXG4gICAgICB2YXIgcGl4ZWxzUGVyU3BhbiA9IHZpZXdQb3J0V2lkdGggLyAxMjtcbiAgICAgIC8vIG11bHRpcGx5IG51bSBzcGFucyBieSBwaXhlbHNQZXJTcGFuXG4gICAgICB0cnVlV2lkdGggPSBNYXRoLnJvdW5kKHRoaXMucGFuZWwuc3BhbiAqIHBpeGVsc1BlclNwYW4pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVdpZHRoO1xuICB9XG5cbiAgZ2V0UGFuZWxIZWlnaHQoKSB7XG4gICAgLy8gcGFuZWwgY2FuIGhhdmUgYSBmaXhlZCBoZWlnaHQgc2V0IHZpYSBcIkdlbmVyYWxcIiB0YWIgaW4gcGFuZWwgZWRpdG9yXG4gICAgdmFyIHRtcFBhbmVsSGVpZ2h0ID0gdGhpcy5wYW5lbC5oZWlnaHQ7XG4gICAgaWYgKCh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHx8ICh0bXBQYW5lbEhlaWdodCA9PT0gXCJcIikpIHtcbiAgICAgIC8vIGdyYWZhbmEgYWxzbyBzdXBwbGllcyB0aGUgaGVpZ2h0LCB0cnkgdG8gdXNlIHRoYXQgaWYgdGhlIHBhbmVsIGRvZXMgbm90IGhhdmUgYSBoZWlnaHRcbiAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gU3RyaW5nKHRoaXMuaGVpZ2h0KTtcbiAgICAgIC8vIHY0IGFuZCBlYXJsaWVyIGRlZmluZSB0aGlzIGhlaWdodCwgZGV0ZWN0IHNwYW4gZm9yIHByZS12NVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGVhZGVyLCBhZGp1c3QgaGVpZ2h0IHRvIHVzZSBhbGwgc3BhY2UgYXZhaWxhYmxlXG4gICAgICAgIHZhciBwYW5lbFRpdGxlT2Zmc2V0ID0gMjA7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLnRpdGxlICE9PSBcIlwiKSB7XG4gICAgICAgICAgcGFuZWxUaXRsZU9mZnNldCA9IDQyO1xuICAgICAgICB9XG4gICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gU3RyaW5nKHRoaXMuY29udGFpbmVySGVpZ2h0IC0gcGFuZWxUaXRsZU9mZnNldCk7IC8vIG9mZnNldCBmb3IgaGVhZGVyXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIGhlaWdodCBzdGlsbCBjYW5ub3QgYmUgZGV0ZXJtaW5lZCwgZ2V0IGl0IGZyb20gdGhlIHJvdyBpbnN0ZWFkXG4gICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gdGhpcy5yb3cuaGVpZ2h0O1xuICAgICAgICBpZiAodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgLy8gbGFzdCByZXNvcnQgLSBkZWZhdWx0IHRvIDI1MHB4ICh0aGlzIHNob3VsZCBuZXZlciBoYXBwZW4pXG4gICAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSBcIjI1MFwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJlcGxhY2UgcHhcbiAgICB0bXBQYW5lbEhlaWdodCA9IHRtcFBhbmVsSGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKTtcbiAgICAvLyBjb252ZXJ0IHRvIG51bWVyaWMgdmFsdWVcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gcGFyc2VJbnQodG1wUGFuZWxIZWlnaHQsIDEwKTtcbiAgICByZXR1cm4gYWN0dWFsSGVpZ2h0O1xuICB9XG5cbiAgY2xlYXJTVkcoKSB7XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLmQzRGl2SWQpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCkucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItcGFuZWxcIikubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItcGFuZWxcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckQzKCkge1xuICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuZGF0YSk7XG4gICAgdGhpcy5jbGVhclNWRygpO1xuICAgIGlmICh0aGlzLnBhbmVsV2lkdGggPT09IDApIHtcbiAgICAgIHRoaXMucGFuZWxXaWR0aCA9IHRoaXMuZ2V0UGFuZWxXaWR0aEZhaWxzYWZlKCk7XG4gICAgfVxuICAgIHRoaXMucGFuZWxIZWlnaHQgPSB0aGlzLmdldFBhbmVsSGVpZ2h0KCk7XG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIGxlZnQ6IDB9O1xuICAgIHZhciB3aWR0aCA9IHRoaXMucGFuZWxXaWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYW5lbEhlaWdodDtcblxuICAgIG1hcmdpbi50b3AgPSAwO1xuICAgIC8vIHByZS12NSwgd2l0aCB0aXRsZSwgc2V0IHRvcCBtYXJnaW4gdG8gYXQgbGVhc3QgN3B4XG4gICAgaWYgKCh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuICE9PSBcInVuZGVmaW5lZFwiKSAmJiAodGhpcy5wYW5lbC50aXRsZSAhPT0gXCJcIikpIHtcbiAgICAgIG1hcmdpbi50b3AgPSA3O1xuICAgIH1cbiAgICBtYXJnaW4uYm90dG9tID0gMDtcblxuICAgIC8vIG5ldyBhdHRyaWJ1dGVzIG1heSBub3QgYmUgZGVmaW5lZCBpbiBvbGRlciBwYW5lbCBkZWZpbml0aW9uc1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IDI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yID0gXCJibGFja1wiO1xuICAgIH1cblxuICAgIHZhciBvcHQgPSB7XG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHJhZGl1cyA6IHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzQXV0b1NpemUsXG4gICAgICB0b29sdGlwRm9udFNpemU6IHRoaXMucGFuZWwucG9seXN0YXQudG9vbHRpcEZvbnRTaXplLFxuICAgICAgdG9vbHRpcEZvbnRUeXBlOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBGb250VHlwZSxcbiAgICAgIGRhdGE6IHRoaXMucG9seXN0YXREYXRhLFxuICAgICAgZGlzcGxheUxpbWl0OiB0aGlzLnBhbmVsLnBvbHlzdGF0LmRpc3BsYXlMaW1pdCxcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERpc3BsYXlNb2RlLFxuICAgICAgY29sdW1uczogdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zLFxuICAgICAgY29sdW1uQXV0b1NpemU6IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1uQXV0b1NpemUsXG4gICAgICByb3dzOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MsXG4gICAgICByb3dBdXRvU2l6ZSA6IHRoaXMucGFuZWwucG9seXN0YXQucm93QXV0b1NpemUsXG4gICAgICB0b29sdGlwQ29udGVudDogdGhpcy50b29sdGlwQ29udGVudCxcbiAgICAgIGFuaW1hdGlvblNwZWVkOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmFuaW1hdGlvblNwZWVkLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaDogdGhpcy5nZXREZWZhdWx0Q2xpY2tUaHJvdWdoKE5hTiksXG4gICAgICBwb2x5c3RhdDogdGhpcy5wYW5lbC5wb2x5c3RhdCxcbiAgICB9O1xuICAgIHRoaXMuZDNPYmplY3QgPSBuZXcgRDNXcmFwcGVyKHRoaXMudGVtcGxhdGVTcnYsIHRoaXMuc3ZnQ29udGFpbmVyLCB0aGlzLmQzRGl2SWQsIG9wdCk7XG4gICAgdGhpcy5kM09iamVjdC5kcmF3KCk7XG4gIH1cblxuICByZW1vdmVWYWx1ZU1hcChtYXApIHtcbiAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YodGhpcy5wYW5lbC52YWx1ZU1hcHMsIG1hcCk7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkVmFsdWVNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMucHVzaCh7dmFsdWU6IFwiXCIsIG9wOiBcIj1cIiwgdGV4dDogXCJcIiB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7ZnJvbTogXCJcIiwgdG86IFwiXCIsIHRleHQ6IFwiXCJ9KTtcbiAgfVxuXG4gIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgaWYgKCFzY29wZSkge1xuICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhdHRycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcGFuZWxCeUNsYXNzID0gZWxlbS5maW5kKFwiLmdyYWZhbmEtZDMtcG9seXN0YXRcIik7XG4gICAgcGFuZWxCeUNsYXNzLmFwcGVuZChcIjxkaXYgc3R5bGU9XFxcIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XFxcIiBpZD1cXFwiXCIgKyBjdHJsLmNvbnRhaW5lckRpdklkICsgXCJcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgY29udGFpbmVyID0gcGFuZWxCeUNsYXNzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgY3RybC5zZXRDb250YWluZXIoY29udGFpbmVyKTtcblxuICAgIGVsZW0gPSBlbGVtLmZpbmQoXCIuZ3JhZmFuYS1kMy1wb2x5c3RhdFwiKTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIC8vIHRyeSB0byBnZXQgdGhlIHdpZHRoXG4gICAgICBjdHJsLnBhbmVsV2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIGN0cmwucmVuZGVyRDMoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudHMub24oXCJyZW5kZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRWYWx1ZXMoZGF0YUxpc3QpIHtcbiAgICB0aGlzLmRhdGFSYXcgPSBkYXRhTGlzdDtcbiAgICAvLyBhdXRvbWF0aWNhbGx5IGNvcnJlY3QgdHJhbnNmb3JtIG1vZGUgYmFzZWQgb24gZGF0YVxuICAgIGlmICh0aGlzLmRhdGFSYXcgJiYgdGhpcy5kYXRhUmF3Lmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcInRhYmxlXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5kYXRhUmF3WzBdLnR5cGUgPT09IFwiZG9jc1wiKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcImpzb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwidGFibGVcIiB8fCB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9PT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0aW1lc2VyaWVzX3RvX3Jvd3NcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWdub3JlIHRoZSBhYm92ZSBhbmQgdXNlIGEgdGltZXNlcmllc1xuICAgIHRoaXMucG9seXN0YXREYXRhLmxlbmd0aCA9IDA7XG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNlcmllcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGFTZXJpZXMgPSB0aGlzLnNlcmllc1tpbmRleF07XG4gICAgICAgIGxldCBjb252ZXJ0ZWQgPSBUcmFuc2Zvcm1lcnMuVGltZVNlcmllc1RvUG9seXN0YXQodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxPcGVyYXRvck5hbWUsIGFTZXJpZXMpO1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YS5wdXNoKGNvbnZlcnRlZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFwcGx5IGdsb2JhbCB1bml0IGZvcm1hdHRpbmcgYW5kIGRlY2ltYWxzXG4gICAgdGhpcy5hcHBseUdsb2JhbEZvcm1hdHRpbmcodGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGZpbHRlciBvdXQgYnkgZ2xvYmFsRGlzcGxheU1vZGVcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuZmlsdGVyQnlHbG9iYWxEaXNwbGF5TW9kZSh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gbm93IHNvcnRcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IF8ub3JkZXJCeShcbiAgICAgIHRoaXMucG9seXN0YXREYXRhLFxuICAgICAgW3RoaXMucGFuZWwucG9seXN0YXQuaGV4YWdvblNvcnRCeUZpZWxkXSxcbiAgICAgIFt0aGlzLnBhbmVsLnBvbHlzdGF0LmhleGFnb25Tb3J0QnlEaXJlY3Rpb25dKTtcbiAgICAvLyB0aGlzIG5lZWRzIHRvIGJlIHBlcmZvcm1lZCBhZnRlciBzb3J0aW5nIHJ1bGVzIGFyZSBhcHBsaWVkXG4gICAgLy8gYXBwbHkgb3ZlcnJpZGVzXG4gICAgdGhpcy5vdmVycmlkZXNDdHJsLmFwcGx5T3ZlcnJpZGVzKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBjb21wb3NpdGVzLCB0aGlzIHdpbGwgZmlsdGVyIGFzIG5lZWRlZCBhbmQgc2V0IGNsaWNrdGhyb3VnaFxuICAgIHRoaXMucG9seXN0YXREYXRhID0gdGhpcy5jb21wb3NpdGVzTWFuYWdlci5hcHBseUNvbXBvc2l0ZXModGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGFwcGx5IGdsb2JhbCBjbGlja3Rocm91Z2ggdG8gYWxsIGl0ZW1zIG5vdCBzZXRcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wb2x5c3RhdERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBpZiAodGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gYWRkIHRoZSBzZXJpZXMgYWxpYXMgYXMgYSB2YXIgdG8gdGhlIGNsaWNrdGhyb3VnaHVybFxuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoID0gdGhpcy5nZXREZWZhdWx0Q2xpY2tUaHJvdWdoKGluZGV4KTtcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLnNhbml0aXplVVJMRW5hYmxlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuZGVmYXVsdENsaWNrVGhyb3VnaFNhbml0aXplO1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uc2FuaXRpemVkVVJMID0gdGhpcy4kc2FuaXRpemUodGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGdlbmVyYXRlIHRvb2x0aXBzXG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFRvb2x0aXAuZ2VuZXJhdGUodGhpcy4kc2NvcGUsIHRoaXMucG9seXN0YXREYXRhLCB0aGlzLnBhbmVsLnBvbHlzdGF0KTtcbiAgfVxuXG4gIGFwcGx5R2xvYmFsRm9ybWF0dGluZyhkYXRhOiBhbnkpIHtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbFVuaXRGb3JtYXRdO1xuICAgICAgaWYgKGZvcm1hdEZ1bmMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IEdldERlY2ltYWxzRm9yVmFsdWUoZGF0YVtpbmRleF0udmFsdWUsIHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsRGVjaW1hbHMpO1xuICAgICAgICBkYXRhW2luZGV4XS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YVtpbmRleF0udmFsdWUsIHJlc3VsdC5kZWNpbWFscywgcmVzdWx0LnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YVtpbmRleF0udmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YVtpbmRleF0udmFsdWUsIHJlc3VsdC5kZWNpbWFscyk7XG4gICAgICB9XG4gICAgICAvLyBkZWZhdWx0IHRoZSBjb2xvciB0byB0aGUgZ2xvYmFsIHNldHRpbmdcbiAgICAgIGRhdGFbaW5kZXhdLmNvbG9yID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yO1xuICAgIH1cbiAgfVxuXG5cbiAgZmlsdGVyQnlHbG9iYWxEaXNwbGF5TW9kZShkYXRhOiBhbnkpIHtcbiAgICBsZXQgZmlsdGVyZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICBsZXQgY29tcG9zaXRlTWV0cmljcyA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgIGlmICh0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbERpc3BsYXlNb2RlICE9PSBcImFsbFwiKSB7XG4gICAgICBsZXQgZGF0YUxlbiA9IGRhdGEubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhTGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAvLyBrZWVwIGlmIGNvbXBvc2l0ZVxuICAgICAgICBpZiAoaXRlbS5pc0NvbXBvc2l0ZSkge1xuICAgICAgICAgY29tcG9zaXRlTWV0cmljcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRocmVzaG9sZExldmVsIDwgMSkge1xuICAgICAgICAgIC8vIHB1c2ggdGhlIGluZGV4IG51bWJlclxuICAgICAgICAgIGZpbHRlcmVkTWV0cmljcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyByZW1vdmUgZmlsdGVyZWQgbWV0cmljcywgdXNlIHNwbGljZSBpbiByZXZlcnNlIG9yZGVyXG4gICAgICBmb3IgKGxldCBpID0gZGF0YS5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGVzKGZpbHRlcmVkTWV0cmljcywgaSkpIHtcbiAgICAgICAgICBkYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChjb21wb3NpdGVNZXRyaWNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBzZXQgZGF0YSB0byBiZSBhbGwgb2YgdGhlIGNvbXBvc2l0ZXNcbiAgICAgICAgICBkYXRhID0gY29tcG9zaXRlTWV0cmljcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIG9uRGF0YUVycm9yKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgdGhpcy5vbkRhdGFSZWNlaXZlZChbXSk7XG4gIH1cblxuICBvbkRhdGFSZWNlaXZlZChkYXRhTGlzdCkge1xuICAgIHRoaXMuc2VyaWVzID0gZGF0YUxpc3QubWFwKHRoaXMuc2VyaWVzSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHZhbHVlOiAwLFxuICAgICAgdmFsdWVGb3JtYXR0ZWQ6IDAsXG4gICAgICB2YWx1ZVJvdW5kZWQ6IDBcbiAgICB9O1xuICAgIHRoaXMuc2V0VmFsdWVzKGRhdGEpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNlcmllc0hhbmRsZXIoc2VyaWVzRGF0YSkge1xuICAgIHZhciBzZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBzZXJpZXNEYXRhLmRhdGFwb2ludHMsXG4gICAgICBhbGlhczogc2VyaWVzRGF0YS50YXJnZXQsXG4gICAgfSk7XG4gICAgc2VyaWVzLmZsb3RwYWlycyA9IHNlcmllcy5nZXRGbG90UGFpcnModGhpcy5wYW5lbC5udWxsUG9pbnRNb2RlKTtcbiAgICByZXR1cm4gc2VyaWVzO1xuICB9XG5cbiAgaW52ZXJ0Q29sb3JPcmRlcigpIHtcbiAgICB2YXIgdG1wID0gdGhpcy5wYW5lbC5jb2xvcnNbMF07XG4gICAgdGhpcy5wYW5lbC5jb2xvcnNbMF0gPSB0aGlzLnBhbmVsLmNvbG9yc1syXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1syXSA9IHRtcDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWVkIG11c3Qgbm90IGJlIGxlc3MgdGhhbiA1MDBtc1xuICAgKi9cbiAgdmFsaWRhdGVBbmltYXRpb25TcGVlZCgpIHtcbiAgICBsZXQgc3BlZWQgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LmFuaW1hdGlvblNwZWVkO1xuICAgIGxldCBuZXdTcGVlZCA9IDUwMDA7XG4gICAgaWYgKHNwZWVkKSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHNwZWVkLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1NwZWVkID0gcGFyc2VJbnQoc3BlZWQsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrU3BlZWQgPj0gNTAwKSB7XG4gICAgICAgICAgbmV3U3BlZWQgPSBjaGVja1NwZWVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQgPSBuZXdTcGVlZDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVDb2x1bW5WYWx1ZSgpIHtcbiAgICBsZXQgY29sdW1ucyA9IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1ucztcbiAgICBsZXQgbmV3Q29sdW1ucyA9IDE7XG4gICAgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoY29sdW1ucywgMTApKSkge1xuICAgICAgICBsZXQgY2hlY2tDb2x1bW5zID0gcGFyc2VJbnQoY29sdW1ucywgMTApO1xuICAgICAgICBpZiAoY2hlY2tDb2x1bW5zID4gMCkge1xuICAgICAgICAgIG5ld0NvbHVtbnMgPSBjaGVja0NvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zID0gbmV3Q29sdW1ucztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVSb3dWYWx1ZSgpIHtcbiAgICBsZXQgcm93cyA9IHRoaXMucGFuZWwucG9seXN0YXQucm93cztcbiAgICBsZXQgbmV3Um93cyA9IDE7XG4gICAgaWYgKHJvd3MpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQocm93cywgMTApKSkge1xuICAgICAgICBsZXQgY2hlY2tSb3dzID0gcGFyc2VJbnQocm93cywgMTApO1xuICAgICAgICBpZiAoY2hlY2tSb3dzID4gMCkge1xuICAgICAgICAgIG5ld1Jvd3MgPSBjaGVja1Jvd3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzID0gbmV3Um93cztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVSYWRpdXNWYWx1ZSgpIHtcbiAgICBsZXQgcmFkaXVzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXM7XG4gICAgbGV0IG5ld1JhZGl1cyA9IDI1O1xuICAgIGlmIChyYWRpdXMgIT09IG51bGwpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQocmFkaXVzLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1JhZGl1cyA9IHBhcnNlSW50KHJhZGl1cywgMTApO1xuICAgICAgICBpZiAoY2hlY2tSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgbmV3UmFkaXVzID0gY2hlY2tSYWRpdXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXMgPSBuZXdSYWRpdXM7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHZhbGlkYXRlQm9yZGVyU2l6ZVZhbHVlKCkge1xuICAgIGxldCBib3JkZXJTaXplID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZTtcbiAgICBsZXQgbmV3Qm9yZGVyU2l6ZSA9IDI7XG4gICAgaWYgKGJvcmRlclNpemUgIT09IG51bGwpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoYm9yZGVyU2l6ZSwgMTApKSkge1xuICAgICAgICBsZXQgY2hlY2tCb3JkZXJTaXplID0gcGFyc2VJbnQoYm9yZGVyU2l6ZSwgMTApO1xuICAgICAgICBpZiAoY2hlY2tCb3JkZXJTaXplID49IDApIHtcbiAgICAgICAgICBuZXdCb3JkZXJTaXplID0gY2hlY2tCb3JkZXJTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPSBuZXdCb3JkZXJTaXplO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB1cGRhdGVQb2x5Z29uQm9yZGVyQ29sb3IoKSB7XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IgPSBSR0JUb0hleCh0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25HbG9iYWxGaWxsQ29sb3IoKSB7XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yID0gUkdCVG9IZXgodGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uR2xvYmFsRmlsbENvbG9yKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdENsaWNrVGhyb3VnaChpbmRleDogbnVtYmVyKSB7XG4gICAgbGV0IHVybCA9IHRoaXMucGFuZWwucG9seXN0YXQuZGVmYXVsdENsaWNrVGhyb3VnaDtcbiAgICAvLyBhcHBseSBib3RoIHR5cGVzIG9mIHRyYW5zZm9ybXMsIG9uZSB0YXJnZXRlZCBhdCB0aGUgZGF0YSBpdGVtIGluZGV4LCBhbmQgc2Vjb25kbHkgdGhlIG50aCB2YXJpYW50XG4gICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1TaW5nbGVNZXRyaWMoaW5kZXgsIHVybCwgdGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIHVybCA9IENsaWNrVGhyb3VnaFRyYW5zZm9ybWVyLnRyYW5mb3JtTnRoTWV0cmljKHVybCwgdGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIHByb2Nlc3MgdGVtcGxhdGUgdmFyaWFibGVzIGluc2lkZSBjbGlja3Rocm91Z2hcbiAgICB1cmwgPSB0aGlzLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dCh1cmwpO1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBzZXRHbG9iYWxVbml0Rm9ybWF0KHN1Ykl0ZW0pIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbFVuaXRGb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICB9XG59XG5cblxuZXhwb3J0IHtcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCxcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCBhcyBNZXRyaWNzUGFuZWxDdHJsXG59O1xuIl19