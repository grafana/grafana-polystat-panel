import * as d3 from 'd3';
/**
 * LayoutManager creates layouts for supported polygon shapes
 */
export class LayoutManager {
  width: number;
  height: number;
  numColumns: number;
  numRows: number;
  radius: number;
  maxRowsUsed: number;
  maxColumnsUsed: number;
  displayLimit: number;
  shape: string;

  constructor(width: number, height: number, numColumns: number, numRows: number, displayLimit: number, shape: string) {
    this.width = width;
    this.height = height;
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.maxColumnsUsed = 0;
    this.maxRowsUsed = 0;
    this.displayLimit = displayLimit;
    this.shape = shape;
    this.radius = 0;
  }

  /**
   * Sets the radius to be used in all layout calculations
   *
   * @param radius user defined value
   */
  setRadius(radius: number) {
    this.radius = radius;
  }
  setHeight(height: number) {
    this.height = height;
  }
  setWidth(width: number) {
    this.width = width;
  }
  /**
   * returns a layout for hexagons with pointed tops
   */
  generateHexagonPointedTopLayout(): any {
    const layout = {};
    this.radius = this.getHexFlatTopRadius();
    return layout;
  }

  /**
   * returns a layout for square-shapes
   */
  generateSquareLayout(): any {
    const layout = {};
    this.radius = this.getUniformRadius();
    return layout;
  }

  /**
   * The maximum radius the hexagons can have to still fit the screen
   * With (long) radius being R:
   *  - Total width (rows > 1) = 1 small radius (sqrt(3) * R / 2) + columns * small diameter (sqrt(3) * R)
   *  - Total height = 1 pointy top (1/2 * R) + rows * size of the rest (3/2 * R)
   */
  getHexFlatTopRadius(): number {
    const SQRT3 = 1.7320508075688772;
    const polygonBorderSize = 2;
    console.log(`getHexFlatTopRadius initialWidth:${this.width} initialHeight:${this.height}`);
    console.log(`getHexFlatTopRadius numColumns:${this.numColumns} numRows:${this.numRows}`);

    let hexRadius = d3.min([this.width / ((this.numColumns + 0.5) * SQRT3), this.height / ((this.numRows + 1 / 3) * 1.5)]);
    hexRadius = hexRadius - polygonBorderSize; // TODO: borderRadius should be configurable and part of the config
    console.log(`getHexFlatTopRadius hexRadius:${hexRadius}`);

    return this.truncateFloat(hexRadius);
  }

  /*
  getRenderedDimensions(): any {
    switch (this.shape) {
      case 'hexagon_pointed_top':
        const { verticalHeight, horizontalHeight } = this.getHexFlatTopRadiusBoth();
        //verticalHeight *= this.maxRowsUsed;
        //horizontalHeight *= this.maxColumnsUsed;
        return { verticalHeight, horizontalHeight };
        break;
      case 'circle':
        return this.getUniformRadiusBoth();
        break;
      case 'square':
        return this.getUniformRadiusBoth();
        break;
      default:
        return this.getHexFlatTopRadiusBoth();
        break;
    }
  }
  */
  getHexFlatTopRadiusBoth(): any {
    //The maximum radius the hexagons can have to still fit the screen
    // With (long) radius being R:
    // - Total width (rows > 1) = 1 small radius (sqrt(3) * R / 2) + columns * small diameter (sqrt(3) * R)
    // - Total height = 1 pointy top (1/2 * R) + rows * size of the rest (3/2 * R)
    const verticalHeight = (2 * this.width) / (Math.sqrt(3) * (1 + 2 * this.maxColumnsUsed));
    const horizontalHeight = (2 * this.height) / (3 * this.maxRowsUsed + 1);
    return { verticalHeight, horizontalHeight };
  }

  getUniformRadiusBoth(): any {
    const verticalHeight = this.width / this.maxColumnsUsed;
    let horizontalHeight = this.height / this.maxRowsUsed;
    // default to use the horizontal maximum size
    if (horizontalHeight > verticalHeight) {
      // vertically limited
      horizontalHeight = verticalHeight;
    }

    return { verticalHeight, horizontalHeight };
  }
  /**
   * Given the number of columns and rows, calculate the maximum size of a uniform shaped polygon that can be used
   *   uniformed shapes are: square/circle
   * width divided by the number of columns determines the max horizontal of the square
   * height divided by the number of rows determines the max vertical size ofthe square
   * the smaller of the two is used since that is the "best fit" for a square
   */
  getUniformRadius(): number {
    // width divided by the number of columns determines the max horizontal of the square
    // height divided by the number of rows determines the max vertical size ofthe square
    // the smaller of the two is used since that is the "best fit" for a square
    const horizontalMax = this.width / this.maxColumnsUsed;
    const verticalMax = this.height / this.maxRowsUsed;
    // default to use the horizontal maximum size
    let radius = horizontalMax / 2;
    if (horizontalMax > verticalMax) {
      // vertically limited
      radius = verticalMax / 2;
    }
    return radius;
  }

