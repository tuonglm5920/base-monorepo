import { renderHook } from '@testing-library/react';
import { useInterval } from '../src/useInterval';

describe('useInterval', () => {
  // Use fake timers to control setInterval and clearInterval
  jest.useFakeTimers();

  it('calls the callback at the specified interval', () => {
    const callback = jest.fn();

    // Render the hook with the callback and delay
    renderHook(() => useInterval(callback, 1000));

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    // The callback should have been called once
    expect(callback).toHaveBeenCalledTimes(1);

    // Fast-forward time by another 5 seconds
    jest.advanceTimersByTime(5000);

    // The callback should have been called 5 more times (total 6 times)
    expect(callback).toHaveBeenCalledTimes(6);
  });

  it('does not call the callback when delay is null', () => {
    const callback = jest.fn();

    // Render the hook with the callback and null delay
    renderHook(() => useInterval(callback, null));

    // Try to advance timers
    jest.advanceTimersByTime(5000);

    // The callback should not have been called
    expect(callback).not.toHaveBeenCalled();
  });

  // Restore the real timers
  afterAll(() => jest.useRealTimers());
});
