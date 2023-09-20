# Recursive Calculator

The Recursive Calculator is a complex command-line calculator built with JavaScript. It allows you to perform complex mathematical calculations, manage memory slots, and apply unary operators, making it a versatile tool for various mathematical tasks. Whether you need to solve equations, work with trigonometric functions, or simply perform basic arithmetic operations.

## Features

### 1. Arithmetic Operations

Easily perform basic arithmetic operations, including addition, subtraction, multiplication, and division.

**Usage Example:**

```
CE 5 + 3
```

### 2. Unary Operators

Apply a range of unary operators, such as absolute value, cosine, logarithm, ceiling, floor, sine, round, and exponential functions.

**Usage Example:**

```
CE COS(60)
```

### 3. Memory Management

Create, assign, and retrieve values from memory slots, allowing you to store and reuse results for complex calculations.

**Usage Examples:**

- Create a memory slot: `AM memory1`
- Assign the last result to a memory slot: `AVM memory1`
- Retrieve a value from a memory slot: `VM memory1`

### 4. Complex Expressions

Handle complex mathematical expressions with nested operations and parentheses.

**Usage Example:**

```shell
CE (5 + (2 * 3) + (5 / (2 * 10) 3) * 2
```

### 5. Simple Interactive Command Line

The command-line interface has a simple user experience. Quickly switch between operations and memory management tasks.

**Usage Example:**

Run the calculator and interact with it using commands like `CE`, `AM`, `AVM`, `VM`, `LM`, and more.

## Getting Started

1. Clone the repository to your local machine:

   ```
   https://github.com/joaquim25/Recursive-Calculator-Project.git
   ```

2. Navigate to the project directory:

   ```
   cd Recursive-Calculator-Project
   ```

3. Run the calculator:

   - Open the index.html file on your browser

4. Enter commands and expressions to perform calculations.

## Command List

The calculator recognizes the following commands:

- `VM [memoryName]`: Get the value stored in a specific memory slot.
- `LM`: Display all existing memory slots and their values.
- `CE [expression]`: Calculate the value of a mathematical expression.
- `AVM [memoryName]`: Assign the last result to a memory slot.
- `AM [memoryName]`: Create a new memory slot with the given name.
- `S`: Exit the calculator.
- `A`: Display the help message (Available commands).

## Error Handling

The calculator provides detailed error messages for better user guidance. It handles scenarios such as invalid commands, malformed expressions, and accessing non-existent memory slots.

## Author

Joaquim Luzia
