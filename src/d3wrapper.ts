import * as d3 from 'd3';
import * as d3hexbin from 'd3-hexbin';
import { getTextSizeForWidthAndHeight } from './utils';
import _ from 'lodash';
import { Color } from './color';
import { LayoutManager } from './layoutManager';

function resolveClickThroughURL(d: any): string {
  let clickThroughURL = d.clickThrough;
  if (d.sanitizeURLEnabled === true && d.sanitizedURL.length > 0) {
    clickThroughURL = d.sanitizedURL;
  }
  return clickThroughURL;
}

function resolveClickThroughTarget(d: any): string {
  let clickThroughTarget = '_self';
  if (d.newTabEnabled === true) {
    clickThroughTarget = '_blank';
  }
  return clickThroughTarget;
}

function showName(item: any): boolean {
  // check if property exist and check its value
  return !('showName' in item) || item.showName;
}

function showValue(item: any): boolean {
  // check if property exist and check its value
  return !('showValue' in item) || item.showValue;
}

export class D3Wrapper {
  svgContainer: any;
  d3DivId: any;
  opt: any;
  data: any;
  templateSrv: any;
  calculatedPoints: any;
  minFont = 8;
  maxFont = 240;
  purelight: any;

  // layout
  lm: LayoutManager;
  constructor(templateSrv: any, svgContainer: any, d3DivId: any, opt: any) {
    this.templateSrv = templateSrv;
    this.svgContainer = svgContainer;
    this.d3DivId = d3DivId;
    this.data = opt.data;
    this.opt = opt;

    this.purelight = new Color(255, 255, 255);
    // take 10 off the height
    //this.opt.height -= 10;
    //this.opt.width -= 20;
    this.data = this.opt.data;
    this.lm = new LayoutManager(this.opt.width, this.opt.height, opt.columns || 6, opt.rows || 6, this.opt.displayLimit, this.opt.polystat.shape);

    // determine how many rows and columns are going to be generated
    this.lm.generatePossibleColumnAndRowsSizes(this.opt.columnAutoSize, this.opt.rowAutoSize, this.data.length);
    // to determine the radius, the actual number of rows and columns that will be used needs to be calculated
    this.lm.generateActualColumnAndRowUsage(this.data, opt.displayLimit);
    // next the radius can be determined from actual rows and columns being used
    if (!opt.radiusAutoSize && opt.radius) {
      this.lm.setRadius(opt.radius);
    } else {
      this.lm.generateRadius(this.opt.polystat.shape);
    }
    // using the known number of columns and rows that can be used in addition to the radius,
    // generate the points to be filled
    this.calculatedPoints = this.lm.generatePoints(this.data, opt.displayLimit);
  }

  computeTextFontSize(text: string, linesToDisplay: number, textAreaWidth: number, textAreaHeight: number): number {
    return getTextSizeForWidthAndHeight(
      text,
      '?px sans-serif', // use sans-serif for sizing
      textAreaWidth,
      textAreaHeight / linesToDisplay, // multiple lines of text
      this.minFont,
      this.maxFont
    );
  }

  update(data: any) {
    if (data) {
      this.data = data;
    }
  }

  draw() {
    const width = this.opt.width;
    const height = this.opt.height;

    //this.calculatedPoints = this.lm.generatePoints(this.data, this.opt.displayLimit);
    const ahexbin = d3hexbin
      .hexbin()
      .radius(this.lm.generateRadius(this.opt.polystat.shape))
      .extent([
        [0, 0],
        [width, height],
      ]);

    const { diameterX, diameterY } = this.lm.getDiameters();
    const { xoffset, yoffset } = this.lm.getOffsets(this.data);

    // Define the div for the tooltip
    // add it to the body and not the container so it can float outside of the panel
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', this.d3DivId + '-tooltip')
      .attr('class', 'polystat-panel-tooltip')
      .style('opacity', 0);
    const svg: any = d3
      .select(this.svgContainer)
      .attr('width', width + 'px')
      .attr('height', height + 'px')
      .append('svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('width', width + 'px')
      .attr('height', height + 'px')
      .style('border', '0px solid white') // TODO: make this light/dark friendly
      .attr('id', this.d3DivId)
      .append('g')
      .attr('transform', 'translate(' + xoffset + ',' + yoffset + ')');

    const data = this.data;
    const defs = svg.append('defs');

    const colorGradients = Color.createGradients(data);
    for (let i = 0; i < colorGradients.length; i++) {
      //console.log("Name = " + this.d3DivId + "linear-gradient-state-data-" + i);
      const aGradient = defs.append('linearGradient').attr('id', this.d3DivId + 'linear-gradient-state-data-' + i);
      aGradient
        .attr('x1', '30%')
        .attr('y1', '30%')
        .attr('x2', '70%')
        .attr('y2', '70%');
      aGradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorGradients[i].start);
      aGradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorGradients[i].end);
    }
    const okColorStart = new Color(82, 194, 52); // #52c234
    const okColorEnd = okColorStart.Mul(this.purelight, 0.7);
    const okGradient = defs.append('linearGradient').attr('id', this.d3DivId + 'linear-gradient-state-ok');
    okGradient
      .attr('x1', '30%')
      .attr('y1', '30%')
      .attr('x2', '70%')
      .attr('y2', '70%');
    okGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', okColorStart.asHex());
    okGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', okColorEnd.asHex());

