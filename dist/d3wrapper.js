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
    function showName(item) {
        return (!("showName" in item) || item.showName);
    }
    function showValue(item) {
        return (!("showValue" in item) || item.showValue);
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
                    this.minFont = 8;
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
                    this.calculatedPoints = this.generatePoints();
                }
                D3Wrapper.prototype.computeTextFontSize = function (text, linesToDisplay, textAreaWidth, textAreaHeight) {
                    return utils_1.getTextSizeForWidthAndHeight(text, "?px sans-serif", textAreaWidth, textAreaHeight / linesToDisplay, this.minFont, this.maxFont);
                };
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
                            else if (this.numColumns > this.data.length) {
                                this.numColumns = this.data.length;
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
                            else if (this.numRows > this.data.length) {
                                this.numRows = this.data.length;
                            }
                            this.numColumns = Math.ceil(this.data.length / this.numRows);
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
                        }
                    }
                    else if (this.opt.rowAutoSize) {
                        this.numRows = Math.ceil(this.data.length / this.numColumns);
                        if (this.numRows < 1) {
                            this.numRows = 1;
                        }
                    }
                    else if (this.opt.columnAutoSize) {
                        this.numColumns = Math.ceil(this.data.length / this.numRows);
                        if (this.numColumns < 1) {
                            this.numColumns = 1;
                        }
                    }
                    if (this.opt.radiusAutoSize) {
                        this.hexRadius = this.getAutoHexRadius();
                        this.autoHexRadius = this.getAutoHexRadius();
                    }
                    this.calculatedPoints = this.generatePoints();
                    var width = this.opt.width;
                    var height = this.opt.height;
                    var ahexbin = d3hexbin
                        .hexbin()
                        .radius(this.autoHexRadius)
                        .extent([[0, 0], [width, height]]);
                    var diameterX = this.autoHexRadius * Math.sqrt(3);
                    var diameterY = this.autoHexRadius * 2;
                    var renderWidth = this.maxColumnsUsed * diameterX;
                    if (this.maxRowsUsed >= 2 && this.data.length >= (2 * this.maxColumnsUsed)) {
                        renderWidth += (diameterX / 2);
                    }
                    var renderHeight = ((this.maxRowsUsed * 0.75) + 0.25) * diameterY;
                    var xoffset = ((width - renderWidth + diameterX) / 2);
                    var yoffset = ((height - renderHeight + diameterY) / 2);
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
                    var textAreaWidth = diameterX;
                    var textAreaHeight = (diameterY / 2);
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
                            break;
                        case "hexagon_flat_top":
                            customShape = ahexbin.hexagon(this.autoHexRadius);
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
                    if (this.opt.polystat.fontAutoScale) {
                        var maxLabel = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].name.length > maxLabel.length) {
                                maxLabel = this.data[i].name;
                            }
                        }
                        var maxValue = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].valueFormatted.length > maxValue.length) {
                                maxValue = this.data[i].valueFormatted;
                            }
                            var submetricCount = this.data[i].members.length;
                            if (submetricCount > 0) {
                                var counter = 0;
                                while (counter < submetricCount) {
                                    var checkContent = this.formatValueContent(i, counter, this);
                                    if (checkContent && checkContent.length > maxValue.length) {
                                        maxValue = checkContent;
                                    }
                                    counter++;
                                }
                            }
                        }
                        activeLabelFontSize = this.computeTextFontSize(maxLabel, 2, textAreaWidth, textAreaHeight);
                        activeValueFontSize = this.computeTextFontSize(maxValue, 2, textAreaWidth, textAreaHeight);
                        if (activeValueFontSize > activeLabelFontSize) {
                            activeValueFontSize = activeLabelFontSize;
                        }
                    }
                    var valueWithLabelTextAlignment = ((textAreaHeight / 2) / 2) + (activeValueFontSize / 2);
                    var valueOnlyTextAlignment = (activeValueFontSize / 2);
                    var labelWithValueTextAlignment = -((textAreaHeight / 2) / 2) + (activeLabelFontSize / 2);
                    var labelOnlyTextAlignment = (activeLabelFontSize / 2);
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
                    textspot.enter()
                        .append("text")
                        .attr("class", "toplabel")
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d, i) {
                        var item = data[i];
                        var alignment = labelOnlyTextAlignment;
                        if (showValue(item)) {
                            alignment = labelWithValueTextAlignment;
                        }
                        return d.y + alignment;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("font-size", activeLabelFontSize + "px")
                        .attr("fill", "black")
                        .style("pointer-events", "none")
                        .text(function (_, i) {
                        var item = data[i];
                        if (showName(item)) {
                            return item.name;
                        }
                        return "";
                    });
                    var frames = 0;
                    textspot.enter()
                        .append("text")
                        .attr("class", function (_, i) {
                        return "valueLabel" + i;
                    })
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d, i) {
                        var item = data[i];
                        var alignment = valueOnlyTextAlignment;
                        if (showName(item)) {
                            alignment = valueWithLabelTextAlignment;
                        }
                        return d.y + alignment;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("fill", "black")
                        .attr("font-size", activeValueFontSize + "px")
                        .style("pointer-events", "none")
                        .text(function (_, i) {
                        var counter = 0;
                        var dataLen = _this.data.length;
                        var content = null;
                        while ((content === null) && (counter < dataLen)) {
                            content = _this.formatValueContent(i, (frames + counter), _this);
                            counter++;
                        }
                        var valueTextLocation = svg.select("text.valueLabel" + i);
                        valueTextLocation.attr("font-size", activeValueFontSize + "px");
                        d3.interval(function () {
                            var valueTextLocation = svg.select("text.valueLabel" + i);
                            var compositeIndex = i;
                            valueTextLocation.text(function () {
                                valueTextLocation.attr("font-size", activeValueFontSize + "px");
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
                        if ((!this.opt.displayLimit || points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
                            maxRowsUsed += 1;
                            columnsUsed = 0;
                            for (var j = 0; j < this.numColumns; j++) {
                                if ((!this.opt.displayLimit || points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFTO1FBRXpCLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsSUFBUztRQUUxQixPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRDtnQkF1QkUsbUJBQVksV0FBZ0IsRUFBRSxZQUFpQixFQUFFLE9BQVksRUFBRSxHQUFRO29CQUp2RSxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBSVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElB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Ii4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZDMtaGV4YmluL2luZGV4LmQudHNcIiAvPlxuLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzL2luZGV4LmQudHNcIiAvPlxuaW1wb3J0ICogYXMgZDMgZnJvbSBcIi4vZXh0ZXJuYWwvZDMubWluLmpzXCI7XG5pbXBvcnQgKiBhcyBkM2hleGJpbiBmcm9tIFwiLi9leHRlcm5hbC9kMy1oZXhiaW4uanNcIjtcbmltcG9ydCB7IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5mdW5jdGlvbiByZXNvbHZlQ2xpY2tUaHJvdWdoVVJMKGQgOiBhbnkpIDogc3RyaW5nIHtcbiAgbGV0IGNsaWNrVGhyb3VnaFVSTCA9IGQuY2xpY2tUaHJvdWdoO1xuICBpZiAoZC5zYW5pdGl6ZVVSTEVuYWJsZWQgPT09IHRydWUgJiYgZC5zYW5pdGl6ZWRVUkwubGVuZ3RoID4gMCkge1xuICAgIGNsaWNrVGhyb3VnaFVSTCA9IGQuc2FuaXRpemVkVVJMO1xuICB9XG4gIHJldHVybiBjbGlja1Rocm91Z2hVUkw7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDbGlja1Rocm91Z2hUYXJnZXQoZCA6IGFueSkgOiBzdHJpbmcge1xuICBsZXQgY2xpY2tUaHJvdWdoVGFyZ2V0ID0gXCJfc2VsZlwiO1xuICBpZiAoZC5uZXdUYWJFbmFibGVkID09PSB0cnVlKSB7XG4gICAgY2xpY2tUaHJvdWdoVGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgfVxuICByZXR1cm4gY2xpY2tUaHJvdWdoVGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBzaG93TmFtZShpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gY2hlY2sgaWYgcHJvcGVydHkgZXhpc3QgYW5kIGNoZWNrIGl0cyB2YWx1ZVxuICByZXR1cm4gKCEoXCJzaG93TmFtZVwiIGluIGl0ZW0pIHx8IGl0ZW0uc2hvd05hbWUpO1xufVxuXG5mdW5jdGlvbiBzaG93VmFsdWUoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0IGFuZCBjaGVjayBpdHMgdmFsdWVcbiAgcmV0dXJuICghKFwic2hvd1ZhbHVlXCIgaW4gaXRlbSkgfHwgaXRlbS5zaG93VmFsdWUpO1xufVxuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIGQzRGl2SWQ6IGFueTtcbiAgbWF4Q29sdW1uc1VzZWQ6IG51bWJlcjtcbiAgbWF4Um93c1VzZWQ6IG51bWJlcjtcbiAgb3B0OiBhbnk7XG4gIGRhdGE6IGFueTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgY2FsY3VsYXRlZFBvaW50czogYW55O1xuICBoZXhSYWRpdXM6IG51bWJlcjtcbiAgYXV0b0hleFJhZGl1cyA6IG51bWJlcjtcbiAgbnVtQ29sdW1uczogbnVtYmVyO1xuICBudW1Sb3dzOiBudW1iZXI7XG4gIG1hcmdpbjoge1xuICAgIHRvcDogbnVtYmVyLFxuICAgIHJpZ2h0IDogbnVtYmVyLFxuICAgIGJvdHRvbSA6IG51bWJlcixcbiAgICBsZWZ0IDogbnVtYmVyLFxuICB9O1xuICBtaW5Gb250ID0gODtcbiAgbWF4Rm9udCA9IDI0MDtcbiAgcHVyZWxpZ2h0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVTcnY6IGFueSwgc3ZnQ29udGFpbmVyOiBhbnksIGQzRGl2SWQ6IGFueSwgb3B0OiBhbnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBzdmdDb250YWluZXI7XG4gICAgdGhpcy5kM0RpdklkID0gZDNEaXZJZDtcbiAgICB0aGlzLmRhdGEgPSBvcHQuZGF0YTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcblxuICAgIHRoaXMucHVyZWxpZ2h0ID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpO1xuICAgIC8vIHRpdGxlIGlzIDI2cHhcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogMzAgKyAyNixcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgYm90dG9tOiAyMCxcbiAgICAgIGxlZnQ6IDUwXG4gICAgfTtcbiAgICAvLyB0YWtlIDEwIG9mZiB0aGUgaGVpZ2h0XG4gICAgdGhpcy5vcHQuaGVpZ2h0IC09IDEwO1xuICAgIHRoaXMub3B0LndpZHRoIC09IDIwO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0LmRhdGE7XG4gICAgdGhpcy5udW1Db2x1bW5zID0gNTtcbiAgICB0aGlzLm51bVJvd3MgPSA1O1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSAwO1xuICAgIGlmIChvcHQucm93QXV0b1NpemUgJiYgb3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm51bUNvbHVtbnMgPSBvcHQuY29sdW1ucyB8fCA2O1xuICAgICAgdGhpcy5udW1Sb3dzID0gb3B0LnJvd3MgfHwgNjtcbiAgICB9XG4gICAgaWYgKCghb3B0LnJhZGl1c0F1dG9TaXplKSAmJiAob3B0LnJhZGl1cykpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vIHx8IDUwO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vfHwgNTA7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcbiAgfVxuXG4gIGNvbXB1dGVUZXh0Rm9udFNpemUodGV4dDogc3RyaW5nLCBsaW5lc1RvRGlzcGxheTogbnVtYmVyLCB0ZXh0QXJlYVdpZHRoOiBudW1iZXIsIHRleHRBcmVhSGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0KFxuICAgICAgdGV4dCxcbiAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIiwgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgdGV4dEFyZWFXaWR0aCxcbiAgICAgIHRleHRBcmVhSGVpZ2h0IC8gbGluZXNUb0Rpc3BsYXksIC8vIG11bHRpcGxlIGxpbmVzIG9mIHRleHRcbiAgICAgIHRoaXMubWluRm9udCxcbiAgICAgIHRoaXMubWF4Rm9udCk7XG4gIH1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAodGhpcy5vcHQucm93QXV0b1NpemUgJiYgdGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgIC8vIHNxcnQgb2YgIyBkYXRhIGl0ZW1zXG4gICAgICBsZXQgc3F1YXJlZCA9IE1hdGguc3FydCh0aGlzLmRhdGEubGVuZ3RoKTtcbiAgICAgIC8vIGZhdm9yIGNvbHVtbnMgd2hlbiB3aWR0aCBpcyBncmVhdGVyIHRoYW4gaGVpZ2h0XG4gICAgICAvLyBmYXZvciByb3dzIHdoZW4gd2lkdGggaXMgbGVzcyB0aGFuIGhlaWdodFxuICAgICAgaWYgKHRoaXMub3B0LndpZHRoID4gdGhpcy5vcHQuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCgodGhpcy5vcHQud2lkdGggLyB0aGlzLm9wdC5oZWlnaHQpICogc3F1YXJlZCk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIGNvbHVtbiBhbmQgbWF4LiBkYXRhLmxlbmd0aCBjb2x1bW5zXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm51bUNvbHVtbnMgPiB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsaWduIHJvd3MgY291bnQgdG8gY29tcHV0ZWQgY29sdW1ucyBjb3VudFxuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtQ29sdW1ucyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIHJvd1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnVtUm93cyA9IE1hdGguY2VpbCgodGhpcy5vcHQuaGVpZ2h0IC8gdGhpcy5vcHQud2lkdGgpICogc3F1YXJlZCk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIHJvdyBhbmQgbWF4LiBkYXRhLmxlbmd0aCByb3dzXG4gICAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm51bVJvd3MgPiB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbGlnbiBjb2x1bm5zIGNvdW50IHRvIGNvbXB1dGVkIHJvd3MgY291bnRcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSBjb2x1bW5cbiAgICAgICAgaWYgKHRoaXMubnVtQ29sdW1ucyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdC5yb3dBdXRvU2l6ZSkge1xuICAgICAgLy8gQWxpZ24gcm93cyBjb3VudCB0byBmaXhlZCBjb2x1bW5zIGNvdW50XG4gICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtQ29sdW1ucyk7XG4gICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3dcbiAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgICAvLyBBbGlnbiBjb2x1bm5zIGNvdW50IHRvIGZpeGVkIHJvd3MgY291bnRcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSBjb2x1bW5cbiAgICAgICAgaWYgKHRoaXMubnVtQ29sdW1ucyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coXCJDYWxjdWxhdGVkIGNvbHVtbnMgPSBcIiArIHRoaXMubnVtQ29sdW1ucyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIkNhbGN1bGF0ZWQgcm93cyA9IFwiICsgdGhpcy5udW1Sb3dzKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGRhdGEgaXRlbXMgdG8gcmVuZGVyID0gXCIgKyB0aGlzLmRhdGEubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLm9wdC5yYWRpdXNBdXRvU2l6ZSkge1xuICAgICAgdGhpcy5oZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTtcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImF1dG9IZXhSYWRpdXM6XCIgKyB0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSB0aGlzLmdlbmVyYXRlUG9pbnRzKCk7XG5cbiAgICB2YXIgd2lkdGggPSB0aGlzLm9wdC53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHQuaGVpZ2h0O1xuICAgIC8vY29uc29sZS5sb2coXCJEZXRlY3RlZCBXaWR0aDogXCIgKyB3aWR0aCArIFwiIEhlaWdodDogXCIgKyBoZWlnaHQpO1xuICAgIC8vY29uc29sZS5sb2coXCJhdXRvcmFkOlwiICsgdGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICB2YXIgYWhleGJpbiA9IGQzaGV4YmluXG4gICAgICAuaGV4YmluKClcbiAgICAgIC5yYWRpdXModGhpcy5hdXRvSGV4UmFkaXVzKVxuICAgICAgLmV4dGVudChbWzAsIDBdLCBbd2lkdGgsIGhlaWdodF1dKTtcblxuICAgIC8vIGQzIGNhbGN1bGF0ZXMgdGhlIHJhZGl1cyBmb3IgeCBhbmQgeSBzZXBhcmF0ZWx5IGJhc2VkIG9uIHRoZSB2YWx1ZSBwYXNzZWQgaW5cbiAgICBsZXQgZGlhbWV0ZXJYID0gdGhpcy5hdXRvSGV4UmFkaXVzICogTWF0aC5zcXJ0KDMpO1xuICAgIGxldCBkaWFtZXRlclkgPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAyO1xuICAgIGxldCByZW5kZXJXaWR0aCA9IHRoaXMubWF4Q29sdW1uc1VzZWQgKiBkaWFtZXRlclg7XG4gICAgLy8gRXZlbiByb3dzIGFyZSBzaGlmdGVkIGJ5IGFuIHgtcmFkaXVzIChoYWxmIHgtZGlhbWV0ZXIpIG9uIHRoZSByaWdodFxuICAgIC8vIENoZWNrIGlmIGF0IGxlYXN0IG9uZSBldmVuIHJvdyBpcyBmdWxsIChmaXJzdCBvbmUgaXMgcm93IDIpXG4gICAgaWYgKHRoaXMubWF4Um93c1VzZWQgPj0gMiAmJiB0aGlzLmRhdGEubGVuZ3RoID49ICgyICogdGhpcy5tYXhDb2x1bW5zVXNlZCkpIHtcbiAgICAgIHJlbmRlcldpZHRoICs9IChkaWFtZXRlclggLyAyKTtcbiAgICB9XG4gICAgLy8gVGhlIHNwYWNlIHRha2VuIGJ5IDEgcm93IG9mIGhleGFnb25zIGlzIDMvNCBvZiBpdHMgaGVpZ2h0IChhbGwgbWludXMgcG9pbnR5IGJvdHRvbSlcbiAgICAvLyBBdCB0aGVuIGVuZCB3ZSBuZWVkIHRvIGFkZCB0aGUgcG9pbnR5IGJvdHRvbSBvZiB0aGUgbGFzdCByb3cgKDEvNCBvZiB0aGUgaGVpZ2h0KVxuICAgIGxldCByZW5kZXJIZWlnaHQgPSAoKHRoaXMubWF4Um93c1VzZWQgKiAwLjc1KSArIDAuMjUpICogZGlhbWV0ZXJZO1xuICAgIC8vIFRyYW5zbGF0ZSB0aGUgd2hvbGUgaGV4YWdvbnMgZ3JhcGggdG8gaGF2ZSBpdCBjZW5ldGVyZWQgaW4gdGhlIGRyYXdpbmcgYXJlYVxuICAgIC8vIC0gY2VudGVyIHRoZSByZW5kZXJlZCBhcmVhIHdpdGggdGhlIGRyYXdpbmcgYXJlYSwgdHJhbnNsYXRlIGJ5OlxuICAgIC8vICAgICAoKHdpZHRoIC0gcmVuZGVyV2lkdGgpIC8gMiwgKGhlaWdodCAtIHJlbmRlckhlaWdodCkgLyAyKVxuICAgIC8vIC0gZ28gdG8gdGhlIGNlbnRlciBvZiB0aGUgZmlyc3QgaGV4YWdvbiwgdHJhbnNsYXRlIGJ5OlxuICAgIC8vICAgICAoZGlhbWV0ZXJYIC8gMiwgZGlhbWV0ZXJZIC8gMilcbiAgICBsZXQgeG9mZnNldCA9ICgod2lkdGggLSByZW5kZXJXaWR0aCArIGRpYW1ldGVyWCkgLyAyKTtcbiAgICBsZXQgeW9mZnNldCA9ICgoaGVpZ2h0IC0gcmVuZGVySGVpZ2h0ICsgZGlhbWV0ZXJZKSAvIDIpO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBkaXYgZm9yIHRoZSB0b29sdGlwXG4gICAgLy8gYWRkIGl0IHRvIHRoZSBib2R5IGFuZCBub3QgdGhlIGNvbnRhaW5lciBzbyBpdCBjYW4gZmxvYXQgb3V0c2lkZSBvZiB0aGUgcGFuZWxcbiAgICB2YXIgdG9vbHRpcCA9IGQzXG4gICAgICAuc2VsZWN0KFwiYm9keVwiKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwicG9seXN0YXQtcGFuZWwtdG9vbHRpcFwiKVxuICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICB2YXIgc3ZnIDogYW55ID0gZDMuc2VsZWN0KHRoaXMuc3ZnQ29udGFpbmVyKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgIC5hdHRyKFwieG1sbnM6eGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwiYm9yZGVyXCIsIFwiMHB4IHNvbGlkIHdoaXRlXCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHhvZmZzZXQgKyBcIixcIiArIHlvZmZzZXQgKyBcIilcIik7XG5cbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICB2YXIgZGVmcyA9IHN2Zy5hcHBlbmQoXCJkZWZzXCIpO1xuXG4gICAgbGV0IGNvbG9yR3JhZGllbnRzID0gQ29sb3IuY3JlYXRlR3JhZGllbnRzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JHcmFkaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJOYW1lID0gXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBsZXQgYUdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjb2xvckdyYWRpZW50c1tpXS5zdGFydCk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uZW5kKTtcbiAgICB9XG4gICAgbGV0IG9rQ29sb3JTdGFydCA9IG5ldyBDb2xvcig4MiwgMTk0LCA1Mik7IC8vICM1MmMyMzRcbiAgICBsZXQgb2tDb2xvckVuZCA9IG9rQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IG9rR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLW9rXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvclN0YXJ0LmFzSGV4KCkpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgb2tDb2xvckVuZC5hc0hleCgpKTtcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNKdWljeU9yYW5nZVxuICAgIGxldCB3YXJuaW5nQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyNTUsIDIwMCwgNTUpOyAvLyAjRkZDODM3XG4gICAgbGV0IHdhcm5pbmdDb2xvckVuZCA9IHdhcm5pbmdDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgd2FybmluZ0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXdhcm5pbmdcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgd2FybmluZ0NvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IG9yYW5nZVxuICAgIHdhcm5pbmdHcmFkaWVudC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayBvcmFuZ2VcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNZb3VUdWJlXG4gICAgbGV0IGNyaXRpY2FsQ29sb3JTdGFydCA9IG5ldyBDb2xvcigyMjksIDQ1LCAzOSk7IC8vIGU1MmQyN1xuICAgIGxldCBjcml0aWNhbENvbG9yRW5kID0gY3JpdGljYWxDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgY3JpdGljYWxHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtY3JpdGljYWxcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjcml0aWNhbENvbG9yU3RhcnQuYXNIZXgoKSk7IC8vIGxpZ2h0IHJlZFxuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvckVuZC5hc0hleCgpKTsgLy8gZGFyayByZWRcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNBc2hcbiAgICBsZXQgdW5rbm93bkdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS11bmtub3duXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzczODA4QVwiKTsgLy8gbGlnaHQgZ3JleVxuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3NTdGOUFcIik7IC8vIGRhcmsgZ3JleVxuXG4gICAgbGV0IGN1c3RvbVNoYXBlID0gbnVsbDtcbiAgICAvLyBjb21wdXRlIHRleHQgYXJlYSBzaXplICh1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgZm9udHNpemUpXG4gICAgbGV0IHRleHRBcmVhV2lkdGggPSBkaWFtZXRlclg7XG4gICAgbGV0IHRleHRBcmVhSGVpZ2h0ID0gKGRpYW1ldGVyWSAvIDIpOyAvLyBUb3AgYW5kIGJvdHRvbSBvZiBoZXhhZ29uIGFyZSBub3QgdXNlZFxuICAgIC8vIHN5bWJvbHMgdXNlIHRoZSBhcmVhIGZvciB0aGVpciBzaXplXG4gICAgbGV0IGlubmVyQXJlYSA9IGRpYW1ldGVyWCAqIGRpYW1ldGVyWTtcbiAgICAvLyB1c2UgdGhlIHNtYWxsZXIgb2YgZGlhbWV0ZXJYIG9yIFlcbiAgICBpZiAoZGlhbWV0ZXJYIDwgZGlhbWV0ZXJZKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclg7XG4gICAgfVxuICAgIGlmIChkaWFtZXRlclkgPCBkaWFtZXRlclgpIHtcbiAgICAgIGlubmVyQXJlYSA9IGRpYW1ldGVyWSAqIGRpYW1ldGVyWTtcbiAgICB9XG4gICAgbGV0IHN5bWJvbCA9IGQzLnN5bWJvbCgpLnNpemUoaW5uZXJBcmVhKTtcbiAgICBzd2l0Y2ggKHRoaXMub3B0LnBvbHlzdGF0LnNoYXBlKSB7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJoZXhhZ29uX2ZsYXRfdG9wXCI6XG4gICAgICAgIC8vIFRPRE86IHVzZSBwb2ludGVkIGZvciBub3dcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2lyY2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ2lyY2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDcm9zcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRpYW1vbmRcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xEaWFtb25kKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3F1YXJlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3F1YXJlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RhclwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFN0YXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlhbmdsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFRyaWFuZ2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid3llXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sV3llKTtcbiAgICAgICAgYnJlYWs7XG4gICAgIGRlZmF1bHQ6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgZm9udHNpemUgYmFzZWQgb24gdGhlIHNoYXBlIGFuZCB0aGUgdGV4dFxuICAgIGxldCBhY3RpdmVMYWJlbEZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgLy8gZm9udCBzaXplcyBhcmUgaW5kZXBlbmRlbnQgZm9yIGxhYmVsIGFuZCB2YWx1ZXNcbiAgICBsZXQgYWN0aXZlVmFsdWVGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuXG4gICAgLy8gY29tcHV0ZSBmb250IHNpemUgaWYgYXV0b3NjYWxlIGlzIGFjdGl2YXRlZFxuICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5mb250QXV0b1NjYWxlKSB7XG4gICAgICAvLyBmaW5kIHRoZSBtb3N0IHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBvdmVyIGFsbCBpdGVtc1xuICAgICAgbGV0IG1heExhYmVsID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaV0ubmFtZS5sZW5ndGggPiBtYXhMYWJlbC5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhMYWJlbCA9IHRoaXMuZGF0YVtpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBzYW1lIGZvciB0aGUgdmFsdWUsIGFsc28gY2hlY2sgZm9yIHN1Ym1ldHJpY3Mgc2l6ZSBpbiBjYXNlIG9mIGNvbXBvc2l0ZVxuICAgICAgbGV0IG1heFZhbHVlID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJDaGVja2luZyBsZW46IFwiICsgdGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkICsgXCIgdnM6IFwiICsgbWF4VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkLmxlbmd0aCA+IG1heFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgIG1heFZhbHVlID0gdGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdWJtZXRyaWNDb3VudCA9IHRoaXMuZGF0YVtpXS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgaWYgKHN1Ym1ldHJpY0NvdW50ID4gMCkge1xuICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICB3aGlsZSAoY291bnRlciA8IHN1Ym1ldHJpY0NvdW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcXFwiXCIgKyBjaGVja0NvbnRlbnQgKyBcIlxcXCIgdnM6IFxcXCJcIiArIG1heFZhbHVlICsgXCJcXFwiXCIpO1xuICAgICAgICAgICAgaWYgKGNoZWNrQ29udGVudCAmJiBjaGVja0NvbnRlbnQubGVuZ3RoID4gbWF4VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIG1heFZhbHVlID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXN0aW1hdGUgaG93IGJpZyBvZiBhIGZvbnQgY2FuIGJlIHVzZWRcbiAgICAgIC8vIFR3byBsaW5lcyBvZiB0ZXh0IG11c3QgZml0IHdpdGggdmVydGljYWwgc3BhY2luZyBpbmNsdWRlZFxuICAgICAgLy8gaWYgaXQgaXMgdG9vIHNtYWxsLCBoaWRlIGV2ZXJ5dGhpbmdcbiAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSB0aGlzLmNvbXB1dGVUZXh0Rm9udFNpemUobWF4TGFiZWwsIDIsIHRleHRBcmVhV2lkdGgsIHRleHRBcmVhSGVpZ2h0KTtcbiAgICAgIGFjdGl2ZVZhbHVlRm9udFNpemUgPSB0aGlzLmNvbXB1dGVUZXh0Rm9udFNpemUobWF4VmFsdWUsIDIsIHRleHRBcmVhV2lkdGgsIHRleHRBcmVhSGVpZ2h0KTtcblxuICAgICAgLy8gdmFsdWUgc2hvdWxkIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSBsYWJlbFxuICAgICAgaWYgKGFjdGl2ZVZhbHVlRm9udFNpemUgPiBhY3RpdmVMYWJlbEZvbnRTaXplKSB7XG4gICAgICAgIGFjdGl2ZVZhbHVlRm9udFNpemUgPSBhY3RpdmVMYWJlbEZvbnRTaXplO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbXB1dGUgYWxpZ25tZW50IGZvciBlYWNoIHRleHQgZWxlbWVudCwgYmFzZSBjb29yZGluYXRlIGlzIGF0IHRoZSBjZW50ZXIgb2YgdGhlIHBvbHlnb24gKHRleHQgaXMgYW5jaG9yZWQgYXQgaXRzIGJvdHRvbSk6XG4gICAgLy8gLSBWYWx1ZSB0ZXh0IChib3R0b20gdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChwb3NpdGl2ZWx5IGkuZS4gbG93ZXIpIGluIHRoZSBtaWRkbGUgb2YgdGhlIGJvdHRvbSBoYWxmIG9mIHRoZSB0ZXh0IGFyZWFcbiAgICAvLyAtIExhYmVsIHRleHQgKHRvcCB0ZXh0KSB3aWxsIGJlIGFsaWduZWQgKG5lZ2F0aXZlbHksIGkuZS4gaGlnaGVyKSBpbiB0aGUgbWlkZGxlIG9mIHRoZSB0b3AgaGFsZiBvZiB0aGUgdGV4dCBhcmVhXG4gICAgbGV0IHZhbHVlV2l0aExhYmVsVGV4dEFsaWdubWVudCA9ICgodGV4dEFyZWFIZWlnaHQgLyAyKSAvIDIpICsgKGFjdGl2ZVZhbHVlRm9udFNpemUgLyAyKTtcbiAgICBsZXQgdmFsdWVPbmx5VGV4dEFsaWdubWVudCA9IChhY3RpdmVWYWx1ZUZvbnRTaXplIC8gMik7XG4gICAgbGV0IGxhYmVsV2l0aFZhbHVlVGV4dEFsaWdubWVudCA9IC0oKHRleHRBcmVhSGVpZ2h0IC8gMikgLyAyKSArIChhY3RpdmVMYWJlbEZvbnRTaXplIC8gMik7XG4gICAgbGV0IGxhYmVsT25seVRleHRBbGlnbm1lbnQgPSAoYWN0aXZlTGFiZWxGb250U2l6ZSAvIDIpO1xuXG4gICAgc3ZnLnNlbGVjdEFsbChcIi5oZXhhZ29uXCIpXG4gICAgICAuZGF0YShhaGV4YmluKHRoaXMuY2FsY3VsYXRlZFBvaW50cykpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmVhY2goKF8sIGksIG5vZGVzKSA9PiB7XG4gICAgICAgIGxldCBub2RlID0gZDMuc2VsZWN0KG5vZGVzW2ldKTtcbiAgICAgICAgbGV0IGNsaWNrVGhyb3VnaFVSTCA9IHJlc29sdmVDbGlja1Rocm91Z2hVUkwoZGF0YVtpXSk7XG4gICAgICAgIGlmIChjbGlja1Rocm91Z2hVUkwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG5vZGUgPSBub2RlLmFwcGVuZChcImFcIilcbiAgICAgICAgICAgIC5hdHRyKFwidGFyZ2V0XCIsIHJlc29sdmVDbGlja1Rocm91Z2hUYXJnZXQoZGF0YVtpXSkpXG4gICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgY2xpY2tUaHJvdWdoVVJMKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmlsbENvbG9yID0gZGF0YVtpXS5jb2xvcjtcbiAgICAgICAgaWYgKHRoaXMub3B0LnBvbHlzdGF0LmdyYWRpZW50RW5hYmxlZCkge1xuICAgICAgICAgIC8vIHNhZmFyaSBuZWVkcyB0aGUgbG9jYXRpb24uaHJlZlxuICAgICAgICAgIGZpbGxDb2xvciA9IFwidXJsKFwiICsgbG9jYXRpb24uaHJlZiArIFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBub2RlLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiaGV4YWdvblwiKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG4gICAgICAgICAgLmF0dHIoXCJkXCIsIGN1c3RvbVNoYXBlKVxuICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIHRoaXMub3B0LnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvcilcbiAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSArIFwicHhcIilcbiAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZpbGxDb2xvcilcbiAgICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gdXNlIHRoZSB2aWV3cG9ydHdpZHRoIHRvIHByZXZlbnQgdGhlIHRvb2x0aXAgZnJvbSBnb2luZyB0b28gZmFyIHJpZ2h0XG4gICAgICAgICAgICBsZXQgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICAgICAgICAvLyB1c2UgdGhlIG1vdXNlIHBvc2l0aW9uIGZvciB0aGUgZW50aXJlIHBhZ2VcbiAgICAgICAgICAgIHZhciBtb3VzZSA9IGQzLm1vdXNlKGQzLnNlbGVjdChcImJvZHlcIikubm9kZSgpKTtcbiAgICAgICAgICAgIHZhciB4cG9zID0gbW91c2VbMF0gLSA1MDtcbiAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IG9mZnNjcmVlbiB0b29sdGlwXG4gICAgICAgICAgICBpZiAoeHBvcyA8IDApIHtcbiAgICAgICAgICAgICAgeHBvcyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwcmV2ZW50IHRvb2x0aXAgZnJvbSByZW5kZXJpbmcgb3V0c2lkZSBvZiB2aWV3cG9ydFxuICAgICAgICAgICAgaWYgKCh4cG9zICsgMjAwKSA+IHZpZXdQb3J0V2lkdGgpIHtcbiAgICAgICAgICAgICAgeHBvcyA9IHZpZXdQb3J0V2lkdGggLSAyMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeXBvcyA9IG1vdXNlWzFdICsgNTtcbiAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCB4cG9zICsgXCJweFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgeXBvcyArIFwicHhcIik7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMCkuc3R5bGUoXCJvcGFjaXR5XCIsIDAuOSk7XG4gICAgICAgICAgICB0b29sdGlwLmh0bWwodGhpcy5vcHQudG9vbHRpcENvbnRlbnRbaV0pXG4gICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCB0aGlzLm9wdC50b29sdGlwRm9udFNpemUpXG4gICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnRvb2x0aXBGb250VHlwZSlcbiAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZC54IC0gNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZC55IC0gNSkgKyBcInB4XCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIC8vIG5vdyBsYWJlbHNcbiAgICB2YXIgdGV4dHNwb3QgPSBzdmcuc2VsZWN0QWxsKFwidGV4dC50b3BsYWJlbFwiKVxuICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKTtcblxuICAgIHRleHRzcG90LmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9wbGFiZWxcIilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgbGV0IGFsaWdubWVudCA9IGxhYmVsT25seVRleHRBbGlnbm1lbnQ7XG4gICAgICAgIGlmIChzaG93VmFsdWUoaXRlbSkpIHtcbiAgICAgICAgICBhbGlnbm1lbnQgPSBsYWJlbFdpdGhWYWx1ZVRleHRBbGlnbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGQueSArIGFsaWdubWVudDtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnBvbHlzdGF0LmZvbnRUeXBlKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgYWN0aXZlTGFiZWxGb250U2l6ZSArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgaWYgKHNob3dOYW1lKGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH0pO1xuXG4gICAgdmFyIGZyYW1lcyA9IDA7XG5cbiAgICB0ZXh0c3BvdC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihfLCBpKSB7XG4gICAgICAgIHJldHVybiBcInZhbHVlTGFiZWxcIiArIGk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICBsZXQgYWxpZ25tZW50ID0gdmFsdWVPbmx5VGV4dEFsaWdubWVudDtcbiAgICAgICAgaWYgKHNob3dOYW1lKGl0ZW0pKSB7XG4gICAgICAgICAgYWxpZ25tZW50ID0gdmFsdWVXaXRoTGFiZWxUZXh0QWxpZ25tZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkLnkgKyBhbGlnbm1lbnQ7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCB0aGlzLm9wdC5wb2x5c3RhdC5mb250VHlwZSlcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpXG4gICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBhY3RpdmVWYWx1ZUZvbnRTaXplICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpXG4gICAgICAudGV4dCggKF8sIGkpID0+IHtcbiAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIChmcmFtZXMgKyBjb3VudGVyKSwgdGhpcyk7XG4gICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAvLyB1c2UgdGhlIGR5bmFtaWMgc2l6ZSBmb3IgdGhlIHZhbHVlXG4gICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgYWN0aXZlVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgIGQzLmludGVydmFsKCAoKSA9PiB7XG4gICAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgICAgdmFyIGNvbXBvc2l0ZUluZGV4ID0gaTtcbiAgICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi50ZXh0KCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBhY3RpdmVWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcblxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBudWxsO1xuICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgbGV0IGRhdGFMZW4gPSB0aGlzLmRhdGEubGVuZ3RoICogMjtcbiAgICAgICAgICAgIC8vIHNlYXJjaCBmb3IgYSB2YWx1ZSBjeWNsaW5nIHRocm91Z2ggdHdpY2UgdG8gYWxsb3cgcm9sbG92ZXJcbiAgICAgICAgICAgIHdoaWxlICgoY29udGVudCA9PT0gbnVsbCkgJiYgKGNvdW50ZXIgPCBkYXRhTGVuKSkge1xuICAgICAgICAgICAgICBjb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoY29tcG9zaXRlSW5kZXgsIChmcmFtZXMgKyBjb3VudGVyKSwgdGhpcyk7XG4gICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgLy8gVE9ETzogYWRkIGN1c3RvbSBjb250ZW50IGZvciBjb21wb3NpdGUgb2sgc3RhdGVcbiAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICAgIC8vIHNldCB0aGUgZm9udCBzaXplIHRvIGJlIHRoZSBzYW1lIGFzIHRoZSBsYWJlbCBhYm92ZVxuICAgICAgICAgICAgICAvL3ZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZnJhbWVzKys7XG4gICAgICAgIH0sIHRoaXMub3B0LmFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIGZvcm1hdFZhbHVlQ29udGVudChpLCBmcmFtZXMsIHRoaXNSZWYpOiBzdHJpbmcge1xuICAgIGxldCBkYXRhID0gdGhpc1JlZi5kYXRhW2ldO1xuICAgIC8vIG9wdGlvbnMgY2FuIHNwZWNpZnkgdG8gbm90IHNob3cgdGhlIHZhbHVlXG4gICAgaWYgKHR5cGVvZihkYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzaG93VmFsdWVcIikpIHtcbiAgICAgICAgaWYgKCFkYXRhLnNob3dWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJ2YWx1ZUZvcm1hdHRlZFwiKSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gZGF0YSwgcmV0dXJuIG5vdGhpbmdcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBzd2l0Y2ggKGRhdGEuYW5pbWF0ZU1vZGUpIHtcbiAgICAgIGNhc2UgXCJhbGxcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidHJpZ2dlcmVkXCI6XG4gICAgICAgIC8vIHJldHVybiBub3RoaW5nIGlmIG1vZGUgaXMgdHJpZ2dlcmVkIGFuZCB0aGUgc3RhdGUgaXMgMFxuICAgICAgICBpZiAoZGF0YS50aHJlc2hvbGRMZXZlbCA8IDEpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgY29udGVudCA9IGRhdGEudmFsdWVGb3JtYXR0ZWQ7XG4gICAgLy8gaWYgdGhlcmUncyBubyB2YWx1ZUZvcm1hdHRlZCwgdGhlcmUncyBub3RoaW5nIHRvIGRpc3BsYXlcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKGRhdGEucHJlZml4KSAmJiAoZGF0YS5wcmVmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnRlbnQgPSBkYXRhLnByZWZpeCArIFwiIFwiICsgY29udGVudDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnN1ZmZpeCkgJiYgKGRhdGEuc3VmZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gY29udGVudCArIFwiIFwiICsgZGF0YS5zdWZmaXg7XG4gICAgfVxuICAgIC8vIGEgY29tcG9zaXRlIHdpbGwgY29udGFpbiB0aGUgXCJ3b3JzdFwiIGNhc2UgYXMgdGhlIHZhbHVlRm9ybWF0dGVkLFxuICAgIC8vIGFuZCB3aWxsIGhhdmUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIHRoZSBjb21wb3NpdGUgaW5jbHVkZWQuXG4gICAgLy8gYXMgZnJhbWVzIGluY3JlbWVudCBmaW5kIGEgdHJpZ2dlcmVkIG1lbWJlciBzdGFydGluZyBmcm9tIHRoZSBmcmFtZSBtb2QgbGVuXG4gICAgbGV0IGxlbiA9IGRhdGEubWVtYmVycy5sZW5ndGg7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIGxldCB0cmlnZ2VyZWRJbmRleCA9IC0xO1xuICAgICAgaWYgKGRhdGEuYW5pbWF0ZU1vZGUgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBmcmFtZXMgJSBsZW47XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0cmlnZ2VyZWRJbmRleCBmcm9tIGFsbCBtb2RlOiBcIiArIHRyaWdnZXJlZEluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YS50cmlnZ2VyQ2FjaGUpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgZGF0YS50cmlnZ2VyQ2FjaGUgPSB0aGlzLmJ1aWxkVHJpZ2dlckNhY2hlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB6ID0gZnJhbWVzICUgZGF0YS50cmlnZ2VyQ2FjaGUubGVuZ3RoO1xuICAgICAgICB0cmlnZ2VyZWRJbmRleCA9IGRhdGEudHJpZ2dlckNhY2hlW3pdLmluZGV4O1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBjYWNoZSBpczogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9XG4gICAgICBsZXQgYU1lbWJlciA9IGRhdGEubWVtYmVyc1t0cmlnZ2VyZWRJbmRleF07XG5cbiAgICAgIGNvbnRlbnQgPSBhTWVtYmVyLm5hbWUgKyBcIjogXCIgKyBhTWVtYmVyLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgaWYgKChhTWVtYmVyLnByZWZpeCkgJiYgKGFNZW1iZXIucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnRlbnQgPSBhTWVtYmVyLnByZWZpeCArIFwiIFwiICsgY29udGVudDtcbiAgICAgIH1cbiAgICAgIGlmICgoYU1lbWJlci5zdWZmaXgpICYmIChhTWVtYmVyLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gY29udGVudCArIFwiIFwiICsgYU1lbWJlci5zdWZmaXg7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFsbG93IHRlbXBsYXRpbmdcbiAgICAvL1xuICAgIGlmICgoY29udGVudCkgJiYgKGNvbnRlbnQubGVuZ3RoID4gMCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXBsYWNlZENvbnRlbnQgPSB0aGlzUmVmLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dChjb250ZW50KTtcbiAgICAgICAgY29udGVudCA9IHJlcGxhY2VkQ29udGVudDtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiB0ZW1wbGF0ZSBzZXJ2ZXIgdGhyZXcgZXJyb3I6IFwiICsgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBidWlsZFRyaWdnZXJDYWNoZShpdGVtKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkJ1aWxkaW5nIHRyaWdnZXIgY2FjaGUgZm9yIGl0ZW1cIik7XG4gICAgbGV0IHRyaWdnZXJDYWNoZSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5tZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgYU1lbWJlciA9IGl0ZW0ubWVtYmVyc1tpXTtcbiAgICAgIGlmIChhTWVtYmVyLnRocmVzaG9sZExldmVsID4gMCkge1xuICAgICAgICAvLyBhZGQgdG8gbGlzdFxuICAgICAgICBsZXQgY2FjaGVkTWVtYmVyU3RhdGUgPSB7IGluZGV4OiBpLCBuYW1lOiBhTWVtYmVyLm5hbWUsIHZhbHVlOiBhTWVtYmVyLnZhbHVlLCB0aHJlc2hvbGRMZXZlbDogYU1lbWJlci50aHJlc2hvbGRMZXZlbCB9O1xuICAgICAgICB0cmlnZ2VyQ2FjaGUucHVzaChjYWNoZWRNZW1iZXJTdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHNvcnQgaXRcbiAgICB0cmlnZ2VyQ2FjaGUgPSBfLm9yZGVyQnkodHJpZ2dlckNhY2hlLCBbXCJ0aHJlc2hvbGRMZXZlbFwiLCBcInZhbHVlXCIsIFwibmFtZVwiXSwgW1wiZGVzY1wiLCBcImRlc2NcIiwgXCJhc2NcIl0pO1xuICAgIHJldHVybiB0cmlnZ2VyQ2FjaGU7XG4gIH1cblxuICBnZXRBdXRvSGV4UmFkaXVzKCk6IG51bWJlciB7XG4gICAgLy9UaGUgbWF4aW11bSByYWRpdXMgdGhlIGhleGFnb25zIGNhbiBoYXZlIHRvIHN0aWxsIGZpdCB0aGUgc2NyZWVuXG4gICAgLy8gV2l0aCAobG9uZykgcmFkaXVzIGJlaW5nIFI6XG4gICAgLy8gLSBUb3RhbCB3aWR0aCAocm93cyA+IDEpID0gMSBzbWFsbCByYWRpdXMgKHNxcnQoMykgKiBSIC8gMikgKyBjb2x1bW5zICogc21hbGwgZGlhbWV0ZXIgKHNxcnQoMykgKiBSKVxuICAgIC8vIC0gVG90YWwgaGVpZ2h0ID0gMSBwb2ludHkgdG9wICgxLzIgKiBSKSArIHJvd3MgKiBzaXplIG9mIHRoZSByZXN0ICgzLzIgKiBSKVxuICAgIGxldCByYWRpdXNGcm9tV2lkdGggPSAoMiAqIHRoaXMub3B0LndpZHRoKSAvIChNYXRoLnNxcnQoMykgKiAoIDEgKyAyICogdGhpcy5udW1Db2x1bW5zKSk7XG4gICAgbGV0IHJhZGl1c0Zyb21IZWlnaHQgPSAoMiAqIHRoaXMub3B0LmhlaWdodCkgLyAoMyAqIHRoaXMubnVtUm93cyArIDEpO1xuICAgIHZhciBoZXhSYWRpdXMgPSBkMy5taW4oXG4gICAgICBbXG4gICAgICAgIHJhZGl1c0Zyb21XaWR0aCxcbiAgICAgICAgcmFkaXVzRnJvbUhlaWdodFxuICAgICAgXVxuICAgICk7XG4gICAgcmV0dXJuIGhleFJhZGl1cztcbiAgfVxuXG4gIC8vIEJ1aWxkcyB0aGUgcGxhY2Vob2xkZXIgcG9seWdvbnMgbmVlZGVkIHRvIHJlcHJlc2VudCBlYWNoIG1ldHJpY1xuICBnZW5lcmF0ZVBvaW50cygpIDogYW55IHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgaWYgKHR5cGVvZih0aGlzLmRhdGEpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBsZXQgbWF4Um93c1VzZWQgPSAwO1xuICAgIGxldCBjb2x1bW5zVXNlZCA9IDA7XG4gICAgbGV0IG1heENvbHVtbnNVc2VkID0gMDtcbiAgICAvLyB3aGVuIGR1cGxpY2F0aW5nIHBhbmVscywgdGhpcyBnZXRzIG9kZFxuICAgIGlmICh0aGlzLm51bVJvd3MgPT09IEluZmluaXR5KSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwibnVtUm93cyBpbmZpbml0eS4uLlwiKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPT09IE5hTikge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm51bUNvbHVtbnMgTmFOXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bVJvd3M7IGkrKykge1xuICAgICAgaWYgKCghdGhpcy5vcHQuZGlzcGxheUxpbWl0IHx8IHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgbWF4Um93c1VzZWQgKz0gMTtcbiAgICAgICAgY29sdW1uc1VzZWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubnVtQ29sdW1uczsgaisrKSB7XG4gICAgICAgICAgaWYgKCghdGhpcy5vcHQuZGlzcGxheUxpbWl0IHx8IHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGNvbHVtbnNVc2VkICs9IDE7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgbW9zdCBudW1iZXIgb2YgY29sdW1uc1xuICAgICAgICAgICAgaWYgKGNvbHVtbnNVc2VkID4gbWF4Q29sdW1uc1VzZWQpIHtcbiAgICAgICAgICAgICAgbWF4Q29sdW1uc1VzZWQgPSBjb2x1bW5zVXNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt0aGlzLmhleFJhZGl1cyAqIGogKiAxLjc1LCB0aGlzLmhleFJhZGl1cyAqIGkgKiAxLjVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIk1heCByb3dzIHVzZWQ6XCIgKyBtYXhSb3dzVXNlZCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIkFjdHVhbCBjb2x1bW5zIHVzZWQ6XCIgKyBtYXhDb2x1bW5zVXNlZCk7XG4gICAgdGhpcy5tYXhSb3dzVXNlZCA9IG1heFJvd3NVc2VkO1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSBtYXhDb2x1bW5zVXNlZDtcbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbn1cbiJdfQ==