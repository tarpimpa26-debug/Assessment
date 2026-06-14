const fs = require("fs");
const path = require("path");
const MatrixTurtle = require("./MatrixTurtle");

function readInputFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${fileName}`);
  }

  const content = fs.readFileSync(filePath, "utf-8").trim();

  if (!content) {
    throw new Error("Input file is empty");
  }

  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function parseJsonLine(line, label) {
  try {
    return JSON.parse(line);
  } catch (error) {
    throw new Error(`Invalid ${label} format`);
  }
}

function formatArray(values) {
  return values.join(",");
}

function printProblem1(lines) {
  const matrix = parseJsonLine(lines[0], "matrix");
  const turtle = new MatrixTurtle(matrix);

  const result = turtle.walkZigZag();

  console.log("Problem 1.1 Output:");
  console.log(formatArray(result));
}

function printProblem2(lines) {
  if (lines.length < 2) {
    throw new Error("Problem 1.2 requires matrix and coordinate");
  }

  const matrix = parseJsonLine(lines[0], "matrix");
  const coordinate = parseJsonLine(lines[1], "coordinate");

  if (!Array.isArray(coordinate) || coordinate.length !== 2) {
    throw new Error("Coordinate must be [x,y]");
  }

  const [x, y] = coordinate;
  const turtle = new MatrixTurtle(matrix);

  const result = turtle.walkClockwiseToCenter(x, y);

  console.log("Problem 1.2 Output:");
  console.log(formatArray(result));
}

function printProblem3(lines) {
  if (lines.length < 2) {
    throw new Error("Problem 1.3 requires matrix and [startValue,targetValue]");
  }

  const matrix = parseJsonLine(lines[0], "matrix");
  const values = parseJsonLine(lines[1], "start and target values");

  if (!Array.isArray(values) || values.length !== 2) {
    throw new Error("Input must be [startValue,targetValue]");
  }

  const [startValue, targetValue] = values;
  const turtle = new MatrixTurtle(matrix);

  const result = turtle.findStraightRoutes(startValue, targetValue);

  console.log("Problem 1.3 Output:");

  if (result === "NO ROUTE") {
    console.log(result);
    return;
  }

  for (const route of result) {
    const output = `${route.direction} ${formatArray(route.values)}`;

    if (route.type) {
      console.log(`${output} ${route.type}`);
    } else {
      console.log(output);
    }
  }
}

function main() {
  try {
    const problemNumber = process.argv[2];
    const inputFile = process.argv[3];

    if (!problemNumber || !inputFile) {
      console.log("Usage:");
      console.log("node src/index.js 1 input1-1.txt");
      console.log("node src/index.js 2 input1-2.txt");
      console.log("node src/index.js 3 input1-3.txt");
      process.exit(1);
    }

    const lines = readInputFile(inputFile);

    switch (problemNumber) {
      case "1":
        printProblem1(lines);
        break;
      case "2":
        printProblem2(lines);
        break;
      case "3":
        printProblem3(lines);
        break;
      default:
        throw new Error("Problem number must be 1, 2, or 3");
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();