  generatePossibleColumnAndRowsSizes(columnAutoSize: boolean, rowAutoSize: boolean, dataSize: number) {
    if (rowAutoSize && columnAutoSize) {
      // sqrt of # data items
      const squared = Math.sqrt(dataSize);
      // favor columns when width is greater than height
      // favor rows when width is less than height
      if (this.width > this.height) {
        this.numColumns = Math.ceil((this.width / this.height) * squared);
        // always at least 1 column and max. data.length columns
        if (this.numColumns < 1) {
          this.numColumns = 1;
        } else if (this.numColumns > dataSize) {
          this.numColumns = dataSize;
        }

        // Align rows count to computed columns count
        this.numRows = Math.ceil(dataSize / this.numColumns);
        // always at least 1 row
        if (this.numRows < 1) {
          this.numRows = 1;
        }
      } else {
        this.numRows = Math.ceil((this.height / this.width) * squared);
        // always at least 1 row and max. data.length rows
        if (this.numRows < 1) {
          this.numRows = 1;
        } else if (this.numRows > dataSize) {
          this.numRows = dataSize;
        }
        // Align colunns count to computed rows count
        this.numColumns = Math.ceil(dataSize / this.numRows);
        // always at least 1 column
        if (this.numColumns < 1) {
          this.numColumns = 1;
        }
      }
    } else if (rowAutoSize) {
      // Align rows count to fixed columns count
      this.numRows = Math.ceil(dataSize / this.numColumns);
      // always at least 1 row
      if (this.numRows < 1) {
        this.numRows = 1;
      }
    } else if (columnAutoSize) {
      // Align colunns count to fixed rows count
      this.numColumns = Math.ceil(dataSize / this.numRows);
      // always at least 1 column
      if (this.numColumns < 1) {
        this.numColumns = 1;
      }
    }
    console.log(`Calculated columns = ${this.numColumns}`);
    console.log(`Calculated rows = ${this.numRows}`);
    console.log(`Number of data items to render = ${dataSize}`);
  }

  /**
   * This determines how many rows and columns are going to be rendered, which can then
   * be used to calculate the radius size (which is needed before generating points)
   * @param data metrics
   * @param displayLimit max number of polygons to show
   */
  generateActualColumnAndRowUsage(data: any, displayLimit: number) {
    let polygonsUsed = 0;
    let maxRowsUsed = 0;
    let columnsUsed = 0;
    let maxColumnsUsed = 0;
    for (let i = 0; i < this.numRows; i++) {
      if ((!displayLimit || polygonsUsed < displayLimit) && polygonsUsed < data.length) {
        maxRowsUsed += 1;
        columnsUsed = 0;
        for (let j = 0; j < this.numColumns; j++) {
          if ((!displayLimit || polygonsUsed < displayLimit) && polygonsUsed < data.length) {
            columnsUsed += 1;
            // track the most number of columns
            if (columnsUsed > maxColumnsUsed) {
              maxColumnsUsed = columnsUsed;
            }
            polygonsUsed++;
          }
        }
      }
    }
    console.log(`generateActualColumnAndRowUsage: Actual rows used: ${maxRowsUsed}`);
    console.log(`generateActualColumnAndRowUsage: Actual columns used: ${maxColumnsUsed}`);
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
  }
  shapeToCoordinates(shape: string, radius: number, column: number, row: number) {
    switch (shape) {
      case 'hexagon_pointed_top':
        let x = radius * column * Math.sqrt(3);
        //Offset each uneven row by half of a "hex-width" to the right
        if (row % 2 === 1) {
          x += (radius * Math.sqrt(3)) / 2;
        }
        const y = radius * row * 1.5;
        return [x, y];
        break;
      case 'circle':
        return [radius * column * 2, radius * row * 2];
        break;
      case 'square':
        return [radius * column * 2, radius * row * 2];
        break;
      default:
        return [radius * column * 1.75, radius * row * 1.5];
        break;
    }
  }

