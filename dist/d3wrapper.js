System.register(["./external/d3.min.js", "./external/d3-hexbin.js", "./utils", "lodash", "./color"], function (exports_1, context_1) {
    "use strict";
    var d3, d3hexbin, utils_1, lodash_1, color_1, D3Wrapper;
    var __moduleName = context_1 && context_1.id;
    function resolveClickThroughURL(d) {
        var clickThroughURL = d.clickThrough;
        if (d.sanitizeURLEnabled === true && d.sanitizedURL.length > 0) {
            clickThroughURL = d.sanitizedURL;
        }
        return clickThroughURL;
    }
    function resolveClickThroughTarget(d) {
        var clickThroughTarget = "_self";
        if (d.newTabEnabled === true) {
            clickThroughTarget = "_blank";
        }
        return clickThroughTarget;
    }
    return {
        setters: [
            function (d3_1) {
                d3 = d3_1;
            },
            function (d3hexbin_1) {
                d3hexbin = d3hexbin_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            D3Wrapper = (function () {
                function D3Wrapper(templateSrv, svgContainer, d3DivId, opt) {
                    this.maxFont = 240;
                    this.templateSrv = templateSrv;
                    this.svgContainer = svgContainer;
                    this.d3DivId = d3DivId;
                    this.data = opt.data;
                    this.opt = opt;
                    this.purelight = new color_1.Color(255, 255, 255);
                    this.margin = {
                        top: 30 + 26,
                        right: 0,
                        bottom: 20,
                        left: 50
                    };
                    this.opt.height -= 10;
                    this.opt.width -= 20;
                    this.data = this.opt.data;
                    this.numColumns = 5;
                    this.numRows = 5;
                    this.maxColumnsUsed = 0;
                    this.maxRowsUsed = 0;
                    if (opt.rowAutoSize && opt.columnAutoSize) {
                    }
                    else {
                        this.numColumns = opt.columns || 6;
                        this.numRows = opt.rows || 6;
                    }
                    if ((!opt.radiusAutoSize) && (opt.radius)) {
                        this.hexRadius = opt.radius;
                        this.autoHexRadius = opt.radius;
                    }
                    else {
                        this.hexRadius = this.getAutoHexRadius();
                        this.autoHexRadius = this.getAutoHexRadius();
                    }
                    this.calculateSVGSize();
                    this.calculatedPoints = this.generatePoints();
                }
                D3Wrapper.prototype.update = function (data) {
                    if (data) {
                        this.data = data;
                    }
                };
                D3Wrapper.prototype.draw = function () {
                    var _this = this;
                    if (this.opt.rowAutoSize && this.opt.columnAutoSize) {
                        var squared = Math.sqrt(this.data.length);
                        if (this.opt.width > this.opt.height) {
                            var ratio = this.opt.width / this.opt.height * .66;
                            this.numColumns = Math.ceil(squared * ratio);
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
                            if ((this.numColumns % 2) && (this.numColumns > 2)) {
                                this.numColumns -= 1;
                            }
                            this.numRows = Math.floor(this.data.length / this.numColumns * ratio);
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                            this.numColumns = Math.ceil(this.data.length / this.numRows * ratio);
                        }
                        else {
                            var ratio = this.opt.height / this.opt.width * .66;
                            this.numRows = Math.ceil(squared * ratio);
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                            if ((this.numRows % 2) && (this.numRows > 2)) {
                                this.numRows -= 1;
                            }
                            this.numColumns = Math.floor(this.data.length / this.numRows * ratio);
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
                        }
                        if (this.data.length === 1) {
                            this.numColumns = 1;
                            this.numRows = 1;
                        }
                        if (this.data.length === this.numColumns) {
                            this.numRows = 1;
                        }
                    }
                    if (this.opt.radiusAutoSize) {
                        this.hexRadius = this.getAutoHexRadius();
                        this.autoHexRadius = this.getAutoHexRadius();
                    }
                    this.calculateSVGSize();
                    this.calculatedPoints = this.generatePoints();
                    var width = this.opt.width;
                    var height = this.opt.height;
                    var ahexbin = d3hexbin
                        .hexbin()
                        .radius(this.autoHexRadius)
                        .extent([[0, 0], [width, height]]);
                    var thirdPi = Math.PI / 3;
                    var diameterX = this.autoHexRadius * 2 * Math.sin(thirdPi);
                    var diameterY = this.autoHexRadius * 1.5;
                    var radiusX = diameterX / 2;
                    var renderWidth = this.maxColumnsUsed * diameterX;
                    var renderHeight = (this.maxRowsUsed * diameterY) + (diameterY * .33);
                    var xoffset = (width - renderWidth + radiusX) / 2;
                    if (this.numRows === 1) {
                        renderHeight = diameterY + (diameterY * .33);
                        xoffset = ((width - renderWidth) / 2) + radiusX;
                    }
                    var yoffset = ((height - renderHeight) / 2) + (diameterY * .66);
                    var tooltip = d3
                        .select("body")
                        .append("div")
                        .attr("id", this.d3DivId + "-tooltip")
                        .attr("class", "polystat-panel-tooltip")
                        .style("opacity", 0);
                    var svg = d3.select(this.svgContainer)
                        .attr("width", width + "px")
                        .attr("height", height + "px")
                        .append("svg")
                        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                        .attr("width", width + "px")
                        .attr("height", height + "px")
                        .style("border", "0px solid white")
                        .attr("id", this.d3DivId)
                        .append("g")
                        .attr("transform", "translate(" + xoffset + "," + yoffset + ")");
                    var data = this.data;
                    var defs = svg.append("defs");
                    var colorGradients = color_1.Color.createGradients(data);
                    for (var i = 0; i < colorGradients.length; i++) {
                        var aGradient = defs.append("linearGradient")
                            .attr("id", this.d3DivId + "linear-gradient-state-data-" + i);
                        aGradient
                            .attr("x1", "30%")
                            .attr("y1", "30%")
                            .attr("x2", "70%")
                            .attr("y2", "70%");
                        aGradient
                            .append("stop")
                            .attr("offset", "0%")
                            .attr("stop-color", colorGradients[i].start);
                        aGradient
                            .append("stop")
                            .attr("offset", "100%")
                            .attr("stop-color", colorGradients[i].end);
                    }
                    var okColorStart = new color_1.Color(82, 194, 52);
                    var okColorEnd = okColorStart.Mul(this.purelight, 0.7);
                    var okGradient = defs.append("linearGradient")
                        .attr("id", this.d3DivId + "linear-gradient-state-ok");
                    okGradient
                        .attr("x1", "30%")
                        .attr("y1", "30%")
                        .attr("x2", "70%")
                        .attr("y2", "70%");
                    okGradient
                        .append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", okColorStart.asHex());
                    okGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", okColorEnd.asHex());
                    var warningColorStart = new color_1.Color(255, 200, 55);
                    var warningColorEnd = warningColorStart.Mul(this.purelight, 0.7);
                    var warningGradient = defs.append("linearGradient")
                        .attr("id", this.d3DivId + "linear-gradient-state-warning");
                    warningGradient.attr("x1", "30%")
                        .attr("y1", "30%")
                        .attr("x2", "70%")
                        .attr("y2", "70%");
                    warningGradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", warningColorStart.asHex());
                    warningGradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", warningColorEnd.asHex());
                    var criticalColorStart = new color_1.Color(229, 45, 39);
                    var criticalColorEnd = criticalColorStart.Mul(this.purelight, 0.7);
                    var criticalGradient = defs.append("linearGradient")
                        .attr("id", this.d3DivId + "linear-gradient-state-critical");
                    criticalGradient
                        .attr("x1", "30%")
                        .attr("y1", "30%")
                        .attr("x2", "70%")
                        .attr("y2", "70%");
                    criticalGradient
                        .append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", criticalColorStart.asHex());
                    criticalGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", criticalColorEnd.asHex());
                    var unknownGradient = defs.append("linearGradient")
                        .attr("id", this.d3DivId + "linear-gradient-state-unknown");
                    unknownGradient
                        .attr("x1", "30%")
                        .attr("y1", "30%")
                        .attr("x2", "70%")
                        .attr("y2", "70%");
                    unknownGradient
                        .append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#73808A");
                    unknownGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#757F9A");
                    var customShape = null;
                    var shapeWidth = diameterX;
                    var shapeHeight = diameterY;
                    var innerArea = diameterX * diameterY;
                    if (diameterX < diameterY) {
                        innerArea = diameterX * diameterX;
                    }
                    if (diameterY < diameterX) {
                        innerArea = diameterY * diameterY;
                    }
                    var symbol = d3.symbol().size(innerArea);
                    switch (this.opt.polystat.shape) {
                        case "hexagon_pointed_top":
                            customShape = ahexbin.hexagon(this.autoHexRadius);
                            shapeWidth = this.autoHexRadius * 2;
                            break;
                        case "hexagon_flat_top":
                            customShape = ahexbin.hexagon(this.autoHexRadius);
                            shapeWidth = this.autoHexRadius * 2;
                            break;
                        case "circle":
                            customShape = symbol.type(d3.symbolCircle);
                            break;
                        case "cross":
                            customShape = symbol.type(d3.symbolCross);
                            break;
                        case "diamond":
                            customShape = symbol.type(d3.symbolDiamond);
                            break;
                        case "square":
                            customShape = symbol.type(d3.symbolSquare);
                            break;
                        case "star":
                            customShape = symbol.type(d3.symbolStar);
                            break;
                        case "triangle":
                            customShape = symbol.type(d3.symbolTriangle);
                            break;
                        case "wye":
                            customShape = symbol.type(d3.symbolWye);
                            break;
                        default:
                            customShape = ahexbin.hexagon(this.autoHexRadius);
                            break;
                    }
                    var activeLabelFontSize = this.opt.polystat.fontSize;
                    var activeValueFontSize = this.opt.polystat.fontSize;
                    var longestDisplayedValueContent = "";
                    if (this.opt.polystat.fontAutoScale) {
                        var maxLabel = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].name.length > maxLabel.length) {
                                maxLabel = this.data[i].name;
                            }
                        }
                        var estimateLabelFontSize = utils_1.getTextSizeForWidthAndHeight(maxLabel, "?px sans-serif", shapeWidth, shapeHeight / 3, 10, this.maxFont);
                        activeLabelFontSize = estimateLabelFontSize;
                        var maxValue = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].valueFormatted.length > maxValue.length) {
                                maxValue = this.data[i].valueFormatted;
                            }
                        }
                        var estimateValueFontSize = utils_1.getTextSizeForWidthAndHeight(maxValue, "?px sans-serif", shapeWidth, shapeHeight / 3, 10, this.maxFont);
                        activeValueFontSize = estimateValueFontSize;
                        longestDisplayedValueContent = maxValue;
                    }
                    svg.selectAll(".hexagon")
                        .data(ahexbin(this.calculatedPoints))
                        .enter()
                        .each(function (_, i, nodes) {
                        var node = d3.select(nodes[i]);
                        var clickThroughURL = resolveClickThroughURL(data[i]);
                        if (clickThroughURL.length > 0) {
                            node = node.append("a")
                                .attr("target", resolveClickThroughTarget(data[i]))
                                .attr("xlink:href", clickThroughURL);
                        }
                        var fillColor = data[i].color;
                        if (_this.opt.polystat.gradientEnabled) {
                            fillColor = "url(" + location.href + "#" + _this.d3DivId + "linear-gradient-state-data-" + i + ")";
                        }
                        node.append("path")
                            .attr("class", "hexagon")
                            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                            .attr("d", customShape)
                            .attr("stroke", _this.opt.polystat.polygonBorderColor)
                            .attr("stroke-width", _this.opt.polystat.polygonBorderSize + "px")
                            .style("fill", fillColor)
                            .on("mousemove", function () {
                            var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                            var mouse = d3.mouse(d3.select("body").node());
                            var xpos = mouse[0] - 50;
                            if (xpos < 0) {
                                xpos = 0;
                            }
                            if ((xpos + 200) > viewPortWidth) {
                                xpos = viewPortWidth - 200;
                            }
                            var ypos = mouse[1] + 5;
                            tooltip
                                .style("left", xpos + "px")
                                .style("top", ypos + "px");
                        })
                            .on("mouseover", function (d) {
                            tooltip.transition().duration(200).style("opacity", 0.9);
                            tooltip.html(_this.opt.tooltipContent[i])
                                .style("font-size", _this.opt.tooltipFontSize)
                                .style("font-family", _this.opt.tooltipFontType)
                                .style("left", (d.x - 5) + "px")
                                .style("top", (d.y - 5) + "px");
                        })
                            .on("mouseout", function () {
                            tooltip
                                .transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                    });
                    var textspot = svg.selectAll("text.toplabel")
                        .data(ahexbin(this.calculatedPoints));
                    var dynamicLabelFontSize = activeLabelFontSize;
                    var dynamicValueFontSize = activeValueFontSize;
                    textspot.enter()
                        .append("text")
                        .attr("class", "toplabel")
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y; })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("font-size", dynamicLabelFontSize + "px")
                        .attr("fill", "black")
                        .style("pointer-events", "none")
                        .text(function (_, i) {
                        var item = data[i];
                        if (!("showName" in item)) {
                            return item.name;
                        }
                        if (item.showName) {
                            return item.name;
                        }
                        else {
                            return "";
                        }
                    });
                    var frames = 0;
                    textspot.enter()
                        .append("text")
                        .attr("class", function (_, i) {
                        return "valueLabel" + i;
                    })
                        .attr("x", function (d) {
                        return d.x;
                    })
                        .attr("y", function (d) {
                        return d.y + (activeLabelFontSize / 2) + 20;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("fill", "black")
                        .attr("font-size", dynamicLabelFontSize + "px")
                        .style("pointer-events", "none")
                        .text(function (_, i) {
                        var counter = 0;
                        var dataLen = _this.data.length;
                        var submetricCount = _this.data[i].members.length;
                        if (submetricCount > 0) {
                            while (counter < submetricCount) {
                                var checkContent = _this.formatValueContent(i, counter, _this);
                                if (checkContent) {
                                    if (checkContent.length > longestDisplayedValueContent.length) {
                                        longestDisplayedValueContent = checkContent;
                                    }
                                }
                                counter++;
                            }
                        }
                        var content = null;
                        counter = 0;
                        while ((content === null) && (counter < dataLen)) {
                            content = _this.formatValueContent(i, (frames + counter), _this);
                            counter++;
                        }
                        dynamicValueFontSize = utils_1.getTextSizeForWidthAndHeight(longestDisplayedValueContent, "?px sans-serif", shapeWidth, shapeHeight / 3, 6, _this.maxFont);
                        if (dynamicValueFontSize > dynamicLabelFontSize) {
                            dynamicValueFontSize = dynamicLabelFontSize;
                        }
                        var valueTextLocation = svg.select("text.valueLabel" + i);
                        valueTextLocation.attr("font-size", dynamicValueFontSize + "px");
                        d3.interval(function () {
                            var valueTextLocation = svg.select("text.valueLabel" + i);
                            var compositeIndex = i;
                            valueTextLocation.text(function () {
                                valueTextLocation.attr("font-size", dynamicValueFontSize + "px");
                                var content = null;
                                var counter = 0;
                                var dataLen = _this.data.length * 2;
                                while ((content === null) && (counter < dataLen)) {
                                    content = _this.formatValueContent(compositeIndex, (frames + counter), _this);
                                    counter++;
                                }
                                if (content === null) {
                                    return "";
                                }
                                if (content === "") {
                                    content = "";
                                }
                                return content;
                            });
                            frames++;
                        }, _this.opt.animationSpeed);
                        return content;
                    });
                };
                D3Wrapper.prototype.formatValueContent = function (i, frames, thisRef) {
                    var data = thisRef.data[i];
                    if (typeof (data) !== "undefined") {
                        if (data.hasOwnProperty("showValue")) {
                            if (!data.showValue) {
                                return "";
                            }
                        }
                        if (!data.hasOwnProperty("valueFormatted")) {
                            return "";
                        }
                    }
                    else {
                        return "";
                    }
                    switch (data.animateMode) {
                        case "all":
                            break;
                        case "triggered":
                            if (data.thresholdLevel < 1) {
                                return "";
                            }
                    }
                    var content = data.valueFormatted;
                    if (!content) {
                        return null;
                    }
                    if ((data.prefix) && (data.prefix.length > 0)) {
                        content = data.prefix + " " + content;
                    }
                    if ((data.suffix) && (data.suffix.length > 0)) {
                        content = content + " " + data.suffix;
                    }
                    var len = data.members.length;
                    if (len > 0) {
                        var triggeredIndex = -1;
                        if (data.animateMode === "all") {
                            triggeredIndex = frames % len;
                        }
                        else {
                            if (typeof (data.triggerCache) === "undefined") {
                                data.triggerCache = this.buildTriggerCache(data);
                            }
                            var z = frames % data.triggerCache.length;
                            triggeredIndex = data.triggerCache[z].index;
                        }
                        var aMember = data.members[triggeredIndex];
                        content = aMember.name + ": " + aMember.valueFormatted;
                        if ((aMember.prefix) && (aMember.prefix.length > 0)) {
                            content = aMember.prefix + " " + content;
                        }
                        if ((aMember.suffix) && (aMember.suffix.length > 0)) {
                            content = content + " " + aMember.suffix;
                        }
                    }
                    if ((content) && (content.length > 0)) {
                        try {
                            var replacedContent = thisRef.templateSrv.replaceWithText(content);
                            content = replacedContent;
                        }
                        catch (err) {
                            console.log("ERROR: template server threw error: " + err);
                        }
                    }
                    return content;
                };
                D3Wrapper.prototype.buildTriggerCache = function (item) {
                    var triggerCache = [];
                    for (var i = 0; i < item.members.length; i++) {
                        var aMember = item.members[i];
                        if (aMember.thresholdLevel > 0) {
                            var cachedMemberState = { index: i, name: aMember.name, value: aMember.value, thresholdLevel: aMember.thresholdLevel };
                            triggerCache.push(cachedMemberState);
                        }
                    }
                    triggerCache = lodash_1.default.orderBy(triggerCache, ["thresholdLevel", "value", "name"], ["desc", "desc", "asc"]);
                    return triggerCache;
                };
                D3Wrapper.prototype.getAutoHexRadius = function () {
                    var hexRadius = d3.min([
                        this.opt.width / ((this.numColumns + 0.5) * Math.sqrt(3)),
                        this.opt.height / ((this.numRows + 1 / 3) * 1.5)
                    ]);
                    return hexRadius;
                };
                D3Wrapper.prototype.calculateSVGSize = function () {
                    this.autoHeight = (this.numRows + 1 / 3) * 3 / 2 * this.hexRadius;
                    this.autoHeight -= this.margin.top - this.margin.bottom;
                    this.autoWidth = (this.numColumns + 1 / 2) * Math.sqrt(3) * this.hexRadius;
                    this.autoWidth -= this.margin.left - this.margin.right;
                };
                D3Wrapper.prototype.generatePoints = function () {
                    var points = [];
                    if (typeof (this.data) === "undefined") {
                        return points;
                    }
                    var maxRowsUsed = 0;
                    var columnsUsed = 0;
                    var maxColumnsUsed = 0;
                    if (this.numRows === Infinity) {
                        return points;
                    }
                    if (this.numColumns === NaN) {
                        return points;
                    }
                    for (var i = 0; i < this.numRows; i++) {
                        if ((points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
                            maxRowsUsed += 1;
                            columnsUsed = 0;
                            for (var j = 0; j < this.numColumns; j++) {
                                if ((points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
                                    columnsUsed += 1;
                                    if (columnsUsed > maxColumnsUsed) {
                                        maxColumnsUsed = columnsUsed;
                                    }
                                    points.push([this.hexRadius * j * 1.75, this.hexRadius * i * 1.5]);
                                }
                            }
                        }
                    }
                    this.maxRowsUsed = maxRowsUsed;
                    this.maxColumnsUsed = maxColumnsUsed;
                    return points;
                };
                return D3Wrapper;
            }());
            exports_1("D3Wrapper", D3Wrapper);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBRUQ7Z0JBd0JFLG1CQUFZLFdBQWdCLEVBQUUsWUFBaUIsRUFBRSxPQUFZLEVBQUUsR0FBUTtvQkFIdkUsWUFBTyxHQUFHLEdBQUcsQ0FBQztvQkFJWixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO29CQUVmLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFMUMsSUFBSSxDQUFDLE1BQU0sR0FB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LEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTs0QkFDakYsV0FBVyxJQUFJLENBQUMsQ0FBQzs0QkFDakIsV0FBVyxHQUFHLENBQUMsQ0FBQzs0QkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0NBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0NBQ2pGLFdBQVcsSUFBSSxDQUFDLENBQUM7b0NBRWpCLElBQUksV0FBVyxHQUFHLGNBQWMsRUFBRTt3Q0FDaEMsY0FBYyxHQUFHLFdBQVcsQ0FBQztxQ0FDOUI7b0NBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lDQUNwRTs2QkFDRjt5QkFDRjtxQkFDRjtvQkFHRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7b0JBQ3JDLE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDO2dCQUVILGdCQUFDO1lBQUQsQ0FBQyxBQTFzQkQsSUEwc0JDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzLWhleGJpbi9pbmRleC5kLnRzXCIgLz5cbi8vLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9kMy9pbmRleC5kLnRzXCIgLz5cbmltcG9ydCAqIGFzIGQzIGZyb20gXCIuL2V4dGVybmFsL2QzLm1pbi5qc1wiO1xuaW1wb3J0ICogYXMgZDNoZXhiaW4gZnJvbSBcIi4vZXh0ZXJuYWwvZDMtaGV4YmluLmpzXCI7XG5pbXBvcnQgeyBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZUNsaWNrVGhyb3VnaFVSTChkIDogYW55KSA6IHN0cmluZyB7XG4gIGxldCBjbGlja1Rocm91Z2hVUkwgPSBkLmNsaWNrVGhyb3VnaDtcbiAgaWYgKGQuc2FuaXRpemVVUkxFbmFibGVkID09PSB0cnVlICYmIGQuc2FuaXRpemVkVVJMLmxlbmd0aCA+IDApIHtcbiAgICBjbGlja1Rocm91Z2hVUkwgPSBkLnNhbml0aXplZFVSTDtcbiAgfVxuICByZXR1cm4gY2xpY2tUaHJvdWdoVVJMO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGQgOiBhbnkpIDogc3RyaW5nIHtcbiAgbGV0IGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX3NlbGZcIjtcbiAgaWYgKGQubmV3VGFiRW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgIGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX2JsYW5rXCI7XG4gIH1cbiAgcmV0dXJuIGNsaWNrVGhyb3VnaFRhcmdldDtcbn1cblxuZXhwb3J0IGNsYXNzIEQzV3JhcHBlciB7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBkM0RpdklkOiBhbnk7XG4gIG1heENvbHVtbnNVc2VkOiBudW1iZXI7XG4gIG1heFJvd3NVc2VkOiBudW1iZXI7XG4gIG9wdDogYW55O1xuICBkYXRhOiBhbnk7XG4gIHRlbXBsYXRlU3J2OiBhbnk7XG4gIGNhbGN1bGF0ZWRQb2ludHM6IGFueTtcbiAgaGV4UmFkaXVzOiBudW1iZXI7XG4gIGF1dG9IZXhSYWRpdXMgOiBudW1iZXI7XG4gIGF1dG9XaWR0aCA6IG51bWJlcjtcbiAgYXV0b0hlaWdodDogbnVtYmVyO1xuICBudW1Db2x1bW5zOiBudW1iZXI7XG4gIG51bVJvd3M6IG51bWJlcjtcbiAgbWFyZ2luOiB7XG4gICAgdG9wOiBudW1iZXIsXG4gICAgcmlnaHQgOiBudW1iZXIsXG4gICAgYm90dG9tIDogbnVtYmVyLFxuICAgIGxlZnQgOiBudW1iZXIsXG4gIH07XG4gIG1heEZvbnQgPSAyNDA7XG4gIHB1cmVsaWdodDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlU3J2OiBhbnksIHN2Z0NvbnRhaW5lcjogYW55LCBkM0RpdklkOiBhbnksIG9wdDogYW55KSB7XG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gc3ZnQ29udGFpbmVyO1xuICAgIHRoaXMuZDNEaXZJZCA9IGQzRGl2SWQ7XG4gICAgdGhpcy5kYXRhID0gb3B0LmRhdGE7XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG5cbiAgICB0aGlzLnB1cmVsaWdodCA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAvLyB0aXRsZSBpcyAyNnB4XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6IDMwICsgMjYsXG4gICAgICByaWdodDogMCxcbiAgICAgIGJvdHRvbTogMjAsXG4gICAgICBsZWZ0OiA1MFxuICAgIH07XG4gICAgLy8gdGFrZSAxMCBvZmYgdGhlIGhlaWdodFxuICAgIHRoaXMub3B0LmhlaWdodCAtPSAxMDtcbiAgICB0aGlzLm9wdC53aWR0aCAtPSAyMDtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLm9wdC5kYXRhO1xuICAgIHRoaXMubnVtQ29sdW1ucyA9IDU7XG4gICAgdGhpcy5udW1Sb3dzID0gNTtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gMDtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gMDtcbiAgICBpZiAob3B0LnJvd0F1dG9TaXplICYmIG9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgLy8gc3FydCBvZiAjIGRhdGEgaXRlbXNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5udW1Db2x1bW5zID0gb3B0LmNvbHVtbnMgfHwgNjtcbiAgICAgIHRoaXMubnVtUm93cyA9IG9wdC5yb3dzIHx8IDY7XG4gICAgfVxuICAgIGlmICgoIW9wdC5yYWRpdXNBdXRvU2l6ZSkgJiYgKG9wdC5yYWRpdXMpKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSBvcHQucmFkaXVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvLyB8fCA1MDtcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvL3x8IDUwO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZVNWR1NpemUoKTtcbiAgICB0aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSB0aGlzLmdlbmVyYXRlUG9pbnRzKCk7XG4gIH1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAodGhpcy5vcHQucm93QXV0b1NpemUgJiYgdGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgIC8vIHNxcnQgb2YgIyBkYXRhIGl0ZW1zXG4gICAgICBsZXQgc3F1YXJlZCA9IE1hdGguc3FydCh0aGlzLmRhdGEubGVuZ3RoKTtcbiAgICAgIC8vIGZhdm9yIGNvbHVtbnMgd2hlbiB3aWR0aCBpcyBncmVhdGVyIHRoYW4gaGVpZ2h0XG4gICAgICAvLyBmYXZvciByb3dzIHdoZW4gd2lkdGggaXMgbGVzcyB0aGFuIGhlaWdodFxuICAgICAgaWYgKHRoaXMub3B0LndpZHRoID4gdGhpcy5vcHQuaGVpZ2h0KSB7XG4gICAgICAgIC8vIHJhdGlvIG9mIHdpZHRoIHRvIGhlaWdodFxuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC53aWR0aCAvIHRoaXMub3B0LmhlaWdodCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIGNvbHVtblxuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJlZmVyIGV2ZW5zIGFuZCBzbWFsbGVyXG4gICAgICAgIGlmICgodGhpcy5udW1Db2x1bW5zICUgMikgJiYgKHRoaXMubnVtQ29sdW1ucyA+IDIpKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zIC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5mbG9vcih0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Db2x1bW5zICogcmF0aW8pO1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC5oZWlnaHQgLyB0aGlzLm9wdC53aWR0aCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBwcmVmZXIgZXZlbnMgYW5kIHNtYWxsZXJcbiAgICAgICAgaWYgKCh0aGlzLm51bVJvd3MgJSAyKSAmJiAodGhpcy5udW1Sb3dzID4gMikpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgLT0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmZsb29yKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICAgIC8vIHByZWZlciBtb3JlIGNvbHVtbnNcbiAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09PSB0aGlzLm51bUNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIkNhbGN1bGF0ZWQgY29sdW1ucyA9IFwiICsgdGhpcy5udW1Db2x1bW5zKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCByb3dzID0gXCIgKyB0aGlzLm51bVJvd3MpO1xuICAgIC8vY29uc29sZS5sb2coXCJOdW1iZXIgb2YgZGF0YSBpdGVtcyB0byByZW5kZXIgPSBcIiArIHRoaXMuZGF0YS5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMub3B0LnJhZGl1c0F1dG9TaXplKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiYXV0b0hleFJhZGl1czpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcblxuICAgIHZhciB3aWR0aCA9IHRoaXMub3B0LndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLm9wdC5oZWlnaHQ7XG4gICAgLy9jb25zb2xlLmxvZyhcIkRldGVjdGVkIFdpZHRoOiBcIiArIHdpZHRoICsgXCIgSGVpZ2h0OiBcIiArIGhlaWdodCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG9yYWQ6XCIgKyB0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgIHZhciBhaGV4YmluID0gZDNoZXhiaW5cbiAgICAgIC5oZXhiaW4oKVxuICAgICAgLnJhZGl1cyh0aGlzLmF1dG9IZXhSYWRpdXMpXG4gICAgICAuZXh0ZW50KFtbMCwgMF0sIFt3aWR0aCwgaGVpZ2h0XV0pO1xuXG4gICAgLy8gZDMgY2FsY3VsYXRlcyB0aGUgcmFkaXVzIGZvciB4IGFuZCB5IHNlcGFyYXRlbHkgYmFzZWQgb24gdGhlIHZhbHVlIHBhc3NlZCBpblxuICAgIHZhciB0aGlyZFBpID0gTWF0aC5QSSAvIDM7XG4gICAgbGV0IGRpYW1ldGVyWCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDIgKiBNYXRoLnNpbih0aGlyZFBpKTtcbiAgICBsZXQgZGlhbWV0ZXJZID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMS41O1xuICAgIGxldCByYWRpdXNYID0gZGlhbWV0ZXJYIC8gMjtcbiAgICBsZXQgcmVuZGVyV2lkdGggPSB0aGlzLm1heENvbHVtbnNVc2VkICogZGlhbWV0ZXJYO1xuICAgIC8vIHJlbmRlckhlaWdodCBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSAjcm93cyB1c2VkLCBhbmRcbiAgICAvLyB0aGUgXCJzcGFjZVwiIHRha2VuIGJ5IHRoZSBoZXhhZ29ucyBpbnRlcmxlYXZlZFxuICAgIC8vIHNwYWNlIHRha2VuIGlzIDIvMyBvZiBkaWFtZXRlclkgKiAjIHJvd3NcbiAgICBsZXQgcmVuZGVySGVpZ2h0ID0gKHRoaXMubWF4Um93c1VzZWQgKiBkaWFtZXRlclkpICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgLy8gZGlmZmVyZW5jZSBvZiB3aWR0aCBhbmQgcmVuZGVyd2lkdGggaXMgb3VyIHBsYXkgcm9vbSwgc3BsaXQgdGhhdCBpbiBoYWxmXG4gICAgLy8gb2Zmc2V0IGlzIGZyb20gY2VudGVyIG9mIGhleGFnb24sIG5vdCBmcm9tIHRoZSBlZGdlXG4gICAgbGV0IHhvZmZzZXQgPSAod2lkdGggLSByZW5kZXJXaWR0aCArIHJhZGl1c1gpIC8gMjtcbiAgICAvLyBpZiB0aGVyZSBpcyBqdXN0IG9uZSBjb2x1bW4gYW5kIG9uZSByb3csIGNlbnRlciBpdFxuICAgIGlmICh0aGlzLm51bVJvd3MgPT09IDEpIHtcbiAgICAgIHJlbmRlckhlaWdodCA9IGRpYW1ldGVyWSArIChkaWFtZXRlclkgKiAuMzMpO1xuICAgICAgeG9mZnNldCA9ICgod2lkdGggLSByZW5kZXJXaWR0aCkgLyAyKSArIHJhZGl1c1g7XG4gICAgfVxuICAgIC8vIHkgZGlhbWV0ZXIgb2YgaGV4YWdvbiBpcyBsYXJnZXIgdGhhbiB4IGRpYW1ldGVyXG4gICAgbGV0IHlvZmZzZXQgPSAoKGhlaWdodCAtIHJlbmRlckhlaWdodCkgLyAyKSArIChkaWFtZXRlclkgKiAuNjYpO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBkaXYgZm9yIHRoZSB0b29sdGlwXG4gICAgLy8gYWRkIGl0IHRvIHRoZSBib2R5IGFuZCBub3QgdGhlIGNvbnRhaW5lciBzbyBpdCBjYW4gZmxvYXQgb3V0c2lkZSBvZiB0aGUgcGFuZWxcbiAgICB2YXIgdG9vbHRpcCA9IGQzXG4gICAgICAuc2VsZWN0KFwiYm9keVwiKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwicG9seXN0YXQtcGFuZWwtdG9vbHRpcFwiKVxuICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICB2YXIgc3ZnIDogYW55ID0gZDMuc2VsZWN0KHRoaXMuc3ZnQ29udGFpbmVyKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgIC5hdHRyKFwieG1sbnM6eGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwiYm9yZGVyXCIsIFwiMHB4IHNvbGlkIHdoaXRlXCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHhvZmZzZXQgKyBcIixcIiArIHlvZmZzZXQgKyBcIilcIik7XG5cbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICB2YXIgZGVmcyA9IHN2Zy5hcHBlbmQoXCJkZWZzXCIpO1xuXG4gICAgbGV0IGNvbG9yR3JhZGllbnRzID0gQ29sb3IuY3JlYXRlR3JhZGllbnRzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JHcmFkaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJOYW1lID0gXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBsZXQgYUdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjb2xvckdyYWRpZW50c1tpXS5zdGFydCk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uZW5kKTtcbiAgICB9XG4gICAgbGV0IG9rQ29sb3JTdGFydCA9IG5ldyBDb2xvcig4MiwgMTk0LCA1Mik7IC8vICM1MmMyMzRcbiAgICBsZXQgb2tDb2xvckVuZCA9IG9rQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IG9rR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLW9rXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvclN0YXJ0LmFzSGV4KCkpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvckVuZC5hc0hleCgpKTtcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNKdWljeU9yYW5nZVxuICAgIGxldCB3YXJuaW5nQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyNTUsIDIwMCwgNTUpOyAvLyAjRkZDODM3XG4gICAgbGV0IHdhcm5pbmdDb2xvckVuZCA9IHdhcm5pbmdDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgd2FybmluZ0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXdhcm5pbmdcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgd2FybmluZ0NvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IG9yYW5nZVxuICAgIHdhcm5pbmdHcmFkaWVudC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayBvcmFuZ2VcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNZb3VUdWJlXG4gICAgbGV0IGNyaXRpY2FsQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyMjksIDQ1LCAzOSk7IC8vIGU1MmQyN1xuICAgIGxldCBjcml0aWNhbENvbG9yRW5kID0gY3JpdGljYWxDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgY3JpdGljYWxHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtY3JpdGljYWxcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjcml0aWNhbENvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IHJlZFxuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayByZWRcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNBc2hcbiAgICBsZXQgdW5rbm93bkdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS11bmtub3duXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzczODA4QVwiKTsgLy8gbGlnaHQgZ3JleVxuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3NTdGOUFcIik7IC8vIGRhcmsgZ3JleVxuXG4gICAgbGV0IGN1c3RvbVNoYXBlID0gbnVsbDtcbiAgICAvLyB0aGlzIGlzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBmb250c2l6ZVxuICAgIGxldCBzaGFwZVdpZHRoID0gZGlhbWV0ZXJYO1xuICAgIGxldCBzaGFwZUhlaWdodCA9IGRpYW1ldGVyWTtcbiAgICAvLyBzeW1ib2xzIHVzZSB0aGUgYXJlYSBmb3IgdGhlaXIgc2l6ZVxuICAgIGxldCBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclk7XG4gICAgLy8gdXNlIHRoZSBzbWFsbGVyIG9mIGRpYW1ldGVyWCBvciBZXG4gICAgaWYgKGRpYW1ldGVyWCA8IGRpYW1ldGVyWSkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJYO1xuICAgIH1cbiAgICBpZiAoZGlhbWV0ZXJZIDwgZGlhbWV0ZXJYKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclkgKiBkaWFtZXRlclk7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBkMy5zeW1ib2woKS5zaXplKGlubmVyQXJlYSk7XG4gICAgc3dpdGNoICh0aGlzLm9wdC5wb2x5c3RhdC5zaGFwZSkge1xuICAgICAgY2FzZSBcImhleGFnb25fcG9pbnRlZF90b3BcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgc2hhcGVXaWR0aCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhleGFnb25fZmxhdF90b3BcIjpcbiAgICAgICAgLy8gVE9ETzogdXNlIHBvaW50ZWQgZm9yIG5vd1xuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBzaGFwZVdpZHRoID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2lyY2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ2lyY2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDcm9zcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRpYW1vbmRcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xEaWFtb25kKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3F1YXJlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3F1YXJlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RhclwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFN0YXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlhbmdsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFRyaWFuZ2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid3llXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sV3llKTtcbiAgICAgICAgYnJlYWs7XG4gICAgIGRlZmF1bHQ6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgZm9udHNpemUgYmFzZWQgb24gdGhlIHNoYXBlIGFuZCB0aGUgdGV4dFxuICAgIGxldCBhY3RpdmVMYWJlbEZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgLy8gZm9udCBzaXplcyBhcmUgaW5kZXBlbmRlbnQgZm9yIGxhYmVsIGFuZCB2YWx1ZXNcbiAgICBsZXQgYWN0aXZlVmFsdWVGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuICAgIGxldCBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gXCJcIjtcblxuICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5mb250QXV0b1NjYWxlKSB7XG4gICAgICAvLyBmaW5kIHRoZSBtb3N0IHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBvdmVyIGFsbCBpdGVtc1xuICAgICAgbGV0IG1heExhYmVsID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaV0ubmFtZS5sZW5ndGggPiBtYXhMYWJlbC5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhMYWJlbCA9IHRoaXMuZGF0YVtpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBlc3RpbWF0ZSBob3cgYmlnIG9mIGEgZm9udCBjYW4gYmUgdXNlZFxuICAgICAgLy8gVHdvIGxpbmVzIG9mIHRleHQgbXVzdCBmaXQgd2l0aCB2ZXJ0aWNhbCBzcGFjaW5nIGluY2x1ZGVkXG4gICAgICAvLyBpZiBpdCBpcyB0b28gc21hbGwsIGhpZGUgZXZlcnl0aGluZ1xuICAgICAgbGV0IGVzdGltYXRlTGFiZWxGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgIG1heExhYmVsLFxuICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsIC8vIHVzZSBzYW5zLXNlcmlmIGZvciBzaXppbmdcbiAgICAgICAgc2hhcGVXaWR0aCxcbiAgICAgICAgc2hhcGVIZWlnaHQgLyAzLCAvLyB0b3AgYW5kIGJvdHRvbSBvZiBoZXhhZ29uIG5vdCB1c2VkLCBhbmQgdHdvIGxpbmVzIG9mIHRleHRcbiAgICAgICAgMTAsXG4gICAgICAgIHRoaXMubWF4Rm9udCk7XG5cbiAgICAgIC8vY29uc29sZS5sb2coXCJDYWxjOiBFc3RpbWF0ZWQgTGFiZWwgRm9udCBTaXplOiBcIiArIGVzdGltYXRlTGFiZWxGb250U2l6ZSk7XG4gICAgICBhY3RpdmVMYWJlbEZvbnRTaXplID0gZXN0aW1hdGVMYWJlbEZvbnRTaXplO1xuICAgICAgLy8gc2FtZSBmb3IgdGhlIHZhbHVlXG4gICAgICBsZXQgbWF4VmFsdWUgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNoZWNraW5nIGxlbjogXCIgKyB0aGlzLmRhdGFbaV0udmFsdWVGb3JtYXR0ZWQgKyBcIiB2czogXCIgKyBtYXhWYWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaV0udmFsdWVGb3JtYXR0ZWQubGVuZ3RoID4gbWF4VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgbWF4VmFsdWUgPSB0aGlzLmRhdGFbaV0udmFsdWVGb3JtYXR0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vY29uc29sZS5sb2coXCJNYXggVmFsdWU6IFwiICsgbWF4VmFsdWUpO1xuICAgICAgbGV0IGVzdGltYXRlVmFsdWVGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgIG1heFZhbHVlLFxuICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsIC8vIHVzZSBzYW5zLXNlcmlmIGZvciBzaXppbmdcbiAgICAgICAgc2hhcGVXaWR0aCxcbiAgICAgICAgc2hhcGVIZWlnaHQgLyAzLCAvLyB0b3AgYW5kIGJvdHRvbSBvZiBoZXhhZ29uIG5vdCB1c2VkLCBhbmQgdHdvIGxpbmVzIG9mIHRleHRcbiAgICAgICAgMTAsXG4gICAgICAgIHRoaXMubWF4Rm9udCk7XG4gICAgICBhY3RpdmVWYWx1ZUZvbnRTaXplID0gZXN0aW1hdGVWYWx1ZUZvbnRTaXplO1xuICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IG1heFZhbHVlO1xuICAgIH1cblxuICAgIHN2Zy5zZWxlY3RBbGwoXCIuaGV4YWdvblwiKVxuICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5lYWNoKChfLCBpLCBub2RlcykgPT4ge1xuICAgICAgICBsZXQgbm9kZSA9IGQzLnNlbGVjdChub2Rlc1tpXSk7XG4gICAgICAgIGxldCBjbGlja1Rocm91Z2hVUkwgPSByZXNvbHZlQ2xpY2tUaHJvdWdoVVJMKGRhdGFbaV0pO1xuICAgICAgICBpZiAoY2xpY2tUaHJvdWdoVVJMLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBub2RlID0gbm9kZS5hcHBlbmQoXCJhXCIpXG4gICAgICAgICAgICAuYXR0cihcInRhcmdldFwiLCByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGRhdGFbaV0pKVxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIGNsaWNrVGhyb3VnaFVSTCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZpbGxDb2xvciA9IGRhdGFbaV0uY29sb3I7XG4gICAgICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5ncmFkaWVudEVuYWJsZWQpIHtcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgdGhlIGxvY2F0aW9uLmhyZWZcbiAgICAgICAgICBmaWxsQ29sb3IgPSBcInVybChcIiArIGxvY2F0aW9uLmhyZWYgKyBcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImhleGFnb25cIilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuICAgICAgICAgIC5hdHRyKFwiZFwiLCBjdXN0b21TaGFwZSlcbiAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgKyBcInB4XCIpXG4gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmaWxsQ29sb3IpXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgdmlld3BvcnR3aWR0aCB0byBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb20gZ29pbmcgdG9vIGZhciByaWdodFxuICAgICAgICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgICAgICAgLy8gdXNlIHRoZSBtb3VzZSBwb3NpdGlvbiBmb3IgdGhlIGVudGlyZSBwYWdlXG4gICAgICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZShkMy5zZWxlY3QoXCJib2R5XCIpLm5vZGUoKSk7XG4gICAgICAgICAgICB2YXIgeHBvcyA9IG1vdXNlWzBdIC0gNTA7XG4gICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBvZmZzY3JlZW4gdG9vbHRpcFxuICAgICAgICAgICAgaWYgKHhwb3MgPCAwKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHJldmVudCB0b29sdGlwIGZyb20gcmVuZGVyaW5nIG91dHNpZGUgb2Ygdmlld3BvcnRcbiAgICAgICAgICAgIGlmICgoeHBvcyArIDIwMCkgPiB2aWV3UG9ydFdpZHRoKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSB2aWV3UG9ydFdpZHRoIC0gMjAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHlwb3MgPSBtb3VzZVsxXSArIDU7XG4gICAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgeHBvcyArIFwicHhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIHlwb3MgKyBcInB4XCIpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XG4gICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLnN0eWxlKFwib3BhY2l0eVwiLCAwLjkpO1xuICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRoaXMub3B0LnRvb2x0aXBDb250ZW50W2ldKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRTaXplKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LWZhbWlseVwiLCB0aGlzLm9wdC50b29sdGlwRm9udFR5cGUpXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQueCAtIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQueSAtIDUpICsgXCJweFwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBub3cgbGFiZWxzXG4gICAgdmFyIHRleHRzcG90ID0gc3ZnLnNlbGVjdEFsbChcInRleHQudG9wbGFiZWxcIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSk7XG4gICAgbGV0IGR5bmFtaWNMYWJlbEZvbnRTaXplID0gYWN0aXZlTGFiZWxGb250U2l6ZTtcbiAgICBsZXQgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBhY3RpdmVWYWx1ZUZvbnRTaXplO1xuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b3BsYWJlbFwiKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueTsgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljTGFiZWxGb250U2l6ZSArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8gY2hlY2sgaWYgcHJvcGVydHkgZXhpc3RcbiAgICAgICAgaWYgKCEoXCJzaG93TmFtZVwiIGluIGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5zaG93TmFtZSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdmFyIGZyYW1lcyA9IDA7XG5cbiAgICB0ZXh0c3BvdC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihfLCBpKSB7XG4gICAgICAgIHJldHVybiBcInZhbHVlTGFiZWxcIiArIGk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLng7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLnkgKyAoYWN0aXZlTGFiZWxGb250U2l6ZSAvIDIgKSArIDIwOyAvLyBvZmZzZXQgYnkgZm9udHNpemUgYW5kIDEwcHggdmVydGljYWwgcGFkZGluZ1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KCAoXywgaSkgPT4ge1xuICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGJ1dCBub3QgbW9yZSB0aGFuIG51bWJlciBvZiBkYXRhIGl0ZW1zXG4gICAgICAgIC8vIG5lZWQgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb250ZW50IHN0cmluZyBnZW5lcmF0ZWQgdG8gZGV0ZXJtaW5lIHRoZVxuICAgICAgICAvLyBkeW5hbWljIGZvbnQgc2l6ZVxuICAgICAgICAvLyB0aGlzIGFsd2F5cyBzdGFydHMgZnJvbSBmcmFtZSAwLCBsb29rIHRocm91Z2ggZXZlcnkgbWV0cmljIGluY2x1ZGluZyBjb21wb3NpdGUgbWVtYmVycyBmb3IgdGhlIGxvbmdlc3QgdGV4dCBwb3NzaWJsZVxuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIGNvdW50IG9mIG1ldHJpY3MgKHdpdGggY29tcG9zaXRlIG1lbWJlcnMpLCBhbmQgbG9vcCB0aHJvdWdoXG4gICAgICAgIGxldCBzdWJtZXRyaWNDb3VudCA9IHRoaXMuZGF0YVtpXS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgLy9sZXQgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IFwiXCI7XG4gICAgICAgIGlmIChzdWJtZXRyaWNDb3VudCA+IDApIHtcbiAgICAgICAgICB3aGlsZSAoY291bnRlciA8IHN1Ym1ldHJpY0NvdW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoY2hlY2tDb250ZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGVja0NvbnRlbnQubGVuZ3RoID4gbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9Ly8gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLWNvbXBvc2l0ZXMgdXNlIHRoZSBmb3JtYXR0ZWQgc2l6ZSBvZiB0aGUgbWV0cmljIHZhbHVlXG4gICAgICAgIC8vICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQ6IFwiICsgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCk7XG4gICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlICgoY29udGVudCA9PT0gbnVsbCkgJiYgKGNvdW50ZXIgPCBkYXRhTGVuKSkge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCxcbiAgICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsICAvLyB1c2Ugc2Fucy1zZXJpZiBmb3Igc2l6aW5nXG4gICAgICAgICAgc2hhcGVXaWR0aCwgICAvLyBwYWRcbiAgICAgICAgICBzaGFwZUhlaWdodCAvIDMsXG4gICAgICAgICAgNixcbiAgICAgICAgICB0aGlzLm1heEZvbnQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2FsYzogRHluYW1pYyBWYWx1ZSBGb250IFNpemU6IFwiICsgZHluYW1pY1ZhbHVlRm9udFNpemUpO1xuXG4gICAgICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICAgICAgaWYgKGR5bmFtaWNWYWx1ZUZvbnRTaXplID4gZHluYW1pY0xhYmVsRm9udFNpemUpIHtcbiAgICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGR5bmFtaWNMYWJlbEZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhbmltYXRlZDogZHluYW1pY0xhYmVsRm9udFNpemU6IFwiICsgZHluYW1pY0xhYmVsRm9udFNpemUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGR5bmFtaWNWYWx1ZUZvbnRTaXplOiBcIiArIGR5bmFtaWNWYWx1ZUZvbnRTaXplKTtcbiAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgIC8vIHVzZSB0aGUgZHluYW1pYyBzaXplIGZvciB0aGUgdmFsdWVcbiAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgIGQzLmludGVydmFsKCAoKSA9PiB7XG4gICAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgICAgdmFyIGNvbXBvc2l0ZUluZGV4ID0gaTtcbiAgICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi50ZXh0KCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aCAqIDI7XG4gICAgICAgICAgICAvLyBzZWFyY2ggZm9yIGEgdmFsdWUgY3ljbGluZyB0aHJvdWdoIHR3aWNlIHRvIGFsbG93IHJvbGxvdmVyXG4gICAgICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGNvbXBvc2l0ZUluZGV4LCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBjdXN0b20gY29udGVudCBmb3IgY29tcG9zaXRlIG9rIHN0YXRlXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZvbnQgc2l6ZSB0byBiZSB0aGUgc2FtZSBhcyB0aGUgbGFiZWwgYWJvdmVcbiAgICAgICAgICAgICAgLy92YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGR5bmFtaWNWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZyYW1lcysrO1xuICAgICAgICB9LCB0aGlzLm9wdC5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfSk7XG4gIH1cblxuICBmb3JtYXRWYWx1ZUNvbnRlbnQoaSwgZnJhbWVzLCB0aGlzUmVmKTogc3RyaW5nIHtcbiAgICBsZXQgZGF0YSA9IHRoaXNSZWYuZGF0YVtpXTtcbiAgICAvLyBvcHRpb25zIGNhbiBzcGVjaWZ5IHRvIG5vdCBzaG93IHRoZSB2YWx1ZVxuICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic2hvd1ZhbHVlXCIpKSB7XG4gICAgICAgIGlmICghZGF0YS5zaG93VmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwidmFsdWVGb3JtYXR0ZWRcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIGRhdGEsIHJldHVybiBub3RoaW5nXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgc3dpdGNoIChkYXRhLmFuaW1hdGVNb2RlKSB7XG4gICAgICBjYXNlIFwiYWxsXCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWdnZXJlZFwiOlxuICAgICAgICAvLyByZXR1cm4gbm90aGluZyBpZiBtb2RlIGlzIHRyaWdnZXJlZCBhbmQgdGhlIHN0YXRlIGlzIDBcbiAgICAgICAgaWYgKGRhdGEudGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNvbnRlbnQgPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gdmFsdWVGb3JtYXR0ZWQsIHRoZXJlJ3Mgbm90aGluZyB0byBkaXNwbGF5XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnByZWZpeCkgJiYgKGRhdGEucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gZGF0YS5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgfVxuICAgIGlmICgoZGF0YS5zdWZmaXgpICYmIChkYXRhLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGRhdGEuc3VmZml4O1xuICAgIH1cbiAgICAvLyBhIGNvbXBvc2l0ZSB3aWxsIGNvbnRhaW4gdGhlIFwid29yc3RcIiBjYXNlIGFzIHRoZSB2YWx1ZUZvcm1hdHRlZCxcbiAgICAvLyBhbmQgd2lsbCBoYXZlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiB0aGUgY29tcG9zaXRlIGluY2x1ZGVkLlxuICAgIC8vIGFzIGZyYW1lcyBpbmNyZW1lbnQgZmluZCBhIHRyaWdnZXJlZCBtZW1iZXIgc3RhcnRpbmcgZnJvbSB0aGUgZnJhbWUgbW9kIGxlblxuICAgIGxldCBsZW4gPSBkYXRhLm1lbWJlcnMubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICBsZXQgdHJpZ2dlcmVkSW5kZXggPSAtMTtcbiAgICAgIGlmIChkYXRhLmFuaW1hdGVNb2RlID09PSBcImFsbFwiKSB7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZnJhbWVzICUgbGVuO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBhbGwgbW9kZTogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEudHJpZ2dlckNhY2hlKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGRhdGEudHJpZ2dlckNhY2hlID0gdGhpcy5idWlsZFRyaWdnZXJDYWNoZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeiA9IGZyYW1lcyAlIGRhdGEudHJpZ2dlckNhY2hlLmxlbmd0aDtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBkYXRhLnRyaWdnZXJDYWNoZVt6XS5pbmRleDtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gY2FjaGUgaXM6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfVxuICAgICAgbGV0IGFNZW1iZXIgPSBkYXRhLm1lbWJlcnNbdHJpZ2dlcmVkSW5kZXhdO1xuXG4gICAgICBjb250ZW50ID0gYU1lbWJlci5uYW1lICsgXCI6IFwiICsgYU1lbWJlci52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIGlmICgoYU1lbWJlci5wcmVmaXgpICYmIChhTWVtYmVyLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gYU1lbWJlci5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoKGFNZW1iZXIuc3VmZml4KSAmJiAoYU1lbWJlci5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGFNZW1iZXIuc3VmZml4O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhbGxvdyB0ZW1wbGF0aW5nXG4gICAgLy9cbiAgICBpZiAoKGNvbnRlbnQpICYmIChjb250ZW50Lmxlbmd0aCA+IDApKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVwbGFjZWRDb250ZW50ID0gdGhpc1JlZi50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoY29udGVudCk7XG4gICAgICAgIGNvbnRlbnQgPSByZXBsYWNlZENvbnRlbnQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogdGVtcGxhdGUgc2VydmVyIHRocmV3IGVycm9yOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgYnVpbGRUcmlnZ2VyQ2FjaGUoaXRlbSkge1xuICAgIC8vY29uc29sZS5sb2coXCJCdWlsZGluZyB0cmlnZ2VyIGNhY2hlIGZvciBpdGVtXCIpO1xuICAgIGxldCB0cmlnZ2VyQ2FjaGUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGFNZW1iZXIgPSBpdGVtLm1lbWJlcnNbaV07XG4gICAgICBpZiAoYU1lbWJlci50aHJlc2hvbGRMZXZlbCA+IDApIHtcbiAgICAgICAgLy8gYWRkIHRvIGxpc3RcbiAgICAgICAgbGV0IGNhY2hlZE1lbWJlclN0YXRlID0geyBpbmRleDogaSwgbmFtZTogYU1lbWJlci5uYW1lLCB2YWx1ZTogYU1lbWJlci52YWx1ZSwgdGhyZXNob2xkTGV2ZWw6IGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgfTtcbiAgICAgICAgdHJpZ2dlckNhY2hlLnB1c2goY2FjaGVkTWVtYmVyU3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzb3J0IGl0XG4gICAgdHJpZ2dlckNhY2hlID0gXy5vcmRlckJ5KHRyaWdnZXJDYWNoZSwgW1widGhyZXNob2xkTGV2ZWxcIiwgXCJ2YWx1ZVwiLCBcIm5hbWVcIl0sIFtcImRlc2NcIiwgXCJkZXNjXCIsIFwiYXNjXCJdKTtcbiAgICByZXR1cm4gdHJpZ2dlckNhY2hlO1xuICB9XG5cbiAgZ2V0QXV0b0hleFJhZGl1cygpOiBudW1iZXIge1xuICAgIC8vVGhlIG1heGltdW0gcmFkaXVzIHRoZSBoZXhhZ29ucyBjYW4gaGF2ZSB0byBzdGlsbCBmaXQgdGhlIHNjcmVlblxuICAgIHZhciBoZXhSYWRpdXMgPSBkMy5taW4oXG4gICAgICBbXG4gICAgICAgIHRoaXMub3B0LndpZHRoIC8gKCh0aGlzLm51bUNvbHVtbnMgKyAwLjUpICogTWF0aC5zcXJ0KDMpKSxcbiAgICAgICAgdGhpcy5vcHQuaGVpZ2h0IC8gKCh0aGlzLm51bVJvd3MgKyAxIC8gMykgKiAxLjUpXG4gICAgICBdXG4gICAgKTtcbiAgICByZXR1cm4gaGV4UmFkaXVzO1xuICB9XG5cbiAgY2FsY3VsYXRlU1ZHU2l6ZSgpIHtcbiAgICAvLyBUaGUgaGVpZ2h0IG9mIHRoZSB0b3RhbCBkaXNwbGF5IHdpbGwgYmVcbiAgICAvLyB0aGlzLmF1dG9IZWlnaHQgPSB0aGlzLm51bVJvd3MgKiAzIC8gMiAqIHRoaXMuaGV4UmFkaXVzICsgMSAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICAvLyB3aGljaCBpcyB0aGUgc2FtZSBhc1xuICAgIHRoaXMuYXV0b0hlaWdodCA9ICh0aGlzLm51bVJvd3MgKyAxIC8gMykgKiAzIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIHRoaXMuYXV0b0hlaWdodCAtPSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG9oZWlnaHQgPSBcIiArIHRoaXMuYXV0b0hlaWdodCk7XG4gICAgLy8gVGhlIHdpZHRoIG9mIHRoZSB0b3RhbCBkaXNwbGF5IHdpbGwgYmVcbiAgICAvLyB0aGlzLmF1dG9XaWR0aCA9IHRoaXMubnVtQ29sdW1ucyAqIE1hdGguc3FydCgzKSAqIHRoaXMuaGV4UmFkaXVzICsgTWF0aC5zcXJ0KDMpIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIC8vIHdoaWNoIGlzIHRoZSBzYW1lIGFzXG4gICAgdGhpcy5hdXRvV2lkdGggPSAodGhpcy5udW1Db2x1bW5zICsgMSAvIDIpICogTWF0aC5zcXJ0KDMpICogdGhpcy5oZXhSYWRpdXM7XG4gICAgdGhpcy5hdXRvV2lkdGggLT0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIC8vY29uc29sZS5sb2coXCJhdXRvd2lkdGggPSBcIiArIHRoaXMuYXV0b1dpZHRoICsgXCIgYXV0b2hlaWdodCA9IFwiICsgdGhpcy5hdXRvSGVpZ2h0KTtcbiAgfVxuXG4gIC8vIEJ1aWxkcyB0aGUgcGxhY2Vob2xkZXIgcG9seWdvbnMgbmVlZGVkIHRvIHJlcHJlc2VudCBlYWNoIG1ldHJpY1xuICBnZW5lcmF0ZVBvaW50cygpIDogYW55IHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgaWYgKHR5cGVvZih0aGlzLmRhdGEpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBsZXQgbWF4Um93c1VzZWQgPSAwO1xuICAgIGxldCBjb2x1bW5zVXNlZCA9IDA7XG4gICAgbGV0IG1heENvbHVtbnNVc2VkID0gMDtcbiAgICAvLyB3aGVuIGR1cGxpY2F0aW5nIHBhbmVscywgdGhpcyBnZXRzIG9kZFxuICAgIGlmICh0aGlzLm51bVJvd3MgPT09IEluZmluaXR5KSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwibnVtUm93cyBpbmZpbml0eS4uLlwiKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPT09IE5hTikge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm51bUNvbHVtbnMgTmFOXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bVJvd3M7IGkrKykge1xuICAgICAgaWYgKChwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgIG1heFJvd3NVc2VkICs9IDE7XG4gICAgICAgIGNvbHVtbnNVc2VkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm51bUNvbHVtbnM7IGorKykge1xuICAgICAgICAgIGlmICgocG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICAgICAgY29sdW1uc1VzZWQgKz0gMTtcbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBtb3N0IG51bWJlciBvZiBjb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29sdW1uc1VzZWQgPiBtYXhDb2x1bW5zVXNlZCkge1xuICAgICAgICAgICAgICBtYXhDb2x1bW5zVXNlZCA9IGNvbHVtbnNVc2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3RoaXMuaGV4UmFkaXVzICogaiAqIDEuNzUsIHRoaXMuaGV4UmFkaXVzICogaSAqIDEuNV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiTWF4IHJvd3MgdXNlZDpcIiArIG1heFJvd3NVc2VkKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQWN0dWFsIGNvbHVtbnMgdXNlZDpcIiArIG1heENvbHVtbnNVc2VkKTtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gbWF4Um93c1VzZWQ7XG4gICAgdGhpcy5tYXhDb2x1bW5zVXNlZCA9IG1heENvbHVtbnNVc2VkO1xuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxufVxuIl19