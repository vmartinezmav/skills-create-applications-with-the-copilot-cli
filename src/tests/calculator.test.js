const { spawnSync } = require('child_process');
const path = require('path');
const { calculate, squareRoot } = require('../calculator');

describe('addition', () => {
  test('2 + 3 = 5', () => expect(calculate('add', 2, 3)).toBe(5));
  test('negative numbers', () => expect(calculate('add', -2, -3)).toBe(-5));
  test('mixed signs', () => expect(calculate('add', -2, 5)).toBe(3));
  test('decimals', () => expect(calculate('add', 0.5, 0.25)).toBe(0.75));
  test('adding zero', () => expect(calculate('add', 7, 0)).toBe(7));
  test('+ alias', () => expect(calculate('+', 2, 3)).toBe(5));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(calculate('subtract', 10, 4)).toBe(6));
  test('result is negative', () => expect(calculate('subtract', 4, 10)).toBe(-6));
  test('negative operands', () => expect(calculate('subtract', -4, -10)).toBe(6));
  test('decimals', () => expect(calculate('subtract', 1.5, 0.5)).toBe(1));
  test('- alias', () => expect(calculate('-', 10, 4)).toBe(6));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(calculate('multiply', 45, 2)).toBe(90));
  test('by zero', () => expect(calculate('multiply', 5, 0)).toBe(0));
  test('negative result', () => expect(calculate('multiply', -3, 4)).toBe(-12));
  test('two negatives', () => expect(calculate('multiply', -3, -4)).toBe(12));
  test('decimals', () => expect(calculate('multiply', 2.5, 4)).toBe(10));
  test('* and x aliases', () => {
    expect(calculate('*', 45, 2)).toBe(90);
    expect(calculate('x', 45, 2)).toBe(90);
  });
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(calculate('divide', 20, 5)).toBe(4));
  test('non-integer result', () => expect(calculate('divide', 1, 4)).toBe(0.25));
  test('negative result', () => expect(calculate('divide', -10, 2)).toBe(-5));
  test('zero numerator', () => expect(calculate('divide', 0, 5)).toBe(0));
  test('/ alias', () => expect(calculate('/', 20, 5)).toBe(4));
  test('division by zero throws', () => {
    expect(() => calculate('divide', 10, 0)).toThrow('Division by zero');
  });
  test('0 / 0 throws', () => {
    expect(() => calculate('divide', 0, 0)).toThrow('Division by zero');
  });
});

describe('invalid input', () => {
  test('unknown operation', () => {
    expect(() => calculate('foo', 1, 2)).toThrow('Unknown operation');
  });
  test('NaN operand', () => {
    expect(() => calculate('add', NaN, 2)).toThrow('valid numbers');
  });
  test('Infinity operand', () => {
    expect(() => calculate('add', 1, Infinity)).toThrow('valid numbers');
  });
});

describe('CLI', () => {
  const { spawnSync } = require('child_process');
  const path = require('path');
  const run = (...args) =>
    spawnSync('node', [path.join(__dirname, '..', 'calculator.js'), ...args], { encoding: 'utf8' });

  test('prints result', () => {
    const r = run('add', '2', '3');
    expect(r.stdout.trim()).toBe('5');
    expect(r.status).toBe(0);
  });
  test('division by zero exits with error', () => {
    const r = run('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Division by zero');
  });
  test('non-numeric input exits with error', () => {
    const r = run('add', 'a', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('valid numbers');
  });
  test('wrong argument count prints usage', () => {
    const r = run('add', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Usage');
  });
});

describe('modulo', () => {
  test('5 % 2 = 1', () => expect(calculate('modulo', 5, 2)).toBe(1));
  test('evenly divisible', () => expect(calculate('modulo', 10, 5)).toBe(0));
  test('dividend smaller than divisor', () => expect(calculate('modulo', 2, 5)).toBe(2));
  test('negative dividend keeps sign', () => expect(calculate('modulo', -5, 3)).toBe(-2));
  test('decimals', () => expect(calculate('modulo', 5.5, 2)).toBe(1.5));
  test('% alias', () => expect(calculate('%', 5, 2)).toBe(1));
  test('modulo by zero throws', () => {
    expect(() => calculate('modulo', 5, 0)).toThrow('Modulo by zero');
  });
});

describe('power', () => {
  test('2 ^ 3 = 8', () => expect(calculate('power', 2, 3)).toBe(8));
  test('exponent of zero', () => expect(calculate('power', 5, 0)).toBe(1));
  test('exponent of one', () => expect(calculate('power', 7, 1)).toBe(7));
  test('negative exponent', () => expect(calculate('power', 2, -2)).toBe(0.25));
  test('fractional exponent', () => expect(calculate('power', 9, 0.5)).toBe(3));
  test('negative base, odd exponent', () => expect(calculate('power', -2, 3)).toBe(-8));
  test('zero to the zero', () => expect(calculate('power', 0, 0)).toBe(1));
  test('^ alias', () => expect(calculate('^', 2, 3)).toBe(8));
});

describe('square root', () => {
  test('sqrt of 16 = 4', () => expect(calculate('sqrt', 16)).toBe(4));
  test('sqrt of 0 = 0', () => expect(calculate('sqrt', 0)).toBe(0));
  test('sqrt of 1 = 1', () => expect(calculate('sqrt', 1)).toBe(1));
  test('non-perfect square', () => expect(calculate('sqrt', 2)).toBeCloseTo(1.41421356, 7));
  test('decimal input', () => expect(calculate('sqrt', 0.25)).toBe(0.5));
  test('negative number throws', () => {
    expect(() => calculate('sqrt', -1)).toThrow('negative');
  });
  test('NaN operand throws', () => {
    expect(() => calculate('sqrt', NaN)).toThrow('valid number');
  });
  test('squareRoot function export', () => {
    expect(squareRoot(9)).toBe(3);
    expect(() => squareRoot(-9)).toThrow('negative');
  });
});

describe('extended operations via CLI', () => {
  const cli = (...args) =>
    spawnSync('node', [path.join(__dirname, '..', 'calculator.js'), ...args], { encoding: 'utf8' });

  test('modulo 5 2', () => expect(cli('modulo', '5', '2').stdout.trim()).toBe('1'));
  test('power 2 3', () => expect(cli('power', '2', '3').stdout.trim()).toBe('8'));
  test('sqrt 16', () => expect(cli('sqrt', '16').stdout.trim()).toBe('4'));
  test('sqrt -1 exits with error', () => {
    const r = cli('sqrt', '-1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('negative');
  });
  test('modulo by zero exits with error', () => {
    const r = cli('modulo', '5', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Modulo by zero');
  });
  test('sqrt with extra operand prints usage', () => {
    const r = cli('sqrt', '4', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Usage');
  });
});
