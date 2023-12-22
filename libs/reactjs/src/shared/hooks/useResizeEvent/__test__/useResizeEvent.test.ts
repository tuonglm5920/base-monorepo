import { renderHook, act } from '@testing-library/react';
import { useResizeEvent } from '../src/useResizeEvent';

describe('useResizeEvent', () => {
  it('should call effect on window resize', () => {
    const mockEffect = jest.fn();

    // Render the hook with the mock effect
    renderHook(() => useResizeEvent(mockEffect));

    // Mock window resize
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Expect the effect to have been called
    expect(mockEffect).toHaveBeenCalled();
  });
});