    // https://uigradients.com/#JuicyOrange
    const warningColorStart = new Color(255, 200, 55); // #FFC837
    const warningColorEnd = warningColorStart.Mul(this.purelight, 0.7);
    const warningGradient = defs.append('linearGradient').attr('id', this.d3DivId + 'linear-gradient-state-warning');
    warningGradient
      .attr('x1', '30%')
      .attr('y1', '30%')
      .attr('x2', '70%')
      .attr('y2', '70%');
    warningGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', warningColorStart.asHex()); // light orange
    warningGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', warningColorEnd.asHex()); // dark orange

    // https://uigradients.com/#YouTube
    const criticalColorStart = new Color(229, 45, 39); // e52d27
    const criticalColorEnd = criticalColorStart.Mul(this.purelight, 0.7);
    const criticalGradient = defs.append('linearGradient').attr('id', this.d3DivId + 'linear-gradient-state-critical');
    criticalGradient
      .attr('x1', '30%')
      .attr('y1', '30%')
      .attr('x2', '70%')
      .attr('y2', '70%');
    criticalGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', criticalColorStart.asHex()); // light red
    criticalGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', criticalColorEnd.asHex()); // dark red

    // https://uigradients.com/#Ash
    const unknownGradient = defs.append('linearGradient').attr('id', this.d3DivId + 'linear-gradient-state-unknown');
    unknownGradient
      .attr('x1', '30%')
      .attr('y1', '30%')
      .attr('x2', '70%')
      .attr('y2', '70%');
    unknownGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#73808A'); // light grey
    unknownGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#757F9A'); // dark grey

    let customShape = null;
    // compute text area size (used to calculate the fontsize)
    const textAreaWidth = diameterX;
    const textAreaHeight = diameterY / 2; // Top and bottom of hexagon are not used
    // symbols use the area for their size
    let innerArea = diameterX * diameterY;
    // use the smaller of diameterX or Y
    if (diameterX < diameterY) {
      innerArea = diameterX * diameterX;
    }
    if (diameterY < diameterX) {
      innerArea = diameterY * diameterY;
    }
    const symbol = d3.symbol().size(innerArea);
    switch (this.opt.polystat.shape) {
      case 'hexagon_pointed_top':
        customShape = ahexbin.hexagon(this.lm.getRadius());
        break;
      case 'hexagon_flat_top':
        customShape = ahexbin.hexagon(this.lm.getRadius());
        break;
      case 'circle':
        customShape = symbol.type(d3.symbolCircle);
        break;
      case 'square':
        customShape = symbol.type(d3.symbolSquare);
        break;
      default:
        customShape = ahexbin.hexagon(this.lm.getRadius());
        break;
    }

    // calculate the fontsize based on the shape and the text
    let activeLabelFontSize = this.opt.polystat.fontSize;
    // font sizes are independent for label and values
    let activeValueFontSize = this.opt.polystat.fontSize;

