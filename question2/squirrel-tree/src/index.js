const fs = require("fs");
const path = require("path");
const SquirrelTree = require("./SquirrelTree");

function readInputFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${fileName}`);
  }

  const content = fs.readFileSync(filePath, "utf-8").trim();

  if (!content) {
    throw new Error("Input file is empty");
  }

  return content;
}

function parseInput(input) {
  const firstCommaIndex = input.indexOf(",");
  const secondCommaIndex = input.indexOf(",", firstCommaIndex + 1);

  if (firstCommaIndex === -1 || secondCommaIndex === -1) {
    throw new Error("Invalid input format");
  }

  const walnutAmountText = input.slice(0, firstCommaIndex).trim();
  const holeCapacityText = input
    .slice(firstCommaIndex + 1, secondCommaIndex)
    .trim();
  const serializedTree = input.slice(secondCommaIndex + 1).trim();

  const walnutAmount = Number(walnutAmountText);
  const holeCapacity = Number(holeCapacityText);

  return {
    walnutAmount,
    holeCapacity,
    serializedTree
  };
}

function main() {
  try {
    const inputFile = process.argv[2];

    if (!inputFile) {
      console.log("Usage:");
      console.log("node src/index.js input2.txt");
      process.exit(1);
    }

    const input = readInputFile(inputFile);
    const { walnutAmount, holeCapacity, serializedTree } = parseInput(input);

    const squirrelTree = new SquirrelTree(
      walnutAmount,
      holeCapacity,
      serializedTree
    );

    const result = squirrelTree.storeWalnuts();

    console.log("Question 2 Output:");

    if (Array.isArray(result)) {
      console.log(result.join(" "));
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();