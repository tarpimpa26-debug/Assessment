class TreeNode {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.children = [];
  }
}

class SquirrelTree {
  constructor(walnutAmount, holeCapacity, serializedTree) {
    this.walnutAmount = walnutAmount;
    this.holeCapacity = holeCapacity;
    this.serializedTree = serializedTree;
    this.root = null;
  }

  validateInput() {
    if (!Number.isInteger(this.walnutAmount) || this.walnutAmount <= 0) {
      return "INVALID WALNUT AMOUNT";
    }

    if (!Number.isInteger(this.holeCapacity) || this.holeCapacity <= 0) {
      return "INVALID HOLE CAPACITY";
    }

    if (!this.serializedTree || typeof this.serializedTree !== "string") {
      return "IMPOSSIBLE TREE";
    }

    return null;
  }

  isNodeName(char) {
    return /^[A-Za-z]$/.test(char);
  }

  buildTree() {
    const stack = [];

    for (const char of this.serializedTree) {
      if (this.isNodeName(char)) {
        const node = new TreeNode(char);

        if (!this.root) {
          this.root = node;
          stack.push(node);
          continue;
        }

        if (stack.length === 0) {
          throw new Error("IMPOSSIBLE TREE");
        }

        const parent = stack[stack.length - 1];
        node.parent = parent;
        parent.children.push(node);
        stack.push(node);
      } else if (char === ")") {
        if (stack.length <= 1) {
          throw new Error("IMPOSSIBLE TREE");
        }

        stack.pop();
      } else {
        throw new Error("IMPOSSIBLE TREE");
      }
    }

    if (!this.root || this.root.children.length === 0) {
      throw new Error("IMPOSSIBLE TREE");
    }
  }

  getPath(node) {
    const path = [];
    let current = node;

    while (current) {
      path.push(current.name);
      current = current.parent;
    }

    return path.reverse().join("");
  }

  getHolesByClosestLeftFirst() {
    const holes = [];
    const queue = [...this.root.children];

    while (queue.length > 0) {
      const current = queue.shift();

      holes.push(current);

      for (const child of current.children) {
        queue.push(child);
      }
    }

    return holes;
  }

  storeWalnuts() {
    const inputError = this.validateInput();

    if (inputError) {
      return inputError;
    }

    try {
      this.buildTree();
    } catch (error) {
      return "IMPOSSIBLE TREE";
    }

    const holes = this.getHolesByClosestLeftFirst();
    const totalCapacity = holes.length * this.holeCapacity;

    if (this.walnutAmount > totalCapacity) {
      return "IMPOSSIBLE TREE";
    }

    const result = [];
    let walnutNo = 1;

    for (const hole of holes) {
      const path = this.getPath(hole);

      for (let i = 0; i < this.holeCapacity; i++) {
        if (walnutNo > this.walnutAmount) {
          return result;
        }

        result.push(`${walnutNo}${path}`);
        walnutNo++;
      }
    }

    return result;
  }
}

module.exports = SquirrelTree;