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
                    if (dynamicValueFontSize > dynamicLabelFontSize) {
                        dynamicValueFontSize = dynamicLabelFontSize;
                    }
                    var textBlockSize = (2 * dynamicLabelFontSize) * 1.25;
                    var bottomTextAlignement = textBlockSize / 2;
                    var topTextAlignment = -(textBlockSize / 2 - dynamicLabelFontSize);
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
                        .attr("font-size", dynamicValueFontSize + "px")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBRUQ7Z0JBd0JFLG1CQUFZLFdBQWdCLEVBQUUsWUFBaUIsRUFBRSxPQUFZLEVBQUUsR0FBUTtvQkFIdkUsWUFBTyxHQUFHLEdBQUcsQ0FBQztvQkFJWixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO29CQUVmLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFMUMsSUFBSSxDQUFDLE1BQU0sR0FB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QUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29DQUNqRixXQUFXLElBQUksQ0FBQyxDQUFDO29DQUVqQixJQUFJLFdBQVcsR0FBRyxjQUFjLEVBQUU7d0NBQ2hDLGNBQWMsR0FBRyxXQUFXLENBQUM7cUNBQzlCO29DQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztpQ0FDcEU7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBR0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO29CQUNyQyxPQUFPLE1BQU0sQ0FBQztnQkFDaEIsQ0FBQztnQkFFSCxnQkFBQztZQUFELENBQUMsQUEzc0JELElBMnNCQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9kMy1oZXhiaW4vaW5kZXguZC50c1wiIC8+XG4vLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZDMvaW5kZXguZC50c1wiIC8+XG5pbXBvcnQgKiBhcyBkMyBmcm9tIFwiLi9leHRlcm5hbC9kMy5taW4uanNcIjtcbmltcG9ydCAqIGFzIGQzaGV4YmluIGZyb20gXCIuL2V4dGVybmFsL2QzLWhleGJpbi5qc1wiO1xuaW1wb3J0IHsgZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmZ1bmN0aW9uIHJlc29sdmVDbGlja1Rocm91Z2hVUkwoZCA6IGFueSkgOiBzdHJpbmcge1xuICBsZXQgY2xpY2tUaHJvdWdoVVJMID0gZC5jbGlja1Rocm91Z2g7XG4gIGlmIChkLnNhbml0aXplVVJMRW5hYmxlZCA9PT0gdHJ1ZSAmJiBkLnNhbml0aXplZFVSTC5sZW5ndGggPiAwKSB7XG4gICAgY2xpY2tUaHJvdWdoVVJMID0gZC5zYW5pdGl6ZWRVUkw7XG4gIH1cbiAgcmV0dXJuIGNsaWNrVGhyb3VnaFVSTDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUNsaWNrVGhyb3VnaFRhcmdldChkIDogYW55KSA6IHN0cmluZyB7XG4gIGxldCBjbGlja1Rocm91Z2hUYXJnZXQgPSBcIl9zZWxmXCI7XG4gIGlmIChkLm5ld1RhYkVuYWJsZWQgPT09IHRydWUpIHtcbiAgICBjbGlja1Rocm91Z2hUYXJnZXQgPSBcIl9ibGFua1wiO1xuICB9XG4gIHJldHVybiBjbGlja1Rocm91Z2hUYXJnZXQ7XG59XG5cbmV4cG9ydCBjbGFzcyBEM1dyYXBwZXIge1xuICBzdmdDb250YWluZXI6IGFueTtcbiAgZDNEaXZJZDogYW55O1xuICBtYXhDb2x1bW5zVXNlZDogbnVtYmVyO1xuICBtYXhSb3dzVXNlZDogbnVtYmVyO1xuICBvcHQ6IGFueTtcbiAgZGF0YTogYW55O1xuICB0ZW1wbGF0ZVNydjogYW55O1xuICBjYWxjdWxhdGVkUG9pbnRzOiBhbnk7XG4gIGhleFJhZGl1czogbnVtYmVyO1xuICBhdXRvSGV4UmFkaXVzIDogbnVtYmVyO1xuICBhdXRvV2lkdGggOiBudW1iZXI7XG4gIGF1dG9IZWlnaHQ6IG51bWJlcjtcbiAgbnVtQ29sdW1uczogbnVtYmVyO1xuICBudW1Sb3dzOiBudW1iZXI7XG4gIG1hcmdpbjoge1xuICAgIHRvcDogbnVtYmVyLFxuICAgIHJpZ2h0IDogbnVtYmVyLFxuICAgIGJvdHRvbSA6IG51bWJlcixcbiAgICBsZWZ0IDogbnVtYmVyLFxuICB9O1xuICBtYXhGb250ID0gMjQwO1xuICBwdXJlbGlnaHQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZVNydjogYW55LCBzdmdDb250YWluZXI6IGFueSwgZDNEaXZJZDogYW55LCBvcHQ6IGFueSkge1xuICAgIHRoaXMudGVtcGxhdGVTcnYgPSB0ZW1wbGF0ZVNydjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IHN2Z0NvbnRhaW5lcjtcbiAgICB0aGlzLmQzRGl2SWQgPSBkM0RpdklkO1xuICAgIHRoaXMuZGF0YSA9IG9wdC5kYXRhO1xuICAgIHRoaXMub3B0ID0gb3B0O1xuXG4gICAgdGhpcy5wdXJlbGlnaHQgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSk7XG4gICAgLy8gdGl0bGUgaXMgMjZweFxuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiAzMCArIDI2LFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICBib3R0b206IDIwLFxuICAgICAgbGVmdDogNTBcbiAgICB9O1xuICAgIC8vIHRha2UgMTAgb2ZmIHRoZSBoZWlnaHRcbiAgICB0aGlzLm9wdC5oZWlnaHQgLT0gMTA7XG4gICAgdGhpcy5vcHQud2lkdGggLT0gMjA7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5vcHQuZGF0YTtcbiAgICB0aGlzLm51bUNvbHVtbnMgPSA1O1xuICAgIHRoaXMubnVtUm93cyA9IDU7XG4gICAgdGhpcy5tYXhDb2x1bW5zVXNlZCA9IDA7XG4gICAgdGhpcy5tYXhSb3dzVXNlZCA9IDA7XG4gICAgaWYgKG9wdC5yb3dBdXRvU2l6ZSAmJiBvcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgIC8vIHNxcnQgb2YgIyBkYXRhIGl0ZW1zXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubnVtQ29sdW1ucyA9IG9wdC5jb2x1bW5zIHx8IDY7XG4gICAgICB0aGlzLm51bVJvd3MgPSBvcHQucm93cyB8fCA2O1xuICAgIH1cbiAgICBpZiAoKCFvcHQucmFkaXVzQXV0b1NpemUpICYmIChvcHQucmFkaXVzKSkge1xuICAgICAgdGhpcy5oZXhSYWRpdXMgPSBvcHQucmFkaXVzO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTsgLy8gfHwgNTA7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTsgLy98fCA1MDtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVTVkdTaXplKCk7XG4gICAgdGhpcy5jYWxjdWxhdGVkUG9pbnRzID0gdGhpcy5nZW5lcmF0ZVBvaW50cygpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMub3B0LnJvd0F1dG9TaXplICYmIHRoaXMub3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgICAgbGV0IHNxdWFyZWQgPSBNYXRoLnNxcnQodGhpcy5kYXRhLmxlbmd0aCk7XG4gICAgICAvLyBmYXZvciBjb2x1bW5zIHdoZW4gd2lkdGggaXMgZ3JlYXRlciB0aGFuIGhlaWdodFxuICAgICAgLy8gZmF2b3Igcm93cyB3aGVuIHdpZHRoIGlzIGxlc3MgdGhhbiBoZWlnaHRcbiAgICAgIGlmICh0aGlzLm9wdC53aWR0aCA+IHRoaXMub3B0LmhlaWdodCkge1xuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwoKHRoaXMub3B0LndpZHRoIC8gdGhpcy5vcHQuaGVpZ2h0KSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSBjb2x1bW5cbiAgICAgICAgaWYgKHRoaXMubnVtQ29sdW1ucyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFsaWduIHJvd3MgY291bnQgdG8gY29tcHV0ZWQgY29sdW1ucyBjb3VudFxuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtQ29sdW1ucyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIHJvd1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnVtUm93cyA9IE1hdGguY2VpbCgodGhpcy5vcHQuaGVpZ2h0IC8gdGhpcy5vcHQud2lkdGgpICogc3F1YXJlZCk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIHJvd1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxpZ24gY29sdW5ucyBjb3VudCB0byBjb21wdXRlZCByb3dzIGNvdW50XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCh0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Sb3dzKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCBjb2x1bW5zID0gXCIgKyB0aGlzLm51bUNvbHVtbnMpO1xuICAgIC8vY29uc29sZS5sb2coXCJDYWxjdWxhdGVkIHJvd3MgPSBcIiArIHRoaXMubnVtUm93cyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiBkYXRhIGl0ZW1zIHRvIHJlbmRlciA9IFwiICsgdGhpcy5kYXRhLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5vcHQucmFkaXVzQXV0b1NpemUpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJhdXRvSGV4UmFkaXVzOlwiICsgdGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVTVkdTaXplKCk7XG4gICAgdGhpcy5jYWxjdWxhdGVkUG9pbnRzID0gdGhpcy5nZW5lcmF0ZVBvaW50cygpO1xuXG4gICAgdmFyIHdpZHRoID0gdGhpcy5vcHQud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMub3B0LmhlaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgV2lkdGg6IFwiICsgd2lkdGggKyBcIiBIZWlnaHQ6IFwiICsgaGVpZ2h0KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3JhZDpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgdmFyIGFoZXhiaW4gPSBkM2hleGJpblxuICAgICAgLmhleGJpbigpXG4gICAgICAucmFkaXVzKHRoaXMuYXV0b0hleFJhZGl1cylcbiAgICAgIC5leHRlbnQoW1swLCAwXSwgW3dpZHRoLCBoZWlnaHRdXSk7XG5cbiAgICAvLyBkMyBjYWxjdWxhdGVzIHRoZSByYWRpdXMgZm9yIHggYW5kIHkgc2VwYXJhdGVseSBiYXNlZCBvbiB0aGUgdmFsdWUgcGFzc2VkIGluXG4gICAgdmFyIHRoaXJkUGkgPSBNYXRoLlBJIC8gMztcbiAgICBsZXQgZGlhbWV0ZXJYID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMiAqIE1hdGguc2luKHRoaXJkUGkpO1xuICAgIGxldCBkaWFtZXRlclkgPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAxLjU7XG4gICAgbGV0IHJhZGl1c1ggPSBkaWFtZXRlclggLyAyO1xuICAgIGxldCByZW5kZXJXaWR0aCA9IHRoaXMubWF4Q29sdW1uc1VzZWQgKiBkaWFtZXRlclg7XG4gICAgLy8gcmVuZGVySGVpZ2h0IGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlICNyb3dzIHVzZWQsIGFuZFxuICAgIC8vIHRoZSBcInNwYWNlXCIgdGFrZW4gYnkgdGhlIGhleGFnb25zIGludGVybGVhdmVkXG4gICAgLy8gc3BhY2UgdGFrZW4gaXMgMi8zIG9mIGRpYW1ldGVyWSAqICMgcm93c1xuICAgIGxldCByZW5kZXJIZWlnaHQgPSAodGhpcy5tYXhSb3dzVXNlZCAqIGRpYW1ldGVyWSkgKyAoZGlhbWV0ZXJZICogLjMzKTtcbiAgICAvLyBkaWZmZXJlbmNlIG9mIHdpZHRoIGFuZCByZW5kZXJ3aWR0aCBpcyBvdXIgcGxheSByb29tLCBzcGxpdCB0aGF0IGluIGhhbGZcbiAgICAvLyBvZmZzZXQgaXMgZnJvbSBjZW50ZXIgb2YgaGV4YWdvbiwgbm90IGZyb20gdGhlIGVkZ2VcbiAgICBsZXQgeG9mZnNldCA9ICh3aWR0aCAtIHJlbmRlcldpZHRoICsgcmFkaXVzWCkgLyAyO1xuICAgIC8vIGlmIHRoZXJlIGlzIGp1c3Qgb25lIGNvbHVtbiBhbmQgb25lIHJvdywgY2VudGVyIGl0XG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gMSkge1xuICAgICAgcmVuZGVySGVpZ2h0ID0gZGlhbWV0ZXJZICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgICB4b2Zmc2V0ID0gKCh3aWR0aCAtIHJlbmRlcldpZHRoKSAvIDIpICsgcmFkaXVzWDtcbiAgICB9XG4gICAgLy8geSBkaWFtZXRlciBvZiBoZXhhZ29uIGlzIGxhcmdlciB0aGFuIHggZGlhbWV0ZXJcbiAgICBsZXQgeW9mZnNldCA9ICgoaGVpZ2h0IC0gcmVuZGVySGVpZ2h0KSAvIDIpICsgKGRpYW1ldGVyWSAqIC42Nik7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGRpdiBmb3IgdGhlIHRvb2x0aXBcbiAgICAvLyBhZGQgaXQgdG8gdGhlIGJvZHkgYW5kIG5vdCB0aGUgY29udGFpbmVyIHNvIGl0IGNhbiBmbG9hdCBvdXRzaWRlIG9mIHRoZSBwYW5lbFxuICAgIHZhciB0b29sdGlwID0gZDNcbiAgICAgIC5zZWxlY3QoXCJib2R5XCIpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2x5c3RhdC1wYW5lbC10b29sdGlwXCIpXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgIHZhciBzdmcgOiBhbnkgPSBkMy5zZWxlY3QodGhpcy5zdmdDb250YWluZXIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgLmF0dHIoXCJ4bWxuczp4bGlua1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIilcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJib3JkZXJcIiwgXCIwcHggc29saWQgd2hpdGVcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkKVxuICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeG9mZnNldCArIFwiLFwiICsgeW9mZnNldCArIFwiKVwiKTtcblxuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgIHZhciBkZWZzID0gc3ZnLmFwcGVuZChcImRlZnNcIik7XG5cbiAgICBsZXQgY29sb3JHcmFkaWVudHMgPSBDb2xvci5jcmVhdGVHcmFkaWVudHMoZGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvckdyYWRpZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIk5hbWUgPSBcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpKTtcbiAgICAgIGxldCBhR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNvbG9yR3JhZGllbnRzW2ldLnN0YXJ0KTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjb2xvckdyYWRpZW50c1tpXS5lbmQpO1xuICAgIH1cbiAgICBsZXQgb2tDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDgyLCAxOTQsIDUyKTsgLy8gIzUyYzIzNFxuICAgIGxldCBva0NvbG9yRW5kID0gb2tDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgb2tHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtb2tcIik7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBva0NvbG9yU3RhcnQuYXNIZXgoKSk7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBva0NvbG9yRW5kLmFzSGV4KCkpO1xuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0p1aWN5T3JhbmdlXG4gICAgbGV0IHdhcm5pbmdDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDI1NSwgMjAwLCA1NSk7IC8vICNGRkM4MzdcbiAgICBsZXQgd2FybmluZ0NvbG9yRW5kID0gd2FybmluZ0NvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCB3YXJuaW5nR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtd2FybmluZ1wiKTtcbiAgICB3YXJuaW5nR3JhZGllbnQuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCB3YXJuaW5nQ29sb3JTdGFydC5hc0hleCgpKTsgLy8gbGlnaHQgb3JhbmdlXG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgd2FybmluZ0NvbG9yRW5kLmFzSGV4KCkpOyAvLyBkYXJrIG9yYW5nZVxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI1lvdVR1YmVcbiAgICBsZXQgY3JpdGljYWxDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDIyOSwgNDUsIDM5KTsgLy8gZTUyZDI3XG4gICAgbGV0IGNyaXRpY2FsQ29sb3JFbmQgPSBjcml0aWNhbENvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCBjcml0aWNhbEdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1jcml0aWNhbFwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNyaXRpY2FsQ29sb3JTdGFydC5hc0hleCgpKTsgLy8gbGlnaHQgcmVkXG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjcml0aWNhbENvbG9yRW5kLmFzSGV4KCkpOyAvLyBkYXJrIHJlZFxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0FzaFxuICAgIGxldCB1bmtub3duR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXVua25vd25cIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzM4MDhBXCIpOyAvLyBsaWdodCBncmV5XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzc1N0Y5QVwiKTsgLy8gZGFyayBncmV5XG5cbiAgICBsZXQgY3VzdG9tU2hhcGUgPSBudWxsO1xuICAgIC8vIHRoaXMgaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGZvbnRzaXplXG4gICAgbGV0IHNoYXBlV2lkdGggPSBkaWFtZXRlclg7XG4gICAgbGV0IHNoYXBlSGVpZ2h0ID0gZGlhbWV0ZXJZO1xuICAgIC8vIHN5bWJvbHMgdXNlIHRoZSBhcmVhIGZvciB0aGVpciBzaXplXG4gICAgbGV0IGlubmVyQXJlYSA9IGRpYW1ldGVyWCAqIGRpYW1ldGVyWTtcbiAgICAvLyB1c2UgdGhlIHNtYWxsZXIgb2YgZGlhbWV0ZXJYIG9yIFlcbiAgICBpZiAoZGlhbWV0ZXJYIDwgZGlhbWV0ZXJZKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclg7XG4gICAgfVxuICAgIGlmIChkaWFtZXRlclkgPCBkaWFtZXRlclgpIHtcbiAgICAgIGlubmVyQXJlYSA9IGRpYW1ldGVyWSAqIGRpYW1ldGVyWTtcbiAgICB9XG4gICAgbGV0IHN5bWJvbCA9IGQzLnN5bWJvbCgpLnNpemUoaW5uZXJBcmVhKTtcbiAgICBzd2l0Y2ggKHRoaXMub3B0LnBvbHlzdGF0LnNoYXBlKSB7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBzaGFwZVdpZHRoID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9mbGF0X3RvcFwiOlxuICAgICAgICAvLyBUT0RPOiB1c2UgcG9pbnRlZCBmb3Igbm93XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIHNoYXBlV2lkdGggPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDaXJjbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbENyb3NzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGlhbW9uZFwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbERpYW1vbmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzcXVhcmVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xTcXVhcmUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzdGFyXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3Rhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWFuZ2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sVHJpYW5nbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3eWVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xXeWUpO1xuICAgICAgICBicmVhaztcbiAgICAgZGVmYXVsdDpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBmb250c2l6ZSBiYXNlZCBvbiB0aGUgc2hhcGUgYW5kIHRoZSB0ZXh0XG4gICAgbGV0IGFjdGl2ZUxhYmVsRm9udFNpemUgPSB0aGlzLm9wdC5wb2x5c3RhdC5mb250U2l6ZTtcbiAgICAvLyBmb250IHNpemVzIGFyZSBpbmRlcGVuZGVudCBmb3IgbGFiZWwgYW5kIHZhbHVlc1xuICAgIGxldCBhY3RpdmVWYWx1ZUZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgbGV0IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQgPSBcIlwiO1xuXG4gICAgaWYgKHRoaXMub3B0LnBvbHlzdGF0LmZvbnRBdXRvU2NhbGUpIHtcbiAgICAgIC8vIGZpbmQgdGhlIG1vc3QgdGV4dCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIG92ZXIgYWxsIGl0ZW1zXG4gICAgICBsZXQgbWF4TGFiZWwgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtpXS5uYW1lLmxlbmd0aCA+IG1heExhYmVsLmxlbmd0aCkge1xuICAgICAgICAgIG1heExhYmVsID0gdGhpcy5kYXRhW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGVzdGltYXRlIGhvdyBiaWcgb2YgYSBmb250IGNhbiBiZSB1c2VkXG4gICAgICAvLyBUd28gbGluZXMgb2YgdGV4dCBtdXN0IGZpdCB3aXRoIHZlcnRpY2FsIHNwYWNpbmcgaW5jbHVkZWRcbiAgICAgIC8vIGlmIGl0IGlzIHRvbyBzbWFsbCwgaGlkZSBldmVyeXRoaW5nXG4gICAgICBsZXQgZXN0aW1hdGVMYWJlbEZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgICAgbWF4TGFiZWwsXG4gICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIiwgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICBzaGFwZVdpZHRoLFxuICAgICAgICBzaGFwZUhlaWdodCAvIDMsIC8vIHRvcCBhbmQgYm90dG9tIG9mIGhleGFnb24gbm90IHVzZWQsIGFuZCB0d28gbGluZXMgb2YgdGV4dFxuICAgICAgICA4LFxuICAgICAgICB0aGlzLm1heEZvbnQpO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKFwiQ2FsYzogRXN0aW1hdGVkIExhYmVsIEZvbnQgU2l6ZTogXCIgKyBlc3RpbWF0ZUxhYmVsRm9udFNpemUpO1xuICAgICAgYWN0aXZlTGFiZWxGb250U2l6ZSA9IGVzdGltYXRlTGFiZWxGb250U2l6ZTtcbiAgICAgIC8vIHNhbWUgZm9yIHRoZSB2YWx1ZVxuICAgICAgbGV0IG1heFZhbHVlID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJDaGVja2luZyBsZW46IFwiICsgdGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkICsgXCIgdnM6IFwiICsgbWF4VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkLmxlbmd0aCA+IG1heFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgIG1heFZhbHVlID0gdGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvL2NvbnNvbGUubG9nKFwiTWF4IFZhbHVlOiBcIiArIG1heFZhbHVlKTtcbiAgICAgIGxldCBlc3RpbWF0ZVZhbHVlRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0KFxuICAgICAgICBtYXhWYWx1ZSxcbiAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLCAvLyB1c2Ugc2Fucy1zZXJpZiBmb3Igc2l6aW5nXG4gICAgICAgIHNoYXBlV2lkdGgsXG4gICAgICAgIHNoYXBlSGVpZ2h0IC8gMywgLy8gdG9wIGFuZCBib3R0b20gb2YgaGV4YWdvbiBub3QgdXNlZCwgYW5kIHR3byBsaW5lcyBvZiB0ZXh0XG4gICAgICAgIDgsXG4gICAgICAgIHRoaXMubWF4Rm9udCk7XG4gICAgICBhY3RpdmVWYWx1ZUZvbnRTaXplID0gZXN0aW1hdGVWYWx1ZUZvbnRTaXplO1xuICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IG1heFZhbHVlO1xuICAgIH1cblxuICAgIHN2Zy5zZWxlY3RBbGwoXCIuaGV4YWdvblwiKVxuICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5lYWNoKChfLCBpLCBub2RlcykgPT4ge1xuICAgICAgICBsZXQgbm9kZSA9IGQzLnNlbGVjdChub2Rlc1tpXSk7XG4gICAgICAgIGxldCBjbGlja1Rocm91Z2hVUkwgPSByZXNvbHZlQ2xpY2tUaHJvdWdoVVJMKGRhdGFbaV0pO1xuICAgICAgICBpZiAoY2xpY2tUaHJvdWdoVVJMLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBub2RlID0gbm9kZS5hcHBlbmQoXCJhXCIpXG4gICAgICAgICAgICAuYXR0cihcInRhcmdldFwiLCByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGRhdGFbaV0pKVxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIGNsaWNrVGhyb3VnaFVSTCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZpbGxDb2xvciA9IGRhdGFbaV0uY29sb3I7XG4gICAgICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5ncmFkaWVudEVuYWJsZWQpIHtcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgdGhlIGxvY2F0aW9uLmhyZWZcbiAgICAgICAgICBmaWxsQ29sb3IgPSBcInVybChcIiArIGxvY2F0aW9uLmhyZWYgKyBcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImhleGFnb25cIilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuICAgICAgICAgIC5hdHRyKFwiZFwiLCBjdXN0b21TaGFwZSlcbiAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgKyBcInB4XCIpXG4gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmaWxsQ29sb3IpXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgdmlld3BvcnR3aWR0aCB0byBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb20gZ29pbmcgdG9vIGZhciByaWdodFxuICAgICAgICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgICAgICAgLy8gdXNlIHRoZSBtb3VzZSBwb3NpdGlvbiBmb3IgdGhlIGVudGlyZSBwYWdlXG4gICAgICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZShkMy5zZWxlY3QoXCJib2R5XCIpLm5vZGUoKSk7XG4gICAgICAgICAgICB2YXIgeHBvcyA9IG1vdXNlWzBdIC0gNTA7XG4gICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBvZmZzY3JlZW4gdG9vbHRpcFxuICAgICAgICAgICAgaWYgKHhwb3MgPCAwKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHJldmVudCB0b29sdGlwIGZyb20gcmVuZGVyaW5nIG91dHNpZGUgb2Ygdmlld3BvcnRcbiAgICAgICAgICAgIGlmICgoeHBvcyArIDIwMCkgPiB2aWV3UG9ydFdpZHRoKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSB2aWV3UG9ydFdpZHRoIC0gMjAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHlwb3MgPSBtb3VzZVsxXSArIDU7XG4gICAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgeHBvcyArIFwicHhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIHlwb3MgKyBcInB4XCIpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XG4gICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLnN0eWxlKFwib3BhY2l0eVwiLCAwLjkpO1xuICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRoaXMub3B0LnRvb2x0aXBDb250ZW50W2ldKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRTaXplKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LWZhbWlseVwiLCB0aGlzLm9wdC50b29sdGlwRm9udFR5cGUpXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQueCAtIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQueSAtIDUpICsgXCJweFwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBub3cgbGFiZWxzXG4gICAgdmFyIHRleHRzcG90ID0gc3ZnLnNlbGVjdEFsbChcInRleHQudG9wbGFiZWxcIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSk7XG4gICAgbGV0IGR5bmFtaWNMYWJlbEZvbnRTaXplID0gYWN0aXZlTGFiZWxGb250U2l6ZTtcbiAgICBsZXQgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBhY3RpdmVWYWx1ZUZvbnRTaXplO1xuICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICBpZiAoZHluYW1pY1ZhbHVlRm9udFNpemUgPiBkeW5hbWljTGFiZWxGb250U2l6ZSkge1xuICAgICAgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBkeW5hbWljTGFiZWxGb250U2l6ZTtcbiAgICB9XG4gICAgLy8gY29tcHV0ZSB0ZXh0IGJsb2NrIHNpemU6IGxhYmVsU2l6ZSArIGxhYmVsU2l6ZSArIDI1JSB0b3RhbCBwYWRkaW5nICgyNSUgKiAyIGxpbmVzID09IDEvMiBsaW5lKVxuICAgIC8vIE5COiB3ZSB1c2UgbGFiZWxTaXplIGluc3RlYWQgb2YgdmFsdWVTaXplIHRvIGNvbXB1dGUgdGhlIHBhZGRpbmcgKHZhbHVTaXplIGR5bmFtaWMgdmFsdWUgPD0gbGFiZWxTaXplKVxuICAgIGxldCB0ZXh0QmxvY2tTaXplID0gKDIgKiBkeW5hbWljTGFiZWxGb250U2l6ZSkgKiAxLjI1O1xuXG4gICAgLy8gY29tcHV0ZSBhbGlnbm1lbnQgZm9yIGVhY2ggdGV4dCBlbGVtZW50LCBiYXNlIGNvb3JkaW5hdGUgaXMgYXQgdGhlIGNlbnRlciBvZiB0aGUgcG9seWdvbiAodGV4dCBpcyBhbmNob3JlZCBhdCBpdHMgYm90dG9tKTpcbiAgICAvLyAtIFZhbHVlIHRleHQgKGJvdHRvbSB0ZXh0KSB3aWxsIGJlIGFsaWduZWQgKHBvc2l0aXZlbHkgaS5lLiBsb3dlcikgZXhhY3RseSBvbiB0aGUgYm90dG9tIG9mIGJsb2NrOlxuICAgIC8vICAgICBibG9ja1NpemUgLyAyXG4gICAgLy8gLSBMYWJlbCB0ZXh0ICh0b3AgdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChuZWdhdGl2ZWx5LCBpLmUuIGhpZ2hlcikgdG8gdG9wIG9mIHRoZSBibG9jayBtaW51cyBpdHMgb3duIHNpemU6XG4gICAgLy8gICAgIGJsb2NrU2l6ZSAvIDIgLSBsYWJlbFNpemVcbiAgICBsZXQgYm90dG9tVGV4dEFsaWduZW1lbnQgPSB0ZXh0QmxvY2tTaXplIC8gMjtcbiAgICBsZXQgdG9wVGV4dEFsaWdubWVudCA9IC0odGV4dEJsb2NrU2l6ZSAvIDIgLSBkeW5hbWljTGFiZWxGb250U2l6ZSk7IC8vIGFsaWduZWQgbmVnYXRpdmVseVxuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b3BsYWJlbFwiKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueSArIHRvcFRleHRBbGlnbm1lbnQ7IH0pXG4gICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnBvbHlzdGF0LmZvbnRUeXBlKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpXG4gICAgICAudGV4dChmdW5jdGlvbiAoXywgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0XG4gICAgICAgIGlmICghKFwic2hvd05hbWVcIiBpbiBpdGVtKSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0uc2hvd05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHZhciBmcmFtZXMgPSAwO1xuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oXywgaSkge1xuICAgICAgICByZXR1cm4gXCJ2YWx1ZUxhYmVsXCIgKyBpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnkgKyBib3R0b21UZXh0QWxpZ25lbWVudDsgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KCAoXywgaSkgPT4ge1xuICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGJ1dCBub3QgbW9yZSB0aGFuIG51bWJlciBvZiBkYXRhIGl0ZW1zXG4gICAgICAgIC8vIG5lZWQgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb250ZW50IHN0cmluZyBnZW5lcmF0ZWQgdG8gZGV0ZXJtaW5lIHRoZVxuICAgICAgICAvLyBkeW5hbWljIGZvbnQgc2l6ZVxuICAgICAgICAvLyB0aGlzIGFsd2F5cyBzdGFydHMgZnJvbSBmcmFtZSAwLCBsb29rIHRocm91Z2ggZXZlcnkgbWV0cmljIGluY2x1ZGluZyBjb21wb3NpdGUgbWVtYmVycyBmb3IgdGhlIGxvbmdlc3QgdGV4dCBwb3NzaWJsZVxuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIGNvdW50IG9mIG1ldHJpY3MgKHdpdGggY29tcG9zaXRlIG1lbWJlcnMpLCBhbmQgbG9vcCB0aHJvdWdoXG4gICAgICAgIGxldCBzdWJtZXRyaWNDb3VudCA9IHRoaXMuZGF0YVtpXS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgLy9sZXQgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IFwiXCI7XG4gICAgICAgIGlmIChzdWJtZXRyaWNDb3VudCA+IDApIHtcbiAgICAgICAgICB3aGlsZSAoY291bnRlciA8IHN1Ym1ldHJpY0NvdW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoY2hlY2tDb250ZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGVja0NvbnRlbnQubGVuZ3RoID4gbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9Ly8gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLWNvbXBvc2l0ZXMgdXNlIHRoZSBmb3JtYXR0ZWQgc2l6ZSBvZiB0aGUgbWV0cmljIHZhbHVlXG4gICAgICAgIC8vICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQ6IFwiICsgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCk7XG4gICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlICgoY29udGVudCA9PT0gbnVsbCkgJiYgKGNvdW50ZXIgPCBkYXRhTGVuKSkge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQoXG4gICAgICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCxcbiAgICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsICAvLyB1c2Ugc2Fucy1zZXJpZiBmb3Igc2l6aW5nXG4gICAgICAgICAgc2hhcGVXaWR0aCwgICAvLyBwYWRcbiAgICAgICAgICBzaGFwZUhlaWdodCAvIDMsXG4gICAgICAgICAgNixcbiAgICAgICAgICB0aGlzLm1heEZvbnQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2FsYzogRHluYW1pYyBWYWx1ZSBGb250IFNpemU6IFwiICsgZHluYW1pY1ZhbHVlRm9udFNpemUpO1xuXG4gICAgICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICAgICAgaWYgKGR5bmFtaWNWYWx1ZUZvbnRTaXplID4gZHluYW1pY0xhYmVsRm9udFNpemUpIHtcbiAgICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGR5bmFtaWNMYWJlbEZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhbmltYXRlZDogZHluYW1pY0xhYmVsRm9udFNpemU6IFwiICsgZHluYW1pY0xhYmVsRm9udFNpemUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGR5bmFtaWNWYWx1ZUZvbnRTaXplOiBcIiArIGR5bmFtaWNWYWx1ZUZvbnRTaXplKTtcbiAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgIC8vIHVzZSB0aGUgZHluYW1pYyBzaXplIGZvciB0aGUgdmFsdWVcbiAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgIGQzLmludGVydmFsKCAoKSA9PiB7XG4gICAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgICAgdmFyIGNvbXBvc2l0ZUluZGV4ID0gaTtcbiAgICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi50ZXh0KCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aCAqIDI7XG4gICAgICAgICAgICAvLyBzZWFyY2ggZm9yIGEgdmFsdWUgY3ljbGluZyB0aHJvdWdoIHR3aWNlIHRvIGFsbG93IHJvbGxvdmVyXG4gICAgICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGNvbXBvc2l0ZUluZGV4LCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBjdXN0b20gY29udGVudCBmb3IgY29tcG9zaXRlIG9rIHN0YXRlXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZvbnQgc2l6ZSB0byBiZSB0aGUgc2FtZSBhcyB0aGUgbGFiZWwgYWJvdmVcbiAgICAgICAgICAgICAgLy92YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGR5bmFtaWNWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZyYW1lcysrO1xuICAgICAgICB9LCB0aGlzLm9wdC5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfSk7XG4gIH1cblxuICBmb3JtYXRWYWx1ZUNvbnRlbnQoaSwgZnJhbWVzLCB0aGlzUmVmKTogc3RyaW5nIHtcbiAgICBsZXQgZGF0YSA9IHRoaXNSZWYuZGF0YVtpXTtcbiAgICAvLyBvcHRpb25zIGNhbiBzcGVjaWZ5IHRvIG5vdCBzaG93IHRoZSB2YWx1ZVxuICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic2hvd1ZhbHVlXCIpKSB7XG4gICAgICAgIGlmICghZGF0YS5zaG93VmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwidmFsdWVGb3JtYXR0ZWRcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIGRhdGEsIHJldHVybiBub3RoaW5nXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgc3dpdGNoIChkYXRhLmFuaW1hdGVNb2RlKSB7XG4gICAgICBjYXNlIFwiYWxsXCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWdnZXJlZFwiOlxuICAgICAgICAvLyByZXR1cm4gbm90aGluZyBpZiBtb2RlIGlzIHRyaWdnZXJlZCBhbmQgdGhlIHN0YXRlIGlzIDBcbiAgICAgICAgaWYgKGRhdGEudGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNvbnRlbnQgPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gdmFsdWVGb3JtYXR0ZWQsIHRoZXJlJ3Mgbm90aGluZyB0byBkaXNwbGF5XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnByZWZpeCkgJiYgKGRhdGEucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gZGF0YS5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgfVxuICAgIGlmICgoZGF0YS5zdWZmaXgpICYmIChkYXRhLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGRhdGEuc3VmZml4O1xuICAgIH1cbiAgICAvLyBhIGNvbXBvc2l0ZSB3aWxsIGNvbnRhaW4gdGhlIFwid29yc3RcIiBjYXNlIGFzIHRoZSB2YWx1ZUZvcm1hdHRlZCxcbiAgICAvLyBhbmQgd2lsbCBoYXZlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiB0aGUgY29tcG9zaXRlIGluY2x1ZGVkLlxuICAgIC8vIGFzIGZyYW1lcyBpbmNyZW1lbnQgZmluZCBhIHRyaWdnZXJlZCBtZW1iZXIgc3RhcnRpbmcgZnJvbSB0aGUgZnJhbWUgbW9kIGxlblxuICAgIGxldCBsZW4gPSBkYXRhLm1lbWJlcnMubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICBsZXQgdHJpZ2dlcmVkSW5kZXggPSAtMTtcbiAgICAgIGlmIChkYXRhLmFuaW1hdGVNb2RlID09PSBcImFsbFwiKSB7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZnJhbWVzICUgbGVuO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBhbGwgbW9kZTogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEudHJpZ2dlckNhY2hlKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGRhdGEudHJpZ2dlckNhY2hlID0gdGhpcy5idWlsZFRyaWdnZXJDYWNoZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeiA9IGZyYW1lcyAlIGRhdGEudHJpZ2dlckNhY2hlLmxlbmd0aDtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBkYXRhLnRyaWdnZXJDYWNoZVt6XS5pbmRleDtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gY2FjaGUgaXM6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfVxuICAgICAgbGV0IGFNZW1iZXIgPSBkYXRhLm1lbWJlcnNbdHJpZ2dlcmVkSW5kZXhdO1xuXG4gICAgICBjb250ZW50ID0gYU1lbWJlci5uYW1lICsgXCI6IFwiICsgYU1lbWJlci52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIGlmICgoYU1lbWJlci5wcmVmaXgpICYmIChhTWVtYmVyLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gYU1lbWJlci5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoKGFNZW1iZXIuc3VmZml4KSAmJiAoYU1lbWJlci5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGFNZW1iZXIuc3VmZml4O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhbGxvdyB0ZW1wbGF0aW5nXG4gICAgLy9cbiAgICBpZiAoKGNvbnRlbnQpICYmIChjb250ZW50Lmxlbmd0aCA+IDApKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVwbGFjZWRDb250ZW50ID0gdGhpc1JlZi50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoY29udGVudCk7XG4gICAgICAgIGNvbnRlbnQgPSByZXBsYWNlZENvbnRlbnQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogdGVtcGxhdGUgc2VydmVyIHRocmV3IGVycm9yOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgYnVpbGRUcmlnZ2VyQ2FjaGUoaXRlbSkge1xuICAgIC8vY29uc29sZS5sb2coXCJCdWlsZGluZyB0cmlnZ2VyIGNhY2hlIGZvciBpdGVtXCIpO1xuICAgIGxldCB0cmlnZ2VyQ2FjaGUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGFNZW1iZXIgPSBpdGVtLm1lbWJlcnNbaV07XG4gICAgICBpZiAoYU1lbWJlci50aHJlc2hvbGRMZXZlbCA+IDApIHtcbiAgICAgICAgLy8gYWRkIHRvIGxpc3RcbiAgICAgICAgbGV0IGNhY2hlZE1lbWJlclN0YXRlID0geyBpbmRleDogaSwgbmFtZTogYU1lbWJlci5uYW1lLCB2YWx1ZTogYU1lbWJlci52YWx1ZSwgdGhyZXNob2xkTGV2ZWw6IGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgfTtcbiAgICAgICAgdHJpZ2dlckNhY2hlLnB1c2goY2FjaGVkTWVtYmVyU3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzb3J0IGl0XG4gICAgdHJpZ2dlckNhY2hlID0gXy5vcmRlckJ5KHRyaWdnZXJDYWNoZSwgW1widGhyZXNob2xkTGV2ZWxcIiwgXCJ2YWx1ZVwiLCBcIm5hbWVcIl0sIFtcImRlc2NcIiwgXCJkZXNjXCIsIFwiYXNjXCJdKTtcbiAgICByZXR1cm4gdHJpZ2dlckNhY2hlO1xuICB9XG5cbiAgZ2V0QXV0b0hleFJhZGl1cygpOiBudW1iZXIge1xuICAgIC8vVGhlIG1heGltdW0gcmFkaXVzIHRoZSBoZXhhZ29ucyBjYW4gaGF2ZSB0byBzdGlsbCBmaXQgdGhlIHNjcmVlblxuICAgIC8vIFdpdGggKGxvbmcpIHJhZGl1cyBiZWluZyBSOlxuICAgIC8vIC0gVG90YWwgd2lkdGggKHJvd3MgPiAxKSA9IDEgc21hbGwgcmFkaXVzIChzcXJ0KDMpICogUiAvIDIpICsgY29sdW1ucyAqIHNtYWxsIGRpYW1ldGVyIChzcXJ0KDMpICogUilcbiAgICAvLyAtIFRvdGFsIGhlaWdodCA9IDEgcG9pbnR5IHRvcCAoMS8yICogUikgKyByb3dzICogc2l6ZSBvZiB0aGUgcmVzdCAoMy8yICogUilcbiAgICBsZXQgcmFkaXVzRnJvbVdpZHRoID0gKDIgKiB0aGlzLm9wdC53aWR0aCkgLyAoTWF0aC5zcXJ0KDMpICogKCAxICsgMiAqIHRoaXMubnVtQ29sdW1ucykpO1xuICAgIGxldCByYWRpdXNGcm9tSGVpZ2h0ID0gKDIgKiB0aGlzLm9wdC5oZWlnaHQpIC8gKDMgKiB0aGlzLm51bVJvd3MgKyAxKTtcbiAgICB2YXIgaGV4UmFkaXVzID0gZDMubWluKFxuICAgICAgW1xuICAgICAgICByYWRpdXNGcm9tV2lkdGgsXG4gICAgICAgIHJhZGl1c0Zyb21IZWlnaHRcbiAgICAgIF1cbiAgICApO1xuICAgIHJldHVybiBoZXhSYWRpdXM7XG4gIH1cblxuICBjYWxjdWxhdGVTVkdTaXplKCkge1xuICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIHRvdGFsIGRpc3BsYXkgd2lsbCBiZVxuICAgIC8vIHRoaXMuYXV0b0hlaWdodCA9IHRoaXMubnVtUm93cyAqIDMgLyAyICogdGhpcy5oZXhSYWRpdXMgKyAxIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIC8vIHdoaWNoIGlzIHRoZSBzYW1lIGFzXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gKHRoaXMubnVtUm93cyArIDEgLyAzKSAqIDMgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgdGhpcy5hdXRvSGVpZ2h0IC09IHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b2hlaWdodCA9IFwiICsgdGhpcy5hdXRvSGVpZ2h0KTtcbiAgICAvLyBUaGUgd2lkdGggb2YgdGhlIHRvdGFsIGRpc3BsYXkgd2lsbCBiZVxuICAgIC8vIHRoaXMuYXV0b1dpZHRoID0gdGhpcy5udW1Db2x1bW5zICogTWF0aC5zcXJ0KDMpICogdGhpcy5oZXhSYWRpdXMgKyBNYXRoLnNxcnQoMykgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgLy8gd2hpY2ggaXMgdGhlIHNhbWUgYXNcbiAgICB0aGlzLmF1dG9XaWR0aCA9ICh0aGlzLm51bUNvbHVtbnMgKyAxIC8gMikgKiBNYXRoLnNxcnQoMykgKiB0aGlzLmhleFJhZGl1cztcbiAgICB0aGlzLmF1dG9XaWR0aCAtPSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG93aWR0aCA9IFwiICsgdGhpcy5hdXRvV2lkdGggKyBcIiBhdXRvaGVpZ2h0ID0gXCIgKyB0aGlzLmF1dG9IZWlnaHQpO1xuICB9XG5cbiAgLy8gQnVpbGRzIHRoZSBwbGFjZWhvbGRlciBwb2x5Z29ucyBuZWVkZWQgdG8gcmVwcmVzZW50IGVhY2ggbWV0cmljXG4gIGdlbmVyYXRlUG9pbnRzKCkgOiBhbnkge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBpZiAodHlwZW9mKHRoaXMuZGF0YSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGxldCBtYXhSb3dzVXNlZCA9IDA7XG4gICAgbGV0IGNvbHVtbnNVc2VkID0gMDtcbiAgICBsZXQgbWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIC8vIHdoZW4gZHVwbGljYXRpbmcgcGFuZWxzLCB0aGlzIGdldHMgb2RkXG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gSW5maW5pdHkpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Sb3dzIGluZmluaXR5Li4uXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgaWYgKHRoaXMubnVtQ29sdW1ucyA9PT0gTmFOKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwibnVtQ29sdW1ucyBOYU5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtUm93czsgaSsrKSB7XG4gICAgICBpZiAoKHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgbWF4Um93c1VzZWQgKz0gMTtcbiAgICAgICAgY29sdW1uc1VzZWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubnVtQ29sdW1uczsgaisrKSB7XG4gICAgICAgICAgaWYgKChwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb2x1bW5zVXNlZCArPSAxO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIG1vc3QgbnVtYmVyIG9mIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChjb2x1bW5zVXNlZCA+IG1heENvbHVtbnNVc2VkKSB7XG4gICAgICAgICAgICAgIG1heENvbHVtbnNVc2VkID0gY29sdW1uc1VzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludHMucHVzaChbdGhpcy5oZXhSYWRpdXMgKiBqICogMS43NSwgdGhpcy5oZXhSYWRpdXMgKiBpICogMS41XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coXCJNYXggcm93cyB1c2VkOlwiICsgbWF4Um93c1VzZWQpO1xuICAgIC8vY29uc29sZS5sb2coXCJBY3R1YWwgY29sdW1ucyB1c2VkOlwiICsgbWF4Q29sdW1uc1VzZWQpO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSBtYXhSb3dzVXNlZDtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gbWF4Q29sdW1uc1VzZWQ7XG4gICAgcmV0dXJuIHBvaW50cztcbiAgfVxuXG59XG4iXX0=