  // Builds the placeholder polygons needed to represent each metric
  generatePoints(data: any, displayLimit: number): any {
    const points = [];
    if (typeof data === 'undefined') {
      return points;
    }
    let maxRowsUsed = 0;
    let columnsUsed = 0;
    let maxColumnsUsed = 0;
    // when duplicating panels, this gets odd
    if (this.numRows === Infinity) {
      return points;
    }
    if (isNaN(this.numColumns)) {
      return points;
    }
    for (let i = 0; i < this.numRows; i++) {
      if ((!displayLimit || points.length < displayLimit) && points.length < data.length) {
        maxRowsUsed += 1;
        columnsUsed = 0;
        for (let j = 0; j < this.numColumns; j++) {
          if ((!displayLimit || points.length < displayLimit) && points.length < data.length) {
            columnsUsed += 1;
            // track the most number of columns
            if (columnsUsed > maxColumnsUsed) {
              maxColumnsUsed = columnsUsed;
            }
            // TODO: this is still for pointedtop polygons!
            //points.push([this.radius * j * 1.75, this.radius * i * 1.5]);
            points.push(this.shapeToCoordinates(this.shape, this.radius, j, i));
          }
        }
      }
    }
    console.log(`Max rows used: ${maxRowsUsed}`);
    console.log(`Actual columns used: ${maxColumnsUsed}`);
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
    return points;
  }

  getRadius(): number {
    return this.radius;
  }

  generateRadius(shape: string): number {
    let radius = 0;
    switch (shape) {
      case 'hexagon_pointed_top':
        radius = this.getHexFlatTopRadius();
        break;
      case 'circle':
        radius = this.getUniformRadius();
        break;
      case 'square':
        radius = this.getUniformRadius();
        break;
      default:
        radius = this.getHexFlatTopRadius();
        break;
    }
    this.radius = radius;
    return radius;
  }

  truncateFloat(value: number): number {
    const with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return Number(with2Decimals);
  }

  getOffsets(dataSize: number): any {
    const SQRT3 = 1.7320508075688772;
    console.log(`getOffsets dataSize:${dataSize}`);
    console.log(`getOffsets initialWidth:${this.width} initialHeight:${this.height}`);
    console.log(`getOffsets numColumns:${this.numColumns} numRows:${this.numRows}`);

    let hexRadius = d3.min([this.width / ((this.numColumns + 0.5) * Math.sqrt(3)), this.height / ((this.numRows + 1 / 3) * 1.5)]);
    hexRadius = this.truncateFloat(hexRadius);
    console.log(`getOffsets hexRadius:${hexRadius}`);

    const usedWidth = Math.ceil(this.numColumns * hexRadius * SQRT3 + hexRadius);
    console.log(`getOffsets usedWidth:${usedWidth}`);

    const shapeWidth = this.truncateFloat(hexRadius * SQRT3);
    const shapeHeight = this.truncateFloat(hexRadius * 2);
    console.log(`getOffsets shapeWidth:${shapeWidth} shapeHeight:${shapeHeight}`);

    const offsetToViewY = shapeHeight * 0.5;
    //const offsetToViewY = 0;
    console.log(`getOffsets offsetToViewY:${offsetToViewY}`);
    // even rows are half-sized
    const { oddCount, evenCount } = this.getOddEvenCountForRange(1, this.maxRowsUsed);
    console.log(`getOffsets for ${this.maxRowsUsed} rows, there are odds:${oddCount} evens: ${evenCount}`);

    // odd-numbered hexagons are full height, evens are half height
    const actualHeightUsed = oddCount * shapeHeight + evenCount * shapeHeight * 0.5;
    console.log(`getOffsets actualHeightUsed:${actualHeightUsed} available height: ${this.height}`);
    let yoffset = (this.height - actualHeightUsed) / 2;
    yoffset = -(yoffset + offsetToViewY);
    console.log(`getOffsets yoffset:${yoffset}`);

    const offsetToViewX = shapeWidth * 0.5;
    console.log(`getOffsets offsetToViewX:${offsetToViewX}`);
    // columns have a half-width offset if there are more than 1 rows
    let widthOffset = 0;
    if (this.numRows > 1) {
      // if the datasize is equal to or larger than the 2*Columns, there is an additional offset needed
      if (dataSize >= this.maxColumnsUsed * 2) {
        widthOffset = 0.5;
      }
    }
    const actualWidthUsed = (this.numColumns + widthOffset) * shapeWidth;
    console.log(`getOffsets actualWidthUsed:${actualWidthUsed}`);
    let xoffset = (this.width - actualWidthUsed) / 2;
    xoffset = -(xoffset + offsetToViewX);
    console.log(`getOffsets xoffset:${xoffset}`);
    return { xoffset, yoffset };
  }

  getOddEvenCountForRange(L: number, R: number): any {
    let oddCount = (R - L) / 2;
    // if either R or L is odd
    if (R % 2 !== 0 || L % 2 !== 0) {
      oddCount++;
    }
    const evenCount = R - L + 1 - oddCount;
    return { oddCount, evenCount };
  }

  getDiameters(): any {
    // d3 calculates the radius for x and y separately based on the value passed in
    const { verticalHeight, horizontalHeight } = this.getHexFlatTopRadiusBoth();
    const diameterX = horizontalHeight * 2;
    const diameterY = verticalHeight * 2;
    return { diameterX, diameterY };
  }
}
