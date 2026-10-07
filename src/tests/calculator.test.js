const { calculate } = require('../calculator');

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
    expect(() => calculate('modulo', 1, 2)).toThrow('Unknown operation');
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
