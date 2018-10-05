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
                        console.log("autoHexRadius:" + this.autoHexRadius);
                    }
                    this.calculateSVGSize();
                    this.calculatedPoints = this.generatePoints();
                    var width = this.opt.width;
                    var height = this.opt.height;
                    console.log("Detected Width: " + width + " Height: " + height);
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
                    if (this.opt.polystat.fontAutoScale) {
                        var maxLabel = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].name.length > maxLabel.length) {
                                maxLabel = this.data[i].name;
                            }
                        }
                        var estimateLabelFontSize = utils_1.getTextSizeForWidth(maxLabel, "?px sans-serif", shapeWidth - 60, 10, this.maxFont);
                        activeLabelFontSize = estimateLabelFontSize;
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
                            return "url(#" + _this.d3DivId + "linear-gradient-state-data-" + i + ")";
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
                        return d.y + activeLabelFontSize + 10;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", this.opt.polystat.fontType)
                        .attr("fill", "black")
                        .attr("font-size", dynamicLabelFontSize + "px")
                        .text(function (_, i) {
                        var counter = 0;
                        var dataLen = _this.data.length;
                        var submetricCount = _this.data[i].members.length;
                        var longestDisplayedValueContent = "";
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
                        else {
                            longestDisplayedValueContent = _this.formatValueContent(i, counter, _this);
                        }
                        var content = null;
                        counter = 0;
                        while ((content === null) && (counter < dataLen)) {
                            content = _this.formatValueContent(i, (frames + counter), _this);
                            counter++;
                        }
                        dynamicValueFontSize = utils_1.getTextSizeForWidth(longestDisplayedValueContent, "?px sans-serif", shapeWidth - 60, 6, _this.maxFont);
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
                    console.log("autowidth = " + this.autoWidth + " autoheight = " + this.autoHeight);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQXdCRSxtQkFBWSxXQUFnQixFQUFFLFlBQWlCLEVBQUUsT0FBWSxFQUFFLEdBQVE7b0JBSHZFLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBSVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO29CQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztvQkFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztvQkFFZixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTFDLElBQUksQ0FBQyxNQUFNLEdBQUc7d0JBQ1osR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUNaLEtBQUssRUFBRSxDQUFDO3dCQUNSLE1BQU0sRUFBRSxFQUFFO3dCQUNWLElBQUksRUFBRSxFQUFFO3FCQUNULENBQUM7b0JBRUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxXQUFXLEdB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QUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztvQkFDckMsT0FBTyxNQUFNLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRUgsZ0JBQUM7WUFBRCxDQUFDLEFBM3RCRCxJQTJ0QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZDMtaGV4YmluL2luZGV4LmQudHNcIiAvPlxuLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzL2luZGV4LmQudHNcIiAvPlxuaW1wb3J0ICogYXMgZDMgZnJvbSBcIi4vZXh0ZXJuYWwvZDMubWluLmpzXCI7XG5pbXBvcnQgKiBhcyBkM2hleGJpbiBmcm9tIFwiLi9leHRlcm5hbC9kMy1oZXhiaW4uanNcIjtcbmltcG9ydCB7IGdldFRleHRTaXplRm9yV2lkdGggfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcbiAgc3ZnQ29udGFpbmVyOiBhbnk7XG4gIGQzRGl2SWQ6IGFueTtcbiAgbWF4Q29sdW1uc1VzZWQ6IG51bWJlcjtcbiAgbWF4Um93c1VzZWQ6IG51bWJlcjtcbiAgb3B0OiBhbnk7XG4gIGRhdGE6IGFueTtcbiAgdGVtcGxhdGVTcnY6IGFueTtcbiAgY2FsY3VsYXRlZFBvaW50czogYW55O1xuICBoZXhSYWRpdXM6IG51bWJlcjtcbiAgYXV0b0hleFJhZGl1cyA6IG51bWJlcjtcbiAgYXV0b1dpZHRoIDogbnVtYmVyO1xuICBhdXRvSGVpZ2h0OiBudW1iZXI7XG4gIG51bUNvbHVtbnM6IG51bWJlcjtcbiAgbnVtUm93czogbnVtYmVyO1xuICBtYXJnaW46IHtcbiAgICB0b3A6IG51bWJlcixcbiAgICByaWdodCA6IG51bWJlcixcbiAgICBib3R0b20gOiBudW1iZXIsXG4gICAgbGVmdCA6IG51bWJlcixcbiAgfTtcbiAgbWF4Rm9udCA9IDI0MDtcbiAgcHVyZWxpZ2h0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVTcnY6IGFueSwgc3ZnQ29udGFpbmVyOiBhbnksIGQzRGl2SWQ6IGFueSwgb3B0OiBhbnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gdGVtcGxhdGVTcnY7XG4gICAgdGhpcy5zdmdDb250YWluZXIgPSBzdmdDb250YWluZXI7XG4gICAgdGhpcy5kM0RpdklkID0gZDNEaXZJZDtcbiAgICB0aGlzLmRhdGEgPSBvcHQuZGF0YTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcblxuICAgIHRoaXMucHVyZWxpZ2h0ID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpO1xuICAgIC8vIHRpdGxlIGlzIDI2cHhcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogMzAgKyAyNixcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgYm90dG9tOiAyMCxcbiAgICAgIGxlZnQ6IDUwXG4gICAgfTtcbiAgICAvLyB0YWtlIDEwIG9mZiB0aGUgaGVpZ2h0XG4gICAgdGhpcy5vcHQuaGVpZ2h0IC09IDEwO1xuICAgIHRoaXMub3B0LndpZHRoIC09IDIwO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0LmRhdGE7XG4gICAgdGhpcy5udW1Db2x1bW5zID0gNTtcbiAgICB0aGlzLm51bVJvd3MgPSA1O1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSAwO1xuICAgIGlmIChvcHQucm93QXV0b1NpemUgJiYgb3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm51bUNvbHVtbnMgPSBvcHQuY29sdW1ucyB8fCA2O1xuICAgICAgdGhpcy5udW1Sb3dzID0gb3B0LnJvd3MgfHwgNjtcbiAgICB9XG4gICAgaWYgKCghb3B0LnJhZGl1c0F1dG9TaXplKSAmJiAob3B0LnJhZGl1cykpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vIHx8IDUwO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vfHwgNTA7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcbn1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAodGhpcy5vcHQucm93QXV0b1NpemUgJiYgdGhpcy5vcHQuY29sdW1uQXV0b1NpemUpIHtcbiAgICAgIC8vIHNxcnQgb2YgIyBkYXRhIGl0ZW1zXG4gICAgICBsZXQgc3F1YXJlZCA9IE1hdGguc3FydCh0aGlzLmRhdGEubGVuZ3RoKTtcbiAgICAgIC8vIGZhdm9yIGNvbHVtbnMgd2hlbiB3aWR0aCBpcyBncmVhdGVyIHRoYW4gaGVpZ2h0XG4gICAgICAvLyBmYXZvciByb3dzIHdoZW4gd2lkdGggaXMgbGVzcyB0aGFuIGhlaWdodFxuICAgICAgaWYgKHRoaXMub3B0LndpZHRoID4gdGhpcy5vcHQuaGVpZ2h0KSB7XG4gICAgICAgIC8vIHJhdGlvIG9mIHdpZHRoIHRvIGhlaWdodFxuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC53aWR0aCAvIHRoaXMub3B0LmhlaWdodCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIC8vIGFsd2F5cyBhdCBsZWFzdCAxIGNvbHVtblxuICAgICAgICBpZiAodGhpcy5udW1Db2x1bW5zIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJlZmVyIGV2ZW5zIGFuZCBzbWFsbGVyXG4gICAgICAgIGlmICgodGhpcy5udW1Db2x1bW5zICUgMikgJiYgKHRoaXMubnVtQ29sdW1ucyA+IDIpKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zIC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5mbG9vcih0aGlzLmRhdGEubGVuZ3RoIC8gdGhpcy5udW1Db2x1bW5zICogcmF0aW8pO1xuICAgICAgICBpZiAodGhpcy5udW1Sb3dzIDwgMSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmF0aW8gPSB0aGlzLm9wdC5oZWlnaHQgLyB0aGlzLm9wdC53aWR0aCAqIC42NjtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gTWF0aC5jZWlsKHNxdWFyZWQgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBwcmVmZXIgZXZlbnMgYW5kIHNtYWxsZXJcbiAgICAgICAgaWYgKCh0aGlzLm51bVJvd3MgJSAyKSAmJiAodGhpcy5udW1Sb3dzID4gMikpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgLT0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmZsb29yKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bVJvd3MgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICAgIC8vIHByZWZlciBtb3JlIGNvbHVtbnNcbiAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09PSB0aGlzLm51bUNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIkNhbGN1bGF0ZWQgY29sdW1ucyA9IFwiICsgdGhpcy5udW1Db2x1bW5zKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCByb3dzID0gXCIgKyB0aGlzLm51bVJvd3MpO1xuICAgIC8vY29uc29sZS5sb2coXCJOdW1iZXIgb2YgZGF0YSBpdGVtcyB0byByZW5kZXIgPSBcIiArIHRoaXMuZGF0YS5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMub3B0LnJhZGl1c0F1dG9TaXplKSB7XG4gICAgICB0aGlzLmhleFJhZGl1cyA9IHRoaXMuZ2V0QXV0b0hleFJhZGl1cygpO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9IZXhSYWRpdXM6XCIgKyB0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZVNWR1NpemUoKTtcbiAgICB0aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSB0aGlzLmdlbmVyYXRlUG9pbnRzKCk7XG5cbiAgICB2YXIgd2lkdGggPSB0aGlzLm9wdC53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHQuaGVpZ2h0O1xuICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgV2lkdGg6IFwiICsgd2lkdGggKyBcIiBIZWlnaHQ6IFwiICsgaGVpZ2h0KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3JhZDpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgdmFyIGFoZXhiaW4gPSBkM2hleGJpblxuICAgICAgLmhleGJpbigpXG4gICAgICAucmFkaXVzKHRoaXMuYXV0b0hleFJhZGl1cylcbiAgICAgIC5leHRlbnQoW1swLCAwXSwgW3dpZHRoLCBoZWlnaHRdXSk7XG5cbiAgICAvLyBkMyBjYWxjdWxhdGVzIHRoZSByYWRpdXMgZm9yIHggYW5kIHkgc2VwYXJhdGVseSBiYXNlZCBvbiB0aGUgdmFsdWUgcGFzc2VkIGluXG4gICAgdmFyIHRoaXJkUGkgPSBNYXRoLlBJIC8gMztcbiAgICBsZXQgZGlhbWV0ZXJYID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMiAqIE1hdGguc2luKHRoaXJkUGkpO1xuICAgIGxldCBkaWFtZXRlclkgPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAxLjU7XG4gICAgbGV0IHJhZGl1c1ggPSBkaWFtZXRlclggLyAyO1xuICAgIGxldCByZW5kZXJXaWR0aCA9IHRoaXMubWF4Q29sdW1uc1VzZWQgKiBkaWFtZXRlclg7XG4gICAgLy8gcmVuZGVySGVpZ2h0IGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlICNyb3dzIHVzZWQsIGFuZFxuICAgIC8vIHRoZSBcInNwYWNlXCIgdGFrZW4gYnkgdGhlIGhleGFnb25zIGludGVybGVhdmVkXG4gICAgLy8gc3BhY2UgdGFrZW4gaXMgMi8zIG9mIGRpYW1ldGVyWSAqICMgcm93c1xuICAgIGxldCByZW5kZXJIZWlnaHQgPSAodGhpcy5tYXhSb3dzVXNlZCAqIGRpYW1ldGVyWSkgKyAoZGlhbWV0ZXJZICogLjMzKTtcbiAgICAvLyBkaWZmZXJlbmNlIG9mIHdpZHRoIGFuZCByZW5kZXJ3aWR0aCBpcyBvdXIgcGxheSByb29tLCBzcGxpdCB0aGF0IGluIGhhbGZcbiAgICAvLyBvZmZzZXQgaXMgZnJvbSBjZW50ZXIgb2YgaGV4YWdvbiwgbm90IGZyb20gdGhlIGVkZ2VcbiAgICBsZXQgeG9mZnNldCA9ICh3aWR0aCAtIHJlbmRlcldpZHRoICsgcmFkaXVzWCkgLyAyO1xuICAgIC8vIGlmIHRoZXJlIGlzIGp1c3Qgb25lIGNvbHVtbiBhbmQgb25lIHJvdywgY2VudGVyIGl0XG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gMSkge1xuICAgICAgcmVuZGVySGVpZ2h0ID0gZGlhbWV0ZXJZICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgICB4b2Zmc2V0ID0gKCh3aWR0aCAtIHJlbmRlcldpZHRoKSAvIDIpICsgcmFkaXVzWDtcbiAgICB9XG4gICAgLy8geSBkaWFtZXRlciBvZiBoZXhhZ29uIGlzIGxhcmdlciB0aGFuIHggZGlhbWV0ZXJcbiAgICBsZXQgeW9mZnNldCA9ICgoaGVpZ2h0IC0gcmVuZGVySGVpZ2h0KSAvIDIpICsgKGRpYW1ldGVyWSAqIC42Nik7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGRpdiBmb3IgdGhlIHRvb2x0aXBcbiAgICAvLyBhZGQgaXQgdG8gdGhlIGJvZHkgYW5kIG5vdCB0aGUgY29udGFpbmVyIHNvIGl0IGNhbiBmbG9hdCBvdXRzaWRlIG9mIHRoZSBwYW5lbFxuICAgIHZhciB0b29sdGlwID0gZDNcbiAgICAgIC5zZWxlY3QoXCJib2R5XCIpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2x5c3RhdC1wYW5lbC10b29sdGlwXCIpXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgIHZhciBzdmcgOiBhbnkgPSBkMy5zZWxlY3QodGhpcy5zdmdDb250YWluZXIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5zdHlsZShcImJvcmRlclwiLCBcIjBweCBzb2xpZCB3aGl0ZVwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4b2Zmc2V0ICsgXCIsXCIgKyB5b2Zmc2V0ICsgXCIpXCIpO1xuXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgdmFyIGRlZnMgPSBzdmcuYXBwZW5kKFwiZGVmc1wiKTtcblxuICAgIGxldCBjb2xvckdyYWRpZW50cyA9IENvbG9yLmNyZWF0ZUdyYWRpZW50cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9yR3JhZGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiTmFtZSA9IFwiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkpO1xuICAgICAgbGV0IGFHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1kYXRhLVwiICsgaSk7XG4gICAgICBhR3JhZGllbnRcbiAgICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICAgIGFHcmFkaWVudFxuICAgICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY29sb3JHcmFkaWVudHNbaV0uc3RhcnQpO1xuICAgICAgYUdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIxMDAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNvbG9yR3JhZGllbnRzW2ldLmVuZCk7XG4gICAgfVxuICAgIGxldCBva0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoODIsIDE5NCwgNTIpOyAvLyAjNTJjMjM0XG4gICAgbGV0IG9rQ29sb3JFbmQgPSBva0NvbG9yU3RhcnQuTXVsKHRoaXMucHVyZWxpZ2h0LCAwLjcpO1xuICAgIGxldCBva0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1va1wiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JTdGFydC5hc0hleCgpKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIG9rQ29sb3JFbmQuYXNIZXgoKSk7XG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jSnVpY3lPcmFuZ2VcbiAgICBsZXQgd2FybmluZ0NvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjU1LCAyMDAsIDU1KTsgLy8gI0ZGQzgzN1xuICAgIGxldCB3YXJuaW5nQ29sb3JFbmQgPSB3YXJuaW5nQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IHdhcm5pbmdHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS13YXJuaW5nXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIHdhcm5pbmdDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCBvcmFuZ2VcbiAgICB3YXJuaW5nR3JhZGllbnQuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCB3YXJuaW5nQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgb3JhbmdlXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jWW91VHViZVxuICAgIGxldCBjcml0aWNhbENvbG9yU3RhcnQgPSBuZXcgQ29sb3IoMjI5LCA0NSwgMzkpOyAvLyBlNTJkMjdcbiAgICBsZXQgY3JpdGljYWxDb2xvckVuZCA9IGNyaXRpY2FsQ29sb3JTdGFydC5NdWwodGhpcy5wdXJlbGlnaHQsIDAuNyk7XG4gICAgbGV0IGNyaXRpY2FsR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWNyaXRpY2FsXCIpO1xuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgY3JpdGljYWxDb2xvclN0YXJ0LmFzSGV4KCkpOyAvLyBsaWdodCByZWRcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGNyaXRpY2FsQ29sb3JFbmQuYXNIZXgoKSk7IC8vIGRhcmsgcmVkXG5cbiAgICAvLyBodHRwczovL3VpZ3JhZGllbnRzLmNvbS8jQXNoXG4gICAgbGV0IHVua25vd25HcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtdW5rbm93blwiKTtcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieTFcIiwgXCIzMCVcIilcbiAgICAgIC5hdHRyKFwieDJcIiwgXCI3MCVcIilcbiAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiM3MzgwOEFcIik7IC8vIGxpZ2h0IGdyZXlcbiAgICB1bmtub3duR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzU3RjlBXCIpOyAvLyBkYXJrIGdyZXlcblxuICAgIGxldCBjdXN0b21TaGFwZSA9IG51bGw7XG4gICAgLy8gdGhpcyBpcyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgZm9udHNpemVcbiAgICBsZXQgc2hhcGVXaWR0aCA9IGRpYW1ldGVyWDtcbiAgICAvLyBzeW1ib2xzIHVzZSB0aGUgYXJlYSBmb3IgdGhlaXIgc2l6ZVxuICAgIGxldCBpbm5lckFyZWEgPSBkaWFtZXRlclggKiBkaWFtZXRlclk7XG4gICAgLy8gdXNlIHRoZSBzbWFsbGVyIG9mIGRpYW1ldGVyWCBvciBZXG4gICAgaWYgKGRpYW1ldGVyWCA8IGRpYW1ldGVyWSkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJYO1xuICAgIH1cbiAgICBpZiAoZGlhbWV0ZXJZIDwgZGlhbWV0ZXJYKSB7XG4gICAgICBpbm5lckFyZWEgPSBkaWFtZXRlclkgKiBkaWFtZXRlclk7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBkMy5zeW1ib2woKS5zaXplKGlubmVyQXJlYSk7XG4gICAgc3dpdGNoICh0aGlzLm9wdC5wb2x5c3RhdC5zaGFwZSkge1xuICAgICAgY2FzZSBcImhleGFnb25fcG9pbnRlZF90b3BcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgc2hhcGVXaWR0aCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhleGFnb25fZmxhdF90b3BcIjpcbiAgICAgICAgLy8gVE9ETzogdXNlIHBvaW50ZWQgZm9yIG5vd1xuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBzaGFwZVdpZHRoID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2lyY2xlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ2lyY2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xDcm9zcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRpYW1vbmRcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xEaWFtb25kKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3F1YXJlXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sU3F1YXJlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RhclwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFN0YXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlhbmdsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFRyaWFuZ2xlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid3llXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sV3llKTtcbiAgICAgICAgYnJlYWs7XG4gICAgIGRlZmF1bHQ6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgZm9udHNpemUgYmFzZWQgb24gdGhlIHNoYXBlIGFuZCB0aGUgdGV4dFxuICAgIGxldCBhY3RpdmVMYWJlbEZvbnRTaXplID0gdGhpcy5vcHQucG9seXN0YXQuZm9udFNpemU7XG4gICAgLy8gZm9udCBzaXplcyBhcmUgaW5kZXBlbmRlbnQgZm9yIGxhYmVsIGFuZCB2YWx1ZXNcbiAgICBsZXQgYWN0aXZlVmFsdWVGb250U2l6ZSA9IHRoaXMub3B0LnBvbHlzdGF0LmZvbnRTaXplO1xuICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5mb250QXV0b1NjYWxlKSB7XG4gICAgICAvLyBmaW5kIHRoZSBtb3N0IHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBvdmVyIGFsbCBpdGVtc1xuICAgICAgbGV0IG1heExhYmVsID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaV0ubmFtZS5sZW5ndGggPiBtYXhMYWJlbC5sZW5ndGgpIHtcbiAgICAgICAgICBtYXhMYWJlbCA9IHRoaXMuZGF0YVtpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBlc3RpbWF0ZSBob3cgYmlnIG9mIGEgZm9udCBjYW4gYmUgdXNlZFxuICAgICAgLy8gaWYgaXQgaXMgdG9vIHNtYWxsLCBoaWRlIGV2ZXJ5dGhpbmdcbiAgICAgIGxldCBlc3RpbWF0ZUxhYmVsRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoKFxuICAgICAgICBtYXhMYWJlbCxcbiAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLCAvLyB1c2Ugc2Fucy1zZXJpZiBmb3Igc2l6aW5nXG4gICAgICAgIHNoYXBlV2lkdGggLSA2MCwgIC8vIHBhZFxuICAgICAgICAxMCxcbiAgICAgICAgdGhpcy5tYXhGb250KTtcbiAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSBlc3RpbWF0ZUxhYmVsRm9udFNpemU7XG5cbiAgICAgIC8vIGdldCB0aGUgc2l6ZSBmb3IgdGhlIHZhbHVlXG4gICAgICAvKlxuICAgICAgZXN0aW1hdGVMYWJlbEZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aChcbiAgICAgICAgbWF4TGFiZWwsXG4gICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc2hhcGVXaWR0aCAtIChlc3RpbWF0ZUxhYmVsRm9udFNpemUgKiAxLjIpLCAvLyBwYWRcbiAgICAgICAgMTAsXG4gICAgICAgIDI1MCk7XG4gICAgICAgIGFjdGl2ZUxhYmVsRm9udFNpemUgPSBlc3RpbWF0ZUxhYmVsRm9udFNpemU7XG4gICAgICAqL1xuICAgIH1cblxuICAgIC8vIGZsYXQgdG9wIGlzIHJvdGF0ZWQgOTAgZGVncmVlcywgYnV0IHRoZSBjb29yZGluYXRlIHN5c3RlbS9sYXlvdXQgbmVlZHMgdG8gYmUgYWRqdXN0ZWRcbiAgICAvLy5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueSArIFwiLFwiICsgZC54ICsgXCIpcm90YXRlKDkwKVwiOyB9KVxuICAgIC8vIHNlZSBodHRwOi8vYmwub2Nrcy5vcmcvamFzb25kYXZpZXMvZjU5MjJlZDRkMGFjMWFjMjE2MWZcblxuICAgIC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjsgfSlcblxuXG4gICAgc3ZnLnNlbGVjdEFsbChcIi5oZXhhZ29uXCIpXG4gICAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSlcbiAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiaGV4YWdvblwiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuICAgICAgICAuYXR0cihcImRcIiwgY3VzdG9tU2hhcGUpXG4gICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIHRoaXMub3B0LnBvbHlzdGF0LnBvbHlnb25Cb3JkZXJDb2xvcilcbiAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlclNpemUgKyBcInB4XCIpXG4gICAgICAgIC5zdHlsZShcImZpbGxcIiwgKF8sIGkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vcHQucG9seXN0YXQuZ3JhZGllbnRFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ1cmwoI1wiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtZGF0YS1cIiArIGkgKyBcIilcIjtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGFbaV0udGhyZXNob2xkTGV2ZWwpIHtcbiAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHJldHVybiBcInVybCgjXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1vaylcIjtcbiAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBcInVybCgjXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS13YXJuaW5nKVwiO1xuICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidXJsKCNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLWNyaXRpY2FsKVwiO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcInVybCgjXCIgKyB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS11bmtub3duKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbaV0uY29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oXCJjbGlja1wiLCAoXywgaSkgPT4ge1xuICAgICAgICAgIGlmIChkYXRhW2ldLnNhbml0aXplVVJMRW5hYmxlZCkge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0uc2FuaXRpemVkVVJMLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoZGF0YVtpXS5zYW5pdGl6ZWRVUkwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXS5jbGlja1Rocm91Z2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShkYXRhW2ldLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgICAgICAgIC8vIHVzZSB0aGUgdmlld3BvcnR3aWR0aCB0byBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb20gZ29pbmcgdG9vIGZhciByaWdodFxuICAgICAgICAgIGxldCB2aWV3UG9ydFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICAgICAgICAvLyB1c2UgdGhlIG1vdXNlIHBvc2l0aW9uIGZvciB0aGUgZW50aXJlIHBhZ2VcbiAgICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZShkMy5zZWxlY3QoXCJib2R5XCIpLm5vZGUoKSk7XG4gICAgICAgICAgdmFyIHhwb3MgPSBtb3VzZVswXSAtIDUwO1xuICAgICAgICAgIC8vIGRvbid0IGFsbG93IG9mZnNjcmVlbiB0b29sdGlwXG4gICAgICAgICAgaWYgKHhwb3MgPCAwKSB7XG4gICAgICAgICAgICB4cG9zID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcHJldmVudCB0b29sdGlwIGZyb20gcmVuZGVyaW5nIG91dHNpZGUgb2Ygdmlld3BvcnRcbiAgICAgICAgICBpZiAoKHhwb3MgKyAyMDApID4gdmlld1BvcnRXaWR0aCkge1xuICAgICAgICAgICAgeHBvcyA9IHZpZXdQb3J0V2lkdGggLSAyMDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5cG9zID0gbW91c2VbMV0gKyA1O1xuICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgeHBvcyArIFwicHhcIilcbiAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCB5cG9zICsgXCJweFwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkLCBpKSA9PiB7XG4gICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5zdHlsZShcIm9wYWNpdHlcIiwgMC45KTtcbiAgICAgICAgICB0b29sdGlwLmh0bWwodGhpcy5vcHQudG9vbHRpcENvbnRlbnRbaV0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRTaXplKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQudG9vbHRpcEZvbnRUeXBlKVxuICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZC54IC0gNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQueSAtIDUpICsgXCJweFwiKTtcbiAgICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICB9KTtcbiAgICAvLyBub3cgbGFiZWxzXG4gICAgdmFyIHRleHRzcG90ID0gc3ZnLnNlbGVjdEFsbChcInRleHQudG9wbGFiZWxcIilcbiAgICAgIC5kYXRhKGFoZXhiaW4odGhpcy5jYWxjdWxhdGVkUG9pbnRzKSk7XG5cbiAgICBsZXQgZHluYW1pY0xhYmVsRm9udFNpemUgPSBhY3RpdmVMYWJlbEZvbnRTaXplO1xuICAgIGxldCBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGFjdGl2ZVZhbHVlRm9udFNpemU7XG5cbiAgICB0ZXh0c3BvdFxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9wbGFiZWxcIilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0pXG4gICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnBvbHlzdGF0LmZvbnRUeXBlKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLnRleHQoZnVuY3Rpb24gKF8sIGkpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAvLyBjaGVjayBpZiBwcm9wZXJ0eSBleGlzdFxuICAgICAgICBpZiAoIShcInNob3dOYW1lXCIgaW4gaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnNob3dOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB2YXIgZnJhbWVzID0gMDtcblxuXG4gICAgdGV4dHNwb3QuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oXywgaSkge1xuICAgICAgICByZXR1cm4gXCJ2YWx1ZUxhYmVsXCIgKyBpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZC54O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZC55ICsgYWN0aXZlTGFiZWxGb250U2l6ZSArIDEwOyAvLyBvZmZzZXQgYnkgZm9udHNpemUgYW5kIDEwcHggdmVydGljYWwgcGFkZGluZ1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgdGhpcy5vcHQucG9seXN0YXQuZm9udFR5cGUpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0xhYmVsRm9udFNpemUgKyBcInB4XCIpXG4gICAgICAudGV4dCggKF8sIGkpID0+IHtcbiAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIC8vIHNlYXJjaCBmb3IgYSB2YWx1ZSBidXQgbm90IG1vcmUgdGhhbiBudW1iZXIgb2YgZGF0YSBpdGVtc1xuICAgICAgICAvLyBuZWVkIHRvIGZpbmQgdGhlIGxvbmdlc3QgY29udGVudCBzdHJpbmcgZ2VuZXJhdGVkIHRvIGRldGVybWluZSB0aGVcbiAgICAgICAgLy8gZHluYW1pYyBmb250IHNpemVcbiAgICAgICAgLy93aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgLy8gIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCAoZnJhbWVzICsgY291bnRlciksIHRoaXMpO1xuICAgICAgICAvLyAgY291bnRlcisrO1xuICAgICAgICAvL31cbiAgICAgICAgLy8gdGhpcyBhbHdheXMgc3RhcnRzIGZyb20gZnJhbWUgMCwgbG9vayB0aHJvdWdoIGV2ZXJ5IG1ldHJpYyBpbmNsdWRpbmcgY29tcG9zaXRlIG1lbWJlcnMgZm9yIHRoZSBsb25nZXN0IHRleHQgcG9zc2libGVcbiAgICAgICAgLy8gZ2V0IHRoZSB0b3RhbCBjb3VudCBvZiBtZXRyaWNzICh3aXRoIGNvbXBvc2l0ZSBtZW1iZXJzKSwgYW5kIGxvb3AgdGhyb3VnaFxuICAgICAgICBsZXQgc3VibWV0cmljQ291bnQgPSB0aGlzLmRhdGFbaV0ubWVtYmVycy5sZW5ndGg7XG4gICAgICAgIGxldCBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50ID0gXCJcIjtcbiAgICAgICAgaWYgKHN1Ym1ldHJpY0NvdW50ID4gMCkge1xuICAgICAgICAgIHdoaWxlIChjb3VudGVyIDwgc3VibWV0cmljQ291bnQpIHtcbiAgICAgICAgICAgIGxldCBjaGVja0NvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChpLCBjb3VudGVyLCB0aGlzKTtcbiAgICAgICAgICAgIGlmIChjaGVja0NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrQ29udGVudC5sZW5ndGggPiBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQgPSBjaGVja0NvbnRlbnQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLWNvbXBvc2l0ZXMgdXNlIHRoZSBmb3JtYXR0ZWQgc2l6ZSBvZiB0aGUgbWV0cmljIHZhbHVlXG4gICAgICAgICAgbG9uZ2VzdERpc3BsYXllZFZhbHVlQ29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIGNvdW50ZXIsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50OiBcIiArIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQpO1xuICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICB3aGlsZSAoKGNvbnRlbnQgPT09IG51bGwpICYmIChjb3VudGVyIDwgZGF0YUxlbikpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgZHluYW1pY1ZhbHVlRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoKFxuICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRWYWx1ZUNvbnRlbnQsXG4gICAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLCAgLy8gdXNlIHNhbnMtc2VyaWYgZm9yIHNpemluZ1xuICAgICAgICAgIHNoYXBlV2lkdGggLSA2MCwgICAvLyBwYWRcbiAgICAgICAgICA2LFxuICAgICAgICAgIHRoaXMubWF4Rm9udCk7XG4gICAgICAgIC8qXG4gICAgICAgIGR5bmFtaWNWYWx1ZUZvbnRTaXplID0gZ2V0VGV4dFNpemVGb3JXaWR0aChcbiAgICAgICAgICBsb25nZXN0RGlzcGxheWVkVmFsdWVDb250ZW50LFxuICAgICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgICBzaGFwZVdpZHRoIC0gKGR5bmFtaWNWYWx1ZUZvbnRTaXplICogMiksIC8vIHBhZCBieSAxIGNoYXJzIGVhY2ggc2lkZVxuICAgICAgICAgIDYsXG4gICAgICAgICAgMjUwXG4gICAgICAgICk7XG4gICAgICAgICovXG4gICAgICAgIC8vIHZhbHVlIHNob3VsZCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgbGFiZWxcbiAgICAgICAgaWYgKGR5bmFtaWNWYWx1ZUZvbnRTaXplID4gZHluYW1pY0xhYmVsRm9udFNpemUpIHtcbiAgICAgICAgICBkeW5hbWljVmFsdWVGb250U2l6ZSA9IGR5bmFtaWNMYWJlbEZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJkeW5hbWljVmFsdWVGb250U2l6ZTogXCIgKyBkeW5hbWljVmFsdWVGb250U2l6ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJkeW5hbWljTGFiZWxGb250U2l6ZTogXCIgKyBkeW5hbWljTGFiZWxGb250U2l6ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJkeW5hbWljVmFsdWVGb250U2l6ZTogXCIgKyBkeW5hbWljVmFsdWVGb250U2l6ZSk7XG4gICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAvLyB1c2UgdGhlIGR5bmFtaWMgc2l6ZSBmb3IgdGhlIHZhbHVlXG4gICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuICAgICAgICBkMy5pbnRlcnZhbCggKCkgPT4ge1xuICAgICAgICAgIHZhciB2YWx1ZVRleHRMb2NhdGlvbiA9IHN2Zy5zZWxlY3QoXCJ0ZXh0LnZhbHVlTGFiZWxcIiArIGkpO1xuICAgICAgICAgIHZhciBjb21wb3NpdGVJbmRleCA9IGk7XG4gICAgICAgICAgdmFsdWVUZXh0TG9jYXRpb24udGV4dCggKCkgPT4ge1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uL2Rpc3BsYXltb2RlIGNhbiBtb2RpZnkgd2hhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY1ZhbHVlRm9udFNpemUgKyBcInB4XCIpO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGggKiAyO1xuICAgICAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGN5Y2xpbmcgdGhyb3VnaCB0d2ljZSB0byBhbGxvdyByb2xsb3ZlclxuICAgICAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChjb21wb3NpdGVJbmRleCwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBhZGQgY3VzdG9tIGNvbnRlbnQgZm9yIGNvbXBvc2l0ZSBvayBzdGF0ZVxuICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBmb250IHNpemUgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIGxhYmVsIGFib3ZlXG4gICAgICAgICAgICAgIC8vdmFsdWVUZXh0TG9jYXRpb24uYXR0cihcImZvbnQtc2l6ZVwiLCBkeW5hbWljVmFsdWVGb250U2l6ZSArIFwicHhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmcmFtZXMrKztcbiAgICAgICAgfSwgdGhpcy5vcHQuYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH0pO1xuICB9XG5cbiAgZm9ybWF0VmFsdWVDb250ZW50KGksIGZyYW1lcywgdGhpc1JlZik6IHN0cmluZyB7XG4gICAgbGV0IGRhdGEgPSB0aGlzUmVmLmRhdGFbaV07XG4gICAgLy8gb3B0aW9ucyBjYW4gc3BlY2lmeSB0byBub3Qgc2hvdyB0aGUgdmFsdWVcbiAgICBpZiAodHlwZW9mKGRhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInNob3dWYWx1ZVwiKSkge1xuICAgICAgICBpZiAoIWRhdGEuc2hvd1ZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlRm9ybWF0dGVkXCIpKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBkYXRhLCByZXR1cm4gbm90aGluZ1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHN3aXRjaCAoZGF0YS5hbmltYXRlTW9kZSkge1xuICAgICAgY2FzZSBcImFsbFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0cmlnZ2VyZWRcIjpcbiAgICAgICAgLy8gcmV0dXJuIG5vdGhpbmcgaWYgbW9kZSBpcyB0cmlnZ2VyZWQgYW5kIHRoZSBzdGF0ZSBpcyAwXG4gICAgICAgIGlmIChkYXRhLnRocmVzaG9sZExldmVsIDwgMSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBjb250ZW50ID0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAvLyBpZiB0aGVyZSdzIG5vIHZhbHVlRm9ybWF0dGVkLCB0aGVyZSdzIG5vdGhpbmcgdG8gZGlzcGxheVxuICAgIGlmICghY29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoZGF0YS5wcmVmaXgpICYmIChkYXRhLnByZWZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgY29udGVudCA9IGRhdGEucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgIH1cbiAgICBpZiAoKGRhdGEuc3VmZml4KSAmJiAoZGF0YS5zdWZmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBkYXRhLnN1ZmZpeDtcbiAgICB9XG4gICAgLy8gYSBjb21wb3NpdGUgd2lsbCBjb250YWluIHRoZSBcIndvcnN0XCIgY2FzZSBhcyB0aGUgdmFsdWVGb3JtYXR0ZWQsXG4gICAgLy8gYW5kIHdpbGwgaGF2ZSBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgdGhlIGNvbXBvc2l0ZSBpbmNsdWRlZC5cbiAgICAvLyBhcyBmcmFtZXMgaW5jcmVtZW50IGZpbmQgYSB0cmlnZ2VyZWQgbWVtYmVyIHN0YXJ0aW5nIGZyb20gdGhlIGZyYW1lIG1vZCBsZW5cbiAgICBsZXQgbGVuID0gZGF0YS5tZW1iZXJzLmxlbmd0aDtcbiAgICBpZiAobGVuID4gMCkge1xuICAgICAgbGV0IHRyaWdnZXJlZEluZGV4ID0gLTE7XG4gICAgICBpZiAoZGF0YS5hbmltYXRlTW9kZSA9PT0gXCJhbGxcIikge1xuICAgICAgICB0cmlnZ2VyZWRJbmRleCA9IGZyYW1lcyAlIGxlbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRyaWdnZXJlZEluZGV4IGZyb20gYWxsIG1vZGU6IFwiICsgdHJpZ2dlcmVkSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhLnRyaWdnZXJDYWNoZSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBkYXRhLnRyaWdnZXJDYWNoZSA9IHRoaXMuYnVpbGRUcmlnZ2VyQ2FjaGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHogPSBmcmFtZXMgJSBkYXRhLnRyaWdnZXJDYWNoZS5sZW5ndGg7XG4gICAgICAgIHRyaWdnZXJlZEluZGV4ID0gZGF0YS50cmlnZ2VyQ2FjaGVbel0uaW5kZXg7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0cmlnZ2VyZWRJbmRleCBmcm9tIGNhY2hlIGlzOiBcIiArIHRyaWdnZXJlZEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGxldCBhTWVtYmVyID0gZGF0YS5tZW1iZXJzW3RyaWdnZXJlZEluZGV4XTtcblxuICAgICAgY29udGVudCA9IGFNZW1iZXIubmFtZSArIFwiOiBcIiArIGFNZW1iZXIudmFsdWVGb3JtYXR0ZWQ7XG4gICAgICBpZiAoKGFNZW1iZXIucHJlZml4KSAmJiAoYU1lbWJlci5wcmVmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29udGVudCA9IGFNZW1iZXIucHJlZml4ICsgXCIgXCIgKyBjb250ZW50O1xuICAgICAgfVxuICAgICAgaWYgKChhTWVtYmVyLnN1ZmZpeCkgJiYgKGFNZW1iZXIuc3VmZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCIgXCIgKyBhTWVtYmVyLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYWxsb3cgdGVtcGxhdGluZ1xuICAgIC8vXG4gICAgaWYgKChjb250ZW50KSAmJiAoY29udGVudC5sZW5ndGggPiAwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlcGxhY2VkQ29udGVudCA9IHRoaXNSZWYudGVtcGxhdGVTcnYucmVwbGFjZVdpdGhUZXh0KGNvbnRlbnQpO1xuICAgICAgICBjb250ZW50ID0gcmVwbGFjZWRDb250ZW50O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IHRlbXBsYXRlIHNlcnZlciB0aHJldyBlcnJvcjogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGJ1aWxkVHJpZ2dlckNhY2hlKGl0ZW0pIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiQnVpbGRpbmcgdHJpZ2dlciBjYWNoZSBmb3IgaXRlbVwiKTtcbiAgICBsZXQgdHJpZ2dlckNhY2hlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLm1lbWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBhTWVtYmVyID0gaXRlbS5tZW1iZXJzW2ldO1xuICAgICAgaWYgKGFNZW1iZXIudGhyZXNob2xkTGV2ZWwgPiAwKSB7XG4gICAgICAgIC8vIGFkZCB0byBsaXN0XG4gICAgICAgIGxldCBjYWNoZWRNZW1iZXJTdGF0ZSA9IHsgaW5kZXg6IGksIG5hbWU6IGFNZW1iZXIubmFtZSwgdmFsdWU6IGFNZW1iZXIudmFsdWUsIHRocmVzaG9sZExldmVsOiBhTWVtYmVyLnRocmVzaG9sZExldmVsIH07XG4gICAgICAgIHRyaWdnZXJDYWNoZS5wdXNoKGNhY2hlZE1lbWJlclN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc29ydCBpdFxuICAgIHRyaWdnZXJDYWNoZSA9IF8ub3JkZXJCeSh0cmlnZ2VyQ2FjaGUsIFtcInRocmVzaG9sZExldmVsXCIsIFwidmFsdWVcIiwgXCJuYW1lXCJdLCBbXCJkZXNjXCIsIFwiZGVzY1wiLCBcImFzY1wiXSk7XG4gICAgcmV0dXJuIHRyaWdnZXJDYWNoZTtcbiAgfVxuXG4gIGdldEF1dG9IZXhSYWRpdXMoKTogbnVtYmVyIHtcbiAgICAvL1RoZSBtYXhpbXVtIHJhZGl1cyB0aGUgaGV4YWdvbnMgY2FuIGhhdmUgdG8gc3RpbGwgZml0IHRoZSBzY3JlZW5cbiAgICB2YXIgaGV4UmFkaXVzID0gZDMubWluKFxuICAgICAgW1xuICAgICAgICB0aGlzLm9wdC53aWR0aCAvICgodGhpcy5udW1Db2x1bW5zICsgMC41KSAqIE1hdGguc3FydCgzKSksXG4gICAgICAgIHRoaXMub3B0LmhlaWdodCAvICgodGhpcy5udW1Sb3dzICsgMSAvIDMpICogMS41KVxuICAgICAgXVxuICAgICk7XG4gICAgcmV0dXJuIGhleFJhZGl1cztcbiAgfVxuXG4gIGNhbGN1bGF0ZVNWR1NpemUoKSB7XG4gICAgLy9UaGUgaGVpZ2h0IG9mIHRoZSB0b3RhbCBkaXNwbGF5IHdpbGwgYmVcbiAgICAvL3RoaXMuYXV0b0hlaWdodCA9IHRoaXMubnVtUm93cyAqIDMgLyAyICogdGhpcy5oZXhSYWRpdXMgKyAxIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgICAgLy93aGljaCBpcyB0aGUgc2FtZSBhc1xuICAgIHRoaXMuYXV0b0hlaWdodCA9ICh0aGlzLm51bVJvd3MgKyAxIC8gMykgKiAzIC8gMiAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIHRoaXMuYXV0b0hlaWdodCAtPSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XG4gICAgLy9jb25zb2xlLmxvZyhcImF1dG9oZWlnaHQgPSBcIiArIHRoaXMuYXV0b0hlaWdodCk7XG4gICAgLy9UaGUgd2lkdGggb2YgdGhlIHRvdGFsIGRpc3BsYXkgd2lsbCBiZVxuICAgIC8vdGhpcy5hdXRvV2lkdGggPSB0aGlzLm51bUNvbHVtbnMgKiBNYXRoLnNxcnQoMykgKiB0aGlzLmhleFJhZGl1cyArIE1hdGguc3FydCgzKSAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICAvL3doaWNoIGlzIHRoZSBzYW1lIGFzXG4gICAgdGhpcy5hdXRvV2lkdGggPSAodGhpcy5udW1Db2x1bW5zICsgMSAvIDIpICogTWF0aC5zcXJ0KDMpICogdGhpcy5oZXhSYWRpdXM7XG4gICAgdGhpcy5hdXRvV2lkdGggLT0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIGNvbnNvbGUubG9nKFwiYXV0b3dpZHRoID0gXCIgKyB0aGlzLmF1dG9XaWR0aCArIFwiIGF1dG9oZWlnaHQgPSBcIiArIHRoaXMuYXV0b0hlaWdodCk7XG4gIH1cblxuICAvLyBCdWlsZHMgdGhlIHBsYWNlaG9sZGVyIHBvbHlnb25zIG5lZWRlZCB0byByZXByZXNlbnQgZWFjaCBtZXRyaWNcbiAgZ2VuZXJhdGVQb2ludHMoKSA6IGFueSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIGlmICh0eXBlb2YodGhpcy5kYXRhKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgbGV0IG1heFJvd3NVc2VkID0gMDtcbiAgICBsZXQgY29sdW1uc1VzZWQgPSAwO1xuICAgIGxldCBtYXhDb2x1bW5zVXNlZCA9IDA7XG4gICAgLy8gd2hlbiBkdXBsaWNhdGluZyBwYW5lbHMsIHRoaXMgZ2V0cyBvZGRcbiAgICBpZiAodGhpcy5udW1Sb3dzID09PSBJbmZpbml0eSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm51bVJvd3MgaW5maW5pdHkuLi5cIik7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5udW1Db2x1bW5zID09PSBOYU4pIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJudW1Db2x1bW5zIE5hTlwiKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1Sb3dzOyBpKyspIHtcbiAgICAgIGlmICgocG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICBtYXhSb3dzVXNlZCArPSAxO1xuICAgICAgICBjb2x1bW5zVXNlZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5udW1Db2x1bW5zOyBqKyspIHtcbiAgICAgICAgICBpZiAoKHBvaW50cy5sZW5ndGggPCB0aGlzLm9wdC5kaXNwbGF5TGltaXQpICYmIChwb2ludHMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGNvbHVtbnNVc2VkICs9IDE7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgbW9zdCBudW1iZXIgb2YgY29sdW1uc1xuICAgICAgICAgICAgaWYgKGNvbHVtbnNVc2VkID4gbWF4Q29sdW1uc1VzZWQpIHtcbiAgICAgICAgICAgICAgbWF4Q29sdW1uc1VzZWQgPSBjb2x1bW5zVXNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt0aGlzLmhleFJhZGl1cyAqIGogKiAxLjc1LCB0aGlzLmhleFJhZGl1cyAqIGkgKiAxLjVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcIk1heCByb3dzIHVzZWQ6XCIgKyBtYXhSb3dzVXNlZCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIkFjdHVhbCBjb2x1bW5zIHVzZWQ6XCIgKyBtYXhDb2x1bW5zVXNlZCk7XG4gICAgdGhpcy5tYXhSb3dzVXNlZCA9IG1heFJvd3NVc2VkO1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSBtYXhDb2x1bW5zVXNlZDtcbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbn1cbiJdfQ==