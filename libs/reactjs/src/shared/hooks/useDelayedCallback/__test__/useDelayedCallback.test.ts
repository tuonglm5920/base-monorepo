import { renderHook, act } from '@testing-library/react';
import { useDelayedCallback } from '../src/useDelayedCallback';

describe('useDelayedCallback', () => {
  // Use fake timers to control setTimeout and clearTimeout
  jest.useFakeTimers();

  it('does not call the callback immediately', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDelayedCallback(callback, 1000));

    const delayedCallback = result.current;
    act(() => {
      delayedCallback();
    });

    // Callback should not have been called immediately
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the callback after the specified delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDelayedCallback(callback, 1000));

    act(() => {
      result.current(); // Set the delayed callback
      jest.advanceTimersByTime(1000); // Advance time by 1000ms
    });

    // Callback should have been called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets the delay if called again before the delay has passed', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDelayedCallback(callback, 1000));

    act(() => {
      const delayedCallback = result.current;
      delayedCallback(); // Call the first time
      jest.advanceTimersByTime(500); // Advance to the point where the first timeout would have triggered
    });

    // Callback should not have been called yet because we reset the timer
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500); // Advance the remaining time to trigger the reset timeout
    });

    // Now the callback should have been called once
    expect(callback).toHaveBeenCalledTimes(1);
  });

  // Restore the real timers after all tests are done
  afterAll(() => jest.useRealTimers());
});
