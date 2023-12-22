import { renderHook } from '@testing-library/react';
import { useOnce } from '../src/useOnce';

describe('useOnce', () => {
  it('should initialize and return the same value across re-renders', () => {
    const initializer = jest.fn(() => 'initial value');
    const { result, rerender } = renderHook(() => useOnce(initializer));

    // First render
    expect(result.current).toBe('initial value');
    expect(initializer).toHaveBeenCalledTimes(1);

    // Re-render
    rerender();
    expect(result.current).toBe('initial value');
    expect(initializer).toHaveBeenCalledTimes(1); // Still called only once
  });

  it('should work with different data types', () => {
    const initNumber = jest.fn(() => 42);
    const initObject = jest.fn(() => ({ key: 'value' }));

    const { result: numberResult } = renderHook(() => useOnce(initNumber));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() => useOnce(initObject));
    expect(objectResult.current).toEqual({ key: 'value' });
  });
});
