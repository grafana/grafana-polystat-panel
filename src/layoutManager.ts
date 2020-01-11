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
    //this.radius = this.getRadius(shape);
  }

  /**
   * Sets the radius to be used in all layout calculations
   *
   * @param radius user defined value
   */
  setRadius(radius: number) {
    this.radius = radius;
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
    //The maximum radius the hexagons can have to still fit the screen
    // With (long) radius being R:
    // - Total width (rows > 1) = 1 small radius (sqrt(3) * R / 2) + columns * small diameter (sqrt(3) * R)
    // - Total height = 1 pointy top (1/2 * R) + rows * size of the rest (3/2 * R)
    const radiusFromWidth = (2 * this.width) / (Math.sqrt(3) * (1 + 2 * this.maxColumnsUsed));
    const radiusFromHeight = (2 * this.height) / (3 * this.maxRowsUsed + 1);
    if (radiusFromWidth < radiusFromHeight) {
      return radiusFromWidth;
    }
    return radiusFromHeight;
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
        return [radius * column * 1.75, radius * row * 1.5];
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

  getOffsets(dataSize: number): any {
    // d3 calculates the radius for x and y separately based on the value passed in
    const diameterX = this.radius * Math.sqrt(3);
    const diameterY = this.radius * 2;
    let renderWidth = this.maxColumnsUsed * diameterX;
    // Even rows are shifted by an x-radius (half x-diameter) on the right
    // Check if at least one even row is full (first one is row 2)
    if (this.maxRowsUsed >= 2 && dataSize >= 2 * this.maxColumnsUsed) {
      renderWidth += diameterX / 2;
    }
    // The space taken by 1 row of hexagons is 3/4 of its height (all minus pointy bottom)
    // At then end we need to add the pointy bottom of the last row (1/4 of the height)
    const renderHeight = (this.maxRowsUsed * 0.75 + 0.25) * diameterY;
    // Translate the whole hexagons graph to have it cenetered in the drawing area
    // - center the rendered area with the drawing area, translate by:
    //     ((width - renderWidth) / 2, (height - renderHeight) / 2)
    // - go to the center of the first hexagon, translate by:
    //     (diameterX / 2, diameterY / 2)
    //const xoffset = (this.width - renderWidth + diameterX) / 2;
    const xoffset = (this.width - renderWidth + diameterX) / 2;
    const yoffset = (this.height - renderHeight + diameterY) / 2;
    return { xoffset, yoffset };
  }

  getDiameters(): any {
    // d3 calculates the radius for x and y separately based on the value passed in
    const diameterX = this.radius * Math.sqrt(3);
    const diameterY = this.radius * 2;
    return { diameterX, diameterY };
  }
}
