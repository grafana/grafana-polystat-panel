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
                            defaultClickThroughNewTab: false,
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
                            this.polystatData[index].newTabEnabled = this.panel.polystat.defaultClickThroughNewTab;
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
                            else {
                                newSpeed = 500;
                            }
                        }
                    }
                    this.panel.polystat.animationSpeed = newSpeed;
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateDisplayLimit = function () {
                    var limit = this.panel.polystat.displayLimit;
                    var newLimit = 100;
                    if (limit === null) {
                        newLimit = 0;
                    }
                    else {
                        if (!isNaN(parseInt(limit, 10))) {
                            var checkLimit = parseInt(limit, 10);
                            if (checkLimit >= 0) {
                                newLimit = checkLimit;
                            }
                        }
                    }
                    if (newLimit === 0) {
                        this.panel.polystat.displayLimit = "";
                    }
                    else {
                        this.panel.polystat.displayLimit = newLimit;
                    }
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateColumnValue = function () {
                    if (this.panel.polystat.columnAutoSize) {
                        this.panel.polystat.columns = "";
                    }
                    else {
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
                    }
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateRowValue = function () {
                    if (this.panel.polystat.rowAutoSize) {
                        this.panel.polystat.rows = "";
                    }
                    else {
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
                    }
                    this.render();
                };
                D3PolystatPanelCtrl.prototype.validateRadiusValue = function () {
                    if (this.panel.polystat.radiusAutoSize) {
                        this.panel.polystat.radius = "";
                    }
                    else {
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
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFrQmtDLHVDQUFnQjtnQkEwSGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F5QnpCO29CQTFCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkF4SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUss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YXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cbmltcG9ydCB7TWV0cmljc1BhbmVsQ3RybH0gZnJvbSBcImFwcC9wbHVnaW5zL3Nka1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0ICQgZnJvbSBcImpxdWVyeVwiO1xuaW1wb3J0IGtibiBmcm9tIFwiYXBwL2NvcmUvdXRpbHMva2JuXCI7XG5pbXBvcnQgVGltZVNlcmllcyBmcm9tIFwiYXBwL2NvcmUvdGltZV9zZXJpZXMyXCI7XG5cbmltcG9ydCBcIi4vY3NzL3BvbHlzdGF0LmNzcyFcIjtcbmltcG9ydCB7IEQzV3JhcHBlciB9IGZyb20gXCIuL2Qzd3JhcHBlclwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtZXJzIH0gZnJvbSBcIi4vdHJhbnNmb3JtZXJzXCI7XG5pbXBvcnQgeyBQb2x5c3RhdE1vZGVsIH0gZnJvbSBcIi4vcG9seXN0YXRtb2RlbFwiO1xuaW1wb3J0IHsgTWV0cmljT3ZlcnJpZGVzTWFuYWdlciwgTWV0cmljT3ZlcnJpZGUgfSBmcm9tIFwiLi9tZXRyaWNfb3ZlcnJpZGVzX21hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvc2l0ZXNNYW5hZ2VyIH0gZnJvbSBcIi4vY29tcG9zaXRlc19tYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb29sdGlwIH0gZnJvbSBcIi4vdG9vbHRpcFwiO1xuaW1wb3J0IHsgR2V0RGVjaW1hbHNGb3JWYWx1ZSwgUkdCVG9IZXggfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHtDbGlja1Rocm91Z2hUcmFuc2Zvcm1lcn0gZnJvbSBcIi4vY2xpY2tUaHJvdWdoVHJhbnNmb3JtZXJcIjtcblxuXG5jbGFzcyBEM1BvbHlzdGF0UGFuZWxDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZVVybCA9IFwicGFydGlhbHMvdGVtcGxhdGUuaHRtbFwiO1xuICBhbmltYXRpb25Nb2RlcyA9IFtcbiAgICB7IHZhbHVlOiBcImFsbFwiLCB0ZXh0OiBcIlNob3cgQWxsXCIgfSxcbiAgICB7IHZhbHVlOiBcInRyaWdnZXJlZFwiLCB0ZXh0OiBcIlNob3cgVHJpZ2dlcmVkXCIgfVxuICBdO1xuICBkaXNwbGF5TW9kZXMgPSBbXG4gICAgeyB2YWx1ZTogXCJhbGxcIiwgdGV4dDogXCJTaG93IEFsbFwiIH0sXG4gICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH1cbiAgXTtcbiAgdGhyZXNob2xkU3RhdGVzID0gW1xuICAgIHsgdmFsdWU6IDAsIHRleHQ6IFwib2tcIiB9LFxuICAgIHsgdmFsdWU6IDEsIHRleHQ6IFwid2FybmluZ1wiIH0sXG4gICAgeyB2YWx1ZTogMiwgdGV4dDogXCJjcml0aWNhbFwiIH0sXG4gICAgeyB2YWx1ZTogMywgdGV4dDogXCJjdXN0b21cIiB9XG4gIF07XG4gIHNoYXBlcyA9IFtcbiAgICB7IHZhbHVlOiBcImhleGFnb25fcG9pbnRlZF90b3BcIiwgdGV4dDogXCJIZXhhZ29uIFBvaW50ZWQgVG9wXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwiaGV4YWdvbl9mbGF0X3RvcFwiLCB0ZXh0OiBcIkhleGFnb24gRmxhdCBUb3BcIiB9LFxuICAgIHsgdmFsdWU6IFwiY2lyY2xlXCIsIHRleHQ6IFwiQ2lyY2xlXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwiY3Jvc3NcIiwgdGV4dDogXCJDcm9zc1wiIH0sXG4gICAgLy97IHZhbHVlOiBcImRpYW1vbmRcIiwgdGV4dDogXCJEaWFtb25kXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwic3F1YXJlXCIsIHRleHQ6IFwiU3F1YXJlXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwic3RhclwiLCB0ZXh0OiBcIlN0YXJcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJ0cmlhbmdsZVwiLCB0ZXh0OiBcIlRyaWFuZ2xlXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwid3llXCIsIHRleHQ6IFwiV3llXCIgfVxuICBdO1xuICBmb250U2l6ZXMgPSBbXG4gICAgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiAsIDEzLCAxNCwgMTUsXG4gICAgMTYsIDE3LCAxOCwgMTksIDIwLCAyMiwgMjQsIDI2LCAyOCwgMzAsIDMyLFxuICAgIDM0LCAzNiwgMzgsIDQwLCA0MiwgNDQsIDQ2LCA0OCwgNTAsIDUyLCA1NCxcbiAgICA1NiwgNTgsIDYwLCA2MiwgNjQsIDY2LCA2OCwgNzBdO1xuICB1bml0Rm9ybWF0cyA9IGtibi5nZXRVbml0Rm9ybWF0cygpO1xuICBvcGVyYXRvck9wdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhdmdcIiwgdGV4dDogXCJBdmVyYWdlXCIgfSxcbiAgICB7IHZhbHVlOiBcImNvdW50XCIsIHRleHQ6IFwiQ291bnRcIiB9LFxuICAgIHsgdmFsdWU6IFwiY3VycmVudFwiLCB0ZXh0OiBcIkN1cnJlbnRcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVsdGFcIiwgdGV4dDogXCJEZWx0YVwiIH0sXG4gICAgeyB2YWx1ZTogXCJkaWZmXCIsIHRleHQ6IFwiRGlmZmVyZW5jZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJmaXJzdFwiLCB0ZXh0OiBcIkZpcnN0XCIgfSxcbiAgICB7IHZhbHVlOiBcImxvZ21pblwiLCB0ZXh0OiBcIkxvZyBNaW5cIiB9LFxuICAgIHsgdmFsdWU6IFwibWF4XCIsIHRleHQ6IFwiTWF4XCIgfSxcbiAgICB7IHZhbHVlOiBcIm1pblwiLCB0ZXh0OiBcIk1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJsYXN0X3RpbWVcIiwgdGV4dDogXCJUaW1lIG9mIExhc3QgUG9pbnRcIiB9LFxuICAgIHsgdmFsdWU6IFwidGltZV9zdGVwXCIsIHRleHQ6IFwiVGltZSBTdGVwXCIgfSxcbiAgICB7IHZhbHVlOiBcInRvdGFsXCIsIHRleHQ6IFwiVG90YWxcIiB9XG4gIF07XG4gIHNvcnREaXJlY3Rpb25zID0gW1xuICAgIHsgdmFsdWU6IFwiYXNjXCIsIHRleHQ6IFwiQXNjZW5kaW5nXCIgfSxcbiAgICB7IHZhbHVlOiBcImRlc2NcIiwgdGV4dDogXCJEZXNjZW5kaW5nXCIgfVxuICBdO1xuICBzb3J0RmllbGRzID0gW1xuICAgIHsgdmFsdWU6IFwibmFtZVwiLCB0ZXh0OiBcIk5hbWVcIiB9LFxuICAgIHsgdmFsdWU6IFwidGhyZXNob2xkTGV2ZWxcIiwgdGV4dDogXCJUaHJlc2hvbGQgTGV2ZWxcIiB9LFxuICAgIHsgdmFsdWU6IFwidmFsdWVcIiwgdGV4dDogXCJWYWx1ZVwiIH1cbiAgXTtcblxuICBkYXRhUmF3IDogYW55O1xuICBwb2x5c3RhdERhdGE6IFBvbHlzdGF0TW9kZWxbXTtcbiAgc2NvcGVyZWY6IGFueTtcbiAgYWxlcnRTcnZSZWY6IGFueTtcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHBhbmVsQ29udGFpbmVyOiBhbnk7XG4gIGQzT2JqZWN0OiBEM1dyYXBwZXI7XG4gIGRhdGE6IGFueTtcbiAgc2VyaWVzOiBhbnlbXTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgb3ZlcnJpZGVzQ3RybDogTWV0cmljT3ZlcnJpZGVzTWFuYWdlcjtcbiAgY29tcG9zaXRlc01hbmFnZXIgOiBDb21wb3NpdGVzTWFuYWdlcjtcbiAgdG9vbHRpcENvbnRlbnQ6IHN0cmluZ1tdO1xuICBkM0RpdklkOiBzdHJpbmc7XG4gIGNvbnRhaW5lckRpdklkOiBzdHJpbmc7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBwYW5lbFdpZHRoOiBhbnk7XG4gIHBhbmVsSGVpZ2h0OiBhbnk7XG5cbiAgcGFuZWxEZWZhdWx0cyA9IHtcbiAgICBzYXZlZENvbXBvc2l0ZXMgOiBbXSxcbiAgICBzYXZlZE92ZXJyaWRlczogQXJyYXk8TWV0cmljT3ZlcnJpZGU+KCksXG4gICAgY29sb3JzOiBbXCIjMjk5YzQ2XCIsIFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCIsIFwiI2Q0NGEzYVwiXSxcbiAgICBwb2x5c3RhdDoge1xuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MDAsXG4gICAgICBjb2x1bW5zOiBcIlwiLFxuICAgICAgY29sdW1uQXV0b1NpemU6IHRydWUsXG4gICAgICBkaXNwbGF5TGltaXQ6IDEwMCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IFwiXCIsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoTmV3VGFiOiBmYWxzZSxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2hTYW5pdGl6ZTogZmFsc2UsXG4gICAgICBmb250QXV0b1NjYWxlOiB0cnVlLFxuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZm9udFR5cGU6IFwiUm9ib3RvXCIsXG4gICAgICBnbG9iYWxVbml0Rm9ybWF0OiBcInNob3J0XCIsXG4gICAgICBnbG9iYWxEZWNpbWFsczogMixcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgZ2xvYmFsT3BlcmF0b3JOYW1lOiBcImF2Z1wiLFxuICAgICAgZ2xvYmFsRGlzcGxheVRleHRUcmlnZ2VyZWRFbXB0eTogXCJPS1wiLFxuICAgICAgZ3JhZGllbnRFbmFibGVkOiB0cnVlLFxuICAgICAgaGV4YWdvblNvcnRCeURpcmVjdGlvbjogXCJhc2NcIixcbiAgICAgIGhleGFnb25Tb3J0QnlGaWVsZDogXCJuYW1lXCIsXG4gICAgICBtYXhNZXRyaWNzOiAwLFxuICAgICAgcG9seWdvbkJvcmRlclNpemU6IDIsXG4gICAgICBwb2x5Z29uQm9yZGVyQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgIHBvbHlnb25HbG9iYWxGaWxsQ29sb3I6IFwiIzBhNTBhMVwiLFxuICAgICAgcmFkaXVzOiBcIlwiLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRydWUsXG4gICAgICByb3dzOiBcIlwiLFxuICAgICAgcm93QXV0b1NpemU6IHRydWUsXG4gICAgICBzaGFwZTogXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCIsXG4gICAgICB0b29sdGlwRGlzcGxheU1vZGU6IFwiYWxsXCIsXG4gICAgICB0b29sdGlwRGlzcGxheVRleHRUcmlnZ2VyZWRFbXB0eTogXCJPS1wiLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiAxMixcbiAgICAgIHRvb2x0aXBGb250VHlwZTogXCJSb2JvdG9cIixcbiAgICAgIHRvb2x0aXBQcmltYXJ5U29ydERpcmVjdGlvbjogXCJkZXNjXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnRGaWVsZDogXCJ0aHJlc2hvbGRMZXZlbFwiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnRGaWVsZDogXCJ2YWx1ZVwiLFxuICAgICAgdG9vbHRpcFRpbWVzdGFtcEVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgfTtcblxuXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCB0ZW1wbGF0ZVNydiwgYWxlcnRTcnYsIHByaXZhdGUgJHNhbml0aXplKSB7XG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xuICAgIC8vIG1lcmdlIGV4aXN0aW5nIHNldHRpbmdzIHdpdGggb3VyIGRlZmF1bHRzXG4gICAgXy5kZWZhdWx0c0RlZXAodGhpcy5wYW5lbCwgdGhpcy5wYW5lbERlZmF1bHRzKTtcblxuICAgIHRoaXMuZDNEaXZJZCA9IFwiZDNfc3ZnX1wiICsgdGhpcy5wYW5lbC5pZDtcbiAgICB0aGlzLmNvbnRhaW5lckRpdklkID0gXCJjb250YWluZXJfXCIgKyB0aGlzLmQzRGl2SWQ7XG4gICAgdGhpcy5hbGVydFNydlJlZiA9IGFsZXJ0U3J2O1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBhbmVsQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMucGFuZWxXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5wYW5lbEhlaWdodCA9IG51bGw7XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnNlcmllcyA9IFtdO1xuICAgIHRoaXMucG9seXN0YXREYXRhID0gW107XG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFtdO1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybCA9IG5ldyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgdGhpcy5wYW5lbC5zYXZlZE92ZXJyaWRlcyk7XG4gICAgdGhpcy5jb21wb3NpdGVzTWFuYWdlciA9IG5ldyBDb21wb3NpdGVzTWFuYWdlcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHRoaXMucGFuZWwuc2F2ZWRDb21wb3NpdGVzKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImluaXQtZWRpdC1tb2RlXCIsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXJlY2VpdmVkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLWVycm9yXCIsIHRoaXMub25EYXRhRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXNuYXBzaG90LWxvYWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG5cbiAgb25Jbml0RWRpdE1vZGUoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBwYXRoIHRvIHRoaXMgcGx1Z2luIGJhc2Ugb24gdGhlIG5hbWUgZm91bmQgaW4gcGFuZWwudHlwZVxuICAgIHZhciB0aGlzUGFuZWxQYXRoID0gXCJwdWJsaWMvcGx1Z2lucy9cIiArIHRoaXMucGFuZWwudHlwZSArIFwiL1wiO1xuICAgIC8vIGFkZCB0aGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgcGFydGlhbFxuICAgIHZhciBvcHRpb25zUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5vcHRpb25zLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIk9wdGlvbnNcIiwgb3B0aW9uc1BhdGgsIDIpO1xuICAgIHZhciBvdmVycmlkZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm92ZXJyaWRlcy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJPdmVycmlkZXNcIiwgb3ZlcnJpZGVzUGF0aCwgMyk7XG4gICAgdmFyIGNvbXBvc2l0ZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLmNvbXBvc2l0ZXMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiQ29tcG9zaXRlc1wiLCBjb21wb3NpdGVzUGF0aCwgNCk7XG4gICAgLy8gZGlzYWJsZWQgZm9yIG5vd1xuICAgIC8vdmFyIG1hcHBpbmdzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5tYXBwaW5ncy5odG1sXCI7XG4gICAgLy90aGlzLmFkZEVkaXRvclRhYihcIlZhbHVlIE1hcHBpbmdzXCIsIG1hcHBpbmdzUGF0aCwgNSk7XG4gIH1cblxuICAvKipcbiAgICogW3NldENvbnRhaW5lciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtbdHlwZV19IGNvbnRhaW5lciBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZXRDb250YWluZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5wYW5lbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIC8vIGRldGVybWluZSB0aGUgd2lkdGggb2YgYSBwYW5lbCBieSB0aGUgc3BhbiBhbmQgdmlld3BvcnRcbiAgLy8gdGhlIGxpbmsgZWxlbWVudCBvYmplY3QgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSB3aWR0aCBtb3JlIHJlbGlhYmx5XG4gIGdldFBhbmVsV2lkdGhGYWlsc2FmZSgpIHtcbiAgICB2YXIgdHJ1ZVdpZHRoID0gMDtcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuZ3JpZFBvcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gMjQgc2xvdHMgaXMgZnVsbHNjcmVlbiwgZ2V0IHRoZSB2aWV3cG9ydCBhbmQgZGl2aWRlIHRvIGFwcHJveGltYXRlIHRoZSB3aWR0aFxuICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgbGV0IHBpeGVsc1BlclNsb3QgPSB2aWV3UG9ydFdpZHRoIC8gMjQ7XG4gICAgICB0cnVlV2lkdGggPSBNYXRoLnJvdW5kKHRoaXMucGFuZWwuZ3JpZFBvcy53ICogcGl4ZWxzUGVyU2xvdCk7XG4gICAgICByZXR1cm4gdHJ1ZVdpZHRoO1xuICAgIH1cbiAgICAvLyBncmFmYW5hNSAtIHVzZSB0aGlzLnBhbmVsLmdyaWRQb3MudywgdGhpcy5wYW5lbC5ncmlkUG9zLmhcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuc3BhbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gY2hlY2sgaWYgaW5zaWRlIGVkaXQgbW9kZVxuICAgICAgaWYgKHRoaXMuZWRpdE1vZGVJbml0aWF0ZWQpIHtcbiAgICAgICAgLy8gd2lkdGggaXMgY2xpZW50V2lkdGggb2YgZG9jdW1lbnRcbiAgICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnZXQgdGhlIHdpZHRoIGJhc2VkIG9uIHRoZSBzY2FsZWQgY29udGFpbmVyICh2NSBuZWVkcyB0aGlzKVxuICAgICAgICB0cnVlV2lkdGggPSB0aGlzLnBhbmVsQ29udGFpbmVyLm9mZnNldFBhcmVudC5jbGllbnRXaWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdjQgYW5kIHByZXZpb3VzIHVzZWQgZml4ZWQgc3BhbnNcbiAgICAgIHZhciB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgIC8vIGdldCB0aGUgcGl4ZWxzIG9mIGEgc3BhblxuICAgICAgdmFyIHBpeGVsc1BlclNwYW4gPSB2aWV3UG9ydFdpZHRoIC8gMTI7XG4gICAgICAvLyBtdWx0aXBseSBudW0gc3BhbnMgYnkgcGl4ZWxzUGVyU3BhblxuICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5yb3VuZCh0aGlzLnBhbmVsLnNwYW4gKiBwaXhlbHNQZXJTcGFuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVXaWR0aDtcbiAgfVxuXG4gIGdldFBhbmVsSGVpZ2h0KCkge1xuICAgIC8vIHBhbmVsIGNhbiBoYXZlIGEgZml4ZWQgaGVpZ2h0IHNldCB2aWEgXCJHZW5lcmFsXCIgdGFiIGluIHBhbmVsIGVkaXRvclxuICAgIHZhciB0bXBQYW5lbEhlaWdodCA9IHRoaXMucGFuZWwuaGVpZ2h0O1xuICAgIGlmICgodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB8fCAodG1wUGFuZWxIZWlnaHQgPT09IFwiXCIpKSB7XG4gICAgICAvLyBncmFmYW5hIGFsc28gc3VwcGxpZXMgdGhlIGhlaWdodCwgdHJ5IHRvIHVzZSB0aGF0IGlmIHRoZSBwYW5lbCBkb2VzIG5vdCBoYXZlIGEgaGVpZ2h0XG4gICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmhlaWdodCk7XG4gICAgICAvLyB2NCBhbmQgZWFybGllciBkZWZpbmUgdGhpcyBoZWlnaHQsIGRldGVjdCBzcGFuIGZvciBwcmUtdjVcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhlYWRlciwgYWRqdXN0IGhlaWdodCB0byB1c2UgYWxsIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgICB2YXIgcGFuZWxUaXRsZU9mZnNldCA9IDIwO1xuICAgICAgICBpZiAodGhpcy5wYW5lbC50aXRsZSAhPT0gXCJcIikge1xuICAgICAgICAgIHBhbmVsVGl0bGVPZmZzZXQgPSA0MjtcbiAgICAgICAgfVxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmNvbnRhaW5lckhlaWdodCAtIHBhbmVsVGl0bGVPZmZzZXQpOyAvLyBvZmZzZXQgZm9yIGhlYWRlclxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBoZWlnaHQgc3RpbGwgY2Fubm90IGJlIGRldGVybWluZWQsIGdldCBpdCBmcm9tIHRoZSByb3cgaW5zdGVhZFxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IHRoaXMucm93LmhlaWdodDtcbiAgICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIC8vIGxhc3QgcmVzb3J0IC0gZGVmYXVsdCB0byAyNTBweCAodGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuKVxuICAgICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gXCIyNTBcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXBsYWNlIHB4XG4gICAgdG1wUGFuZWxIZWlnaHQgPSB0bXBQYW5lbEhlaWdodC5yZXBsYWNlKFwicHhcIiwgXCJcIik7XG4gICAgLy8gY29udmVydCB0byBudW1lcmljIHZhbHVlXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9IHBhcnNlSW50KHRtcFBhbmVsSGVpZ2h0LCAxMCk7XG4gICAgcmV0dXJuIGFjdHVhbEhlaWdodDtcbiAgfVxuXG4gIGNsZWFyU1ZHKCkge1xuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIikubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJEMygpIHtcbiAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuY2xlYXJTVkcoKTtcbiAgICBpZiAodGhpcy5wYW5lbFdpZHRoID09PSAwKSB7XG4gICAgICB0aGlzLnBhbmVsV2lkdGggPSB0aGlzLmdldFBhbmVsV2lkdGhGYWlsc2FmZSgpO1xuICAgIH1cbiAgICB0aGlzLnBhbmVsSGVpZ2h0ID0gdGhpcy5nZXRQYW5lbEhlaWdodCgpO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwfTtcbiAgICB2YXIgd2lkdGggPSB0aGlzLnBhbmVsV2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFuZWxIZWlnaHQ7XG5cbiAgICBtYXJnaW4udG9wID0gMDtcbiAgICAvLyBwcmUtdjUsIHdpdGggdGl0bGUsIHNldCB0b3AgbWFyZ2luIHRvIGF0IGxlYXN0IDdweFxuICAgIGlmICgodHlwZW9mIHRoaXMucGFuZWwuc3BhbiAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKHRoaXMucGFuZWwudGl0bGUgIT09IFwiXCIpKSB7XG4gICAgICBtYXJnaW4udG9wID0gNztcbiAgICB9XG4gICAgbWFyZ2luLmJvdHRvbSA9IDA7XG5cbiAgICAvLyBuZXcgYXR0cmlidXRlcyBtYXkgbm90IGJlIGRlZmluZWQgaW4gb2xkZXIgcGFuZWwgZGVmaW5pdGlvbnNcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPSAyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9XG5cbiAgICB2YXIgb3B0ID0ge1xuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICByYWRpdXMgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyxcbiAgICAgIHJhZGl1c0F1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1c0F1dG9TaXplLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBGb250U2l6ZSxcbiAgICAgIHRvb2x0aXBGb250VHlwZTogdGhpcy5wYW5lbC5wb2x5c3RhdC50b29sdGlwRm9udFR5cGUsXG4gICAgICBkYXRhOiB0aGlzLnBvbHlzdGF0RGF0YSxcbiAgICAgIGRpc3BsYXlMaW1pdDogdGhpcy5wYW5lbC5wb2x5c3RhdC5kaXNwbGF5TGltaXQsXG4gICAgICBnbG9iYWxEaXNwbGF5TW9kZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSxcbiAgICAgIGNvbHVtbnM6IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1ucyxcbiAgICAgIGNvbHVtbkF1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbkF1dG9TaXplLFxuICAgICAgcm93czogdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzLFxuICAgICAgcm93QXV0b1NpemUgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd0F1dG9TaXplLFxuICAgICAgdG9vbHRpcENvbnRlbnQ6IHRoaXMudG9vbHRpcENvbnRlbnQsXG4gICAgICBhbmltYXRpb25TcGVlZDogdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IHRoaXMuZ2V0RGVmYXVsdENsaWNrVGhyb3VnaChOYU4pLFxuICAgICAgcG9seXN0YXQ6IHRoaXMucGFuZWwucG9seXN0YXQsXG4gICAgfTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbmV3IEQzV3JhcHBlcih0aGlzLnRlbXBsYXRlU3J2LCB0aGlzLnN2Z0NvbnRhaW5lciwgdGhpcy5kM0RpdklkLCBvcHQpO1xuICAgIHRoaXMuZDNPYmplY3QuZHJhdygpO1xuICB9XG5cbiAgcmVtb3ZlVmFsdWVNYXAobWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwudmFsdWVNYXBzLCBtYXApO1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFZhbHVlTWFwKCkge1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnB1c2goe3ZhbHVlOiBcIlwiLCBvcDogXCI9XCIsIHRleHQ6IFwiXCIgfSk7XG4gIH1cblxuICByZW1vdmVSYW5nZU1hcChyYW5nZU1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFJhbmdlTWFwKCkge1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnB1c2goe2Zyb206IFwiXCIsIHRvOiBcIlwiLCB0ZXh0OiBcIlwifSk7XG4gIH1cblxuICBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgIGlmICghc2NvcGUpIHtcbiAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYXR0cnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHBhbmVsQnlDbGFzcyA9IGVsZW0uZmluZChcIi5ncmFmYW5hLWQzLXBvbHlzdGF0XCIpO1xuICAgIHBhbmVsQnlDbGFzcy5hcHBlbmQoXCI8ZGl2IHN0eWxlPVxcXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1xcXCIgaWQ9XFxcIlwiICsgY3RybC5jb250YWluZXJEaXZJZCArIFwiXFxcIj48L2Rpdj5cIik7XG4gICAgdmFyIGNvbnRhaW5lciA9IHBhbmVsQnlDbGFzc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgIGN0cmwuc2V0Q29udGFpbmVyKGNvbnRhaW5lcik7XG5cbiAgICBlbGVtID0gZWxlbS5maW5kKFwiLmdyYWZhbmEtZDMtcG9seXN0YXRcIik7XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICBjdHJsLnJlbmRlckQzKCk7XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzLm9uKFwicmVuZGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgd2lkdGhcbiAgICAgIGN0cmwucGFuZWxXaWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBjdHJsLnJlbmRlcmluZ0NvbXBsZXRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5kYXRhUmF3ID0gZGF0YUxpc3Q7XG4gICAgLy8gYXV0b21hdGljYWxseSBjb3JyZWN0IHRyYW5zZm9ybSBtb2RlIGJhc2VkIG9uIGRhdGFcbiAgICBpZiAodGhpcy5kYXRhUmF3ICYmIHRoaXMuZGF0YVJhdy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmRhdGFSYXdbMF0udHlwZSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0YWJsZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcImRvY3NcIikge1xuICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJqc29uXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFuZWwudHJhbnNmb3JtID09PSBcInRhYmxlXCIgfHwgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9IFwidGltZXNlcmllc190b19yb3dzXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlnbm9yZSB0aGUgYWJvdmUgYW5kIHVzZSBhIHRpbWVzZXJpZXNcbiAgICB0aGlzLnBvbHlzdGF0RGF0YS5sZW5ndGggPSAwO1xuICAgIGlmICh0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zZXJpZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCBhU2VyaWVzID0gdGhpcy5zZXJpZXNbaW5kZXhdO1xuICAgICAgICBsZXQgY29udmVydGVkID0gVHJhbnNmb3JtZXJzLlRpbWVTZXJpZXNUb1BvbHlzdGF0KHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsT3BlcmF0b3JOYW1lLCBhU2VyaWVzKTtcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGEucHVzaChjb252ZXJ0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhcHBseSBnbG9iYWwgdW5pdCBmb3JtYXR0aW5nIGFuZCBkZWNpbWFsc1xuICAgIHRoaXMuYXBwbHlHbG9iYWxGb3JtYXR0aW5nKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBmaWx0ZXIgb3V0IGJ5IGdsb2JhbERpc3BsYXlNb2RlXG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSB0aGlzLmZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUodGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIG5vdyBzb3J0XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBfLm9yZGVyQnkoXG4gICAgICB0aGlzLnBvbHlzdGF0RGF0YSxcbiAgICAgIFt0aGlzLnBhbmVsLnBvbHlzdGF0LmhleGFnb25Tb3J0QnlGaWVsZF0sXG4gICAgICBbdGhpcy5wYW5lbC5wb2x5c3RhdC5oZXhhZ29uU29ydEJ5RGlyZWN0aW9uXSk7XG4gICAgLy8gdGhpcyBuZWVkcyB0byBiZSBwZXJmb3JtZWQgYWZ0ZXIgc29ydGluZyBydWxlcyBhcmUgYXBwbGllZFxuICAgIC8vIGFwcGx5IG92ZXJyaWRlc1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybC5hcHBseU92ZXJyaWRlcyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgY29tcG9zaXRlcywgdGhpcyB3aWxsIGZpbHRlciBhcyBuZWVkZWQgYW5kIHNldCBjbGlja3Rocm91Z2hcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuY29tcG9zaXRlc01hbmFnZXIuYXBwbHlDb21wb3NpdGVzKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBnbG9iYWwgY2xpY2t0aHJvdWdoIHRvIGFsbCBpdGVtcyBub3Qgc2V0XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucG9seXN0YXREYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgaWYgKHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5jbGlja1Rocm91Z2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGFkZCB0aGUgc2VyaWVzIGFsaWFzIGFzIGEgdmFyIHRvIHRoZSBjbGlja3Rocm91Z2h1cmxcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCA9IHRoaXMuZ2V0RGVmYXVsdENsaWNrVGhyb3VnaChpbmRleCk7XG4gICAgICAgIHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5uZXdUYWJFbmFibGVkID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoTmV3VGFiO1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uc2FuaXRpemVVUkxFbmFibGVkID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemU7XG4gICAgICAgIHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5zYW5pdGl6ZWRVUkwgPSB0aGlzLiRzYW5pdGl6ZSh0aGlzLnBvbHlzdGF0RGF0YVtpbmRleF0uY2xpY2tUaHJvdWdoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZ2VuZXJhdGUgdG9vbHRpcHNcbiAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gVG9vbHRpcC5nZW5lcmF0ZSh0aGlzLiRzY29wZSwgdGhpcy5wb2x5c3RhdERhdGEsIHRoaXMucGFuZWwucG9seXN0YXQpO1xuICB9XG5cbiAgYXBwbHlHbG9iYWxGb3JtYXR0aW5nKGRhdGE6IGFueSkge1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsVW5pdEZvcm1hdF07XG4gICAgICBpZiAoZm9ybWF0RnVuYykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gR2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEZWNpbWFscyk7XG4gICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhW2luZGV4XS52YWx1ZSwgcmVzdWx0LmRlY2ltYWxzLCByZXN1bHQuc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICBkYXRhW2luZGV4XS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgcmVzdWx0LmRlY2ltYWxzKTtcbiAgICAgIH1cbiAgICAgIC8vIGRlZmF1bHQgdGhlIGNvbG9yIHRvIHRoZSBnbG9iYWwgc2V0dGluZ1xuICAgICAgZGF0YVtpbmRleF0uY29sb3IgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3I7XG4gICAgfVxuICB9XG5cblxuICBmaWx0ZXJCeUdsb2JhbERpc3BsYXlNb2RlKGRhdGE6IGFueSkge1xuICAgIGxldCBmaWx0ZXJlZE1ldHJpY3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgIGxldCBjb21wb3NpdGVNZXRyaWNzID0gbmV3IEFycmF5PFBvbHlzdGF0TW9kZWw+KCk7XG4gICAgaWYgKHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsRGlzcGxheU1vZGUgIT09IFwiYWxsXCIpIHtcbiAgICAgIGxldCBkYXRhTGVuID0gZGF0YS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMZW47IGkrKykge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIC8vIGtlZXAgaWYgY29tcG9zaXRlXG4gICAgICAgIGlmIChpdGVtLmlzQ29tcG9zaXRlKSB7XG4gICAgICAgICBjb21wb3NpdGVNZXRyaWNzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgLy8gcHVzaCB0aGUgaW5kZXggbnVtYmVyXG4gICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZU1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIHNldCBkYXRhIHRvIGJlIGFsbCBvZiB0aGUgY29tcG9zaXRlc1xuICAgICAgICAgIGRhdGEgPSBjb21wb3NpdGVNZXRyaWNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB2YWx1ZUZvcm1hdHRlZDogMCxcbiAgICAgIHZhbHVlUm91bmRlZDogMFxuICAgIH07XG4gICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICBpbnZlcnRDb2xvck9yZGVyKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnBhbmVsLmNvbG9yc1swXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzJdID0gdG1wO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlZWQgbXVzdCBub3QgYmUgbGVzcyB0aGFuIDUwMG1zXG4gICAqL1xuICB2YWxpZGF0ZUFuaW1hdGlvblNwZWVkKCkge1xuICAgIGxldCBzcGVlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQ7XG4gICAgbGV0IG5ld1NwZWVkID0gNTAwMDtcbiAgICBpZiAoc3BlZWQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoc3BlZWQsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrU3BlZWQgPSBwYXJzZUludChzcGVlZCwgMTApO1xuICAgICAgICBpZiAoY2hlY2tTcGVlZCA+PSA1MDApIHtcbiAgICAgICAgICBuZXdTcGVlZCA9IGNoZWNrU3BlZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTWluIHNwZWVkIGlzIDUwMFxuICAgICAgICAgIG5ld1NwZWVkID0gNTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQgPSBuZXdTcGVlZDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVEaXNwbGF5TGltaXQoKSB7XG4gICAgbGV0IGxpbWl0ID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kaXNwbGF5TGltaXQ7XG4gICAgbGV0IG5ld0xpbWl0ID0gMTAwO1xuICAgIGlmIChsaW1pdCA9PT0gbnVsbCkge1xuICAgICAgbmV3TGltaXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KGxpbWl0LCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0xpbWl0ID0gcGFyc2VJbnQobGltaXQsIDEwKTtcbiAgICAgICAgaWYgKGNoZWNrTGltaXQgPj0gMCkge1xuICAgICAgICAgIG5ld0xpbWl0ID0gY2hlY2tMaW1pdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyAwIG1lYW5zIHVubGltaXRlZFxuICAgIGlmIChuZXdMaW1pdCA9PT0gMCkge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5kaXNwbGF5TGltaXQgPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmRpc3BsYXlMaW1pdCA9IG5ld0xpbWl0O1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVDb2x1bW5WYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNvbHVtbnMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnM7XG4gICAgICBsZXQgbmV3Q29sdW1ucyA9IDE7XG4gICAgICBpZiAoY29sdW1ucykge1xuICAgICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KGNvbHVtbnMsIDEwKSkpIHtcbiAgICAgICAgICBsZXQgY2hlY2tDb2x1bW5zID0gcGFyc2VJbnQoY29sdW1ucywgMTApO1xuICAgICAgICAgIGlmIChjaGVja0NvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICBuZXdDb2x1bW5zID0gY2hlY2tDb2x1bW5zO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zID0gbmV3Q29sdW1ucztcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHZhbGlkYXRlUm93VmFsdWUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwucG9seXN0YXQucm93QXV0b1NpemUpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucm93cyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByb3dzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzO1xuICAgICAgbGV0IG5ld1Jvd3MgPSAxO1xuICAgICAgaWYgKHJvd3MpIHtcbiAgICAgICAgaWYgKCFpc05hTihwYXJzZUludChyb3dzLCAxMCkpKSB7XG4gICAgICAgICAgbGV0IGNoZWNrUm93cyA9IHBhcnNlSW50KHJvd3MsIDEwKTtcbiAgICAgICAgICBpZiAoY2hlY2tSb3dzID4gMCkge1xuICAgICAgICAgICAgbmV3Um93cyA9IGNoZWNrUm93cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucm93cyA9IG5ld1Jvd3M7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJhZGl1c1ZhbHVlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1c0F1dG9TaXplKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByYWRpdXMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cztcbiAgICAgIGxldCBuZXdSYWRpdXMgPSAyNTtcbiAgICAgIGlmIChyYWRpdXMgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKCFpc05hTihwYXJzZUludChyYWRpdXMsIDEwKSkpIHtcbiAgICAgICAgICBsZXQgY2hlY2tSYWRpdXMgPSBwYXJzZUludChyYWRpdXMsIDEwKTtcbiAgICAgICAgICBpZiAoY2hlY2tSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgICBuZXdSYWRpdXMgPSBjaGVja1JhZGl1cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucmFkaXVzID0gbmV3UmFkaXVzO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVCb3JkZXJTaXplVmFsdWUoKSB7XG4gICAgbGV0IGJvcmRlclNpemUgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplO1xuICAgIGxldCBuZXdCb3JkZXJTaXplID0gMjtcbiAgICBpZiAoYm9yZGVyU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChib3JkZXJTaXplLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0JvcmRlclNpemUgPSBwYXJzZUludChib3JkZXJTaXplLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0JvcmRlclNpemUgPj0gMCkge1xuICAgICAgICAgIG5ld0JvcmRlclNpemUgPSBjaGVja0JvcmRlclNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IG5ld0JvcmRlclNpemU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25Cb3JkZXJDb2xvcigpIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9IFJHQlRvSGV4KHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXBkYXRlUG9seWdvbkdsb2JhbEZpbGxDb2xvcigpIHtcbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IgPSBSR0JUb0hleCh0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXREZWZhdWx0Q2xpY2tUaHJvdWdoKGluZGV4OiBudW1iZXIpIHtcbiAgICBsZXQgdXJsID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoO1xuICAgIC8vIGFwcGx5IGJvdGggdHlwZXMgb2YgdHJhbnNmb3Jtcywgb25lIHRhcmdldGVkIGF0IHRoZSBkYXRhIGl0ZW0gaW5kZXgsIGFuZCBzZWNvbmRseSB0aGUgbnRoIHZhcmlhbnRcbiAgICB1cmwgPSBDbGlja1Rocm91Z2hUcmFuc2Zvcm1lci50cmFuZm9ybVNpbmdsZU1ldHJpYyhpbmRleCwgdXJsLCB0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgdXJsID0gQ2xpY2tUaHJvdWdoVHJhbnNmb3JtZXIudHJhbmZvcm1OdGhNZXRyaWModXJsLCB0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gcHJvY2VzcyB0ZW1wbGF0ZSB2YXJpYWJsZXMgaW5zaWRlIGNsaWNrdGhyb3VnaFxuICAgIHVybCA9IHRoaXMudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KHVybCk7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHNldEdsb2JhbFVuaXRGb3JtYXQoc3ViSXRlbSkge1xuICAgIHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsVW5pdEZvcm1hdCA9IHN1Ykl0ZW0udmFsdWU7XG4gIH1cbn1cblxuXG5leHBvcnQge1xuICBEM1BvbHlzdGF0UGFuZWxDdHJsLFxuICBEM1BvbHlzdGF0UGFuZWxDdHJsIGFzIE1ldHJpY3NQYW5lbEN0cmxcbn07XG4iXX0=