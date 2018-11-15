System.register(["./external/d3.min.js", "./external/d3-hexbin.js", "./utils", "lodash", "./color"], function (exports_1, context_1) {
    "use strict";
    var d3, d3hexbin, utils_1, lodash_1, color_1, D3Wrapper;
    var __moduleName = context_1 && context_1.id;
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
                        .enter().append("path")
                        .attr("class", "hexagon")
                        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .attr("d", customShape)
                        .attr("stroke", this.opt.polystat.polygonBorderColor)
                        .attr("stroke-width", this.opt.polystat.polygonBorderSize + "px")
                        .style("fill", function (_, i) {
                        if (_this.opt.polystat.gradientEnabled) {
                            return "url(" + location.href + "#" + _this.d3DivId + "linear-gradient-state-data-" + i + ")";
                        }
                        else {
                            return data[i].color;
                        }
                    })
                        .on("click", function (_, i) {
                        if (data[i].sanitizeURLEnabled) {
                            if (data[i].sanitizedURL.length > 0) {
                                window.location.replace(data[i].sanitizedURL);
                            }
                        }
                        else {
                            if (data[i].clickThrough.length > 0) {
                                window.location.replace(data[i].clickThrough);
                            }
                        }
                    })
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
                        .on("mouseover", function (d, i) {
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
                    var textspot = svg.selectAll("text.toplabel")
                        .data(ahexbin(this.calculatedPoints));
                    var dynamicLabelFontSize = activeLabelFontSize;
                    var dynamicValueFontSize = activeValueFontSize;
                    textspot
                        .enter()
                        .append("text")
                        .attr("class", "toplabel")
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y; })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("font-size", dynamicLabelFontSize + "px")
                        .attr("fill", "black")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQXdCRSxtQkFBWSxXQUFnQixFQUFFLFlBQWlCLEVBQUUsT0FBWSxFQUFFLEdBQVE7b0JBSHZFLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBSVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO29CQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztvQkFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztvQkFFZixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTFDLElBQUksQ0FBQyxNQUFNLEdBQUc7d0JBQ1osR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUNaLEtBQUssRUFBRSxDQUFDO3dCQUNSLE1BQU0sRUFBRSxFQUFFO3dCQUNWLElBQUksRUFBRSxFQUFFO3FCQUNULENBQUM7b0JBRUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxXQUFXLEdB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QztvQ0FFakIsSUFBSSxXQUFXLEdBQUcsY0FBYyxFQUFFO3dDQUNoQyxjQUFjLEdBQUcsV0FBVyxDQUFDO3FDQUM5QjtvQ0FDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUNBQ3BFOzZCQUNGO3lCQUNGO3FCQUNGO29CQUdELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztvQkFDckMsT0FBTyxNQUFNLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRUgsZ0JBQUM7WUFBRCxDQUFDLEFBcHRCRCxJQW90QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZDMtaGV4YmluL2luZGV4LmQudHNcIiAvPlxuLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzL2luZGV4LmQudHNcIiAvPlxuaW1wb3J0ICogYXMgZDMgZnJvbSBcIi4vZXh0ZXJuYWwvZDMubWluLmpzXCI7XG5pbXBvcnQgKiBhcyBkM2hleGJpbiBmcm9tIFwiLi9leHRlcm5hbC9kMy1oZXhiaW4uanNcIjtcbmltcG9ydCB7IGdldFRleHRTaXplRm9yV2lkdGhBbmRIZWlnaHQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIGQzRGl2SWQ6IGFueTtcbiAgbWF4Q29sdW1uc1VzZWQ6IG51bWJlcjtcbiAgbWF4Um93c1VzZWQ6IG51bWJlcjtcbiAgb3B0OiBhbnk7XG4gIGRhdGE6IGFueTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgY2FsY3VsYXRlZFBvaW50czogYW55O1xuICBoZXhSYWRpdXM6IG51bWJlcjtcbiAgYXV0b0hleFJhZGl1cyA6IG51bWJlcjtcbiAgYXV0b1dpZHRoIDogbnVtYmVyO1xuICBhdXRvSGVpZ2h0OiBudW1iZXI7XG4gIG51bUNvbHVtbnM6IG51bWJlcjtcbiAgbnVtUm93czogbnVtYmVyO1xuICBtYXJnaW46IHtcbiAgICB0b3A6IG51bWJlcixcbiAgICByaWdodCA6IG51bWJlcixcbiAgICBib3R0b20gOiBudW1iZXIsXG4gICAgbGVmdCA6IG51bWJlcixcbiAgfTtcbiAgbWF4Rm9udCA9IDI0MDtcbiAgcHVyZWxpZ2h0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVTcnY6IGFueSwgc3ZnQ29udGFpbmVyOiBhbnksIGQzRGl2SWQ6IGFueSwgb3B0OiBhbnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBzdmdDb250YWluZXI7XG4gICAgdGhpcy5kM0RpdklkID0gZDNEaXZJZDtcbiAgICB0aGlzLmRhdGEgPSBvcHQuZGF0YTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcblxuICAgIHRoaXMucHVyZWxpZ2h0ID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpO1xuICAgIC8vIHRpdGxlIGlzIDI2cHhcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogMzAgKyAyNixcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgYm90dG9tOiAyMCxcbiAgICAgIGxlZnQ6IDUwXG4gICAgfTtcbiAgICAvLyB0YWtlIDEwIG9mZiB0aGUgaGVpZ2h0XG4gICAgdGhpcy5vcHQuaGVpZ2h0IC09IDEwO1xuICAgIHRoaXMub3B0LndpZHRoIC09IDIwO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0LmRhdGE7XG4gICAgdGhpcy5udW1Db2x1bW5zID0gNTtcbiAgICB0aGlzLm51bVJvd3MgPSA1O1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSAwO1xuICAgIGlmIChvcHQucm93QXV0b1NpemUgJiYgb3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm51bUNvbHVtbnMgPSBvcHQuY29sdW1ucyB8fCA2O1xuICAgICAgdGhpcy5udW1Sb3dzID0gb3B0LnJvd3MgfHwgNjtcbiAgICB9XG4gICAgaWYgKCghb3B0LnJhZGl1c0F1dG9TaXplKSAmJiAob3B0LnJhZGl1cykpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vIHx8IDUwO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vfHwgNTA7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcbn1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAodGhpcy5vcHQucm93QXV0b1NpemUgJiYgdGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgIC8vIHNxcnQgb2YgIyBkYXRhIGl0ZW1zXG4gICAgICBsZXQgc3F1YXJlZCA9IE1hdGguc3FydCh0aGlzLmRhdGEubGVuZ3RoKTtcbiAgICAgIC8vIGZhdm9yIGNvbHVtbnMgd2hlbiB3aWR0aCBpcyBncmVhdGVyIHRoYW4gaGVpZ2h0XG4gICAgICAvLyBmYXZvciByb3dzIHdoZW4gd2lkdGggaXMgbGVzcyB0aGFuIGhlaWdodFxuICAgICAgaWYgKHRoaXMub3B0LndpZHRoID4gdGhpcy5vcHQuaGVpZ2h0KSB7XG4gICAgICAgIC8vIHJhdGlvIG9mIHdpZHRoIHRvIGhlaWdodFxuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC53aWR0aCAvIHRoaXMub3B0LmhlaWdodCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIGNvbHVtblxuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJlZmVyIGV2ZW5zIGFuZCBzbWFsbGVyXG4gICAgICAgIGlmICgodGhpcy5udW1Db2x1bW5zICUgMikgJiYgKHRoaXMubnVtQ29sdW1ucyA+IDIpKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zIC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5mbG9vcih0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Db2x1bW5zICogcmF0aW8pO1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC5oZWlnaHQgLyB0aGlzLm9wdC53aWR0aCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBwcmVmZXIgZXZlbnMgYW5kIHNtYWxsZXJcbiAgICAgICAgaWYgKCh0aGlzLm51bVJvd3MgJSAyKSAmJiAodGhpcy5udW1Sb3dzID4gMikpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgLT0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmZsb29yKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICAgIC8vIHByZWZlciBtb3JlIGNvbHVtbnNcbiAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09PSB0aGlzLm51bUNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIkNhbGN1bGF0ZWQgY29sdW1ucyA9IFwiICsgdGhpcy5udW1Db2x1bW5zKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCByb3dzID0gXCIgKyB0aGlzLm51bVJvd3MpO1xuICAgIC8vY29uc29sZS5sb2coXCJOdW1iZXIgb2YgZGF0YSBpdGVtcyB0byByZW5kZXIgPSBcIiArIHRoaXMuZGF0YS5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMub3B0LnJhZGl1c0F1dG9TaXplKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiYXV0b0hleFJhZGl1czpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcblxuICAgIHZhciB3aWR0aCA9IHRoaXMub3B0LndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLm9wdC5oZWlnaHQ7XG4gICAgLy9jb25zb2xlLmxvZyhcIkRldGVjdGVkIFdpZHRoOiBcIiArIHdpZHRoICsgXCIgSGVpZ2h0OiBcIiArIGhlaWdodCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG9yYWQ6XCIgKyB0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgIHZhciBhaGV4YmluID0gZDNoZXhiaW5cbiAgICAgIC5oZXhiaW4oKVxuICAgICAgLnJhZGl1cyh0aGlzLmF1dG9IZXhSYWRpdXMpXG4gICAgICAuZXh0ZW50KFtbMCwgMF0sIFt3aWR0aCwgaGVpZ2h0XV0pO1xuXG4gICAgLy8gZDMgY2FsY3VsYXRlcyB0aGUgcmFkaXVzIGZvciB4IGFuZCB5IHNlcGFyYXRlbHkgYmFzZWQgb24gdGhlIHZhbHVlIHBhc3NlZCBpblxuICAgIHZhciB0aGlyZFBpID0gTWF0aC5QSSAvIDM7XG4gICAgbGV0IGRpYW1ldGVyWCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDIgKiBNYXRoLnNpbih0aGlyZFBpKTtcbiAgICBsZXQgZGlhbWV0ZXJZID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMS41O1xuICAgIGxldCByYWRpdXNYID0gZGlhbWV0ZXJYIC8gMjtcbiAgICBsZXQgcmVuZGVyV2lkdGggPSB0aGlzLm1heENvbHVtbnNVc2VkICogZGlhbWV0ZXJYO1xuICAgIC8vIHJlbmRlckhlaWdodCBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSAjcm93cyB1c2VkLCBhbmRcbiAgICAvLyB0aGUgXCJzcGFjZVwiIHRha2VuIGJ5IHRoZSBoZXhhZ29ucyBpbnRlcmxlYXZlZFxuICAgIC8vIHNwYWNlIHRha2VuIGlzIDIvMyBvZiBkaWFtZXRlclkgKiAjIHJvd3NcbiAgICBsZXQgcmVuZGVySGVpZ2h0ID0gKHRoaXMubWF4Um93c1VzZWQgKiBkaWFtZXRlclkpICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgLy8gZGlmZmVyZW5jZSBvZiB3aWR0aCBhbmQgcmVuZGVyd2lkdGggaXMgb3VyIHBsYXkgcm9vbSwgc3BsaXQgdGhhdCBpbiBoYWxmXG4gICAgLy8gb2Zmc2V0IGlzIGZyb20gY2VudGVyIG9mIGhleGFnb24sIG5vdCBmcm9tIHRoZSBlZGdlXG4gICAgbGV0IHhvZmZzZXQgPSAod2lkdGggLSByZW5kZXJXaWR0aCArIHJhZGl1c1gpIC8gMjtcbiAgICAvLyBpZiB0aGVyZSBpcyBqdXN0IG9uZSBjb2x1bW4gYW5kIG9uZSByb3csIGNlbnRlciBpdFxuICAgIGlmICh0aGlzLm51bVJvd3MgPT09IDEpIHtcbiAgICAgIHJlbmRlckhlaWdodCA9IGRpYW1ldGVyWSArIChkaWFtZXRlclkgKiAuMzMpO1xuICAgICAgeG9mZnNldCA9ICgod2lkdGggLSByZW5kZXJXaWR0aCkgLyAyKSArIHJhZGl1c1g7XG4gICAgfVxuICAgIC8vIHkgZGlhbWV0ZXIgb2YgaGV4YWdvbiBpcyBsYXJnZXIgdGhhbiB4IGRpYW1ldGVyXG4gICAgbGV0IHlvZmZzZXQgPSAoKGhlaWdodCAtIHJlbmRlckhlaWdodCkgLyAyKSArIChkaWFtZXRlclkgKiAuNjYpO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBkaXYgZm9yIHRoZSB0b29sdGlwXG4gICAgLy8gYWRkIGl0IHRvIHRoZSBib2R5IGFuZCBub3QgdGhlIGNvbnRhaW5lciBzbyBpdCBjYW4gZmxvYXQgb3V0c2lkZSBvZiB0aGUgcGFuZWxcbiAgICB2YXIgdG9vbHRpcCA9IGQzXG4gICAgICAuc2VsZWN0KFwiYm9keVwiKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcIi10b29sdGlwXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwicG9seXN0YXQtcGFuZWwtdG9vbHRpcFwiKVxuICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICB2YXIgc3ZnIDogYW55ID0gZDMuc2VsZWN0KHRoaXMuc3ZnQ29udGFpbmVyKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBcInB4XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJib3JkZXJcIiwgXCIwcHggc29saWQgd2hpdGVcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkKVxuICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeG9mZnNldCArIFwiLFwiICsgeW9mZnNldCArIFwiKVwiKTtcblxuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgIHZhciBkZWZzID0gc3ZnLmFwcGVuZChcImRlZnNcIik7XG5cbiAgICBsZXQgY29sb3JHcmFkaWVudHMgPSBDb2xvci5jcmVhdGVHcmFkaWVudHMoZGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvckdyYWRpZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIk5hbWUgPSBcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWRhdGEtXCIgKyBpKTtcbiAgICAgIGxldCBhR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNvbG9yR3JhZGllbnRzW2ldLnN0YXJ0KTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjb2xvckdyYWRpZW50c1tpXS5lbmQpO1xuICAgIH1cbiAgICBsZXQgb2tDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDgyLCAxOTQsIDUyKTsgLy8gIzUyYzIzNFxuICAgIGxldCBva0NvbG9yRW5kID0gb2tDb2xvclN0YXJ0Lk11bCh0aGlzLnB1cmVsaWdodCwgMC43KTtcbiAgICBsZXQgb2tHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtb2tcIik7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBva0NvbG9yU3RhcnQuYXNIZXgoKSk7XG4gICAgb2tHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBva0NvbG9yRW5kLmFzSGV4KCkpO1xuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0p1aWN5T3JhbmdlXG4gICAgbGV0IHdhcm5pbmdDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDI1NSwgMjAwLCA1NSk7IC8vICNGRkM4MzdcbiAgICBsZXQgd2FybmluZ0NvbG9yRW5kID0gd2FybmluZ0NvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCB3YXJuaW5nR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtd2FybmluZ1wiKTtcbiAgICB3YXJuaW5nR3JhZGllbnQuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCB3YXJuaW5nQ29sb3JTdGFydC5hc0hleCgpKTsgLy8gbGlnaHQgb3JhbmdlXG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgd2FybmluZ0NvbG9yRW5kLmFzSGV4KCkpOyAvLyBkYXJrIG9yYW5nZVxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI1lvdVR1YmVcbiAgICBsZXQgY3JpdGljYWxDb2xvclN0YXJ0ID0gbmV3IENvbG9yKDIyOSwgNDUsIDM5KTsgLy8gZTUyZDI3XG4gICAgbGV0IGNyaXRpY2FsQ29sb3JFbmQgPSBjcml0aWNhbENvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCBjcml0aWNhbEdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1jcml0aWNhbFwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNyaXRpY2FsQ29sb3JTdGFydC5hc0hleCgpKTsgLy8gbGlnaHQgcmVkXG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBjcml0aWNhbENvbG9yRW5kLmFzSGV4KCkpOyAvLyBkYXJrIHJlZFxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0FzaFxuICAgIGxldCB1bmtub3duR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXVua25vd25cIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzM4MDhBXCIpOyAvLyBsaWdodCBncmV5XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzc1N0Y5QVwiKTsgLy8gZGFyayBncmV5XG5cbiAgICBsZXQgY3VzdG9tU2hhcGUgPSBudWxsO1xuICAgIC8vIHRoaXMgaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGZvbnRzaXplXG4gICAgbGV0IHNoYXBlV2lkdGggPSBkaWFtZXRlclg7XG4gICAgbGV0IHNoYXBlSGVpZ2h0ID0gZGlhbWV0ZXJZO1xuICAgIC8vIHN5bWJvbHMgdXNlIHRoZSBhcmVhIGZvciB0aGVpciBzaXplXG4gICAgbGV0IGlubmVyQXJlYSA9IGRpYW1ldGVyWCAqIGRpYW1ldGVyWTtcbiAgICAvLyB1c2UgdGhlIHNtYWxsZXIgb2YgZGlhbWV0ZXJYIG9yIFlcbiAgICBpZiAoZGlhbWV0ZXJYIDwgZGlhbWV0ZXJZKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclg7XG4gICAgfVxuICAgIGlmIChkaWFtZXRlclkgPCBkaWFtZXRlclgpIHtcbiAgICAgIGlubmVyQXJlYSA9IGRpYW1ldGVyWSAqIGRpYW1ldGVyWTtcbiAgICB9XG4gICAgbGV0IHN5bWJvbCA9IGQzLnN5bWJvbCgpLnNpemUoaW5uZXJBcmVhKTtcbiAgICBzd2l0Y2ggKHRoaXMub3B0LnBvbHlzdGF0LnNoYXBlKSB7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9wb2ludGVkX3RvcFwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBzaGFwZVdpZHRoID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaGV4YWdvbl9mbGF0X3RvcFwiOlxuICAgICAgICAvLyBUT0RPOiB1c2UgcG9pbnRlZCBmb3Igbm93XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIHNoYXBlV2lkdGggPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDaXJjbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbENyb3NzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGlhbW9uZFwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbERpYW1vbmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzcXVhcmVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xTcXVhcmUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzdGFyXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3Rhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRyaWFuZ2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sVHJpYW5nbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3eWVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xXeWUpO1xuICAgICAgICBicmVhaztcbiAgICAgZGVmYXVsdDpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBmb250c2l6ZSBiYXNlZCBvbiB0aGUgc2hhcGUgYW5kIHRoZSB0ZXh0XG4gICAgbGV0IGFjdGl2ZUxhYmVsRm9udFNpemUgPSB0aGlzLm9wdC5wb2x5c3RhdC5mb250U2l6ZTtcbiAgICAvLyBmb250IHNpemVzIGFyZSBpbmRlcGVuZGVudCBmb3IgbGFiZWwgYW5kIHZhbHVlc1xuICAgIGxldCBhY3RpdmVWYWx1ZUZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgbGV0IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQgPSBcIlwiO1xuXG4gICAgaWYgKHRoaXMub3B0LnBvbHlzdGF0LmZvbnRBdXRvU2NhbGUpIHtcbiAgICAgIC8vIGZpbmQgdGhlIG1vc3QgdGV4dCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIG92ZXIgYWxsIGl0ZW1zXG4gICAgICBsZXQgbWF4TGFiZWwgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtpXS5uYW1lLmxlbmd0aCA+IG1heExhYmVsLmxlbmd0aCkge1xuICAgICAgICAgIG1heExhYmVsID0gdGhpcy5kYXRhW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGVzdGltYXRlIGhvdyBiaWcgb2YgYSBmb250IGNhbiBiZSB1c2VkXG4gICAgICAvLyBUd28gbGluZXMgb2YgdGV4dCBtdXN0IGZpdCB3aXRoIHZlcnRpY2FsIHNwYWNpbmcgaW5jbHVkZWRcbiAgICAgIC8vIGlmIGl0IGlzIHRvbyBzbWFsbCwgaGlkZSBldmVyeXRoaW5nXG4gICAgICBsZXQgZXN0aW1hdGVMYWJlbEZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgICAgbWF4TGFiZWwsXG4gICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIiwgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICBzaGFwZVdpZHRoLFxuICAgICAgICBzaGFwZUhlaWdodCAvIDMsIC8vIHRvcCBhbmQgYm90dG9tIG9mIGhleGFnb24gbm90IHVzZWQsIGFuZCB0d28gbGluZXMgb2YgdGV4dFxuICAgICAgICAxMCxcbiAgICAgICAgdGhpcy5tYXhGb250KTtcblxuICAgICAgLy9jb25zb2xlLmxvZyhcIkNhbGM6IEVzdGltYXRlZCBMYWJlbCBGb250IFNpemU6IFwiICsgZXN0aW1hdGVMYWJlbEZvbnRTaXplKTtcbiAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSBlc3RpbWF0ZUxhYmVsRm9udFNpemU7XG4gICAgICAvLyBzYW1lIGZvciB0aGUgdmFsdWVcbiAgICAgIGxldCBtYXhWYWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbGVuOiBcIiArIHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZCArIFwiIHZzOiBcIiArIG1heFZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZC5sZW5ndGggPiBtYXhWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhWYWx1ZSA9IHRoaXMuZGF0YVtpXS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy9jb25zb2xlLmxvZyhcIk1heCBWYWx1ZTogXCIgKyBtYXhWYWx1ZSk7XG4gICAgICBsZXQgZXN0aW1hdGVWYWx1ZUZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aEFuZEhlaWdodChcbiAgICAgICAgbWF4VmFsdWUsXG4gICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIiwgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICBzaGFwZVdpZHRoLFxuICAgICAgICBzaGFwZUhlaWdodCAvIDMsIC8vIHRvcCBhbmQgYm90dG9tIG9mIGhleGFnb24gbm90IHVzZWQsIGFuZCB0d28gbGluZXMgb2YgdGV4dFxuICAgICAgICAxMCxcbiAgICAgICAgdGhpcy5tYXhGb250KTtcbiAgICAgIGFjdGl2ZVZhbHVlRm9udFNpemUgPSBlc3RpbWF0ZVZhbHVlRm9udFNpemU7XG4gICAgICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gbWF4VmFsdWU7XG4gICAgfVxuXG4gICAgLy8gZmxhdCB0b3AgaXMgcm90YXRlZCA5MCBkZWdyZWVzLCBidXQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtL2xheW91dCBuZWVkcyB0byBiZSBhZGp1c3RlZFxuICAgIC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC55ICsgXCIsXCIgKyBkLnggKyBcIilyb3RhdGUoOTApXCI7IH0pXG4gICAgLy8gc2VlIGh0dHA6Ly9ibC5vY2tzLm9yZy9qYXNvbmRhdmllcy9mNTkyMmVkNGQwYWMxYWMyMTYxZlxuXG4gICAgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuXG5cbiAgICBzdmcuc2VsZWN0QWxsKFwiLmhleGFnb25cIilcbiAgICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJoZXhhZ29uXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG4gICAgICAgIC5hdHRyKFwiZFwiLCBjdXN0b21TaGFwZSlcbiAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yKVxuICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSArIFwicHhcIilcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCAoXywgaSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5ncmFkaWVudEVuYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIHNhZmFyaSBuZWVkcyB0aGUgbG9jYXRpb24uaHJlZlxuICAgICAgICAgICAgcmV0dXJuIFwidXJsKFwiICsgbG9jYXRpb24uaHJlZiArIFwiI1wiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkgKyBcIilcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbaV0uY29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oXCJjbGlja1wiLCAoXywgaSkgPT4ge1xuICAgICAgICAgIGlmIChkYXRhW2ldLnNhbml0aXplVVJMRW5hYmxlZCkge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0uc2FuaXRpemVkVVJMLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoZGF0YVtpXS5zYW5pdGl6ZWRVUkwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXS5jbGlja1Rocm91Z2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShkYXRhW2ldLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgICAgICAgIC8vIHVzZSB0aGUgdmlld3BvcnR3aWR0aCB0byBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb20gZ29pbmcgdG9vIGZhciByaWdodFxuICAgICAgICAgIGxldCB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgICAgICAvLyB1c2UgdGhlIG1vdXNlIHBvc2l0aW9uIGZvciB0aGUgZW50aXJlIHBhZ2VcbiAgICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZShkMy5zZWxlY3QoXCJib2R5XCIpLm5vZGUoKSk7XG4gICAgICAgICAgdmFyIHhwb3MgPSBtb3VzZVswXSAtIDUwO1xuICAgICAgICAgIC8vIGRvbid0IGFsbG93IG9mZnNjcmVlbiB0b29sdGlwXG4gICAgICAgICAgaWYgKHhwb3MgPCAwKSB7XG4gICAgICAgICAgICB4cG9zID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcHJldmVudCB0b29sdGlwIGZyb20gcmVuZGVyaW5nIG91dHNpZGUgb2Ygdmlld3BvcnRcbiAgICAgICAgICBpZiAoKHhwb3MgKyAyMDApID4gdmlld1BvcnRXaWR0aCkge1xuICAgICAgICAgICAgeHBvcyA9IHZpZXdQb3J0V2lkdGggLSAyMDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5cG9zID0gbW91c2VbMV0gKyA1O1xuICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgeHBvcyArIFwicHhcIilcbiAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCB5cG9zICsgXCJweFwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkLCBpKSA9PiB7XG4gICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5zdHlsZShcIm9wYWNpdHlcIiwgMC45KTtcbiAgICAgICAgICB0b29sdGlwLmh0bWwodGhpcy5vcHQudG9vbHRpcENvbnRlbnRbaV0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRTaXplKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRUeXBlKVxuICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZC54IC0gNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQueSAtIDUpICsgXCJweFwiKTtcbiAgICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICB9KTtcbiAgICAvLyBub3cgbGFiZWxzXG4gICAgdmFyIHRleHRzcG90ID0gc3ZnLnNlbGVjdEFsbChcInRleHQudG9wbGFiZWxcIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSk7XG5cbiAgICBsZXQgZHluYW1pY0xhYmVsRm9udFNpemUgPSBhY3RpdmVMYWJlbEZvbnRTaXplO1xuICAgIGxldCBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGFjdGl2ZVZhbHVlRm9udFNpemU7XG4gICAgLy9jb25zb2xlLmxvZyhcIkR5bmFtaWNMYWJlbEZvbnRTaXplOiBcIiArIGR5bmFtaWNMYWJlbEZvbnRTaXplKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiRHluYW1pY1ZhbHVlRm9udFNpemU6IFwiICsgZHluYW1pY1ZhbHVlRm9udFNpemUpO1xuICAgIHRleHRzcG90XG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b3BsYWJlbFwiKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueTsgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljTGFiZWxGb250U2l6ZSArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpXG4gICAgICAudGV4dChmdW5jdGlvbiAoXywgaSkge1xuICAgICAgICBsZXQgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgIC8vIGNoZWNrIGlmIHByb3BlcnR5IGV4aXN0XG4gICAgICAgIGlmICghKFwic2hvd05hbWVcIiBpbiBpdGVtKSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0uc2hvd05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHZhciBmcmFtZXMgPSAwO1xuXG5cbiAgICB0ZXh0c3BvdC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihfLCBpKSB7XG4gICAgICAgIHJldHVybiBcInZhbHVlTGFiZWxcIiArIGk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLng7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLnkgKyAoYWN0aXZlTGFiZWxGb250U2l6ZSAvIDIgKSArIDIwOyAvLyBvZmZzZXQgYnkgZm9udHNpemUgYW5kIDEwcHggdmVydGljYWwgcGFkZGluZ1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAudGV4dCggKF8sIGkpID0+IHtcbiAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIC8vIHNlYXJjaCBmb3IgYSB2YWx1ZSBidXQgbm90IG1vcmUgdGhhbiBudW1iZXIgb2YgZGF0YSBpdGVtc1xuICAgICAgICAvLyBuZWVkIHRvIGZpbmQgdGhlIGxvbmdlc3QgY29udGVudCBzdHJpbmcgZ2VuZXJhdGVkIHRvIGRldGVybWluZSB0aGVcbiAgICAgICAgLy8gZHluYW1pYyBmb250IHNpemVcbiAgICAgICAgLy8gdGhpcyBhbHdheXMgc3RhcnRzIGZyb20gZnJhbWUgMCwgbG9vayB0aHJvdWdoIGV2ZXJ5IG1ldHJpYyBpbmNsdWRpbmcgY29tcG9zaXRlIG1lbWJlcnMgZm9yIHRoZSBsb25nZXN0IHRleHQgcG9zc2libGVcbiAgICAgICAgLy8gZ2V0IHRoZSB0b3RhbCBjb3VudCBvZiBtZXRyaWNzICh3aXRoIGNvbXBvc2l0ZSBtZW1iZXJzKSwgYW5kIGxvb3AgdGhyb3VnaFxuICAgICAgICBsZXQgc3VibWV0cmljQ291bnQgPSB0aGlzLmRhdGFbaV0ubWVtYmVycy5sZW5ndGg7XG4gICAgICAgIC8vbGV0IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoc3VibWV0cmljQ291bnQgPiAwKSB7XG4gICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCBzdWJtZXRyaWNDb3VudCkge1xuICAgICAgICAgICAgbGV0IGNoZWNrQ29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIGNvdW50ZXIsIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGNoZWNrQ29udGVudCkge1xuICAgICAgICAgICAgICBpZiAoY2hlY2tDb250ZW50Lmxlbmd0aCA+IGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IGNoZWNrQ29udGVudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgIH1cbiAgICAgICAgfS8vIGVsc2Uge1xuICAgICAgICAgIC8vIG5vbi1jb21wb3NpdGVzIHVzZSB0aGUgZm9ybWF0dGVkIHNpemUgb2YgdGhlIG1ldHJpYyB2YWx1ZVxuICAgICAgICAvLyAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIGNvdW50ZXIsIHRoaXMpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFuaW1hdGVkOiBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50OiBcIiArIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQpO1xuICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoQW5kSGVpZ2h0KFxuICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQsXG4gICAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLCAgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICAgIHNoYXBlV2lkdGgsICAgLy8gcGFkXG4gICAgICAgICAgc2hhcGVIZWlnaHQgLyAzLFxuICAgICAgICAgIDYsXG4gICAgICAgICAgdGhpcy5tYXhGb250KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNhbGM6IER5bmFtaWMgVmFsdWUgRm9udCBTaXplOiBcIiArIGR5bmFtaWNWYWx1ZUZvbnRTaXplKTtcblxuICAgICAgICAvLyB2YWx1ZSBzaG91bGQgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhlIGxhYmVsXG4gICAgICAgIGlmIChkeW5hbWljVmFsdWVGb250U2l6ZSA+IGR5bmFtaWNMYWJlbEZvbnRTaXplKSB7XG4gICAgICAgICAgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBkeW5hbWljTGFiZWxGb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYW5pbWF0ZWQ6IGR5bmFtaWNMYWJlbEZvbnRTaXplOiBcIiArIGR5bmFtaWNMYWJlbEZvbnRTaXplKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFuaW1hdGVkOiBkeW5hbWljVmFsdWVGb250U2l6ZTogXCIgKyBkeW5hbWljVmFsdWVGb250U2l6ZSk7XG4gICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAvLyB1c2UgdGhlIGR5bmFtaWMgc2l6ZSBmb3IgdGhlIHZhbHVlXG4gICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuICAgICAgICBkMy5pbnRlcnZhbCggKCkgPT4ge1xuICAgICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAgIHZhciBjb21wb3NpdGVJbmRleCA9IGk7XG4gICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24udGV4dCggKCkgPT4ge1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGggKiAyO1xuICAgICAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGN5Y2xpbmcgdGhyb3VnaCB0d2ljZSB0byBhbGxvdyByb2xsb3ZlclxuICAgICAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChjb21wb3NpdGVJbmRleCwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBhZGQgY3VzdG9tIGNvbnRlbnQgZm9yIGNvbXBvc2l0ZSBvayBzdGF0ZVxuICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBmb250IHNpemUgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIGxhYmVsIGFib3ZlXG4gICAgICAgICAgICAgIC8vdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmcmFtZXMrKztcbiAgICAgICAgfSwgdGhpcy5vcHQuYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH0pO1xuICB9XG5cbiAgZm9ybWF0VmFsdWVDb250ZW50KGksIGZyYW1lcywgdGhpc1JlZik6IHN0cmluZyB7XG4gICAgbGV0IGRhdGEgPSB0aGlzUmVmLmRhdGFbaV07XG4gICAgLy8gb3B0aW9ucyBjYW4gc3BlY2lmeSB0byBub3Qgc2hvdyB0aGUgdmFsdWVcbiAgICBpZiAodHlwZW9mKGRhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInNob3dWYWx1ZVwiKSkge1xuICAgICAgICBpZiAoIWRhdGEuc2hvd1ZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlRm9ybWF0dGVkXCIpKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBkYXRhLCByZXR1cm4gbm90aGluZ1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHN3aXRjaCAoZGF0YS5hbmltYXRlTW9kZSkge1xuICAgICAgY2FzZSBcImFsbFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlnZ2VyZWRcIjpcbiAgICAgICAgLy8gcmV0dXJuIG5vdGhpbmcgaWYgbW9kZSBpcyB0cmlnZ2VyZWQgYW5kIHRoZSBzdGF0ZSBpcyAwXG4gICAgICAgIGlmIChkYXRhLnRocmVzaG9sZExldmVsIDwgMSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBjb250ZW50ID0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAvLyBpZiB0aGVyZSdzIG5vIHZhbHVlRm9ybWF0dGVkLCB0aGVyZSdzIG5vdGhpbmcgdG8gZGlzcGxheVxuICAgIGlmICghY29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoZGF0YS5wcmVmaXgpICYmIChkYXRhLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGRhdGEucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgIH1cbiAgICBpZiAoKGRhdGEuc3VmZml4KSAmJiAoZGF0YS5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBkYXRhLnN1ZmZpeDtcbiAgICB9XG4gICAgLy8gYSBjb21wb3NpdGUgd2lsbCBjb250YWluIHRoZSBcIndvcnN0XCIgY2FzZSBhcyB0aGUgdmFsdWVGb3JtYXR0ZWQsXG4gICAgLy8gYW5kIHdpbGwgaGF2ZSBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgdGhlIGNvbXBvc2l0ZSBpbmNsdWRlZC5cbiAgICAvLyBhcyBmcmFtZXMgaW5jcmVtZW50IGZpbmQgYSB0cmlnZ2VyZWQgbWVtYmVyIHN0YXJ0aW5nIGZyb20gdGhlIGZyYW1lIG1vZCBsZW5cbiAgICBsZXQgbGVuID0gZGF0YS5tZW1iZXJzLmxlbmd0aDtcbiAgICBpZiAobGVuID4gMCkge1xuICAgICAgbGV0IHRyaWdnZXJlZEluZGV4ID0gLTE7XG4gICAgICBpZiAoZGF0YS5hbmltYXRlTW9kZSA9PT0gXCJhbGxcIikge1xuICAgICAgICB0cmlnZ2VyZWRJbmRleCA9IGZyYW1lcyAlIGxlbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gYWxsIG1vZGU6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhLnRyaWdnZXJDYWNoZSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBkYXRhLnRyaWdnZXJDYWNoZSA9IHRoaXMuYnVpbGRUcmlnZ2VyQ2FjaGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHogPSBmcmFtZXMgJSBkYXRhLnRyaWdnZXJDYWNoZS5sZW5ndGg7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZGF0YS50cmlnZ2VyQ2FjaGVbel0uaW5kZXg7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0cmlnZ2VyZWRJbmRleCBmcm9tIGNhY2hlIGlzOiBcIiArIHRyaWdnZXJlZEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGxldCBhTWVtYmVyID0gZGF0YS5tZW1iZXJzW3RyaWdnZXJlZEluZGV4XTtcblxuICAgICAgY29udGVudCA9IGFNZW1iZXIubmFtZSArIFwiOiBcIiArIGFNZW1iZXIudmFsdWVGb3JtYXR0ZWQ7XG4gICAgICBpZiAoKGFNZW1iZXIucHJlZml4KSAmJiAoYU1lbWJlci5wcmVmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGFNZW1iZXIucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgICAgfVxuICAgICAgaWYgKChhTWVtYmVyLnN1ZmZpeCkgJiYgKGFNZW1iZXIuc3VmZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBhTWVtYmVyLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYWxsb3cgdGVtcGxhdGluZ1xuICAgIC8vXG4gICAgaWYgKChjb250ZW50KSAmJiAoY29udGVudC5sZW5ndGggPiAwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlcGxhY2VkQ29udGVudCA9IHRoaXNSZWYudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KGNvbnRlbnQpO1xuICAgICAgICBjb250ZW50ID0gcmVwbGFjZWRDb250ZW50O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IHRlbXBsYXRlIHNlcnZlciB0aHJldyBlcnJvcjogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGJ1aWxkVHJpZ2dlckNhY2hlKGl0ZW0pIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiQnVpbGRpbmcgdHJpZ2dlciBjYWNoZSBmb3IgaXRlbVwiKTtcbiAgICBsZXQgdHJpZ2dlckNhY2hlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLm1lbWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBhTWVtYmVyID0gaXRlbS5tZW1iZXJzW2ldO1xuICAgICAgaWYgKGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgPiAwKSB7XG4gICAgICAgIC8vIGFkZCB0byBsaXN0XG4gICAgICAgIGxldCBjYWNoZWRNZW1iZXJTdGF0ZSA9IHsgaW5kZXg6IGksIG5hbWU6IGFNZW1iZXIubmFtZSwgdmFsdWU6IGFNZW1iZXIudmFsdWUsIHRocmVzaG9sZExldmVsOiBhTWVtYmVyLnRocmVzaG9sZExldmVsIH07XG4gICAgICAgIHRyaWdnZXJDYWNoZS5wdXNoKGNhY2hlZE1lbWJlclN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc29ydCBpdFxuICAgIHRyaWdnZXJDYWNoZSA9IF8ub3JkZXJCeSh0cmlnZ2VyQ2FjaGUsIFtcInRocmVzaG9sZExldmVsXCIsIFwidmFsdWVcIiwgXCJuYW1lXCJdLCBbXCJkZXNjXCIsIFwiZGVzY1wiLCBcImFzY1wiXSk7XG4gICAgcmV0dXJuIHRyaWdnZXJDYWNoZTtcbiAgfVxuXG4gIGdldEF1dG9IZXhSYWRpdXMoKTogbnVtYmVyIHtcbiAgICAvL1RoZSBtYXhpbXVtIHJhZGl1cyB0aGUgaGV4YWdvbnMgY2FuIGhhdmUgdG8gc3RpbGwgZml0IHRoZSBzY3JlZW5cbiAgICB2YXIgaGV4UmFkaXVzID0gZDMubWluKFxuICAgICAgW1xuICAgICAgICB0aGlzLm9wdC53aWR0aCAvICgodGhpcy5udW1Db2x1bW5zICsgMC41KSAqIE1hdGguc3FydCgzKSksXG4gICAgICAgIHRoaXMub3B0LmhlaWdodCAvICgodGhpcy5udW1Sb3dzICsgMSAvIDMpICogMS41KVxuICAgICAgXVxuICAgICk7XG4gICAgcmV0dXJuIGhleFJhZGl1cztcbiAgfVxuXG4gIGNhbGN1bGF0ZVNWR1NpemUoKSB7XG4gICAgLy8gVGhlIGhlaWdodCBvZiB0aGUgdG90YWwgZGlzcGxheSB3aWxsIGJlXG4gICAgLy8gdGhpcy5hdXRvSGVpZ2h0ID0gdGhpcy5udW1Sb3dzICogMyAvIDIgKiB0aGlzLmhleFJhZGl1cyArIDEgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgLy8gd2hpY2ggaXMgdGhlIHNhbWUgYXNcbiAgICB0aGlzLmF1dG9IZWlnaHQgPSAodGhpcy5udW1Sb3dzICsgMSAvIDMpICogMyAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICB0aGlzLmF1dG9IZWlnaHQgLT0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tO1xuICAgIC8vY29uc29sZS5sb2coXCJhdXRvaGVpZ2h0ID0gXCIgKyB0aGlzLmF1dG9IZWlnaHQpO1xuICAgIC8vIFRoZSB3aWR0aCBvZiB0aGUgdG90YWwgZGlzcGxheSB3aWxsIGJlXG4gICAgLy8gdGhpcy5hdXRvV2lkdGggPSB0aGlzLm51bUNvbHVtbnMgKiBNYXRoLnNxcnQoMykgKiB0aGlzLmhleFJhZGl1cyArIE1hdGguc3FydCgzKSAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICAvLyB3aGljaCBpcyB0aGUgc2FtZSBhc1xuICAgIHRoaXMuYXV0b1dpZHRoID0gKHRoaXMubnVtQ29sdW1ucyArIDEgLyAyKSAqIE1hdGguc3FydCgzKSAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIHRoaXMuYXV0b1dpZHRoIC09IHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3dpZHRoID0gXCIgKyB0aGlzLmF1dG9XaWR0aCArIFwiIGF1dG9oZWlnaHQgPSBcIiArIHRoaXMuYXV0b0hlaWdodCk7XG4gIH1cblxuICAvLyBCdWlsZHMgdGhlIHBsYWNlaG9sZGVyIHBvbHlnb25zIG5lZWRlZCB0byByZXByZXNlbnQgZWFjaCBtZXRyaWNcbiAgZ2VuZXJhdGVQb2ludHMoKSA6IGFueSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIGlmICh0eXBlb2YodGhpcy5kYXRhKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgbGV0IG1heFJvd3NVc2VkID0gMDtcbiAgICBsZXQgY29sdW1uc1VzZWQgPSAwO1xuICAgIGxldCBtYXhDb2x1bW5zVXNlZCA9IDA7XG4gICAgLy8gd2hlbiBkdXBsaWNhdGluZyBwYW5lbHMsIHRoaXMgZ2V0cyBvZGRcbiAgICBpZiAodGhpcy5udW1Sb3dzID09PSBJbmZpbml0eSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm51bVJvd3MgaW5maW5pdHkuLi5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5udW1Db2x1bW5zID09PSBOYU4pIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Db2x1bW5zIE5hTlwiKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1Sb3dzOyBpKyspIHtcbiAgICAgIGlmICgocG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICBtYXhSb3dzVXNlZCArPSAxO1xuICAgICAgICBjb2x1bW5zVXNlZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5udW1Db2x1bW5zOyBqKyspIHtcbiAgICAgICAgICBpZiAoKHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGNvbHVtbnNVc2VkICs9IDE7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgbW9zdCBudW1iZXIgb2YgY29sdW1uc1xuICAgICAgICAgICAgaWYgKGNvbHVtbnNVc2VkID4gbWF4Q29sdW1uc1VzZWQpIHtcbiAgICAgICAgICAgICAgbWF4Q29sdW1uc1VzZWQgPSBjb2x1bW5zVXNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt0aGlzLmhleFJhZGl1cyAqIGogKiAxLjc1LCB0aGlzLmhleFJhZGl1cyAqIGkgKiAxLjVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIk1heCByb3dzIHVzZWQ6XCIgKyBtYXhSb3dzVXNlZCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIkFjdHVhbCBjb2x1bW5zIHVzZWQ6XCIgKyBtYXhDb2x1bW5zVXNlZCk7XG4gICAgdGhpcy5tYXhSb3dzVXNlZCA9IG1heFJvd3NVc2VkO1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSBtYXhDb2x1bW5zVXNlZDtcbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbn1cbiJdfQ==