#!/usr/bin/env node
/**
 * Node.js CLI calculator.
 *
 * Usage: node src/calculator.js <operation> <number1> [number2]
 *
 * Supported operations:
 *   add       (+)  Addition:       number1 + number2
 *   subtract  (-)  Subtraction:    number1 - number2
 *   multiply  (*)  Multiplication: number1 * number2
 *   divide    (/)  Division:       number1 / number2 (division by zero is an error)
 *   modulo    (%)  Remainder:      number1 % number2 (division by zero is an error)
 *   power     (^)  Exponentiation: number1 ** number2
 *   sqrt           Square root:    sqrt(number1)
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
  modulo: (a, b) => {
    if (b === 0) {
      throw new Error('Modulo by zero is not allowed.');
    }
    return a % b;
  },
  power: (a, b) => {
    const result = a ** b;
    if (!Number.isFinite(result)) {
      throw new Error('Exponentiation must produce a finite real number.');
    }
    return result;
  },
  sqrt: (a) => {
    if (a < 0) {
      throw new Error('Square root of a negative number is not allowed.');
    }
    return Math.sqrt(a);
  },
};

const aliases = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  x: 'multiply',
  '/': 'divide',
  '%': 'modulo',
  mod: 'modulo',
  '^': 'power',
  '**': 'power',
  pow: 'power',
  exponentiation: 'power',
  exponentiate: 'power',
};
const unaryOperations = new Set(['sqrt']);

function normalizeOperation(operation) {
  return aliases[operation] || operation;
}

function calculate(operation, a, b) {
  const name = normalizeOperation(operation);
  const fn = operations[name];
  if (!fn) {
    throw new Error(`Unknown operation "${operation}". Use: add, subtract, multiply, divide, modulo, power, sqrt.`);
  }
  if (!Number.isFinite(a)) {
    throw new Error('Both operands must be valid numbers.');
  }
  if (unaryOperations.has(name)) {
    if (b !== undefined) {
      throw new Error(`Operation "${name}" takes one operand.`);
    }
  } else if (!Number.isFinite(b)) {
    throw new Error('Both operands must be valid numbers.');
  }
  return fn(a, b);
}

function main(argv) {
  const normalizedOperation = normalizeOperation(argv[0]);
  const expectedLength = unaryOperations.has(normalizedOperation) ? 2 : 3;
  if (argv.length !== expectedLength) {
    console.error('Usage: node src/calculator.js <operation> <number1> [number2]');
    process.exit(1);
  }
  const [operation, a, b] = argv;
  try {
    console.log(calculate(operation, Number(a), b === undefined ? undefined : Number(b)));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
