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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFpQmtDLHVDQUFnQjtnQkE4SGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F3QnpCO29CQXpCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkE1SHZFLG9CQUFjLEdBQUc7d0JBQ2YsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7d0JBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7cUJBQy9DLENBQUM7b0JBQ0Ysa0JBQVksR0FBRzt3QkFDYixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTt3QkFDbEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtxQkFDL0MsQ0FBQztvQkFDRixxQkFBZSxHQUFHO3dCQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3dCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDN0IsQ0FBQztvQkFDRixZQUFNLEdBQUc7d0JBQ1AsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO3dCQUU3RCxFQUFFLEtBQUssRUFBRSxR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QW5CLFVBQW9CLE9BQU87b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZELENBQUM7Z0JBcGpCTSwrQkFBVyxHQUFHLHdCQUF3QixDQUFDO2dCQXFqQmhELDBCQUFDO2FBQUEsQUF0akJELENBQWtDLHNCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuaW1wb3J0IHtNZXRyaWNzUGFuZWxDdHJsfSBmcm9tIFwiYXBwL3BsdWdpbnMvc2RrXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcblxuaW1wb3J0IFwiLi9jc3MvcG9seXN0YXQuY3NzIVwiO1xuaW1wb3J0IHsgRDNXcmFwcGVyIH0gZnJvbSBcIi4vZDN3cmFwcGVyXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm1lcnMgfSBmcm9tIFwiLi90cmFuc2Zvcm1lcnNcIjtcbmltcG9ydCB7IFBvbHlzdGF0TW9kZWwgfSBmcm9tIFwiLi9wb2x5c3RhdG1vZGVsXCI7XG5pbXBvcnQgeyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIH0gZnJvbSBcIi4vbWV0cmljX292ZXJyaWRlc19tYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVzTWFuYWdlciB9IGZyb20gXCIuL2NvbXBvc2l0ZXNfbWFuYWdlclwiO1xuaW1wb3J0IHsgVG9vbHRpcCB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcbmltcG9ydCB7IEdldERlY2ltYWxzRm9yVmFsdWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmNsYXNzIEQzUG9seXN0YXRQYW5lbEN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gXCJwYXJ0aWFscy90ZW1wbGF0ZS5odG1sXCI7XG4gIGFuaW1hdGlvbk1vZGVzID0gW1xuICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgIHsgdmFsdWU6IFwidHJpZ2dlcmVkXCIsIHRleHQ6IFwiU2hvdyBUcmlnZ2VyZWRcIiB9XG4gIF07XG4gIGRpc3BsYXlNb2RlcyA9IFtcbiAgICB7IHZhbHVlOiBcImFsbFwiLCB0ZXh0OiBcIlNob3cgQWxsXCIgfSxcbiAgICB7IHZhbHVlOiBcInRyaWdnZXJlZFwiLCB0ZXh0OiBcIlNob3cgVHJpZ2dlcmVkXCIgfVxuICBdO1xuICB0aHJlc2hvbGRTdGF0ZXMgPSBbXG4gICAgeyB2YWx1ZTogMCwgdGV4dDogXCJva1wiIH0sXG4gICAgeyB2YWx1ZTogMSwgdGV4dDogXCJ3YXJuaW5nXCIgfSxcbiAgICB7IHZhbHVlOiAyLCB0ZXh0OiBcImNyaXRpY2FsXCIgfSxcbiAgICB7IHZhbHVlOiAzLCB0ZXh0OiBcImN1c3RvbVwiIH1cbiAgXTtcbiAgc2hhcGVzID0gW1xuICAgIHsgdmFsdWU6IFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiLCB0ZXh0OiBcIkhleGFnb24gUG9pbnRlZCBUb3BcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJoZXhhZ29uX2ZsYXRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBGbGF0IFRvcFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjaXJjbGVcIiwgdGV4dDogXCJDaXJjbGVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJjcm9zc1wiLCB0ZXh0OiBcIkNyb3NzXCIgfSxcbiAgICAvL3sgdmFsdWU6IFwiZGlhbW9uZFwiLCB0ZXh0OiBcIkRpYW1vbmRcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJzcXVhcmVcIiwgdGV4dDogXCJTcXVhcmVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJzdGFyXCIsIHRleHQ6IFwiU3RhclwiIH0sXG4gICAgLy97IHZhbHVlOiBcInRyaWFuZ2xlXCIsIHRleHQ6IFwiVHJpYW5nbGVcIiB9LFxuICAgIC8veyB2YWx1ZTogXCJ3eWVcIiwgdGV4dDogXCJXeWVcIiB9XG4gIF07XG4gIGZvbnRTaXplcyA9IFtcbiAgICA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyICwgMTMsIDE0LCAxNSxcbiAgICAxNiwgMTcsIDE4LCAxOSwgMjAsIDIyLCAyNCwgMjYsIDI4LCAzMCwgMzIsXG4gICAgMzQsIDM2LCAzOCwgNDAsIDQyLCA0NCwgNDYsIDQ4LCA1MCwgNTIsIDU0LFxuICAgIDU2LCA1OCwgNjAsIDYyLCA2NCwgNjYsIDY4LCA3MF07XG4gIGZvbnRUeXBlcyA9IFtcbiAgICBcIk9wZW4gU2Fuc1wiLCBcIkFyaWFsXCIsIFwiQXZhbnQgR2FyZGVcIiwgXCJCb29rbWFuXCIsXG4gICAgXCJDb25zb2xhc1wiLCBcIkNvdXJpZXJcIiwgXCJDb3VyaWVyIE5ld1wiLCBcIkZ1dHVyYVwiLFxuICAgIFwiR2FyYW1vbmRcIiwgXCJIZWx2ZXRpY2FcIixcbiAgICBcIlBhbGF0aW5vXCIsIFwiUm9ib3RvXCIsIFwiVGltZXNcIiwgXCJUaW1lcyBOZXcgUm9tYW5cIixcbiAgICBcIlZlcmRhbmFcIlxuICBdO1xuICB1bml0Rm9ybWF0cyA9IGtibi5nZXRVbml0Rm9ybWF0cygpO1xuICBvcGVyYXRvck9wdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogXCJhdmdcIiwgdGV4dDogXCJBdmVyYWdlXCIgfSxcbiAgICB7IHZhbHVlOiBcImNvdW50XCIsIHRleHQ6IFwiQ291bnRcIiB9LFxuICAgIHsgdmFsdWU6IFwiY3VycmVudFwiLCB0ZXh0OiBcIkN1cnJlbnRcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVsdGFcIiwgdGV4dDogXCJEZWx0YVwiIH0sXG4gICAgeyB2YWx1ZTogXCJkaWZmXCIsIHRleHQ6IFwiRGlmZmVyZW5jZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJmaXJzdFwiLCB0ZXh0OiBcIkZpcnN0XCIgfSxcbiAgICB7IHZhbHVlOiBcImxvZ21pblwiLCB0ZXh0OiBcIkxvZyBNaW5cIiB9LFxuICAgIHsgdmFsdWU6IFwibWF4XCIsIHRleHQ6IFwiTWF4XCIgfSxcbiAgICB7IHZhbHVlOiBcIm1pblwiLCB0ZXh0OiBcIk1pblwiIH0sXG4gICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJsYXN0X3RpbWVcIiwgdGV4dDogXCJUaW1lIG9mIExhc3QgUG9pbnRcIiB9LFxuICAgIHsgdmFsdWU6IFwidGltZV9zdGVwXCIsIHRleHQ6IFwiVGltZSBTdGVwXCIgfSxcbiAgICB7IHZhbHVlOiBcInRvdGFsXCIsIHRleHQ6IFwiVG90YWxcIiB9XG4gIF07XG4gIHNvcnREaXJlY3Rpb25zID0gW1xuICAgIHsgdmFsdWU6IFwiYXNjXCIsIHRleHQ6IFwiQXNjZW5kaW5nXCIgfSxcbiAgICB7IHZhbHVlOiBcImRlc2NcIiwgdGV4dDogXCJEZXNjZW5kaW5nXCIgfVxuICBdO1xuICBzb3J0RmllbGRzID0gW1xuICAgIHsgdmFsdWU6IFwibmFtZVwiLCB0ZXh0OiBcIk5hbWVcIiB9LFxuICAgIHsgdmFsdWU6IFwidGhyZXNob2xkTGV2ZWxcIiwgdGV4dDogXCJUaHJlc2hvbGQgTGV2ZWxcIiB9LFxuICAgIHsgdmFsdWU6IFwidmFsdWVcIiwgdGV4dDogXCJWYWx1ZVwiIH1cbiAgXTtcblxuICBkYXRhUmF3IDogYW55O1xuICBwb2x5c3RhdERhdGE6IFBvbHlzdGF0TW9kZWxbXTtcbiAgc2NvcGVyZWY6IGFueTtcbiAgYWxlcnRTcnZSZWY6IGFueTtcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHBhbmVsQ29udGFpbmVyOiBhbnk7XG4gIGQzT2JqZWN0OiBEM1dyYXBwZXI7XG4gIGRhdGE6IGFueTtcbiAgc2VyaWVzOiBhbnlbXTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgb3ZlcnJpZGVzQ3RybDogTWV0cmljT3ZlcnJpZGVzTWFuYWdlcjtcbiAgY29tcG9zaXRlc01hbmFnZXIgOiBDb21wb3NpdGVzTWFuYWdlcjtcbiAgdG9vbHRpcENvbnRlbnQ6IHN0cmluZ1tdO1xuICBkM0RpdklkOiBzdHJpbmc7XG4gIGNvbnRhaW5lckRpdklkOiBzdHJpbmc7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBwYW5lbFdpZHRoOiBhbnk7XG4gIHBhbmVsSGVpZ2h0OiBhbnk7XG5cbiAgcGFuZWxEZWZhdWx0cyA9IHtcbiAgICBzYXZlZENvbXBvc2l0ZXMgOiBbXSxcbiAgICBzYXZlZE92ZXJyaWRlcyA6IFtdLFxuICAgIGNvbG9yczogW1wiIzI5OWM0NlwiLCBcInJnYmEoMjM3LCAxMjksIDQwLCAwLjg5KVwiLCBcIiNkNDRhM2FcIl0sXG4gICAgcG9seXN0YXQ6IHtcbiAgICAgIGFuaW1hdGlvblNwZWVkOiAyNTAwLFxuICAgICAgY29sdW1uczogXCJcIixcbiAgICAgIGNvbHVtbkF1dG9TaXplOiB0cnVlLFxuICAgICAgZGlzcGxheUxpbWl0OiAxMDAsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoOiBcIlwiLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaFNhbml0aXplOiB0cnVlLFxuICAgICAgZm9udEF1dG9TY2FsZTogdHJ1ZSxcbiAgICAgIGZvbnRTaXplOiAxMixcbiAgICAgIGZvbnRUeXBlOiBcIlJvYm90b1wiLFxuICAgICAgZ2xvYmFsVW5pdEZvcm1hdDogXCJzaG9ydFwiLFxuICAgICAgZ2xvYmFsRGVjaW1hbHM6IDIsXG4gICAgICBnbG9iYWxEaXNwbGF5TW9kZTogXCJhbGxcIixcbiAgICAgIGdsb2JhbE9wZXJhdG9yTmFtZTogXCJhdmdcIixcbiAgICAgIGdyYWRpZW50RW5hYmxlZDogdHJ1ZSxcbiAgICAgIGhleGFnb25Tb3J0QnlEaXJlY3Rpb246IFwiYXNjXCIsXG4gICAgICBoZXhhZ29uU29ydEJ5RmllbGQ6IFwibmFtZVwiLFxuICAgICAgbWF4TWV0cmljczogMCxcbiAgICAgIHBvbHlnb25Cb3JkZXJTaXplOiAyLFxuICAgICAgcG9seWdvbkJvcmRlckNvbG9yOiBcImJsYWNrXCIsXG4gICAgICByYWRpdXM6IFwiXCIsXG4gICAgICByYWRpdXNBdXRvU2l6ZTogdHJ1ZSxcbiAgICAgIHJvd3M6IFwiXCIsXG4gICAgICByb3dBdXRvU2l6ZTogdHJ1ZSxcbiAgICAgIHNoYXBlOiBcImhleGFnb25fcG9pbnRlZF90b3BcIixcbiAgICAgIHRvb2x0aXBEaXNwbGF5TW9kZTogXCJhbGxcIixcbiAgICAgIHRvb2x0aXBEaXNwbGF5VGV4dFRyaWdnZXJlZEVtcHR5OiBcIk9LXCIsXG4gICAgICB0b29sdGlwRm9udFNpemU6IDEyLFxuICAgICAgdG9vbHRpcEZvbnRUeXBlOiBcIlJvYm90b1wiLFxuICAgICAgdG9vbHRpcFByaW1hcnlTb3J0RGlyZWN0aW9uOiBcImRlc2NcIixcbiAgICAgIHRvb2x0aXBQcmltYXJ5U29ydEZpZWxkOiBcInRocmVzaG9sZExldmVsXCIsXG4gICAgICB0b29sdGlwU2Vjb25kYXJ5U29ydERpcmVjdGlvbjogXCJkZXNjXCIsXG4gICAgICB0b29sdGlwU2Vjb25kYXJ5U29ydEZpZWxkOiBcInZhbHVlXCIsXG4gICAgICB0b29sdGlwVGltZXN0YW1wRW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICB9O1xuXG5cbiAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IsIHRlbXBsYXRlU3J2LCBhbGVydFNydiwgcHJpdmF0ZSAkc2FuaXRpemUpIHtcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XG4gICAgLy8gbWVyZ2UgZXhpc3Rpbmcgc2V0dGluZ3Mgd2l0aCBvdXIgZGVmYXVsdHNcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIHRoaXMucGFuZWxEZWZhdWx0cyk7XG4gICAgdGhpcy5kM0RpdklkID0gXCJkM19zdmdfXCIgKyB0aGlzLnBhbmVsLmlkO1xuICAgIHRoaXMuY29udGFpbmVyRGl2SWQgPSBcImNvbnRhaW5lcl9cIiArIHRoaXMuZDNEaXZJZDtcbiAgICB0aGlzLmFsZXJ0U3J2UmVmID0gYWxlcnRTcnY7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMucGFuZWxDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMudGVtcGxhdGVTcnYgPSB0ZW1wbGF0ZVNydjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IG51bGw7XG4gICAgdGhpcy5wYW5lbFdpZHRoID0gbnVsbDtcbiAgICB0aGlzLnBhbmVsSGVpZ2h0ID0gbnVsbDtcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgIHRoaXMuZDNPYmplY3QgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMuc2VyaWVzID0gW107XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBbXTtcbiAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gW107XG4gICAgdGhpcy5vdmVycmlkZXNDdHJsID0gbmV3IE1ldHJpY092ZXJyaWRlc01hbmFnZXIoJHNjb3BlLCB0ZW1wbGF0ZVNydiwgJHNhbml0aXplLCB0aGlzLnBhbmVsLnNhdmVkT3ZlcnJpZGVzKTtcbiAgICB0aGlzLmNvbXBvc2l0ZXNNYW5hZ2VyID0gbmV3IENvbXBvc2l0ZXNNYW5hZ2VyKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgdGhpcy5wYW5lbC5zYXZlZENvbXBvc2l0ZXMpO1xuICAgIHRoaXMuZXZlbnRzLm9uKFwiaW5pdC1lZGl0LW1vZGVcIiwgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtcmVjZWl2ZWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtZXJyb3JcIiwgdGhpcy5vbkRhdGFFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtc25hcHNob3QtbG9hZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICB9XG5cblxuICBvbkluaXRFZGl0TW9kZSgpIHtcbiAgICAvLyBkZXRlcm1pbmUgdGhlIHBhdGggdG8gdGhpcyBwbHVnaW4gYmFzZSBvbiB0aGUgbmFtZSBmb3VuZCBpbiBwYW5lbC50eXBlXG4gICAgdmFyIHRoaXNQYW5lbFBhdGggPSBcInB1YmxpYy9wbHVnaW5zL1wiICsgdGhpcy5wYW5lbC50eXBlICsgXCIvXCI7XG4gICAgLy8gYWRkIHRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBwYXJ0aWFsXG4gICAgdmFyIG9wdGlvbnNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm9wdGlvbnMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiT3B0aW9uc1wiLCBvcHRpb25zUGF0aCwgMik7XG4gICAgdmFyIG92ZXJyaWRlc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3Iub3ZlcnJpZGVzLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIk92ZXJyaWRlc1wiLCBvdmVycmlkZXNQYXRoLCAzKTtcbiAgICB2YXIgY29tcG9zaXRlc1BhdGggPSB0aGlzUGFuZWxQYXRoICsgXCJwYXJ0aWFscy9lZGl0b3IuY29tcG9zaXRlcy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJDb21wb3NpdGVzXCIsIGNvbXBvc2l0ZXNQYXRoLCA0KTtcbiAgICB2YXIgbWFwcGluZ3NQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm1hcHBpbmdzLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIlZhbHVlIE1hcHBpbmdzXCIsIG1hcHBpbmdzUGF0aCwgNSk7XG4gIH1cblxuICAvKipcbiAgICogW3NldENvbnRhaW5lciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtbdHlwZV19IGNvbnRhaW5lciBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZXRDb250YWluZXIoY29udGFpbmVyKSB7XG4gICAgdGhpcy5wYW5lbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIC8vIGRldGVybWluZSB0aGUgd2lkdGggb2YgYSBwYW5lbCBieSB0aGUgc3BhbiBhbmQgdmlld3BvcnRcbiAgLy8gdGhlIGxpbmsgZWxlbWVudCBvYmplY3QgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSB3aWR0aCBtb3JlIHJlbGlhYmx5XG4gIGdldFBhbmVsV2lkdGhGYWlsc2FmZSgpIHtcbiAgICB2YXIgdHJ1ZVdpZHRoID0gMDtcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuZ3JpZFBvcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gMjQgc2xvdHMgaXMgZnVsbHNjcmVlbiwgZ2V0IHRoZSB2aWV3cG9ydCBhbmQgZGl2aWRlIHRvIGFwcHJveGltYXRlIHRoZSB3aWR0aFxuICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgbGV0IHBpeGVsc1BlclNsb3QgPSB2aWV3UG9ydFdpZHRoIC8gMjQ7XG4gICAgICB0cnVlV2lkdGggPSBNYXRoLnJvdW5kKHRoaXMucGFuZWwuZ3JpZFBvcy53ICogcGl4ZWxzUGVyU2xvdCk7XG4gICAgICByZXR1cm4gdHJ1ZVdpZHRoO1xuICAgIH1cbiAgICAvLyBncmFmYW5hNSAtIHVzZSB0aGlzLnBhbmVsLmdyaWRQb3MudywgdGhpcy5wYW5lbC5ncmlkUG9zLmhcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuc3BhbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gY2hlY2sgaWYgaW5zaWRlIGVkaXQgbW9kZVxuICAgICAgaWYgKHRoaXMuZWRpdE1vZGVJbml0aWF0ZWQpIHtcbiAgICAgICAgLy8gd2lkdGggaXMgY2xpZW50V2lkdGggb2YgZG9jdW1lbnRcbiAgICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnZXQgdGhlIHdpZHRoIGJhc2VkIG9uIHRoZSBzY2FsZWQgY29udGFpbmVyICh2NSBuZWVkcyB0aGlzKVxuICAgICAgICB0cnVlV2lkdGggPSB0aGlzLnBhbmVsQ29udGFpbmVyLm9mZnNldFBhcmVudC5jbGllbnRXaWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdjQgYW5kIHByZXZpb3VzIHVzZWQgZml4ZWQgc3BhbnNcbiAgICAgIHZhciB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgIC8vIGdldCB0aGUgcGl4ZWxzIG9mIGEgc3BhblxuICAgICAgdmFyIHBpeGVsc1BlclNwYW4gPSB2aWV3UG9ydFdpZHRoIC8gMTI7XG4gICAgICAvLyBtdWx0aXBseSBudW0gc3BhbnMgYnkgcGl4ZWxzUGVyU3BhblxuICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5yb3VuZCh0aGlzLnBhbmVsLnNwYW4gKiBwaXhlbHNQZXJTcGFuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVXaWR0aDtcbiAgfVxuXG4gIGdldFBhbmVsSGVpZ2h0KCkge1xuICAgIC8vIHBhbmVsIGNhbiBoYXZlIGEgZml4ZWQgaGVpZ2h0IHNldCB2aWEgXCJHZW5lcmFsXCIgdGFiIGluIHBhbmVsIGVkaXRvclxuICAgIHZhciB0bXBQYW5lbEhlaWdodCA9IHRoaXMucGFuZWwuaGVpZ2h0O1xuICAgIGlmICgodHlwZW9mIHRtcFBhbmVsSGVpZ2h0ID09PSBcInVuZGVmaW5lZFwiKSB8fCAodG1wUGFuZWxIZWlnaHQgPT09IFwiXCIpKSB7XG4gICAgICAvLyBncmFmYW5hIGFsc28gc3VwcGxpZXMgdGhlIGhlaWdodCwgdHJ5IHRvIHVzZSB0aGF0IGlmIHRoZSBwYW5lbCBkb2VzIG5vdCBoYXZlIGEgaGVpZ2h0XG4gICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmhlaWdodCk7XG4gICAgICAvLyB2NCBhbmQgZWFybGllciBkZWZpbmUgdGhpcyBoZWlnaHQsIGRldGVjdCBzcGFuIGZvciBwcmUtdjVcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5zcGFuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhlYWRlciwgYWRqdXN0IGhlaWdodCB0byB1c2UgYWxsIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgICB2YXIgcGFuZWxUaXRsZU9mZnNldCA9IDIwO1xuICAgICAgICBpZiAodGhpcy5wYW5lbC50aXRsZSAhPT0gXCJcIikge1xuICAgICAgICAgIHBhbmVsVGl0bGVPZmZzZXQgPSA0MjtcbiAgICAgICAgfVxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IFN0cmluZyh0aGlzLmNvbnRhaW5lckhlaWdodCAtIHBhbmVsVGl0bGVPZmZzZXQpOyAvLyBvZmZzZXQgZm9yIGhlYWRlclxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBoZWlnaHQgc3RpbGwgY2Fubm90IGJlIGRldGVybWluZWQsIGdldCBpdCBmcm9tIHRoZSByb3cgaW5zdGVhZFxuICAgICAgICB0bXBQYW5lbEhlaWdodCA9IHRoaXMucm93LmhlaWdodDtcbiAgICAgICAgaWYgKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIC8vIGxhc3QgcmVzb3J0IC0gZGVmYXVsdCB0byAyNTBweCAodGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuKVxuICAgICAgICAgIHRtcFBhbmVsSGVpZ2h0ID0gXCIyNTBcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXBsYWNlIHB4XG4gICAgdG1wUGFuZWxIZWlnaHQgPSB0bXBQYW5lbEhlaWdodC5yZXBsYWNlKFwicHhcIiwgXCJcIik7XG4gICAgLy8gY29udmVydCB0byBudW1lcmljIHZhbHVlXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9IHBhcnNlSW50KHRtcFBhbmVsSGVpZ2h0LCAxMCk7XG4gICAgcmV0dXJuIGFjdHVhbEhlaWdodDtcbiAgfVxuXG4gIGNsZWFyU1ZHKCkge1xuICAgIGlmICgkKFwiI1wiICsgdGhpcy5kM0RpdklkKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLmQzRGl2SWQpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXBhbmVsXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAoJChcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIikubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJEMygpIHtcbiAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuY2xlYXJTVkcoKTtcbiAgICBpZiAodGhpcy5wYW5lbFdpZHRoID09PSAwKSB7XG4gICAgICB0aGlzLnBhbmVsV2lkdGggPSB0aGlzLmdldFBhbmVsV2lkdGhGYWlsc2FmZSgpO1xuICAgIH1cbiAgICB0aGlzLnBhbmVsSGVpZ2h0ID0gdGhpcy5nZXRQYW5lbEhlaWdodCgpO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwfTtcbiAgICB2YXIgd2lkdGggPSB0aGlzLnBhbmVsV2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFuZWxIZWlnaHQ7XG5cbiAgICBtYXJnaW4udG9wID0gMDtcbiAgICAvLyBwcmUtdjUsIHdpdGggdGl0bGUsIHNldCB0b3AgbWFyZ2luIHRvIGF0IGxlYXN0IDdweFxuICAgIGlmICgodHlwZW9mIHRoaXMucGFuZWwuc3BhbiAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKHRoaXMucGFuZWwudGl0bGUgIT09IFwiXCIpKSB7XG4gICAgICBtYXJnaW4udG9wID0gNztcbiAgICB9XG4gICAgbWFyZ2luLmJvdHRvbSA9IDA7XG5cbiAgICAvLyBuZXcgYXR0cmlidXRlcyBtYXkgbm90IGJlIGRlZmluZWQgaW4gb2xkZXIgcGFuZWwgZGVmaW5pdGlvbnNcbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgPSAyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9XG5cbiAgICB2YXIgb3B0ID0ge1xuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICByYWRpdXMgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyxcbiAgICAgIHJhZGl1c0F1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1c0F1dG9TaXplLFxuICAgICAgdG9vbHRpcEZvbnRTaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBGb250U2l6ZSxcbiAgICAgIHRvb2x0aXBGb250VHlwZTogdGhpcy5wYW5lbC5wb2x5c3RhdC50b29sdGlwRm9udFR5cGUsXG4gICAgICBkYXRhOiB0aGlzLnBvbHlzdGF0RGF0YSxcbiAgICAgIGRpc3BsYXlMaW1pdDogdGhpcy5wYW5lbC5wb2x5c3RhdC5kaXNwbGF5TGltaXQsXG4gICAgICBnbG9iYWxEaXNwbGF5TW9kZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSxcbiAgICAgIGNvbHVtbnM6IHRoaXMucGFuZWwucG9seXN0YXQuY29sdW1ucyxcbiAgICAgIGNvbHVtbkF1dG9TaXplOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbkF1dG9TaXplLFxuICAgICAgcm93czogdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzLFxuICAgICAgcm93QXV0b1NpemUgOiB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd0F1dG9TaXplLFxuICAgICAgdG9vbHRpcENvbnRlbnQ6IHRoaXMudG9vbHRpcENvbnRlbnQsXG4gICAgICBhbmltYXRpb25TcGVlZDogdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCxcbiAgICAgIGRlZmF1bHRDbGlja1Rocm91Z2g6IHRoaXMuZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpLFxuICAgICAgcG9seXN0YXQ6IHRoaXMucGFuZWwucG9seXN0YXQsXG4gICAgfTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbmV3IEQzV3JhcHBlcih0aGlzLnRlbXBsYXRlU3J2LCB0aGlzLnN2Z0NvbnRhaW5lciwgdGhpcy5kM0RpdklkLCBvcHQpO1xuICAgIHRoaXMuZDNPYmplY3QuZHJhdygpO1xuICB9XG5cbiAgcmVtb3ZlVmFsdWVNYXAobWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwudmFsdWVNYXBzLCBtYXApO1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFZhbHVlTWFwKCkge1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnB1c2goe3ZhbHVlOiBcIlwiLCBvcDogXCI9XCIsIHRleHQ6IFwiXCIgfSk7XG4gIH1cblxuICByZW1vdmVSYW5nZU1hcChyYW5nZU1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFJhbmdlTWFwKCkge1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnB1c2goe2Zyb206IFwiXCIsIHRvOiBcIlwiLCB0ZXh0OiBcIlwifSk7XG4gIH1cblxuICBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgIGlmICghc2NvcGUpIHtcbiAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYXR0cnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGQzQnlDbGFzcyA9IGVsZW0uZmluZChcIi5ncmFmYW5hLWQzLXBvbHlzdGF0XCIpO1xuICAgIGQzQnlDbGFzcy5hcHBlbmQoXCI8ZGl2IGlkPVxcXCJcIiArIGN0cmwuY29udGFpbmVyRGl2SWQgKyBcIlxcXCI+PC9kaXY+XCIpO1xuICAgIHZhciBjb250YWluZXIgPSBkM0J5Q2xhc3NbMF0uY2hpbGROb2Rlc1swXTtcbiAgICBjdHJsLnNldENvbnRhaW5lcihjb250YWluZXIpO1xuXG4gICAgZWxlbSA9IGVsZW0uZmluZChcIi5ncmFmYW5hLWQzLXBvbHlzdGF0XCIpO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgd2lkdGhcbiAgICAgIGN0cmwucGFuZWxXaWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgY3RybC5yZW5kZXJEMygpO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50cy5vbihcInJlbmRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vIHRyeSB0byBnZXQgdGhlIHdpZHRoXG4gICAgICBjdHJsLnBhbmVsV2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgY3RybC5yZW5kZXJpbmdDb21wbGV0ZWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFZhbHVlcyhkYXRhTGlzdCkge1xuICAgIHRoaXMuZGF0YVJhdyA9IGRhdGFMaXN0O1xuICAgIC8vIGF1dG9tYXRpY2FsbHkgY29ycmVjdCB0cmFuc2Zvcm0gbW9kZSBiYXNlZCBvbiBkYXRhXG4gICAgaWYgKHRoaXMuZGF0YVJhdyAmJiB0aGlzLmRhdGFSYXcubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5kYXRhUmF3WzBdLnR5cGUgPT09IFwidGFibGVcIikge1xuICAgICAgICB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9IFwidGFibGVcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFSYXdbMF0udHlwZSA9PT0gXCJkb2NzXCIpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9IFwianNvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnBhbmVsLnRyYW5zZm9ybSA9PT0gXCJ0YWJsZVwiIHx8IHRoaXMucGFuZWwudHJhbnNmb3JtID09PSBcImpzb25cIikge1xuICAgICAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcInRpbWVzZXJpZXNfdG9fcm93c1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBpZ25vcmUgdGhlIGFib3ZlIGFuZCB1c2UgYSB0aW1lc2VyaWVzXG4gICAgdGhpcy5wb2x5c3RhdERhdGEubGVuZ3RoID0gMDtcbiAgICBpZiAodGhpcy5zZXJpZXMgJiYgdGhpcy5zZXJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuc2VyaWVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBsZXQgYVNlcmllcyA9IHRoaXMuc2VyaWVzW2luZGV4XTtcbiAgICAgICAgbGV0IGNvbnZlcnRlZCA9IFRyYW5zZm9ybWVycy5UaW1lU2VyaWVzVG9Qb2x5c3RhdCh0aGlzLnBhbmVsLnBvbHlzdGF0Lmdsb2JhbE9wZXJhdG9yTmFtZSwgYVNlcmllcyk7XG4gICAgICAgIHRoaXMucG9seXN0YXREYXRhLnB1c2goY29udmVydGVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYXBwbHkgZ2xvYmFsIHVuaXQgZm9ybWF0dGluZyBhbmQgZGVjaW1hbHNcbiAgICB0aGlzLmFwcGx5R2xvYmFsRm9ybWF0dGluZyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgb3ZlcnJpZGVzXG4gICAgdGhpcy5vdmVycmlkZXNDdHJsLmFwcGx5T3ZlcnJpZGVzKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBjb21wb3NpdGVzLCB0aGlzIHdpbGwgZmlsdGVyIGFzIG5lZWRlZCBhbmQgc2V0IGNsaWNrdGhyb3VnaFxuICAgIHRoaXMucG9seXN0YXREYXRhID0gdGhpcy5jb21wb3NpdGVzTWFuYWdlci5hcHBseUNvbXBvc2l0ZXModGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIGFwcGx5IGdsb2JhbCBjbGlja3Rocm91Z2ggdG8gYWxsIGl0ZW1zIG5vdCBzZXRcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wb2x5c3RhdERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBpZiAodGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5wb2x5c3RhdERhdGFbaW5kZXhdLmNsaWNrVGhyb3VnaCA9IHRoaXMuZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBmaWx0ZXIgb3V0IGJ5IGdsb2JhbERpc3BsYXlNb2RlXG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSB0aGlzLmZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUodGhpcy5wb2x5c3RhdERhdGEpO1xuICAgIC8vIG5vdyBzb3J0XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBfLm9yZGVyQnkoXG4gICAgICB0aGlzLnBvbHlzdGF0RGF0YSxcbiAgICAgIFt0aGlzLnBhbmVsLnBvbHlzdGF0LmhleGFnb25Tb3J0QnlGaWVsZF0sXG4gICAgICBbdGhpcy5wYW5lbC5wb2x5c3RhdC5oZXhhZ29uU29ydEJ5RGlyZWN0aW9uXSk7XG4gICAgLy8gZ2VuZXJhdGUgdG9vbHRpcHNcbiAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gVG9vbHRpcC5nZW5lcmF0ZSh0aGlzLiRzY29wZSwgdGhpcy5wb2x5c3RhdERhdGEsIHRoaXMucGFuZWwucG9seXN0YXQpO1xuICB9XG5cbiAgYXBwbHlHbG9iYWxGb3JtYXR0aW5nKGRhdGE6IGFueSkge1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsVW5pdEZvcm1hdF07XG4gICAgICBpZiAoZm9ybWF0RnVuYykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gR2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEZWNpbWFscyk7XG4gICAgICAgIGRhdGFbaW5kZXhdLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhW2luZGV4XS52YWx1ZSwgcmVzdWx0LmRlY2ltYWxzLCByZXN1bHQuc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICBkYXRhW2luZGV4XS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhW2luZGV4XS52YWx1ZSwgcmVzdWx0LmRlY2ltYWxzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIGZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUoZGF0YTogYW55KSB7XG4gICAgbGV0IGZpbHRlcmVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgbGV0IGNvbXBvc2l0ZU1ldHJpY3MgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICBpZiAodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSAhPT0gXCJhbGxcIikge1xuICAgICAgbGV0IGRhdGFMZW4gPSBkYXRhLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8ga2VlcCBpZiBjb21wb3NpdGVcbiAgICAgICAgaWYgKGl0ZW0uaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICBjb21wb3NpdGVNZXRyaWNzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgLy8gcHVzaCB0aGUgaW5kZXggbnVtYmVyXG4gICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZU1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIHNldCBkYXRhIHRvIGJlIGFsbCBvZiB0aGUgY29tcG9zaXRlc1xuICAgICAgICAgIGRhdGEgPSBjb21wb3NpdGVNZXRyaWNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB2YWx1ZUZvcm1hdHRlZDogMCxcbiAgICAgIHZhbHVlUm91bmRlZDogMFxuICAgIH07XG4gICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICBpbnZlcnRDb2xvck9yZGVyKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnBhbmVsLmNvbG9yc1swXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzJdID0gdG1wO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlZWQgbXVzdCBub3QgYmUgbGVzcyB0aGFuIDUwMG1zXG4gICAqL1xuICB2YWxpZGF0ZUFuaW1hdGlvblNwZWVkKCkge1xuICAgIGxldCBzcGVlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQ7XG4gICAgbGV0IG5ld1NwZWVkID0gNTAwMDtcbiAgICBpZiAoc3BlZWQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoc3BlZWQsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrU3BlZWQgPSBwYXJzZUludChzcGVlZCwgMTApO1xuICAgICAgICBpZiAoY2hlY2tTcGVlZCA+PSA1MDApIHtcbiAgICAgICAgICBuZXdTcGVlZCA9IGNoZWNrU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCA9IG5ld1NwZWVkO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZUNvbHVtblZhbHVlKCkge1xuICAgIGxldCBjb2x1bW5zID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zO1xuICAgIGxldCBuZXdDb2x1bW5zID0gMTtcbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChjb2x1bW5zLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0NvbHVtbnMgPSBwYXJzZUludChjb2x1bW5zLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0NvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgbmV3Q29sdW1ucyA9IGNoZWNrQ29sdW1ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMgPSBuZXdDb2x1bW5zO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJvd1ZhbHVlKCkge1xuICAgIGxldCByb3dzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzO1xuICAgIGxldCBuZXdSb3dzID0gMTtcbiAgICBpZiAocm93cykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyb3dzLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1Jvd3MgPSBwYXJzZUludChyb3dzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1Jvd3MgPiAwKSB7XG4gICAgICAgICAgbmV3Um93cyA9IGNoZWNrUm93cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MgPSBuZXdSb3dzO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJhZGl1c1ZhbHVlKCkge1xuICAgIGxldCByYWRpdXMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cztcbiAgICBsZXQgbmV3UmFkaXVzID0gMjU7XG4gICAgaWYgKHJhZGl1cyAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyYWRpdXMsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrUmFkaXVzID0gcGFyc2VJbnQocmFkaXVzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1JhZGl1cyA+IDApIHtcbiAgICAgICAgICBuZXdSYWRpdXMgPSBjaGVja1JhZGl1cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVCb3JkZXJTaXplVmFsdWUoKSB7XG4gICAgbGV0IGJvcmRlclNpemUgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplO1xuICAgIGxldCBuZXdCb3JkZXJTaXplID0gMjtcbiAgICBpZiAoYm9yZGVyU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChib3JkZXJTaXplLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0JvcmRlclNpemUgPSBwYXJzZUludChib3JkZXJTaXplLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0JvcmRlclNpemUgPj0gMCkge1xuICAgICAgICAgIG5ld0JvcmRlclNpemUgPSBjaGVja0JvcmRlclNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IG5ld0JvcmRlclNpemU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25Cb3JkZXJDb2xvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpIHtcbiAgICBsZXQgdXJsID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoO1xuICAgIGlmICgodXJsKSAmJiAodGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemUpKSB7XG4gICAgICB1cmwgPSB0aGlzLiRzYW5pdGl6ZSh1cmwpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgc2V0R2xvYmFsVW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxVbml0Rm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgfVxufVxuXG5cbmV4cG9ydCB7XG4gIEQzUG9seXN0YXRQYW5lbEN0cmwsXG4gIEQzUG9seXN0YXRQYW5lbEN0cmwgYXMgTWV0cmljc1BhbmVsQ3RybFxufTtcbiJdfQ==