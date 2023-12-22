import { toArray } from '../src/toArray';

describe('toArray function', () => {
  it('should wrap a single element in an array', () => {
    const singleItem = 'test';
    const result = toArray(singleItem);
    expect(result).toEqual(['test']);
  });

  it('should return the same array if the input is already an array', () => {
    const arrayInput = ['test1', 'test2'];
    const result = toArray(arrayInput);
    expect(result).toBe(arrayInput);
  });

  it('should work with different data types', () => {
    const number = 42;
    const object = { key: 'value' };
    const array = [number, object];

    expect(toArray(number)).toEqual([number]);
    expect(toArray(object)).toEqual([object]);
    expect(toArray(array)).toBe(array); // The array should be the same instance
  });
});
