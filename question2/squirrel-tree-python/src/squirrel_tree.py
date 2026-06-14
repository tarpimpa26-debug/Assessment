class TreeNode:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.children = []


class SquirrelTree:
    def __init__(self, walnut_amount, hole_capacity, serialized_tree):
        self.walnut_amount = walnut_amount
        self.hole_capacity = hole_capacity
        self.serialized_tree = serialized_tree
        self.root = None

    def validate_input(self):
        if not isinstance(self.walnut_amount, int) or self.walnut_amount <= 0:
            return "INVALID WALNUT AMOUNT"

        if not isinstance(self.hole_capacity, int) or self.hole_capacity <= 0:
            return "INVALID HOLE CAPACITY"

        if not self.serialized_tree or not isinstance(self.serialized_tree, str):
            return "IMPOSSIBLE TREE"

        return None

    def is_node_name(self, char):
        return char.isalpha() and len(char) == 1

    def build_tree(self):
        stack = []

        for char in self.serialized_tree:
            if self.is_node_name(char):
                node = TreeNode(char)

                if self.root is None:
                    self.root = node
                    stack.append(node)
                    continue

                if len(stack) == 0:
                    raise ValueError("IMPOSSIBLE TREE")

                parent = stack[-1]
                node.parent = parent
                parent.children.append(node)
                stack.append(node)

            elif char == ")":
                if len(stack) <= 1:
                    raise ValueError("IMPOSSIBLE TREE")

                stack.pop()

            else:
                raise ValueError("IMPOSSIBLE TREE")

        if self.root is None or len(self.root.children) == 0:
            raise ValueError("IMPOSSIBLE TREE")

    def get_path(self, node):
        path = []
        current = node

        while current is not None:
            path.append(current.name)
            current = current.parent

        return "".join(reversed(path))

    def get_holes_by_closest_left_first(self):
        holes = []
        queue = list(self.root.children)

        while len(queue) > 0:
            current = queue.pop(0)

            holes.append(current)

            for child in current.children:
                queue.append(child)

        return holes

    def store_walnuts(self):
        input_error = self.validate_input()

        if input_error:
            return input_error

        try:
            self.build_tree()
        except ValueError:
            return "IMPOSSIBLE TREE"

        holes = self.get_holes_by_closest_left_first()
        total_capacity = len(holes) * self.hole_capacity

        if self.walnut_amount > total_capacity:
            return "IMPOSSIBLE TREE"

        result = []
        walnut_no = 1

        for hole in holes:
            path = self.get_path(hole)

            for _ in range(self.hole_capacity):
                if walnut_no > self.walnut_amount:
                    return result

                result.append(f"{walnut_no}{path}")
                walnut_no += 1

        return result