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
                            this.numColumns = Math.ceil((this.opt.width / this.opt.height) * squared);
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
                            this.numRows = Math.ceil(this.data.length / this.numColumns);
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                        }
                        else {
                            this.numRows = Math.ceil((this.opt.height / this.opt.width) * squared);
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                            this.numColumns = Math.ceil(this.data.length / this.numRows);
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
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
                        var estimateLabelFontSize = utils_1.getTextSizeForWidthAndHeight(maxLabel, "?px sans-serif", shapeWidth, shapeHeight / 3, 8, this.maxFont);
                        activeLabelFontSize = estimateLabelFontSize;
                        var maxValue = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].valueFormatted.length > maxValue.length) {
                                maxValue = this.data[i].valueFormatted;
                            }
                        }
                        var estimateValueFontSize = utils_1.getTextSizeForWidthAndHeight(maxValue, "?px sans-serif", shapeWidth, shapeHeight / 3, 8, this.maxFont);
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
                    var bottomTextAlignement = (dynamicLabelFontSize + dynamicValueFontSize) / 2;
                    var topTextAlignment = -((dynamicValueFontSize - dynamicLabelFontSize) / 2);
                    textspot.enter()
                        .append("text")
                        .attr("class", "toplabel")
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y + topTextAlignment; })
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
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y + bottomTextAlignement; })
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
                    var radiusFromWidth = (2 * this.opt.width) / (Math.sqrt(3) * (1 + 2 * this.numColumns));
                    var radiusFromHeight = (2 * this.opt.height) / (3 * this.numRows + 1);
                    var hexRadius = d3.min([
                        radiusFromWidth,
                        radiusFromHeight
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBRUQ7Z0JBd0JFLG1CQUFZLFdBQWdCLEVBQUUsWUFBaUIsRUFBRSxPQUFZLEVBQUUsR0FBUTtvQkFIdkUsWUFBTyxHQUFHLEdBQUcsQ0FBQztvQkFJWixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO29CQUVmLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFMUMsSUFBSSxDQUFDLE1BQU0sR0FB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SSxXQUFXLEdBQUcsY0FBYyxFQUFFO3dDQUNoQyxjQUFjLEdBQUcsV0FBVyxDQUFDO3FDQUM5QjtvQ0FDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUNBQ3BFOzZCQUNGO3lCQUNGO3FCQUNGO29CQUdELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztvQkFDckMsT0FBTyxNQUFNLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRUgsZ0JBQUM7WUFBRCxDQUFDLEFBdHNCRCxJQXNzQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZDMtaGV4YmluL2luZGV4LmQudHNcIiAvPlxuLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzL2luZGV4LmQudHNcIiAvPlxuaW1wb3J0ICogYXMgZDMgZnJvbSBcIi4vZXh0ZXJuYWwvZDMubWluLmpzXCI7XG5pbXBvcnQgKiBhcyBkM2hleGJpbiBmcm9tIFwiLi9leHRlcm5hbC9kMy1oZXhiaW4uanNcIjtcbmltcG9ydCB7IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5mdW5jdGlvbiByZXNvbHZlQ2xpY2tUaHJvdWdoVVJMKGQgOiBhbnkpIDogc3RyaW5nIHtcbiAgbGV0IGNsaWNrVGhyb3VnaFVSTCA9IGQuY2xpY2tUaHJvdWdoO1xuICBpZiAoZC5zYW5pdGl6ZVVSTEVuYWJsZWQgPT09IHRydWUgJiYgZC5zYW5pdGl6ZWRVUkwubGVuZ3RoID4gMCkge1xuICAgIGNsaWNrVGhyb3VnaFVSTCA9IGQuc2FuaXRpemVkVVJMO1xuICB9XG4gIHJldHVybiBjbGlja1Rocm91Z2hVUkw7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDbGlja1Rocm91Z2hUYXJnZXQoZCA6IGFueSkgOiBzdHJpbmcge1xuICBsZXQgY2xpY2tUaHJvdWdoVGFyZ2V0ID0gXCJfc2VsZlwiO1xuICBpZiAoZC5uZXdUYWJFbmFibGVkID09PSB0cnVlKSB7XG4gICAgY2xpY2tUaHJvdWdoVGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgfVxuICByZXR1cm4gY2xpY2tUaHJvdWdoVGFyZ2V0O1xufVxuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIGQzRGl2SWQ6IGFueTtcbiAgbWF4Q29sdW1uc1VzZWQ6IG51bWJlcjtcbiAgbWF4Um93c1VzZWQ6IG51bWJlcjtcbiAgb3B0OiBhbnk7XG4gIGRhdGE6IGFueTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgY2FsY3VsYXRlZFBvaW50czogYW55O1xuICBoZXhSYWRpdXM6IG51bWJlcjtcbiAgYXV0b0hleFJhZGl1cyA6IG51bWJlcjtcbiAgYXV0b1dpZHRoIDogbnVtYmVyO1xuICBhdXRvSGVpZ2h0OiBudW1iZXI7XG4gIG51bUNvbHVtbnM6IG51bWJlcjtcbiAgbnVtUm93czogbnVtYmVyO1xuICBtYXJnaW46IHtcbiAgICB0b3A6IG51bWJlcixcbiAgICByaWdodCA6IG51bWJlcixcbiAgICBib3R0b20gOiBudW1iZXIsXG4gICAgbGVmdCA6IG51bWJlcixcbiAgfTtcbiAgbWF4Rm9udCA9IDI0MDtcbiAgcHVyZWxpZ2h0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVTcnY6IGFueSwgc3ZnQ29udGFpbmVyOiBhbnksIGQzRGl2SWQ6IGFueSwgb3B0OiBhbnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBzdmdDb250YWluZXI7XG4gICAgdGhpcy5kM0RpdklkID0gZDNEaXZJZDtcbiAgICB0aGlzLmRhdGEgPSBvcHQuZGF0YTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcblxuICAgIHRoaXMucHVyZWxpZ2h0ID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpO1xuICAgIC8vIHRpdGxlIGlzIDI2cHhcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogMzAgKyAyNixcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgYm90dG9tOiAyMCxcbiAgICAgIGxlZnQ6IDUwXG4gICAgfTtcbiAgICAvLyB0YWtlIDEwIG9mZiB0aGUgaGVpZ2h0XG4gICAgdGhpcy5vcHQuaGVpZ2h0IC09IDEwO1xuICAgIHRoaXMub3B0LndpZHRoIC09IDIwO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0LmRhdGE7XG4gICAgdGhpcy5udW1Db2x1bW5zID0gNTtcbiAgICB0aGlzLm51bVJvd3MgPSA1O1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSAwO1xuICAgIGlmIChvcHQucm93QXV0b1NpemUgJiYgb3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm51bUNvbHVtbnMgPSBvcHQuY29sdW1ucyB8fCA2O1xuICAgICAgdGhpcy5udW1Sb3dzID0gb3B0LnJvd3MgfHwgNjtcbiAgICB9XG4gICAgaWYgKCghb3B0LnJhZGl1c0F1dG9TaXplKSAmJiAob3B0LnJhZGl1cykpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vIHx8IDUwO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vfHwgNTA7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLm9wdC5yb3dBdXRvU2l6ZSAmJiB0aGlzLm9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgLy8gc3FydCBvZiAjIGRhdGEgaXRlbXNcbiAgICAgIGxldCBzcXVhcmVkID0gTWF0aC5zcXJ0KHRoaXMuZGF0YS5sZW5ndGgpO1xuICAgICAgLy8gZmF2b3IgY29sdW1ucyB3aGVuIHdpZHRoIGlzIGdyZWF0ZXIgdGhhbiBoZWlnaHRcbiAgICAgIC8vIGZhdm9yIHJvd3Mgd2hlbiB3aWR0aCBpcyBsZXNzIHRoYW4gaGVpZ2h0XG4gICAgICBpZiAodGhpcy5vcHQud2lkdGggPiB0aGlzLm9wdC5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKCh0aGlzLm9wdC53aWR0aCAvIHRoaXMub3B0LmhlaWdodCkgKiBzcXVhcmVkKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbGlnbiByb3dzIGNvdW50IHRvIGNvbXB1dGVkIGNvbHVtbnMgY291bnRcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3dcbiAgICAgICAgaWYgKHRoaXMubnVtUm93cyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwoKHRoaXMub3B0LmhlaWdodCAvIHRoaXMub3B0LndpZHRoKSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3dcbiAgICAgICAgaWYgKHRoaXMubnVtUm93cyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFsaWduIGNvbHVubnMgY291bnQgdG8gY29tcHV0ZWQgcm93cyBjb3VudFxuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtUm93cyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIGNvbHVtblxuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIkNhbGN1bGF0ZWQgY29sdW1ucyA9IFwiICsgdGhpcy5udW1Db2x1bW5zKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCByb3dzID0gXCIgKyB0aGlzLm51bVJvd3MpO1xuICAgIC8vY29uc29sZS5sb2coXCJOdW1iZXIgb2YgZGF0YSBpdGVtcyB0byByZW5kZXIgPSBcIiArIHRoaXMuZGF0YS5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMub3B0LnJhZGl1c0F1dG9TaXplKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiYXV0b0hleFJhZGl1czpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcblxuICAgIHZhciB3aWR0aCA9IHRoaXMub3B0LndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLm9wdC5oZWlnaHQ7XG4gICAgLy9jb25zb2xlLmxvZyhcIkRldGVjdGVkIFdpZHRoOiBcIiArIHdpZHRoICsgXCIgSGVpZ2h0OiBcIiArIGhlaWdodCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG9yYWQ6XCIgKyB0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgIHZhciBhaGV4YmluID0gZDNoZXhiaW5cbiAgICAgIC5oZXhiaW4oKVxuICAgICAgLnJhZGl1cyh0aGlzLmF1dG9IZXhSYWRpdXMpXG4gICAgICAuZXh0ZW50KFtbMCwgMF0sIFt3aWR0aCwgaGVpZ2h0XV0pO1xuXG4gICAgLy8gZDMgY2FsY3VsYXRlcyB0aGUgcmFkaXVzIGZvciB4IGFuZCB5IHNlcGFyYXRlbHkgYmFzZWQgb24gdGhlIHZhbHVlIHBhc3NlZCBpblxuICAgIHZhciB0aGlyZFBpID0gTWF0aC5QSSAvIDM7XG4gICAgbGV0IGRpYW1ldGVyWCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDIgKiBNYXRoLnNpbih0aGlyZFBpKTtcbiAgICBsZXQgZGlhbWV0ZXJZID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMS41O1xuICAgIGxldCByYWRpdXNYID0gZGlhbWV0ZXJYIC8gMjtcbiAgICBsZXQgcmVuZGVyV2lkdGggPSB0aGlzLm1heENvbHVtbnNVc2VkICogZGlhbWV0ZXJYO1xuICAgIC8vIHJlbmRlckhlaWdodCBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSAjcm93cyB1c2VkLCBhbmRcbiAgICAvLyB0aGUgXCJzcGFjZVwiIHRha2VuIGJ5IHRoZSBoZXhhZ29ucyBpbnRlcmxlYXZlZFxuICAgIC8vIHNwYWNlIHRha2VuIGlzIDIvMyBvZiBkaWFtZXRlclkgKiAjIHJvd3NcbiAgICBsZXQgcmVuZGVySGVpZ2h0ID0gKHRoaXMubWF4Um93c1VzZWQgKiBkaWFtZXRlclkpICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgLy8gZGlmZmVyZW5jZSBvZiB3aWR0aCBhbmQgcmVuZGVyd2lkdGggaXMgb3VyIHBsYXkgcm9vbSwgc3BsaXQgdGhhdCBpbiBoYWxmXG4gICAgLy8gb2Zmc2V0IGlzIGZyb20gY2VudGVyIG9mIGhleGFnb24sIG5vdCBmcm9tIHRoZSBlZGdlXG4gICAgbGV0IHhvZmZzZXQgPSAod2lkdGggLSByZW5kZXJXaWR0aCArIHJhZGl1c1gpIC8gMjtcbiAgICAvLyBpZiB0aGVyZSBpcyBqdXN0IG9uZSBjb2x1bW4gYW5kIG9uZSByb3csIGNlbnRlciBpdFxuICAgIGlmICh0aGlzLm51bVJvd3MgPT09IDEpIHtcbiAgICAgIHJlbmRlckhlaWdodCA9IGRpYW1ldGVyWSArIChkaWFtZXRlclkgKiAuMzMpO1xuICAgICAgeG9mZnNldCA9ICgod2lkdGggLSByZW5kZXJXaWR0aCkgLyAyKSArIHJhZGl1c1g7XG4gICAgfVxuICAgIC8vIHkgZGlhbWV0ZXIgb2YgaGV4YWdvbiBpcyBsYXJnZXIgdGhhbiB4IGRpYW1ldGVyXG4gICAgbGV0IHlvZmZzZXQgPSAoKGhlaWdodCAtIHJlbmRlckhlaWdodCkgLyAyKSArIChkaWFtZXRlclkgKiAuNjYpO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBkaXYgZm9yIHRoZSB0b29sdGlwXG4gICAgLy8gYWRkIGl0IHRvIHRoZSBib2R5IGFuZCBub3QgdGhlIGNvbnRhaW5lciBzbyBpdCBjYW4gZmxvYXQgb3V0c2lkZSBvZiB0aGUgcGFuZWxcbiAgICB2YXIgdG9vbHRpcCA9IGQzXG4gICAgICAuc2VsZWN0KFwiYm9keVwiKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwicG9seXN0YXQtcGFuZWwtdG9vbHRpcFwiKVxuICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICB2YXIgc3ZnIDogYW55ID0gZDMuc2VsZWN0KHRoaXMuc3ZnQ29udGFpbmVyKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgIC5hdHRyKFwieG1sbnM6eGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwiYm9yZGVyXCIsIFwiMHB4IHNvbGlkIHdoaXRlXCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHhvZmZzZXQgKyBcIixcIiArIHlvZmZzZXQgKyBcIilcIik7XG5cbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICB2YXIgZGVmcyA9IHN2Zy5hcHBlbmQoXCJkZWZzXCIpO1xuXG4gICAgbGV0IGNvbG9yR3JhZGllbnRzID0gQ29sb3IuY3JlYXRlR3JhZGllbnRzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JHcmFkaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJOYW1lID0gXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBsZXQgYUdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjb2xvckdyYWRpZW50c1tpXS5zdGFydCk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uZW5kKTtcbiAgICB9XG4gICAgbGV0IG9rQ29sb3JTdGFydCA9IG5ldyBDb2xvcig4MiwgMTk0LCA1Mik7IC8vICM1MmMyMzRcbiAgICBsZXQgb2tDb2xvckVuZCA9IG9rQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IG9rR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLW9rXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvclN0YXJ0LmFzSGV4KCkpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvckVuZC5hc0hleCgpKTtcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNKdWljeU9yYW5nZVxuICAgIGxldCB3YXJuaW5nQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyNTUsIDIwMCwgNTUpOyAvLyAjRkZDODM3XG4gICAgbGV0IHdhcm5pbmdDb2xvckVuZCA9IHdhcm5pbmdDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgd2FybmluZ0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXdhcm5pbmdcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgd2FybmluZ0NvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IG9yYW5nZVxuICAgIHdhcm5pbmdHcmFkaWVudC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayBvcmFuZ2VcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNZb3VUdWJlXG4gICAgbGV0IGNyaXRpY2FsQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyMjksIDQ1LCAzOSk7IC8vIGU1MmQyN1xuICAgIGxldCBjcml0aWNhbENvbG9yRW5kID0gY3JpdGljYWxDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgY3JpdGljYWxHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtY3JpdGljYWxcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjcml0aWNhbENvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IHJlZFxuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayByZWRcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNBc2hcbiAgICBsZXQgdW5rbm93bkdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS11bmtub3duXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzczODA4QVwiKTsgLy8gbGlnaHQgZ3JleVxuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3NTdGOUFcIik7IC8vIGRhcmsgZ3JleVxuXG4gICAgbGV0IGN1c3RvbVNoYXBlID0gbnVsbDtcbiAgICAvLyB0aGlzIGlzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBmb250c2l6ZVxuICAgIGxldCBzaGFwZVdpZHRoID0gZGlhbWV0ZXJYO1xuICAgIGxldCBzaGFwZUhlaWdodCA9IGRpYW1ldGVyWTtcbiAgICAvLyBzeW1ib2xzIHVzZSB0aGUgYXJlYSBmb3IgdGhlaXIgc2l6ZVxuICAgIGxldCBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclk7XG4gICAgLy8gdXNlIHRoZSBzbWFsbGVyIG9mIGRpYW1ldGVyWCBvciBZXG4gICAgaWYgKGRpYW1ldGVyWCA8IGRpYW1ldGVyWSkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJYO1xuICAgIH1cbiAgICBpZiAoZGlhbWV0ZXJZIDwgZGlhbWV0ZXJYKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclkgKiBkaWFtZXRlclk7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBkMy5zeW1ib2woKS5zaXplKGlubmVyQXJlYSk7XG4gICAgc3dpdGNoICh0aGlzLm9wdC5wb2x5c3RhdC5zaGFwZSkge1xuICAgICAgY2FzZSBcImhleGFnb25fcG9pbnRlZF90b3BcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgc2hhcGVXaWR0aCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhleGFnb25fZmxhdF90b3BcIjpcbiAgICAgICAgLy8gVE9ETzogdXNlIHBvaW50ZWQgZm9yIG5vd1xuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBzaGFwZVdpZHRoID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2lyY2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ2lyY2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDcm9zcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRpYW1vbmRcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xEaWFtb25kKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3F1YXJlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3F1YXJlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RhclwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFN0YXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlhbmdsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFRyaWFuZ2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid3llXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sV3llKTtcbiAgICAgICAgYnJlYWs7XG4gICAgIGRlZmF1bHQ6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgZm9udHNpemUgYmFzZWQgb24gdGhlIHNoYXBlIGFuZCB0aGUgdGV4dFxuICAgIGxldCBhY3RpdmVMYWJlbEZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgLy8gZm9udCBzaXplcyBhcmUgaW5kZXBlbmRlbnQgZm9yIGxhYmVsIGFuZCB2YWx1ZXNcbiAgICBsZXQgYWN0aXZlVmFsdWVGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuICAgIGxldCBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gXCJcIjtcblxuICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5mb250QXV0b1NjYWxlKSB7XG4gICAgICAvLyBmaW5kIHRoZSBtb3N0IHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBvdmVyIGFsbCBpdGVtc1xuICAgICAgbGV0IG1heExhYmVsID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaV0ubmFtZS5sZW5ndGggPiBtYXhMYWJlbC5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhMYWJlbCA9IHRoaXMuZGF0YVtpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBlc3RpbWF0ZSBob3cgYmlnIG9mIGEgZm9udCBjYW4gYmUgdXNlZFxuICAgICAgLy8gVHdvIGxpbmVzIG9mIHRleHQgbXVzdCBmaXQgd2l0aCB2ZXJ0aWNhbCBzcGFjaW5nIGluY2x1ZGVkXG4gICAgICAvLyBpZiBpdCBpcyB0b28gc21hbGwsIGhpZGUgZXZlcnl0aGluZ1xuICAgICAgbGV0IGVzdGltYXRlTGFiZWxGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgIG1heExhYmVsLFxuICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsIC8vIHVzZSBzYW5zLXNlcmlmIGZvciBzaXppbmdcbiAgICAgICAgc2hhcGVXaWR0aCxcbiAgICAgICAgc2hhcGVIZWlnaHQgLyAzLCAvLyB0b3AgYW5kIGJvdHRvbSBvZiBoZXhhZ29uIG5vdCB1c2VkLCBhbmQgdHdvIGxpbmVzIG9mIHRleHRcbiAgICAgICAgOCxcbiAgICAgICAgdGhpcy5tYXhGb250KTtcblxuICAgICAgLy9jb25zb2xlLmxvZyhcIkNhbGM6IEVzdGltYXRlZCBMYWJlbCBGb250IFNpemU6IFwiICsgZXN0aW1hdGVMYWJlbEZvbnRTaXplKTtcbiAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSBlc3RpbWF0ZUxhYmVsRm9udFNpemU7XG4gICAgICAvLyBzYW1lIGZvciB0aGUgdmFsdWVcbiAgICAgIGxldCBtYXhWYWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcIiArIHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZCArIFwiIHZzOiBcIiArIG1heFZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZC5sZW5ndGggPiBtYXhWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhWYWx1ZSA9IHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy9jb25zb2xlLmxvZyhcIk1heCBWYWx1ZTogXCIgKyBtYXhWYWx1ZSk7XG4gICAgICBsZXQgZXN0aW1hdGVWYWx1ZUZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgICAgbWF4VmFsdWUsXG4gICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIiwgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICBzaGFwZVdpZHRoLFxuICAgICAgICBzaGFwZUhlaWdodCAvIDMsIC8vIHRvcCBhbmQgYm90dG9tIG9mIGhleGFnb24gbm90IHVzZWQsIGFuZCB0d28gbGluZXMgb2YgdGV4dFxuICAgICAgICA4LFxuICAgICAgICB0aGlzLm1heEZvbnQpO1xuICAgICAgYWN0aXZlVmFsdWVGb250U2l6ZSA9IGVzdGltYXRlVmFsdWVGb250U2l6ZTtcbiAgICAgIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQgPSBtYXhWYWx1ZTtcbiAgICB9XG5cbiAgICBzdmcuc2VsZWN0QWxsKFwiLmhleGFnb25cIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuZWFjaCgoXywgaSwgbm9kZXMpID0+IHtcbiAgICAgICAgbGV0IG5vZGUgPSBkMy5zZWxlY3Qobm9kZXNbaV0pO1xuICAgICAgICBsZXQgY2xpY2tUaHJvdWdoVVJMID0gcmVzb2x2ZUNsaWNrVGhyb3VnaFVSTChkYXRhW2ldKTtcbiAgICAgICAgaWYgKGNsaWNrVGhyb3VnaFVSTC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGUuYXBwZW5kKFwiYVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0YXJnZXRcIiwgcmVzb2x2ZUNsaWNrVGhyb3VnaFRhcmdldChkYXRhW2ldKSlcbiAgICAgICAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBjbGlja1Rocm91Z2hVUkwpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWxsQ29sb3IgPSBkYXRhW2ldLmNvbG9yO1xuICAgICAgICBpZiAodGhpcy5vcHQucG9seXN0YXQuZ3JhZGllbnRFbmFibGVkKSB7XG4gICAgICAgICAgLy8gc2FmYXJpIG5lZWRzIHRoZSBsb2NhdGlvbi5ocmVmXG4gICAgICAgICAgZmlsbENvbG9yID0gXCJ1cmwoXCIgKyBsb2NhdGlvbi5ocmVmICsgXCIjXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJoZXhhZ29uXCIpXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjsgfSlcbiAgICAgICAgICAuYXR0cihcImRcIiwgY3VzdG9tU2hhcGUpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yKVxuICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMub3B0LnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJTaXplICsgXCJweFwiKVxuICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZmlsbENvbG9yKVxuICAgICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyB1c2UgdGhlIHZpZXdwb3J0d2lkdGggdG8gcHJldmVudCB0aGUgdG9vbHRpcCBmcm9tIGdvaW5nIHRvbyBmYXIgcmlnaHRcbiAgICAgICAgICAgIGxldCB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgbW91c2UgcG9zaXRpb24gZm9yIHRoZSBlbnRpcmUgcGFnZVxuICAgICAgICAgICAgdmFyIG1vdXNlID0gZDMubW91c2UoZDMuc2VsZWN0KFwiYm9keVwiKS5ub2RlKCkpO1xuICAgICAgICAgICAgdmFyIHhwb3MgPSBtb3VzZVswXSAtIDUwO1xuICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgb2Zmc2NyZWVuIHRvb2x0aXBcbiAgICAgICAgICAgIGlmICh4cG9zIDwgMCkge1xuICAgICAgICAgICAgICB4cG9zID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHByZXZlbnQgdG9vbHRpcCBmcm9tIHJlbmRlcmluZyBvdXRzaWRlIG9mIHZpZXdwb3J0XG4gICAgICAgICAgICBpZiAoKHhwb3MgKyAyMDApID4gdmlld1BvcnRXaWR0aCkge1xuICAgICAgICAgICAgICB4cG9zID0gdmlld1BvcnRXaWR0aCAtIDIwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5cG9zID0gbW91c2VbMV0gKyA1O1xuICAgICAgICAgICAgdG9vbHRpcFxuICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIHhwb3MgKyBcInB4XCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCB5cG9zICsgXCJweFwiKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCAoZCkgPT4ge1xuICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5zdHlsZShcIm9wYWNpdHlcIiwgMC45KTtcbiAgICAgICAgICAgIHRvb2x0aXAuaHRtbCh0aGlzLm9wdC50b29sdGlwQ29udGVudFtpXSlcbiAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHRoaXMub3B0LnRvb2x0aXBGb250U2l6ZSlcbiAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRUeXBlKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkLnggLSA1KSArIFwicHhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkLnkgLSA1KSArIFwicHhcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgLy8gbm93IGxhYmVsc1xuICAgIHZhciB0ZXh0c3BvdCA9IHN2Zy5zZWxlY3RBbGwoXCJ0ZXh0LnRvcGxhYmVsXCIpXG4gICAgICAuZGF0YShhaGV4YmluKHRoaXMuY2FsY3VsYXRlZFBvaW50cykpO1xuICAgIGxldCBkeW5hbWljTGFiZWxGb250U2l6ZSA9IGFjdGl2ZUxhYmVsRm9udFNpemU7XG4gICAgbGV0IGR5bmFtaWNWYWx1ZUZvbnRTaXplID0gYWN0aXZlVmFsdWVGb250U2l6ZTtcblxuICAgIC8vIENvbXB1dGUgYWxpZ25tZW50IGZvciBlYWNoIHRleHQgZWxlbWVudCwgYmFzZSBjb29yZGluYXRlIGlzIGF0IHRoZSBjZW50ZXIgb2YgdGhlIHBvbHlnb24gKHRleHQgaXMgYW5jaG9yZWQgYXQgaXRzIGJvdHRvbSk6XG4gICAgLy8gLSBWYWx1ZSB0ZXh0IChib3R0b20gdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChwb3NpdGl2ZWx5IGkuZS4gbG93ZXIpIGV4YWN0bHkgb24gdGhlIGJvdHRvbSBvZiBibG9jazpcbiAgICAvLyAgICAgKGxhYmVsU2l6ZSArIHZhbHVlU2l6ZSkgLyAyXG4gICAgLy8gLSBMYWJlbCB0ZXh0ICh0b3AgdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChuZWdhdGl2ZWx5LCBpLmUuIGhpZ2hlcikgdG8gdG9wIG9mIHRoZSBibG9jayBtaW51cyBpdHMgb3duIHNpemU6XG4gICAgLy8gICAgIChsYWJlbFNpemUgKyB2YWx1ZVNpemUpIC8gMiAtIGxhYmVsU2l6ZSA9PSAodmFsdWVTaXplIC0gbGFiZWxTaXplKSAvIDJcbiAgICAvL1xuICAgIC8vIE5COiBkbyBub3QgZm9yY2UgcGFkZGluZyBpbiB0aGlzIGZvcm11bGEsIGl0IHdpbGwgYmUgcmVuZGVyZWQgYnkgdGhlIGJyb3dzZXIgZnJvbSBDU1MuXG4gICAgbGV0IGJvdHRvbVRleHRBbGlnbmVtZW50ID0gKGR5bmFtaWNMYWJlbEZvbnRTaXplICsgZHluYW1pY1ZhbHVlRm9udFNpemUpIC8gMjtcbiAgICBsZXQgdG9wVGV4dEFsaWdubWVudCA9IC0oKGR5bmFtaWNWYWx1ZUZvbnRTaXplIC0gZHluYW1pY0xhYmVsRm9udFNpemUpIC8gMik7IC8vIGFsaWduZWQgbmVnYXRpdmVseVxuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b3BsYWJlbFwiKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueSArIHRvcFRleHRBbGlnbm1lbnQ7IH0pXG4gICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnBvbHlzdGF0LmZvbnRUeXBlKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpXG4gICAgICAudGV4dChmdW5jdGlvbiAoXywgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0XG4gICAgICAgIGlmICghKFwic2hvd05hbWVcIiBpbiBpdGVtKSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0uc2hvd05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHZhciBmcmFtZXMgPSAwO1xuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oXywgaSkge1xuICAgICAgICByZXR1cm4gXCJ2YWx1ZUxhYmVsXCIgKyBpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnkgKyBib3R0b21UZXh0QWxpZ25lbWVudDsgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KCAoXywgaSkgPT4ge1xuICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGJ1dCBub3QgbW9yZSB0aGFuIG51bWJlciBvZiBkYXRhIGl0ZW1zXG4gICAgICAgIC8vIG5lZWQgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb250ZW50IHN0cmluZyBnZW5lcmF0ZWQgdG8gZGV0ZXJtaW5lIHRoZVxuICAgICAgICAvLyBkeW5hbWljIGZvbnQgc2l6ZVxuICAgICAgICAvLyB0aGlzIGFsd2F5cyBzdGFydHMgZnJvbSBmcmFtZSAwLCBsb29rIHRocm91Z2ggZXZlcnkgbWV0cmljIGluY2x1ZGluZyBjb21wb3NpdGUgbWVtYmVycyBmb3IgdGhlIGxvbmdlc3QgdGV4dCBwb3NzaWJsZVxuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIGNvdW50IG9mIG1ldHJpY3MgKHdpdGggY29tcG9zaXRlIG1lbWJlcnMpLCBhbmQgbG9vcCB0aHJvdWdoXG4gICAgICAgIGxldCBzdWJtZXRyaWNDb3VudCA9IHRoaXMuZGF0YVtpXS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgLy9sZXQgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IFwiXCI7XG4gICAgICAgIGlmIChzdWJtZXRyaWNDb3VudCA+IDApIHtcbiAgICAgICAgICB3aGlsZSAoY291bnRlciA8IHN1Ym1ldHJpY0NvdW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoY2hlY2tDb250ZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGVja0NvbnRlbnQubGVuZ3RoID4gbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9Ly8gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLWNvbXBvc2l0ZXMgdXNlIHRoZSBmb3JtYXR0ZWQgc2l6ZSBvZiB0aGUgbWV0cmljIHZhbHVlXG4gICAgICAgIC8vICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQ6IFwiICsgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCk7XG4gICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlICgoY29udGVudCA9PT0gbnVsbCkgJiYgKGNvdW50ZXIgPCBkYXRhTGVuKSkge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCxcbiAgICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsICAvLyB1c2Ugc2Fucy1zZXJpZiBmb3Igc2l6aW5nXG4gICAgICAgICAgc2hhcGVXaWR0aCwgICAvLyBwYWRcbiAgICAgICAgICBzaGFwZUhlaWdodCAvIDMsXG4gICAgICAgICAgNixcbiAgICAgICAgICB0aGlzLm1heEZvbnQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2FsYzogRHluYW1pYyBWYWx1ZSBGb250IFNpemU6IFwiICsgZHluYW1pY1ZhbHVlRm9udFNpemUpO1xuXG4gICAgICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICAgICAgaWYgKGR5bmFtaWNWYWx1ZUZvbnRTaXplID4gZHluYW1pY0xhYmVsRm9udFNpemUpIHtcbiAgICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGR5bmFtaWNMYWJlbEZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhbmltYXRlZDogZHluYW1pY0xhYmVsRm9udFNpemU6IFwiICsgZHluYW1pY0xhYmVsRm9udFNpemUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGR5bmFtaWNWYWx1ZUZvbnRTaXplOiBcIiArIGR5bmFtaWNWYWx1ZUZvbnRTaXplKTtcbiAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgIC8vIHVzZSB0aGUgZHluYW1pYyBzaXplIGZvciB0aGUgdmFsdWVcbiAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgIGQzLmludGVydmFsKCAoKSA9PiB7XG4gICAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgICAgdmFyIGNvbXBvc2l0ZUluZGV4ID0gaTtcbiAgICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi50ZXh0KCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aCAqIDI7XG4gICAgICAgICAgICAvLyBzZWFyY2ggZm9yIGEgdmFsdWUgY3ljbGluZyB0aHJvdWdoIHR3aWNlIHRvIGFsbG93IHJvbGxvdmVyXG4gICAgICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGNvbXBvc2l0ZUluZGV4LCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBjdXN0b20gY29udGVudCBmb3IgY29tcG9zaXRlIG9rIHN0YXRlXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZvbnQgc2l6ZSB0byBiZSB0aGUgc2FtZSBhcyB0aGUgbGFiZWwgYWJvdmVcbiAgICAgICAgICAgICAgLy92YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGR5bmFtaWNWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZyYW1lcysrO1xuICAgICAgICB9LCB0aGlzLm9wdC5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfSk7XG4gIH1cblxuICBmb3JtYXRWYWx1ZUNvbnRlbnQoaSwgZnJhbWVzLCB0aGlzUmVmKTogc3RyaW5nIHtcbiAgICBsZXQgZGF0YSA9IHRoaXNSZWYuZGF0YVtpXTtcbiAgICAvLyBvcHRpb25zIGNhbiBzcGVjaWZ5IHRvIG5vdCBzaG93IHRoZSB2YWx1ZVxuICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic2hvd1ZhbHVlXCIpKSB7XG4gICAgICAgIGlmICghZGF0YS5zaG93VmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwidmFsdWVGb3JtYXR0ZWRcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIGRhdGEsIHJldHVybiBub3RoaW5nXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgc3dpdGNoIChkYXRhLmFuaW1hdGVNb2RlKSB7XG4gICAgICBjYXNlIFwiYWxsXCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWdnZXJlZFwiOlxuICAgICAgICAvLyByZXR1cm4gbm90aGluZyBpZiBtb2RlIGlzIHRyaWdnZXJlZCBhbmQgdGhlIHN0YXRlIGlzIDBcbiAgICAgICAgaWYgKGRhdGEudGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNvbnRlbnQgPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gdmFsdWVGb3JtYXR0ZWQsIHRoZXJlJ3Mgbm90aGluZyB0byBkaXNwbGF5XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnByZWZpeCkgJiYgKGRhdGEucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gZGF0YS5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgfVxuICAgIGlmICgoZGF0YS5zdWZmaXgpICYmIChkYXRhLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGRhdGEuc3VmZml4O1xuICAgIH1cbiAgICAvLyBhIGNvbXBvc2l0ZSB3aWxsIGNvbnRhaW4gdGhlIFwid29yc3RcIiBjYXNlIGFzIHRoZSB2YWx1ZUZvcm1hdHRlZCxcbiAgICAvLyBhbmQgd2lsbCBoYXZlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiB0aGUgY29tcG9zaXRlIGluY2x1ZGVkLlxuICAgIC8vIGFzIGZyYW1lcyBpbmNyZW1lbnQgZmluZCBhIHRyaWdnZXJlZCBtZW1iZXIgc3RhcnRpbmcgZnJvbSB0aGUgZnJhbWUgbW9kIGxlblxuICAgIGxldCBsZW4gPSBkYXRhLm1lbWJlcnMubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICBsZXQgdHJpZ2dlcmVkSW5kZXggPSAtMTtcbiAgICAgIGlmIChkYXRhLmFuaW1hdGVNb2RlID09PSBcImFsbFwiKSB7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZnJhbWVzICUgbGVuO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBhbGwgbW9kZTogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEudHJpZ2dlckNhY2hlKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGRhdGEudHJpZ2dlckNhY2hlID0gdGhpcy5idWlsZFRyaWdnZXJDYWNoZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeiA9IGZyYW1lcyAlIGRhdGEudHJpZ2dlckNhY2hlLmxlbmd0aDtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBkYXRhLnRyaWdnZXJDYWNoZVt6XS5pbmRleDtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gY2FjaGUgaXM6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfVxuICAgICAgbGV0IGFNZW1iZXIgPSBkYXRhLm1lbWJlcnNbdHJpZ2dlcmVkSW5kZXhdO1xuXG4gICAgICBjb250ZW50ID0gYU1lbWJlci5uYW1lICsgXCI6IFwiICsgYU1lbWJlci52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIGlmICgoYU1lbWJlci5wcmVmaXgpICYmIChhTWVtYmVyLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gYU1lbWJlci5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoKGFNZW1iZXIuc3VmZml4KSAmJiAoYU1lbWJlci5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGFNZW1iZXIuc3VmZml4O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhbGxvdyB0ZW1wbGF0aW5nXG4gICAgLy9cbiAgICBpZiAoKGNvbnRlbnQpICYmIChjb250ZW50Lmxlbmd0aCA+IDApKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVwbGFjZWRDb250ZW50ID0gdGhpc1JlZi50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoY29udGVudCk7XG4gICAgICAgIGNvbnRlbnQgPSByZXBsYWNlZENvbnRlbnQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogdGVtcGxhdGUgc2VydmVyIHRocmV3IGVycm9yOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgYnVpbGRUcmlnZ2VyQ2FjaGUoaXRlbSkge1xuICAgIC8vY29uc29sZS5sb2coXCJCdWlsZGluZyB0cmlnZ2VyIGNhY2hlIGZvciBpdGVtXCIpO1xuICAgIGxldCB0cmlnZ2VyQ2FjaGUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGFNZW1iZXIgPSBpdGVtLm1lbWJlcnNbaV07XG4gICAgICBpZiAoYU1lbWJlci50aHJlc2hvbGRMZXZlbCA+IDApIHtcbiAgICAgICAgLy8gYWRkIHRvIGxpc3RcbiAgICAgICAgbGV0IGNhY2hlZE1lbWJlclN0YXRlID0geyBpbmRleDogaSwgbmFtZTogYU1lbWJlci5uYW1lLCB2YWx1ZTogYU1lbWJlci52YWx1ZSwgdGhyZXNob2xkTGV2ZWw6IGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgfTtcbiAgICAgICAgdHJpZ2dlckNhY2hlLnB1c2goY2FjaGVkTWVtYmVyU3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzb3J0IGl0XG4gICAgdHJpZ2dlckNhY2hlID0gXy5vcmRlckJ5KHRyaWdnZXJDYWNoZSwgW1widGhyZXNob2xkTGV2ZWxcIiwgXCJ2YWx1ZVwiLCBcIm5hbWVcIl0sIFtcImRlc2NcIiwgXCJkZXNjXCIsIFwiYXNjXCJdKTtcbiAgICByZXR1cm4gdHJpZ2dlckNhY2hlO1xuICB9XG5cbiAgZ2V0QXV0b0hleFJhZGl1cygpOiBudW1iZXIge1xuICAgIC8vVGhlIG1heGltdW0gcmFkaXVzIHRoZSBoZXhhZ29ucyBjYW4gaGF2ZSB0byBzdGlsbCBmaXQgdGhlIHNjcmVlblxuICAgIC8vIFdpdGggKGxvbmcpIHJhZGl1cyBiZWluZyBSOlxuICAgIC8vIC0gVG90YWwgd2lkdGggKHJvd3MgPiAxKSA9IDEgc21hbGwgcmFkaXVzIChzcXJ0KDMpICogUiAvIDIpICsgY29sdW1ucyAqIHNtYWxsIGRpYW1ldGVyIChzcXJ0KDMpICogUilcbiAgICAvLyAtIFRvdGFsIGhlaWdodCA9IDEgcG9pbnR5IHRvcCAoMS8yICogUikgKyByb3dzICogc2l6ZSBvZiB0aGUgcmVzdCAoMy8yICogUilcbiAgICBsZXQgcmFkaXVzRnJvbVdpZHRoID0gKDIgKiB0aGlzLm9wdC53aWR0aCkgLyAoTWF0aC5zcXJ0KDMpICogKCAxICsgMiAqIHRoaXMubnVtQ29sdW1ucykpO1xuICAgIGxldCByYWRpdXNGcm9tSGVpZ2h0ID0gKDIgKiB0aGlzLm9wdC5oZWlnaHQpIC8gKDMgKiB0aGlzLm51bVJvd3MgKyAxKTtcbiAgICB2YXIgaGV4UmFkaXVzID0gZDMubWluKFxuICAgICAgW1xuICAgICAgICByYWRpdXNGcm9tV2lkdGgsXG4gICAgICAgIHJhZGl1c0Zyb21IZWlnaHRcbiAgICAgIF1cbiAgICApO1xuICAgIHJldHVybiBoZXhSYWRpdXM7XG4gIH1cblxuICBjYWxjdWxhdGVTVkdTaXplKCkge1xuICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIHRvdGFsIGRpc3BsYXkgd2lsbCBiZVxuICAgIC8vIHRoaXMuYXV0b0hlaWdodCA9IHRoaXMubnVtUm93cyAqIDMgLyAyICogdGhpcy5oZXhSYWRpdXMgKyAxIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIC8vIHdoaWNoIGlzIHRoZSBzYW1lIGFzXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gKHRoaXMubnVtUm93cyArIDEgLyAzKSAqIDMgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgdGhpcy5hdXRvSGVpZ2h0IC09IHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b2hlaWdodCA9IFwiICsgdGhpcy5hdXRvSGVpZ2h0KTtcbiAgICAvLyBUaGUgd2lkdGggb2YgdGhlIHRvdGFsIGRpc3BsYXkgd2lsbCBiZVxuICAgIC8vIHRoaXMuYXV0b1dpZHRoID0gdGhpcy5udW1Db2x1bW5zICogTWF0aC5zcXJ0KDMpICogdGhpcy5oZXhSYWRpdXMgKyBNYXRoLnNxcnQoMykgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgLy8gd2hpY2ggaXMgdGhlIHNhbWUgYXNcbiAgICB0aGlzLmF1dG9XaWR0aCA9ICh0aGlzLm51bUNvbHVtbnMgKyAxIC8gMikgKiBNYXRoLnNxcnQoMykgKiB0aGlzLmhleFJhZGl1cztcbiAgICB0aGlzLmF1dG9XaWR0aCAtPSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG93aWR0aCA9IFwiICsgdGhpcy5hdXRvV2lkdGggKyBcIiBhdXRvaGVpZ2h0ID0gXCIgKyB0aGlzLmF1dG9IZWlnaHQpO1xuICB9XG5cbiAgLy8gQnVpbGRzIHRoZSBwbGFjZWhvbGRlciBwb2x5Z29ucyBuZWVkZWQgdG8gcmVwcmVzZW50IGVhY2ggbWV0cmljXG4gIGdlbmVyYXRlUG9pbnRzKCkgOiBhbnkge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBpZiAodHlwZW9mKHRoaXMuZGF0YSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGxldCBtYXhSb3dzVXNlZCA9IDA7XG4gICAgbGV0IGNvbHVtbnNVc2VkID0gMDtcbiAgICBsZXQgbWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIC8vIHdoZW4gZHVwbGljYXRpbmcgcGFuZWxzLCB0aGlzIGdldHMgb2RkXG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gSW5maW5pdHkpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Sb3dzIGluZmluaXR5Li4uXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgaWYgKHRoaXMubnVtQ29sdW1ucyA9PT0gTmFOKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwibnVtQ29sdW1ucyBOYU5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtUm93czsgaSsrKSB7XG4gICAgICBpZiAoKHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgbWF4Um93c1VzZWQgKz0gMTtcbiAgICAgICAgY29sdW1uc1VzZWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubnVtQ29sdW1uczsgaisrKSB7XG4gICAgICAgICAgaWYgKChwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb2x1bW5zVXNlZCArPSAxO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIG1vc3QgbnVtYmVyIG9mIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChjb2x1bW5zVXNlZCA+IG1heENvbHVtbnNVc2VkKSB7XG4gICAgICAgICAgICAgIG1heENvbHVtbnNVc2VkID0gY29sdW1uc1VzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludHMucHVzaChbdGhpcy5oZXhSYWRpdXMgKiBqICogMS43NSwgdGhpcy5oZXhSYWRpdXMgKiBpICogMS41XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coXCJNYXggcm93cyB1c2VkOlwiICsgbWF4Um93c1VzZWQpO1xuICAgIC8vY29uc29sZS5sb2coXCJBY3R1YWwgY29sdW1ucyB1c2VkOlwiICsgbWF4Q29sdW1uc1VzZWQpO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSBtYXhSb3dzVXNlZDtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gbWF4Q29sdW1uc1VzZWQ7XG4gICAgcmV0dXJuIHBvaW50cztcbiAgfVxuXG59XG4iXX0=