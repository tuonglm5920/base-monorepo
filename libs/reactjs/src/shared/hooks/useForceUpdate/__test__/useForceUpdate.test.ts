import { renderHook, act } from '@testing-library/react';
import { useForceUpdate } from '../src/useForceUpdate';

describe('useForceUpdate', () => {
  it('causes a component to re-render when the forceUpdate function is called', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++; // Increment render count on each render
      return useForceUpdate();
    });

    expect(renderCount).toBe(1); // Component has rendered once on mount

    act(() => {
      result.current(); // Call the forceUpdate function returned by the hook
    });

    expect(renderCount).toBe(2); // Component should have re-rendered, incrementing the count
  });
});
