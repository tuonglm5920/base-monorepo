import { renderHook } from '@testing-library/react';
import { useTimeout } from '../src/useTimeout';

describe('useTimeout', () => {
  // Use fake timers to control setTimeout and clearTimeout
  jest.useFakeTimers();

  it('calls the callback after the specified delay', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    // The callback should have been called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback if the component unmounts before the delay', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    // Unmount the component before the delay period
    unmount();

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    // The callback should not have been called
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call the callback if the delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, null));

    // Fast-forward time by any period
    jest.advanceTimersByTime(1000);

    // The callback should not have been called since the delay was null
    expect(callback).not.toHaveBeenCalled();
  });

  // Restore the real timers after the tests
  afterAll(() => jest.useRealTimers());
});
