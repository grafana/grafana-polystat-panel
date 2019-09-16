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
                        if (showValue(item) && item.value && activeValueFontSize) {
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
                        if (showName(item) && item.name && activeLabelFontSize) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFTO1FBRXpCLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsSUFBUztRQUUxQixPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRDtnQkF1QkUsbUJBQVksV0FBZ0IsRUFBRSxZQUFpQixFQUFFLE9BQVksRUFBRSxHQUFRO29CQUp2RSxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBSVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElB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QUQsQ0FBQyxBQTVxQkQsSUE0cUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzLWhleGJpbi9pbmRleC5kLnRzXCIgLz5cbi8vLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9kMy9pbmRleC5kLnRzXCIgLz5cbmltcG9ydCAqIGFzIGQzIGZyb20gXCIuL2V4dGVybmFsL2QzLm1pbi5qc1wiO1xuaW1wb3J0ICogYXMgZDNoZXhiaW4gZnJvbSBcIi4vZXh0ZXJuYWwvZDMtaGV4YmluLmpzXCI7XG5pbXBvcnQgeyBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZUNsaWNrVGhyb3VnaFVSTChkIDogYW55KSA6IHN0cmluZyB7XG4gIGxldCBjbGlja1Rocm91Z2hVUkwgPSBkLmNsaWNrVGhyb3VnaDtcbiAgaWYgKGQuc2FuaXRpemVVUkxFbmFibGVkID09PSB0cnVlICYmIGQuc2FuaXRpemVkVVJMLmxlbmd0aCA+IDApIHtcbiAgICBjbGlja1Rocm91Z2hVUkwgPSBkLnNhbml0aXplZFVSTDtcbiAgfVxuICByZXR1cm4gY2xpY2tUaHJvdWdoVVJMO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGQgOiBhbnkpIDogc3RyaW5nIHtcbiAgbGV0IGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX3NlbGZcIjtcbiAgaWYgKGQubmV3VGFiRW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgIGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX2JsYW5rXCI7XG4gIH1cbiAgcmV0dXJuIGNsaWNrVGhyb3VnaFRhcmdldDtcbn1cblxuZnVuY3Rpb24gc2hvd05hbWUoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0IGFuZCBjaGVjayBpdHMgdmFsdWVcbiAgcmV0dXJuICghKFwic2hvd05hbWVcIiBpbiBpdGVtKSB8fCBpdGVtLnNob3dOYW1lKTtcbn1cblxuZnVuY3Rpb24gc2hvd1ZhbHVlKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAvLyBjaGVjayBpZiBwcm9wZXJ0eSBleGlzdCBhbmQgY2hlY2sgaXRzIHZhbHVlXG4gIHJldHVybiAoIShcInNob3dWYWx1ZVwiIGluIGl0ZW0pIHx8IGl0ZW0uc2hvd1ZhbHVlKTtcbn1cblxuZXhwb3J0IGNsYXNzIEQzV3JhcHBlciB7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBkM0RpdklkOiBhbnk7XG4gIG1heENvbHVtbnNVc2VkOiBudW1iZXI7XG4gIG1heFJvd3NVc2VkOiBudW1iZXI7XG4gIG9wdDogYW55O1xuICBkYXRhOiBhbnk7XG4gIHRlbXBsYXRlU3J2OiBhbnk7XG4gIGNhbGN1bGF0ZWRQb2ludHM6IGFueTtcbiAgaGV4UmFkaXVzOiBudW1iZXI7XG4gIGF1dG9IZXhSYWRpdXMgOiBudW1iZXI7XG4gIG51bUNvbHVtbnM6IG51bWJlcjtcbiAgbnVtUm93czogbnVtYmVyO1xuICBtYXJnaW46IHtcbiAgICB0b3A6IG51bWJlcixcbiAgICByaWdodCA6IG51bWJlcixcbiAgICBib3R0b20gOiBudW1iZXIsXG4gICAgbGVmdCA6IG51bWJlcixcbiAgfTtcbiAgbWluRm9udCA9IDg7XG4gIG1heEZvbnQgPSAyNDA7XG4gIHB1cmVsaWdodDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlU3J2OiBhbnksIHN2Z0NvbnRhaW5lcjogYW55LCBkM0RpdklkOiBhbnksIG9wdDogYW55KSB7XG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gc3ZnQ29udGFpbmVyO1xuICAgIHRoaXMuZDNEaXZJZCA9IGQzRGl2SWQ7XG4gICAgdGhpcy5kYXRhID0gb3B0LmRhdGE7XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG5cbiAgICB0aGlzLnB1cmVsaWdodCA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAvLyB0aXRsZSBpcyAyNnB4XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6IDMwICsgMjYsXG4gICAgICByaWdodDogMCxcbiAgICAgIGJvdHRvbTogMjAsXG4gICAgICBsZWZ0OiA1MFxuICAgIH07XG4gICAgLy8gdGFrZSAxMCBvZmYgdGhlIGhlaWdodFxuICAgIHRoaXMub3B0LmhlaWdodCAtPSAxMDtcbiAgICB0aGlzLm9wdC53aWR0aCAtPSAyMDtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLm9wdC5kYXRhO1xuICAgIHRoaXMubnVtQ29sdW1ucyA9IDU7XG4gICAgdGhpcy5udW1Sb3dzID0gNTtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gMDtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gMDtcbiAgICBpZiAob3B0LnJvd0F1dG9TaXplICYmIG9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgLy8gc3FydCBvZiAjIGRhdGEgaXRlbXNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5udW1Db2x1bW5zID0gb3B0LmNvbHVtbnMgfHwgNjtcbiAgICAgIHRoaXMubnVtUm93cyA9IG9wdC5yb3dzIHx8IDY7XG4gICAgfVxuICAgIGlmICgoIW9wdC5yYWRpdXNBdXRvU2l6ZSkgJiYgKG9wdC5yYWRpdXMpKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSBvcHQucmFkaXVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvLyB8fCA1MDtcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvL3x8IDUwO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSB0aGlzLmdlbmVyYXRlUG9pbnRzKCk7XG4gIH1cblxuICBjb21wdXRlVGV4dEZvbnRTaXplKHRleHQ6IHN0cmluZywgbGluZXNUb0Rpc3BsYXk6IG51bWJlciwgdGV4dEFyZWFXaWR0aDogbnVtYmVyLCB0ZXh0QXJlYUhlaWdodDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgIHRleHQsXG4gICAgICBcIj9weCBzYW5zLXNlcmlmXCIsIC8vIHVzZSBzYW5zLXNlcmlmIGZvciBzaXppbmdcbiAgICAgIHRleHRBcmVhV2lkdGgsXG4gICAgICB0ZXh0QXJlYUhlaWdodCAvIGxpbmVzVG9EaXNwbGF5LCAvLyBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0XG4gICAgICB0aGlzLm1pbkZvbnQsXG4gICAgICB0aGlzLm1heEZvbnQpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMub3B0LnJvd0F1dG9TaXplICYmIHRoaXMub3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgICAgbGV0IHNxdWFyZWQgPSBNYXRoLnNxcnQodGhpcy5kYXRhLmxlbmd0aCk7XG4gICAgICAvLyBmYXZvciBjb2x1bW5zIHdoZW4gd2lkdGggaXMgZ3JlYXRlciB0aGFuIGhlaWdodFxuICAgICAgLy8gZmF2b3Igcm93cyB3aGVuIHdpZHRoIGlzIGxlc3MgdGhhbiBoZWlnaHRcbiAgICAgIGlmICh0aGlzLm9wdC53aWR0aCA+IHRoaXMub3B0LmhlaWdodCkge1xuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwoKHRoaXMub3B0LndpZHRoIC8gdGhpcy5vcHQuaGVpZ2h0KSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSBjb2x1bW4gYW5kIG1heC4gZGF0YS5sZW5ndGggY29sdW1uc1xuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW1Db2x1bW5zID4gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGlnbiByb3dzIGNvdW50IHRvIGNvbXB1dGVkIGNvbHVtbnMgY291bnRcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3dcbiAgICAgICAgaWYgKHRoaXMubnVtUm93cyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwoKHRoaXMub3B0LmhlaWdodCAvIHRoaXMub3B0LndpZHRoKSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3cgYW5kIG1heC4gZGF0YS5sZW5ndGggcm93c1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW1Sb3dzID4gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxpZ24gY29sdW5ucyBjb3VudCB0byBjb21wdXRlZCByb3dzIGNvdW50XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCh0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Sb3dzKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHQucm93QXV0b1NpemUpIHtcbiAgICAgIC8vIEFsaWduIHJvd3MgY291bnQgdG8gZml4ZWQgY29sdW1ucyBjb3VudFxuICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMpO1xuICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgcm93XG4gICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgICAgLy8gQWxpZ24gY29sdW5ucyBjb3VudCB0byBmaXhlZCByb3dzIGNvdW50XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCh0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Sb3dzKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCBjb2x1bW5zID0gXCIgKyB0aGlzLm51bUNvbHVtbnMpO1xuICAgIC8vY29uc29sZS5sb2coXCJDYWxjdWxhdGVkIHJvd3MgPSBcIiArIHRoaXMubnVtUm93cyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiBkYXRhIGl0ZW1zIHRvIHJlbmRlciA9IFwiICsgdGhpcy5kYXRhLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5vcHQucmFkaXVzQXV0b1NpemUpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJhdXRvSGV4UmFkaXVzOlwiICsgdGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVkUG9pbnRzID0gdGhpcy5nZW5lcmF0ZVBvaW50cygpO1xuXG4gICAgdmFyIHdpZHRoID0gdGhpcy5vcHQud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMub3B0LmhlaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgV2lkdGg6IFwiICsgd2lkdGggKyBcIiBIZWlnaHQ6IFwiICsgaGVpZ2h0KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3JhZDpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgdmFyIGFoZXhiaW4gPSBkM2hleGJpblxuICAgICAgLmhleGJpbigpXG4gICAgICAucmFkaXVzKHRoaXMuYXV0b0hleFJhZGl1cylcbiAgICAgIC5leHRlbnQoW1swLCAwXSwgW3dpZHRoLCBoZWlnaHRdXSk7XG5cbiAgICAvLyBkMyBjYWxjdWxhdGVzIHRoZSByYWRpdXMgZm9yIHggYW5kIHkgc2VwYXJhdGVseSBiYXNlZCBvbiB0aGUgdmFsdWUgcGFzc2VkIGluXG4gICAgbGV0IGRpYW1ldGVyWCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIE1hdGguc3FydCgzKTtcbiAgICBsZXQgZGlhbWV0ZXJZID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICBsZXQgcmVuZGVyV2lkdGggPSB0aGlzLm1heENvbHVtbnNVc2VkICogZGlhbWV0ZXJYO1xuICAgIC8vIEV2ZW4gcm93cyBhcmUgc2hpZnRlZCBieSBhbiB4LXJhZGl1cyAoaGFsZiB4LWRpYW1ldGVyKSBvbiB0aGUgcmlnaHRcbiAgICAvLyBDaGVjayBpZiBhdCBsZWFzdCBvbmUgZXZlbiByb3cgaXMgZnVsbCAoZmlyc3Qgb25lIGlzIHJvdyAyKVxuICAgIGlmICh0aGlzLm1heFJvd3NVc2VkID49IDIgJiYgdGhpcy5kYXRhLmxlbmd0aCA+PSAoMiAqIHRoaXMubWF4Q29sdW1uc1VzZWQpKSB7XG4gICAgICByZW5kZXJXaWR0aCArPSAoZGlhbWV0ZXJYIC8gMik7XG4gICAgfVxuICAgIC8vIFRoZSBzcGFjZSB0YWtlbiBieSAxIHJvdyBvZiBoZXhhZ29ucyBpcyAzLzQgb2YgaXRzIGhlaWdodCAoYWxsIG1pbnVzIHBvaW50eSBib3R0b20pXG4gICAgLy8gQXQgdGhlbiBlbmQgd2UgbmVlZCB0byBhZGQgdGhlIHBvaW50eSBib3R0b20gb2YgdGhlIGxhc3Qgcm93ICgxLzQgb2YgdGhlIGhlaWdodClcbiAgICBsZXQgcmVuZGVySGVpZ2h0ID0gKCh0aGlzLm1heFJvd3NVc2VkICogMC43NSkgKyAwLjI1KSAqIGRpYW1ldGVyWTtcbiAgICAvLyBUcmFuc2xhdGUgdGhlIHdob2xlIGhleGFnb25zIGdyYXBoIHRvIGhhdmUgaXQgY2VuZXRlcmVkIGluIHRoZSBkcmF3aW5nIGFyZWFcbiAgICAvLyAtIGNlbnRlciB0aGUgcmVuZGVyZWQgYXJlYSB3aXRoIHRoZSBkcmF3aW5nIGFyZWEsIHRyYW5zbGF0ZSBieTpcbiAgICAvLyAgICAgKCh3aWR0aCAtIHJlbmRlcldpZHRoKSAvIDIsIChoZWlnaHQgLSByZW5kZXJIZWlnaHQpIC8gMilcbiAgICAvLyAtIGdvIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGZpcnN0IGhleGFnb24sIHRyYW5zbGF0ZSBieTpcbiAgICAvLyAgICAgKGRpYW1ldGVyWCAvIDIsIGRpYW1ldGVyWSAvIDIpXG4gICAgbGV0IHhvZmZzZXQgPSAoKHdpZHRoIC0gcmVuZGVyV2lkdGggKyBkaWFtZXRlclgpIC8gMik7XG4gICAgbGV0IHlvZmZzZXQgPSAoKGhlaWdodCAtIHJlbmRlckhlaWdodCArIGRpYW1ldGVyWSkgLyAyKTtcblxuICAgIC8vIERlZmluZSB0aGUgZGl2IGZvciB0aGUgdG9vbHRpcFxuICAgIC8vIGFkZCBpdCB0byB0aGUgYm9keSBhbmQgbm90IHRoZSBjb250YWluZXIgc28gaXQgY2FuIGZsb2F0IG91dHNpZGUgb2YgdGhlIHBhbmVsXG4gICAgdmFyIHRvb2x0aXAgPSBkM1xuICAgICAgLnNlbGVjdChcImJvZHlcIilcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInBvbHlzdGF0LXBhbmVsLXRvb2x0aXBcIilcbiAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgdmFyIHN2ZyA6IGFueSA9IGQzLnNlbGVjdCh0aGlzLnN2Z0NvbnRhaW5lcilcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpXG4gICAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAuYXR0cihcInhtbG5zOnhsaW5rXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5zdHlsZShcImJvcmRlclwiLCBcIjBweCBzb2xpZCB3aGl0ZVwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4b2Zmc2V0ICsgXCIsXCIgKyB5b2Zmc2V0ICsgXCIpXCIpO1xuXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgdmFyIGRlZnMgPSBzdmcuYXBwZW5kKFwiZGVmc1wiKTtcblxuICAgIGxldCBjb2xvckdyYWRpZW50cyA9IENvbG9yLmNyZWF0ZUdyYWRpZW50cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9yR3JhZGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiTmFtZSA9IFwiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkpO1xuICAgICAgbGV0IGFHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uc3RhcnQpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNvbG9yR3JhZGllbnRzW2ldLmVuZCk7XG4gICAgfVxuICAgIGxldCBva0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoODIsIDE5NCwgNTIpOyAvLyAjNTJjMjM0XG4gICAgbGV0IG9rQ29sb3JFbmQgPSBva0NvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCBva0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1va1wiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JTdGFydC5hc0hleCgpKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JFbmQuYXNIZXgoKSk7XG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jSnVpY3lPcmFuZ2VcbiAgICBsZXQgd2FybmluZ0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjU1LCAyMDAsIDU1KTsgLy8gI0ZGQzgzN1xuICAgIGxldCB3YXJuaW5nQ29sb3JFbmQgPSB3YXJuaW5nQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IHdhcm5pbmdHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS13YXJuaW5nXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCBvcmFuZ2VcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCB3YXJuaW5nQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgb3JhbmdlXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jWW91VHViZVxuICAgIGxldCBjcml0aWNhbENvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjI5LCA0NSwgMzkpOyAvLyBlNTJkMjdcbiAgICBsZXQgY3JpdGljYWxDb2xvckVuZCA9IGNyaXRpY2FsQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IGNyaXRpY2FsR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWNyaXRpY2FsXCIpO1xuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCByZWRcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNyaXRpY2FsQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgcmVkXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jQXNoXG4gICAgbGV0IHVua25vd25HcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtdW5rbm93blwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3MzgwOEFcIik7IC8vIGxpZ2h0IGdyZXlcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzU3RjlBXCIpOyAvLyBkYXJrIGdyZXlcblxuICAgIGxldCBjdXN0b21TaGFwZSA9IG51bGw7XG4gICAgLy8gY29tcHV0ZSB0ZXh0IGFyZWEgc2l6ZSAodXNlZCB0byBjYWxjdWxhdGUgdGhlIGZvbnRzaXplKVxuICAgIGxldCB0ZXh0QXJlYVdpZHRoID0gZGlhbWV0ZXJYO1xuICAgIGxldCB0ZXh0QXJlYUhlaWdodCA9IChkaWFtZXRlclkgLyAyKTsgLy8gVG9wIGFuZCBib3R0b20gb2YgaGV4YWdvbiBhcmUgbm90IHVzZWRcbiAgICAvLyBzeW1ib2xzIHVzZSB0aGUgYXJlYSBmb3IgdGhlaXIgc2l6ZVxuICAgIGxldCBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclk7XG4gICAgLy8gdXNlIHRoZSBzbWFsbGVyIG9mIGRpYW1ldGVyWCBvciBZXG4gICAgaWYgKGRpYW1ldGVyWCA8IGRpYW1ldGVyWSkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJYO1xuICAgIH1cbiAgICBpZiAoZGlhbWV0ZXJZIDwgZGlhbWV0ZXJYKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclkgKiBkaWFtZXRlclk7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBkMy5zeW1ib2woKS5zaXplKGlubmVyQXJlYSk7XG4gICAgc3dpdGNoICh0aGlzLm9wdC5wb2x5c3RhdC5zaGFwZSkge1xuICAgICAgY2FzZSBcImhleGFnb25fcG9pbnRlZF90b3BcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9mbGF0X3RvcFwiOlxuICAgICAgICAvLyBUT0RPOiB1c2UgcG9pbnRlZCBmb3Igbm93XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbENpcmNsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ3Jvc3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkaWFtb25kXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sRGlhbW9uZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNxdWFyZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFNxdWFyZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInN0YXJcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xTdGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidHJpYW5nbGVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xUcmlhbmdsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInd5ZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFd5ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICBkZWZhdWx0OlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIGZvbnRzaXplIGJhc2VkIG9uIHRoZSBzaGFwZSBhbmQgdGhlIHRleHRcbiAgICBsZXQgYWN0aXZlTGFiZWxGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuICAgIC8vIGZvbnQgc2l6ZXMgYXJlIGluZGVwZW5kZW50IGZvciBsYWJlbCBhbmQgdmFsdWVzXG4gICAgbGV0IGFjdGl2ZVZhbHVlRm9udFNpemUgPSB0aGlzLm9wdC5wb2x5c3RhdC5mb250U2l6ZTtcblxuICAgIC8vIGNvbXB1dGUgZm9udCBzaXplIGlmIGF1dG9zY2FsZSBpcyBhY3RpdmF0ZWRcbiAgICBpZiAodGhpcy5vcHQucG9seXN0YXQuZm9udEF1dG9TY2FsZSkge1xuICAgICAgLy8gZmluZCB0aGUgbW9zdCB0ZXh0IHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgb3ZlciBhbGwgaXRlbXNcbiAgICAgIGxldCBtYXhMYWJlbCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLm5hbWUubGVuZ3RoID4gbWF4TGFiZWwubGVuZ3RoKSB7XG4gICAgICAgICAgbWF4TGFiZWwgPSB0aGlzLmRhdGFbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gc2FtZSBmb3IgdGhlIHZhbHVlLCBhbHNvIGNoZWNrIGZvciBzdWJtZXRyaWNzIHNpemUgaW4gY2FzZSBvZiBjb21wb3NpdGVcbiAgICAgIGxldCBtYXhWYWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcXFwiXCIgKyB0aGlzLmRhdGFbaV0udmFsdWVGb3JtYXR0ZWQgKyBcIlxcXCIgdnM6IFxcXCJcIiArIG1heFZhbHVlICsgXCJcXFwiXCIpO1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkLmxlbmd0aCA+IG1heFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgIG1heFZhbHVlID0gdGhpcy5kYXRhW2ldLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdWJtZXRyaWNDb3VudCA9IHRoaXMuZGF0YVtpXS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgaWYgKHN1Ym1ldHJpY0NvdW50ID4gMCkge1xuICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICB3aGlsZSAoY291bnRlciA8IHN1Ym1ldHJpY0NvdW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcXFwiXCIgKyBjaGVja0NvbnRlbnQgKyBcIlxcXCIgdnM6IFxcXCJcIiArIG1heFZhbHVlICsgXCJcXFwiXCIpO1xuICAgICAgICAgICAgaWYgKGNoZWNrQ29udGVudCAmJiBjaGVja0NvbnRlbnQubGVuZ3RoID4gbWF4VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIG1heFZhbHVlID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXN0aW1hdGUgaG93IGJpZyBvZiBhIGZvbnQgY2FuIGJlIHVzZWRcbiAgICAgIC8vIFR3byBsaW5lcyBvZiB0ZXh0IG11c3QgZml0IHdpdGggdmVydGljYWwgc3BhY2luZyBpbmNsdWRlZFxuICAgICAgLy8gaWYgaXQgaXMgdG9vIHNtYWxsLCBoaWRlIGV2ZXJ5dGhpbmdcbiAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSB0aGlzLmNvbXB1dGVUZXh0Rm9udFNpemUobWF4TGFiZWwsIDIsIHRleHRBcmVhV2lkdGgsIHRleHRBcmVhSGVpZ2h0KTtcbiAgICAgIGFjdGl2ZVZhbHVlRm9udFNpemUgPSB0aGlzLmNvbXB1dGVUZXh0Rm9udFNpemUobWF4VmFsdWUsIDIsIHRleHRBcmVhV2lkdGgsIHRleHRBcmVhSGVpZ2h0KTtcblxuICAgICAgLy8gdmFsdWUgc2hvdWxkIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSBsYWJlbFxuICAgICAgaWYgKGFjdGl2ZVZhbHVlRm9udFNpemUgPiBhY3RpdmVMYWJlbEZvbnRTaXplKSB7XG4gICAgICAgIGFjdGl2ZVZhbHVlRm9udFNpemUgPSBhY3RpdmVMYWJlbEZvbnRTaXplO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbXB1dGUgYWxpZ25tZW50IGZvciBlYWNoIHRleHQgZWxlbWVudCwgYmFzZSBjb29yZGluYXRlIGlzIGF0IHRoZSBjZW50ZXIgb2YgdGhlIHBvbHlnb24gKHRleHQgaXMgYW5jaG9yZWQgYXQgaXRzIGJvdHRvbSk6XG4gICAgLy8gLSBWYWx1ZSB0ZXh0IChib3R0b20gdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChwb3NpdGl2ZWx5IGkuZS4gbG93ZXIpIGluIHRoZSBtaWRkbGUgb2YgdGhlIGJvdHRvbSBoYWxmIG9mIHRoZSB0ZXh0IGFyZWFcbiAgICAvLyAtIExhYmVsIHRleHQgKHRvcCB0ZXh0KSB3aWxsIGJlIGFsaWduZWQgKG5lZ2F0aXZlbHksIGkuZS4gaGlnaGVyKSBpbiB0aGUgbWlkZGxlIG9mIHRoZSB0b3AgaGFsZiBvZiB0aGUgdGV4dCBhcmVhXG4gICAgbGV0IHZhbHVlV2l0aExhYmVsVGV4dEFsaWdubWVudCA9ICgodGV4dEFyZWFIZWlnaHQgLyAyKSAvIDIpICsgKGFjdGl2ZVZhbHVlRm9udFNpemUgLyAyKTtcbiAgICBsZXQgdmFsdWVPbmx5VGV4dEFsaWdubWVudCA9IChhY3RpdmVWYWx1ZUZvbnRTaXplIC8gMik7XG4gICAgbGV0IGxhYmVsV2l0aFZhbHVlVGV4dEFsaWdubWVudCA9IC0oKHRleHRBcmVhSGVpZ2h0IC8gMikgLyAyKSArIChhY3RpdmVMYWJlbEZvbnRTaXplIC8gMik7XG4gICAgbGV0IGxhYmVsT25seVRleHRBbGlnbm1lbnQgPSAoYWN0aXZlTGFiZWxGb250U2l6ZSAvIDIpO1xuXG4gICAgc3ZnLnNlbGVjdEFsbChcIi5oZXhhZ29uXCIpXG4gICAgICAuZGF0YShhaGV4YmluKHRoaXMuY2FsY3VsYXRlZFBvaW50cykpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmVhY2goKF8sIGksIG5vZGVzKSA9PiB7XG4gICAgICAgIGxldCBub2RlID0gZDMuc2VsZWN0KG5vZGVzW2ldKTtcbiAgICAgICAgbGV0IGNsaWNrVGhyb3VnaFVSTCA9IHJlc29sdmVDbGlja1Rocm91Z2hVUkwoZGF0YVtpXSk7XG4gICAgICAgIGlmIChjbGlja1Rocm91Z2hVUkwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG5vZGUgPSBub2RlLmFwcGVuZChcImFcIilcbiAgICAgICAgICAgIC5hdHRyKFwidGFyZ2V0XCIsIHJlc29sdmVDbGlja1Rocm91Z2hUYXJnZXQoZGF0YVtpXSkpXG4gICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgY2xpY2tUaHJvdWdoVVJMKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmlsbENvbG9yID0gZGF0YVtpXS5jb2xvcjtcbiAgICAgICAgaWYgKHRoaXMub3B0LnBvbHlzdGF0LmdyYWRpZW50RW5hYmxlZCkge1xuICAgICAgICAgIC8vIHNhZmFyaSBuZWVkcyB0aGUgbG9jYXRpb24uaHJlZlxuICAgICAgICAgIGZpbGxDb2xvciA9IFwidXJsKFwiICsgbG9jYXRpb24uaHJlZiArIFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBub2RlLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiaGV4YWdvblwiKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG4gICAgICAgICAgLmF0dHIoXCJkXCIsIGN1c3RvbVNoYXBlKVxuICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIHRoaXMub3B0LnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvcilcbiAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSArIFwicHhcIilcbiAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZpbGxDb2xvcilcbiAgICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gdXNlIHRoZSB2aWV3cG9ydHdpZHRoIHRvIHByZXZlbnQgdGhlIHRvb2x0aXAgZnJvbSBnb2luZyB0b28gZmFyIHJpZ2h0XG4gICAgICAgICAgICBsZXQgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICAgICAgICAvLyB1c2UgdGhlIG1vdXNlIHBvc2l0aW9uIGZvciB0aGUgZW50aXJlIHBhZ2VcbiAgICAgICAgICAgIHZhciBtb3VzZSA9IGQzLm1vdXNlKGQzLnNlbGVjdChcImJvZHlcIikubm9kZSgpKTtcbiAgICAgICAgICAgIHZhciB4cG9zID0gbW91c2VbMF0gLSA1MDtcbiAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IG9mZnNjcmVlbiB0b29sdGlwXG4gICAgICAgICAgICBpZiAoeHBvcyA8IDApIHtcbiAgICAgICAgICAgICAgeHBvcyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwcmV2ZW50IHRvb2x0aXAgZnJvbSByZW5kZXJpbmcgb3V0c2lkZSBvZiB2aWV3cG9ydFxuICAgICAgICAgICAgaWYgKCh4cG9zICsgMjAwKSA+IHZpZXdQb3J0V2lkdGgpIHtcbiAgICAgICAgICAgICAgeHBvcyA9IHZpZXdQb3J0V2lkdGggLSAyMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeXBvcyA9IG1vdXNlWzFdICsgNTtcbiAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCB4cG9zICsgXCJweFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgeXBvcyArIFwicHhcIik7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMCkuc3R5bGUoXCJvcGFjaXR5XCIsIDAuOSk7XG4gICAgICAgICAgICB0b29sdGlwLmh0bWwodGhpcy5vcHQudG9vbHRpcENvbnRlbnRbaV0pXG4gICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCB0aGlzLm9wdC50b29sdGlwRm9udFNpemUpXG4gICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnRvb2x0aXBGb250VHlwZSlcbiAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZC54IC0gNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZC55IC0gNSkgKyBcInB4XCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIC8vIG5vdyBsYWJlbHNcbiAgICB2YXIgdGV4dHNwb3QgPSBzdmcuc2VsZWN0QWxsKFwidGV4dC50b3BsYWJlbFwiKVxuICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKTtcblxuICAgIHRleHRzcG90LmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9wbGFiZWxcIilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgbGV0IGFsaWdubWVudCA9IGxhYmVsT25seVRleHRBbGlnbm1lbnQ7XG4gICAgICAgIGlmIChzaG93VmFsdWUoaXRlbSkgJiYgaXRlbS52YWx1ZSAmJiBhY3RpdmVWYWx1ZUZvbnRTaXplKSB7XG4gICAgICAgICAgYWxpZ25tZW50ID0gbGFiZWxXaXRoVmFsdWVUZXh0QWxpZ25tZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkLnkgKyBhbGlnbm1lbnQ7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCB0aGlzLm9wdC5wb2x5c3RhdC5mb250VHlwZSlcbiAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIGFjdGl2ZUxhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpXG4gICAgICAudGV4dChmdW5jdGlvbiAoXywgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIGlmIChzaG93TmFtZShpdGVtKSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9KTtcblxuICAgIHZhciBmcmFtZXMgPSAwO1xuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oXywgaSkge1xuICAgICAgICByZXR1cm4gXCJ2YWx1ZUxhYmVsXCIgKyBpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgbGV0IGFsaWdubWVudCA9IHZhbHVlT25seVRleHRBbGlnbm1lbnQ7XG4gICAgICAgIGlmIChzaG93TmFtZShpdGVtKSAmJiBpdGVtLm5hbWUgJiYgYWN0aXZlTGFiZWxGb250U2l6ZSkge1xuICAgICAgICAgIGFsaWdubWVudCA9IHZhbHVlV2l0aExhYmVsVGV4dEFsaWdubWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZC55ICsgYWxpZ25tZW50O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgYWN0aXZlVmFsdWVGb250U2l6ZSArIFwicHhcIilcbiAgICAgIC5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKVxuICAgICAgLnRleHQoIChfLCBpKSA9PiB7XG4gICAgICAgIC8vIGFuaW1hdGlvbi9kaXNwbGF5bW9kZSBjYW4gbW9kaWZ5IHdoYXQgaXMgYmVpbmcgZGlzcGxheWVkXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgbGV0IGRhdGFMZW4gPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgIHdoaWxlICgoY29udGVudCA9PT0gbnVsbCkgJiYgKGNvdW50ZXIgPCBkYXRhTGVuKSkge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsdWVUZXh0TG9jYXRpb24gPSBzdmcuc2VsZWN0KFwidGV4dC52YWx1ZUxhYmVsXCIgKyBpKTtcbiAgICAgICAgLy8gdXNlIHRoZSBkeW5hbWljIHNpemUgZm9yIHRoZSB2YWx1ZVxuICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGFjdGl2ZVZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuICAgICAgICBkMy5pbnRlcnZhbCggKCkgPT4ge1xuICAgICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAgIHZhciBjb21wb3NpdGVJbmRleCA9IGk7XG4gICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24udGV4dCggKCkgPT4ge1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgYWN0aXZlVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aCAqIDI7XG4gICAgICAgICAgICAvLyBzZWFyY2ggZm9yIGEgdmFsdWUgY3ljbGluZyB0aHJvdWdoIHR3aWNlIHRvIGFsbG93IHJvbGxvdmVyXG4gICAgICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGNvbXBvc2l0ZUluZGV4LCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBjdXN0b20gY29udGVudCBmb3IgY29tcG9zaXRlIG9rIHN0YXRlXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZvbnQgc2l6ZSB0byBiZSB0aGUgc2FtZSBhcyB0aGUgbGFiZWwgYWJvdmVcbiAgICAgICAgICAgICAgLy92YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGR5bmFtaWNWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZyYW1lcysrO1xuICAgICAgICB9LCB0aGlzLm9wdC5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfSk7XG4gIH1cblxuICBmb3JtYXRWYWx1ZUNvbnRlbnQoaSwgZnJhbWVzLCB0aGlzUmVmKTogc3RyaW5nIHtcbiAgICBsZXQgZGF0YSA9IHRoaXNSZWYuZGF0YVtpXTtcbiAgICAvLyBvcHRpb25zIGNhbiBzcGVjaWZ5IHRvIG5vdCBzaG93IHRoZSB2YWx1ZVxuICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic2hvd1ZhbHVlXCIpKSB7XG4gICAgICAgIGlmICghZGF0YS5zaG93VmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwidmFsdWVGb3JtYXR0ZWRcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIGRhdGEsIHJldHVybiBub3RoaW5nXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgc3dpdGNoIChkYXRhLmFuaW1hdGVNb2RlKSB7XG4gICAgICBjYXNlIFwiYWxsXCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWdnZXJlZFwiOlxuICAgICAgICAvLyByZXR1cm4gbm90aGluZyBpZiBtb2RlIGlzIHRyaWdnZXJlZCBhbmQgdGhlIHN0YXRlIGlzIDBcbiAgICAgICAgaWYgKGRhdGEudGhyZXNob2xkTGV2ZWwgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNvbnRlbnQgPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gdmFsdWVGb3JtYXR0ZWQsIHRoZXJlJ3Mgbm90aGluZyB0byBkaXNwbGF5XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnByZWZpeCkgJiYgKGRhdGEucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gZGF0YS5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgfVxuICAgIGlmICgoZGF0YS5zdWZmaXgpICYmIChkYXRhLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGRhdGEuc3VmZml4O1xuICAgIH1cbiAgICAvLyBhIGNvbXBvc2l0ZSB3aWxsIGNvbnRhaW4gdGhlIFwid29yc3RcIiBjYXNlIGFzIHRoZSB2YWx1ZUZvcm1hdHRlZCxcbiAgICAvLyBhbmQgd2lsbCBoYXZlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiB0aGUgY29tcG9zaXRlIGluY2x1ZGVkLlxuICAgIC8vIGFzIGZyYW1lcyBpbmNyZW1lbnQgZmluZCBhIHRyaWdnZXJlZCBtZW1iZXIgc3RhcnRpbmcgZnJvbSB0aGUgZnJhbWUgbW9kIGxlblxuICAgIGxldCBsZW4gPSBkYXRhLm1lbWJlcnMubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICBsZXQgdHJpZ2dlcmVkSW5kZXggPSAtMTtcbiAgICAgIGlmIChkYXRhLmFuaW1hdGVNb2RlID09PSBcImFsbFwiKSB7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZnJhbWVzICUgbGVuO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBhbGwgbW9kZTogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEudHJpZ2dlckNhY2hlKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGRhdGEudHJpZ2dlckNhY2hlID0gdGhpcy5idWlsZFRyaWdnZXJDYWNoZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeiA9IGZyYW1lcyAlIGRhdGEudHJpZ2dlckNhY2hlLmxlbmd0aDtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBkYXRhLnRyaWdnZXJDYWNoZVt6XS5pbmRleDtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gY2FjaGUgaXM6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfVxuICAgICAgbGV0IGFNZW1iZXIgPSBkYXRhLm1lbWJlcnNbdHJpZ2dlcmVkSW5kZXhdO1xuXG4gICAgICBjb250ZW50ID0gYU1lbWJlci5uYW1lICsgXCI6IFwiICsgYU1lbWJlci52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIGlmICgoYU1lbWJlci5wcmVmaXgpICYmIChhTWVtYmVyLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gYU1lbWJlci5wcmVmaXggKyBcIiBcIiArIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoKGFNZW1iZXIuc3VmZml4KSAmJiAoYU1lbWJlci5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIGFNZW1iZXIuc3VmZml4O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhbGxvdyB0ZW1wbGF0aW5nXG4gICAgLy9cbiAgICBpZiAoKGNvbnRlbnQpICYmIChjb250ZW50Lmxlbmd0aCA+IDApKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVwbGFjZWRDb250ZW50ID0gdGhpc1JlZi50ZW1wbGF0ZVNydi5yZXBsYWNlV2l0aFRleHQoY29udGVudCk7XG4gICAgICAgIGNvbnRlbnQgPSByZXBsYWNlZENvbnRlbnQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogdGVtcGxhdGUgc2VydmVyIHRocmV3IGVycm9yOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgYnVpbGRUcmlnZ2VyQ2FjaGUoaXRlbSkge1xuICAgIC8vY29uc29sZS5sb2coXCJCdWlsZGluZyB0cmlnZ2VyIGNhY2hlIGZvciBpdGVtXCIpO1xuICAgIGxldCB0cmlnZ2VyQ2FjaGUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGFNZW1iZXIgPSBpdGVtLm1lbWJlcnNbaV07XG4gICAgICBpZiAoYU1lbWJlci50aHJlc2hvbGRMZXZlbCA+IDApIHtcbiAgICAgICAgLy8gYWRkIHRvIGxpc3RcbiAgICAgICAgbGV0IGNhY2hlZE1lbWJlclN0YXRlID0geyBpbmRleDogaSwgbmFtZTogYU1lbWJlci5uYW1lLCB2YWx1ZTogYU1lbWJlci52YWx1ZSwgdGhyZXNob2xkTGV2ZWw6IGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgfTtcbiAgICAgICAgdHJpZ2dlckNhY2hlLnB1c2goY2FjaGVkTWVtYmVyU3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzb3J0IGl0XG4gICAgdHJpZ2dlckNhY2hlID0gXy5vcmRlckJ5KHRyaWdnZXJDYWNoZSwgW1widGhyZXNob2xkTGV2ZWxcIiwgXCJ2YWx1ZVwiLCBcIm5hbWVcIl0sIFtcImRlc2NcIiwgXCJkZXNjXCIsIFwiYXNjXCJdKTtcbiAgICByZXR1cm4gdHJpZ2dlckNhY2hlO1xuICB9XG5cbiAgZ2V0QXV0b0hleFJhZGl1cygpOiBudW1iZXIge1xuICAgIC8vVGhlIG1heGltdW0gcmFkaXVzIHRoZSBoZXhhZ29ucyBjYW4gaGF2ZSB0byBzdGlsbCBmaXQgdGhlIHNjcmVlblxuICAgIC8vIFdpdGggKGxvbmcpIHJhZGl1cyBiZWluZyBSOlxuICAgIC8vIC0gVG90YWwgd2lkdGggKHJvd3MgPiAxKSA9IDEgc21hbGwgcmFkaXVzIChzcXJ0KDMpICogUiAvIDIpICsgY29sdW1ucyAqIHNtYWxsIGRpYW1ldGVyIChzcXJ0KDMpICogUilcbiAgICAvLyAtIFRvdGFsIGhlaWdodCA9IDEgcG9pbnR5IHRvcCAoMS8yICogUikgKyByb3dzICogc2l6ZSBvZiB0aGUgcmVzdCAoMy8yICogUilcbiAgICBsZXQgcmFkaXVzRnJvbVdpZHRoID0gKDIgKiB0aGlzLm9wdC53aWR0aCkgLyAoTWF0aC5zcXJ0KDMpICogKCAxICsgMiAqIHRoaXMubnVtQ29sdW1ucykpO1xuICAgIGxldCByYWRpdXNGcm9tSGVpZ2h0ID0gKDIgKiB0aGlzLm9wdC5oZWlnaHQpIC8gKDMgKiB0aGlzLm51bVJvd3MgKyAxKTtcbiAgICB2YXIgaGV4UmFkaXVzID0gZDMubWluKFxuICAgICAgW1xuICAgICAgICByYWRpdXNGcm9tV2lkdGgsXG4gICAgICAgIHJhZGl1c0Zyb21IZWlnaHRcbiAgICAgIF1cbiAgICApO1xuICAgIHJldHVybiBoZXhSYWRpdXM7XG4gIH1cblxuICAvLyBCdWlsZHMgdGhlIHBsYWNlaG9sZGVyIHBvbHlnb25zIG5lZWRlZCB0byByZXByZXNlbnQgZWFjaCBtZXRyaWNcbiAgZ2VuZXJhdGVQb2ludHMoKSA6IGFueSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIGlmICh0eXBlb2YodGhpcy5kYXRhKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgbGV0IG1heFJvd3NVc2VkID0gMDtcbiAgICBsZXQgY29sdW1uc1VzZWQgPSAwO1xuICAgIGxldCBtYXhDb2x1bW5zVXNlZCA9IDA7XG4gICAgLy8gd2hlbiBkdXBsaWNhdGluZyBwYW5lbHMsIHRoaXMgZ2V0cyBvZGRcbiAgICBpZiAodGhpcy5udW1Sb3dzID09PSBJbmZpbml0eSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm51bVJvd3MgaW5maW5pdHkuLi5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5udW1Db2x1bW5zID09PSBOYU4pIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Db2x1bW5zIE5hTlwiKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1Sb3dzOyBpKyspIHtcbiAgICAgIGlmICgoIXRoaXMub3B0LmRpc3BsYXlMaW1pdCB8fCBwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgIG1heFJvd3NVc2VkICs9IDE7XG4gICAgICAgIGNvbHVtbnNVc2VkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm51bUNvbHVtbnM7IGorKykge1xuICAgICAgICAgIGlmICgoIXRoaXMub3B0LmRpc3BsYXlMaW1pdCB8fCBwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb2x1bW5zVXNlZCArPSAxO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIG1vc3QgbnVtYmVyIG9mIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChjb2x1bW5zVXNlZCA+IG1heENvbHVtbnNVc2VkKSB7XG4gICAgICAgICAgICAgIG1heENvbHVtbnNVc2VkID0gY29sdW1uc1VzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludHMucHVzaChbdGhpcy5oZXhSYWRpdXMgKiBqICogMS43NSwgdGhpcy5oZXhSYWRpdXMgKiBpICogMS41XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coXCJNYXggcm93cyB1c2VkOlwiICsgbWF4Um93c1VzZWQpO1xuICAgIC8vY29uc29sZS5sb2coXCJBY3R1YWwgY29sdW1ucyB1c2VkOlwiICsgbWF4Q29sdW1uc1VzZWQpO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSBtYXhSb3dzVXNlZDtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gbWF4Q29sdW1uc1VzZWQ7XG4gICAgcmV0dXJuIHBvaW50cztcbiAgfVxuXG59XG4iXX0=