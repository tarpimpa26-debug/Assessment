import os
import sys
from squirrel_tree import SquirrelTree


def read_input_file(file_name):
    file_path = os.path.join(os.getcwd(), file_name)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Input file not found: {file_name}")

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read().strip()

    if not content:
        raise ValueError("Input file is empty")

    return content


def parse_input(input_text):
    parts = input_text.split(",", 2)

    if len(parts) != 3:
        raise ValueError("Invalid input format")

    walnut_amount_text = parts[0].strip()
    hole_capacity_text = parts[1].strip()
    serialized_tree = parts[2].strip()

    try:
        walnut_amount = int(walnut_amount_text)
    except ValueError:
        walnut_amount = None

    try:
        hole_capacity = int(hole_capacity_text)
    except ValueError:
        hole_capacity = None

    return walnut_amount, hole_capacity, serialized_tree


def main():
    try:
        if len(sys.argv) < 2:
            print("Usage:")
            print("python src/main.py input2.txt")
            sys.exit(1)

        input_file = sys.argv[1]
        input_text = read_input_file(input_file)

        walnut_amount, hole_capacity, serialized_tree = parse_input(input_text)

        squirrel_tree = SquirrelTree(
            walnut_amount,
            hole_capacity,
            serialized_tree
        )

        result = squirrel_tree.store_walnuts()

        print("Question 2 Output:")

        if isinstance(result, list):
            print(" ".join(result))
        else:
            print(result)

    except Exception as error:
        print(f"Error: {error}")
        sys.exit(1)


if __name__ == "__main__":
    main()