#!/usr/bin/env node
/**
 * Node.js CLI calculator.
 *
 * Usage: node src/calculator.js <operation> <number1> <number2>
 *
 * Supported operations:
 *   add       (+)  Addition:       number1 + number2
 *   subtract  (-)  Subtraction:    number1 - number2
 *   multiply  (*)  Multiplication: number1 * number2
 *   divide    (/)  Division:       number1 / number2 (division by zero is an error)
 *
 * Example: node src/calculator.js add 2 3   -> 5
 */

const operations = {
  // Addition
  add: (a, b) => a + b,
  // Subtraction
  subtract: (a, b) => a - b,
  // Multiplication
  multiply: (a, b) => a * b,
  // Division
  divide: (a, b) => {
    if (b === 0) {
      throw new Error('Division by zero is not allowed.');
    }
    return a / b;
  },
};

const aliases = { '+': 'add', '-': 'subtract', '*': 'multiply', x: 'multiply', '/': 'divide' };

function calculate(operation, a, b) {
  const name = aliases[operation] || operation;
  const fn = operations[name];
  if (!fn) {
    throw new Error(`Unknown operation "${operation}". Use: add, subtract, multiply, divide.`);
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Both operands must be valid numbers.');
  }
  return fn(a, b);
}

function main(argv) {
  if (argv.length !== 3) {
    console.error('Usage: node src/calculator.js <add|subtract|multiply|divide> <number1> <number2>');
    process.exit(1);
  }
  const [operation, a, b] = argv;
  try {
    console.log(calculate(operation, Number(a), Number(b)));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