    // compute font size if autoscale is activated
    if (this.opt.polystat.fontAutoScale) {
      // find the most text that will be displayed over all items
      let maxLabel = '';
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].name.length > maxLabel.length) {
          maxLabel = this.data[i].name;
        }
      }
      // same for the value, also check for submetrics size in case of composite
      let maxValue = '';
      for (let i = 0; i < this.data.length; i++) {
        //console.log("Checking len: " + this.data[i].valueFormatted + " vs: " + maxValue);
        if (this.data[i].valueFormatted.length > maxValue.length) {
          maxValue = this.data[i].valueFormatted;
        }
        const submetricCount = this.data[i].members.length;
        if (submetricCount > 0) {
          let counter = 0;
          while (counter < submetricCount) {
            const checkContent = this.formatValueContent(i, counter, this);
            //console.log("Checking len: \"" + checkContent + "\" vs: \"" + maxValue + "\"");
            if (checkContent && checkContent.length > maxValue.length) {
              maxValue = checkContent;
            }
            counter++;
          }
        }
      }
      // estimate how big of a font can be used
      // Two lines of text must fit with vertical spacing included
      // if it is too small, hide everything
      activeLabelFontSize = this.computeTextFontSize(maxLabel, 2, textAreaWidth, textAreaHeight);
      activeValueFontSize = this.computeTextFontSize(maxValue, 2, textAreaWidth, textAreaHeight);

      // value should never be larger than the label
      if (activeValueFontSize > activeLabelFontSize) {
        activeValueFontSize = activeLabelFontSize;
      }
    }

    // compute alignment for each text element, base coordinate is at the center of the polygon (text is anchored at its bottom):
    // - Value text (bottom text) will be aligned (positively i.e. lower) in the middle of the bottom half of the text area
    // - Label text (top text) will be aligned (negatively, i.e. higher) in the middle of the top half of the text area
    const valueWithLabelTextAlignment = textAreaHeight / 2 / 2 + activeValueFontSize / 2;
    const valueOnlyTextAlignment = activeValueFontSize / 2;
    const labelWithValueTextAlignment = -(textAreaHeight / 2 / 2) + activeLabelFontSize / 2;
    const labelOnlyTextAlignment = activeLabelFontSize / 2;

    svg
      .selectAll('.hexagon')
      .data(ahexbin(this.calculatedPoints))
      .enter()
      .each((_, i, nodes) => {
        let node = d3.select(nodes[i]);
        const clickThroughURL = resolveClickThroughURL(data[i]);
        if (clickThroughURL.length > 0) {
          node = node
            .append('a')
            .attr('target', resolveClickThroughTarget(data[i]))
            .attr('xlink:href', clickThroughURL);
        }
        let fillColor = data[i].color;
        if (this.opt.polystat.gradientEnabled) {
          // safari needs the location.href
          fillColor = 'url(' + location.href + '#' + this.d3DivId + 'linear-gradient-state-data-' + i + ')';
        }
        node
          .append('path')
          .attr('class', 'hexagon')
          .attr('transform', (d: any) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          })
          .attr('d', customShape)
          .attr('stroke', this.opt.polystat.polygonBorderColor)
          .attr('stroke-width', this.opt.polystat.polygonBorderSize + 'px')
          .style('fill', fillColor)
          .on('mousemove', () => {
            // use the viewportwidth to prevent the tooltip from going too far right
            const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            // use the mouse position for the entire page
            const mouse = d3.mouse(d3.select('body').node()[0]);
            let xpos = mouse[0] - 50;
            // don't allow offscreen tooltip
            if (xpos < 0) {
              xpos = 0;
            }
            // prevent tooltip from rendering outside of viewport
            if (xpos + 200 > viewPortWidth) {
              xpos = viewPortWidth - 200;
            }
            const ypos = mouse[1] + 5;
            tooltip.style('left', xpos + 'px').style('top', ypos + 'px');
          })
          .on('mouseover', (d: any) => {
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltip
              .html(this.opt.tooltipContent[i])
              .style('font-size', this.opt.tooltipFontSize)
              .style('font-family', this.opt.tooltipFontType)
              .style('left', d.x - 5 + 'px')
              .style('top', d.y - 5 + 'px');
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(500)
              .style('opacity', 0);
          });
      });

    // now labels
    const textspot = svg.selectAll('text.toplabel').data(ahexbin(this.calculatedPoints));

    textspot
      .enter()
      .append('text')
      .attr('class', 'toplabel')
      .attr('x', d => {
        return d.x;
      })
      .attr('y', (d, i) => {
        const item = data[i];
        let alignment = labelOnlyTextAlignment;
        if (showValue(item)) {
          alignment = labelWithValueTextAlignment;
        }
        return d.y + alignment;
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', this.opt.polystat.fontType)
      .attr('font-size', activeLabelFontSize + 'px')
      .attr('fill', 'black')
      .style('pointer-events', 'none')
      .text((_, i) => {
        const item = data[i];
        if (showName(item)) {
          return item.name;
        }
        return '';
      });

    let frames = 0;

    textspot
      .enter()
      .append('text')
      .attr('class', (_, i) => {
        return 'valueLabel' + i;
      })
      .attr('x', d => {
        return d.x;
      })
      .attr('y', (d, i) => {
        const item = data[i];
        let alignment = valueOnlyTextAlignment;
        if (showName(item)) {
          alignment = valueWithLabelTextAlignment;
        }
        return d.y + alignment;
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', this.opt.polystat.fontType)
      .attr('fill', 'black')
      .attr('font-size', activeValueFontSize + 'px')
      .style('pointer-events', 'none')
      .text((_, i) => {
        // animation/displaymode can modify what is being displayed
        let counter = 0;
        const dataLen = this.data.length;
        let content = null;
        while (content === null && counter < dataLen) {
          content = this.formatValueContent(i, frames + counter, this);
          counter++;
        }
        const valueTextLocation = svg.select('text.valueLabel' + i);
        // use the dynamic size for the value
        valueTextLocation.attr('font-size', activeValueFontSize + 'px');
        d3.interval(() => {
          const valueTextLocation = svg.select('text.valueLabel' + i);
          const compositeIndex = i;
          valueTextLocation.text(() => {
            // animation/displaymode can modify what is being displayed
            valueTextLocation.attr('font-size', activeValueFontSize + 'px');

            let content = null;
            let counter = 0;
            const dataLen = this.data.length * 2;
            // search for a value cycling through twice to allow rollover
            while (content === null && counter < dataLen) {
              content = this.formatValueContent(compositeIndex, frames + counter, this);
              counter++;
            }
            if (content === null) {
              return '';
            }
            if (content === '') {
              // TODO: add custom content for composite ok state
              content = '';
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
    const data = thisRef.data[i];
    // options can specify to not show the value
    if (typeof data !== 'undefined') {
      if (data.hasOwnProperty('showValue')) {
        if (!data.showValue) {
          return '';
        }
      }
      if (!data.hasOwnProperty('valueFormatted')) {
        return '';
      }
    } else {
      // no data, return nothing
      return '';
    }
    switch (data.animateMode) {
      case 'all':
        break;
      case 'triggered':
        // return nothing if mode is triggered and the state is 0
        if (data.thresholdLevel < 1) {
          return '';
        }
    }
    let content = data.valueFormatted;
    // if there's no valueFormatted, there's nothing to display
    if (!content) {
      return null;
    }
    if (data.prefix && data.prefix.length > 0) {
      content = data.prefix + ' ' + content;
    }
    if (data.suffix && data.suffix.length > 0) {
      content = content + ' ' + data.suffix;
    }
    // a composite will contain the "worst" case as the valueFormatted,
    // and will have all of the members of the composite included.
    // as frames increment find a triggered member starting from the frame mod len
    const len = data.members.length;
    if (len > 0) {
      let triggeredIndex = -1;
      if (data.animateMode === 'all') {
        triggeredIndex = frames % len;
        //console.log("triggeredIndex from all mode: " + triggeredIndex);
      } else {
        if (typeof data.triggerCache === 'undefined') {
          data.triggerCache = this.buildTriggerCache(data);
        }
        const z = frames % data.triggerCache.length;
        triggeredIndex = data.triggerCache[z].index;
        //console.log("triggeredIndex from cache is: " + triggeredIndex);
      }
      const aMember = data.members[triggeredIndex];

      content = aMember.name + ': ' + aMember.valueFormatted;
      if (aMember.prefix && aMember.prefix.length > 0) {
        content = aMember.prefix + ' ' + content;
      }
      if (aMember.suffix && aMember.suffix.length > 0) {
        content = content + ' ' + aMember.suffix;
      }
    }
    // allow templating
    //
    if (content && content.length > 0) {
      try {
        const replacedContent = thisRef.templateSrv.replaceWithText(content);
        content = replacedContent;
      } catch (err) {
        console.log('ERROR: template server threw error: ' + err);
      }
    }
    return content;
  }

  buildTriggerCache(item) {
    //console.log("Building trigger cache for item");
    let triggerCache = [];
    for (let i = 0; i < item.members.length; i++) {
      const aMember = item.members[i];
      if (aMember.thresholdLevel > 0) {
        // add to list
        const cachedMemberState = { index: i, name: aMember.name, value: aMember.value, thresholdLevel: aMember.thresholdLevel };
        triggerCache.push(cachedMemberState);
      }
    }
    // sort it
    triggerCache = _.orderBy(triggerCache, ['thresholdLevel', 'value', 'name'], ['desc', 'desc', 'asc']);
    return triggerCache;
  }
}
