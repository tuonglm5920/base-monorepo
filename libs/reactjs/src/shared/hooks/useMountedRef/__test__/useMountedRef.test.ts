import { renderHook, act } from '@testing-library/react';
import { useMountedRef } from '../src/useMountedRef';

describe('useMountedRef', () => {
  it('should return true when the component is mounted', () => {
    const { result } = renderHook(() => useMountedRef());

    // Initially, the component is mounted
    expect(result.current.current).toBe(true);
  });

  it('should return false after the component is unmounted', () => {
    const { result, unmount } = renderHook(() => useMountedRef());

    // The component is still mounted at this point
    expect(result.current.current).toBe(true);

    // Unmount the component
    act(() => {
      unmount();
    });

    // After unmounting, the ref should be false
    expect(result.current.current).toBe(false);
  });
});
