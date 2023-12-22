import { interpolate } from '../src/interpolate';

describe('interpolate function', () => {
  it('correctly interpolates values with linear progression', () => {
    const result = interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
      value: 0.5,
    });
    expect(result).toBe(50);
  });

  it('applies spring easing function correctly', () => {
    const result = interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
      value: 0.5,
      easing: interpolate.easings.spring,
    });
    // Expected result should be calculated based on the spring function
    expect(result).toBeCloseTo(interpolate.easings.spring(0.5) * 100, 5);
  });

  it('applies spring easing function with reverseEasing correctly', () => {
    const result = interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
      value: 0.5,
      easing: interpolate.easings.spring,
      reverseEasing: true,
    });
    // Adjust the expected result based on how reverseEasing modifies the spring function's output
    const reversedResult = 100 - interpolate.easings.spring(0.5) * 100;
    expect(result).toBeCloseTo(reversedResult, 5);
  });
});
