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
 *   modulo    (%)  Remainder:      number1 % number2 (modulo by zero is an error)
 *   power     (^)  Exponentiation: number1 ** number2
 *   sqrt           Square root:    sqrt number1 (negative input is an error)
 *
 * Example: node src/calculator.js add 2 3   -> 5
 */

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }
  return Math.sqrt(n);
}

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
  modulo,
  power,
  sqrt: squareRoot,
};

const aliases = { '+': 'add', '-': 'subtract', '*': 'multiply', x: 'multiply', '/': 'divide', '%': 'modulo', '^': 'power' };

function calculate(operation, a, b) {
  const name = aliases[operation] || operation;
  const fn = operations[name];
  if (!fn) {
    throw new Error(`Unknown operation "${operation}". Use: add, subtract, multiply, divide, modulo, power, sqrt.`);
  }
  if (name === 'sqrt') {
    if (!Number.isFinite(a)) {
      throw new Error('Operand must be a valid number.');
    }
    return fn(a);
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Both operands must be valid numbers.');
  }
  return fn(a, b);
}

function main(argv) {
  const isSqrt = argv[0] === 'sqrt';
  if (argv.length !== (isSqrt ? 2 : 3)) {
    console.error('Usage: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <number1> <number2>\n       node src/calculator.js sqrt <number>');
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

module.exports = { calculate, modulo, power, squareRoot };
