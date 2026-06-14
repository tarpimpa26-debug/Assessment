# Question 1 - Walking Matrix Turtle Problem

This project solves Question 1 from the Programming and Algorithm Test.

The program reads input from text files and solves the following problems:

* Problem 1.1: Walk through the matrix in zig-zag direction
* Problem 1.2: Walk clockwise from a given coordinate to the center
* Problem 1.3: Find routes from a starting value to a target value using only N, E, S, W directions without changing direction

## Tech Stack

* NodeJS

## Libraries

No external libraries are used.

This project uses only built-in NodeJS modules:

* `fs` - read input files
* `path` - handle file paths

## Folder Structure

```txt
walking-matrix-turtle/
├─ input1-1.txt
├─ input1-2.txt
├─ input1-3.txt
├─ package.json
├─ package-lock.json
├─ README.md
└─ src/
   ├─ index.js
   └─ MatrixTurtle.js
```

## Input Files

### input1-1.txt

Used for Problem 1.1.

```txt
[[7,2,0,1,0,2,9],[8,4,8,6,9,3,3],[7,8,8,8,9,0,6],[4,7,2,7,0,0,7],[6,5,7,8,0,7,2],[8,1,8,5,4,5,2]]
```

### input1-2.txt

Used for Problem 1.2.

```txt
[[7,2,0,1,0,2,9],[8,4,8,6,9,3,3],[7,8,8,8,9,0,6],[4,7,2,7,0,0,7],[6,5,7,8,0,7,2],[8,1,8,5,4,5,2]]
[1,1]
```

### input1-3.txt

Used for Problem 1.3.

```txt
[[7,2,0,1,0,2,9],[8,4,8,6,9,3,3],[7,8,8,8,9,0,6],[4,7,2,7,0,0,7],[6,5,7,8,0,7,2],[8,1,8,5,4,5,2]]
[2,8]
```

## How to Install

```bash
npm install
```

## How to Run

Run Problem 1.1:

```bash
npm run problem1
```

Run Problem 1.2:

```bash
npm run problem2
```

Run Problem 1.3:

```bash
npm run problem3
```

Or run manually:

```bash
node src/index.js 1 input1-1.txt
node src/index.js 2 input1-2.txt
node src/index.js 3 input1-3.txt
```

## Expected Output

### Problem 1.1

```txt
Problem 1.1 Output:
7,8,7,4,6,8,1,5,7,8,4,2,0,8,8,2,7,8,5,8,7,8,6,1,4,0,0,9,9,0,5,7,0,0,3,2,9,3,6,7,2,2
```

### Problem 1.2

```txt
Problem 1.2 Output:
4,8,6,9,3,3,6,7,2,2,5,4,5,8,1,8,6,4,7,8,8,8,9,0,0,7,0,8,7,5,7,2,7,0
```

### Problem 1.3

```txt
Problem 1.3 Output:
N 2,8 SHORTEST
S 2,4,8
S 2,7,8
W 2,5,4,5,8,1,8 LONGEST
```

## Error Handling

The program handles these cases:

* Input file not found
* Empty input file
* Invalid matrix format
* Invalid coordinate format
* Coordinate outside matrix
* No available route for Problem 1.3

## Note

For Problem 1.2, the sample page shows input `[1,1]`, while the later input file section shows `[2,2]`.

This solution uses `[1,1]` because it matches the sample output shown in the question.
