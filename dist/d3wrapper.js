System.register(["./external/d3-hexbin.js", "d3", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var d3hexbin, d3, utils_1, D3Wrapper;
    return {
        setters: [
            function (d3hexbin_1) {
                d3hexbin = d3hexbin_1;
            },
            function (d3_1) {
                d3 = d3_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
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
                    if (this.opt.rowAutoSize && this.opt.columnAutoSize) {
                        var squared = Math.sqrt(this.data.length);
                        if (this.opt.width > this.opt.height) {
                            var ratio = this.opt.width / this.opt.height * .66;
                            this.numColumns = Math.ceil(squared) * ratio;
                            if (this.numColumns < 1) {
                                this.numColumns = 1;
                            }
                            if ((this.numColumns % 2) && (this.numColumns > 2)) {
                                this.numColumns -= 1;
                            }
                            this.numRows = Math.ceil(this.data.length / this.numColumns * ratio);
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                        }
                        else {
                            var ratio = this.opt.height / this.opt.width * .66;
                            this.numRows = Math.ceil(squared) * ratio;
                            if (this.numRows < 1) {
                                this.numRows = 1;
                            }
                            if ((this.numRows % 2) && (this.numRows > 2)) {
                                this.numRows -= 1;
                            }
                            this.numColumns = Math.ceil(this.data.length / this.numRows * ratio);
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
                    var activeFontSize = this.opt.polystat.fontSize;
                    if (this.opt.polystat.fontAutoScale) {
                        var maxLabel = "";
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].name.length > maxLabel.length) {
                                maxLabel = this.data[i].name;
                            }
                        }
                        var estimateFontSize = utils_1.getTextSizeForWidth(maxLabel, "?px sans-serif", this.autoHexRadius * 2, 10, 50);
                        console.log("Estimated Font size: " + estimateFontSize);
                        activeFontSize = estimateFontSize;
                    }
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
                    var yoffset = ((height - renderHeight) / 2) + (diameterY * .66);
                    var tooltip = d3.select(this.svgContainer)
                        .append("div")
                        .attr("id", this.d3DivId + "-tooltip")
                        .attr("class", "xtooltip")
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
                    var thisRef = this;
                    svg.selectAll(".hexagon")
                        .data(ahexbin(this.calculatedPoints))
                        .enter().append("path")
                        .attr("class", "hexagon")
                        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .attr("d", ahexbin.hexagon(this.autoHexRadius))
                        .attr("stroke", "black")
                        .attr("stroke-width", "2px")
                        .style("fill", function (_, i) {
                        return data[i].color;
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
                        var mouse = d3.mouse(svg.node());
                        var xpos = mouse[0] + 135;
                        var ypos = mouse[1];
                        tooltip
                            .style("left", xpos + "px")
                            .style("top", (ypos + 50) + "px");
                    })
                        .on("mouseover", function (d, i) {
                        tooltip.transition().duration(200).style("opacity", 0.9);
                        tooltip.html(thisRef.opt.tooltipContent[i])
                            .style("font-size", thisRef.opt.tooltipFontSize)
                            .style("font-family", thisRef.opt.tooltipFontType)
                            .style("left", (d.x + 135) + "px")
                            .style("top", d.y + 50);
                    })
                        .on("mouseout", function (d) {
                        console.log(d);
                        tooltip
                            .transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                    var textspot = svg.selectAll("text")
                        .data(ahexbin(this.calculatedPoints));
                    textspot
                        .enter()
                        .append("text")
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
                    var textRef = textspot.enter()
                        .append("text")
                        .attr("x", function (d) {
                        return d.x;
                    })
                        .attr("y", function (d) {
                        return d.y + 25;
                    })
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", activeFontSize + "px")
                        .attr("fill", "black")
                        .text(function (_, i) {
                        var content = null;
                        var counter = 0;
                        var dataLen = thisRef.data.length;
                        while ((content === null) && (counter < dataLen)) {
                            content = thisRef.formatValueContent(i, (frames + counter), thisRef);
                            counter++;
                        }
                        if (content === null) {
                            content = "N/A";
                        }
                        return content;
                    });
                    d3.interval(function () {
                        textRef.text(function (_, i) {
                            var content = null;
                            var counter = 0;
                            var dataLen = thisRef.data.length * 2;
                            while ((content === null) && (counter < dataLen)) {
                                content = thisRef.formatValueContent(i, (frames + counter), thisRef);
                                counter++;
                            }
                            if (content === null) {
                                content = "N/A";
                            }
                            return content;
                        });
                        frames++;
                    }, this.opt.animationSpeed);
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
                    if ((data.prefix) && (data.prefix.length > 0)) {
                        content = data.prefix + " " + content;
                    }
                    if ((data.suffix) && (data.suffix.length > 0)) {
                        content = content + " " + data.suffix;
                    }
                    var len = data.members.length;
                    if (len > 0) {
                        var aMember = data.members[frames % len];
                        switch (data.animateMode) {
                            case "all":
                                break;
                            case "triggered":
                                if (aMember.thresholdLevel < 1) {
                                    return null;
                                }
                        }
                        content = aMember.valueFormatted;
                        if ((aMember.prefix) && (aMember.prefix.length > 0)) {
                            content = aMember.prefix + " " + content;
                        }
                        if ((aMember.suffix) && (aMember.suffix.length > 0)) {
                            content = content + " " + aMember.suffix;
                        }
                    }
                    content = this.templateSrv.replaceWithText(content);
                    return content;
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
//# sourceMappingURL=d3wrapper.js.map