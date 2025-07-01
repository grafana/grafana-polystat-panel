import * as d3 from 'd3';
import { PolygonShapes, PolystatDiameters } from '../types';
import { LayoutPoint } from './types';
/**
 * LayoutManager creates layouts for supported polygon shapes
 */
export class LayoutManager {
  width: number;
  height: number;
  numColumns: number;
  numRows: number;
  radius: number;
  autoSize: boolean;
  maxRowsUsed: number;
  maxColumnsUsed: number;
  displayLimit: number;
  shape: PolygonShapes;
  readonly SQRT3 = 1.7320508075688772;

  constructor(
    width: number,
    height: number,
    numColumns: number,
    numRows: number,
    displayLimit: number,
    autoSize: boolean,
    shape: PolygonShapes
  ) {
    this.width = width;
    this.height = height;
    // check for less than 1 or NaN, force to 8
    if (numColumns < 1 || isNaN(numColumns)) {
      this.numColumns = 8;
    } else {
      this.numColumns = numColumns;
    }
    // check for less than 1 or NaN, force to 8
    if (numRows < 1 || isNaN(numRows)) {
      this.numRows = 8;
    } else {
      this.numRows = numRows;
    }

    this.maxColumnsUsed = 0;
    this.maxRowsUsed = 0;

    // negative or NaN limit gets set to 100, 0 is allowed for unlimited
    if (displayLimit < 0 || isNaN(displayLimit)) {
      this.displayLimit = 100;
    } else {
      this.displayLimit = displayLimit;
    }
    this.shape = shape;
    this.radius = 0;
    this.autoSize = autoSize;
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
  generateUniformLayout(): any {
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
    const polygonBorderSize = 0; // TODO: borderRadius should be configurable and part of the config
    let hexRadius = d3.min([
      this.width / ((this.numColumns + 0.5) * this.SQRT3),
      this.height / ((this.numRows + 1 / 3) * 1.5),
    ]);
    if (hexRadius !== undefined) {
      hexRadius = hexRadius - polygonBorderSize;
      return this.truncateFloat(hexRadius);
    }
    // default to a reasonable value (should not happen though)
    return 40;
  }

  /**
   * Helper method to return rendered width and height of hexagon shape
   */
  getHexFlatTopDiameters(): PolystatDiameters {
    const hexRadius = this.getHexFlatTopRadius();
    const diameterX = this.truncateFloat(hexRadius * this.SQRT3);
    const diameterY = this.truncateFloat(hexRadius * 2);
    return { diameterX, diameterY };
  }

  /**
   * Helper method to return rendered width and height of a circle/square shapes
   */
  getUniformDiameters(): PolystatDiameters {
    const radius = this.getUniformRadius();
    const diameterX = radius * 2;
    const diameterY = radius * 2;
    return { diameterX, diameterY };
  }
  /**
   * Given the number of columns and rows, calculate the maximum size of a uniform shaped polygon that can be used
   *   uniformed shapes are: square/circle
   * width divided by the number of columns determines the max horizontal of the square
   * height divided by the number of rows determines the max vertical size of the square
   * the smaller of the two is used since that is the "best fit" for a square
   */
  getUniformRadius(): number {
    const polygonBorderSize = 0; // TODO: borderRadius should be configurable and part of the config
    // width divided by the number of columns determines the max horizontal of the square
    // height divided by the number of rows determines the max vertical size of the square
    // the smaller of the two is used since that is the "best fit"
    const horizontalMax = (this.width / this.maxColumnsUsed) * 0.5;
    const verticalMax = (this.height / this.maxRowsUsed) * 0.5;
    let uniformRadius = horizontalMax;
    if (uniformRadius > verticalMax) {
      // vertically limited
      uniformRadius = verticalMax;
    }
    // internal border
    uniformRadius = uniformRadius - polygonBorderSize;
    return this.truncateFloat(uniformRadius);
  }

  generatePossibleColumnAndRowsSizes(columnAutoSize: boolean, rowAutoSize: boolean, displayLimit: number, dataSize: number) {
    if (isNaN(displayLimit) || displayLimit < 0) {
      displayLimit = 100;
    }
    let useLimit = displayLimit;
    if ((displayLimit === 0) || (displayLimit > dataSize)) {
      useLimit = dataSize;
    }
    if (rowAutoSize && columnAutoSize) {
      // sqrt of # data items
      const squared = Math.sqrt(useLimit);
      // favor columns when width is greater than height
      // favor rows when width is less than height
      if (this.width > this.height) {
        this.numColumns = Math.ceil((this.width / this.height) * squared * 0.75);
        // always at least 1 column and max. data.length columns
        if (this.numColumns < 1) {
          this.numColumns = 1;
        } else if (this.numColumns > useLimit) {
          this.numColumns = useLimit;
        }

        // Align rows count to computed columns count
        this.numRows = Math.ceil(useLimit / this.numColumns);
        // always at least 1 row
        if (this.numRows < 1) {
          this.numRows = 1;
        }
      } else {
        this.numRows = Math.ceil((this.height / this.width) * squared * 0.75);
        // always at least 1 row and max. data.length rows
        if (this.numRows < 1) {
          this.numRows = 1;
        } else if (this.numRows > useLimit) {
          this.numRows = useLimit;
        }
        // Align columns count to computed rows count
        this.numColumns = Math.ceil(useLimit / this.numRows);
        // always at least 1 column
        if (this.numColumns < 1) {
          this.numColumns = 1;
        }
      }
    } else if (rowAutoSize) {
      // Align rows count to fixed columns count
      this.numRows = Math.ceil(useLimit / this.numColumns);
      // always at least 1 row
      if (this.numRows < 1) {
        this.numRows = 1;
      }
    } else if (columnAutoSize) {
      // Align columns count to fixed rows count
      this.numColumns = Math.ceil(useLimit / this.numRows);
      // always at least 1 column
      if (this.numColumns < 1) {
        this.numColumns = 1;
      }
    }
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
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
  }

  shapeToCoordinates(shape: PolygonShapes, radius: number, column: number, row: number) {
    switch (shape) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        let x = radius * column * this.SQRT3;
        //Offset each uneven row by half of a "hex-width" to the right
        if (row % 2 === 1) {
          x += (radius * this.SQRT3) / 2;
        }
        const y = radius * row * 1.5;
        return [x, y];
      case PolygonShapes.CIRCLE:
        return [radius * column * 2, radius * row * 2];
      case PolygonShapes.SQUARE:
        return [radius * column * 2, radius * row * 2];
      default:
        return [radius * column * 1.75, radius * row * 1.5];
    }
  }

