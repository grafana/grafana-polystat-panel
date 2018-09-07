System.register(["app/plugins/sdk", "lodash", "jquery", "app/core/utils/kbn", "app/core/time_series2", "./css/polystat.css!", "./d3wrapper", "./transformers", "./metric_overrides_manager", "./composites_manager", "./tooltip"], function (exports_1, context_1) {
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
    var sdk_1, lodash_1, jquery_1, kbn_1, time_series2_1, d3wrapper_1, transformers_1, metric_overrides_manager_1, composites_manager_1, tooltip_1, D3PolystatPanelCtrl;
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
            }
        ],
        execute: function () {
            D3PolystatPanelCtrl = (function (_super) {
                __extends(D3PolystatPanelCtrl, _super);
                function D3PolystatPanelCtrl($scope, $injector, templateSrv, alertSrv, $sanitize) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$sanitize = $sanitize;
                    _this.panelDefaults = {
                        animationModes: [
                            { value: "all", text: "Show All" },
                            { value: "triggered", text: "Show Triggered" },
                        ],
                        displayModes: [
                            { value: "all", text: "Show All" },
                            { value: "triggered", text: "Show Triggered" },
                        ],
                        thresholdStates: [
                            { value: 0, text: "ok" },
                            { value: 1, text: "warning" },
                            { value: 2, text: "critical" },
                            { value: 3, text: "custom" }
                        ],
                        shapes: [
                            { value: "hexagon_pointed_top", text: "Hexagon Pointed Top" },
                            { value: "hexagon_flat_top", text: "Hexagon Flat Top" },
                            { value: "circle", text: "Circle" },
                            { value: "cross", text: "Cross" },
                            { value: "diamond", text: "Diamond" },
                            { value: "square", text: "Square" },
                            { value: "star", text: "Star" },
                            { value: "triangle", text: "Triangle" },
                            { value: "wye", text: "Wye" },
                        ],
                        savedComposites: [],
                        savedOverrides: [],
                        fontSizes: [
                            4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32,
                            34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
                            56, 58, 60, 62, 64, 66, 68, 70
                        ],
                        fontTypes: [
                            "Open Sans", "Arial", "Avant Garde", "Bookman",
                            "Consolas", "Courier", "Courier New", "Futura",
                            "Garamond", "Helvetica",
                            "Palatino", "Times", "Times New Roman",
                            "Verdana"
                        ],
                        unitFormats: kbn_1.default.getUnitFormats(),
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
                        operatorName: "avg",
                        colors: ["#299c46", "rgba(237, 129, 40, 0.89)", "#d44a3a"],
                        notcolors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
                        decimals: 2,
                        format: "none",
                        sortDirections: [
                            { value: "asc", text: "Ascending" },
                            { value: "desc", text: "Descending" },
                        ],
                        sortFields: [
                            { value: "name", text: "Name" },
                            { value: "thresholdLevel", text: "Threshold Level" },
                            { value: "value", text: "Value" },
                        ],
                        polystat: {
                            shape: "hexagon_pointed_top",
                            globalDisplayMode: "all",
                            globalOperatorName: "avg",
                            rows: "",
                            rowAutoSize: true,
                            columns: "",
                            columnAutoSize: true,
                            displayLimit: 100,
                            maxMetrics: 0,
                            radius: "",
                            radiusAutoSize: true,
                            tooltipFontSize: 12,
                            tooltipFontType: "Open Sans",
                            animationSpeed: 2500,
                            defaultClickThrough: "",
                            defaultClickThroughSanitize: true,
                            hexagonSortByDirection: "asc",
                            hexagonSortByField: "name",
                            polygonBorderSize: 2,
                            polygonBorderColor: "black",
                            tooltipDisplayMode: "all",
                            tooltipDisplayTextTriggeredEmpty: "OK",
                            tooltipPrimarySortDirection: "desc",
                            tooltipPrimarySortField: "thresholdLevel",
                            tooltipSecondarySortDirection: "desc",
                            tooltipSecondarySortField: "value",
                            tooltipTimestampEnabled: true,
                            fontSize: 12,
                            fontAutoScale: true,
                            gradientEnabled: true,
                        },
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.panel.d3DivId = "d3_svg_" + _this.panel.id;
                    _this.containerDivId = "container_" + _this.panel.d3DivId;
                    _this.alertSrvRef = alertSrv;
                    _this.initialized = false;
                    _this.panelContainer = null;
                    _this.templateSrv = templateSrv;
                    _this.panel.svgContainer = null;
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
                    this.panel.svgContainer = container;
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
                    if (jquery_1.default("#" + this.panel.d3DivId).length) {
                        jquery_1.default("#" + this.panel.d3DivId).remove();
                    }
                    if (jquery_1.default("#" + this.panel.d3DivId + "-panel").length) {
                        jquery_1.default("#" + this.panel.d3DivId + "-panel").remove();
                    }
                    if (jquery_1.default("#" + this.panel.d3DivId + "-tooltip").length) {
                        jquery_1.default("#" + this.panel.d3DivId + "-tooltip").remove();
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
                    this.d3Object = new d3wrapper_1.D3Wrapper(this.templateSrv, this.panel.svgContainer, this.panel.d3DivId, opt);
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
                D3PolystatPanelCtrl.templateUrl = "partials/template.html";
                return D3PolystatPanelCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("D3PolystatPanelCtrl", D3PolystatPanelCtrl);
            exports_1("MetricsPanelCtrl", D3PolystatPanelCtrl);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3RybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jdHJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFnQmtDLHVDQUFnQjtnQkE0SGhELDZCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVSxTQUFTO29CQUF2RSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0F3QnpCO29CQXpCNkQsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkF6SHZFLG1CQUFhLEdBQUc7d0JBQ2QsY0FBYyxFQUFFOzRCQUNkLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFOzRCQUNsQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO3lCQUMvQzt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7NEJBQ2xDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7eUJBQy9DO3dCQUNELGVBQWUsRUFBRTs0QkFDZixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTs0QkFDeEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7NEJBQzdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFOzRCQUM5QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTt5QkFDN0I7d0JBQ0QsTUFBTSxFQUFFOzRCQUNOLEVBQUUsS0FBSyxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRTs0QkFDN0QsRUFBRSxLQUFLLEVBQUUsa0JBQWtC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b0JBQ3ZELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO3dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTs0QkFDcEMsSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDL0MsSUFBSSxlQUFlLElBQUksQ0FBQyxFQUFFO2dDQUN4QixhQUFhLEdBQUcsZUFBZSxDQUFDOzZCQUNqQzt5QkFDRjtxQkFDRjtvQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUM7b0JBQ3RELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztnQkFFRCxzREFBd0IsR0FBeEI7b0JBQ0UsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixDQUFDO2dCQUVELG9EQUFzQixHQUF0QjtvQkFDRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsRUFBRTt3QkFDOUQsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzNCO29CQUNELE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBaGlCTSwrQkFBVyxHQUFHLHdCQUF3QixDQUFDO2dCQWlpQmhELDBCQUFDO2FBQUEsQUFsaUJELENBQWtDLHNCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuaW1wb3J0IHtNZXRyaWNzUGFuZWxDdHJsfSBmcm9tIFwiYXBwL3BsdWdpbnMvc2RrXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcblxuaW1wb3J0IFwiLi9jc3MvcG9seXN0YXQuY3NzIVwiO1xuaW1wb3J0IHsgRDNXcmFwcGVyIH0gZnJvbSBcIi4vZDN3cmFwcGVyXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm1lcnMgfSBmcm9tIFwiLi90cmFuc2Zvcm1lcnNcIjtcbmltcG9ydCB7IFBvbHlzdGF0TW9kZWwgfSBmcm9tIFwiLi9wb2x5c3RhdG1vZGVsXCI7XG5pbXBvcnQgeyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyIH0gZnJvbSBcIi4vbWV0cmljX292ZXJyaWRlc19tYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVzTWFuYWdlciB9IGZyb20gXCIuL2NvbXBvc2l0ZXNfbWFuYWdlclwiO1xuaW1wb3J0IHsgVG9vbHRpcCB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcblxuXG5jbGFzcyBEM1BvbHlzdGF0UGFuZWxDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZVVybCA9IFwicGFydGlhbHMvdGVtcGxhdGUuaHRtbFwiO1xuXG4gIHBhbmVsRGVmYXVsdHMgPSB7XG4gICAgYW5pbWF0aW9uTW9kZXM6IFtcbiAgICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH0sXG4gICAgXSxcbiAgICBkaXNwbGF5TW9kZXM6IFtcbiAgICAgIHsgdmFsdWU6IFwiYWxsXCIsIHRleHQ6IFwiU2hvdyBBbGxcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJ0cmlnZ2VyZWRcIiwgdGV4dDogXCJTaG93IFRyaWdnZXJlZFwiIH0sXG4gICAgXSxcbiAgICB0aHJlc2hvbGRTdGF0ZXM6IFtcbiAgICAgIHsgdmFsdWU6IDAsIHRleHQ6IFwib2tcIiB9LFxuICAgICAgeyB2YWx1ZTogMSwgdGV4dDogXCJ3YXJuaW5nXCIgfSxcbiAgICAgIHsgdmFsdWU6IDIsIHRleHQ6IFwiY3JpdGljYWxcIiB9LFxuICAgICAgeyB2YWx1ZTogMywgdGV4dDogXCJjdXN0b21cIiB9XG4gICAgXSxcbiAgICBzaGFwZXM6IFtcbiAgICAgIHsgdmFsdWU6IFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiLCB0ZXh0OiBcIkhleGFnb24gUG9pbnRlZCBUb3BcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJoZXhhZ29uX2ZsYXRfdG9wXCIsIHRleHQ6IFwiSGV4YWdvbiBGbGF0IFRvcFwiIH0sXG4gICAgICB7IHZhbHVlOiBcImNpcmNsZVwiLCB0ZXh0OiBcIkNpcmNsZVwiIH0sXG4gICAgICB7IHZhbHVlOiBcImNyb3NzXCIsIHRleHQ6IFwiQ3Jvc3NcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJkaWFtb25kXCIsIHRleHQ6IFwiRGlhbW9uZFwiIH0sXG4gICAgICB7IHZhbHVlOiBcInNxdWFyZVwiLCB0ZXh0OiBcIlNxdWFyZVwiIH0sXG4gICAgICB7IHZhbHVlOiBcInN0YXJcIiwgdGV4dDogXCJTdGFyXCIgfSxcbiAgICAgIHsgdmFsdWU6IFwidHJpYW5nbGVcIiwgdGV4dDogXCJUcmlhbmdsZVwiIH0sXG4gICAgICB7IHZhbHVlOiBcInd5ZVwiLCB0ZXh0OiBcIld5ZVwiIH0sXG4gICAgXSxcbiAgICBzYXZlZENvbXBvc2l0ZXMgOiBbXSxcbiAgICBzYXZlZE92ZXJyaWRlcyA6IFtdLFxuICAgIGZvbnRTaXplczogW1xuICAgICAgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiAsIDEzLCAxNCwgMTUsXG4gICAgICAxNiwgMTcsIDE4LCAxOSwgMjAsIDIyLCAyNCwgMjYsIDI4LCAzMCwgMzIsXG4gICAgICAzNCwgMzYsIDM4LCA0MCwgNDIsIDQ0LCA0NiwgNDgsIDUwLCA1MiwgNTQsXG4gICAgICA1NiwgNTgsIDYwLCA2MiwgNjQsIDY2LCA2OCwgNzBdLFxuICAgIGZvbnRUeXBlczogW1xuICAgICAgXCJPcGVuIFNhbnNcIiwgXCJBcmlhbFwiLCBcIkF2YW50IEdhcmRlXCIsIFwiQm9va21hblwiLFxuICAgICAgXCJDb25zb2xhc1wiLCBcIkNvdXJpZXJcIiwgXCJDb3VyaWVyIE5ld1wiLCBcIkZ1dHVyYVwiLFxuICAgICAgXCJHYXJhbW9uZFwiLCBcIkhlbHZldGljYVwiLFxuICAgICAgXCJQYWxhdGlub1wiLCBcIlRpbWVzXCIsIFwiVGltZXMgTmV3IFJvbWFuXCIsXG4gICAgICBcIlZlcmRhbmFcIlxuICAgIF0sXG4gICAgdW5pdEZvcm1hdHM6IGtibi5nZXRVbml0Rm9ybWF0cygpLFxuICAgIG9wZXJhdG9yT3B0aW9uczogW1xuICAgICAgeyB2YWx1ZTogXCJhdmdcIiwgdGV4dDogXCJBdmVyYWdlXCIgfSxcbiAgICAgIHsgdmFsdWU6IFwiY291bnRcIiwgdGV4dDogXCJDb3VudFwiIH0sXG4gICAgICB7IHZhbHVlOiBcImN1cnJlbnRcIiwgdGV4dDogXCJDdXJyZW50XCIgfSxcbiAgICAgIHsgdmFsdWU6IFwiZGVsdGFcIiwgdGV4dDogXCJEZWx0YVwiIH0sXG4gICAgICB7IHZhbHVlOiBcImRpZmZcIiwgdGV4dDogXCJEaWZmZXJlbmNlXCIgfSxcbiAgICAgIHsgdmFsdWU6IFwiZmlyc3RcIiwgdGV4dDogXCJGaXJzdFwiIH0sXG4gICAgICB7IHZhbHVlOiBcImxvZ21pblwiLCB0ZXh0OiBcIkxvZyBNaW5cIiB9LFxuICAgICAgeyB2YWx1ZTogXCJtYXhcIiwgdGV4dDogXCJNYXhcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJtaW5cIiwgdGV4dDogXCJNaW5cIiB9LFxuICAgICAgeyB2YWx1ZTogXCJuYW1lXCIsIHRleHQ6IFwiTmFtZVwiIH0sXG4gICAgICB7IHZhbHVlOiBcImxhc3RfdGltZVwiLCB0ZXh0OiBcIlRpbWUgb2YgTGFzdCBQb2ludFwiIH0sXG4gICAgICB7IHZhbHVlOiBcInRpbWVfc3RlcFwiLCB0ZXh0OiBcIlRpbWUgU3RlcFwiIH0sXG4gICAgICB7IHZhbHVlOiBcInRvdGFsXCIsIHRleHQ6IFwiVG90YWxcIiB9LFxuICAgIF0sXG4gICAgb3BlcmF0b3JOYW1lOiBcImF2Z1wiLCAvLyBvcGVyYXRvciBhcHBsaWVkIHRvIHRpbWUgc2VyaWVzXG4gICAgY29sb3JzOiBbXCIjMjk5YzQ2XCIsIFwicmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpXCIsIFwiI2Q0NGEzYVwiXSxcbiAgICBub3Rjb2xvcnM6IFtcInJnYmEoMjQ1LCA1NCwgNTQsIDAuOSlcIiwgXCJyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSlcIiwgXCJyZ2JhKDUwLCAxNzIsIDQ1LCAwLjk3KVwiXSxcbiAgICBkZWNpbWFsczogMiwgLy8gZGVjaW1hbCBwcmVjaXNpb25cbiAgICBmb3JtYXQ6IFwibm9uZVwiLCAvLyB1bml0IGZvcm1hdFxuICAgIHNvcnREaXJlY3Rpb25zOiBbXG4gICAgICB7IHZhbHVlOiBcImFzY1wiLCB0ZXh0OiBcIkFzY2VuZGluZ1wiIH0sXG4gICAgICB7IHZhbHVlOiBcImRlc2NcIiwgdGV4dDogXCJEZXNjZW5kaW5nXCIgfSxcbiAgICBdLFxuICAgIHNvcnRGaWVsZHM6IFtcbiAgICAgIHsgdmFsdWU6IFwibmFtZVwiLCB0ZXh0OiBcIk5hbWVcIiB9LFxuICAgICAgeyB2YWx1ZTogXCJ0aHJlc2hvbGRMZXZlbFwiLCB0ZXh0OiBcIlRocmVzaG9sZCBMZXZlbFwiIH0sXG4gICAgICB7IHZhbHVlOiBcInZhbHVlXCIsIHRleHQ6IFwiVmFsdWVcIiB9LFxuICAgIF0sXG4gICAgcG9seXN0YXQ6IHtcbiAgICAgIHNoYXBlOiBcImhleGFnb25fcG9pbnRlZF90b3BcIixcbiAgICAgIGdsb2JhbERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgZ2xvYmFsT3BlcmF0b3JOYW1lOiBcImF2Z1wiLFxuICAgICAgcm93czogXCJcIixcbiAgICAgIHJvd0F1dG9TaXplOiB0cnVlLFxuICAgICAgY29sdW1uczogXCJcIixcbiAgICAgIGNvbHVtbkF1dG9TaXplOiB0cnVlLFxuICAgICAgZGlzcGxheUxpbWl0OiAxMDAsXG4gICAgICBtYXhNZXRyaWNzOiAwLFxuICAgICAgcmFkaXVzOiBcIlwiLFxuICAgICAgcmFkaXVzQXV0b1NpemU6IHRydWUsXG4gICAgICB0b29sdGlwRm9udFNpemU6IDEyLFxuICAgICAgdG9vbHRpcEZvbnRUeXBlOiBcIk9wZW4gU2Fuc1wiLFxuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MDAsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoOiBcIlwiLFxuICAgICAgZGVmYXVsdENsaWNrVGhyb3VnaFNhbml0aXplOiB0cnVlLFxuICAgICAgaGV4YWdvblNvcnRCeURpcmVjdGlvbjogXCJhc2NcIixcbiAgICAgIGhleGFnb25Tb3J0QnlGaWVsZDogXCJuYW1lXCIsXG4gICAgICBwb2x5Z29uQm9yZGVyU2l6ZTogMixcbiAgICAgIHBvbHlnb25Cb3JkZXJDb2xvcjogXCJibGFja1wiLFxuICAgICAgdG9vbHRpcERpc3BsYXlNb2RlOiBcImFsbFwiLFxuICAgICAgdG9vbHRpcERpc3BsYXlUZXh0VHJpZ2dlcmVkRW1wdHk6IFwiT0tcIixcbiAgICAgIHRvb2x0aXBQcmltYXJ5U29ydERpcmVjdGlvbjogXCJkZXNjXCIsXG4gICAgICB0b29sdGlwUHJpbWFyeVNvcnRGaWVsZDogXCJ0aHJlc2hvbGRMZXZlbFwiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnREaXJlY3Rpb246IFwiZGVzY1wiLFxuICAgICAgdG9vbHRpcFNlY29uZGFyeVNvcnRGaWVsZDogXCJ2YWx1ZVwiLFxuICAgICAgdG9vbHRpcFRpbWVzdGFtcEVuYWJsZWQ6IHRydWUsXG4gICAgICBmb250U2l6ZTogMTIsXG4gICAgICBmb250QXV0b1NjYWxlOiB0cnVlLFxuICAgICAgZ3JhZGllbnRFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gIH07XG5cbiAgZGF0YVJhdyA6IGFueTtcbiAgcG9seXN0YXREYXRhOiBQb2x5c3RhdE1vZGVsW107XG4gIGNvbnRhaW5lckRpdklkOiBhbnk7XG4gIHNjb3BlcmVmOiBhbnk7XG4gIGFsZXJ0U3J2UmVmOiBhbnk7XG4gIGluaXRpYWxpemVkOiBib29sZWFuO1xuICBwYW5lbENvbnRhaW5lcjogYW55O1xuICBwYW5lbFdpZHRoOiBhbnk7XG4gIHBhbmVsSGVpZ2h0OiBhbnk7XG4gIGQzT2JqZWN0OiBEM1dyYXBwZXI7XG4gIGRhdGE6IGFueTtcbiAgc2VyaWVzOiBhbnlbXTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgb3ZlcnJpZGVzQ3RybDogTWV0cmljT3ZlcnJpZGVzTWFuYWdlcjtcbiAgY29tcG9zaXRlc01hbmFnZXIgOiBDb21wb3NpdGVzTWFuYWdlcjtcbiAgdG9vbHRpcENvbnRlbnQ6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCB0ZW1wbGF0ZVNydiwgYWxlcnRTcnYsIHByaXZhdGUgJHNhbml0aXplKSB7XG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xuICAgIC8vIG1lcmdlIGV4aXN0aW5nIHNldHRpbmdzIHdpdGggb3VyIGRlZmF1bHRzXG4gICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCB0aGlzLnBhbmVsRGVmYXVsdHMpO1xuICAgIHRoaXMucGFuZWwuZDNEaXZJZCA9IFwiZDNfc3ZnX1wiICsgdGhpcy5wYW5lbC5pZDtcbiAgICB0aGlzLmNvbnRhaW5lckRpdklkID0gXCJjb250YWluZXJfXCIgKyB0aGlzLnBhbmVsLmQzRGl2SWQ7XG4gICAgdGhpcy5hbGVydFNydlJlZiA9IGFsZXJ0U3J2O1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBhbmVsQ29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5wYW5lbC5zdmdDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMucGFuZWxXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5wYW5lbEhlaWdodCA9IG51bGw7XG4gICAgdGhpcy5wb2x5c3RhdERhdGEgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICB0aGlzLmQzT2JqZWN0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnNlcmllcyA9IFtdO1xuICAgIHRoaXMucG9seXN0YXREYXRhID0gW107XG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFtdO1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybCA9IG5ldyBNZXRyaWNPdmVycmlkZXNNYW5hZ2VyKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgdGhpcy5wYW5lbC5zYXZlZE92ZXJyaWRlcyk7XG4gICAgdGhpcy5jb21wb3NpdGVzTWFuYWdlciA9IG5ldyBDb21wb3NpdGVzTWFuYWdlcigkc2NvcGUsIHRlbXBsYXRlU3J2LCAkc2FuaXRpemUsIHRoaXMucGFuZWwuc2F2ZWRDb21wb3NpdGVzKTtcbiAgICB0aGlzLmV2ZW50cy5vbihcImluaXQtZWRpdC1tb2RlXCIsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXJlY2VpdmVkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLWVycm9yXCIsIHRoaXMub25EYXRhRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXNuYXBzaG90LWxvYWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG5cbiAgb25Jbml0RWRpdE1vZGUoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBwYXRoIHRvIHRoaXMgcGx1Z2luIGJhc2Ugb24gdGhlIG5hbWUgZm91bmQgaW4gcGFuZWwudHlwZVxuICAgIHZhciB0aGlzUGFuZWxQYXRoID0gXCJwdWJsaWMvcGx1Z2lucy9cIiArIHRoaXMucGFuZWwudHlwZSArIFwiL1wiO1xuICAgIC8vIGFkZCB0aGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgcGFydGlhbFxuICAgIHZhciBvcHRpb25zUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5vcHRpb25zLmh0bWxcIjtcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIk9wdGlvbnNcIiwgb3B0aW9uc1BhdGgsIDIpO1xuICAgIHZhciBvdmVycmlkZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLm92ZXJyaWRlcy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJPdmVycmlkZXNcIiwgb3ZlcnJpZGVzUGF0aCwgMyk7XG4gICAgdmFyIGNvbXBvc2l0ZXNQYXRoID0gdGhpc1BhbmVsUGF0aCArIFwicGFydGlhbHMvZWRpdG9yLmNvbXBvc2l0ZXMuaHRtbFwiO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiQ29tcG9zaXRlc1wiLCBjb21wb3NpdGVzUGF0aCwgNCk7XG4gICAgdmFyIG1hcHBpbmdzUGF0aCA9IHRoaXNQYW5lbFBhdGggKyBcInBhcnRpYWxzL2VkaXRvci5tYXBwaW5ncy5odG1sXCI7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoXCJWYWx1ZSBNYXBwaW5nc1wiLCBtYXBwaW5nc1BhdGgsIDUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFtzZXRDb250YWluZXIgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSB7W3R5cGVdfSBjb250YWluZXIgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc2V0Q29udGFpbmVyKGNvbnRhaW5lcikge1xuICAgIHRoaXMucGFuZWxDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5wYW5lbC5zdmdDb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGEgcGFuZWwgYnkgdGhlIHNwYW4gYW5kIHZpZXdwb3J0XG4gIC8vIHRoZSBsaW5rIGVsZW1lbnQgb2JqZWN0IGNhbiBiZSB1c2VkIHRvIGdldCB0aGUgd2lkdGggbW9yZSByZWxpYWJseVxuICBnZXRQYW5lbFdpZHRoRmFpbHNhZmUoKSB7XG4gICAgdmFyIHRydWVXaWR0aCA9IDA7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLmdyaWRQb3MgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIDI0IHNsb3RzIGlzIGZ1bGxzY3JlZW4sIGdldCB0aGUgdmlld3BvcnQgYW5kIGRpdmlkZSB0byBhcHByb3hpbWF0ZSB0aGUgd2lkdGhcbiAgICAgIGxldCB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJTbG90ID0gdmlld1BvcnRXaWR0aCAvIDI0O1xuICAgICAgdHJ1ZVdpZHRoID0gTWF0aC5yb3VuZCh0aGlzLnBhbmVsLmdyaWRQb3MudyAqIHBpeGVsc1BlclNsb3QpO1xuICAgICAgcmV0dXJuIHRydWVXaWR0aDtcbiAgICB9XG4gICAgLy8gZ3JhZmFuYTUgLSB1c2UgdGhpcy5wYW5lbC5ncmlkUG9zLncsIHRoaXMucGFuZWwuZ3JpZFBvcy5oXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIGNoZWNrIGlmIGluc2lkZSBlZGl0IG1vZGVcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlSW5pdGlhdGVkKSB7XG4gICAgICAgIC8vIHdpZHRoIGlzIGNsaWVudFdpZHRoIG9mIGRvY3VtZW50XG4gICAgICAgIHRydWVXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0IHRoZSB3aWR0aCBiYXNlZCBvbiB0aGUgc2NhbGVkIGNvbnRhaW5lciAodjUgbmVlZHMgdGhpcylcbiAgICAgICAgdHJ1ZVdpZHRoID0gdGhpcy5wYW5lbENvbnRhaW5lci5vZmZzZXRQYXJlbnQuY2xpZW50V2lkdGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHY0IGFuZCBwcmV2aW91cyB1c2VkIGZpeGVkIHNwYW5zXG4gICAgICB2YXIgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICAvLyBnZXQgdGhlIHBpeGVscyBvZiBhIHNwYW5cbiAgICAgIHZhciBwaXhlbHNQZXJTcGFuID0gdmlld1BvcnRXaWR0aCAvIDEyO1xuICAgICAgLy8gbXVsdGlwbHkgbnVtIHNwYW5zIGJ5IHBpeGVsc1BlclNwYW5cbiAgICAgIHRydWVXaWR0aCA9IE1hdGgucm91bmQodGhpcy5wYW5lbC5zcGFuICogcGl4ZWxzUGVyU3Bhbik7XG4gICAgfVxuICAgIHJldHVybiB0cnVlV2lkdGg7XG4gIH1cblxuICBnZXRQYW5lbEhlaWdodCgpIHtcbiAgICAvLyBwYW5lbCBjYW4gaGF2ZSBhIGZpeGVkIGhlaWdodCBzZXQgdmlhIFwiR2VuZXJhbFwiIHRhYiBpbiBwYW5lbCBlZGl0b3JcbiAgICB2YXIgdG1wUGFuZWxIZWlnaHQgPSB0aGlzLnBhbmVsLmhlaWdodDtcbiAgICBpZiAoKHR5cGVvZiB0bXBQYW5lbEhlaWdodCA9PT0gXCJ1bmRlZmluZWRcIikgfHwgKHRtcFBhbmVsSGVpZ2h0ID09PSBcIlwiKSkge1xuICAgICAgLy8gZ3JhZmFuYSBhbHNvIHN1cHBsaWVzIHRoZSBoZWlnaHQsIHRyeSB0byB1c2UgdGhhdCBpZiB0aGUgcGFuZWwgZG9lcyBub3QgaGF2ZSBhIGhlaWdodFxuICAgICAgdG1wUGFuZWxIZWlnaHQgPSBTdHJpbmcodGhpcy5oZWlnaHQpO1xuICAgICAgLy8gdjQgYW5kIGVhcmxpZXIgZGVmaW5lIHRoaXMgaGVpZ2h0LCBkZXRlY3Qgc3BhbiBmb3IgcHJlLXY1XG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuc3BhbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBoZWFkZXIsIGFkanVzdCBoZWlnaHQgdG8gdXNlIGFsbCBzcGFjZSBhdmFpbGFibGVcbiAgICAgICAgdmFyIHBhbmVsVGl0bGVPZmZzZXQgPSAyMDtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwudGl0bGUgIT09IFwiXCIpIHtcbiAgICAgICAgICBwYW5lbFRpdGxlT2Zmc2V0ID0gNDI7XG4gICAgICAgIH1cbiAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSBTdHJpbmcodGhpcy5jb250YWluZXJIZWlnaHQgLSBwYW5lbFRpdGxlT2Zmc2V0KTsgLy8gb2Zmc2V0IGZvciBoZWFkZXJcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gaGVpZ2h0IHN0aWxsIGNhbm5vdCBiZSBkZXRlcm1pbmVkLCBnZXQgaXQgZnJvbSB0aGUgcm93IGluc3RlYWRcbiAgICAgICAgdG1wUGFuZWxIZWlnaHQgPSB0aGlzLnJvdy5oZWlnaHQ7XG4gICAgICAgIGlmICh0eXBlb2YgdG1wUGFuZWxIZWlnaHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAvLyBsYXN0IHJlc29ydCAtIGRlZmF1bHQgdG8gMjUwcHggKHRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbilcbiAgICAgICAgICB0bXBQYW5lbEhlaWdodCA9IFwiMjUwXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcmVwbGFjZSBweFxuICAgIHRtcFBhbmVsSGVpZ2h0ID0gdG1wUGFuZWxIZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpO1xuICAgIC8vIGNvbnZlcnQgdG8gbnVtZXJpYyB2YWx1ZVxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSBwYXJzZUludCh0bXBQYW5lbEhlaWdodCwgMTApO1xuICAgIHJldHVybiBhY3R1YWxIZWlnaHQ7XG4gIH1cblxuICBjbGVhclNWRygpIHtcbiAgICBpZiAoJChcIiNcIiArIHRoaXMucGFuZWwuZDNEaXZJZCkubGVuZ3RoKSB7XG4gICAgICAkKFwiI1wiICsgdGhpcy5wYW5lbC5kM0RpdklkKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLnBhbmVsLmQzRGl2SWQgKyBcIi1wYW5lbFwiKS5sZW5ndGgpIHtcbiAgICAgICQoXCIjXCIgKyB0aGlzLnBhbmVsLmQzRGl2SWQgKyBcIi1wYW5lbFwiKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgaWYgKCQoXCIjXCIgKyB0aGlzLnBhbmVsLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpLmxlbmd0aCkge1xuICAgICAgJChcIiNcIiArIHRoaXMucGFuZWwuZDNEaXZJZCArIFwiLXRvb2x0aXBcIikucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRDMoKSB7XG4gICAgdGhpcy5zZXRWYWx1ZXModGhpcy5kYXRhKTtcbiAgICB0aGlzLmNsZWFyU1ZHKCk7XG4gICAgaWYgKHRoaXMucGFuZWxXaWR0aCA9PT0gMCkge1xuICAgICAgdGhpcy5wYW5lbFdpZHRoID0gdGhpcy5nZXRQYW5lbFdpZHRoRmFpbHNhZmUoKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbEhlaWdodCA9IHRoaXMuZ2V0UGFuZWxIZWlnaHQoKTtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMH07XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYW5lbFdpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhbmVsSGVpZ2h0O1xuXG4gICAgbWFyZ2luLnRvcCA9IDA7XG4gICAgLy8gcHJlLXY1LCB3aXRoIHRpdGxlLCBzZXQgdG9wIG1hcmdpbiB0byBhdCBsZWFzdCA3cHhcbiAgICBpZiAoKHR5cGVvZiB0aGlzLnBhbmVsLnNwYW4gIT09IFwidW5kZWZpbmVkXCIpICYmICh0aGlzLnBhbmVsLnRpdGxlICE9PSBcIlwiKSkge1xuICAgICAgbWFyZ2luLnRvcCA9IDc7XG4gICAgfVxuICAgIG1hcmdpbi5ib3R0b20gPSAwO1xuXG4gICAgLy8gbmV3IGF0dHJpYnV0ZXMgbWF5IG5vdCBiZSBkZWZpbmVkIGluIG9sZGVyIHBhbmVsIGRlZmluaXRpb25zXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplID0gMjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgfVxuXG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgcmFkaXVzIDogdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXMsXG4gICAgICByYWRpdXNBdXRvU2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5yYWRpdXNBdXRvU2l6ZSxcbiAgICAgIHRvb2x0aXBGb250U2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC50b29sdGlwRm9udFNpemUsXG4gICAgICB0b29sdGlwRm9udFR5cGU6IHRoaXMucGFuZWwucG9seXN0YXQudG9vbHRpcEZvbnRUeXBlLFxuICAgICAgZGF0YTogdGhpcy5wb2x5c3RhdERhdGEsXG4gICAgICBkaXNwbGF5TGltaXQ6IHRoaXMucGFuZWwucG9seXN0YXQuZGlzcGxheUxpbWl0LFxuICAgICAgZ2xvYmFsRGlzcGxheU1vZGU6IHRoaXMucGFuZWwucG9seXN0YXQuZ2xvYmFsRGlzcGxheU1vZGUsXG4gICAgICBjb2x1bW5zOiB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMsXG4gICAgICBjb2x1bW5BdXRvU2l6ZTogdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5BdXRvU2l6ZSxcbiAgICAgIHJvd3M6IHRoaXMucGFuZWwucG9seXN0YXQucm93cyxcbiAgICAgIHJvd0F1dG9TaXplIDogdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dBdXRvU2l6ZSxcbiAgICAgIHRvb2x0aXBDb250ZW50OiB0aGlzLnRvb2x0aXBDb250ZW50LFxuICAgICAgYW5pbWF0aW9uU3BlZWQ6IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQsXG4gICAgICBkZWZhdWx0Q2xpY2tUaHJvdWdoOiB0aGlzLmdldERlZmF1bHRDbGlja1Rocm91Z2goKSxcbiAgICAgIHBvbHlzdGF0OiB0aGlzLnBhbmVsLnBvbHlzdGF0LFxuICAgIH07XG4gICAgdGhpcy5kM09iamVjdCA9IG5ldyBEM1dyYXBwZXIodGhpcy50ZW1wbGF0ZVNydiwgdGhpcy5wYW5lbC5zdmdDb250YWluZXIsIHRoaXMucGFuZWwuZDNEaXZJZCwgb3B0KTtcbiAgICB0aGlzLmQzT2JqZWN0LmRyYXcoKTtcbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHt2YWx1ZTogXCJcIiwgb3A6IFwiPVwiLCB0ZXh0OiBcIlwiIH0pO1xuICB9XG5cbiAgcmVtb3ZlUmFuZ2VNYXAocmFuZ2VNYXApIHtcbiAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YodGhpcy5wYW5lbC5yYW5nZU1hcHMsIHJhbmdlTWFwKTtcbiAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRSYW5nZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5wdXNoKHtmcm9tOiBcIlwiLCB0bzogXCJcIiwgdGV4dDogXCJcIn0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWF0dHJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBkM0J5Q2xhc3MgPSBlbGVtLmZpbmQoXCIuZ3JhZmFuYS1kMy1wb2x5c3RhdFwiKTtcbiAgICBkM0J5Q2xhc3MuYXBwZW5kKFwiPGRpdiBpZD1cXFwiXCIgKyBjdHJsLmNvbnRhaW5lckRpdklkICsgXCJcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgY29udGFpbmVyID0gZDNCeUNsYXNzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgY3RybC5zZXRDb250YWluZXIoY29udGFpbmVyKTtcblxuICAgIGVsZW0gPSBlbGVtLmZpbmQoXCIuZ3JhZmFuYS1kMy1wb2x5c3RhdFwiKTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIC8vIHRyeSB0byBnZXQgdGhlIHdpZHRoXG4gICAgICBjdHJsLnBhbmVsV2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIGN0cmwucmVuZGVyRDMoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudHMub24oXCJyZW5kZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAvLyB0cnkgdG8gZ2V0IHRoZSB3aWR0aFxuICAgICAgY3RybC5wYW5lbFdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRWYWx1ZXMoZGF0YUxpc3QpIHtcbiAgICB0aGlzLmRhdGFSYXcgPSBkYXRhTGlzdDtcbiAgICAvLyBhdXRvbWF0aWNhbGx5IGNvcnJlY3QgdHJhbnNmb3JtIG1vZGUgYmFzZWQgb24gZGF0YVxuICAgIGlmICh0aGlzLmRhdGFSYXcgJiYgdGhpcy5kYXRhUmF3Lmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuZGF0YVJhd1swXS50eXBlID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcInRhYmxlXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5kYXRhUmF3WzBdLnR5cGUgPT09IFwiZG9jc1wiKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbC50cmFuc2Zvcm0gPSBcImpzb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbC50cmFuc2Zvcm0gPT09IFwidGFibGVcIiB8fCB0aGlzLnBhbmVsLnRyYW5zZm9ybSA9PT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIHRoaXMucGFuZWwudHJhbnNmb3JtID0gXCJ0aW1lc2VyaWVzX3RvX3Jvd3NcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWdub3JlIHRoZSBhYm92ZSBhbmQgdXNlIGEgdGltZXNlcmllc1xuICAgIHRoaXMucG9seXN0YXREYXRhLmxlbmd0aCA9IDA7XG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNlcmllcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGFTZXJpZXMgPSB0aGlzLnNlcmllc1tpbmRleF07XG4gICAgICAgIGxldCBjb252ZXJ0ZWQgPSBUcmFuc2Zvcm1lcnMuVGltZVNlcmllc1RvUG9seXN0YXQodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxPcGVyYXRvck5hbWUsIGFTZXJpZXMpO1xuICAgICAgICB0aGlzLnBvbHlzdGF0RGF0YS5wdXNoKGNvbnZlcnRlZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFwcGx5IG92ZXJyaWRlc1xuICAgIHRoaXMub3ZlcnJpZGVzQ3RybC5hcHBseU92ZXJyaWRlcyh0aGlzLnBvbHlzdGF0RGF0YSk7XG4gICAgLy8gYXBwbHkgY29tcG9zaXRlcywgdGhpcyB3aWxsIGZpbHRlciBhcyBuZWVkZWQgYW5kIHNldCBjbGlja3Rocm91Z2hcbiAgICB0aGlzLnBvbHlzdGF0RGF0YSA9IHRoaXMuY29tcG9zaXRlc01hbmFnZXIuYXBwbHlDb21wb3NpdGVzKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBhcHBseSBnbG9iYWwgY2xpY2t0aHJvdWdoIHRvIGFsbCBpdGVtcyBub3Qgc2V0XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucG9seXN0YXREYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgaWYgKHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5jbGlja1Rocm91Z2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucG9seXN0YXREYXRhW2luZGV4XS5jbGlja1Rocm91Z2ggPSB0aGlzLmdldERlZmF1bHRDbGlja1Rocm91Z2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZmlsdGVyIG91dCBieSBnbG9iYWxEaXNwbGF5TW9kZVxuICAgIHRoaXMucG9seXN0YXREYXRhID0gdGhpcy5maWx0ZXJCeUdsb2JhbERpc3BsYXlNb2RlKHRoaXMucG9seXN0YXREYXRhKTtcbiAgICAvLyBub3cgc29ydFxuICAgIHRoaXMucG9seXN0YXREYXRhID0gXy5vcmRlckJ5KFxuICAgICAgdGhpcy5wb2x5c3RhdERhdGEsXG4gICAgICBbdGhpcy5wYW5lbC5wb2x5c3RhdC5oZXhhZ29uU29ydEJ5RmllbGRdLFxuICAgICAgW3RoaXMucGFuZWwucG9seXN0YXQuaGV4YWdvblNvcnRCeURpcmVjdGlvbl0pO1xuICAgIC8vIGdlbmVyYXRlIHRvb2x0aXBzXG4gICAgdGhpcy50b29sdGlwQ29udGVudCA9IFRvb2x0aXAuZ2VuZXJhdGUodGhpcy4kc2NvcGUsIHRoaXMucG9seXN0YXREYXRhLCB0aGlzLnBhbmVsLnBvbHlzdGF0KTtcbiAgfVxuXG4gIGZpbHRlckJ5R2xvYmFsRGlzcGxheU1vZGUoZGF0YTogYW55KSB7XG4gICAgbGV0IGZpbHRlcmVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgbGV0IGNvbXBvc2l0ZU1ldHJpY3MgPSBuZXcgQXJyYXk8UG9seXN0YXRNb2RlbD4oKTtcbiAgICBpZiAodGhpcy5wYW5lbC5wb2x5c3RhdC5nbG9iYWxEaXNwbGF5TW9kZSAhPT0gXCJhbGxcIikge1xuICAgICAgbGV0IGRhdGFMZW4gPSBkYXRhLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8ga2VlcCBpZiBjb21wb3NpdGVcbiAgICAgICAgaWYgKGl0ZW0uaXNDb21wb3NpdGUpIHtcbiAgICAgICAgICBjb21wb3NpdGVNZXRyaWNzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgLy8gcHVzaCB0aGUgaW5kZXggbnVtYmVyXG4gICAgICAgICAgZmlsdGVyZWRNZXRyaWNzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmaWx0ZXJlZCBtZXRyaWNzLCB1c2Ugc3BsaWNlIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoZmlsdGVyZWRNZXRyaWNzLCBpKSkge1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGNvbXBvc2l0ZU1ldHJpY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIHNldCBkYXRhIHRvIGJlIGFsbCBvZiB0aGUgY29tcG9zaXRlc1xuICAgICAgICAgIGRhdGEgPSBjb21wb3NpdGVNZXRyaWNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB2YWx1ZUZvcm1hdHRlZDogMCxcbiAgICAgIHZhbHVlUm91bmRlZDogMFxuICAgIH07XG4gICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICBpbnZlcnRDb2xvck9yZGVyKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnBhbmVsLmNvbG9yc1swXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgIHRoaXMucGFuZWwuY29sb3JzWzJdID0gdG1wO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlZWQgbXVzdCBub3QgYmUgbGVzcyB0aGFuIDUwMG1zXG4gICAqL1xuICB2YWxpZGF0ZUFuaW1hdGlvblNwZWVkKCkge1xuICAgIGxldCBzcGVlZCA9IHRoaXMucGFuZWwucG9seXN0YXQuYW5pbWF0aW9uU3BlZWQ7XG4gICAgbGV0IG5ld1NwZWVkID0gNTAwMDtcbiAgICBpZiAoc3BlZWQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQoc3BlZWQsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrU3BlZWQgPSBwYXJzZUludChzcGVlZCwgMTApO1xuICAgICAgICBpZiAoY2hlY2tTcGVlZCA+PSA1MDApIHtcbiAgICAgICAgICBuZXdTcGVlZCA9IGNoZWNrU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5hbmltYXRpb25TcGVlZCA9IG5ld1NwZWVkO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZUNvbHVtblZhbHVlKCkge1xuICAgIGxldCBjb2x1bW5zID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5jb2x1bW5zO1xuICAgIGxldCBuZXdDb2x1bW5zID0gMTtcbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChjb2x1bW5zLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0NvbHVtbnMgPSBwYXJzZUludChjb2x1bW5zLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0NvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgbmV3Q29sdW1ucyA9IGNoZWNrQ29sdW1ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LmNvbHVtbnMgPSBuZXdDb2x1bW5zO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJvd1ZhbHVlKCkge1xuICAgIGxldCByb3dzID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5yb3dzO1xuICAgIGxldCBuZXdSb3dzID0gMTtcbiAgICBpZiAocm93cykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyb3dzLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja1Jvd3MgPSBwYXJzZUludChyb3dzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1Jvd3MgPiAwKSB7XG4gICAgICAgICAgbmV3Um93cyA9IGNoZWNrUm93cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJvd3MgPSBuZXdSb3dzO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB2YWxpZGF0ZVJhZGl1c1ZhbHVlKCkge1xuICAgIGxldCByYWRpdXMgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cztcbiAgICBsZXQgbmV3UmFkaXVzID0gMjU7XG4gICAgaWYgKHJhZGl1cyAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChyYWRpdXMsIDEwKSkpIHtcbiAgICAgICAgbGV0IGNoZWNrUmFkaXVzID0gcGFyc2VJbnQocmFkaXVzLCAxMCk7XG4gICAgICAgIGlmIChjaGVja1JhZGl1cyA+IDApIHtcbiAgICAgICAgICBuZXdSYWRpdXMgPSBjaGVja1JhZGl1cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnBvbHlzdGF0LnJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdmFsaWRhdGVCb3JkZXJTaXplVmFsdWUoKSB7XG4gICAgbGV0IGJvcmRlclNpemUgPSB0aGlzLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplO1xuICAgIGxldCBuZXdCb3JkZXJTaXplID0gMjtcbiAgICBpZiAoYm9yZGVyU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCFpc05hTihwYXJzZUludChib3JkZXJTaXplLCAxMCkpKSB7XG4gICAgICAgIGxldCBjaGVja0JvcmRlclNpemUgPSBwYXJzZUludChib3JkZXJTaXplLCAxMCk7XG4gICAgICAgIGlmIChjaGVja0JvcmRlclNpemUgPj0gMCkge1xuICAgICAgICAgIG5ld0JvcmRlclNpemUgPSBjaGVja0JvcmRlclNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYW5lbC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSA9IG5ld0JvcmRlclNpemU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlnb25Cb3JkZXJDb2xvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdENsaWNrVGhyb3VnaCgpIHtcbiAgICBsZXQgdXJsID0gdGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoO1xuICAgIGlmICgodXJsKSAmJiAodGhpcy5wYW5lbC5wb2x5c3RhdC5kZWZhdWx0Q2xpY2tUaHJvdWdoU2FuaXRpemUpKSB7XG4gICAgICB1cmwgPSB0aGlzLiRzYW5pdGl6ZSh1cmwpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG59XG5cblxuZXhwb3J0IHtcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCxcbiAgRDNQb2x5c3RhdFBhbmVsQ3RybCBhcyBNZXRyaWNzUGFuZWxDdHJsXG59O1xuIl19