import { renderHook } from '@testing-library/react';
import { useLatestPropsRef } from '../src/useLatestPropsRef';

describe('useLatestPropsRef', () => {
  it('should update the ref current value when prop changes', () => {
    let prop = 'initial';
    const { result, rerender } = renderHook(() => useLatestPropsRef(prop));

    // Initial value
    expect(result.current.current).toBe('initial');

    // Change the prop and re-render
    prop = 'updated';
    rerender();
    expect(result.current.current).toBe('updated');
  });

  it('should maintain the same ref object across renders', () => {
    let prop = 'initial';
    const { result, rerender } = renderHook(() => useLatestPropsRef(prop));
    const initialRef = result.current;

    // Change the prop and re-render
    prop = 'updated';
    rerender();
    expect(result.current).toBe(initialRef);
  });
});