  // Builds the placeholder polygons needed to represent each metric
  generatePoints(data: any, displayLimit: number, shape: PolygonShapes): LayoutPoint[] {
    const points: LayoutPoint[] = [];
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
            let coords = this.shapeToCoordinates(shape, this.radius, j, i);
            const aPoint: LayoutPoint = {
              x: coords[0],
              y: coords[1],
            }
            points.push(aPoint);
          }
        }
      }
    }
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
    return points;
  }

  generateUniformPoints(data: any, displayLimit: number): any {
    const points = [] as any;
    if (typeof data === 'undefined') {
      return points;
    }
    let maxRowsUsed = 0;
    let columnsUsed = 0;
    let maxColumnsUsed = 0;
    let xPos = 1;
    let yPos = 1;

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
            points.push({
              x: xPos,
              y: yPos,
              width: this.radius * 2,
              height: this.radius * 2,
            });
            xPos += this.radius * 2;
          }
        }
        xPos = 1;
        yPos += this.radius * 2;
      }
    }
    this.maxRowsUsed = maxRowsUsed;
    this.maxColumnsUsed = maxColumnsUsed;
    return points;
  }

  generateRadius(shape: PolygonShapes): number {
    if (!this.autoSize) {
      return this.radius;
    }
    let radius = 0;
    switch (shape) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        radius = this.getHexFlatTopRadius();
        break;
      case PolygonShapes.CIRCLE:
        radius = this.getUniformRadius();
        break;
      case PolygonShapes.SQUARE:
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
    if (value === Infinity || isNaN(value)) {
      return 0;
    }
    const matches = value.toString().match(/^-?\d+(?:\.\d{0,2})?/);
    if (matches !== null && matches.length > 0) {
      return Number(matches[0]);
    }
    return 0;
  }

  getOffsets(shape: PolygonShapes, displayLimit: number, dataSize: number): any {
    if (isNaN(displayLimit) || displayLimit < 0) {
      displayLimit = 100;
    }
    let useLimit = displayLimit;
    if ((displayLimit === 0) || (displayLimit > dataSize)) {
      useLimit = dataSize;
    }
    switch (shape) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        return this.getOffsetsHexagonPointedTop(useLimit);
      case PolygonShapes.SQUARE:
        return this.getOffsetsSquare(useLimit);
      case PolygonShapes.CIRCLE:
        return this.getOffsetsUniform(useLimit);
      default:
        return this.getOffsetsUniform(useLimit);
    }
  }

  getOffsetsHexagonPointedTop(dataSize: number): any {
    let hexRadius = d3.min([
      this.width / ((this.numColumns + 0.5) * this.SQRT3),
      this.height / ((this.numRows + 1 / 3) * 1.5),
    ]);
    hexRadius = this.truncateFloat(hexRadius as number);
    const shapeWidth = this.truncateFloat(hexRadius * this.SQRT3);
    const shapeHeight = this.truncateFloat(hexRadius * 2);

    const offsetToViewY = shapeHeight * 0.5;
    // even rows are half-sized
    const { oddCount, evenCount } = this.getOddEvenCountForRange(1, this.maxRowsUsed);
    // odd-numbered hexagons are full height, evens are half height
    const actualHeightUsed = oddCount * shapeHeight + evenCount * shapeHeight * 0.5;
    let yoffset = (this.height - actualHeightUsed) / 2;
    yoffset = -(yoffset + offsetToViewY);

    const offsetToViewX = shapeWidth * 0.5;
    // columns have a half-width offset if there are more than 1 rows
    let widthOffset = 0;
    if (this.numRows > 1) {
      // if the dataSize is equal to or larger than the 2*Columns, there is an additional offset needed
      if (dataSize >= this.maxColumnsUsed * 2) {
        widthOffset = 0.5;
      }
    }
    const actualWidthUsed = (this.numColumns + widthOffset) * shapeWidth;
    let xoffset = (this.width - actualWidthUsed) / 2;
    xoffset = -(xoffset + offsetToViewX);
    return { xoffset, yoffset };
  }

  getOffsetsUniform(dataSize: number): any {
    const { diameterX, diameterY } = this.getDiameters();
    const shapeWidth = this.truncateFloat(diameterX);
    const shapeHeight = this.truncateFloat(diameterY);
    const offsetToViewY = shapeHeight * 0.5;
    const actualHeightUsed = this.maxRowsUsed * shapeHeight;
    let yoffset = (this.height - actualHeightUsed) / 2;
    yoffset = -(yoffset + offsetToViewY);
    const offsetToViewX = shapeWidth * 0.5;
    const actualWidthUsed = this.numColumns * shapeWidth;
    let xoffset = (this.width - actualWidthUsed) / 2;
    xoffset = -(xoffset + offsetToViewX);
    return { xoffset, yoffset };
  }

  getOffsetsSquare(dataSize: number): any {
    const { diameterX, diameterY } = this.getDiameters();
    const shapeWidth = this.truncateFloat(diameterX);
    const shapeHeight = this.truncateFloat(diameterY);
    const offsetToViewY = 0; // shapeHeight * 0.5;
    const actualHeightUsed = this.maxRowsUsed * shapeHeight;
    let yoffset = (this.height - actualHeightUsed) / 2;
    yoffset = -(yoffset + offsetToViewY);
    const offsetToViewX = 0; //shapeWidth * 0.5;
    const actualWidthUsed = this.numColumns * shapeWidth;
    let xoffset = (this.width - actualWidthUsed) / 2;
    xoffset = -(xoffset + offsetToViewX);
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

  /**
   * Returns diameterX and diameterY for given shape
   */
  getDiameters(): PolystatDiameters {
    switch (this.shape) {
      case PolygonShapes.HEXAGON_POINTED_TOP:
        return this.getHexFlatTopDiameters();
      case PolygonShapes.SQUARE:
        return this.getUniformDiameters();
      case PolygonShapes.CIRCLE:
        return this.getUniformDiameters();
      default:
        return this.getUniformDiameters();
    }
  }
}
