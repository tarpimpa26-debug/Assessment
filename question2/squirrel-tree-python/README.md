# Question 2 - Squirrel Tree Problem

This project solves Question 2 from the Programming and Algorithm Test using Python.

The program simulates a squirrel storing walnuts in holes on a tree.

The squirrel stores walnuts by following these rules:

* All walnuts start from the root node
* The squirrel can carry only one walnut per trip
* The squirrel stores walnuts in the closest hole first
* If holes are on the same level, the squirrel chooses the left branch first
* After storing one walnut, the squirrel returns to the root node
* Each hole can store up to the given capacity

## Tech Stack

* Python 3

## Libraries

No external libraries are used.

This project uses only built-in Python modules:

* `os` - handle file paths
* `sys` - read command-line arguments and exit program

## Folder Structure

```txt
squirrel-tree-python/
├─ input2.txt
├─ README.md
└─ src/
   ├─ main.py
   └─ squirrel_tree.py
```

## Input Format

```txt
walnutAmount,holeCapacity,serializedTree
```

Example:

```txt
25,3,ABEG)H)))C)DFIK)L))JM
```

Explanation:

* `25` = total walnuts
* `3` = capacity of each hole
* `ABEG)H)))C)DFIK)L))JM` = serialized tree structure

## How to Run

Go to the project folder:

```bash
cd question2/squirrel-tree-python
```

Run the program:

```bash
python src/main.py input2.txt
```

If the machine uses the Python launcher, run:

```bash
py src/main.py input2.txt
```

Or on some machines:

```bash
python3 src/main.py input2.txt
```

## Expected Output

```txt
Question 2 Output:
1AB 2AB 3AB 4AC 5AC 6AC 7AD 8AD 9AD 10ABE 11ABE 12ABE 13ADF 14ADF 15ADF 16ABEG 17ABEG 18ABEG 19ABEH 20ABEH 21ABEH 22ADFI 23ADFI 24ADFI 25ADFJ
```

## Error Handling

If the input tree is impossible, the program displays:

```txt
IMPOSSIBLE TREE
```

If the walnut amount is invalid, the program displays:

```txt
INVALID WALNUT AMOUNT
```

If the hole capacity is invalid, the program displays:

```txt
INVALID HOLE CAPACITY
```

## Note

The sample output in the document appears to repeat walnut number `17` twice:

```txt
17ABEG 17ABEG
```

This solution uses the correct incremental walnut number:

```txt
16ABEG 17ABEG 18ABEG
```
