class MatrixTurtle {
  constructor(matrix) {
    this.matrix = matrix;
    this.rows = matrix.length;
    this.cols = matrix[0].length;
    this.validateMatrix();
  }

  validateMatrix() {
    if (!Array.isArray(this.matrix) || this.matrix.length === 0) {
      throw new Error("Matrix must not be empty");
    }

    const colSize = this.matrix[0].length;

    for (const row of this.matrix) {
      if (!Array.isArray(row) || row.length !== colSize) {
        throw new Error("Matrix rows must have the same length");
      }
    }
  }

  walkZigZag() {
    const result = [];

    for (let col = 0; col < this.cols; col++) {
      if (col % 2 === 0) {
        for (let row = 0; row < this.rows; row++) {
          result.push(this.matrix[row][col]);
        }
      } else {
        for (let row = this.rows - 1; row >= 0; row--) {
          result.push(this.matrix[row][col]);
        }
      }
    }

    return result;
  }

  walkClockwiseToCenter(startRow, startCol) {
    this.validateCoordinate(startRow, startCol);

    let top = startRow;
    let left = startCol;
    let bottom = this.rows - 1;
    let right = this.cols - 1;

    const result = [];

    while (top <= bottom && left <= right) {
      // ตก
      for (let col = left; col <= right; col++) {
        result.push(this.matrix[top][col]);
      }
      top++;

      // ใต้
      for (let row = top; row <= bottom; row++) {
        result.push(this.matrix[row][right]);
      }
      right--;

      // ตะวันออก
      if (top <= bottom) {
        for (let col = right; col >= left; col--) {
          result.push(this.matrix[bottom][col]);
        }
        bottom--;
      }

      // ไปเหนืแ
      if (left <= right) {
        for (let row = bottom; row >= top; row--) {
          result.push(this.matrix[row][left]);
        }
        left++;
      }
    }

    return result;
  }


  findStraightRoutes(startValue, targetValue) {
    const routes = [];

    const directions = [
      { name: "N", dr: -1, dc: 0 },
      { name: "E", dr: 0, dc: 1 },
      { name: "S", dr: 1, dc: 0 },
      { name: "W", dr: 0, dc: -1 }
    ];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.matrix[row][col] !== startValue) continue;

        for (const dir of directions) {
          const values = [this.matrix[row][col]];

          let currentRow = row + dir.dr;
          let currentCol = col + dir.dc;

          while (this.isInside(currentRow, currentCol)) {
            values.push(this.matrix[currentRow][currentCol]);

            if (this.matrix[currentRow][currentCol] === targetValue) {
              routes.push({
                direction: dir.name,
                values: [...values]
              });
            }

            currentRow += dir.dr;
            currentCol += dir.dc;
          }
        }
      }
    }

    if (routes.length === 0) {
      return "NO ROUTE";
    }

    const uniqueRoutes = [];
    const seen = new Set();

    for (const route of routes) {
      const key = `${route.direction}:${route.values.join(",")}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueRoutes.push(route);
      }
    }

    const shortestLength = Math.min(
      ...uniqueRoutes.map(route => route.values.length)
    );

    const longestLength = Math.max(
      ...uniqueRoutes.map(route => route.values.length)
    );

    const result = [];

    // สั้นสุด
    const shortestRoute = uniqueRoutes.find(route => {
      return route.values.length === shortestLength;
    });

    if (shortestRoute) {
      result.push({
        ...shortestRoute,
        type: "SHORTEST"
      });
    }

    const southRoutes = uniqueRoutes.filter(route => {
      return (
        route.direction === "S" &&
        route.values.length !== shortestLength &&
        route.values.length !== longestLength
      );
    });

    for (const route of southRoutes) {
      result.push({
        ...route,
        type: ""
      });
    }

    //  route ยาวสุดเ
    const longestRoute = uniqueRoutes.find(route => {
      return route.values.length === longestLength;
    });

    if (longestRoute) {
      result.push({
        ...longestRoute,
        type: "LONGEST"
      });
    }

    return result;
  }

  validateCoordinate(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      throw new Error("Coordinate must be integer");
    }

    if (!this.isInside(row, col)) {
      throw new Error("Coordinate is outside matrix");
    }
  }

  isInside(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }
}

module.exports = MatrixTurtle;