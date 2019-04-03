/////<reference path="../node_modules/@types/d3-hexbin/index.d.ts" />
/////<reference path="../node_modules/@types/d3/index.d.ts" />
import * as d3 from "./external/d3.min.js";
import * as d3hexbin from "./external/d3-hexbin.js";
import { getTextSizeForWidthAndHeight } from "./utils";
import _ from "lodash";
import { Color } from "./color";

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
  maxFont = 240;
  purelight: any;

  constructor(templateSrv: any, svgContainer: any, d3DivId: any, opt: any) {
    this.templateSrv = templateSrv;
    this.svgContainer = svgContainer;
    this.d3DivId = d3DivId;
    this.data = opt.data;
    this.opt = opt;

    this.purelight = new Color(255, 255, 255);
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
    this.numColumns = 5;
    this.numRows = 5;
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
    if (data) {
      this.data = data;
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
        this.numColumns = Math.ceil(squared * ratio);
        // always at least 1 column
        if (this.numColumns < 1) {
          this.numColumns = 1;
        }
        // prefer evens and smaller
        if ((this.numColumns % 2) && (this.numColumns > 2)) {
          this.numColumns -= 1;
        }
        this.numRows = Math.floor(this.data.length / this.numColumns * ratio);
        if (this.numRows < 1) {
          this.numRows = 1;
        }
        this.numColumns = Math.ceil(this.data.length / this.numRows * ratio);
      } else {
        let ratio = this.opt.height / this.opt.width * .66;
        this.numRows = Math.ceil(squared * ratio);
        if (this.numRows < 1) {
          this.numRows = 1;
        }
        // prefer evens and smaller
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
      // prefer more columns
      if (this.data.length === this.numColumns) {
        this.numRows = 1;
      }
    }
    //console.log("Calculated columns = " + this.numColumns);
    //console.log("Calculated rows = " + this.numRows);
    //console.log("Number of data items to render = " + this.data.length);

    if (this.opt.radiusAutoSize) {
      this.hexRadius = this.getAutoHexRadius();
      this.autoHexRadius = this.getAutoHexRadius();
      //console.log("autoHexRadius:" + this.autoHexRadius);
    }
    this.calculateSVGSize();
    this.calculatedPoints = this.generatePoints();

    var width = this.opt.width;
    var height = this.opt.height;
    //console.log("Detected Width: " + width + " Height: " + height);
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
    // difference of width and renderwidth is our play room, split that in half
    // offset is from center of hexagon, not from the edge
    let xoffset = (width - renderWidth + radiusX) / 2;
    // if there is just one column and one row, center it
    if (this.numRows === 1) {
      renderHeight = diameterY + (diameterY * .33);
      xoffset = ((width - renderWidth) / 2) + radiusX;
    }
    // y diameter of hexagon is larger than x diameter
    let yoffset = ((height - renderHeight) / 2) + (diameterY * .66);

    // Define the div for the tooltip
    // add it to the body and not the container so it can float outside of the panel
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("id", this.d3DivId + "-tooltip")
      .attr("class", "polystat-panel-tooltip")
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
    var defs = svg.append("defs");

    let colorGradients = Color.createGradients(data);
    for (let i = 0; i < colorGradients.length; i++) {
      //console.log("Name = " + this.d3DivId + "linear-gradient-state-data-" + i);
      let aGradient = defs.append("linearGradient")
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
    let okColorStart = new Color(82, 194, 52); // #52c234
    let okColorEnd = okColorStart.Mul(this.purelight, 0.7);
    let okGradient = defs.append("linearGradient")
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

    // https://uigradients.com/#JuicyOrange
    let warningColorStart = new Color(255, 200, 55); // #FFC837
    let warningColorEnd = warningColorStart.Mul(this.purelight, 0.7);
    let warningGradient = defs.append("linearGradient")
        .attr("id", this.d3DivId + "linear-gradient-state-warning");
    warningGradient.attr("x1", "30%")
        .attr("y1", "30%")
        .attr("x2", "70%")
        .attr("y2", "70%");
    warningGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", warningColorStart.asHex()); // light orange
    warningGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", warningColorEnd.asHex()); // dark orange

    // https://uigradients.com/#YouTube
    let criticalColorStart = new Color(229, 45, 39); // e52d27
    let criticalColorEnd = criticalColorStart.Mul(this.purelight, 0.7);
    let criticalGradient = defs.append("linearGradient")
      .attr("id", this.d3DivId + "linear-gradient-state-critical");
    criticalGradient
      .attr("x1", "30%")
      .attr("y1", "30%")
      .attr("x2", "70%")
      .attr("y2", "70%");
    criticalGradient
      .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", criticalColorStart.asHex()); // light red
    criticalGradient
      .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", criticalColorEnd.asHex()); // dark red

    // https://uigradients.com/#Ash
    let unknownGradient = defs.append("linearGradient")
      .attr("id", this.d3DivId + "linear-gradient-state-unknown");
    unknownGradient
      .attr("x1", "30%")
      .attr("y1", "30%")
      .attr("x2", "70%")
      .attr("y2", "70%");
    unknownGradient
      .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#73808A"); // light grey
    unknownGradient
      .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#757F9A"); // dark grey

    let customShape = null;
    // this is used to calculate the fontsize
    let shapeWidth = diameterX;
    let shapeHeight = diameterY;
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
    let activeLabelFontSize = this.opt.polystat.fontSize;
    // font sizes are independent for label and values
    let activeValueFontSize = this.opt.polystat.fontSize;
    let longestDisplayedValueContent = "";

    if (this.opt.polystat.fontAutoScale) {
      // find the most text that will be displayed over all items
      let maxLabel = "";
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].name.length > maxLabel.length) {
          maxLabel = this.data[i].name;
        }
      }
      // estimate how big of a font can be used
      // Two lines of text must fit with vertical spacing included
      // if it is too small, hide everything
      let estimateLabelFontSize = getTextSizeForWidthAndHeight(
        maxLabel,
        "?px sans-serif", // use sans-serif for sizing
        shapeWidth,
        shapeHeight / 3, // top and bottom of hexagon not used, and two lines of text
        10,
        this.maxFont);

      //console.log("Calc: Estimated Label Font Size: " + estimateLabelFontSize);
      activeLabelFontSize = estimateLabelFontSize;
      // same for the value
      let maxValue = "";
      for (let i = 0; i < this.data.length; i++) {
        //console.log("Checking len: " + this.data[i].valueFormatted + " vs: " + maxValue);
        if (this.data[i].valueFormatted.length > maxValue.length) {
          maxValue = this.data[i].valueFormatted;
        }
      }
      //console.log("Max Value: " + maxValue);
      let estimateValueFontSize = getTextSizeForWidthAndHeight(
        maxValue,
        "?px sans-serif", // use sans-serif for sizing
        shapeWidth,
        shapeHeight / 3, // top and bottom of hexagon not used, and two lines of text
        10,
        this.maxFont);
      activeValueFontSize = estimateValueFontSize;
      longestDisplayedValueContent = maxValue;
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
        .attr("stroke", this.opt.polystat.polygonBorderColor)
        .attr("stroke-width", this.opt.polystat.polygonBorderSize + "px")
        .style("fill", (_, i) => {
          if (this.opt.polystat.gradientEnabled) {
            // safari needs the location.href
            return "url(" + location.href + "#" + this.d3DivId + "linear-gradient-state-data-" + i + ")";
          } else {
            return data[i].color;
          }
        })
        .on("click", (_, i) => {
          if (data[i].sanitizeURLEnabled === true) {
            console.log("click detected sanitized enabled" + data[i].sanitizedURL);
            if (data[i].sanitizedURL.length > 0) {
              window.location.replace(data[i].sanitizedURL);
            }
          } else {
            console.log("click detected sanitized disabled" + data[i].clickThrough);
            if (data[i].clickThrough.length > 0) {
              window.location.replace(data[i].clickThrough);
            }
          }
        })
        .on("mousemove", () => {
          // use the viewportwidth to prevent the tooltip from going too far right
          let viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          // use the mouse position for the entire page
          var mouse = d3.mouse(d3.select("body").node());
          var xpos = mouse[0] - 50;
          // don't allow offscreen tooltip
          if (xpos < 0) {
            xpos = 0;
          }
          // prevent tooltip from rendering outside of viewport
          if ((xpos + 200) > viewPortWidth) {
            xpos = viewPortWidth - 200;
          }
          var ypos = mouse[1] + 5;
          tooltip
            .style("left", xpos + "px")
            .style("top", ypos + "px");
        })
        .on("mouseover", (d, i) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(this.opt.tooltipContent[i])
            .style("font-size", this.opt.tooltipFontSize)
            .style("font-family", this.opt.tooltipFontType)
            .style("left", (d.x - 5) + "px")
            .style("top", (d.y - 5) + "px");
          })
        .on("mouseout", () => {
              tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);
        });
    // now labels
    var textspot = svg.selectAll("text.toplabel")
      .data(ahexbin(this.calculatedPoints));

    let dynamicLabelFontSize = activeLabelFontSize;
    let dynamicValueFontSize = activeValueFontSize;
    //console.log("DynamicLabelFontSize: " + dynamicLabelFontSize);
    //console.log("DynamicValueFontSize: " + dynamicValueFontSize);
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


    textspot.enter()
      .append("text")
      .attr("class", function(_, i) {
        return "valueLabel" + i;
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y + (activeLabelFontSize / 2 ) + 20; // offset by fontsize and 10px vertical padding
      })
      .attr("text-anchor", "middle")
      .attr("font-family", this.opt.polystat.fontType)
      .attr("fill", "black")
      .attr("font-size", dynamicLabelFontSize + "px")
      .text( (_, i) => {
        // animation/displaymode can modify what is being displayed
        let counter = 0;
        let dataLen = this.data.length;
        // search for a value but not more than number of data items
        // need to find the longest content string generated to determine the
        // dynamic font size
        // this always starts from frame 0, look through every metric including composite members for the longest text possible
        // get the total count of metrics (with composite members), and loop through
        let submetricCount = this.data[i].members.length;
        //let longestDisplayedValueContent = "";
        if (submetricCount > 0) {
          while (counter < submetricCount) {
            let checkContent = this.formatValueContent(i, counter, this);
            if (checkContent) {
              if (checkContent.length > longestDisplayedValueContent.length) {
                longestDisplayedValueContent = checkContent;
              }
            }
            counter++;
          }
        }// else {
          // non-composites use the formatted size of the metric value
        //  longestDisplayedValueContent = this.formatValueContent(i, counter, this);
        //}
        //console.log("animated: longestDisplayedValueContent: " + longestDisplayedValueContent);
        let content = null;
        counter = 0;
        while ((content === null) && (counter < dataLen)) {
          content = this.formatValueContent(i, (frames + counter), this);
          counter++;
        }
        dynamicValueFontSize = getTextSizeForWidthAndHeight(
          longestDisplayedValueContent,
          "?px sans-serif",  // use sans-serif for sizing
          shapeWidth,   // pad
          shapeHeight / 3,
          6,
          this.maxFont);
        //console.log("Calc: Dynamic Value Font Size: " + dynamicValueFontSize);

        // value should never be larger than the label
        if (dynamicValueFontSize > dynamicLabelFontSize) {
          dynamicValueFontSize = dynamicLabelFontSize;
        }
        //console.log("animated: dynamicLabelFontSize: " + dynamicLabelFontSize);
        //console.log("animated: dynamicValueFontSize: " + dynamicValueFontSize);
        var valueTextLocation = svg.select("text.valueLabel" + i);
        // use the dynamic size for the value
        valueTextLocation.attr("font-size", dynamicValueFontSize + "px");
        d3.interval( () => {
          var valueTextLocation = svg.select("text.valueLabel" + i);
          var compositeIndex = i;
          valueTextLocation.text( () => {
            // animation/displaymode can modify what is being displayed
            valueTextLocation.attr("font-size", dynamicValueFontSize + "px");

            let content = null;
            let counter = 0;
            let dataLen = this.data.length * 2;
            // search for a value cycling through twice to allow rollover
            while ((content === null) && (counter < dataLen)) {
              content = this.formatValueContent(compositeIndex, (frames + counter), this);
              counter++;
            }
            if (content === null) {
              return "";
            }
            if (content === "") {
              // TODO: add custom content for composite ok state
              content = "";
              // set the font size to be the same as the label above
              //valueTextLocation.attr("font-size", dynamicValueFontSize + "px");
            }
            return content;
          });
          frames++;
        }, this.opt.animationSpeed);
        return content;
      });
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
    // if there's no valueFormatted, there's nothing to display
    if (!content) {
      return null;
    }
    if ((data.prefix) && (data.prefix.length > 0)) {
      content = data.prefix + " " + content;
    }
    if ((data.suffix) && (data.suffix.length > 0)) {
      content = content + " " + data.suffix;
    }
    // a composite will contain the "worst" case as the valueFormatted,
    // and will have all of the members of the composite included.
    // as frames increment find a triggered member starting from the frame mod len
    let len = data.members.length;
    if (len > 0) {
      let triggeredIndex = -1;
      if (data.animateMode === "all") {
        triggeredIndex = frames % len;
        //console.log("triggeredIndex from all mode: " + triggeredIndex);
      } else {
        if (typeof(data.triggerCache) === "undefined") {
          data.triggerCache = this.buildTriggerCache(data);
        }
        let z = frames % data.triggerCache.length;
        triggeredIndex = data.triggerCache[z].index;
        //console.log("triggeredIndex from cache is: " + triggeredIndex);
      }
      let aMember = data.members[triggeredIndex];

      content = aMember.name + ": " + aMember.valueFormatted;
      if ((aMember.prefix) && (aMember.prefix.length > 0)) {
        content = aMember.prefix + " " + content;
      }
      if ((aMember.suffix) && (aMember.suffix.length > 0)) {
        content = content + " " + aMember.suffix;
      }
    }
    // allow templating
    //
    if ((content) && (content.length > 0)) {
      try {
        let replacedContent = thisRef.templateSrv.replaceWithText(content);
        content = replacedContent;
      } catch (err) {
        console.log("ERROR: template server threw error: " + err);
      }
    }
    return content;
  }

  buildTriggerCache(item) {
    //console.log("Building trigger cache for item");
    let triggerCache = [];
    for (let i = 0; i < item.members.length; i++) {
      let aMember = item.members[i];
      if (aMember.thresholdLevel > 0) {
        // add to list
        let cachedMemberState = { index: i, name: aMember.name, value: aMember.value, thresholdLevel: aMember.thresholdLevel };
        triggerCache.push(cachedMemberState);
      }
    }
    // sort it
    triggerCache = _.orderBy(triggerCache, ["thresholdLevel", "value", "name"], ["desc", "desc", "asc"]);
    return triggerCache;
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
    // The height of the total display will be
    // this.autoHeight = this.numRows * 3 / 2 * this.hexRadius + 1 / 2 * this.hexRadius;
    // which is the same as
    this.autoHeight = (this.numRows + 1 / 3) * 3 / 2 * this.hexRadius;
    this.autoHeight -= this.margin.top - this.margin.bottom;
    //console.log("autoheight = " + this.autoHeight);
    // The width of the total display will be
    // this.autoWidth = this.numColumns * Math.sqrt(3) * this.hexRadius + Math.sqrt(3) / 2 * this.hexRadius;
    // which is the same as
    this.autoWidth = (this.numColumns + 1 / 2) * Math.sqrt(3) * this.hexRadius;
    this.autoWidth -= this.margin.left - this.margin.right;
    //console.log("autowidth = " + this.autoWidth + " autoheight = " + this.autoHeight);
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
    // when duplicating panels, this gets odd
    if (this.numRows === Infinity) {
      //console.log("numRows infinity...");
      return points;
    }
    if (this.numColumns === NaN) {
      //console.log("numColumns NaN");
      return points;
    }
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
