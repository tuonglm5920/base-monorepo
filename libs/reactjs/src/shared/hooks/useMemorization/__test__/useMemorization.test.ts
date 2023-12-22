import { renderHook, act } from '@testing-library/react';
import { useMemorization } from '../src/useMemorization';

describe('useMemorization', () => {
  it('should memorize value based on condition', () => {
    const getValue = jest.fn(() => Math.random());
    const condition = [1];

    const { result, rerender } = renderHook(
      ({ condition }) => useMemorization(getValue, condition, (prev, next) => prev[0] !== next[0]),
      { initialProps: { condition } },
    );

    const firstValue = result.current;

    // Rerender with same condition
    rerender({ condition });
    expect(result.current).toBe(firstValue);
    expect(getValue).toHaveBeenCalledTimes(1);

    // Rerender with different condition
    act(() => {
      rerender({ condition: [2] });
    });

    expect(result.current).not.toBe(firstValue);
    expect(getValue).toHaveBeenCalledTimes(2);
  });
});
