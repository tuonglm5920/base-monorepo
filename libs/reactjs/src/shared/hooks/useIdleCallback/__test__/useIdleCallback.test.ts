import { renderHook } from '@testing-library/react';
import { useIdleCallback, UnsupportedBehavior } from '../src/useIdleCallback';

// Mock requestIdleCallback and requestAnimationFrame if they are not available in the test environment
const mockRequestIdleCallback = jest.fn(cb => {
  const handle = setTimeout(() => cb(), 1);
  return handle;
});
const mockRequestAnimationFrame = jest.fn(cb => {
  const handle = setTimeout(() => cb(), 1);
  return handle;
});

describe('useIdleCallback', () => {
  beforeEach(() => {
    // Setup global mocks
    global.requestIdleCallback = mockRequestIdleCallback as unknown as typeof requestIdleCallback;
    global.requestAnimationFrame = mockRequestAnimationFrame as unknown as typeof requestAnimationFrame;
    jest.useFakeTimers();
  });
  afterEach(() => {
    // Restore the original functions
    global.requestIdleCallback = mockRequestIdleCallback as unknown as typeof requestIdleCallback;
    global.requestAnimationFrame = mockRequestAnimationFrame as unknown as typeof requestAnimationFrame;
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('uses requestIdleCallback when available', () => {
    const callback = jest.fn();
    renderHook(() => useIdleCallback(callback, {}));

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(mockRequestIdleCallback).toHaveBeenCalled();
  });

  it('uses requestAnimationFrame when requestIdleCallback is unsupported and fallback is AnimationFrame', () => {
    const callback = jest.fn();
    // Temporarily remove requestIdleCallback from the global object
    const originalRIC = global.requestIdleCallback;
    // @ts-ignore
    delete global.requestIdleCallback;

    global.requestAnimationFrame = mockRequestAnimationFrame as unknown as typeof requestAnimationFrame;

    renderHook(() => useIdleCallback(callback, { unsupportedBehavior: UnsupportedBehavior.AnimationFrame }));

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(mockRequestAnimationFrame).toHaveBeenCalled();

    // Restore requestIdleCallback
    global.requestIdleCallback = originalRIC;
  });

  it('executes callback immediately when fallback is Immediate', () => {
    const callback = jest.fn();
    // Temporarily remove requestIdleCallback from the global object
    const originalRIC = global.requestIdleCallback;
    // @ts-ignore
    delete global.requestIdleCallback;

    renderHook(() => useIdleCallback(callback, { unsupportedBehavior: UnsupportedBehavior.Immediate }));

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();

    // Restore requestIdleCallback
    global.requestIdleCallback = originalRIC;
  });
});
