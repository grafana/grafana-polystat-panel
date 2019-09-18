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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsU0FBUyxzQkFBc0IsQ0FBQyxDQUFPO1FBQ3JDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RCxlQUFlLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUNELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLENBQU87UUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUM1QixrQkFBa0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFTO1FBRXpCLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsSUFBUztRQUUxQixPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRDtnQkF1QkUsbUJBQVksV0FBZ0IsRUFBRSxZQUFpQixFQUFFLE9BQVksRUFBRSxHQUFRO29CQUp2RSxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBSVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElB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QUQsQ0FBQyxBQTVxQkQsSUE0cUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzLWhleGJpbi9pbmRleC5kLnRzXCIgLz5cbi8vLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9kMy9pbmRleC5kLnRzXCIgLz5cbmltcG9ydCAqIGFzIGQzIGZyb20gXCIuL2V4dGVybmFsL2QzLm1pbi5qc1wiO1xuaW1wb3J0ICogYXMgZDNoZXhiaW4gZnJvbSBcIi4vZXh0ZXJuYWwvZDMtaGV4YmluLmpzXCI7XG5pbXBvcnQgeyBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZUNsaWNrVGhyb3VnaFVSTChkIDogYW55KSA6IHN0cmluZyB7XG4gIGxldCBjbGlja1Rocm91Z2hVUkwgPSBkLmNsaWNrVGhyb3VnaDtcbiAgaWYgKGQuc2FuaXRpemVVUkxFbmFibGVkID09PSB0cnVlICYmIGQuc2FuaXRpemVkVVJMLmxlbmd0aCA+IDApIHtcbiAgICBjbGlja1Rocm91Z2hVUkwgPSBkLnNhbml0aXplZFVSTDtcbiAgfVxuICByZXR1cm4gY2xpY2tUaHJvdWdoVVJMO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGQgOiBhbnkpIDogc3RyaW5nIHtcbiAgbGV0IGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX3NlbGZcIjtcbiAgaWYgKGQubmV3VGFiRW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgIGNsaWNrVGhyb3VnaFRhcmdldCA9IFwiX2JsYW5rXCI7XG4gIH1cbiAgcmV0dXJuIGNsaWNrVGhyb3VnaFRhcmdldDtcbn1cblxuZnVuY3Rpb24gc2hvd05hbWUoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0IGFuZCBjaGVjayBpdHMgdmFsdWVcbiAgcmV0dXJuICghKFwic2hvd05hbWVcIiBpbiBpdGVtKSB8fCBpdGVtLnNob3dOYW1lKTtcbn1cblxuZnVuY3Rpb24gc2hvd1ZhbHVlKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAvLyBjaGVjayBpZiBwcm9wZXJ0eSBleGlzdCBhbmQgY2hlY2sgaXRzIHZhbHVlXG4gIHJldHVybiAoIShcInNob3dWYWx1ZVwiIGluIGl0ZW0pIHx8IGl0ZW0uc2hvd1ZhbHVlKTtcbn1cblxuZXhwb3J0IGNsYXNzIEQzV3JhcHBlciB7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBkM0RpdklkOiBhbnk7XG4gIG1heENvbHVtbnNVc2VkOiBudW1iZXI7XG4gIG1heFJvd3NVc2VkOiBudW1iZXI7XG4gIG9wdDogYW55O1xuICBkYXRhOiBhbnk7XG4gIHRlbXBsYXRlU3J2OiBhbnk7XG4gIGNhbGN1bGF0ZWRQb2ludHM6IGFueTtcbiAgaGV4UmFkaXVzOiBudW1iZXI7XG4gIGF1dG9IZXhSYWRpdXMgOiBudW1iZXI7XG4gIG51bUNvbHVtbnM6IG51bWJlcjtcbiAgbnVtUm93czogbnVtYmVyO1xuICBtYXJnaW46IHtcbiAgICB0b3A6IG51bWJlcixcbiAgICByaWdodCA6IG51bWJlcixcbiAgICBib3R0b20gOiBudW1iZXIsXG4gICAgbGVmdCA6IG51bWJlcixcbiAgfTtcbiAgbWluRm9udCA9IDg7XG4gIG1heEZvbnQgPSAyNDA7XG4gIHB1cmVsaWdodDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlU3J2OiBhbnksIHN2Z0NvbnRhaW5lcjogYW55LCBkM0RpdklkOiBhbnksIG9wdDogYW55KSB7XG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gc3ZnQ29udGFpbmVyO1xuICAgIHRoaXMuZDNEaXZJZCA9IGQzRGl2SWQ7XG4gICAgdGhpcy5kYXRhID0gb3B0LmRhdGE7XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG5cbiAgICB0aGlzLnB1cmVsaWdodCA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAvLyB0aXRsZSBpcyAyNnB4XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6IDMwICsgMjYsXG4gICAgICByaWdodDogMCxcbiAgICAgIGJvdHRvbTogMjAsXG4gICAgICBsZWZ0OiA1MFxuICAgIH07XG4gICAgLy8gdGFrZSAxMCBvZmYgdGhlIGhlaWdodFxuICAgIHRoaXMub3B0LmhlaWdodCAtPSAxMDtcbiAgICB0aGlzLm9wdC53aWR0aCAtPSAyMDtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLm9wdC5kYXRhO1xuICAgIHRoaXMubnVtQ29sdW1ucyA9IDU7XG4gICAgdGhpcy5udW1Sb3dzID0gNTtcbiAgICB0aGlzLm1heENvbHVtbnNVc2VkID0gMDtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gMDtcbiAgICBpZiAob3B0LnJvd0F1dG9TaXplICYmIG9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgLy8gc3FydCBvZiAjIGRhdGEgaXRlbXNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5udW1Db2x1bW5zID0gb3B0LmNvbHVtbnMgfHwgNjtcbiAgICAgIHRoaXMubnVtUm93cyA9IG9wdC5yb3dzIHx8IDY7XG4gICAgfVxuICAgIGlmICgoIW9wdC5yYWRpdXNBdXRvU2l6ZSkgJiYgKG9wdC5yYWRpdXMpKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSBvcHQucmFkaXVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvLyB8fCA1MDtcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpOyAvL3x8IDUwO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSB0aGlzLmdlbmVyYXRlUG9pbnRzKCk7XG4gIH1cblxuICBjb21wdXRlVGV4dEZvbnRTaXplKHRleHQ6IHN0cmluZywgbGluZXNUb0Rpc3BsYXk6IG51bWJlciwgdGV4dEFyZWFXaWR0aDogbnVtYmVyLCB0ZXh0QXJlYUhlaWdodDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgIHRleHQsXG4gICAgICBcIj9weCBzYW5zLXNlcmlmXCIsIC8vIHVzZSBzYW5zLXNlcmlmIGZvciBzaXppbmdcbiAgICAgIHRleHRBcmVhV2lkdGgsXG4gICAgICB0ZXh0QXJlYUhlaWdodCAvIGxpbmVzVG9EaXNwbGF5LCAvLyBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0XG4gICAgICB0aGlzLm1pbkZvbnQsXG4gICAgICB0aGlzLm1heEZvbnQpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMub3B0LnJvd0F1dG9TaXplICYmIHRoaXMub3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgICAgbGV0IHNxdWFyZWQgPSBNYXRoLnNxcnQodGhpcy5kYXRhLmxlbmd0aCk7XG4gICAgICAvLyBmYXZvciBjb2x1bW5zIHdoZW4gd2lkdGggaXMgZ3JlYXRlciB0aGFuIGhlaWdodFxuICAgICAgLy8gZmF2b3Igcm93cyB3aGVuIHdpZHRoIGlzIGxlc3MgdGhhbiBoZWlnaHRcbiAgICAgIGlmICh0aGlzLm9wdC53aWR0aCA+IHRoaXMub3B0LmhlaWdodCkge1xuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwoKHRoaXMub3B0LndpZHRoIC8gdGhpcy5vcHQuaGVpZ2h0KSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSBjb2x1bW4gYW5kIG1heC4gZGF0YS5sZW5ndGggY29sdW1uc1xuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW1Db2x1bW5zID4gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGlnbiByb3dzIGNvdW50IHRvIGNvbXB1dGVkIGNvbHVtbnMgY291bnRcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3dcbiAgICAgICAgaWYgKHRoaXMubnVtUm93cyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwoKHRoaXMub3B0LmhlaWdodCAvIHRoaXMub3B0LndpZHRoKSAqIHNxdWFyZWQpO1xuICAgICAgICAvLyBhbHdheXMgYXQgbGVhc3QgMSByb3cgYW5kIG1heC4gZGF0YS5sZW5ndGggcm93c1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW1Sb3dzID4gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxpZ24gY29sdW5ucyBjb3VudCB0byBjb21wdXRlZCByb3dzIGNvdW50XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCh0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Sb3dzKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHQucm93QXV0b1NpemUpIHtcbiAgICAgIC8vIEFsaWduIHJvd3MgY291bnQgdG8gZml4ZWQgY29sdW1ucyBjb3VudFxuICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMpO1xuICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgcm93XG4gICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgICAgLy8gQWxpZ24gY29sdW5ucyBjb3VudCB0byBmaXhlZCByb3dzIGNvdW50XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguY2VpbCh0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Sb3dzKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCBjb2x1bW5zID0gXCIgKyB0aGlzLm51bUNvbHVtbnMpO1xuICAgIC8vY29uc29sZS5sb2coXCJDYWxjdWxhdGVkIHJvd3MgPSBcIiArIHRoaXMubnVtUm93cyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiBkYXRhIGl0ZW1zIHRvIHJlbmRlciA9IFwiICsgdGhpcy5kYXRhLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5vcHQucmFkaXVzQXV0b1NpemUpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJhdXRvSGV4UmFkaXVzOlwiICsgdGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVkUG9pbnRzID0gdGhpcy5nZW5lcmF0ZVBvaW50cygpO1xuXG4gICAgdmFyIHdpZHRoID0gdGhpcy5vcHQud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMub3B0LmhlaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgV2lkdGg6IFwiICsgd2lkdGggKyBcIiBIZWlnaHQ6IFwiICsgaGVpZ2h0KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3JhZDpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgdmFyIGFoZXhiaW4gPSBkM2hleGJpblxuICAgICAgLmhleGJpbigpXG4gICAgICAucmFkaXVzKHRoaXMuYXV0b0hleFJhZGl1cylcbiAgICAgIC5leHRlbnQoW1swLCAwXSwgW3dpZHRoLCBoZWlnaHRdXSk7XG5cbiAgICAvLyBkMyBjYWxjdWxhdGVzIHRoZSByYWRpdXMgZm9yIHggYW5kIHkgc2VwYXJhdGVseSBiYXNlZCBvbiB0aGUgdmFsdWUgcGFzc2VkIGluXG4gICAgbGV0IGRpYW1ldGVyWCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIE1hdGguc3FydCgzKTtcbiAgICBsZXQgZGlhbWV0ZXJZID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICBsZXQgcmVuZGVyV2lkdGggPSB0aGlzLm1heENvbHVtbnNVc2VkICogZGlhbWV0ZXJYO1xuICAgIC8vIEV2ZW4gcm93cyBhcmUgc2hpZnRlZCBieSBhbiB4LXJhZGl1cyAoaGFsZiB4LWRpYW1ldGVyKSBvbiB0aGUgcmlnaHRcbiAgICAvLyBDaGVjayBpZiBhdCBsZWFzdCBvbmUgZXZlbiByb3cgaXMgZnVsbCAoZmlyc3Qgb25lIGlzIHJvdyAyKVxuICAgIGlmICh0aGlzLm1heFJvd3NVc2VkID49IDIgJiYgdGhpcy5kYXRhLmxlbmd0aCA+PSAoMiAqIHRoaXMubWF4Q29sdW1uc1VzZWQpKSB7XG4gICAgICByZW5kZXJXaWR0aCArPSAoZGlhbWV0ZXJYIC8gMik7XG4gICAgfVxuICAgIC8vIFRoZSBzcGFjZSB0YWtlbiBieSAxIHJvdyBvZiBoZXhhZ29ucyBpcyAzLzQgb2YgaXRzIGhlaWdodCAoYWxsIG1pbnVzIHBvaW50eSBib3R0b20pXG4gICAgLy8gQXQgdGhlbiBlbmQgd2UgbmVlZCB0byBhZGQgdGhlIHBvaW50eSBib3R0b20gb2YgdGhlIGxhc3Qgcm93ICgxLzQgb2YgdGhlIGhlaWdodClcbiAgICBsZXQgcmVuZGVySGVpZ2h0ID0gKCh0aGlzLm1heFJvd3NVc2VkICogMC43NSkgKyAwLjI1KSAqIGRpYW1ldGVyWTtcbiAgICAvLyBUcmFuc2xhdGUgdGhlIHdob2xlIGhleGFnb25zIGdyYXBoIHRvIGhhdmUgaXQgY2VuZXRlcmVkIGluIHRoZSBkcmF3aW5nIGFyZWFcbiAgICAvLyAtIGNlbnRlciB0aGUgcmVuZGVyZWQgYXJlYSB3aXRoIHRoZSBkcmF3aW5nIGFyZWEsIHRyYW5zbGF0ZSBieTpcbiAgICAvLyAgICAgKCh3aWR0aCAtIHJlbmRlcldpZHRoKSAvIDIsIChoZWlnaHQgLSByZW5kZXJIZWlnaHQpIC8gMilcbiAgICAvLyAtIGdvIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGZpcnN0IGhleGFnb24sIHRyYW5zbGF0ZSBieTpcbiAgICAvLyAgICAgKGRpYW1ldGVyWCAvIDIsIGRpYW1ldGVyWSAvIDIpXG4gICAgbGV0IHhvZmZzZXQgPSAoKHdpZHRoIC0gcmVuZGVyV2lkdGggKyBkaWFtZXRlclgpIC8gMik7XG4gICAgbGV0IHlvZmZzZXQgPSAoKGhlaWdodCAtIHJlbmRlckhlaWdodCArIGRpYW1ldGVyWSkgLyAyKTtcblxuICAgIC8vIERlZmluZSB0aGUgZGl2IGZvciB0aGUgdG9vbHRpcFxuICAgIC8vIGFkZCBpdCB0byB0aGUgYm9keSBhbmQgbm90IHRoZSBjb250YWluZXIgc28gaXQgY2FuIGZsb2F0IG91dHNpZGUgb2YgdGhlIHBhbmVsXG4gICAgdmFyIHRvb2x0aXAgPSBkM1xuICAgICAgLnNlbGVjdChcImJvZHlcIilcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCItdG9vbHRpcFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInBvbHlzdGF0LXBhbmVsLXRvb2x0aXBcIilcbiAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgdmFyIHN2ZyA6IGFueSA9IGQzLnNlbGVjdCh0aGlzLnN2Z0NvbnRhaW5lcilcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpXG4gICAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAuYXR0cihcInhtbG5zOnhsaW5rXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5zdHlsZShcImJvcmRlclwiLCBcIjBweCBzb2xpZCB3aGl0ZVwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4b2Zmc2V0ICsgXCIsXCIgKyB5b2Zmc2V0ICsgXCIpXCIpO1xuXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgdmFyIGRlZnMgPSBzdmcuYXBwZW5kKFwiZGVmc1wiKTtcblxuICAgIGxldCBjb2xvckdyYWRpZW50cyA9IENvbG9yLmNyZWF0ZUdyYWRpZW50cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9yR3JhZGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiTmFtZSA9IFwiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkpO1xuICAgICAgbGV0IGFHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uc3RhcnQpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNvbG9yR3JhZGllbnRzW2ldLmVuZCk7XG4gICAgfVxuICAgIGxldCBva0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoODIsIDE5NCwgNTIpOyAvLyAjNTJjMjM0XG4gICAgbGV0IG9rQ29sb3JFbmQgPSBva0NvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCBva0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1va1wiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JTdGFydC5hc0hleCgpKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JFbmQuYXNIZXgoKSk7XG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jSnVpY3lPcmFuZ2VcbiAgICBsZXQgd2FybmluZ0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjU1LCAyMDAsIDU1KTsgLy8gI0ZGQzgzN1xuICAgIGxldCB3YXJuaW5nQ29sb3JFbmQgPSB3YXJuaW5nQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IHdhcm5pbmdHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS13YXJuaW5nXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCBvcmFuZ2VcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCB3YXJuaW5nQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgb3JhbmdlXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jWW91VHViZVxuICAgIGxldCBjcml0aWNhbENvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjI5LCA0NSwgMzkpOyAvLyBlNTJkMjdcbiAgICBsZXQgY3JpdGljYWxDb2xvckVuZCA9IGNyaXRpY2FsQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IGNyaXRpY2FsR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWNyaXRpY2FsXCIpO1xuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCByZWRcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNyaXRpY2FsQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgcmVkXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jQXNoXG4gICAgbGV0IHVua25vd25HcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtdW5rbm93blwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3MzgwOEFcIik7IC8vIGxpZ2h0IGdyZXlcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzU3RjlBXCIpOyAvLyBkYXJrIGdyZXlcblxuICAgIGxldCBjdXN0b21TaGFwZSA9IG51bGw7XG4gICAgLy8gY29tcHV0ZSB0ZXh0IGFyZWEgc2l6ZSAodXNlZCB0byBjYWxjdWxhdGUgdGhlIGZvbnRzaXplKVxuICAgIGxldCB0ZXh0QXJlYVdpZHRoID0gZGlhbWV0ZXJYO1xuICAgIGxldCB0ZXh0QXJlYUhlaWdodCA9IChkaWFtZXRlclkgLyAyKTsgLy8gVG9wIGFuZCBib3R0b20gb2YgaGV4YWdvbiBhcmUgbm90IHVzZWRcbiAgICAvLyBzeW1ib2xzIHVzZSB0aGUgYXJlYSBmb3IgdGhlaXIgc2l6ZVxuICAgIGxldCBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclk7XG4gICAgLy8gdXNlIHRoZSBzbWFsbGVyIG9mIGRpYW1ldGVyWCBvciBZXG4gICAgaWYgKGRpYW1ldGVyWCA8IGRpYW1ldGVyWSkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJYO1xuICAgIH1cbiAgICBpZiAoZGlhbWV0ZXJZIDwgZGlhbWV0ZXJYKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclkgKiBkaWFtZXRlclk7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBkMy5zeW1ib2woKS5zaXplKGlubmVyQXJlYSk7XG4gICAgc3dpdGNoICh0aGlzLm9wdC5wb2x5c3RhdC5zaGFwZSkge1xuICAgICAgY2FzZSBcImhleGFnb25fcG9pbnRlZF90b3BcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9mbGF0X3RvcFwiOlxuICAgICAgICAvLyBUT0RPOiB1c2UgcG9pbnRlZCBmb3Igbm93XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbENpcmNsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ3Jvc3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkaWFtb25kXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sRGlhbW9uZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNxdWFyZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFNxdWFyZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInN0YXJcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xTdGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidHJpYW5nbGVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xUcmlhbmdsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInd5ZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFd5ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICBkZWZhdWx0OlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIGZvbnRzaXplIGJhc2VkIG9uIHRoZSBzaGFwZSBhbmQgdGhlIHRleHRcbiAgICBsZXQgYWN0aXZlTGFiZWxGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuICAgIC8vIGZvbnQgc2l6ZXMgYXJlIGluZGVwZW5kZW50IGZvciBsYWJlbCBhbmQgdmFsdWVzXG4gICAgbGV0IGFjdGl2ZVZhbHVlRm9udFNpemUgPSB0aGlzLm9wdC5wb2x5c3RhdC5mb250U2l6ZTtcblxuICAgIC8vIGNvbXB1dGUgZm9udCBzaXplIGlmIGF1dG9zY2FsZSBpcyBhY3RpdmF0ZWRcbiAgICBpZiAodGhpcy5vcHQucG9seXN0YXQuZm9udEF1dG9TY2FsZSkge1xuICAgICAgLy8gZmluZCB0aGUgbW9zdCB0ZXh0IHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgb3ZlciBhbGwgaXRlbXNcbiAgICAgIGxldCBtYXhMYWJlbCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLm5hbWUubGVuZ3RoID4gbWF4TGFiZWwubGVuZ3RoKSB7XG4gICAgICAgICAgbWF4TGFiZWwgPSB0aGlzLmRhdGFbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gc2FtZSBmb3IgdGhlIHZhbHVlLCBhbHNvIGNoZWNrIGZvciBzdWJtZXRyaWNzIHNpemUgaW4gY2FzZSBvZiBjb21wb3NpdGVcbiAgICAgIGxldCBtYXhWYWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcIiArIHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZCArIFwiIHZzOiBcIiArIG1heFZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZC5sZW5ndGggPiBtYXhWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhWYWx1ZSA9IHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3VibWV0cmljQ291bnQgPSB0aGlzLmRhdGFbaV0ubWVtYmVycy5sZW5ndGg7XG4gICAgICAgIGlmIChzdWJtZXRyaWNDb3VudCA+IDApIHtcbiAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCBzdWJtZXRyaWNDb3VudCkge1xuICAgICAgICAgICAgbGV0IGNoZWNrQ29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIGNvdW50ZXIsIHRoaXMpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNoZWNraW5nIGxlbjogXFxcIlwiICsgY2hlY2tDb250ZW50ICsgXCJcXFwiIHZzOiBcXFwiXCIgKyBtYXhWYWx1ZSArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgIGlmIChjaGVja0NvbnRlbnQgJiYgY2hlY2tDb250ZW50Lmxlbmd0aCA+IG1heFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBtYXhWYWx1ZSA9IGNoZWNrQ29udGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGVzdGltYXRlIGhvdyBiaWcgb2YgYSBmb250IGNhbiBiZSB1c2VkXG4gICAgICAvLyBUd28gbGluZXMgb2YgdGV4dCBtdXN0IGZpdCB3aXRoIHZlcnRpY2FsIHNwYWNpbmcgaW5jbHVkZWRcbiAgICAgIC8vIGlmIGl0IGlzIHRvbyBzbWFsbCwgaGlkZSBldmVyeXRoaW5nXG4gICAgICBhY3RpdmVMYWJlbEZvbnRTaXplID0gdGhpcy5jb21wdXRlVGV4dEZvbnRTaXplKG1heExhYmVsLCAyLCB0ZXh0QXJlYVdpZHRoLCB0ZXh0QXJlYUhlaWdodCk7XG4gICAgICBhY3RpdmVWYWx1ZUZvbnRTaXplID0gdGhpcy5jb21wdXRlVGV4dEZvbnRTaXplKG1heFZhbHVlLCAyLCB0ZXh0QXJlYVdpZHRoLCB0ZXh0QXJlYUhlaWdodCk7XG5cbiAgICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICAgIGlmIChhY3RpdmVWYWx1ZUZvbnRTaXplID4gYWN0aXZlTGFiZWxGb250U2l6ZSkge1xuICAgICAgICBhY3RpdmVWYWx1ZUZvbnRTaXplID0gYWN0aXZlTGFiZWxGb250U2l6ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb21wdXRlIGFsaWdubWVudCBmb3IgZWFjaCB0ZXh0IGVsZW1lbnQsIGJhc2UgY29vcmRpbmF0ZSBpcyBhdCB0aGUgY2VudGVyIG9mIHRoZSBwb2x5Z29uICh0ZXh0IGlzIGFuY2hvcmVkIGF0IGl0cyBib3R0b20pOlxuICAgIC8vIC0gVmFsdWUgdGV4dCAoYm90dG9tIHRleHQpIHdpbGwgYmUgYWxpZ25lZCAocG9zaXRpdmVseSBpLmUuIGxvd2VyKSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBib3R0b20gaGFsZiBvZiB0aGUgdGV4dCBhcmVhXG4gICAgLy8gLSBMYWJlbCB0ZXh0ICh0b3AgdGV4dCkgd2lsbCBiZSBhbGlnbmVkIChuZWdhdGl2ZWx5LCBpLmUuIGhpZ2hlcikgaW4gdGhlIG1pZGRsZSBvZiB0aGUgdG9wIGhhbGYgb2YgdGhlIHRleHQgYXJlYVxuICAgIGxldCB2YWx1ZVdpdGhMYWJlbFRleHRBbGlnbm1lbnQgPSAoKHRleHRBcmVhSGVpZ2h0IC8gMikgLyAyKSArIChhY3RpdmVWYWx1ZUZvbnRTaXplIC8gMik7XG4gICAgbGV0IHZhbHVlT25seVRleHRBbGlnbm1lbnQgPSAoYWN0aXZlVmFsdWVGb250U2l6ZSAvIDIpO1xuICAgIGxldCBsYWJlbFdpdGhWYWx1ZVRleHRBbGlnbm1lbnQgPSAtKCh0ZXh0QXJlYUhlaWdodCAvIDIpIC8gMikgKyAoYWN0aXZlTGFiZWxGb250U2l6ZSAvIDIpO1xuICAgIGxldCBsYWJlbE9ubHlUZXh0QWxpZ25tZW50ID0gKGFjdGl2ZUxhYmVsRm9udFNpemUgLyAyKTtcblxuICAgIHN2Zy5zZWxlY3RBbGwoXCIuaGV4YWdvblwiKVxuICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5lYWNoKChfLCBpLCBub2RlcykgPT4ge1xuICAgICAgICBsZXQgbm9kZSA9IGQzLnNlbGVjdChub2Rlc1tpXSk7XG4gICAgICAgIGxldCBjbGlja1Rocm91Z2hVUkwgPSByZXNvbHZlQ2xpY2tUaHJvdWdoVVJMKGRhdGFbaV0pO1xuICAgICAgICBpZiAoY2xpY2tUaHJvdWdoVVJMLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBub2RlID0gbm9kZS5hcHBlbmQoXCJhXCIpXG4gICAgICAgICAgICAuYXR0cihcInRhcmdldFwiLCByZXNvbHZlQ2xpY2tUaHJvdWdoVGFyZ2V0KGRhdGFbaV0pKVxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIGNsaWNrVGhyb3VnaFVSTCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZpbGxDb2xvciA9IGRhdGFbaV0uY29sb3I7XG4gICAgICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5ncmFkaWVudEVuYWJsZWQpIHtcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgdGhlIGxvY2F0aW9uLmhyZWZcbiAgICAgICAgICBmaWxsQ29sb3IgPSBcInVybChcIiArIGxvY2F0aW9uLmhyZWYgKyBcIiNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImhleGFnb25cIilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuICAgICAgICAgIC5hdHRyKFwiZFwiLCBjdXN0b21TaGFwZSlcbiAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyQ29sb3IpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgKyBcInB4XCIpXG4gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmaWxsQ29sb3IpXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgdmlld3BvcnR3aWR0aCB0byBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb20gZ29pbmcgdG9vIGZhciByaWdodFxuICAgICAgICAgICAgbGV0IHZpZXdQb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xuICAgICAgICAgICAgLy8gdXNlIHRoZSBtb3VzZSBwb3NpdGlvbiBmb3IgdGhlIGVudGlyZSBwYWdlXG4gICAgICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZShkMy5zZWxlY3QoXCJib2R5XCIpLm5vZGUoKSk7XG4gICAgICAgICAgICB2YXIgeHBvcyA9IG1vdXNlWzBdIC0gNTA7XG4gICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBvZmZzY3JlZW4gdG9vbHRpcFxuICAgICAgICAgICAgaWYgKHhwb3MgPCAwKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHJldmVudCB0b29sdGlwIGZyb20gcmVuZGVyaW5nIG91dHNpZGUgb2Ygdmlld3BvcnRcbiAgICAgICAgICAgIGlmICgoeHBvcyArIDIwMCkgPiB2aWV3UG9ydFdpZHRoKSB7XG4gICAgICAgICAgICAgIHhwb3MgPSB2aWV3UG9ydFdpZHRoIC0gMjAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHlwb3MgPSBtb3VzZVsxXSArIDU7XG4gICAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgeHBvcyArIFwicHhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIHlwb3MgKyBcInB4XCIpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XG4gICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLnN0eWxlKFwib3BhY2l0eVwiLCAwLjkpO1xuICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRoaXMub3B0LnRvb2x0aXBDb250ZW50W2ldKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRTaXplKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LWZhbWlseVwiLCB0aGlzLm9wdC50b29sdGlwRm9udFR5cGUpXG4gICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQueCAtIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQueSAtIDUpICsgXCJweFwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBub3cgbGFiZWxzXG4gICAgdmFyIHRleHRzcG90ID0gc3ZnLnNlbGVjdEFsbChcInRleHQudG9wbGFiZWxcIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSk7XG5cbiAgICB0ZXh0c3BvdC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRvcGxhYmVsXCIpXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueDsgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIGxldCBhbGlnbm1lbnQgPSBsYWJlbE9ubHlUZXh0QWxpZ25tZW50O1xuICAgICAgICBpZiAoc2hvd1ZhbHVlKGl0ZW0pICYmIGl0ZW0udmFsdWUgJiYgYWN0aXZlVmFsdWVGb250U2l6ZSkge1xuICAgICAgICAgIGFsaWdubWVudCA9IGxhYmVsV2l0aFZhbHVlVGV4dEFsaWdubWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZC55ICsgYWxpZ25tZW50O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBhY3RpdmVMYWJlbEZvbnRTaXplICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIilcbiAgICAgIC5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKVxuICAgICAgLnRleHQoZnVuY3Rpb24gKF8sIGkpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICBpZiAoc2hvd05hbWUoaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfSk7XG5cbiAgICB2YXIgZnJhbWVzID0gMDtcblxuICAgIHRleHRzcG90LmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKF8sIGkpIHtcbiAgICAgICAgcmV0dXJuIFwidmFsdWVMYWJlbFwiICsgaTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueDsgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIGxldCBhbGlnbm1lbnQgPSB2YWx1ZU9ubHlUZXh0QWxpZ25tZW50O1xuICAgICAgICBpZiAoc2hvd05hbWUoaXRlbSkgJiYgaXRlbS5uYW1lICYmIGFjdGl2ZUxhYmVsRm9udFNpemUpIHtcbiAgICAgICAgICBhbGlnbm1lbnQgPSB2YWx1ZVdpdGhMYWJlbFRleHRBbGlnbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGQueSArIGFsaWdubWVudDtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnBvbHlzdGF0LmZvbnRUeXBlKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIilcbiAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIGFjdGl2ZVZhbHVlRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIilcbiAgICAgIC50ZXh0KCAoXywgaSkgPT4ge1xuICAgICAgICAvLyBhbmltYXRpb24vZGlzcGxheW1vZGUgY2FuIG1vZGlmeSB3aGF0IGlzIGJlaW5nIGRpc3BsYXllZFxuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGxldCBkYXRhTGVuID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBudWxsO1xuICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgIC8vIHVzZSB0aGUgZHluYW1pYyBzaXplIGZvciB0aGUgdmFsdWVcbiAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBhY3RpdmVWYWx1ZUZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgZDMuaW50ZXJ2YWwoICgpID0+IHtcbiAgICAgICAgICB2YXIgdmFsdWVUZXh0TG9jYXRpb24gPSBzdmcuc2VsZWN0KFwidGV4dC52YWx1ZUxhYmVsXCIgKyBpKTtcbiAgICAgICAgICB2YXIgY29tcG9zaXRlSW5kZXggPSBpO1xuICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLnRleHQoICgpID0+IHtcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbi9kaXNwbGF5bW9kZSBjYW4gbW9kaWZ5IHdoYXQgaXMgYmVpbmcgZGlzcGxheWVkXG4gICAgICAgICAgICB2YWx1ZVRleHRMb2NhdGlvbi5hdHRyKFwiZm9udC1zaXplXCIsIGFjdGl2ZVZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGggKiAyO1xuICAgICAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGN5Y2xpbmcgdGhyb3VnaCB0d2ljZSB0byBhbGxvdyByb2xsb3ZlclxuICAgICAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChjb21wb3NpdGVJbmRleCwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBhZGQgY3VzdG9tIGNvbnRlbnQgZm9yIGNvbXBvc2l0ZSBvayBzdGF0ZVxuICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBmb250IHNpemUgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIGxhYmVsIGFib3ZlXG4gICAgICAgICAgICAgIC8vdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmcmFtZXMrKztcbiAgICAgICAgfSwgdGhpcy5vcHQuYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH0pO1xuICB9XG5cbiAgZm9ybWF0VmFsdWVDb250ZW50KGksIGZyYW1lcywgdGhpc1JlZik6IHN0cmluZyB7XG4gICAgbGV0IGRhdGEgPSB0aGlzUmVmLmRhdGFbaV07XG4gICAgLy8gb3B0aW9ucyBjYW4gc3BlY2lmeSB0byBub3Qgc2hvdyB0aGUgdmFsdWVcbiAgICBpZiAodHlwZW9mKGRhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInNob3dWYWx1ZVwiKSkge1xuICAgICAgICBpZiAoIWRhdGEuc2hvd1ZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlRm9ybWF0dGVkXCIpKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBkYXRhLCByZXR1cm4gbm90aGluZ1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHN3aXRjaCAoZGF0YS5hbmltYXRlTW9kZSkge1xuICAgICAgY2FzZSBcImFsbFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlnZ2VyZWRcIjpcbiAgICAgICAgLy8gcmV0dXJuIG5vdGhpbmcgaWYgbW9kZSBpcyB0cmlnZ2VyZWQgYW5kIHRoZSBzdGF0ZSBpcyAwXG4gICAgICAgIGlmIChkYXRhLnRocmVzaG9sZExldmVsIDwgMSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBjb250ZW50ID0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAvLyBpZiB0aGVyZSdzIG5vIHZhbHVlRm9ybWF0dGVkLCB0aGVyZSdzIG5vdGhpbmcgdG8gZGlzcGxheVxuICAgIGlmICghY29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoZGF0YS5wcmVmaXgpICYmIChkYXRhLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGRhdGEucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgIH1cbiAgICBpZiAoKGRhdGEuc3VmZml4KSAmJiAoZGF0YS5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBkYXRhLnN1ZmZpeDtcbiAgICB9XG4gICAgLy8gYSBjb21wb3NpdGUgd2lsbCBjb250YWluIHRoZSBcIndvcnN0XCIgY2FzZSBhcyB0aGUgdmFsdWVGb3JtYXR0ZWQsXG4gICAgLy8gYW5kIHdpbGwgaGF2ZSBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgdGhlIGNvbXBvc2l0ZSBpbmNsdWRlZC5cbiAgICAvLyBhcyBmcmFtZXMgaW5jcmVtZW50IGZpbmQgYSB0cmlnZ2VyZWQgbWVtYmVyIHN0YXJ0aW5nIGZyb20gdGhlIGZyYW1lIG1vZCBsZW5cbiAgICBsZXQgbGVuID0gZGF0YS5tZW1iZXJzLmxlbmd0aDtcbiAgICBpZiAobGVuID4gMCkge1xuICAgICAgbGV0IHRyaWdnZXJlZEluZGV4ID0gLTE7XG4gICAgICBpZiAoZGF0YS5hbmltYXRlTW9kZSA9PT0gXCJhbGxcIikge1xuICAgICAgICB0cmlnZ2VyZWRJbmRleCA9IGZyYW1lcyAlIGxlbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gYWxsIG1vZGU6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhLnRyaWdnZXJDYWNoZSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBkYXRhLnRyaWdnZXJDYWNoZSA9IHRoaXMuYnVpbGRUcmlnZ2VyQ2FjaGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHogPSBmcmFtZXMgJSBkYXRhLnRyaWdnZXJDYWNoZS5sZW5ndGg7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZGF0YS50cmlnZ2VyQ2FjaGVbel0uaW5kZXg7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0cmlnZ2VyZWRJbmRleCBmcm9tIGNhY2hlIGlzOiBcIiArIHRyaWdnZXJlZEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGxldCBhTWVtYmVyID0gZGF0YS5tZW1iZXJzW3RyaWdnZXJlZEluZGV4XTtcblxuICAgICAgY29udGVudCA9IGFNZW1iZXIubmFtZSArIFwiOiBcIiArIGFNZW1iZXIudmFsdWVGb3JtYXR0ZWQ7XG4gICAgICBpZiAoKGFNZW1iZXIucHJlZml4KSAmJiAoYU1lbWJlci5wcmVmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGFNZW1iZXIucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgICAgfVxuICAgICAgaWYgKChhTWVtYmVyLnN1ZmZpeCkgJiYgKGFNZW1iZXIuc3VmZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBhTWVtYmVyLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYWxsb3cgdGVtcGxhdGluZ1xuICAgIC8vXG4gICAgaWYgKChjb250ZW50KSAmJiAoY29udGVudC5sZW5ndGggPiAwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlcGxhY2VkQ29udGVudCA9IHRoaXNSZWYudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KGNvbnRlbnQpO1xuICAgICAgICBjb250ZW50ID0gcmVwbGFjZWRDb250ZW50O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IHRlbXBsYXRlIHNlcnZlciB0aHJldyBlcnJvcjogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGJ1aWxkVHJpZ2dlckNhY2hlKGl0ZW0pIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiQnVpbGRpbmcgdHJpZ2dlciBjYWNoZSBmb3IgaXRlbVwiKTtcbiAgICBsZXQgdHJpZ2dlckNhY2hlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLm1lbWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBhTWVtYmVyID0gaXRlbS5tZW1iZXJzW2ldO1xuICAgICAgaWYgKGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgPiAwKSB7XG4gICAgICAgIC8vIGFkZCB0byBsaXN0XG4gICAgICAgIGxldCBjYWNoZWRNZW1iZXJTdGF0ZSA9IHsgaW5kZXg6IGksIG5hbWU6IGFNZW1iZXIubmFtZSwgdmFsdWU6IGFNZW1iZXIudmFsdWUsIHRocmVzaG9sZExldmVsOiBhTWVtYmVyLnRocmVzaG9sZExldmVsIH07XG4gICAgICAgIHRyaWdnZXJDYWNoZS5wdXNoKGNhY2hlZE1lbWJlclN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc29ydCBpdFxuICAgIHRyaWdnZXJDYWNoZSA9IF8ub3JkZXJCeSh0cmlnZ2VyQ2FjaGUsIFtcInRocmVzaG9sZExldmVsXCIsIFwidmFsdWVcIiwgXCJuYW1lXCJdLCBbXCJkZXNjXCIsIFwiZGVzY1wiLCBcImFzY1wiXSk7XG4gICAgcmV0dXJuIHRyaWdnZXJDYWNoZTtcbiAgfVxuXG4gIGdldEF1dG9IZXhSYWRpdXMoKTogbnVtYmVyIHtcbiAgICAvL1RoZSBtYXhpbXVtIHJhZGl1cyB0aGUgaGV4YWdvbnMgY2FuIGhhdmUgdG8gc3RpbGwgZml0IHRoZSBzY3JlZW5cbiAgICAvLyBXaXRoIChsb25nKSByYWRpdXMgYmVpbmcgUjpcbiAgICAvLyAtIFRvdGFsIHdpZHRoIChyb3dzID4gMSkgPSAxIHNtYWxsIHJhZGl1cyAoc3FydCgzKSAqIFIgLyAyKSArIGNvbHVtbnMgKiBzbWFsbCBkaWFtZXRlciAoc3FydCgzKSAqIFIpXG4gICAgLy8gLSBUb3RhbCBoZWlnaHQgPSAxIHBvaW50eSB0b3AgKDEvMiAqIFIpICsgcm93cyAqIHNpemUgb2YgdGhlIHJlc3QgKDMvMiAqIFIpXG4gICAgbGV0IHJhZGl1c0Zyb21XaWR0aCA9ICgyICogdGhpcy5vcHQud2lkdGgpIC8gKE1hdGguc3FydCgzKSAqICggMSArIDIgKiB0aGlzLm51bUNvbHVtbnMpKTtcbiAgICBsZXQgcmFkaXVzRnJvbUhlaWdodCA9ICgyICogdGhpcy5vcHQuaGVpZ2h0KSAvICgzICogdGhpcy5udW1Sb3dzICsgMSk7XG4gICAgdmFyIGhleFJhZGl1cyA9IGQzLm1pbihcbiAgICAgIFtcbiAgICAgICAgcmFkaXVzRnJvbVdpZHRoLFxuICAgICAgICByYWRpdXNGcm9tSGVpZ2h0XG4gICAgICBdXG4gICAgKTtcbiAgICByZXR1cm4gaGV4UmFkaXVzO1xuICB9XG5cbiAgLy8gQnVpbGRzIHRoZSBwbGFjZWhvbGRlciBwb2x5Z29ucyBuZWVkZWQgdG8gcmVwcmVzZW50IGVhY2ggbWV0cmljXG4gIGdlbmVyYXRlUG9pbnRzKCkgOiBhbnkge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBpZiAodHlwZW9mKHRoaXMuZGF0YSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGxldCBtYXhSb3dzVXNlZCA9IDA7XG4gICAgbGV0IGNvbHVtbnNVc2VkID0gMDtcbiAgICBsZXQgbWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIC8vIHdoZW4gZHVwbGljYXRpbmcgcGFuZWxzLCB0aGlzIGdldHMgb2RkXG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gSW5maW5pdHkpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Sb3dzIGluZmluaXR5Li4uXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgaWYgKHRoaXMubnVtQ29sdW1ucyA9PT0gTmFOKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwibnVtQ29sdW1ucyBOYU5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtUm93czsgaSsrKSB7XG4gICAgICBpZiAoKCF0aGlzLm9wdC5kaXNwbGF5TGltaXQgfHwgcG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICBtYXhSb3dzVXNlZCArPSAxO1xuICAgICAgICBjb2x1bW5zVXNlZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5udW1Db2x1bW5zOyBqKyspIHtcbiAgICAgICAgICBpZiAoKCF0aGlzLm9wdC5kaXNwbGF5TGltaXQgfHwgcG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICAgICAgY29sdW1uc1VzZWQgKz0gMTtcbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBtb3N0IG51bWJlciBvZiBjb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29sdW1uc1VzZWQgPiBtYXhDb2x1bW5zVXNlZCkge1xuICAgICAgICAgICAgICBtYXhDb2x1bW5zVXNlZCA9IGNvbHVtbnNVc2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3RoaXMuaGV4UmFkaXVzICogaiAqIDEuNzUsIHRoaXMuaGV4UmFkaXVzICogaSAqIDEuNV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiTWF4IHJvd3MgdXNlZDpcIiArIG1heFJvd3NVc2VkKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQWN0dWFsIGNvbHVtbnMgdXNlZDpcIiArIG1heENvbHVtbnNVc2VkKTtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gbWF4Um93c1VzZWQ7XG4gICAgdGhpcy5tYXhDb2x1bW5zVXNlZCA9IG1heENvbHVtbnNVc2VkO1xuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxufVxuIl19