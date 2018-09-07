System.register(["./external/d3.min.js", "./external/d3-hexbin.js", "./utils", "lodash"], function (exports_1, context_1) {
    "use strict";
    var d3, d3hexbin, utils_1, lodash_1, D3Wrapper;
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
            }
        ],
        execute: function () {
            D3Wrapper = (function () {
                function D3Wrapper(templateSrv, svgContainer, d3DivId, opt) {
                    this.templateSrv = templateSrv;
                    this.svgContainer = svgContainer;
                    this.d3DivId = d3DivId;
                    this.data = opt.data;
                    this.opt = opt;
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
                        .attr("stop-color", "#52c234");
                    okGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#389232");
                    var warningGradient = defs.append("linearGradient")
                        .attr("id", this.d3DivId + "linear-gradient-state-warning");
                    warningGradient.attr("x1", "30%")
                        .attr("y1", "30%")
                        .attr("x2", "70%")
                        .attr("y2", "70%");
                    warningGradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#FFC837");
                    warningGradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#FF8808");
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
                        .attr("stop-color", "#e52d27");
                    criticalGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#b31217");
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
                    var activeFontSize = this.opt.polystat.fontSize;
                    if (this.opt.polystat.fontAutoScale) {
                        var maxLabel = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].name.length > maxLabel.length) {
                                maxLabel = this.data[i].name;
                            }
                        }
                        var estimateFontSize = utils_1.getTextSizeForWidth(maxLabel, "?px sans-serif", shapeWidth, 10, 250);
                        estimateFontSize = utils_1.getTextSizeForWidth(maxLabel, "?px sans-serif", shapeWidth - (estimateFontSize * 1.2), 10, 250);
                        activeFontSize = estimateFontSize;
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
                            switch (data[i].thresholdLevel) {
                                case 0:
                                    return "url(#" + _this.d3DivId + "linear-gradient-state-ok)";
                                case 1:
                                    return "url(#" + _this.d3DivId + "linear-gradient-state-warning)";
                                case 2:
                                    return "url(#" + _this.d3DivId + "linear-gradient-state-critical)";
                                default:
                                    return "url(#" + _this.d3DivId + "linear-gradient-state-unknown)";
                            }
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
                    textspot
                        .enter()
                        .append("text")
                        .attr("class", "toplabel")
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y; })
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", activeFontSize + "px")
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
                    var dynamicFontSize = activeFontSize;
                    textspot.enter()
                        .append("text")
                        .attr("class", function (_, i) {
                        return "valueLabel" + i;
                    })
                        .attr("x", function (d) {
                        return d.x;
                    })
                        .attr("y", function (d) {
                        return d.y + activeFontSize + 10;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("fill", "black")
                        .attr("font-size", dynamicFontSize + "px")
                        .text(function (_, i) {
                        var counter = 0;
                        var dataLen = _this.data.length;
                        var submetricCount = _this.data[i].members.length;
                        var longestDisplayedContent = "";
                        if (submetricCount > 0) {
                            while (counter < submetricCount) {
                                var checkContent = _this.formatValueContent(i, counter, _this);
                                if (checkContent) {
                                    if (checkContent.length > longestDisplayedContent.length) {
                                        longestDisplayedContent = checkContent;
                                    }
                                }
                                counter++;
                            }
                        }
                        else {
                            longestDisplayedContent = _this.formatValueContent(i, counter, _this);
                        }
                        var content = null;
                        counter = 0;
                        while ((content === null) && (counter < dataLen)) {
                            content = _this.formatValueContent(i, (frames + counter), _this);
                            counter++;
                        }
                        dynamicFontSize = utils_1.getTextSizeForWidth(longestDisplayedContent, "?px sans-serif", shapeWidth, 6, 250);
                        dynamicFontSize = utils_1.getTextSizeForWidth(longestDisplayedContent, "?px sans-serif", shapeWidth - (dynamicFontSize * 3), 6, 250);
                        var valueTextLocation = svg.select("text.valueLabel" + i);
                        valueTextLocation.attr("font-size", dynamicFontSize + "px");
                        d3.interval(function () {
                            var valueTextLocation = svg.select("text.valueLabel" + i);
                            var compositeIndex = i;
                            valueTextLocation.text(function () {
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
                                    valueTextLocation.attr("font-size", activeFontSize + "px");
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
                        console.log("numRows infinity...");
                        return points;
                    }
                    if (this.numColumns === NaN) {
                        console.log("numColumns NaN");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN3cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Qzd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9BO2dCQXNCRSxtQkFBWSxXQUFnQixFQUFFLFlBQWlCLEVBQUUsT0FBTyxFQUFFLEdBQUc7b0JBQzNELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztvQkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFFckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBRWYsSUFBSSxDQUFDLE1BQU0sR0FBRzt3QkFDWixHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ1osS0FBSyxFQUFFLENBQUM7d0JBQ1IsTUFBTSxFQUFFLEVBQUU7d0JBQ1YsSUFBSSxFQUFFLEVBQUU7cUJBQ1QsQ0FBQztvQkFFRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsY0FBYyxFQUFFO3FCQUUxQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO3FCQUM5QjtvQkFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO3FCQUNqQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3dCQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3FCQUM5QztvQkFDRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDbEQsQ0FBQztnQkFFQywwQkFBTSxHQUFOLFVBQU8sSUFBUztvQkFFZCxJQUFJLElBQUksRUFBRTt3QkFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztxQkFLbEI7Z0JBQ0gsQ0FBQztnQkFFRCx3QkFBSSxHQUFKO29CQUFBLGlCQWdjQztvQkEvYkMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTt3QkFFbkQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUcxQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFOzRCQUVwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7NEJBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7NEJBRTdDLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0NBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDOzZCQUNyQjs0QkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0NBQ2xELElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDOzZCQUN0Qjs0QkFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQzs0QkFDdEUsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7NkJBQ2xCOzRCQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDO3lCQUN0RTs2QkFBTTs0QkFDTCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7NEJBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7NEJBQzFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUU7Z0NBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOzZCQUNsQjs0QkFF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LENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0NBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0NBQ2pGLFdBQVcsSUFBSSxDQUFDLENBQUM7b0NBRWpCLElBQUksV0FBVyxHQUFHLGNBQWMsRUFBRTt3Q0FDaEMsY0FBYyxHQUFHLFdBQVcsQ0FBQztxQ0FDOUI7b0NBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lDQUNwRTs2QkFDRjt5QkFDRjtxQkFDRjtvQkFHRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7b0JBQ3JDLE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDO2dCQUVILGdCQUFDO1lBQUQsQ0FBQyxBQXpxQkQsSUF5cUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL2QzLWhleGJpbi9pbmRleC5kLnRzXCIgLz5cbi8vLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9kMy9pbmRleC5kLnRzXCIgLz5cbmltcG9ydCAqIGFzIGQzIGZyb20gXCIuL2V4dGVybmFsL2QzLm1pbi5qc1wiO1xuaW1wb3J0ICogYXMgZDNoZXhiaW4gZnJvbSBcIi4vZXh0ZXJuYWwvZDMtaGV4YmluLmpzXCI7XG5pbXBvcnQgeyBnZXRUZXh0U2l6ZUZvcldpZHRoIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuZXhwb3J0IGNsYXNzIEQzV3JhcHBlciB7XG4gIHN2Z0NvbnRhaW5lcjogYW55O1xuICBkM0RpdklkOiBhbnk7XG4gIG1heENvbHVtbnNVc2VkOiBudW1iZXI7XG4gIG1heFJvd3NVc2VkOiBudW1iZXI7XG4gIG9wdDogYW55O1xuICBkYXRhOiBhbnk7XG4gIHRlbXBsYXRlU3J2OiBhbnk7XG4gIGNhbGN1bGF0ZWRQb2ludHM6IGFueTtcbiAgaGV4UmFkaXVzOiBudW1iZXI7XG4gIGF1dG9IZXhSYWRpdXMgOiBudW1iZXI7XG4gIGF1dG9XaWR0aCA6IG51bWJlcjtcbiAgYXV0b0hlaWdodDogbnVtYmVyO1xuICBudW1Db2x1bW5zOiBudW1iZXI7XG4gIG51bVJvd3M6IG51bWJlcjtcbiAgbWFyZ2luOiB7XG4gICAgdG9wOiBudW1iZXIsXG4gICAgcmlnaHQgOiBudW1iZXIsXG4gICAgYm90dG9tIDogbnVtYmVyLFxuICAgIGxlZnQgOiBudW1iZXIsXG4gIH07XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVTcnY6IGFueSwgc3ZnQ29udGFpbmVyOiBhbnksIGQzRGl2SWQsIG9wdCkge1xuICAgIHRoaXMudGVtcGxhdGVTcnYgPSB0ZW1wbGF0ZVNydjtcbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IHN2Z0NvbnRhaW5lcjtcbiAgICB0aGlzLmQzRGl2SWQgPSBkM0RpdklkO1xuICAgIHRoaXMuZGF0YSA9IG9wdC5kYXRhO1xuICAgIC8vdGhpcy5oZXhSYWRpdXMgPSBvcHQuaGV4UmFkaXVzO1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIC8vIHRpdGxlIGlzIDI2cHhcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogMzAgKyAyNixcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgYm90dG9tOiAyMCxcbiAgICAgIGxlZnQ6IDUwXG4gICAgfTtcbiAgICAvLyB0YWtlIDEwIG9mZiB0aGUgaGVpZ2h0XG4gICAgdGhpcy5vcHQuaGVpZ2h0IC09IDEwO1xuICAgIHRoaXMub3B0LndpZHRoIC09IDIwO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0LmRhdGE7XG4gICAgdGhpcy5udW1Db2x1bW5zID0gNTtcbiAgICB0aGlzLm51bVJvd3MgPSA1O1xuICAgIHRoaXMubWF4Q29sdW1uc1VzZWQgPSAwO1xuICAgIHRoaXMubWF4Um93c1VzZWQgPSAwO1xuICAgIGlmIChvcHQucm93QXV0b1NpemUgJiYgb3B0LmNvbHVtbkF1dG9TaXplKSB7XG4gICAgICAvLyBzcXJ0IG9mICMgZGF0YSBpdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm51bUNvbHVtbnMgPSBvcHQuY29sdW1ucyB8fCA2O1xuICAgICAgdGhpcy5udW1Sb3dzID0gb3B0LnJvd3MgfHwgNjtcbiAgICB9XG4gICAgaWYgKCghb3B0LnJhZGl1c0F1dG9TaXplKSAmJiAob3B0LnJhZGl1cykpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gb3B0LnJhZGl1cztcbiAgICAgIHRoaXMuYXV0b0hleFJhZGl1cyA9IG9wdC5yYWRpdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vIHx8IDUwO1xuICAgICAgdGhpcy5hdXRvSGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7IC8vfHwgNTA7XG4gICAgfVxuICAgIHRoaXMuY2FsY3VsYXRlU1ZHU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlZFBvaW50cyA9IHRoaXMuZ2VuZXJhdGVQb2ludHMoKTtcbn1cblxuICB1cGRhdGUoZGF0YTogYW55KSB7XG4gICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZVwiKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJoYXZlIGRhdGFcIiArIGRhdGEpO1xuICAgICAgLy92YXIgcmFuZG9tWCA9IGQzLnJhbmRvbU5vcm1hbCh0aGlzLm9wdC53aWR0aCAvIDIsIDgwKTtcbiAgICAgIC8vdmFyIHJhbmRvbVkgPSBkMy5yYW5kb21Ob3JtYWwodGhpcy5vcHQuaGVpZ2h0IC8gMiwgODApO1xuICAgICAgLy90aGlzLmNhbGN1bGF0ZWRQb2ludHMgPSBkMy5yYW5nZSgyMDAwKS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBbcmFuZG9tWCgpLCByYW5kb21ZKCldOyB9KTtcbiAgICB9XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLm9wdC5yb3dBdXRvU2l6ZSAmJiB0aGlzLm9wdC5jb2x1bW5BdXRvU2l6ZSkge1xuICAgICAgLy8gc3FydCBvZiAjIGRhdGEgaXRlbXNcbiAgICAgIGxldCBzcXVhcmVkID0gTWF0aC5zcXJ0KHRoaXMuZGF0YS5sZW5ndGgpO1xuICAgICAgLy8gZmF2b3IgY29sdW1ucyB3aGVuIHdpZHRoIGlzIGdyZWF0ZXIgdGhhbiBoZWlnaHRcbiAgICAgIC8vIGZhdm9yIHJvd3Mgd2hlbiB3aWR0aCBpcyBsZXNzIHRoYW4gaGVpZ2h0XG4gICAgICBpZiAodGhpcy5vcHQud2lkdGggPiB0aGlzLm9wdC5oZWlnaHQpIHtcbiAgICAgICAgLy8gcmF0aW8gb2Ygd2lkdGggdG8gaGVpZ2h0XG4gICAgICAgIGxldCByYXRpbyA9IHRoaXMub3B0LndpZHRoIC8gdGhpcy5vcHQuaGVpZ2h0ICogLjY2O1xuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwoc3F1YXJlZCAqIHJhdGlvKTtcbiAgICAgICAgLy8gYWx3YXlzIGF0IGxlYXN0IDEgY29sdW1uXG4gICAgICAgIGlmICh0aGlzLm51bUNvbHVtbnMgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Db2x1bW5zID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBwcmVmZXIgZXZlbnMgYW5kIHNtYWxsZXJcbiAgICAgICAgaWYgKCh0aGlzLm51bUNvbHVtbnMgJSAyKSAmJiAodGhpcy5udW1Db2x1bW5zID4gMikpIHtcbiAgICAgICAgICB0aGlzLm51bUNvbHVtbnMgLT0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmZsb29yKHRoaXMuZGF0YS5sZW5ndGggLyB0aGlzLm51bUNvbHVtbnMgKiByYXRpbyk7XG4gICAgICAgIGlmICh0aGlzLm51bVJvd3MgPCAxKSB7XG4gICAgICAgICAgdGhpcy5udW1Sb3dzID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtUm93cyAqIHJhdGlvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByYXRpbyA9IHRoaXMub3B0LmhlaWdodCAvIHRoaXMub3B0LndpZHRoICogLjY2O1xuICAgICAgICB0aGlzLm51bVJvd3MgPSBNYXRoLmNlaWwoc3F1YXJlZCAqIHJhdGlvKTtcbiAgICAgICAgaWYgKHRoaXMubnVtUm93cyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByZWZlciBldmVucyBhbmQgc21hbGxlclxuICAgICAgICBpZiAoKHRoaXMubnVtUm93cyAlIDIpICYmICh0aGlzLm51bVJvd3MgPiAyKSkge1xuICAgICAgICAgIHRoaXMubnVtUm93cyAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubnVtQ29sdW1ucyA9IE1hdGguZmxvb3IodGhpcy5kYXRhLmxlbmd0aCAvIHRoaXMubnVtUm93cyAqIHJhdGlvKTtcbiAgICAgICAgaWYgKHRoaXMubnVtQ29sdW1ucyA8IDEpIHtcbiAgICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLm51bUNvbHVtbnMgPSAxO1xuICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgfVxuICAgICAgLy8gcHJlZmVyIG1vcmUgY29sdW1uc1xuICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT09IHRoaXMubnVtQ29sdW1ucykge1xuICAgICAgICB0aGlzLm51bVJvd3MgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiQ2FsY3VsYXRlZCBjb2x1bW5zID0gXCIgKyB0aGlzLm51bUNvbHVtbnMpO1xuICAgIC8vY29uc29sZS5sb2coXCJDYWxjdWxhdGVkIHJvd3MgPSBcIiArIHRoaXMubnVtUm93cyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk51bWJlciBvZiBkYXRhIGl0ZW1zIHRvIHJlbmRlciA9IFwiICsgdGhpcy5kYXRhLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5vcHQucmFkaXVzQXV0b1NpemUpIHtcbiAgICAgIHRoaXMuaGV4UmFkaXVzID0gdGhpcy5nZXRBdXRvSGV4UmFkaXVzKCk7XG4gICAgICB0aGlzLmF1dG9IZXhSYWRpdXMgPSB0aGlzLmdldEF1dG9IZXhSYWRpdXMoKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVTVkdTaXplKCk7XG4gICAgdGhpcy5jYWxjdWxhdGVkUG9pbnRzID0gdGhpcy5nZW5lcmF0ZVBvaW50cygpO1xuXG4gICAgdmFyIHdpZHRoID0gdGhpcy5vcHQud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMub3B0LmhlaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3JhZDpcIiArIHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgdmFyIGFoZXhiaW4gPSBkM2hleGJpblxuICAgICAgLmhleGJpbigpXG4gICAgICAucmFkaXVzKHRoaXMuYXV0b0hleFJhZGl1cylcbiAgICAgIC5leHRlbnQoW1swLCAwXSwgW3dpZHRoLCBoZWlnaHRdXSk7XG5cbiAgICAvLyBkMyBjYWxjdWxhdGVzIHRoZSByYWRpdXMgZm9yIHggYW5kIHkgc2VwYXJhdGVseSBiYXNlZCBvbiB0aGUgdmFsdWUgcGFzc2VkIGluXG4gICAgdmFyIHRoaXJkUGkgPSBNYXRoLlBJIC8gMztcbiAgICBsZXQgZGlhbWV0ZXJYID0gdGhpcy5hdXRvSGV4UmFkaXVzICogMiAqIE1hdGguc2luKHRoaXJkUGkpO1xuICAgIGxldCBkaWFtZXRlclkgPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAxLjU7XG4gICAgbGV0IHJhZGl1c1ggPSBkaWFtZXRlclggLyAyO1xuICAgIGxldCByZW5kZXJXaWR0aCA9IHRoaXMubWF4Q29sdW1uc1VzZWQgKiBkaWFtZXRlclg7XG4gICAgLy8gcmVuZGVySGVpZ2h0IGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlICNyb3dzIHVzZWQsIGFuZFxuICAgIC8vIHRoZSBcInNwYWNlXCIgdGFrZW4gYnkgdGhlIGhleGFnb25zIGludGVybGVhdmVkXG4gICAgLy8gc3BhY2UgdGFrZW4gaXMgMi8zIG9mIGRpYW1ldGVyWSAqICMgcm93c1xuICAgIGxldCByZW5kZXJIZWlnaHQgPSAodGhpcy5tYXhSb3dzVXNlZCAqIGRpYW1ldGVyWSkgKyAoZGlhbWV0ZXJZICogLjMzKTtcbiAgICAvLyBkaWZmZXJlbmNlIG9mIHdpZHRoIGFuZCByZW5kZXJ3aWR0aCBpcyBvdXIgcGxheSByb29tLCBzcGxpdCB0aGF0IGluIGhhbGZcbiAgICAvLyBvZmZzZXQgaXMgZnJvbSBjZW50ZXIgb2YgaGV4YWdvbiwgbm90IGZyb20gdGhlIGVkZ2VcbiAgICBsZXQgeG9mZnNldCA9ICh3aWR0aCAtIHJlbmRlcldpZHRoICsgcmFkaXVzWCkgLyAyO1xuICAgIC8vIGlmIHRoZXJlIGlzIGp1c3Qgb25lIGNvbHVtbiBhbmQgb25lIHJvdywgY2VudGVyIGl0XG4gICAgaWYgKHRoaXMubnVtUm93cyA9PT0gMSkge1xuICAgICAgcmVuZGVySGVpZ2h0ID0gZGlhbWV0ZXJZICsgKGRpYW1ldGVyWSAqIC4zMyk7XG4gICAgICB4b2Zmc2V0ID0gKCh3aWR0aCAtIHJlbmRlcldpZHRoKSAvIDIpICsgcmFkaXVzWDtcbiAgICB9XG4gICAgLy8geSBkaWFtZXRlciBvZiBoZXhhZ29uIGlzIGxhcmdlciB0aGFuIHggZGlhbWV0ZXJcbiAgICBsZXQgeW9mZnNldCA9ICgoaGVpZ2h0IC0gcmVuZGVySGVpZ2h0KSAvIDIpICsgKGRpYW1ldGVyWSAqIC42Nik7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGRpdiBmb3IgdGhlIHRvb2x0aXBcbiAgICAvLyBhZGQgaXQgdG8gdGhlIGJvZHkgYW5kIG5vdCB0aGUgY29udGFpbmVyIHNvIGl0IGNhbiBmbG9hdCBvdXRzaWRlIG9mIHRoZSBwYW5lbFxuICAgIHZhciB0b29sdGlwID0gZDNcbiAgICAgIC5zZWxlY3QoXCJib2R5XCIpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwiLXRvb2x0aXBcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2x5c3RhdC1wYW5lbC10b29sdGlwXCIpXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgIHZhciBzdmcgOiBhbnkgPSBkMy5zZWxlY3QodGhpcy5zdmdDb250YWluZXIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKVxuICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIFwicHhcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIilcbiAgICAgIC5zdHlsZShcImJvcmRlclwiLCBcIjBweCBzb2xpZCB3aGl0ZVwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4b2Zmc2V0ICsgXCIsXCIgKyB5b2Zmc2V0ICsgXCIpXCIpO1xuXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgdmFyIGRlZnMgPSBzdmcuYXBwZW5kKFwiZGVmc1wiKTtcblxuICAgIC8vIGh0dHBzOi8vdWlncmFkaWVudHMuY29tLyNMaXR0bGVMZWFmIChzaW1pbGFyKVxuICAgIGxldCBva0dyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxuICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS1va1wiKTtcbiAgICBva0dyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIG9rR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzUyYzIzNFwiKTsgLy8gbGlnaHQgZ3JlZW5cbiAgICBva0dyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzM4OTIzMlwiKTsgLy8gZGFyayBncmVlblxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0p1aWN5T3JhbmdlXG4gICAgbGV0IHdhcm5pbmdHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCB0aGlzLmQzRGl2SWQgKyBcImxpbmVhci1ncmFkaWVudC1zdGF0ZS13YXJuaW5nXCIpO1xuICAgIHdhcm5pbmdHcmFkaWVudC5hdHRyKFwieDFcIiwgXCIzMCVcIilcbiAgICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAgIC5hdHRyKFwieTJcIiwgXCI3MCVcIik7XG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiI0ZGQzgzN1wiKTsgLy8gbGlnaHQgb3JhbmdlXG4gICAgd2FybmluZ0dyYWRpZW50LmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjRkY4ODA4XCIpOyAvLyBkYXJrIG9yYW5nZVxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI1lvdVR1YmVcbiAgICBsZXQgY3JpdGljYWxHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcbiAgICAgIC5hdHRyKFwiaWRcIiwgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtY3JpdGljYWxcIik7XG4gICAgY3JpdGljYWxHcmFkaWVudFxuICAgICAgLmF0dHIoXCJ4MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ5MVwiLCBcIjMwJVwiKVxuICAgICAgLmF0dHIoXCJ4MlwiLCBcIjcwJVwiKVxuICAgICAgLmF0dHIoXCJ5MlwiLCBcIjcwJVwiKTtcbiAgICBjcml0aWNhbEdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjAlXCIpXG4gICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBcIiNlNTJkMjdcIik7IC8vIGxpZ2h0IHJlZFxuICAgIGNyaXRpY2FsR3JhZGllbnRcbiAgICAgIC5hcHBlbmQoXCJzdG9wXCIpXG4gICAgICAgIC5hdHRyKFwib2Zmc2V0XCIsIFwiMTAwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjYjMxMjE3XCIpOyAvLyBkYXJrIHJlZFxuXG4gICAgLy8gaHR0cHM6Ly91aWdyYWRpZW50cy5jb20vI0FzaFxuICAgIGxldCB1bmtub3duR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXG4gICAgICAuYXR0cihcImlkXCIsIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXVua25vd25cIik7XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXR0cihcIngxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcInkxXCIsIFwiMzAlXCIpXG4gICAgICAuYXR0cihcIngyXCIsIFwiNzAlXCIpXG4gICAgICAuYXR0cihcInkyXCIsIFwiNzAlXCIpO1xuICAgIHVua25vd25HcmFkaWVudFxuICAgICAgLmFwcGVuZChcInN0b3BcIilcbiAgICAgICAgLmF0dHIoXCJvZmZzZXRcIiwgXCIwJVwiKVxuICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgXCIjNzM4MDhBXCIpOyAvLyBsaWdodCBncmV5XG4gICAgdW5rbm93bkdyYWRpZW50XG4gICAgICAuYXBwZW5kKFwic3RvcFwiKVxuICAgICAgICAuYXR0cihcIm9mZnNldFwiLCBcIjEwMCVcIilcbiAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIFwiIzc1N0Y5QVwiKTsgLy8gZGFyayBncmV5XG5cbiAgICBsZXQgY3VzdG9tU2hhcGUgPSBudWxsO1xuICAgIC8vIHRoaXMgaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGZvbnRzaXplXG4gICAgbGV0IHNoYXBlV2lkdGggPSBkaWFtZXRlclg7XG4gICAgLy8gc3ltYm9scyB1c2UgdGhlIGFyZWEgZm9yIHRoZWlyIHNpemVcbiAgICBsZXQgaW5uZXJBcmVhID0gZGlhbWV0ZXJYICogZGlhbWV0ZXJZO1xuICAgIC8vIHVzZSB0aGUgc21hbGxlciBvZiBkaWFtZXRlclggb3IgWVxuICAgIGlmIChkaWFtZXRlclggPCBkaWFtZXRlclkpIHtcbiAgICAgIGlubmVyQXJlYSA9IGRpYW1ldGVyWCAqIGRpYW1ldGVyWDtcbiAgICB9XG4gICAgaWYgKGRpYW1ldGVyWSA8IGRpYW1ldGVyWCkge1xuICAgICAgaW5uZXJBcmVhID0gZGlhbWV0ZXJZICogZGlhbWV0ZXJZO1xuICAgIH1cbiAgICBsZXQgc3ltYm9sID0gZDMuc3ltYm9sKCkuc2l6ZShpbm5lckFyZWEpO1xuICAgIHN3aXRjaCAodGhpcy5vcHQucG9seXN0YXQuc2hhcGUpIHtcbiAgICAgIGNhc2UgXCJoZXhhZ29uX3BvaW50ZWRfdG9wXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gYWhleGJpbi5oZXhhZ29uKHRoaXMuYXV0b0hleFJhZGl1cyk7XG4gICAgICAgIHNoYXBlV2lkdGggPSB0aGlzLmF1dG9IZXhSYWRpdXMgKiAyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJoZXhhZ29uX2ZsYXRfdG9wXCI6XG4gICAgICAgIC8vIFRPRE86IHVzZSBwb2ludGVkIGZvciBub3dcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBhaGV4YmluLmhleGFnb24odGhpcy5hdXRvSGV4UmFkaXVzKTtcbiAgICAgICAgc2hhcGVXaWR0aCA9IHRoaXMuYXV0b0hleFJhZGl1cyAqIDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbENpcmNsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sQ3Jvc3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkaWFtb25kXCI6XG4gICAgICAgIGN1c3RvbVNoYXBlID0gc3ltYm9sLnR5cGUoZDMuc3ltYm9sRGlhbW9uZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNxdWFyZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFNxdWFyZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInN0YXJcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xTdGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidHJpYW5nbGVcIjpcbiAgICAgICAgY3VzdG9tU2hhcGUgPSBzeW1ib2wudHlwZShkMy5zeW1ib2xUcmlhbmdsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInd5ZVwiOlxuICAgICAgICBjdXN0b21TaGFwZSA9IHN5bWJvbC50eXBlKGQzLnN5bWJvbFd5ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICBkZWZhdWx0OlxuICAgICAgICBjdXN0b21TaGFwZSA9IGFoZXhiaW4uaGV4YWdvbih0aGlzLmF1dG9IZXhSYWRpdXMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIGZvbnRzaXplIGJhc2VkIG9uIHRoZSBzaGFwZSBhbmQgdGhlIHRleHRcbiAgICBsZXQgYWN0aXZlRm9udFNpemUgPSB0aGlzLm9wdC5wb2x5c3RhdC5mb250U2l6ZTtcbiAgICBpZiAodGhpcy5vcHQucG9seXN0YXQuZm9udEF1dG9TY2FsZSkge1xuICAgICAgLy8gZmluZCB0aGUgbW9zdCB0ZXh0IHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgb3ZlciBhbGwgaXRlbXNcbiAgICAgIGxldCBtYXhMYWJlbCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5kYXRhW2ldLm5hbWUubGVuZ3RoID4gbWF4TGFiZWwubGVuZ3RoKSB7XG4gICAgICAgICAgbWF4TGFiZWwgPSB0aGlzLmRhdGFbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXN0aW1hdGUgaG93IGJpZyBvZiBhIGZvbnQgY2FuIGJlIHVzZWRcbiAgICAgIC8vIGlmIGl0IGlzIHRvbyBzbWFsbCwgaGlkZSBldmVyeXRoaW5nXG4gICAgICBsZXQgZXN0aW1hdGVGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGgoXG4gICAgICAgIG1heExhYmVsLFxuICAgICAgICBcIj9weCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHNoYXBlV2lkdGgsIC8vIHBhZFxuICAgICAgICAxMCxcbiAgICAgICAgMjUwKTtcbiAgICAgIGVzdGltYXRlRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoKFxuICAgICAgICBtYXhMYWJlbCxcbiAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICBzaGFwZVdpZHRoIC0gKGVzdGltYXRlRm9udFNpemUgKiAxLjIpLCAvLyBwYWRcbiAgICAgICAgMTAsXG4gICAgICAgIDI1MCk7XG4gICAgICBhY3RpdmVGb250U2l6ZSA9IGVzdGltYXRlRm9udFNpemU7XG4gICAgfVxuXG4gICAgLy8gZmxhdCB0b3AgaXMgcm90YXRlZCA5MCBkZWdyZWVzLCBidXQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtL2xheW91dCBuZWVkcyB0byBiZSBhZGp1c3RlZFxuICAgIC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC55ICsgXCIsXCIgKyBkLnggKyBcIilyb3RhdGUoOTApXCI7IH0pXG4gICAgLy8gc2VlIGh0dHA6Ly9ibC5vY2tzLm9yZy9qYXNvbmRhdmllcy9mNTkyMmVkNGQwYWMxYWMyMTYxZlxuXG4gICAgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuXG5cbiAgICBzdmcuc2VsZWN0QWxsKFwiLmhleGFnb25cIilcbiAgICAgICAgLmRhdGEoYWhleGJpbih0aGlzLmNhbGN1bGF0ZWRQb2ludHMpKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJoZXhhZ29uXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG4gICAgICAgIC5hdHRyKFwiZFwiLCBjdXN0b21TaGFwZSlcbiAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgdGhpcy5vcHQucG9seXN0YXQucG9seWdvbkJvcmRlckNvbG9yKVxuICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0aGlzLm9wdC5wb2x5c3RhdC5wb2x5Z29uQm9yZGVyU2l6ZSArIFwicHhcIilcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCAoXywgaSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9wdC5wb2x5c3RhdC5ncmFkaWVudEVuYWJsZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YVtpXS50aHJlc2hvbGRMZXZlbCkge1xuICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidXJsKCNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLW9rKVwiO1xuICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidXJsKCNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXdhcm5pbmcpXCI7XG4gICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1cmwoI1wiICsgdGhpcy5kM0RpdklkICsgXCJsaW5lYXItZ3JhZGllbnQtc3RhdGUtY3JpdGljYWwpXCI7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidXJsKCNcIiArIHRoaXMuZDNEaXZJZCArIFwibGluZWFyLWdyYWRpZW50LXN0YXRlLXVua25vd24pXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhW2ldLmNvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgKF8sIGkpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YVtpXS5zYW5pdGl6ZVVSTEVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2ldLnNhbml0aXplZFVSTC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGRhdGFbaV0uc2FuaXRpemVkVVJMKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0uY2xpY2tUaHJvdWdoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoZGF0YVtpXS5jbGlja1Rocm91Z2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgICAvLyB1c2UgdGhlIHZpZXdwb3J0d2lkdGggdG8gcHJldmVudCB0aGUgdG9vbHRpcCBmcm9tIGdvaW5nIHRvbyBmYXIgcmlnaHRcbiAgICAgICAgICBsZXQgdmlld1BvcnRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgICAgICAgLy8gdXNlIHRoZSBtb3VzZSBwb3NpdGlvbiBmb3IgdGhlIGVudGlyZSBwYWdlXG4gICAgICAgICAgdmFyIG1vdXNlID0gZDMubW91c2UoZDMuc2VsZWN0KFwiYm9keVwiKS5ub2RlKCkpO1xuICAgICAgICAgIHZhciB4cG9zID0gbW91c2VbMF0gLSA1MDtcbiAgICAgICAgICAvLyBkb24ndCBhbGxvdyBvZmZzY3JlZW4gdG9vbHRpcFxuICAgICAgICAgIGlmICh4cG9zIDwgMCkge1xuICAgICAgICAgICAgeHBvcyA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHByZXZlbnQgdG9vbHRpcCBmcm9tIHJlbmRlcmluZyBvdXRzaWRlIG9mIHZpZXdwb3J0XG4gICAgICAgICAgaWYgKCh4cG9zICsgMjAwKSA+IHZpZXdQb3J0V2lkdGgpIHtcbiAgICAgICAgICAgIHhwb3MgPSB2aWV3UG9ydFdpZHRoIC0gMjAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeXBvcyA9IG1vdXNlWzFdICsgNTtcbiAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIHhwb3MgKyBcInB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgeXBvcyArIFwicHhcIik7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCAoZCwgaSkgPT4ge1xuICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMCkuc3R5bGUoXCJvcGFjaXR5XCIsIDAuOSk7XG4gICAgICAgICAgdG9vbHRpcC5odG1sKHRoaXMub3B0LnRvb2x0aXBDb250ZW50W2ldKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHRoaXMub3B0LnRvb2x0aXBGb250U2l6ZSlcbiAgICAgICAgICAgIC5zdHlsZShcImZvbnQtZmFtaWx5XCIsIHRoaXMub3B0LnRvb2x0aXBGb250VHlwZSlcbiAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQueCAtIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkLnkgLSA1KSArIFwicHhcIik7XG4gICAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICB0b29sdGlwXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgfSk7XG4gICAgLy8gbm93IGxhYmVsc1xuICAgIHZhciB0ZXh0c3BvdCA9IHN2Zy5zZWxlY3RBbGwoXCJ0ZXh0LnRvcGxhYmVsXCIpXG4gICAgICAuZGF0YShhaGV4YmluKHRoaXMuY2FsY3VsYXRlZFBvaW50cykpO1xuXG4gICAgdGV4dHNwb3RcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRvcGxhYmVsXCIpXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueDsgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55OyB9KVxuICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIilcbiAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIGFjdGl2ZUZvbnRTaXplICsgXCJweFwiKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgICAgIGxldCBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgLy8gY2hlY2sgaWYgcHJvcGVydHkgZXhpc3RcbiAgICAgICAgaWYgKCEoXCJzaG93TmFtZVwiIGluIGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5zaG93TmFtZSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdmFyIGZyYW1lcyA9IDA7XG5cbiAgICBsZXQgZHluYW1pY0ZvbnRTaXplID0gYWN0aXZlRm9udFNpemU7XG5cbiAgICB0ZXh0c3BvdC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihfLCBpKSB7XG4gICAgICAgIHJldHVybiBcInZhbHVlTGFiZWxcIiArIGk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLng7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLnkgKyBhY3RpdmVGb250U2l6ZSArIDEwOyAvLyBvZmZzZXQgYnkgZm9udHNpemUgYW5kIDEwcHggdmVydGljYWwgcGFkZGluZ1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIiwgXCJzYW5zLXNlcmlmXCIpXG4gICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0ZvbnRTaXplICsgXCJweFwiKVxuICAgICAgLnRleHQoIChfLCBpKSA9PiB7XG4gICAgICAgIC8vIGFuaW1hdGlvbi9kaXNwbGF5bW9kZSBjYW4gbW9kaWZ5IHdoYXQgaXMgYmVpbmcgZGlzcGxheWVkXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgbGV0IGRhdGFMZW4gPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAvLyBzZWFyY2ggZm9yIGEgdmFsdWUgYnV0IG5vdCBtb3JlIHRoYW4gbnVtYmVyIG9mIGRhdGEgaXRlbXNcbiAgICAgICAgLy8gbmVlZCB0byBmaW5kIHRoZSBsb25nZXN0IGNvbnRlbnQgc3RyaW5nIGdlbmVyYXRlZCB0byBkZXRlcm1pbmUgdGhlXG4gICAgICAgIC8vIGR5bmFtaWMgZmlyZSBzaXplXG4gICAgICAgIC8vd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgIC8vICBjb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgLy8gIGNvdW50ZXIrKztcbiAgICAgICAgLy99XG4gICAgICAgIC8vIHRoaXMgYWx3YXlzIHN0YXJ0cyBmcm9tIGZyYW1lIDAsIGxvb2sgdGhyb3VnaCBldmVyeSBtZXRyaWMgaW5jbHVkaW5nIGNvbXBvc2l0ZSBtZW1iZXJzIGZvciB0aGUgbG9uZ2VzdCB0ZXh0IHBvc3NpYmxlXG4gICAgICAgIC8vIGdldCB0aGUgdG90YWwgY291bnQgb2YgbWV0cmljcyAod2l0aCBjb21wb3NpdGUgbWVtYmVycyksIGFuZCBsb29wIHRocm91Z2hcbiAgICAgICAgbGV0IHN1Ym1ldHJpY0NvdW50ID0gdGhpcy5kYXRhW2ldLm1lbWJlcnMubGVuZ3RoO1xuICAgICAgICBsZXQgbG9uZ2VzdERpc3BsYXllZENvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoc3VibWV0cmljQ291bnQgPiAwKSB7XG4gICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCBzdWJtZXRyaWNDb3VudCkge1xuICAgICAgICAgICAgbGV0IGNoZWNrQ29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIGNvdW50ZXIsIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGNoZWNrQ29udGVudCkge1xuICAgICAgICAgICAgICBpZiAoY2hlY2tDb250ZW50Lmxlbmd0aCA+IGxvbmdlc3REaXNwbGF5ZWRDb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRDb250ZW50ID0gY2hlY2tDb250ZW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG5vbi1jb21wb3NpdGVzIHVzZSB0aGUgZm9ybWF0dGVkIHNpemUgb2YgdGhlIG1ldHJpYyB2YWx1ZVxuICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRDb250ZW50ID0gdGhpcy5mb3JtYXRWYWx1ZUNvbnRlbnQoaSwgY291bnRlciwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbnRlbnQgPSBudWxsO1xuICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuZm9ybWF0VmFsdWVDb250ZW50KGksIChmcmFtZXMgKyBjb3VudGVyKSwgdGhpcyk7XG4gICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIGR5bmFtaWNGb250U2l6ZSA9IGdldFRleHRTaXplRm9yV2lkdGgoXG4gICAgICAgICAgbG9uZ2VzdERpc3BsYXllZENvbnRlbnQsXG4gICAgICAgICAgXCI/cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICAgIHNoYXBlV2lkdGgsXG4gICAgICAgICAgNixcbiAgICAgICAgICAyNTApO1xuICAgICAgICBkeW5hbWljRm9udFNpemUgPSBnZXRUZXh0U2l6ZUZvcldpZHRoKFxuICAgICAgICAgIGxvbmdlc3REaXNwbGF5ZWRDb250ZW50LFxuICAgICAgICAgIFwiP3B4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgICBzaGFwZVdpZHRoIC0gKGR5bmFtaWNGb250U2l6ZSAqIDMpLCAvLyBwYWQgYnkgMS41IGNoYXJzIGVhY2ggc2lkZVxuICAgICAgICAgIDYsXG4gICAgICAgICAgMjUwKTtcbiAgICAgICAgdmFyIHZhbHVlVGV4dExvY2F0aW9uID0gc3ZnLnNlbGVjdChcInRleHQudmFsdWVMYWJlbFwiICsgaSk7XG4gICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgZHluYW1pY0ZvbnRTaXplICsgXCJweFwiKTtcbiAgICAgICAgZDMuaW50ZXJ2YWwoICgpID0+IHtcbiAgICAgICAgICB2YXIgdmFsdWVUZXh0TG9jYXRpb24gPSBzdmcuc2VsZWN0KFwidGV4dC52YWx1ZUxhYmVsXCIgKyBpKTtcbiAgICAgICAgICB2YXIgY29tcG9zaXRlSW5kZXggPSBpO1xuICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLnRleHQoICgpID0+IHtcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbi9kaXNwbGF5bW9kZSBjYW4gbW9kaWZ5IHdoYXQgaXMgYmVpbmcgZGlzcGxheWVkXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBsZXQgZGF0YUxlbiA9IHRoaXMuZGF0YS5sZW5ndGggKiAyO1xuICAgICAgICAgICAgLy8gc2VhcmNoIGZvciBhIHZhbHVlIGN5Y2xpbmcgdGhyb3VnaCB0d2ljZSB0byBhbGxvdyByb2xsb3ZlclxuICAgICAgICAgICAgd2hpbGUgKChjb250ZW50ID09PSBudWxsKSAmJiAoY291bnRlciA8IGRhdGFMZW4pKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmZvcm1hdFZhbHVlQ29udGVudChjb21wb3NpdGVJbmRleCwgKGZyYW1lcyArIGNvdW50ZXIpLCB0aGlzKTtcbiAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBhZGQgY3VzdG9tIGNvbnRlbnQgZm9yIGNvbXBvc2l0ZSBvayBzdGF0ZVxuICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBmb250IHNpemUgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIGxhYmVsIGFib3ZlXG4gICAgICAgICAgICAgIHZhbHVlVGV4dExvY2F0aW9uLmF0dHIoXCJmb250LXNpemVcIiwgYWN0aXZlRm9udFNpemUgKyBcInB4XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZnJhbWVzKys7XG4gICAgICAgIH0sIHRoaXMub3B0LmFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIGZvcm1hdFZhbHVlQ29udGVudChpLCBmcmFtZXMsIHRoaXNSZWYpOiBzdHJpbmcge1xuICAgIGxldCBkYXRhID0gdGhpc1JlZi5kYXRhW2ldO1xuICAgIC8vIG9wdGlvbnMgY2FuIHNwZWNpZnkgdG8gbm90IHNob3cgdGhlIHZhbHVlXG4gICAgaWYgKHR5cGVvZihkYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzaG93VmFsdWVcIikpIHtcbiAgICAgICAgaWYgKCFkYXRhLnNob3dWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJ2YWx1ZUZvcm1hdHRlZFwiKSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gZGF0YSwgcmV0dXJuIG5vdGhpbmdcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBzd2l0Y2ggKGRhdGEuYW5pbWF0ZU1vZGUpIHtcbiAgICAgIGNhc2UgXCJhbGxcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidHJpZ2dlcmVkXCI6XG4gICAgICAgIC8vIHJldHVybiBub3RoaW5nIGlmIG1vZGUgaXMgdHJpZ2dlcmVkIGFuZCB0aGUgc3RhdGUgaXMgMFxuICAgICAgICBpZiAoZGF0YS50aHJlc2hvbGRMZXZlbCA8IDEpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgY29udGVudCA9IGRhdGEudmFsdWVGb3JtYXR0ZWQ7XG4gICAgLy8gaWYgdGhlcmUncyBubyB2YWx1ZUZvcm1hdHRlZCwgdGhlcmUncyBub3RoaW5nIHRvIGRpc3BsYXlcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKGRhdGEucHJlZml4KSAmJiAoZGF0YS5wcmVmaXgubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnRlbnQgPSBkYXRhLnByZWZpeCArIFwiIFwiICsgY29udGVudDtcbiAgICB9XG4gICAgaWYgKChkYXRhLnN1ZmZpeCkgJiYgKGRhdGEuc3VmZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICBjb250ZW50ID0gY29udGVudCArIFwiIFwiICsgZGF0YS5zdWZmaXg7XG4gICAgfVxuICAgIC8vIGEgY29tcG9zaXRlIHdpbGwgY29udGFpbiB0aGUgXCJ3b3JzdFwiIGNhc2UgYXMgdGhlIHZhbHVlRm9ybWF0dGVkLFxuICAgIC8vIGFuZCB3aWxsIGhhdmUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIHRoZSBjb21wb3NpdGUgaW5jbHVkZWQuXG4gICAgLy8gYXMgZnJhbWVzIGluY3JlbWVudCBmaW5kIGEgdHJpZ2dlcmVkIG1lbWJlciBzdGFydGluZyBmcm9tIHRoZSBmcmFtZSBtb2QgbGVuXG4gICAgbGV0IGxlbiA9IGRhdGEubWVtYmVycy5sZW5ndGg7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIGxldCB0cmlnZ2VyZWRJbmRleCA9IC0xO1xuICAgICAgaWYgKGRhdGEuYW5pbWF0ZU1vZGUgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgdHJpZ2dlcmVkSW5kZXggPSBmcmFtZXMgJSBsZW47XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0cmlnZ2VyZWRJbmRleCBmcm9tIGFsbCBtb2RlOiBcIiArIHRyaWdnZXJlZEluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YS50cmlnZ2VyQ2FjaGUpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgZGF0YS50cmlnZ2VyQ2FjaGUgPSB0aGlzLmJ1aWxkVHJpZ2dlckNhY2hlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB6ID0gZnJhbWVzICUgZGF0YS50cmlnZ2VyQ2FjaGUubGVuZ3RoO1xuICAgICAgICB0cmlnZ2VyZWRJbmRleCA9IGRhdGEudHJpZ2dlckNhY2hlW3pdLmluZGV4O1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidHJpZ2dlcmVkSW5kZXggZnJvbSBjYWNoZSBpczogXCIgKyB0cmlnZ2VyZWRJbmRleCk7XG4gICAgICB9XG4gICAgICBsZXQgYU1lbWJlciA9IGRhdGEubWVtYmVyc1t0cmlnZ2VyZWRJbmRleF07XG5cbiAgICAgIGNvbnRlbnQgPSBhTWVtYmVyLm5hbWUgKyBcIjogXCIgKyBhTWVtYmVyLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgaWYgKChhTWVtYmVyLnByZWZpeCkgJiYgKGFNZW1iZXIucHJlZml4Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnRlbnQgPSBhTWVtYmVyLnByZWZpeCArIFwiIFwiICsgY29udGVudDtcbiAgICAgIH1cbiAgICAgIGlmICgoYU1lbWJlci5zdWZmaXgpICYmIChhTWVtYmVyLnN1ZmZpeC5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb250ZW50ID0gY29udGVudCArIFwiIFwiICsgYU1lbWJlci5zdWZmaXg7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFsbG93IHRlbXBsYXRpbmdcbiAgICAvL1xuICAgIGlmICgoY29udGVudCkgJiYgKGNvbnRlbnQubGVuZ3RoID4gMCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXBsYWNlZENvbnRlbnQgPSB0aGlzUmVmLnRlbXBsYXRlU3J2LnJlcGxhY2VXaXRoVGV4dChjb250ZW50KTtcbiAgICAgICAgY29udGVudCA9IHJlcGxhY2VkQ29udGVudDtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiB0ZW1wbGF0ZSBzZXJ2ZXIgdGhyZXcgZXJyb3I6IFwiICsgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBidWlsZFRyaWdnZXJDYWNoZShpdGVtKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkJ1aWxkaW5nIHRyaWdnZXIgY2FjaGUgZm9yIGl0ZW1cIik7XG4gICAgbGV0IHRyaWdnZXJDYWNoZSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5tZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgYU1lbWJlciA9IGl0ZW0ubWVtYmVyc1tpXTtcbiAgICAgIGlmIChhTWVtYmVyLnRocmVzaG9sZExldmVsID4gMCkge1xuICAgICAgICAvLyBhZGQgdG8gbGlzdFxuICAgICAgICBsZXQgY2FjaGVkTWVtYmVyU3RhdGUgPSB7IGluZGV4OiBpLCBuYW1lOiBhTWVtYmVyLm5hbWUsIHZhbHVlOiBhTWVtYmVyLnZhbHVlLCB0aHJlc2hvbGRMZXZlbDogYU1lbWJlci50aHJlc2hvbGRMZXZlbCB9O1xuICAgICAgICB0cmlnZ2VyQ2FjaGUucHVzaChjYWNoZWRNZW1iZXJTdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHNvcnQgaXRcbiAgICB0cmlnZ2VyQ2FjaGUgPSBfLm9yZGVyQnkodHJpZ2dlckNhY2hlLCBbXCJ0aHJlc2hvbGRMZXZlbFwiLCBcInZhbHVlXCIsIFwibmFtZVwiXSwgW1wiZGVzY1wiLCBcImRlc2NcIiwgXCJhc2NcIl0pO1xuICAgIHJldHVybiB0cmlnZ2VyQ2FjaGU7XG4gIH1cblxuICBnZXRBdXRvSGV4UmFkaXVzKCk6IG51bWJlciB7XG4gICAgLy9UaGUgbWF4aW11bSByYWRpdXMgdGhlIGhleGFnb25zIGNhbiBoYXZlIHRvIHN0aWxsIGZpdCB0aGUgc2NyZWVuXG4gICAgdmFyIGhleFJhZGl1cyA9IGQzLm1pbihcbiAgICAgIFtcbiAgICAgICAgdGhpcy5vcHQud2lkdGggLyAoKHRoaXMubnVtQ29sdW1ucyArIDAuNSkgKiBNYXRoLnNxcnQoMykpLFxuICAgICAgICB0aGlzLm9wdC5oZWlnaHQgLyAoKHRoaXMubnVtUm93cyArIDEgLyAzKSAqIDEuNSlcbiAgICAgIF1cbiAgICApO1xuICAgIHJldHVybiBoZXhSYWRpdXM7XG4gIH1cblxuICBjYWxjdWxhdGVTVkdTaXplKCkge1xuICAgIC8vVGhlIGhlaWdodCBvZiB0aGUgdG90YWwgZGlzcGxheSB3aWxsIGJlXG4gICAgLy90aGlzLmF1dG9IZWlnaHQgPSB0aGlzLm51bVJvd3MgKiAzIC8gMiAqIHRoaXMuaGV4UmFkaXVzICsgMSAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICAgIC8vd2hpY2ggaXMgdGhlIHNhbWUgYXNcbiAgICB0aGlzLmF1dG9IZWlnaHQgPSAodGhpcy5udW1Sb3dzICsgMSAvIDMpICogMyAvIDIgKiB0aGlzLmhleFJhZGl1cztcbiAgICB0aGlzLmF1dG9IZWlnaHQgLT0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tO1xuICAgIC8vY29uc29sZS5sb2coXCJhdXRvaGVpZ2h0ID0gXCIgKyB0aGlzLmF1dG9IZWlnaHQpO1xuICAgIC8vVGhlIHdpZHRoIG9mIHRoZSB0b3RhbCBkaXNwbGF5IHdpbGwgYmVcbiAgICAvL3RoaXMuYXV0b1dpZHRoID0gdGhpcy5udW1Db2x1bW5zICogTWF0aC5zcXJ0KDMpICogdGhpcy5oZXhSYWRpdXMgKyBNYXRoLnNxcnQoMykgLyAyICogdGhpcy5oZXhSYWRpdXM7XG4gICAgLy93aGljaCBpcyB0aGUgc2FtZSBhc1xuICAgIHRoaXMuYXV0b1dpZHRoID0gKHRoaXMubnVtQ29sdW1ucyArIDEgLyAyKSAqIE1hdGguc3FydCgzKSAqIHRoaXMuaGV4UmFkaXVzO1xuICAgIHRoaXMuYXV0b1dpZHRoIC09IHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICAvL2NvbnNvbGUubG9nKFwiYXV0b3dpZHRoID0gXCIgKyB0aGlzLmF1dG9XaWR0aCk7XG4gIH1cblxuICAvLyBCdWlsZHMgdGhlIHBsYWNlaG9sZGVyIHBvbHlnb25zIG5lZWRlZCB0byByZXByZXNlbnQgZWFjaCBtZXRyaWNcbiAgZ2VuZXJhdGVQb2ludHMoKSA6IGFueSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIGlmICh0eXBlb2YodGhpcy5kYXRhKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgbGV0IG1heFJvd3NVc2VkID0gMDtcbiAgICBsZXQgY29sdW1uc1VzZWQgPSAwO1xuICAgIGxldCBtYXhDb2x1bW5zVXNlZCA9IDA7XG4gICAgLy8gd2hlbiBkdXBsaWNhdGluZyBwYW5lbHMsIHRoaXMgZ2V0cyBvZGRcbiAgICBpZiAodGhpcy5udW1Sb3dzID09PSBJbmZpbml0eSkge1xuICAgICAgY29uc29sZS5sb2coXCJudW1Sb3dzIGluZmluaXR5Li4uXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgaWYgKHRoaXMubnVtQ29sdW1ucyA9PT0gTmFOKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm51bUNvbHVtbnMgTmFOXCIpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bVJvd3M7IGkrKykge1xuICAgICAgaWYgKChwb2ludHMubGVuZ3RoIDwgdGhpcy5vcHQuZGlzcGxheUxpbWl0KSAmJiAocG9pbnRzLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpKSB7XG4gICAgICAgIG1heFJvd3NVc2VkICs9IDE7XG4gICAgICAgIGNvbHVtbnNVc2VkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm51bUNvbHVtbnM7IGorKykge1xuICAgICAgICAgIGlmICgocG9pbnRzLmxlbmd0aCA8IHRoaXMub3B0LmRpc3BsYXlMaW1pdCkgJiYgKHBvaW50cy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSkge1xuICAgICAgICAgICAgY29sdW1uc1VzZWQgKz0gMTtcbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBtb3N0IG51bWJlciBvZiBjb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29sdW1uc1VzZWQgPiBtYXhDb2x1bW5zVXNlZCkge1xuICAgICAgICAgICAgICBtYXhDb2x1bW5zVXNlZCA9IGNvbHVtbnNVc2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3RoaXMuaGV4UmFkaXVzICogaiAqIDEuNzUsIHRoaXMuaGV4UmFkaXVzICogaSAqIDEuNV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiTWF4IHJvd3MgdXNlZDpcIiArIG1heFJvd3NVc2VkKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQWN0dWFsIGNvbHVtbnMgdXNlZDpcIiArIG1heENvbHVtbnNVc2VkKTtcbiAgICB0aGlzLm1heFJvd3NVc2VkID0gbWF4Um93c1VzZWQ7XG4gICAgdGhpcy5tYXhDb2x1bW5zVXNlZCA9IG1heENvbHVtbnNVc2VkO1xuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxufVxuIl19