/////<reference path="../node_modules/@types/d3-hexbin/index.d.ts" />
/////<reference path="../node_modules/@types/d3/index.d.ts" />
import * as d3 from "./external/d3.min.js";
import * as d3hexbin from "./external/d3-hexbin.js";
import { getTextSizeForWidth } from "./utils";

export class D3Wrapper {
  svgContainer: any;
  d3DivId: any;
  maxColumnsUsed: number;
  maxRowsUsed: number;
  opt: any;
  data: any;
  templateSrv: any;
  calculatedPoints: any;
  hexRadius: number;
  autoHexRadius : number;
  autoWidth : number;
  autoHeight: number;
  numColumns: number;
  numRows: number;
  margin: {
    top: number,
    right : number,
    bottom : number,
    left : number,
  };

  constructor(templateSrv: any, svgContainer: any, d3DivId, opt) {
    this.templateSrv = templateSrv;
    this.svgContainer = svgContainer;
    this.d3DivId = d3DivId;
    this.data = opt.data;
    //this.hexRadius = opt.hexRadius;
    this.opt = opt;
    // title is 26px
    this.margin = {
      top: 30 + 26,
      right: 0,
      bottom: 20,
      left: 50
    };
    // take 10 off the height
    this.opt.height -= 10;
    this.opt.width -= 20;
    this.data = this.opt.data;
    this.maxColumnsUsed = 0;
    this.maxRowsUsed = 0;
    if (opt.rowAutoSize && opt.columnAutoSize) {
      // sqrt of # data items
    } else {
      this.numColumns = opt.columns || 6;
      this.numRows = opt.rows || 6;
    }
    if ((!opt.radiusAutoSize) && (opt.radius)) {
      this.hexRadius = opt.radius;
      this.autoHexRadius = opt.radius;
    } else {
      this.hexRadius = this.getAutoHexRadius(); // || 50;
      this.autoHexRadius = this.getAutoHexRadius(); //|| 50;
    }
    this.calculateSVGSize();
    this.calculatedPoints = this.generatePoints();
}

  update(data: any) {
    //console.log("update");
    if (data) {
      this.data = data;
      //console.log("have data" + data);
      //var randomX = d3.randomNormal(this.opt.width / 2, 80);
      //var randomY = d3.randomNormal(this.opt.height / 2, 80);
      //this.calculatedPoints = d3.range(2000).map(function() { return [randomX(), randomY()]; });
    }
  }

  draw() {
    if (this.opt.rowAutoSize && this.opt.columnAutoSize) {
      // sqrt of # data items
      let squared = Math.sqrt(this.data.length);
      // favor columns when width is greater than height
      // favor rows when width is less than height
      if (this.opt.width > this.opt.height) {
        // ratio of width to height
        let ratio = this.opt.width / this.opt.height * .66;
        this.numColumns = Math.ceil(squared) * ratio;
        // always at least 1 column
        if (this.numColumns < 1) {
          this.numColumns = 1;
        }
        // prefer evens and smaller
        if ((this.numColumns % 2) && (this.numColumns > 2)) {
          this.numColumns -= 1;
        }
        this.numRows = Math.ceil(this.data.length / this.numColumns * ratio);
        if (this.numRows < 1) {
          this.numRows = 1;
        }
        //console.log("Calculated columns = " + this.numColumns);
        //console.log("Calculated rows = " + this.numRows);
        //console.log("Number of data items to render = " + this.data.length);
      } else {
        let ratio = this.opt.height / this.opt.width * .66;
        this.numRows = Math.ceil(squared) * ratio;
        if (this.numRows < 1) {
          this.numRows = 1;
        }
        // prefer evens and smaller
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

    var width = this.opt.width;
    var height = this.opt.height;
    //console.log("autorad:" + this.autoHexRadius);
    var ahexbin = d3hexbin
      .hexbin()
      .radius(this.autoHexRadius)
      .extent([[0, 0], [width, height]]);

    // d3 calculates the radius for x and y separately based on the value passed in
    var thirdPi = Math.PI / 3;
    let diameterX = this.autoHexRadius * 2 * Math.sin(thirdPi);
    let diameterY = this.autoHexRadius * 1.5;
    let radiusX = diameterX / 2;
    let renderWidth = this.maxColumnsUsed * diameterX;
    // renderHeight is calculated based on the #rows used, and
    // the "space" taken by the hexagons interleaved
    // space taken is 2/3 of diameterY * # rows
    let renderHeight = (this.maxRowsUsed * diameterY) + (diameterY * .33);
    //renderHeight = (this.maxRowsUsed * this.autoHexRadius * .66);
    // difference of width and renderwidth is our play room, split that in half
    // offset is from center of hexagon, not from the edge
    // also, if there is just one column and one row, center it
    let xoffset = (width - renderWidth + radiusX) / 2;
    // y diameter of hexagon is larger than x diameter
    let yoffset = ((height - renderHeight) / 2) + (diameterY * .66);

    // Define the div for the tooltip
    var tooltip = d3.select(this.svgContainer)
      .append("div")
      .attr("id", this.d3DivId + "-tooltip")
      .attr("class", "xtooltip")
      .style("opacity", 0);
    var svg : any = d3.select(this.svgContainer)
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

    // TODO: quadrant data
    //var numPoints = this.calculatedPoints.length;
    // TODO: count number of ok/warn/crit
    //var numAlerts = this.calculatedPoints.length;
    //var numOK = 0;
    //var numWARN = 0;
    //var numCRIT = 0;
    /*
    d3.select(this.svgContainer)
      .append("div")
      .attr("class", "botr2")
      .attr("id", this.d3DivId + "quadrant4")
      .html("(" + numAlerts + "/" + numPoints + ")");
    */
    /*
    d3.select(this.svgContainer)
      .append("div")
      .attr("class", "polystat-panel-quadrant")
      .attr("id", this.d3DivId + "quadrant4")
      .style("border", "1px solid white")
      .style("left", (width - 125) + "px")
      .style("top", (height - 50) + "px")
      .style("text-align", "right")
      .html("(" + numAlerts + "/" + numPoints + ")");
    */
    let customShape = null;
    // this is used to calculate the fontsize
    let shapeWidth = diameterX;
    // symbols use the area for their size
    let innerArea = diameterX * diameterY;
    // use the smaller of diameterX or Y
    if (diameterX < diameterY) {
      innerArea = diameterX * diameterX;
    }
    if (diameterY < diameterX) {
      innerArea = diameterY * diameterY;
    }
    let symbol = d3.symbol().size(innerArea);
    switch (this.opt.polystat.shape) {
      case "hexagon_pointed_top":
        customShape = ahexbin.hexagon(this.autoHexRadius);
        shapeWidth = this.autoHexRadius * 2;
        break;
      case "hexagon_flat_top":
        // TODO: use pointed for now
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

    // calculate the fontsize based on the shape and the text
    let activeFontSize = this.opt.polystat.fontSize;
    if (this.opt.polystat.fontAutoScale) {
      // find the most text that will be displayed over all items
      let maxLabel = "";
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].name.length > maxLabel.length) {
          maxLabel = this.data[i].name;
        }
      }
      // estimate how big of a font can be used
      // if it is too small, hide everything
      let estimateFontSize = getTextSizeForWidth(
        maxLabel,
        "?px sans-serif",
        shapeWidth,
        10,
        50);
      //console.log("Estimated Font size: " + estimateFontSize);
      activeFontSize = estimateFontSize;
    }

    // flat top is rotated 90 degrees, but the coordinate system/layout needs to be adjusted
    //.attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")rotate(90)"; })
    // see http://bl.ocks.org/jasondavies/f5922ed4d0ac1ac2161f

    //.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })

    svg.selectAll(".hexagon")
        .data(ahexbin(this.calculatedPoints))
        .enter().append("path")
        .attr("class", "hexagon")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("d", customShape)
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .style("fill", function(_, i) {
          return data[i].color;
        })
        .on("click", function (_, i) {
          if (data[i].sanitizeURLEnabled) {
            if (data[i].sanitizedURL.length > 0) {
              window.location.replace(data[i].sanitizedURL);
            }
          } else {
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
        .on("mouseover", function(d, i) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(thisRef.opt.tooltipContent[i])
            .style("font-size", thisRef.opt.tooltipFontSize)
            .style("font-family", thisRef.opt.tooltipFontType)
            .style("left", (d.x + 135) + "px")
            .style("top", d.y + 50);
          })

        .on("mouseout", function(d) {
              console.log(d);
              tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);
        });
    // now labels
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
        let item = data[i];
        // check if property exist
        if (!("showName" in item)) {
          return item.name;
        }
        if (item.showName) {
          return item.name;
        } else {
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
        // animation/displaymode can modify what is being displayed
        let content = null;
        let counter = 0;
        let dataLen = thisRef.data.length;
        // search for a value but not more than number of data items
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
          // animation/displaymode can modify what is being displayed
          let content = null;
          let counter = 0;
          let dataLen = thisRef.data.length * 2;
          // search for a value cycling through twice to allow rollover
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
  }

  formatValueContent(i, frames, thisRef): string {
    let data = thisRef.data[i];
    // options can specify to not show the value
    if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty("showValue")) {
        if (!data.showValue) {
          return "";
        }
      }
      if (!data.hasOwnProperty("valueFormatted")) {
        return "";
      }
    } else {
      // no data, return nothing
      return "";
    }
    switch (data.animateMode) {
      case "all":
        break;
      case "triggered":
        // return nothing if mode is triggered and the state is 0
        if (data.thresholdLevel < 1) {
          return "";
        }
    }
    let content = data.valueFormatted;
    if ((data.prefix) && (data.prefix.length > 0)) {
      content = data.prefix + " " + content;
    }
    if ((data.suffix) && (data.suffix.length > 0)) {
      content = content + " " + data.suffix;
    }
    let len = data.members.length;
    if (len > 0) {
      let aMember = data.members[frames % len];
      // use the animate mode from the parent (for composites)
      switch (data.animateMode) {
        case "all":
          break;
        case "triggered":
          // return nothing if mode is triggered and the state is 0
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
    // allow templating
    //
    if (content.length > 0) {
      try {
        let replacedContent = thisRef.templateSrv.replaceWithText(content);
        content = replacedContent;
      } catch (err) {
        console.log("ERROR: template server threw error: " + err);
      }
    }
    return content;
  }

  getAutoHexRadius(): number {
    //The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min(
      [
        this.opt.width / ((this.numColumns + 0.5) * Math.sqrt(3)),
        this.opt.height / ((this.numRows + 1 / 3) * 1.5)
      ]
    );
    return hexRadius;
  }

  calculateSVGSize() {
    //The height of the total display will be
    //this.autoHeight = this.numRows * 3 / 2 * this.hexRadius + 1 / 2 * this.hexRadius;
      //which is the same as
    this.autoHeight = (this.numRows + 1 / 3) * 3 / 2 * this.hexRadius;
    this.autoHeight -= this.margin.top - this.margin.bottom;
    //console.log("autoheight = " + this.autoHeight);
    //The width of the total display will be
    //this.autoWidth = this.numColumns * Math.sqrt(3) * this.hexRadius + Math.sqrt(3) / 2 * this.hexRadius;
    //which is the same as
    this.autoWidth = (this.numColumns + 1 / 2) * Math.sqrt(3) * this.hexRadius;
    this.autoWidth -= this.margin.left - this.margin.right;
    //console.log("autowidth = " + this.autoWidth);
  }

  // Builds the placeholder polygons needed to represent each metric
  generatePoints() : any {
    let points = [];
    if (typeof(this.data) === "undefined") {
      return points;
    }
    let maxRowsUsed = 0;
    let columnsUsed = 0;
    let maxColumnsUsed = 0;
    for (var i = 0; i < this.numRows; i++) {
      if ((points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
        maxRowsUsed += 1;
        columnsUsed = 0;
        for (var j = 0; j < this.numColumns; j++) {
          if ((points.length < this.opt.displayLimit) && (points.length < this.data.length)) {
            columnsUsed += 1;
            // track the most number of columns
            if (columnsUsed > maxColumnsUsed) {
              maxColumnsUsed = columnsUsed;
            }
            points.push([this.hexRadius * j * 1.75, this.hexRadius * i * 1.5]);
          }
        }
      }
    }
    //console.log("Max rows used:" + maxRowsUsed);
    //console.log("Actual columns used:" + maxColumnsUsed);
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
    return points;
  }

}
